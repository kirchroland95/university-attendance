// Get course parameter from URL
const params = new URLSearchParams(window.location.search);
const course = params.get("course") || "1";

// Course titles
const courseTitles = {
  1: "ALGORITMICA GRAFURILOR",
  2: "PROGRAMARE ORIENTATĂ OBIECT",
};

// Update page content based on course
document.addEventListener("DOMContentLoaded", function () {
  // Update title
  const titleElement = document.getElementById("courseTitle");
  if (titleElement) {
    titleElement.textContent = courseTitles[course] || "ALGORITMICA GRAFURILOR";
  }

  // Update button hrefs
  const attendanceBtn = document.getElementById("attendanceBtn");
  const viewBtn = document.getElementById("viewBtn");

  if (attendanceBtn) {
    attendanceBtn.onclick = function () {
      location.href = `attendance.html?course=${course}`;
    };
  }

  if (viewBtn) {
    viewBtn.onclick = function () {
      location.href = `prezente.html?course=${course}`;
    };
  }
});
