// 队列 array
var line = [];
var inAnimation = false;

// 输入验证
function checkInput(input) {
  if (!/^[1-9][0-9]*$/.test(input) || input < 10 || input > 100) {
    alert("请输入10~100的整数");
    return false;
  }

  if (line.length >= 60) {
    alert("队列元素最多不能超过60个。");
    return false;
  }
  return true;
}

// 绑定点击事件
function clickEvent() {
  document.getElementById("leftIn").onclick = btnLeftIn;
  document.getElementById("rightIn").onclick = btnRightIn;
  document.getElementById("leftOut").onclick = btnLeftOut;
  document.getElementById("rightOut").onclick = btnRightOut;
  document.getElementById("random").onclick = randomLine;
  document.getElementById("sort").onclick = sortLine;
  var everyLine = document.getElementById("line");
  everyLine.addEventListener("click", btnLine);
}

// 左侧入点击效果
function btnLeftIn() {
  if (inAnimation === true) return;
  var input = document.getElementById("text").value;
  if (checkInput(input)) {
    line.splice(0,0,input);
  }
  document.getElementById("text").value = "";
  show();
}

// 右侧入点击效果
function btnRightIn() {
  if (inAnimation === true) return;
  var input = document.getElementById("text").value;
  if (checkInput(input)) {
    line.push(input);
  }
  document.getElementById("text").value = "";
  show();
}

// 左侧出点击效果 
function btnLeftOut() {
  if (inAnimation === true) return;
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
  if (inAnimation === true) return;
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
  if (inAnimation === true) return;

  if (tar.className === "square") {
    line.splice(num,1);
  }
  show();
}

// 生成随机数列
function randomLine() {
  if (inAnimation === true) return;
  line = [];
  for (var i = 0; i < 60; i++) {
    line.push(Math.round(Math.random() * 90 + 10));
  }
  show();
}

// 排序
function sortLine() {
  if (inAnimation === true) return;
  inAnimation = true;

  // 冒泡排序演算
  function bubbleSort() {
    var lineCut = [];
    var colorTag = [];
    for (var i = 0; i < line.length; i++) {
      for (var j = 0; j < line.length; j++) {
        if (line[j] > line[j+1]) {
          var temp = line[j];
          line[j] = line[j+1];
          line[j+1] = temp;
          // 排序状态快照数列
          lineCut.push(line.slice(0)); 
          // 颜色标记数列
          colorTag.push([(j+1), (60-i)].slice(0));
        }
      }
    }
    // 排序完成后全部标记橙色
    colorTag[colorTag.length - 1] = [0, 0];
    return [lineCut,colorTag];
  }

  // 包闭 showSort，方便等下周期性呼叫
  var showSort = (function() {
    var n = 0;
    return function() {
      n ++;
      if (n >= lineCut.length) {
        clearInterval(paint);
        inAnimation = false;
      } else {
        var input = "";
        for (var j = 0; j < lineCut[n].length; j++) {
          if (j === colorTag[n][0] || j >= colorTag[n][1]) {
            input += "<div class='square' style='height:" + lineCut[n][j]*2 + "px;background-color:#ffa500;border-color:#ffa500' title='" + lineCut[n][j] + "'></div>";
          } else {
            input += "<div class='square' style='height:" + lineCut[n][j]*2 + "px' title='" + lineCut[n][j] + "'></div>";
          }
        };
        document.getElementById("line").innerHTML = input;
      }
    }
  })();

  var bubble = bubbleSort();
  var lineCut = bubble[0];
  var colorTag = bubble[1];
  // 周期性显示冒泡排序
  var paint = setInterval(showSort, 20);
}

// 渲染队列
function show() {
  var input = "";
  input = line.map( function(e) {
    return "<div class='square' style='height:" + e*2 + "px' title='" + e + "'></div>";
  }).join("");
  document.getElementById("line").innerHTML = input;
}


function init() {
  clickEvent();
//  randomLine();
//  show();
}

window.onload = init;
