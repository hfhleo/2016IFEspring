// 队列 array
var line = [];

// 处理 textarea字符串,如何回避两个分隔符中间的空字符
function dealInput(input) {
  var arr = input.split(/[^\u4e00-\u9fa5\w]+/g).filter(function(e) {
    return e.length !== 0; });
  return arr;
}

// 绑定点击事件
function clickEvent() {
  document.getElementById("leftIn").onclick = btnLeftIn;
  document.getElementById("rightIn").onclick = btnRightIn;
  document.getElementById("leftOut").onclick = btnLeftOut;
  document.getElementById("rightOut").onclick = btnRightOut;
  document.getElementById("searchBtn").onclick = search;
  var everyLine = document.getElementById("line");
  everyLine.addEventListener("click", btnLine);
}

// 左侧入点击效果
function btnLeftIn() {
  var input = document.getElementById("text").value.trim();
  if (input.length === 0 ) {
    alert("请输入任意有效字符。");
    return;
  }
  var append = dealInput(input);
  for (var i = 0; i < append.length; i++) {
    line.unshift(append[i]);
  }
  document.getElementById("text").value = "";
  show();
}

// 右侧入点击效果
function btnRightIn() {
  var input = document.getElementById("text").value.trim();
  if (input.length === 0 ) {
    alert("请输入任意有效字符。");
    return;
  }
  var append = dealInput(input);
  if (!append) return;
  for (var i = 0; i < append.length; i++) {
    line.push(append[i]);
  }
  document.getElementById("text").value = "";
  show();
}

// 左侧出点击效果 
function btnLeftOut() {
  if ( line.length > 0) {
    var showText = line.shift();
    alert("移除左侧 " + showText);
    show();
  } else {
    alert("啥都没了，移除个毛线！");
  }
}

// 右侧出点击效果
function btnRightOut() {
  if ( line.length > 0) {
    var showText = line.pop();
    alert("移除右侧 " + showText);
    show();
  } else {
    alert("啥都没了，移除个毛线！");
  }
}

// 字符匹配测试
function isMatch(keyword, unTest) {
  var reg = new RegExp(keyword);
  if (unTest.match(reg)) return true;
}

// 显示匹配元素
function showHigh(highLight) {
  var input = "";
  var square = document.getElementsByClassName("square");
  while (highLight.length > 0) {
    square[highLight.pop()].className += " highLight";
  }
}

// 查询键点击效果
function search() {
  var keyword = document.getElementById("searchInput").value;
  var highLight = [];
  for (var i = 0; i < line.length; i++) {
    if (isMatch(keyword, line[i])) {
      highLight.push(i);
    }
  }
  show();   //消除之前的查询
  showHigh(highLight);
  keyword = "";
}
  

// 各个数字点击效果
function btnLine(x) {
  var tar = x.target;
  var tarParent = tar.parentNode.childNodes;
  var num = [].indexOf.call(tarParent, tar);

  if (tar.className === "square") {
    line.splice(num,1);
  }
  show();
}

// 渲染队列
function show() {
  var input = "";
  input = line.map( function(e) {
    return "<div class='square'>" + e + "</div>";
  }).join("");
  document.getElementById("line").innerHTML = input;
}


function init() {
  clickEvent();
  show();
}

window.onload = init;
