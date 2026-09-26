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

// ===== GitHub Projects =====
const GITHUB_USERNAME = 'kimjexnghyexn';
const projectGrid = document.querySelector('.project-grid');

// 상태
let projectState = {
  status: 'loading', // 'loading' | 'success' | 'empty' | 'error'
  repos: [],
  errorMessage: '',
};

// 상태 변경 함수: 상태를 바꾸고 → 바로 다시 그림
const setProjectState = (newState) => {
  projectState = { ...projectState, ...newState };
  renderProjects();
};

// 카드 하나 만드는 함수
const createProjectCard = ({ name, description, language, html_url, stargazers_count }) => `
  <article class="project-card">
    <h3>${name}</h3>
    <p>${description || '설명이 없습니다.'}</p>
    <div class="project-meta">
      <span>${language || '기타'}</span>
      <span>★ ${stargazers_count}</span>
    </div>
    <a href="${html_url}" target="_blank" rel="noopener noreferrer">GitHub에서 보기</a>
  </article>
`;

// 렌더링 함수: 현재 상태를 보고 화면을 그림
const renderProjects = () => {
  const { status, repos, errorMessage } = projectState;

  if (status === 'loading') {
    projectGrid.innerHTML = `<p class="status-message">로딩 중...</p>`;
    return;
  }

  if (status === 'error') {
    projectGrid.innerHTML = `
      <div class="status-message">
        <p>프로젝트를 불러올 수 없습니다.</p>
        <p class="error-detail">${errorMessage}</p>
        <button class="retry-btn">다시 시도</button>
      </div>
    `;
    projectGrid.querySelector('.retry-btn').addEventListener('click', fetchProjects);
    return;
  }

  if (status === 'empty') {
    projectGrid.innerHTML = `<p class="status-message">표시할 프로젝트가 없습니다.</p>`;
    return;
  }

  projectGrid.innerHTML = repos.map(createProjectCard).join('');
};

// API 호출 함수
const fetchProjects = async () => {
  setProjectState({ status: 'loading' });

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated`);

    if (response.status === 403) {
      throw new Error('요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
    }
    if (!response.ok) {
      throw new Error(`요청에 실패했습니다. (${response.status})`);
    }

    const data = await response.json();
    const repos = data.filter((repo) => !repo.fork);

    if (repos.length === 0) {
      setProjectState({ status: 'empty', repos: [] });
      return;
    }

    setProjectState({ status: 'success', repos });
  } catch (error) {
    setProjectState({ status: 'error', errorMessage: error.message });
  }
};

fetchProjects();