var surveyCtrl = angular.module('surveyFormCtrl', ['ui.router']);

surveyCtrl.controller('surveyController', ['$rootScope', '$scope', 
'$location', '$state', function($rootScope, $scope, $location, $state) {
  //===============> 数据载入 <===============
  for (var i = 0; i < $rootScope.forms.length ; i++) {
    if ($rootScope.forms[i].select === true ) {
      $scope.form = $rootScope.forms[i];
      $scope.index = i;
    }
  }

  document.querySelector('html').style.overflowX = 'hidden';
  $scope.sendForm = function() {
    if (window.confirm("确认提交问卷吗？")) {
      switch ($scope.form.status) {
        case 'unpublish':
          alert('该问卷还未发布，无法提交。');
          break;
        case 'overdue':
          alert('');
          break;
        default:
          $location.path('/thankyou');
          break;
      }
    }
  };

  $scope.backList = function() {
    if (window.confirm("要返回问卷列表吗？")) {
      $location.path('/formList');
    }
  };

}]);

//===============> 指令 <===============

surveyCtrl.directive('surveyheader', function() {
  return {
    restrict: 'AE',
    replace: true,
    template: 
      "<header>" +
        "<h3 ng-bind='form.title'></h3>" +
      "</header>"
  };
});

surveyCtrl.directive('surveycontent', function() {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    template: "<article class='surveyContent'><ng-transclude></ng-transclude></article>"
  };
});

surveyCtrl.directive('surveyquestion', function() {
  return {
    restrict: 'AE',
    replace: true,
    template: 
      "<div>" +
        "<h3>Q{{$index + 1}}" +
          "<span ng-bind='oneQuestion.question'></span>" +
          "<span ng-if='oneQuestion.require'>(必填)</span>" +
        "</h3>" +
        "<label ng-repeat='option in oneQuestion.options' ng-if='oneQuestion.options'>" +
          "<input type='{{oneQuestion.type}}' name='{{oneQuestion.question}}'>" +
          "<p ng-bind='option.option'></p>" +
        "</label>" +
        "<textarea ng-if='!oneQuestion.options'></textarea>" +
      "</div>"
  };
});

surveyCtrl.directive('surveyfooter', function() {
  return {
    restrict: 'AE',
    replace: true,
    template: 
      "<footer>" +
        "<button ng-click='sendForm()'>提交问卷</button>" +
        "<button ng-click='backList()'>返回</button>" +
      "</footer>",
  };

});

