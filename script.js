/* ============================================================
   NEXUS — script.js
   1) Procedural neon city on <canvas> (3 parallax layers,
      lit windows, stars, drifting particles, shooting star)
   2) Mouse parallax for the robot + hero glow
   3) Mobile menu, interactive cards, scroll reveal,
      animated counters, demo form, footer grid clock
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
     6) SIGNAL FORM — demo only, nothing leaves the browser
     --------------------------------------------------------- */
  var form = document.getElementById("signalForm");
  var msg = document.getElementById("signalMsg");
  if (form && msg) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("signalEmail");
      var value = (input.value || "").trim();
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      if (!valid) {
        msg.textContent = "⚠ That frequency looks off — enter a valid email format and try again.";
        msg.className = "signal-msg err";
        input.focus();
        return;
      }
      msg.textContent = "✓ Signal received, traveller. (Demo only — nothing was sent or stored.)";
      msg.className = "signal-msg ok";
      form.reset();
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
    { keys: ["signal", "join", "subscribe", "newsletter", "email", "transmission"],
      reply: "To join the transmission, scroll to <a href=\"#signal\">Join the transmission</a> and leave an email — but here is the honest part: the form is a demo. It is not connected to any service, so nothing you type is sent or stored anywhere." },
    { keys: ["free", "price", "cost", "buy", "pay", "download", "sign up", "signup", "account"],
      reply: "NEXUS is completely free: no downloads, no sign-up, no accounts and nothing to buy. The entire experience runs right here in your browser." },
    { keys: ["privacy", "track", "data", "safe", "secure"],
      reply: "Private by design. Everything on this page — even my answers — is generated locally in your browser. No servers receive your words, no trackers watch, and no account exists to leak." },
    { keys: [" robot", "hero", "who are you", "your name", "nexa"],
      reply: "I'm NEXA, the friendly AI robot of this grid — the same robot watching you from the hero section (it even follows your cursor). My job here is simple: answer your questions about NEXUS. Ask me about the sections, the Core, or the Signal." },
    { keys: ["who made", "who built", "who created", "creator", "developer", "owner"],
      reply: "NEXUS was crafted with plain HTML, CSS and JavaScript — no frameworks, no build tools — as a tribute to the neon futures we were promised, and the real one we are building." },
    { keys: ["section", "sections", "pages", "navigate", "menu", "where", "explore"],
      reply: "The grid has four stops: <a href=\"#home\">Home</a> — the neon city and the robot; <a href=\"#explore\">Explore</a> — three briefings (AI, Digital Worlds, Future Technology); <a href=\"#technology\">Technology</a> — the NEXUS Core; and <a href=\"#signal\">Signal</a> — join the transmission. Tap any briefing card to open it." },
    { keys: ["poster", "wallpaper", "image of nexa", "picture of nexa"],
      reply: "The official NEXUS poster — NEXA standing in the neon rain — hangs in the <a href=\"#poster\">Poster section</a>. You can download it there, full size." },
    { keys: ["joke", "funny"],
      reply: "Why did the robot apply for a job at NEXUS? It heard the position had great current — and unlimited charge breaks." },
    { keys: ["time", "clock"],
      reply: "Grid time is your local time — the footer clock shows it ticking live. Right now it reads TIME_NOW." },
    { keys: ["thank", "shukria"],
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

  function nexaAnswer(raw) {
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
    var reply = best.reply;
    if (reply.indexOf("TIME_NOW") !== -1) {
      var d = new Date();
      function pad(n) { return (n < 10 ? "0" : "") + n; }
      reply = reply.replace("TIME_NOW", pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()));
    }
    return reply;
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

})();
