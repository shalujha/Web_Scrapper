const request = require('request');
const cheerio = require('cheerio');
const chalk = require('chalk');
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const { data } = require('cheerio/lib/api/attributes');

//console.log("*****************");
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const base_url = "https://www.espncricinfo.com/";
request(url, function(error, response, body) {
    if (error) {
        console.log("please write correct url");
    } else {
        handleHTML(body);
        //    console.log(body);
    }
});

function handleHTML(html) {
    const setTool = cheerio.load(html);
    //  console.log(html);
    const link = setTool(".widget-items.cta-link").find("a").attr("href");
    const match_result_link = base_url + link;
    handleMatchResults(match_result_link);
}

function handleMatchResults(url) {
    request(url, function(error, response, body) {
        if (!error) {
            handleMatchData(body);
        }
    })
}

function handleMatchData(html) {
    var setTool = cheerio.load(html);
    var blocks = setTool(".card.content-block.league-scores-container .row.no-gutters>div");
    for (var i = 0; i < blocks.length; i++) {
        var links = setTool(blocks[i]).find(".match-cta-container");
        //     console.log(links.length);
        var scorecard_link = setTool(links).find("a")[2];
        scorecard_link = setTool(scorecard_link).attr("href");
        var match_url = base_url + scorecard_link;
        request(match_url, function(error, response, body) {
            if (!error) {
                handleTeams(body);
            }
        })
    }
}

function handleTeams(html) {
    // console.log("*******************************************************************");
    var setTool = cheerio.load(html);
    var winner = "";
    var teamNames = setTool(".event .match-info .teams .team");
    if (!fs.existsSync("IPL")) {
        fs.mkdirSync("IPL");
    }

    for (var i = 0; i < teamNames.length; i++) {
        if (!setTool(teamNames[i]).hasClass("team-gray")) {
            winner = setTool(teamNames[i]).find(".name-detail").text();
        }
        var teamName = setTool(teamNames[i]).find(".name-detail").text();
        var teamPath = path.join("IPL", teamName);
        if (!fs.existsSync(teamPath)) {
            fs.mkdirSync(teamPath);
        }
    }
    var scorepage = setTool(".match-scorecard-page .Collapsible");
    var match_information = setTool(".match-info .description");
    var venue = setTool(match_information).text().split(",")[1];
    var Date = setTool(match_information).text().split(",")[2];
    //   console.log("venue : " + venue);
    //  console.log("date : " + Date);
    //  console.log("Result : " + winner);
    for (var i = 0; i < scorepage.length; i++) {
        var teamName = setTool(scorepage[i]).find(".header-title").text().split("INNINGS")[0].trim();
        //     console.log("teamName : " + teamName);
        var opponentName = (i == 0 ? setTool(scorepage[i + 1]).find(".header-title").text().split("INNINGS")[0] : setTool(scorepage[i - 1]).find(".header-title").text().split("INNINGS")[0]);
        //   console.log("opponent_name : " + opponentName);
        var player_data = setTool(scorepage[i]).find(".table");
        // console.log("player_data length : " + player_data.length);
        //   console.log("*********************************************************");
        for (var j = 0; j < player_data.length; j++) {
            var player_name = setTool(player_data[j]).find("tbody").find("tr");
            for (var k = 0; k < player_name.length; k++) {
                var name = setTool(player_name[k]).find("td")[0];
                if (setTool(name).hasClass("batsman-cell")) {
                    var khiladi = setTool(name).text().trim();
                    var khiladi_path = path.join(path.join("IPL", teamName), khiladi + ".xlsx");
                    //                    console.log("player path : " + khiladi_path);
                    var JsonData = [{
                        "TeamName": teamName,
                        "opponentName": opponentName,
                        "Venue": venue,
                        "Date": Date,
                        "Result": winner,
                        "MyName": khiladi,
                    }];
                    if (fs.existsSync(khiladi_path)) {
                        var excelData = excelReader(khiladi_path, khiladi);
                        excelData.push(JsonData[0]);
                        excelWriter(khiladi_path, excelData, khiladi);
                    } else {
                        excelWriter(khiladi_path, JsonData, khiladi);
                    }



                }
                //  console.log("********************************")
            }
        }
    }
    //   console.log("*******************************************************************");

    //    ;
    //   console.log("*******************************************");
    //console.log(player_name.length);
}

function excelWriter(filePath, json, sheetName) {
    //  console.log("function mein aye");
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}

function excelReader(filePath, sheetName) {
    if (fs.existsSync(filePath) == false) {
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;

}