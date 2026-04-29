document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("status");
    const submitBtn = document.getElementById("submit-btn");

    /*TOASTER*/
    function showToaster(message, type = "success") {
        // create toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = message
        document.body.appendChild(toast);

        // force reflow to enable transition
        setTimeout(() => {
            toast.classList.add("visible");
        }, 100);

        // hide and remove
        setTimeout(() => {
            toast.classList.remove("visible");
            setTimeout(() => {
                toast.remove();
            }, 500); // fade-out duration
        }, 4000);
    }

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

        status.innerText = "Invio in corso";
        status.classList.add("loading");

        try {
            const res = await fetch("/api/form/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            status.classList.remove("loading");

            if (res.ok) {
                
                status.innerText = "Messaggio inviato!";
                submitBtn.innerText = "Inviato ✓";
                submitBtn.classList.add("success");
                showToaster("Messaggio inviato!");
                form.reset();

                // optional: redirect to WhatsApp
               // window.open("https://wa.me/393713397393", "_blank");

            } else {
                status.innerText = "Errore invio";
                showToaster("Errore invio", "error");
            }

        } catch (err) {
            console.error(err);
            status.innerText = "Errore di rete";
            showToaster("Errore di rete", "error");
        }
         setTimeout(() => {
             status.innerText = "";
             submitBtn.innerText ="Scrivimi senza impegno";
             submitBtn.classList.remove("success");
         }, 5000);
    });

});


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

/*MAP OBSERVER ON MOBILE*/
const mapSection =document.querySelector(".map iframe");
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const mapObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && isMobile) {
      entry.target.classList.add("visible");
    }
  });
}, {
  threshold: 0.9 // triggers when ~40% visible
});

mapObserver.observe(mapSection);
