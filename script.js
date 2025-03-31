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

// API base URL - change this to your production URL when deploying
const API_BASE_URL = "http://localhost:3000/api";

// Fetch with error handling
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Cab Search Form Submission
const setupSearchForm = (map) => {
  document
    .getElementById("cab-search-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      // Get form values
      const pickup = document.getElementById("pickup").value;
      const destination = document.getElementById("destination").value;
      const date = document.getElementById("date").value;
      const time = document.getElementById("time").value;
      const passengers = document.getElementById("passengers").value;

      // Show loading indicator
      document.getElementById("loading").style.display = "block";

      try {
        // Call the API to get cab prices
        const data = await fetchAPI("/get-cab-prices", {
          method: "POST",
          body: JSON.stringify({
            pickup,
            destination,
            date,
            time,
            passengers,
          }),
        });

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

        // Display cab cards
        displayCabCards(data.cabPrices, {
          pickup,
          destination,
          date,
          time,
          passengers,
        });

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
      } catch (error) {
        // Hide loading indicator
        document.getElementById("loading").style.display = "none";

        // Show error notification
        showNotification(
          "Error",
          error.message || "Failed to fetch cab prices. Please try again.",
          "error"
        );
      }
    });
};

// Display cab cards
const displayCabCards = (cabData, searchParams) => {
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
        <button class="btn btn-icon book-now-btn" data-cab-provider-id="${cab.id}" data-price="${cab.price}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
          Book Now
        </button>
      </div>
    `;

    cabCard.innerHTML = cabCardHTML;
    cabCardsContainer.appendChild(cabCard);

    // Add animation class after a small delay
    setTimeout(() => {
      cabCard.classList.add("animate");
    }, 100);
  });

  // Add event listeners to book now buttons
  document.querySelectorAll(".book-now-btn").forEach((button) => {
    button.addEventListener("click", async function () {

      // Check if user is logged in
      try {
        // const loginStatus = await fetchAPI("/check-login");

        // if (!loginStatus.success) {
        //   // Show login modal if not logged in
        //   showModal(document.getElementById("login-modal"));
        //   showNotification(
        //     "Login Required",
        //     "Please log in to book a ride",
        //     "info"
        //   );
        //   return;
        // }

        // Redirect to book.html with booking details
        window.location.href = `Pages/Book/book.html`;

        // Show success notification
        showNotification(
          "Booking Successful",
          `Your ride has been booked! Estimated fare: $${bookingData.estimated_fare}`,
          "success"
        );
      } catch (error) {
        // Show error notification
        showNotification(
          "Booking Failed",
          error.message || "Failed to book your ride. Please try again.",
          "error"
        );
      }
    });
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

  // Fetch and display nearby cabs
  fetchAPI("/cab-locations")
    .then((data) => {
      if (data.success && data.locations.length > 0) {
        // Add nearby cabs to the map
        data.locations.forEach((location) => {
          const cabMarker = document.createElement("div");
          cabMarker.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f72585" stroke="#ffffff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          `;
          cabMarker.style.width = "24px";
          cabMarker.style.height = "24px";

          new mapboxgl.Marker(cabMarker)
            .setLngLat([location.longitude, location.latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<h3>${location.provider_name}</h3><p>${location.model} (${location.color})</p>`
              )
            )
            .addTo(map);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching cab locations:", error);
    });
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
const setupModals = () => {
  const loginModal = document.getElementById("login-modal");
  const signupModal = document.getElementById("signup-modal");
  const loginBtn = document.getElementById("login-btn");
  const signupLink = document.getElementById("signup-link");
  const loginLink = document.getElementById("login-link");
  const closeBtns = document.querySelectorAll(".close");

  const showModal = (modal) => {
    modal.style.display = "block";
    setTimeout(() => {
      modal.classList.add("show");
    }, 10);
  };

  const hideModal = (modal) => {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  };

  loginBtn.onclick = () => showModal(loginModal);

  signupLink.onclick = (e) => {
    e.preventDefault();
    hideModal(loginModal);
    setTimeout(() => {
      showModal(signupModal);
    }, 300);
  };

  loginLink.onclick = (e) => {
    e.preventDefault();
    hideModal(signupModal);
    setTimeout(() => {
      showModal(loginModal);
    }, 300);
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

// Form Validation and API Interaction
const setupFormValidation = () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  // Form Validation Function
  const validateForm = (fields) => {
    let isValid = true;

    fields.forEach((field) => {
      const element = document.getElementById(field.id);
      const errorElement = document.getElementById(`${field.id}-error`);
      if (!element || (field.required && !element.value)) {
        errorElement.style.display = "block";
        isValid = false;
      } else {
        errorElement.style.display = "none";
      }
    });

    return isValid;
  };

  // Login Form Submission
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Validate login form
    const isValid = validateForm([
      { id: "username", required: true },
      { id: "password", required: true },
    ]);

    if (isValid) {
      try {
        // Send login request to backend
        const data = await fetchAPI("/login", {
          method: "POST",
          body: JSON.stringify({ username, password }),
        });

        // Login successful
        document.getElementById("login-success").style.display = "block";

        // Update UI
        updateUserUI(data.user);

        // Close modal and show welcome message
        setTimeout(() => {
          hideModal(document.getElementById("login-modal"));
          showNotification(
            "Welcome back!",
            `You're now logged in as ${data.user.username}`,
            "success"
          );
        }, 1000);
      } catch (error) {
        // Login failed
        showNotification(
          "Login Failed",
          error.message || "Invalid username or password",
          "error"
        );
      }
    }
  });

  // Signup Form Submission
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("new-username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Validate signup form
    const isValid = validateForm([
      { id: "new-username", required: true },
      { id: "email", required: true },
      { id: "new-password", required: true },
      { id: "confirm-password", required: true },
    ]);

    if (isValid) {
      // Check if password and confirm password match
      if (password !== confirmPassword) {
        document.getElementById("confirm-password-error").style.display =
          "block";
        return;
      }

      try {
        // Send signup request to backend
        const data = await fetchAPI("/signup", {
          method: "POST",
          body: JSON.stringify({ username, email, password }),
        });

        // Signup successful
        document.getElementById("signup-success").style.display = "block";

        // Close modal and show login modal after delay
        setTimeout(() => {
          hideModal(document.getElementById("signup-modal"));
          showNotification(
            "Account Created",
            "Your account has been created successfully!",
            "success"
          );
          setTimeout(() => {
            showModal(document.getElementById("login-modal"));
          }, 1000);
        }, 1000);
      } catch (error) {
        // Signup failed
        showNotification(
          "Signup Failed",
          error.message || "Failed to create account",
          "error"
        );
      }
    }
  });
};

// Update UI for logged in user
const updateUserUI = (user) => {
  const loginBtn = document.getElementById("login-btn");
  const userMenu = document.getElementById("user-menu");
  const userAvatar = document.getElementById("user-avatar");
  const userAvatarPlaceholder = userAvatar.querySelector(
    ".user-avatar-placeholder"
  );

  // Hide login button
  loginBtn.style.display = "none";

  // Show user menu
  userMenu.style.display = "block";

  // Update avatar placeholder with user initials
  const initials = user.username.substring(0, 2).toUpperCase();
  userAvatarPlaceholder.textContent = initials;

  // Setup user dropdown
  const userDropdown = document.getElementById("user-dropdown");
  userAvatar.addEventListener("click", () => {
    userDropdown.classList.toggle("active");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.remove("active");
    }
  });

  // Logout functionality
  document.getElementById("logout-btn").addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      // Send logout request to backend to invalidate session
      const data = await fetchAPI("/logout", {
        method: "POST",
      });

      // Clear user data and update UI
      userMenu.style.display = "none";
      loginBtn.style.display = "block";
      userDropdown.classList.remove("active");
      showNotification(
        "Logged Out",
        "You have been logged out successfully",
        "info"
      );
    } catch (error) {
      showNotification(
        "Logout Failed",
        error.message || "Failed to log out",
        "error"
      );
    }
  });

  // Fetch user preferences
  fetchAPI(`/user-preferences/${user.id}`)
    .then((data) => {
      if (data.success && data.preferences) {
        // Store preferences in localStorage for easy access
        localStorage.setItem(
          "userPreferences",
          JSON.stringify(data.preferences)
        );
      }
    })
    .catch((error) => {
      console.error("Error fetching user preferences:", error);
    });

  // Fetch user bookings
  fetchAPI(`/user-bookings/${user.id}`)
    .then((data) => {
      if (data.success && data.bookings && data.bookings.length > 0) {
        // Show notification about recent booking if any
        const recentBooking = data.bookings[0];
        if (
          recentBooking.status === "pending" ||
          recentBooking.status === "confirmed"
        ) {
          showNotification(
            "Active Booking",
            `You have an ${recentBooking.status} booking from ${recentBooking.pickup} to ${recentBooking.destination}`,
            "info"
          );
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching user bookings:", error);
    });
};

// Check if user is logged in
const checkLoggedInStatus = async () => {
  try {
    // Send request to backend to check login status
    const data = await fetchAPI("/check-login", {
      method: "GET",
    });

    if (data.success) {
      updateUserUI(data.user);
    }
  } catch (error) {
    console.error("Error checking login status:", error);
  }
};

// Show notification
const showNotification = (title, message, type = "info") => {
  const notification = document.getElementById("notification");
  const notificationTitle = notification.querySelector(".notification-title");
  const notificationMessage = notification.querySelector(
    ".notification-message"
  );
  const notificationIcon = notification.querySelector(".notification-icon svg");

  // Set content
  notificationTitle.textContent = title;
  notificationMessage.textContent = message;

  // Set type
  notification.className = "notification";
  notification.classList.add(`notification-${type}`);

  // Set icon based on type
  switch (type) {
    case "success":
      notificationIcon.innerHTML = `
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    `;
      break;
    case "error":
      notificationIcon.innerHTML = `
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    `;
      break;
    case "warning":
      notificationIcon.innerHTML = `
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    `;
      break;
    default:
      notificationIcon.innerHTML = `
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                    `;
  }

  // Show notification
  notification.classList.add("show");

  // Hide after 5 seconds
  setTimeout(() => {
    notification.classList.remove("show");
  }, 5000);

  // Close button
  notification
    .querySelector(".notification-close")
    .addEventListener("click", () => {
      notification.classList.remove("show");
    });
};

// Theme toggle
const setupThemeToggle = () => {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const currentTheme = localStorage.getItem("theme") || "dark";

  // Ensure class is applied on page load
  if (currentTheme === "light") {
    body.classList.add("light-theme");
  } else {
    body.classList.remove("light-theme"); // Ensure dark mode is applied correctly
  }

  // Set the correct icon on page load
  themeToggle.innerHTML =
    currentTheme === "light"
      ? `
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
  `
      : `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
  `;

  // Event listener for toggle
  themeToggle.addEventListener("click", () => {
    const isLight = body.classList.toggle("light-theme"); // Toggle class

    // Save the theme preference
    localStorage.setItem("theme", isLight ? "light" : "dark");

    // Update toggle icon
    themeToggle.innerHTML = isLight
      ? `
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
    `
      : `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    `;

    // Show notification
    showNotification(
      "Theme Changed",
      `Switched to ${isLight ? "light" : "dark"} theme`,
      "info"
    );
  });
};

// Scroll to top functionality
const setupScrollToTop = () => {
  const scrollTopBtn = document.getElementById("scroll-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
};

// Apply promotion code
const setupPromotionCode = () => {
  const promoForm = document.getElementById("promo-form");
  if (promoForm) {
    promoForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const promoCode = document.getElementById("promo-code").value;
      const totalAmount = document.getElementById("total-amount").value;

      if (!promoCode || !totalAmount) {
        showNotification(
          "Error",
          "Please enter a promotion code and total amount",
          "error"
        );
        return;
      }

      try {
        // Send request to apply promotion
        const data = await fetchAPI("/apply-promotion", {
          method: "POST",
          body: JSON.stringify({
            code: promoCode,
            amount: totalAmount,
          }),
        });

        // Update UI with discounted price
        document.getElementById(
          "discounted-amount"
        ).textContent = `$${data.discounted_total}`;
        document.getElementById("discount-info").style.display = "block";

        // Show success notification
        showNotification(
          "Promotion Applied",
          `${data.message}. You saved $${data.discount_amount}!`,
          "success"
        );
      } catch (error) {
        // Show error notification
        showNotification(
          "Invalid Promotion",
          error.message || "Failed to apply promotion code",
          "error"
        );
      }
    });
  }
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
  setupPromotionCode();

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
