// Account Page Functionality

// ==================== INITIALIZATION ====================

// Check if user is logged in
function checkUserLogin() {
    const user = localStorage.getItem('user');
    if (!user) {
        showNotification('⚠️ Будь ласка, увійдіть в аккаунт');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return null;
    }
    return JSON.parse(user);
}

// Initialize account page
let currentUser = checkUserLogin();

if (currentUser) {
    initializeAccountPage();
}

function initializeAccountPage() {
    // Setup modal handlers
    setupModalHandlers();
    
    // Load user data from localStorage
    loadUserProfile();
    loadUserPreferences();
    loadUserNotifications();
    
    // Setup event listeners
    setupMenuNavigation();
    setupFormHandlers();
    setupSecurityHandlers();
}

// ==================== MODAL HANDLERS ====================

function setupModalHandlers() {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const closeLogin = document.getElementById('closeLogin');
    const closeSignup = document.getElementById('closeSignup');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');

    // Open login modal
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
        });
    }

    // Open signup modal
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            signupModal.classList.add('active');
        });
    }

    // Close login modal
    if (closeLogin) closeLogin.onclick = () => loginModal.classList.remove('active');
    
    // Close signup modal
    if (closeSignup) closeSignup.onclick = () => signupModal.classList.remove('active');

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
        if (e.target === signupModal) {
            signupModal.classList.remove('active');
        }
    });

    // Switch to signup
    if (switchToSignup) {
        switchToSignup.onclick = (e) => {
            e.preventDefault();
            loginModal.classList.remove('active');
            signupModal.classList.add('active');
        };
    }

    // Switch to login
    if (switchToLogin) {
        switchToLogin.onclick = (e) => {
            e.preventDefault();
            signupModal.classList.remove('active');
            loginModal.classList.add('active');
        };
    }

    // Login form submission
    if (loginForm) {
        loginForm.onsubmit = (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const remember = document.getElementById('rememberMe').checked;

            // Save user data
            localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0], password }));
            
            if (remember) {
                setCookie('rememberMe', 'true', 365);
            }

            loginModal.classList.remove('active');
            updateAuthUI();
            location.reload();
        };
    }

    // Signup form submission
    if (signupForm) {
        signupForm.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirm = document.getElementById('signupConfirm').value;

            if (password !== confirm) {
                showNotification('❌ Паролі не збігаються!');
                return;
            }

            // Check if user already exists
            const existingUser = localStorage.getItem('user');
            if (existingUser) {
                const user = JSON.parse(existingUser);
                if (user.email === email) {
                    showNotification('❌ Цей email вже зареєстрований!');
                    return;
                }
            }

            // Save new user
            localStorage.setItem('user', JSON.stringify({ email, name, password }));
            signupModal.classList.remove('active');
            updateAuthUI();
            location.reload();
        };
    }

    // User profile menu handlers
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            logoutUser();
        };
    }

    const myBookings = document.getElementById('myBookings');
    if (myBookings) {
        myBookings.onclick = (e) => {
            e.preventDefault();
            window.location.href = 'account.html#bookings';
        };
    }

    const myProfile = document.getElementById('myProfile');
    if (myProfile) {
        myProfile.onclick = (e) => {
            e.preventDefault();
            window.location.href = 'account.html#profile';
        };
    }

    const settings = document.getElementById('settings');
    if (settings) {
        settings.onclick = (e) => {
            e.preventDefault();
            window.location.href = 'account.html#settings';
        };
    }
}

// ==================== MENU NAVIGATION ====================

function setupMenuNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        if (item.id === 'sidebarLogout') {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                logoutUser();
            });
        } else if (item.dataset.section) {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = item.dataset.section;
                showSection(sectionId);
                
                // Update active menu item
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        }
    });
    
    // Load profile section by default
    showSection('profile');
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.account-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
}

// ==================== PROFILE MANAGEMENT ====================

function loadUserProfile() {
    if (!currentUser) return;
    
    // Update sidebar
    document.getElementById('sidebarUserName').textContent = currentUser.name || 'Користувач';
    document.getElementById('sidebarUserEmail').textContent = currentUser.email || '';
    
    // Load profile form
    const profileData = JSON.parse(localStorage.getItem('userProfile') || '{}');
    
    document.getElementById('fullName').value = profileData.fullName || currentUser.name || '';
    document.getElementById('email').value = profileData.email || currentUser.email || '';
    document.getElementById('phone').value = profileData.phone || '';
    document.getElementById('birthDate').value = profileData.birthDate || '';
    document.getElementById('country').value = profileData.country || '';
    document.getElementById('city').value = profileData.city || '';
    document.getElementById('bio').value = profileData.bio || '';
}

function setupFormHandlers() {
    // Profile Form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProfileData();
        });
    }
    
    // Preferences Form
    const preferencesForm = document.getElementById('preferencesForm');
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', (e) => {
            e.preventDefault();
            savePreferences();
        });
    }
    
    // Notifications Form
    const notificationsForm = document.getElementById('notificationsForm');
    if (notificationsForm) {
        notificationsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveNotificationSettings();
        });
    }
    
    // Bookings filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterBookings(btn.dataset.filter);
        });
    });
}

function saveProfileData() {
    const profileData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        birthDate: document.getElementById('birthDate').value,
        country: document.getElementById('country').value,
        city: document.getElementById('city').value,
        bio: document.getElementById('bio').value,
        lastUpdated: new Date().toISOString()
    };
    
    // Validate required fields
    if (!profileData.fullName || !profileData.email) {
        showNotification('❌ Будь ласка, заповніть обов\'язкові поля');
        return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
        showNotification('❌ Будь ласка, введіть коректний email');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    // Update current user
    currentUser.name = profileData.fullName;
    currentUser.email = profileData.email;
    localStorage.setItem('user', JSON.stringify(currentUser));
    
    // Reload sidebar
    loadUserProfile();
    
    showNotification('✅ Профіль успішно оновлено!');
}

// ==================== PREFERENCES ====================

function loadUserPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    
    // Theme
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    const currentTheme = preferences.theme || localStorage.getItem('theme') || 'light';
    themeRadios.forEach(radio => {
        if (radio.value === currentTheme) {
            radio.checked = true;
        }
    });
    
    // Language
    document.getElementById('language').value = preferences.language || 'uk';
    
    // Currency
    document.getElementById('currency').value = preferences.currency || 'USD';
    
    // Interests
    const interests = preferences.interests || [];
    interests.forEach(interest => {
        const checkbox = document.querySelector(`input[name="interests"][value="${interest}"]`);
        if (checkbox) checkbox.checked = true;
    });
}

function savePreferences() {
    const preferences = {
        theme: document.querySelector('input[name="theme"]:checked').value,
        language: document.getElementById('language').value,
        currency: document.getElementById('currency').value,
        interests: Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(i => i.value),
        lastUpdated: new Date().toISOString()
    };
    
    // Save theme preference
    localStorage.setItem('theme', preferences.theme);
    
    // Apply theme change
    const body = document.body;
    if (preferences.theme === 'dark') {
        body.classList.add('dark-theme');
    } else if (preferences.theme === 'light') {
        body.classList.remove('dark-theme');
    }
    
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    showNotification('✅ Налаштування успішно оновлено!');
}

// ==================== NOTIFICATIONS ====================

function loadUserNotifications() {
    const notifications = JSON.parse(localStorage.getItem('userNotifications') || '{}');
    
    // Email notifications
    document.querySelector('input[name="offers"]').checked = notifications.offers !== false;
    document.querySelector('input[name="bookingUpdates"]').checked = notifications.bookingUpdates !== false;
    document.querySelector('input[name="newsletter"]').checked = notifications.newsletter !== false;
    
    // Push notifications
    document.querySelector('input[name="criticalNotifications"]').checked = notifications.criticalNotifications !== false;
    document.querySelector('input[name="nearbyOffers"]').checked = notifications.nearbyOffers !== false;
}

function saveNotificationSettings() {
    const notifications = {
        offers: document.querySelector('input[name="offers"]').checked,
        bookingUpdates: document.querySelector('input[name="bookingUpdates"]').checked,
        newsletter: document.querySelector('input[name="newsletter"]').checked,
        criticalNotifications: document.querySelector('input[name="criticalNotifications"]').checked,
        nearbyOffers: document.querySelector('input[name="nearbyOffers"]').checked,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('userNotifications', JSON.stringify(notifications));
    
    showNotification('✅ Налаштування сповіщень оновлено!');
}

// ==================== SECURITY ====================

function setupSecurityHandlers() {
    // Change password
    document.getElementById('changePasswordBtn').addEventListener('click', () => {
        changePassword();
    });
    
    // Delete account
    document.getElementById('deleteAccountBtn').addEventListener('click', () => {
        deleteAccount();
    });
}

function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification('❌ Будь ласка, заповніть всі поля');
        return;
    }
    
    // Verify current password (demo - in real app use backend)
    if (currentPassword !== currentUser.password) {
        showNotification('❌ Поточний пароль невірний');
        return;
    }
    
    if (newPassword.length < 8) {
        showNotification('❌ Новий пароль повинен мати мінімум 8 символів');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('❌ Паролі не збігаються');
        return;
    }
    
    // Update password
    currentUser.password = newPassword;
    localStorage.setItem('user', JSON.stringify(currentUser));
    
    // Clear password fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    showNotification('✅ Пароль успішно змінено!');
}

function deleteAccount() {
    const confirmed = confirm('⚠️ Ви впевнені? Ця дія необратима. Весь ваш непрочитаний вміст буде видалено.');
    
    if (confirmed) {
        const reason = prompt('Будь ласка, розповідіть нам, чому ви видаляєте аккаунт:');
        if (reason) {
            // Log deletion
            console.log('Аккаунт видалено. Причина:', reason);
            
            // Clear user data
            localStorage.removeItem('user');
            localStorage.removeItem('userProfile');
            localStorage.removeItem('userPreferences');
            localStorage.removeItem('userNotifications');
            localStorage.removeItem('rememberMe');
            
            showNotification('👋 Ваш аккаунт успішно видалено. Редирект...');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }
}

// ==================== BOOKINGS ====================

function filterBookings(filter) {
    const user = JSON.parse(localStorage.getItem('user'));
    let bookings = [];
    
    // Get bookings from localStorage
    if (typeof getAllBookings === 'function') {
        bookings = getAllBookings(user.email);
    } else {
        bookings = JSON.parse(localStorage.getItem('userBookings') || '[]').filter(b => b.userEmail === user.email);
    }
    
    if (bookings.length === 0) {
        displayNoBookings();
        return;
    }
    
    let filtered = bookings;
    
    if (filter !== 'all') {
        // Map 'past' filter to 'finished' status
        const statusMap = { 'past': 'finished' };
        const statusFilter = statusMap[filter] || filter;
        filtered = bookings.filter(booking => booking.status === statusFilter);
    }
    
    displayBookings(filtered);
}

function displayBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');
    
    if (bookings.length === 0) {
        displayNoBookings();
        return;
    }
    
    let html = '';
    bookings.forEach(booking => {
        const statusClass = `status-${booking.status}`;
        const statusText = {
            active: '🟢 Активне',
            finished: '✅ Завершене',
            cancelled: '❌ Скасоване',
            past: '⏰ Минуле'
        }[booking.status] || booking.status;
        
        const bookingDate = new Date(booking.bookingDate).toLocaleDateString('uk-UA');
        
        // Get prices in different currencies
        const priceUSD = booking.priceUSD || extractPriceNumber(booking.priceDisplay || booking.price);
        const prices = getPriceInAllCurrencies(priceUSD);
        
        let refundInfo = '';
        if (booking.status === 'cancelled' && booking.refundAmount) {
            const refundFormatted = convertPrice(booking.refundAmount, 'USD');
            refundInfo = `<div class="refund-info">💰 Повернено: ${refundFormatted}</div>`;
        }
        
        let ratingInfo = '';
        if (booking.status === 'finished' && booking.rating) {
            const stars = '⭐'.repeat(booking.rating);
            ratingInfo = `<div class="rating-info">${stars} ${booking.rating}/5</div>`;
        }
        
        // Add review section for finished trips
        let reviewSection = '';
        if (booking.status === 'finished' && booking.review) {
            reviewSection = `
                <div class="review-section">
                    <p><strong>💬 Ваш відгук:</strong></p>
                    <p class="review-text">"${booking.review}"</p>
                </div>
            `;
        }
        
        // Show finished date for completed trips
        let dateDisplay = `📅 Забронювано: ${bookingDate}`;
        if (booking.status === 'finished' && booking.finishedDate) {
            const finishedDate = new Date(booking.finishedDate).toLocaleDateString('uk-UA');
            dateDisplay += `<div class="booking-date">✅ Завершено: ${finishedDate}</div>`;
        } else if (booking.status === 'cancelled' && booking.cancelledDate) {
            const cancelledDate = new Date(booking.cancelledDate).toLocaleDateString('uk-UA');
            dateDisplay += `<div class="booking-date">❌ Скасовано: ${cancelledDate}</div>`;
        }
        
        html += `
            <div class="booking-card" data-booking-id="${booking.id}">
                <div class="booking-details">
                    <div class="booking-destination">🌍 ${booking.destination}</div>
                    <div class="booking-info">${booking.description}</div>
                    <div class="booking-specs">
                        <span>${booking.tripDays}</span>
                        <span>${booking.tripStars}</span>
                        <span>${booking.included}</span>
                    </div>
                    <div class="booking-date">${dateDisplay}</div>
                    
                    <div class="booking-prices">
                        <div class="price-group">
                            <label>💵 Ціна:</label>
                            <div class="price-options">
                                <span class="price-option" title="USD">${prices.USD}</span>
                                <span class="price-option" title="EUR">${prices.EUR}</span>
                                <span class="price-option" title="Hryvnia">${prices.UAH}</span>
                                <span class="price-option" title="Zloty">${prices.PLN}</span>
                            </div>
                        </div>
                    </div>
                    
                    ${refundInfo}
                    ${ratingInfo}
                    ${reviewSection}
                    <span class="booking-status ${statusClass}">${statusText}</span>
                </div>
                <div class="booking-actions">
                    <button class="btn btn-small btn-primary" onclick="viewBookingDetails('${booking.id}')">Деталі</button>
                    ${booking.status === 'active' ? `
                        <button class="btn btn-small btn-warning" onclick="openCancelModal('${booking.id}')">❌ Скасувати</button>
                        <button class="btn btn-small btn-success" onclick="finishBookingAction('${booking.id}')">✅ Завершити</button>
                    ` : ''}
                    ${booking.status === 'finished' ? `
                        <button class="btn btn-small btn-info" onclick="shareTrip('${booking.id}')">📤 Поділитися</button>
                    ` : ''}
                    <button class="btn btn-small btn-secondary" onclick="downloadBooking('${booking.id}')">📥 Завантажити</button>
                </div>
            </div>
        `;
    });
    
    bookingsList.innerHTML = html;
}

function displayNoBookings() {
    document.getElementById('bookingsList').innerHTML = `
        <div class="no-bookings">
            <p>📭 У вас поки немає бронювань</p>
            <a href="index.html#promotions" class="btn btn-primary">Почати бронювання</a>
        </div>
    `;
}

// Booking actions
function viewBookingDetails(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const booking = bookings.find(b => b.id == bookingId);
    
    if (booking) {
        const priceUSD = booking.priceUSD || extractPriceNumber(booking.priceDisplay || booking.price);
        const prices = getPriceInAllCurrencies(priceUSD);
        
        let details = `
📍 ${booking.destination}
💵 Ціна: ${prices.USD} / ${prices.EUR} / ${prices.UAH} / ${prices.PLN}
📝 ${booking.description}
🏨 ${booking.tripDays} | ${booking.tripStars}
✈️ ${booking.included}
📅 Забронювано: ${new Date(booking.bookingDate).toLocaleDateString('uk-UA')}
🏷️ Статус: ${booking.status}
        `;
        
        showNotification(details);
    }
}

// Open cancel booking modal
function openCancelModal(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const booking = bookings.find(b => b.id == bookingId);
    
    if (booking) {
        const reason = prompt('Причина скасування (опціонально):', '');
        if (reason !== null) {
            performCancelBooking(bookingId, reason);
        }
    }
}

// Perform booking cancellation with refund
function performCancelBooking(bookingId, reason = '') {
    const result = window.cancelBooking ? window.cancelBooking(bookingId, reason) : cancelBookingLocal(bookingId, reason);
    
    if (result) {
        const message = `
✅ Бронювання успішно скасовано!

📍 ${result.booking.destination}
💰 Повернено: ${result.refundFormatted}
📊 Відсоток повернення: ${result.refundPercentage}%
        `;
        showNotification(message);
        filterBookings('all');
    }
}

// Local cancel booking function (fallback)
function cancelBookingLocal(bookingId, reason = '') {
    let bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const booking = bookings.find(b => b.id == bookingId);
    
    if (booking && booking.status === 'active') {
        booking.status = 'cancelled';
        booking.cancelledDate = new Date().toISOString();
        booking.refundAmount = booking.priceUSD * 0.75; // Default 75% refund
        booking.notes = reason;
        
        localStorage.setItem('userBookings', JSON.stringify(bookings));
        
        return {
            booking: booking,
            refundAmount: booking.refundAmount,
            refundFormatted: convertPrice(booking.refundAmount, 'USD'),
            refundPercentage: 75
        };
    }
    
    return null;
}

// Finish/complete a booking
function finishBookingAction(bookingId) {
    const rating = prompt('Оцініть поїздку (1-5 зірок):', '5');
    if (rating !== null && rating >= 1 && rating <= 5) {
        const review = prompt('Залиште відгук про поїздку (опціонально):', '');
        
        const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        const booking = bookings.find(b => b.id == bookingId);
        
        if (booking && booking.status === 'active') {
            booking.status = 'finished';
            booking.finishedDate = new Date().toISOString();
            booking.rating = parseInt(rating);
            booking.review = review;
            
            localStorage.setItem('userBookings', JSON.stringify(bookings));
            
            showNotification(`✅ Дякуємо за ваш відгук!\n⭐ ${rating}/5 - ${booking.destination}`);
            filterBookings('all');
        }
    }
}

function downloadBooking(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const booking = bookings.find(b => b.id == bookingId);
    
    if (booking) {
        const priceUSD = booking.priceUSD || extractPriceNumber(booking.priceDisplay || booking.price);
        const prices = getPriceInAllCurrencies(priceUSD);
        
        // Create downloadable booking document
        const bookingContent = `
BOOKING CONFIRMATION
${booking.destination}

Дата бронювання: ${new Date(booking.bookingDate).toLocaleDateString('uk-UA')}
Статус: ${booking.status}

ЦІНА (Мультивалютна):
- USD: ${prices.USD}
- EUR: ${prices.EUR}
- UAH: ${prices.UAH}
- PLN: ${prices.PLN}

ДЕТАЛІ ПОЇЗДКИ:
${booking.description}
Тривалість: ${booking.tripDays}
Готель: ${booking.tripStars}
Включено: ${booking.included}

КОНТАКТНА ІНФОРМАЦІЯ:
${booking.userEmail}

---
Дякуємо за вибір TravelGo!
        `;
        
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(bookingContent));
        element.setAttribute('download', `booking_${booking.destination}_${Date.now()}.txt`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        showNotification('📥 Документ бронювання завантажено!');
    }
}

// ==================== COMPLETED TRIPS ====================

function loadCompletedTrips() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    let bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const completedTrips = bookings.filter(b => b.userEmail === user.email && b.status === 'finished');

    displayCompletedTrips(completedTrips);
}

function displayCompletedTrips(trips) {
    const completedList = document.getElementById('completedTripsList');
    
    // Skip if element doesn't exist (removed from account page)
    if (!completedList) return;

    if (trips.length === 0) {
        completedList.innerHTML = `
            <div class="no-bookings">
                <p>📭 У вас поки немає завершених поїздок</p>
                <a href="trips.html" class="btn btn-primary">Дивитися всі поїздки</a>
            </div>
        `;
        return;
    }

    let html = '';
    trips.forEach(trip => {
        const priceUSD = trip.priceUSD || extractPriceNumber(trip.priceDisplay || trip.price);
        const prices = getPriceInAllCurrencies(priceUSD);
        const finishedDate = new Date(trip.finishedDate).toLocaleDateString('uk-UA');

        let ratingStars = '';
        if (trip.rating) {
            ratingStars = '⭐'.repeat(trip.rating) + ` ${trip.rating}/5`;
        }

        let reviewSection = '';
        if (trip.review) {
            reviewSection = `
                <div class="review-section">
                    <p><strong>Ваш відгук:</strong></p>
                    <p class="review-text">"${trip.review}"</p>
                </div>
            `;
        }

        html += `
            <div class="booking-card completed-trip-card">
                <div class="booking-details">
                    <div class="booking-destination">🎉 ${trip.destination}</div>
                    <div class="booking-info">${trip.description}</div>
                    <div class="booking-specs">
                        <span>${trip.tripDays}</span>
                        <span>${trip.tripStars}</span>
                        <span>${trip.included}</span>
                    </div>
                    <div class="booking-date">✅ Завершено: ${finishedDate}</div>
                    
                    <div class="booking-prices">
                        <div class="price-group">
                            <label>💰 Сплачено:</label>
                            <div class="price-options">
                                <span class="price-option" title="USD">${prices.USD}</span>
                                <span class="price-option" title="EUR">${prices.EUR}</span>
                                <span class="price-option" title="Hryvnia">${prices.UAH}</span>
                                <span class="price-option" title="Zloty">${prices.PLN}</span>
                            </div>
                        </div>
                    </div>

                    ${ratingStars ? `<div class="rating-info">${ratingStars}</div>` : ''}
                    ${reviewSection}
                </div>
                <div class="booking-actions">
                    <button class="btn btn-small btn-success" onclick="shareTrip('${trip.id}')">📤 Поділитися</button>
                    <button class="btn btn-small btn-secondary" onclick="downloadBooking('${trip.id}')">📥 Завантажити</button>
                </div>
            </div>
        `;
    });

    completedList.innerHTML = html;
}

function shareTrip(tripId) {
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const trip = bookings.find(b => b.id == tripId);

    if (trip) {
        const shareText = `Я щойно завершив чудову поїздку на ${trip.destination}! 🌍✈️ Рейтинг: ${trip.rating || 'N/A'}/5 ⭐ ${ trip.review ? ` "${trip.review}"` : ''}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Моя поїздка',
                text: shareText
            }).catch(err => console.log('Share error:', err));
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                showNotification('📋 Текст скопійовано в буфер обміну');
            });
        }
    }
}

// ==================== LOGOUT ====================

function logoutUser() {
    const confirmed = confirm('Ви впевнені, що хочете вийти?');
    
    if (confirmed) {
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
        showNotification('👋 Ви вийшли з аккаунту');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// ==================== NOTIFICATIONS ====================

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
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.5s ease-out forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// ==================== ADD SAMPLE DATA ====================

// Demo: Add sample bookings
function addSampleBookings() {
    const sampleBookings = [
        {
            destination: 'Мальдіви',
            startDate: '2024-06-01',
            endDate: '2024-06-07',
            price: '1,879 USD',
            status: 'active'
        },
        {
            destination: 'Таїланд',
            startDate: '2024-04-15',
            endDate: '2024-04-23',
            price: '1,096 USD',
            status: 'past'
        }
    ];
    
    // Uncomment to add sample data:
    // localStorage.setItem('userBookings', JSON.stringify(sampleBookings));
}

// On page load, check bookings
window.addEventListener('load', () => {
    if (currentUser) {
        // Already initialized in initializeAccountPage()
        filterBookings('all');
    }
});
