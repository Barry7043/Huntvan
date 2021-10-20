document.onmouseover=function(e){
  //console.log(event.srcElement.tagName);
  if(event.srcElement.tagName=='BUTTON'){
    event.srcElement.style.backgroundColor="DodgerBlue";
  }
}

document.onmouseout=function(e){
  if(event.srcElement.tagName=='BUTTON'){
    event.srcElement.style.backgroundColor="DeepSkyBlue";
  }
}
