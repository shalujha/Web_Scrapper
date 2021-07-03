const request = require('request');
const cheerio = require('cheerio');
const chalk = require('chalk');
const fs = require("fs");
var batsman_url = [];
var batsman_set = [];
var birthDay_data = [];
const base_url = "https://www.espncricinfo.com/";
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
    var inningsData = setTool('.Collapsible');
    for (var i = 0; i < inningsData.length; i++) {
        var teamName = setTool(inningsData[i]).find(".header-title").text().split("INNINGS")[0].trim();
        var all_batsman_data = setTool(inningsData[i]).find(".batsman tbody tr .batsman-cell");
        for (var j = 0; j < all_batsman_data.length; j++) {
            var batsman = setTool(all_batsman_data[j]).text();
            //  console.log("batsman is " + chalk.blue(batsman));
            var href = setTool(all_batsman_data[j]).find("a").attr('href');
            var player_url = base_url + href;
            getBirthDay(player_url, batsman)
                // console.log("player_url : " + player_url);
        }
    }
}

function getBirthDay(player_url, batsman) {
    request(player_url, function(error, response, body) {
        if (!error) {
            extractBirthday(body, batsman);
        }
    })
}

function extractBirthday(html, batsman) {
    // console.log("function mein aye : batsman ka naam : " + batsman);
    var selTool = cheerio.load(html);
    var birthDayData = selTool(".player-card-padding .player_overview-grid div");

    var day = selTool(birthDayData[1]).text();
    console.log("batsman name : " + batsman + " date of birth : " + day.split("Born")[1]);

    //   console.log(selTool(birthDayData[1]).find("player-card-description").text());
} //   console.log(selTool(birthDayData[1]).find("player-card-description").text());