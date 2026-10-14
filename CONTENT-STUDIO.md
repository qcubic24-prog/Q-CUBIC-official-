# Q-Cubic: editing and hosting guide

## Open your dashboard

1. Double-click Start Website.cmd in this website folder. Keep its window open.
2. Open http://127.0.0.1:4180/ and choose Dashboard in the footer, or open http://127.0.0.1:4180/admin/ directly.
3. The editing dashboard opens separately from the public website. The Work page is http://127.0.0.1:4180/work.html .

This version is local to your computer. It has no online login yet. A hidden link is not password protection; do not expose this local server on the internet.

## Add a new customer's website

1. Choose Add project.
2. Enter a project title and description.
3. Choose Websites or Applications as the category.
4. Paste the complete HTTPS link into Live website link.
5. Optionally upload a cover image. Without one, a designed text cover is shown. Pasting a link does not automatically capture a screenshot or copy that website.
6. Tick Visible on website and choose Save to website.
7. Refresh the public website or Work page. Your project appears in the portfolio; website/application links also appear in the website-development section.

Use only customer names, screenshots and projects you have permission to display. This is a public portfolio, not a private customer database.

## Add or replace posters and videos

- Add a project, choose the category, and upload a cover image (JPG, PNG or WebP; up to 8 MB).
- Upload a project video as MP4 (up to 60 MB). The project preview opens a video player.
- Replace artwork by uploading another image. Remove image or Remove video clears that item from the project after saving. The source file is retained locally.
- Untick Visible on website to hide a project without losing it. Use Up/Down to reorder or Remove to remove its entry, then save.
- Use browser-compatible H.264 MP4 files. The upload does not transcode or sharpen footage. Scroll backgrounds work best with short, seek-optimized clips; long, heavily compressed videos can be slower to scrub.
- These controls replace complete media files. To remove an object, cut a scene, or change text embedded in an image, edit the media in your design/video application and upload the finished replacement.

## Replace background videos

Open Background videos. Choose Homepage clouds, AI filmmaking, or Gaming & animation, upload an MP4, and save. Refresh the website. Restore original video returns that section to its approved footage after saving. The existing section text and layout remain in place. Different aspect ratios will be cropped to fit.

The homepage ambience has no visible off switch. It runs automatically while visible, subject to browser playback restrictions, and pauses when offscreen or the tab is hidden to save resources.

## Edit text

Open Website content, change the heading or description, and save. Existing open public pages need a refresh to fetch the newly saved content. No code changes are required for these content edits.

## One domain, two interfaces

Recommended production arrangement (example addresses, not registered domains):

- your-domain.com: public website and Work page.
- studio.your-domain.com: authenticated admin dashboard.

These are one brand and one main domain, with two connected deployments. A /admin path on the main domain is also possible with appropriate routing, authentication and API protection. You do not need to buy a second domain.

## Recommended online setup

1. Choose your domain and create hosting/CMS accounts under your ownership.
2. Host the public static site on Netlify (or equivalent), connect the domain and enable HTTPS. The current build is made with node build.cjs, and dist is the public folder. Hosting only dist publishes the public site, not the local editor API.
3. Create a Sanity project and Studio, invite only the permitted editors, and deploy the Studio to its hosted address or studio.your-domain.com. Studio authentication protects editing; public content must never contain a write token.
4. Implement the CMS content types matching this local editor: projects, images, video files, website links, visibility/order, section text, and background selections. Migrate the current content and media.
5. Connect the public site's content loader and media URLs to the CMS. Connect the Dashboard link to the authenticated Studio. This integration is still required; the local JSON-file API cannot be hosted unchanged on a static site.
6. Test login, image/video uploads, publish, hide, reorder and restore on a preview deployment. Configure media storage/CDN delivery and video optimization for larger files.
7. Publish the public website. With runtime CMS fetching, published changes appear on the next page load subject to caching. If static generation is chosen instead, configure a publish-triggered rebuild.

No CMS project or authenticated online deployment has been created yet. Owner account access, domain choice and the CMS connection are the remaining production steps. Never put CMS write credentials in the frontend or send account passwords in chat.

Official references:
- https://www.sanity.io/docs/studio/deployment
- https://www.sanity.io/docs/content-lake/http-auth
- https://docs.netlify.com/manage/domains/domains-fundamentals/understand-domains/

## Backups and delivery

Back up this entire folder, including src/studio/content.json and src/studio/uploads. The previous saved content is retained as content.json.previous. The build excludes backup files. Run node build.cjs after local edits to refresh dist before a static upload. The complete ZIP includes the local editor and server; dist is public-only.

## Expanded editor (October 13)

Social profiles: Instagram, YouTube, LinkedIn, Facebook, TikTok, X, Pinterest and optional Behance. Blank profiles are hidden. Supplied accounts are added below service sections, contact and the shared footer.

Each project supports artwork, uploaded MP4, title, category, description, client/brand, year, services delivered, live website and Instagram links. Hide, remove and reorder projects in Projects & media. Save to website, then refresh the preview. Uploaded poster pixels cannot be rewritten here: edit the source artwork and upload its replacement.

Website content includes service headings, descriptions, service labels, graphic-design text, homepage introduction, film/gaming captions, contact introduction and footer text. This is a content editor, not a visual layout or source-code editor; company-page articles and legal drafts remain file-based.

## Google Drive and video playback

An ordinary Google Drive share/preview link does not provide a reliable direct MP4 stream for a branded HTML video player. The Drive embed shows Google's player UI. The supported options here are an uploaded MP4 or a public HTTPS URL ending in .mp4 from video hosting/CDN storage. A hosted URL takes priority over the uploaded clip. The host must permit browser playback and seeking.

The Google Drive source field keeps a reference for a future import workflow; it does not automatically import or stream the file. Content JSON is public, so enter only links intended to be public, never private credentials or confidential source links.

Recommended future integration: select a Drive file in a protected dashboard, have the server import it through Google's authenticated Drive API, optimize/store the video on video hosting, then publish its playback URL. Visitors stay in Q-Cubic's player. Account connection, storage and import processing are not yet configured. Drive API reference: https://developers.google.com/workspace/drive/api/guides/manage-downloads
