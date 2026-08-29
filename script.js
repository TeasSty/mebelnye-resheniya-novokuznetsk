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
const assembly = document.querySelector(".assembly");
const solutionKicker = document.querySelector(".solution-kicker");
const solutionTitle = document.querySelector(".solution-caption h3");
const solutionCopy = document.querySelector(".solution-copy");
const assemblyState = document.querySelector(".assembly-state");
const solutionStage = document.querySelector(".solution-stage");
const solutionContent = {
  kitchen: {
    kicker: "Проектируется вокруг помещения",
    title: "Кухня без случайных зазоров",
    copy: "Расположение секций и рабочей поверхности подбирается под размеры комнаты и привычный порядок действий.",
    state: "Схема 01 / кухня"
  },
  wardrobe: {
    kicker: "Каждая секция решает задачу",
    title: "Хранение на своём месте",
    copy: "Ширина отделений, полки и штанги распределяются под вещи владельца и геометрию конкретной ниши.",
    state: "Схема 02 / шкаф"
  },
  office: {
    kicker: "Работает каждый сантиметр",
    title: "Рабочая зона без тесноты",
    copy: "Стол, хранение и открытые полки объединяются в композицию, которая не перегружает небольшую комнату.",
    state: "Схема 03 / рабочая зона"
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
  assembly.className = `assembly assembly-${key}`;
  solutionStage.setAttribute("aria-labelledby", tab.id);
  solutionKicker.textContent = content.kicker;
  solutionTitle.textContent = content.title;
  solutionCopy.textContent = content.copy;
  assemblyState.textContent = content.state;
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
