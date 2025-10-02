// Attendance Tracker Script

// Setter for attendance.html h1 title based on course parameter
// Detect course from URL

// Check for course parameter, default to "1" if not present
const params = new URLSearchParams(window.location.search);
const course = params.get("course") || "1"; 

const titles = {
  "1": "ALGORITMICA GRAFURILOR",
  "2": "PROGRAMARE ORIENTATĂ OBIECT"
};

// Set page title if element exists, otherwise default to "PREZENȚĂ"
window.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("courseTitle");
  if (title) title.textContent = titles[course] || "PREZENȚĂ";
});

// Google Apps Script URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzGbDC9NzkUNB2ajgmAzYy3gCn_J1LTCJ2W0zx8VKUSFwg5qL-QhM0Csd87shE9R-OHfA/exec";

function checkIn() {
  const name = document.getElementById("nameInput").value.trim();
  if (!name) {
    document.getElementById("msg").textContent = "INTRODU NUMELE";
    return;
  }

  fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "name=" + encodeURIComponent(name) + "&course=" + course,
  })
    .then((res) => res.text())
    .then((text) => {
      document.getElementById("msg").textContent = text;
      document.getElementById("nameInput").value = "";
    })
    .catch((err) => {
      document.getElementById("msg").textContent = "EROARE, PREZENTA NU A PUTUT FI TRECUTA";
    });
}
