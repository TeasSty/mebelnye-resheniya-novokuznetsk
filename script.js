const menuButton = document.querySelector(".menu-button");
const menu = document.querySelector(".nav");

menuButton.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

menu.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    menu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

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
