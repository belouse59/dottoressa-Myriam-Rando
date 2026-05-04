// ==========================
// WHATSAPP CHAT
// ==========================

// Elements
const input = document.getElementById("userMessage");
const whatsappFloat = document.querySelector(".whatsapp-float");
const whatsappCloseBtn = document.querySelector(".chat-close-btn");
const quickActionsBtns = document.querySelectorAll(".quick-actions button");
const quickActions = document.querySelector(".quick-actions");
const submitChatBtn = document.getElementById("chat-submit-btn");
const chat = document.getElementById("whatsappChat");

// State
let selectedMessage = "";
let userInteracted = false;
let inactivityTimer;
let chatAlreadyOpened = false;
let hasEngaged = false;

// ==========================
// TEXTAREA BEHAVIOR
// ==========================

// Auto-resize textarea
input.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
     if (input.value.trim() === "") quickActions.style.display = "flex"; 
});

// Enter = send / Shift+Enter = newline
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        if (event.shiftKey) return;

        event.preventDefault();

        if (input.value.trim() !== "") {
            sendToWhatsApp();
        }
    }
});

// ==========================
// CHAT OPEN / CLOSE
// ==========================

function openChat() {
    chat.classList.add("active");
    userInteracted = true;
}

function toggleChat() {
    userInteracted = true;
    clearTimeout(inactivityTimer);
    chat.classList.toggle("active");
}

// Buttons
whatsappFloat.addEventListener("click", toggleChat);
whatsappCloseBtn.addEventListener("click", toggleChat);
submitChatBtn.addEventListener("click", sendToWhatsApp);

// ==========================
// QUICK ACTIONS
// ==========================

quickActionsBtns.forEach(button => {
    button.addEventListener("click", selectPrompt);
});

function selectPrompt(e) {
    const origin = e.currentTarget.id.split("|")[1];

    switch (origin) {
        case "PrimoColloquio":
            selectedMessage = "Vorrei prenotare un primo colloquio";
            break;

        case "RichiedereInformazioni":
            selectedMessage = "Vorrei ricevere maggiori informazioni sul percorso";
            break;

        case "bisognoDiSupporto":
            selectedMessage = "Sto attraversando un momento difficile e vorrei parlarne";
            break;
    }

    input.value = selectedMessage;
    input.focus();

   quickActions.style.display = "none";

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
}

// ==========================
// SEND TO WHATSAPP
// ==========================

function sendToWhatsApp() {
    const phoneNumber = "393713397393"; // no "+"
    const finalMessage =
        input.value.trim() ||
        selectedMessage ||
        "Buongiorno, vorrei ricevere informazioni.";

    const url =
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`;

    window.open(url, "_blank");

    // Reset input
    input.value = "";
    input.style.height = "auto";
}

// ==========================
// IDLE POPUP LOGIC
// ==========================

// Detect engagement after scroll
window.addEventListener("scroll", () => {
    const scrollPercent =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);

    if (scrollPercent > 0.25) {
        hasEngaged = true;
    }
});

// Open chat after inactivity
function openChatOnIdle() {
    if (
        chatAlreadyOpened ||
        userInteracted ||
        !hasEngaged
    ) return;

    openChat();
    chatAlreadyOpened = true;

    sessionStorage.setItem("chatShown", "true");
    removeActivityListeners();
}

// Reset inactivity timer
function resetIdleTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(openChatOnIdle, 18000); // 18 sec
}

// Any activity resets timer
function handleActivity() {
    resetIdleTimer();
}

// Register activity listeners
function addActivityListeners() {
    [
        "mousemove",
        "scroll",
        "click",
        "keydown",
        "touchstart"
    ].forEach(eventName => {
        window.addEventListener(eventName, handleActivity, {
            passive: true
        });
    });
}

// Remove listeners once popup shown
function removeActivityListeners() {
    [
        "mousemove",
        "scroll",
        "click",
        "keydown",
        "touchstart"
    ].forEach(eventName => {
        window.removeEventListener(eventName, handleActivity);
    });
}

// Init popup logic only once per session
if (!sessionStorage.getItem("chatShown")) {
    addActivityListeners();
    resetIdleTimer();
}
