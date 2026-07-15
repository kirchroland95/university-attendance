// Central configuration for all courses
const COURSES = {
  1: {
    id: 1,
    name: "OOP",
    shortName: "ACRONYM1",
    scriptUrl: "https://script.google.com/macros/s/AKfycbyqd4q1WmwgE7nBcFjwXdfWvMg1SDB_HzuDrT1iz7ru722kYuZo9m-tli-3sWnaA-wDhA/exec",
  },
  2: {
    id: 2,
    name: "COURSE NAME 2",
    shortName: "ACRONYM2",
    scriptUrl: "https://script.google.com/macros/s/YOUR_SCRIPT_URL_2/exec",
  },
};

// Campus location for geolocation check
const CAMPUS = {
  lat: 38.878954558014385,
  lon: -84.69438504752182,
  radiusMeters: 100,
};

// Feature toggles
// Toggle name autocomplete
const ENABLE_AUTOCOMPLETE = false; 
// Toggle check for existing entry in STUDENTS when autocomplete is enabled
const ENABLE_NAME_ENFORCEMENT = true; 

const STUDENTS = [
  "STUDENT NAME 1",
  "STUDENT NAME 2",
  "STUDENT NAME 3",
  // Add more student names here
].sort();
