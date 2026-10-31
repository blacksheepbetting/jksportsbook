# JKSPORTSBOOK Publishing Desk

The dashboard is scaffolded at /admin/ and writes editorial changes to content/editor.json.

Before publishing, replace REPLACE_WITH_DECAP_TURBO_SITE_ID in config.yml with the site ID from Decap Turbo. Decap Turbo provides the private sign-in and GitHub connection; the site ID is the only value that belongs in this repository.

The public site remains static and keeps the launch content in content/site.js as a fallback. The editor layer applies approved ticker, podcast, Radar, story, pick, and results changes on top of it.
