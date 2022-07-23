const puppeteer=require('puppeteer');
const pdf=require('pdfkit');
const fs=require('fs');

console.log("0122");
let cTab;
(async function(){
    try {
        console.log("0");
        let browserOpen = await puppeteer.launch({headless:false, args:["--start-maximized"],defaultViewport:null})
        let browserInstance=await browserOpen;
        let allTabs=await browserInstance.pages();
        console.log("1");
         cTab=allTabs[0];
         await cTab.goto("https://www.youtube.com/playlist?list=PLhy8TB5U6n17R78U7usaLQfCC8nbnG8Nc");
         await cTab.waitForSelector('h1[id="title"]');
         let name= await cTab.evaluate(function(select){
            return document.querySelector(select).innerText
         },'h1[id="title"]');
         console.log(name);// 
          await cTab.waitForSelector('div[id="stats"]');
         let allData=await cTab.evaluate(getData,'div[id="stats"]');
         console.log(allData.noOfviews);
        // console.log(allData.numberOfVideo);
         let totalVideos=allData.numberOfVideo.split(" ")[0];
         console.log(totalVideos);
         console.log("pp");
         let curV= await getCvidoesLen();
        // console.log(curV);
         totalVideos=188;

         while(totalVideos-temp>=5){
            await scrollToBottom();
            curV= await getCvidoesLen();
        
        
           // console.log("p");
           // console.log(curV);
         } 
         console.log("before finalList");
         let finalList=await getStats();
       console.log(finalList.length);
       //  console.log(finalList)
       let pdfDoc=new pdf;
       pdfDoc.pipe(fs.createWriteStream('pdflist9.pdf'));
       pdfDoc.text(JSON.stringify(finalList));
       pdfDoc.end();
       console.log("anmol");
        
      



    } catch (error) {
        console.log("error1");    
    }

})();


function getData(selector){
let allElements=document.querySelectorAll(selector);
let numberOfVideo=allElements[0].innerText;
let noOfviews=allElements[0].innerText;
return {
    numberOfVideo,noOfviews
}
}


async function getCvidoesLen(){
    let length=await cTab.evaluate(getLength,'#container>#thumbnail');
    return length;

}


 async function getLength(durationSelect){
    let durationElement=document.querySelectorAll(durationSelect);
    return durationElement.length;

}
async function scrollToBottom(){
await cTab.evaluate(goToBottom);
function goToBottom(){
    window.scrollBy(0,window.innerHeight);

}
}






async function getStats(){
    console.log("do");
    let list =cTab.evaluate(getNameAndDuration,'#video-title','#container>#thumbnail');// span#text.style-scope.ytd-thumbnail-overlay-time-status-renderer
   // let list =cTab.evaluate(getNameAndDuration,'#video-title','span#text.style-scope.ytd-thumbnail-overlay-time-status-renderer');
    console.log("qw");
    return list;

}
function getNameAndDuration(videoSelector,durationSelector){
    let videoEle=document.querySelectorAll(videoSelector);
    let durationEle=document.querySelectorAll(durationSelector);
    let cList=[];
    console.log("hero1");
    for(let i=0;i<videoEle.length;i++){
    let videoTittle=videoEle[i].innerText;
    let duration=durationEle[i].innerText;
    cList.push({videoTittle,duration});
    }
    return cList;
}