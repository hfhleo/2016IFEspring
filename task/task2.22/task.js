// 全局参数：速度，算法，动画状态, 动画信息寄存器
var speed = document.getElementById("interval");
var arithmetic = document.getElementById("arithmetic");
var root = document.getElementById("wrapTree").firstElementChild;
var traversOne = new traversing();

// 事件绑定
function addEvent() {
  document.getElementById("start").onclick = startShow;
}

// 开始历遍按钮
function startShow() {
  if (traversOne.inAnimation) {
    alert("演示中，请稍等");
    return;
  }
  traversOne.forShow = [];
  traversOne.inAnimation = true;
  switch (arithmetic.value) {
    case "0":
      traversOne.preOrder(root);
      break;
    case "1":
      traversOne.inOrder(root);
      break;
    default:
      traversOne.fontOrder(root);
  }
  traversOne.show(traversOne.forShow,speed.value);
}

// 定义历遍原形
function traversing() {
  this.inAnimation = false;
  this.forShow = [];
}

// 前序历遍：传出 array
traversing.prototype.preOrder = function(node) {
  if (node !== null) {
    this.forShow.push(node);
    if (node.firstElementChild) { this.preOrder(node.firstElementChild); }
    if (node.lastElementChild) { this.preOrder(node.lastElementChild); }
  }
};

// 中序历遍：传出 array
traversing.prototype.inOrder = function(node) {
  if (node !== null) {
    this.inOrder(node.firstElementChild);
    this.forShow.push(node);
    this.inOrder(node.lastElementChild);
  }
};

// 后序历遍：传出 array
traversing.prototype.fontOrder = function(node) {
  if (node !== null) {
    this.fontOrder(node.firstElementChild);
    this.fontOrder(node.lastElementChild);
    this.forShow.push(node);
  }
};

// 展示动画: 传入(array,integer)
traversing.prototype.show = function(arr,aniSpeed) {
  var self = this;
  arr.push("");
  var timer = setInterval(show,(aniSpeed || 500));
  function show() {
    if (arr.length === 0) {
      self.inAnimation = false;
      clearInterval(timer);
    } else {
      var list = document.getElementsByClassName("lev");
      var showNow = arr.shift();
      for (var i = 0; i < list.length; i++) {
        if (list[i] === showNow) {
          list[i].style.backgroundColor = "orange";
        } else {
        list[i].style = "";
        }
      }
    }
  }
};

// 自启流程控制
function init() {
  addEvent();
}
// 自启
window.onload = init;
