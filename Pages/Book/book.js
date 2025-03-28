document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const bookingForm = document.getElementById("booking-form");
  const bookingSection = document.getElementById("booking-section");
  const confirmationSection = document.getElementById("confirmation-section");
  const userDetailsContent = document.querySelector(
    "#user-details .details-content"
  );
  const driverDetailsContent = document.querySelector(
    "#driver-details .details-content"
  );
  const cabDetailsContent = document.querySelector(
    "#cab-details .details-content"
  );
  const newBookingBtn = document.getElementById("new-booking");
  const mapElement = document.getElementById("map");
  const contactDriverBtn = document.getElementById("contact-driver");
  const cancelBookingBtn = document.getElementById("cancel-booking");

  // Sample booking data (in a real app, this would come from a server or localStorage)
  const bookingData = {
    id: "CAB" + Math.floor(Math.random() * 90000) + 10000,
    user: {
      name: "John Doe",
      phone: "555-123-4567",
      email: "john.doe@example.com",
    },
    driver: {
      name: "Michael Chen",
      rating: 4.8,
      license: "DL-" + Math.floor(Math.random() * 900000) + 100000,
      phone: "555-987-6543",
      experience: "5 years",
    },
    cab: {
      model: "Toyota Camry",
      color: "White",
      plate: "ABC " + Math.floor(Math.random() * 900) + 100,
      eta: Math.floor(Math.random() * 10) + 5 + " minutes",
    },
    trip: {
      pickup: {
        address: "123 Main Street, Cityville",
        time: formatTime(new Date()),
      },
      destination: {
        address: "456 Park Avenue, Townsville",
        time: formatEstimatedArrival(new Date(), 45),
      },
    },
  };

  // Populate the page with booking data
  populateBookingDetails(bookingData);

  // Draw the map
  drawMap(
    bookingData.trip.pickup.address,
    bookingData.trip.destination.address
  );

  // Add event listeners
  if (contactDriverBtn) {
    contactDriverBtn.addEventListener("click", function () {
      alert(
        `Calling driver: ${bookingData.driver.name} at ${bookingData.driver.phone}`
      );
    });
  }

  if (cancelBookingBtn) {
    cancelBookingBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to cancel this booking?")) {
        alert("Booking cancelled successfully.");
        // In a real app, this would redirect to another page or update the UI
      }
    });
  }

  // Helper function to populate booking details
  function populateBookingDetails(data) {
    // Booking ID
    const bookingIdElement = document.getElementById("booking-id");
    if (bookingIdElement) bookingIdElement.textContent = data.id;

    // User details
    const userNameElement = document.getElementById("user-name");
    const userPhoneElement = document.getElementById("user-phone");
    const userEmailElement = document.getElementById("user-email");

    if (userNameElement) userNameElement.textContent = data.user.name;
    if (userPhoneElement) userPhoneElement.textContent = data.user.phone;
    if (userEmailElement) userEmailElement.textContent = data.user.email;

    // Driver details
    const driverNameElement = document.getElementById("driver-name");
    const driverRatingElement = document.getElementById("driver-rating");
    const driverLicenseElement = document.getElementById("driver-license");
    const driverPhoneElement = document.getElementById("driver-phone");
    const driverExperienceElement =
      document.getElementById("driver-experience");

    if (driverNameElement) driverNameElement.textContent = data.driver.name;
    if (driverRatingElement)
      driverRatingElement.textContent = data.driver.rating;
    if (driverLicenseElement)
      driverLicenseElement.textContent = data.driver.license;
    if (driverPhoneElement) driverPhoneElement.textContent = data.driver.phone;
    if (driverExperienceElement)
      driverExperienceElement.textContent = data.driver.experience;

    // Cab details
    const cabModelElement = document.getElementById("cab-model");
    const cabColorElement = document.getElementById("cab-color");
    const cabPlateElement = document.getElementById("cab-plate");
    const cabEtaElement = document.getElementById("cab-eta");

    if (cabModelElement) cabModelElement.textContent = data.cab.model;
    if (cabColorElement) cabColorElement.textContent = data.cab.color;
    if (cabPlateElement) cabPlateElement.textContent = data.cab.plate;
    if (cabEtaElement) cabEtaElement.textContent = data.cab.eta;

    // Trip details
    const pickupAddressElement = document.getElementById("pickup-address");
    const pickupTimeElement = document.getElementById("pickup-time");
    const destinationAddressElement = document.getElementById(
      "destination-address"
    );
    const destinationTimeElement = document.getElementById("destination-time");

    if (pickupAddressElement)
      pickupAddressElement.textContent = data.trip.pickup.address;
    if (pickupTimeElement)
      pickupTimeElement.textContent = data.trip.pickup.time;
    if (destinationAddressElement)
      destinationAddressElement.textContent = data.trip.destination.address;
    if (destinationTimeElement)
      destinationTimeElement.textContent = data.trip.destination.time;

    // Adjust star rating display
    const starsElement = document.querySelector(".stars");
    if (starsElement) {
      const fullStars = Math.floor(data.driver.rating);
      const hasHalfStar = data.driver.rating % 1 >= 0.5;

      let starsHTML = "★".repeat(fullStars);
      if (hasHalfStar) {
        starsHTML += "☆";
      }
      starsHTML += "☆".repeat(5 - fullStars - (hasHalfStar ? 1 : 0));

      starsElement.textContent = starsHTML;
    }
  }

  // Helper function to format current time
  function formatTime(date) {
    const today = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return `Today, ${date.toLocaleTimeString(undefined, options)}`;
  }

  // Helper function to calculate and format estimated arrival time
  function formatEstimatedArrival(date, minutesToAdd) {
    const arrivalTime = new Date(date.getTime() + minutesToAdd * 60000);
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return `Today, ${arrivalTime.toLocaleTimeString(
      undefined,
      options
    )} (estimated)`;
  }

  // Draw a map showing the route
  function drawMap(pickupAddress, destinationAddress) {
    if (!mapElement) return;

    const canvas = document.createElement("canvas");
    canvas.width = mapElement.clientWidth;
    canvas.height = mapElement.clientHeight;
    mapElement.innerHTML = "";
    mapElement.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    // Draw map background (dark mode)
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw city grid (dark mode)
    drawCityGrid(ctx, canvas.width, canvas.height);

    // Calculate points for pickup and destination
    const pickupPoint = getPointFromString(
      pickupAddress,
      canvas.width,
      canvas.height
    );
    const destPoint = getPointFromString(
      destinationAddress,
      canvas.width,
      canvas.height
    );

    // Draw route
    drawRoute(ctx, pickupPoint, destPoint);

    // Draw pickup point
    drawMapPoint(ctx, pickupPoint.x, pickupPoint.y, "#00b894", "A");

    // Draw destination point
    drawMapPoint(ctx, destPoint.x, destPoint.y, "#ff7675", "B");

    // Add labels
    addMapLabels(
      ctx,
      pickupPoint,
      destPoint,
      pickupAddress,
      destinationAddress
    );
  }

  // Draw city grid (dark mode version)
  function drawCityGrid(ctx, width, height) {
    // Draw main roads
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

    // Draw secondary roads
    ctx.strokeStyle = "#222222";
    ctx.lineWidth = 2;

    // Horizontal secondary roads
    for (let i = 1; i < 12; i++) {
      if (i % 2 !== 0) {
        // Skip where main roads are
        ctx.beginPath();
        ctx.moveTo(0, i * (height / 12));
        ctx.lineTo(width, i * (height / 12));
        ctx.stroke();
      }
    }

    // Vertical secondary roads
    for (let i = 1; i < 12; i++) {
      if (i % 2 !== 0) {
        // Skip where main roads are
        ctx.beginPath();
        ctx.moveTo(i * (width / 12), 0);
        ctx.lineTo(i * (width / 12), height);
        ctx.stroke();
      }
    }

    // Add some buildings (blocks) - darker for dark mode
    ctx.fillStyle = "#2a2a2a";
    const blockSize = width / 12;

    for (let x = 0; x < 12; x++) {
      for (let y = 0; y < 12; y++) {
        // Skip road intersections
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

  // Draw route between two points
  function drawRoute(ctx, start, end) {
    // Draw route path
    ctx.strokeStyle = "#6c5ce7"; // Purple for dark mode
    ctx.lineWidth = 4;
    ctx.setLineDash([]);

    // Create a path with multiple segments to follow the grid
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);

    // Create waypoints to follow the grid
    const waypoints = createWaypoints(start, end);

    // Draw path through waypoints
    for (const point of waypoints) {
      ctx.lineTo(point.x, point.y);
    }

    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    // Add direction arrows
    addDirectionArrows(ctx, start, waypoints, end);
  }

  // Create waypoints that follow the city grid
  function createWaypoints(start, end) {
    const waypoints = [];

    // Simple algorithm to create a path that follows horizontal then vertical
    // In a real app, this would use a pathfinding algorithm

    // First go horizontally most of the way
    waypoints.push({
      x: start.x + (end.x - start.x) * 0.7,
      y: start.y,
    });

    // Then go vertically
    waypoints.push({
      x: start.x + (end.x - start.x) * 0.7,
      y: start.y + (end.y - start.y) * 0.8,
    });

    // Then go horizontally again
    waypoints.push({
      x: end.x,
      y: start.y + (end.y - start.y) * 0.8,
    });

    return waypoints;
  }

  // Add direction arrows along the route
  function addDirectionArrows(ctx, start, waypoints, end) {
    const points = [start, ...waypoints, end];

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      // Calculate midpoint
      const midX = (current.x + next.x) / 2;
      const midY = (current.y + next.y) / 2;

      // Calculate angle
      const angle = Math.atan2(next.y - current.y, next.x - current.x);

      // Draw arrow
      ctx.save();
      ctx.translate(midX, midY);
      ctx.rotate(angle);

      ctx.fillStyle = "#a29bfe"; // Lighter purple for dark mode
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(-4, 4);
      ctx.lineTo(-4, -4);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  // Helper function to draw map points
  function drawMapPoint(ctx, x, y, color, label) {
    // Draw outer circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();

    // Draw inner circle
    ctx.fillStyle = "#1a1a1a"; // Dark background for dark mode
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw label
    ctx.fillStyle = color;
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y);

    // Draw pulse effect
    if (color === "#00b894") {
      // Only for pickup point
      drawPulseEffect(ctx, x, y, color);
    }
  }

  // Draw pulse effect for pickup point
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

  // Add labels to the map
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

    ctx.fillStyle = "#e0e0e0"; // Light text for dark mode
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

    ctx.fillStyle = "#e0e0e0"; // Light text for dark mode
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(shortenAddress(destAddress), destPoint.x, destPoint.y + 30);

    // Distance and time estimate
    const distance = calculateDistance(pickupPoint, destPoint);
    const time = Math.round((distance / 50) * 10); // Simple time calculation

    ctx.fillStyle = "rgba(40, 40, 40, 0.9)"; // Dark background for dark mode
    ctx.fillRect(10, 10, 180, 50);

    ctx.fillStyle = "#e0e0e0"; // Light text for dark mode
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Distance: ${(distance / 100).toFixed(1)} km`, 20, 30);
    ctx.fillText(`Est. travel time: ${time} min`, 20, 50);
  }

  // Shorten address for display
  function shortenAddress(address) {
    if (address.length > 25) {
      return address.substring(0, 22) + "...";
    }
    return address;
  }

  // Calculate distance between two points
  function calculateDistance(point1, point2) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Generate a point from a string (simple hash function)
  function getPointFromString(str, maxWidth, maxHeight) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Use the hash to generate x and y coordinates
    // Ensure they're not too close to the edges
    const margin = 60;
    const x = margin + Math.abs(hash % (maxWidth - 2 * margin));
    const y = margin + Math.abs((hash >> 8) % (maxHeight - 2 * margin));

    return { x, y };
  }
});
