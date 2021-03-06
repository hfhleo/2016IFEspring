"use strick";

var aqiData = {};

// 从用户输入中获取数据，向aqiData中增加一条数据
function addAqiData() {
  var city = document.getElementById("aqi-city-input").value.trim();
  var value = document.getElementById("aqi-value-input").value.trim();

  function isZhOrEng(str) {
    if (/^[\u4e00-\u9fa5]+$/.test(str) || /^[A-Za-z]+$/.test(str)) {
        return true;
    }
  }
  function isNum(str) {
    if (/^[0-9]+$/.test(str)) {
      return true;
    }
  }

  // 判断空值
  if (city.length == 0 || value.length == 0) {
    window.alert("请输入完整信息");
    return false;
  }

  // 判断中英文
  if (!isZhOrEng(city)) {
    window.alert("请输入中文或英文城市名。");
    return false;
  }

  // 判断整数
  if (isNum(value)) {
    aqiData[city] = value;
    return [city, value];
  } else {
    window.alert("请输入整数的空气指数。");
    return false;
  }
}

// 渲染aqi-table表格
function renderAqiList() {
  var fragment = document.createDocumentFragment();
  var arrays=[["城市", "空气质量", "操作"]];
  for (var i in aqiData) {
    var arr = [i, aqiData[i], "<button>删除</button>"];
    arrays.push(arr);
  }
  for (i = 0; i < arrays.length; i++) {
    var tr = document.createElement("tr");
    for (var j = 0; j < arrays[i].length; j++) {
      var td = document.createElement("td");
      td.innerHTML = arrays[i][j];
      tr.appendChild(td);
    }
    fragment.appendChild(tr);
  }
  document.getElementById("aqi-table").innerHTML = "";
  document.getElementById("aqi-table").appendChild(fragment);
  var del = document.getElementById("aqi-table").getElementsByTagName("button");
  for (var i = 0; i < del.length; i++) {
    del[i].onclick = delBtnHandle;
  }
}

// 点击add-btn时，获取用户输入，更新数据，并进行页面呈现的更新
function addBtnHandle() {
  if (addAqiData()) {
    renderAqiList();
  }
  // 输入框复位
  document.getElementById("aqi-city-input").value = "";
  document.getElementById("aqi-value-input").value = "";
}

// 点击删除按钮，获取哪个城市数据被删，删除数据，更新表格显示
function delBtnHandle() {
  var btn = document.activeElement;
  var del = btn.parentNode.parentNode.firstChild;
  delete aqiData[del.innerHTML];
  renderAqiList();
}


function init() {
  var btn = document.getElementById("add-btn");
  btn.onclick = addBtnHandle;

  document.onkeydown = function(x) {
    if (x.keyCode === 13) {
      btn.click();
      event.preventDefault();
    }
  }
  // 如何监听 table 变化？
}

window.onload = init;  

