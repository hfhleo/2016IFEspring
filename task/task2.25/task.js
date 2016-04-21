// 全局参数：速度，算法，动画状态, 动画信息寄存器
var searchInput = document.getElementById("searchInput");
var addInput = document.getElementById("addInput");
var oneTree = new tree();
var root = document.getElementById("wrapTree").firstElementChild;

/*
 * * * 事件相关
*/
// 事件绑定
function addEvent() {
  document.getElementById("searchStart").onclick = search;
  document.getElementById("wrapTree").addEventListener("click", clickTree);
  document.getElementById("add").onclick = add;
  document.getElementById("del").onclick = del;
}

// 查询按钮
function search() {
  oneTree.searched = [];
  oneTree.search(root);
  oneTree.show();
}

// 点击节点事件
function clickTree(x) {
  var tar = x.target;
  // 点击节点选中
  if (tar.nodeName === "DIV") {
    if (/selected/.test(tar.className)) {
      tar.style.backgroundColor = "";
      tar.style.backgroundClip = "";
      tar.className = "";
    } else {
      tar.style.backgroundColor = "lightblue";
      tar.style.backgroundClip = "content-box";
      tar.className = "selected";
    }
  }
  // 点击按钮折叠
  if (tar.nodeName === "INPUT") {
    if (/open/.test(tar.className)) {
      oneTree.close(tar);
    } else {
      oneTree.open(tar);
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
 * * * 多叉树 protoptype
*/
// 定义历遍原形
function tree() {
  this.searched = []; // 记录被查询到的匹配 node
}

// 清除所有标记
tree.prototype.clearStyle = function(node) {
  node.style.backgroundColor = "";
  node.style.backgroundClip = "";
  var list = node.childNodes;
  var self = this;
  [].forEach.call(list, function(x) { 
    if (x.nodeName === "DIV") {
      self.clearStyle(x);
    }
  });
};

// 历遍查询：传出 oneTree.searched
tree.prototype.search = function(node) {
  var searchValue = searchInput.value;

  if (searchValue.length === 0) {
    alert("请输入查询的关键词。");
    return;
  }

  if (node !== null) {
    if (node.nodeName === "DIV") {
      if (node.firstChild.data.includes(searchValue)) {
        this.searched.push(node);
      }
    }

    var children = node.childNodes;
    for (var j = 0; j < children.length; j++) {
      this.search(children[j]);
    }
  }
};

// 高亮查询匹配节点
tree.prototype.show = function() {
  var self = this;

  this.clearStyle(root);
  if (self.searched.length === 0) {
    alert("啥都没找到。");
  }
  [].forEach.call(this.searched, function(x) {
    self.open(x);
    openParent(x);
    x.style.backgroundColor = "orange";
    x.style.backgroundClip = "content-box";
    });

  function openParent(node) {
    if (node.parentNode) {
      self.open(node);
      openParent(node.parentNode);
    } 
  }
};

// 节点添加：传入(元素[nodeList]，节点值[string])
tree.prototype.add = function(nodeList,str) {
  if (str.length === 0) {
    alert("请输入添加的节点值。");
    return;
  }
  var len = nodeList.length;
  [].forEach.call(nodeList, function(x) {
    x.innerHTML += "<div>" + str + "<input type='button'><\/div>"; 
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

// 折叠节点：传入父节点元素[node]
tree.prototype.close = function(node) {
  var list = node.parentNode.childNodes;
  node.style.transform = "rotate(0.25turn)";
  node.className = "close";
  [].forEach.call(list, function(x) { 
    if(x.nodeName === "DIV") {
      x.style.display = "none";
    }
  });
};

// 打开折叠：传入父节点元素[node]
tree.prototype.open = function(node) {
  var list = node.parentNode.childNodes;
  node.style.transform = "";
  node.className = "open";
  [].forEach.call(list, function(x) { 
    if(x.nodeName === "DIV") x.style.display = "block";
  });
};

/*
 * * * 流程控制
*/
// 自启流程控制
function init() {
  addEvent();
}
// 自启
window.onload = init;
