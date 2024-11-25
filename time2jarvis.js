// AUTHOR: rfesler@gmail.com
//  INPUT: msg.payload ("HH:MM")
// OUTPUT: msg.payload (array)
// ie: "13:45" -> "13,45"
// ie: "01:02" -> "1,oh,2"
// ie: "00:00" -> "midnight"

// Extract hours and minutes from the payload ("HH:MM" format)
let time = msg.payload.split(":");
let hours = parseInt(time[0], 10);
let minutes = parseInt(time[1], 10);
let result;

// Define output based on specific rules
if (hours === 0 && minutes === 0) {
    result = "midnight";
} else if (hours === 12 && minutes === 0) {
    result = "noon";
} else {
    result = [];
    
    // Handle hours
    if (hours === 0) {
        result.push(0);
    } else if (hours >= 20) {
        result.push(20, hours % 10); // Break 23 into 20, 3
    } else {
        result.push(hours);
    }

    // Handle minutes with specific rules
    if (minutes === 0) {
        result.push(100); // Special case for ":00"
    } else if (minutes < 10) {
        result.push("oh", minutes); // Use "oh" for single-digit minutes
    } else if (minutes % 10 === 0 || (minutes >= 11 && minutes <= 19)) {
        result.push(minutes); // Handle exact minutes or teen numbers
    } else {
        let tens = Math.floor(minutes / 10) * 10;
        let units = minutes % 10;
        
        // Replace 0 in the tens place with "oh"
        if (tens === 0) {
            result.push("oh", units);
        } else {
            result.push(tens, units);
        }
    }
}

// Assign the result to msg.payload to output it
msg.payload = result;
return msg;
