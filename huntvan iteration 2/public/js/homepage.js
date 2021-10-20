
function openImage() {
  document.getElementById("btn-1").click();
}

function getObjectURL(file) {
  var url = null ;
  if (window.createObjectURL != undefined) {
    // basic
    url = window.createObjectURL(file) ;
  } else if (window.URL != undefined) {
    // mozilla(firefox)
    url = window.URL.createObjectURL(file) ;
  } else if (window.webkitURL != undefined) {
    // webkit or chrome
    url = window.webkitURL.createObjectURL(file) ;
  } else {
    return false;
  }
  return url ;
}

function submitimg(obj) {
  var newSrc = getObjectURL(obj.files[0]);
  document.getElementById('col2-post-text-image').src = newSrc;
}

function printText(event) {

  // 发帖主题
  var text = document.getElementById("col2-post-text-title").value;

  // 发帖文字
  var text = document.getElementById("col2-post-text-container").value;

  // 发帖图片
  var image = document.getElementById('col2-post-text-image').src;

  // 发帖地址
  var selectPlace = document.getElementById('col2-post-toolbar-autocomplete');
  var place = selectPlace.value;

  // 发帖金额
  var select = document.getElementById('col2-post-toolbar-button-select');
  var index = document.getElementById('col2-post-toolbar-button-select').selectedIndex;
  var money = select.options[index].value;

  console.log(text);
  console.log(image);
  console.log(place);
  console.log(money);
}

// Google map api part
var autocomplete;
var countryRestrict = {'country': 'ca'};

function initMap() {
  autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */ (
                document.getElementById('col2-post-toolbar-autocomplete')), {
              componentRestrictions: countryRestrict
              });
  autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged() {
  var place = autocomplete.getPlace();
  if (!place.geometry) {
    document.getElementById('autocomplete').placeholder = 'Enter a city';
  }
}
