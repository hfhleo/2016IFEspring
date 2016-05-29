describe("A suite of services", function() {
  var locals, $window;
  beforeEach(module('questionnaire', function($provide) {
  }));

  beforeEach(inject(function(_locals_, _$window_) {
    locals = _locals_;
    $window = _$window_;
  }));

  it("should get 'testString' to 'testString'", inject(function() {
    locals.set('myNum', 1);
    result = locals.get('myNum');
    expect(result).toBe('1');
  }));

  it("should get value myObj.testName to 'testTest'", inject(function() {
    var objValue = {"testName":"testTest", "testValue":"ttt"};
    locals.setObject('myObj', objValue);
    result = locals.getObject('myObj').testName;
    expect(result).toBe('testTest');
  }));

  it("should remove myObj and get value to 'undefined'", inject(function() {
    var objValue = {"testName":"testTest", "testValue":"ttt"};
    locals.setObject('myObj', objValue);
    locals.rm('myObj');
    result = locals.getObject('myObj').testName;
    expect(result).toBe(undefined);
  }));

  it("should remove myNum and get value to 'undefined'", inject(function() {
    locals.set('myNum', 2);
    locals.rm('myNum');
    result = locals.get('myNum');
    expect(result).toBe(undefined);
  }));
});
