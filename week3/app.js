// Baccuit NHS Connect: home page only (splash, log in and register will be added later).

const store = {
  get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch (e) {} },
};

// ===== Theme: Baccuit blue (dark) or light =====
const root = document.documentElement;
const toggle = document.querySelector("#themeToggle");

const setTheme = (name) => {
  root.dataset.theme = name;
  toggle.textContent = name === "dark" ? "Light" : "Dark";
  store.set("theme", name);
};
setTheme(store.get("theme") ?? "dark");   // the blue school board is the default

toggle.onclick = () => setTheme(root.dataset.theme === "dark" ? "light" : "dark");

// ===== Post a notice (saved in this browser) =====
// Posting notices: builds a card with the DOM and saves it in this browser (localStorage).
(function () {
  var KEY = "baccuit-posted-notices-v2";
  var grid = document.querySelector(".notices");
  var form = document.getElementById("notice-form");
  var pinned = grid.querySelector(".pinned");

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }
  function card(n) {
    var a = document.createElement("article");
    a.className = "notice posted " + n.cls;
    var tag = document.createElement("span");
    tag.className = "tag"; tag.textContent = n.label;
    var h3 = document.createElement("h3"); h3.textContent = n.title;
    var p = document.createElement("p"); p.textContent = n.msg;
    var s = document.createElement("small"); s.textContent = "Posted " + n.date;
    a.append(tag, h3, p, s);
    return a;
  }
  function addToGrid(n) { pinned.after(card(n)); }   /* newest first, under the pinned notice */

  load().forEach(addToGrid);                          /* oldest saved first, so newest ends on top */

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var parts = document.getElementById("n-cat").value.split("|");
    var n = {
      title: document.getElementById("n-title").value.trim(),
      msg: document.getElementById("n-msg").value.trim(),
      cls: parts[0], label: parts[1],
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };
    if (!n.title || !n.msg) return;
    addToGrid(n);
    var list = load(); list.push(n); save(list);
    form.reset();
    document.getElementById("notices").scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("n-clear").addEventListener("click", function () {
    if (!grid.querySelector(".posted")) return;
    if (!confirm("Remove all notices you posted?")) return;
    grid.querySelectorAll(".posted").forEach(function (el) { el.remove(); });
    save([]);
  });
})();
