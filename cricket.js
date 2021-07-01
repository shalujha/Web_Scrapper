const chalk=require('chalk');
const request=require('request');
const cheerio=require('cheerio');

request('https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard', function (error, response, body) {
  if(error){
      console.log("please enter valid url");
  }else{
      handleHtml(body);
  }
});

function handleHtml(html){
   // console.log(html);
   var setTool=cheerio.load(html);
   var data=setTool('.best-player-name a')
   console.log(setTool(data).text());
}