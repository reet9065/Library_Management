const nav = document.querySelectorAll("[data-nav]");

nav.forEach((element) => {
    element.style.cursor="pointer";
    element.addEventListener("click", (e) => {
        window.electronAPI.navigateTo(e.currentTarget.dataset.nav);
    })
})