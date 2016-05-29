//===============> formListCtrl <===============
var formListCtrl = angular.module('formListCtrl', ['ui.router', 'editPageCtrl']);
formListCtrl.controller('formListController',['$rootScope', '$scope', '$location', 'locals', function($rootScope, $scope,  $location, locals) {
  // 若无表单，则跳转至新建表单页面
  $scope.backToNew = function() {
    if ($rootScope.forms.length === 0) {
      $location.path('/newForm');
    }
  };

  $scope.www = 'www';
  angular.element(document).ready(function() {
    $scope.backToNew();
  });

  // 清除已选表单
  if ($rootScope.forms) {
    $rootScope.forms.forEach(function(e) {
      e.select = false;
    });
  }

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
        locals.setObject('forms', $rootScope.forms);
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


//===============> editPageCtrl <===============
var editPageCtrl = angular.module('editPageCtrl', ['ui.router']);

editPageCtrl.controller('editPageController', ['$rootScope', '$scope', 'locals', 
function($rootScope, $scope, locals) {
  //===============> 数据载入 <===============
  for (var i = 0; i < $rootScope.forms.length ; i++) {
    if ($rootScope.forms[i].select === true ) {
      $scope.form = $rootScope.forms[i];
      $scope.index = i;
    }
  }

  //===============> 新建表格 <===============
  if ($scope.index === undefined) {
    $scope.form = {
      "title": "这里是问卷的标题",
      "date": "",
      "status": "unpublish",
      "content": []
    };
  }

  //===============> 问题整体编辑 <===============
  $scope.moveUp = function(index) {
    var tempObj = $scope.form.content[index];
    $scope.form.content.splice(index, 1);
    $scope.form.content.splice(index-1, 0, tempObj);
  };

  $scope.moveDown = function(index) {
    var tempObj = $scope.form.content[index];
    $scope.form.content.splice(index, 1);
    $scope.form.content.splice(index+1, 0, tempObj);
  };

  $scope.copyQuestion = function(index) {
    if ($scope.limitNumber() === true) {
      var tempObj = angular.copy($scope.form.content[index]);
      $scope.form.content.splice(index+1, 0, tempObj);
    }
  };

  $scope.deleteQuestion = function(index) {
    $scope.form.content.splice(index, 1);
  };


  $scope.limitNumber = function() {
    if ($scope.form.content.length > 9 ) {
      alert('当前问卷问题不能超过10个。');
      return false;
    }
    return true;
  };
  //===============> 问题内部编辑事件 <===============
  $scope.addOption = function(parentIndex) {
    $scope.form.content[parentIndex].options.push({'option':'新的选项'});
  };

  $scope.deleteOption = function(parentIndex,index) {
    $scope.form.content[parentIndex].options.splice(index, 1);
  };

  $scope.riseOption = function(parentIndex, index) {
    var temp = $scope.form.content[parentIndex].options[index];
    $scope.form.content[parentIndex].options.splice(index, 1);
    $scope.form.content[parentIndex].options.splice(index - 1, 0, temp);
  };

  $scope.fallOption = function(parentIndex, index) {
    var temp = $scope.form.content[parentIndex].options[index];
    $scope.form.content[parentIndex].options.splice(index, 1);
    $scope.form.content[parentIndex].options.splice(index + 1, 0, temp);
  };
  //===============> 增减问题事件 <===============
  $scope.drop = false;

  $scope.addRadio = function() {
    if ($scope.limitNumber() === true) {
      var newQuestion = {
        "type": "radio",
        "question": "一个单选题的题目",
        "options": [ 
          {"option": "radio 1"},
          {"option": "radio 2"},
          {"option": "radio 3"}]
      };
      $scope.form.content.push(newQuestion);
    }
  };

  $scope.addCheckbox = function() {
    if ($scope.limitNumber() === true) {
      var newQuestion = {
        "type": "checkbox",
        "question": "一个多选题的题目",
        "options": [
          {"option": "checkbox 1"},
          {"option": "checkbox 2"},
          {"option": "checkbox 3"}]
      };
      $scope.form.content.push(newQuestion);
    }
  };

  $scope.addTextarea = function() {
    if ($scope.limitNumber() === true) {
      var newQuestion = {
        "type": "textarea",
        "question": "一个问答题的题目",
        "require" : false
      };
      $scope.form.content.push(newQuestion);
    }
  };

  //===============> 日历 <===============
  $scope.calendar = function() {
    var chooseScope = [new Date(), null];
    calendarTool(chooseScope, null, null);
  };

  //===============> 保存与发布 <===============
  $scope.saveForm = function() {
    var riseObject = {
      title: "提示",
      body: "您确定要保存当前问卷吗？",
      yes: "确定",
      no: "取消",
      funYes: function() {
        if ($scope.index === undefined) {
          $rootScope.forms.push($scope.form);
        } else {
          $rootScope.forms[$scope.index] = $scope.form;
        }
        locals.setObject('forms', $rootScope.forms);
        $('body > header nav a').click();
      },
      funNo: null
    };
    riseTool(riseObject);
  };


  $scope.publishForm = function() {
    var riseObject = {
      title: "提示",
      body: "您确定要发布当前问卷吗？<br>(此问卷截至日期为" + $scope.form.date + ")",
      yes: "确定",
      no: "取消",
      funYes: function() {
        $scope.form.status = "published";
        if ($scope.index === undefined) {
          $rootScope.forms.push($scope.form);
        } else {
          $rootScope.forms[$scope.index] = $scope.form;
        }
        locals.setObject('forms', $rootScope.forms);
        $('body > header nav a').click();
      },
      funNo: null
    };
    riseTool(riseObject);
  };
}]);


//===============> displayDataCtrl <===============
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

displayDataCtrl.directive('drawPie', function() {
  return {
    link: function(scope, element, attrs) {
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



//===============> surveyCtrl <===============
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


//===============> thankyouCtl <===============
var thankyouCtl = angular.module('thankyouCtl', ['ui.router']);

thankyouCtl.controller('thankyouController', function() {
  document.querySelector('html').style.overflowY = 'hidden';
  document.querySelector('main').style.width = '100%';
  document.querySelector('main').style.height = '100%';
});

