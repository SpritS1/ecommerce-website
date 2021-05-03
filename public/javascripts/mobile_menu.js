const menuBars = document.querySelector(".menu-bars");
const dropdownMenu = document.querySelector('.dropdown-menu');

const screen = window.matchMedia('(min-width: 784px)');

screen.addEventListener('change', () => {
    if (screen.matches) {
        dropdownMenu.style.display = 'block';
    } else if (!screen.matches) {
        dropdownMenu.setAttribute('data-display', 'none');
        dropdownMenu.style.display = 'none';
    }

});

menuBars.addEventListener('click', (event) => {
    event.preventDefault();
    const displayStyle = dropdownMenu.getAttribute('data-display');

    if (displayStyle === 'none') {
        dropdownMenu.style.display = "block";
        dropdownMenu.setAttribute('data-display', 'block');
    } else if (displayStyle === 'block') {
        dropdownMenu.style.display = 'none';
        dropdownMenu.setAttribute('data-display', 'none');
    }
})

