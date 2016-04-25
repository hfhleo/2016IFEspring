(function() {
  "use strict";
  //===============> table prototype <===============
  window.createTable = function(id, tableTitle, tableData,frozenTitle) {
    var table = {
      tableNode: document.querySelector(id),
      tableTitle: tableTitle,
      tableData: tableData,
      tableOrder: [],
      isFrozen: frozenTitle,
      //===============> 流程控制 <===============
      init: function() {
        this.sort(this.tableData,null,false,this.tableOrder);
        this.creat(this.tableNode,this.tableTitle,this.tableData,this.tableOrder);
        this.allEvent(this.tableNode);
      },
      //===============> 排列 <===============
      // 传入(表格数据 object，排序依据，是否为升序true),返回显示顺序 array
      sort: function(tableData, sortBy,up) {
        var self = this;
        if (sortBy === null) { sortBy = "sum"; }
        var arrDataName = Object.keys(tableData);
        var unsortArr = [];
        self.tableOrder = [];
        for (var i = 0; i < arrDataName.length ; i++) {
          unsortArr.push([arrDataName[i],tableData[arrDataName[i]][sortBy]]);
        }
        if (up) {
          unsortArr.sort(function(a, b) {return a[1] - b[1];});
        } else {
          unsortArr.sort(function(a, b) {return b[1] - a[1];});
        }
        unsortArr.forEach(function(x) { self.tableOrder.push(x[0]); });
      },
      //===============> 表格生成 <===============
      // 传入(表格生成 node，表头数据，表格数据,  表格生成顺序array）
      creat: function(tableNode, tableTitle, tableData, tableOrder) {
        // 生成表头
        var insert = "<table class='table'><thead><tr>";
        for (var i = 0; i < tableTitle.length; i++) {
          if (tableTitle[i].sort === true) {
            insert += "<th>" + tableTitle[i].label +
              "<input class='toLarge' type='button' name='" + tableTitle[i].name + "'>" +
              "<input class='toSmall' type='button' name='" + tableTitle[i].name + "'><\/th>";
          } else {
            insert += "<th>" + tableTitle[i].label + "<\/th>";
          }
        }
        insert += "<\/tr><\/thead>";

        // 生成个人数据
        var classOrder = [];
        for (i = 0; i < tableTitle.length ; i++) {
          classOrder.push(tableTitle[i].name);
        }
        for (i = 0; i < tableOrder.length ; i++) {
          insert += "<tr>";
          for (var j = 0; j < classOrder.length ; j++) {
            insert += "<td>" + tableData[tableOrder[i]][classOrder[j]] + "<\/td>";
          }
          insert += "<\/tr>";
        }
        tableNode.innerHTML = insert;
        this.frozenTitle(this.isFrozen);
      },
      //===============> 事件相关 <===============
      allEvent: function(tableNode) {
        var self = this;
        // 排序按钮事件
        tableNode.addEventListener("click",function(x) {
          var tar = x.target;
          if ( tar.nodeName !== "INPUT") return;
          if (tar.className === "toLarge") {
            self.sort(tableData,tar.name,true);
          } else {
            self.sort(tableData,tar.name,false);
          }
          self.creat(self.tableNode, self.tableTitle, self.tableData, self.tableOrder);
        });
      },
      //===============> 冻结表头 <===============
      frozenTitle: function(isFrozen) {
        if (!isFrozen) return;
        var self = this;
        var head = this.tableNode.querySelector('thead');
        var headClone = head.cloneNode(true);
        headClone.style.display = "none";
        headClone.style.top = 0;
        this.tableNode.firstChild.appendChild(headClone);
        window.onscroll = function() {
          var scrollTop = document.querySelector('body').scrollTop;
          var nodeH = self.tableNode.offsetTop + self.tableNode.clientHeight;
          if (scrollTop > self.tableNode.offsetTop && scrollTop < nodeH) {
            headClone.style.display = "";
            headClone.style.position = "fixed";
          } else {
            headClone.style.display = "none";
            headClone.style.position = "";
          }
        };
      }
    };
    table.init();
  };
})();

//===============> 接口数据 <===============
// 表格1
var tableTitle = [
  {label: "姓名", name: "name" , sort: false},
  {label: "语文", name: "chinese" , sort: true},
  {label: "数学", name: "math" , sort: true},
  {label: "英语", name: "english", sort: true},
  {label: "总分", name: "sum", sort: true}
];
var tableData = {};
var letter = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P",
  "Q","R","S","T","U","V","W","X","Y","Z"];
for (var i = 0; i < letter.length ; i++) {
  var a = Math.round(Math.random()*100);
  tableData[letter[i]] = {
    name: "小" + letter[i],
    chinese: a,
    math: a,
    english: a,
    sum: 3 * a,
  };
}
// 传入(根目录 id，表头 array，表格数据 object，是否冻结表头)
var t = createTable('#createTable', tableTitle, tableData, true);
