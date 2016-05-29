/*
describe("A suite of controllers", function() {
  describe('appCtrl', function() {
    beforeEach(module('questionnaire'));
    beforeEach(module('formListCtrl'));
    var scope, $location, locals, ctrl;
    beforeEach(inject(function($rootScope, $controller, _$location_, _locals_) {
      rootScope = $rootScope;
      scope = $rootScope.$new();
      locals = _locals_;
      $location = _$location_;
      ctrl = $controller('formListController', { '$scope': scope });
    }));

    it('should create name www in appCtrl', inject(function() {
      rootScope.forms = [{
        content: {
          type:"radio"
        }
      }];
      scope.randomPublishData(0);
      var testSum = typeof(rootScope.forms[0].sum);
      expect(testSum).toBe(Number);
    }));
  });
});
*/
