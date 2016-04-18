// 全局参数：速度，算法，动画状态, 动画信息寄存器
var speed = document.getElementById("interval");
var arithmetic = document.getElementById("arithmetic");
var inAnimation = false;
var forShow = [];
var root = document.getElementById("wrapTree").firstElementChild;

// 事件绑定
function addEvent() {
  document.getElementById("start").onclick = startShow;
}
// 开始历遍按钮
function startShow() {
  if (inAnimation) return;
  forShow = [];
  inAnimation = true;
  switch (arithmetic.value) {
    case "0":
      traversingDLR();
      break;
    case "1":
      traversingLDR();
      break;
    default:
      traversingLRD();
  }
  var showTree = setInterval(function () {
    if (forShow.length === 0) {
      clearInterval(showTree);
      inAnimation = false;
    } else show();
  },(speed.value || 500));
}

// 前序历遍：传出 array
function traversingDLR() {
  function preOrder(node) {
    if (node !== null) {
      forShow.push(node);
      preOrder(node.firstElementChild);
      preOrder(node.lastElementChild);
    }
  }
  preOrder(root);
  
  // 演示完消除颜色
  forShow.push("");
}

// 中序历遍：传出 array
function traversingLDR() {
  function preOrder(node) {
    if (node !== null) {
      preOrder(node.firstElementChild);
      forShow.push(node);
      preOrder(node.lastElementChild);
    }
  }
  preOrder(root);
  
  // 演示完消除颜色
  forShow.push("");
}

// 后序历遍：传出 array
function traversingLRD() {
  function preOrder(node) {
    if (node !== null) {
      preOrder(node.firstElementChild);
      preOrder(node.lastElementChild);
      forShow.push(node);
    }
  }
  preOrder(root);
  
  // 演示完消除颜色
  forShow.push("");
}

// 展示动画
function show() {
  var list = document.getElementsByClassName("lev");
  var showNow = forShow.shift();
  for (var i = 0; i < list.length; i++) {
    if (list[i] === showNow) {
      list[i].className = "lev now";
    } else {
    list[i].className = "lev";
    }
  }
}
// 自启流程控制
function init() {
  addEvent();
}
// 自启
window.onload = init;
