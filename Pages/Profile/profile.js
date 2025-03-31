document.addEventListener("DOMContentLoaded", () => {
  // API Configuration
  const API_URL = "http://localhost:3000/api";

  // Current user ID - in a real app, this would come from a session or token
  // For demo purposes, we'll use a fixed ID or get it from localStorage
  let currentUserId = localStorage.getItem("userId") || 1;

  // Check if user is logged in
  checkLoginStatus();

  // Tab switching functionality
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Show corresponding content
      const tabId = this.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");

      // Load content for the selected tab if needed
      if (tabId === "ride-history") {
        loadRideHistory();
      } else if (tabId === "payment-methods") {
        loadPaymentMethods();
      } else if (tabId === "saved-places") {
        loadSavedPlaces();
      }
    });
  });

  // Dark mode toggle
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("change", function () {
      if (this.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
      }
    });

    // Set initial state based on localStorage
    const savedTheme = localStorage.getItem("theme") || "dark";
    darkModeToggle.checked = savedTheme === "dark";
    if (savedTheme === "light") {
      document.body.classList.remove("dark-mode");
    }
  }

  // Edit profile button
  const editProfileBtn = document.getElementById("edit-profile");
  const editProfileModal = document.getElementById("edit-profile-modal");
  const closeModalBtn = document.querySelector(".close-modal");
  const cancelBtn = document.querySelector(".cancel-btn");

  if (editProfileBtn && editProfileModal) {
    editProfileBtn.addEventListener("click", () => {
      // Populate form with current user data
      document.getElementById("edit-full-name").value =
        document.getElementById("full-name").textContent;
      document.getElementById("edit-email").value =
        document.getElementById("email-address").textContent;
      document.getElementById("edit-phone").value =
        document.getElementById("phone-number").textContent;
      document.getElementById("edit-address").value =
        document.getElementById("home-address").textContent;
      document.getElementById("edit-emergency").value =
        document.getElementById("emergency-contact").textContent;

      // Show modal
      editProfileModal.style.display = "block";
    });

    // Close modal functions
    function closeModal() {
      editProfileModal.style.display = "none";
    }

    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    // Close when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target === editProfileModal) {
        closeModal();
      }
    });

    // Handle form submission
    const editProfileForm = document.getElementById("edit-profile-form");
    if (editProfileForm) {
      editProfileForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = {
          username: document.getElementById("edit-full-name").value,
          email: document.getElementById("edit-email").value,
          phone: document.getElementById("edit-phone").value,
          address: document.getElementById("edit-address").value,
          emergency: document.getElementById("edit-emergency").value,
        };

        try {
          const response = await fetch(
            `${API_URL}/update-user-profile/${currentUserId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            }
          );

          const data = await response.json();

          if (data.success) {
            showNotification(
              "Success",
              "Profile updated successfully",
              "success"
            );
            closeModal();
            loadUserProfile(); // Reload user data
          } else {
            throw new Error(data.message || "Failed to update profile");
          }
        } catch (error) {
          showNotification("Error", error.message, "error");
        }
      });
    }
  }

  // Save preferences button
  const savePreferencesBtn = document.getElementById("save-preferences-btn");
  if (savePreferencesBtn) {
    savePreferencesBtn.addEventListener("click", async () => {
      const preferences = {
        user_id: currentUserId,
        preferred_cab_model:
          document.getElementById("preferred-car-type").value,
        preferred_seating_capacity: 4, // Default value
        app_settings: {
          darkMode: document.getElementById("dark-mode-toggle").checked,
          notifications: document.getElementById("notifications-toggle")
            .checked,
          emailReceipts: document.getElementById("email-receipts-toggle")
            .checked,
        },
        ride_preferences: {
          quietRides: document.getElementById("quiet-rides-toggle").checked,
          temperature: document.getElementById("temperature-slider").value,
        },
        privacy_settings: {
          shareRideStatus: document.getElementById("share-ride-toggle").checked,
          locationServices: document.getElementById("location-toggle").checked,
          dataAnalytics: document.getElementById("analytics-toggle").checked,
        },
      };

      try {
        const response = await fetch(`${API_URL}/update-preferences`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preferences),
        });

        const data = await response.json();

        if (data.success) {
          showNotification(
            "Success",
            "Preferences saved successfully",
            "success"
          );
        } else {
          throw new Error(data.message || "Failed to save preferences");
        }
      } catch (error) {
        showNotification("Error", error.message, "error");
      }
    });
  }

  // Add payment method button
  const addPaymentBtn = document.getElementById("add-payment-method");
  if (addPaymentBtn) {
    addPaymentBtn.addEventListener("click", () => {
      showNotification(
        "Info",
        "Payment method functionality would open a modal",
        "info"
      );
    });
  }

  // Add saved place button
  const addPlaceBtn = document.getElementById("add-saved-place");
  if (addPlaceBtn) {
    addPlaceBtn.addEventListener("click", () => {
      showNotification(
        "Info",
        "Add saved place functionality would open a modal",
        "info"
      );
    });
  }

  // Logout button
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        const response = await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          // Clear user data from localStorage
          localStorage.removeItem("userId");
          localStorage.removeItem("username");

          // Redirect to home page
          window.location.href = "/";
        } else {
          throw new Error(data.message || "Failed to logout");
        }
      } catch (error) {
        showNotification("Error", error.message, "error");
      }
    });
  }

  // Initialize the page
  loadUserProfile();

  // Filter ride history
  const timeFilter = document.getElementById("time-filter");
  const statusFilter = document.getElementById("status-filter");
  const searchInput = document.getElementById("search-rides");
  const searchBtn = document.getElementById("search-btn");

  if (timeFilter && statusFilter) {
    timeFilter.addEventListener("change", loadRideHistory);
    statusFilter.addEventListener("change", loadRideHistory);
  }

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => {
      loadRideHistory(searchInput.value);
    });

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        loadRideHistory(searchInput.value);
      }
    });
  }

  // Function to check login status
  async function checkLoginStatus() {
    try {
      // In a real app, this would verify the user's session/token
      // For demo purposes, we'll check if userId exists in localStorage
      if (!localStorage.getItem("userId")) {
        // If no userId in localStorage, try to get it from the API
        const response = await fetch(`${API_URL}/check-login`);
        const data = await response.json();

        if (data.success) {
          // User is logged in
          currentUserId = data.user.id;
          localStorage.setItem("userId", currentUserId);
          localStorage.setItem("username", data.user.username);
        } else {
          // User is not logged in, redirect to login page
          showNotification(
            "Warning",
            "Please log in to view your profile",
            "warning"
          );
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  }

  // Function to load user profile data
  async function loadUserProfile() {
    try {
      const response = await fetch(`${API_URL}/user-profile/${currentUserId}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load user profile");
      }

      const profile = data.profile;

      // Update user data in the UI
      document.getElementById("user-name").textContent = profile.username;
      document.getElementById("user-email").textContent = profile.email;
      document.getElementById("full-name").textContent = profile.username;
      document.getElementById("email-address").textContent = profile.email;
      document.getElementById("total-rides").textContent = profile.totalRides;
      document.getElementById("member-since").textContent = profile.memberSince;
      document.getElementById("saved-places").textContent = profile.savedPlaces;

      // Set avatar with user initials
      const profileAvatar = document.getElementById("profile-avatar");
      if (profileAvatar) {
        const initials = profile.username
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();
        profileAvatar.innerHTML = `<div class="avatar-initials">${initials}</div>`;
      }

      // Set placeholder data for fields not in the database
      document.getElementById("phone-number").textContent = "0987654321";
      document.getElementById("date-of-birth").textContent = "January 14, 2005";
      document.getElementById("home-address").textContent =
        "Hyde Park, Kharghar, Navi Mumbai";
      document.getElementById("emergency-contact").textContent =
        "Elon Musk - 0987654321";

      // Load other sections
      loadRideHistory();
      loadPaymentMethods();
      loadSavedPlaces();
    } catch (error) {
      console.error("Error loading user profile:", error);
      showNotification("Error", error.message, "error");
    }
  }

  // Function to load ride history
  async function loadRideHistory(searchTerm = "") {
    const ridesContainer = document.getElementById("rides-container");
    if (!ridesContainer) return;

    // Show loading indicator
    ridesContainer.innerHTML =
      '<div class="loading-indicator">Loading ride history...</div>';

    try {
      // Get filter values
      const timeFilterValue = document.getElementById("time-filter").value;
      const statusFilterValue = document.getElementById("status-filter").value;

      // Build query parameters
      const queryParams = new URLSearchParams({
        timeFilter: timeFilterValue,
        status: statusFilterValue,
      });

      if (searchTerm) {
        queryParams.append("search", searchTerm);
      }

      const response = await fetch(
        `${API_URL}/user-ride-history/${currentUserId}?${queryParams}`
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load ride history");
      }

      // Clear the container
      ridesContainer.innerHTML = "";

      if (data.rides.length === 0) {
        ridesContainer.innerHTML =
          '<div class="no-data">No ride history found</div>';
        return;
      }

      // Add rides to the container
      data.rides.forEach((ride) => {
        const rideElement = document.createElement("div");
        rideElement.className = "ride-item";

        rideElement.innerHTML = `
          <div class="ride-details">
            <div class="ride-date">${ride.date}</div>
            <div class="ride-route">${ride.pickup} → ${ride.destination}</div>
            <div class="ride-info">
              <span>Driver: ${ride.driver}</span>
              <span>${ride.distance}</span>
              <span>${ride.duration}</span>
            </div>
          </div>
          <div class="ride-status status-${ride.status}">${
          ride.status.charAt(0).toUpperCase() + ride.status.slice(1)
        }</div>
          <div class="ride-price">${ride.price}</div>
        `;

        ridesContainer.appendChild(rideElement);
      });
    } catch (error) {
      console.error("Error loading ride history:", error);
      ridesContainer.innerHTML = `<div class="error-message">Error loading ride history: ${error.message}</div>`;
    }
  }

  // Function to load payment methods
  async function loadPaymentMethods() {
    const paymentCardsContainer = document.getElementById(
      "payment-cards-container"
    );
    if (!paymentCardsContainer) return;

    // Show loading indicator
    paymentCardsContainer.innerHTML =
      '<div class="loading-indicator">Loading payment methods...</div>';

    try {
      const response = await fetch(
        `${API_URL}/user-payment-methods/${currentUserId}`
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load payment methods");
      }

      // Clear the container
      paymentCardsContainer.innerHTML = "";

      if (data.paymentMethods.length === 0) {
        paymentCardsContainer.innerHTML =
          '<div class="no-data">No payment methods found</div>';
        return;
      }

      // Add payment methods to the container
      data.paymentMethods.forEach((payment) => {
        const paymentElement = document.createElement("div");
        paymentElement.className = "payment-card";

        paymentElement.innerHTML = `
          <div class="card-type">${payment.type}</div>
          <div class="card-number">${payment.number}</div>
          <div class="card-info">
            <div class="card-holder">${payment.holder}</div>
            <div class="card-expiry">Expires: ${payment.expiry}</div>
          </div>
          <div class="card-actions">
            ${
              payment.isDefault ? '<div class="card-default">Default</div>' : ""
            }
            <div>
              <button class="card-edit">Edit</button>
              <button class="card-delete">Delete</button>
            </div>
          </div>
        `;

        paymentCardsContainer.appendChild(paymentElement);
      });

      // Add event listeners to edit and delete buttons
      document.querySelectorAll(".card-edit").forEach((button) => {
        button.addEventListener("click", () => {
          showNotification(
            "Info",
            "Edit payment method functionality would open a modal",
            "info"
          );
        });
      });

      document.querySelectorAll(".card-delete").forEach((button) => {
        button.addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this payment method?")) {
            showNotification(
              "Success",
              "Payment method deleted successfully!",
              "success"
            );
            // In a real app, this would send a request to the server
            // and then remove the element from the DOM
          }
        });
      });
    } catch (error) {
      console.error("Error loading payment methods:", error);
      paymentCardsContainer.innerHTML = `<div class="error-message">Error loading payment methods: ${error.message}</div>`;
    }
  }

  // Function to load saved places
  async function loadSavedPlaces() {
    const savedPlacesContainer = document.getElementById(
      "saved-places-container"
    );
    if (!savedPlacesContainer) return;

    // Show loading indicator
    savedPlacesContainer.innerHTML =
      '<div class="loading-indicator">Loading saved places...</div>';

    try {
      const response = await fetch(
        `${API_URL}/user-saved-places/${currentUserId}`
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load saved places");
      }

      // Clear the container
      savedPlacesContainer.innerHTML = "";

      if (data.savedPlaces.length === 0) {
        savedPlacesContainer.innerHTML =
          '<div class="no-data">No saved places found</div>';
        return;
      }

      // Add saved places to the container
      data.savedPlaces.forEach((place) => {
        const placeElement = document.createElement("div");
        placeElement.className = "saved-place";

        placeElement.innerHTML = `
          <div class="place-icon"><span>${place.icon}</span></div>
          <div class="place-name">${place.name}</div>
          <div class="place-address">${place.address}</div>
          <div class="place-actions">
            <button class="place-edit">Edit</button>
            <button class="place-delete">Delete</button>
          </div>
        `;

        savedPlacesContainer.appendChild(placeElement);
      });

      // Add event listeners to edit and delete buttons
      document.querySelectorAll(".place-edit").forEach((button) => {
        button.addEventListener("click", () => {
          showNotification(
            "Info",
            "Edit saved place functionality would open a modal",
            "info"
          );
        });
      });

      document.querySelectorAll(".place-delete").forEach((button) => {
        button.addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this saved place?")) {
            showNotification(
              "Success",
              "Saved place deleted successfully!",
              "success"
            );
            // In a real app, this would send a request to the server
            // and then remove the element from the DOM
          }
        });
      });
    } catch (error) {
      console.error("Error loading saved places:", error);
      savedPlacesContainer.innerHTML = `<div class="error-message">Error loading saved places: ${error.message}</div>`;
    }
  }

  // Function to show notification
  function showNotification(title, message, type = "info") {
    const notification = document.getElementById("notification");
    const notificationTitle = notification.querySelector(".notification-title");
    const notificationMessage = notification.querySelector(
      ".notification-message"
    );
    const notificationIcon = notification.querySelector(
      ".notification-icon svg"
    );

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
  }
});
