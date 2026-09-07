(() => {
  const webApp = window.Telegram?.WebApp;
  const CLOUD_KEY = "neurobilim_progress_v2";
  const LOCAL_PROGRESS_KEY = "neurobilimProgress";
  const LOCAL_UPDATED_KEY = "neurobilimProgressUpdatedAt";

  const syncStatus = {
    supported: Boolean(
      webApp?.CloudStorage &&
      typeof webApp.CloudStorage.getItem === "function" &&
      typeof webApp.CloudStorage.setItem === "function"
    ),
    loaded: false,
    saved: false,
    error: null
  };

  window.NeuroBilimProgressSync = syncStatus;

  function getLocalUpdatedAt() {
    try {
      return Number(localStorage.getItem(LOCAL_UPDATED_KEY) || 0);
    } catch {
      return 0;
    }
  }

  function setLocalUpdatedAt(value) {
    try {
      localStorage.setItem(LOCAL_UPDATED_KEY, String(value));
    } catch {}
  }

  function hasProgress(progress) {
    return Boolean(
      progress &&
      typeof progress === "object" &&
      !Array.isArray(progress) &&
      Object.values(progress).some(
        items => Array.isArray(items) && items.length > 0
      )
    );
  }

  function writeLocal(progress, updatedAt) {
    try {
      localStorage.setItem(
        LOCAL_PROGRESS_KEY,
        JSON.stringify(progress)
      );
      setLocalUpdatedAt(updatedAt);
    } catch {}
  }

  function saveCloud(progress, updatedAt = Date.now()) {
    if (!syncStatus.supported) return;

    const payload = JSON.stringify({
      version: 2,
      progress,
      updatedAt
    });

    webApp.CloudStorage.setItem(
      CLOUD_KEY,
      payload,
      (error, stored) => {
        if (error) {
          syncStatus.error = String(error);
          console.error("Neuro Bilim cloud save failed:", error);
          return;
        }

        syncStatus.saved = stored !== false;
        syncStatus.error = null;
      }
    );
  }

  function refreshPage() {
    try {
      if (state.page === "lesson") {
        openLesson(state.lessonId);
      } else if (state.page === "course") {
        showCourse();
      } else if (state.page === "profile") {
        goProfile();
      } else {
        renderHome();
      }
    } catch (error) {
      console.error("Neuro Bilim progress refresh failed:", error);
    }
  }

  function loadCloud() {
    if (!syncStatus.supported) {
      syncStatus.error = "cloud_storage_not_supported";
      console.warn("Telegram CloudStorage is not supported in this client.");
      return;
    }

    webApp.CloudStorage.getItem(CLOUD_KEY, (error, value) => {
      if (error) {
        syncStatus.error = String(error);
        console.error("Neuro Bilim cloud load failed:", error);
        return;
      }

      let cloudProgress = null;
      let cloudUpdatedAt = 0;

      if (value) {
        try {
          const parsed = JSON.parse(value);

          if (
            parsed?.progress &&
            typeof parsed.progress === "object" &&
            !Array.isArray(parsed.progress)
          ) {
            cloudProgress = parsed.progress;
            cloudUpdatedAt = Number(parsed.updatedAt || 0);
          }
        } catch (parseError) {
          syncStatus.error = "cloud_parse_error";
          console.error("Neuro Bilim cloud parse failed:", parseError);
        }
      }

      const localUpdatedAt = getLocalUpdatedAt();
      const localHasProgress = hasProgress(state.progress);
      const cloudHasProgress = hasProgress(cloudProgress);

      if (cloudHasProgress && cloudUpdatedAt >= localUpdatedAt) {
        state.progress = cloudProgress;
        writeLocal(state.progress, cloudUpdatedAt || Date.now());
        syncStatus.loaded = true;
        syncStatus.error = null;
        refreshPage();
        return;
      }

      // First migration from the old phone:
      // if there is local progress but no newer cloud copy, upload it.
      if (localHasProgress) {
        const migratedAt = localUpdatedAt || Date.now();
        setLocalUpdatedAt(migratedAt);
        saveCloud(state.progress, migratedAt);
      }

      syncStatus.loaded = true;
      syncStatus.error = null;
    });
  }

  // Patch the existing local save so every future lesson completion
  // is also written to Telegram CloudStorage.
  if (typeof saveProgress === "function") {
    const originalSaveProgress = saveProgress;

    saveProgress = function saveProgressWithCloud() {
      originalSaveProgress();

      const updatedAt = Date.now();
      setLocalUpdatedAt(updatedAt);
      saveCloud(state.progress, updatedAt);
    };
  }

  loadCloud();
})();
