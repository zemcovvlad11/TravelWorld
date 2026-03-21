// Trips Page Functionality

// ==================== TRIPS DATABASE ====================

const ALL_TRIPS = [
    // ASIA
    { id: 1, destination: "Япоия - Країна восходу", description: "Токіо, Киото та священні храми", region: "asia", emoji: "🗾", price: 2484, days: 10, hotel: "4 зірки", flights: "Включені", featured: false },
    { id: 2, destination: "Таїланд - Країна посмішок", description: "Бангкок, Паттайя та острови", region: "asia", emoji: "🏝️", price: 1096, days: 8, hotel: "4 зірки", flights: "Включені", featured: false },
    { id: 3, destination: "В'єтнам - Екзотична красиця", description: "Ханой, Халонг та Сайгон", region: "asia", emoji: "🏔️", price: 899, days: 7, hotel: "3 зірки", flights: "Включені", featured: false },
    { id: 4, destination: "Індія - Край контрастів", description: "Дельі, Агра та Варанасі", region: "asia", emoji: "🕌", price: 749, days: 8, hotel: "3 зірки", flights: "Включені", featured: false },
    { id: 5, destination: "Індонезія - Архіпелаг чудес", description: "Балі, Джакарта та Ломбок", region: "asia", emoji: "🌋", price: 1345, days: 9, hotel: "4 зірки", flights: "Включені", featured: true },
    { id: 6, destination: "Сінгапур - Сучасна азія", description: "Небhacькі висотки та парки", region: "asia", emoji: "🏙️", price: 1650, days: 4, hotel: "5 зірок", flights: "Включені", featured: false },
    { id: 7, destination: "Малайзія - Земля розмаїття", description: "Куала-Лумпур та Джордж-Таун", region: "asia", emoji: "🌳", price: 923, days: 6, hotel: "3 зірки", flights: "Включені", featured: false },
    { id: 8, destination: "Філіппіни - Острівний рай", description: "Манала, Себу та Палаван", region: "asia", emoji: "🏖️", price: 1234, days: 8, hotel: "4 зірки", flights: "Включені", featured: false },

    // EUROPE
    { id: 9, destination: "Італія - Колиска культури", description: "Рим, Венеція та Флоренція", region: "europe", emoji: "🇮🇹", price: 1890, days: 10, hotel: "4 зірки", flights: "Включені", featured: true },
    { id: 10, destination: "Франція - Країна кохання", description: "Париж, Ліон та Ніцца", region: "europe", emoji: "🗼", price: 2150, days: 9, hotel: "5 зірок", flights: "Включені", featured: false },
    { id: 11, destination: "Іспанія - Земля пристрастей", description: "Мадрид, Барселона та Севілья", region: "europe", emoji: "🏰", price: 1567, days: 8, hotel: "4 зірки", flights: "Включені", featured: false },
    { id: 12, destination: "Німеччина - країна історії", description: "Берлін, Мюнхен та Кельн", region: "europe", emoji: "🍺", price: 1345, days: 7, hotel: "3 зірки", flights: "Включені", featured: false },
    { id: 13, destination: "Великобританія - Острівна королева", description: "Лондон, Едінбург та Кордифф", region: "europe", emoji: "👑", price: 1789, days: 8, hotel: "4 зірки", flights: "Включені", featured: false },
    { id: 14, destination: "Португалія - Європейське сонце", description: "Лісабон, Портау та Алгарве", region: "europe", emoji: "🌅", price: 1234, days: 7, hotel: "3 зірки", flights: "Включені", featured: false },
    { id: 15, destination: "Греція - Колиска демократії", description: "Афіни, Крит та острови", region: "europe", emoji: "⛩️", price: 1456, days: 8, hotel: "4 зірки", flights: "Включені", featured: false },
    { id: 16, destination: "Швейцарія - Альпійська красиця", description: "Цюрих, Люцерн та Гштад", region: "europe", emoji: "🏔️", price: 2890, days: 6, hotel: "5 зірок", flights: "Включені", featured: false },

    // AFRICA
    { id: 17, destination: "Кенія - Африканська сафарі", description: "Сафарі та дика природа", region: "africa", emoji: "🦁", price: 1678, days: 9, hotel: "4 зірки", flights: "Включені", featured: true },
    { id: 18, destination: "Єгипет - Край фараонів", description: "Піраміди та Нільський круїз", region: "africa", emoji: "🏛️", price: 1345, days: 10, hotel: "4 зірки", flights: "Включені", featured: false },
    { id: 19, destination: "Південна Африка - континент чудес", description: "Кейптаун та крас Боствани", region: "africa", emoji: "🦒", price: 2134, days: 10, hotel: "4 зірки", flights: "Включені", featured: false },
    { id: 20, destination: "Марокко - Чарівна Африка", description: "Марракеш, Фес та Касабланка", region: "africa", emoji: "🕌", price: 989, days: 7, hotel: "3 зірки", flights: "Включені", featured: false },
    { id: 21, destination: "Танзанія - Гоора Килімаджаро", description: "Сервенгеті та гора Кіліманджаро", region: "africa", emoji: "⛰️", price: 1789, days: 9, hotel: "3 зірки", flights: "Включені", featured: false },
    { id: 22, destination: "Ботсвана - Дельта Окаванго", description: "Внутрішня дельта та водоспади", region: "africa", emoji: "💧", price: 2345, days: 8, hotel: "4 зірки", flights: "Включені", featured: false },

    // AMERICAS
    { id: 23, destination: "США - країна вільності", description: "Нью-Йорк, Лас-Вегас та Лос-Анджелес", region: "americas", emoji: "🗽", price: 1923, days: 10, hotel: "4 зірки", flights: "Включені", featured: false },
    { id: 24, destination: "Канада - гірські озера", description: "Ванкувер, Калгарі та гір красиві озера", region: "americas", emoji: "🏔️", price: 2156, days: 9, hotel: "4 зірки", flights: "Включені", featured: true },
    { id: 25, destination: "Бразилія - карнавали та джунглі", description: "Ріо, Сан-Паулу та Амазонка", region: "americas", emoji: "🎉", price: 1567, days: 9, hotel: "4 зірки", flights: "Включені", featured: false },
    { id: 26, destination: "Мексика - спадщина ацтеків", description: "Мехіко, Канкун та Плая-дель-Кармен", region: "americas", emoji: "🌮", price: 1234, days: 8, hotel: "4 зірки", flights: "Включені", featured: false },
    { id: 27, destination: "Перу - земля інків", description: "Ліма, Мачу-Пікчу та озеро Тітікака", region: "americas", emoji: "⛰️", price: 1456, days: 10, hotel: "3 зірки", flights: "Включені", featured: false },
    { id: 28, destination: "Аргентина - край танго", description: "Буенос-Айрес та аргентинські равини", region: "americas", emoji: "💃", price: 1678, days: 8, hotel: "4 зірки", flights: "Включені", featured: false },
    { id: 29, destination: "Колумбія - південноамериканська перлина", description: "Богота, Медельін та Картахена", region: "americas", emoji: "☕", price: 923, days: 7, hotel: "3 зірки", flights: "Включені", featured: false },

    // OCEANIA
    { id: 30, destination: "Австралія - Великий бар'єрний риф", description: "Сідней, Мельбурн та риф", region: "oceania", emoji: "🐨", price: 2890, days: 10, hotel: "4 зірки", flights: "Включені", featured: true },
    { id: 31, destination: "Нова Зеландія - край пригод", description: "Окленд, Веллінгтон та Квінстаун", region: "oceania", emoji: "🏔️", price: 2567, days: 9, hotel: "4 зірки", flights: "Включені", featured: false },
    { id: 32, destination: "Фіджі - тропічний рай", description: "Острови Фіджі та коралові рифи", region: "oceania", emoji: "🏝️", price: 1890, days: 7, hotel: "4 зірки", flights: "Включені", featured: false },
    { id: 33, destination: "Самоа - острівний рай", description: "Апіа та дикі пляжі", region: "oceania", emoji: "🌴", price: 1456, days: 6, hotel: "3 зірки", flights: "Включені", featured: false },
    { id: 34, destination: "Вануату - Південні моря", description: "Порт-Вілла та острови Вануату", region: "oceania", emoji: "🌊", price: 1234, days: 6, hotel: "3 зірки", flights: "Включені", featured: false },
];

// ==================== INITIALIZATION ====================

let currentTrips = [...ALL_TRIPS];
let selectedCurrency = 'USD';

function initializeTripsPage() {
    // Setup modal handlers
    setupModalHandlers();
    
    displayTrips(currentTrips);
    setupFilters();
    setupSearch();
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
            showNotification('✅ Ви успішно увійшли!');
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
            showNotification('✅ Реєстрація успішна! Ласкаво просимо!');
        };
    }

    // User profile menu handlers
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('user');
            setCookie('rememberMe', '', -1);
            updateAuthUI();
            showNotification('👋 Ви вийшли з аккаунту');
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

// ==================== DISPLAY TRIPS ====================

function displayTrips(trips) {
    const tripsGrid = document.getElementById('tripsGrid');
    
    if (trips.length === 0) {
        tripsGrid.innerHTML = `
            <div class="no-results">
                <h3>😞 Немає результатів</h3>
                <p>На жаль, ми не знайшли поїздок, які б відповідали вашим критеріям.</p>
            </div>
        `;
        return;
    }

    let html = '';
    trips.forEach(trip => {
        const prices = getPriceInAllCurrencies(trip.price);
        const badgeClass = trip.featured ? ' featured' : '';
        const badgeText = trip.featured ? '⭐ Топ' : '';
        
        html += `
            <div class="trip-card">
                <div class="trip-image">
                    ${trip.emoji}
                    ${trip.featured ? `<div class="trip-badge featured">${badgeText}</div>` : ''}
                </div>
                <div class="trip-content">
                    <div class="trip-region">${getRegionName(trip.region)}</div>
                    <h3 class="trip-title">${trip.destination}</h3>
                    <p class="trip-description">${trip.description}</p>
                    
                    <div class="trip-details-grid">
                        <div class="trip-detail">
                            <span>📅</span>
                            <span>${trip.days} днів</span>
                        </div>
                        <div class="trip-detail">
                            <span>🏨</span>
                            <span>${trip.hotel}</span>
                        </div>
                        <div class="trip-detail">
                            <span>✈️</span>
                            <span>${trip.flights}</span>
                        </div>
                    </div>

                    <div class="trip-price-section">
                        <div class="trip-price-display" id="price-${trip.id}">
                            ${prices.USD}
                        </div>
                        <div class="trip-price-currencies">
                            <button class="trip-price-btn active" onclick="changeCurrency('${trip.id}', 'USD')">USD</button>
                            <button class="trip-price-btn" onclick="changeCurrency('${trip.id}', 'EUR')">EUR</button>
                            <button class="trip-price-btn" onclick="changeCurrency('${trip.id}', 'UAH')">UAH</button>
                            <button class="trip-price-btn" onclick="changeCurrency('${trip.id}', 'PLN')">PLN</button>
                        </div>
                        <div class="trip-action-buttons">
                            <button class="trip-btn trip-btn-primary" onclick="bookTrip(${trip.id}, '${trip.destination}', ${trip.price})">🎫 Забронювати</button>
                            <button class="trip-btn trip-btn-secondary" onclick="viewTripDetails(${trip.id})">ℹ️ Деталі</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    tripsGrid.innerHTML = html;
}

function changeCurrency(tripId, currency) {
    const trip = ALL_TRIPS.find(t => t.id == tripId);
    if (!trip) return;

    const prices = getPriceInAllCurrencies(trip.price);
    const priceElement = document.getElementById(`price-${tripId}`);
    if (priceElement) {
        priceElement.textContent = prices[currency];
    }

    // Update active button
    const buttons = document.querySelectorAll(`[onclick*="changeCurrency('${tripId}'"]`);
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function getRegionName(region) {
    const regionNames = {
        'asia': '🌏 Азія',
        'europe': '🇪🇺 Європа',
        'africa': '🌍 Африка',
        'americas': '🌎 Америка',
        'oceania': '🏝️ Океанія'
    };
    return regionNames[region] || region;
}

// ==================== FILTERING & SEARCH ====================

function setupFilters() {
    document.getElementById('priceFilter').addEventListener('change', applyFilters);
    document.getElementById('durationFilter').addEventListener('change', applyFilters);
    document.getElementById('regionFilter').addEventListener('change', applyFilters);
}

function setupSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.getElementById('searchInput');
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    
    currentTrips = ALL_TRIPS.filter(trip => 
        trip.destination.toLowerCase().includes(query) ||
        trip.description.toLowerCase().includes(query)
    );
    
    displayTrips(currentTrips);
}

function applyFilters() {
    const priceFilter = document.getElementById('priceFilter').value;
    const durationFilter = document.getElementById('durationFilter').value;
    const regionFilter = document.getElementById('regionFilter').value;

    currentTrips = ALL_TRIPS.filter(trip => {
        // Price filter
        if (priceFilter) {
            if (priceFilter === 'budget' && trip.price >= 1000) return false;
            if (priceFilter === 'midrange' && (trip.price < 1000 || trip.price > 3000)) return false;
            if (priceFilter === 'luxury' && trip.price <= 3000) return false;
        }

        // Duration filter
        if (durationFilter) {
            if (durationFilter === 'short' && trip.days > 3) return false;
            if (durationFilter === 'medium' && (trip.days < 4 || trip.days > 7)) return false;
            if (durationFilter === 'long' && trip.days < 8) return false;
        }

        // Region filter
        if (regionFilter && trip.region !== regionFilter) return false;

        return true;
    });

    displayTrips(currentTrips);
}

// ==================== BOOKING ====================

function bookTrip(tripId, destination, price) {
    const user = localStorage.getItem('user');
    if (!user) {
        showNotification('⚠️ Будь ласка, увійдіть в аккаунт для бронювання');
        setTimeout(() => {
            const loginModal = document.getElementById('loginModal');
            if (loginModal) loginModal.classList.add('active');
        }, 1000);
        return;
    }

    const userData = JSON.parse(user);
    const trip = ALL_TRIPS.find(t => t.id == tripId);

    const bookingData = {
        destination: trip.destination,
        price: convertPrice(trip.price, 'USD'),
        description: trip.description,
        tripDays: `📅 ${trip.days} днів`,
        tripStars: `🏨 ${trip.hotel}`,
        included: trip.flights,
        userEmail: userData.email
    };

    const savedBooking = saveBooking(bookingData);

    if (savedBooking) {
        const prices = getPriceInAllCurrencies(trip.price);
        showNotification(`
✅ Бронювання успішно збережено!

📍 ${trip.destination}
💵 Ціна: ${prices.USD}
🌍 Регіон: ${getRegionName(trip.region)}
📅 Тривалість: ${trip.days} днів

Скоро наш менеджер зв'яжеться з вами!
        `);
    } else {
        showNotification(`⚠️ Ви вже забронювали цей тур!\n${trip.destination}`);
    }
}

function viewTripDetails(tripId) {
    const trip = ALL_TRIPS.find(t => t.id == tripId);
    if (!trip) return;

    const prices = getPriceInAllCurrencies(trip.price);

    const details = `
🌍 ${trip.destination}

📍 Регіон: ${getRegionName(trip.region)}
📝 ${trip.description}

📊 Деталі поїздки:
  📅 Тривалість: ${trip.days} днів
  🏨 Проживання: ${trip.hotel}
  ✈️ ${trip.flights}

💰 Ціни у різних валютах:
  USD: ${prices.USD}
  EUR: ${prices.EUR}
  UAH: ${prices.UAH}
  PLN: ${prices.PLN}

🎫 Натисніть "Забронювати" для оформлення поїздки
    `;

    showNotification(details);
}

// ==================== ON PAGE LOAD ====================

window.addEventListener('load', () => {
    initializeTripsPage();
});
