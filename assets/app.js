/* ============================================================
   一枚小惊喜 · 逻辑
   先把“助力”演完，再把信推上来。不改文案的话，这里不用动。
   ============================================================ */

(function () {
  "use strict";

  var cfg = window.SURPRISE || {};
  var root = document.documentElement;

  var assist = document.getElementById("assist");
  var paper = document.getElementById("letter");
  var msg = document.getElementById("msg");
  var sign = document.getElementById("sign");
  var btn = document.getElementById("cutBtn");
  var btnText = document.getElementById("btnText");
  var pct = document.getElementById("pct");
  var gapText = document.getElementById("gapText");
  var toast = document.getElementById("toast");

  var reduce = false;
  try {
    reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  var timing = cfg.timing || {};
  var sender = cfg.sender || "夜行者";
  var signature = cfg.signature || "";
  var lines = cfg.lines || [];

  /* ---------- 填字 ---------- */

  each("[data-sender]", function (el) {
    el.textContent = sender;
  });

  each("[data-avatar]", function (el) {
    el.textContent = sender.charAt(0);
  });

  var frag = document.createDocumentFragment();
  for (var i = 0; i < lines.length; i++) {
    var p = document.createElement("p");
    p.textContent = lines[i];
    p.style.transitionDelay = reduce ? "0ms" : 260 + i * 55 + "ms";
    frag.appendChild(p);
  }
  if (msg) msg.appendChild(frag);

  if (sign) {
    sign.textContent = signature;
    sign.style.transitionDelay = reduce
      ? "0ms"
      : 260 + lines.length * 55 + 220 + "ms";
    if (!signature) sign.style.display = "none";
  }

  /* ---------- 时间轴 ---------- */

  var started = false;
  var done = false;
  var timers = [];

  function later(ms, fn) {
    timers.push(setTimeout(fn, ms));
  }

  function clearTimers() {
    for (var i = 0; i < timers.length; i++) clearTimeout(timers[i]);
    timers = [];
  }

  function cut(fast) {
    if (started || done) return;
    started = true;

    if (assist) assist.classList.add("is-cutting");
    if (btnText) btnText.textContent = "正在助力…";

    /* 进度条先爬一段，像真的在算 */
    later(fast || reduce ? 130 : 300, function () {
      if (pct) pct.textContent = "已助力 99.9%";
    });

    /* 走完 */
    later(fast || reduce ? 380 : timing.cut || 900, function () {
      if (pct) pct.textContent = "已助力 100%";
      if (gapText) gapText.textContent = "已完成";
      success(fast);
    });
  }

  function success(fast) {
    if (toast) toast.classList.add("is-on");
    later(fast || reduce ? 420 : timing.toast || 700, reveal);
  }

  function reveal() {
    if (done) return;
    done = true;
    clearTimers();

    if (assist) assist.classList.add("is-out");
    root.classList.remove("lock");
    if (paper) paper.classList.add("is-in");
    try {
      window.scrollTo(0, 0);
    } catch (e) {}

    setTimeout(function () {
      if (!assist) return;
      assist.hidden = true;
      assist.setAttribute("aria-hidden", "true");
    }, 480);
  }

  /* 想直接看信：点那个红按钮就行 */
  if (btn) {
    btn.addEventListener(
      "click",
      function () {
        if (done) return;
        clearTimers();
        if (started) {
          success(true);
        } else {
          cut(true);
        }
      },
      false
    );
  }

  /* ---------- 起 ---------- */

  root.classList.add("lock");

  if (!lines.length) {
    later(500, reveal);
  } else {
    later(reduce ? 400 : timing.idle || 3000, function () {
      cut(false);
    });
  }

  function each(sel, fn) {
    var list = document.querySelectorAll(sel);
    for (var i = 0; i < list.length; i++) fn(list[i]);
  }
})();
