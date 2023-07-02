const { performance } = require('perf_hooks');

const startTime = performance.now();

let generatedCodes = [];

function generateCode() {
  let code = '';
  const characters = '123456789ABCDEF';
  
  for (let i = 0; i < 5; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return code;
}

function addCode() {
  let unique = false;
  let newCode;

  while (!unique) {
    newCode = generateCode();
    
    if (!generatedCodes.includes(newCode)) {
      unique = true;
      generatedCodes.push(newCode);
      console.log("New unique code generated and added: ", newCode);
    } else {
      console.log("Code already exists.");
    }
  }
}

var count = 0;

while (count < 100000) {
    // Generate a unique code and add it to the array
    addCode();
    count++;
}

// Print the array
//console.log(generatedCodes);


const endTime = performance.now();
const executionTime = (endTime - startTime) / 1000; // Convert to seconds

console.log(`Generated ${count} codes with ${dupes} duplicates in ${executionTime.toFixed(2)} seconds`);

/*
var QRCode = require('qrcode')


QRCode.toFile(
    './public/img/qr-code-abcdefg.png',
    'https://sp.snowhawkgaming.com/lobby/abcdefg', function (err, url) {
        console.log(url)
    });
*/