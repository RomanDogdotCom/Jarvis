// AUTHOR: rfesler@gmail.com
//  INPUT: msg.payload (number)
// OUTPUT: msg.payload (array)
//     ie: "100.5" -> "1,100,point,5"
//     ie: "1013"  -> "1,1000,13"


// Input number as string to handle negatives and decimals correctly
let input = msg.payload.toString();
let outputs = [];

// Check if the number is negative and add "negative" if true
if (input.startsWith("-")) {
    outputs.push("negative");
    input = input.slice(1); // Remove the negative sign for further processing
}

// Split integer and decimal parts
let [integerPart, decimalPart] = input.split(".");

// Define words for tens and teens
const tensWords = ["", "", "20", "30", "40", "50", "60", "70", "80", "90"];
const teensWords = ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19"];

// Process integer part by place
let places = ["thousand", "hundred", "ten", ""];  // Define place labels for each digit
for (let i = 0; i < integerPart.length; i++) {
    let digit = integerPart[i];
    let place = places[places.length - integerPart.length + i];

    // Check if the current place is "ten" and the digit is "1" for teens handling
    if (place === "ten" && digit === "1") {
        // Handle teen numbers (10-19)
        let teenNumber = integerPart.slice(i, i + 2); // Get the two-digit teen number
        outputs.push(teensWords[parseInt(teenNumber) - 10]);
        i++;  // Skip the next (ones) digit
    } 
    else if (place === "ten" && digit !== "0") {
        // Handle tens (20, 30, etc.)
        outputs.push(tensWords[parseInt(digit)]);
    } 
    else if (place === "hundred" && digit !== "0") {
        // Handle hundreds
        outputs.push(digit, "100");
    } 
    else if (place === "thousand" && digit !== "0") {
        // Handle thousands
        outputs.push(digit, "1000");
    } 
    else if (place === "" && digit !== "0") {
        // Handle ones place
        outputs.push(digit);
    }
}

// Process decimal part if it exists
if (decimalPart) {
    outputs.push("point");
    for (let i = 0; i < decimalPart.length; i++) {
        outputs.push(decimalPart[i]);
    }
}

// Return the final output as an array in msg.payload
return { payload: outputs };
