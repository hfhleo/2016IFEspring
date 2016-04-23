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
  document.getElementById("promptHeader").ondragstart = dragStart;
  document.getElementById("promptHeader").ondragend = dragEnd;
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
  event.dataTransfer.setData("Text",event.target.parentNode.id);
  event.target.parentNode.style.opacity = "0.5";
  var mouseOffsetX = startX - document.getElementById("prompt").offsetLeft;
  var mouseOffsetY = startY - document.getElementById("prompt").offsetTop;
  event.dataTransfer.setDragImage(document.getElementById("prompt"),mouseOffsetX,mouseOffsetY);
}

function dragOver(event) {
  event = event || window.event;
  event.stopPropagation();
  event.preventDefault();
}

function drop(e) {
  var data = event.dataTransfer.getData("Text");
  var left = parseFloat(document.getElementById(data).style.left || 0) + e.screenX - startX;
  var top = parseFloat(document.getElementById(data).style.marginTop || 0) + e.screenY - startY;
  var maxLeft = (document.documentElement.clientWidth - document.getElementById(data).offsetWidth) / 2;
  var maxTop = (document.documentElement.clientHeight - document.getElementById(data).offsetHeight) / 2;
  if (Math.abs(left) < maxLeft) {
    document.getElementById(data).style.left = left + "px";
  } else {
    document.getElementById(data).style.left = ((left > 0) ? maxLeft : -maxLeft) + "px";
  }
  if (Math.abs(top) < maxTop ) {
    document.getElementById(data).style.marginTop = top + "px";
  } else {
    document.getElementById(data).style.marginTop = ((top > 0) ? maxTop : -maxTop) + "px";
  }
}

function dragEnd(e) {
  event.target.parentNode.style.opacity = "1";
}

/*
 * * * 流程控制
*/
function init() {
  addEvent();
}
init();



