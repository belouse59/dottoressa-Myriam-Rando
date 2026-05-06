document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("status");
    const submitBtn = document.getElementById("submit-btn");
    const select = document.querySelector('select[name="requestType"]');
    const textarea = document.querySelector('textarea[name="message"]');
    const consentBlock = document.querySelector(".consent-block");
    const consent = document.getElementById('consent-checkbox');
    const error = document.getElementById("consentError");

    select.addEventListener("change", () => {
        const templates = {
            "primo-colloquio": "Buongiorno, vorrei prenotare un primo colloquio.",
            "informazioni": "Buongiorno, vorrei ricevere maggiori informazioni.",
            "supporto": "Buongiorno, desidero ricevere supporto psicologico.",
            "online": "Buongiorno, vorrei ricevere informazioni sui colloqui online."
        };

        textarea.value = templates[select.value] || "";
    });

    /*CONSENT CHECKBOX*/
    consent.addEventListener("click", ()=>{
        if(consent.checked) {
            consentBlock.classList.remove("error");
            error.classList.remove("visible");
        }
    })

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
        }, 5000);
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        // honeypot spam protection
        if (form.company.value) return;
        if (!consent.checked) {
            consentBlock.classList.add("error");
            // 👇 THIS IS WHAT YOU FORGOT
            error.classList.add("visible");
            consentBlock.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        const data = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            message: form.message.value,
            requestType: form.requestType.value,
            formType: "contact",
            consent: consent.checked ? 'SI' : 'NO'
        };

        status.innerText = "Invio in corso";
        status.classList.add("loading");

        try {
            const res = await fetch("/api/contact/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            status.classList.remove("loading");

            if (res.ok) {

                status.innerText = "Messaggio inviato!";
                submitBtn.innerText = "Inviato ✓";
                submitBtn.classList.add("success");
                showToaster(`Grazie per avermi contattata.

Ti invito a controllare la tua email (anche spam o promozioni) per confermare la richiesta e ricevere aggiornamenti.`);
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
            submitBtn.innerText = "Scrivimi senza impegno";
            submitBtn.classList.remove("success");
        }, 5000);
    });

});

