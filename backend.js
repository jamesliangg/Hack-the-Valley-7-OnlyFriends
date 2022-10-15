// document.body.innerHTML = '<h1>This is JS</h1>';
function functionName() {
  alert(`Hello!`);
}

//  var input = document.getElementById("userInput").value;
//  alert(input);

function readFile(input) {
  let file = input.files[0];
  let fileReader = new FileReader();
  fileReader.readAsText(file);
  fileReader.onload = function(){
    alert(fileReader.result);
    // return fileStuff;
  };
  fileReader.onerror = function() {
    alert(fileReader.error);
  };
}

// async function read(file) {
//   // Read the file as text
//   console.log(await file.text())
//   // Read the file as ArrayBuffer to handle binary data
//   console.log(new Uint8Array(await file.arrayBuffer()))
//   // Abuse response to read json data
//   console.log(await new Response(file).json())
//   // Read large data chunk by chunk
//   console.log(file.stream())
// }
