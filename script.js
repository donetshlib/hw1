// 1) Глобальний об'єкт БЕЗ наперед заданих полів/значень
const globalData = {};

const num1El = document.getElementById("num1");
const num2El = document.getElementById("num2");
const opEl   = document.getElementById("op");
const calcBtn = document.getElementById("calcBtn");
const padEl = document.getElementById("pad");
const targetNameEl = document.getElementById("targetName");

let activeField = num1El;

function setActiveField(el) {
  activeField = el;
  targetNameEl.textContent =
    el === num1El ? "Перше число" :
    el === num2El ? "Друге число" : "Операція";
}

function saveFieldToGlobal(fieldName, value) {
  const v = value.trim();
  if (v === "") delete globalData[fieldName];
  else globalData[fieldName] = v;
}

// 2) Збереження при втраті фокусу (blur)
num1El.addEventListener("blur", () => saveFieldToGlobal("num1", num1El.value));
num2El.addEventListener("blur", () => saveFieldToGlobal("num2", num2El.value));
opEl.addEventListener("blur",   () => saveFieldToGlobal("op", opEl.value));

num1El.addEventListener("focus", () => setActiveField(num1El));
num2El.addEventListener("focus", () => setActiveField(num2El));
opEl.addEventListener("focus",   () => setActiveField(opEl));

function parseNumber(str) {
  const s = str.replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function calculate() {
  // якщо blur ще не стався — збережемо вручну
  saveFieldToGlobal("num1", num1El.value);
  saveFieldToGlobal("num2", num2El.value);
  saveFieldToGlobal("op", opEl.value);

  if (!globalData.num1) return alert("Введіть перше число.");
  if (!globalData.num2) return alert("Введіть друге число.");
  if (!globalData.op)   return alert("Введіть операцію (+, -, *, /).");

  const a = parseNumber(globalData.num1);
  const b = parseNumber(globalData.num2);

  if (a === null) return alert("Перше число введено некоректно.");
  if (b === null) return alert("Друге число введено некоректно.");

  const op = globalData.op;
  let res;

  if (op === "+") res = a + b;
  else if (op === "-") res = a - b;
  else if (op === "*") res = a * b;
  else if (op === "/") {
    if (b === 0) return alert("Ділення на нуль неможливе.");
    res = a / b;
  } else {
    return alert("Невідома операція. Дозволено: +, -, *, /");
  }

  alert(`Результат: ${res}`);
}

calcBtn.addEventListener("click", calculate);

// ---- Клавіатура ----
const buttons = [
  "7","8","9","/",
  "4","5","6","*",
  "1","2","3","-",
  "0",".","C","+"
];

function appendToActive(value) {
  if (activeField === opEl) {
    if (["+","-","*","/"].includes(value)) opEl.value = value;
    return;
  }

  if (value === ".") {
    if (!activeField.value.includes(".") && !activeField.value.includes(",")) {
      activeField.value += ".";
    }
    return;
  }

  if (/^\d$/.test(value)) activeField.value += value;
}

function clearActive() {
  activeField.value = "";
  if (activeField === num1El) delete globalData.num1;
  if (activeField === num2El) delete globalData.num2;
  if (activeField === opEl) delete globalData.op;
}

buttons.forEach(txt => {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = txt;

  b.addEventListener("click", () => {
    if (txt === "C") return clearActive();

    if (["+","-","*","/"].includes(txt)) {
      opEl.value = txt;
      setActiveField(opEl);
      saveFieldToGlobal("op", opEl.value);
      return;
    }

    appendToActive(txt);

    if (activeField === num1El) saveFieldToGlobal("num1", num1El.value);
    if (activeField === num2El) saveFieldToGlobal("num2", num2El.value);
    if (activeField === opEl)   saveFieldToGlobal("op", opEl.value);
  });

  padEl.appendChild(b);
});

const eq = document.createElement("button");
eq.type = "button";
eq.textContent = "=";
eq.style.gridColumn = "1 / -1";
eq.addEventListener("click", calculate);
padEl.appendChild(eq);

setActiveField(num1El);
