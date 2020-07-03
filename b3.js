// var z;
var videoID;
window.onload = function() {
    videoID = parent.videoID;
    document.getElementById("b1").onclick = function() { getListURL(); }
    document.getElementById("b2").onclick = function() { getListDirect(); }
}
function getListDirect(){
    document.getElementById("img1").style.width = "270px";
    document.getElementById("img2").style.width = "270px";
    document.getElementById("img3").style.width = "270px";
    document.getElementById("img4").style.width = "270px";
    $.ajax({
        type:"GET",
        url:"http://202.30.29.170:8000/plus?url=https://www.youtube.com/watch?v=" + videoID,
        success: function(data) {
            console.log(data);
            var _temp = data.split("\"");
            document.getElementById("img1").src = "data:image/png;base64," + _temp[3];
            console.log (_temp[3]);
            document.getElementById("img2").src = "data:image/png;base64," + _temp[7];
            console.log (_temp[7]);
            document.getElementById("img3").src = "data:image/png;base64," + _temp[11];
            console.log (_temp[11]);
            document.getElementById("img4").src = "data:image/png;base64," + _temp[15];
            console.log (_temp[15]);
        }
    }); 
}

function getListURL(){
    window.open("http://lhsljh123.dothome.co.kr/hci/result.html?videoID=" + videoID, "Youtube Comment Analyze", "width=1024, height=1000, toolbar=no, menubar=no, scrollbars=yes, resizable=no" );  
}
