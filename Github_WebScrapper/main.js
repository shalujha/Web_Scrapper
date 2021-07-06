const request = require('request');
const cheerio = require('cheerio');
const chalk = require('chalk');
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

const url = "https://github.com/topics";
const base_url = "https://github.com";
request(url, function(error, response, body) {
    if (error) {
        console.log("please write correct url");
    } else {
        handleHTML(body);
        //    console.log(body);
    }
});

function handleHTML(html) {
    //   console.log("handleHTML me aye");
    var setTool = cheerio.load(html);
    // .topic - box.no - underline
    var Topic_data = setTool(".topic-box");
    for (var i = 0; i < Topic_data.length; i++) {
        var topic_name = setTool(Topic_data[i]).find(".f3").text().trim();
        var topic_ref = setTool(Topic_data[i]).find(".no-underline").attr("href");
        //  console.log("topic url : " + url + topic_ref);
        handleTopicData(base_url + topic_ref, topic_name);

    }
}

function handleTopicData(url, topic_name) {
    //   console.log("handleTopic Data me aye");
    request(url, function(error, response, body) {
        if (!error) {
            handleTopic(body, topic_name, url);
        }
    });

}

function handleTopic(html, topic_name, url) {
    //   console.log("handleTopic me aye");
    if (!fs.existsSync(topic_name)) {
        fs.mkdirSync(topic_name);
    }
    var setTool = cheerio.load(html);
    var repositery_data = setTool(".px-3 .flex-auto .f3");
    //  console.log("length of repositery data : " + repositery_data.length);
    for (var i = 0; i < 10; i++) {
        var repositery = setTool(repositery_data[i]).find("a");
        //  console.log(setTool(repositery).text());
        var name = setTool(repositery[0]).text().trim();
        var repositery_path = path.join(topic_name, name);

        var link = setTool(repositery[1]).attr("href");
        var repositery_link = base_url + link;
        //  console.log("loop chala");
        handleTopicRequest(repositery_link, topic_name, name);
        //   console.log("name : " + name + " link is : " + link);
    }
}

function handleTopicRequest(url, topic_name, name) {
    //   console.log("handleTopicRequest me aye");
    request(url, function(error, response, body) {
        if (!error) {
            handleIssues(body, topic_name, name);
        }
    })
}

function handleIssues(html, topic_name, name) {
    // console.log("handleIssues me aye");
    var setTool = cheerio.load(html);
    var issueData = setTool(".UnderlineNav-body li");
    var issue = setTool(issueData[1]).find("a");
    //console.log("issuedata : " + issue.attr("href"));
    var issue_link = base_url + issue.attr("href");
    //   console.log(issue_link);
    handleIssueRequest(issue_link, topic_name, name);

}

function handleIssueRequest(url, topic_name, name) {
    //    console.log("handleIssueRequest me aye");
    request(url, function(error, response, body) {
        if (!error) {
            issueHelper(body, topic_name, name);
        }
    })
}

function issueHelper(html, topic_name, name) {
    //  console.log("issueHelper call hua ");
    //  console.log("issueHelper mein aye");
    var filePath = path.join(topic_name, name);

    var setTool = cheerio.load(html);
    var data = setTool("div[aria-label='Issues'] .js-navigation-container .js-issue-row .Box-row--drag-hide .flex-auto a[data-hovercard-type='issue']");
    //  console.log("length of data : " + data.length);
    var output = [];
    for (var i = 0; i < data.length; i++) {
        var ref = setTool(data[i]).attr("href")
        output.push(ref);
    }
    //   console.log("output is : " + output);
    fs.writeFileSync(filePath + ".json", JSON.stringify(output));
}