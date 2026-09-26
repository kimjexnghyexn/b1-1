const themeToggle = document.querySelector('#theme-toggle');
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  htmlElement.setAttribute('data-theme', 'dark');
}

themeToggle.addEventListener('click', () => {
  const isDark = htmlElement.getAttribute('data-theme') === 'dark';

  if (isDark) {
    htmlElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    htmlElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
});

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
});

const header = document.querySelector('header');
const scrollTopBtn = document.querySelector('#scroll-top');

const NAV_SCROLL_THRESHOLD = 60;
const TOP_BTN_THRESHOLD = 300;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  header.classList.toggle('scrolled', scrollY > NAV_SCROLL_THRESHOLD);
  scrollTopBtn.classList.toggle('show', scrollY > TOP_BTN_THRESHOLD);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});