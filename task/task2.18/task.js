// 队列 array
var line = [];

// 输入验证
function checkInput(input) {
  if (/^[1-9][0-9]*$/.test(input)) {
    return true;
  } else {
    alert("请输入正整数");
    return false;
  }
}

// 绑定点击事件
function clickEvent() {
  document.getElementById("leftIn").onclick = btnLeftIn;
  document.getElementById("rightIn").onclick = btnRightIn;
  document.getElementById("leftOut").onclick = btnLeftOut;
  document.getElementById("rightOut").onclick = btnRightOut;
  var everyLine = document.getElementById("line");
  everyLine.addEventListener("click", btnLine);
}

// 左侧入点击效果
function btnLeftIn() {
  var input = document.getElementById("text").value;
  if (checkInput(input)) {
    line.splice(0,0,input);
  }
  document.getElementById("text").value = "";
  show();
}

// 右侧入点击效果
function btnRightIn() {
  var input = document.getElementById("text").value;
  if (checkInput(input)) {
    line.push(input);
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
