# Q-Cubic — final website

This folder contains the current website and local dashboard. Older versions and unused assets are stored separately in the workspace backups folder.

## Open
Double-click **Start Website.cmd** and keep its window open.
- Website: http://127.0.0.1:4180/
- Dashboard: http://127.0.0.1:4180/admin/

## Files
- index.html: homepage.
- work.html: portfolio page.
- src/: current sections, styles, media, content, Company pages and Blog articles.
- admin/: local editing dashboard.
- serve.cjs: local server and video streaming.
- studio-api.cjs: saves dashboard edits and uploads.
- contact-api.cjs: contact delivery integration.
- Start Website.cmd: Windows launcher.
- build.cjs and package.json: build and run commands.
- dist/: generated public website; refresh with `node build.cjs` after editing.
- CONTENT-STUDIO.md: editing and future online CMS setup.
- CONTACT-DELIVERY.md: email service setup.

## Connection status
Editing currently saves locally. Online hosting, authenticated online editing and email-provider credentials are not configured. The contact form opens an email draft when direct delivery is unavailable. Drive source links are references, not automatic video imports.

## Backups
Preserve src/studio/content.json and src/studio/uploads when backing up your edits. The editor creates content.json.previous on save for recovery; that file is excluded from public builds.
