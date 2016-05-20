var questionnaire = angular.module('questionnaire', ['ui.router', 'formListCtrl', 'editPageCtrl', 'displayDataCtrl', 'surveyFormCtrl', 'thankyouCtl']);

questionnaire.config(function($stateProvider) {
  $stateProvider
    .state('index', {
      url: "",
      views: {
        "topBar": { templateUrl: "page/header.html"},
        "content": { templateUrl: "page/formList.html" }
      }
    })
    .state('formList', {
      url: "/formList",
      views: {
        "topBar": { templateUrl: "page/header.html"},
        "content": { templateUrl: "page/formList.html" }
      }
    })
    .state('editPage', {
      url: "/editPage",
      views: {
        "topBar": { templateUrl: "page/header.html"},
        "content": { templateUrl: "page/editPage.html" }
      }
    })
    .state('newForm', {
      url: "/newForm",
      views: {
        "topBar": { templateUrl: "page/header.html"},
        "content": { templateUrl: "page/newForm.html" }
      }
    })
    .state('surveyForm', {
      url: "/surveyForm",
      views: {
        "content": { templateUrl: "page/surveyForm.html" }
      }
    })
    .state('thankyou', {
      url: "/thankyou",
      views: {
        "content": { templateUrl: "page/thankyou.html" }
      }
    })
    .state('displayData', {
      url: "/displayData",
      views: {
        "topBar": { templateUrl: "page/header.html"},
        "content": { templateUrl: "page/displayData.html" }
      }
    });
});

questionnaire.controller('appCtrl', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
  // 请求数据，返回到$rootScope
  $http({
    method: 'GET',
    url: 'dummyData.json'
  }).then(function successCallback(response) {
    $rootScope.forms = response.data.forms;
  }, function errorCallback(response) {
  });
}]);
