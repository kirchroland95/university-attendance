// Attendance Tracker Script

// Get URL parameters
const params = new URLSearchParams(window.location.search);
const courseId = params.get("course") || "1";
const type = params.get("type") || "course"; // "course" or "lab"
const course = COURSES[courseId];

// Set page title and get script URL
window.addEventListener("DOMContentLoaded", () => {
  if (!course) {
    alert("Curs invalid!");
    location.href = "index.html";
    return;
  }

  const titleElement = document.getElementById("courseTitle");
  if (titleElement) {
    titleElement.textContent = course.name;
  }

  const typeElement = document.getElementById("typeTitle");
  if (typeElement) {
    typeElement.textContent = type === "lab" ? "LAB" : "CURS";
  }

  // Update back button to include course parameter
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.onclick = () => (location.href = `materie.html?course=${courseId}`);
  }
});

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
      const dist = haversine(lat, lon, CAMPUS.lat, CAMPUS.lon);

      if (dist > CAMPUS.radiusMeters) {
        msgElement.innerHTML =
          "ESTI LA " +
          Math.round(dist) +
          "M DE UNIVERSITATE<br>REPOZITIONEAZA-TE SI INCEARCA DIN NOU";
        return;
      }

      // Only send if inside campus area
      msgElement.textContent = "SE ADAUGA...";

      const scriptUrl = course.scriptUrl;

      fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `name=${encodeURIComponent(
          name
        )}&course=${courseId}&type=${type}`,
      })
        .then((res) => res.text())
        .then((text) => {
          // Show personalized success message with the entered name
          msgElement.textContent = `TE-AM TRECUT PREZENT: ${name.toUpperCase()}`;
          document.getElementById("nameInput").value = "";
        })
        .catch((err) => {
          msgElement.textContent = "EROARE, PREZENTA NU A PUTUT FI TRECUTA";
        });
    },
    () => {
      msgElement.textContent = "LOCATIE REFUZATA SAU INDISPONIBILA";
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}
