// Get URL parameters
const params = new URLSearchParams(window.location.search);
const courseId = params.get("course") || "1";
const type = params.get("type") || "course"; // "course" or "lab"
const course = COURSES[courseId];

document.addEventListener("DOMContentLoaded", function () {
  if (!course) {
    alert("Curs invalid!");
    location.href = "index.html";
    return;
  }

  // Set course title
  document.getElementById("courseTitle").textContent = course.name;
  
  // Set type title
  const typeElement = document.getElementById("typeTitle");
  if (typeElement) {
    typeElement.textContent = type === "lab" ? "LABORATOR" : "CURS";
  }

  // Update back button to include course parameter
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.onclick = () => location.href = `materie.html?course=${courseId}`;
  }
});

// Get the script URL
const scriptUrl = course ? course.scriptUrl : "";

if (scriptUrl) {
  fetch(`${scriptUrl}?course=${courseId}&type=${type}`)
    .then((r) => r.json())
    .then((data) => {
      if (data.error) throw new Error(data.error);
      renderTable(data);
    })
    .catch((err) => {
      document.getElementById("tableContainer").textContent =
        "Eroare la încărcare: " + err.message;
    });
}

function renderTable(data) {
  const container = document.getElementById("tableContainer");
  if (!data.dates || !data.data) {
    container.textContent = "Nu există date disponibile.";
    return;
  }

  // Build HTML table
  let html = "<table><thead><tr><th>Nume</th>";
  data.dates.forEach((date) => (html += `<th class="date-header"><span>${date}</span></th>`));
  html += "</tr></thead><tbody>";

  data.data.forEach((row) => {
    html += `<tr><td>${row.name}</td>`;
    data.dates.forEach((date) => {
      html += `<td>${row[date] || ""}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

