// ---------- Helpers ----------
function $(id) {
  return document.getElementById(id);
}

function safeText(str) {
  return String(str ?? "").trim();
}

// ---------- Tabs ----------
function openTab(tabId) {
  // hide all tab contents
  document.querySelectorAll(".tabcontent").forEach(sec => {
    sec.style.display = "none";
  });

  // deactivate all tab buttons
  document.querySelectorAll(".tablink").forEach(btn => {
    btn.classList.remove("active");
  });

  // show selected
  const section = document.getElementById(tabId);
  if (section) section.style.display = "block";

  // activate matching button
  const activeBtn = document.querySelector(`.tablink[data-tab="${tabId}"]`);
  if (activeBtn) activeBtn.classList.add("active");
}

// ---------- Chat UI ----------
const state = {
  userName: "Guest",
  routerName: "Router-1",
};

function loadState() {
  const savedName = localStorage.getItem("hamster_userName");
  const savedRouter = localStorage.getItem("hamster_routerName");

  if (savedName) state.userName = savedName;
  if (savedRouter) state.routerName = savedRouter;

  $("userNameDisplay").textContent = state.userName;
  $("routerNameDisplay").textContent = state.routerName;
  $("routerSelect").value = state.routerName;
}

function setName() {
  const val = safeText($("nameInput").value);
  if (!val) return;

  state.userName = val;
  localStorage.setItem("hamster_userName", state.userName);
  $("userNameDisplay").textContent = state.userName;
  $("nameInput").value = "";

  addMessage("bot", `Nice to meet you, ${state.userName}. You're connected to ${state.routerName}.`);
}

function setRouter(routerName) {
  state.routerName = routerName;
  localStorage.setItem("hamster_routerName", state.routerName);
  $("routerNameDisplay").textContent = state.routerName;

  addMessage("bot", `Switched to ${state.routerName}.`);
}

function addMessage(who, text) {
  const log = $("chatLog");
  const div = document.createElement("div");
  div.className = `msg ${who === "me" ? "me" : "bot"}`;

  // Keep it simple: just text, no HTML injection
  div.textContent = text;

  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function clearChat() {
  $("chatLog").innerHTML = "";
  addMessage("bot", `Chat cleared. Still connected to ${state.routerName}.`);
}

// Simulated router response (replace later with REST API call)
function fakeRouterReply(userMsg) {
  const replies = [
    `Copy that, ${state.userName}.`,
    `Routing your message through ${state.routerName}…`,
    `Acknowledged. (This is a simulated reply for now.)`,
    `Got it. When the backend is ready, I'll answer for real.`,
  ];

  const pick = replies[Math.floor(Math.random() * replies.length)];
  return `${pick} You said: "${userMsg}"`;
}

function sendMessage() {
  const msg = safeText($("messageInput").value);
  if (!msg) return;

  $("messageInput").value = "";
  addMessage("me", msg);

  // Simulate delay like a real system
  setTimeout(() => {
    addMessage("bot", fakeRouterReply(msg));
  }, 650);
}

// ---------- Wire up ----------
document.addEventListener("DOMContentLoaded", () => {
  // tabs
  document.querySelectorAll(".tablink").forEach(btn => {
    btn.addEventListener("click", () => openTab(btn.dataset.tab));
  });

  // default tab
  openTab("home");

  // chat controls
  $("setNameBtn").addEventListener("click", setName);
  $("nameInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") setName();
  });

  $("sendMsgBtn").addEventListener("click", sendMessage);
  $("messageInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  $("routerSelect").addEventListener("change", (e) => {
    setRouter(e.target.value);
  });

  $("clearChatBtn").addEventListener("click", clearChat);

  // optional: search button demo
  $("searchBtn").addEventListener("click", () => {
    const q = safeText($("searchBox").value);
    if (!q) return;
    alert(`Search is a placeholder. You searched for: "${q}"`);
  });

  loadState();
  addMessage("bot", "System online. Set your name, pick a router, and send a message.");
});

/*
  LATER: Replace fakeRouterReply() with a REST API call:

  async function realRouterReply(userMsg) {
    const res = await fetch("/api/router/message", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        user: state.userName,
        router: state.routerName,
        message: userMsg
      })
    });

    const data = await res.json();
    return data.reply;
  }
*/
