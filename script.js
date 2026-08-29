if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function resetScrollPosition() {
  if (!window.location.hash) window.scrollTo(0, 0);
}

window.addEventListener("load", () => requestAnimationFrame(resetScrollPosition));
window.addEventListener("pageshow", resetScrollPosition);

const menuButton = document.querySelector(".menu-button");
const menu = document.querySelector(".nav");
const mobileMenuMedia = window.matchMedia("(max-width: 900px)");
let menuFocusTimer;

function setMenuState(isOpen, restoreFocus = false) {
  window.clearTimeout(menuFocusTimer);
  menu.classList.toggle("open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.querySelector(".sr-only").textContent = isOpen ? "Закрыть меню" : "Открыть меню";
  if (isOpen) {
    menuFocusTimer = window.setTimeout(() => menu.querySelector("a")?.focus(), 330);
  } else if (restoreFocus) {
    menuButton.focus();
  }
}

menuButton.addEventListener("click", () => {
  setMenuState(menuButton.getAttribute("aria-expanded") !== "true");
});

menu.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    setMenuState(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (menuButton.getAttribute("aria-expanded") !== "true") return;
  if (event.key === "Escape") {
    event.preventDefault();
    setMenuState(false, true);
    return;
  }
  if (event.key !== "Tab") return;
  const focusable = [menuButton, ...menu.querySelectorAll("a")];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

mobileMenuMedia.addEventListener("change", (event) => {
  if (!event.matches) setMenuState(false);
});

const marquee = document.querySelector(".marquee");
const marqueeTrack = document.querySelector(".marquee-track");
let marqueeResizeFrame;

function buildSeamlessMarquee() {
  window.cancelAnimationFrame(marqueeResizeFrame);
  marqueeResizeFrame = window.requestAnimationFrame(() => {
    const sourceGroup = marqueeTrack.querySelector(".marquee-group");
    [...marqueeTrack.children].slice(1).forEach((group) => group.remove());
    const groupWidth = sourceGroup.getBoundingClientRect().width;
    if (!groupWidth) return;

    const groupCount = Math.max(3, Math.ceil((marquee.clientWidth * 2) / groupWidth) + 1);
    for (let index = 1; index < groupCount; index += 1) {
      const clone = sourceGroup.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      marqueeTrack.append(clone);
    }

    marqueeTrack.style.setProperty("--marquee-distance", `${-groupWidth}px`);
    marqueeTrack.style.setProperty("--marquee-duration", `${groupWidth / 72}s`);
  });
}

buildSeamlessMarquee();
new ResizeObserver(buildSeamlessMarquee).observe(marquee);
document.fonts?.ready.then(buildSeamlessMarquee);

const solutionTabs = [...document.querySelectorAll(".solution-tab")];
const technicalPlans = [...document.querySelectorAll(".technical-plan")];
const solutionKicker = document.querySelector(".solution-kicker");
const solutionTitle = document.querySelector(".solution-caption h3");
const solutionCopy = document.querySelector(".solution-copy");
const planMobileSummary = document.querySelector(".plan-mobile-summary");
const solutionStage = document.querySelector(".solution-stage");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const solutionContent = {
  kitchen: {
    kicker: "Что получаем",
    title: "Рабочая линия без случайных зазоров",
    copy: "Сопоставляем ширину стены, высоту потолка, расположение техники и нужное количество хранения.",
    labels: "Столешница · ящики · техника"
  },
  wardrobe: {
    kicker: "Что получаем",
    title: "Наполнение под ваши вещи",
    copy: "Распределяем полки, штанги и ящики с учётом ширины ниши, высоты потолка и состава хранения.",
    labels: "Шкаф до потолка · полки · ящики"
  },
  office: {
    kicker: "Что получаем",
    title: "Рабочее место без тесноты",
    copy: "Сочетаем стол, тумбу и отдельный шкаф в свободной композиции для конкретной стены.",
    labels: "Столешница · тумба · полки"
  }
};

function animatePlan(plan) {
  if (!plan || reducedMotion) return;
  plan.classList.remove("is-building");
  void plan.getBoundingClientRect();
  plan.classList.add("is-building");
}

function selectSolution(tab, shouldAnimate = true) {
  const key = tab.dataset.solution;
  const content = solutionContent[key];
  let activePlan;
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
    if (isSelected) activePlan = plan;
  });
  solutionStage.setAttribute("aria-labelledby", tab.id);
  solutionKicker.textContent = content.kicker;
  solutionTitle.textContent = content.title;
  solutionCopy.textContent = content.copy;
  planMobileSummary.textContent = content.labels;
  if (shouldAnimate) animatePlan(activePlan);
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
selectSolution(solutionTabs[0], false);

const heroVisual = document.querySelector(".hero-visual");
const solutionLab = document.querySelector(".solution-lab");

document.querySelectorAll(".draw-line").forEach((line) => {
  line.style.setProperty("--path-length", `${Math.ceil(line.getTotalLength())}px`);
  line.style.setProperty("--draw-delay", `${Number(line.dataset.delay || 0)}ms`);
});

if (reducedMotion || !("IntersectionObserver" in window)) {
  heroVisual.classList.add("is-visible");
  if (!reducedMotion) animatePlan(technicalPlans[0]);
} else {
  const heroObserver = new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    heroVisual.classList.add("is-visible");
    observer.disconnect();
  }, { threshold: 0.2 });
  heroObserver.observe(heroVisual);

  const planObserver = new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    animatePlan(document.querySelector(".technical-plan:not([hidden])"));
    observer.disconnect();
  }, { threshold: 0.25 });
  planObserver.observe(solutionLab);
}

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
  if (currentStep >= steps.length - 1) return;
  const fieldset = steps[currentStep];
  const choices = fieldset.querySelectorAll("input[type='radio']");
  if (choices.length && !fieldset.querySelector("input:checked")) {
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
