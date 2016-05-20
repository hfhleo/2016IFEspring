//===============> 数据接口 <===============
/*
HTML:
<input type='text' id='calendarTool'readonly>
<article id='calendarPanel' style='display:none'></article>

JavaScript:
var chooseScope = [new Date(), null];
calendarTool(chooseScope, callBack, period);
- 日期选择范围array，内部元素为 Date Object， 缺省值为 null
  var chooseScope = [开始日期, 结束日期];
- 回调函数,缺省值为 null
  var callBack = function() { };
- 日期跨度array, 内部元素为 integer, 缺省值为 null
  var period = [最少天数，最多天数];

功能简介：
1. 默认不启动，点击 input 后启动日历面板
2. 有单选日期模式和时段模式两种，通过 period 参数来选择
*/

//===============> 日历组件 <===============
(function () {
  "use strict";
  window.calendarTool=function(chooseScope, callBack, period) {
    // 选择器
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
      earliest: null,
      latest: null,
      pickDay: null,
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
        //设置当前日期
        var input = new Date($('#calendarTool').value);
        if (this.pickDay === null) {
          if (input > 0) {
            this.pickDay = input;
          } else {
            this.pickDay = new Date();
          }
        }
        //生成年月表头
        var insert = "<header><input type='button'>" +
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
          // 设置面板内非当月的日期
          if (nextDay.getMonth() !== this.pickDay.getMonth()) {
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
          } else if (this.dateToString(new Date()) === dateString){
            insert += "<div data-date='" + dateString + "' class='today'>" +
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
        //===============> 生成节点 <===============
        $('#calendarPanel').parentNode.style.position = 'relative';
        $('#calendarPanel').innerHTML = insert;
        $('#calendarPanel').style.left = $('#calendarTool').offsetLeft +
          ($('#calendarTool').offsetWidth - 280) / 2 +'px';
        
        // 更新日期输入框
        if (this.pickDay2 === null) {
          $('#calendarTool').value = this.dateToString(this.pickDay); 
        } else {
          $('#calendarTool').value = this.dateToString(pickDaysArr()[0]) + " ~ " +
            this.dateToString(pickDaysArr()[1]);
        }
        var event = document.createEvent('HTMLEvents');
        event.initEvent('change', true, false);
        $('#calendarTool').dispatchEvent(event);
        this.allEvent();
      },

      // 绑定事件
      allEvent: function() {
        var self = this;

        // 绑定年月选择按钮事件
        addEvent($('#calendarPanel > header input:first-child'), 'click', function(e) {
          self.pickDay.setMonth(self.pickDay.getMonth() - 1);
          self.showTheMonth();
        });
        addEvent($('#calendarPanel > header input:last-child'), 'click', function() {
          self.pickDay.setMonth(self.pickDay.getMonth() + 1);
          self.showTheMonth();
        });
        addEvent($('#calendarPanel section > header input:first-child'), 'click', function() {
          self.pickDay.setYear(self.pickDay.getFullYear() - 1);
          $('#calendarPanel section:last-of-type h3').innerHTML = self.pickDay.getFullYear();
        });
        addEvent($('#calendarPanel section > header input:last-child'), 'click', function() {
          self.pickDay.setYear(self.pickDay.getFullYear() + 1);
          $('#calendarPanel section:last-of-type h3').innerHTML = self.pickDay.getFullYear();
        });
        // 时段模式确认/取消按钮事件
        if (this.minPeriod !== null) {
          addEvent($('#calendarPanel footer button:first-child'), 'click', function() {
            var check = self.inPeriod(self.pickDay, self.pickDay2, self.minPeriod,
                self.maxPeriod);
            if (check === false) {
              alert("不能超出规定时长范围。");
              return;
            }
            var timer = setTimeout(function() {
              $('#calendarPanel').style.display = "none";
            }, 500);
            self.callBack();
          });
          addEvent($('#calendarPanel footer button:last-child'), 'click', function() {
            /*
            self.pickDay = null;
            */
            self.pickDay2 = null;
            self.showTheMonth();
          });
        }

        // 点击选择单个日期
        if (this.minPeriod !== null) {
          addEvent($('#calendarPanel section:first-of-type'),"click",function(x) {
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
          addEvent($('#calendarPanel section:first-of-type'),"click",function(x) {
            var tar = x.target;
            if (/data-date/.test(tar.attributes[0].name)) {
              // 调用日期上限判断函数
              if (!self.inScope(tar.dataset.date,self.earliest,self.latest)) {
                alert("超出日期选择范围了。");
                return;
              }
              self.pickDay = new Date(tar.dataset.date);
              $('#calendarTool').value = tar.dataset.date;
              self.showTheMonth();
              var timer = setTimeout(function() {
                $('#calendarPanel').style.display = "none";
              }, 500);
              self.callBack();
            }
          });
        }

        // 点击选择月份
        addEvent($('#calendarPanel section:last-of-type'),"click",function(x) {
          var tar = x.target;
          if (tar.attributes[0] && /data-month/.test(tar.attributes[0].name)) {
            self.pickDay.setMonth(tar.dataset.month);
            self.showTheMonth();
          }
        });

        // 切换月年选择模式和日期选择模式事件
        addEvent($('#calendarPanel > header h3'),'click',function() {
          if ($('#calendarPanel section:first-of-type').style.display === "flex") {
            $('#calendarPanel section:first-of-type').style.display = "none";
            $('#calendarPanel section:last-of-type').style.display = "flex";
          } else {
            $('#calendarPanel section:first-of-type').style.display = "flex";
            $('#calendarPanel section:last-of-type').style.display = "none";
          }
        });

        // 点击输入框显示/隐藏日历面板
        
        addEvent($('#calendarTool'), 'click', function() {
          var calendar = $('#calendarPanel');
          if ( calendar.style.display === "none") {
            calendar.style.display = "";
          }
        });
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
        } else if (!earliest && !latest) {
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
        if (chooseScope && chooseScope[0]) { this.earliest = chooseScope[0]; }
        if (chooseScope && chooseScope[1]) { this.latest = chooseScope[1]; }
        if (callBack) { this.callBack = callBack; }
        if (period && period[0] > 1) { this.minPeriod = period[0]; }
        if (period && period[1] > 1) { this.maxPeriod = period[1]; }
        this.showTheMonth();
        $('#calendarPanel').style.display = "";
      }
    };
    calendar.init();
  };
})();

