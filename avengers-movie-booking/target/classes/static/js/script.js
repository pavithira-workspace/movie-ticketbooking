(() => {
    "use strict";

    const api = "/api";
    const posterArt = {
        endgame: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg",
        "infinity-war": "https://upload.wikimedia.org/wikipedia/en/4/4d/Avengers_Infinity_War_poster.jpg",
        "the-avengers": "https://upload.wikimedia.org/wikipedia/en/8/8a/The_Avengers_%282012_film%29_poster.jpg",
        "age-of-ultron": "https://upload.wikimedia.org/wikipedia/en/f/ff/Avengers_Age_of_Ultron_poster.jpg",
        "iron-man": "https://upload.wikimedia.org/wikipedia/en/0/02/Iron_Man_%282008_film%29_poster.jpg",
        "civil-war": "https://upload.wikimedia.org/wikipedia/en/5/53/Captain_America_Civil_War_poster.jpg",
        rrr: "https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg",
        baahubali: "https://upload.wikimedia.org/wikipedia/en/5/5f/Baahubali_The_Beginning_poster.jpg",
        jawan: "https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg",
        "kgf-chapter-2": "https://upload.wikimedia.org/wikipedia/en/d/d0/K.G.F_Chapter_2.jpg",
        "kalki-2898-ad": "https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD.jpg",
        pushpa: "https://upload.wikimedia.org/wikipedia/en/7/75/Pushpa_-_The_Rise_%282021_film%29.jpg"
    };
    const releaseYears = {
        endgame: 2019,
        "infinity-war": 2018,
        "the-avengers": 2012,
        "age-of-ultron": 2015,
        "iron-man": 2008,
        "civil-war": 2016,
        rrr: 2022,
        baahubali: 2015,
        jawan: 2023,
        "kgf-chapter-2": 2022,
        "kalki-2898-ad": 2024,
        pushpa: 2021
    };
    const featuredIds = ["endgame", "infinity-war", "rrr", "kalki-2898-ad"];
    const trailerIds = {
        endgame: "TcMBFSGVi1c",
        "infinity-war": "6ZfuNTqbHE8",
        "the-avengers": "eOrNdBpGMv8",
        "age-of-ultron": "tmeOjFno6Do",
        "iron-man": "8hYlB38asDY",
        "civil-war": "dKrVegVI0Us",
        rrr: "NgBoMJy386M",
        baahubali: "sOEg_YZQsTI",
        jawan: "COv52Qyctws",
        "kgf-chapter-2": "JKa05nyUmuQ",
        "kalki-2898-ad": "BfC9guY4A8s",
        pushpa: "Q1NKMPhP8PY"
    };
    const theatres = [
        "PVR ICON · Phoenix Palladium · Mumbai",
        "INOX Megaplex · Malad · Mumbai",
        "PVR IMAX · Koramangala · Bengaluru",
        "Cinepolis IMAX · Forum Mall · Hyderabad",
        "PVR Luxe · VR Chennai · Chennai",
        "INOX Insignia · South City · Kolkata",
        "PVR Superplex · Select Citywalk · New Delhi",
        "Cinepolis · Lulu Mall · Kochi"
    ];
    const showTimes = ["10:30 AM", "1:45 PM", "5:15 PM", "8:30 PM"];
    const state = {
        movies: [],
        movie: null,
        date: "",
        time: showTimes[1],
        seats: new Set(),
        bookedSeats: new Set(),
        category: "all",
        query: "",
        featuredMovies: [],
        activeSlide: 0,
        slideTimer: null,
        slideAnimationTimeout: null
    };

    const $ = (selector) => document.querySelector(selector);
    const movieGrid = $("#movieGrid");
    const bookingSection = $("#bookingSection");
    const toast = bootstrap.Toast.getOrCreateInstance($("#appToast"));
    const confirmationModal = bootstrap.Modal.getOrCreateInstance($("#confirmationModal"));
    const bookingsModal = bootstrap.Modal.getOrCreateInstance($("#bookingsModal"));
    const navigation = $(".site-nav");
    const navigationMenu = $("#mainNav");
    const navigationCollapse = bootstrap.Collapse.getOrCreateInstance(navigationMenu, { toggle: false });
    let closeMenuAfterOpening = false;
    const formatINR = (amount) => new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);

    function closeMobileNavigation() {
        if (!window.matchMedia("(max-width: 991.98px)").matches) return;
        if (navigationMenu.classList.contains("show")) navigationCollapse.hide();
        else if (navigationMenu.classList.contains("collapsing")) closeMenuAfterOpening = true;
    }

    function scrollToMovies(focusBookingButton = false) {
        if (window.location.hash !== "#movies") {
            window.history.replaceState(window.history.state, "", "#movies");
        }
        $("#movies").scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            block: "start"
        });
        if (focusBookingButton) {
            window.setTimeout(() => {
                movieGrid.querySelector(".book-button")?.focus({ preventScroll: true });
            }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 550);
        }
    }

    navigationMenu.addEventListener("shown.bs.collapse", () => {
        if (!closeMenuAfterOpening) return;
        closeMenuAfterOpening = false;
        navigationCollapse.hide();
    });

    function setActiveNavigation(sectionId) {
        navigation.querySelectorAll("[data-nav-section]").forEach((link) => {
            const active = link.dataset.navSection === sectionId;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
        const ticketsLink = $("#bookTicketsLink");
        const ticketsActive = sectionId === "bookingSection";
        ticketsLink.classList.toggle("active", ticketsActive);
        if (ticketsActive) ticketsLink.setAttribute("aria-current", "location");
        else ticketsLink.removeAttribute("aria-current");
    }

    navigation.addEventListener("click", (event) => {
        const link = event.target.closest("a[href^='#']");
        if (!link) return;
        closeMobileNavigation();
        if (link.id === "bookTicketsLink" || link.classList.contains("nav-cta")) {
            event.preventDefault();
            if (bookingSection.hidden) scrollToMovies(link.id === "bookTicketsLink");
            else bookingSection.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                block: "start"
            });
        } else {
            const sectionId = link.getAttribute("href").slice(1);
            if (sectionId === "home" || sectionId === "movies") setActiveNavigation(sectionId);
        }
    });

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, (character) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        })[character]);
    }

    function normalizeSearch(value) {
        return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("en-IN").replace(/[^a-z0-9]/g, "");
    }

    function showToast(message) {
        $("#toastMessage").textContent = message;
        toast.show();
    }

    async function request(url, options = {}) {
        const response = await fetch(url, {
            headers: { "Content-Type": "application/json", ...(options.headers || {}) },
            ...options
        });
        if (!response.ok) {
            let message = `Request failed (${response.status}).`;
            try {
                const body = await response.json();
                message = body.detail || body.message || body.error || message;
            } catch (error) {
                if (!(error instanceof SyntaxError)) throw error;
            }
            throw new Error(message);
        }
        return response.status === 204 ? null : response.json();
    }

    function renderHeroIndicators() {
        $("#heroIndicators").innerHTML = state.featuredMovies.map((movie, index) => `
            <button type="button" class="hero-indicator ${index === state.activeSlide ? "active" : ""}"
                    data-slide="${index}" aria-label="Show ${escapeHtml(movie.title)}"
                    aria-pressed="${index === state.activeSlide}">
                <img src="${escapeHtml(movie.poster)}" alt="" loading="lazy">
                <span>${String(index + 1).padStart(2, "0")}</span>
            </button>`).join("");
        $("#heroIndicators").querySelectorAll(".hero-indicator").forEach((button) => {
            button.addEventListener("click", () => showSlide(Number(button.dataset.slide)));
        });
    }

    function showSlide(index) {
        if (!state.featuredMovies.length) return;
        const slideIndex = (index + state.featuredMovies.length) % state.featuredMovies.length;
        const movie = state.featuredMovies[slideIndex];
        state.activeSlide = slideIndex;
        window.clearTimeout(state.slideAnimationTimeout);
        $("#heroCopy").classList.add("is-switching");
        $("#heroPosterCard").classList.add("is-switching");
        state.slideAnimationTimeout = window.setTimeout(() => {
            $("#heroBackdropImage").src = movie.poster;
            $("#heroPoster").src = movie.poster;
            $("#heroPoster").alt = `${movie.title} movie poster`;
            $("#heroTitle").textContent = movie.title;
            $("#heroDescription").textContent = movie.synopsis;
            $("#heroRating").textContent = Number(movie.rating).toFixed(1);
            $("#heroDuration").textContent = movie.duration;
            $("#heroYear").textContent = releaseYears[movie.id] || "Now showing";
            $("#heroCategory").textContent = movie.category === "indian" ? "INDIAN CINEMA" : "SUPERHERO SAGA";
            $("#heroPosterTitle").textContent = movie.title;
            $("#heroIndex").innerHTML = `${String(slideIndex + 1).padStart(2, "0")} <span>/</span> ${String(state.featuredMovies.length).padStart(2, "0")}`;
            renderHeroIndicators();
            $("#heroCopy").classList.remove("is-switching");
            $("#heroPosterCard").classList.remove("is-switching");
        }, 170);
    }

    function startHeroAutoplay() {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        window.clearInterval(state.slideTimer);
        state.slideTimer = window.setInterval(() => {
            if (document.visibilityState === "visible"
                    && !$("#home").matches(":hover")
                    && !$("#home").contains(document.activeElement)) {
                showSlide(state.activeSlide + 1);
            }
        }, 8000);
    }

    function renderMovies() {
        const filteredMovies = state.movies.filter((movie) => {
            const matchesCategory = state.category === "all" || movie.category === state.category;
            const searchText = normalizeSearch(`${movie.title} ${movie.genre}`);
            return matchesCategory && searchText.includes(normalizeSearch(state.query.trim()));
        });
        $("#movieCount").textContent = `${filteredMovies.length} ${filteredMovies.length === 1 ? "film" : "films"} to explore`;
        if (!filteredMovies.length) {
            movieGrid.innerHTML = `<div class="empty-movies"><i class="fa-solid fa-film"></i><strong>No films found</strong><span>Try another title or switch collections.</span><button class="clear-search" type="button" id="clearMovieSearch">CLEAR SEARCH</button></div>`;
            $("#clearMovieSearch").addEventListener("click", () => {
                state.query = "";
                state.category = "all";
                $("#movieSearch").value = "";
                updateMovieFilters();
                renderMovies();
                $("#movieSearch").focus();
            });
            return;
        }

        movieGrid.innerHTML = filteredMovies.map((movie, index) => `
            <article class="movie-card" style="--card-accent:${escapeHtml(movie.accent)};--card-index:${index}">
                <div class="movie-poster">
                    <img src="${escapeHtml(movie.poster)}" alt="" loading="lazy"
                         onerror="this.style.display='none';this.parentElement.classList.add('poster-fallback')">
                    <div class="poster-vignette"></div>
                    <span class="rating-chip"><i class="fa-solid fa-star"></i> ${Number(movie.rating).toFixed(1)}</span>
                    <span class="collection-tag">${movie.category === "indian" ? "INDIAN CINEMA" : "SUPERHERO SAGA"}</span>
                    <span class="poster-index">${String(index + 1).padStart(2, "0")}</span>
                    <span class="poster-title">${escapeHtml(movie.title)}</span>
                </div>
                <div class="movie-details">
                    <div class="movie-meta">${escapeHtml(movie.genre)} <span>·</span> ${releaseYears[movie.id] || ""} <span>·</span> ${escapeHtml(movie.duration)}</div>
                    <div class="movie-card-bottom"><span class="movie-price">${formatINR(movie.price)}<small> / seat</small></span>
                        <button class="book-button" type="button" data-movie-id="${escapeHtml(movie.id)}">BOOK NOW <i class="fa-solid fa-arrow-right"></i></button></div>
                </div>
            </article>`).join("");
        movieGrid.querySelectorAll(".book-button").forEach((button) => {
            button.addEventListener("click", () => openBooking(button.dataset.movieId));
        });
    }

    function updateMovieFilters() {
        document.querySelectorAll(".filter-chip").forEach((button) => {
            const active = button.dataset.filter === state.category;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }

    async function loadMovies() {
        try {
            state.movies = (await request(`${api}/movies`)).map((movie) => ({
                ...movie,
                poster: posterArt[movie.id] || movie.poster
            }));
            state.featuredMovies = featuredIds
                .map((id) => state.movies.find((movie) => movie.id === id))
                .filter(Boolean);
            if (state.featuredMovies.length) {
                showSlide(0);
                startHeroAutoplay();
            }
            renderMovies();
            const trendingGrid = $("#trendingGrid");
            const trendingMovies = [
                state.movies.find((movie) => movie.id === "endgame"),
                state.movies.find((movie) => movie.id === "rrr"),
                state.movies.find((movie) => movie.id === "kalki-2898-ad")
            ].filter(Boolean);
            trendingGrid.innerHTML = trendingMovies.map((movie, index) => `
                <button class="trending-card" type="button" data-movie-id="${escapeHtml(movie.id)}">
                    <span class="trending-rank">0${index + 1}</span><img src="${escapeHtml(movie.poster)}" alt="" loading="lazy">
                    <span class="trending-copy"><strong>${escapeHtml(movie.title)}</strong><small><i class="fa-solid fa-star"></i> ${Number(movie.rating).toFixed(1)} · FROM ${formatINR(movie.price)}</small></span>
                    <i class="fa-solid fa-arrow-right trending-arrow"></i>
                </button>`).join("");
            trendingGrid.querySelectorAll(".trending-card").forEach((button) => {
                button.addEventListener("click", () => openBooking(button.dataset.movieId));
            });
        } catch (error) {
            movieGrid.innerHTML = `<div class="error-state">The movie lineup could not load. <button id="retryMovies">TRY AGAIN</button></div>`;
            $("#retryMovies").addEventListener("click", loadMovies);
        }
    }

    function localDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function configureDates() {
        const today = new Date();
        const options = [];
        for (let offset = 0; offset < 7; offset += 1) {
            const date = new Date(today);
            date.setDate(today.getDate() + offset);
            options.push(date);
        }
        if (!options.some((date) => localDate(date) === state.date)) state.date = localDate(options[0]);
        $("#dateOptions").innerHTML = options.map((date) => {
            const value = localDate(date);
            const day = new Intl.DateTimeFormat("en", { weekday: "short" }).format(date);
            const dayNumber = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
            const month = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
            return `<button type="button" class="date-option ${value === state.date ? "active" : ""}" data-date="${value}">
                <span>${day}</span><strong>${dayNumber}</strong><span>${month}</span></button>`;
        }).join("");
        $("#dateOptions").querySelectorAll(".date-option").forEach((button) => {
            button.addEventListener("click", () => {
                state.date = button.dataset.date;
                state.seats.clear();
                $("#checkoutError").textContent = "";
                configureDates();
                updateSummary();
                loadSeats();
            });
        });
        $("#timeOptions").innerHTML = showTimes.map((time) => `
            <button type="button" class="time-option ${time === state.time ? "active" : ""}" data-time="${time}">${time}</button>`).join("");
        $("#timeOptions").querySelectorAll(".time-option").forEach((button) => {
            button.addEventListener("click", () => {
                state.time = button.dataset.time;
                state.seats.clear();
                $("#checkoutError").textContent = "";
                configureDates();
                updateSummary();
                loadSeats();
            });
        });
    }

    function openBooking(movieId) {
        state.movie = state.movies.find((movie) => movie.id === movieId);
        if (!state.movie) return;
        state.seats.clear();
        state.time = showTimes[1];
        $("#selectedMovie").innerHTML = `<img src="${escapeHtml(state.movie.poster)}" alt=""><div><span>${state.movie.category === "indian" ? "INDIAN CINEMA" : "SUPERHERO SAGA"}</span><strong>${escapeHtml(state.movie.title)}</strong><small>${escapeHtml(state.movie.duration)} · ${formatINR(state.movie.price)} / seat</small></div>`;
        $("#theatreSelect").value = theatres[0];
        configureDates();
        bookingSection.hidden = false;
        updateSummary();
        loadSeats();
        setActiveNavigation("booking");
        bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    async function loadSeats() {
        if (!state.movie || !state.date) return;
        const params = new URLSearchParams({
            movieId: state.movie.id,
            theatre: $("#theatreSelect").value,
            showDate: state.date,
            showTime: state.time
        });
        try {
            const result = await request(`${api}/bookings/seats?${params}`);
            state.bookedSeats = new Set(result.bookedSeats);
            renderSeats();
        } catch (error) {
            showToast(error.message);
        }
    }

    function renderSeats() {
        const rows = "ABCDEFGH";
        $("#seatMap").innerHTML = rows.split("").map((row) => `
            <div class="seat-row"><span class="row-label">${row}</span>
                ${Array.from({ length: 8 }, (_, index) => {
                    const seat = `${row}${index + 1}`;
                    const occupied = state.bookedSeats.has(seat);
                    return `<button type="button" class="seat ${occupied ? "occupied" : ""} ${state.seats.has(seat) ? "selected" : ""}"
                        aria-label="Seat ${seat}${occupied ? ", taken" : ""}" aria-pressed="${state.seats.has(seat)}"
                        ${occupied ? "disabled" : ""} data-seat="${seat}">${index + 1}</button>`;
                }).join("")}
                <span class="row-label">${row}</span>
            </div>`).join("");
        $("#seatMap").querySelectorAll(".seat:not(:disabled)").forEach((button) => {
            button.addEventListener("click", () => {
                const seat = button.dataset.seat;
                if (state.seats.has(seat)) state.seats.delete(seat);
                else if (state.seats.size < 8) state.seats.add(seat);
                else {
                    showToast("You can select up to 8 seats per booking.");
                    return;
                }
                $("#checkoutError").textContent = "";
                renderSeats();
                updateSummary();
            });
        });
    }

    function updateSummary() {
        if (!state.movie) return;
        const date = state.date
            ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${state.date}T00:00:00Z`))
            : "Select date";
        $("#summaryMovieTitle").textContent = state.movie.title;
        $("#summaryShowInfo").textContent = `${date} · ${state.time}`;
        $("#summaryTheatre").textContent = $("#theatreSelect").value.replace(" · ", "\n");
        $("#selectedSeatText").textContent = state.seats.size ? [...state.seats].sort().join(", ") : "Select seats";
        $("#ticketCount").textContent = String(state.seats.size);
        $("#totalAmount").textContent = formatINR(state.seats.size * state.movie.price);
        $("#confirmBookingButton").disabled = state.seats.size === 0;
    }

    function createQrMarkup(identifier) {
        let seed = 0;
        for (const character of identifier) seed = (seed * 31 + character.charCodeAt(0)) >>> 0;
        const cells = Array.from({ length: 121 }, (_, index) => {
            seed = (seed * 1664525 + 1013904223) >>> 0;
            const row = Math.floor(index / 11);
            const column = index % 11;
            const finder = (row < 3 && column < 3) || (row < 3 && column > 7) || (row > 7 && column < 3);
            const finderPixel = finder && ((row % 8 === 0) || (column % 8 === 0) || (row % 8 === 2) || (column % 8 === 2));
            return `<i class="${finderPixel || (!finder && seed % 2 === 0) ? "on" : ""}"></i>`;
        }).join("");
        return `<span class="qr-code" aria-label="Decorative booking code">${cells}</span>`;
    }

    function renderConfirmation(booking) {
        const date = new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" })
            .format(new Date(`${booking.showDate}T00:00:00Z`));
        $("#confirmationContent").innerHTML = `
            <button class="modal-close" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
            <div class="success-emblem"><i class="fa-solid fa-check"></i></div>
            <p class="eyebrow justify-content-center">CINEMA INDIA · BOOKING CONFIRMED</p>
            <h2 class="success-heading">MISSION<br><span>ACCOMPLISHED!</span></h2>
            <p class="success-copy">Your seats are secured. Assemble at the theatre.</p>
            <div class="digital-ticket" id="printableTicket">
                <div class="ticket-top"><div><span>ADMIT ONE · CINEMA INDIA</span><strong>${escapeHtml(booking.movieTitle)}</strong></div>${createQrMarkup(booking.bookingId)}</div>
                <div class="ticket-details"><div><span>BOOKING ID</span><strong>${escapeHtml(booking.bookingId)}</strong></div><div><span>THEATRE</span><strong>${escapeHtml(booking.theatre)}</strong></div><div><span>DATE & TIME</span><strong>${escapeHtml(date)} · ${escapeHtml(booking.showTime)}</strong></div><div><span>SEATS</span><strong>${booking.seats.map(escapeHtml).join(" · ")}</strong></div></div>
                <div class="ticket-total"><span>${booking.seats.length} TICKET${booking.seats.length === 1 ? "" : "S"}</span><strong>${formatINR(booking.totalAmount)}</strong></div>
            </div>
            <div class="confirmation-actions"><button class="btn-primary-glow" id="downloadTicket"><i class="fa-solid fa-download"></i> DOWNLOAD TICKET</button><button class="text-link" data-bs-dismiss="modal">DONE</button></div>`;
        $("#downloadTicket").addEventListener("click", () => printTicket(booking));
        confirmationModal.show();
        loadBookingCount();
    }

    function printTicket(booking) {
        const date = new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" })
            .format(new Date(`${booking.showDate}T00:00:00Z`));
        const printable = window.open("", "_blank", "width=720,height=720");
        if (!printable) {
            showToast("Allow pop-ups to print or save your ticket.");
            return;
        }
        printable.document.write(`<!doctype html><html><head><title>Ticket ${escapeHtml(booking.bookingId)}</title>
            <style>body{font:16px Arial,sans-serif;background:#f2f2f2;padding:40px;color:#161616}.ticket{max-width:560px;margin:0 auto;background:white;border:1px solid #ddd;padding:32px}.tag{color:#a8792b;font-size:12px;letter-spacing:2px}.title{font-size:30px;margin:12px 0 24px}.row{display:flex;justify-content:space-between;border-top:1px dashed #bbb;padding:14px 0}.row span{color:#777;font-size:12px;text-transform:uppercase}.id{font-weight:bold;font-family:monospace}.total{font-size:24px;color:#aa2929}</style>
            </head><body><main class="ticket"><div class="tag">CINEMA INDIA · ADMIT ONE</div><h1 class="title">${escapeHtml(booking.movieTitle)}</h1>
            <div class="row"><span>Booking ID</span><strong class="id">${escapeHtml(booking.bookingId)}</strong></div>
            <div class="row"><span>Theatre</span><strong>${escapeHtml(booking.theatre)}</strong></div>
            <div class="row"><span>Show</span><strong>${escapeHtml(date)} · ${escapeHtml(booking.showTime)}</strong></div>
            <div class="row"><span>Seats</span><strong>${booking.seats.map(escapeHtml).join(", ")}</strong></div>
            <div class="row"><span>Total</span><strong class="total">${formatINR(booking.totalAmount)}</strong></div></main><script>window.onload=()=>window.print();<\/script></body></html>`);
        printable.document.close();
    }

    async function loadBookingCount() {
        try {
            const bookings = await request(`${api}/bookings`);
            $("#bookingCount").textContent = String(bookings.length);
        } catch (error) {
            $("#bookingCount").textContent = "!";
        }
    }

    async function showBookings() {
        $("#bookingsContent").innerHTML = `<button class="modal-close" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-xmark"></i></button><p class="eyebrow">YOUR CINEMA INDIA HISTORY</p><h2 class="success-heading">MY <span>BOOKINGS</span></h2><p class="success-copy">Retrieving your confirmed films...</p>`;
        bookingsModal.show();
        try {
            const bookings = await request(`${api}/bookings`);
            const header = `<button class="modal-close" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-xmark"></i></button><p class="eyebrow">YOUR CINEMA INDIA HISTORY</p><h2 class="success-heading">MY <span>BOOKINGS</span></h2>`;
            if (!bookings.length) {
                $("#bookingsContent").innerHTML = `${header}<p class="success-copy">No missions yet. Choose a movie and your story starts here.</p><button class="btn-primary-glow" data-bs-dismiss="modal">EXPLORE MOVIES</button>`;
                return;
            }
            $("#bookingsContent").innerHTML = `${header}<div class="booking-history">${bookings.map((booking) => `
                <article class="history-card"><div><span class="history-id">${escapeHtml(booking.bookingId)}</span><h3>${escapeHtml(booking.movieTitle)}</h3><p>${escapeHtml(booking.theatre)}<br>${escapeHtml(booking.showDate)} · ${escapeHtml(booking.showTime)}<br>Seats ${booking.seats.map(escapeHtml).join(", ")}</p></div><strong>${formatINR(booking.totalAmount)}</strong><button class="history-ticket" type="button" data-booking-id="${escapeHtml(booking.bookingId)}" aria-label="Download ticket"><i class="fa-solid fa-download"></i></button></article>`).join("")}</div>`;
            $("#bookingsContent").querySelectorAll(".history-ticket").forEach((button) => {
                button.addEventListener("click", async () => {
                    try {
                        printTicket(await request(`${api}/bookings/${encodeURIComponent(button.dataset.bookingId)}`));
                    } catch (error) {
                        showToast(error.message);
                    }
                });
            });
        } catch (error) {
            $("#bookingsContent").innerHTML = `<p class="eyebrow">BOOKINGS UNAVAILABLE</p><p class="success-copy">${escapeHtml(error.message)}</p>`;
        }
    }

    $("#theatreSelect").addEventListener("change", () => {
        state.seats.clear();
        $("#checkoutError").textContent = "";
        updateSummary();
        loadSeats();
    });
    document.querySelectorAll(".filter-chip").forEach((button) => {
        button.addEventListener("click", () => {
            state.category = button.dataset.filter;
            updateMovieFilters();
            renderMovies();
        });
    });
    $("#movieSearch").addEventListener("input", (event) => {
        state.query = event.target.value;
        renderMovies();
    });
    document.addEventListener("keydown", (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
            event.preventDefault();
            $("#movieSearch").focus();
            $("#movieSearch").select();
        }
        if (event.key === "Escape" && document.activeElement === $("#movieSearch")) {
            $("#movieSearch").value = "";
            state.query = "";
            renderMovies();
            $("#movieSearch").blur();
        }
    });
    $("#confirmBookingButton").addEventListener("click", async () => {
        const button = $("#confirmBookingButton");
        $("#checkoutError").textContent = "";
        button.disabled = true;
        button.innerHTML = `<span class="spinner-border spinner-border-sm"></span> CONFIRMING...`;
        try {
            const booking = await request(`${api}/bookings`, {
                method: "POST",
                body: JSON.stringify({
                    movieId: state.movie.id,
                    theatre: $("#theatreSelect").value,
                    showDate: state.date,
                    showTime: state.time,
                    seats: [...state.seats]
                })
            });
            state.seats.clear();
            updateSummary();
            await loadSeats();
            renderConfirmation(booking);
        } catch (error) {
            $("#checkoutError").textContent = error.message;
            await loadSeats();
            updateSummary();
        } finally {
            button.innerHTML = `CONFIRM BOOKING <i class="fa-solid fa-arrow-right"></i>`;
            button.disabled = state.seats.size === 0;
        }
    });
    $("#closeBooking").addEventListener("click", () => {
        bookingSection.hidden = true;
        setActiveNavigation("movies");
        scrollToMovies();
    });
    $("#myBookingsButton").addEventListener("click", () => {
        closeMobileNavigation();
        showBookings();
    });
    $("#previousSlide").addEventListener("click", () => showSlide(state.activeSlide - 1));
    $("#nextSlide").addEventListener("click", () => showSlide(state.activeSlide + 1));
    $("#watchMovieButton").addEventListener("click", () => {
        const movie = state.featuredMovies[state.activeSlide];
        if (movie) openBooking(movie.id);
    });
    $("#viewTrailerButton").addEventListener("click", () => {
        const movie = state.featuredMovies[state.activeSlide];
        if (!movie) return;
        const trailerId = trailerIds[movie.id];
        const trailerUrl = trailerId
            ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(trailerId)}?autoplay=1`
            : `https://www.youtube.com/results?search_query=${encodeURIComponent(`${movie.title} official trailer`)}`;
        window.open(trailerUrl, "_blank", "noopener,noreferrer");
    });
    $("#heroPoster").addEventListener("error", () => {
        $("#heroPosterCard").classList.add("poster-fallback");
        $("#heroBackdropImage").style.opacity = "0";
    });
    $("#heroPoster").addEventListener("load", () => {
        $("#heroPosterCard").classList.remove("poster-fallback");
        $("#heroBackdropImage").style.opacity = "";
    });
    $("#home").addEventListener("keydown", (event) => {
        if (event.target.closest("button, a, input, select")) return;
        if (event.key === "ArrowRight") showSlide(state.activeSlide + 1);
        if (event.key === "ArrowLeft") showSlide(state.activeSlide - 1);
    });

    window.addEventListener("scroll", () => {
        $(".site-nav").classList.toggle("scrolled", window.scrollY > 24);
        if (!bookingSection.hidden && bookingSection.getBoundingClientRect().top < window.innerHeight * 0.55) {
            setActiveNavigation("bookingSection");
        }
    }, { passive: true });
    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            if (!bookingSection.hidden && bookingSection.getBoundingClientRect().top < window.innerHeight * 0.55) {
                setActiveNavigation("bookingSection");
                return;
            }
            const currentSection = entries
                .filter((entry) => entry.isIntersecting)
                .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
            if (currentSection) {
                const sectionId = currentSection.target.id === "experience" ? "movies" : currentSection.target.id;
                setActiveNavigation(sectionId);
            }
        }, { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.1, 0.25, 0.5] });
        ["home", "movies", "experience", "bookingSection"].forEach((sectionId) => {
            const section = document.getElementById(sectionId);
            if (section) sectionObserver.observe(section);
        });
    }
    window.addEventListener("pointermove", (event) => {
        const glow = $("#cursorGlow");
        glow.style.left = `${event.clientX}px`;
        glow.style.top = `${event.clientY}px`;
    }, { passive: true });
    window.addEventListener("load", () => {
        window.setTimeout(() => $("#welcomeScreen").classList.add("welcome-hidden"), 900);
    });

    loadMovies().then(async () => {
        const parameters = new URLSearchParams(window.location.search);
        const bookingId = parameters.get("bookingId");
        const movieId = parameters.get("movieId") || document.body.dataset.selectedMovie;
        if (bookingId) {
            try {
                renderConfirmation(await request(`${api}/bookings/${encodeURIComponent(bookingId)}`));
            } catch (error) {
                showToast(error.message);
            }
        } else if (movieId) {
            openBooking(movieId);
        }
    });
    loadBookingCount();
})();
