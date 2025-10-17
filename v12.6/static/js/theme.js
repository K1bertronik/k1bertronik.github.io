function applyTheme(theme) {
    var body = document.body;
    var nav = document.querySelector('.navbar');
    var inputs = document.querySelectorAll('.form-control');
    var selects = document.querySelectorAll('.form-select');
    var tables = document.querySelectorAll('.table');

    if (theme === 'dark') {
        body.classList.remove('bg-light', 'text-dark');
        body.classList.add('bg-dark', 'text-white');

        nav.classList.remove('bg-light');
        nav.classList.add('bg-secondary');

        inputs.forEach(function(input) {
            input.classList.remove('bg-light', 'text-dark');
            input.classList.add('bg-dark', 'text-white');
        });

        selects.forEach(function(select) {
            select.classList.remove('bg-light', 'text-dark');
            select.classList.add('bg-dark', 'text-white');
        });

        tables.forEach(function(table) {
            table.classList.add('text-white');
        });
    } else {
        body.classList.remove('bg-dark', 'text-white');
        body.classList.add('bg-light', 'text-dark');

        nav.classList.remove('bg-secondary');
        nav.classList.add('bg-light');

        inputs.forEach(function(input) {
            input.classList.remove('bg-dark', 'text-white');
            input.classList.add('bg-light', 'text-dark');
        });

        selects.forEach(function(select) {
            select.classList.remove('bg-dark', 'text-white');
            select.classList.add('bg-light', 'text-dark');
        });

        tables.forEach(function(table) {
            table.classList.remove('text-white');
        });
    }
}

function setThemeLocalStorage(theme) {
    localStorage.setItem("theme", theme);
}

function getThemeLocalStorage() {
    return localStorage.getItem("theme");
}

document.getElementById("toggle-theme-button").addEventListener("click", function() {
    var currentTheme = document.body.classList.contains("bg-dark") ? "dark" : "light";
    var newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    setThemeLocalStorage(newTheme);
});

var savedTheme = getThemeLocalStorage();
if (savedTheme) {
    // Если есть сохраненная тема, применяем её
    applyTheme(savedTheme);
} else {

    applyTheme("light"); // или любую другую тему по умолчанию
}
