// document.body.innerHTML = '<h1>This is JS</h1>';
function functionName(s) {
  alert('Hello, ' + s + '!');
}


function readFile(input) {
  let file = input.files[0];
  let fileReader = new FileReader();
  fileReader.readAsText(file);
  fileReader.onload = function() {
    alert(fileReader.result);
  };
  fileReader.onerror = function() {
    alert(fileReader.error);
  };
}


function read() {
  alert("test");
  const fs = require('fs')
  let fInput = "You are reading the content from Tutorials Point"
  fs.writeFile('tp.txt', fInput, (err) => {
    if (err) throw err;
    else {
      alert("The file is updated with the given data");
    }
  })

}