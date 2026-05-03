const sections = document.querySelectorAll("section");

document.addEventListener("DOMContentLoaded", () => {
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

});