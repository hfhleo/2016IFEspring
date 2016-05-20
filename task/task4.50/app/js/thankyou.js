var thankyouCtl = angular.module('thankyouCtl', ['ui.router']);

thankyouCtl.controller('thankyouController', function() {
  document.querySelector('html').style.overflowY = 'hidden';
  document.querySelector('main').style.width = '100%';
  document.querySelector('main').style.height = '100%';
});

