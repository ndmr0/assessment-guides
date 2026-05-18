const checks = Array.from(document.querySelectorAll("[data-check]"));
const progressBar = document.querySelector("[data-progress-bar]");
const progressCount = document.querySelector("[data-progress-count]");
const resetButton = document.querySelector("[data-reset]");
const printButton = document.querySelector("[data-print]");
const navLinks = Array.from(document.querySelectorAll(".sidebar nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const storageKey = "a50201-ideation-innovation-and-design-assessment-1-checks";

function readState() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function writeState() {
  const state = {};
  checks.forEach((check, index) => {
    state[index] = check.checked;
  });
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function updateProgress() {
  const total = checks.length;
  const done = checks.filter((check) => check.checked).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  if (progressBar) progressBar.style.width = `${percent}%`;
  if (progressCount) progressCount.textContent = `${done} of ${total} checked`;
}

function hydrateChecks() {
  const state = readState();
  checks.forEach((check, index) => {
    check.checked = Boolean(state[index]);
    check.addEventListener("change", () => {
      writeState();
      updateProgress();
    });
  });
  updateProgress();
}

function resetChecks() {
  checks.forEach((check) => {
    check.checked = false;
  });
  writeState();
  updateProgress();
}

function setActiveNav() {
  const offset = 140;
  const current = sections.reduce((active, section) => {
    const top = section.getBoundingClientRect().top;
    return top <= offset ? section : active;
  }, sections[0]);

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`);
  });
}

hydrateChecks();
setActiveNav();

window.addEventListener("scroll", setActiveNav, { passive: true });
resetButton?.addEventListener("click", resetChecks);
printButton?.addEventListener("click", () => window.print());
