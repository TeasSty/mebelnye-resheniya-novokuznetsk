const menuButton = document.querySelector(".menu-button");
const menu = document.querySelector(".nav");

menuButton.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.querySelector(".sr-only").textContent = isOpen ? "Закрыть меню" : "Открыть меню";
});

menu.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    menu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

const solutionTabs = [...document.querySelectorAll(".solution-tab")];
const technicalPlans = [...document.querySelectorAll(".technical-plan")];
const solutionKicker = document.querySelector(".solution-kicker");
const solutionTitle = document.querySelector(".solution-caption h3");
const solutionCopy = document.querySelector(".solution-copy");
const solutionStage = document.querySelector(".solution-stage");
const solutionContent = {
  kitchen: {
    kicker: "Что получаем",
    title: "Рабочая линия без случайных зазоров",
    copy: "Сопоставляем ширину стены, высоту потолка, расположение техники и нужное количество хранения."
  },
  wardrobe: {
    kicker: "Что получаем",
    title: "Наполнение под ваши вещи",
    copy: "Распределяем полки, штанги и ящики с учётом ширины ниши, высоты потолка и состава хранения."
  },
  office: {
    kicker: "Что получаем",
    title: "Рабочее место без тесноты",
    copy: "Объединяем стол, тумбу, верхние секции и вывод проводов в компактную конструкцию для конкретной стены."
  }
};

function selectSolution(tab) {
  const key = tab.dataset.solution;
  const content = solutionContent[key];
  solutionTabs.forEach((item) => {
    const isSelected = item === tab;
    item.classList.toggle("active", isSelected);
    item.setAttribute("aria-selected", String(isSelected));
    item.tabIndex = isSelected ? 0 : -1;
  });
  technicalPlans.forEach((plan) => {
    const isSelected = plan.dataset.plan === key;
    plan.toggleAttribute("hidden", !isSelected);
    plan.classList.toggle("active", isSelected);
  });
  solutionStage.setAttribute("aria-labelledby", tab.id);
  solutionKicker.textContent = content.kicker;
  solutionTitle.textContent = content.title;
  solutionCopy.textContent = content.copy;
}

solutionTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectSolution(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1;
    const nextTab = solutionTabs[(index + direction + solutionTabs.length) % solutionTabs.length];
    selectSolution(nextTab);
    nextTab.focus();
  });
});
selectSolution(solutionTabs[0]);

const form = document.querySelector("#quiz-form");
const steps = [...document.querySelectorAll(".quiz-step")];
const nextButton = document.querySelector(".quiz-next");
const backButton = document.querySelector(".quiz-back");
const submitButton = document.querySelector(".quiz-submit");
const progressLabel = document.querySelector("#progress-label");
const progressBar = document.querySelector("#progress-bar");
const error = document.querySelector(".quiz-error");
let currentStep = 0;

function showStep(index) {
  currentStep = index;
  steps.forEach((step, stepIndex) => step.classList.toggle("active", stepIndex === index));
  progressLabel.textContent = `Шаг ${index + 1} из ${steps.length}`;
  progressBar.style.width = `${((index + 1) / steps.length) * 100}%`;
  backButton.hidden = index === 0;
  nextButton.hidden = index === steps.length - 1;
  submitButton.hidden = index !== steps.length - 1;
  error.textContent = "";
}

nextButton.addEventListener("click", () => {
  const fieldset = steps[currentStep];
  if (!fieldset.querySelector("input:checked")) {
    error.textContent = "Выберите один из вариантов.";
    return;
  }
  showStep(currentStep + 1);
});

backButton.addEventListener("click", () => showStep(currentStep - 1));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const product = data.get("product") || "мебель";
  const details = data.get("details") || "пока нет деталей";
  const comment = String(data.get("comment") || "").trim();
  const message = [
    `Здравствуйте! Хочу заказать ${product}.`,
    `По задаче: ${details}.`,
    comment ? `Комментарий: ${comment}` : "",
    "Подскажите, пожалуйста, как получить предварительный расчёт?"
  ].filter(Boolean).join("\n");

  navigator.clipboard?.writeText(message).catch(() => {});
  window.open("https://vk.ru/meb_resh_nkvz", "_blank", "noopener");
});
