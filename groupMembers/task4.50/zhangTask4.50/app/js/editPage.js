var editPageCtrl = angular.module('editPageCtrl', ['ui.router']);

editPageCtrl.controller('editPageController', ['$rootScope', '$scope',
function($rootScope, $scope) {
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
          $('body > header nav a').click();
        } else {
          $rootScope.forms[$scope.index] = $scope.form;
          $('body > header nav a').click();
        }
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
          $('body > header nav a').click();
        } else {
          $rootScope.forms[$scope.index] = $scope.form;
          $('body > header nav a').click();
        }
      },
      funNo: null
    };
    riseTool(riseObject);
  };
}]);

//===============> 指令 <===============

editPageCtrl.directive('pageheader', function() {
  return {
    restrict: 'AE',
    replace: true,
    template: 
      "<header>" +
        "<input type='text' name='title' ng-model='form.title'>" +
      "</header>"
  };
});

editPageCtrl.directive('pagecontent', function() {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    template: "<article class='editPageContent'><ng-transclude></ng-transclude></article>"
  };
});

/*
editPageCtrl.directive('question', function() { return {
    restrict: 'AE',
    replace: true,
    template: 
      "<div>" +
        "<h3>Q{{$index + 1}}" +
          "<input type='text' ng-model='oneQuestion.question'>" +
          "<button type='button' ng-click='addOption($index)' ng-if='oneQuestion.options' class='blackBtn'>+</button>" +
        "</h3>" +
        "<label ng-repeat='option in oneQuestion.options' ng-if='oneQuestion.options'>" +
          "<input type='{{oneQuestion.type}}' name='{{oneQuestion.question}}'>" +
          "<input type='text' ng-model='option.option'>" +
          "<button type='button' ng-click='deleteOption($parent.$parent.$index,$index)' class='blackBtn'>x</button>" +
          "<button type='button' ng-click='fallOption($parent.$parent.$index,$index)' ng-disabled='$last' ng-class='{blackBtn:(!$last),whiteBtn:($last)}'>&darr;</button>" +
          "<button type='button' ng-click='riseOption($parent.$parent.$index,$index)' ng-disabled='$first' ng-class='{blackBtn:(!$first),whiteBtn:($first)}'>&uarr;</button>" +
        "</label>" +
        "<label class='requreAnswer' ng-if='oneQuestion.options == undefined'>" +
          "<input type='checkbox' name='Q3require' ng-checked='oneQuestion.require' ng-model='oneQuestion.require'>" +
        "此题是否必填</label>" +
        "<textarea ng-if='oneQuestion.options == undefined'></textarea>" +
        "<div>" +
          "<button ng-click='moveUp($index)' ng-hide='$first'>上移</button>" +
          "<button ng-click='moveDown($index)' ng-hide='$last'>下移</button>" +
          "<button ng-click='copyQuestion($index)'>复用</button>" +
          "<button ng-click='deleteQuestion($index)'>删除</button>" +
        "</div>" +
      "</div>",
  };
});
*/
editPageCtrl.directive('question', function() { return {
    restrict: 'AE',
    replace: true,
    template: 
      "<div>" +
        "<h3>Q{{$index + 1}}" +
          "<input type='text' ng-model='oneQuestion.question'>" +
          "<button type='button' ng-click='addOption($index)' ng-if='oneQuestion.options' class='blackBtn'>+</button>" +
        "</h3>" +
        "<label ng-repeat='option in oneQuestion.options' ng-if='oneQuestion.options'>" +
          "<input type='{{oneQuestion.type}}' name='{{oneQuestion.question}}'>" +
          "<input type='text' ng-model='option.option'>" +
          "<button type='button' ng-click='deleteOption($parent.$parent.$index,$index)' class='blackBtn'>x</button>" +
          "<button type='button' ng-click='fallOption($parent.$parent.$index,$index)' ng-disabled='$last' ng-class='{blackBtn:(!$last),whiteBtn:($last)}'>&darr;</button>" +
          "<button type='button' ng-click='riseOption($parent.$parent.$index,$index)' ng-disabled='$first' ng-class='{blackBtn:(!$first),whiteBtn:($first)}'>&uarr;</button>" +
        "</label>" +
        "<label class='requreAnswer' ng-if='oneQuestion.options == undefined'>" +
          "<input type='checkbox' name='Q3require' ng-checked='oneQuestion.require' ng-model='oneQuestion.require'>" +
        "此题是否必填</label>" +
        "<textarea ng-if='oneQuestion.options == undefined'></textarea>" +
        "<div>" +
          "<button ng-click='moveUp($index)' ng-hide='$first'>上移</button>" +
          "<button ng-click='moveDown($index)' ng-hide='$last'>下移</button>" +
          "<button ng-click='copyQuestion($index)'>复用</button>" +
          "<button ng-click='deleteQuestion($index)'>删除</button>" +
        "</div>" +
      "</div>",
  };
});

editPageCtrl.directive('pageedit', function() {
  return {
    restrict: 'AE',
    replace: true,
    template: 
      "<article class='editPageAdd'>" +
        "<div>" +
          "<div ng-class='{dropdown:drop}'>" +
            "<button ng-click='addRadio()'>单选</button>" +
            "<button ng-click='addCheckbox()'>多选</button>" +
            "<button ng-click='addTextarea()'>文本题</button>" +
          "</div>" +
          "<button ng-click='drop=!drop'>添加问题</button>" +
        "</div>" +
      "</article>"
  };
});

editPageCtrl.directive('pagefooter', function() {
  return {
    restrict: 'AE',
    replace: true,
    template: 
      "<footer>" +
        "<label>问卷截止日期<input type='text' id='calendarTool' ng-model='form.date' readonly ng-click='calendar()'></label>" +
        "<article id='calendarPanel' style='display:none'></article>" +
        "<button ng-click='saveForm()'>保存问卷</button>" +
        "<button ng-click='publishForm()'>发布问卷</button>" +
        "<div class='riseTool'></div>" +
      "</footer>",
  };

});

