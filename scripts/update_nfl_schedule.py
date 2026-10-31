#!/usr/bin/env python3
"""Refresh the public NFL schedule snapshot used by the static site."""

import csv
import io
import json
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

SOURCE_URL = "https://github.com/nflverse/nflverse-data/releases/download/schedules/games.csv"
RELEASE_URL = "https://github.com/nflverse/nflverse-data/releases/tag/schedules"
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "nfl-schedule.json"


def score(value):
    value = (value or "").strip()
    if not value:
        return None
    try:
        return int(float(value))
    except ValueError:
        return None


def main():
    request = urllib.request.Request(SOURCE_URL, headers={"User-Agent": "JKSPORTSBOOK schedule refresh"})
    with urllib.request.urlopen(request, timeout=30) as response:
        rows = list(csv.DictReader(io.TextIOWrapper(response, encoding="utf-8")))

    current_year = datetime.now(timezone.utc).year
    seasons = [int(row["season"]) for row in rows if row.get("season", "").isdigit()]
    season = current_year if current_year in seasons else max(seasons)
    games = []
    for row in rows:
        if row.get("season") != str(season):
            continue
        away_score = score(row.get("away_score"))
        home_score = score(row.get("home_score"))
        games.append({
            "id": row.get("game_id", ""),
            "season": season,
            "week": row.get("week", ""),
            "gameType": row.get("game_type", ""),
            "date": row.get("gameday", ""),
            "weekday": row.get("weekday", ""),
            "time": row.get("gametime", ""),
            "awayTeam": row.get("away_team", ""),
            "homeTeam": row.get("home_team", ""),
            "awayScore": away_score,
            "homeScore": home_score,
            "completed": away_score is not None and home_score is not None,
        })

    payload = {
        "source": "nflverse",
        "sourceUrl": RELEASE_URL,
        "season": season,
        "updatedAt": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "games": games,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(games)} games for {season} to {OUTPUT}")


if __name__ == "__main__":
    main()
