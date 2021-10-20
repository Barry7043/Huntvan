document.onclick=function(e){
  if(e.srcElement.className=='news-box-content-event'){
    document.getElementById('cover').style.display='block';
    document.getElementById("cover_container").style.display='block';
    if(e.srcElement.id=='test01'){
      document.getElementById('popUpPic').src="./images/abattoir.jpg";
    }
    else if(e.srcElement.id=='test02'){
      document.getElementById('popUpPic').src="./images/northvan.jpg";
    }
    else if(e.srcElement.id=='test03'){
      document.getElementById('popUpPic').src="./images/whytecliff.jpg";
    }
    else if(e.srcElement.id=='test04'){
      document.getElementById('popUpPic').src="./images/chinesebbq.jpg";
    }
    else if(e.srcElement.id=='test05'){
      document.getElementById('popUpPic').src="./images/garibaldi.jpg";
    }
  }
  else if (e.srcElement.className=='modal'){//弹窗后点击弹窗外部分，隐藏弹窗
    document.getElementById('cover').style.display='none';
    document.getElementById("cover_container").style.display='none';
  }
}
