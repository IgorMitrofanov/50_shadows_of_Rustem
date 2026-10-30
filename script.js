'use strict';

const methods = [...document.querySelectorAll('.method')];
const workshop = document.querySelector('.workshop-image');
const sceneDescriptions = {
  pcb: 'Крупный план печатной платы и точная работа щупом',
  solder: 'Паяльник в мастерской и поднимающийся над ним дым',
  diagnostics: 'Рустем изучает схему на мониторе в мастерской',
};

methods.forEach((method) => {
  method.addEventListener('toggle', () => {
    if (!method.open) return;
    methods.forEach((other) => { if (other !== method) other.open = false; });
    workshop.dataset.scene = method.dataset.scene;
    workshop.setAttribute('aria-label', sceneDescriptions[method.dataset.scene]);
  });
});

const range = document.getElementById('resistance-range');
const reading = document.getElementById('resistance-value');
const mood = document.getElementById('resistance-message');

function updateResistance() {
  const value = Number(range.value);
  reading.value = String(value);
  range.setAttribute('aria-valuetext', `${value} Ом`);
  mood.textContent = value < 10
    ? 'Контакт установлен. Можно без лишних слов.'
    : value < 30
      ? 'Небольшое сопротивление только добавляет интереса.'
      : value < 50
        ? 'Сложный характер. Интересная схема.'
        : 'У каждого свои границы. У этой истории: 50 Ом.';
}
range.addEventListener('input', updateResistance);
updateResistance();

const briefForm = document.getElementById('brief-form');
const projectType = document.getElementById('project-type');
const projectDescription = document.getElementById('project-description');
const formStatus = document.getElementById('form-status');
const copyFallback = document.getElementById('copy-fallback');
const briefResult = document.getElementById('brief-result');
const contactEmail = 'i.v.mitrofanov@ya.ru';

function createBrief() {
  return `Здравствуйте! Хочу обсудить задачу.\n\nНаправление: ${projectType.value}\n\n${projectDescription.value.trim()}\n\nПисьмо с сайта «50 оттенков Рустема».`;
}

function validBrief() {
  if (!projectDescription.value.trim()) {
    projectDescription.setCustomValidity('Опишите задачу хотя бы в нескольких словах.');
  } else {
    projectDescription.setCustomValidity('');
  }
  return briefForm.reportValidity();
}

projectDescription.addEventListener('input', () => {
  projectDescription.setCustomValidity('');
  formStatus.textContent = '';
  copyFallback.hidden = true;
});
projectType.addEventListener('change', () => {
  formStatus.textContent = '';
  copyFallback.hidden = true;
});

briefForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validBrief()) return;
  const subject = encodeURIComponent(`Задача для Рустема: ${projectType.value}`);
  const body = encodeURIComponent(createBrief());
  window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  formStatus.textContent = 'Черновик передан почтовому приложению. Если оно не открылось, скопируйте бриф и напишите на i.v.mitrofanov@ya.ru.';
});

document.getElementById('copy-brief').addEventListener('click', async () => {
  if (!validBrief()) return;
  try {
    await navigator.clipboard.writeText(createBrief());
    copyFallback.hidden = true;
    formStatus.textContent = 'Бриф скопирован. Его можно вставить в письмо или сообщение.';
  } catch {
    briefResult.value = createBrief();
    copyFallback.hidden = false;
    briefResult.focus();
    briefResult.select();
    formStatus.textContent = 'Браузер не разрешил копирование. Выделенный текст можно скопировать вручную.';
  }
});
