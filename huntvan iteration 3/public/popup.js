var liked=false;                                                                //点击帖子需要更新liked的值，popup需要用到
var follow=false;                                                               //点击帖子需要更新follow的值，popup需要用到



document.onclick=function(e){

  if (e.srcElement.className=='modal'){//弹窗后点击弹窗外部分，隐藏弹窗
    window.location.href = '/homepage';
  }
  else if(e.srcElement.id=="followStatu"){//点击follow按钮，改变follow状态-------follow状态从database取
    if(!follow){
      document.getElementById("followStatu").src="followed.png";
      document.getElementById("followsta").value="1";
      follow=true;
    }
    else{
      document.getElementById("followStatu").src="notFollowed.png";
      follow=false;
    }
  }
  else if (e.srcElement.id=="heart"){//点击蓝心会变色
    if(liked){
      e.srcElement.src="notliked.png";

      liked=false;
    }
    else{
      e.srcElement.src="liked.png";
      document.getElementById("countheart").value="1";
      liked=true;
    }
  }
}


document.onmouseover=function(e){
  if(event.srcElement.id=='send'){
    event.srcElement.src="sendMouseOn.png";
  }
}

document.onmouseout=function(e){
  if(event.srcElement.id=='send'){
    event.srcElement.src="send.png";
  }
}
