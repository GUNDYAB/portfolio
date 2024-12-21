/**
 * Portfolio Website JavaScript
 * Copyright (c) 2024 Bright T Gundya
 */

// Data Structures
const skillsData = {
    "Frontend Development": [
        { name: "HTML5", icon: "fab fa-html5" },
        { name: "CSS3", icon: "fab fa-css3-alt" },
        { name: "JavaScript", icon: "fab fa-js" },
        { name: "React", icon: "fab fa-react" }
    ],
    "Backend Development": [
        { name: "Python", icon: "fab fa-python" },
        { name: "SQL", icon: "fas fa-database" },
        { name: "Node.js", icon: "fab fa-node-js" }
    ],
    "Data & Analytics": [
        { name: "Actuarial Science", icon: "fas fa-chart-line" },
        { name: "Machine Learning", icon: "fas fa-brain" },
        { name: "Statistical Analysis", icon: "fas fa-chart-bar" }
    ]
};

const projectsData = [
    {
        title: "Portfolio Website",
        description: "A modern, responsive portfolio website built with HTML, CSS, and JavaScript featuring dark/light mode and smooth animations.",
        image: "./img/portfolio.jpg",
        liveLink: "https://gundyab.github.io/portfolio",
        githubLink: "https://github.com/GUNDYAB/portfolio",
        technologies: ["HTML", "CSS", "JavaScript"],
        category: "frontend"
    },
    {
        title: "Data Analytics Dashboard",
        description: "Interactive dashboard for visualizing and analyzing actuarial data using React and D3.js.",
        image: "./img/dashboard.jpg",
        githubLink: "https://github.com/GUNDYAB/dashboard",
        technologies: ["React", "D3.js", "Node.js", "MongoDB"],
        category: "data"
    },
    {
        title: "Machine Learning Model",
        description: "Predictive analytics model for financial forecasting using Python and scikit-learn.",
        image: "./img/ml-project.jpg",
        githubLink: "https://github.com/GUNDYAB/ml-project",
        technologies: ["Python", "scikit-learn", "Pandas", "Flask"],
        category: "data"
    }
];

// Core Functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeLoader();
    initializeTheme();
    initializeContent();
    initializeContactForm();
    initializeScrollBehavior();
});

function initializeLoader() {
    const loader = document.querySelector('.loader');
    Promise.all(Array.from(document.images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => img.addEventListener('load', resolve));
    })).then(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 300);
    });
}

function initializeTheme() {
    const themeStyle = document.getElementById('theme-style');
    const savedTheme = localStorage.getItem('theme') || 'light';
    themeStyle.href = `./css/theme-${savedTheme}.css`;

    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        const isLight = themeStyle.href.includes('theme-light.css');
        themeStyle.href = isLight ? './css/theme-dark.css' : './css/theme-light.css';
        localStorage.setItem('theme', isLight ? 'dark' : 'light');
    });
}

function initializeContent() {
    renderSkills();
    renderProjects();
    initializeProjectFilters();
}

function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const COOLDOWN = 60000;
    let lastSubmission = 0;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (Date.now() - lastSubmission < COOLDOWN) {
            showMessage(form, 'Please wait before sending another message.', 'error');
            return;
        }

        const data = new FormData(form);
        const sanitizedData = sanitizeFormData(data);
        if (!sanitizedData) return;

        await submitForm(form, sanitizedData);
        lastSubmission = Date.now();
    });
}

// Utility Functions
function sanitizeFormData(formData) {
    const data = Object.fromEntries(formData);
    if (!validateInput(data.name) || !validateInput(data.email) || !validateInput(data.message)) {
        showMessage(form, 'Invalid input detected.', 'error');
        return null;
    }
    return {
        name: data.name.trim(),
        email: data.email.trim(),
        message: data.message.trim()
    };
}

function validateInput(input) {
    return input && input.length < 1000 && !/[<>{}]/.test(input);
}

async function submitForm(form, data) {
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Sending...';

    try {
        const response = await emailjs.send("service_r9alwg8", "template_kixv1dm", {
            from_name: data.name,
            from_email: data.email,
            message: data.message,
            to_name: "Bright T Gundya",
            reply_to: data.email
        });

        if (response.status === 200) {
            form.reset();
            showMessage(form, 'Message sent successfully!', 'success');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showMessage(form, 'Failed to send message. Please try again.', 'error');
    } finally {
        button.disabled = false;
        button.textContent = 'Send Message';
    }
}

function showMessage(form, text, type) {
    const message = document.createElement('div');
    message.className = `form-${type}-message`;
    message.textContent = text;
    form.appendChild(message);
    setTimeout(() => message.remove(), 5000);
}

// Content Rendering
function renderSkills() {
    const container = document.querySelector('.skills-content');
    if (!container) return;
    
    container.innerHTML = Object.entries(skillsData)
        .map(([category, skills]) => `
            <div class="skills-category">
                <h3 class="skills-category-title">${category}</h3>
                <div class="skills-grid">
                    ${skills.map(skill => `
                        <div class="skill-item">
                            <i class="${skill.icon}"></i>
                            <h4>${skill.name}</h4>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
}

function renderProjects() {
    const container = document.querySelector('.projects-content');
    if (!container) return;

    container.innerHTML = projectsData.map(project => `
        <div class="project-card" data-category="${project.category}">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" />
                <div class="project-overlay">
                    <div class="project-links">
                        ${project.liveLink ? `
                            <a href="${project.liveLink}" target="_blank" class="project-link">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        ` : ''}
                        <a href="${project.githubLink}" target="_blank" class="project-link">
                            <i class="fab fa-github"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => 
                        `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}