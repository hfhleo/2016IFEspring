//===============> Data <===============
var Data = [
  ['A', 55],
  ['B', 83],
  ['C', 13],
  ['D', 30]
  ];
var chartData = [];
function slice(start,end,label,value) {
  this.startAngle = start;
  this.endAngle = end;
  this.label = label;
  this.value = value;
}
var sum = 0;
for (var i = 0; i < Data.length ; i++) {
  sum += Data[i][1];
}
var startAngle = 0;
var endAngle = 0;
for (i = 0; i < Data.length ; i++) {
  endAngle += Data[i][1] / sum * 2 * Math.PI;
  var label = Data[i][0];
  var value = Data[i][1];
  var s = new slice(startAngle, endAngle, label, value);
  chartData.push(s);
  startAngle = endAngle;
}

//===============> Circle Draw <===============
(function () {
  "use strict";
  window.circleTools = function(node, data) {
    var circle = {
      //===============> 公用变量 <===============
      canvas: "",
      canvasWidth: 0,
      canvasHeight: 0,
      centerX: 0,
      centerY: 0,
      chartRadius: 0,
      colorTab: ["#d99e3b", "e97642","#65a28b", "9db6dc", "#ebb49b", "#62b998", "#4e73aa", "#84ebdd"],
      drawSlice: function(x, y, r, startAng, endAng, color) {
        console.log('start' + this.canvas);
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // set fill
        var sliceGradient = ctx.createLinearGradient(0, 0, canvasWidth*.75, canvasHeight*.75);
        sliceGradient.addColorStop(0, '#ddd');
        sliceGradient.addColorStop(1, color);

        // Draw the slice
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.arc( startX, startY, chartRadius, startAngle, endAngle, false);
        ctx.lineTo(startX, startY);
        ctx.closePath();
        ctx.fillStyle = sliceGradient;
        ctx.shadowColor = '#ccc';
        ctx.fill();

        ctx.lineWidth = 2
        ctx.strokStyle = '#fff';

        ctx.stroke();
      },
      //===============> 流程管理 <===============
      init: function() {
        this.canvas = document.getElementById(node);
        console.log(document.querySelector('circle1'));
        // Exit if the brower isn't canvas-capable
        if (typeof this.canvas.getContext === 'undefined') return;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
        this.centerX = canvasWidth / 2;
        this.centerY = canvasHeight / 2;
        this.chartRadius = Math.min(canvasWidth, canvasHeight) /2 * .7;
        console.log(this.colorTab);
        this.drawSlice(this.centerX, this.centerY, 1.5, 3.5, this.colorTab[0]);
      },
    };
    circle.init();
    console.log(document.querySelector('circle1'));
  };
})();
