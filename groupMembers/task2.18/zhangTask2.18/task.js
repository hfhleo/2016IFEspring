// 队列 array
var line = [];

// 输入验证
function checkInput(input) {
  console.log("start check");
  if (/^[1-9][0-9]*$/.test(input)) {
    return true;
  } else {
    alert("请输入正整数");
    return false;
  }
}


// 绑定四个按钮的点击事件
function clickEvent() {
  document.getElementById("leftIn").onclick = btnLeftIn;
  document.getElementById("rightIn").onclick = btnRightIn;
  document.getElementById("leftOut").onclick = btnLeftOut;
  document.getElementById("rightOut").onclick = btnRightOut;
}

// 左侧入
function btnLeftIn() {
  var input = document.getElementById("text").value;
  if (checkInput(input)) {
    line.splice(0,0,input);
  }
  document.getElementById("text").value = "";
  show();
}

// 右侧入 
function btnRightIn() {
  var input = document.getElementById("text").value;
  if (checkInput(input)) {
    line.push(input);
  }
  document.getElementById("text").value = "";
  show();
}

// 左侧出 
function btnLeftOut() {
  var showText = line.shift();
  if ( line.lenght >1) {
    document.getElementById("text").value = showText;
  } else {
    document.getElementById("text").value = "";
  }
  show();
}

// 右侧出
function btnRightOut() {
  var showText = line.pop();
  if ( line.lenght >1) {
    document.getElementById("text").value = showText;
  } else {
    document.getElementById("text").value = "";
  }
  show();
}

// 渲染队列
function show() {
  var input = "";
  for (var i = 0; i < line.length; i++) {
    input += "<div class='square'>" + line[i] + "</div>";
  }
  document.getElementById("line").innerHTML = input;
}

function init() {
  clickEvent();
  show();
}

window.onload = init;
