// Central configuration for all courses
const COURSES = {
  1: {
    id: 1,
    name: "ALGORITMICA GRAFURILOR",
    shortName: "GRAPH",
    scriptUrl: "https://script.google.com/macros/s/AKfycbwXSqbuZ7gsLJy7ichORBWGc-45-RTYJDVCWQo_1ieK-IurjDuVADkrogFiOCJm_5fNRA/exec"
  },
  2: {
    id: 2,
    name: "PROGRAMARE ORIENTATĂ OBIECT",
    shortName: "OOP",
    scriptUrl: "https://script.google.com/macros/s/AKfycbyqd4q1WmwgE7nBcFjwXdfWvMg1SDB_HzuDrT1iz7ru722kYuZo9m-tli-3sWnaA-wDhA/exec"
  },
//   3: {
//     id: 3,
//     name: "BAZE DE DATE",
//     shortName: "DB",
//     scriptUrl: "https://script.google.com/macros/s/YOUR_DB_URL/exec"
//   },
  4: {
    id: 4,
    name: "REȚELE DE CALCULATOARE",
    shortName: "NET",
    scriptUrl: "https://script.google.com/macros/s/AKfycbz1GayC2cQO7_xQKHuOq7TeeoQpfqQOpFNvFqas6JiHyNRQEN-92pLCdbVl8xx43Q/exec"
  }
};

// Campus location for geolocation check
const CAMPUS = {
  lat: 46.176383826702086,
  lon: 21.343685368464428,
  radiusMeters: 100
};
