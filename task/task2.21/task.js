// 记录 tag 标签和 hobby 标签
var tag = [], hobby = [];

// 设置最大 tag 标签数和最大 hobby 标签数
var tagMax = 10;
var hobbyMax = 10;

// 绑定事件
function clickEvent() {
  // tag回车，换行，空格，逗号自动输入
  document.getElementById("tagInput").onkeydown = function(x) {
    if ([9,13,32,188].indexOf(x.keyCode) !== -1)  tagBtn(); };
  document.getElementById("hobbySend").onclick = hobbyBtn;
  // tag 标签点击事件
  var tagLine = document.getElementById("tagLine");
  tagLine.addEventListener("click", del);
  // hobby 标签点击事件
  var hobbyLine = document.getElementById("hobbyLine");
  hobbyLine.addEventListener("click", del);
}

// tag按钮事件
function tagBtn() {
  var input = document.getElementById("tagInput").value.replace(/,|，/,"").trim();
  if (input.length === 0 ) {
    alert("请输入任意有效字符。");
    document.getElementById("tagInput").value = "";
    return;
  }
  input = noRepeat([input],tag);
  input.forEach( function(x) { tag.push(x);} );
  // 限制最大数量
  tag = tag.slice(-10);
  document.getElementById("tagInput").value = "";
  show(tag,"tagLine");
}

// hobby 按钮事件
function hobbyBtn() {
  var input = document.getElementById("hobbyInput").value.trim();
  if (input.length === 0 ) {
    alert("请输入任意有效字符。");
    return;
  }
  input = dealStr(input);
  input = noRepeat(input, hobby);
  input.forEach( function(x) { hobby.push(x);} );
  // 限制最大数量
  hobby = hobby.slice(-10);
  document.getElementById("hobbyInput").value = "";
  show(hobby,"hobbyLine");
}

// 标签点击事件
function del(x) {
  var tar = x.target;
  if (tar.className === "square") {
    var index = [].indexOf.call(tar.parentNode.childNodes,tar);
    var whichLine = {tagLine:tag, hobbyLine:hobby};
    var parId = tar.parentNode.id;
    var par = whichLine[parId];
    par.splice(index,1);
    show(par,parId);
  }
}

// 转化 string 为 array
function dealStr(str) {
  var arr = str.split(/[^\u4e00-\u9fa5\w]+/g).filter(function(e) {
    return e.length !== 0; });
  return arr;
}

// 检查重复(arr, tarArr)
function noRepeat(arr,tarArr) {
  var mergeStr = tarArr.concat(arr);
  var newTag = [];
  var arrLength = mergeStr.length;
  for (var i = 0; i < arrLength; i++) {
    var temp = mergeStr.shift();
    if (mergeStr.indexOf(temp) === -1) {
      newTag.push(temp);
    }
  }
  return newTag;
}

// 渲染
function show(ifTag,tagStr) {
  var input = "";
  input = ifTag.map( function(e) {
    return "<div class='square'>" + e + "</div>";
  }).join("");
  document.getElementById(tagStr).innerHTML = input;
}


function init() {
  clickEvent();
}

window.onload = init;
