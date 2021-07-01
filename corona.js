// simple web scrapping code to extract data from worldometers website using node js
const request=require('request');
const cheerio=require("cheerio");
const chalk=require('chalk');
var data="";
request('https://www.worldometers.info/coronavirus/', function (error, response, body) {
  if(error){
      console.log("please enter valid url");
  }else{
      handleHtml(body);
  }
});

function handleHtml(html){
    var setTool=cheerio.load(html);
    var data=setTool(".maincounter-number span")
    /*
    for(var i=0;i<data.length;i++){
        console.log(setTool(data[i]).text());
    } */
    var total_covid_cases=setTool(data[0]).text();
    var total_Deaths=setTool(data[1]).text();
    var total_Recovered_cases=setTool(data[2]).text();   
    console.log(chalk.gray.bold('total_Active_cases : '+ total_covid_cases));
    console.log(chalk.red.bold('total_Death_cases : '+ total_Deaths));
    console.log(chalk.green.bold('total_Active_cases : '+ total_Recovered_cases));
}