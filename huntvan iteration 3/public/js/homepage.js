// items sent to database

var title = "";
var text = "";
var image = null;
// [0]:name, [1]:address, [2]:lat, [3]:lng
var place = {
    arr: []
};
var money = "$";


// New! change follow
function change(evt) {
  if (evt.innerText == "Follow") {
    evt.innerText= "Following"
  } else {
    evt.innerText= "Follow"
  }
}

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

function submitting(obj) {
  var newSrc = getObjectURL(obj.files[0]);
  document.getElementById('col2-post-text-image').src = newSrc;
}

function printText(event) {
  // 发帖主题
  title = document.getElementById("col2-post-text-title").value;

  // 发帖文字
  text = document.getElementById("col2-post-text-container").value;

  // 发帖图片
  image = document.getElementById('col2-post-text-image').src;

  // 发帖地址
  var selectPlace = document.getElementById('col2-post-toolbar-autocomplete').value;
  var arr = selectPlace.split(",");
  var temp = "'" + arr[0] + "'";
  getMapInfo(temp);



  // 发帖金额
  var select = document.getElementById('col2-post-toolbar-button-select');
  var index = document.getElementById('col2-post-toolbar-button-select').selectedIndex;
  money = select.options[index].value;


  console.log(title);
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
    document.getElementById('col2-post-toolbar-autocomplete').placeholder = 'Enter a place';
  }
}

function getMapInfo(location) {

  var map;
  var service;

  var vancouver = new google.maps.LatLng(49.246292, -123.116226);

  map = new google.maps.Map(
    (document.getElementById('col2-post-toolbar-autocomplete')),
    {
      center: vancouver,
      zoom:10
    });

  var request = {
    query: location,
    fields: ['name', 'formatted_address', 'geometry'],
  };

  var service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, function(results) {
    addItem(results[0].name);
    addItem(results[0].formatted_address);
    addItem(results[0].geometry.location.lat());
    addItem(results[0].geometry.location.lng());
    /*localStorage.setItem("lat",results[0].geometry.location.lat());
    localStorage.setItem("lng",results[0].geometry.location.lng());*/
      }
  );

}

function addItem(item) {
  place.arr.push(item);
}
