// ======================================================
// ЗДАВ — ЗАБУВ
// Основний JavaScript сайту
const SITE_BUILD = "2026-10-17-clean";
// ======================================================


// ------------------------------------------------------
// 1. TELEGRAM
// ------------------------------------------------------

const TELEGRAM_USERNAME = "shlak0block";


// ------------------------------------------------------
// 2. ТИПИ РОБІТ І ЦІНИ
// ------------------------------------------------------

const typeData = {

  essay: {
    name: "Есе",
    min: 200,
    max: 500,
    pMin: 2,
    pMax: 15,
    uMin: 40,
    uMax: 90
  },

  abstract: {
    name: "Реферат",
    min: 200,
    max: 600,
    pMin: 5,
    pMax: 25,
    uMin: 40,
    uMax: 90
  },

  theses: {
    name: "Тези",
    min: 200,
    max: 500,
    pMin: 2,
    pMax: 10,
    uMin: 40,
    uMax: 90
  },

  report: {
    name: "Доповідь",
    min: 300,
    max: 900,
    pMin: 3,
    pMax: 15,
    uMin: 40,
    uMax: 90
  },

  article: {
    name: "Стаття",
    min: 400,
    max: 2000,
    pMin: 5,
    pMax: 25,
    uMin: 50,
    uMax: 95
  },

  presentation: {
    name: "Презентація",
    min: 250,
    max: 1000,
    pMin: 5,
    pMax: 30,
    uMin: 0,
    uMax: 0
  },

  business: {
    name: "Бізнес-план",
    min: 700,
    max: 2000,
    pMin: 15,
    pMax: 60,
    uMin: 40,
    uMax: 90
  },

  practical: {
    name: "Практична робота",
    min: 300,
    max: 1500,
    pMin: 5,
    pMax: 40,
    uMin: 40,
    uMax: 90
  },

  annotation: {
    name: "Анотація",
    min: 200,
    max: 500,
    pMin: 1,
    pMax: 8,
    uMin: 40,
    uMax: 90
  },

  explanatory: {
    name: "Пояснювальна записка",
    min: 1000,
    max: 4000,
    pMin: 15,
    pMax: 80,
    uMin: 40,
    uMax: 90
  },

  course: {
    name: "Курсова робота",
    min: 900,
    max: 2000,
    pMin: 20,
    pMax: 50,
    uMin: 50,
    uMax: 90
  },

  bachelor: {
    name: "Бакалаврська робота",
    min: 3500,
    max: null,
    pMin: 45,
    pMax: 100,
    uMin: 50,
    uMax: 95
  },

  diploma: {
    name: "Дипломна робота",
    min: 3500,
    max: null,
    pMin: 45,
    pMax: 110,
    uMin: 50,
    uMax: 95
  },

  master: {
    name: "Магістерська робота",
    min: 4000,
    max: null,
    pMin: 55,
    pMax: 120,
    uMin: 50,
    uMax: 95
  },

  dissertation: {
    name: "Дисертація",
    min: 20000,
    max: null,
    pMin: 100,
    pMax: 300,
    uMin: 60,
    uMax: 95
  }

};


// ------------------------------------------------------
// 3. КОЕФІЦІЄНТ ТЕРМІНОВОСТІ
// ------------------------------------------------------

const urgency = {
  3: 1.28,
  7: 1.14,
  14: 1.00,
  21: 0.96
};


// ------------------------------------------------------
// 4. ДОПОМІЖНІ ФУНКЦІЇ
// ------------------------------------------------------

const $ = selector => document.querySelector(selector);

const workType = $("#workType");
const field = $("#field");
const pages = $("#pages");
const uniqueness = $("#uniqueness");

const addons = [
  ...document.querySelectorAll(".addons input")
];


function round50(number) {
  return Math.round(number / 50) * 50;
}


function getDays() {

  const selected = document.querySelector(
    'input[name="days"]:checked'
  );

  return selected ? Number(selected.value) : 14;
}


// ------------------------------------------------------
// 5. ДІАПАЗОНИ СТОРІНОК ТА УНІКАЛЬНОСТІ
// ------------------------------------------------------

function setRanges() {

  const type = typeData[workType.value];
  if (!type) return;

  // Сторінки

  pages.min = type.pMin;
  pages.max = type.pMax;

  if (
    Number(pages.value) < type.pMin ||
    Number(pages.value) > type.pMax
  ) {

    pages.value = Math.round(
      (type.pMin + type.pMax) / 2
    );
  }


  // Унікальність

  if (type.uMin === 0) {

    uniqueness.disabled = true;

    uniqueness.min = 0;
    uniqueness.max = 0;
    uniqueness.value = 0;

  } else {

    uniqueness.disabled = false;

    uniqueness.min = type.uMin;
    uniqueness.max = type.uMax;

    if (
      Number(uniqueness.value) < type.uMin ||
      Number(uniqueness.value) > type.uMax
    ) {

      uniqueness.value = Math.max(
        type.uMin,
        70
      );
    }
  }
}


// ------------------------------------------------------
// 6. КАЛЬКУЛЯТОР
// ------------------------------------------------------

let discountToastTimer = null;
let lastDiscountSignature = "";

function calculate() {

  const type = typeData[workType.value];
  if (!type || !field.value) {
    $("#summaryType").textContent = "Оберіть параметри";
    $("#summaryMeta").textContent = "Тип роботи та предмет ще не вибрано";
    $("#price").textContent = "— ₴";
    $("#priceLimits").textContent = "Оберіть тип роботи та предмет, щоб побачити попередню ціну";
    const discountBox = $("#degreeDiscount");
    if (discountBox) { discountBox.classList.remove("show"); discountBox.innerHTML = ""; }
    return null;
  }

  const pageCount = Number(pages.value);

  const uniqueValue =
    Number(uniqueness.value);

  const selectedDays =
    getDays();

  const fieldCoefficient =
    Number(field.value);


  // Положення повзунка сторінок

  const pageRatio =
    (pageCount - type.pMin) /
    Math.max(
      1,
      type.pMax - type.pMin
    );


  // Положення повзунка унікальності

  const uniquenessRatio =
    type.uMin === 0
      ? 0
      : (
          uniqueValue - type.uMin
        ) /
        Math.max(
          1,
          type.uMax - type.uMin
        );


  // Додаткові послуги

  const selectedAddons = addons.filter(addon => addon.checked);

  const isDegreeWork = ["course", "bachelor", "diploma", "master"].includes(workType.value);

  const addonTotal = selectedAddons.reduce((sum, addon) => {
    if (isDegreeWork && addon.dataset.name === "Презентація") return sum + 300;
    if (isDegreeWork && addon.dataset.name === "Доповідь до захисту") return sum + 200;
    return sum + Number(addon.value);
  }, 0);


  let basePrice;


  // --------------------------------------------------
  // РОБОТИ З МІНІМАЛЬНОЮ ТА МАКСИМАЛЬНОЮ ЦІНОЮ
  // --------------------------------------------------

  if (type.max !== null) {

    const complexity =
      0.72 * pageRatio +
      0.28 * uniquenessRatio;


    basePrice =
      type.min +
      (type.max - type.min) *
      complexity;


    basePrice *=
      fieldCoefficient *
      urgency[selectedDays];


    // Не нижче мінімальної ціни

    basePrice =
      Math.max(
        type.min,
        basePrice
      );


    // Не вище максимальної ціни

    basePrice =
      Math.min(
        type.max,
        basePrice
      );

  }


  // --------------------------------------------------
  // ВЕЛИКІ РОБОТИ БЕЗ ВЕРХНЬОЇ МЕЖІ
  // --------------------------------------------------

  else {

    const additionalRange =
      type.min *
      (
        workType.value ===
        "dissertation"
          ? 1.4
          : 1.15
      );


    basePrice =
      type.min +
      additionalRange *
      (
        0.68 * pageRatio +
        0.32 * uniquenessRatio
      );


    basePrice *=
      fieldCoefficient *
      urgency[selectedDays];


    basePrice =
      Math.max(
        type.min,
        basePrice
      );
  }


  // Округлення

  basePrice =
    round50(basePrice);


  // Додаткові послуги

  const total =
    basePrice +
    addonTotal;


  // Діапазон ціни

  const fixedPriceTypes = new Set(["essay","abstract","theses","report","article","presentation","business","practical","annotation"]);
  const isFixedPrice = fixedPriceTypes.has(workType.value);
  const lowPrice = isFixedPrice ? round50(total) : round50(total * 0.96);
  const highPrice = isFixedPrice ? lowPrice : round50(total * 1.06);


  // --------------------------------------------------
  // ВИВЕДЕННЯ НА СТОРІНКУ
  // --------------------------------------------------

  $("#pagesValue").textContent =
    pageCount;


  $("#uniqueValue").textContent =
    type.uMin === 0
      ? "—"
      : uniqueValue;


  $("#summaryType").textContent =
    type.name;


  $("#summaryMeta").textContent =
    `${pageCount} стор. • ${
      type.uMin === 0
        ? "без параметра унікальності"
        : uniqueValue +
          "% унікальності"
    } • ${
      selectedDays === 21
        ? "21+ день"
        : selectedDays + " днів"
    }`;


  const displayPrice = isFixedPrice ? `${lowPrice.toLocaleString("uk-UA")} ₴` : `${lowPrice.toLocaleString("uk-UA")}–${highPrice.toLocaleString("uk-UA")} ₴`;
  $("#price").textContent = displayPrice;


  if (type.max !== null) {

    $("#priceLimits").textContent =
      `${type.name}: базова ціна ${type.min.toLocaleString("uk-UA")}–${type.max.toLocaleString("uk-UA")} ₴`;

  } else {

    $("#priceLimits").textContent =
      `${type.name}: базова ціна від ${type.min.toLocaleString("uk-UA")} ₴`;
  }


  const discountBox = $("#degreeDiscount");

  if (discountBox) {
    const presentationDiscount = isDegreeWork && selectedAddons.some(addon => addon.dataset.name === "Презентація");
    const speechDiscount = isDegreeWork && selectedAddons.some(addon => addon.dataset.name === "Доповідь до захисту");

    if (presentationDiscount || speechDiscount) {
      const saving = (presentationDiscount ? 200 : 0) + (speechDiscount ? 100 : 0);
      const parts = [];
      if (presentationDiscount) parts.push("презентація — <strong>300 ₴</strong> замість 500 ₴");
      if (speechDiscount) parts.push("доповідь — <strong>200 ₴</strong> замість 300 ₴");
      const signature = `${workType.value}:${presentationDiscount}:${speechDiscount}`;
      discountBox.innerHTML = `<span class="discount-gift">★</span><span><b>Приємний бонус — ціна стала нижчою!</b><small>${parts.join(" · ")}</small><em>Ваша економія: ${saving} ₴</em></span>`;
      if (signature !== lastDiscountSignature) {
        lastDiscountSignature = signature;
        discountBox.classList.add("show");
        clearTimeout(discountToastTimer);
        discountToastTimer = setTimeout(() => discountBox.classList.remove("show"), 5000);
      }
    } else {
      lastDiscountSignature = "";
      clearTimeout(discountToastTimer);
      discountBox.classList.remove("show");
      discountBox.innerHTML = "";
    }
  }

  return {

    type,

    pageCount,

    uniqueValue,

    selectedDays,

    lowPrice,

    highPrice,

    isFixedPrice,

    displayPrice,

    fieldName:
      field.options[
        field.selectedIndex
      ].text,

    addons:
      selectedAddons.map(
        addon =>
          addon.dataset.name
      )
  };
}


// ------------------------------------------------------
// 7. ОНОВЛЕННЯ КАЛЬКУЛЯТОРА
// ------------------------------------------------------

workType.addEventListener(
  "change",
  () => {

    setRanges();

    calculate();
  }
);


$("#calcForm").addEventListener(
  "input",
  calculate
);


setRanges();

calculate();


// ------------------------------------------------------
// 8. МОДАЛЬНЕ ВІКНО
// ------------------------------------------------------

const modal =
  $("#orderModal");


function openModal() {

  const calculation =
    calculate();

  if (!calculation) {
    document.querySelector("#calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  $("#orderSummary").innerHTML = `

    <b>
      ${calculation.type.name}
    </b>

    · ${calculation.fieldName}

    <br>

    ${calculation.pageCount} стор.

    ·

    ${
      calculation.type.uMin === 0
        ? "—"
        : calculation.uniqueValue +
          "% унікальності"
    }

    ·

    <b>
      ${calculation.displayPrice}
    </b>
  `;


  modal.classList.add("open");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";
}


function closeModal() {

  modal.classList.remove(
    "open"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";
}


$("#openOrder").addEventListener(
  "click",
  openModal
);


document
  .querySelectorAll("[data-close]")
  .forEach(element => {

    element.addEventListener(
      "click",
      closeModal
    );
  });


document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      closeModal();
    }
  }
);


// ------------------------------------------------------
// 9. ФОРМУВАННЯ ЗАЯВКИ
// ------------------------------------------------------

function createOrderText() {

  const calculation =
    calculate();


  const extra =
    calculation.addons.length
      ? calculation.addons.join(", ")
      : "не обрано";


  const name =
    $("#clientName").value.trim();


  const deadline =
    $("#deadline").value;


  const topic =
    $("#topic").value.trim();


  const university =
    $("#university").value.trim();


  const comment =
    $("#comment").value.trim();


  return `Вітаю! Хочу уточнити замовлення.

📌 Тип роботи: ${calculation.type.name}
📚 Предмет: ${calculation.fieldName}
📝 Тема: ${topic}
📄 Обсяг: ${calculation.pageCount} сторінок
🔎 Унікальність: ${
  calculation.type.uMin === 0
    ? "не застосовується"
    : calculation.uniqueValue + "%"
}
⏱ Термін: ${
  calculation.selectedDays === 21
    ? "21+ день"
    : calculation.selectedDays + " днів"
}
📅 Дедлайн: ${deadline}
➕ Додатково: ${extra}

💰 Попередня вартість:
${calculation.displayPrice}

👤 Ім’я: ${name}${
  university
    ? "\n🏫 Навчальний заклад: " +
      university
    : ""
}${
  comment
    ? "\n💬 Коментар: " +
      comment
    : ""
}

Методичку та інші файли надішлю в Telegram.`;
}


// ------------------------------------------------------
// 10. ВІДПРАВЛЕННЯ / TELEGRAM
// ------------------------------------------------------

$("#orderForm").addEventListener("submit", async event => {
  event.preventDefault();
  const text=createOrderText();
  try{await navigator.clipboard.writeText(text);}catch(error){console.log("Буфер обміну недоступний:",error);}
  const telegramURL=`https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(text)}`;
  window.location.href=telegramURL;
});

// ------------------------------------------------------
// 11. ПЛАВАЮЧА КНОПКА TELEGRAM
// ------------------------------------------------------

const telegramFloat =
  $("#telegramFloat");


if (telegramFloat) {

  telegramFloat.href =
    `https://t.me/${TELEGRAM_USERNAME}`;

  telegramFloat.target =
    "_blank";
}


// ------------------------------------------------------
// 12. МОБІЛЬНЕ МЕНЮ
// ------------------------------------------------------

const menuButton =
  $(".menu-btn");


const mobileNav =
  $(".mobile-nav");


if (
  menuButton &&
  mobileNav
) {

  menuButton.addEventListener(
    "click",
    () => {

      mobileNav.classList.toggle(
        "open"
      );
    }
  );


  document
    .querySelectorAll(
      ".mobile-nav a"
    )
    .forEach(link => {

      link.addEventListener(
        "click",
        () => {

          mobileNav.classList.remove(
            "open"
          );
        }
      );
    });
}


// ------------------------------------------------------
// 13. МІНІМАЛЬНА ДАТА ДЕДЛАЙНУ
// ------------------------------------------------------

const deadlineInput =
  $("#deadline");


if (deadlineInput) {

  const today =
    new Date();


  today.setMinutes(
    today.getMinutes() -
    today.getTimezoneOffset()
  );


  deadlineInput.min =
    today
      .toISOString()
      .split("T")[0];
}


// ------------------------------------------------------
// 14. АНІМАЦІЯ БЛОКІВ
// ------------------------------------------------------

const observer =
  new IntersectionObserver(

    entries => {

      entries.forEach(
        entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target.animate(

              [
                {
                  opacity: 0,
                  transform:
                    "translateY(18px)"
                },

                {
                  opacity: 1,
                  transform:
                    "translateY(0)"
                }
              ],

              {
                duration: 450,
                easing: "ease-out",
                fill: "both"
              }
            );


            observer.unobserve(
              entry.target
            );
          }
        }
      );
    },

    {
      threshold: 0.08
    }
  );


document
  .querySelectorAll(
    ".service-card, " +
    ".steps > div, " +
    ".examples-grid article, " +
    ".review-grid blockquote"
  )
  .forEach(
    element => {

      observer.observe(
        element
      );
    }
  );
// ======================================================
// V4 — UI / motion enhancements
// ======================================================

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.10 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Header + scroll progress
const siteHeader = document.querySelector(".site-header");
const progressBar = document.querySelector(".scroll-progress span");
function updateScrollUI(){
  const y = window.scrollY;
  if(siteHeader) siteHeader.classList.toggle("scrolled", y > 24);
  if(progressBar){
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  }
}
window.addEventListener("scroll", updateScrollUI, { passive:true });
updateScrollUI();

// Animated counters
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || entry.target.dataset.animated) return;
    entry.target.dataset.animated = "1";
    const target = Number(entry.target.dataset.count || 0);
    const suffix = target === 100 ? "%" : "+";
    const duration = 1000;
    const start = performance.now();
    function tick(now){
      const p = Math.min(1, (now-start)/duration);
      const eased = 1 - Math.pow(1-p, 3);
      const val = Math.round(target * eased);
      entry.target.textContent = val.toLocaleString("uk-UA") + suffix;
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(entry.target);
  });
},{threshold:.5});
document.querySelectorAll(".counter").forEach(el=>counterObserver.observe(el));

// Lightweight tilt only on precise pointer devices
if (window.matchMedia("(pointer:fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width - .5;
      const y = (e.clientY-r.top)/r.height - .5;
      card.style.transform = `perspective(900px) rotateY(${x*5}deg) rotateX(${-y*5}deg)`;
    });
    card.addEventListener("mouseleave",()=>card.style.transform="rotate(1.5deg)");
  });
}

// Mirror calculated price into mobile sticky CTA
const mobilePrice = document.querySelector("#mobilePrice");
const mainPrice = document.querySelector("#price");
if (mobilePrice && mainPrice) {
  const syncMobilePrice = () => mobilePrice.textContent = mainPrice.textContent;
  new MutationObserver(syncMobilePrice).observe(mainPrice,{childList:true,subtree:true,characterData:true});
  syncMobilePrice();
}

// Modal body state
const orderModalV4 = document.querySelector("#orderModal");
if(orderModalV4){
  new MutationObserver(()=>document.body.classList.toggle("modal-open",orderModalV4.classList.contains("open"))).observe(orderModalV4,{attributes:true,attributeFilter:["class"]});
}


// =====================================================
// V7 — richer motion + clean three-step mobile calculator
// =====================================================
(function(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduceMotion && window.matchMedia('(pointer:fine)').matches){
    const glow=document.createElement('div'); glow.className='cursor-glow'; document.body.appendChild(glow);
    window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true});
    document.querySelectorAll('.btn,.service-card,.case').forEach(el=>{
      el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');el.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%')});
    });
  }
  if(!reduceMotion && window.matchMedia('(min-width:641px)').matches){
    window.addEventListener('scroll',()=>{const y=window.scrollY;document.querySelectorAll('.floating-card').forEach((el,i)=>el.style.translate=`0 ${Math.min(24,y*(.018+i*.006))}px`)},{passive:true});
  }

  const form=document.querySelector('#calcForm');
  if(!form) return;
  const isMobile=()=>window.matchMedia('(max-width:640px)').matches;
  const steps=[...form.querySelectorAll('.wizard-step')];
  const panels=[...form.querySelectorAll('[data-mobile-step]')];
  const back=form.querySelector('.wizard-back'), next=form.querySelector('.wizard-next'), order=form.querySelector('.wizard-order');
  let current=1;

  function paint(){
    if(!isMobile()){
      panels.forEach(el=>el.classList.remove('calc-mobile-hidden'));
      return;
    }
    panels.forEach(el=>el.classList.toggle('calc-mobile-hidden',Number(el.dataset.mobileStep)!==current));
    steps.forEach(s=>s.classList.toggle('active',Number(s.dataset.step)===current));
    if(back) back.style.visibility=current===1?'hidden':'visible';
    if(next) next.style.display=current===3?'none':'block';
    if(order) order.style.display=current===3?'block':'none';
    document.querySelector('.mobile-wizard-actions')?.classList.toggle('final-step',current===3);
  }
  function go(n){
    const target=Math.max(1,Math.min(3,n));
    if(current===1 && target>1 && (!workType.value || !field.value)){
      [workType,field].forEach(el=>{if(!el.value){el.classList.add('needs-choice');setTimeout(()=>el.classList.remove('needs-choice'),520)}});
      return;
    }
    current=target; paint();
  }
  steps.forEach(s=>s.addEventListener('click',()=>go(Number(s.dataset.step))));
  back?.addEventListener('click',()=>go(current-1));
  next?.addEventListener('click',()=>go(current+1));
  order?.addEventListener('click',()=>document.querySelector('#openOrder')?.click());
  window.addEventListener('resize',paint,{passive:true}); paint();

  function fillRange(el){
    const min=+el.min||0,max=+el.max||100,v=+el.value;
    const p=max===min?0:((v-min)/(max-min))*100;
    el.style.background=`linear-gradient(90deg,#72dc59 ${p}%,#e6ebe2 ${p}%)`;
  }
  ['#pages','#uniqueness'].forEach(sel=>{const el=document.querySelector(sel);if(el){fillRange(el);el.addEventListener('input',()=>fillRange(el));}});
  document.querySelector('#workType')?.addEventListener('change',()=>requestAnimationFrame(()=>['#pages','#uniqueness'].forEach(sel=>{const el=document.querySelector(sel);if(el)fillRange(el)})));
})();

// =====================================================
// V7 — tactile option feedback (calculator logic unchanged)
// =====================================================
(function(){
  document.querySelectorAll('.term-grid input,.addons input').forEach(input=>input.addEventListener('change',()=>{
    const card=input.nextElementSibling;
    if(!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    card.animate([{transform:'scale(.985)'},{transform:'scale(1.018)'},{transform:'scale(1)'}],{duration:260,easing:'ease-out'});
  }));
})();


// =====================================================
// V14 — mobile premium select picker (desktop untouched)
// =====================================================
(function(){
  const mq = window.matchMedia('(max-width: 640px)');
  const selects = [document.querySelector('#workType'), document.querySelector('#field')].filter(Boolean);
  if (!selects.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'mobile-picker-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <section class="mobile-picker-sheet" role="dialog" aria-modal="true" aria-labelledby="mobilePickerTitle">
      <div class="mobile-picker-handle" aria-hidden="true"></div>
      <div class="mobile-picker-head">
        <div>
          <span class="mobile-picker-kicker">ОБЕРІТЬ ВАРІАНТ</span>
          <h3 id="mobilePickerTitle">Тип роботи</h3>
        </div>
        <button type="button" class="mobile-picker-close" aria-label="Закрити">×</button>
      </div>
      <label class="mobile-picker-search-wrap">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"/></svg>
        <input class="mobile-picker-search" type="search" inputmode="search" autocomplete="off" placeholder="Пошук..." aria-label="Пошук варіанта">
      </label>
      <div class="mobile-picker-options" role="listbox"></div>
    </section>`;
  document.body.appendChild(overlay);

  const sheet = overlay.querySelector('.mobile-picker-sheet');
  const title = overlay.querySelector('#mobilePickerTitle');
  const search = overlay.querySelector('.mobile-picker-search');
  const optionsBox = overlay.querySelector('.mobile-picker-options');
  const closeBtn = overlay.querySelector('.mobile-picker-close');
  let activeSelect = null;
  let previousOverflow = '';

  function selectedText(select){
    const opt = select.options[select.selectedIndex];
    return opt && opt.value ? opt.textContent.trim() : (select.id === 'workType' ? 'Оберіть тип роботи' : 'Оберіть предмет / напрям');
  }

  selects.forEach(select => {
    select.classList.add('mobile-native-select');
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'mobile-select-trigger';
    trigger.dataset.for = select.id;
    trigger.innerHTML = `<span class="mobile-select-trigger-text"></span><span class="mobile-select-chevron" aria-hidden="true"></span>`;
    select.insertAdjacentElement('afterend', trigger);

    const sync = () => {
      const text = selectedText(select);
      trigger.querySelector('.mobile-select-trigger-text').textContent = text;
      trigger.classList.toggle('is-placeholder', !select.value);
    };
    sync();
    select.addEventListener('change', sync);
    trigger.addEventListener('click', () => openPicker(select));
  });

  function renderOptions(){
    if (!activeSelect) return;
    const q = search.value.trim().toLocaleLowerCase('uk-UA');
    optionsBox.innerHTML = '';

    const all = [...activeSelect.options]
      .map((opt, index) => ({opt, index, label: opt.textContent.trim()}))
      .filter(item => item.opt.value && !item.opt.disabled)
      .filter(item => !q || item.label.toLocaleLowerCase('uk-UA').includes(q));

    if (!all.length){
      const empty = document.createElement('div');
      empty.className = 'mobile-picker-empty';
      empty.textContent = 'Нічого не знайдено';
      optionsBox.appendChild(empty);
      return;
    }

    all.forEach(({opt,index,label}) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mobile-picker-option' + (index === activeSelect.selectedIndex ? ' selected' : '');
      btn.setAttribute('role','option');
      btn.setAttribute('aria-selected', index === activeSelect.selectedIndex ? 'true' : 'false');
      btn.innerHTML = `<span>${label}</span><i aria-hidden="true">✓</i>`;
      btn.addEventListener('click', () => {
        activeSelect.selectedIndex = index;
        activeSelect.dispatchEvent(new Event('change', {bubbles:true}));
        activeSelect.dispatchEvent(new Event('input', {bubbles:true}));
        if (navigator.vibrate) navigator.vibrate(10);
        closePicker();
      });
      optionsBox.appendChild(btn);
    });
  }

  function openPicker(select){
    if (!mq.matches) return;
    activeSelect = select;
    title.textContent = select.id === 'workType' ? 'Тип роботи' : 'Предмет / напрям';
    search.placeholder = select.id === 'workType' ? 'Наприклад: магістерська' : 'Наприклад: психологія';
    search.value = '';
    renderOptions();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden','false');
    requestAnimationFrame(() => {
      const selected = optionsBox.querySelector('.selected');
      if (selected) selected.scrollIntoView({block:'nearest'});
    });
  }

  function closePicker(){
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
    document.body.style.overflow = previousOverflow;
    activeSelect = null;
  }

  search.addEventListener('input', renderOptions);
  closeBtn.addEventListener('click', closePicker);
  overlay.addEventListener('click', e => { if (e.target === overlay) closePicker(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) closePicker(); });
  mq.addEventListener?.('change', e => { if (!e.matches) closePicker(); });

  // Swipe down to close, without interfering with the options scroll.
  let startY = 0;
  sheet.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, {passive:true});
  sheet.addEventListener('touchend', e => {
    const dy = e.changedTouches[0].clientY - startY;
    if (dy > 90 && optionsBox.scrollTop <= 2) closePicker();
  }, {passive:true});
})();
