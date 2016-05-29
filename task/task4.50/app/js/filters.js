questionnaire.filter('percent', function() {
  return function(x) {
    var num = x * 100;
    if (num.toFixed(0) < 10) {
      num = "0" + num.toFixed(0) + "%";
    } else {
      num = num.toFixed(0) + "%";
    }
    return num;
  };
});

