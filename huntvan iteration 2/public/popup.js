var liked=false;                                                                //点击帖子需要更新liked的值，popup需要用到
var follow=false;                                                               //点击帖子需要更新follow的值，popup需要用到

document.onclick=function(e){
  if(e.srcElement.className=='photo'){  //如果点击photo，弹窗
    document.getElementById('cover').style.display='block';
    document.getElementById("cover_container").style.display='block';
    var ratio=500/e.target.height;                                              //In the case of主页所有图片的height比600px小
    var photoWidth=parseInt(e.target.width*ratio);
    var popUpWidth=photoWidth+300;


    //alert("ratio="+ratio+", photo-width="+e.target.width+",exact-photoWidth"+e.target.width*ratio);
    document.getElementById("cover_container").style.width=popUpWidth+'px';     //自适应变化popUp的size
    document.getElementById("left").style.width=photoWidth+'px';                //改变popUp左边图片部分的width
    document.getElementById("right").style.marginLeft=photoWidth+'px';          //改变popUp右边部分的margin-Left
    document.getElementById("photoInLeft").src=e.target.src;                    //change the photo in the popUp
    document.getElementById("photoInLeft").style.width=photoWidth+'px';
    if(!follow){
      document.getElementById("followStatu").src="notFollowed.png";
    }
    else{
      document.getElementById("followStatu").src="followed.png";
    }
  }
  else if (e.srcElement.className=='modal'){//弹窗后点击弹窗外部分，隐藏弹窗
    document.getElementById('cover').style.display='none';
    document.getElementById("cover_container").style.display='none';
  }
  else if(e.srcElement.id=="followStatu"){//点击follow按钮，改变follow状态-------follow状态从database取
    if(!follow){
      document.getElementById("followStatu").src="followed.png";
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
