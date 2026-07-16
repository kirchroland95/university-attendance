// Get course parameter from URL
const params = new URLSearchParams(window.location.search);
const courseId = params.get("course") || "1";
const course = COURSES[courseId];

// Update page content based on course
document.addEventListener("DOMContentLoaded", function () {
  if (!course) {
    alert("Curs invalid!");
    location.href = "index.html";
    return;
  }

  // Update title
  const titleElement = document.getElementById("courseTitle");
  if (titleElement) {
    titleElement.textContent = course.name;
  }

  // Setup Course buttons
  const coursePrezentaBtn = document.getElementById("coursePrezentaBtn");
  const courseVizualizareBtn = document.getElementById("courseVizualizareBtn");

  if (coursePrezentaBtn) {
    coursePrezentaBtn.onclick = () => location.href = `attendance.html?course=${courseId}&type=course`;
  }

  if (courseVizualizareBtn) {
    courseVizualizareBtn.onclick = () => location.href = `prezente.html?course=${courseId}&type=course`;
  }

  // Setup Lab buttons
  const labPrezentaBtn = document.getElementById("labPrezentaBtn");
  const labVizualizareBtn = document.getElementById("labVizualizareBtn");

  if (labPrezentaBtn) {
    labPrezentaBtn.onclick = () => location.href = `attendance.html?course=${courseId}&type=lab`;
  }

  if (labVizualizareBtn) {
    labVizualizareBtn.onclick = () => location.href = `prezente.html?course=${courseId}&type=lab`;
  }
});
