//这个函数是为了增加select下拉框中的项目
var addoption = function(selectag,startData,endData,defaultData){  
	selectag.options.length = 0;  //这是保证每次重新选择，页面重绘都会清除原来的option
	for(var i = startData; i < endData+1; i++){
		var option = document.createElement("option");
		option.value = i;
		option.innerText = i;
		if(i == defaultData){
		option.selected = "selected";
	}
	selectag.appendChild(option);
	}
};
//这个函数是为了动态获取日期
function initBirthDate(birthDateSelect, year, month) {
	var today = new Date(year, month, 0);
	var lastDate = today.getDate();
	addoption(birthDateSelect, 1, lastDate, 1);
};

//下面是取得该节点，然后调用上面的方法
var birthYear = document.getElementById('year');
var birthMonth =  document.getElementById('month');
var birthDate =  document.getElementById('data');
addoption(birthYear, 1990, 2020, 1998);
addoption(birthMonth, 1, 12, 1);
initBirthDate(birthDate, 2000, 1);

//以下两个函数是为了处理当option的值改变时，能正确的将选中的年和月传入
//initBirthDate()，然后重新确定日期的范围
year.onchange = function(event) {
	var years = year.value;
	var months = month.value;
	initBirthDate(birthDate, years, months);
};

month.onchange = function(event) {
	var years = year.value;
	var months = month.value;
	initBirthDate(birthDate, years, months);
};