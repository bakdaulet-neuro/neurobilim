# NeuroBilim — blue edition

Open `index.html` in a browser, or upload all five files in this folder to your existing static hosting. No installation or build step is needed. Keep the files together.

## Included

- Original page layout, card geometry, navigation and responsive structure retained from https://bakdaulet-neuro.github.io/neurobilim/.
- Professional blue palette, bilingual Kazakh/Russian copy, five AI lessons.
- Video section, introductory notes, key concepts, practical task, supporting text materials and completion button in every lesson.
- Language switching preserves the current page. Progress is stored separately for each course in this browser. Original `completedLessons` progress is imported on the same browser and origin.

## Edit or add courses

Edit `courses.js`. Add an object to the `courses` array with a unique `id`, `kk` and `ru` title/description, and a `lessons` array. Each lesson has a stable numeric `id`, optional `duration`, `videoUrl`, and `kk`/`ru` content containing `title`, `notes`, `concepts`, `task` and `materials`.

Use simple course IDs such as `ai-basics` or `text-tools` (letters, numbers and hyphens). Do not change existing course/lesson IDs after learners begin: progress uses those IDs. The home page renders added courses automatically and computes progress from their lesson counts.

Set `videoUrl` to an HTTPS video page link. It opens in a new tab. No video was supplied, so the default is `null` and the interface clearly says the video is coming soon. Supporting materials accept `{title, text}` for inline templates or `{title, url}` for HTTPS links to PDFs, documents or other resources. Introductory notes and exercises are editable starter content.

## Storage and Telegram

Progress and language are local to the browser and site address; they are not synchronized across devices or authenticated accounts. The Telegram SDK integration is retained. Opening the ZIP locally does not transfer progress from your hosted site. When browser storage is unavailable, the app remains usable for the current session.

## Verification

JavaScript syntax and executable render/state checks passed for both languages, all five lessons and sections, language switching without losing the current page, completion/undo, reload persistence, separate progress for an added course, 100% completion, final lesson navigation, profile, legacy migration and invalid/unavailable storage. A visual browser/device check was not performed.
