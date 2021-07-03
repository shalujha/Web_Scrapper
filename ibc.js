const request=require('request');
const cheerio=require('cheerio');
const chalk=require('chalk');
const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595/chennai-super-kings-vs-kings-xi-punjab-53rd-match-1216506/ball-by-ball-commentary";
request(url,function(error,response,body){
    if(error){
        console.log("please write correct url");
    }else{
        handleHTML(body);
    //    console.log(body);
    }
});

function handleHTML(html){
    var setTool=cheerio.load(html);
    var data=setTool('div[style="padding-right:16px"] .match-comment-long-text>p');
  //  console.log(setTool(data[1]).text());
  /*
  for(var i=0;i<data.length;i++){
      console.log("********************************");
      console.log(setTool(data[i]).text());
      console.log("*****************************************");
  } */
  console.log(chalk.magentaBright("Last Ball Commentary : "+setTool(data[0]).text()));
}



