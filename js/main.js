/**
 * Main JavaScript file for portfolio website
 * Author: Bright T Gundya
 * Version: 1.0.0
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen and content animations
    initializeLoader();
    
    // Initialize custom cursor
    initializeCustomCursor();
    
    // Initialize theme handling
    initializeTheme();
    
    // Initialize typing effect
    initializeTypingEffect();
    
    // Initialize scroll behavior
    initializeScrollBehavior();
    
    // Initialize skills and projects
    renderSkills();
    renderProjects();
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize animations and interactions
    initializeAnimations();
});

/**
 * Loading screen initialization and handling
 */
function initializeLoader() {
    const loader = document.querySelector('.loader');
    Promise.all(Array.from(document.images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => img.addEventListener('load', resolve));
    })).then(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            animateSections();
        }, 300);
    });
}

/**
 * Custom cursor initialization and handling
 */
function initializeCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        follower.style.left = `${e.clientX - 10}px`;
        follower.style.top = `${e.clientY - 10}px`;
    });
}

/**
 * Theme handling initialization and functionality
 */
function initializeTheme() {
    const themeStyle = document.getElementById('theme-style');
    const savedTheme = localStorage.getItem('theme') || 'light';
    themeStyle.href = `./css/theme-${savedTheme}.css`;
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    
    // Force initial light mode state
    document.body.classList.remove('dark-mode');

    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        const isLight = themeStyle.href.includes('theme-light.css');
        themeStyle.href = isLight ? './css/theme-dark.css' : './css/theme-light.css';
        document.body.classList.toggle('dark-mode', !isLight);
        localStorage.setItem('theme', isLight ? 'dark' : 'light');
    });
}

/**
 * Typing effect initialization and functionality
 */
function initializeTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    const textToType = "Hello, I'm Bright T Gundya";
    let charIndex = 0;

    function typeWriter() {
        if (charIndex < textToType.length) {
            typingText.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 100);
        }
    }

    // Start typing effect after a short delay
    setTimeout(typeWriter, 1000);
}

/**
 * Scroll behavior initialization and functionality
 */
function initializeScrollBehavior() {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Skills and projects initialization and functionality
 */
function renderSkills() {
    const skillsContainer = document.querySelector('.skills-content');
    if (!skillsContainer) return;

    const skillsHTML = Object.entries(skillsData)
        .map(([category, skills]) => createSkillCategory(category, skills))
        .join('');

    skillsContainer.innerHTML = skillsHTML;

    // Add animation for skill progress bars
    const progressBars = document.querySelectorAll('.skill-progress');
    progressBars.forEach(bar => {
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = bar.parentElement.dataset.progress;
        }, 500);
    });
}

function renderProjects() {
    const projectsContainer = document.querySelector('.projects-content');
    if (!projectsContainer) return;

    const projectsHTML = projectsData.map(project => createProjectCard(project)).join('');
    projectsContainer.innerHTML = projectsHTML;
}

/**
 * Contact form initialization with security measures
 */
function initializeContactForm() {
    const CONTACT_FORM_COOLDOWN = 60000; // 1 minute cooldown
    let lastSubmissionTime = 0;

    document.getElementById('contact-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateFormSubmission(this, lastSubmissionTime)) return;
        
        const submitButton = this.querySelector('button[type="submit"]');
        setLoadingState(submitButton, true);
        
        try {
            await sendContactForm(this);
            showSuccessMessage(this);
            lastSubmissionTime = Date.now();
        } catch (error) {
            showErrorMessage(this, error);
        } finally {
            setLoadingState(submitButton, false);
        }
    });
}

/**
 * Animations and interactions initialization and functionality
 */
function initializeAnimations() {
    // Add Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-item, .project-card, .stat-item').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Add real-time form validation
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });

        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });

    function validateInput(input) {
        const formGroup = input.parentElement;
        
        if (input.value.trim() === '') {
            formGroup.classList.add('error');
            formGroup.dataset.error = 'This field is required';
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            formGroup.classList.add('error');
            formGroup.dataset.error = 'Please enter a valid email';
        } else {
            formGroup.classList.remove('error');
            delete formGroup.dataset.error;
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Back to top button functionality
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add project filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            const filter = btn.dataset.filter;
            const projects = document.querySelectorAll('.project-card');
            
            projects.forEach(project => {
                if (filter === 'all' || project.dataset.category === filter) {
                    project.style.display = 'block';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Skills data structure
 */
    const skillsData = {
        "Frontend Development": [
            {
                name: "HTML5",
                icon: "fab fa-html5"
            },
            {
                name: "CSS3",
                icon: "fab fa-css3-alt"
            },
            {
                name: "JavaScript",
                icon: "fab fa-js"
            },
            {
                name: "React",
                icon: "fab fa-react"
            }
        ],
        "Backend Development": [
            {
                name: "Python",
                icon: "fab fa-python"
            },
            {
                name: "SQL",
                icon: "fas fa-database"
            },
            {
                name: "Node.js",
                icon: "fab fa-node-js"
            }
        ],
        "Data & Analytics": [
            {
                name: "Actuarial Science",
                icon: "fas fa-chart-line"
            },
            {
                name: "Machine Learning",
                icon: "fas fa-brain"
            },
            {
                name: "Statistical Analysis",
                icon: "fas fa-chart-bar"
            }
        ]
    };

/**
 * Projects data structure
 */
const projectsData = [
    {
        title: "Portfolio Website",
        description: "A modern, responsive portfolio website built with HTML, CSS, and JavaScript featuring dark/light mode and smooth animations.",
        image: "./img/portfolio.jpg",
        liveLink: "https://gundyab.github.io/portfolio",
        githubLink: "https://github.com/GUNDYAB/portfolio",
        technologies: ["HTML", "CSS", "JavaScript"]
    },
    {
        title: "Data Analytics Dashboard",
        description: "Interactive dashboard for visualizing and analyzing actuarial data using React and D3.js.",
        image: "./img/dashboard.jpg",
        githubLink: "https://github.com/GUNDYAB/dashboard",
        technologies: ["React", "D3.js", "Node.js", "MongoDB"]
    },
    {
        title: "Machine Learning Model",
        description: "Predictive analytics model for financial forecasting using Python and scikit-learn.",
        image: "./img/ml-project.jpg",
        githubLink: "https://github.com/GUNDYAB/ml-project",
        technologies: ["Python", "scikit-learn", "Pandas", "Flask"]
    }
];

/**
 * Function to create skill items
 */
    function createSkillItem(skill) {
        return `
            <div class="skill-item">
                <i class="${skill.icon}"></i>
                <h4>${skill.name}</h4>
            </div>
        `;
    }

/**
 * Function to create skill categories
 */
    function createSkillCategory(categoryName, skills) {
        return `
            <div class="skills-category">
                <h3 class="skills-category-title">${categoryName}</h3>
                <div class="skills-grid">
                    ${skills.map(skill => createSkillItem(skill)).join('')}
                </div>
            </div>
        `;
    }

/**
 * Function to create project cards
 */
function createProjectCard(project) {
    return `
        <div class="project-card">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" />
                <div class="project-overlay">
                    <div class="project-links">
                        ${project.liveLink ? `
                            <a href="${project.liveLink}" target="_blank" class="project-link" aria-label="Live Demo">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        ` : ''}
                        ${project.githubLink ? `
                            <a href="${project.githubLink}" target="_blank" class="project-link" aria-label="GitHub Repository">
                                <i class="fab fa-github"></i>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `
                        <span class="tech-tag">${tech}</span>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * Function to set loading state for submit buttons
 */
function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.textContent = 'Sending...';
    } else {
        button.disabled = false;
        button.textContent = 'Send';
    }
}

/**
 * Function to show success message to the user
 */
function showSuccessMessage(form) {
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success-message';
    successMessage.textContent = 'Message sent successfully! I will get back to you soon.';
    form.appendChild(successMessage);
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

/**
 * Function to show error message to the user
 */
function showErrorMessage(form, error) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'form-error-message';
    errorMessage.textContent = `Sorry, there was an error sending your message. Please try again later. Error: ${error.message}`;
    form.appendChild(errorMessage);
    setTimeout(() => {
        errorMessage.remove();
    }, 5000);
}

/**
 * Function to sanitize input data
 */
function sanitizeInput(input) {
    return input.replace(/<[^>]*>/g, ''); // Remove HTML tags
}

/**
 * Function to validate form submission
 */
function validateFormSubmission(form, lastSubmissionTime) {
    const now = Date.now();
    if (now - lastSubmissionTime < CONTACT_FORM_COOLDOWN) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'form-error-message';
        errorMessage.textContent = 'Please wait a moment before sending another message.';
        form.appendChild(errorMessage);
            setTimeout(() => {
            errorMessage.remove();
        }, 5000);
        return false;
    }
    return true;
}

/**
 * Function to send contact form data
 */
async function sendContactForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate inputs
    if (!isValidInput(data.name) || !isValidInput(data.email) || !isValidInput(data.message)) {
        throw new Error('Invalid input detected. Please try again.');
    }
    
    // Sanitize inputs
    const sanitizedData = {
        name: sanitizeInput(data.name),
        email: sanitizeInput(data.email),
        message: sanitizeInput(data.message)
    };
    
    // Send email using EmailJS
    const response = await emailjs.send(
        "service_r9alwg8",
        "template_kixv1dm",
        {
            from_name: sanitizedData.name,
            from_email: sanitizedData.email,
            message: sanitizedData.message,
            to_name: "Bright T Gundya",
            reply_to: sanitizedData.email,
        }
    );

    if (response.status !== 200) {
        throw new Error('Failed to send message');
    }
}

/**
 * Function to check for suspicious patterns in input
 */
function isValidInput(input) {
    // Check for suspicious patterns
    const suspicious = /[<>{}]/g;
    return !suspicious.test(input) && input.length < 1000;
}