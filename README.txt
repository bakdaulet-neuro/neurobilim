Neuro Bilim — progress sync across devices

Replace these two files in the root of the GitHub repository:
- app.js
- index.html

What changes:
- lesson progress is still cached locally;
- inside Telegram, progress is also saved to Telegram CloudStorage;
- the same Telegram account can restore progress on another phone/device;
- existing old local progress is migrated to cloud when the UPDATED Mini App
  is opened on the old device at least once.

Important migration order:
1. First open the UPDATED Mini App on the old phone where the progress still exists.
2. Wait a few seconds.
3. Then open it on the second phone using the SAME Telegram account.
