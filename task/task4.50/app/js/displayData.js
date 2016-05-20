var displayDataCtrl = angular.module('displayDataCtrl', ['ui.router']);

displayDataCtrl.controller('displayDataController', ['$rootScope',
'$scope', function($rootScope, $scope) {
  //===============> 数据载入 <===============
  for (var i = 0; i < $rootScope.forms.length ; i++) {
    if ($rootScope.forms[i].select === true ) {
      $scope.form = $rootScope.forms[i];
      $scope.index = i;
    }
  }
}]);

displayDataCtrl.directive('dataheader', function() {
  return {
    restrict: 'AE',
    replace: true,
    template: 
      "<header>" +
        "<h3 ng-bind='form.title'></h3>" +
        "<h4>此统计分析只包含完整回收的数据</h4>" +
        "<button ui-sref='formList'>返回</button>" +
      "</header>"
  };
});

displayDataCtrl.directive('datacontent', function() {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    template: "<article><ng-transclude></ng-transclude></article>"
  };
});

displayDataCtrl.directive('dataquestion', function() {
  return {
    restrict: 'AE',
    replace: true,
    template: 
      "<div>" +
        "<div class='question'>" +
          "<h3>Q{{$index + 1}}<span ng-bind='oneQuestion.question'></span></h3>" +
          //===============> text:radio || checkbox <===============
          "<ul ng-if('isCheckbox || isRadio')>" +
            "<li ng-repeat='oneOption in oneQuestion.options'>" +
              "<div>{{oneOption.option}}</div>" +
            "</li>" +
          "</ul>" +
        "</div>" +

        //===============> chart:radio <===============
        "<div class='ratio' ng-if='isCheckbox'>" +
          "<h3>数据占比</h3>" +
          "<div class='bar' ng-repeat='oneOption in oneQuestion.options'>" +
            "<div class='bar-unfill'>" +
              "<div class='bar-fill' style='width:{{(oneOption.number / oneQuestion.sumNumber) | percent}}'>" +
                "<div class='bar-ani'></div>" +
              "</div>" +
            "</div>" +
            "<div class='bar-data'>{{(oneOption.number / oneQuestion.sumNumber) | percent}}</div>" + 
          "</div>" +
        "</div>" +
        //===============> chart:checkbox <===============
        "<div class='ratio' ng-if='isRadio'>" +
          "<h3>数据占比</h3>" +
          "<canvas id='canvas{{$index}}'>" +
            "您的浏览器版本过低，请使用更高的版本打开此页面。" +
          "</canvas>" +
        "</div>" +
        //===============> chart:textarea <===============
        "<div class='ratio' ng-if='isTextarea'>" +
          "<h3>有效回答占比</h3>" +
          "<div class='bar'>" +
            "<div class='bar-unfill'>" +
              "<div class='bar-fill' style='width:{{(oneQuestion.number / oneQuestion.sumNumber) | percent}}'><div class='bar-ani'></div></div>" +
            "</div>" +
            "<div class='bar-data'>{{(oneQuestion.number / oneQuestion.sumNumber) | percent}}</div>" +
          "</div>" +
      "</div>",
    link: function(scope, element, attrs) {
      scope.isRadio = (scope.oneQuestion.type === 'radio') ? true : false;
      scope.isCheckbox = (scope.oneQuestion.type === 'checkbox') ? true : false;
      scope.isTextarea = (scope.oneQuestion.type === 'textarea') ? true : false;
      if (scope.oneQuestion.type === 'radio') {
        var pieData = [];
        angular.copy(scope.oneQuestion.options, pieData);
        var nodeId = "#canvas" + scope.$index;
        angular.element(document).ready(function() {
          pieChartTool(nodeId, pieData, 340, 170);
        });
      }
    }
  };
});

displayDataCtrl.directive('datafooter', function() {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    template: 
      "<footer>" +
        "<button ui-sref='formList'>返回</button>" +
      "</footer>"
  };
});

displayDataCtrl.filter('percent', function() {
  return function(x) {
    var num = x * 100;
    if (num < 10) {
      num = "0" + num.toFixed(0) + "%";
    } else {
      num = num.toFixed(0) + "%";
    }
    return num;
  };
});
