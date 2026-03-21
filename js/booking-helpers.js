// Booking Management Utilities
// This file provides helper functions for managing travel bookings using localStorage and Cookies

/**
 * BOOKING DATA STRUCTURE:
 * {
 *   id: timestamp,
 *   destination: "Travel destination name",
 *   priceUSD: 1879,
 *   priceDisplay: "1,879 USD",
 *   description: "Brief description of the trip",
 *   tripDays: "Number of days",
 *   tripStars: "Hotel rating",
 *   included: "What's included (e.g., Flights)",
 *   bookingDate: "ISO date string",
 *   startDate: "Trip start date (ISO)",
 *   endDate: "Trip end date (ISO)",
 *   status: "active|finished|cancelled|past",
 *   userEmail: "user email address",
 *   cancelledDate: "ISO date string (if cancelled)",
 *   finishedDate: "ISO date string (if finished)",
 *   refundAmount: 1409.25,
 *   rating: 5,
 *   review: "Great trip!",
 *   notes: "Cancellation reason"
 * }
 * 
 * CURRENCY CONVERSION:
 * - USD: Base currency (1.0 rate)
 * - EUR: 0.92 USD
 * - UAH: 41.5 USD (Ukrainian Hryvnia)
 * - PLN: 4.05 USD (Polish Zloty)
 * 
 * REFUND POLICY:
 * - 30+ days before trip: 90% refund
 * - 14-30 days before trip: 75% refund
 * - 7-14 days before trip: 50% refund
 * - Less than 7 days: 25% refund
 * - Trip already started: 0% refund
 */

// ==================== EXPORT BOOKINGS ====================

/**
 * Export bookings to CSV format
 */
function exportBookingsToCSV() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    
    let bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    bookings = bookings.filter(b => b.userEmail === user.email);
    
    if (bookings.length === 0) {
        alert('Немає бронювань для експорту');
        return;
    }
    
    let csv = 'Призначення,Ціна,Опис,Дні,Готель,Включено,Дата бронювання,Статус\n';
    
    bookings.forEach(booking => {
        const row = [
            booking.destination,
            booking.price,
            `"${booking.description}"`,
            booking.tripDays,
            booking.tripStars,
            booking.included,
            new Date(booking.bookingDate).toLocaleDateString('uk-UA'),
            booking.status
        ].join(',');
        
        csv += row + '\n';
    });
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `bookings_${new Date().getTime()}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/**
 * Export bookings to JSON format
 */
function exportBookingsToJSON() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    
    let bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    bookings = bookings.filter(b => b.userEmail === user.email);
    
    if (bookings.length === 0) {
        alert('Немає бронювань для експорту');
        return;
    }
    
    const dataStr = JSON.stringify(bookings, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(dataStr));
    element.setAttribute('download', `bookings_${new Date().getTime()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// ==================== BOOKINGS STATISTICS ====================

/**
 * Get booking statistics
 */
function getBookingStatistics() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return null;
    
    let bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    bookings = bookings.filter(b => b.userEmail === user.email);
    
    const stats = {
        total: bookings.length,
        active: bookings.filter(b => b.status === 'active').length,
        past: bookings.filter(b => b.status === 'past').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
        destinations: [...new Set(bookings.map(b => b.destination))].length
    };
    
    return stats;
}

/**
 * Get total spent on bookings
 */
function getTotalSpent() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return 0;
    
    let bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    bookings = bookings.filter(b => b.userEmail === user.email && b.status === 'active');
    
    let total = 0;
    bookings.forEach(booking => {
        // Extract number from price string (e.g., "1,879 USD" -> 1879)
        const priceMatch = booking.price.match(/[\d,]+/);
        if (priceMatch) {
            const priceStr = priceMatch[0].replace(/,/g, '');
            total += parseFloat(priceStr);
        }
    });
    
    return total;
}

// ==================== BOOKING SEARCH & FILTER ====================

/**
 * Search bookings by destination
 */
function searchBookingsByDestination(query) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return [];
    
    let bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    bookings = bookings.filter(b => b.userEmail === user.email);
    
    return bookings.filter(b => 
        b.destination.toLowerCase().includes(query.toLowerCase())
    );
}

/**
 * Get bookings by date range
 */
function getBookingsByDateRange(startDate, endDate) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return [];
    
    let bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    bookings = bookings.filter(b => b.userEmail === user.email);
    
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    return bookings.filter(b => {
        const bookDate = new Date(b.bookingDate).getTime();
        return bookDate >= start && bookDate <= end;
    });
}

/**
 * Get most frequently booked destination
 */
function getMostBookedDestination() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return null;
    
    let bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    bookings = bookings.filter(b => b.userEmail === user.email);
    
    if (bookings.length === 0) return null;
    
    const destinationCount = {};
    bookings.forEach(b => {
        destinationCount[b.destination] = (destinationCount[b.destination] || 0) + 1;
    });
    
    let maxDest = null;
    let maxCount = 0;
    for (const [dest, count] of Object.entries(destinationCount)) {
        if (count > maxCount) {
            maxCount = count;
            maxDest = dest;
        }
    }
    
    return maxDest;
}

// ==================== BOOKING NOTIFICATIONS ====================

/**
 * Send booking confirmation email (simulated)
 */
function sendBookingConfirmation(bookingId) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return false;
    
    let bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const booking = bookings.find(b => b.id == bookingId && b.userEmail === user.email);
    
    if (booking) {
        // In a real app, this would send to a backend
        console.log(`📧 Confirmation email sent to ${user.email}:`, booking);
        
        // Store in cookies that this booking was confirmed
        const confirmed = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
        confirmed.push(bookingId);
        localStorage.setItem('confirmedBookings', JSON.stringify(confirmed));
        
        return true;
    }
    
    return false;
}

// ==================== DISPLAY HELPERS ====================

/**
 * Format booking data for display
 */
function formatBookingForDisplay(booking) {
    return {
        ...booking,
        formattedDate: new Date(booking.bookingDate).toLocaleDateString('uk-UA'),
        formattedTime: new Date(booking.bookingDate).toLocaleTimeString('uk-UA')
    };
}

/**
 * Get booking badge color based on status
 */
function getStatusBadgeColor(status) {
    switch(status) {
        case 'active':
            return '#d4edda'; // Light green
        case 'past':
            return '#e2e3e5'; // Light gray
        case 'cancelled':
            return '#f8d7da'; // Light red
        default:
            return '#e7e7e7';
    }
}

// ==================== USAGE EXAMPLES ====================

/**
 * Example: Display user booking summary
 */
function displayBookingSummary() {
    const stats = getBookingStatistics();
    const totalSpent = getTotalSpent();
    const mostBooked = getMostBookedDestination();
    
    if (stats) {
        console.log('📊 Booking Summary:');
        console.log(`Total Bookings: ${stats.total}`);
        console.log(`Active: ${stats.active}, Past: ${stats.past}, Cancelled: ${stats.cancelled}`);
        console.log(`Unique Destinations: ${stats.destinations}`);
        console.log(`Total Spent: ${totalSpent}`);
        console.log(`Most Booked: ${mostBooked}`);
    }
}

/**
 * Example: Clear old bookings (older than 1 year)
 */
function clearOldBookings() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    
    let bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const filtered = bookings.filter(b => {
        const bookDate = new Date(b.bookingDate);
        return bookDate > oneYearAgo || b.status === 'active';
    });
    
    localStorage.setItem('userBookings', JSON.stringify(filtered));
    console.log(`Cleared ${bookings.length - filtered.length} old bookings`);
}

// ==================== CURRENCY CONVERSION STATS ====================

/**
 * Get total spent in different currencies
 */
function getTotalSpentInCurrencies() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return null;
    
    let bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    bookings = bookings.filter(b => b.userEmail === user.email && b.status === 'active');
    
    let totalUSD = 0;
    bookings.forEach(booking => {
        totalUSD += booking.priceUSD || extractPriceNumber(booking.priceDisplay || booking.price);
    });
    
    return {
        USD: convertPrice(totalUSD, 'USD'),
        EUR: convertPrice(totalUSD, 'EUR'),
        UAH: convertPrice(totalUSD, 'UAH'),
        PLN: convertPrice(totalUSD, 'PLN'),
        totalUSD: totalUSD
    };
}

/**
 * Get currency exchange rates
 */
function getExchangeRates() {
    return {
        USD: 1.0,
        EUR: 0.92,
        UAH: 41.5,
        PLN: 4.05,
        symbols: {
            USD: '$',
            EUR: '€',
            UAH: '₴',
            PLN: 'zł'
        }
    };
}

// ==================== REFUND MANAGEMENT ====================

/**
 * Calculate refund amount based on cancellation date
 */
function calculateRefundPercentage(tripStartDate) {
    const today = new Date();
    const startDate = new Date(tripStartDate);
    const daysUntilTrip = Math.floor((startDate - today) / (1000 * 60 * 60 * 24));
    
    // Refund policy based on cancellation timing
    if (daysUntilTrip > 30) {
        return 90; // 90% refund if cancelled 30+ days before
    } else if (daysUntilTrip > 14) {
        return 75; // 75% refund if cancelled 14-30 days before
    } else if (daysUntilTrip > 7) {
        return 50; // 50% refund if cancelled 7-14 days before
    } else if (daysUntilTrip > 0) {
        return 25; // 25% refund if cancelled less than 7 days before
    } else {
        return 0; // No refund if trip already started
    }
}

/**
 * Get total refunded amount
 */
function getTotalRefunded() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return 0;
    
    let bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    bookings = bookings.filter(b => b.userEmail === user.email && b.status === 'cancelled');
    
    let totalRefunded = 0;
    bookings.forEach(b => {
        totalRefunded += b.refundAmount || 0;
    });
    
    return totalRefunded;
}

/**
 * Get refund statistics
 */
function getRefundStatistics() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return null;
    
    let bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    bookings = bookings.filter(b => b.userEmail === user.email && b.status === 'cancelled');
    
    const totalRefunded = getTotalRefunded();
    
    return {
        cancelledCount: bookings.length,
        totalRefunded: totalRefunded,
        totalRefundedFormatted: convertPrice(totalRefunded, 'USD'),
        averageRefund: bookings.length > 0 ? totalRefunded / bookings.length : 0,
        averageRefundPercentage: bookings.length > 0 
            ? Math.round(bookings.reduce((sum, b) => sum + (b.refundAmount || 0), 0) / bookings.length / 
                         (bookings.reduce((sum, b) => sum + (b.priceUSD || 0), 0) / bookings.length) * 100)
            : 0
    };
}
