// ==================== THEME TOGGLE ====================
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const body = document.body;

// Load theme from localStorage on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        body.classList.add('dark-theme');
        themeToggle.querySelector('.theme-icon').textContent = '☀️';
    } else {
        body.classList.remove('dark-theme');
        themeToggle.querySelector('.theme-icon').textContent = '🌙';
    }
}

// Initialize theme on page load
loadTheme();

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.querySelector('.theme-icon').textContent = isDark ? '☀️' : '🌙';
});

// ==================== AUTHENTICATION ====================
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeLogin = document.getElementById('closeLogin');
const closeSignup = document.getElementById('closeSignup');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const userProfile = document.getElementById('userProfile');
const logoutBtn = document.getElementById('logoutBtn');

// Switch between login and signup forms
document.getElementById('switchToSignup').addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.remove('active');
    signupModal.classList.add('active');
});

document.getElementById('switchToLogin').addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.classList.remove('active');
    loginModal.classList.add('active');
});

// Open modals
loginBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
});

signupBtn.addEventListener('click', () => {
    signupModal.classList.add('active');
});

// Close modals
closeLogin.addEventListener('click', () => {
    loginModal.classList.remove('active');
});

closeSignup.addEventListener('click', () => {
    signupModal.classList.remove('active');
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.remove('active');
    }
    if (e.target === signupModal) {
        signupModal.classList.remove('active');
    }
});

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validate inputs
    if (!email || !password) {
        showNotification('Будь ласка, заповніть всі поля');
        return;
    }
    
    // Save user data to localStorage
    const userData = {
        email: email,
        name: email.split('@')[0],
        loggedIn: true,
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
    }
    
    // Update UI
    updateAuthUI();
    loginModal.classList.remove('active');
    loginForm.reset();
    
    showNotification(`✅ Ласкаво просимо, ${userData.name}!`);
});

// Handle signup form submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validate inputs
    if (!name || !email || !password || !confirm) {
        showNotification('Будь ласка, заповніть всі поля');
        return;
    }
    
    if (password !== confirm) {
        showNotification('❌ Паролі не збігаються!');
        return;
    }
    
    if (password.length < 6) {
        showNotification('❌ Пароль повинен мати мінімум 6 символів');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('❌ Ви повинні прийняти умови обслуговування');
        return;
    }
    
    // Check if email already exists
    const existingUser = localStorage.getItem('user');
    if (existingUser) {
        const user = JSON.parse(existingUser);
        if (user.email === email) {
            showNotification('❌ Цей email вже зареєстрований');
            return;
        }
    }
    
    // Save new user
    const newUser = {
        name: name,
        email: email,
        password: password, // In real app, this should be hashed!
        loggedIn: true,
        registrationTime: new Date().toISOString()
    };
    
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Update UI
    updateAuthUI();
    signupModal.classList.remove('active');
    signupForm.reset();
    
    showNotification(`✅ Ласкаво просимо, ${name}! Ви успішно зареєстровані.`);
});

// Logout functionality
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    updateAuthUI();
    userProfile.classList.add('hidden');
    showNotification('👋 Ви вийшли з аккаунту');
});

// Update authentication UI
function updateAuthUI() {
    const user = localStorage.getItem('user');
    const rememberMe = localStorage.getItem('rememberMe');
    
    if (user || rememberMe) {
        const userData = user ? JSON.parse(user) : { name: 'Користувач' };
        
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        
        userProfile.classList.remove('hidden');
        document.getElementById('userNameDisplay').textContent = `👤 ${userData.name}`;
        
        // Add profile button to nav-actions if not exists
        if (!document.getElementById('profileBtn')) {
            const navActions = document.querySelector('.nav-actions');
            const profileBtn = document.createElement('button');
            profileBtn.id = 'profileBtn';
            profileBtn.className = 'profile-btn';
            profileBtn.textContent = '👤';
            profileBtn.title = userData.name;
            profileBtn.style.cssText = `
                background: none;
                border: 2px solid var(--primary-color);
                padding: 0.5rem 0.8rem;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            profileBtn.addEventListener('click', toggleProfileMenu);
            navActions.appendChild(profileBtn);
        }
    } else {
        loginBtn.style.display = 'inline-block';
        signupBtn.style.display = 'inline-block';
        userProfile.classList.add('hidden');
        
        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn) profileBtn.remove();
    }
}

// Toggle profile menu
function toggleProfileMenu(e) {
    e.stopPropagation();
    userProfile.classList.toggle('hidden');
}

// Close profile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-actions') && !e.target.closest('.user-profile')) {
        userProfile.classList.add('hidden');
    }
});

// Check if user is logged in on page load
window.addEventListener('load', () => {
    updateAuthUI();
});

// ==================== EXISTING FUNCTIONALITY ====================

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking on a nav link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// CTA Button functionality
const ctaButton = document.querySelector('.cta-button');
ctaButton.addEventListener('click', () => {
    document.getElementById('promotions').scrollIntoView({ behavior: 'smooth' });
});

// Book Button Functionality
const bookButtons = document.querySelectorAll('.book-btn');
bookButtons.forEach(button => {
    button.addEventListener('click', function() {
        const user = localStorage.getItem('user');
        if (!user) {
            showNotification('⚠️ Будь ласка, увійдіть в аккаунт для бронювання');
            setTimeout(() => {
                loginModal.classList.add('active');
            }, 1000);
            return;
        }
        
        const cardTitle = this.closest('.promo-card').querySelector('h3').textContent;
        const cardPrice = this.closest('.promo-card').querySelector('.new-price').textContent;
        
        showNotification(`✅ Ви вибрали: ${cardTitle}\nЦіна: ${cardPrice}\n\nСкоро наш менеджер зв'яжеться з вами!`);
    });
});

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        if (email) {
            localStorage.setItem('newsletter_' + email, 'true');
            showNotification(`✅ Спасибо! Ми отримали вашу пошту:\n${email}\n\nЧекайте на спеціальні пропозиції!`);
            this.reset();
        }
    });
}

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #1a5f7a 0%, #0d7a8c 100%);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideDown 0.5s ease-out;
        max-width: 500px;
        text-align: center;
        font-weight: 500;
        white-space: pre-line;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.5s ease-out forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Add animations to notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Add hover effects to destination cards
const destinationCards = document.querySelectorAll('.destination-card');
destinationCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Destination link interactions
const destLinks = document.querySelectorAll('.dest-link');
destLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const destination = this.closest('.destination-card').querySelector('h3').textContent;
        showNotification(`ℹ️ Ви цікавитеся країною: ${destination}\n\nНаш менеджер розповість вам більше про чудові тури!`);
    });
});

// Active navigation highlight
window.addEventListener('scroll', () => {
    let currentSection = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = 'var(--text-primary)';
        
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.style.color = 'var(--secondary-color)';
            link.style.fontWeight = '700';
        }
    });
});

// Floating cards animation enhancement
const floatingCards = document.querySelectorAll('.floating-card');
floatingCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) rotate(5deg) scale(1.05)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotate(0) scale(1)';
    });
});

// Promo card interactions
const promoCards = document.querySelectorAll('.promo-card');
promoCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const badge = this.querySelector('.promo-badge');
        badge.style.transform = 'scale(1.1) rotate(10deg)';
    });
    
    card.addEventListener('mouseleave', function() {
        const badge = this.querySelector('.promo-badge');
        badge.style.transform = 'scale(1) rotate(0)';
    });
});

// Intersection Observer for animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.promo-card, .destination-card, .feature-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// Feature cards color change on hover
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach((card, index) => {
    const originalBg = window.getComputedStyle(card).backgroundColor;
    card.addEventListener('mouseenter', function() {
        const colors = [
            'linear-gradient(135deg, #ff6b6b 0%, #ff8c42 100%)',
            'linear-gradient(135deg, #ffa400 0%, #ffb300 100%)',
            'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            'linear-gradient(135deg, #0093e9 0%, #80d0c7 100%)'
        ];
        
        this.style.background = colors[index % colors.length];
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.background = originalBg;
    });
});

// Header scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
});

// Button ripple effect
function addRippleEffect() {
    const buttons = document.querySelectorAll('.cta-button, .book-btn, .newsletter-form button, .dest-link');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                animation: ripple-animation 0.6s ease-out;
            `;
            
            const animationStyle = document.querySelector('style[data-ripple="true"]');
            if (!animationStyle) {
                const newStyle = document.createElement('style');
                newStyle.setAttribute('data-ripple', 'true');
                newStyle.textContent = `
                    @keyframes ripple-animation {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(newStyle);
            }
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

addRippleEffect();

// Page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

setTimeout(() => {
    document.body.style.opacity = '1';
}, 100);

// Log that the site has loaded
console.log('✈️ TravelGo website loaded successfully! Theme: ' + (body.classList.contains('dark-theme') ? 'Dark' : 'Light'));
