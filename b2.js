var videoID;
var nextPageToken;
var commentList = new Array();
var myList = document.getElementsByClassName("mylist");
var cnt = 0;
function loadClient() {
    gapi.client.setApiKey("AIzaSyAgAn-OMXWKVLUo_n_x3LUixo_jjgOM7Z0");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
}
// Make sure the client is loaded before calling this method.
async function work(time1, timeStartWork){
    const time2 = await loadClient(time1);
    await execute(time2);
}
async function work2(time1, timeStartWork){
    const time2 = await execute(time1);
    await addListeners(time2);
}
function showComments(){
    myList[0].innerHTML = "";
    for (var i = 0; i<cnt; i++)
    {
        var _cl = commentList[i].split("<split>");
        var tSecond = stringToTime(_cl[1].split("t=")[1].split("\"")[0])

        if ((tSecond > slot*click_inx) && tSecond < slot * (click_inx + 1))
            myList[0].innerHTML += "<li><b>" + _cl[0] + "</b></br>" + _cl[1] + "<div class=\"t\">" + _cl[2] + "</div></li>";
        else if (click_inx == 0)
            myList[0].innerHTML += "<li><b>" + _cl[0] + "</b></br>" + _cl[1] + "<div class=\"t\">" + _cl[2] + "</div></li>";
    }
    addListeners();
}
function execute() {
    return gapi.client.youtube.commentThreads.list({
    "part": [
        "snippet,replies"
    ],
    "maxResults": 100,
    "order": "relevance",
    "textFormat": "html",
    "videoId": videoID,
    "pageToken": nextPageToken
    })
    .then(function(response) {
            // Handle the results here.
            var a = response;
            console.log (a);
            var t = a.result.pageInfo.totalResults;
            for (var i = 0; i<t; i++){
                commentList[cnt] = (a.result.items[i].snippet.topLevelComment.snippet.textDisplay); //textDisplay
                var DisplayName = a.result.items[i].snippet.topLevelComment.snippet.authorDisplayName;
                var publishedAt = a.result.items[i].snippet.topLevelComment.snippet.publishedAt;
                commentList[cnt] = DisplayName + "<split>" + commentList[cnt].replace("/\r/g","</br>") + "<split>" + publishedAt;
                // console.log(commentList[i]);
                if (commentList[cnt].includes("t="))
                {
                    commentList[cnt] = commentList[cnt].replace(/href/g,"href=\"javascript:void(0)\" class=\"ts\" title");
                    cnt++;
                    // commentList[i] = commentList[i].replace(/https:\/\/www.youtube.com/g, "");
                }
            }
            commentList.splice(cnt, 1);

            commentList.sort( function(a,b) {
                var timeString = a.split("t=")[1].split("\"")[0];
                var timeSecond = stringToTime(timeString);

                var timeString2 = b.split("t=")[1].split("\"")[0];
                var timeSecond2 = stringToTime(timeString2);
                return timeSecond - timeSecond2;
            })
            // count timestamp
            var count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = 0; i<cnt; i++)
            {
                var _cl = commentList[i].split("<split>");
                var tSecond = stringToTime(_cl[1].split("t=")[1].split("\"")[0])

                for (var j = 0; j<10; j++){
                    if ((tSecond > slot*j) && (tSecond < slot*(j+1))){
                        count[j]++;
                    }
                }
                datas.splice(0,datas.length);
            }
            // draw timestamp
            for (var i = 0; i<=10; i++)
            {
                datas.push (count[i]);
            }
            
            drawTimeStamp(label, datas);

            // show comments
            showComments();
                
            // If command remain.
            if (Number(t) == 100)
            {
                nextPageToken = a.result.nextPageToken;
                this.work2();
            }
        },
        function(err) { console.error("Execute error", err); });
}
gapi.load("client");

var myLineExtend = Chart.controllers.line.prototype.draw;
var ctx = document.getElementById("LineWithLine").getContext("2d");

Chart.helpers.extend(Chart.controllers.line.prototype, {
    draw: function () {
    
      myLineExtend.apply(this, arguments);   

      var chart = this.chart;
      var ctx = chart.chart.ctx;

      var index = chart.config.data.lineAtIndex;
      var xaxis = chart.scales['x-axis-0'];
      var yaxis = chart.scales['y-axis-0'];

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(xaxis.getPixelForValue("timeStemp", index), yaxis.top );
      ctx.strokeStyle = '#ff0000';
      ctx.lineTo(xaxis.getPixelForValue("timeStemp", index), yaxis.bottom);
      ctx.stroke();
      ctx.restore();

     // ctx.textAlign = 'center';
      //ctx.fillText("TODAY", xaxis.getPixelForValue(undefined, index), yaxis.top + 6);

    }
});
let tt; // duration of video
let label = []; // timeslot labels
let slot; // timeslot (duration / 10)
let datas = []; // timeslot count data
let click_inx = 0; // click index
window.onload = function() {
    myList[0].innerHTML = "";
    videoID = parent.videoID;
    // draw
    chrome.tabs.query(
        { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
        function(tabs) {
          const { id: tabId } = tabs[0].url;
          let code = 'document.getElementsByClassName("video-stream")[0].duration';
          chrome.tabs.executeScript(tabId, { code }, function (result) {
              console.log(result[0]);
              tt = parseInt(result[0]);
              console.log(timeToString(tt));

              slot = parseInt(tt / 10);
              for (var i = 0; i<=10; i++)
                label.push(timeToString(parseInt(i*slot)));

              for (var i = 0; i<=10; i++)
                datas.push (10-i);
              drawTimeStamp(label, datas);
              datas.splice(0,datas.length);
          });
        }
    )
    this.work();
}
function drawTimeStamp(label, datas){
    new Chart(ctx, {
        type: 'line',
        data: {
          labels: label,
          datasets: [{
            label: "Count(TimeStamp Comment)",
            data: datas
          }],
          datasetFill : false,
          lineAtIndex: 0
        },
        options: {
          onClick: (evt, item) => {
              
              click_inx = item[0]["_index"];
              Chart.helpers.extend(Chart.controllers.line.prototype, {
                  draw: function () {
                  
                    myLineExtend.apply(this, arguments);   
              
                    var chart = this.chart;
                    var ctx = chart.chart.ctx;
              
                    var index = click_inx;
                    var xaxis = chart.scales['x-axis-0'];
                    var yaxis = chart.scales['y-axis-0'];
              
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(xaxis.getPixelForValue("timeStemp", index), yaxis.top );
                    ctx.strokeStyle = '#ff0000';
                    ctx.lineTo(xaxis.getPixelForValue("timeStemp", index), yaxis.bottom);
                    ctx.stroke();
                    ctx.restore();
            
                  }
              });
              showComments();
          }
        }
      });
}
function aListener(event){
    var timeString = event.target.title.split("t=")[1];
    var timeSecond = stringToTime(timeString);

    // chrome.tabs.update(null, {url:event.target.title});
    chrome.tabs.executeScript({
        code: 'document.getElementsByClassName("video-stream")[0].currentTime = ' + timeSecond + ';'
    });
}
function addListeners(){
    var ts = document.getElementsByClassName("ts")
    for (let i = 0; i < ts.length; i++)
    {
        //console.log(i);
        ts[i].addEventListener("click", aListener);
    }
}
function stringToTime(timeString){
    timeString = timeString.replace("s","").replace("m","").replace("h","");
    var timeSecond = 0;
    weight = 0.1;
    var _tl = timeString.length;
    for (var i=0; i<_tl; i++)
    {
        if (i!=0 && i%2==0) {weight *= 6;} else {weight *= 10;}
        timeSecond += weight * Number(timeString[_tl-i-1]);
        //console.log (timeSecond + ' ' + timeString[_tl-i-1]);
    }
    return timeSecond;
}
function timeToString(timeSecond){
    if (timeSecond < 60)
        return "00:" + (timeSecond % 60);
    else if (timeSecond < 3600)
        return parseInt(timeSecond / 60) + ":" + (timeSecond % 60);//' + "s";
    else
        return parseInt(timeSecond / 3600) + ":" + parseInt((timeSecond % 3600) / 60) + ":" + (timeSecond % 60);
}
