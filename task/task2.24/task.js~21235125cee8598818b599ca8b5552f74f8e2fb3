// 全局参数：速度，算法，动画状态, 动画信息寄存器
var speed = document.getElementById("interval");
var arithmetic = document.getElementById("arithmetic");
var searchInput = document.getElementById("searchInput");
var addInput = document.getElementById("addInput");
var oneTree = new tree();

/*
 * * * 事件相关 * */
// 事件绑定
function addEvent() {
  document.getElementById("generation").onclick = generation;
  document.getElementById("start").onclick = startShow;
  document.getElementById("searchStart").onclick = search;
  document.getElementById("wrapTree").addEventListener("click", clickTree);
  document.getElementById("add").onclick = add;
  document.getElementById("del").onclick = del;
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

  var oneNode = document.getElementById("wrapTree");
  // 生成 roo 节点
  oneNode.innerHTML = "<div></div>";
  genBranch(oneNode.childNodes[0], 3);
}

// 开始历遍按钮
function startShow() {
  if (oneTree.inAnimation) {
    alert("演示中，请稍等");
    return;
  }
  oneTree.forShow = [];
  oneTree.inAnimation = true;
  var root = document.getElementById("wrapTree").firstElementChild;
  switch (arithmetic.value) {
    case "1":
      oneTree.fontOrder(root);
      break;
    default:
      oneTree.preOrder(root);
  }
  oneTree.forShow.push("");
  oneTree.show(speed.value);
}

// 查询按钮
function search() {
  if (oneTree.inAnimation) {
    alert("演示中，请稍等");
    return;
  }
  var root = document.getElementById("wrapTree").firstElementChild;
  oneTree.forShow = [];
  oneTree.searched = [];
  oneTree.search(root);
  oneTree.show(speed.value, true);
}

// 点击节点事件
function clickTree(x) {
  var tar = x.target;
  if (tar.nodeName === "DIV") {
    if (tar.className === "selected") {
      tar.style.backgroundColor = "";
      tar.className = "";
    } else {
      tar.style.backgroundColor = "lightblue";
      tar.className = "selected";
    }
  }
}

// 添加按钮事件
function add() {
  var addValue = addInput.value;
  var addTar = document.getElementsByClassName("selected");
  oneTree.add(addTar,addValue);
}


// 删除按钮事件
function del() {
  var addTar = document.getElementsByClassName("selected");
  oneTree.del(addTar);
}

/*
   * * * 多叉树 protoptype * */
// 定义历遍原形
function tree() {
  this.inAnimation = false;
  this.forShow = [];  //记录当前历遍 node
  this.searched = []; // 记录被查询到的匹配 node
}

// 前序历遍：传出 oneTree.forShow
tree.prototype.preOrder = function(node) {
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

// 后序历遍：传出 oneTree.forShow
tree.prototype.fontOrder = function(node) {
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

// 历遍查询：传出 oneTree.forShow
tree.prototype.search = function(node) {
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
tree.prototype.show = function(aniSpeed, n) {
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

// 节点添加：传入(元素[nodeList]，节点值[string])
tree.prototype.add = function(nodeList,str) {
  var len = nodeList.length;
  [].forEach.call(nodeList, function(x) {
    x.innerHTML += "<div>" + str + "<\/div>"; 
  });
  for (var i = 0; i < len; i++) {
    nodeList[0].style.backgroundColor = "";
    nodeList[0].className= "";
  }
};

// 删除节点： 传入(节点元素[nodeList])
tree.prototype.del = function(nodeList) {
  var len = nodeList.length;
  // 有没有不这么蛋疼的删除节点方法？
  for (var i = 0; i < len; i++) {
    nodeList[0].parentNode.removeChild(nodeList[0]);
  }
};


/*
   * * * 流程控制 * */

// 自启流程控制
function init() {
  addEvent();
  generation();
}
// 自启
window.onload = init;
