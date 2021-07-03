const request = require('request');
const cheerio = require('cheerio');
const chalk = require('chalk');
const fs = require("fs");
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/chennai-super-kings-vs-kings-xi-punjab-53rd-match-1216506/full-scorecard";
request(url, function(error, response, body) {
    if (error) {
        console.log("please write correct url");
    } else {
        handleHTML(body);
        //    console.log(body);
    }
});

function handleHTML(html) {
    var setTool = cheerio.load(html);
    var data = setTool('.event .match-info .team');
    var winning_team;
    for (var i = 0; i < data.length; i++) {
        if (!setTool(data[i]).hasClass("team-gray")) {
            winning_team = setTool(data[i]).text();
        }
    }
    winning_team = winning_team.split("(")[0].trim();
    console.log(chalk.magentaBright("winning team : " + winning_team));

    var htmlStr = "";
    var inningsData = setTool('.Collapsible');
    for (var i = 0; i < inningsData.length; i++) {
        //    htmlStr += setTool(inningsData[i]).html();
        var teamName = setTool(inningsData[i]).find(".header-title").text().split("INNINGS")[0].trim();
        if (teamName === winning_team) {
            var all_bowlers_data = setTool(inningsData[i]).find(".bowler tbody tr");
        }
    }
    var hwtNumber = 0;
    var hwtName = "";
    for (var i = 0; i < all_bowlers_data.length; i++) {
        var bowler_data = setTool(all_bowlers_data[i]).find("td");
        var player_name = setTool(bowler_data[0]).text();
        var num_wicket = parseInt(setTool(bowler_data[4]).text());
        if (num_wicket > hwtNumber) {
            hwtNumber = num_wicket;
            hwtName = player_name;
        }
    }

    console.log(chalk.greenBright("maximum wicket taker name : " + hwtName + " wicket taken : " + hwtNumber));
    //  fs.writeFileSync("table.html", htmlStr);
    //  console.log(htmlStr);

}