console.log(list);
var cN = 0;
var scN = 0;
var debug = false;
var obs = new MutationObserver((mutationList) => {
    if (debug) {
      console.log("MutationObserver is trying to test newly loaded comments.");
    }
    filtering(list);
  });
  const conf = {
    attributes: false,
    childList: true,
    subtree: true,
  };
  const targ = document.evaluate(
    "/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]/div/ytd-comments/ytd-item-section-renderer/div[3]",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

function filtering(list){
    var cL = document.getElementsByTagName
    (
    "ytd-comment-thread-renderer"
    );
    for (var i = cN; i < cL.length; i++) 
    {
        // commentNum++;
        var cS =
            cL[i].childNodes[2].childNodes[2].childNodes[3].childNodes[3]
            .childNodes[2].innerText;
            
        cL[i].style = "display :";
        for(var j = 0; j < list.length; j++){
            if (cS.includes(list[j])){
                cL[i].style = "display : none";
                break;
            } else {
                cL[i].style = "display :";
            }
        }
    }
    obs.observe(targ, conf);
}
filtering(list);