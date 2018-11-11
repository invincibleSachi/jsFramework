"use strict";
var Cucumber = require("cucumber");
var { defineSupportCode } = require("cucumber");
var fs = require("fs");
var mkdirp = require("mkdirp");
var conf = require("../protractor.conf").config;
var reporter = require("cucumber-html-reporter");
var report = require("cucumber-html-report");

var jsonReports = process.cwd() + "/reports/json";
var htmlReports = process.cwd() + "/reports/html";
var targetJson = jsonReports + "/cucumber_report.json";

var TestCentralPage = require('../pages/gmail/mailBoxPage');

defineSupportCode(function({ registerHandler, After, registerListener }) {
  registerHandler("BeforeFeature", { timeout: 30 * 1000 }, function() {
    //Register handlers/methods to call before each feature
  });

  registerHandler("BeforeFeatures", function(event, next) {
    console.log('running before all features');
    //Register handlers/methods here to call before all features
  });

  // registerHandler('AfterFeatures', function (event, callback) {
  //   console.log('called after all features');
  //   return next();
  // });

   registerHandler("AfterFeatures", function(event, next) {
     console.log('called after all features');
     return next();
   });

  After(function(scenario) {

    if (scenario.isFailed()) {
      var attach = this.attach;
      return browser.takeScreenshot().then(function(png) {
        var decodedImage = new Buffer(png, "base64");
         attach(decodedImage, "image/png");
          return TestCentralPage.endTest();
      });
    }
    return TestCentralPage.endTest();
  });

  var cucumberReportOptions = {
    source: targetJson,
    dest: htmlReports,
    name: "cucumber_report.html",
    title: "Cucumber Report"
  };
  var cucumberReporteroptions = {
    theme: "bootstrap",
    jsonFile: targetJson,
    output: htmlReports + "/cucumber_reporter.html",
    reportSuiteAsScenarios: true
  };

  var logFn = string => {
    if (!fs.existsSync(jsonReports)) {
      mkdirp.sync(jsonReports);
    }
    try {
      fs.writeFileSync(targetJson, string);
      reporter.generate(cucumberReporteroptions); //invoke cucumber-html-reporter
      report
        .create(cucumberReportOptions)
        .then(function() {
          //invoke cucumber-html-report
          // creating two reports(optional) here, cucumber-html-report gives directory already exists as cucumber-html-reporter already creates the html dir!
          // suggestion- use either one of the reports based on your needs
          console.log("cucumber_report.html created successfully!");
        })
        .catch(function(err) {
          if (err) {
            console.error(err);
          }
        });
    } catch (err) {
      if (err) {
        console.log("Failed to save cucumber test results to json file.");
        console.log(err);
      }
    }
  };
  var jsonformatter = new Cucumber.JsonFormatter({
    log: logFn
  });
  registerListener(jsonformatter);
});
