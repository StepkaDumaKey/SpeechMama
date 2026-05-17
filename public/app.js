const STORAGE_KEY = "speech-report-builder:v1";

const sectionDefs = [
  {
    id: "behavior",
    title: "Контакт и поведение",
    options: [
      "В процессе обследования ребенок внешне спокоен, вступает в контакт охотно и сразу, зрительный контакт стабильный. Обращенную речь понимает в полном объеме. Программу действий удерживает самостоятельно. Помощь взрослого принимает.",
      "В ситуации обследования ребенок возбужден, поведение адекватное. Вступает в контакт свободно и сразу, зрительный контакт стабильный. Инструкцию часто понимает на вербальном уровне. Программу действий удерживает, иногда нуждается в организующей помощи взрослого.",
      "В процессе обследования ребенок возбужден, действует в рамках собственных интересов. Вступает в контакт кратковременно, зрительный контакт отсутствует. На обращенную речь реагирует избирательно."
    ]
  },
  {
    id: "motor",
    title: "Моторика",
    options: [
      "Общая моторика ребенка без выраженных особенностей. Предпочитает действовать правой рукой.",
      "Общая моторика ребенка без выраженных особенностей, при выполнении динамических упражнений испытывает затруднения. Мелкая моторика развита недостаточно. Графические навыки и конструктивная деятельность находятся в стадии формирования.",
      "Общая моторика ребенка сформирована недостаточно: ребенок неловок, движения некоординированные. Мелкая моторика нарушена. Латерализация не сформирована."
    ]
  },
  {
    id: "play",
    title: "Игра и деятельность",
    options: [
      "Ведущая деятельность в пределах возрастной нормы: игровая, характерна сюжетно-ролевая игра. Ребенок проявляет стойкий интерес к игрушкам и дидактическим пособиям, в игру включается активно.",
      "Ведущая деятельность предметная с элементами игровой, действия с игрушками не всегда адекватные. К игрушкам и дидактическим пособиям проявляет избирательный интерес. Подражательная деятельность снижена.",
      "Ведущая деятельность предметная с элементами игровой, характерна предметно-манипулятивная игра. Подражательная деятельность в ситуации обследования отсутствовала."
    ]
  },
  {
    id: "cognition",
    title: "Психические процессы",
    options: [
      "Развитие психических процессов в пределах возрастной нормы. Устойчивость и переключаемость внимания в норме.",
      "Устойчивость и объем произвольного внимания снижены. Мышление наглядно-образное. Операции обобщения и классификации предметов сформированы не в полном объеме.",
      "Развитие психических процессов ребенка не соответствует возрасту. Объем внимания снижен. Включение в произвольную деятельность затруднено."
    ]
  },
  {
    id: "comprehension",
    title: "Понимание речи",
    options: [
      "Понимание обращенной речи не нарушено. Ребенок выполняет инструкции, ориентируется во временных понятиях по возрасту.",
      "Понимание обращенной речи сформировано недостаточно. Ребенок выполняет одноступенчатые инструкции, при выполнении двухступенчатых нуждается в подсказке.",
      "Обращенную речь понимает на бытовом уровне, ситуативно. Коммуникативные навыки сформированы недостаточно."
    ]
  },
  {
    id: "articulation",
    title: "Артикуляция",
    options: [
      "Состояние артикуляционного аппарата без грубых анатомических нарушений. Артикуляционная моторика в пределах возрастной нормы.",
      "Отмечаются особенности артикуляционной моторики: неполный объем движений, движения нескоординированные, снижена переключаемость артикуляционных поз. Наблюдаются синкинезии.",
      "Состояние артикуляционного аппарата, мимической и артикуляционной моторики обследовать не удалось вследствие невозможности установления продуктивного контакта."
    ]
  },
  {
    id: "breathing",
    title: "Дыхание и голос",
    options: [
      "Объем дыхания достаточный, речевой выдох истощаемый, голос нормальной силы.",
      "При исследовании дыхательной и голосовой функций выявлено нарушение физиологического и речевого дыхания. Объем дыхания недостаточный, тип дыхания смешанный. Речевой вдох и речевой выдох укороченные. Сила голоса нормальная, тембр без особенностей.",
      "Дыхательная и голосовая функции в ситуации обследования полноценно не исследовались."
    ]
  },
  {
    id: "sound",
    title: "Звукопроизношение",
    options: [
      "Звукопроизношение нарушено. Наблюдаются пропуски и замены звуков. Отсутствуют сонорные звуки [Р], [Рь], [Л], [Ль].",
      "Нарушено звукопроизношение свистящих звуков.",
      "Оценить состояние звукопроизношения в полном объеме не удалось из-за ограниченности речевой продукции."
    ]
  },
  {
    id: "phonemics",
    title: "Фонематический слух",
    options: [
      "Фонематический слух сформирован недостаточно: ребенок допускает ошибки в дифференциации оппозиционных звуков, затрудняется в выделении начального гласного и согласного звука из слова.",
      "Фонематические процессы сформированы не в полном объеме.",
      "Фонематический слух в ситуации обследования оценить не удалось."
    ]
  },
  {
    id: "syllables",
    title: "Слоговая структура",
    options: [
      "Слоговая структура слова нарушена. Отмечаются нарушения количества слогов, перестановки слогов, нарушения звуконаполняемости слов, сокращения стечений согласных.",
      "Слоговая структура слова сформирована недостаточно, ошибки проявляются в словах сложной слоговой структуры.",
      "Слоговая структура слова не исследовалась вследствие отсутствия достаточной речевой продукции."
    ]
  },
  {
    id: "vocabulary",
    title: "Словарь",
    options: [
      "Пассивный словарь развит лучше активного. Объем активного словаря отстает от возрастной нормы.",
      "Объем существительных, глаголов и прилагательных не соответствует возрастной норме. Обобщающие понятия сформированы частично.",
      "Пассивный словарь относительно сохранен на бытовом уровне, однако в активную речь ребенок усвоенные слова переносит недостаточно."
    ]
  },
  {
    id: "grammar",
    title: "Грамматический строй",
    options: [
      "Лексико-грамматический строй речи сформирован в пределах возрастной нормы.",
      "Лексико-грамматический строй нарушен. Ребенок испытывает трудности при словоизменении и словообразовании, согласовании слов, употреблении предлогов и падежных форм.",
      "Понимание различных грамматических категорий затруднено. Фразовая речь отсутствует или представлена фрагментарно."
    ]
  },
  {
    id: "connectedSpeech",
    title: "Связная речь",
    options: [
      "Связная речь представлена развернутыми высказываниями. Ребенок сохраняет логическую последовательность изложения, правильно использует языковые компоненты.",
      "Собственная речь ребенка представлена словами и простой фразой с нарушением порядка слов. Связная речь не сформирована по возрасту: фраза фрагментарная, аграмматичная, высказывание строится с помощью вопросов и подсказок взрослого.",
      "Речь не сформирована по возрасту, нет стремления к речевому общению. Собственная речь представлена спонтанными вокализациями, голосовыми реакциями, отдельными слогами. Фраза отсутствует. Связная речь не сформирована."
    ]
  }
];

const conclusionOptions = [
  {
    id: "onr1_ras",
    label: "ОНР I + РАС",
    text: "Общее недоразвитие речи I уровня у ребенка при расстройстве аутистического спектра."
  },
  {
    id: "onr1_features",
    label: "ОНР I + особенности сфер",
    text: "Общее недоразвитие речи I уровня у ребенка с особенностями познавательной, эмоционально-волевой и коммуникативной сфер."
  },
  {
    id: "onr2",
    label: "ОНР II",
    text: "Общее недоразвитие речи II уровня."
  },
  {
    id: "stutter",
    label: "Логоневроз",
    text: "Логоневроз, заикание клонического типа."
  },
  {
    id: "dyslalia",
    label: "Дислалия",
    text: "Дислалия. Нарушение звукопроизношения."
  },
  {
    id: "dysarthria",
    label: "Дизартрия",
    text: "Дизартрия. Нарушение произносительной стороны речи."
  },
  {
    id: "phonetic_phonemic",
    label: "ФФНР",
    text: "Фонетико-фонематическое недоразвитие речи."
  },
  {
    id: "alalia",
    label: "Алалия",
    text: "Алалия. Системное недоразвитие речи."
  },
  {
    id: "motor_alalia",
    label: "Моторная алалия",
    text: "Моторная алалия. Системное недоразвитие экспрессивной речи."
  },
  {
    id: "sensory_alalia",
    label: "Сенсорная алалия",
    text: "Сенсорная алалия. Нарушение понимания обращенной речи."
  },
  {
    id: "rhinolalia",
    label: "Ринолалия",
    text: "Ринолалия. Нарушение тембра голоса и звукопроизношения."
  },
  {
    id: "tachylalia",
    label: "Тахилалия",
    text: "Тахилалия. Нарушение темпо-ритмической организации речи."
  },
  {
    id: "bradylalia",
    label: "Брадилалия",
    text: "Брадилалия. Нарушение темпо-ритмической организации речи."
  },
  {
    id: "aphasia",
    label: "Афазия",
    text: "Афазия. Системное нарушение речи."
  },
  {
    id: "dysgraphia_risk",
    label: "Риск дисграфии",
    text: "Предпосылки нарушения письменной речи."
  },
  {
    id: "speech_delay",
    label: "ЗРР",
    text: "Задержка речевого развития."
  },
  {
    id: "psychospeech_delay",
    label: "ЗПРР",
    text: "Задержка психоречевого развития."
  }
];

const recommendationBank = [
  "Консультация невролога.",
  "Наблюдение у невролога. Соблюдение рекомендаций врача.",
  "Консультация психиатра.",
  "Консультация сурдолога.",
  "Консультация нейропсихолога.",
  "Занятия с нейропсихологом.",
  "Занятия с логопедом-дефектологом.",
  "Соблюдение режима дня.",
  "Общеукрепляющие процедуры."
];

const smartSuggestionSources = {
  reason: [
    "недостаточного уровня развития речи",
    "сложности коммуникации у ребенка",
    "отставания в речевом развитии от сверстников",
    "отсутствия фразовой речи",
    "нарушения звукопроизношения",
    "логоневроза, заикания",
    "трудностей понимания обращенной речи"
  ],
  anamnesis: [
    "Анамнестические данные записаны со слов родителей и на основании предоставленных медицинских документов. До года физическое развитие протекало в пределах нормы, речевое развитие с задержкой. Навыки самообслуживания сформированы.",
    "Анамнестические данные записаны со слов родителей. Беременность протекала без выраженных особенностей. Роды своевременные. Речевое развитие протекало с задержкой.",
    "Анамнестические данные записаны со слов родителей и на основании медицинских документов. Ребенок наблюдается у невролога, ранее занимался с логопедом-дефектологом, динамика положительная.",
    "Анамнестические данные записаны со слов родителей. Навыки самообслуживания сформированы недостаточно. Речевое развитие не соответствует возрастной норме."
  ],
  conclusion: conclusionOptions.map((item) => item.text)
};

const contextSuggestionRules = [
  {
    when: (data) => /рас|аутизм/i.test(`${data.conclusion} ${data.anamnesis} ${data.reason}`),
    suggestions: {
      behavior:
        "В процессе обследования ребенок действует преимущественно в рамках собственных интересов. Контакт устанавливается кратковременно, зрительный контакт нестойкий. На обращенную речь реагирует избирательно.",
      comprehension:
        "Обращенную речь понимает преимущественно на бытовом уровне, ситуативно. Выполнение инструкций зависит от мотивации и степени организующей помощи взрослого.",
      connectedSpeech:
        "Коммуникативная функция речи сформирована недостаточно. Собственная речь представлена отдельными словами, слогами или голосовыми реакциями; фразовая речь не сформирована."
    }
  },
  {
    when: (data) => /заикан|логоневроз/i.test(`${data.conclusion} ${data.reason}`),
    suggestions: {
      breathing:
        "При исследовании дыхательной и голосовой функций отмечается недостаточный объем дыхания, укороченный речевой выдох. Сила голоса сохранна, тембр без выраженных особенностей.",
      connectedSpeech:
        "В спонтанной речи отмечаются речевые запинки клонического характера, преимущественно в начале слов и фраз. При снижении темпа и громкости речи количество запинок уменьшается."
    }
  },
  {
    when: (data) => /недостаточного уровня развития речи|онр|фраз/i.test(`${data.conclusion} ${data.reason}`),
    suggestions: {
      vocabulary:
        "Пассивный словарь развит лучше активного. Объем активного словаря не соответствует возрастной норме, обобщающие понятия сформированы частично.",
      grammar:
        "Лексико-грамматический строй речи нарушен. Отмечаются ошибки словоизменения, словообразования, согласования слов, употребления предлогов и падежных форм.",
      connectedSpeech:
        "Связная речь не сформирована по возрасту. Высказывание фрагментарное, аграмматичное, строится с помощью вопросов и подсказок взрослого."
    }
  }
];

let smartSuggestionState = {
  field: null,
  suggestion: null,
  source: ""
};

const AI_SUGGESTION_DELAY_MS = 450;
const AI_FALLBACK_SCORE_THRESHOLD = 90;
const aiSuggestionTimers = new Map();
const aiSuggestionControllers = new Map();
let aiSuggestionRequestId = 0;

const profiles = {
  blank: {
    label: "Новый бланк",
    reason: "",
    anamnesis: "Анамнестические данные записаны со слов родителей и на основании предоставленных медицинских документов.",
    sections: {},
    conclusion: "",
    recommendations: []
  },
  onr1_ras: {
    label: "ОНР I уровня, РАС",
    reason: "сложности коммуникации у ребенка",
    anamnesis:
      "Анамнестические данные записаны со слов родителей и на основании медицинских документов. До года физическое развитие протекало в пределах нормы, речевое развитие с задержкой. Навыки самообслуживания сформированы недостаточно.",
    sections: {
      behavior: sectionDefs[0].options[2],
      motor: sectionDefs[1].options[2],
      play: sectionDefs[2].options[2],
      cognition: sectionDefs[3].options[2],
      comprehension: sectionDefs[4].options[2],
      articulation: sectionDefs[5].options[2],
      breathing: sectionDefs[6].options[2],
      sound: sectionDefs[7].options[2],
      phonemics: sectionDefs[8].options[2],
      syllables: sectionDefs[9].options[2],
      vocabulary: sectionDefs[10].options[2],
      grammar: sectionDefs[11].options[2],
      connectedSpeech: sectionDefs[12].options[2]
    },
    conclusion: conclusionOptions[0].text,
    recommendations: [
      "Консультация психиатра.",
      "Наблюдение у невролога. Соблюдение рекомендаций врача.",
      "Занятия с нейропсихологом.",
      "Занятия с логопедом-дефектологом."
    ]
  },
  onr2: {
    label: "ОНР II уровня",
    reason: "недостаточного уровня развития речи",
    anamnesis:
      "Анамнестические данные записаны со слов родителей и на основании предоставленных медицинских документов. До года физическое развитие протекало в пределах нормы, речевое развитие с задержкой. Навыки самообслуживания сформированы.",
    sections: {
      behavior: sectionDefs[0].options[1],
      motor: sectionDefs[1].options[1],
      play: sectionDefs[2].options[0],
      cognition: sectionDefs[3].options[1],
      comprehension: sectionDefs[4].options[1],
      articulation: sectionDefs[5].options[1],
      breathing: sectionDefs[6].options[0],
      sound: sectionDefs[7].options[0],
      phonemics: sectionDefs[8].options[0],
      syllables: sectionDefs[9].options[0],
      vocabulary: sectionDefs[10].options[1],
      grammar: sectionDefs[11].options[1],
      connectedSpeech: sectionDefs[12].options[1]
    },
    conclusion: conclusionOptions[2].text,
    recommendations: [
      "Консультация нейропсихолога.",
      "Наблюдение у невролога. Соблюдение рекомендаций врача.",
      "Занятия с логопедом-дефектологом.",
      "Соблюдение режима дня."
    ]
  },
  stutter: {
    label: "Логоневроз, заикание",
    reason: "логоневроза, заикания",
    anamnesis: "",
    sections: {
      behavior: sectionDefs[0].options[0],
      motor: sectionDefs[1].options[0],
      play: "",
      cognition: sectionDefs[3].options[0],
      comprehension: sectionDefs[4].options[0],
      articulation: "",
      breathing: sectionDefs[6].options[1],
      sound: sectionDefs[7].options[1],
      phonemics: "",
      syllables: "",
      vocabulary: "",
      grammar: sectionDefs[11].options[0],
      connectedSpeech:
        "Связная речь представлена развернутыми высказываниями. Ребенок сохраняет внутреннее программирование, связность и логическую последовательность изложения, правильно использует языковые компоненты. Просодические компоненты речи в норме. В процессе обследования выявилось заикание клонического типа в начале слов, в начале и реже в середине предложения. Запинки уменьшаются при снижении громкости до шепотной речи."
    },
    conclusion: conclusionOptions[3].text,
    recommendations: [
      "Наблюдение у невролога. Соблюдение рекомендаций врача.",
      "Занятия с логопедом-дефектологом.",
      "Соблюдение режима дня.",
      "Общеукрепляющие процедуры."
    ]
  }
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function init() {
  renderProfiles();
  renderConclusionPresets();
  renderSections();
  renderRecommendations();
  setupSmartSuggestions();
  bindEvents();
  setInitialDates();
  applyProfile("blank");
  refreshDraftSelect();
  updateAssistant([
    {
      type: "info",
      text: "Выберите профиль и заполняйте свободные поля. Когда рядом появляется подсказка, нажмите Tab, чтобы вставить ее."
    }
  ]);
  updatePreview();
}

function renderProfiles() {
  const select = $("#profile");
  select.innerHTML = Object.entries(profiles)
    .map(([id, profile]) => `<option value="${id}">${escapeHtml(profile.label)}</option>`)
    .join("");
}

function renderConclusionPresets() {
  $("#conclusionPreset").innerHTML =
    `<option value="">Выберите вариант</option>` +
    conclusionOptions
      .map((item) => `<option value="${item.id}">${escapeHtml(item.label)}</option>`)
      .join("");
}

function renderSections() {
  $("#sections").innerHTML = sectionDefs
    .map((section) => {
      return `
        <section class="section-card" data-section="${section.id}">
          <div class="section-header">
            <h3>${escapeHtml(section.title)}</h3>
          </div>
          <div class="section-body">
            <textarea id="section-${section.id}" rows="4"></textarea>
          </div>
        </section>
      `;
    })
    .join("");
}

function renderRecommendations() {
  $("#recommendations").innerHTML = recommendationBank
    .map(
      (item, index) => `
        <label class="recommendation-option">
          <input type="checkbox" value="${escapeHtml(item)}" id="rec-${index}" />
          <span>${escapeHtml(item)}</span>
        </label>
      `
    )
    .join("");
}

function bindEvents() {
  $("#profile").addEventListener("change", (event) => applyProfile(event.target.value));
  $("#conclusionPreset").addEventListener("change", (event) => {
    const selected = conclusionOptions.find((item) => item.id === event.target.value);
    if (selected) {
      $("#conclusion").value = selected.text;
      updatePreview();
    }
  });

  $("#sections").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const sectionId = button.dataset.section;
    if (button.dataset.action === "insert-template") insertTemplate(sectionId);
    if (button.dataset.action === "suggest") suggestSection(sectionId);
  });

  $("#addRecommendationBtn").addEventListener("click", addCustomRecommendation);
  $("#summaryBtn").addEventListener("click", suggestConclusionSummary);
  $("#saveDraftBtn").addEventListener("click", saveDraft);
  $("#loadDraftBtn").addEventListener("click", loadSelectedDraft);
  $("#deleteDraftBtn").addEventListener("click", deleteSelectedDraft);
  $("#copyBtn").addEventListener("click", copyDocumentText);
  $("#docxBtn").addEventListener("click", exportDocx);
  $("#pdfBtn").addEventListener("click", () => window.print());
  $("#checkBtn").addEventListener("click", runChecks);
  $("#polishBtn").addEventListener("click", polishAll);

  document.addEventListener("input", (event) => {
    if (event.target.closest(".app-shell")) {
      updatePreview();
      if (isSmartField(event.target)) updateSmartSuggestion(event.target);
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.closest(".app-shell")) {
      updatePreview();
      if (isSmartField(event.target)) updateSmartSuggestion(event.target);
    }
  });
}

function setupSmartSuggestions() {
  getSmartFields().forEach((field) => {
    if (field.closest(".smart-field")) return;
    const wrapper = document.createElement("div");
    wrapper.className = "smart-field";
    field.parentNode.insertBefore(wrapper, field);

    const ghost = document.createElement("div");
    ghost.className = "smart-ghost";
    ghost.setAttribute("aria-hidden", "true");
    wrapper.appendChild(ghost);

    wrapper.appendChild(field);

    const meta = document.createElement("div");
    meta.className = "smart-suggestion-meta";
    meta.setAttribute("aria-live", "polite");
    wrapper.appendChild(meta);

    field.setAttribute("autocomplete", "off");
    field.setAttribute("spellcheck", "false");
    syncGhostMetrics(field);
    field.addEventListener("focus", () => updateSmartSuggestion(field));
    field.addEventListener("click", () => updateSmartSuggestion(field));
    field.addEventListener("scroll", () => syncGhostScroll(field));
    field.addEventListener("blur", () => {
      window.setTimeout(() => hideSmartSuggestion(field), 120);
    });
    field.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const active = smartSuggestionState.field === field && smartSuggestionState.suggestion;
      if (!active) return;
      event.preventDefault();
      acceptSmartSuggestion(field);
    });
  });
}

function getSmartFields() {
  const selectors = [
    "#reason",
    "#anamnesis",
    "#conclusion",
    "#customRecommendation",
    ...sectionDefs.map((section) => `#section-${section.id}`)
  ];
  return selectors.map((selector) => $(selector)).filter(Boolean);
}

function isSmartField(field) {
  return field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement
    ? Boolean(field.closest(".smart-field"))
    : false;
}

function updateSmartSuggestion(field) {
  syncGhostMetrics(field);

  const result = getBestSmartSuggestion(field);
  if (result) {
    applySmartSuggestion(field, result);
  } else {
    hideSmartSuggestion(field);
  }

  if (field.value.trim() && (!result || result.score < AI_FALLBACK_SCORE_THRESHOLD)) {
    scheduleAiSuggestion(field, result);
  } else {
    cancelAiSuggestion(field);
  }
}

function applySmartSuggestion(field, result) {
  const ghost = field.closest(".smart-field")?.querySelector(".smart-ghost");
  const meta = field.closest(".smart-field")?.querySelector(".smart-suggestion-meta");
  const wrapper = field.closest(".smart-field");
  if (!ghost || !meta) return;

  smartSuggestionState = {
    field,
    suggestion: result.text,
    source: result.source
  };

  ghost.innerHTML = buildGhostSuggestion(field.value, result.text, field.tagName === "TEXTAREA");
  ghost.classList.add("is-visible");
  wrapper?.classList.add("has-suggestion");
  meta.textContent = `${result.source || "подсказка"} • Tab - вставить`;
  meta.classList.add("is-visible");
  syncGhostScroll(field);
}

function hideSmartSuggestion(field) {
  const wrapper = field.closest(".smart-field");
  const ghost = wrapper?.querySelector(".smart-ghost");
  const meta = wrapper?.querySelector(".smart-suggestion-meta");
  if (ghost) {
    ghost.classList.remove("is-visible");
    ghost.innerHTML = "";
  }
  if (meta) {
    meta.classList.remove("is-visible");
    meta.textContent = "";
  }
  wrapper?.classList.remove("has-suggestion");
  if (smartSuggestionState.field === field) {
    smartSuggestionState = { field: null, suggestion: null, source: "" };
  }
}

function scheduleAiSuggestion(field, localResult) {
  const fieldId = field.id;
  cancelAiSuggestion(field);

  const requestId = ++aiSuggestionRequestId;
  const controller = new AbortController();
  aiSuggestionControllers.set(fieldId, controller);

  const timer = window.setTimeout(async () => {
    try {
      const response = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          field: field.id,
          label: getFieldLabel(field),
          value: field.value,
          localSuggestion: localResult?.text || "",
          context: collectAiContext()
        })
      });

      if (!response.ok) return;
      const payload = await response.json();
      if (controller.signal.aborted || requestId !== aiSuggestionRequestId) return;
      if (document.activeElement !== field) return;
      const text = normalizeSmartSuggestionText(field.id, payload.suggestion || "");
      if (!text || normalizeForSuggest(text) === normalizeForSuggest(field.value)) return;
      applySmartSuggestion(field, {
        text,
        source: payload.source || "Groq"
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.warn("AI suggestion failed", error);
      }
    }
  }, AI_SUGGESTION_DELAY_MS);

  aiSuggestionTimers.set(fieldId, timer);
}

function acceptSmartSuggestion(field) {
  const suggestion = smartSuggestionState.suggestion;
  if (!suggestion) return;
  cancelAiSuggestion(field);

  const current = field.value.trim();
  if (!current) {
    field.value = suggestion;
  } else if (startsWithNormalized(suggestion, current)) {
    field.value = suggestion;
  } else if (field.tagName === "TEXTAREA") {
    field.value = `${current}\n${suggestion}`;
  } else {
    field.value = suggestion;
  }

  field.dispatchEvent(new Event("input", { bubbles: true }));
  cancelAiSuggestion(field);
  moveCaretToEnd(field);
  hideSmartSuggestion(field);
}

function cancelAiSuggestion(field) {
  const fieldId = field.id;
  window.clearTimeout(aiSuggestionTimers.get(fieldId));
  aiSuggestionTimers.delete(fieldId);
  aiSuggestionControllers.get(fieldId)?.abort();
  aiSuggestionControllers.delete(fieldId);
}

function getBestSmartSuggestion(field) {
  const data = collectForm();
  const candidates = getSmartSuggestionCandidates(field, data);
  const current = field.value.trim();
  const currentNormalized = normalizeForSuggest(current);

  const ranked = candidates
    .map((candidate, index) => ({
      ...candidate,
      index,
      text: normalizeSmartSuggestionText(field.id, candidate.text),
      score: scoreSuggestion(candidate.text, currentNormalized, candidate.priority || 0)
    }))
    .filter((candidate) => candidate.text && normalizeForSuggest(candidate.text) !== currentNormalized)
    .filter((candidate) => !currentNormalized || scoreSuggestion(candidate.text, currentNormalized, candidate.priority || 0) > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index);

  return ranked[0] || null;
}

function collectAiContext() {
  const data = collectForm();
  const sections = {};
  sectionDefs.forEach((section) => {
    if (data.sections[section.id]) {
      sections[section.title] = data.sections[section.id];
    }
  });

  return {
    profile: profiles[data.profile]?.label || "",
    reason: data.reason,
    anamnesis: data.anamnesis,
    conclusion: data.conclusion,
    recommendations: data.recommendations,
    sections
  };
}

function getFieldLabel(field) {
  if (field.id?.startsWith("section-")) {
    const section = sectionDefs.find((item) => `section-${item.id}` === field.id);
    return section?.title || field.id;
  }

  const label = field.closest("label")?.querySelector("span")?.textContent;
  if (label) return label.trim();
  if (field.id === "conclusion") return "Заключение";
  if (field.id === "customRecommendation") return "Новая рекомендация";
  return field.id || "Поле";
}

function normalizeSmartSuggestionText(fieldId, text) {
  if (fieldId === "reason") {
    return text.replace(/\s+/g, " ").replace(/\s+([,.])/g, "$1").replace(/[.!?]+$/g, "").trim();
  }
  return normalizeSentence(text);
}

function getSmartSuggestionCandidates(field, data) {
  const id = field.id;
  const candidates = [];
  const profile = profiles[data.profile] || profiles.blank;

  const add = (text, source, priority = 0) => {
    if (text) candidates.push({ text, source, priority });
  };

  if (id === "reason") {
    add(profile.reason, "из выбранного профиля", 35);
    smartSuggestionSources.reason.forEach((text) => add(text, "из базы обращений", 20));
  } else if (id === "anamnesis") {
    add(profile.anamnesis, "из выбранного профиля", 35);
    smartSuggestionSources.anamnesis.forEach((text) => add(text, "по типовым анамнестическим данным", 18));
  } else if (id === "conclusion") {
    add(profile.conclusion, "из выбранного профиля", 35);
    smartSuggestionSources.conclusion.forEach((text) => add(text, "из вариантов заключения", 22));
  } else if (id === "customRecommendation") {
    recommendationBank.forEach((text) => add(text, "из банка рекомендаций", 20));
    getContextRecommendations(data).forEach((text) => add(text, "по заполненным полям", 28));
  } else if (id.startsWith("section-")) {
    const sectionId = id.replace("section-", "");
    const section = sectionDefs.find((item) => item.id === sectionId);
    add(profile.sections?.[sectionId], "из выбранного профиля", 35);
    section?.options.forEach((text) => add(text, "из предыдущих заключений", 21));
    getContextSectionSuggestions(sectionId, data).forEach((text) => add(text, "по заполненным полям", 30));
  }

  getDraftSuggestions(id).forEach((text) => add(text, "из сохраненных черновиков", 40));
  return uniqueSuggestions(candidates);
}

function getContextSectionSuggestions(sectionId, data) {
  return contextSuggestionRules
    .filter((rule) => rule.when(data))
    .map((rule) => rule.suggestions[sectionId])
    .filter(Boolean);
}

function getContextRecommendations(data) {
  const joined = `${data.conclusion} ${data.reason} ${Object.values(data.sections).join(" ")}`;
  const suggestions = [];
  if (/рас|аутизм|коммуникатив/i.test(joined)) {
    suggestions.push("Консультация психиатра.", "Занятия с нейропсихологом.");
  }
  if (/заикан|логоневроз|дыхани/i.test(joined)) {
    suggestions.push("Наблюдение у невролога. Соблюдение рекомендаций врача.", "Соблюдение речевого режима.");
  }
  if (/звукопроизнош|фонемат|слогов/i.test(joined)) {
    suggestions.push("Занятия с логопедом-дефектологом.");
  }
  return suggestions;
}

function getDraftSuggestions(fieldId) {
  return Object.values(readDrafts()).flatMap((draft) => {
    if (fieldId.startsWith("section-")) {
      const sectionId = fieldId.replace("section-", "");
      return draft.sections?.[sectionId] ? [draft.sections[sectionId]] : [];
    }
    if (fieldId === "customRecommendation") return draft.recommendations || [];
    return draft[fieldId] ? [draft[fieldId]] : [];
  });
}

function uniqueSuggestions(candidates) {
  const seen = new Set();
  return candidates.filter((candidate) => {
    const key = normalizeForSuggest(candidate.text);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function scoreSuggestion(text, currentNormalized, priority) {
  const normalized = normalizeForSuggest(text);
  if (!currentNormalized) return priority;
  if (normalized.startsWith(currentNormalized)) return priority + 100;
  if (normalized.includes(currentNormalized)) return priority + 60;

  const words = currentNormalized.split(" ").filter((word) => word.length > 2);
  const hits = words.filter((word) => normalized.includes(word)).length;
  return hits ? priority + hits * 12 : 0;
}

function buildSuggestionPreview(current, suggestion, isMultiline) {
  const trimmed = current.trim();
  const safeSuggestion = escapeHtml(suggestion);
  if (!trimmed) return safeSuggestion;

  if (startsWithNormalized(suggestion, trimmed)) {
    const suffix = suggestion.slice(trimmed.length);
    return `${escapeHtml(trimmed)}<span>${escapeHtml(suffix)}</span>`;
  }

  if (isMultiline) {
    return `<span>добавить абзац:</span> ${safeSuggestion}`;
  }

  return safeSuggestion;
}

function buildGhostSuggestion(current, suggestion, isMultiline) {
  const value = String(current || "");
  const suggestionText = String(suggestion || "");
  if (!suggestionText) return "";

  if (!value) {
    return `<span class="ghost-suffix">${escapeHtml(suggestionText)}</span>`;
  }

  if (startsWithNormalized(suggestionText, value)) {
    const suffix = suggestionText.slice(value.length);
    return `<span class="ghost-current">${escapeHtml(value)}</span><span class="ghost-suffix">${escapeHtml(suffix)}</span>`;
  }

  if (isMultiline) {
    return `<span class="ghost-current">${escapeHtml(value)}</span><span class="ghost-suffix">\n${escapeHtml(suggestionText)}</span>`;
  }

  return `<span class="ghost-current">${escapeHtml(value)}</span><span class="ghost-suffix"> ${escapeHtml(suggestionText)}</span>`;
}

function syncGhostMetrics(field) {
  const ghost = field.closest(".smart-field")?.querySelector(".smart-ghost");
  if (!ghost) return;
  const styles = window.getComputedStyle(field);
  const rect = field.getBoundingClientRect();
  ghost.style.height = `${rect.height}px`;
  ghost.style.maxHeight = `${rect.height}px`;
  ghost.style.minHeight = "0";
  ghost.style.padding = styles.padding;
  ghost.style.font = styles.font;
  ghost.style.lineHeight = styles.lineHeight;
  ghost.style.borderWidth = styles.borderWidth;
  ghost.style.boxSizing = styles.boxSizing;
  ghost.style.whiteSpace = field.tagName === "TEXTAREA" ? "pre-wrap" : "pre";
}

function syncGhostScroll(field) {
  const ghost = field.closest(".smart-field")?.querySelector(".smart-ghost");
  if (!ghost) return;
  ghost.scrollTop = field.scrollTop;
  ghost.scrollLeft = field.scrollLeft;
}

function startsWithNormalized(text, prefix) {
  return normalizeForSuggest(text).startsWith(normalizeForSuggest(prefix));
}

function normalizeForSuggest(text) {
  return String(text)
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[.,;:!?()[\]«»"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function moveCaretToEnd(field) {
  if (typeof field.selectionStart !== "number") return;
  const position = field.value.length;
  field.setSelectionRange(position, position);
}

function setInitialDates() {
  if (!$("#diagnosisDate").value) {
    $("#diagnosisDate").value = new Date().toISOString().slice(0, 10);
  }
}

function applyProfile(profileId) {
  const profile = profiles[profileId] || profiles.blank;
  $("#profile").value = profileId;
  $("#reason").value = profile.reason || "";
  $("#anamnesis").value = profile.anamnesis || "";

  sectionDefs.forEach((section) => {
    $(`#section-${section.id}`).value = profile.sections[section.id] || "";
  });

  $("#conclusion").value = profile.conclusion || "";
  const conclusion = conclusionOptions.find((item) => item.text === profile.conclusion);
  $("#conclusionPreset").value = conclusion ? conclusion.id : "";
  setRecommendationChecks(profile.recommendations || []);
  updatePreview();
}

function insertTemplate(sectionId) {
  const def = sectionDefs.find((item) => item.id === sectionId);
  const text = def.options[0] || "";
  const textarea = $(`#section-${sectionId}`);
  textarea.value = textarea.value.trim() ? `${textarea.value.trim()}\n${text}` : text;
  textarea.focus();
  updatePreview();
}

function suggestSection(sectionId) {
  const profile = profiles[$("#profile").value] || profiles.blank;
  const current = $(`#section-${sectionId}`).value.trim();
  const fromProfile = profile.sections[sectionId];

  if (fromProfile && !current) {
    $(`#section-${sectionId}`).value = fromProfile;
  } else if (current) {
    $(`#section-${sectionId}`).value = polishText(current);
  } else {
    insertTemplate(sectionId);
  }

  updatePreview();
  updateAssistant([
    {
      type: "info",
      text: "Раздел обновлен. Проверьте, что формулировка соответствует реальному обследованию."
    }
  ]);
}

function addCustomRecommendation() {
  const input = $("#customRecommendation");
  const text = normalizeSentence(input.value);
  if (!text) return;

  if (!recommendationBank.includes(text)) recommendationBank.push(text);
  renderRecommendations();
  setRecommendationChecks([...collectForm().recommendations, text]);
  input.value = "";
  updatePreview();
}

function setRecommendationChecks(selected) {
  const selectedSet = new Set(selected);
  $$("#recommendations input[type='checkbox']").forEach((input) => {
    input.checked = selectedSet.has(input.value);
  });
}

function collectForm() {
  const sections = {};
  sectionDefs.forEach((section) => {
    sections[section.id] = $(`#section-${section.id}`).value.trim();
  });

  return {
    profile: $("#profile").value,
    childName: $("#childName").value.trim(),
    birthDate: $("#birthDate").value,
    diagnosisDate: $("#diagnosisDate").value,
    gender: $("#gender").value,
    reason: $("#reason").value.trim(),
    anamnesis: $("#anamnesis").value.trim(),
    specialist: $("#specialist").value.trim(),
    sections,
    conclusion: $("#conclusion").value.trim(),
    recommendations: $$("#recommendations input[type='checkbox']:checked").map((input) => input.value)
  };
}

function applyDraft(draft) {
  $("#profile").value = draft.profile || "blank";
  $("#childName").value = draft.childName || "";
  $("#birthDate").value = draft.birthDate || "";
  $("#diagnosisDate").value = draft.diagnosisDate || "";
  $("#gender").value = draft.gender || "male";
  $("#reason").value = draft.reason || "";
  $("#anamnesis").value = draft.anamnesis || "";
  $("#specialist").value = draft.specialist || "Потапова Ирина Александровна";

  sectionDefs.forEach((section) => {
    $(`#section-${section.id}`).value = draft.sections?.[section.id] || "";
  });

  $("#conclusion").value = draft.conclusion || "";
  const conclusion = conclusionOptions.find((item) => item.text === draft.conclusion);
  $("#conclusionPreset").value = conclusion ? conclusion.id : "";
  setRecommendationChecks(draft.recommendations || []);
  updatePreview();
}

function updatePreview() {
  const data = collectForm();
  $("#documentPreview").innerHTML = renderDocumentHtml(data);
}

function renderDocumentHtml(data) {
  const nameLine = data.childName
    ? `${escapeHtml(data.childName)}${data.birthDate ? `, ${formatDate(data.birthDate)} г.р.` : ""}`
    : "ФИО ребенка";

  const age = calculateAgeText(data.birthDate, data.diagnosisDate);
  const ageLine = age
    ? `На момент обследования логопедом-дефектологом ребенку ${escapeHtml(age)}.`
    : "";

  const reportReason = formatReasonForReport(data.reason);
  const reasonLine = reportReason
    ? `${data.gender === "female" ? "Родители обратились" : "Родители обратились"} по поводу ${escapeHtml(reportReason)}.`
    : "";

  const sectionParagraphs = sectionDefs
    .map((section) => data.sections[section.id])
    .filter(Boolean)
    .map((text) => `<p>${escapeHtml(text)}</p>`)
    .join("");

  const recommendations = data.recommendations.length
    ? `<ul>${data.recommendations.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "";

  return `
    ${renderTemplatePreviewHeader()}
    <h2>Заключение по результатам логопедической диагностики</h2>
    <p class="subtitle">${nameLine}</p>
    ${data.diagnosisDate ? `<p>Дата диагностики: ${escapeHtml(formatDate(data.diagnosisDate))} г.</p>` : ""}
    ${ageLine ? `<p>${ageLine}</p>` : ""}
    ${reasonLine ? `<p>${reasonLine}</p>` : ""}
    ${data.anamnesis ? `<p>${escapeHtml(data.anamnesis)}</p>` : ""}
    ${sectionParagraphs ? `<p class="section-lead">В ходе обследования выявлено:</p>${sectionParagraphs}` : ""}
    ${
      data.conclusion
        ? `<p class="conclusion">Заключение по результатам проведенной логопедической диагностики:</p><p>${escapeHtml(data.conclusion)}</p>`
        : ""
    }
    ${recommendations ? `<p class="section-lead">Рекомендации:</p>${recommendations}` : ""}
    <p class="signature">Логопед-дефектолог: ${escapeHtml(data.specialist || "")}</p>
  `;
}

function renderTemplatePreviewHeader() {
  const imageUrl = getTemplateHeaderImageDataUrl();
  return imageUrl ? `<div class="template-preview-header"><img src="${imageUrl}" alt="" /></div>` : "";
}

function getTemplateHeaderImageDataUrl() {
  const rels = templateTextFile("word/_rels/header2.xml.rels");
  const target = rels.match(/Target="([^"]+)"/)?.[1];
  const imagePath = target ? `word/${target.replace(/^\.\.\//, "")}` : "word/media/image2.jpeg";
  const b64 = getTemplateBase64(imagePath) || getTemplateBase64("word/media/image2.jpeg");
  if (!b64) return "";

  const extension = imagePath.split(".").pop()?.toLowerCase();
  const mime =
    extension === "png" ? "image/png" : extension === "jpg" || extension === "jpeg" ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${b64}`;
}

function formatReasonForReport(reason) {
  const cleaned = String(reason || "")
    .replace(/^по\s+поводу\s+/i, "")
    .replace(/\s+/g, " ")
    .replace(/[.!?]+$/g, "")
    .trim();
  if (!cleaned) return "";

  const [head, ...tailParts] = cleaned.split(",").map((part) => part.trim()).filter(Boolean);
  const headGenitive = phraseToGenitive(head);
  const tail = tailParts.map((part) => dependentPhraseToGenitive(part)).filter(Boolean);
  return [headGenitive, ...tail].join(", ");
}

function phraseToGenitive(phrase) {
  const normalized = phrase.toLowerCase().replace(/ё/g, "е").trim();
  const exact = {
    "алалия": "алалии",
    "моторная алалия": "моторной алалии",
    "сенсорная алалия": "сенсорной алалии",
    "дислалия": "дислалии",
    "дизартрия": "дизартрии",
    "ринолалия": "ринолалии",
    "дисграфия": "дисграфии",
    "дислексия": "дислексии",
    "афазия": "афазии",
    "тахилалия": "тахилалии",
    "брадилалия": "брадилалии",
    "заикание": "заикания",
    "логоневроз": "логоневроза",
    "нарушение звукопроизношения": "нарушения звукопроизношения",
    "нарушение речи": "нарушения речи",
    "недостаточный уровень развития речи": "недостаточного уровня развития речи",
    "сложность коммуникации у ребенка": "сложности коммуникации у ребенка",
    "сложности коммуникации у ребенка": "сложностей коммуникации у ребенка",
    "отсутствие фразовой речи": "отсутствия фразовой речи",
    "трудности понимания обращенной речи": "трудностей понимания обращенной речи",
    "задержка речевого развития": "задержки речевого развития",
    "задержка психоречевого развития": "задержки психоречевого развития",
    "онр": "ОНР",
    "ффнр": "ФФНР",
    "зрр": "ЗРР",
    "зпрр": "ЗПРР",
    "рас": "РАС"
  };
  if (exact[normalized]) return preserveCapitalization(phrase, exact[normalized]);

  return phrase
    .split(" ")
    .map((word, index, words) => wordToGenitive(word, index === words.length - 1))
    .join(" ");
}

function wordToGenitive(word, isLast) {
  if (/^[А-ЯЁA-Z]{2,}$/.test(word)) return word;
  const lower = word.toLowerCase();
  let transformed = word;

  if (/(ая)$/i.test(word)) transformed = word.replace(/ая$/i, "ой");
  else if (/(яя)$/i.test(word)) transformed = word.replace(/яя$/i, "ей");
  else if (/(ый|ой)$/i.test(word)) transformed = word.replace(/(ый|ой)$/i, "ого");
  else if (/ий$/i.test(word)) transformed = word.replace(/ий$/i, "его");
  else if (isLast && /ие$/i.test(word)) transformed = word.replace(/ие$/i, "ия");
  else if (isLast && /ия$/i.test(word)) transformed = word.replace(/ия$/i, "ии");
  else if (isLast && /а$/i.test(word)) transformed = word.replace(/а$/i, "ы");
  else if (isLast && /я$/i.test(word)) transformed = word.replace(/я$/i, "и");
  else if (isLast && /ь$/i.test(word)) transformed = word.replace(/ь$/i, "и");
  else if (isLast && /(з|с|ц|ч|ш|щ|ж)$/i.test(word)) transformed = `${word}а`;

  if (lower === "речи" || lower === "коммуникации") return word;
  return transformed;
}

function dependentPhraseToGenitive(phrase) {
  return phrase
    .split(" ")
    .map((word, index) => {
      if (index > 0) return word;
      if (/аяся$/i.test(word)) return word.replace(/аяся$/i, "ейся");
      if (/ая$/i.test(word)) return word.replace(/ая$/i, "ой");
      if (/яя$/i.test(word)) return word.replace(/яя$/i, "ей");
      if (/ый$/i.test(word)) return word.replace(/ый$/i, "ого");
      if (/ий$/i.test(word)) return word.replace(/ий$/i, "его");
      return word;
    })
    .join(" ");
}

function preserveCapitalization(original, transformed) {
  return /^[А-ЯЁA-Z]/.test(original) ? transformed.charAt(0).toUpperCase() + transformed.slice(1) : transformed;
}

function buildPlainText(data) {
  const preview = document.createElement("div");
  preview.innerHTML = renderDocumentHtml(data);
  return preview.innerText.replace(/\n{3,}/g, "\n\n").trim();
}

function saveDraft() {
  const data = collectForm();
  const key = saveDraftData(data);
  refreshDraftSelect(key);
  toast("Черновик сохранен");
}

function saveDraftData(data) {
  const drafts = readDrafts();
  const key = makeDraftKey(data);
  drafts[key] = {
    ...data,
    savedAt: new Date().toISOString()
  };
  writeDrafts(drafts);
  return key;
}

function loadSelectedDraft() {
  const key = $("#draftSelect").value;
  if (!key) return;
  const drafts = readDrafts();
  if (drafts[key]) {
    applyDraft(drafts[key]);
    toast("Черновик открыт");
  }
}

function deleteSelectedDraft() {
  const key = $("#draftSelect").value;
  if (!key) return;
  const drafts = readDrafts();
  delete drafts[key];
  writeDrafts(drafts);
  refreshDraftSelect();
  toast("Черновик удален");
}

function readDrafts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeDrafts(drafts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

function refreshDraftSelect(selectedKey = "") {
  const drafts = readDrafts();
  const entries = Object.entries(drafts).sort((a, b) => {
    return String(b[1].savedAt || "").localeCompare(String(a[1].savedAt || ""));
  });

  $("#draftSelect").innerHTML =
    `<option value="">Черновики</option>` +
    entries
      .map(([key, draft]) => {
        const label = `${draft.childName || "Без имени"} ${draft.diagnosisDate ? formatDate(draft.diagnosisDate) : ""}`;
        return `<option value="${escapeHtml(key)}">${escapeHtml(label)}</option>`;
      })
      .join("");

  $("#draftSelect").value = selectedKey;
}

function makeDraftKey(data) {
  const safeName = data.childName || "Без имени";
  const date = data.diagnosisDate || new Date().toISOString().slice(0, 10);
  return `${safeName}__${date}`.toLowerCase();
}

async function copyDocumentText() {
  const text = buildPlainText(collectForm());
  await navigator.clipboard.writeText(text);
  toast("Текст скопирован");
}

async function suggestConclusionSummary() {
  const button = $("#summaryBtn");
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Думаю...";

  try {
    const response = await fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        context: collectAiContext(),
        options: conclusionOptions.map(({ id, label, text }) => ({ id, label, text }))
      })
    });
    const payload = await response.json();
    if (!response.ok || !payload.conclusion) {
      throw new Error(payload.error || "Не удалось получить резюме");
    }

    $("#conclusion").value = payload.conclusion;
    $("#conclusionPreset").value = payload.id || "";
    updatePreview();
    updateAssistant([
      {
        type: "info",
        text: payload.reason
          ? `ИИ резюме: ${payload.reason}`
          : "ИИ предложил наиболее подходящий вариант заключения. Проверьте формулировку перед экспортом."
      }
    ]);
  } catch (error) {
    updateAssistant([
      {
        type: "warn",
        text: "ИИ резюме не сработало. Можно выбрать вариант заключения вручную."
      }
    ]);
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

function runChecks() {
  const data = collectForm();
  const text = buildPlainText(data).toLowerCase();
  const findings = [];

  if (!data.childName) findings.push({ type: "warn", text: "Не заполнено ФИО ребенка." });
  if (!data.birthDate) findings.push({ type: "warn", text: "Не заполнена дата рождения." });
  if (!data.diagnosisDate) findings.push({ type: "warn", text: "Не заполнена дата диагностики." });
  if (!data.conclusion) findings.push({ type: "warn", text: "Не выбран итоговый вариант заключения." });
  if (!data.recommendations.length) findings.push({ type: "warn", text: "Не выбраны рекомендации." });

  if (text.includes("общее недоразвитие речи i уровня") && text.includes("развернутыми высказываниями")) {
    findings.push({
      type: "danger",
      text: "Проверьте сочетание ОНР I уровня и формулировки о развернутых высказываниях."
    });
  }

  if (text.includes("понимание обращенной речи не нарушено") && text.includes("понимает на бытовом уровне")) {
    findings.push({
      type: "danger",
      text: "Есть конфликт между полным пониманием речи и ситуативным бытовым пониманием."
    });
  }

  if (text.includes("фраза отсутствует") && text.includes("собственная речь ребенка представлена словами и простой фразой")) {
    findings.push({
      type: "danger",
      text: "Проверьте описание фразовой речи: одновременно указаны отсутствие фразы и простая фраза."
    });
  }

  if (!findings.length) {
    findings.push({ type: "info", text: "Явных пропусков и противоречий не найдено." });
  }

  updateAssistant(findings);
}

function polishAll() {
  sectionDefs.forEach((section) => {
    const textarea = $(`#section-${section.id}`);
    textarea.value = polishText(textarea.value);
  });
  $("#anamnesis").value = polishText($("#anamnesis").value);
  $("#reason").value = $("#reason").value.replace(/\s+/g, " ").trim();
  $("#conclusion").value = polishText($("#conclusion").value);
  updatePreview();
  updateAssistant([{ type: "info", text: "Текст вычитан локально: пробелы, повторы точек и окончания предложений приведены в порядок." }]);
}

function updateAssistant(items) {
  $("#assistantOutput").innerHTML = items
    .map((item) => `<div class="assistant-item ${item.type || "info"}">${escapeHtml(item.text)}</div>`)
    .join("");
}

function polishText(text) {
  return text
    .split("\n")
    .map((line) => normalizeSentence(line))
    .filter(Boolean)
    .join("\n");
}

function normalizeSentence(text) {
  let result = text.replace(/\s+/g, " ").replace(/\.\.+/g, ".").replace(/\s+([,.])/g, "$1").trim();
  if (!result) return "";
  if (!/[.!?]$/.test(result)) result += ".";
  return result;
}

function calculateAgeText(birthDate, diagnosisDate) {
  if (!birthDate || !diagnosisDate) return "";
  const birth = new Date(`${birthDate}T00:00:00`);
  const diagnosis = new Date(`${diagnosisDate}T00:00:00`);
  if (Number.isNaN(birth.getTime()) || Number.isNaN(diagnosis.getTime())) return "";
  if (diagnosis < birth) return "";

  let years = diagnosis.getFullYear() - birth.getFullYear();
  let months = diagnosis.getMonth() - birth.getMonth();
  if (diagnosis.getDate() < birth.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} ${plural(years, ["год", "года", "лет"])}`);
  if (months > 0) parts.push(`${months} ${plural(months, ["месяц", "месяца", "месяцев"])}`);
  return parts.join(" и ") || "0 месяцев";
}

function plural(number, forms) {
  const mod10 = number % 10;
  const mod100 = number % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}.${month}.${year}`;
}

function getFileBaseName(data) {
  const name = data.childName || "Заключение";
  const date = data.diagnosisDate ? `_${formatDate(data.diagnosisDate)}` : "";
  return `${name}${date}`.replace(/[\\/:*?"<>|]+/g, "").replace(/\s+/g, "_");
}

function toast(text) {
  const existing = $(".toast");
  if (existing) existing.remove();
  const element = document.createElement("div");
  element.className = "toast";
  element.textContent = text;
  document.body.appendChild(element);
  setTimeout(() => element.remove(), 2400);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function exportDocx() {
  const data = collectForm();
  const docxBlob = createDocxBlob(data);
  saveDraftData(data);
  refreshDraftSelect(makeDraftKey(data));
  const link = document.createElement("a");
  link.href = URL.createObjectURL(docxBlob);
  link.download = `${getFileBaseName(data)}.docx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
  toast("DOCX сформирован");
}

function createDocxBlob(data) {
  const files = hasDocxTemplate()
    ? decodeTemplateFiles()
    : {
        "[Content_Types].xml": contentTypesXml(),
        "_rels/.rels": packageRelsXml(),
        "word/_rels/document.xml.rels": documentRelsXml(),
        "word/styles.xml": stylesXml()
      };

  files["docProps/core.xml"] = coreXml(data);
  files["docProps/app.xml"] = appXml();
  files["word/document.xml"] = documentXml(data);
  ensureNumberingPart(files);

  return zipFiles(files, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
}

function documentXml(data) {
  const paragraphs = [];
  paragraphs.push(paragraph("Заключение по результатам логопедической диагностики", { bold: true, center: true, size: 28 }));
  paragraphs.push(paragraph(`${data.childName || "ФИО ребенка"}${data.birthDate ? `, ${formatDate(data.birthDate)} г.р.` : ""}`, { bold: true, center: true, size: 26 }));
  paragraphs.push(paragraph(""));

  if (data.diagnosisDate) paragraphs.push(paragraph(`Дата диагностики: ${formatDate(data.diagnosisDate)} г.`));
  const age = calculateAgeText(data.birthDate, data.diagnosisDate);
  if (age) paragraphs.push(paragraph(`На момент обследования логопедом-дефектологом ребенку ${age}.`));
  const reportReason = formatReasonForReport(data.reason);
  if (reportReason) paragraphs.push(paragraph(`Родители обратились по поводу ${reportReason}.`));
  if (data.anamnesis) splitParagraphs(data.anamnesis).forEach((text) => paragraphs.push(paragraph(text)));
  paragraphs.push(paragraph(""));
  paragraphs.push(paragraph("В ходе обследования выявлено:", { bold: true }));

  sectionDefs.forEach((section) => {
    const text = data.sections[section.id];
    if (text) splitParagraphs(text).forEach((part) => paragraphs.push(paragraph(part)));
  });

  if (data.conclusion) {
    paragraphs.push(paragraph(""));
    paragraphs.push(paragraph("Заключение по результатам проведенной логопедической диагностики:", { bold: true }));
    splitParagraphs(data.conclusion).forEach((part) => paragraphs.push(paragraph(part)));
  }

  if (data.recommendations.length) {
    paragraphs.push(paragraph(""));
    paragraphs.push(paragraph("Рекомендации:", { bold: true }));
    data.recommendations.forEach((item) => paragraphs.push(paragraph(item, { bullet: true })));
  }

  paragraphs.push(paragraph(""));
  paragraphs.push(paragraph(`Логопед-дефектолог:   ${data.specialist || ""}`));

  const bodyContent = paragraphs.join("\n");
  const templateDocument = documentXmlFromTemplate(bodyContent);
  if (templateDocument) return templateDocument;

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 wp14">
  <w:body>
    ${bodyContent}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/>
      <w:cols w:space="708"/>
      <w:docGrid w:linePitch="360"/>
    </w:sectPr>
  </w:body>
</w:document>`;
}

function documentXmlFromTemplate(bodyContent) {
  const templateXml = templateTextFile("word/document.xml");
  if (!templateXml) return "";

  const bodyOpen = "<w:body>";
  const bodyStart = templateXml.indexOf(bodyOpen);
  const sectPrMatch = templateXml.match(/<w:sectPr[\s\S]*?<\/w:sectPr>/);
  if (bodyStart === -1 || !sectPrMatch) return "";

  const prefix = templateXml.slice(0, bodyStart + bodyOpen.length);
  return `${prefix}${bodyContent}\n${sectPrMatch[0]}</w:body></w:document>`;
}

function hasDocxTemplate() {
  return Boolean(getTemplateBase64("word/document.xml"));
}

function getTemplateBase64(name) {
  return typeof window !== "undefined" && window.TEMPLATE_DOCX_FILES ? window.TEMPLATE_DOCX_FILES[name] : "";
}

function decodeTemplateFiles() {
  return Object.fromEntries(
    Object.entries(window.TEMPLATE_DOCX_FILES || {}).map(([name, b64]) => [name, base64ToBytes(b64)])
  );
}

function templateTextFile(name) {
  const b64 = getTemplateBase64(name);
  return b64 ? new TextDecoder().decode(base64ToBytes(b64)) : "";
}

function base64ToBytes(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function ensureNumberingPart(files) {
  files["word/numbering.xml"] = files["word/numbering.xml"] || numberingXml();
  files["[Content_Types].xml"] = ensureXmlBeforeClose(
    fileToText(files["[Content_Types].xml"]),
    "</Types>",
    '<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>',
    "/word/numbering.xml"
  );
  files["word/_rels/document.xml.rels"] = ensureXmlBeforeClose(
    fileToText(files["word/_rels/document.xml.rels"] || documentRelsXml()),
    "</Relationships>",
    '<Relationship Id="rId99" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>',
    "numbering.xml"
  );
}

function ensureXmlBeforeClose(xml, closeTag, insertion, marker) {
  if (!xml || xml.includes(marker)) return xml;
  return xml.replace(closeTag, `${insertion}${closeTag}`);
}

function fileToText(file) {
  return file instanceof Uint8Array ? new TextDecoder().decode(file) : String(file || "");
}

function splitParagraphs(text) {
  return text
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function paragraph(text, options = {}) {
  const pPr = [];
  if (options.center) pPr.push(`<w:jc w:val="center"/>`);
  if (options.bullet) {
    pPr.push(`<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>`);
  }
  pPr.push(`<w:spacing w:after="120" w:line="276" w:lineRule="auto"/>`);

  const rPr = [
    `<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>`,
    `<w:sz w:val="${options.size || 24}"/>`,
    `<w:szCs w:val="${options.size || 24}"/>`
  ];
  if (options.bold) rPr.push(`<w:b/><w:bCs/>`);

  return `<w:p>
    <w:pPr>${pPr.join("")}</w:pPr>
    <w:r>
      <w:rPr>${rPr.join("")}</w:rPr>
      <w:t xml:space="preserve">${escapeXml(text)}</w:t>
    </w:r>
  </w:p>`;
}

function contentTypesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;
}

function packageRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;
}

function documentRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
</Relationships>`;
}

function coreXml(data) {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${escapeXml(data.childName || "Логопедическое заключение")}</dc:title>
  <dc:creator>${escapeXml(data.specialist || "Логопед-дефектолог")}</dc:creator>
  <cp:lastModifiedBy>${escapeXml(data.specialist || "Логопед-дефектолог")}</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`;
}

function appXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Speech Report Builder</Application>
</Properties>`;
}

function stylesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
        <w:sz w:val="24"/>
        <w:szCs w:val="24"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:after="120" w:line="276" w:lineRule="auto"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
  </w:style>
</w:styles>`;
}

function numberingXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:abstractNum w:abstractNumId="0">
    <w:lvl w:ilvl="0">
      <w:start w:val="1"/>
      <w:numFmt w:val="bullet"/>
      <w:lvlText w:val="•"/>
      <w:lvlJc w:val="left"/>
      <w:pPr>
        <w:ind w:left="720" w:hanging="360"/>
      </w:pPr>
      <w:rPr>
        <w:rFonts w:ascii="Symbol" w:hAnsi="Symbol" w:hint="default"/>
      </w:rPr>
    </w:lvl>
  </w:abstractNum>
  <w:num w:numId="1">
    <w:abstractNumId w:val="0"/>
  </w:num>
</w:numbering>`;
}

function zipFiles(files, mimeType) {
  const encoder = new TextEncoder();
  const entries = [];
  let offset = 0;
  const chunks = [];

  Object.entries(files).forEach(([name, content]) => {
    const nameBytes = encoder.encode(name);
    const data = normalizeZipData(content, encoder);
    const crc = crc32(data);
    const localHeader = localFileHeader(nameBytes, data, crc);
    chunks.push(localHeader, data);
    entries.push({ nameBytes, data, crc, offset });
    offset += byteLength(localHeader) + byteLength(data);
  });

  const centralOffset = offset;
  entries.forEach((entry) => {
    const centralHeader = centralDirectoryHeader(entry.nameBytes, entry.data, entry.crc, entry.offset);
    chunks.push(centralHeader);
    offset += byteLength(centralHeader);
  });

  const centralSize = offset - centralOffset;
  chunks.push(endOfCentralDirectory(entries.length, centralSize, centralOffset));

  return new Blob(chunks, { type: mimeType });
}

function normalizeZipData(content, encoder) {
  if (content instanceof Uint8Array) return content;
  if (content instanceof ArrayBuffer) return new Uint8Array(content);
  return encoder.encode(content);
}

function byteLength(chunk) {
  return chunk.byteLength ?? chunk.length ?? 0;
}

function localFileHeader(nameBytes, data, crc) {
  const buffer = new ArrayBuffer(30 + nameBytes.length);
  const view = new DataView(buffer);
  view.setUint32(0, 0x04034b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 0x0800, true);
  view.setUint16(8, 0, true);
  view.setUint16(10, 0, true);
  view.setUint16(12, 0, true);
  view.setUint32(14, crc, true);
  view.setUint32(18, data.length, true);
  view.setUint32(22, data.length, true);
  view.setUint16(26, nameBytes.length, true);
  view.setUint16(28, 0, true);
  new Uint8Array(buffer, 30).set(nameBytes);
  return buffer;
}

function centralDirectoryHeader(nameBytes, data, crc, localOffset) {
  const buffer = new ArrayBuffer(46 + nameBytes.length);
  const view = new DataView(buffer);
  view.setUint32(0, 0x02014b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 20, true);
  view.setUint16(8, 0x0800, true);
  view.setUint16(10, 0, true);
  view.setUint16(12, 0, true);
  view.setUint16(14, 0, true);
  view.setUint32(16, crc, true);
  view.setUint32(20, data.length, true);
  view.setUint32(24, data.length, true);
  view.setUint16(28, nameBytes.length, true);
  view.setUint16(30, 0, true);
  view.setUint16(32, 0, true);
  view.setUint16(34, 0, true);
  view.setUint16(36, 0, true);
  view.setUint32(38, 0, true);
  view.setUint32(42, localOffset, true);
  new Uint8Array(buffer, 46).set(nameBytes);
  return buffer;
}

function endOfCentralDirectory(entryCount, centralSize, centralOffset) {
  const buffer = new ArrayBuffer(22);
  const view = new DataView(buffer);
  view.setUint32(0, 0x06054b50, true);
  view.setUint16(4, 0, true);
  view.setUint16(6, 0, true);
  view.setUint16(8, entryCount, true);
  view.setUint16(10, entryCount, true);
  view.setUint32(12, centralSize, true);
  view.setUint32(16, centralOffset, true);
  view.setUint16(20, 0, true);
  return buffer;
}

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(data) {
  let crc = 0xffffffff;
  for (let index = 0; index < data.length; index += 1) {
    crc = crcTable[(crc ^ data[index]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

init();
