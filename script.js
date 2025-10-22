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
    backBtn.onclick = () => location.href = `materie.html?course=${courseId}`;
  }
});

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

  const scriptUrl = course.scriptUrl;

  fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `name=${encodeURIComponent(name)}&course=${courseId}&type=${type}`,
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
}

