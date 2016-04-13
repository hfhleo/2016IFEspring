"use strict"

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
  nowSelectCity: "北京",
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
    height = Math.round((dataArray[i][1]/5));
    if (height < 10) {
      height = "0" + height;
    }
    chart += "<div class='aqi-" + time + "' title='" + dataArray[i][0] + "&#10;空气：" 
    + dataArray[i][1] + "' style='height:" + height + "%'></div>";
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
 * 初始化日、周、月的radio事件，当点击时，调用函数rraTimeChange
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
  // 初始化选项
  var cityArray = "";
  var city= Object.keys(aqiSourceData);
  for (var i = 0; i < city.length; i++) {
    cityArray = cityArray + "<option>" + city[i] + "</option>";
  }
  document.getElementById("city-select").innerHTML = cityArray;

  // 绑定点击事件
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

  // 生成周数据
  for (var i = 0; i < cityList.length; i++) {
    //重置数据
    var aqiCityWeek = [], dayTitle;  // date of a city in weekly
    var week = 0, aqi = 0, day = 0;
    citySource = aqiSourceData[cityList[i]];

    //转为周单位的数据
    for (var j = 0; j < dayList.length; j++) {
      aqi += citySource[dayList[j]];
      day++;
      if (new Date(dayList[j]).getDay() === 0) {
        week++;
        dayTitle = "第" + week + "周";
        aqiCityWeek.push([dayTitle,Math.round(aqi/day)]);
        aqi = 0;
        day = 0;
      }
    }
    // 最后一周按一周算
    week++;
    dayTitle = "第" + week + "周";
    aqiCityWeek.push([dayTitle,Math.round(aqi/day)]);

    aqiWeekChar[cityList[i]] = aqiCityWeek;
  }

  //生成月数据
  for (var i = 0; i < cityList.length; i++) {
    // 重置数据
    var aqiCityMonth = [];
    citySource = aqiSourceData[cityList[i]];

    var month = 1, day = 0, aqi = 0, title;
    for (var j = 0; j < dayList.length; j++) {
      aqi += citySource[dayList[j]];
      day++;
      var lastDay = new Date(2016,month,0).getDate();
      if (new Date(dayList[j]).getDate() == lastDay) {
        title = month + "月";
        aqiCityMonth.push([title,Math.round(aqi/day)]);
        aqi = 0;
        day = 0;
        month ++;
      }
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
