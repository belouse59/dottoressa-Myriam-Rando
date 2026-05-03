// WhatsApp
const input = document.getElementById("userMessage");
const whatsappFloat = document.querySelector(".whatsapp-float");
const whatsappCloseBtn = document.querySelector(".chat-close-btn");
const quickactionsBtn = document.querySelectorAll(".quick-actions button");
const submitChatBtn = document.getElementById("chat-submit-btn");
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        if (event.shiftKey) {
            // Shift + Enter → new line
            return;
        } else {
            // Enter → send message
            event.preventDefault(); // prevent adding newline
            const message = input.value.trim();
            if (message !== "") {
                sendToWhatsApp();
            }
        }
    }
});
input.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
});
let userInteracted = false;
setTimeout(() => {
    if (!userInteracted) {
        openChat(); // ✅ always opens (never toggles)
    }
}, 5000);
submitChatBtn.addEventListener("click", sendToWhatsApp);
whatsappFloat.addEventListener("click", toggleChat);
whatsappCloseBtn.addEventListener("click", toggleChat);
quickactionsBtn.forEach(button => {
    button.addEventListener("click", selectPrompt);
});

function toggleChat() {
    console.log("Hey Whatsapp")
    userInteracted = true; // 🔥 user has interacted
    const chat = document.getElementById("whatsappChat");
    chat.classList.toggle("active");
}
/* Dedicated open function */
function openChat() {
    const chat = document.getElementById("whatsappChat");
    chat.classList.add("active");
};

let selectedMessage = "";
function selectPrompt(e) {
    const origin = e.srcElement.id.split("|")[1];
    switch (origin) {
        case "PrimoColloquio":
            selectedMessage = 'Vorrei prenotare un primo colloquio';
            break;
        case "RichiedereInformazioni":
            selectedMessage = 'Vorrei ricevere maggiori informazioni sul percorso';
            break;
        case "bisognoDiSupporto":
            selectedMessage = 'Sto attraversando un momento difficile e vorrei parlarne';
            break;
    }
    input.value = selectedMessage;
    input.focus();
    document.querySelector(".quick-actions").style.display = "none";
};

function sendToWhatsApp() {
    const message = input.value;

    const phoneNumber = "+34667218526"; // replace with your number
    const defaultMessage = "Ciao, vorrei avere alcune informazioni.";

    const finalMessage =
        input.value.trim() || selectedMessage || "Buongiorno, vorrei informazioni.";

    const url = "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(finalMessage);

    window.open(url, "_blank");

    input.value = ""; // clear after sending
    input.style.height = "auto"; // reset height
}