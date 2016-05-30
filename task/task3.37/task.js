//===============> 浮出组件代码 <===============
(function() {
  "use strict";
  window.riseTool = function(obj) {
    // selector
    var $ = function(x){ return document.querySelector(x); };
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
    
    // 浮出层对象
    var rise = {
      node: null,
      title: "",
      body: "",
      yes: "",
      no: "",
      funYes: null,
      funNo: null,

      addDom: function() {
        var addHTML = 
          "<div class='riseTool'>" + 
            "<article>" +
              "<header>" +
                "<h3>" + this.title + "</h3>" +
              "</header>" +
              "<section>" +
                "<p>" + this.body + "</p>" +
                "<div>" +
                  "<button autofocus>" + this.yes + "</button>" +
                  "<button>" + this.no + "</button>" +
                "</div>" +
              "</section>" +
            "</article>" +
          "</div>";
        this.node.insertAdjacentHTML('afterend', addHTML);
      },

      setCenter: function(el) {
        var bodyX = document.documentElement.clientWidth;
        var bodyY = document.documentElement.clientHeight;
        var elX = el.offsetWidth;
        var elY = el.offsetHeight;
        el.style.left = (bodyX - elX) / 2 + 'px';
        el.style.top = (bodyY - elY) / 2 + 'px';
      },

      hideRise: function() {
        document.querySelector('.riseTool').style.display = "none";
        $("html").style.overflow = "";
        document.querySelector('.riseTool').innerHTML = "";
      },


      //===============> 拖拽相关 <===============
      dragMousedown: function(e) {
        // 记录鼠标开始位置
        var startX = e.screenX;
        var startY = e.screenY;
        // 记录窗体里窗口位置
        var offsetX = $('.riseTool article').offsetLeft;
        var offsetY = $('.riseTool article').offsetTop;
        // 记录窗口尺寸
        var bodyX = document.documentElement.clientWidth;
        var bodyY = document.documentElement.clientHeight;
        // 计算窗体尺寸
        var elX = $('.riseTool article').offsetWidth;
        var elY = $('.riseTool article').offsetHeight;
        // 计算最大移动尺寸
        var maxX = bodyX - elX;
        var maxY = bodyY - elY;
        document.onmousemove = function(e) {
          // 计算移动尺寸
          var setLeft = e.screenX - startX + offsetX;
          var setTop = e.screenY - startY + offsetY;
          setLeft = (setLeft < 0) ? 0 : setLeft;
          setLeft = (setLeft > maxX) ? maxX : setLeft;
          setTop = (setTop < 0) ? 0 : setTop;
          setTop = (setTop > maxY) ? maxY : setTop;
          $('.riseTool article').style.left = setLeft + 'px';
          $('.riseTool article').style.top = setTop + 'px';
        };
        document.onmouseup = function(e) {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      },
      
      //===============> 获取数据 <===============
      getParam: function() {
        this.node = (obj.node) ? document.querySelector(obj.node) : null;
        this.title = (obj.title) ? obj.title : "Title";
        this.body = (obj.body) ? obj.body : "";
        this.yes = (obj.yes) ? obj.yes : "Yes";
        this.no = (obj.no) ? obj.no : "No";
        this.funYes = (obj.funYes) ? obj.funYes : null;
        this.funNo = (obj.funNo) ? obj.funNo : null;
      },

      //===============> 绑定事件 <===============
      allEvent: function() {
        var self = this;
        $('.riseTool button:first-of-type').onclick = function() {
          self.hideRise();
          if (self.funYes !== null) self.funYes();
        };
        $('.riseTool button:last-of-type').onclick = function() {
          self.hideRise();
          if (self.funNo !== null) self.funNo();
        };
        // 拖拽事件
        addEvent($('.riseTool header'), 'mousedown', this.dragMousedown);
      },

      init: function() {
        this.getParam();
        this.addDom();
        this.allEvent();
        document.querySelector('.riseTool').style.display = "block";
        $("html").style.overflow = "hidden";
        this.setCenter($('.riseTool article'));
        $('.riseTool button:first-of-type').focus();
      }
    };
    rise.init();
  };
})();

