const animateOnScroll = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(
      ".section-title, .feature-card, .about-text, .about-image, .cta h2, .cta p, .cta .btn"
    )
    .forEach((element) => {
      observer.observe(element);
    });
};

// Mobile Menu Toggle
const toggleMobileMenu = () => {
  document
    .querySelector(".mobile-menu-btn")
    .addEventListener("click", function () {
      document.getElementById("main-nav").classList.toggle("active");
    });
};

// Header Scroll Effect
const headerScrollEffect = () => {
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
};

// Testimonial Slider
const setupTestimonialSlider = () => {
  const testimonials = document.querySelectorAll(".testimonial");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.getElementById("prev-testimonial");
  const nextBtn = document.getElementById("next-testimonial");
  let currentTestimonial = 0;

  const showTestimonial = (index) => {
    testimonials.forEach((testimonial) =>
      testimonial.classList.remove("active")
    );
    dots.forEach((dot) => dot.classList.remove("active"));

    testimonials[index].classList.add("active");
    dots[index].classList.add("active");
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      currentTestimonial = index;
      showTestimonial(currentTestimonial);
    });
  });

  prevBtn.addEventListener("click", () => {
    currentTestimonial =
      (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
  });

  nextBtn.addEventListener("click", () => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
  });

  // Auto-rotate testimonials
  const autoRotate = setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
  }, 5000);

  // Stop auto-rotation when user interacts with slider
  const stopAutoRotate = () => {
    clearInterval(autoRotate);
  };

  dots.forEach((dot) => dot.addEventListener("click", stopAutoRotate));
  prevBtn.addEventListener("click", stopAutoRotate);
  nextBtn.addEventListener("click", stopAutoRotate);
};

// Mapbox initialization
const initMap = () => {
  mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN";
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/dark-v10",
    center: [-74.5, 40],
    zoom: 9,
  });

  // Add zoom controls
  document.getElementById("zoom-in").addEventListener("click", () => {
    map.zoomIn();
  });

  document.getElementById("zoom-out").addEventListener("click", () => {
    map.zoomOut();
  });

  return map;
};

// Cab Search Form Submission
const setupSearchForm = (map) => {
  document
    .getElementById("cab-search-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const pickup = document.getElementById("pickup").value;
      const destination = document.getElementById("destination").value;
      const date = document.getElementById("date").value;
      const time = document.getElementById("time").value;
      const passengers = document.getElementById("passengers").value;

      // Show loading indicator
      document.getElementById("loading").style.display = "block";

      // Simulate API call delay
      setTimeout(function () {
        // Hide loading indicator
        document.getElementById("loading").style.display = "none";

        // Show results section
        document.getElementById("results-section").style.display = "block";

        // Update route info
        document.getElementById(
          "route-info"
        ).textContent = `${pickup} to ${destination} · ${date} · ${time} · ${passengers} passenger${
          passengers > 1 ? "s" : ""
        }`;

        // Generate mock cab data
        const cabData = generateMockCabData(pickup, destination);

        // Display cab cards
        displayCabCards(cabData);

        // Update map
        updateMap(map, pickup, destination);

        // Scroll to results
        document
          .getElementById("results-section")
          .scrollIntoView({ behavior: "smooth" });

        // Show success notification
        showNotification(
          "Success",
          "We found the best cab options for your trip!",
          "success"
        );
      }, 2000);
    });
};

// Generate mock cab data
const generateMockCabData = (pickup, destination) => {
  // Calculate a base price based on the length of the pickup and destination strings
  // This is just for demo purposes to create somewhat realistic looking prices
  const baseDistance = ((pickup.length + destination.length) % 10) + 5;
  const basePrice = baseDistance * 2.5;

  return [
    {
      name: "Uber",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Uber_App_Icon.svg/240px-Uber_App_Icon.svg.png",
      price: (basePrice * 1.1).toFixed(2),
      priceChange: "-5%",
      currency: "$",
      eta: Math.floor(Math.random() * 5) + 3,
      type: "UberX",
      distance: baseDistance.toFixed(1),
    },
    {
      name: "Lyft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Lyft_logo.svg/240px-Lyft_logo.svg.png",
      price: (basePrice * 0.95).toFixed(2),
      priceChange: "-10%",
      currency: "$",
      eta: Math.floor(Math.random() * 5) + 2,
      type: "Lyft Standard",
      distance: baseDistance.toFixed(1),
    },
    {
      name: "Cabify",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Cabify_logo.svg/240px-Cabify_logo.svg.png",
      price: (basePrice * 1.05).toFixed(2),
      priceChange: "-3%",
      currency: "$",
      eta: Math.floor(Math.random() * 4) + 3,
      type: "Lite",
      distance: baseDistance.toFixed(1),
    },
  ];
};

// Display cab cards
const displayCabCards = (cabData) => {
  const cabCardsContainer = document.getElementById("cab-cards");
  cabCardsContainer.innerHTML = "";

  // Sort by price (lowest first)
  cabData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

  // Create cab cards with staggered animation
  cabData.forEach((cab, index) => {
    const cabCard = document.createElement("div");
    cabCard.className = "cab-card";
    cabCard.style.animationDelay = `${index * 0.1}s`;

    let cabCardHTML = `
                    <div class="cab-card-header">
                        <img src="${cab.logo}" alt="${cab.name}" class="cab-logo">
                        <span>${cab.name}</span>
                    </div>
                    <div class="cab-card-body">
                        <div class="cab-price">
                            ${cab.currency}${cab.price}
                            <span class="cab-price-change">${cab.priceChange}</span>
                        </div>
                        <div class="cab-details">
                            <div class="cab-detail">
                                <span class="cab-detail-label">Type</span>
                                <span class="cab-detail-value">${cab.type}</span>
                            </div>
                            <div class="cab-detail">
                                <span class="cab-detail-label">ETA</span>
                                <span class="cab-detail-value">${cab.eta} min</span>
                            </div>
                            <div class="cab-detail">
                                <span class="cab-detail-label">Distance</span>
                                <span class="cab-detail-value">${cab.distance} miles</span>
                            </div>
                        </div>
                        <a href="#" class="btn btn-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="1" y="3" width="15" height="13"></rect>
                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                <circle cx="18.5" cy="18.5" r="2.5"></circle>
                            </svg>
                            Book Now
                        </a>
                    </div>
                `;

    cabCard.innerHTML = cabCardHTML;
    cabCardsContainer.appendChild(cabCard);

    // Add animation class after a small delay
    setTimeout(() => {
      cabCard.classList.add("animate");
    }, 100);
  });
};

// Update map
const updateMap = (map, pickup, destination) => {
  // Clear previous layers and sources
  if (map.getLayer("route")) {
    map.removeLayer("route");
  }
  if (map.getSource("route")) {
    map.removeSource("route");
  }

  // For demo purposes, we'll use random coordinates
  const pickupCoords = [
    -74.5 + (Math.random() - 0.5) * 0.1,
    40 + (Math.random() - 0.5) * 0.1,
  ];
  const destinationCoords = [
    -74.5 + (Math.random() - 0.5) * 0.1,
    40 + (Math.random() - 0.5) * 0.1,
  ];

  // Remove existing markers
  document.querySelectorAll(".mapboxgl-marker").forEach((marker) => {
    marker.remove();
  });

  // Add markers for pickup and destination with custom HTML
  const pickupMarker = document.createElement("div");
  pickupMarker.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="#4cc9f0" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
            `;
  pickupMarker.style.width = "30px";
  pickupMarker.style.height = "30px";

  const destinationMarker = document.createElement("div");
  destinationMarker.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="#4361ee" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
            `;
  destinationMarker.style.width = "30px";
  destinationMarker.style.height = "30px";

  new mapboxgl.Marker(pickupMarker)
    .setLngLat(pickupCoords)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h3>Pickup</h3><p>${pickup}</p>`
      )
    )
    .addTo(map);

  new mapboxgl.Marker(destinationMarker)
    .setLngLat(destinationCoords)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h3>Destination</h3><p>${destination}</p>`
      )
    )
    .addTo(map);

  // Fit map to show both markers
  const bounds = new mapboxgl.LngLatBounds()
    .extend(pickupCoords)
    .extend(destinationCoords);

  map.fitBounds(bounds, {
    padding: 50,
    duration: 1000,
  });

  // Add a line connecting the two points with animation
  map.addSource("route", {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [pickupCoords, destinationCoords],
      },
    },
  });

  map.addLayer({
    id: "route",
    type: "line",
    source: "route",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#4cc9f0",
      "line-width": 4,
      "line-opacity": 0,
      "line-dasharray": [0, 2],
    },
  });

  // Animate the line
  let start = 0;
  function animateLine() {
    const duration = 1500;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = (timestamp - start) / duration;

      if (progress < 1) {
        map.setPaintProperty("route", "line-dasharray", [
          0,
          2,
          progress * 2,
          0,
        ]);
        map.setPaintProperty("route", "line-opacity", progress);
        requestAnimationFrame(step);
      } else {
        map.setPaintProperty("route", "line-dasharray", [0, 0]);
      }
    };
    requestAnimationFrame(step);
  }

  // Start animation after map is loaded
  if (map.loaded()) {
    animateLine();
  } else {
    map.on("load", animateLine);
  }
};

// Set today's date as the default
const setDefaultDateTime = () => {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  document.getElementById("date").value = formattedDate;

  // Set current time + 15 minutes as default
  let hours = today.getHours();
  let minutes = today.getMinutes() + 15;

  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
  }

  if (hours >= 24) {
    hours = hours % 24;
  }

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
  document.getElementById("time").value = formattedTime;
};

// Smooth scrolling for navigation links
const setupSmoothScrolling = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href") === "#") return;

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Close mobile menu if open
        document.getElementById("main-nav").classList.remove("active");
      }
    });
  });
};

// Login and Signup Modal Functionality

const API_URL = "http://localhost:5000"; // Update with actual API URL

const setupModals = () => {
  const loginModal = document.getElementById("login-modal");
  const signupModal = document.getElementById("signup-modal");
  const loginBtn = document.getElementById("login-btn");
  const signupLink = document.getElementById("signup-link");
  const loginLink = document.getElementById("login-link");
  const closeBtns = document.querySelectorAll(".close");

  const showModal = (modal) => {
    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 10);
  };

  const hideModal = (modal) => {
    modal.classList.remove("show");
    setTimeout(() => (modal.style.display = "none"), 300);
  };

  loginBtn.onclick = () => showModal(loginModal);

  signupLink.onclick = (e) => {
    e.preventDefault();
    hideModal(loginModal);
    setTimeout(() => showModal(signupModal), 300);
  };

  loginLink.onclick = (e) => {
    e.preventDefault();
    hideModal(signupModal);
    setTimeout(() => showModal(loginModal), 300);
  };

  closeBtns.forEach((btn) => {
    btn.onclick = function () {
      const modal = this.closest(".modal");
      hideModal(modal);
    };
  });

  window.onclick = (event) => {
    if (event.target.classList.contains("modal")) {
      hideModal(event.target);
    }
  };
};

const setupFormValidation = () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        document.getElementById("login-success").style.display = "block";
        setTimeout(
          () => hideModal(document.getElementById("login-modal")),
          1000
        );
        updateUserUI(data.user);
      } else {
        showNotification("Error", data.error || "Login failed", "error");
      }
    } catch (error) {
      showNotification("Error", "Network error, please try again", "error");
    }
  });

  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("new-username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
      showNotification("Error", "Passwords do not match", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification(
          "Success",
          "Account created! Please log in.",
          "success"
        );
        setTimeout(
          () => showModal(document.getElementById("login-modal")),
          1000
        );
      } else {
        showNotification("Error", data.error || "Signup failed", "error");
      }
    } catch (error) {
      showNotification("Error", "Network error, please try again", "error");
    }
  });
};

const updateUserUI = (user) => {
  const loginBtn = document.getElementById("login-btn");
  const userMenu = document.getElementById("user-menu");
  const userAvatar = document.getElementById("user-avatar");
  const userAvatarPlaceholder = document.querySelector(
    ".user-avatar-placeholder"
  );

  loginBtn.style.display = "none";
  userMenu.style.display = "block";

  userAvatarPlaceholder.textContent = user.username
    .substring(0, 2)
    .toUpperCase();

  const userDropdown = document.getElementById("user-dropdown");

  userAvatar.style.pointerEvents = "auto";
  userAvatar.style.zIndex = "1000";

  userAvatar.addEventListener("click", (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.remove("active");
    }
  });

  document.getElementById("logout-btn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("loggedInUser");
    userMenu.style.display = "none";
    loginBtn.style.display = "block";
    userDropdown.classList.remove("active");
    showNotification("Info", "You have logged out successfully", "info");
  });
};

const checkLoggedInStatus = async () => {
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (loggedInUser) {
    updateUserUI(JSON.parse(loggedInUser));
  } else {
    try {
      const response = await fetch(`${API_URL}/users`);
      const users = await response.json();

      if (users.length > 0) {
        updateUserUI(users[0]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
};

const showNotification = (title, message, type = "info") => {
  const notification = document.getElementById("notification");
  notification.querySelector(".notification-title").textContent = title;
  notification.querySelector(".notification-message").textContent = message;

  notification.className = "notification notification-" + type;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 5000);

  notification
    .querySelector(".notification-close")
    .addEventListener("click", () => {
      notification.classList.remove("show");
    });

  notification.style.zIndex = "9999"; // Ensures it's above the blur effect
};

setupModals();
setupFormValidation();
checkLoggedInStatus();

// Theme toggle
const setupThemeToggle = () => {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const currentTheme = localStorage.getItem("theme") || "dark";

  // Apply saved theme
  if (currentTheme === "light") {
    body.classList.add("light-theme");
    themeToggle.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                `;
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    const isDark = !body.classList.contains("light-theme");

    // Save theme preference
    localStorage.setItem("theme", isDark ? "dark" : "light");

    // Update toggle icon
    if (isDark) {
      themeToggle.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                    `;
    } else {
      themeToggle.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                    `;
    }

    showNotification(
      "Theme Changed",
      `Switched to ${isDark ? "dark" : "light"} theme`,
      "info"
    );
  });
};

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize map
  const map = initMap();

  // Setup all functionality
  animateOnScroll();
  toggleMobileMenu();
  headerScrollEffect();
  setupTestimonialSlider();
  setupSearchForm(map);
  setDefaultDateTime();
  setupSmoothScrolling();
  setupModals();
  setupFormValidation();
  checkLoggedInStatus();
  setupThemeToggle();
  setupScrollToTop();

  // Show welcome notification
  setTimeout(() => {
    showNotification(
      "Welcome to FareSy",
      "Find the cheapest cab rides and save money!",
      "info"
    );
  }, 1000);
});

// Helper function to hide modal
const hideModal = (modal) => {
  modal.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
};

// Helper function to show modal
const showModal = (modal) => {
  modal.style.display = "block";
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);
};
