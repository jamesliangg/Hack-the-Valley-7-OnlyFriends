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

function mainFunction() {
  calendar.removeAllEvents();
  console.log(getSundayOfCurrentWeek());
  sortCourses();
  findBreaks(sortTables(mondayTimetable), "Monday");
  findBreaks(sortTables(tuesdayTimetable), "Tuesday");
  findBreaks(sortTables(wednesdayTimetable), "Wednesday");
  findBreaks(sortTables(thursdayTimetable), "Thursday");
  findBreaks(sortTables(fridayTimetable), "Friday");
  breakdown = "";
}

//Reading file
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

function fileToArray(icsInfo) {
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
  for (var i in icsArray) {
    if (icsArray[i].includes(courseStart)) {
      var uoftStart = icsArray[i].substring(icsArray[i].lastIndexOf(":") + 1, icsArray[i].length);
      icsArray[i] = icsArray[i].substring(icsArray[i].lastIndexOf("T") + 1, icsArray[i].length);
      course++;
      var startTime = icsArray[i];
    }
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
    if (completedOne == true && completedTwo == true) {
      console.log(weekday + " " + startTime + " " + endTime);
      timing.push([weekday, startTime, endTime]);
      completedOne = false;
      completedTwo = false;
    }
  }
}

function yorkDuration(duration, startTime) {
  duration = duration.substring(duration.lastIndexOf("T") + 1, duration.length);
  duration = duration.slice(0, -1);
  var yorkHours = Math.floor(parseInt(duration) / 60);
  var yorkMinutes = parseInt(duration) - yorkHours * 60;
  var endHour = (Math.floor(parseInt(startTime) / 10000) + yorkHours) * 100;
  var minutesToHour = (Math.floor(parseInt(startTime.slice(2)) / 100));
  if ((minutesToHour + yorkMinutes) >= 60) {
    endHour = endHour / 100 + 1;
    var endTime = endHour * 10000 + (minutesToHour + yorkMinutes - 60) * 100;
  }
  else {
    var endTime = endHour * 100 + (minutesToHour + yorkMinutes) * 100;
  }
  return endTime;
}

function sortCourses() {
  mondayTimetable = [];
  tuesdayTimetable = [];
  wednesdayTimetable = [];
  thursdayTimetable = [];
  fridayTimetable = [];
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

function sortTables(timetable) {
  for (var i in timetable) {
    for (var j in timetable[i]) {
      timetable[i][j] = parseInt(timetable[i][j]);
    }
  }
  timetable.push([000000, 000000]);
  timetable.push([235900, 235900]);
  timetable.sort(sortFunction);
  return timetable
}

function findBreaks(timetable, weekday) {
  console.table(timetable);
  console.log(weekday);
  breakdown = breakdown + "<br>" + weekday;
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
  for (var i = 0; i < timetable.length - 1; i++) {
    if ((timetable[i + 1][0] < timetable[i][1])) {
      timetable.splice(i + 1, 1);
    }
  }
  for (var i = 0; i < timetable.length - 1; i++) {
    if ((timetable[i + 1][0] - timetable[i][1]) > 0) {
      breakdown = breakdown + "<br>" + ("There is a " + timeDifference(timetable[i][1], timetable[i + 1][0]) + " minute break between " + timetable[i][1] + " to " + timetable[i + 1][0]);
      console.log("There is a " + timeDifference(timetable[i][1], timetable[i + 1][0]) + " minute break between " + timetable[i][1] + " to " + timetable[i + 1][0]);
      newEvent(timetable[i][1], timetable[i + 1][0], weekday);
    }
  }
}

function sortFunction(a, b) {
  if (a[0] === b[0]) {
    return 0;
  }
  else {
    return (a[0] < b[0]) ? -1 : 1;
  }
}

function timeDifference(firstTime, secondTime) {
  var adjustedFirstHours = Math.floor(firstTime / 10000);
  var adjustedSecondHours = Math.floor(secondTime / 10000);
  var minutesFirstTime = (firstTime / 100 - adjustedFirstHours * 100) + adjustedFirstHours * 60;
  var minutesSecondTime = (secondTime / 100 - adjustedSecondHours * 100) + adjustedSecondHours * 60;
  return minutesSecondTime - minutesFirstTime;
}

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

function newEvent(beginTime, endTime, weekday) {
  beginTime = beginTime.toString();
  while (beginTime.length < 6) {
    beginTime = "0" + beginTime;
  }
  endTime = endTime.toString();
  while (endTime.length < 6) {
    endTime = "0" + endTime;
  }
  var beginningHour = beginTime.substring(0,2);
  var beginningMinute = beginTime.substring(2,4);
  var endingHour = endTime.substring(0,2);
  var endingMinute = endTime.substring(2,4);
  beginTime = beginTime.replace(/..\B/g, '$&:');
  endTime = endTime.replace(/..\B/g, '$&:');
  var beginDate = new Date(getSundayOfCurrentWeek());
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
  var endDate = new Date(beginDate);
  beginDate.setHours(beginningHour, beginningMinute, 0);
  endDate.setHours(endingHour, endingMinute, 0);
  calendar.addEvent({
    title: 'Free Time',
    start: beginDate,
    end: endDate,
    allDay: false
  });
}

function getSundayOfCurrentWeek() {
  const today = new Date();
  const first = today.getDate() - today.getDay();
  const last = first;
  const sunday = new Date(today.setDate(last));
  return sunday;
}