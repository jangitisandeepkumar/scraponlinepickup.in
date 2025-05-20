document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.getElementById("darkModeToggle");

    function applyDarkMode() {
        if (localStorage.getItem("darkMode") === "enabled") {
            document.body.classList.add("dark-mode");
            darkModeToggle.textContent = "☀️ Light Mode";
        } else {
            document.body.classList.remove("dark-mode");
            darkModeToggle.textContent = "🌙 Dark Mode";
        }
    }

    // Toggle Dark Mode
    darkModeToggle.addEventListener("click", function () {
        if (document.body.classList.contains("dark-mode")) {
            localStorage.removeItem("darkMode");
        } else {
            localStorage.setItem("darkMode", "enabled");
        }
        applyDarkMode();
    });

    // Apply Dark Mode on Page Load
    applyDarkMode();
});
