(function(){
  "use strict";
  var C = window.ARWA_CONFIG || {};
  var RAW = String(C.WHATSAPP_NUMBER || ""), NUM = RAW.replace(/\D/g, "");
  var LIVE = NUM.length >= 8 && !/x/i.test(RAW);
  function wa(t){ return "https://wa.me/" + NUM + (t ? "?text=" + encodeURIComponent(t) : ""); }
  var HELLO = "مرحباً أروى، لدي استفسار عن استيراد سيارة من كوريا.";
  document.querySelectorAll("[data-wa]").forEach(function(a){
    if (LIVE){ a.href = wa(HELLO); a.target = "_blank"; a.rel = "noopener"; } else a.href = "#order";
  });
  var soc = document.getElementById("social");
  [["INSTAGRAM_URL","i-ig","إنستغرام"],["FACEBOOK_URL","i-fb","فيسبوك"]].forEach(function(s){
    if (C[s[0]]){ var a=document.createElement("a"); a.href=C[s[0]]; a.target="_blank"; a.rel="noopener"; a.setAttribute("aria-label",s[2]); a.innerHTML='<svg><use href="#'+s[1]+'"/></svg>'; soc.appendChild(a); }
  });

  var hdr = document.getElementById("hdr"), burger = hdr.querySelector(".burger"), nav = document.getElementById("sheetnav");
  function sc(){ hdr.classList.toggle("lined", scrollY > 8); }
  sc(); addEventListener("scroll", sc, {passive:true});
  function menu(o){ nav.hidden = !o; burger.setAttribute("aria-expanded", o); burger.innerHTML = '<svg><use href="#' + (o ? "i-x" : "i-menu") + '"/></svg>'; burger.setAttribute("aria-label", o ? "إغلاق القائمة" : "فتح القائمة"); }
  burger.addEventListener("click", function(){ menu(nav.hidden); });
  nav.addEventListener("click", function(e){ if (e.target.closest("a")) menu(false); });

  var els = document.querySelectorAll(".fade");
  if ("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }); }, {rootMargin:"0px 0px -6% 0px", threshold:.06});
    els.forEach(function(el){ io.observe(el); });
  } else els.forEach(function(el){ el.classList.add("in"); });

  var ds = document.querySelectorAll(".acc details");
  ds.forEach(function(d){ d.addEventListener("toggle", function(){ if (d.open) ds.forEach(function(o){ if (o !== d) o.open = false; }); }); });
  document.getElementById("yr").textContent = new Date().getFullYear();

  var MODELS = {
    "هيونداي":["أكسنت","أفانتي (إلنترا)","سوناتا","جراندجر","كونا","توسان","سانتا في","باليسيد","ستاريا","أيونيك 5","أيونيك 6","كاسبر"],
    "كيا":["مورنينغ","K3","K5","K8","K9","سيلتوس","نيرو","سبورتاج","سورينتو","موهافي","كرنفال","EV6","EV9","راي"],
    "جينيسيس":["G70","G80","G90","GV60","GV70","GV80"],
    "رينو كوريا (سامسونج)":["QM6","XM3","SM6","SM5","SM3"],
    "KGM (سانغ يونغ)":["توريس","ريكستون","تيفولي","كوراندو","ريكستون سبورت"],
    "شيفروليه كوريا":["سبارك","ماليبو","تراكس","تريل بليزر"]
  };
  var mk = document.getElementById("o-make"), dl = document.getElementById("o-models");
  mk.addEventListener("change", function(){ dl.innerHTML = ""; (MODELS[mk.value] || []).forEach(function(m){ var o = document.createElement("option"); o.value = m; dl.appendChild(o); }); });
  var yf = document.getElementById("o-yf"), yt = document.getElementById("o-yt"), Y = new Date().getFullYear();
  for (var y = Y; y >= Y - 15; y--){ yf.add(new Option(y, y)); yt.add(new Option(y, y)); }

  var f = document.getElementById("oform"), err = document.getElementById("oerr");
  var modal = document.getElementById("modal"), pre = document.getElementById("m-pre"), mwa = document.getElementById("m-wa"), mmsg = document.getElementById("m-msg");
  function v(n){ var e = f.elements[n]; return e ? String(e.value || "").trim() : ""; }
  function r(n){ var c = f.querySelector('input[name="'+n+'"]:checked'); return c ? c.value : ""; }
  f.addEventListener("submit", function(e){
    e.preventDefault();
    f.querySelectorAll(".bad").forEach(function(x){ x.classList.remove("bad"); });
    var miss = ["make","model","name","phone","city"].filter(function(n){ return !v(n); });
    var badPhone = v("phone") && v("phone").replace(/\D/g,"").length < 7;
    if (badPhone) miss.push("phone");
    var a = +v("yearFrom"), b = +v("yearTo");
    if (a && b && a > b){ f.elements.yearTo.classList.add("bad"); err.textContent = "سنة «إلى» يجب ألا تسبق سنة «من»."; err.hidden = false; return; }
    if (miss.length){ miss.forEach(function(n){ f.elements[n].classList.add("bad"); }); err.textContent = badPhone ? "رقم الجوال يبدو غير مكتمل." : "أكمل الحقول المعلّمة بـ * من فضلك."; err.hidden = false; f.elements[miss[0]].focus(); return; }
    err.hidden = true;
    var yrs = a && b ? (a + " إلى " + b) : a ? ("من " + a) : b ? ("حتى " + b) : "مفتوحة";
    var ex = [].slice.call(f.querySelectorAll('input[name="extras"]:checked')).map(function(c){ return c.value; });
    var L = ["مرحباً أروى 👋","أرغب في طلب سيارة من كوريا بالمواصفات التالية:","","🚗 *السيارة*",
      "الماركة: " + v("make"), "الموديل: " + v("model"), "سنوات الصنع: " + yrs, "الوقود: " + r("fuel"), "ناقل الحركة: " + r("gear")];
    var D = [];
    if (v("budget")) D.push("الميزانية: " + v("budget"));
    if (v("color")) D.push("اللون: " + v("color"));
    if (v("km")) D.push("المسافة: " + v("km"));
    if (v("seats")) D.push("المقاعد: " + v("seats"));
    if (ex.length) D.push("إضافات: " + ex.join("، "));
    if (v("notes")) D.push("ملاحظات: " + v("notes"));
    if (D.length){ L.push("", "📋 *التفاصيل*"); L = L.concat(D); }
    L.push("", "👤 *التواصل*", "الاسم: " + v("name"), "الجوال: " + v("phone"), "المدينة: " + v("city"));
    var msg = L.join("\n");
    pre.textContent = msg;
    var w = modal.querySelector(".warn"); if (w) w.remove();
    if (LIVE){ var u = wa(msg); mwa.href = u; mwa.hidden = false; mmsg.textContent = "فتحنا واتساب في نافذة جديدة. إن لم يحدث ذلك، اضغط الزر بالأسفل."; window.open(u, "_blank", "noopener"); }
    else { mwa.hidden = true; mmsg.textContent = "هذا نص الرسالة التي ستصلنا على واتساب."; var p = document.createElement("p"); p.className = "warn"; p.textContent = "وضع المعاينة: لم يُضبط رقم واتساب بعد في assets/config.js، لذلك لم تُفتح المحادثة."; mmsg.after(p); }
    modal.hidden = false; document.body.style.overflow = "hidden"; modal.querySelector(".modal-x").focus();
  });
  function close(){ modal.hidden = true; document.body.style.overflow = ""; }
  modal.addEventListener("click", function(e){ if (e.target === modal || e.target.closest(".modal-x")) close(); });
  addEventListener("keydown", function(e){ if (e.key === "Escape" && !modal.hidden) close(); });
  document.getElementById("m-copy").addEventListener("click", function(){
    var t = this.querySelector("span");
    function ok(){ t.textContent = "تم النسخ ✓"; setTimeout(function(){ t.textContent = "نسخ النص"; }, 1800); }
    if (navigator.clipboard) navigator.clipboard.writeText(pre.textContent).then(ok, function(){});
  });
  f.addEventListener("input", function(e){ if (e.target.classList) e.target.classList.remove("bad"); });
})();
