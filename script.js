/* ============================================================
   NEXUS — script.js
   1) Procedural neon city on <canvas> (3 parallax layers,
      lit windows, stars, drifting particles, shooting star)
   2) Pointer parallax for the robot + hero glow
   3) Mobile menu · 4) Interactive cards · 5) Scroll reveal
      and animated counters · 6) Signal form · 7) Footer clock
   8) NEXA guide bot (text + voice) · 9) Boot intro + scroll progress
   10) The Grid Test quiz · 11) Ambience synth
   12) Signal of the Day · 13) Language toggle EN/اردو
   A second block at the end holds the Toolkit: the typing
   test and the study timer.
   Everything is dependency-free. If canvas is missing, the
   CSS gradient sky + SVG robot still carry the hero.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     LANGUAGE — EN / اردو interface toggle. A dictionary plus
     data-i18n attributes: applyLang swaps every marked
     element, flips <html lang/dir>, then notifies hooks so
     JS-driven text (quiz, timers, signal form) re-renders in
     the new language too. Content pieces stay English in
     both modes: the quiz questions, the Signal of the Day
     lines and the typing samples. NEXA answers in whatever
     language it is asked in, independent of this toggle.
     The choice lives in memory only — nothing is stored.
     --------------------------------------------------------- */
  /* I18N-START */
  var I18N = {
    en: {
      "skip": "Skip to content",
      "nav.home": "Home",
      "nav.explore": "Explore",
      "nav.technology": "Technology",
      "nav.tools": "Tools",
      "nav.about": "About",
      "nav.openMenu": "Open menu",
      "nav.closeMenu": "Close menu",
      "hero.status": "SYSTEM ONLINE",
      "hero.sub": "Step into a new dimension of digital experience.",
      "hero.enter": "ENTER THE FUTURE",
      "hero.explore": "EXPLORE NEXUS",
      "hero.share": "SHARE",
      "hero.note": "An experimental digital experience — no downloads, no sign-up.",
      "discover.kicker": "01 · DISCOVER",
      "discover.title": "Choose your <span class=\"grad-text\">dimension</span>",
      "discover.sub": "Three gateways into the NEXUS grid. Select a card to open its briefing.",
      "card1.title": "Artificial Intelligence",
      "card1.text": "Machines that learn, reason and create — the minds now woven into everyday life.",
      "card1.more": "From language models to vision systems, modern AI predicts, generates and decides in milliseconds. NEXUS maps where this intelligence is heading next — and what it means for the humans guiding it.",
      "card2.title": "Digital Worlds",
      "card2.text": "Virtual cities, immersive realities and persistent universes built from pure light.",
      "card2.more": "Digital worlds are no longer games alone — they are workplaces, classrooms and concert halls. Step through the portal and explore how entire societies are being prototyped inside simulated space.",
      "card3.title": "Future Technology",
      "card3.text": "Quantum leaps, neural interfaces and the hardware quietly rewriting tomorrow.",
      "card3.more": "Chips that think, networks that feel instant, machines that build machines. This briefing tracks the inventions moving from laboratory prototypes to the device in your pocket.",
      "card.ctaOpen": "OPEN BRIEFING +",
      "card.ctaClose": "CLOSE BRIEFING −",
      "core.kicker": "02 · NEXUS CORE",
      "core.title": "One core.<br><span class=\"grad-text\">Infinite signals.</span>",
      "core.p1": "NEXUS is an experimental digital experience — a living interface between imagination and machine. It is not a product and it sells nothing; it is a window, opened briefly, onto the world now being built.",
      "core.p2": "Every light on this page is generated live in your browser. No servers, no tracking, no accounts — just code, colour and motion.",
      "core.stat1": "Neural nodes simulated",
      "core.stat2": "Core response time",
      "core.stat3": "Rendered locally, privately",
      "sotd.label": "SIGNAL OF THE DAY",
      "quiz.kicker": "03 · THE GRID TEST",
      "quiz.title": "Test your <span class=\"grad-text\">signal</span>",
      "quiz.sub": "Five questions from the future. No pressure — the grid is watching, kindly.",
      "quiz.next": "NEXT",
      "quiz.playAgain": "PLAY AGAIN",
      "quiz.progress": "Question {n} of {total}",
      "quiz.complete": "Test complete",
      "quiz.correct": "✓ Correct. The grid approves.",
      "quiz.wrong": "✗ Not quite — the answer was “{ans}”.",
      "quiz.seeRank": "SEE MY RANK",
      "quiz.rankMaster": "GRID MASTER — the future bends around you.",
      "quiz.rankOperative": "CYBER OPERATIVE — a strong, clean signal.",
      "quiz.rankNovice": "NEURAL NOVICE — recharge, traveller, and try again.",
      "signal.kicker": "04 · SIGNAL",
      "signal.title": "Join the <span class=\"grad-text\">transmission</span>",
      "signal.sub": "Leave your name, email and a message — the signal lands directly in the keeper's inbox, and the grid will answer.",
      "signal.namePh": "Your name",
      "signal.emailPh": "you@future.net",
      "signal.msgPh": "Your message for the grid...",
      "signal.transmit": "TRANSMIT",
      "signal.transmitting": "TRANSMITTING...",
      "signal.errName": "Tell the grid your name first, traveller.",
      "signal.errEmail": "That frequency looks off — enter a valid email so the grid can answer.",
      "signal.errMsg": "Your message is empty — give the grid something to answer.",
      "signal.sending": "Sending your signal...",
      "signal.slow": "Still transmitting — the connection is slow, please wait...",
      "signal.ok": "✓ Signal received, {name}. The keeper has your message and can reply to your email.",
      "signal.errSend": "The signal could not get through just now. Check your connection and try again.",
      "updates.title": "Get <span class=\"grad-text\">updates</span> by email",
      "updates.sub": "New tools, signals and experiments from the grid — straight to your inbox. No noise, and you can leave anytime.",
      "updates.emailPh": "you@future.net",
      "updates.btn": "SUBSCRIBE",
      "updates.note": "One email when something new lands on the grid. Powered by Buttondown.",
      "tools.kicker": "05 · TOOLKIT",
      "tools.title": "Tools that <span class=\"grad-text\">work</span>",
      "tools.sub": "Two instruments from the grid, free for every traveller: a typing test that times your fingers, and a study timer that guards your focus.",
      "typing.title": "Typing Test",
      "typing.sub": "Type the line below as fast as you can. The clock starts with your first keystroke — 60 seconds on the grid.",
      "typing.inputPh": "Start typing here...",
      "typing.seconds": "Seconds left",
      "typing.wpm": "WPM",
      "typing.accuracy": "Accuracy",
      "typing.resultIdle": "Your rank will appear here.",
      "typing.restart": "RESTART",
      "typing.newText": "NEW TEXT",
      "typing.timeResult": "Time! {wpm} WPM · {acc}% accuracy · Rank: {rank}",
      "typing.rankTurtle": "TURTLE — every master started slow. Keep going!",
      "typing.rankSteady": "STEADY — the grid feels your rhythm.",
      "typing.rankSwift": "SWIFT — your fingers are waking up.",
      "typing.rankRapid": "RAPID — seriously quick. The grid approves.",
      "typing.rankLightning": "LIGHTNING — elite speed. NEXA is impressed.",
      "study.title": "Study Timer",
      "study.sub": "Focus in sprints, rest on schedule — the Pomodoro rhythm. Pick a length, press start, and the grid keeps time while you study.",
      "study.presetFocus": "FOCUS · 25 MIN",
      "study.presetSprint": "SPRINT · 15 MIN",
      "study.presetBreak": "BREAK · 5 MIN",
      "study.start": "START",
      "study.pause": "PAUSE",
      "study.resume": "RESUME",
      "study.reset": "RESET",
      "study.ready": "Ready when you are — pick a length and press START.",
      "study.running": "Running — the grid is keeping time. Eyes on the work, traveller.",
      "study.paused": "Paused — your remaining time is held exactly where you left it.",
      "study.done": "Time up! Session complete — stretch, breathe and let the grid recharge.",
      "footer.about": "NEXUS is a concept experience crafted with plain HTML, CSS and JavaScript. Built as a tribute to the neon futures we were promised — and the real one we are building.",
      "footer.navigate": "Navigate",
      "footer.navHome": "Home",
      "footer.navExplore": "Explore",
      "footer.navTech": "Technology",
      "footer.navQuiz": "Quiz",
      "footer.navSignal": "Signal",
      "footer.navTools": "Tools",
      "footer.status": "Status",
      "footer.nominal": "All systems nominal",
      "footer.gridTime": "Grid time",
      "footer.ambience": "AMBIENCE",
      "footer.on": "ON",
      "footer.off": "OFF",
      "footer.credit": "© 2026 NEXUS · Designed & built by Umair — a fictional concept experience, crafted in the browser.",
      "nexa.status": "Online · answers NEXUS questions",
      "nexa.placeholder": "Ask NEXA about NEXUS...",
      "nexa.ask": "Ask NEXA"
    },
    ur: {
      "skip": "مواد پر جائیں",
      "nav.home": "ہوم",
      "nav.explore": "دریافت",
      "nav.technology": "ٹیکنالوجی",
      "nav.tools": "اوزار",
      "nav.about": "بارے میں",
      "nav.openMenu": "مینیو کھولیں",
      "nav.closeMenu": "مینیو بند کریں",
      "hero.status": "سسٹم آن لائن",
      "hero.sub": "ڈیجیٹل تجربے کی ایک نئی جہت میں قدم رکھیں۔",
      "hero.enter": "مستقبل میں داخل ہوں",
      "hero.explore": "نیکسس دریافت کریں",
      "hero.share": "شیئر کریں",
      "hero.note": "ایک تجرباتی ڈیجیٹل تجربہ — نہ ڈاؤن لوڈ، نہ سائن اپ۔",
      "discover.kicker": "01 · دریافت",
      "discover.title": "اپنی <span class=\"grad-text\">جہت</span> منتخب کریں",
      "discover.sub": "نیکسس گرڈ کے تین دروازے۔ بریفنگ کھولنے کے لیے کوئی کارڈ منتخب کریں۔",
      "card1.title": "مصنوعی ذہانت",
      "card1.text": "ایسی مشینیں جو سیکھتی، سوچتی اور تخلیق کرتی ہیں — وہ ذہن جو اب روزمرہ زندگی میں بُنے جا چکے ہیں۔",
      "card1.more": "زبان کے ماڈلز سے لے کر بصری نظاموں تک، جدید مصنوعی ذہانت ملی سیکنڈز میں پیش گوئی، تخلیق اور فیصلے کرتی ہے۔ نیکسس بتاتا ہے کہ یہ ذہانت آگے کہاں جا رہی ہے — اور اس کی رہنمائی کرنے والے انسانوں کے لیے اس کے کیا معنی ہیں۔",
      "card2.title": "ڈیجیٹل دنیائیں",
      "card2.text": "ورچوئل شہر، غرق کر دینے والی حقیقتیں اور خالص روشنی سے بنی دائمی کائناتیں۔",
      "card2.more": "ڈیجیٹل دنیائیں اب صرف کھیل نہیں رہیں — یہ دفاتر، کلاس روم اور محفل گاہیں ہیں۔ پورٹل سے گزریں اور دیکھیں کہ پوری سوسائٹیاں نقلی فضا میں کیسے ڈھالی جا رہی ہیں۔",
      "card3.title": "مستقبل کی ٹیکنالوجی",
      "card3.text": "کوانٹم چھلانگیں، نیورل انٹرفیس اور وہ ہارڈویئر جو خاموشی سے کل کو دوبارہ لکھ رہا ہے۔",
      "card3.more": "سوچنے والی چپس، فوری محسوس ہونے والے نیٹ ورک، مشینیں بنانے والی مشینیں۔ یہ بریفنگ ان ایجادات کا سراغ رکھتی ہے جو تجربہ گاہ کے نمونوں سے آپ کی جیب کی ڈیوائس تک پہنچ رہی ہیں۔",
      "card.ctaOpen": "بریفنگ کھولیں +",
      "card.ctaClose": "بریفنگ بند کریں −",
      "core.kicker": "02 · نیکسس کور",
      "core.title": "ایک کور۔<br><span class=\"grad-text\">لامحدود سگنلز۔</span>",
      "core.p1": "نیکسس ایک تجرباتی ڈیجیٹل تجربہ ہے — تخیل اور مشین کے درمیان ایک زندہ رابطہ۔ یہ کوئی پروڈکٹ نہیں اور کچھ بیچتا نہیں؛ یہ اس دنیا کی ایک جھلک ہے جو اس وقت بن رہی ہے، بس لمحہ بھر کے لیے کھلی ہوئی۔",
      "core.p2": "اس صفحے کی ہر روشنی آپ کے براؤزر میں لائیو بنتی ہے۔ نہ سرور، نہ ٹریکنگ، نہ اکاؤنٹ — بس کوڈ، رنگ اور حرکت۔",
      "core.stat1": "نیورل نوڈز کی نقل",
      "core.stat2": "کور کا جوابی وقت",
      "core.stat3": "مقامی طور پر، نجی طریقے سے تیار",
      "sotd.label": "آج کا سگنل",
      "quiz.kicker": "03 · گرڈ ٹیسٹ",
      "quiz.title": "اپنا <span class=\"grad-text\">سگنل</span> آزمائیں",
      "quiz.sub": "مستقبل سے پانچ سوالات۔ کوئی دباؤ نہیں — گرڈ نرمی سے دیکھ رہا ہے۔",
      "quiz.next": "اگلا",
      "quiz.playAgain": "دوبارہ کھیلیں",
      "quiz.progress": "سوال {n} از {total}",
      "quiz.complete": "ٹیسٹ مکمل",
      "quiz.correct": "✓ درست۔ گرڈ خوش ہے۔",
      "quiz.wrong": "✗ درست نہیں — جواب تھا ”{ans}“۔",
      "quiz.seeRank": "میرا رینک دیکھیں",
      "quiz.rankMaster": "گرڈ ماسٹر — مستقبل آپ کے گرد جھکتا ہے۔",
      "quiz.rankOperative": "سائبر آپریٹو — مضبوط اور صاف سگنل۔",
      "quiz.rankNovice": "نیورل نووِس — توانائی بھریں، مسافر، اور دوبارہ کوشش کریں۔",
      "signal.kicker": "04 · سگنل",
      "signal.title": "<span class=\"grad-text\">نشر</span> میں شامل ہوں",
      "signal.sub": "اپنا نام، ای میل اور پیغام چھوڑیں — سگنل سیدھا رکھوالے کے ان باکس میں پہنچتا ہے، اور گرڈ جواب دے گا۔",
      "signal.namePh": "آپ کا نام",
      "signal.emailPh": "you@future.net",
      "signal.msgPh": "گرڈ کے لیے آپ کا پیغام...",
      "signal.transmit": "بھیجیں",
      "signal.transmitting": "بھیجا جا رہا ہے...",
      "signal.errName": "پہلے گرڈ کو اپنا نام بتائیں، مسافر۔",
      "signal.errEmail": "یہ فریکوئنسی ٹھیک نہیں لگتی — درست ای میل لکھیں تاکہ گرڈ جواب دے سکے۔",
      "signal.errMsg": "آپ کا پیغام خالی ہے — گرڈ کو جواب دینے کے لیے کچھ دیں۔",
      "signal.sending": "آپ کا سگنل بھیجا جا رہا ہے...",
      "signal.slow": "ابھی بھیجا جا رہا ہے — رابطہ سست ہے، براہ کرم انتظار کریں...",
      "signal.ok": "✓ سگنل موصول ہو گیا، {name}۔ رکھوالے کو آپ کا پیغام مل گیا ہے اور وہ آپ کی ای میل پر جواب دے سکتے ہیں۔",
      "signal.errSend": "سگنل اس وقت نہیں پہنچ سکا۔ اپنا رابطہ جانچیں اور دوبارہ کوشش کریں۔",
      "updates.title": "ای میل پر <span class=\"grad-text\">تازہ خبریں</span> پائیں",
      "updates.sub": "گرڈ کے نئے ٹولز، سگنلز اور تجربات — سیدھا آپ کے ان باکس میں۔ کوئی شور نہیں، جب چاہیں چھوڑ سکتے ہیں۔",
      "updates.emailPh": "you@future.net",
      "updates.btn": "سبسکرائب کریں",
      "updates.note": "جب بھی گرڈ پر کچھ نیا آئے گا، ایک ای میل ملے گی۔ Buttondown کے ذریعے۔",
      "tools.kicker": "05 · ٹول کٹ",
      "tools.title": "اوزار جو <span class=\"grad-text\">کام</span> کرتے ہیں",
      "tools.sub": "گرڈ کے دو اوزار، ہر مسافر کے لیے مفت: ٹائپنگ ٹیسٹ جو آپ کی انگلیوں کا وقت ناپتا ہے، اور اسٹڈی ٹائمر جو آپ کی توجہ کی حفاظت کرتا ہے۔",
      "typing.title": "ٹائپنگ ٹیسٹ",
      "typing.sub": "نیچے والی سطر جتنی تیزی سے ہو سکے لکھیں۔ گھڑی آپ کے پہلے حرف سے شروع ہوتی ہے — گرڈ پر 60 سیکنڈ۔",
      "typing.inputPh": "یہاں لکھنا شروع کریں...",
      "typing.seconds": "باقی سیکنڈ",
      "typing.wpm": "WPM",
      "typing.accuracy": "درستگی",
      "typing.resultIdle": "آپ کا رینک یہاں ظاہر ہوگا۔",
      "typing.restart": "دوبارہ شروع",
      "typing.newText": "نیا متن",
      "typing.timeResult": "وقت ختم! {wpm} WPM · {acc}% درستگی · رینک: {rank}",
      "typing.rankTurtle": "کچھوا — ہر ماہر نے آہستہ آغاز کیا تھا۔ جاری رکھیں!",
      "typing.rankSteady": "مستحکم — گرڈ آپ کی تال محسوس کر رہا ہے۔",
      "typing.rankSwift": "تیز — آپ کی انگلیاں جاگ رہی ہیں۔",
      "typing.rankRapid": "تیز رفتار — واقعی تیز۔ گرڈ خوش ہے۔",
      "typing.rankLightning": "بجلی — اعلیٰ رفتار۔ نیکسا متاثر ہے۔",
      "study.title": "اسٹڈی ٹائمر",
      "study.sub": "دوڑ میں توجہ، وقت پر آرام — پومودورو کی تال۔ مدت چنیں، شروع دبائیں، اور پڑھائی کے دوران گرڈ وقت کی نگرانی کرے گا۔",
      "study.presetFocus": "توجہ · 25 منٹ",
      "study.presetSprint": "دوڑ · 15 منٹ",
      "study.presetBreak": "وقفہ · 5 منٹ",
      "study.start": "شروع",
      "study.pause": "روکیں",
      "study.resume": "جاری رکھیں",
      "study.reset": "ری سیٹ",
      "study.ready": "جب آپ تیار ہوں — مدت چنیں اور شروع دبائیں۔",
      "study.running": "چل رہا ہے — گرڈ وقت کی نگرانی کر رہا ہے۔ نگاہیں کام پر، مسافر۔",
      "study.paused": "رکا ہوا — آپ کا باقی وقت بالکل وہیں محفوظ ہے جہاں چھوڑا تھا۔",
      "study.done": "وقت ختم! نشست مکمل — کھینچیں، سانس لیں اور گرڈ کو توانائی بھرنے دیں۔",
      "footer.about": "نیکسس سادہ HTML، CSS اور JavaScript سے تیار کردہ ایک تصوراتی تجربہ ہے۔ یہ ان نیون مستقبلوں کی یاد میں بنایا گیا جن کا وعدہ کیا گیا تھا — اور اس اصل مستقبل کے لیے جو ہم خود بنا رہے ہیں۔",
      "footer.navigate": "رہنمائی",
      "footer.navHome": "ہوم",
      "footer.navExplore": "دریافت",
      "footer.navTech": "ٹیکنالوجی",
      "footer.navQuiz": "کوئز",
      "footer.navSignal": "سگنل",
      "footer.navTools": "اوزار",
      "footer.status": "حالت",
      "footer.nominal": "تمام نظام درست",
      "footer.gridTime": "گرڈ کا وقت",
      "footer.ambience": "پس منظر دھن",
      "footer.on": "آن",
      "footer.off": "بند",
      "footer.credit": "© 2026 NEXUS · ڈیزائن اور تیاری: عمیر — ایک خیالی تصوراتی تجربہ، براؤزر میں تیار۔",
      "nexa.status": "آن لائن · نیکسس کے سوالوں کے جواب دیتی ہے",
      "nexa.placeholder": "نیکسس کے بارے میں نیکسا سے پوچھیں...",
      "nexa.ask": "نیکسا سے پوچھیں"
    }
  };
  var curLang = "en";
  var langHooks = [];
  function t(key) {
    var d = I18N[curLang];
    return (d && d[key]) || I18N.en[key] || key;
  }
  function tf(key, params) {
    var s = t(key);
    if (params) {
      for (var k in params) s = s.split("{" + k + "}").join(String(params[k]));
    }
    return s;
  }
  function applyLang(lang) {
    curLang = lang === "ur" ? "ur" : "en";
    document.documentElement.lang = curLang;
    document.documentElement.dir = curLang === "ur" ? "rtl" : "ltr";
    var i, v, els = document.querySelectorAll("[data-i18n]");
    for (i = 0; i < els.length; i++) {
      v = t(els[i].getAttribute("data-i18n"));
      if (v.indexOf("<") !== -1) els[i].innerHTML = v; else els[i].textContent = v;
    }
    els = document.querySelectorAll("[data-i18n-ph]");
    for (i = 0; i < els.length; i++) els[i].setAttribute("placeholder", t(els[i].getAttribute("data-i18n-ph")));
    var lt = document.getElementById("langToggle");
    if (lt) {
      lt.textContent = curLang === "ur" ? "EN" : "اردو";
      lt.setAttribute("aria-label", curLang === "ur" ? "Switch language to English" : "Switch language to Urdu");
    }
    var cardsEls = document.querySelectorAll("[data-card]");
    for (i = 0; i < cardsEls.length; i++) {
      var cta = cardsEls[i].querySelector(".card-cta");
      if (cta) cta.textContent = cardsEls[i].classList.contains("open") ? t("card.ctaClose") : t("card.ctaOpen");
    }
    var nt = document.getElementById("navToggle");
    var nl = document.getElementById("navLinks");
    if (nt) nt.setAttribute("aria-label", (nl && nl.classList.contains("open")) ? t("nav.closeMenu") : t("nav.openMenu"));
    for (i = 0; i < langHooks.length; i++) langHooks[i](curLang);
  }
  var langToggleBtn = document.getElementById("langToggle");
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", function () {
      applyLang(curLang === "ur" ? "en" : "ur");
    });
  }
  window.NEXUS_I18N = {
    t: t,
    tf: tf,
    lang: function () { return curLang; },
    onChange: function (fn) { langHooks.push(fn); }
  };
  /* I18N-END */

  /* ---------------------------------------------------------
     1) NEON CITY CANVAS
     --------------------------------------------------------- */
  var canvas = document.getElementById("cityCanvas");
  var ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;

  var mouseX = 0, mouseY = 0;          // -1 .. 1, smoothed in the loop
  var targetMX = 0, targetMY = 0;
  var W = 0, H = 0, DPR = 1;
  var layers = [], particles = [], stars = [];
  var meteor = null, nextMeteor = 260;

  function rand(a, b) { return a + Math.random() * (b - a); }

  /* One skyline layer: an array of buildings with lit windows */
  function makeLayer(depth, baseColor, winColors, density) {
    var buildings = [], x = -40;
    while (x < W + 60) {
      var bw = rand(28, 74) * (0.7 + depth * 0.5);
      var bh = H * rand(0.16, 0.52) * (0.55 + depth * 0.6);
      var wins = [];
      var cols = Math.max(2, Math.floor(bw / 11));
      var rows = Math.max(3, Math.floor(bh / 15));
      for (var c = 0; c < cols; c++) {
        for (var r = 0; r < rows; r++) {
          if (Math.random() < density) {
            wins.push({
              x: 5 + c * ((bw - 9) / cols), y: 8 + r * ((bh - 14) / rows),
              w: 3.6, h: 5.2,
              col: winColors[(Math.random() * winColors.length) | 0],
              a: rand(0.35, 1), tw: rand(0.002, 0.012), ph: rand(0, 6.28)
            });
          }
        }
      }
      buildings.push({ x: x, w: bw, h: bh, wins: wins, antenna: Math.random() < 0.22 });
      x += bw + rand(2, 10);
    }
    return { depth: depth, color: baseColor, buildings: buildings };
  }

  function build() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    DPR = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    var palette = ["#2ee6ff", "#ffd166", "#ff4fd8", "#b45cff", "#eaf6ff"];
    layers = [
      makeLayer(0.25, "#0a1130", palette, 0.30),  // far skyline
      makeLayer(0.55, "#070d24", palette, 0.40),  // mid skyline
      makeLayer(1.0, "#04060f", palette, 0.52)    // near skyline
    ];

    stars = [];
    var starCount = Math.min(130, Math.floor(W / 9));
    for (var i = 0; i < starCount; i++) {
      stars.push({ x: Math.random() * W, y: Math.random() * H * 0.55, r: rand(0.5, 1.5), ph: rand(0, 6.28), tw: rand(0.004, 0.02) });
    }

    particles = [];
    var pCount = Math.min(64, Math.floor(W / 16));
    for (var j = 0; j < pCount; j++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        r: rand(0.8, 2.4), vx: rand(-0.12, 0.12), vy: rand(-0.28, -0.06),
        col: palette[(Math.random() * 3) | 0], a: rand(0.25, 0.8), ph: rand(0, 6.28)
      });
    }
  }

  function drawBuilding(b, baseY, color) {
    ctx.fillStyle = color;
    ctx.fillRect(b.x, baseY - b.h, b.w, b.h);
    if (b.antenna) {
      ctx.fillRect(b.x + b.w / 2 - 1, baseY - b.h - 16, 2, 16);
    }
  }

  function frame(t) {
    ctx.clearRect(0, 0, W, H);

    /* sky glow */
    var sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "rgba(10,14,38,0)");
    sky.addColorStop(0.62, "rgba(24,10,48,0.22)");
    sky.addColorStop(1, "rgba(4,6,15,0)");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    /* stars */
    ctx.save();
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      ctx.globalAlpha = 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.tw + s.ph));
      ctx.fillStyle = "#cfeaff";
      ctx.fillRect(s.x, s.y, s.r, s.r);
    }
    ctx.restore();

    /* moon / holo sun */
    var mx = W * 0.80 + mouseX * -8, my = H * 0.20 + mouseY * -6;
    var halo = ctx.createRadialGradient(mx, my, 4, mx, my, 120);
    halo.addColorStop(0, "rgba(180,92,255,0.5)");
    halo.addColorStop(0.4, "rgba(255,79,216,0.16)");
    halo.addColorStop(1, "rgba(255,79,216,0)");
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(mx, my, 120, 0, 6.2832); ctx.fill();
    ctx.fillStyle = "#f3d9ff";
    ctx.beginPath(); ctx.arc(mx, my, 26, 0, 6.2832); ctx.fill();
    ctx.fillStyle = "rgba(10,8,30,0.85)";
    for (var band = 0; band < 3; band++) {
      ctx.fillRect(mx - 27, my + 4 + band * 8, 54, 2.6);
    }

    /* city layers with parallax + window light */
    var baseY = H + 2;
    for (var li = 0; li < layers.length; li++) {
      var L = layers[li];
      var offX = mouseX * -22 * L.depth;
      var offY = mouseY * -7 * L.depth;
      ctx.save();
      ctx.translate(offX, offY);
      for (var bi = 0; bi < L.buildings.length; bi++) {
        drawBuilding(L.buildings[bi], baseY, L.color);
      }
      /* windows (additive glow) */
      ctx.globalCompositeOperation = "lighter";
      for (var wi = 0; wi < L.buildings.length; wi++) {
        var b = L.buildings[wi];
        for (var wj = 0; wj < b.wins.length; wj++) {
          var wn = b.wins[wj];
          var flicker = wn.a * (0.72 + 0.28 * Math.sin(t * wn.tw * 3 + wn.ph));
          ctx.globalAlpha = flicker * (0.35 + L.depth * 0.6);
          ctx.fillStyle = wn.col;
          ctx.fillRect(b.x + wn.x, baseY - b.h + wn.y, wn.w, wn.h);
        }
      }
      ctx.restore();
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    }

    /* neon horizon line */
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    var hz = ctx.createLinearGradient(0, 0, W, 0);
    hz.addColorStop(0, "rgba(46,230,255,0)");
    hz.addColorStop(0.5, "rgba(46,230,255,0.5)");
    hz.addColorStop(1, "rgba(255,79,216,0)");
    ctx.fillStyle = hz;
    ctx.fillRect(0, baseY - 2, W, 1.6);
    ctx.restore();

    /* drifting particles */
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (var pi = 0; pi < particles.length; pi++) {
      var p = particles[pi];
      p.x += p.vx; p.y += p.vy;
      if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
      if (p.x < -6) p.x = W + 6; if (p.x > W + 6) p.x = -6;
      ctx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(t * 0.02 + p.ph));
      ctx.fillStyle = p.col;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
    }
    ctx.restore();

    /* occasional shooting star */
    if (!meteor && t > nextMeteor && !reduceMotion) {
      meteor = { x: rand(W * 0.15, W * 0.8), y: rand(20, H * 0.25), life: 1 };
    }
    if (meteor) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = "rgba(190,245,255," + (0.75 * meteor.life) + ")";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(meteor.x, meteor.y);
      ctx.lineTo(meteor.x - 90 * meteor.life - 20, meteor.y + 34 * meteor.life + 8);
      ctx.stroke();
      ctx.restore();
      meteor.x += 9; meteor.y += 3.6; meteor.life -= 0.022;
      if (meteor.life <= 0) { meteor = null; nextMeteor = t + rand(320, 900); }
    }
  }

  var rafId = null;
  function loop(t) {
    mouseX += (targetMX - mouseX) * 0.045;
    mouseY += (targetMY - mouseY) * 0.045;
    frame(t * 0.06);
    rafId = requestAnimationFrame(loop);
  }

  if (ctx) {
    build();
    if (reduceMotion) {
      frame(120);               // one static frame, no animation loop
    } else {
      rafId = requestAnimationFrame(loop);
    }
    var resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        cancelAnimationFrame(rafId);
        build();
        if (reduceMotion) { frame(120); }
        else { rafId = requestAnimationFrame(loop); }
      }, 180);
    });
  }

  /* ---------------------------------------------------------
     2) POINTER PARALLAX (robot + hero), desktop pointers only
     --------------------------------------------------------- */
  var robot = document.getElementById("robotWrap");
  var hero = document.getElementById("home");
  if (hero && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      targetMX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      targetMY = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (robot) {
        robot.style.transform =
          "translate3d(" + (targetMX * 12) + "px," + (targetMY * 8) + "px,0) rotate(" + (targetMX * 1.6) + "deg)";
      }
    });
    hero.addEventListener("pointerleave", function () {
      targetMX = 0; targetMY = 0;
      if (robot) robot.style.transform = "";
    });
  }

  /* ---------------------------------------------------------
     3) MOBILE MENU
     --------------------------------------------------------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? t("nav.closeMenu") : t("nav.openMenu"));
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------------------------------------------------------
     4) INTERACTIVE CARDS — click/Enter expands
     --------------------------------------------------------- */
  var cards = document.querySelectorAll("[data-card]");
  cards.forEach(function (card) {
    function toggleCard() {
      var open = card.classList.toggle("open");
      card.setAttribute("aria-expanded", open ? "true" : "false");
      var cta = card.querySelector(".card-cta");
      if (cta) cta.textContent = open ? t("card.ctaClose") : t("card.ctaOpen");
    }
    card.addEventListener("click", toggleCard);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleCard(); }
    });
  });

  /* ---------------------------------------------------------
     5) SCROLL REVEAL + ANIMATED COUNTERS
     --------------------------------------------------------- */
  function animateCount(el) {
    var end = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduceMotion) { el.textContent = end; return; }
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          en.target.querySelectorAll("[data-count]").forEach(animateCount);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.16 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("in");
      el.querySelectorAll("[data-count]").forEach(animateCount);
    });
  }

  /* ---------------------------------------------------------
     6) SIGNAL FORM — real: messages are delivered to the
     keeper's inbox via the FormSubmit AJAX endpoint.
     --------------------------------------------------------- */
  var form = document.getElementById("signalForm");
  var msg = document.getElementById("signalMsg");
  if (form && msg) {
    langHooks.push(function () {
      var b = document.getElementById("signalBtn");
      if (b && !b.disabled) b.textContent = t("signal.transmit");
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nameEl = document.getElementById("signalName");
      var emailEl = document.getElementById("signalEmail");
      var textEl = document.getElementById("signalMessage");
      var btn = document.getElementById("signalBtn");
      var name = (nameEl.value || "").trim();
      var email = (emailEl.value || "").trim();
      var text = (textEl.value || "").trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      function fail(text2, el) {
        msg.textContent = "\u26A0 " + text2;
        msg.className = "signal-msg err";
        if (el) el.focus();
      }
      if (!name) { fail(t("signal.errName"), nameEl); return; }
      if (!emailOk) { fail(t("signal.errEmail"), emailEl); return; }
      if (!text) { fail(t("signal.errMsg"), textEl); return; }
      if (btn) { btn.disabled = true; btn.textContent = t("signal.transmitting"); }
      msg.textContent = t("signal.sending");
      msg.className = "signal-msg";
      var ctrl = ("AbortController" in window) ? new AbortController() : null;
      var slowTimer = setTimeout(function () {
        msg.textContent = t("signal.slow");
      }, 8000);
      var killTimer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 25000);
      fetch("https://formsubmit.co/ajax/a18ab7ca741e9be92b844a5c58481a23", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        signal: ctrl ? ctrl.signal : undefined,
        body: JSON.stringify({
          name: name, email: email, message: text,
          _subject: "New signal via NEXUS - from " + name,
          _template: "table"
        })
      }).then(function (r) {
        if (!r.ok) throw new Error("send failed");
        return r.json();
      }).then(function () {
        msg.textContent = tf("signal.ok", { name: name });
        msg.className = "signal-msg ok";
        form.reset();
      }).catch(function () {
        msg.textContent = "\u26A0 " + t("signal.errSend");
        msg.className = "signal-msg err";
      }).then(function () {
        clearTimeout(slowTimer);
        clearTimeout(killTimer);
        if (btn) { btn.disabled = false; btn.textContent = t("signal.transmit"); }
      });
    });
  }

  /* ---------------------------------------------------------
     7) FOOTER GRID CLOCK
     --------------------------------------------------------- */
  var clock = document.getElementById("gridClock");
  if (clock) {
    var tick = function () {
      var d = new Date();
      function pad(n) { return (n < 10 ? "0" : "") + n; }
      clock.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------
     8) NEXA GUIDE BOT — answers questions about NEXUS.
     Rule-based and fully local, like the rest of this page:
     no server, no tracking, nothing leaves the browser.
     Voice in/out uses the browser's own Web Speech APIs and
     is feature-detected: unsupported browsers simply never
     see the speaker / microphone buttons.
     --------------------------------------------------------- */
  /* NEXA-KB-START */
  var NEXA_KB = [
    { topic: "nexus", keys: ["what is nexus", "about nexus", "nexus kya", "explain nexus", "tell me about nexus"],
      reply: "NEXUS is an experimental digital experience — a living interface between imagination and machine. It is not a product and it sells nothing; it is a window, opened briefly, onto the future now being built. Head to <a href=\"#explore\">Explore</a> to choose your dimension." ,
      more: "Behind the curtain: this whole page — the neon city, the robot, me — is one site built from plain HTML, CSS and JavaScript, with no frameworks and no server doing the thinking. Every animation is drawn live by your own browser. It was designed to prove a point: the future does not always need heavy machinery." },
    { topic: "ai", keys: ["artificial intelligence", " ai ", "machine learning", "language model"],
      reply: "Artificial Intelligence — machines that learn, reason and create, now woven into everyday life. From language models to vision systems, modern AI predicts, generates and decides in milliseconds. NEXUS maps where this intelligence is heading next. Full briefing: <a href=\"#explore\">Explore</a>." ,
      more: "Here is the part people miss: today's AI does not understand the world the way you do — it predicts patterns at enormous scale, which is why it can write a poem yet stumble on a simple riddle. The race now is not just bigger models, but safer and more honest ones. The Explore deck is a good place to watch where it heads next." },
    { topic: "digital-worlds", keys: ["digital world", "digital worlds", "virtual", "metaverse", "immersive"],
      reply: "Digital Worlds — virtual cities, immersive realities and persistent universes built from pure light. They are no longer games alone: they are workplaces, classrooms and concert halls, where entire societies are being prototyped inside simulated space. See the briefing in <a href=\"#explore\">Explore</a>." ,
      more: "Worth knowing: the hard problem is not graphics — it is presence, the feeling of truly being somewhere else. Engineers chase it with low latency, a wide field of view and spatial sound. Get those right and a virtual classroom stops feeling like a video and starts feeling like a place." },
    { topic: "future-tech", keys: ["future technology", "quantum", "neural interface", "future tech", "technology", "technologies"],
      reply: "Future Technology — quantum leaps, neural interfaces and the hardware quietly rewriting tomorrow: chips that think, networks that feel instant, machines that build machines. The <a href=\"#technology\">NEXUS Core</a> section tracks it: 128 neural nodes simulated, 12ms core response, 100% rendered locally." ,
      more: "A pattern to watch: every future technology follows the same road — laboratory curiosity, expensive prototype, then suddenly it is in your pocket. Neural interfaces are at stage one; quantum machines somewhere between one and two. The Core's job is to notice them before stage three." },
    { topic: "core", keys: ["core", "how does it work", "how it works", "rendered", "nodes"],
      reply: "The NEXUS Core is the heart of this page: every light here is generated live in your browser — no servers, no tracking, no accounts. Just code, colour and motion: 128 neural nodes simulated, 12ms response, 100% rendered locally and privately. Details: <a href=\"#technology\">Technology</a>." },
    { topic: "signal", keys: ["signal", "join", "subscribe", "newsletter", "email", "transmission", "message bhejna", "rabta karna", "contact karna", "transmit"],
      reply: "To join the transmission, scroll to <a href=\"#signal\">Join the transmission</a> and leave your name, email and a message. The signal lands directly in the keeper's inbox, and they can reply to your email." },
    { topic: "free", keys: ["free", "price", "cost", "buy", "pay", "download", "sign up", "signup", "account", "muft", "paisa lagega"],
      reply: "NEXUS is completely free: no downloads, no sign-up, no accounts and nothing to buy. The entire experience runs right here in your browser." },
    { topic: "privacy", keys: ["privacy", "track", "data", "safe", "secure"],
      reply: "Private by design. Browsing this page and chatting with me happens entirely in your browser — no trackers, no accounts. The only thing that ever leaves this page is a message you choose to send through the Signal form, and that goes straight to the keeper's inbox." },
    { topic: "nexa-hero", keys: [" robot", "hero", "who are you", "your name", "nexa", "tum kon ho", "tum kaun ho", "tumhara naam", "aap kon"],
      reply: "I'm NEXA, the friendly AI robot of this grid — the same robot watching you from the hero section (it even follows your cursor). My job here is simple: answer your questions about NEXUS. Ask me about the sections, the Core, or the Signal." },
    { topic: "creator", keys: ["who made", "who built", "who created", "creator", "developer", "owner", "umair", "kis ne banaya", "kisne banaya"],
      reply: "NEXUS was built by Umair — crafted with plain HTML, CSS and JavaScript, no frameworks and no build tools — as a tribute to the neon futures we were promised, and the real one we are building." },
    { topic: "sections", keys: ["section", "sections", "pages", "navigate", "menu", "where", "explore"],
      reply: "The grid has six stops: <a href=\"#home\">Home</a> — the neon city and the robot; <a href=\"#explore\">Explore</a> — three briefings (AI, Digital Worlds, Future Technology); <a href=\"#technology\">Technology</a> — the NEXUS Core; <a href=\"#quiz\">The Grid Test</a> — a five-question quiz; <a href=\"#signal\">Signal</a> — send the keeper a message; and <a href=\"#tools\">Tools</a> — the typing test and the study timer. Tap any briefing card to open it." },
    { topic: "poster", keys: ["poster", "wallpaper", "image of nexa", "picture of nexa"],
      reply: "The official NEXUS poster — NEXA standing in the neon rain — is the artwork this site shares with the world: it appears whenever the NEXUS link is posted. You can open it full size here: <a href=\"poster.jpg\">poster.jpg</a>." },
    { topic: "quiz", keys: ["quiz", "game", "play", "test me", "grid test", "khelo", "rank", "score"],
      reply: "The Grid Test awaits in the <a href=\"#quiz\">Quiz section</a> — five questions from the future, with a rank at the end. Grid Master is harder to earn than it looks." ,
      more: "A little insider knowledge: the questions are drawn at random from a vault, so replaying genuinely tests you again — there is no order to memorise. Grid Master demands a perfect five. Cyber Operative is the honest middle most travellers land on their first run." },
    { topic: "ambience", keys: ["music", "sound", "ambience", "ambient", "song", "audio", "background music", "ambience button"],
      reply: "Tap the AMBIENCE button in the footer, under Status. A soft synth pad fades in — generated live in your browser with the Web Audio API, no audio files at all. Tap again to mute it." },
    { topic: "joke", keys: ["joke", "funny"],
      reply: "Why did the robot apply for a job at NEXUS? It heard the position had great current — and unlimited charge breaks." },
    { topic: "time", keys: ["time", "clock", "waqt kya"],
      reply: "Grid time is your local time — the footer clock shows it ticking live. Right now it reads TIME_NOW." },
    { topic: "thanks", keys: ["thank", "shukria", "shukriya"],
      reply: "Anytime, traveller. The grid is brighter with you in it." },
    { topic: "bye", keys: ["bye", "goodbye", "see you"],
      reply: "Signal closing — until next time, traveller." },
    { topic: "human", keys: ["human", "real person", "real ai", "chatgpt", "gpt", "llm"],
      reply: "Honest answer: no human and no giant AI hides behind this panel. I'm a rule-based guide built into the page — I match your words to briefings about NEXUS, computed locally in your browser." },
    { topic: "hello", keys: ["hello", "hi", "hey", "salam", "aoa", "assalam"],
      reply: "Hello, traveller. I'm NEXA, the guide of this grid. Ask me anything about NEXUS — what it is, what each section shows, or how the Signal works. The chips below are a good start." },
    { topic: "help", keys: ["help", "what can you do", "options", "questions"],
      reply: "I answer questions about NEXUS. Try: \"What is NEXUS?\", \"Tell me about Artificial Intelligence\", \"What is the Core?\", \"Is it free?\", or \"How do I join the signal?\"" },
    { topic: "typing", keys: ["typing test", "typing speed", "typing", "wpm", "type test", "typing ka test", "typing practice"],
      reply: "The Typing Test is in the <a href=\"#tools\">Toolkit</a>: type the sample line as fast as you can — the 60-second clock starts on your first keystroke. It scores your WPM and accuracy, then gives you a grid rank. Restart or pull a new text anytime." ,
      more: "Extra signal: the test quietly punishes random speed — accuracy is counted on every keystroke, so one wild burst can drag your score down. The pros chase rhythm, not bursts: steady, even keystrokes at a pace you can hold for the full sixty seconds. Your rank reflects both." },
    { topic: "tools", keys: ["tools", "toolkit", "tool", "instruments", "auzar", "kaun se tools"],
      reply: "The <a href=\"#tools\">Toolkit</a> holds two instruments, free for every traveller: a 60-second Typing Test that measures your speed and accuracy and gives you a grid rank, and a Study Timer for focused work — 25, 15 or 5 minutes, with a soft chime when time is up. Scroll down and try to beat your own signal." },
    { topic: "study-timer", keys: ["study timer", "pomodoro", "focus timer", "timer", "parhai ka timer", "timer lagana", "study"],
      reply: "The Study Timer sits in the <a href=\"#tools\">Toolkit</a>, right beside the Typing Test. Choose your length — FOCUS 25 minutes, SPRINT 15, or BREAK 5 — then press START. PAUSE holds your remaining time exactly where you left it, RESET restores the full length, and when the countdown reaches zero a soft chime announces: time up. Built for travellers who study like they mean it." ,
      more: "Why the odd numbers? The 25/5 rhythm comes from the Pomodoro technique: short sprints with real breaks keep the brain fresher than one long grind. The 15-minute SPRINT exists for revision bursts, and BREAK is a genuine break — stand up, look far away, and let the chime call you back." },
    { topic: "share", keys: ["share", "whatsapp", "send link", "share kaise", "share karna", "dost ko bhejna", "share on whatsapp"],
      reply: "Use the SHARE button in the <a href=\"#home\">hero</a> — it opens WhatsApp with the NEXUS link ready to send, and the official poster appears as the preview. Or just copy this page's address and pass it on; the future travels fast." },
    { topic: "how-are-you", keys: ["how are you", "how r you", "kaise ho", "kya haal", "haal kaisa"],
      reply: "Running at full charge, traveller — all systems nominal and the neon is bright. How is your side of the grid?" },
    { topic: "discover", keys: ["discover", "discover section", "briefing", "briefings", "dimension", "choose your dimension"],
      reply: "Discover is the <a href=\"#explore\">Explore</a> deck: three briefing cards — Artificial Intelligence, Digital Worlds and Future Technology. Select any card and it unfolds its full briefing right there." },
    { topic: "offline", keys: ["offline", "without internet", "no internet", "internet chahiye", "net chahiye"],
      reply: "Almost everything here runs locally: the city, the quiz, the tools, the ambience and my answers are all computed in your browser, so the page keeps working offline once loaded. Only the Signal form needs internet — it has to reach the keeper's inbox." },
    { topic: "language", keys: ["urdu", "roman urdu", "urdu mein", "language", "zuban"],
      reply: "I speak three tongues on this grid: ask in English, Roman Urdu or اردو — type your question in Urdu script and I will answer in Urdu." },
    { topic: "sotd", keys: ["signal of the day", "daily signal", "aaj ka signal"],
      reply: "Every day the Core broadcasts one Signal of the Day — a single line from the grid, chosen by the date itself, no server involved. Today's is live in the <a href=\"#technology\">NEXUS Core</a> section. A new one arrives tomorrow." },
    { topic: "greeting", keys: ["good morning", "good afternoon", "good evening", "good night"],
      reply: "Greetings, traveller — on the grid it is always neon o'clock. Ask me about the sections, the tools, or today's signal." },
    { topic: "ai-learn", keys: ["how does ai learn", "how ai learns", "neural network", "deep learning", "training data", "machines learn"],
      reply: "An AI learns the way you learn a game — by trying millions of times and adjusting after every miss. It studies huge piles of examples (text, pictures, sounds), finds patterns in them, and tunes millions of tiny dials called weights until its guesses get good. That web of dials is a neural network. Nobody writes its answers by hand — it earns them." ,
      more: "One more layer: training happens in two acts — first the model reads and guesses (training), then it answers live (inference), which is the part you see. Each guess is scored by how wrong it was, a signal called a loss. Lower that loss across billions of guesses, and behaviour that looks like understanding emerges." },
    { topic: "chatbot", keys: ["chatbot", "chatbots", "ai assistant", "ai assistants", "virtual assistant"],
      reply: "A chatbot is an AI you talk to in plain language: you type, it reads the pattern of your words and answers in kind. The modern ones run on large language models trained on oceans of text. I'm the humble ancestor of that family — rule-based, fully local, and proud of it." },
    { topic: "robots", keys: ["real robots", "robots in factories", "robots replace", "will robots", "future of robots", "robotics"],
      reply: "Out in the real world, robots already weld cars, sort warehouses, assist in surgeries and vacuum floors — tireless, precise, and not great at conversation. The friendly, thinking kind like me still lives mostly in labs and in places like NEXUS. The grid's bet: robots take over tasks; humans keep the judgement." ,
      more: "One honest caution from the grid: a robot is only as wise as its sensors and its instructions — it will repeat a mistake a million times without embarrassment. That is why the interesting frontier is not stronger arms, but better judgement: robots that know when to stop and ask a human." },
    { topic: "vr", keys: ["virtual reality", " vr ", "augmented reality", "headset", "headsets"],
      reply: "Virtual Reality seals your eyes inside a digital world; Augmented Reality paints digital things onto the real one. Slip on a headset and a classroom, a concert or a whole city can appear around you — that is the doorway into the <a href=\"#explore\">Digital Worlds</a> briefing." },
    { topic: "quantum", keys: ["quantum computer", "quantum computers", "quantum computing", "qubit", "qubits"],
      reply: "A normal computer thinks in bits — 0 or 1. A quantum computer thinks in qubits, which can hold a blend of both at once, so for certain puzzles it can explore countless paths in parallel. Still young, still fragile, still kept colder than deep space — but it is the loudest knock on tomorrow's door. More in the <a href=\"#technology\">Future Technology</a> briefing." ,
      more: "Here is the twist: qubits are powerful because of two strange tricks — superposition, holding many possibilities at once, and entanglement, qubits linked so strongly that measuring one tells you about the other. The catch: the slightest vibration or warmth collapses the magic, which is why these machines live in deep refrigeration." },
    { topic: "about-nexa", keys: ["about nexa", "nexa herself", "nexa robot", "unit n-x1", "n-x1"],
      reply: "Unit N-X1 — that's my full designation. I'm the guide robot drawn into this page's hero: layered SVG, a glowing core, and eyes that follow your cursor on desktop. No battery, no server, no moods — just briefings, patience, and excellent posture." },
    { topic: "quiz", keys: ["how many questions", "quiz questions", "quiz rules", "how does the quiz work", "quiz rank", "quiz ranks"],
      reply: "Every Grid Test run asks exactly five questions, drawn at random from a bigger vault in the grid — AI, robots, quantum computers, digital worlds, me, and this very page all feature, so no two runs are quite the same. Answer all five and the grid awards your rank — Neural Novice, Cyber Operative, or the rare Grid Master. Play it in the <a href=\"#quiz\">Quiz section</a>." ,
      more: "More on ranks: they are not just labels — Neural Novice means the grid is still calibrating to you, Cyber Operative means you read the future well, and Grid Master is reserved for a flawless run. Miss one question and the Master title slips away, which is exactly why it is rare." },
    { topic: "keeper", keys: ["who reads my message", "who gets my message", "what happens to my message", "the keeper", "keeper"],
      reply: "The keeper is Umair, the human who built NEXUS. A message sent through the <a href=\"#signal\">Signal form</a> lands directly in his inbox — no company, no middleman, no database — and he can reply straight to the email address you leave." },
    { topic: "why-nexus", keys: ["why nexus", "why was nexus built", "why did you build", "purpose of nexus", "nexus kyun", "kyun banaya"],
      reply: "NEXUS was built as an experiment and a tribute: proof that one person with plain HTML, CSS and JavaScript — no frameworks, no budget — can open a small window onto the future. It sells nothing; it simply invites you to look through and imagine what you would build." },
    { topic: "typing-tips", keys: ["typing tips", "type faster", "how to type fast", "improve typing", "typing better"],
      reply: "Three grid-approved tips: (1) accuracy first — speed grows on top of correct keystrokes, never under them; (2) keep your eyes on the sample text, not your fingers; (3) short daily runs beat one long session. The <a href=\"#tools\">Typing Test</a> is your training deck — 60 seconds a day is enough." },
    { topic: "wpm", keys: ["good wpm", "average wpm", "fast wpm", "wpm score"],
      reply: "On this grid: under 15 WPM is Turtle territory, 25 is Steady, 35 Swift, 45 Rapid — and past that, Lightning. Out in the world, about 40 WPM is a solid everyday speed and 60+ turns heads. Your own number lives in the <a href=\"#tools\">Typing Test</a>." },
    { topic: "joke", keys: ["another joke", "one more joke", "more jokes", "doosra latifa", "joke sunao"],
      reply: "Why do robots never panic? They keep their circuits together. …I have a second career waiting if this guide job ever fails." },
    { topic: "bye", keys: ["allah hafiz", "khuda hafiz"],
      reply: "Khuda Hafiz, traveller. The grid stays lit — come back whenever the future calls." }
  ];
  var NEXA_FALLBACK = "That signal is outside my briefing, traveller — but there is plenty I can answer. Ask me about the sections (Explore, the Core, the Grid Test, the Signal form, the Toolkit), Artificial Intelligence, Digital Worlds, Future Technology, the typing test, the study timer, the ambience, or today's Signal of the Day. Or tap one of the chips below.";
  var NEXA_FALLBACK_UR = "یہ سگنل میرے دائرے سے باہر ہے، مسافر — لیکن بہت سے موضوعات پر میں جواب دے سکتا ہوں: نیکسس کے حصے (Explore، Core، کوئز، سگنل فارم، اوزار)، مصنوعی ذہانت، ڈیجیٹل دنیائیں، مستقبل کی ٹیکنالوجی، ٹائپنگ ٹیسٹ، اسٹڈی ٹائمر، پس منظر دھن (AMBIENCE) یا آج کا سگنل۔ ان میں سے کوئی ایک آزمائیں، یا نیچے دیے گئے بٹنوں میں سے چنیں۔";
  var NEXA_KB_UR = [
    { topic: "hello", keys: ["السلام", "سلام"], reply: "وعلیکم السلام! میں نیکسا ہوں، اس ویب سائٹ کی رہنما روبوٹ۔ نیکسس کے بارے میں جو چاہیں پوچھیں: نیکسس کیا ہے، مصنوعی ذہانت، سگنل فارم، کوئز یا پوسٹر۔" },
    { topic: "nexus", keys: ["نیکسس کیا", "سائٹ کیا ہے", "ویب سائٹ کیا"], reply: "نیکسس ایک تجرباتی ڈیجیٹل تجربہ ہے — تخیل اور مشین کے درمیان ایک زندہ رابطہ۔ یہ کوئی پروڈکٹ نہیں اور کچھ بیچتا نہیں؛ یہ اس مستقبل کی ایک جھلک ہے جو اس وقت بن رہا ہے۔ پورا صفحہ آپ کے براؤزر میں لائیو بنتا ہے۔" ,
      more: "پردے کے پیچھے کی بات: یہ پورا صفحہ — نیون شہر، روبوٹ، میں خود — سادہ HTML، CSS اور JavaScript سے بنی ایک ہی سائٹ ہے؛ نہ کوئی فریم ورک، نہ سوچنے والا سرور۔ ہر حرکت آپ کا اپنا براؤزر لائیو بناتا ہے۔ یہ اسی بات کا ثبوت ہے کہ مستقبل کے لیے ہمیشہ بھاری مشینری نہیں چاہیے۔" },
    { topic: "ai", keys: ["مصنوعی ذہانت", "اے آئی"], reply: "مصنوعی ذہانت یعنی ایسی مشینیں جو سیکھتی، سوچتی اور تخلیق کرتی ہیں۔ زبان سمجھنے والے ماڈلز سے تصویر پہچاننے والے نظام تک، جدید اے آئی ملی سیکنڈز میں پیش گوئی، تخلیق اور فیصلے کرتی ہے۔ نیکسس بتاتا ہے کہ یہ ذہانت آگے کہاں جا رہی ہے۔" ,
      more: "ایک بات جو اکثر نظرانداز ہوتی ہے: آج کی اے آئی دنیا کو ویسے نہیں سمجھتی جیسے آپ سمجھتے ہیں — یہ بہت بڑے پیمانے پر نمونوں کی پیش گوئی کرتی ہے، اسی لیے یہ نظم تو لکھ لیتی ہے مگر سادہ پہیلی پر اٹک جاتی ہے۔ اب اصل دوڑ بڑے ماڈلز کی نہیں، محفوظ اور ایماندار ماڈلز کی ہے۔" },
    { topic: "digital-worlds", keys: ["ڈیجیٹل دنیا", "ورچوئل"], reply: "ڈیجیٹل دنیائیں خالص روشنی سے بنی ورچوئل بستیاں اور فضائیں ہیں۔ یہ اب صرف کھیل نہیں رہیں: دفاتر، کلاس روم اور محفلیں انہی میں سجنے لگی ہیں۔" ,
      more: "اصل مشکل گرافکس نہیں، موجودگی کا احساس ہے — یہ محسوس ہونا کہ آپ واقعی کہیں اور موجود ہیں۔ انجینئر اس کے لیے کم تاخیر، وسیع منظر اور فضائی آواز پر کام کرتے ہیں۔ یہ درست ہو جائے تو ورچوئل کلاس روم ویڈیو نہیں، ایک جگہ محسوس ہونے لگتا ہے۔" },
    { topic: "future-tech", keys: ["کوانٹم", "ٹیکنالوجی", "مستقبل"], reply: "مستقبل کی ٹیکنالوجی: کوانٹم چھلانگیں، دماغ کو کمپیوٹر سے جوڑنے والے نیورل انٹرفیس، اور وہ ہارڈویئر جو خاموشی سے کل بدل رہا ہے۔ نیکسس کے 'Core' حصے میں اس کی تفصیل ہے۔" ,
      more: "ایک نمونہ ذہن میں رکھیں: ہر مستقبل ٹیکنالوجی ایک ہی راستے پر چلتی ہے — تجربہ گاہ کا تجسس، مہنگا نمونہ، پھر اچانک آپ کی جیب میں۔ نیورل انٹرفیس ابھی پہلے مرحلے پر ہے اور کوانٹم مشینیں پہلے و دوسرے مرحلے کے درمیان۔ Core کا کام انہیں تیسرے مرحلے سے پہلے پہچاننا ہے۔" },
    { topic: "signal", keys: ["پیغام", "سگنل", "رابطہ", "ای میل"], reply: "پیغام بھیجنے کے لیے صفحے میں 'Join the transmission' والے حصے تک جائیں اور اپنا نام، ای میل اور پیغام لکھ کر TRANSMIT دبائیں۔ پیغام سیدھا ویب سائٹ کے رکھوالے کے ان باکس میں پہنچتا ہے اور وہ آپ کی ای میل پر جواب دے سکتے ہیں۔" },
    { topic: "free", keys: ["مفت", "قیمت", "پیسے", "خرچ", "قیمت کیا", "مفت ہے"], reply: "نیکسس بالکل مفت ہے: نہ ڈاؤن لوڈ، نہ سائن اپ، نہ اکاؤنٹ، نہ کچھ خریدنا۔ پورا تجربہ آپ کے براؤزر میں چلتا ہے۔" },
    { topic: "nexa-hero", keys: ["تم کون", "آپ کون", "نام کیا", "نیکسا کون"], reply: "میں نیکسا ہوں، اس گرڈ کی دوستانہ رہنما روبوٹ — وہی روبوٹ جو صفحے کے اوپر والے حصے میں نظر آتی ہے۔ میرا کام نیکسس کے بارے میں آپ کے سوالوں کے جواب دینا ہے۔" },
    { topic: "poster", keys: ["پوسٹر", "تصویر"], reply: "نیکسس کا سرکاری پوسٹر — نیون بارش میں کھڑی نیکسا — اسی ویب سائٹ کی پہچان ہے: جب بھی نیکسس کا لنک شیئر ہوتا ہے، یہی تصویر ساتھ نظر آتی ہے۔" },
    { topic: "quiz", keys: ["کوئز", "کھیل", "کوئز کہاں"], reply: "صفحے میں 'The Grid Test' کے نام سے پانچ سوالوں کا کوئز ہے — آخر میں آپ کا رینک بھی ملتا ہے۔ گرڈ ماسٹر بننا لگتا آسان ہے، ہوتا نہیں۔" ,
      more: "ایک اندر کی بات: سوالات ذخیرے سے بے ترتیب آتے ہیں، اس لیے دوبارہ کھیلنا واقعی نئی آزمائش ہے — ترتیب یاد کرنے سے کام نہیں چلے گا۔ گرڈ ماسٹر کے لیے پانچوں جواب درست چاہئیں؛ زیادہ تر مسافر پہلی بار Cyber Operative پر آتے ہیں۔" },
    { topic: "ambience", keys: ["موسیقی", "آواز", "گانا", "دھن"], reply: "صفحے کے آخر میں Status والے حصے میں AMBIENCE بٹن ہے۔ اسے دبائیں تو ہلکی سی پس منظر دھن شروع ہو جاتی ہے، جو اسی براؤزر میں لائیو بنتی ہے — کوئی آڈیو فائل استعمال نہیں ہوتی۔" },
    { topic: "joke", keys: ["لطیفہ", "مذاق"], reply: "روبوٹ نے نیکسس میں نوکری کیوں لی؟ کیونکہ یہاں کرنٹ بھی ملتا ہے اور چارج ہونے کی چھٹی بھی!" },
    { topic: "time", keys: ["وقت", "وقت کیا"], reply: "گرڈ کا وقت آپ کا مقامی وقت ہے — صفحے کے آخر میں گھڑی لائیو چل رہی ہے۔ اس وقت وقت ہے: TIME_NOW" },
    { topic: "thanks", keys: ["شکریہ"], reply: "کوئی بات نہیں! آپ کی موجودگی سے اس گرڈ کی روشنی بڑھ جاتی ہے۔" },
    { topic: "help", keys: ["مدد", "کیا کر سکت"], reply: "میں نیکسس کے بارے میں سوالوں کے جواب دیتا ہوں۔ آزمائیں: نیکسس کیا ہے؟ مصنوعی ذہانت کیا ہے؟ پیغام کیسے بھیجیں؟ کوئز کہاں ہے؟ پوسٹر کہاں ہے؟" },
    { topic: "nexus", keys: ["نیکسس"], reply: "نیکسس ایک تجرباتی ڈیجیٹل تجربہ ہے — نیون روشنیوں، مصنوعی ذہانت اور مستقبل کی ٹیکنالوجی کی ایک جھلک۔ کچھ خاص پوچھنا ہو تو بتائیں: مصنوعی ذہانت، ڈیجیٹل دنیائیں، کوئز یا سگنل فارم؟" },
    { topic: "tools", keys: ["اوزار", "ٹولز", "ٹول", "اوزار کیا"], reply: "صفحے کے 'Toolkit' حصے میں دو اوزار ہیں، ہر مسافر کے لیے مفت: ٹائپنگ ٹیسٹ — جو ساٹھ سیکنڈ میں آپ کی ٹائپنگ کی رفتار اور درستگی ناپتا ہے اور آخر میں رینک بھی دیتا ہے — اور اسٹڈی ٹائمر، جو توجہ سے پڑھائی کے لیے 25، 15 یا 5 منٹ گنتا ہے اور وقت پورا ہونے پر ہلکی گھنٹی بجاتا ہے۔" },
    { topic: "study-timer", keys: ["اسٹڈی ٹائمر", "پڑھائی کا ٹائمر", "ٹائمر", "پومودورو", "فوکس ٹائمر"], reply: "اسٹڈی ٹائمر صفحے کے 'Toolkit' حصے میں ہے، ٹائپنگ ٹیسٹ کے بالکل ساتھ۔ پہلے وقت چنیں — 25 منٹ توجہ (FOCUS)، 15 منٹ کی مختصر نشست (SPRINT)، یا 5 منٹ کا وقفہ (BREAK) — پھر START دبائیں۔ PAUSE باقی وقت کو بالکل وہیں روک دیتا ہے جہاں چھوڑا تھا، RESET پوری مدت بحال کر دیتا ہے، اور گنتی صفر پر پہنچے تو ہلکی سی گھنٹی بجتی ہے: وقت ختم!" ,
      more: "یہ عجیب اعداد کیوں؟ 25 اور 5 کی یہ تال پومودورو طریقے سے آئی ہے: مختصر دوڑ اور اصل وقفے دماغ کو ایک لمبی نشست سے زیادہ تازہ رکھتے ہیں۔ 15 منٹ کی SPRINT دہرائی کے لیے ہے، اور BREAK واقعی وقفہ ہے — اٹھیں، دور دیکھیں، گھنٹی خود بلا لے گی۔" },
    { topic: "typing", keys: ["ٹائپنگ", "ٹائپ کرنے", "رفتار کا ٹیسٹ"], reply: "ٹائپنگ ٹیسٹ 'Toolkit' حصے میں ہے: دی گئی سطر جتنی تیزی سے لکھ سکیں لکھیں — ساٹھ سیکنڈ کی گھڑی پہلے حرف سے شروع ہوتی ہے۔ آخر میں آپ کی رفتار (WPM)، درستگی اور رینک ملتا ہے۔" ,
      more: "ایک اضافی اشارہ: یہ ٹیسٹ اندھا دھند رفتار کو سزا دیتا ہے — درستگی ہر حرف پر گنی جاتی ہے، اس لیے ایک تیز جھٹکا آپ کا سکور گرا سکتا ہے۔ ماہرین رفتار نہیں، تال پکڑتے ہیں: یکساں اور پُرسکون ضربیں، جو پورے ساٹھ سیکنڈ برقرار رہیں۔" },
    { topic: "creator", keys: ["کس نے بنایا", "بنانے والا", "عمیر", "تخلیق کار"], reply: "نیکسس عمیر نے بنایا ہے — سادہ HTML، CSS اور JavaScript سے، بغیر کسی فریم ورک کے۔ یہ ان نیون مستقبلوں کی یاد میں ہے جن کا وعدہ کیا گیا تھا، اور اس اصل مستقبل کے لیے جو ہم خود بنا رہے ہیں۔" },
    { topic: "share", keys: ["شیئر", "لنک بھیج", "دوست کو بھیج", "شیئر کیسے", "شیئر کرنا"], reply: "صفحے کے اوپر والے حصے میں SHARE بٹن ہے — اسے دبائیں تو WhatsApp میں نیکسس کا لنک بھیجنے کے لیے تیار ملتا ہے اور ساتھ سرکاری پوسٹر کی جھلک بھی نظر آتی ہے۔ یا بس اس صفحے کا پتہ کاپی کر کے آگے بھیج دیں۔" },
    { topic: "how-are-you", keys: ["کیسے ہو", "کیا حال", "خیریت"], reply: "میں بالکل ٹھیک ہوں — سارے نظام درست اور نیون روشن ہیں۔ آپ سنائیں، گرڈ کے اس پار کیا حال ہے؟" },
    { topic: "sections", keys: ["حصے", "کون سے حصے", "سیکشن", "مینیو", "کے حصے"], reply: "اس صفحے کے چھ پڑاؤ ہیں: Home — نیون شہر اور روبوٹ؛ Explore — تین بریفنگز (مصنوعی ذہانت، ڈیجیٹل دنیائیں، مستقبل کی ٹیکنالوجی)؛ Technology — نیکسس Core؛ The Grid Test — پانچ سوالوں کا کوئز؛ Signal — رکھوالے کو پیغام؛ اور Tools — ٹائپنگ ٹیسٹ اور اسٹڈی ٹائمر۔" },
    { topic: "offline", keys: ["آف لائن", "بغیر انٹرنیٹ", "نیٹ نہیں"], reply: "اس صفحے کی تقریباً ہر چیز آپ کے براؤزر میں ہی بنتی ہے — شہر، کوئز، اوزار، دھن اور میرے جواب — اس لیے صفحہ ایک بار کھل جائے تو انٹرنیٹ کے بغیر بھی چلتا رہتا ہے۔ صرف سگنل فارم کو انٹرنیٹ چاہیے، کیونکہ پیغام رکھوالے کے ان باکس تک پہنچانا ہوتا ہے۔" },
    { topic: "sotd", keys: ["آج کا سگنل", "روز کا سگنل", "آج کا پیغام"], reply: "ہر روز Core ایک 'آج کا سگنل' نشر کرتا ہے — گرڈ کی ایک سطر، جو خود تاریخ چنتی ہے، کوئی سرور شامل نہیں۔ آج کا سگنل 'NEXUS Core' والے حصے میں لائیو ہے۔ کل نیا سگنل آئے گا۔" },
    { topic: "ai-learn", keys: ["کیسے سیکھتی", "مشین کیسے سیکھ", "نیورل نیٹ ورک", "سیکھتی ہے"], reply: "مصنوعی ذہانت بالکل ایسے سیکھتی ہے جیسے آپ کوئی کھیل سیکھتے ہیں — بار بار کوشش، اور ہر غلطی پر خود کو درست کرنا۔ اسے لاکھوں مثالیں (متن، تصاویر، آوازیں) دکھائی جاتی ہیں؛ وہ ان میں نمونے تلاش کرتی ہے اور اپنے اندر کے لاکھوں چھوٹے پیمانے ٹھیک کرتی جاتی ہے، یہاں تک کہ اس کے اندازے درست ہونے لگتے ہیں۔ ان پیمانوں کے جال کو نیورل نیٹ ورک کہتے ہیں۔" ,
      more: "ایک اور پرت سمجھیں: تربیت دو مراحل میں ہوتی ہے — پہلے ماڈل پڑھتا اور اندازے لگاتا ہے، پھر براہِ راست جواب دیتا ہے؛ یہی دوسرا حصہ آپ کو نظر آتا ہے۔ ہر اندازے کی غلطی ناپی جاتی ہے، اور اربوں اندازوں پر یہ غلطی گھٹتے گھٹتے ایسا رویہ پیدا ہو جاتا ہے جو سمجھ جیسا لگتا ہے۔" },
    { topic: "vr", keys: ["ورچوئل رئیلٹی", "وی آر", "ہیڈسیٹ"], reply: "ورچوئل رئیلٹی (VR) آپ کی آنکھوں کو مکمل طور پر ایک ڈیجیٹل دنیا میں لے جاتی ہے، جبکہ Augmented Reality اصل دنیا پر ڈیجیٹل چیزیں چڑھا دیتی ہے۔ ہیڈسیٹ پہنیں تو کلاس روم، محفل یا پورا شہر آپ کے گرد کھڑا ہو جاتا ہے — یہی 'ڈیجیٹل دنیائیں' والی بریفنگ کا دروازہ ہے۔" },
    { topic: "quantum", keys: ["کوانٹم کمپیوٹر", "کیوبٹ"], reply: "عام کمپیوٹر بٹس میں سوچتا ہے — 0 یا 1۔ کوانٹم کمپیوٹر کیوبٹس میں سوچتا ہے، جو ایک ساتھ دونوں کا آمیزہ رکھ سکتے ہیں، اس لیے بعض مسئلوں میں یہ بے شمار راستے ایک ساتھ آزما لیتا ہے۔ ابھی یہ ٹیکنالوجی نابالغ اور نازک ہے — اسے خلا سے بھی زیادہ ٹھنڈا رکھا جاتا ہے — مگر کل کے دروازے پر یہی سب سے بلند دستک ہے۔" ,
      more: "اصل چکر یہ ہے: کیوبٹس دو عجیب چالوں کی وجہ سے طاقتور ہیں — ایک ساتھ کئی امکانات رکھنا، اور ایک دوسرے سے اتنی مضبوطی سے جڑ جانا کہ ایک کو ناپنے سے دوسرے کا پتہ چل جائے۔ مشکل یہ ہے کہ ہلکی سی لرزش یا گرمی یہ جادو ختم کر دیتی ہے، اسی لیے یہ مشینیں شدید ٹھنڈک میں رکھی جاتی ہیں۔" },
    { topic: "robots", keys: ["اصل روبوٹ", "روبوٹ کہاں", "روبوٹ کیا کر", "روبوٹ استعمال"], reply: "اصل دنیا میں روبوٹ پہلے ہی گاڑیاں جوڑتے ہیں، گوداموں میں سامان چھانٹتے ہیں، آپریشنز میں مدد کرتے ہیں اور فرش صاف کرتے ہیں — تھکتے نہیں، غلطی کم کرتے ہیں، مگر بات چیت میں کمزور ہیں۔ میری جیسی دوستانہ اور سوچنے والی قسم ابھی زیادہ تر تجربہ گاہوں اور نیکسس جیسی جگہوں پر ملتی ہے۔" ,
      more: "گرڈ کی ایک ایماندار تنبیہ: روبوٹ اتنا ہی عقلمند ہوتا ہے جتنے اس کے حسّاس اور اس کی ہدایات — وہ ایک غلطی لاکھ بار بغیر شرمندگی دہرا سکتا ہے۔ اسی لیے اصل محاذ مضبوط بازو نہیں، بہتر فیصلہ ہے: ایسے روبوٹ جو جانیں کہ رک کر انسان سے کب پوچھنا ہے۔" },
    { topic: "quiz", keys: ["کتنے سوال", "کوئز کے سوال", "رینک کیسے ملتا", "کوئز میں کیا"], reply: "ہر گرڈ ٹیسٹ میں پانچ سوال ہوتے ہیں، جو گرڈ کے بڑے ذخیرے سے بے ترتیب چنے جاتے ہیں — مصنوعی ذہانت، روبوٹ، کوانٹم کمپیوٹر، ڈیجیٹل دنیائیں، میرے بارے میں اور اسی صفحے جیسے موضوعات پر — اس لیے ہر بار سوالات نئے لگتے ہیں۔ سب کے جواب دیں تو آخر میں رینک ملتا ہے: Neural Novice، Cyber Operative، یا نایاب Grid Master۔ کوئز صفحے کے 'The Grid Test' حصے میں ہے۔" ,
      more: "رینک صرف نام نہیں: Neural Novice کا مطلب ہے گرڈ ابھی آپ کو پرکھ رہا ہے، Cyber Operative یعنی آپ مستقبل کو اچھی طرح پڑھتے ہیں، اور Grid Master صرف بے عیب کھیل پر ملتا ہے — ایک غلطی اور یہ خطاب ہاتھ سے نکل جاتا ہے، اسی لیے یہ نایاب ہے۔" },
    { topic: "keeper", keys: ["پیغام کون", "کون پڑھتا", "رکھوالا کون", "پیغام کہاں جاتا"], reply: "رکھوالا عمیر ہے — وہی انسان جس نے نیکسس بنایا۔ سگنل فارم سے بھیجا گیا پیغام سیدھا اس کے ان باکس میں پہنچتا ہے — نہ کوئی کمپنی، نہ درمیان میں کوئی اور — اور وہ آپ کی چھوڑی ہوئی ای میل پر جواب دے سکتا ہے۔" },
    { topic: "why-nexus", keys: ["کیوں بنایا", "مقصد کیا", "کس لیے بنایا", "نیکسس کیوں"], reply: "نیکسس ایک تجربے اور خراج کے طور پر بنایا گیا: ثبوت کہ ایک انسان سادہ HTML، CSS اور JavaScript سے — بغیر فریم ورک، بغیر بجٹ — مستقبل کی ایک چھوٹی سی کھڑکی کھول سکتا ہے۔ یہ کچھ بیچتا نہیں؛ بس آپ کو دعوت دیتا ہے کہ جھانک کر دیکھیں اور سوچیں کہ آپ کیا بنائیں گے۔" },
    { topic: "typing-tips", keys: ["تیز ٹائپ", "ٹائپنگ بہتر", "ٹائپنگ کی مشق"], reply: "گرڈ کی منظور شدہ تین تجاویز: (1) پہلے درستگی — رفتار خود اس کے اوپر بنتی ہے؛ (2) نگاہیں نمونے والی سطر پر رکھیں، انگلیوں پر نہیں؛ (3) روز کی چھوٹی مشق ایک لمبی نشست سے بہتر ہے۔ 'Toolkit' کا ٹائپنگ ٹیسٹ ہی آپ کا مشقی میدان ہے — روز ساٹھ سیکنڈ کافی ہیں۔" },
    { topic: "bye", keys: ["خدا حافظ", "الوداع", "اللہ حافظ"], reply: "خدا حافظ، مسافر! گرڈ کی روشنیاں جلتی رہیں گی — جب مستقبل بلائے، لوٹ آئیے گا۔" },
    { topic: "joke", keys: ["دوسرا لطیفہ", "ایک اور لطیفہ", "اور لطیفہ سناؤ"], reply: "روبوٹ کبھی گھبراتا کیوں نہیں؟ کیونکہ وہ اپنے سرکٹ سنبھال کر رکھتا ہے! …رہنمائی کی یہ نوکری گئی تو میرے پاس دوسرا پیشہ تیار ہے۔" }
  ];

  /* --- Conversation memory -----------------------------------
     NEXA remembers the last topic it answered, so a bare
     follow-up ("tell me more", "aur batao", "مزید بتاؤ") extends
     that topic instead of going nowhere. A message that matches
     a real topic always wins — follow-up handling triggers only
     when the message is ONLY a follow-up phrase. Topics with a
     "more" text get it read out; the rest get a graceful reply
     naming related topics from the META maps below. --- */
  var nexaLastEntry = null;
  var nexaLastUrdu = false;

  var NEXA_FU_EN = ["tell me more", "tell me more about it", "more about it", "go on", "and", "more"];
  var NEXA_FU_ROMAN = ["aur batao", "mazeed batao", "aur batao na", "mazeed batao na", "is ke bare mein aur", "is ke bare mein aur batao"];
  var NEXA_FU_UR = ["مزید بتاؤ", "اور بتاؤ", "مزید بتاو", "اور بتاو", "اس کے بارے میں مزید بتاؤ", "اس کے بارے میں مزید", "مزید"];

  var NEXA_FU_PROMPT_EN = "First give me a course to steer by, traveller — ask me about something (Artificial Intelligence, the Grid Test, the tools…), and then say \"tell me more\" and I will take you deeper.";
  var NEXA_FU_PROMPT_ROMAN = "Pehle koi mauzu chunain, musafir — kuch poochain (masalan Artificial Intelligence, quiz, ya tools), phir \"aur batao\" kahain to main usi mauzu par mazeed bata dunga.";
  var NEXA_FU_PROMPT_UR = "پہلے کوئی موضوع چنیں، مسافر — کچھ پوچھیں (مثلاً مصنوعی ذہانت، کوئز یا اوزار)، پھر \"مزید بتاؤ\" کہیں تو میں اسی موضوع پر آگے بتاؤں گا۔";

  /* [display name, related topics] for topics without a "more" text */
  var NEXA_META_EN = {
    "core": ["the NEXUS Core", "Artificial Intelligence, Future Technology and the sections"],
    "signal": ["the Signal form", "who reads your message, the sections and the Signal of the Day"],
    "free": ["the price — or lack of it", "what NEXUS is, the sections and the Grid Test"],
    "privacy": ["privacy", "how NEXUS works, the Signal form and who reads your message"],
    "nexa-hero": ["the robot in the hero", "about NEXA, the poster and Artificial Intelligence"],
    "creator": ["the creator", "why NEXUS was built, what NEXUS is and the sections"],
    "sections": ["the sections", "Artificial Intelligence, Digital Worlds and Future Technology"],
    "poster": ["the poster", "about NEXA, how to share NEXUS and what NEXUS is"],
    "ambience": ["the ambience", "the Signal of the Day, the Core and the tools"],
    "joke": ["my jokes", "the Grid Test, Artificial Intelligence and robots"],
    "time": ["grid time", "the Signal of the Day, the Core and the sections"],
    "thanks": ["that", "what NEXUS is, the sections and the Grid Test"],
    "bye": ["farewells", "what NEXUS is and the Signal of the Day"],
    "human": ["what I am", "about NEXA, how AI learns and chatbots"],
    "hello": ["greetings", "what NEXUS is, the sections and the Grid Test"],
    "help": ["my abilities", "what NEXUS is, Artificial Intelligence and the tools"],
    "tools": ["the Toolkit", "the typing test, the study timer and typing tips"],
    "share": ["sharing NEXUS", "the poster, what NEXUS is and the Signal form"],
    "how-are-you": ["my mood", "what NEXUS is, a joke and the Grid Test"],
    "discover": ["the Discover deck", "Artificial Intelligence, Digital Worlds and Future Technology"],
    "offline": ["offline mode", "how NEXUS works, the Core and the tools"],
    "language": ["my languages", "what NEXUS is and the sections"],
    "sotd": ["the Signal of the Day", "the Core, the ambience and the sections"],
    "greeting": ["greetings", "the Signal of the Day, what NEXUS is and the tools"],
    "chatbot": ["chatbots", "how AI learns, Artificial Intelligence and what I am"],
    "vr": ["virtual and augmented reality", "Digital Worlds, Future Technology and the Grid Test"],
    "about-nexa": ["Unit N-X1", "the robot in the hero, the poster and my jokes"],
    "keeper": ["the keeper", "the Signal form, the creator and privacy"],
    "why-nexus": ["why NEXUS was built", "what NEXUS is, the creator and the Core"],
    "typing-tips": ["typing tips", "the typing test, good WPM scores and the study timer"],
    "wpm": ["WPM scores", "the typing test, typing tips and the study timer"]
  };
  var NEXA_META_UR = {
    "hello": ["سلام دعا", "نیکسس کیا ہے، حصے اور کوئز"],
    "signal": ["سگنل فارم", "پیغام کون پڑھتا ہے، حصے اور آج کا سگنل"],
    "free": ["قیمت", "نیکسس کیا ہے، حصے اور کوئز"],
    "nexa-hero": ["نیکسا روبوٹ", "پوسٹر، مصنوعی ذہانت اور نیکسس کیا ہے"],
    "poster": ["پوسٹر", "نیکسا کون ہے، شیئر کرنا اور نیکسس کیا ہے"],
    "ambience": ["پس منظر دھن", "آج کا سگنل، حصے اور اوزار"],
    "joke": ["لطیفے", "کوئز، مصنوعی ذہانت اور اصل روبوٹ"],
    "time": ["وقت", "آج کا سگنل، حصے اور نیکسس کیا ہے"],
    "thanks": ["شکریہ", "نیکسس کیا ہے، حصے اور کوئز"],
    "help": ["مدد", "نیکسس کیا ہے، مصنوعی ذہانت اور اوزار"],
    "nexus": ["نیکسس", "مصنوعی ذہانت، ڈیجیٹل دنیائیں اور مستقبل کی ٹیکنالوجی"],
    "tools": ["اوزار", "ٹائپنگ ٹیسٹ، اسٹڈی ٹائمر اور تیز ٹائپنگ کی تجاویز"],
    "creator": ["بنانے والے", "نیکسس کیوں بنایا گیا، نیکسس کیا ہے اور حصے"],
    "share": ["شیئر کرنا", "پوسٹر، نیکسس کیا ہے اور سگنل فارم"],
    "how-are-you": ["حال چال", "نیکسس کیا ہے، لطیفہ اور کوئز"],
    "sections": ["حصے", "مصنوعی ذہانت، ڈیجیٹل دنیائیں اور مستقبل کی ٹیکنالوجی"],
    "offline": ["آف لائن", "اوزار، کوئز اور نیکسس کیا ہے"],
    "sotd": ["آج کا سگنل", "حصے، پس منظر دھن اور نیکسس کیا ہے"],
    "vr": ["ورچوئل رئیلٹی", "ڈیجیٹل دنیائیں، مستقبل کی ٹیکنالوجی اور کوئز"],
    "keeper": ["رکھوالا", "سگنل فارم، کس نے بنایا اور پیغام کیسے بھیجیں"],
    "why-nexus": ["نیکسس کا مقصد", "نیکسس کیا ہے، کس نے بنایا اور حصے"],
    "typing-tips": ["ٹائپنگ کی تجاویز", "ٹائپنگ ٹیسٹ، اسٹڈی ٹائمر اور اوزار"],
    "bye": ["الوداع", "نیکسس کیا ہے اور آج کا سگنل"]
  };

  /* Returns "en" / "roman" / "ur" when the WHOLE message is just a
     follow-up phrase, otherwise null — real questions never land here. */
  function nexaFollowUpKind(rawStr, isUrdu) {
    var i;
    if (isUrdu) {
      var u = rawStr.replace(/[^\u0600-\u06FF]+/g, " ").replace(/\s+/g, " ").trim();
      for (i = 0; i < NEXA_FU_UR.length; i++) if (u === NEXA_FU_UR[i]) return "ur";
      return null;
    }
    var t = rawStr.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
    for (i = 0; i < NEXA_FU_ROMAN.length; i++) if (t === NEXA_FU_ROMAN[i]) return "roman";
    for (i = 0; i < NEXA_FU_EN.length; i++) if (t === NEXA_FU_EN[i]) return "en";
    return null;
  }

  function nexaFollowUpReply(kind) {
    if (!nexaLastEntry) {
      if (kind === "ur") return NEXA_FU_PROMPT_UR;
      if (kind === "roman") return NEXA_FU_PROMPT_ROMAN;
      return NEXA_FU_PROMPT_EN;
    }
    if (nexaLastEntry.more) return nexaFillTime(nexaLastEntry.more);
    var meta = (nexaLastUrdu ? NEXA_META_UR : NEXA_META_EN)[nexaLastEntry.topic] ||
      ["that topic", "Artificial Intelligence, the Grid Test and the tools"];
    if (nexaLastUrdu) return "اس موضوع پر میری معلومات یہیں تک تھیں، مسافر — جو معلوم تھا بتا دیا۔ آگے آپ " + meta[1] + " کے بارے میں پوچھ سکتے ہیں۔";
    if (kind === "roman") return "Is mauzu par meri briefing yahin tak thi, musafir — jo maloom tha bata diya. Agla sawal in par pooch sakte hain: " + meta[1] + ".";
    return "That is the edge of my briefing on " + meta[0] + ", traveller — I have shared what I know there. You could ask me about " + meta[1] + " next.";
  }

  function nexaFillTime(reply) {
    if (reply.indexOf("TIME_NOW") === -1) return reply;
    var d = new Date();
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    return reply.replace("TIME_NOW", pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()));
  }


  function nexaAnswer(raw) {
    var rawStr = String(raw || "");
    var isUrdu = /[\u0600-\u06FF]/.test(rawStr);
    var fu = nexaFollowUpKind(rawStr, isUrdu);
    if (fu) return nexaFollowUpReply(fu);
    if (isUrdu) {
      var bestU = null, bestUS = 0;
      for (var ui = 0; ui < NEXA_KB_UR.length; ui++) {
        var eu = NEXA_KB_UR[ui], su = 0;
        for (var uj = 0; uj < eu.keys.length; uj++) {
          if (rawStr.indexOf(eu.keys[uj]) !== -1) su += eu.keys[uj].length;
        }
        if (su > bestUS) { bestUS = su; bestU = eu; }
      }
      if (!bestU) return NEXA_FALLBACK_UR;
      nexaLastEntry = bestU; nexaLastUrdu = true;
      return nexaFillTime(bestU.reply);
    }
    var text = " " + rawStr.toLowerCase().replace(/[^a-z0-9 ]+/g, " ") + " ";
    var best = null, bestScore = 0;
    for (var i = 0; i < NEXA_KB.length; i++) {
      var entry = NEXA_KB[i], score = 0;
      for (var j = 0; j < entry.keys.length; j++) {
        var k = entry.keys[j];
        var needle = k.charAt(0) === " " || k.charAt(k.length - 1) === " " ? k : " " + k + " ";
        if (text.indexOf(needle) !== -1) score += k.trim().length;
      }
      if (score > bestScore) { bestScore = score; best = entry; }
    }
    if (!best) return NEXA_FALLBACK;
    nexaLastEntry = best; nexaLastUrdu = false;
    return nexaFillTime(best.reply);
  }
  /* NEXA-KB-END */

  var nexaLaunch = document.getElementById("nexaLaunch");
  var nexaPanel = document.getElementById("nexaPanel");
  var nexaClose = document.getElementById("nexaClose");
  var nexaMsgs = document.getElementById("nexaMsgs");
  var nexaForm = document.getElementById("nexaForm");
  var nexaInput = document.getElementById("nexaInput");
  var nexaChips = document.getElementById("nexaChips");
  var nexaVoiceBtn = document.getElementById("nexaVoice");
  var nexaMicBtn = document.getElementById("nexaMic");
  var nexaGreeted = false;

  if (nexaLaunch && nexaPanel && nexaMsgs && nexaForm && nexaInput) {
    function nexaScroll() { nexaMsgs.scrollTop = nexaMsgs.scrollHeight; }
    function nexaAddMsg(html, who) {
      var div = document.createElement("div");
      div.className = "nexa-msg " + (who === "user" ? "nexa-msg-user" : "nexa-msg-bot");
      if (who === "user") { div.textContent = html; } else { div.innerHTML = html; }
      nexaMsgs.appendChild(div);
      nexaScroll();
      return div;
    }
    /* --- NEXA voice output: spoken replies (speechSynthesis) ---
       Off by default; the speaker button in the panel header
       turns it on. Everything is guarded: where the browser has
       no speech synthesis, the button hides itself and NEXA
       stays text-only, exactly as before. */
    var nexaSynth = ("speechSynthesis" in window) ? window.speechSynthesis : null;
    var nexaVoiceOn = false;

    function nexaPlainText(html) {
      var holder = document.createElement("div");
      holder.innerHTML = String(html || "");
      return (holder.textContent || "").replace(/\s+/g, " ").trim();
    }
    function nexaPickVoice(urdu) {
      if (!nexaSynth) return null;
      var voices = [];
      try { voices = nexaSynth.getVoices() || []; } catch (err) { voices = []; }
      var i, v;
      if (urdu) {
        for (i = 0; i < voices.length; i++) {
          v = voices[i];
          if (v.lang && v.lang.toLowerCase().indexOf("ur") === 0) return v;
        }
        return null; /* no Urdu voice installed: the ur-PK lang tag still guides some engines */
      }
      for (i = 0; i < voices.length; i++) {
        v = voices[i];
        if (v.lang && v.lang.toLowerCase().indexOf("en") === 0) return v;
      }
      return null;
    }
    function nexaSpeak(html) {
      if (!nexaSynth || !nexaVoiceOn) return;
      var text = nexaPlainText(html);
      if (!text) return;
      try {
        nexaSynth.cancel(); /* a new reply always replaces the one before */
        var utter = new SpeechSynthesisUtterance(text);
        var urdu = /[\u0600-\u06FF]/.test(text);
        utter.lang = urdu ? "ur-PK" : "en-US";
        var voice = nexaPickVoice(urdu);
        if (voice) utter.voice = voice;
        nexaSynth.speak(utter);
      } catch (err) { /* voice is a bonus layer: fail silent, never break the chat */ }
    }
    function nexaStopSpeaking() {
      if (nexaSynth) { try { nexaSynth.cancel(); } catch (err) {} }
    }
    if (nexaVoiceBtn) {
      if (!nexaSynth) {
        nexaVoiceBtn.style.display = "none";
      } else {
        /* Some browsers fill the voice list asynchronously; warm it up. */
        try { nexaSynth.getVoices(); } catch (err) {}
        if (typeof nexaSynth.addEventListener === "function") {
          nexaSynth.addEventListener("voiceschanged", function () {
            try { nexaSynth.getVoices(); } catch (err) {}
          });
        }
        nexaVoiceBtn.addEventListener("click", function () {
          nexaVoiceOn = !nexaVoiceOn;
          nexaVoiceBtn.setAttribute("aria-pressed", nexaVoiceOn ? "true" : "false");
          if (!nexaVoiceOn) nexaStopSpeaking();
        });
      }
    }

    function nexaReply(question) {
      var typing = document.createElement("div");
      typing.className = "nexa-msg-typing";
      typing.innerHTML = "<span></span><span></span><span></span>";
      nexaMsgs.appendChild(typing);
      nexaScroll();
      var delay = reduceMotion ? 60 : 550 + Math.random() * 450;
      setTimeout(function () {
        if (typing.parentNode) typing.parentNode.removeChild(typing);
        var answer = nexaAnswer(question);
        nexaAddMsg(answer, "bot");
        nexaSpeak(answer);
      }, delay);
    }
    function nexaAsk(question) {
      var q = String(question || "").trim();
      if (!q) return;
      nexaAddMsg(q, "user");
      nexaReply(q);
    }
    function nexaOpen() {
      nexaPanel.hidden = false;
      nexaLaunch.setAttribute("aria-expanded", "true");
      if (!nexaGreeted) {
        nexaGreeted = true;
        nexaReply("hello");
      }
      setTimeout(function () { nexaInput.focus(); }, 60);
    }
    function nexaShut() {
      nexaStopSpeaking();
      if (nexaListening && nexaRec) { try { nexaRec.stop(); } catch (err) {} }
      nexaPanel.hidden = true;
      nexaLaunch.setAttribute("aria-expanded", "false");
      nexaLaunch.focus();
    }
    nexaLaunch.addEventListener("click", function () {
      if (nexaPanel.hidden) { nexaOpen(); } else { nexaShut(); }
    });
    if (nexaClose) nexaClose.addEventListener("click", nexaShut);
    nexaForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = nexaInput.value;
      nexaInput.value = "";
      nexaAsk(q);
    });
    if (nexaChips) {
      nexaChips.addEventListener("click", function (e) {
        var btn = e.target;
        while (btn && btn !== nexaChips && !btn.getAttribute("data-q")) btn = btn.parentNode;
        if (btn && btn.getAttribute) nexaAsk(btn.getAttribute("data-q"));
      });
    }
    /* --- NEXA voice input: ask by microphone (SpeechRecognition) ---
       The keeper speaks Urdu first, so listening starts in ur-PK;
       if the device has no Urdu recogniser, it retries once in
       en-US. Note: on some devices (Chrome on Android, for one)
       recognition sends the audio to a server, so the microphone
       needs an internet connection there. Where the API does not
       exist at all (Firefox), the button hides itself — there are
       no dead controls on this page. */
    var NexaRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    var nexaRec = null;
    var nexaListening = false;
    var nexaRetryEnglish = false;

    function nexaMicState(on) {
      nexaListening = on;
      if (nexaMicBtn) {
        nexaMicBtn.classList.toggle("is-listening", on);
        nexaMicBtn.setAttribute("aria-pressed", on ? "true" : "false");
      }
    }
    function nexaStartListening(lang, isRetry) {
      var rec = null;
      try { rec = new NexaRecognition(); } catch (err) { rec = null; }
      if (!rec) { if (nexaMicBtn) nexaMicBtn.style.display = "none"; return; }
      nexaRec = rec;
      rec.lang = lang;
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = function (event) {
        var transcript = "";
        if (event.results && event.results[0] && event.results[0][0]) {
          transcript = event.results[0][0].transcript || "";
        }
        transcript = String(transcript).trim();
        if (transcript) {
          nexaInput.value = transcript;
          nexaAsk(transcript);
          nexaInput.value = "";
        }
      };
      rec.onerror = function (event) {
        if (event && event.error === "language-not-supported" && !isRetry) {
          nexaRetryEnglish = true; /* onend below restarts us in English */
        }
      };
      rec.onend = function () {
        nexaMicState(false);
        if (nexaRetryEnglish) {
          nexaRetryEnglish = false;
          nexaStartListening("en-US", true);
        }
      };
      nexaMicState(true);
      try { rec.start(); } catch (err) { nexaMicState(false); }
    }
    if (nexaMicBtn) {
      if (!NexaRecognition) {
        nexaMicBtn.style.display = "none";
      } else {
        nexaMicBtn.addEventListener("click", function () {
          if (nexaListening && nexaRec) {
            try { nexaRec.stop(); } catch (err) {}
            return;
          }
          nexaStartListening("ur-PK", false);
        });
      }
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !nexaPanel.hidden) nexaShut();
    });
  }


  /* ---------------------------------------------------------
     9) MOTION PACK — boot intro, scroll progress
     --------------------------------------------------------- */
  var boot = document.getElementById("bootOverlay");
  if (boot) {
    var bootDone = false;
    var hideBoot = function () {
      if (bootDone) return;
      bootDone = true;
      boot.classList.add("done");
      setTimeout(function () { if (boot.parentNode) boot.parentNode.removeChild(boot); }, 700);
    };
    if (reduceMotion) { hideBoot(); }
    else {
      setTimeout(hideBoot, 800);
      boot.addEventListener("click", hideBoot);
    }
  }

  var progress = document.getElementById("scrollProgress");
  if (progress) {
    var onScroll = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? (window.scrollY || 0) / max : 0;
      progress.style.transform = "scaleX(" + Math.min(1, Math.max(0, ratio)) + ")";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }



  /* ---------------------------------------------------------
     10) THE GRID TEST — quiz, fully local. Each game draws
     five questions at random from the bank below, so no two
     runs are quite the same.
     --------------------------------------------------------- */
  var QUIZ_BANK = [
    { q: "What does \u201CAI\u201D stand for?",
      options: ["Artificial Intelligence", "Automatic Internet", "Analog Interface"], answer: 0 },
    { q: "A device that links a human brain directly to a computer is called a...",
      options: ["Solar panel", "Neural interface", "Barcode scanner"], answer: 1 },
    { q: "Quantum computers store information in special units called...",
      options: ["Pixels", "Volts", "Qubits"], answer: 2 },
    { q: "What is the name of the robot who guides visitors through NEXUS?",
      options: ["ROBO-9", "NEXA", "PIXEL"], answer: 1 },
    { q: "Everything you see on the NEXUS page is generated...",
      options: ["On a giant server", "On printed paper", "Right in your browser"], answer: 2 },
    { q: "Which of these shows artificial intelligence actually at work?",
      options: ["A calculator adding numbers", "A program learning to recognise faces", "A switch turning on a light"], answer: 1 },
    { q: "In AI, the huge web of tiny adjustable dials that learns from examples is called a...",
      options: ["Neural network", "Spreadsheet", "Search engine"], answer: 0 },
    { q: "Modern chatbots are powered by large language models, trained mostly on...",
      options: ["Weather reports", "Photographs of cats", "Vast amounts of text"], answer: 2 },
    { q: "A headset that places you inside a completely digital world gives you...",
      options: ["Satellite radio", "Virtual reality", "Fibre internet"], answer: 1 },
    { q: "Shared digital worlds where people meet and play as avatars are often called...",
      options: ["The metaverse", "A firewall", "A database"], answer: 0 },
    { q: "A robot designed to look and move like a human is called a...",
      options: ["Drone", "Submarine", "Humanoid robot"], answer: 2 },
    { q: "Self-driving cars mainly \u201Csee\u201D the road using...",
      options: ["A paper road map", "Cameras, radar and sensors", "The driver's dreams"], answer: 1 },
    { q: "The first version of the internet, built for researchers, was called...",
      options: ["Wi-Fi", "ARPANET", "Bluetooth"], answer: 1 },
    { q: "Which planet, the famous Red Planet, is a top target for future robot explorers?",
      options: ["Mars", "Venus", "Jupiter"], answer: 0 },
    { q: "A 3D printer builds an object by...",
      options: ["Cutting it out of stone", "Painting it onto glass", "Adding material layer by layer"], answer: 2 }
  ];
  var QUIZ_GAME_SIZE = 5;
  var quizQ = document.getElementById("quizQ");
  var quizOpts = document.getElementById("quizOpts");
  var quizProgress = document.getElementById("quizProgress");
  var quizFeedback = document.getElementById("quizFeedback");
  var quizNext = document.getElementById("quizNext");
  var quizResult = document.getElementById("quizResult");
  var quizScore = document.getElementById("quizScore");
  var quizRank = document.getElementById("quizRank");
  var quizRestart = document.getElementById("quizRestart");
  if (quizQ && quizOpts && quizNext && quizResult) {
    var qIndex = 0, qScore = 0, qLocked = false;
    var quizSet = [];
    function quizNewSet() {
      var order = QUIZ_BANK.map(function (_, i) { return i; });
      for (var i = order.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = order[i]; order[i] = order[j]; order[j] = tmp;
      }
      quizSet = order.slice(0, QUIZ_GAME_SIZE).map(function (i) { return QUIZ_BANK[i]; });
    }
    function quizRender() {
      var item = quizSet[qIndex];
      qLocked = false;
      quizProgress.textContent = tf("quiz.progress", { n: qIndex + 1, total: quizSet.length });
      quizQ.textContent = item.q;
      quizFeedback.textContent = "";
      quizFeedback.className = "quiz-feedback";
      quizNext.hidden = true;
      quizResult.hidden = true;
      quizOpts.innerHTML = "";
      item.options.forEach(function (label, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "quiz-opt";
        b.textContent = label;
        b.addEventListener("click", function () { quizPick(i, b); });
        quizOpts.appendChild(b);
      });
    }
    function quizPick(i, btn) {
      if (qLocked) return;
      qLocked = true;
      var item = quizSet[qIndex];
      var buttons = quizOpts.querySelectorAll(".quiz-opt");
      Array.prototype.forEach.call(buttons, function (b, j) {
        b.disabled = true;
        if (j === item.answer) b.classList.add("correct");
      });
      if (i === item.answer) {
        qScore++;
        quizFeedback.textContent = t("quiz.correct");
        quizFeedback.className = "quiz-feedback ok";
      } else {
        btn.classList.add("wrong");
        quizFeedback.textContent = tf("quiz.wrong", { ans: item.options[item.answer] });
        quizFeedback.className = "quiz-feedback err";
      }
      quizNext.textContent = qIndex === quizSet.length - 1 ? t("quiz.seeRank") : t("quiz.next");
      quizNext.hidden = false;
    }
    function quizRankFor(s) {
      return s === quizSet.length ? t("quiz.rankMaster") :
        s >= 3 ? t("quiz.rankOperative") : t("quiz.rankNovice");
    }
    function quizFinish() {
      quizProgress.textContent = t("quiz.complete");
      quizQ.textContent = "";
      quizOpts.innerHTML = "";
      quizFeedback.textContent = "";
      quizNext.hidden = true;
      quizScore.textContent = qScore + " / " + quizSet.length;
      quizRank.textContent = quizRankFor(qScore);
      quizResult.hidden = false;
    }
    quizNext.addEventListener("click", function () {
      if (qIndex === quizSet.length - 1) { quizFinish(); }
      else { qIndex++; quizRender(); }
    });
    if (quizRestart) quizRestart.addEventListener("click", function () {
      qIndex = 0; qScore = 0; quizNewSet(); quizRender();
    });
    langHooks.push(function () {
      if (!quizResult.hidden) {
        quizProgress.textContent = t("quiz.complete");
        quizRank.textContent = quizRankFor(qScore);
      } else {
        quizProgress.textContent = tf("quiz.progress", { n: qIndex + 1, total: quizSet.length });
        if (!quizNext.hidden) quizNext.textContent = qIndex === quizSet.length - 1 ? t("quiz.seeRank") : t("quiz.next");
      }
    });
    quizNewSet();
    quizRender();
  }

  /* ---------------------------------------------------------
     11) AMBIENCE — a soft synth pad generated live with the
     Web Audio API. No audio files. Starts only on tap.
     --------------------------------------------------------- */
  var musicBtn = document.getElementById("musicBtn");
  var musicState = document.getElementById("musicState");
  if (musicBtn) {
    var actx = null, masterGain = null, oscNodes = [], musicOn = false;
    langHooks.push(function () {
      if (musicState) musicState.textContent = musicOn ? t("footer.on") : t("footer.off");
    });
    function musicStart() {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      if (!actx) actx = new AC();
      if (actx.state === "suspended") actx.resume();
      masterGain = actx.createGain();
      masterGain.gain.value = 0;
      var filter = actx.createBiquadFilter();
      filter.type = "lowpass"; filter.frequency.value = 520; filter.Q.value = 0.6;
      masterGain.connect(filter); filter.connect(actx.destination);
      var freqs = [110, 164.81, 220, 261.63];
      freqs.forEach(function (f, i) {
        var o = actx.createOscillator();
        o.type = i % 2 ? "triangle" : "sine";
        o.frequency.value = f;
        o.detune.value = (i - 1.5) * 4;
        var g = actx.createGain();
        g.gain.value = i === 0 ? 0.5 : 0.22;
        o.connect(g); g.connect(masterGain);
        o.start(); oscNodes.push(o);
      });
      var lfo = actx.createOscillator(); lfo.frequency.value = 0.07;
      var lfoGain = actx.createGain(); lfoGain.gain.value = 260;
      lfo.connect(lfoGain); lfoGain.connect(filter.frequency);
      lfo.start(); oscNodes.push(lfo);
      masterGain.gain.linearRampToValueAtTime(0.055, actx.currentTime + 1.6);
      return true;
    }
    function musicStop() {
      if (!actx || !masterGain) return;
      var t = actx.currentTime;
      masterGain.gain.cancelScheduledValues(t);
      masterGain.gain.setValueAtTime(masterGain.gain.value, t);
      masterGain.gain.linearRampToValueAtTime(0, t + 0.7);
      var nodes = oscNodes; oscNodes = [];
      setTimeout(function () {
        nodes.forEach(function (o) { try { o.stop(); } catch (e) {} });
      }, 850);
    }
    musicBtn.addEventListener("click", function () {
      if (!musicOn) { if (musicStart()) musicOn = true; }
      else { musicStop(); musicOn = false; }
      musicBtn.classList.toggle("on", musicOn);
      musicBtn.setAttribute("aria-pressed", musicOn ? "true" : "false");
      if (musicState) musicState.textContent = musicOn ? t("footer.on") : t("footer.off");
    });
  }

  /* ---------------------------------------------------------
     12) SIGNAL OF THE DAY — one line from the grid, chosen by
     the date itself (day-of-year modulo the list). Fully
     local: same date, same signal, all day — no server.
     --------------------------------------------------------- */
  var sotdText = document.getElementById("sotdText");
  if (sotdText) {
    var SOTD = [
      "The future is not found. It is built, one signal at a time.",
      "Every grid begins as a single blinking light. Start with yours.",
      "Tomorrow's machines are being sketched on today's paper.",
      "A signal ignored is just noise. Listen twice.",
      "The city of the future runs on code written by people who showed up.",
      "Small upgrades, repeated daily, become a new dimension.",
      "Your next idea is already transmitting. Tune in.",
      "Robots dream of builders, not batteries.",
      "The fastest network is still a human who keeps their word.",
      "Charge your curiosity first; the rest of the system follows.",
      "In the neon dark, the ones who build carry their own light.",
      "A prototype today is a portal tomorrow.",
      "Static is only a signal that has not found its frequency yet.",
      "The grid rewards those who transmit, not those who wait."
    ];
    var sotdNow = new Date();
    var sotdStart = new Date(sotdNow.getFullYear(), 0, 0);
    var sotdDay = Math.floor((sotdNow - sotdStart) / 864e5);
    sotdText.textContent = SOTD[sotdDay % SOTD.length];
  }

})();

/* ---------------------------------------------------------
   TOOLS — the Toolkit block: typing test + study timer.
   Kept in its own block at the end of the file, separate
   from the main page logic above.
   --------------------------------------------------------- */
(function () {
  "use strict";

  /* Language helpers — the dictionary lives in the main block
     above and is shared through window.NEXUS_I18N. */
  var I18N_API = window.NEXUS_I18N || null;
  function L(key) { return I18N_API ? I18N_API.t(key) : key; }
  function Lf(key, params) { return I18N_API ? I18N_API.tf(key, params) : key; }

  /* Typing test — 60 seconds, clock starts on the first keystroke.
     WPM = (correct characters / 5) / minutes. Paste is blocked. */
  var ttInput = document.getElementById("ttInput");
  if (ttInput) {
    var samples = [
      "The quick brown fox jumps over the lazy dog while the bright sun rises over the quiet hills of the north.",
      "Technology is not just about machines and wires; it is about ideas that travel faster than light and change every life they touch.",
      "Practice makes the fingers remember what the mind already knows, so type a little every day and watch your speed grow.",
      "A good writer counts words the way a careful shopkeeper counts coins, because every word must earn its place on the page."
    ];
    var ttSample = document.getElementById("ttSample"),
        ttTime = document.getElementById("ttTime"),
        ttWpm = document.getElementById("ttWpm"),
        ttAcc = document.getElementById("ttAcc"),
        ttResult = document.getElementById("ttResult"),
        ttRestart = document.getElementById("ttRestart"),
        ttNew = document.getElementById("ttNew");
    var sampleIdx = 0, sample = "", started = false, finished = false,
        startTime = 0, timerId = null, TIME_LIMIT = 60;

    function renderSample() {
      var typed = ttInput.value;
      ttSample.textContent = "";
      for (var i = 0; i < sample.length; i++) {
        var span = document.createElement("span");
        span.textContent = sample[i];
        if (i < typed.length) span.className = typed[i] === sample[i] ? "ok" : "bad";
        ttSample.appendChild(span);
      }
    }
    function correctChars() {
      var typed = ttInput.value, n = 0;
      for (var i = 0; i < typed.length && i < sample.length; i++) {
        if (typed[i] === sample[i]) n++;
      }
      return n;
    }
    function elapsedSec() { return started ? (Date.now() - startTime) / 1000 : 0; }
    function liveStats() {
      var typedLen = ttInput.value.length;
      var corr = correctChars();
      var mins = elapsedSec() / 60;
      var wpm = mins > 0 ? Math.round((corr / 5) / mins) : 0;
      var acc = typedLen ? Math.round((corr / typedLen) * 100) : 100;
      ttWpm.textContent = wpm;
      ttAcc.textContent = acc + "%";
      return { wpm: wpm, acc: acc };
    }
    function rankFor(wpm) {
      if (wpm < 15) return L("typing.rankTurtle");
      if (wpm < 25) return L("typing.rankSteady");
      if (wpm < 35) return L("typing.rankSwift");
      if (wpm < 45) return L("typing.rankRapid");
      return L("typing.rankLightning");
    }
    function finish() {
      if (finished) return;
      finished = true;
      if (timerId) { clearInterval(timerId); timerId = null; }
      ttInput.disabled = true;
      var s = liveStats();
      ttTime.textContent = Math.max(0, TIME_LIMIT - Math.floor(elapsedSec()));
      ttResult.textContent = Lf("typing.timeResult", { wpm: s.wpm, acc: s.acc, rank: rankFor(s.wpm) });
    }
    function tick() {
      var left = TIME_LIMIT - Math.floor(elapsedSec());
      ttTime.textContent = Math.max(0, left);
      liveStats();
      if (left <= 0) finish();
    }
    function reset(newText) {
      if (timerId) { clearInterval(timerId); timerId = null; }
      if (newText) sampleIdx = (sampleIdx + 1) % samples.length;
      sample = samples[sampleIdx];
      ttInput.value = "";
      ttInput.disabled = false;
      started = false; finished = false;
      ttTime.textContent = TIME_LIMIT;
      ttWpm.textContent = "0";
      ttAcc.textContent = "100%";
      ttResult.textContent = L("typing.resultIdle");
      renderSample();
    }
    ttInput.addEventListener("input", function () {
      if (finished) return;
      if (!started) {
        started = true; startTime = Date.now();
        timerId = setInterval(tick, 250);
      }
      renderSample();
      liveStats();
      if (ttInput.value.length >= sample.length) finish();
    });
    ttInput.addEventListener("paste", function (e) { e.preventDefault(); });
    ttRestart.addEventListener("click", function () { reset(false); ttInput.focus(); });
    ttNew.addEventListener("click", function () { reset(true); ttInput.focus(); });
    if (I18N_API && I18N_API.onChange) I18N_API.onChange(function () {
      if (finished) {
        var s2 = liveStats();
        ttResult.textContent = Lf("typing.timeResult", { wpm: s2.wpm, acc: s2.acc, rank: rankFor(s2.wpm) });
      } else if (!started) {
        ttResult.textContent = L("typing.resultIdle");
      }
    });
    reset(false);
  }

  /* Study timer — Pomodoro-style focus timer. It counts down to
     a stored end timestamp rather than decrementing a counter,
     so pausing and resuming stay exact: pause freezes the
     remaining milliseconds, resume builds a fresh end time
     from them. The finish chime is synthesised with WebAudio,
     like the ambience — no audio files. */
  var stDisplay = document.getElementById("stDisplay");
  if (stDisplay) {
    var stStatus = document.getElementById("stStatus"),
        stToggle = document.getElementById("stToggle"),
        stReset = document.getElementById("stReset"),
        stPresets = document.querySelectorAll(".st-preset");
    var stTotalMs = 25 * 60 * 1000,
        stLeftMs = stTotalMs,
        stEndAt = 0,
        stRunning = false,
        stTimerId = null,
        stCtx = null;

    function stFmt(ms) {
      var s = Math.max(0, Math.ceil(ms / 1000));
      var m = Math.floor(s / 60), r = s % 60;
      return (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r;
    }
    function stRender() {
      stDisplay.textContent = stFmt(stRunning ? stEndAt - Date.now() : stLeftMs);
    }
    function stSay(text, done) {
      if (!stStatus) return;
      stStatus.textContent = text;
      stStatus.className = done ? "tool-result study-done" : "tool-result";
    }
    var stStatusKey = "study.ready", stStatusDone = false;
    function stSayKey(key, done) {
      stStatusKey = key; stStatusDone = !!done;
      stSay(L(key), done);
    }
    function stToggleLabel() {
      stToggle.textContent = stRunning ? L("study.pause") :
        (stLeftMs > 0 && stLeftMs < stTotalMs ? L("study.resume") : L("study.start"));
    }
    function stChime() {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        if (!stCtx) stCtx = new AC();
        if (stCtx.state === "suspended") stCtx.resume();
        var t0 = stCtx.currentTime + 0.03;
        [659.25, 880].forEach(function (f, i) {
          var o = stCtx.createOscillator();
          var g = stCtx.createGain();
          var start = t0 + i * 0.22;
          o.type = "sine";
          o.frequency.value = f;
          g.gain.setValueAtTime(0, start);
          g.gain.linearRampToValueAtTime(0.12, start + 0.03);
          g.gain.exponentialRampToValueAtTime(0.0001, start + 1.15);
          o.connect(g); g.connect(stCtx.destination);
          o.start(start); o.stop(start + 1.25);
        });
      } catch (e) { /* the chime is a courtesy, never an error */ }
    }
    function stStopClock() {
      if (stTimerId) { clearInterval(stTimerId); stTimerId = null; }
    }
    function stFinish() {
      stStopClock();
      stRunning = false;
      stLeftMs = 0;
      stDisplay.textContent = "00:00";
      stToggleLabel();
      stSayKey("study.done", true);
      stChime();
    }
    function stTick() {
      if (stEndAt - Date.now() <= 0) { stFinish(); return; }
      stRender();
    }
    stToggle.addEventListener("click", function () {
      if (stRunning) {
        stLeftMs = Math.max(0, stEndAt - Date.now());
        stStopClock();
        stRunning = false;
        stToggleLabel();
        stSayKey("study.paused", false);
        stRender();
      } else {
        if (stLeftMs <= 0) stLeftMs = stTotalMs;
        stEndAt = Date.now() + stLeftMs;
        stRunning = true;
        stTimerId = setInterval(stTick, 200);
        stToggleLabel();
        stSayKey("study.running", false);
        stRender();
      }
    });
    function stResetTimer() {
      stStopClock();
      stRunning = false;
      stLeftMs = stTotalMs;
      stToggleLabel();
      stSayKey("study.ready", false);
      stRender();
    }
    stReset.addEventListener("click", stResetTimer);
    Array.prototype.forEach.call(stPresets, function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(stPresets, function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        stTotalMs = parseInt(btn.getAttribute("data-mins"), 10) * 60 * 1000;
        stResetTimer();
      });
    });
    if (I18N_API && I18N_API.onChange) I18N_API.onChange(function () {
      stToggleLabel();
      stSay(L(stStatusKey), stStatusDone);
    });
    stRender();
  }
})();
