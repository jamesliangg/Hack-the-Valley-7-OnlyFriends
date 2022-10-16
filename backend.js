

var timing = new Array;
var mondayTimetable = new Array;
var tuesdayTimetable = new Array;
var wednesdayTimetable = new Array;
var thursdayTimetable = new Array;
var fridayTimetable = new Array;
var weekdays = ["MO", "TU", "WE", "TH", "FR"];

function readFile(input) {
  let file = input.files[0];
  let fileReader = new FileReader();
  fileReader.readAsText(file);
  fileReader.onload = function() {
    // alert(fileReader.result);
    fileToArray(fileReader.result);
  };
  fileReader.onerror = function() {
    alert(fileReader.error);
  };
}

function fileToArray(icsInfo) {
  var icsArray = icsInfo.split("\n");
  var course = 0;
  for (var i in icsArray) {
    if (icsArray[i].includes("DTSTART;TZID")) {
      icsArray[i] = icsArray[i].substring(icsArray[i].lastIndexOf("T") + 1,icsArray[i].length);
      course++;
      var startTime = icsArray[i];
    }
    else if (icsArray[i].includes("DTEND;TZID")) {
      icsArray[i] = icsArray[i].substring(icsArray[i].lastIndexOf("T") + 1,icsArray[i].length);
      course++;
      var endTime = icsArray[i];
    }
    else if (icsArray[i].includes("RRULE:FREQ=WEEKLY") && !icsArray[i].includes("2023")) {
      icsArray[i] = icsArray[i].substring(icsArray[i].lastIndexOf("=") + 1,icsArray[i].length);
      course++;
      var weekday = icsArray[i];
      console.log(weekday + " " + startTime + " " + endTime);
      timing.push([weekday, startTime, endTime]);
    }
  }
  console.table(timing);
}

function sortCourses() {
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
  findBreaks(sortTables(mondayTimetable), "Monday");
  findBreaks(sortTables(tuesdayTimetable), "Tuesday");
  findBreaks(sortTables(wednesdayTimetable), "Wednesday");
  findBreaks(sortTables(thursdayTimetable), "Thursday");
  findBreaks(sortTables(fridayTimetable), "Friday");
}

function sortTables(timetable) {
  for (var i in timetable) {
    for (var j in timetable[i]) {
      timetable[i][j] = parseInt(timetable[i][j]);
    }
  }
  timetable.push([000000, 000000]);
  timetable.push([240000, 240000]);
  timetable.sort(sortFunction);
  return timetable
}

function findBreaks(timetable, weekday) {
  for (var i = 0; i < timetable.length - 1; i++) {
    console.log(weekday);
    if ((timetable[i+1][0] - timetable[i][1]) > 0) {
      console.log("There is a " + timeDifference(timetable[i][1], timetable[i+1][0]) + " minute break between " + timetable[i][1] + " to " + timetable[i+1][0]);
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
  var adjustedFirstHours = Math.floor(firstTime/10000);
  // console.log(adjustedFirstHours);
  var adjustedSecondHours = Math.floor(secondTime/10000);
  // console.log(adjustedSecondHours);
  var minutesFirstTime = (firstTime/100 - adjustedFirstHours*100) + adjustedFirstHours*60;
  var minutesSecondTime = (secondTime/100 - adjustedSecondHours*100) + adjustedSecondHours*60;
  return minutesSecondTime - minutesFirstTime;
}



var store = document.querySelector(':root');
var rootStyles = getComputeredStyle(root);
var event1 = rootStyles.getPropertyValue('--event-1');
console.log('vale: ', event1);

setSize(4);