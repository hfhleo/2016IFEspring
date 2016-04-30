//===============> 日历组件 <===============
(function () {
  "use strict";
  window.calendarTool=function(node,earilest,latest,callBackFn,minPeriod,maxPeriod){
    // 选择器
    var gId = function(x) { return document.getElementById(x); };
    var $ = function(x){ return document.querySelector(x); };
    var $a = function(x){ return document.querySelectorAll(x); };
    //添加事件(兼容方式)
    function addEvent(dom,type,fn){
      //对于支持DOM2级事件处理程序addeventListener方法的浏览器
      if(dom.addEventListener){
        dom.addEventListener(type,fn,false);
      }else if(dom.attachEvent){
      //对于不支持addEventListener方法但支持attchEvent方法的浏览器	
        dom.attachEvent('on'+type,fn);
      }
      else{
      //对于不支持以上两种,但支持on+'事件名'的浏览器
        dom['on'+type]=fn;
      }
    }
    
    // 日历对象
    var calendar = {
      node: "",
      earliest: null,
      latest: null,
      pickDay: new Date(),
      pickDay2: null,
      minPeriod: null,
      maxPeriod: null,
      monthLable: ["一月","二月","三月","四月","五月","六月",
        "七月","八月","九月","十月","十一月","十二月"],
      dateToString: function(date) {
        return date.toJSON().slice(0,10);
      },

      // 生成日历,传入高亮日期 getDate();
      showTheMonth: function() {
        var self = this;
        //生成输入框
        var date = this.dateToString(this.pickDay);
        var insert = "<input type='text' value='" + date + "'>";
        //生成年月表头
         insert += "<article><header><input type='button'>" +
           "<h3>" + this.monthLable[this.pickDay.getMonth()] + 
           "<span>" + this.pickDay.getFullYear() + "</span></h3>" + 
           "<input type='button'></header>";
        //生成星期表头
        insert += "<header><p>Mon</p><p>Tue</p><p>Wed</p><p>Thu</p>" +
          "<p>Fri</p><p>Sat</p><p>Sun</p></header>";
        //生成每天表格
        insert += "<section style='display:flex;flex-wrap:wrap;'>";
        var nextDay = new Date(this.pickDay);
        nextDay.setDate(1);
        var nextDayWeek = nextDay.getDay(); //当月1号的星期
        var fixWeek = [6,0,1,2,3,4,5,6];
        nextDay.setDate(1 - fixWeek[nextDayWeek]); //算出当张表格的第一个日期
        var pickDaysArr = function() {
          if (typeof(self.pickDay2) !== "object" ) return;
          if (self.pickDay2 > self.pickDay) {
            return [self.pickDay, self.pickDay2];
          } else {
            return [self.pickDay2, self.pickDay];
          }
        };
        for (var i = 0; i < 42 ; i++) {
          var dateString = this.dateToString(nextDay);
          //调用日期上限判断函数，设置 illegalDay 的 class
          if (!this.inScope(nextDay, this.earliest, this.latest)) {
            insert += "<div data-date='" + dateString + "' class='illegalDay'>" +
              nextDay.getDate() + "</div>";
          // 设置面板内非当月的日期
          } else if (nextDay.getMonth() !== this.pickDay.getMonth()) {
            insert += "<div data-date='" + dateString + "' class='otherMonth'>" +
              nextDay.getDate() + "</div>";
          // 高亮选中的日期
          } else if(this.dateToString(this.pickDay) === dateString) {
            insert += "<div data-date='" + dateString + "' class='pickDay'>" +
              nextDay.getDate() + "</div>";
          // 高亮第二选择的日期
          } else if(this.pickDay2 !== null &&
              this.dateToString(this.pickDay2) === dateString) {
            insert += "<div data-date='" + dateString + "' class='pickDay'>" +
              nextDay.getDate() + "</div>";
          // 高亮两选择之间的日期
          } else if(this.pickDay2 !== null && pickDaysArr()[0] < nextDay &&
              nextDay < pickDaysArr()[1]) {
            insert += "<div data-date='" + dateString + "' class='amongPick'>" +
              nextDay.getDate() + "</div>";
          } else {
            insert += "<div data-date='" + dateString + "'>" +
              nextDay.getDate() + "</div>";
          }
          nextDay.setDate(nextDay.getDate() + 1);
        }
        insert += "</section>";
        // 生成年份选择框
        insert += "<section style='display:none;flex-wrap:wrap;'>" +
          "<header><input type='button'>" +
          "<h3>" + this.pickDay.getFullYear() + "</h3>" + 
          "<input type='button'></header>";
          // 生成月份选择框
        for (i = 0; i < this.monthLable.length ; i++) {
          var month = this.monthLable[i];
          insert += "<div data-month='" + i + "'>" + month + "</div>";
        }
        insert += "</section>";
        // 生成时段选择模式下的确认/取消按钮
        if (this.minPeriod !== null) {
          insert += "<footer><button>确认</button>" +
            "<button>取消</button></footer>";
        }
        // 日期选择范围提示
        insert += "</article><p>选择范围：" + this.dateToString(this.earliest) +
            " ~ " + this.dateToString(this.latest) + "</p>";
        if (this.minPeriod !== null) {
          insert += "<p>选择时长为：" + this.minPeriod + " ~ " +
            this.maxPeriod + "天</p>";
        }
        $(node).innerHTML = insert;
        
        // 更新日期输入框
        if (this.pickDay2 === null) {
          $(node+' > input').value = this.dateToString(this.pickDay); 
        } else {
          $(node+' > input').value = this.dateToString(pickDaysArr()[0]) + " ~ " +
            this.dateToString(pickDaysArr()[1]);
        }
        this.allEvent();
      },

      // 绑定事件
      allEvent: function() {
        var self = this;

        // 绑定年月选择按钮事件
        addEvent($(node+' article > header input:first-child'), 'click', function() {
          self.pickDay.setMonth(self.pickDay.getMonth() - 1);
          self.showTheMonth();
        });
        addEvent($(node+' article > header input:last-child'), 'click', function() {
          self.pickDay.setMonth(self.pickDay.getMonth() + 1);
          self.showTheMonth();
        });
        addEvent($(node+' section > header input:first-child'), 'click', function() {
          self.pickDay.setYear(self.pickDay.getFullYear() - 1);
          $(node+' section:last-of-type h3').innerHTML = self.pickDay.getFullYear();
        });
        addEvent($(node+' section > header input:last-child'), 'click', function() {
          self.pickDay.setYear(self.pickDay.getFullYear() + 1);
          $(node+' section:last-of-type h3').innerHTML = self.pickDay.getFullYear();
        });
        // 时段模式确认/取消按钮事件
        if (this.minPeriod !== null) {
          addEvent($(node+' footer button:first-child'), 'click', function() {
            var check = self.inPeriod(self.pickDay, self.pickDay2, self.minPeriod,
                self.maxPeriod);
            if (check === false) {
              alert("不能超出规定时长范围。");
              return;
            }
            var timer = setTimeout(function() {
              $(node+' > article').style.display = "none";
            }, 500);
            self.callBack();
          });
          addEvent($(node+' footer button:last-child'), 'click', function() {
            /*
            self.pickDay = null;
            */
            self.pickDay2 = null;
            self.showTheMonth();
          });
        }

        // 点击选择单个日期
        if (this.minPeriod !== null) {
          addEvent($(node+" article section:first-of-type"),"click",function(x) {
            var tar = event.target;
            if (/data-date/.test(tar.attributes[0].name)) {
              // 调用日期上限判断函数
              if (!self.inScope(tar.dataset.date,self.earliest,self.latest)) {
                alert("超出日期选择范围了。");
                return;
              }
              self.pickDay2 = new Date(self.pickDay.toString());
              self.pickDay = new Date(tar.dataset.date);
              self.showTheMonth();
            }
          });
        } else {
          addEvent($(node+" article section:first-of-type"),"click",function(x) {
            var tar = x.target;
            if (/data-date/.test(tar.attributes[0].name)) {
              // 调用日期上限判断函数
              if (!self.inScope(tar.dataset.date,self.earliest,self.latest)) {
                alert("超出日期选择范围了。");
                return;
              }
              self.pickDay = new Date(tar.dataset.date);
              self.showTheMonth();
              var timer = setTimeout(function() {
                $(node+' > article').style.display = "none";
              }, 500);
              self.callBack();
            }
          });
        }

        // 点击选择月份
        addEvent($(node+" article section:last-of-type"),"click",function(x) {
          var tar = x.target;
          if (tar.attributes[0] && /data-month/.test(tar.attributes[0].name)) {
            self.pickDay.setMonth(tar.dataset.month);
            self.showTheMonth();
          }
        });

        // 切换月年选择模式和日期选择模式事件
        addEvent($(node+' article > header h3'),'click',function() {
          if ($(node+' article section:first-of-type').style.display === "flex") {
            $(node+' article section:first-of-type').style.display = "none";
            $(node+' article section:last-of-type').style.display = "flex";
          } else {
            $(node+' article section:first-of-type').style.display = "flex";
            $(node+' article section:last-of-type').style.display = "none";
          }
        });

        // 输入框输入日期事件
        addEvent($(node+' > input'),"keyup",function(x) {
          if (x.keyCode === 13) {
            var input = $(node+' > input');
            // 调用日期输入格式检查函数
            if (!self.inputCheck(input.value)) {
              alert("请按‘2016-04-01’格式输入日期");
              return;
            }
            // 调用检查日期是否在范围内，并提示
            if (!self.inScope(input.value, self.earliest, self.latest)) {
              alert("超出日期选择范围了。");
              return;
            }
            self.pickDay = new Date(input.value);
            self.showTheMonth();
            var timer = setTimeout(function() {
              $(node+' > article').style.display = "none";
            }, 500);
            self.callBack();
          }
        });

        // 点击输入框显示/隐藏日历面板
        addEvent($(node+' > input'), 'click', function() {
          var calendar = $(node+' article');
          var input = $(node+" > input");
          if ( calendar.style.display === "") {
            if (minPeriod === null) {
              if (!self.inScope(input.value, self.earliest, self.latest)) {
                alert("超出日期选择范围了。");
                return;
              }
            } else {
              alert("请选择合适的时间段并点击确认按钮。");
              return;
            }
            calendar.style.display = "none";
          } else {
            calendar.style.display = "";
          }
        });
      },

      // 检查日期输入格式是否为‘2016-04-01’
      inputCheck: function(input) {
        return /^\d\d\d\d-\d\d-\d\d$/.test(input);
      },

      // 检查日期是否在范围内函数，传入 string 和 Date 均可
      inScope: function(checkDate,earliest,latest) {
        if (typeof checkDate === "string") {
          checkDate= new Date(checkDate);
        }
        if (earliest && latest && checkDate >= earliest && checkDate <= latest) {
          return true;
        } else if (earliest && !latest && checkDate >= earliest) {
          return true;
        } else if (!earliest && latest && checkDate <= latest) {
          return true;
        } else {
          return false;
        }
      },

      // 检查时段选择是否符合时长要求
      inPeriod: function(start, end, minPeriod, maxPeriod) {
        var len = Math.abs(Date.parse(start) - Date.parse(end))/1000/60/60/24 + 1;
        return this.minPeriod < len && len < this.maxPeriod;
      },

      // callback 函数
      callBack: function() { },
      
      // 流程管理
      init: function() {
        this.node = node;
        if (earliest) { this.earliest = earliest; }
        if (latest) { this.latest = latest; }
        if (callBack) { this.callBack = callBack; }
        if (minPeriod > 1) { this.minPeriod = minPeriod; }
        if (maxPeriod > 1) { this.maxPeriod = maxPeriod; }
        this.showTheMonth();
        $(node+' article').style.display = "none";
      }
    };
    calendar.init();
  };
})();
