/* ============================================================
   NEXUS — script.js
   1) Procedural neon city on <canvas> (3 parallax layers,
      lit windows, stars, drifting particles, shooting star)
   2) Mouse parallax for the robot + hero glow
   3) Mobile menu, interactive cards, scroll reveal,
      animated counters, signal form, footer grid clock
   Everything is dependency-free. If canvas/WebGL is missing,
   the CSS gradient sky + SVG robot still carry the hero.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------------------------------------------------------
     4) INTERACTIVE CARDS — tilt on hover, click/Enter expands
     --------------------------------------------------------- */
  var cards = document.querySelectorAll("[data-card]");
  cards.forEach(function (card) {
    function toggleCard() {
      var open = card.classList.toggle("open");
      card.setAttribute("aria-expanded", open ? "true" : "false");
      var cta = card.querySelector(".card-cta");
      if (cta) cta.textContent = open ? "CLOSE BRIEFING −" : "OPEN BRIEFING +";
    }
    card.addEventListener("click", toggleCard);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleCard(); }
    });
    if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 9;
        card.style.transform = "perspective(800px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    }
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
      if (!name) { fail("Tell the grid your name first, traveller.", nameEl); return; }
      if (!emailOk) { fail("That frequency looks off - enter a valid email so the grid can answer.", emailEl); return; }
      if (!text) { fail("Your message is empty - give the grid something to answer.", textEl); return; }
      if (btn) { btn.disabled = true; btn.textContent = "TRANSMITTING..."; }
      msg.textContent = "Sending your signal...";
      msg.className = "signal-msg";
      fetch("https://formsubmit.co/ajax/a18ab7ca741e9be92b844a5c58481a23", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name: name, email: email, message: text,
          _subject: "New signal via NEXUS - from " + name,
          _template: "table"
        })
      }).then(function (r) {
        if (!r.ok) throw new Error("send failed");
        return r.json();
      }).then(function () {
        msg.textContent = "\u2713 Signal received, " + name + ". The keeper has your message and can reply to your email.";
        msg.className = "signal-msg ok";
        form.reset();
      }).catch(function () {
        msg.textContent = "\u26A0 The signal could not get through just now. Check your connection and try again.";
        msg.className = "signal-msg err";
      }).then(function () {
        if (btn) { btn.disabled = false; btn.textContent = "TRANSMIT"; }
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
     --------------------------------------------------------- */
  /* NEXA-KB-START */
  var NEXA_KB = [
    { keys: ["what is nexus", "about nexus", "nexus kya", "explain nexus", "tell me about nexus"],
      reply: "NEXUS is an experimental digital experience — a living interface between imagination and machine. It is not a product and it sells nothing; it is a window, opened briefly, onto the future now being built. Head to <a href=\"#explore\">Explore</a> to choose your dimension." },
    { keys: ["artificial intelligence", " ai ", "machine learning", "language model"],
      reply: "Artificial Intelligence — machines that learn, reason and create, now woven into everyday life. From language models to vision systems, modern AI predicts, generates and decides in milliseconds. NEXUS maps where this intelligence is heading next. Full briefing: <a href=\"#explore\">Explore</a>." },
    { keys: ["digital world", "digital worlds", "virtual", "metaverse", "immersive"],
      reply: "Digital Worlds — virtual cities, immersive realities and persistent universes built from pure light. They are no longer games alone: they are workplaces, classrooms and concert halls, where entire societies are being prototyped inside simulated space. See the briefing in <a href=\"#explore\">Explore</a>." },
    { keys: ["future technology", "quantum", "neural interface", "future tech", "technology", "technologies"],
      reply: "Future Technology — quantum leaps, neural interfaces and the hardware quietly rewriting tomorrow: chips that think, networks that feel instant, machines that build machines. The <a href=\"#technology\">NEXUS Core</a> section tracks it: 128 neural nodes simulated, 12ms core response, 100% rendered locally." },
    { keys: ["core", "how does it work", "how it works", "rendered", "nodes"],
      reply: "The NEXUS Core is the heart of this page: every light here is generated live in your browser — no servers, no tracking, no accounts. Just code, colour and motion: 128 neural nodes simulated, 12ms response, 100% rendered locally and privately. Details: <a href=\"#technology\">Technology</a>." },
    { keys: ["signal", "join", "subscribe", "newsletter", "email", "transmission", "message bhejna", "rabta karna", "contact karna"],
      reply: "To join the transmission, scroll to <a href=\"#signal\">Join the transmission</a> and leave your name, email and a message. The signal lands directly in the keeper's inbox, and they can reply to your email." },
    { keys: ["free", "price", "cost", "buy", "pay", "download", "sign up", "signup", "account", "muft", "paisa lagega"],
      reply: "NEXUS is completely free: no downloads, no sign-up, no accounts and nothing to buy. The entire experience runs right here in your browser." },
    { keys: ["privacy", "track", "data", "safe", "secure"],
      reply: "Private by design. Browsing this page and chatting with me happens entirely in your browser — no trackers, no accounts. The only thing that ever leaves this page is a message you choose to send through the Signal form, and that goes straight to the keeper's inbox." },
    { keys: [" robot", "hero", "who are you", "your name", "nexa", "tum kon ho", "tum kaun ho", "tumhara naam", "aap kon"],
      reply: "I'm NEXA, the friendly AI robot of this grid — the same robot watching you from the hero section (it even follows your cursor). My job here is simple: answer your questions about NEXUS. Ask me about the sections, the Core, or the Signal." },
    { keys: ["who made", "who built", "who created", "creator", "developer", "owner"],
      reply: "NEXUS was crafted with plain HTML, CSS and JavaScript — no frameworks, no build tools — as a tribute to the neon futures we were promised, and the real one we are building." },
    { keys: ["section", "sections", "pages", "navigate", "menu", "where", "explore"],
      reply: "The grid has six stops: <a href=\"#home\">Home</a> — the neon city and the robot; <a href=\"#explore\">Explore</a> — three briefings (AI, Digital Worlds, Future Technology); <a href=\"#technology\">Technology</a> — the NEXUS Core; <a href=\"#quiz\">The Grid Test</a> — a five-question quiz; <a href=\"#signal\">Signal</a> — send the keeper a message; and the <a href=\"#poster\">Poster</a>. Tap any briefing card to open it." },
    { keys: ["poster", "wallpaper", "image of nexa", "picture of nexa"],
      reply: "The official NEXUS poster — NEXA standing in the neon rain — hangs in the <a href=\"#poster\">Poster section</a>. You can download it there, full size." },
    { keys: ["quiz", "game", "play", "test me", "grid test", "khelo"],
      reply: "The Grid Test awaits in the <a href=\"#quiz\">Quiz section</a> — five questions from the future, with a rank at the end. Grid Master is harder to earn than it looks." },
    { keys: ["music", "sound", "ambience", "ambient", "song", "audio"],
      reply: "Tap the AMBIENCE button at the bottom-left of the page. A soft synth pad fades in — generated live in your browser with the Web Audio API, no audio files at all. Tap again to mute it." },
    { keys: ["joke", "funny"],
      reply: "Why did the robot apply for a job at NEXUS? It heard the position had great current — and unlimited charge breaks." },
    { keys: ["time", "clock", "waqt kya"],
      reply: "Grid time is your local time — the footer clock shows it ticking live. Right now it reads TIME_NOW." },
    { keys: ["thank", "shukria", "shukriya"],
      reply: "Anytime, traveller. The grid is brighter with you in it." },
    { keys: ["bye", "goodbye", "see you"],
      reply: "Signal closing — until next time, traveller." },
    { keys: ["human", "real person", "real ai", "chatgpt", "gpt", "llm"],
      reply: "Honest answer: no human and no giant AI hides behind this panel. I'm a rule-based guide built into the page — I match your words to briefings about NEXUS, computed locally in your browser." },
    { keys: ["hello", "hi", "hey", "salam", "aoa", "assalam"],
      reply: "Hello, traveller. I'm NEXA, the guide of this grid. Ask me anything about NEXUS — what it is, what each section shows, or how the Signal works. The chips below are a good start." },
    { keys: ["help", "what can you do", "options", "questions"],
      reply: "I answer questions about NEXUS. Try: \"What is NEXUS?\", \"Tell me about Artificial Intelligence\", \"What is the Core?\", \"Is it free?\", or \"How do I join the signal?\"" }
  ];
  var NEXA_FALLBACK = "That signal is outside my briefing. I answer questions about NEXUS — try asking what NEXUS is, about Artificial Intelligence, Digital Worlds, Future Technology, the Core, or how the Signal form works.";
  var NEXA_FALLBACK_UR = "یہ سگنل میرے دائرے سے باہر ہے۔ میں نیکسس کے بارے میں سوالوں کے جواب دیتا ہوں — مثلاً نیکسس کیا ہے، مصنوعی ذہانت، پیغام کیسے بھیجیں، کوئز یا پوسٹر کے بارے میں پوچھیں۔";
  var NEXA_KB_UR = [
    { keys: ["السلام", "سلام"], reply: "وعلیکم السلام! میں نیکسا ہوں، اس ویب سائٹ کی رہنما روبوٹ۔ نیکسس کے بارے میں جو چاہیں پوچھیں: نیکسس کیا ہے، مصنوعی ذہانت، سگنل فارم، کوئز یا پوسٹر۔" },
    { keys: ["نیکسس کیا", "سائٹ کیا ہے", "ویب سائٹ کیا"], reply: "نیکسس ایک تجرباتی ڈیجیٹل تجربہ ہے — تخیل اور مشین کے درمیان ایک زندہ رابطہ۔ یہ کوئی پروڈکٹ نہیں اور کچھ بیچتا نہیں؛ یہ اس مستقبل کی ایک جھلک ہے جو اس وقت بن رہا ہے۔ پورا صفحہ آپ کے براؤزر میں لائیو بنتا ہے۔" },
    { keys: ["مصنوعی ذہانت", "اے آئی"], reply: "مصنوعی ذہانت یعنی ایسی مشینیں جو سیکھتی، سوچتی اور تخلیق کرتی ہیں۔ زبان سمجھنے والے ماڈلز سے تصویر پہچاننے والے نظام تک، جدید اے آئی ملی سیکنڈز میں پیش گوئی، تخلیق اور فیصلے کرتی ہے۔ نیکسس بتاتا ہے کہ یہ ذہانت آگے کہاں جا رہی ہے۔" },
    { keys: ["ڈیجیٹل دنیا", "ورچوئل"], reply: "ڈیجیٹل دنیائیں خالص روشنی سے بنی ورچوئل بستیاں اور فضائیں ہیں۔ یہ اب صرف کھیل نہیں رہیں: دفاتر، کلاس روم اور محفلیں انہی میں سجنے لگی ہیں۔" },
    { keys: ["کوانٹم", "ٹیکنالوجی", "مستقبل"], reply: "مستقبل کی ٹیکنالوجی: کوانٹم چھلانگیں، دماغ کو کمپیوٹر سے جوڑنے والے نیورل انٹرفیس، اور وہ ہارڈویئر جو خاموشی سے کل بدل رہا ہے۔ نیکسس کے 'Core' حصے میں اس کی تفصیل ہے۔" },
    { keys: ["پیغام", "سگنل", "رابطہ", "ای میل"], reply: "پیغام بھیجنے کے لیے صفحے میں 'Join the transmission' والے حصے تک جائیں اور اپنا نام، ای میل اور پیغام لکھ کر TRANSMIT دبائیں۔ پیغام سیدھا ویب سائٹ کے رکھوالے کے ان باکس میں پہنچتا ہے اور وہ آپ کی ای میل پر جواب دے سکتے ہیں۔" },
    { keys: ["مفت", "قیمت", "پیسے", "خرچ"], reply: "نیکسس بالکل مفت ہے: نہ ڈاؤن لوڈ، نہ سائن اپ، نہ اکاؤنٹ، نہ کچھ خریدنا۔ پورا تجربہ آپ کے براؤزر میں چلتا ہے۔" },
    { keys: ["تم کون", "آپ کون", "نام کیا", "نیکسا کون"], reply: "میں نیکسا ہوں، اس گرڈ کی دوستانہ رہنما روبوٹ — وہی روبوٹ جو صفحے کے اوپر والے حصے میں نظر آتی ہے۔ میرا کام نیکسس کے بارے میں آپ کے سوالوں کے جواب دینا ہے۔" },
    { keys: ["پوسٹر", "تصویر"], reply: "نیکسس کا سرکاری پوسٹر — نیون بارش میں کھڑی نیکسا — صفحے کے 'Official Poster' حصے میں لگا ہے۔ وہاں سے پوری سائز میں ڈاؤن لوڈ بھی ہو سکتا ہے۔" },
    { keys: ["کوئز", "کھیل"], reply: "صفحے میں 'The Grid Test' کے نام سے پانچ سوالوں کا کوئز ہے — آخر میں آپ کا رینک بھی ملتا ہے۔ گرڈ ماسٹر بننا لگتا آسان ہے، ہوتا نہیں۔" },
    { keys: ["موسیقی", "آواز", "گانا", "دھن"], reply: "صفحے کے نیچے بائیں کونے میں AMBIENCE بٹن ہے۔ اسے دبائیں تو ہلکی سی پس منظر دھن شروع ہو جاتی ہے، جو اسی براؤزر میں لائیو بنتی ہے — کوئی آڈیو فائل استعمال نہیں ہوتی۔" },
    { keys: ["لطیفہ", "مذاق"], reply: "روبوٹ نے نیکسس میں نوکری کیوں لی؟ کیونکہ یہاں کرنٹ بھی ملتا ہے اور چارج ہونے کی چھٹی بھی!" },
    { keys: ["وقت"], reply: "گرڈ کا وقت آپ کا مقامی وقت ہے — صفحے کے آخر میں گھڑی لائیو چل رہی ہے۔ اس وقت وقت ہے: TIME_NOW" },
    { keys: ["شکریہ"], reply: "کوئی بات نہیں! آپ کی موجودگی سے اس گرڈ کی روشنی بڑھ جاتی ہے۔" },
    { keys: ["مدد", "کیا کر سکت"], reply: "میں نیکسس کے بارے میں سوالوں کے جواب دیتا ہوں۔ آزمائیں: نیکسس کیا ہے؟ مصنوعی ذہانت کیا ہے؟ پیغام کیسے بھیجیں؟ کوئز کہاں ہے؟ پوسٹر کہاں ہے؟" },
    { keys: ["نیکسس"], reply: "نیکسس ایک تجرباتی ڈیجیٹل تجربہ ہے — نیون روشنیوں، مصنوعی ذہانت اور مستقبل کی ٹیکنالوجی کی ایک جھلک۔ کچھ خاص پوچھنا ہو تو بتائیں: مصنوعی ذہانت، ڈیجیٹل دنیائیں، کوئز یا سگنل فارم؟" }
  ];

  function nexaFillTime(reply) {
    if (reply.indexOf("TIME_NOW") === -1) return reply;
    var d = new Date();
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    return reply.replace("TIME_NOW", pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()));
  }


  function nexaAnswer(raw) {
    var rawStr = String(raw || "");
    if (/[\u0600-\u06FF]/.test(rawStr)) {
      var bestU = null, bestUS = 0;
      for (var ui = 0; ui < NEXA_KB_UR.length; ui++) {
        var eu = NEXA_KB_UR[ui], su = 0;
        for (var uj = 0; uj < eu.keys.length; uj++) {
          if (rawStr.indexOf(eu.keys[uj]) !== -1) su += eu.keys[uj].length;
        }
        if (su > bestUS) { bestUS = su; bestU = eu; }
      }
      return nexaFillTime(bestU ? bestU.reply : NEXA_FALLBACK_UR);
    }
    var text = " " + String(raw || "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ") + " ";
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
    function nexaReply(question) {
      var typing = document.createElement("div");
      typing.className = "nexa-msg-typing";
      typing.innerHTML = "<span></span><span></span><span></span>";
      nexaMsgs.appendChild(typing);
      nexaScroll();
      var delay = reduceMotion ? 60 : 550 + Math.random() * 450;
      setTimeout(function () {
        if (typing.parentNode) typing.parentNode.removeChild(typing);
        nexaAddMsg(nexaAnswer(question), "bot");
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
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !nexaPanel.hidden) nexaShut();
    });
  }


  /* ---------------------------------------------------------
     9) MOTION PACK — boot intro, scroll progress, card tilt
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
      setTimeout(hideBoot, 1250);
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

  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    var tiltCards = document.querySelectorAll("[data-card]");
    Array.prototype.forEach.call(tiltCards, function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5;
        var dy = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(800px) rotateY(" + (dx * 7).toFixed(2) + "deg) rotateX(" + (-dy * 7).toFixed(2) + "deg) translateY(-3px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }


  /* ---------------------------------------------------------
     10) THE GRID TEST — five-question quiz, fully local
     --------------------------------------------------------- */
  var QUIZ = [
    { q: "What does \u201CAI\u201D stand for?",
      options: ["Artificial Intelligence", "Automatic Internet", "Analog Interface"], answer: 0 },
    { q: "A device that links a human brain directly to a computer is called a...",
      options: ["Solar panel", "Neural interface", "Barcode scanner"], answer: 1 },
    { q: "Quantum computers store information in special units called...",
      options: ["Pixels", "Volts", "Qubits"], answer: 2 },
    { q: "What is the name of the robot who guides visitors through NEXUS?",
      options: ["ROBO-9", "NEXA", "PIXEL"], answer: 1 },
    { q: "Everything you see on the NEXUS page is generated...",
      options: ["On a giant server", "On printed paper", "Right in your browser"], answer: 2 }
  ];
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
    function quizRender() {
      var item = QUIZ[qIndex];
      qLocked = false;
      quizProgress.textContent = "Question " + (qIndex + 1) + " of " + QUIZ.length;
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
      var item = QUIZ[qIndex];
      var buttons = quizOpts.querySelectorAll(".quiz-opt");
      Array.prototype.forEach.call(buttons, function (b, j) {
        b.disabled = true;
        if (j === item.answer) b.classList.add("correct");
      });
      if (i === item.answer) {
        qScore++;
        quizFeedback.textContent = "\u2713 Correct. The grid approves.";
        quizFeedback.className = "quiz-feedback ok";
      } else {
        btn.classList.add("wrong");
        quizFeedback.textContent = "\u2717 Not quite \u2014 the answer was \u201C" + item.options[item.answer] + "\u201D.";
        quizFeedback.className = "quiz-feedback err";
      }
      quizNext.textContent = qIndex === QUIZ.length - 1 ? "SEE MY RANK" : "NEXT";
      quizNext.hidden = false;
    }
    function quizFinish() {
      quizProgress.textContent = "Test complete";
      quizQ.textContent = "";
      quizOpts.innerHTML = "";
      quizFeedback.textContent = "";
      quizNext.hidden = true;
      quizScore.textContent = qScore + " / " + QUIZ.length;
      quizRank.textContent =
        qScore === 5 ? "GRID MASTER \u2014 the future bends around you." :
        qScore >= 3 ? "CYBER OPERATIVE \u2014 a strong, clean signal." :
                      "NEURAL NOVICE \u2014 recharge, traveller, and try again.";
      quizResult.hidden = false;
    }
    quizNext.addEventListener("click", function () {
      if (qIndex === QUIZ.length - 1) { quizFinish(); }
      else { qIndex++; quizRender(); }
    });
    if (quizRestart) quizRestart.addEventListener("click", function () {
      qIndex = 0; qScore = 0; quizRender();
    });
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
      if (musicState) musicState.textContent = musicOn ? "ON" : "OFF";
    });
  }

})();
