var timing = new Array;
var mondayTimetable = new Array;
var tuesdayTimetable = new Array;
var wednesdayTimetable = new Array;
var thursdayTimetable = new Array;
var fridayTimetable = new Array;
var weekdays = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
var breakdown = "";
var today = new Date();
var calendar = null

/**
 * Calls most other functions
 */
function mainFunction() {
  // clear current calendar
  calendar.removeAllEvents();
  // console.log(getSundayOfCurrentWeek());
  // sort courses into weekdays
  sortCourses();
  // find break times and add to calendar
  findBreaks(sortTables(mondayTimetable), "Monday");
  findBreaks(sortTables(tuesdayTimetable), "Tuesday");
  findBreaks(sortTables(wednesdayTimetable), "Wednesday");
  findBreaks(sortTables(thursdayTimetable), "Thursday");
  findBreaks(sortTables(fridayTimetable), "Friday");
  // clear breakdown
  breakdown = "";
}

/**
 * Reads ics files and forwards result to create array
 * 
 * @param {String} input ics file with timetable
 */
function readFile(input) {
  let file = input.files[0];
  let fileReader = new FileReader();
  fileReader.readAsText(file);
  fileReader.onload = function() {
    fileToArray(fileReader.result);
  };
  fileReader.onerror = function() {
    alert(fileReader.error);
  };
}

/**
 * Splits timetable into an array which is then forwarded into uniSort depending on which University it's from
 * 
 * @param {String} icsInfo timetable
 */
function fileToArray(icsInfo) {
  // split timetable into array
  var icsArray = icsInfo.split("\n");
  var course = 0;
  //YorkU
  if (icsInfo.includes("yorku.ca")) {
    console.log("YorkU");
    uniSort(icsArray, course, "YorkU");
  }
  //Laurier
  else if (icsInfo.includes("Ellucian")) {
    console.log("Laurier");
    uniSort(icsArray, course, "Laurier");
  }
  //UofT
  else if (icsInfo.includes("Fortuna")) {
    console.log("UofT");
    uniSort(icsArray, course, "UofT");
  }
}

/**
 * Finds start time, end time, and weekdays of array which is then added to a new array
 * 
 * @param {Array} icsArray array with timetable information
 * @param {int} course tracks position in arrat
 * @param {String} uni University timetable is from
 */
function uniSort(icsArray, course, uni) {
  var courseStart = null;
  var courseEnd = null;
  var courseFrequency = null;
  var completedOne = false;
  var completedTwo = false;
  if (uni.includes("York")) {
    courseStart = "DTSTART;TZID";
    courseEnd = "DURATION";
    courseFrequency = "RRULE:FREQ=WEEKLY";
  }
  else if (uni.includes("Laurier")) {
    courseStart = "DTSTART;TZID";
    courseEnd = "DTEND;TZID";
    courseFrequency = "RRULE:FREQ=WEEKLY";
  }
  else if (uni.includes("UofT")) {
    courseStart = "DTSTART;TZID";
    courseEnd = "DTEND;TZID";
    courseFrequency = "RRULE:FREQ=WEEKLY";
  }
  // goes through every course in array
  for (var i in icsArray) {
    // finds start time
    if (icsArray[i].includes(courseStart)) {
      var uoftStart = icsArray[i].substring(icsArray[i].lastIndexOf(":") + 1, icsArray[i].length);
      icsArray[i] = icsArray[i].substring(icsArray[i].lastIndexOf("T") + 1, icsArray[i].length);
      course++;
      var startTime = icsArray[i];
    }
    // finds end time
    else if (icsArray[i].includes(courseEnd)) {
      if (uni.includes("Laurier") || uni.includes("UofT")) {
        icsArray[i] = icsArray[i].substring(icsArray[i].lastIndexOf("T") + 1, icsArray[i].length);
        completedOne = true;
      }
      else if (uni.includes("York")) {
        icsArray[i] = yorkDuration(icsArray[i], startTime);
        completedOne = true;
      }
        course++;
      var endTime = icsArray[i];
    }
    // finds weekdays
    else if (icsArray[i].includes(courseFrequency) && !icsArray[i].includes("2023")) {
      if (uni.includes("Laurier")) {
        icsArray[i] = icsArray[i].substring(icsArray[i].lastIndexOf("=") + 1, icsArray[i].length);
        completedTwo = true;
      }
      else if (uni.includes("York")) {
        icsArray[i] = icsArray[i].substring(icsArray[i].lastIndexOf(";") - 2, icsArray[i].lastIndexOf(";"));
        completedTwo = true;
      }
      else if (uni.includes("UofT")) {
        var uoftDate = uoftStart.slice(0, 4) + "-" + uoftStart.slice(4);
        uoftDate = uoftDate.slice(0, 7) + "-" + uoftDate.slice(7);
        uoftDate = uoftDate.slice(0, 13) + ":" + uoftDate.slice(13);
        uoftDate = uoftDate.slice(0, 16) + ":" + uoftDate.slice(16);
        var uoftFrequency = new Date(uoftDate);
        icsArray[i] = weekdays[uoftFrequency.getDay()];
        completedTwo = true;
      }
        course++;
      var weekday = icsArray[i];  
    }
    // adds course to array if all information is gathered
    if (completedOne == true && completedTwo == true) {
      console.log(weekday + " " + startTime + " " + endTime);
      timing.push([weekday, startTime, endTime]);
      completedOne = false;
      completedTwo = false;
    }
  }
}

/**
 * Takes York duration and start time to find end time of course
 * 
 * @param {String} duration duration of course
 * @param {String} startTime start time of course
 * @returns calculated end time
 */
function yorkDuration(duration, startTime) {
  // isolates just number part of String
  duration = duration.substring(duration.lastIndexOf("T") + 1, duration.length);
  duration = duration.slice(0, -1);
  // calculates hours and minutes within that duration
  var yorkHours = Math.floor(parseInt(duration) / 60);
  var yorkMinutes = parseInt(duration) - yorkHours * 60;
  // adds end hour to current start time
  var endHour = (Math.floor(parseInt(startTime) / 10000) + yorkHours) * 100;
  // converts any additional minutes to hour
  var minutesToHour = (Math.floor(parseInt(startTime.slice(2)) / 100));
  // if minutes are or above 60, go to next hour and convert to format
  if ((minutesToHour + yorkMinutes) >= 60) {
    endHour = endHour / 100 + 1;
    var endTime = endHour * 10000 + (minutesToHour + yorkMinutes - 60) * 100;
  }
  // if minutes are fine, convert back to format
  else {
    var endTime = endHour * 100 + (minutesToHour + yorkMinutes) * 100;
  }
  return endTime;
}

/**
 * Clears arrays then sorts courses into their weekdays
 */
function sortCourses() {
  // clear current arrays
  mondayTimetable = [];
  tuesdayTimetable = [];
  wednesdayTimetable = [];
  thursdayTimetable = [];
  fridayTimetable = [];
  // sort courses based on weekdays and add to array
  for (var i in timing) {
    if (timing[i][0].includes("MO")) {
      mondayTimetable.push([timing[i][1], timing[i][2]]);
    }
    if (timing[i][0].includes("TU")) {
      tuesdayTimetable.push([timing[i][1], timing[i][2]]);
    }
    if (timing[i][0].includes("WE")) {
      wednesdayTimetable.push([timing[i][1], timing[i][2]]);
    }
    if (timing[i][0].includes("TH")) {
      thursdayTimetable.push([timing[i][1], timing[i][2]]);
    }
    if (timing[i][0].includes("FR")) {
      fridayTimetable.push([timing[i][1], timing[i][2]]);
    }
  }
  
}

/**
 * Takes in timetable and sorts it chronologically based on start time
 * 
 * @param {Array} timetable timetable to be sorted
 * @returns sorted timetable array
 */
function sortTables(timetable) {
  // convert array into int
  for (var i in timetable) {
    for (var j in timetable[i]) {
      timetable[i][j] = parseInt(timetable[i][j]);
    }
  }
  // add midnight to array
  timetable.push([000000, 000000]);
  timetable.push([235900, 235900]);
  // sort array chronologically
  timetable.sort(sortFunction);
  return timetable
}

/**
 * Finds break times in weekday and forwards to newEvent to add break to calendar
 * 
 * @param {Array} timetable timetable to anaylze
 * @param {String} weekday weekday to analyze
 */
function findBreaks(timetable, weekday) {
  console.table(timetable);
  console.log(weekday);
  // DEPRECATED
  breakdown = breakdown + "<br>" + weekday;
  // removes courses with same start times and keeps the longer end time
  for (var i = 0; i < timetable.length - 1; i++) {
    if ((timetable[i][0] == timetable[i + 1][0])) {
      if (timetable[i][1] >= timetable[i + 1][1]) {
        timetable.splice(i + 1, 1);
      }
      else {
        timetable.splice(i, 1);
      }
    }
  }
  // removes courses with start times before previous end time
  for (var i = 0; i < timetable.length - 1; i++) {
    if ((timetable[i + 1][0] < timetable[i][1])) {
      timetable.splice(i + 1, 1);
    }
  }
  // finds breka times
  for (var i = 0; i < timetable.length - 1; i++) {
    if ((timetable[i + 1][0] - timetable[i][1]) > 0) {
      breakdown = breakdown + "<br>" + ("There is a " + timeDifference(timetable[i][1], timetable[i + 1][0]) + " minute break between " + timetable[i][1] + " to " + timetable[i + 1][0]);
      console.log("There is a " + timeDifference(timetable[i][1], timetable[i + 1][0]) + " minute break between " + timetable[i][1] + " to " + timetable[i + 1][0]);
      // creates new event
      newEvent(timetable[i][1], timetable[i + 1][0], weekday);
    }
  }
}

/**
 * Sorts time chronologically
 * 
 * @param {int} a first time
 * @param {int} b second time
 * @returns integers in order
 */
function sortFunction(a, b) {
  if (a[0] === b[0]) {
    return 0;
  }
  else {
    return (a[0] < b[0]) ? -1 : 1;
  }
}

/**
 * Calculates length of break time
 * 
 * @param {int} firstTime end time of first course
 * @param {int} secondTime start time of next course
 * @returns break time between courses
 */
function timeDifference(firstTime, secondTime) {
  // round down and find hours only
  var adjustedFirstHours = Math.floor(firstTime / 10000);
  var adjustedSecondHours = Math.floor(secondTime / 10000);
  // find total minutes of times
  var minutesFirstTime = (firstTime / 100 - adjustedFirstHours * 100) + adjustedFirstHours * 60;
  var minutesSecondTime = (secondTime / 100 - adjustedSecondHours * 100) + adjustedSecondHours * 60;
  // return difference in times
  return minutesSecondTime - minutesFirstTime;
}

/**
 * Creates calendar
 */
document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

  calendar = new FullCalendar.Calendar(calendarEl, {
    hiddenDays: [0,6],
    handleWindowResize: true,
    initialView: 'timeGridWeek',
    initialDate: today,
    nowIndicator: true,
    headerToolbar: {
      left: '',
      center: 'title',
      right: ''
    },
    dayHeaderFormat: {
      weekday: 'long'
    }
  });

  calendar.render();
});

/**
 * Creates new break event based on inputs
 * 
 * @param {int} beginTime beginning time of break
 * @param {int} endTime end time of break
 * @param {String} weekday weekday of break
 */
function newEvent(beginTime, endTime, weekday) {
  beginTime = beginTime.toString();
  // add zeros back when integers removed them
  while (beginTime.length < 6) {
    beginTime = "0" + beginTime;
  }
  endTime = endTime.toString();
  while (endTime.length < 6) {
    endTime = "0" + endTime;
  }
  // isolate hour and minutes
  var beginningHour = beginTime.substring(0,2);
  var beginningMinute = beginTime.substring(2,4);
  var endingHour = endTime.substring(0,2);
  var endingMinute = endTime.substring(2,4);
  // add colons
  beginTime = beginTime.replace(/..\B/g, '$&:');
  endTime = endTime.replace(/..\B/g, '$&:');
  // find Sunday
  var beginDate = new Date(getSundayOfCurrentWeek());
  // set weekday of break
  if (weekday.includes("Mo")){
    beginDate.setDate(beginDate.getDate() + 1);
  }
  else if (weekday.includes("Tu")){
    beginDate.setDate(beginDate.getDate() + 2);
  }
  else if (weekday.includes("We")){
    beginDate.setDate(beginDate.getDate() + 3);
  }
  else if (weekday.includes("Th")){
    beginDate.setDate(beginDate.getDate() + 4);
  }
  else if (weekday.includes("Fr")){
    beginDate.setDate(beginDate.getDate() + 5);
  }
  // set end date as same day as beginning
  var endDate = new Date(beginDate);
  // set break time hours and minutes
  beginDate.setHours(beginningHour, beginningMinute, 0);
  endDate.setHours(endingHour, endingMinute, 0);
  // create break events
  calendar.addEvent({
    title: 'Free Time',
    start: beginDate,
    end: endDate,
    allDay: false
  });
}

/**
 * Finds the Sunday of the week
 * 
 * @returns Sunday of week
 */
function getSundayOfCurrentWeek() {
  const today = new Date();
  const first = today.getDate() - today.getDay();
  const last = first;
  const sunday = new Date(today.setDate(last));
  return sunday;
}