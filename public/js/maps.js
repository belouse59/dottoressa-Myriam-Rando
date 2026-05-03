/*MAP OBSERVER ON MOBILE*/
const mapSection = document.querySelector(".map iframe");
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