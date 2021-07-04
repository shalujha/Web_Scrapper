const xlsx = require("xlsx");
const fs = require("fs");
let data = fs.readFileSync(".\\practice.json");
let parsed_data = JSON.parse(data)
    //console.log(data);
excelWriter("abc.xlsx", parsed_data, "sheet-1");

function excelWriter(filePath, json, sheetName) {
    // console.log("function mein aye");
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}