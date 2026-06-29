const themeToggle=document.getElementById("themeBtn");
// LOAD SAVED THEME
const savedTheme = localStorage.getItem("theme") || "light";

document.body.classList.remove("light-mode", "dark-mode");
document.body.classList.add(savedTheme);

if (savedTheme === "dark-mode") {
    themeIcon.classList.remove("bi-moon-stars-fill");
    themeIcon.classList.add("bi-sun-fill");
}
else {
    themeIcon.classList.remove("bi-sun-fill");
    themeIcon.classList.add("bi-moon-stars-fill");
}

themeToggle.addEventListener("click",()=> {
    document.body.classList.toggle("light-mode");
    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode"))
    {
        themeIcon.classList.remove("bi-moon-stars-fill");
        themeIcon.classList.add("bi-sun-fill");
        localStorage.setItem("theme","dark-mode")
    }
    else
    {
        themeIcon.classList.remove("bi-sun-fill");
        themeIcon.classList.add("bi-moon-stars-fill");
        localStorage.setItem("theme","light-mode")

    }
});