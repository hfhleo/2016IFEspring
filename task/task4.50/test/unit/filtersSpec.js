describe("A suite of filters", function() {
  var $filter;

  beforeEach(function() {
    module('questionnaire');

    inject(function(_$filter_) {
      $filter = _$filter_;
    });
  });

  it('should convert 0.123456789 to a 12%', inject(function() {
    var number = 0.123456789;
    result = $filter('percent')(number);
    expect(result).toBe('12%');
  }));

  it('should convert 0.98765431 to a 99%', inject(function() {
    var number = 0.987654321;
    result = $filter('percent')(number);
    expect(result).toBe('99%');
  }));

  it('should convert 0.012345to a 01%', inject(function() {
    var number = 0.012345;
    result = $filter('percent')(number);
    expect(result).toBe('01%');
  }));

  it('should convert 0.098765to a 10%', inject(function() {
    var number = 0.098765;
    result = $filter('percent')(number);
    expect(result).toBe('10%');
  }));
});
