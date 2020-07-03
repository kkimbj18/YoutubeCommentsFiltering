var tid;
window.onload = function() {
    //this.work();
    if (localStorage.getItem("cnt") == null)
        var a = 0;
    else
        var a = localStorage.getItem("cnt");
    chrome.tabs.executeScript({code:'var list = [];'})
    var myList = document.getElementsByClassName('myList');
    for (var i = 0; i < a; i++)
    {
        if (localStorage.getItem(i) == null);
        else{
            myList[0].innerHTML += "<li>" + localStorage.getItem(i) + 
            "<div class=\"t\" id=" + i + ">삭제하기</div></li>";
            chrome.tabs.executeScript({code:'list.push(\'' + localStorage.getItem(i) + '\')'});
        }
    }
    chrome.tabs.executeScript({file:'filter.js'});

    /*
    
    myList[0].innerHTML = "";
    var temp = ["테스트1", "테스트2", "테스트3"];
    for(var i=0; i<temp.length; i++)
        myList[0].innerHTML += "<li>" + temp[i] + "<div class=\"t\">삭제하기</div></li>";
    */
    for (var i = 0, x = document.getElementsByClassName("t").length; i < x; i++)
    {
        document.getElementsByClassName("t")[i].onclick = function() {
            tid = this.id;
            console.log('list.pop(\'' + localStorage.getItem(tid) + '\')');
            chrome.tabs.executeScript({code:'list.splice(list.indexOf(\'' + localStorage.getItem(tid) + '\'),1); filtering(list);'});
            localStorage.removeItem(tid);
            //chrome.tabs.executeScript({code:''});
            location.reload();   
        }
    }
    document.getElementById("btn_add").onclick = function() {
        if (document.getElementById("txt_add").value != "") {
            //myList[0].innerHTML += "<li>" + document.getElementById("txt_add").value + "<div class=\"t\" id=" + a + ">삭제하기</div></li>";
            localStorage.setItem(a, document.getElementById("txt_add").value);
            chrome.tabs.executeScript({code:'list.push(\'' + localStorage.getItem(a) + '\'); filtering(list);'});
            a++;
            localStorage.setItem("cnt", a);
            //chrome.tabs.executeScript({code:'filtering(list)'});
            location.reload();
            
        } else {
            alert("공백은 필터링에 추가할 수 없습니다!");
        }
        
    }
    console.log('success');
}
/*
function addList(item)
{
    chrome.storage.local.set({apple: item}, function() {
        console.log(item + '기록 되었습니다.');
    });
}
function viewList(){
    var myList = document.getElementsByClassName("mylist");
    chrome.storage.local.get("apple", function (items) {
        myList[0].innerHTML += "<li>" + items.apple  + "<div class=\"t\">삭제하기</div></li>";
        console.log('불러왔습니다.');
    });
}

function clearList(){
    chrome.storage.local.clear(function() {
        var error = chrome.runtime.lastError;
        if(error) { console.error(error); }
    })
}
*/

function init() {
    var val = localStorage.document.getElementById("txt_add");

    document.querySelector("")
}