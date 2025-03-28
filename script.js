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
                        <a href="Pages/Book/book.html" class="btn btn-icon">
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

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    let isValid = true;

    // Reset errors
    document.getElementById("username-error").style.display = "none";
    document.getElementById("password-error").style.display = "none";
    document.getElementById("login-success").style.display = "none"; // Hide success message on new submit

    if (!username) {
      document.getElementById("username-error").style.display = "block";
      isValid = false;
    }

    if (!password) {
      document.getElementById("password-error").style.display = "block";
      isValid = false;
    }

    if (isValid) {
      // Send login request to backend
      fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (response.ok) {
            // Login successful
            document.getElementById("login-success").style.display = "block";

            // Store logged in user (Consider session/token based auth for real app)
            localStorage.setItem("loggedInUser", JSON.stringify(data.user));

            // Update UI
            updateUserUI(data.user);

            // Close modal and show welcome message
            setTimeout(() => {
              hideModal(document.getElementById("login-modal"));
              showNotification(
                "Welcome back!",
                `You're now logged in as ${data.user.username}`, // Using username from response
                "success"
              );
            }, 1000);
          } else {
            // Login failed
            showNotification(
              "Login Failed",
              data.message || "Invalid username or password",
              "error"
            );
          }
        })
        .catch((error) => {
          console.error("Error during login:", error);
          showNotification(
            "Login Error",
            "Failed to connect to server",
            "error"
          );
        });
    }
  });

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("new-username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    // Get name field if you added it to your signup form in HTML
    const name = document.getElementById("name")
      ? document.getElementById("name").value
      : ""; // Optional name field
    let isValid = true;

    // Reset errors
    document.getElementById("new-username-error").style.display = "none";
    document.getElementById("email-error").style.display = "none";
    document.getElementById("new-password-error").style.display = "none";
    document.getElementById("confirm-password-error").style.display = "none";
    document.getElementById("signup-success").style.display = "none"; // Hide success message on new submit
    if (document.getElementById("name-error"))
      document.getElementById("name-error").style.display = "none"; // Reset name error if present

    if (!username || username.length < 3) {
      document.getElementById("new-username-error").style.display = "block";
      isValid = false;
    }

    if (!email || !email.includes("@")) {
      document.getElementById("email-error").style.display = "block";
      isValid = false;
    }

    if (!password || password.length < 6) {
      document.getElementById("new-password-error").style.display = "block";
      isValid = false;
    }

    if (password !== confirmPassword) {
      document.getElementById("confirm-password-error").style.display = "block";
      isValid = false;
    }
    if (!name) {
      // Validate name if you decide to make it required in the frontend form
      if (document.getElementById("name-error"))
        document.getElementById("name-error").style.display = "block";
      isValid = false;
    }

    if (isValid) {
      // Send signup request to backend, include 'name' in body
      fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, name }), // Include name in signup request
      })
        .then((response) => response.json())
        .then((data) => {
          if (response.ok) {
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
          } else {
            // Signup failed
            document.getElementById("new-username-error").textContent =
              data.message || "Signup failed";
            document.getElementById("new-username-error").style.display =
              "block";
            showNotification(
              "Signup Failed",
              data.message || "Failed to create account",
              "error"
            );
          }
        })
        .catch((error) => {
          console.error("Error during signup:", error);
          showNotification(
            "Signup Error",
            "Failed to connect to server",
            "error"
          );
        });
    }
  });
};

// Update UI for logged in user (Slight change to use user.name from response)
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

  // Update avatar placeholder with user initials - using user.name now
  const initials = user.name
    ? user.name.substring(0, 2).toUpperCase()
    : user.username.substring(0, 2).toUpperCase(); // Fallback to username if name is missing
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

  // Logout functionality (No changes needed)
  document.getElementById("logout-btn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("loggedInUser");
    userMenu.style.display = "none";
    loginBtn.style.display = "block";
    userDropdown.classList.remove("active");
    showNotification(
      "Logged Out",
      "You have been logged out successfully",
      "info"
    );
  });
};

// Check if user is logged in (No changes needed)
const checkLoggedInStatus = () => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    updateUserUI(JSON.parse(loggedInUser));
  }
};

// Show notification (No changes needed)
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
