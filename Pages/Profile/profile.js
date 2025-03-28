document.addEventListener("DOMContentLoaded", function () {
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
    });
  });

  // Dark mode toggle
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("change", function () {
      if (this.checked) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    });
  }

  // Edit profile button
  const editProfileBtn = document.getElementById("edit-profile");
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", function () {
      alert(
        "Edit profile functionality would open a modal or navigate to an edit page."
      );
    });
  }

  // Save preferences button
  const savePreferencesBtn = document.getElementById("save-preferences-btn");
  if (savePreferencesBtn) {
    savePreferencesBtn.addEventListener("click", function () {
      alert("Preferences saved successfully!");
    });
  }

  // Add payment method button
  const addPaymentBtn = document.getElementById("add-payment-method");
  if (addPaymentBtn) {
    addPaymentBtn.addEventListener("click", function () {
      alert("Add payment method functionality would open a modal.");
    });
  }

  // Add saved place button
  const addPlaceBtn = document.getElementById("add-saved-place");
  if (addPlaceBtn) {
    addPlaceBtn.addEventListener("click", function () {
      alert("Add saved place functionality would open a modal.");
    });
  }

  // Load user data
  loadUserData();

  // Load ride history
  loadRideHistory();

  // Load payment methods
  loadPaymentMethods();

  // Load saved places
  loadSavedPlaces();

  // Function to load user data
  function loadUserData() {
    // In a real app, this would fetch data from an API
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      fullName: "John Michael Doe",
      dob: "January 15, 1985",
      address: "123 Main Street, Apt 4B, Cityville, NY 10001",
      emergency: "Jane Doe - +1 (555) 987-6543",
      totalRides: 24,
      memberSince: "2023",
      savedPlaces: 5,
    };

    // Populate user data in the UI
    document.getElementById("user-name").textContent = userData.name;
    document.getElementById("user-email").textContent = userData.email;
    document.getElementById("full-name").textContent = userData.fullName;
    document.getElementById("phone-number").textContent = userData.phone;
    document.getElementById("email-address").textContent = userData.email;
    document.getElementById("date-of-birth").textContent = userData.dob;
    document.getElementById("home-address").textContent = userData.address;
    document.getElementById("emergency-contact").textContent =
      userData.emergency;
    document.getElementById("total-rides").textContent = userData.totalRides;
    document.getElementById("member-since").textContent = userData.memberSince;
    document.getElementById("saved-places").textContent = userData.savedPlaces;
  }

  // Function to load ride history
  function loadRideHistory() {
    // In a real app, this would fetch data from an API
    const rides = [
      {
        id: "R12345",
        date: "March 25, 2025",
        pickup: "123 Main Street",
        destination: "456 Park Avenue",
        driver: "Michael Chen",
        price: "$24.50",
        status: "completed",
        distance: "5.2 miles",
        duration: "18 mins",
      },
      {
        id: "R12346",
        date: "March 22, 2025",
        pickup: "789 Broadway",
        destination: "101 Fifth Avenue",
        driver: "Sarah Johnson",
        price: "$18.75",
        status: "completed",
        distance: "3.8 miles",
        duration: "15 mins",
      },
      {
        id: "R12347",
        date: "March 20, 2025",
        pickup: "222 West Street",
        destination: "333 East Avenue",
        driver: "David Wilson",
        price: "$32.00",
        status: "cancelled",
        distance: "7.5 miles",
        duration: "25 mins",
      },
      {
        id: "R12348",
        date: "March 18, 2025",
        pickup: "444 North Road",
        destination: "555 South Boulevard",
        driver: "Emily Davis",
        price: "$15.25",
        status: "completed",
        distance: "2.9 miles",
        duration: "12 mins",
      },
      {
        id: "R12349",
        date: "March 15, 2025",
        pickup: "666 Maple Street",
        destination: "777 Oak Avenue",
        driver: "Robert Brown",
        price: "$28.50",
        status: "completed",
        distance: "6.3 miles",
        duration: "22 mins",
      },
    ];

    // Get the container
    const ridesContainer = document.getElementById("rides-container");
    if (!ridesContainer) return;

    // Clear the container
    ridesContainer.innerHTML = "";

    // Add rides to the container
    rides.forEach((ride) => {
      const rideElement = document.createElement("div");
      rideElement.className = "ride-item";

      rideElement.innerHTML = `
                <div class="ride-details">
                    <div class="ride-date">${ride.date}</div>
                    <div class="ride-route">${ride.pickup} → ${
        ride.destination
      }</div>
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
  }

  // Function to load payment methods
  function loadPaymentMethods() {
    // In a real app, this would fetch data from an API
    const paymentMethods = [
      {
        id: "P12345",
        type: "Visa",
        number: "**** **** **** 4567",
        holder: "John Doe",
        expiry: "05/27",
        isDefault: true,
      },
      {
        id: "P12346",
        type: "Mastercard",
        number: "**** **** **** 8901",
        holder: "John Doe",
        expiry: "09/26",
        isDefault: false,
      },
      {
        id: "P12347",
        type: "American Express",
        number: "**** ****** 61234",
        holder: "John Doe",
        expiry: "12/25",
        isDefault: false,
      },
    ];

    // Get the container
    const paymentCardsContainer = document.getElementById(
      "payment-cards-container"
    );
    if (!paymentCardsContainer) return;

    // Clear the container
    paymentCardsContainer.innerHTML = "";

    // Add payment methods to the container
    paymentMethods.forEach((payment) => {
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
                      payment.isDefault
                        ? '<div class="card-default">Default</div>'
                        : ""
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
      button.addEventListener("click", function () {
        alert("Edit payment method functionality would open a modal.");
      });
    });

    document.querySelectorAll(".card-delete").forEach((button) => {
      button.addEventListener("click", function () {
        if (confirm("Are you sure you want to delete this payment method?")) {
          alert("Payment method deleted successfully!");
          // In a real app, this would send a request to the server
          // and then remove the element from the DOM
        }
      });
    });
  }

  // Function to load saved places
  function loadSavedPlaces() {
    // In a real app, this would fetch data from an API
    const savedPlaces = [
      {
        id: "SP12345",
        name: "Home",
        address: "123 Main Street, Apt 4B, Cityville, NY 10001",
        icon: "🏠",
      },
      {
        id: "SP12346",
        name: "Work",
        address: "456 Corporate Plaza, 20th Floor, Cityville, NY 10002",
        icon: "💼",
      },
      {
        id: "SP12347",
        name: "Gym",
        address: "FitLife Center, 789 Health Street, Cityville, NY 10003",
        icon: "💪",
      },
      {
        id: "SP12348",
        name: "Parents",
        address: "321 Family Road, Hometown, NY 10567",
        icon: "👪",
      },
      {
        id: "SP12349",
        name: "Favorite Restaurant",
        address: "Gourmet Delight, 555 Taste Avenue, Cityville, NY 10004",
        icon: "🍽️",
      },
    ];

    // Get the container
    const savedPlacesContainer = document.getElementById(
      "saved-places-container"
    );
    if (!savedPlacesContainer) return;

    // Clear the container
    savedPlacesContainer.innerHTML = "";

    // Add saved places to the container
    savedPlaces.forEach((place) => {
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
      button.addEventListener("click", function () {
        alert("Edit saved place functionality would open a modal.");
      });
    });

    document.querySelectorAll(".place-delete").forEach((button) => {
      button.addEventListener("click", function () {
        if (confirm("Are you sure you want to delete this saved place?")) {
          alert("Saved place deleted successfully!");
          // In a real app, this would send a request to the server
          // and then remove the element from the DOM
        }
      });
    });
  }
});
