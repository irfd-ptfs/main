const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// --- Airline Registration Form Validation ---
const airlineForm = document.getElementById('airline-form');
const airlineFormMsg = document.getElementById('airline-form-message');
let registeredAirlines = [
    { name: "SwissAir", code: "SWA", country: "CH" },
];

airlineForm.addEventListener('submit', function(e) {
    e.preventDefault();
    airlineFormMsg.textContent = '';
    airlineFormMsg.style.color = "#d9534f";

    const name = airlineForm['airline-name'].value.trim();
    const code = airlineForm['airline-code'].value.trim().toUpperCase();
    const country = airlineForm['country'].value.trim();

    if (!name || !code || !country) {
        airlineFormMsg.textContent = "All fields are required.";
        return;
    }
    if (!/^[A-Z]{3}$/.test(code)) {
        airlineFormMsg.textContent = "Airline code must be exactly 3 uppercase letters.";
        return;
    }
    if (registeredAirlines.some(a => a.code === code)) {
        airlineFormMsg.textContent = "Airline code is already registered.";
        return;
    }
    // Add to airlines array
    registeredAirlines.push({ name, code, country });
    airlineFormMsg.textContent = "Airline registered successfully!";
    airlineFormMsg.style.color = "#28a745";
    airlineForm.reset();
    populateAirlineDropdown();
});

// --- Book Flight Form Validation ---
const flightForm = document.getElementById('flight-form');
const flightFormMsg = document.getElementById('flight-form-message');
const airlineSelect = document.getElementById('airline-select');

flightForm.addEventListener('submit', function(e) {
    e.preventDefault();
    flightFormMsg.textContent = '';
    flightFormMsg.style.color = "#d9534f";

    const passengerName = flightForm['passenger-name'].value.trim();
    const airline = flightForm['airline'].value;
    const departureDate = flightForm['departure-date'].value;
    const from = flightForm['departure-city'].value.trim();
    const to = flightForm['arrival-city'].value.trim();

    if (!passengerName || !airline || !departureDate || !from || !to) {
        flightFormMsg.textContent = "Please fill in all fields.";
        return;
    }
    const today = new Date().toISOString().split('T')[0];
    if (departureDate < today) {
        flightFormMsg.textContent = "Departure date cannot be in the past.";
        return;
    }
    if (from.toLowerCase() === to.toLowerCase()) {
        flightFormMsg.textContent = "Departure and arrival cities must be different.";
        return;
    }
    flightFormMsg.textContent = "Flight booked successfully!";
    flightFormMsg.style.color = "#28a745";
    flightForm.reset();
});

// --- Populate Airline Dropdown Dynamically ---
function populateAirlineDropdown() {
    airlineSelect.innerHTML = '<option value="">Select an airline</option>';
    registeredAirlines.forEach(airline => {
        const opt = document.createElement('option');
        opt.value = airline.code;
        opt.textContent = `${airline.name} (${airline.code})`;
        airlineSelect.appendChild(opt);
    });
}
populateAirlineDropdown();

// --- Reviews Carousel Logic ---
const reviews = [
    {
        user: "sudo",
        rating: 5,
        text: "peak airport, very realistic."
    },
    {
        user: "SwissAir.Ptfs",
        rating: 4,
        text: "Very nice as a hub."
    },

];
const carouselTrack = document.getElementById('carousel-track');
let currentReview = 0;

function renderReview(index) {
    carouselTrack.innerHTML = '';
    const r = reviews[index];
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
        <div class="review-user">${r.user}</div>
        <div class="review-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        <div class="review-text">${r.text}</div>
    `;
    carouselTrack.appendChild(card);
}

function showNextReview() {
    currentReview = (currentReview + 1) % reviews.length;
    renderReview(currentReview);
}
function showPrevReview() {
    currentReview = (currentReview - 1 + reviews.length) % reviews.length;
    renderReview(currentReview);
}
document.getElementById('carousel-next').addEventListener('click', showNextReview);
document.getElementById('carousel-prev').addEventListener('click', showPrevReview);

.glass-card {
  background: rgba(255,255,255,0.16);
  box-shadow: 0 8px 32px 0 rgba(31,38,135,0.17);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.22);
}

// Auto-rotate every 6s
setInterval(showNextReview, 6000);
renderReview(currentReview);

// --- Animated Stats Counters ---
function animateCounter(id, target, duration = 1800) {
    const el = document.getElementById(id);
    let start = 0;
    const step = Math.ceil(target / (duration / 24));
    function update() {
        start += step;
        if (start >= target) {
            el.textContent = target.toLocaleString();
        } else {
            el.textContent = start.toLocaleString();
            requestAnimationFrame(update);
        }
    }
    update();
}
let statsAnimated = false;
function handleStatsAnim() {
    const statsSection = document.getElementById('stats');
    const rect = statsSection.getBoundingClientRect();
    if (!statsAnimated && rect.top < window.innerHeight - 100) {
        animateCounter('flights-counter', 1200);
        animateCounter('passengers-counter', 850000);
        animateCounter('airlines-counter', 65);
        statsAnimated = true;
    }
}
window.addEventListener('scroll', handleStatsAnim);
window.addEventListener('DOMContentLoaded', handleStatsAnim);

// --- Accessibility: Close menu on nav link click (mobile) ---
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 769) {
            navLinks.classList.remove('active');
        }
    });
});

// ...keep previous code...

// --- Section Fade-In on Scroll ---
const fadeSections = [
    ...document.querySelectorAll('section:not(.stats)')
];
function revealSectionsOnScroll() {
    fadeSections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            sec.classList.add('visible');
        }
    });
}
window.addEventListener('DOMContentLoaded', () => {
    fadeSections.forEach(sec => sec.classList.add('section-fade'));
    revealSectionsOnScroll();
});
window.addEventListener('scroll', revealSectionsOnScroll);

// --- Smooth Scroll for Navbar Links ---
document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (window.innerWidth < 769) {
            navLinks.classList.remove('active');
        }
    });
});

// --- Form Message Fade-In ---
function showFormMessage(element, msg, isSuccess) {
    element.textContent = msg;
    element.style.color = isSuccess ? "#28a745" : "#d9534f";
    element.classList.add('visible');
    setTimeout(() => {
        element.classList.remove('visible');
    }, 3000);
}
airlineForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = airlineForm['airline-name'].value.trim();
    const code = airlineForm['airline-code'].value.trim().toUpperCase();
    const country = airlineForm['country'].value.trim();

    if (!name || !code || !country) {
        showFormMessage(airlineFormMsg, "All fields are required.", false);
        return;
    }
    if (!/^[A-Z]{3}$/.test(code)) {
        showFormMessage(airlineFormMsg, "Airline code must be exactly 3 uppercase letters.", false);
        return;
    }
    if (registeredAirlines.some(a => a.code === code)) {
        showFormMessage(airlineFormMsg, "Airline code is already registered.", false);
        return;
    }
    registeredAirlines.push({ name, code, country });
    showFormMessage(airlineFormMsg, "Airline registered successfully!", true);
    airlineForm.reset();
    populateAirlineDropdown();
});
flightForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const passengerName = flightForm['passenger-name'].value.trim();
    const airline = flightForm['airline'].value;
    const departureDate = flightForm['departure-date'].value;
    const from = flightForm['departure-city'].value.trim();
    const to = flightForm['arrival-city'].value.trim();

    if (!passengerName || !airline || !departureDate || !from || !to) {
        showFormMessage(flightFormMsg, "Please fill in all fields.", false);
        return;
    }
    const today = new Date().toISOString().split('T')[0];
    if (departureDate < today) {
        showFormMessage(flightFormMsg, "Departure date cannot be in the past.", false);
        return;
    }
    if (from.toLowerCase() === to.toLowerCase()) {
        showFormMessage(flightFormMsg, "Departure and arrival cities must be different.", false);
        return;
    }
    showFormMessage(flightFormMsg, "Flight booked successfully!", true);
    flightForm.reset();
});

// --- Carousel: Smooth Sliding (Optional Enhancement) ---
let isAnimating = false;
function renderReview(index, direction = 0) {
    if (isAnimating) return;
    isAnimating = true;
    const oldCard = carouselTrack.firstChild;
    const r = reviews[index];
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
        <div class="review-user">${r.user}</div>
        <div class="review-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        <div class="review-text">${r.text}</div>
    `;
    if (oldCard) {
        card.style.position = "absolute";
        card.style.left = direction > 0 ? "100%" : "-100%";
        carouselTrack.appendChild(card);
        setTimeout(() => {
            oldCard.style.transform = `translateX(${direction > 0 ? "-100%" : "100%"})`;
            card.style.transform = `translateX(${direction > 0 ? "-100%" : "100%"})`;
            card.style.left = "0";
            card.style.position = "";
            setTimeout(() => {
                carouselTrack.removeChild(oldCard);
                card.style.transform = "";
                isAnimating = false;
            }, 400);
        }, 10);
    } else {
        carouselTrack.appendChild(card);
        isAnimating = false;
    }
}
function showNextReview() {
    currentReview = (currentReview + 1) % reviews.length;
    renderReview(currentReview, 1);
}
function showPrevReview() {
    currentReview = (currentReview - 1 + reviews.length) % reviews.length;
    renderReview(currentReview, -1);
}
document.getElementById('carousel-next').addEventListener('click', showNextReview);
document.getElementById('carousel-prev').addEventListener('click', showPrevReview);
setInterval(showNextReview, 6000);
renderReview(currentReview);

// --- Animate Stats Only Once When In View ---
let statsAnimated = false;
function handleStatsAnim() {
    const statsSection = document.getElementById('stats');
    const rect = statsSection.getBoundingClientRect();
    if (!statsAnimated && rect.top < window.innerHeight - 100) {
        animateCounter('flights-counter', 1200);
        animateCounter('passengers-counter', 850000);
        animateCounter('airlines-counter', 65);
        statsAnimated = true;
    }
}
window.addEventListener('scroll', handleStatsAnim);
window.addEventListener('DOMContentLoaded', handleStatsAnim);

// --- Airline Registration Form Validation ---
const airlineForm = document.getElementById('airline-form');
const airlineFormMsg = document.getElementById('airline-form-message');
const airlinesAdminTable = document.getElementById('airlines-admin-table');
let registeredAirlines = [
    { name: "SkyPort Airways", code: "SKY", country: "USA", approved: true },
    { name: "GlobalJet", code: "GJT", country: "UK", approved: true },
    { name: "Pacific Blue", code: "PCB", country: "Australia", approved: false },
    { name: "EuroWings", code: "EWG", country: "Germany", approved: false }
];

// Email preparation function
function openEmailClient(airline) {
    const subject = encodeURIComponent("New Airline Registration");
    const body = encodeURIComponent(
        `A new airline has registered:\n\n` +
        `Airline Name: ${airline.name}\n` +
        `Airline Code: ${airline.code}\n` +
        `Country: ${airline.country}\n\n` +
        `Please review and approve/reject.`
    );
    window.location.href = `mailto:irfd.ptfs@gmail.com?subject=${subject}&body=${body}`;
}

airlineForm.addEventListener('submit', function(e) {
    e.preventDefault();
    airlineFormMsg.textContent = '';
    airlineFormMsg.style.color = "#d9534f";

    const name = airlineForm['airline-name'].value.trim();
    const code = airlineForm['airline-code'].value.trim().toUpperCase();
    const country = airlineForm['country'].value.trim();

    if (!name || !code || !country) {
        showFormMessage(airlineFormMsg, "All fields are required.", false);
        return;
    }
    if (!/^[A-Z]{3}$/.test(code)) {
        showFormMessage(airlineFormMsg, "Airline code must be exactly 3 uppercase letters.", false);
        return;
    }
    if (registeredAirlines.some(a => a.code === code)) {
        showFormMessage(airlineFormMsg, "Airline code is already registered.", false);
        return;
    }
    // Add to airlines array, default approved: false
    const newAirline = { name, code, country, approved: false };
    registeredAirlines.push(newAirline);
    showFormMessage(airlineFormMsg, "Airline registered! Please send the email to complete registration.", true);
    airlineForm.reset();
    populateAirlineDropdown();
    renderAirlinesAdminTable();
    // Open email client for user to send info
    setTimeout(() => {
        openEmailClient(newAirline);
    }, 1200);
});

// --- Approve/Reject Airlines Admin Table ---
function renderAirlinesAdminTable() {
    if (!airlinesAdminTable) return;
    airlinesAdminTable.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Country</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>
    `;
    registeredAirlines.forEach((airline, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${airline.name}</td>
            <td>${airline.code}</td>
            <td>${airline.country}</td>
            <td>
                <span class="${airline.approved ? 'approved' : 'not-approved'}">
                    ${airline.approved ? 'Approved' : 'Not Approved'}
                </span>
            </td>
            <td>
                <button class="approve-btn" data-idx="${idx}" ${airline.approved ? 'disabled' : ''}>Approve</button>
                <button class="reject-btn" data-idx="${idx}" ${!airline.approved ? 'disabled' : ''}>Reject</button>
            </td>
        `;
        airlinesAdminTable.appendChild(row);
    });
    // Add event listeners for approve/reject
    airlinesAdminTable.querySelectorAll('.approve-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = +btn.getAttribute('data-idx');
            registeredAirlines[index].approved = true;
            renderAirlinesAdminTable();
            populateAirlineDropdown();
        });
    });
    airlinesAdminTable.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = +btn.getAttribute('data-idx');
            registeredAirlines[index].approved = false;
            renderAirlinesAdminTable();
            populateAirlineDropdown();
        });
    });
}

// --- Dropdown only shows approved airlines ---
function populateAirlineDropdown() {
    airlineSelect.innerHTML = '<option value="">Select an airline</option>';
    registeredAirlines
        .filter(airline => airline.approved)
        .forEach(airline => {
        const opt = document.createElement('option');
        opt.value = airline.code;
        opt.textContent = `${airline.name} (${airline.code})`;
        airlineSelect.appendChild(opt);
    });
}
populateAirlineDropdown();
renderAirlinesAdminTable();
