// 全局参数：速度，算法，动画状态, 动画信息寄存器
var speed = document.getElementById("interval");
var arithmetic = document.getElementById("arithmetic");
var root = document.getElementById("wrapTree").firstElementChild;
var searchInput = document.getElementById("searchInput");
var traversOne = new traversing();

// 事件绑定
function addEvent() {
  document.getElementById("generation").onclick = generation;
  document.getElementById("start").onclick = startShow;
  document.getElementById("searchStart").onclick = search;
}

// 随机生成多叉树
function generation() {
  // 生成 n~m之间的随机数，包括 n，m
  function random(n,m) {
    var w = m - n;
    var num = Math.round((Math.random() * w) + n);
    return num;
  }

  // 随机生成字幕，n 为字母个数
  function ranLetter(n) {
    var divValue = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S"];
    var output = "";
    for (var i = 0; i < n; i++) {
      output += divValue[random(0,divValue.length-1)];
    }
    return output;
  }

  // 递归生成随机分支,node为根目录，n 为最多层级数
  function genBranch(node, n) {
    if (n === 0 ) return;
    var howMany = random(1,3);
    var genTimes = 0;
    var insert = ranLetter(2);

    // 生成下一层分支
    for (var i = 0; i < howMany; i++) {
      insert += "<div>" + ranLetter(2) + "</div>";
    }
    node.innerHTML = insert;

    // 递归生成下一层分支
    var children = node.childNodes;
    for (var j = 0; j < children.length; j++) {
      genBranch(children[j], n - 1);
    }
  }

  var oneNode = document.getElementById("root");
  genBranch(oneNode, 3);
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
    case "1":
      traversOne.fontOrder(root);
      break;
    default:
      traversOne.preOrder(root);
  }
  traversOne.forShow.push("");
  traversOne.show(speed.value);
}

// 查询按钮
function search() {
  if (traversOne.inAnimation) {
    alert("演示中，请稍等");
    return;
  }
  traversOne.forShow = [];
  traversOne.searched = [];
  traversOne.search(root);
  traversOne.show(speed.value, true);
}

// 定义历遍原形
function traversing() {
  this.inAnimation = false;
  this.forShow = [];  //记录当前历遍 node
  this.searched = []; // 记录被查询到的匹配 node
}

// 前序历遍：传出 traversOne.forShow
traversing.prototype.preOrder = function(node) {
  if (node !== null) {
    if (node.nodeName === "DIV") {
      this.forShow.push([node]);
    }

    var children = node.childNodes;
    for (var j = 0; j < children.length; j++) {
      this.preOrder(children[j]);
    }
  }
};

// 后序历遍：传出 traversOne.forShow
traversing.prototype.fontOrder = function(node) {
  if (node !== null) {
    var children = node.childNodes;
    for (var j = children.length - 1; j > 0; j = j - 1) {
      this.fontOrder(children[j]);
    }

    if (node.nodeName === "DIV") {
      this.forShow.push([node]);
    }
  }
};

// 历遍查询：传出 traversOne.forShow
traversing.prototype.search = function(node) {
  var searchValue = searchInput.value;
  var len = this.forShow.length;

  if (node !== null) {
    if (node.nodeName === "DIV") {
      if (node.firstChild.data.includes(searchValue)) {
        this.searched.push(node);
      }
      this.forShow.push([node].concat(this.searched));
    }

    var children = node.childNodes;
    for (var j = 0; j < children.length; j++) {
      this.search(children[j]);
    }
  }
};

// 展示动画: 传入(speed[integer])
traversing.prototype.show = function(aniSpeed, n) {
  var self = this;
  var timer = setInterval(show,(aniSpeed || 500));
  function show() {
    if (self.forShow.length === 0) {
      if (self.searched.length === 0 && n === true) {
        alert("啥都没找到。");
      }
      self.inAnimation = false;
      clearInterval(timer);
    } else {
      var list = document.getElementById("wrapTree").getElementsByTagName("div");
      var showNow = self.forShow.shift();
      for (var j = 0; j < list.length - 1; j++) {
        if (showNow.indexOf(list[j]) !== -1 ) {
          list[j].style.backgroundColor = "orange";
        } else {
        list[j].style.backgroundColor = "";
        }
      }
    }
  }
};

// 自启流程控制
function init() {
  addEvent();
  generation();
}
// 自启
window.onload = init;
