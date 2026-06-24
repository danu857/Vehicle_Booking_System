const themeToggle = document.getElementById("themeBtn");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode"))
    {
        themeIcon.classList.remove("bi-moon-stars-fill");
        themeIcon.classList.add("bi-sun-fill");
    }
    else
    {
        themeIcon.classList.remove("bi-sun-fill");
        themeIcon.classList.add("bi-moon-stars-fill");
    }
});