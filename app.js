const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const telegramUser = tg?.initDataUnsafe?.user;
const user = telegramUser || {
  first_name: "Бақдәулет",
  username: "demo"
};

const ACCESS_API = "https://neurobilim-access.dosmuhammeduly.workers.dev/";
const CHANNEL_URL = "https://t.me/neuroalem";

let channelAccess = {
  checked: false,
  subscribed: false,
  status: null,
  error: null
};

async function checkChannelAccess() {
  if (!tg?.initData) {
    channelAccess = {
      checked: true,
      subscribed: false,
      status: null,
      error: "telegram_required"
    };
    return channelAccess;
  }

  try {
    const response = await fetch(ACCESS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: tg.initData })
    });

    const data = await response.json();

    channelAccess = {
      checked: true,
      subscribed: Boolean(data.ok && data.subscribed),
      status: data.status || null,
      error: data.ok ? null : (data.error || "access_check_failed")
    };
  } catch (error) {
    console.error("Channel access check failed:", error);

    channelAccess = {
      checked: true,
      subscribed: false,
      status: null,
      error: "network_error"
    };
  }

  return channelAccess;
}

function openChannel() {
  if (tg?.openTelegramLink) {
    tg.openTelegramLink(CHANNEL_URL);
  } else {
    window.open(CHANNEL_URL, "_blank", "noopener,noreferrer");
  }
}

async function recheckChannelAccess() {
  channelAccess.checked = false;
  renderHome();

  await checkChannelAccess();
  renderHome();
}

const i18n = {
  kk: {
    hello: "Сәлем",
    platform: "Сіздің оқу платформаңыз",
    heroTitle: "Neuro Bilim платформасы",
    heroText:
      "Жасанды интеллект пен заманауи технологияларды қарапайым әрі практикалық форматта үйреніңіз.",
    start: "Оқуды бастау",
    continue: "Оқуды жалғастыру",
    myCourse: "Менің курстарым",
    pilotCourse: "Пилоттық курс",
    lessons5: "5 сабақ · шамамен 36 минут",
    completed: "аяқталды",
    openCourse: "Курсты ашу",
    home: "Басты бет",
    profile: "Профиль",
    courseProgress: "Курс барысы",
    lesson: "Сабақ",
    of: "/",
    passed: "Өтілді",
    notPassed: "Өтілмеді",
    note: "Ескерту",
    markPassed: "Сабақты аяқтау",
    passedBtn: "✓ Сабақ өтілді",
    next: "Келесі сабақ →",
    backCourse: "Курсқа оралу",
    studentData: "Оқушы деректері",
    telegramUser: "Telegram қолданушысы",

    joinChannel: "Каналға жазылу",
    checkAgain: "Қайта тексеру",
    lockedCourse:
      "Бұл курс @neuroalem каналына жазылған қолданушыларға қолжетімді.",
    checkingAccess: "Қолжетімділік тексерілуде...",
    telegramOnly:
      "Курсты ашу үшін Neuro Bilim-ді Telegram ішінен іске қосыңыз.",
    accessError:
      "Қолжетімділікті тексеру мүмкін болмады. Қайта тексеріп көріңіз."
  },

  ru: {
    hello: "Привет",
    platform: "Твоя учебная платформа",
    heroTitle: "Платформа Neuro Bilim",
    heroText:
      "Изучайте искусственный интеллект и современные технологии в простом и практическом формате.",
    start: "Начать обучение",
    continue: "Продолжить обучение",
    myCourse: "Мои курсы",
    pilotCourse: "Пилотный курс",
    lessons5: "5 уроков · примерно 36 минут",
    completed: "пройдено",
    openCourse: "Открыть курс",
    home: "Главная",
    profile: "Профиль",
    courseProgress: "Прогресс курса",
    lesson: "Урок",
    of: "из",
    passed: "Пройден",
    notPassed: "Не пройден",
    note: "Заметка",
    markPassed: "Завершить урок",
    passedBtn: "✓ Урок пройден",
    next: "Следующий урок →",
    backCourse: "Вернуться к курсу",
    studentData: "Данные ученика",
    telegramUser: "Telegram пользователь",

    joinChannel: "Подписаться на канал",
    checkAgain: "Проверить снова",
    lockedCourse:
      "Этот курс доступен подписчикам канала @neuroalem.",
    checkingAccess: "Проверяем доступ...",
    telegramOnly:
      "Чтобы открыть курс, запустите Neuro Bilim внутри Telegram.",
    accessError:
      "Не удалось проверить доступ. Попробуйте ещё раз."
  }
};

Object.assign(i18n.kk, {
  lessonCount: "сабақ",
  video: "Сабақ видеосы",
  notes: "Қысқаша конспект",
  concepts: "Негізгі түсініктер",
  task: "Практикалық тапсырма",
  materials: "Көмекші материалдар",
  watch: "Видеоны ашу",
  videoPending: "Видео жақында қосылады."
});

Object.assign(i18n.ru, {
  lessonCount: "уроков",
  video: "Видео урока",
  notes: "Краткий конспект",
  concepts: "Ключевые понятия",
  task: "Практическое задание",
  materials: "Вспомогательные материалы",
  watch: "Открыть видео",
  videoPending: "Видео скоро появится."
});

const storage = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },

  put(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }
};

let savedLang;

try {
  savedLang = localStorage.getItem("lang");
} catch {}

const storedProgress = storage.get("neurobilimProgress", {});

const state = {
  lang: ["kk", "ru"].includes(savedLang) ? savedLang : "kk",
  courseId: courses[0].id,
  progress:
    storedProgress &&
    typeof storedProgress === "object" &&
    !Array.isArray(storedProgress)
      ? storedProgress
      : {},
  page: "home",
  lessonId: null
};

if (!Object.prototype.hasOwnProperty.call(state.progress, courses[0].id)) {
  const legacy = storage.get("completedLessons", []);
  state.progress[courses[0].id] = Array.isArray(legacy) ? legacy : [];
}

function course() {
  return courses.find((c) => c.id === state.courseId) || courses[0];
}

function completed() {
  const ids = state.progress[course().id];
  return Array.isArray(ids) ? ids : [];
}

function t(key) {
  return i18n[state.lang][key];
}

function lessons() {
  return course().lessons.map((l) => ({
    ...l,
    ...l[state.lang]
  }));
}

function saveProgress() {
  storage.put("neurobilimProgress", state.progress);
}

function setLang(lang) {
  if (!i18n[lang]) return;

  state.lang = lang;

  try {
    localStorage.setItem("lang", lang);
  } catch {}

  document.documentElement.lang = lang;

  if (state.page === "lesson") {
    openLesson(state.lessonId);
  } else if (state.page === "course") {
    showCourse();
  } else if (state.page === "profile") {
    goProfile();
  } else {
    renderHome();
  }
}

function completedCount() {
  return lessons().filter((l) => completed().includes(l.id)).length;
}

function progressPct() {
  return lessons().length
    ? Math.round((completedCount() / lessons().length) * 100)
    : 0;
}

function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[c]
  );
}

function selectCourse(id) {
  if (courses.some((c) => c.id === id)) {
    state.courseId = id;
  }
}

function accessMessage() {
  if (!channelAccess.checked) {
    return t("checkingAccess");
  }

  if (channelAccess.error === "telegram_required") {
    return t("telegramOnly");
  }

  if (channelAccess.error) {
    return t("accessError");
  }

  return t("lockedCourse");
}

function accessButtons() {
  if (!channelAccess.checked) {
    return "";
  }

  if (channelAccess.error === "telegram_required") {
    return "";
  }

  return `
    <div style="display:grid;gap:10px;margin-top:14px">
      <button class="primary" onclick="openChannel()">
        🔒 ${t("joinChannel")}
      </button>

      <button class="secondary" onclick="recheckChannelAccess()">
        ${t("checkAgain")}
      </button>
    </div>
  `;
}

function ensureCourseAccess() {
  if (channelAccess.subscribed) {
    return true;
  }

  renderHome();
  return false;
}

function courseCard(c) {
  const previous = state.courseId;
  selectCourse(c.id);

  const locked = !channelAccess.subscribed;

  const html = `
    <section class="course-card" style="margin-bottom:16px">

      <div class="course-top">
        ${courseArtwork()}

        <div>
          <h3>${escapeHTML(c[state.lang].title)}</h3>
          <div class="meta">
            ${lessons().length} ${t("lessonCount")}
          </div>
        </div>
      </div>

      <p class="course-description">
        ${escapeHTML(c[state.lang].description)}
      </p>

      <div class="progress-wrap">

        <div class="progress-line">
          <div
            class="progress-bar"
            style="width:${progressPct()}%">
          </div>
        </div>

        <div class="progress-text">
          <span>
            ${completedCount()} / ${lessons().length}
            ${t("completed")}
          </span>

          <span>
            ${progressPct()}%
          </span>
        </div>

      </div>

      ${
        locked
          ? `
            <div
              style="
                margin-top:14px;
                padding:14px;
                border-radius:14px;
                background:#eef5ff;
                color:#163b73;
              "
            >

              <strong>
                🔒 ${accessMessage()}
              </strong>

              ${accessButtons()}

            </div>
          `
          : `
            <button
              class="primary"
              onclick="selectCourse('${c.id}');showCourse()"
            >
              ${t("openCourse")}
            </button>
          `
      }

    </section>
  `;

  state.courseId = previous;

  return html;
}

function lessonSections(lesson) {
  const video = lesson.videoUrl;

  const safeUrl = (url) => {
    try {
      return ["https:", "http:"].includes(new URL(url).protocol);
    } catch {
      return false;
    }
  };

  return `
    <div class="lesson-box">

      <strong>
        🎬 ${t("video")}
      </strong>

      <p>
        ${
          video && safeUrl(video)
            ? `
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="${escapeHTML(video)}"
              >
                ${t("watch")}
              </a>
            `
            : t("videoPending")
        }
      </p>

    </div>

    <div class="lesson-box">

      <strong>
        📝 ${t("notes")}
      </strong>

      <p>
        ${escapeHTML(lesson.notes)}
      </p>

    </div>

    <div class="lesson-box">

      <strong>
        💡 ${t("concepts")}
      </strong>

      <ul>
        ${lesson.concepts
          .map((x) => `<li>${escapeHTML(x)}</li>`)
          .join("")}
      </ul>

    </div>

    <div class="lesson-box">

      <strong>
        🧪 ${t("task")}
      </strong>

      <p>
        ${escapeHTML(lesson.task)}
      </p>

    </div>

    <div class="lesson-box">

      <strong>
        📎 ${t("materials")}
      </strong>

      ${lesson.materials
        .map((m) => {
          if (m.url && safeUrl(m.url)) {
            return `
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="${escapeHTML(m.url)}"
                >
                  ${escapeHTML(m.title)}
                </a>
              </p>
            `;
          }

          return `
            <p>
              <b>${escapeHTML(m.title)}</b><br>
              ${escapeHTML(m.text || "")}
            </p>
          `;
        })
        .join("")}

    </div>
  `;
}

function initials() {
  return (user.first_name || "Бақдәулет")
    .slice(0, 2)
    .toUpperCase();
}

function langSwitch() {
  return `
    <div class="lang-switch">

      <button
        class="${state.lang === "kk" ? "active" : ""}"
        onclick="setLang('kk')"
      >
        ҚАЗ
      </button>

      <button
        class="${state.lang === "ru" ? "active" : ""}"
        onclick="setLang('ru')"
      >
        РУС
      </button>

    </div>
  `;
}

let mountedView = "";

function mount(markup) {
  const view =
    state.page +
    ":" +
    state.courseId +
    ":" +
    (state.page === "lesson" ? state.lessonId : "");

  const previous = document.querySelector?.(".app");

  const scrollTop =
    mountedView === view
      ? previous?.scrollTop || 0
      : 0;

  document.getElementById("app").innerHTML = markup;

  const current = document.querySelector?.(".app");

  if (current) {
    current.scrollTop = scrollTop;
  }

  mountedView = view;
}

function courseArtwork() {
  return `
    <svg
      class="course-art"
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
    >

      <rect
        width="80"
        height="80"
        rx="18"
        fill="#dceaff"
      />

      <path
        d="M14 25c10-4 18-2 26 3 8-5 16-7 26-3v35c-10-4-18-2-26 3-8-5-16-7-26-3V25Z"
        fill="white"
        stroke="#2563eb"
        stroke-width="2"
      />

      <path
        d="M40 28v35M21 36l11 2M21 44l11 2M48 37h10M48 45h10"
        stroke="#93b8f5"
        stroke-width="2.5"
        stroke-linecap="round"
      />

      <rect
        x="29"
        y="10"
        width="23"
        height="23"
        rx="7"
        fill="#2563eb"
      />

      <path
        d="m40.5 14 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z"
        fill="white"
      />

    </svg>
  `;
}

function renderNav(active) {
  return `
    <footer class="nav-dock">

      <nav class="bottom-nav">

        <button
          class="${active === "home" ? "active" : ""}"
          onclick="renderHome()"
        >
          ${t("home")}
        </button>

        <button
          class="${active === "profile" ? "active" : ""}"
          onclick="goProfile()"
        >
          ${t("profile")}
        </button>

      </nav>

    </footer>
  `;
}

function renderHome() {
  state.page = "home";

  const nextLesson =
    lessons().find((l) => !completed().includes(l.id)) ||
    lessons()[0];

  document.documentElement.lang =
    state.lang === "kk" ? "kk" : "ru";

  mount(`
    <main class="app">

      <div class="header">

        <div>

          <div class="greeting">
            ${t("hello")},
            ${escapeHTML(user.first_name || "Бақдәулет")}
          </div>

          <div class="small">
            ${t("platform")}
          </div>

        </div>

        <div class="header-right">

          ${langSwitch()}

          <div class="avatar">
            ${escapeHTML(initials())}
          </div>

        </div>

      </div>

      <section class="hero">

        <div class="hero-copy">

          <h1>
            ${t("heroTitle")}
          </h1>

          <p class="hero-description">
            ${t("heroText")}
          </p>

          <p class="hero-description-short">
            ${
              state.lang === "kk"
                ? "ЖИ мен заманауи технологияларды практика арқылы үйреніңіз."
                : "Изучайте ИИ и современные технологии на практике."
            }
          </p>

          ${
            channelAccess.subscribed
              ? `
                <button
                  class="cta"
                  onclick="openLesson(${nextLesson.id})"
                >
                  ${
                    completedCount()
                      ? t("continue")
                      : t("start")
                  }
                </button>
              `
              : `
                <button
                  class="cta"
                  onclick="${
                    channelAccess.error === "telegram_required"
                      ? ""
                      : "openChannel()"
                  }"
                >
                  ${
                    channelAccess.checked
                      ? channelAccess.error === "telegram_required"
                        ? t("telegramOnly")
                        : t("joinChannel")
                      : t("checkingAccess")
                  }
                </button>
              `
          }

        </div>

        <img
          class="hero-portrait"
          src="./portrait.png"
          alt=""
        />

      </section>

      <h2 class="section-title">
        ${t("myCourse")}
      </h2>

      ${courses.map(courseCard).join("")}

    </main>

    ${renderNav("home")}
  `);
}

function showCourse() {
  if (!ensureCourseAccess()) {
    return;
  }

  state.page = "course";

  mount(`
    <main class="app">

      <div class="topbar">

        <button
          class="back"
          onclick="renderHome()"
        >
          ←
        </button>

        <div>

          <div class="course-heading">
            ${escapeHTML(course()[state.lang].title)}
          </div>

          <div class="small">
            ${completedCount()} / ${lessons().length}
            ${t("completed")}
          </div>

        </div>

        <div style="margin-left:auto">
          ${langSwitch()}
        </div>

      </div>

      <div
        class="course-card"
        style="margin-bottom:18px"
      >

        <div class="progress-line">

          <div
            class="progress-bar"
            style="width:${progressPct()}%"
          >
          </div>

        </div>

      </div>

      <div class="lesson-list">

        ${lessons()
          .map((lesson) => {
            const done = completed().includes(lesson.id);

            return `
              <button
                class="lesson-item ${done ? "done" : ""}"
                onclick="openLesson(${lesson.id})"
              >

                <div class="lesson-num">
                  ${done ? "✓" : lesson.id}
                </div>

                <div class="lesson-body">

                  <div class="lesson-title">
                    ${lesson.title}
                  </div>

                  <div class="lesson-status">
                    ${
                      lesson.duration
                        ? lesson.duration + " · "
                        : ""
                    }

                    ${
                      done
                        ? t("passed")
                        : t("notPassed")
                    }
                  </div>

                </div>

                <div>
                  ›
                </div>

              </button>
            `;
          })
          .join("")}

      </div>

    </main>
  `);
}

function openLesson(id) {
  if (!ensureCourseAccess()) {
    return;
  }

  if (!lessons().some((l) => l.id === id)) {
    return;
  }

  state.page = "lesson";
  state.lessonId = id;

  const lesson =
    lessons().find((l) => l.id === id);

  const done =
    completed().includes(id);

  mount(`
    <main class="app lesson-page">

      <div class="topbar">

        <button
          class="back"
          onclick="showCourse()"
        >
          ←
        </button>

        <div class="small">
          ${t("lesson")} ${lesson.id}
          ${t("of")} ${lessons().length}
        </div>

        <div style="margin-left:auto">
          ${langSwitch()}
        </div>

      </div>

      <h2>
        ${lesson.title}
      </h2>

      <div class="small">
        ${lesson.duration}
      </div>

      <div class="lesson-content">
        ${lessonSections(lesson)}
      </div>

      <div class="lesson-actions">

        <button
          class="primary"
          onclick="toggleComplete(${lesson.id})"
        >
          ${
            done
              ? t("passedBtn")
              : t("markPassed")
          }
        </button>

        ${
          lessons().findIndex((l) => l.id === id) <
          lessons().length - 1
            ? `
              <button
                class="secondary"
                onclick="openLesson(${
                  lessons()[
                    lessons().findIndex(
                      (l) => l.id === id
                    ) + 1
                  ].id
                })"
              >
                ${t("next")}
              </button>
            `
            : `
              <button
                class="secondary"
                onclick="showCourse()"
              >
                ${t("backCourse")}
              </button>
            `
        }

      </div>

    </main>
  `);
}

function toggleComplete(id) {
  if (!ensureCourseAccess()) {
    return;
  }

  if (completed().includes(id)) {
    state.progress[course().id] =
      completed().filter((x) => x !== id);
  } else {
    state.progress[course().id] = [
      ...completed(),
      id
    ];
  }

  saveProgress();
  openLesson(id);
}

function goProfile() {
  state.page = "profile";

  mount(`
    <main class="app">

      <div class="header">

        <div>

          <div class="greeting">
            ${t("profile")}
          </div>

          <div class="small">
            ${t("studentData")}
          </div>

        </div>

        <div class="header-right">

          ${langSwitch()}

          <div class="avatar">
            ${initials()}
          </div>

        </div>

      </div>

      <section class="profile-card">

        <h3 style="margin-top:0">
          ${escapeHTML(
            user.first_name || "Бақдәулет"
          )}
        </h3>

        <div class="small">
          ${
            user.username
              ? "@" + escapeHTML(user.username)
              : t("telegramUser")
          }
        </div>

        <div style="margin-top:22px">

          <strong>
            ${t("courseProgress")}
          </strong>

          <div class="progress-wrap">

            <div class="progress-line">

              <div
                class="progress-bar"
                style="width:${progressPct()}%"
              >
              </div>

            </div>

            <div class="progress-text">

              <span>
                ${completedCount()} /
                ${lessons().length}
              </span>

              <span>
                ${progressPct()}%
              </span>

            </div>

          </div>

        </div>

      </section>

    </main>

    ${renderNav("profile")}
  `);
}

async function bootstrap() {
  renderHome();

  await checkChannelAccess();

  renderHome();
}

bootstrap();
