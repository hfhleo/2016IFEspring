//===============> 通用代码 <===============
var gId = function(x) { return document.getElementById(x); };

function addEvent(ele, event_name, func) {
  if (window.attachEvent){
    ele.attachEvent(event_name, func);
  }
  else{
    event_name = event_name.replace(/^on/, "");
    ele.addEventListener(event_name, func, false);
  }
}

//===============> 数据接口 <===============
var tableData = {
  tableHeader: {
    name: "姓名",
    chinese: "语文",
    math: "数学",
    english: "英语",
    sum: "总分",
    },
  xiaoMing: {
    name: "小明",
    chinese: 80,
    math: 90,
    english: 70,
    sum: 240,
    },
  xiaoHong: {
    name: "小红",
    chinese: 90,
    math: 60,
    english: 90,
    sum: 240,
    },
  xiaoLiang: {
    name: "小亮",
    chinese: 60,
    math: 100,
    english: 70,
    sum: 230,
    },
  xiaoBuDian: {
    name: "小不点",
    chinese: 65,
    math: 75,
    english: 95,
    sum: 235,
    },
};

//===============> 事件相关 <===============
function allEvent() {
  // 排序按钮事件
  addEvent(gId("genTable"),"click",function(x) {
    var tar = x.target;
    if ( tar.nodeName !== "INPUT") return;

    // 获取需要排序的科目
    var headerObj = {};
    var headerName = Object.keys(tableData.tableHeader);
    for (var i = 0; i < headerName.length ; i++) {
      headerObj[tableData.tableHeader[headerName[i]]] = headerName[i];
    }
    var parData = tar.parentNode.firstChild.data;
    var order = [];

    if (tar.className === "toLarge") {
      order = sortData(tableData,headerObj[parData],true);
    } else {
      order = sortData(tableData,headerObj[parData],false);
    }
    genTable(tableData, gId("genTable"), order);
  });
}

//===============> 排列 <===============
// 传入(表格数据 object，排序依据，是否为升序true),返回显示顺序 array
function sortData(data, sortBy,up) {
  if (sortBy === null) { sortBy = "sum"; }
  var arrDataName = Object.keys(data);
  var unsortArr = [];
  var sortArr = [];

  for (var i = 0; i < arrDataName.length ; i++) {
    unsortArr.push([arrDataName[i],data[arrDataName[i]][sortBy]]);
  }
  if (up) {
    unsortArr.sort(function(a, b) {return a[1] - b[1];});
  } else {
    unsortArr.sort(function(a, b) {return b[1] - a[1];});
  }
  unsortArr.forEach(function(x) { sortArr.push(x[0]); });
  return sortArr;
}

//===============> 表格生成 <===============
// 生成表格，传入(表格数据源, 表格生成 node， 表格生成顺序array）
function genTable(data,node,tableOrder) {
  var insert = "<table class='table'><tr><th>姓名<\/th>";
  var headerOrder = Object.keys(data.tableHeader);
  if (!tableOrder) tableOrder = Object.keys(data);
  // 生成表头
  for (var i = 1; i < headerOrder.length ; i++) {
    insert += "<th>" + data.tableHeader[headerOrder[i]] +
      "<input class='toLarge' type='button' id='" + headerOrder[i] + "ToLarge'>" +
      "<input class='toSmall' type='button' id='" + headerOrder[i] + "ToSmall'><\/th>";
  }
  insert += "<\/tr>";

  // 生成个人数据
  for (i = 1; i < tableOrder.length ; i++) {
    var sum = 0;
    insert += "<tr>";
    for (var j = 0; j < headerOrder.length ; j++) {
      insert += "<td>" + data[tableOrder[i]][headerOrder[j]] + "<\/td>";
    }
    insert += "<\/tr>";
  }
  node.innerHTML = insert;
}

//===============> 流程管理 <===============
function init() {
  "use strict";
  var tableNode = gId("genTable");
  allEvent();
  genTable(tableData, tableNode);
}

window.onload = init;

