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
  
  // Load attendance list if on students-present page
  if (document.getElementById("attendanceList")) {
    loadAttendanceList();
  }
});

// Google Apps Script URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzGbDC9NzkUNB2ajgmAzYy3gCn_J1LTCJ2W0zx8VKUSFwg5qL-QhM0Csd87shE9R-OHfA/exec";

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

// Attendance List Display Functionality
function loadAttendanceList() {
  const params = new URLSearchParams(window.location.search);
  const course = params.get("course") || "1";

  const titles = {
    "1": "ALGORITMICA GRAFURILOR<br>PREZENȚĂ AZI",
    "2": "PROGRAMARE ORIENTATĂ OBIECT<br>PREZENȚĂ AZI"
  };

  // Set page title if pageTitle element exists
  const pageTitleElement = document.getElementById("pageTitle");
  if (pageTitleElement) {
    pageTitleElement.innerHTML = titles[course] || "PREZENȚĂ AZI";
  }

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzGbDC9NzkUNB2ajgmAzYy3gCn_J1LTCJ2W0zx8VKUSFwg5qL-QhM0Csd87shE9R-OHfA/exec";

  fetch(`${SCRIPT_URL}?course=${course}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("attendanceList");
      if (!container) return; // Exit if element doesn't exist
      
      if (!data || data.length === 0) {
        container.textContent = "Nicio prezență înregistrată astăzi.";
        return;
      }

      container.innerHTML = "";
      data.forEach(entry => {
        const div = document.createElement("div");
        div.className = "attendance-entry";
        div.textContent = `${entry.name} — ${entry.timestamp}`;
        container.appendChild(div);
      });
    })
    .catch(err => {
      const container = document.getElementById("attendanceList");
      if (container) {
        container.textContent = "Eroare la încărcare.";
      }
    });
}


