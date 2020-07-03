// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
var videoID = 1;
function getCurrentTabUrl(callback){
  var queryInfo = {
    active: true,
    currentWindow: true
  }

  chrome.tabs.query(queryInfo, function(tabs){
    var tab = tabs[0];
    var url = tab.url;
    callback(url);
  })
}

function renderURL(statusText){
  if (statusText.includes("watch?v=")) {
    videoID = statusText.split('v=')[1].split('&')[0];
    // document.getElementById('urls').textContent = "videoID = " + statusText.split('v=')[1].split('&')[0];
  }
}

chrome.extension.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
      // document.body.innerText = request.source;
      console.log (request.source);
  }
});

window.onload = function() {
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function(tabs) {
      const { id: tabId } = tabs[0].url;
      let code = 'document.getElementById(\"CLFHeader\").id';
      chrome.tabs.executeScript(tabId, { code }, function (result) {
          console.log(result[0]);
          if (result[0] == null){chrome.tabs.executeScript(null, {file:'content.js'});};
      });
    }
  );
  //document.getElementById("CLFHeader") == null

  // URL 가져오기
  getCurrentTabUrl(function(url){
    renderURL(url);
  })
  /*
  // 현재 탭 소스코드 가져오기
  chrome.tabs.executeScript(null, {
    file: "getSource.js"
    }, function() {
        if (chrome.extension.lastError) {
            console.log('There was an error injecting script : \n' + chrome.extension.lastError.message);
        }
    });
  */
  // 탭 구현
  var f = document.getElementById('tap_frame');
  var type = 0;
  document.getElementById("b1").onclick = function() { fOpenNClose("b1.html"); }
  document.getElementById("b2").onclick = function() { fOpenNClose("b2.html"); }
  document.getElementById("b3").onclick = function() { fOpenNClose("b3.html"); }

  function fOpenNClose(tapName){
    // clear
    document.getElementById("b1").className = "tab_menu_btn";
    document.getElementById("b2").className = "tab_menu_btn";
    document.getElementById("b3").className = "tab_menu_btn";

    var _t = String(f.src).split("/");
    if (tapName != _t[_t.length-1]){
      f.src = tapName;
      f.width = "300px";
      f.height = "400px";
      document.getElementById(tapName.split(".")[0]).className = "tab_menu_btn on";
    } else {
      f.src = "";
      f.width = "0px";
      f.height = "0px";

    }

  }
}
