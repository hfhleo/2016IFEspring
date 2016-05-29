// spec.js
describe('Protractor Demo App', function() {
  describe('Redirect Test', function() {
    beforeEach(function() {
      browser.get('http://localhost:3000/');
    });

    it('should have a title', function() {
      browser.get('http://localhost:3000/');
      expect(browser.getTitle()).toEqual('百度前端任务4.50');
    });

    it('should redirect to index.html#/newForm', function() {
      var newFormBtn = element(by.buttonText('新建问卷')).click();
      browser.getLocationAbsUrl().then(function(url) {
        //expect(url.split('#')[1]).toBe('/newForm');
        expect(url).toBe('/newForm');
      });
    });

    it('click newForm > newForm should redirect to index.html#/editPage', function() {
      element(by.buttonText('新建问卷')).click();
      element(by.buttonText('新建问卷')).click();
      browser.getLocationAbsUrl().then(function(url) {
        //expect(url.split('#')[1]).toBe('/newForm');
        expect(url).toBe('/editPage');
      });
    });

    it('click newForm > newForm should redirect to index.html#/editPage', function() {
      element.all(by.buttonText('查看数据')).then(function(items) {
        items[0].click();
      });
      browser.getLocationAbsUrl().then(function(url) {
        expect(url).toBe('/displayData');
      });
    });

    it('click newForm > newForm should redirect to index.html#/editPage', function() {
      element.all(by.buttonText('查看问卷')).then(function(items) {
        items[0].click();
      });
      browser.getLocationAbsUrl().then(function(url) {
        expect(url).toBe('/surveyForm');
      });
    });
  });

  describe('FormList Test', function() {
    beforeEach(function() {
      browser.get('http://localhost:3000/');
    });

    it('should delete a form without alert', function() {
      var formNum = element.all(by.repeater('form in forms'));
      expect(formNum.count()).toBe(4);
      element.all(by.buttonText('删除')).then(function(items) {
        items[1].click();
      });
      expect(formNum.count()).toBe(3);
      element.all(by.buttonText('删除')).then(function(items) {
        items[0].click();
      });
      var EC = protractor.ExpectedConditions;
      // Waits for an alert pops up.
      browser.wait(EC.alertIsPresent(), 2000);
    });
  });
});
