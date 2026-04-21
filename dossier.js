document.documentElement.classList.add("js");

const root = document.body;
let nameClicks = 0;
let nameClickTimer;
const terminalShell = document.querySelector(".terminal-shell");
const terminalHistory = document.querySelector(".terminal-history");
const terminalForm = document.querySelector(".terminal-form");
const terminalInput = document.querySelector(".terminal-input");
const nameButton = document.querySelector(".dossier-id-button");
const tabs = Array.from(document.querySelectorAll(".dossier-tab"));
const currentPage = root.dataset.page || "";
const terminalCommands = [
  "help",
  "bio",
  "reading",
  "contact",
  "other",
  "ping",
  "sudo",
  "bright",
  "dark",
  "nightvision",
  "clear",
];
let historyIndex = -1;
let commandHistory = [];
let helpCount = 0;

function toggleGrid() {
  root.classList.toggle("grid-visible");
}

function toggleBrightMode() {
  root.classList.remove("night-vision");
  root.classList.toggle("bright-mode");
}

function toggleNightVision() {
  root.classList.remove("bright-mode");
  root.classList.toggle("night-vision");
}

function printTerminalLine(type, text) {
  if (!terminalHistory) {
    return;
  }

  const line = document.createElement("p");
  line.className = `terminal-line terminal-line-${type}`;
  line.textContent = text;
  terminalHistory.appendChild(line);
  terminalHistory.scrollTop = terminalHistory.scrollHeight;
}

function openTerminal(forceOpen) {
  const shouldOpen =
    typeof forceOpen === "boolean"
      ? forceOpen
      : !root.classList.contains("terminal-visible");

  root.classList.toggle("terminal-visible", shouldOpen);

  if (terminalShell) {
    terminalShell.setAttribute("aria-hidden", shouldOpen ? "false" : "true");
  }

  if (shouldOpen && terminalInput) {
    terminalInput.focus();
    if (!terminalHistory || terminalHistory.children.length === 0) {
      printTerminalLine("system", "type `help` to see available commands");
    }
  }
}

function clearTerminal() {
  if (terminalHistory) {
    terminalHistory.innerHTML = "";
  }
}

function moveTab(direction) {
  if (currentPage === "other") {
    window.location.href =
      direction > 0 ? "backrooms-right.html" : "backrooms-left.html";
    return;
  }

  if (currentPage === "backrooms-left" && direction > 0) {
    window.location.href = "side-quests.html";
    return;
  }

  if (currentPage === "backrooms-right" && direction < 0) {
    window.location.href = "side-quests.html";
    return;
  }

  if (!tabs.length) {
    return;
  }

  const currentIndex = tabs.findIndex((tab) =>
    tab.classList.contains("dossier-tab-active")
  );
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextIndex = (safeIndex + direction + tabs.length) % tabs.length;
  const nextTab = tabs[nextIndex];

  if (nextTab) {
    window.location.href = nextTab.href;
  }
}

function runCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase();
  const [baseCommand, ...args] = command.split(/\s+/);

  if (!command) {
    return;
  }

  printTerminalLine("input", `jonah@site:~$ ${rawCommand}`);

  if (baseCommand === "help") {
    helpCount += 1;

    if (helpCount === 1) {
      printTerminalLine(
        "system",
        "available: bio, reading, contact, clear"
      );
      return;
    }

    printTerminalLine(
      "system",
      "available: bio, reading, contact, other, ping, sudo, bright, dark, nightvision, clear"
    );
    return;
  }

  if (baseCommand === "bio") {
    window.location.href = "index.html";
    return;
  }

  if (baseCommand === "reading") {
    window.location.href = "reading.html";
    return;
  }

  if (baseCommand === "contact") {
    window.location.href = "contact.html";
    return;
  }

  if (baseCommand === "other") {
    window.location.href = "side-quests.html";
    return;
  }

  if (baseCommand === "sudo") {
    printTerminalLine("error", "nice try");
    return;
  }

  if (baseCommand === "ping") {
    const target = args[0] || "austin";
    const responses = {
      austin: "austin // 4ms",
      saronic: "saronic // 18ms",
      genesis: "genesis // 23ms",
      backrooms: "backrooms // timeout",
      palantir: "palantir // 18ms",
    };
    printTerminalLine(
      "system",
      responses[target] || `${target} // timeout`
    );
    return;
  }

  if (baseCommand === "bright") {
    root.classList.remove("night-vision");
    root.classList.add("bright-mode");
    printTerminalLine("system", "bright mode enabled");
    return;
  }

  if (baseCommand === "dark") {
    root.classList.remove("bright-mode", "night-vision");
    printTerminalLine("system", "default mode enabled");
    return;
  }

  if (baseCommand === "nightvision") {
    root.classList.remove("bright-mode");
    root.classList.add("night-vision");
    printTerminalLine("system", "night vision enabled");
    return;
  }

  if (baseCommand === "clear") {
    clearTerminal();
    return;
  }

  printTerminalLine("error", `command not found: ${baseCommand}`);
}

if (nameButton) {
  nameButton.addEventListener("click", () => {
    nameClicks += 1;
    window.clearTimeout(nameClickTimer);
    nameClickTimer = window.setTimeout(() => {
      nameClicks = 0;
    }, 1200);

    if (nameClicks >= 5) {
      toggleGrid();
      nameClicks = 0;
    }
  });
}

if (terminalForm && terminalInput) {
  terminalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = terminalInput.value;
    if (!value.trim()) {
      return;
    }
    commandHistory.unshift(value);
    historyIndex = -1;
    runCommand(value);
    terminalInput.value = "";
  });
}

window.addEventListener("keydown", (event) => {
  const terminalOpen = root.classList.contains("terminal-visible");

  if (event.key === "/") {
    event.preventDefault();
    openTerminal();
    return;
  }

  if (event.key === "Escape") {
    openTerminal(false);
    return;
  }

  if (terminalOpen && event.key === "ArrowDown") {
    event.preventDefault();
    if (!commandHistory.length || !terminalInput) {
      return;
    }
    historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
    terminalInput.value = commandHistory[historyIndex];
    return;
  }

  if (terminalOpen && event.key === "ArrowUp") {
    event.preventDefault();
    if (!commandHistory.length || !terminalInput) {
      return;
    }
    historyIndex = Math.max(historyIndex - 1, -1);
    terminalInput.value = historyIndex >= 0 ? commandHistory[historyIndex] : "";
    return;
  }

  if (!terminalOpen && event.key === "ArrowRight") {
    event.preventDefault();
    moveTab(1);
    return;
  }

  if (!terminalOpen && event.key === "ArrowLeft") {
    event.preventDefault();
    moveTab(-1);
    return;
  }

  if (event.metaKey || event.ctrlKey || event.altKey || event.key.length !== 1) {
    return;
  }
});
