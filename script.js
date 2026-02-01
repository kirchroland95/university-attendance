// Attendance Tracker Script

// Get URL parameters
const params = new URLSearchParams(window.location.search);
const courseId = params.get("course") || "1";
const type = params.get("type") || "course"; // "course" or "lab"
const course = COURSES[courseId];

// Get list of student names from STUDENTS array
function getStudentNames() {
  return STUDENTS;
}

// Autocomplete
function setupAutocomplete() {
  // Check if autocomplete is enabled in config
  if (!ENABLE_AUTOCOMPLETE) return;
  
  const nameInput = document.getElementById('nameInput');
  const suggestionsList = document.getElementById('suggestionsList');
  
  if (!nameInput || !suggestionsList) return;
  
  nameInput.addEventListener('input', function() {
    const input = this.value.trim().toUpperCase();
    suggestionsList.innerHTML = '';
    
    if (input.length === 0) {
      suggestionsList.style.display = 'none';
      return;
    }
    
    const students = getStudentNames();
    const matches = students.filter(name => 
      name.toUpperCase().includes(input)
    ).slice(0, 8); // Limit suggestions
    
    if (matches.length === 0) {
      suggestionsList.style.display = 'none';
      return;
    }
    
    matches.forEach(match => {
      const li = document.createElement('li');
      li.textContent = match;
      li.className = 'suggestion-item';
      li.onclick = function() {
        nameInput.value = match;
        suggestionsList.innerHTML = '';
        suggestionsList.style.display = 'none';
      };
      suggestionsList.appendChild(li);
    });
    
    suggestionsList.style.display = 'block';
  });
  
  // Close suggestions when clicking outside
  document.addEventListener('click', function(event) {
    if (event.target !== nameInput && event.target !== suggestionsList) {
      suggestionsList.innerHTML = '';
      suggestionsList.style.display = 'none';
    }
  });
}

// Set page title and get script URL
window.addEventListener("DOMContentLoaded", () => {
  setupAutocomplete();
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

// Try to obtain the best-accuracy position within a short window
function getBestPosition(timeoutMs = 8000, targetAccuracyM = 25) {
  return new Promise((resolve, reject) => {
    let best = null;
    const watchId = navigator.geolocation.watchPosition(
      (p) => {
        if (!best || p.coords.accuracy < best.coords.accuracy) {
          best = p;
        }
        // Stop early if we reached the target accuracy
        if (p.coords.accuracy <= targetAccuracyM) {
          navigator.geolocation.clearWatch(watchId);
          resolve(best);
        }
      },
      (err) => {
        // If we captured something, use it; otherwise, reject
        if (best) resolve(best);
        else reject(err);
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    // Safety timer
    setTimeout(() => {
      navigator.geolocation.clearWatch(watchId);
      if (best) resolve(best);
      else reject(new Error("timeout"));
    }, timeoutMs);
  });
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

    // Gather best position within a short window, then decide
    getBestPosition(8000, 25)
      .then((pos) => {
        const { latitude: lat, longitude: lon, accuracy } = pos.coords;
        const dist = haversine(lat, lon, CAMPUS.lat, CAMPUS.lon);

        // Accept if within radius considering reported accuracy (capped)
        const acc = isFinite(accuracy) ? Math.round(accuracy) : 9999;
        const allowedRadius = CAMPUS.radiusMeters + Math.min(acc, 100);

        if (dist > allowedRadius) {
          msgElement.innerHTML =
            `ESTI LA ${Math.round(dist)}m DE UNIVERSITATE.<br>` +
            `Precizie raportata ~ ${acc}m. Activeaza Precise/Exact location pentru browser, porneste WiFi, repozitioneaza-te, apoi incearca din nou.`;
          return;
        }

        // Only send if inside campus area (within accuracy margin)
        msgElement.textContent = "SE ADAUGA...";

        const scriptUrl = course.scriptUrl;

        fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `name=${encodeURIComponent(name)}&course=${courseId}&type=${type}`,
        })
          .then((res) => res.text())
          .then(() => {
            msgElement.textContent = `TE-AM TRECUT PREZENT: ${name.toUpperCase()}`;
            document.getElementById("nameInput").value = "";
          })
          .catch(() => {
            msgElement.textContent = "EROARE, PREZENTA NU A PUTUT FI TRECUTA";
          });
      })
      .catch(() => {
        msgElement.textContent = "LOCATIE REFUZATA SAU INDISPONIBILA";
      });
}

// Submit attendance without any geolocation checks
function checkInNoGeo() {
  const nameInput = document.getElementById("nameInput");
  const msgElement = document.getElementById("msg");
  const name = nameInput.value.trim();

  if (!name) {
    msgElement.textContent = "INTRODU NUMELE";
    return;
  }

  msgElement.textContent = "SE ADAUGA...";

  const scriptUrl = course.scriptUrl;

  fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `name=${encodeURIComponent(name)}&course=${courseId}&type=${type}`,
  })
    .then((res) => res.text())
    .then(() => {
      msgElement.textContent = `TE-AM TRECUT PREZENT: ${name.toUpperCase()}`;
      nameInput.value = "";
    })
    .catch(() => {
      msgElement.textContent = "EROARE, PREZENTA NU A PUTUT FI TRECUTA";
    });
}
