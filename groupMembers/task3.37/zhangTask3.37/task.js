/*
 * * * 全局变量
*/
var rise = document.getElementById("rise");


/*
 * * * 事件相关
*/
function addEvent() {
  document.getElementById("start").onclick = showRise;
  document.getElementById("riseConfirm").onclick = hideRise;
  document.getElementById("riseCancel").onclick = hideRise;
  document.getElementById("rise").onclick = clickFog;
  // 拖拽事件
  document.getElementById("prompt").ondragstart = dragStart;
  document.getElementById("prompt").ondragend = dragEnd;
  document.getElementById("rise").ondragover = dragOver;
  document.getElementById("rise").ondrop = drop;
}

// 显示浮出层
function showRise() {
  rise.style.display = "";
  document.getElementsByTagName("body")[0].style.overflow = "hidden";
}

// 隐藏浮出层
function hideRise() {
  rise.style.display = "none";
  document.getElementsByTagName("body")[0].style.overflow = "";
}

// 点击黑色覆盖层效果
function clickFog(x) {
  var tar = x.target;
  if (tar.id === "rise") {
    hideRise();
  }
}

/*
 * * * 拖拽
*/
var startX = 0;
var startY = 0;

function dragStart(e) {
  event.dataTransfer.effectAllowed = 'move';
  startX = e.screenX;
  startY = e.screenY;
  event.dataTransfer.setData("Text",event.target.id);
  event.target.style.opacity = "0.5";
}

function dragOver(event) {
  event = event || window.event;
  event.stopPropagation();
  event.preventDefault();
}

function drop(e) {
  var data = event.dataTransfer.getData("Text");
  var left = document.getElementById(data).style.left.replace("px","") * 1;
  var top = document.getElementById(data).style.marginTop.replace("px","") * 1;
  document.getElementById(data).style.left = (left + e.screenX - startX) + "px";
  document.getElementById(data).style.marginTop = top + e.screenY - startY + "px";
}

function dragEnd(e) {
  event.target.style.opacity = "1";
}

/*
 * * * 流程控制
*/
function init() {
  addEvent();
}
init();



