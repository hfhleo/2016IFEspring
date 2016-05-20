//===============> 数据接口 <===============
/*
function(agr1, agr2);
- agrument explain
  var agr1 = '';
- agrument explain
  var agr2 = '';
*/



//===============> 日历组件 <===============
(function () {
  "use strict";
  //===============> 组件核心 <===============
  window.pieChartTool=function(nodeId, dataArray, chartWidth, chartHeight) {
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
    
    // 饼图对象
    var pieChart = {
      node: null,
      dataArray: [],
      colorTab: ["#eba736", "#e97642","#65a28b", "#9db6dc", "#ebb49b", "#62b998", "#4e73aa", "#84ebdd"],

      
      //===============> 饼图数据处理 <===============
      dealData: function() {
        var self = this;
        this.node = $(nodeId);
        this.dataArray = dataArray;
        this.chartWidth = chartWidth;
        this.chartHeight = chartHeight;

        this.centerX = chartWidth / 2 -30;
        this.centerY = chartHeight / 2;
        this.chartRadius = Math.min(chartWidth, chartHeight) / 2 * 0.5;

        var sum = 0;
        var startAngle = 0;
        var endAngle = 0;

        this.dataArray.forEach(function(el){
          sum += el.number;
        });

        this.dataArray.forEach(function(el,i){
          endAngle += el.number / sum * 2 * Math.PI;
          el.startAng = startAngle;
          el.endAng = endAngle;
          startAngle = endAngle;
          el.centerX = self.centerX;
          el.centerY = self.centerY;
          el.chartRadius = self.chartRadius;
          var colorIndex = i % self.colorTab.length;
          el.color = self.colorTab[colorIndex];
        });
      },

      drawSlice: function(ctx, sliceObj, animationTime) {
        // set fill
        var sliceGradient = ctx.createLinearGradient(0, 0, chartWidth*0.5, chartHeight*0.5);
        sliceGradient.addColorStop(0, sliceObj.color);
        sliceGradient.addColorStop(1, sliceObj.color);

        // Draw the slice
        ctx.beginPath();
        ctx.moveTo(sliceObj.centerX, sliceObj.centerY);
        ctx.arc(sliceObj.centerX, sliceObj.centerY, sliceObj.chartRadius, sliceObj.startAng*0.05*animationTime, sliceObj.endAng*0.05*animationTime, false);
        ctx.lineTo(sliceObj.centerX, sliceObj.centerY);
        ctx.closePath();
        ctx.fillStyle = sliceGradient;
        ctx.shadowColor = '#ccc';
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        ctx.stroke();
      },

      drawTag: function(ctx, sliceObj, animationTime) {
        var arcCenterAng = (sliceObj.startAng + sliceObj.endAng) / 2;
        var arcCenterX = sliceObj.centerX + Math.cos(arcCenterAng) * (sliceObj.chartRadius - 2);
        var arcCenterY = sliceObj.centerY + Math.sin(arcCenterAng) * (sliceObj.chartRadius - 2);
        var arcOutX = sliceObj.centerX + Math.cos(arcCenterAng) * (sliceObj.chartRadius + 12);
        var arcOutY = sliceObj.centerY + Math.sin(arcCenterAng) * (sliceObj.chartRadius + 12);

        ctx.beginPath();
        ctx.globalAlpha= 0.05 * animationTime;
        ctx.strokeStyle = sliceObj.color;
        ctx.font = "12px sans-serif";
        ctx.moveTo(arcCenterX, arcCenterY);
        ctx.lineTo(arcOutX, arcOutY);
        if (Math.cos(arcCenterAng) > 0) {
          ctx.lineTo(arcOutX + 8, arcOutY);
          ctx.textAlign = 'left';
          ctx.fillText(sliceObj.option, arcOutX + 12, arcOutY - 7);
          ctx.fillText('数量:' + sliceObj.number, arcOutX + 12, arcOutY + 7);
        } else {
          ctx.lineTo(arcOutX - 8, arcOutY);
          ctx.textAlign = 'right';
          ctx.fillText(sliceObj.option, arcOutX - 12, arcOutY - 7);
          ctx.fillText('数量:' + sliceObj.number, arcOutX - 12, arcOutY + 7);
        }
        ctx.stroke();
      },

      // 画饼
      drawPie: function() {
        var self = this;
        this.node.style.width = chartWidth + 'px';
        this.node.style.height = chartHeight + 'px';
        var ctx = this.node.getContext('2d');
        // animation
        var animationTime = 1;
        var animation = setInterval( function() {
          if (animationTime > 21) {
            clearInterval(animation);
          }
          ctx.clearRect(0, 0, chartWidth, chartHeight);
          self.dataArray.forEach(function(el) {
            self.drawSlice(ctx, el, animationTime);
            self.drawTag(ctx, el, animationTime);
          });
          animationTime++;
        }, 35);
      },
      
      // 流程管理
      init: function() {
        this.dealData();
        this.drawPie();
      }
    };
    pieChart.init();
  };
})();
	

