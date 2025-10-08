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

function checkIn() {
  const name = document.getElementById("nameInput").value.trim();
  const msgElement = document.getElementById("msg");

  if (!name) {
    msgElement.textContent = "INTRODU NUMELE";
    return;
  }

  // Show loading message immediately
  msgElement.textContent = "SE ADAUGA...";

  fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "name=" + encodeURIComponent(name) + "&course=" + course,
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
