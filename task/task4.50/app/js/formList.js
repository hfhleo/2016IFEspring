var formListCtrl = angular.module('formListCtrl', ['ui.router', 'editPageCtrl']);
formListCtrl.controller('formListController',['$rootScope', '$scope', '$location', function($rootScope, $scope,  $location) {
  // 若无表单，则跳转至新建表单页面
  $scope.backToNew = function() {
    if ($rootScope.forms.length === 0) {
      $location.path('/newForm');
    }
  };
  angular.element(document).ready(function() {
    $scope.backToNew();
  });

  // 清除已选表单
  $rootScope.forms.forEach(function(e) {
    e.select = false;
  });

  // 删除单个 form, 传入子index
  $scope.deleteForm = function(index) {
    switch ($rootScope.forms[index].status) {
      case "published":
        alert('问卷 “' + $rootScope.forms[index].title +'” 正在发布中，不能删除！');
        break;
      case "overdue":
        alert('问卷 “' + $rootScope.forms[index].title +'” 已经结束，不能删除！');
        break;
      case "unpublish":
        $rootScope.forms.splice(index, 1);
        $scope.backToNew();
        break;
      default:
        break;
    }
  };

  // 删除多个 form
  $scope.deleteSomeForm = function() {
    var len = $rootScope.forms.length - 1;
    for (var i = len; i > -1; i--) {
      if ($rootScope.forms[i].select === true) {
        $scope.deleteForm(i);
      }
    }
    $scope.selectNone();
    $scope.backToNew();
  };

  // 全选
  $scope.selectAll = function() {
    var len = $rootScope.forms.length - 1;
    for (var i = len; i > -1; i--) {
      $rootScope.forms[i].select = true;
    }
    $scope.$$childTail.selectAllBtn = true;
  };

  // 全不选
  $scope.selectNone = function() {
    var len = $rootScope.forms.length - 1;
    for (var i = len; i > -1; i--) {
      $rootScope.forms[i].select = false;
    }
    $scope.$$childTail.selectAllBtn = false;
  };

  // 点击全选按钮
  $scope.selectAllFunc = function(selectAllBtn) {
    if (selectAllBtn) {
      $scope.selectNone();
    } else {
      $scope.selectAll();
    }
  };

  // 点击编辑按钮
  $scope.editForm = function(index) {
    switch ($rootScope.forms[index].status) {
      case "published":
        alert('问卷 “' + $rootScope.forms[index].title +'” 正在发布中，不能编辑！');
        break;
      case "overdue":
        alert('问卷 “' + $rootScope.forms[index].title +'” 已经结束，不能编辑！');
        break;
      default:
        $scope.selectNone();
        $rootScope.forms[index].select = true;
        $location.path('/editPage');
        break;
    }
  };

  //===============> 生成随机统计结果 <===============
  $scope.randomPublishData = function(index) {
    var randomData = function() {
      var data = Math.round(Math.random() * 90 + 10);
      return data;
    };
    $rootScope.forms[index].content.forEach(function(el) {
      var sum = 0;
      if (el.type === 'radio') {
        el.options.forEach(function(element) {
          element.number = randomData();
          sum += element.number;
        });
        el.sumNumber = Math.round(sum);
      } else if(el.type === 'checkbox') {
        el.options.forEach(function(element) {
          element.number = randomData();
          sum = Math.max(element.number, sum);
        });
        el.sumNumber = Math.round(sum * 1.1);
      } else {
        el.number = randomData();
        el.sumNumber = Math.round(el.number * (Math.random() + 1.05));
      }
    });
  };

  // 点击查看数据按钮
  $scope.displayForm = function(index) {
    $scope.selectNone();
    $rootScope.forms[index].select = true;
    $scope.randomPublishData(index);
    $location.path('/displayData');
  };

  // 点击查看问卷按钮 
  $scope.surveyForm = function(index) {
    $scope.selectNone();
    $rootScope.forms[index].select = true;
    $location.path('/surveyForm');
  };

  $scope.display = function(status) {
    switch (status) {
      case "published":
        return "发布中";
      case "unpublish":
        return "未发布";
      default:
        return "已结束";
    }
  };
}]);

//===============> 指令 <===============
// directive name need lowercase?
formListCtrl.directive('listtable', function() {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    template: "<table ng-transclude></table>"
  };
});

formListCtrl.directive('tableheader', function() {
  return {
    restrict: 'AE',
    replace: true,
    template: 
      "<tr>" +
        "<th></th>" +
        "<th>标题</th>" +
        "<th>截止时间</th>" +
        "<th>状态</th>" +
        "<th>操作" + 
          "<a ui-sref='newForm'><button>新建问卷</button></a>" +
        "</th>" +
      "</tr>"
  };
});
formListCtrl.directive('tablecontent', function() {
  return {
    restrict: 'AE',
    replace: true,
    template: 
      "<tr>" +
        "<td>" +
          "<input type='checkbox' id='list{{$index}}' ng-model='form.select'>" +
          "<label for='list{{$index}}'>&ensp;</label>" +
        "</td>" +
        "<td><div>{{form.title}}</div></td>" +
        "<td>{{form.date}}</td>" +
        "<td>" +
          "<span ng-class='form.status'>{{display(form.status)}}</span>" +
        "</td>" +
        "<td>" +
          "<button ng-click='editForm($index)'>编辑</button>" +
          "<button ng-click='deleteForm($index)'>删除</button>" +
          "<button ng-if='!isUnpublish' ng-click='displayForm($index)'>查看数据</button>" +
          "<button ng-if='isUnpublish' ng-click='surveyForm($index)'>查看问卷</button>" +
        "</td>" +
      "</tr>",
    link: function(scope, element, attrs) {
      scope.isUnpublish = (scope.form.status === 'unpublish') ? true : false;
    }
  };
});
formListCtrl.directive('tablefooter', function() {
  return {
    restrict: 'AE',
    replace: true,
    template: 
      "<tr>" +
        "<td colspan='5'>" +
          "<input type='checkbox' id='listAll' ng-model='selectAllBtn' ng-change='selectAllFunc({{selectAllBtn}})'><label for='listAll'>全选</label>" +
          "<button ng-click='deleteSomeForm()'>删除</button>" +
        "</td>" +
      "</tr>",
  };
});
