// Central configuration for all courses
const COURSES = {
  1: {
    id: 1,
    name: "COURSE NAME 1",
    shortName: "ACRONYM1",
    courseSchedule: { day: 1, start: "08:00" }, // optional
    labSchedule: { day: 4, start: "12:15" },    // optional
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
const ENABLE_AUTOCOMPLETE = true; 

// Toggle check for existing entry in STUDENTS when autocomplete is enabled
const ENABLE_NAME_ENFORCEMENT = true; 

// Duration of a class in hours
const DURATION = 2;

const STUDENTS = [
  "STUDENT NAME 1",
  "STUDENT NAME 2",
  "STUDENT NAME 3",
  // Add more student names here
].sort();
