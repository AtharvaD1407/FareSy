document.addEventListener("DOMContentLoaded", () => {
  // API Configuration
  const API_URL = "http://localhost:3000/api";

  // DOM Elements
  const bookingIdElement = document.getElementById("booking-id");
  const bookingStatusElement = document.getElementById("booking-status");

  const userDetailsElements = {
    name: document.getElementById("user-name"),
    phone: document.getElementById("user-phone"),
    email: document.getElementById("user-email"),
  };
  const driverDetailsElements = {
    name: document.getElementById("driver-name"),
    rating: document.getElementById("driver-rating"),
    license: document.getElementById("driver-license"),
    phone: document.getElementById("driver-phone"),
    experience: document.getElementById("driver-experience"),
  };
  const cabDetailsElements = {
    model: document.getElementById("cab-model"),
    color: document.getElementById("cab-color"),
    plate: document.getElementById("cab-plate"),
    eta: document.getElementById("cab-eta"),
  };
  const tripDetailsElements = {
    pickupAddress: document.getElementById("pickup-address"),
    pickupTime: document.getElementById("pickup-time"),
    destinationAddress: document.getElementById("destination-address"),
    destinationTime: document.getElementById("destination-time"),
  };
  const paymentDetailsElements = {
    amount: document.getElementById("payment-amount"),
    status: document.getElementById("payment-status"),
    method: document.getElementById("payment-method"),
  };

  // Get booking details from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = urlParams.get("bookingId") || 1; // Default to 1 for demo
  const userId = urlParams.get("userId") || 1; // Default to 1 for demo

  // Initialize booking
  initializeBooking();

  async function initializeBooking() {
    try {
      // First try to get specific booking details if bookingId is provided
      if (bookingId) {
        const response = await fetch(`${API_URL}/booking/${bookingId}`);
        const data = await response.json();

        if (data.success) {
          updateBookingDetails(data.booking);
          return;
        }
      }

      // Fallback to getting user's most recent booking
      const response = await fetch(`${API_URL}/user-bookings/${userId}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      // Get the most recent booking
      if (data.bookings && data.bookings.length > 0) {
        const booking = data.bookings[0];
        updateBookingDetails(booking);
      } else {
        throw new Error("No bookings found for this user");
      }
    } catch (error) {
      console.error("Error initializing booking:", error);
      alert("Error loading booking details. Please try again.");
    }
  }

  function updateBookingDetails(booking) {
    // Update booking ID and status
    if (bookingIdElement) {
      bookingIdElement.textContent = `CAB${String(booking.id).padStart(
        5,
        "0"
      )}`;
    }
    if (bookingStatusElement) {
      bookingStatusElement.textContent =
        booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
      bookingStatusElement.className = `booking-status ${booking.status}`;
    }

    // Update user details
    if (userDetailsElements.name) {
      userDetailsElements.name.textContent =
        booking.user_name || "Not available";
    }
    if (userDetailsElements.email) {
      userDetailsElements.email.textContent =
        booking.user_email || "Not available";
    }
    if (userDetailsElements.phone) {
      userDetailsElements.phone.textContent = "0987654321"; // Placeholder as not in DB
    }

    // Update driver details
    if (driverDetailsElements.name) {
      driverDetailsElements.name.textContent =
        booking.driver_name || "Not assigned yet";
    }
    if (driverDetailsElements.license) {
      driverDetailsElements.license.textContent =
        booking.driver_license || "Not available";
    }
    if (driverDetailsElements.phone) {
      driverDetailsElements.phone.textContent =
        booking.driver_phone || "Not available";
    }
    if (driverDetailsElements.rating) {
      driverDetailsElements.rating.textContent = "4.5";
    }
    if (driverDetailsElements.experience) {
      driverDetailsElements.experience.textContent = "5 years";
    }

    // Update star rating
    const starsElement = document.querySelector(".stars");
    if (starsElement) {
      starsElement.textContent = "★".repeat(4) + "☆";
    }

    // Update cab details
    if (cabDetailsElements.model) {
      cabDetailsElements.model.textContent =
        booking.cab_model || "Not assigned yet";
    }
    if (cabDetailsElements.color) {
      cabDetailsElements.color.textContent =
        booking.cab_color || "Not available";
    }
    if (cabDetailsElements.plate) {
      cabDetailsElements.plate.textContent =
        booking.cab_plate || "Not available";
    }
    if (cabDetailsElements.eta) {
      cabDetailsElements.eta.textContent =
        Math.floor(Math.random() * 10) + 5 + " minutes";
    }

    // Update trip details
    if (tripDetailsElements.pickupAddress) {
      tripDetailsElements.pickupAddress.textContent = booking.pickup;
    }
    if (tripDetailsElements.destinationAddress) {
      tripDetailsElements.destinationAddress.textContent = booking.destination;
    }
    if (tripDetailsElements.pickupTime) {
      tripDetailsElements.pickupTime.textContent = formatDateTime(
        booking.date,
        booking.time
      );
    }
    if (tripDetailsElements.destinationTime) {
      tripDetailsElements.destinationTime.textContent = formatEstimatedArrival(
        booking.date,
        booking.time,
        45
      );
    }

    // Update payment details
    if (paymentDetailsElements.amount) {
      paymentDetailsElements.amount.textContent = booking.amount || "0.00";
    }
    if (paymentDetailsElements.status) {
      paymentDetailsElements.status.textContent = booking.payment_status
        ? booking.payment_status.charAt(0).toUpperCase() +
          booking.payment_status.slice(1)
        : "Pending";
    }
    if (paymentDetailsElements.method) {
      paymentDetailsElements.method.textContent = "Credit Card";
    }

    // Initialize map
    drawMap(booking.pickup, booking.destination);
  }

  // Event Listeners
  const contactDriverBtn = document.getElementById("contact-driver");
  if (contactDriverBtn) {
    contactDriverBtn.addEventListener("click", () => {
      const driverPhone = driverDetailsElements.phone.textContent;
      if (
        driverPhone &&
        driverPhone !== "Not available" &&
        driverPhone !== "Loading..."
      ) {
        alert(`Calling driver at ${driverPhone}`);
      } else {
        alert("Driver contact information is not available yet.");
      }
    });
  }

  const cancelBookingBtn = document.getElementById("cancel-booking");
  if (cancelBookingBtn) {
    cancelBookingBtn.addEventListener("click", async () => {
      if (confirm("Are you sure you want to cancel this booking?")) {
        try {
          const response = await fetch(
            `${API_URL}/update-booking/${bookingId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: "cancelled" }),
            }
          );

          const data = await response.json();
          if (data.success) {
            alert("Booking cancelled successfully");
            window.location.reload(); // Reload the page to show updated status
          } else {
            throw new Error(data.message);
          }
        } catch (error) {
          console.error("Error cancelling booking:", error);
          alert("Failed to cancel booking. Please try again.");
        }
      }
    });
  }

  const completeBookingBtn = document.getElementById("complete-booking");
  if (completeBookingBtn) {
    completeBookingBtn.addEventListener("click", async () => {
      if (confirm("Confirm that your ride is complete?")) {
        try {
          const response = await fetch(
            `${API_URL}/update-booking/${bookingId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: "completed" }),
            }
          );

          const data = await response.json();
          if (data.success) {
            alert(
              "Ride completed successfully! Thank you for using our service."
            );
            window.location.reload(); // Reload the page to show updated status
          } else {
            throw new Error(data.message);
          }
        } catch (error) {
          console.error("Error completing booking:", error);
          alert("Failed to complete booking. Please try again.");
        }
      }
    });
  }

  // Helper Functions
  function formatDateTime(date, time) {
    const datetime = new Date(`${date}T${time}`);
    return `Today, ${datetime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  function formatEstimatedArrival(date, time, minutesToAdd) {
    const datetime = new Date(`${date}T${time}`);
    datetime.setMinutes(datetime.getMinutes() + minutesToAdd);
    return `Today, ${datetime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} (estimated)`;
  }

  // Map Functions
  function drawMap(pickup, destination) {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    const canvas = document.createElement("canvas");
    canvas.width = mapElement.clientWidth || 600;
    canvas.height = mapElement.clientHeight || 300;
    mapElement.innerHTML = "";
    mapElement.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    // Set crossOrigin to avoid CORS issues with images
    ctx.canvas.crossOrigin = "anonymous";

    // Draw map background
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw city grid
    drawCityGrid(ctx, canvas.width, canvas.height);

    // Calculate points for pickup and destination
    const pickupPoint = getPointFromString(pickup, canvas.width, canvas.height);
    const destPoint = getPointFromString(
      destination,
      canvas.width,
      canvas.height
    );

    // Draw route
    drawRoute(ctx, pickupPoint, destPoint);

    // Draw points
    drawMapPoint(ctx, pickupPoint.x, pickupPoint.y, "#00b894", "A");
    drawMapPoint(ctx, destPoint.x, destPoint.y, "#ff7675", "B");

    // Add labels
    addMapLabels(ctx, pickupPoint, destPoint, pickup, destination);
  }

  function drawCityGrid(ctx, width, height) {
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 6;

    // Horizontal roads
    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * (height / 6));
      ctx.lineTo(width, i * (height / 6));
      ctx.stroke();
    }

    // Vertical roads
    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(i * (width / 6), 0);
      ctx.lineTo(i * (width / 6), height);
      ctx.stroke();
    }

    // Secondary roads
    ctx.strokeStyle = "#222222";
    ctx.lineWidth = 2;

    for (let i = 1; i < 12; i++) {
      if (i % 2 !== 0) {
        ctx.beginPath();
        ctx.moveTo(0, i * (height / 12));
        ctx.lineTo(width, i * (height / 12));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i * (width / 12), 0);
        ctx.lineTo(i * (width / 12), height);
        ctx.stroke();
      }
    }

    // Add buildings
    ctx.fillStyle = "#2a2a2a";
    const blockSize = width / 12;

    for (let x = 0; x < 12; x++) {
      for (let y = 0; y < 12; y++) {
        if (x % 2 === 1 && y % 2 === 1) {
          const blockX = x * blockSize;
          const blockY = y * blockSize;
          const blockW = blockSize * 0.8;
          const blockH = blockSize * 0.8;

          ctx.fillRect(
            blockX + (blockSize - blockW) / 2,
            blockY + (blockSize - blockH) / 2,
            blockW,
            blockH
          );
        }
      }
    }
  }

  function drawRoute(ctx, start, end) {
    ctx.strokeStyle = "#6c5ce7";
    ctx.lineWidth = 4;
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);

    const waypoints = createWaypoints(start, end);

    for (const point of waypoints) {
      ctx.lineTo(point.x, point.y);
    }

    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    addDirectionArrows(ctx, start, waypoints, end);
  }

  function createWaypoints(start, end) {
    return [
      {
        x: start.x + (end.x - start.x) * 0.7,
        y: start.y,
      },
      {
        x: start.x + (end.x - start.x) * 0.7,
        y: start.y + (end.y - start.y) * 0.8,
      },
      {
        x: end.x,
        y: start.y + (end.y - start.y) * 0.8,
      },
    ];
  }

  function addDirectionArrows(ctx, start, waypoints, end) {
    const points = [start, ...waypoints, end];

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      const midX = (current.x + next.x) / 2;
      const midY = (current.y + next.y) / 2;
      const angle = Math.atan2(next.y - current.y, next.x - current.x);

      ctx.save();
      ctx.translate(midX, midY);
      ctx.rotate(angle);

      ctx.fillStyle = "#a29bfe";
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(-4, 4);
      ctx.lineTo(-4, -4);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  function drawMapPoint(ctx, x, y, color, label) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y);

    if (color === "#00b894") {
      drawPulseEffect(ctx, x, y, color);
    }
  }

  function drawPulseEffect(ctx, x, y, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    for (let i = 1; i <= 3; i++) {
      const radius = 12 + i * 8;
      const alpha = 0.4 - i * 0.1;

      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  }

  function addMapLabels(
    ctx,
    pickupPoint,
    destPoint,
    pickupAddress,
    destAddress
  ) {
    // Pickup label
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(pickupPoint.x - 80, pickupPoint.y - 45, 160, 30);

    ctx.fillStyle = "#e0e0e0";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      shortenAddress(pickupAddress),
      pickupPoint.x,
      pickupPoint.y - 30
    );

    // Destination label
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(destPoint.x - 80, destPoint.y + 15, 160, 30);

    ctx.fillStyle = "#e0e0e0";
    ctx.fillText(shortenAddress(destAddress), destPoint.x, destPoint.y + 30);

    // Distance and time estimate
    const distance = calculateDistance(pickupPoint, destPoint);
    const time = Math.round((distance / 50) * 10);

    ctx.fillStyle = "rgba(40, 40, 40, 0.9)";
    ctx.fillRect(10, 10, 180, 50);

    ctx.fillStyle = "#e0e0e0";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Distance: ${(distance / 100).toFixed(1)} km`, 20, 30);
    ctx.fillText(`Est. travel time: ${time} min`, 20, 50);
  }

  function shortenAddress(address) {
    return address.length > 25 ? address.substring(0, 22) + "..." : address;
  }

  function calculateDistance(point1, point2) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function getPointFromString(str, maxWidth, maxHeight) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const margin = 60;
    const x = margin + Math.abs(hash % (maxWidth - 2 * margin));
    const y = margin + Math.abs((hash >> 8) % (maxHeight - 2 * margin));

    return { x, y };
  }
});
