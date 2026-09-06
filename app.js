
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

const i18n = {
  kk: {
    hello: "Сәлем",
    platform: "Сіздің оқу платформаңыз",
    heroTitle: "Telegram ішіндегі 5 сабақтан тұратын курс",
    heroText: "Өз қарқыныңызбен оқып, тоқтаған жеріңізден жалғастырыңыз.",
    start: "Оқуды бастау",
    continue: "Оқуды жалғастыру",
    myCourse: "Менің курсым",
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
    markPassed: "Сабақты аяқталды деп белгілеу",
    passedBtn: "✓ Сабақ өтілді",
    next: "Келесі сабақ →",
    backCourse: "Курсқа оралу",
    studentData: "Оқушы деректері",
    telegramUser: "Telegram қолданушысы"
  },
  ru: {
    hello: "Привет",
    platform: "Твоя учебная платформа",
    heroTitle: "Курс из 5 уроков внутри Telegram",
    heroText: "Учись в своём темпе и продолжай с того места, где остановился.",
    start: "Начать обучение",
    continue: "Продолжить обучение",
    myCourse: "Мой курс",
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
    markPassed: "Отметить как пройденный",
    passedBtn: "✓ Урок пройден",
    next: "Следующий урок →",
    backCourse: "Вернуться к курсу",
    studentData: "Данные ученика",
    telegramUser: "Telegram пользователь"
  }
};

const lessonData = {
  kk: [
    {id:1,title:"Кіріспе",duration:"5 мин",text:"Бұл бірінші сабақ. Мұнда мәтін, видео, суреттер және материалдарға сілтемелер орналастыруға болады.",note:"Сабақтың мақсаты: оқушыны курс бағдарламасымен таныстыру."},
    {id:2,title:"Тақырып негіздері",duration:"8 мин",text:"Екінші сабақта негізгі ұғымдарды түсіндіреміз. Контентті өз материалыңызға ауыстыруға болады.",note:"Мұнда видео немесе қорғалған видеохостингке сілтеме қосуға болады."},
    {id:3,title:"Практикалық мысал",duration:"10 мин",text:"Үшінші сабақ тәжірибеге арналған. Мұнда чек-лист, нұсқаулық немесе шағын кейс болуы мүмкін.",note:"Кейін тест немесе үй тапсырмасын қосуға болады."},
    {id:4,title:"Қателерді талдау",duration:"7 мин",text:"Төртінші сабақта жиі кездесетін қателер мен оларды түзету жолдарын көрсетеміз.",note:"«Қате → шешім» карточкаларын қосуға болады."},
    {id:5,title:"Қорытынды",duration:"6 мин",text:"Соңғы сабақ курстың қорытындысын жасап, келесі қадамды көрсетеді.",note:"Курс соңында сертификат немесе келесі курсқа қолжетімділік беруге болады."}
  ],
  ru: [
    {id:1,title:"Введение",duration:"5 мин",text:"Это первый урок. Здесь можно разместить текст, видео, изображения и ссылки на материалы.",note:"Задача урока: познакомить ученика с программой курса."},
    {id:2,title:"Основы темы",duration:"8 мин",text:"Во втором уроке раскрываем базовые понятия. Контент можно заменить на ваш реальный материал.",note:"Можно добавить видео через iframe или ссылку на защищённый видеохостинг."},
    {id:3,title:"Практический пример",duration:"10 мин",text:"Третий урок посвящён практике. Здесь можно добавить чек-лист, инструкцию или небольшой кейс.",note:"Позже сюда легко добавить тест или домашнее задание."},
    {id:4,title:"Разбор ошибок",duration:"7 мин",text:"В четвёртом уроке показываем типичные ошибки и способы их исправления.",note:"Можно добавить карточки «ошибка → решение»."},
    {id:5,title:"Итог",duration:"6 мин",text:"Финальный урок подводит итог курса и показывает следующий шаг.",note:"После прохождения можно выдавать сертификат или открывать следующий курс."}
  ]
};

const state = {
  lang: localStorage.getItem("lang") || "kk",
  completed: JSON.parse(localStorage.getItem("completedLessons") || "[]")
};

function t(key){ return i18n[state.lang][key]; }
function lessons(){ return lessonData[state.lang]; }

function saveProgress() {
  localStorage.setItem("completedLessons", JSON.stringify(state.completed));
}
function setLang(lang){
  state.lang = lang;
  localStorage.setItem("lang", lang);
  renderHome();
}
function completedCount(){ return state.completed.length; }
function progressPct(){ return Math.round((completedCount()/5)*100); }
function initials(){ return (user.first_name || "Бақдәулет").slice(0,2).toUpperCase(); }

function langSwitch(){
  return `
    <div class="lang-switch">
      <button class="${state.lang==='kk'?'active':''}" onclick="setLang('kk')">ҚАЗ</button>
      <button class="${state.lang==='ru'?'active':''}" onclick="setLang('ru')">РУС</button>
    </div>`;
}

function renderNav(active){
  return `
    <div class="bottom-nav">
      <button class="${active==='home'?'active':''}" onclick="renderHome()">${t('home')}</button>
      <button class="${active==='profile'?'active':''}" onclick="goProfile()">${t('profile')}</button>
    </div>`;
}

function renderHome(){
  const nextLesson = lessons().find(l => !state.completed.includes(l.id)) || lessons()[0];
  document.documentElement.lang = state.lang === "kk" ? "kk" : "ru";
  document.getElementById("app").innerHTML = `
    <main class="app">
      <div class="header">
        <div>
          <div class="greeting">${t('hello')}, ${user.first_name || "Бақдәулет"}</div>
          <div class="small">${t('platform')}</div>
        </div>
        <div class="header-right">
          ${langSwitch()}
          <div class="avatar">${initials()}</div>
        </div>
      </div>

      <section class="hero">
        <div>
          <h1>${t('heroTitle')}</h1>
          <p>${t('heroText')}</p>
        </div>
        <button class="cta" onclick="openLesson(${nextLesson.id})">
          ${completedCount() ? t('continue') : t('start')}
        </button>
      </section>

      <h2 class="section-title">${t('myCourse')}</h2>
      <section class="course-card">
        <div class="course-top">
          <div>
            <h3>${t('pilotCourse')}</h3>
            <div class="meta">${t('lessons5')}</div>
          </div>
          <div class="meta">${progressPct()}%</div>
        </div>

        <div class="progress-wrap">
          <div class="progress-line"><div class="progress-bar" style="width:${progressPct()}%"></div></div>
          <div class="progress-text">
            <span>${completedCount()} / 5 ${t('completed')}</span>
            <span>${progressPct()}%</span>
          </div>
        </div>

        <button class="primary" onclick="showCourse()">${t('openCourse')}</button>
      </section>

      ${renderNav('home')}
    </main>`;
}

function showCourse(){
  document.getElementById("app").innerHTML = `
    <main class="app">
      <div class="topbar">
        <button class="back" onclick="renderHome()">←</button>
        <div>
          <div style="font-weight:800;font-size:21px">${t('pilotCourse')}</div>
          <div class="small">${completedCount()} / 5 ${t('completed')}</div>
        </div>
        <div style="margin-left:auto">${langSwitch()}</div>
      </div>

      <div class="course-card" style="margin-bottom:18px">
        <div class="progress-line"><div class="progress-bar" style="width:${progressPct()}%"></div></div>
      </div>

      <div class="lesson-list">
        ${lessons().map(lesson => {
          const done = state.completed.includes(lesson.id);
          return `
            <button class="lesson-item ${done?'done':''}" onclick="openLesson(${lesson.id})">
              <div class="lesson-num">${done?'✓':lesson.id}</div>
              <div class="lesson-body">
                <div class="lesson-title">${lesson.title}</div>
                <div class="lesson-status">${lesson.duration} · ${done?t('passed'):t('notPassed')}</div>
              </div>
              <div>›</div>
            </button>`;
        }).join("")}
      </div>
    </main>`;
}

function openLesson(id){
  const lesson = lessons().find(l=>l.id===id);
  const done = state.completed.includes(id);
  document.getElementById("app").innerHTML = `
    <main class="app lesson-page">
      <div class="topbar">
        <button class="back" onclick="showCourse()">←</button>
        <div class="small">${t('lesson')} ${lesson.id} ${t('of')} 5</div>
        <div style="margin-left:auto">${langSwitch()}</div>
      </div>

      <h2>${lesson.title}</h2>
      <div class="small">${lesson.duration}</div>

      <div class="lesson-content">
        <p>${lesson.text}</p>
        <div class="lesson-box">
          <strong>${t('note')}</strong>
          <p style="margin-bottom:0">${lesson.note}</p>
        </div>
      </div>

      <div class="lesson-actions">
        <button class="primary" onclick="toggleComplete(${lesson.id})">
          ${done ? t('passedBtn') : t('markPassed')}
        </button>
        ${lesson.id < 5
          ? `<button class="secondary" onclick="openLesson(${lesson.id+1})">${t('next')}</button>`
          : `<button class="secondary" onclick="showCourse()">${t('backCourse')}</button>`}
      </div>
    </main>`;
}

function toggleComplete(id){
  if(state.completed.includes(id)){
    state.completed = state.completed.filter(x=>x!==id);
  } else {
    state.completed.push(id);
  }
  saveProgress();
  openLesson(id);
}

function goProfile(){
  document.getElementById("app").innerHTML = `
    <main class="app">
      <div class="header">
        <div>
          <div class="greeting">${t('profile')}</div>
          <div class="small">${t('studentData')}</div>
        </div>
        <div class="header-right">
          ${langSwitch()}
          <div class="avatar">${initials()}</div>
        </div>
      </div>

      <section class="profile-card">
        <h3 style="margin-top:0">${user.first_name || "Бақдәулет"}</h3>
        <div class="small">${user.username ? '@'+user.username : t('telegramUser')}</div>

        <div style="margin-top:22px">
          <strong>${t('courseProgress')}</strong>
          <div class="progress-wrap">
            <div class="progress-line"><div class="progress-bar" style="width:${progressPct()}%"></div></div>
            <div class="progress-text">
              <span>${completedCount()} / 5</span>
              <span>${progressPct()}%</span>
            </div>
          </div>
        </div>
      </section>

      ${renderNav('profile')}
    </main>`;
}

renderHome();
