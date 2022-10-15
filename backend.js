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
  var timing = new Array;
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
    else if (icsArray[i].includes("RRULE:FREQ=WEEKLY")) {
      icsArray[i] = icsArray[i].substring(icsArray[i].lastIndexOf("=") + 1,icsArray[i].length);
      course++;
      var weekday = icsArray[i];
      console.log(weekday + " " + startTime + " " + endTime);
      timing.push([weekday, startTime, endTime]);
    }
  }
  console.table(timing);
}