// Attendance Tracker Script

// Setter for attendance.html h1 title based on course parameter
// Detect course from URL

// Check for course parameter, default to "1" if not present
const params = new URLSearchParams(window.location.search);
const course = params.get("course") || "1";

const titles = {
  1: "ALGORITMICA GRAFURILOR",
  2: "PROGRAMARE ORIENTATĂ OBIECT",
};

// Set page title if element exists, otherwise default to "PREZENȚĂ"
window.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("courseTitle");
  if (title) title.textContent = titles[course] || "PREZENȚĂ";

  // Update back button to include course parameter
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.onclick = function () {
      location.href = `materie.html?course=${course}`;
    };
  }
});

// Google Apps Script URL
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzGbDC9NzkUNB2ajgmAzYy3gCn_J1LTCJ2W0zx8VKUSFwg5qL-QhM0Csd87shE9R-OHfA/exec";

// Campus location configuration
const CAMPUS_LAT = 46.176383826702086;
const CAMPUS_LON = 21.343685368464428;
const RADIUS_METERS = 100; // Allowed distance from campus center in meters

// Haversine formula to calculate distance between two coordinates
function haversine(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function checkIn() {
  const nameInput = document.getElementById("nameInput");
  const msgElement = document.getElementById("msg");
  const name = nameInput.value.trim();

  if (!name) {
    msgElement.textContent = "INTRODU NUMELE";
    return;
  }

  // Check if geolocation is supported
  if (!navigator.geolocation) {
    msgElement.textContent = "GEOLOCATION NU ESTE SUPORTAT";
    return;
  }

  msgElement.textContent = "VERIFICARE LOCATIE...";

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const dist = haversine(lat, lon, CAMPUS_LAT, CAMPUS_LON);

      if (dist > RADIUS_METERS) {
        msgElement.textContent =
          "NU ESTI IN ZONA UNIVERSITATII (" +
          Math.round(dist) +
          "m) - REPOZITIONEAZA-TE SI INCEARCA DIN NOU";
        return;
      }

      // Only send if inside campus area
      msgElement.textContent = "SE ADAUGA...";

      const body = "name=" + encodeURIComponent(name) + "&course=" + course;

      fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body,
      })
        .then((res) => res.text())
        .then((text) => {
          // Show personalized success message with the entered name
          msgElement.textContent = `TE-AM TRECUT PREZENT: ${name.toUpperCase()}`;
          nameInput.value = "";
        })
        .catch(() => {
          msgElement.textContent = "EROARE, PREZENTA NU A PUTUT FI TRECUTA";
        });
    },
    () => {
      msgElement.textContent = "LOCATIE REFUZATA SAU INDISPONIBILA";
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}
