document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");
    const status = document.getElementById("status");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // honeypot spam protection
        if (form.company.value) return;

        const data = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            message: form.message.value,
            formType: "contact"
        };

        status.innerText = "Invio in corso...";

        try {
            const res = await fetch("/api/form/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                status.innerText = "Messaggio inviato!";
                form.reset();

                // optional: redirect to WhatsApp
               // window.open("https://wa.me/393713397393", "_blank");

            } else {
                status.innerText = "Errore invio";
            }

        } catch (err) {
            console.error(err);
            status.innerText = "Errore di rete";
        }
    });

});


// WhatsApp
const input = document.getElementById("userMessage");
const whatsappFloat = document.querySelector(".whatsapp-float");
const whatsappCloseBtn = document.querySelector(".chat-close-btn");
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

whatsappFloat.addEventListener("click", toggleChat);
whatsappCloseBtn.addEventListener("click", toggleChat);

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
}
function sendToWhatsApp() {
    const input = document.getElementById("userMessage");
    const message = input.value;

    const phoneNumber = "+34667218526"; // replace with your number
    const url = "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(message);

    window.open(url, "_blank");

    input.value = ""; // clear after sending
    input.style.height = "auto"; // reset height
}

const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {

        if (entry.isIntersecting) {
            // small stagger effect (premium feel)
            setTimeout(() => {
                entry.target.classList.add("visible");
            }, index * 80);

            observer.unobserve(entry.target);
        }

    });
}, {
    threshold: 0.15
});

sections.forEach((section, i) => {
    section.style.transitionDelay = `${i * 0.05}s`;
    observer.observe(section);
});

const elements = document.querySelectorAll(".reveal");

const observerReveal = new IntersectionObserver((entries, obs) => {
    const delayMap = {
        H2: 0,
        P: 120,
        H3: 80
    };
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;

        // find position inside its parent
        const parent = el.parentElement;
        const siblings = Array.from(parent.querySelectorAll(".reveal"));

        const index = siblings.indexOf(el);

        const tag = el.tagName;
        const delay = delayMap[tag] ?? 100;

        setTimeout(() => {
            el.classList.add("visible");
        }, index * delay);

        obs.unobserve(el);
    });

}, {
    threshold: 0.4
});

elements.forEach(el => observerReveal.observe(el));

const trustItems = document.querySelectorAll(".trust-item");

const trustObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, i * 100);
    }
  });
}, { threshold: 0.4 });

trustItems.forEach(item => trustObserver.observe(item));