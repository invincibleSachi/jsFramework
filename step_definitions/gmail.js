'use strict';

var { defineSupportCode } = require('cucumber');

// Add required modules here
var env = require('../environment/env.js');
var pages=require('../pages/pages.js');
var loginPage=pages.gmail.loginPage;
var mailBoxPage=pages.gmail.mailBoxPage;

// Variable declarations
var d = new Date();
var dvExt = d.getTime();

defineSupportCode(function ({ setDefaultTimeout }) {
    setDefaultTimeout(600 * 1000);
});

defineSupportCode(function ({ Given, When, Then }) {

    Given('I login User {user} and password {password}', function (user, password) {        
        return loginPage.login(user,password);          
      });
      
      When('I navigate to inbox Page', function () {       
      return mailBoxPage.getNewEmail();
      });

});


