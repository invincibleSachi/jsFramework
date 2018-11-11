exports.config = {
  directConnect: true,
  allScriptsTimeout: 900000,
  baseUrl: "https://www.gmail.com",
  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome',
  },
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  specs: [
    'features/*.feature'
  ],
  cucumberOpts: {
    require: ['step_definitions/*.js','support/*.js'],
    strict: true,
    format: ["pretty"],
    tags: "(@Sprint111)"
  },
  onPrepare:function(){
    browser.driver.manage().window().maximize();
    browser.waitForAngularEnabled(false);
    browser.ignoreSynchronization = false;
  },
  resultJsonOutputFile: "reports/json/protractor_report.json"
};
