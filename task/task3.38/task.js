(function() {
  "use strict";
  //===============> table prototype <===============
  window.createTable = function(id, tableTitle, tableData) {
    var table = {
      tableNode: document.querySelector(id),
      tableTitle: tableTitle,
      tableData: tableData,
      tableOrder: [],
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
        var insert = "<table class='table'><tr>";
        for (var i = 0; i < tableTitle.length; i++) {
          if (tableTitle[i].sort === true) {
            insert += "<th>" + tableTitle[i].label +
              "<input class='toLarge' type='button' name='" + tableTitle[i].name + "'>" +
              "<input class='toSmall' type='button' name='" + tableTitle[i].name + "'><\/th>";
          } else {
            insert += "<th>" + tableTitle[i].label + "<\/th>";
          }
        }
        insert += "<\/tr>";

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
      },
      //===============> 事件相关 <===============
      allEvent: function(tableNode) {
        var self = this;
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
    };
    table.init();
  };
})();

