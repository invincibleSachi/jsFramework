var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');

exports.config = {
    // Specify you want to use jasmine 2.x as you would with mocha. Note, 'jasmine' by default will use the latest jasmine framework.
    framework: 'jasmine',
    specs: [
            "./spec/example.spec.js" 
          ],
    // suites: {
    //   //team1: 'test/runUT1/runQunitTeam1-*.js',
    //   //team2: ['test/runUT2/runQunitDesign.js','test/runUT2/runQunitQuality.js','test/runUT2/runQunitRFQ.js','test/runUT2/runQunitMaterial.js']
    //   //allteam:['test/runUTAll/runQunitTeam1-*.js','test/runUTAll/runQunitTeam2-*.js']
    // }
      capabilities: {
        browserName: 'chrome'
      },
      jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 2500000,
        includeStackTrace : true,
        isVerbose : true,
        print: function () {}
      },
      seleniumAddress: 'http://localhost:4444/wd/hub',
      onPrepare: function() {
        browser.ignoreSynchronization = true;
        jasmine.DEFAULT_TIMEOUT_INTERVAL=180000;
        jasmine.getEnv().addReporter(
          new Jasmine2HtmlReporter({
            savePath: 'reports/jasmineReport',
            screenshotsFolder: 'screenshots',
            takeScreenshots: true,
            takeScreenshotsOnlyOnFailures: true,
            cleanDestination: true,
            fileName: 'TestAutomationReport',
            reportTitle: "Test Automation Report",
            consolidate: true,
            consolidateAll: true
          })
        );
      var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
      jasmine.getEnv().addReporter(new SpecReporter({
        displayStacktrace: 'all',      // display stacktrace for each failed assertion, values: (all|specs|summary|none) 
        displaySuccessesSummary: false, // display summary of all successes after execution 
        displayFailuresSummary: true,   // display summary of all failures after execution 
        displayPendingSummary: true,    // display summary of all pending specs after execution 
        displaySuccessfulSpec: true,    // display each successful spec 
        displayFailedSpec: true,        // display each failed spec 
        displayPendingSpec: false,      // display each pending spec 
        displaySpecDuration: false,     // display each spec duration 
        displaySuiteNumber: false,      // display each suite number (hierarchical) 
        colors: {
          success: 'green',
          failure: 'red',
          pending: 'yellow'
        },
        prefixes: {
          success: '✓ ',
          failure: '✗ ',
          pending: '* '
        },
        customProcessors: []

        }));
      }
  }


