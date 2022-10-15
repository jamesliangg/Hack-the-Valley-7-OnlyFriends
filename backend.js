var timing = new Array;
var mondayTimetable = new Array;

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
  // mondayTimes(timing);
}

function mondayTimes() {
  for (var i in timing) {
    if (timing[i][0].includes("MO")) {
      mondayTimetable.push([timing[i][1], timing[i][2]]);
    }
  }
  console.table(mondayTimetable);
  for (var i in mondayTimetable) {
    for (var j in mondayTimetable[i]) {
      mondayTimetable[i][j] = parseInt(mondayTimetable[i][j]);
    }
  }
  console.table(mondayTimetable);
  mondayTimetable.sort(sortFunction);
  console.table(mondayTimetable);

  for (var i = 0; i < mondayTimetable.length - 1; i++) {
    if ((mondayTimetable[i+1][0] - mondayTimetable[i][1]) > 0) {
      console.log("There is a " + (mondayTimetable[i+1][0] - mondayTimetable[i][1])/100 + " minute break between " + mondayTimetable[i][1] + " to " + mondayTimetable[i+1][0]);
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