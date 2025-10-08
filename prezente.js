const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzGbDC9NzkUNB2ajgmAzYy3gCn_J1LTCJ2W0zx8VKUSFwg5qL-QhM0Csd87shE9R-OHfA/exec";

// Determine which course to display from URL
const params = new URLSearchParams(window.location.search);
const course = params.get("course") || "1";
const titles = {
  1: "ALGORITMICA GRAFURILOR",
  2: "PROGRAMARE ORIENTATĂ OBIECT",
};

document.addEventListener("DOMContentLoaded", function () {
  // Set course title
  document.getElementById("courseTitle").textContent =
    titles[course] || "Prezențe";

  // Update back button to include course parameter
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.onclick = function () {
      location.href = `materie.html?course=${course}`;
    };
  }
});

fetch(`${SCRIPT_URL}?course=${course}`)
  .then((r) => r.json())
  .then((data) => {
    if (data.error) throw new Error(data.error);
    renderTable(data);
  })
  .catch((err) => {
    document.getElementById("tableContainer").textContent =
      "Eroare la încărcare: " + err.message;
  });

function renderTable(data) {
  const container = document.getElementById("tableContainer");
  if (!data.dates || !data.data) {
    container.textContent = "Nu există date disponibile.";
    return;
  }

  // Build HTML table
  let html = "<table><thead><tr><th>Nume</th>";
  data.dates.forEach((date) => (html += `<th>${date}</th>`));
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
