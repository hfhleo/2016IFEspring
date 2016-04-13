"use strict"
/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: 0,
  nowGraTime: "day"
};

/**
 * 渲染图表
 */
function renderChart() {
  var time = pageState["nowGraTime"];
  var city = pageState["nowSelectCity"];
  var chart = "";
  var dataArray = chartData[time][city], height;
  for (var i = 0; i < dataArray.length; i++) {
    height = (dataArray[i][1]/5).toFixed(0);
    if (height.length < 2) {
      height = "0" + height;
    }
    chart = chart + "<div class='aqi-" + time + "' title='日期：" + dataArray[i][0] 
    + "&#10;天气质量: " + dataArray[i][1] + "' style='height:" + height + "%'></div>" + "\n";
  }
  document.getElementsByClassName("aqi-chart-wrap")[0].innerHTML = chart;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(t) {
  // 确定是否选项发生了变化 
  if (t === pageState["nowGraTime"]) {
    return;
  }

  // 设置对应数据
  pageState["nowGraTime"] = t;
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(c) {
  // 确定是否选项发生了变化 
  if (c === pageState["nowSelectCity"]) {
    return;
  }

  // 设置对应数据
  pageState["nowSelectCity"] = c;
  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var timeList = document.getElementById("form-gra-time");
  timeList.addEventListener("click", showTime, false);
  function showTime(x) {
    var t = x.target;
    if (t.nodeName.toLowerCase() === "input") {
      graTimeChange(t.value);
    }
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  var cityList = document.getElementById("city-select");
  cityList.addEventListener("mouseleave", function(x) {
    citySelectChange(cityList.value);
  });
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  var aqiDayChar = {};    // daily praghic data
  var aqiWeekChar = {};   // weekly praghic data
  var aqiMonthChar = {};  // monthly praghic data
  var citySource;         // citySource source data

  // 城市名字转 array
  var cityList = Object.keys(aqiSourceData);//cityname list array

  // 日期转 array
  var dayList = []; 
  for (var k in aqiSourceData[cityList[0]]) {
    dayList.push(k);
  }

  // 生成单日数据
  for (var i = 0; i < cityList.length; i++) {
    var dayArray = [];
    citySource = aqiSourceData[cityList[i]];
    for (var j = 0; j < dayList.length; j++) {
      dayArray[j] = [dayList[j], citySource[dayList[j]]];
    }
    aqiDayChar[cityList[i]] = dayArray;
  }

  // 转单周数据为array
  function toWeek(dayInWeek) {
    var aqi = 0;
    var dayTitle = dayArray[0] + "~" + dayArray[dayInWeek-1];
    for (var j = 0; j < dayInWeek; j++) {
      aqi = aqi + citySource[dayArray[j]]/dayInWeek
    }
    dayArray.splice(0,dayInWeek);
    return [dayTitle,aqi.toFixed(0)];
  }

  // 生成周数据
  for (var i = 0; i < cityList.length; i++) {
    //重置数据
    var dayArray = dayList.join(",").split(","); 
    var aqiCityWeek = [];  // date of a city in weekly
    citySource = aqiSourceData[cityList[i]];

    //转为周单位的数据
    aqiCityWeek.push(toWeek(3)); 
    while (dayArray.length > 6) {
      aqiCityWeek.push(toWeek(7)); 
    }
    aqiCityWeek.push(toWeek(dayArray.length)); 
    aqiWeekChar[cityList[i]] = aqiCityWeek;
  }


  //转单月数据为 array
  function toMonth(i, j) {
    var aqi = 0;
    var title;
    var daysAMonth = startEnd[j][1] - startEnd[j][0] + 1;
    title = dayList[startEnd[j][0]] + " ~ " + dayList[startEnd[j][1]];
    for (var k = startEnd[j][0]; k <= startEnd[j][1]; k++) {
      aqi = aqi + citySource[dayList[k]];
    }
    return [title, (aqi/daysAMonth).toFixed(0)];
  }

  // 处理日期序列
  var startEnd =  [];
  startEnd[0] = [dayList.indexOf("2016-01-01"), dayList.indexOf("2016-01-31")];
  startEnd[1] = [dayList.indexOf("2016-02-01"), dayList.indexOf("2016-02-29")];
  startEnd[2] = [dayList.indexOf("2016-03-01"), dayList.indexOf("2016-03-31")];

  //生成月数据
  for (var i = 0; i < cityList.length; i++) {
    var aqiCityMonth = [];
    citySource = aqiSourceData[cityList[i]];
    for (var j = 0; j < 3; j++) {
      aqiCityMonth.push(toMonth(i, j));
    }
    aqiMonthChar[cityList[i]] = aqiCityMonth;
  }

  // 处理好的数据存到 chartData 中
  chartData["day"] = aqiDayChar;
  chartData["week"] = aqiWeekChar;
  chartData["month"] = aqiMonthChar;
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

window.onload = init;
