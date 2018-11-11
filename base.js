var x;
module.exports={
    constants:require('./constants.js'),
    utils:require('./util/utils_export.js'),
    env:require('./environment/env.js'),
    path:require('path'),
    objrepo:require('./object_repo/objects.js'),
    selenium:require('./selenium.js'),   
    expectedConditions:protractor.ExpectedConditions,
    chai:require('chai'),
    expect:require('chai').expect,
    assert:require('chai').assert,
    chaiAsPromised: require('chai-as-promised'),
    baseUrl: "https://www.gmail.com"
};