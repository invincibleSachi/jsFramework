'use strict';
var constant=require('./constants');
var fs = require('fs');
var chai=require('chai');
const uuidv1 = require('uuid/v1');
var expect=chai.expect;
var assert=chai.assert;
var path=require('path');
var logger=constant.getLogger();
var EC = protractor.ExpectedConditions;
var chaiAsPromised = require('chai-as-promised');
var driver=browser.driver;

chai.use(chaiAsPromised);
var failTest=function(message){
    if(message===undefined){
        message='test failed';
    }
    logger.warn(message);
    assert.fail(0,1, message);
};

var switch2Angular=function(toAngular){
    if(toAngular===true){
        driver=browser;
        browser.waitForAngularEnabled(true);
    }else{
        driver=browser.driver;
        browser.waitForAngularEnabled(false);
        browser.ignoreSynchronization = true;
    }
    
};

var explicitWait=function(milliseconds){
    if(milliseconds===undefined){
        milliseconds=constant.DEFAULT_TIMEOUT;
    }
    return driver.sleep(milliseconds);
};

var highlightElement= function(element){
    function setStyle(element, style) {
        const previous = element.getAttribute('style');
        element.setAttribute('style', style);
        setTimeout(() => {
            element.setAttribute('style', previous);
        }, 200);
        return "highlighted";
    }
    return driver.executeScript(setStyle, element.getWebElement(), 'color: blue; background-color: yellow; border: 4px solid red;');
};

var getAllElements= function(locator){
    return element.all(getByLocator(locator));
};

var getAllElementsCount= function(locator){
    return getAllElements(locator).count();
};

var log=function(message){
    logger.info(message);
};

var selectWrapper=function(locator){
    var selectElement=getElementByLocator(locator);
    verifyElementPresent(selectElement);
    return {
        getOption:function(){
             return selectElement.all(by.tagName('option'));
        },
        getSelectedOptions:function(){
             return selectElement.all(by.css('option[selected="selected"]'));
        },
        selectByValue:function(value){
             return selectElement.all(by.css('option[value="' + value + '"]')).click();
        },
        selectByPartialText:function(text){
             return selectElement.all(by.cssContainingText('option', text)).click();
        },
        selectByText:function(text){
            return selectElement.all(by.xpath("//Option[text()='"+text+"']")).click();
        }

    };
};

var getByLocator= function(locator){
    var loc=locator;
    var locatorType="xpath"
    var element
    if (locator!==undefined){
        if(locator.indexOf(constant.LOCATOR_DELIM)>0){
            locatorType=locator.split(constant.LOCATOR_DELIM)[0];
            loc=locator.split(constant.LOCATOR_DELIM)[1];
            log('locatorType ::'+locatorType);
            log('locator ::'+loc);
            switch(locatorType.toLowerCase()){
                case "xpath": return by.xpath(loc);
                case "classname": return by.className(loc);
                case "css": return by.css(loc);
                case "id": return by.id(loc);
                case "linktext": return by.linkText(loc);
                case "name": return by.name(loc);
                case "partiallinktext": return by.partialLinkText(loc);
                case "tagname": return by.tagName(loc);
                //Angular Specific Locators
                case "buttontext": return by.buttonText(loc);
                case "partialbuttontext": return by.partialButtonText(loc);
                case "cssContainingText": return by.cssContainingText(loc);
                case "deepCss": return by.deepCss(loc);
                case "model": return by.model(loc);
                case "binding": return by.binding(loc);
                default: return by.xpath(loc);
            }
        }
    }else{
        log('locator is undefined ');
        expect(e).not.to.be.an('undefined');
    }
    
    log('locator ::'+loc);
    return by.xpath(loc);
};

var verifyElementPresent= function(e,milliseconds){
    if(milliseconds===undefined){
        milliseconds=constant.DEFAULT_TIMEOUT;
    }
    expect(e).not.to.be.an('undefined');
    browser.wait(EC.presenceOf(e), milliseconds,'element not present.').
        then(function(){
            var isPresent=e.isPresent();
            expect(isPresent).to.eventually.equal(true).
            then(function(){
                highlightElement(e);
            });
        });
    return browser.wait(EC.presenceOf(e), milliseconds,'element not present.');
};

var verifyElementClickable= function(e,milliseconds){
    if(milliseconds===undefined){
        milliseconds=constant.DEFAULT_TIMEOUT;
    }
    verifyElementPresent(e,milliseconds);
    return driver.wait(EC.elementToBeClickable(e),milliseconds,"element is not clickable");
}

var verifyElementDisplayed= function(e,milliseconds){
    expect(e).not.to.be.an('undefined');
    if(milliseconds===undefined){
        milliseconds=constant.DEFAULT_TIMEOUT;
    }
    driver.wait(EC.visibilityOf(e), milliseconds,'element not displayed.');
    var isPresent=e.isDisplayed();
    expect(isPresent).to.eventually.equal(true);
    highlightElement(e);
    return driver.wait(EC.visibilityOf(e), milliseconds,'element not displayed.');
};

var isSelected=function(e){
    var e=getElementByLocator(locator);
    return e.isSelected();
};

var getElementByLocator=function(locator){
    return element(getByLocator(locator));
};

var getElementsByLocator=function(locator){
    return element.all(getByLocator(locator));
};

var getElementsCountByLocator=function(locator){
    return element.all(getByLocator(locator)).count();
};

var getElementByLinkText=function(linkText){
    return element(by.linkText(linkText));
};

var expectedConditions={
    not:function(ec,milliseconds){
        if(milliseconds===undefined){
            milliseconds=constant.SHORT_WAIT_TIMEOUT;
        }
        return driver.wait(EC.not(ec),milliseconds);
    },
    alertIsPresent:function(milliseconds){
        if(milliseconds===undefined){
            milliseconds=constant.SHORT_WAIT_TIMEOUT;
        }
        return driver.wait(EC.alertIsPresent(), constant.SHORT_WAIT_TIMEOUT,'alert is not present.');
    },
    element2beClickable:function(locator,milliseconds){
        if(milliseconds===undefined){
            milliseconds=constant.SHORT_WAIT_TIMEOUT;
        }
        return driver.wait(EC.elementToBeClickable(getElementByLocator(locator)), milliseconds,'element is not clickable ::'+locator);
    },
    text2bePresentInElement:function(locator,text,milliseconds){
        if(milliseconds===undefined){
            milliseconds=constant.SHORT_WAIT_TIMEOUT;
        }
        return driver.wait(EC.textToBePresentInElement(getElementByLocator(locator), text), milliseconds,text+' is not present in element ::'+locator);
    },
    textToBePresentInElementValue:function(locator,text,milliseconds){
        if(milliseconds===undefined){
            milliseconds=constant.SHORT_WAIT_TIMEOUT;
        }
        return driver.wait(EC.textToBePresentInElementValue(getElementByLocator(locator), text), milliseconds,text+ ' is not present in element value ::'+locator);
    },
    titleContains:function(text,milliseconds){
        if(milliseconds===undefined){
            milliseconds=constant.SHORT_WAIT_TIMEOUT;
        }
        return driver.wait(ECtitleContains(text), milliseconds,'page title doesnt contain '+text);
    },
    urlContains:function(text,milliseconds){
        if(milliseconds===undefined){
            milliseconds=constant.SHORT_WAIT_TIMEOUT;
        }
        return driver.wait(EC.urlContains(text),  milliseconds,'url doesnt contain '+text);
    },
    staleness:function(text){
        driver.wait(EC.stalenessOf(text), constant.SHORT_WAIT_TIMEOUT);
    },
    presenceOf:function(locator,milliseconds){
        if(milliseconds===undefined){
            milliseconds=constant.DEFAULT_TIMEOUT;
        }
        return driver.wait(EC.presenceOf(getElementByLocator(locator)), milliseconds,'element not present.');
    },
    invisibilityOf:function(locator,milliseconds){
        if(milliseconds===undefined){
            milliseconds=constant.SHORT_WAIT_TIMEOUT;
        }
        return driver.wait(EC.invisibilityOf(getElementByLocator(locator)), milliseconds,'element is not visible.');
    },
    visibilityOf:function(locator,milliseconds){
        if(milliseconds===undefined){
            milliseconds=constant.DEFAULT_TIMEOUT;
        }
        return driver.wait(EC.visibilityOf(getElementByLocator(locator)), milliseconds,'element is not visible.');
    }
};
module.exports={
    click: function(locator,milliseconds){
        var e=getElementByLocator(locator,milliseconds);
        verifyElementClickable(e,milliseconds).then(function(){
            driver.wait(EC.elementToBeClickable(e),milliseconds,"element is not clickable").then(function(){
                log("[UI Action] clicking on "+locator);
                return driver.actions().mouseMove(e).click().perform(); 
            }).catch(function(){
                failTest('not able to click on '+locator);
            });
        });   
        
    },
    clickNwait: function(locator,waitTimeMillis,milliseconds){
        var e=getElementByLocator(locator,milliseconds);
        verifyElementClickable(e,milliseconds).then(function(){
            driver.wait(EC.elementToBeClickable(e),milliseconds,"element is not clickable").then(function(){
                    log("[UI Action] clicking on "+locator);
                    driver.actions().mouseMove(e).click().perform(); 
                    log('waiting '+waitTimeMillis + ' ms after click on '+locator);
                    return explicitWait(waitTimeMillis);
                }).catch(function(){
                    failTest('not able to click on '+locator);
                });
        });
        
    },
    waitNclick: function(locator,waitTimeMillis,milliseconds){
        var e=getElementByLocator(locator,milliseconds);
        log('waiting '+waitTimeMillis + ' ms before click on '+locator);
            explicitWait(waitTimeMillis).then(function(){
                verifyElementClickable(e,milliseconds).then(function(){
                    log("[UI Action] clicking on "+locator);
                    return driver.actions().mouseMove(e).click().perform(); 
                }).catch(function(){
                    failTest('not able to click on '+locator);
                });
            });
    },
    clickIfPresent:function(locator,milliseconds){
        if(milliseconds===undefined){
            milliseconds=constant.SHORT_WAIT_TIMEOUT;
        }
        var e=getElementByLocator(locator,milliseconds);
        e.isPresent().then(function (isDisplayed) {
            if(isDisplayed){
                log("[UI Action] On Present click on "+locator);
                return driver.actions().mouseMove(e).click().perform(); 
            }else{
                log("[No Action] element not present"+locator);
            }
        }).catch(function(){
            log("[No Action] element not present")
        });  
    },
    sendkeys:function(locator,text,milliseconds){
        var e=getElementByLocator(locator,milliseconds);
        verifyElementDisplayed(e,milliseconds);
        driver.wait(EC.visibilityOf(e),milliseconds,"element is not displayed").then(function(){
            log('[UI Action] writing text '+ text+ ' in textbox');
            return e.sendKeys(text);
        }).catch(function(){
            failTest('not able to sendkeys on '+locator);
        });
    },
    uploadFile: function(locator,fileToUpload,milliseconds){
        var absolutePath = path.resolve(__dirname, fileToUpload);
        var e=getElementByLocator(locator,milliseconds);
        browser.wait(EC.presenceOf(e), milliseconds,'element not present.').
        then(function(){
            log('[UI Action] uploading file '+ fileToUpload);
            return e.sendKeys(absolutePath);
        }).catch(function(){
            failTest('not able to upload file on '+locator);
        });
    },
    clear: function(locator,milliseconds){
        var e=getElementByLocator(locator,milliseconds);
        verifyElementDisplayed(e,milliseconds).then(function(){
            log('[UI Action] clearing text from '+locator);
            return e.clear();
        }).catch(function(){
            failTest('not able to clear text field '+locator);
        }); 
    },
    getAttribute: function(locator,attrib,milliseconds){
        var e=getElementByLocator(locator);
        verifyElementPresent(e,milliseconds).then(function(){
            log('getting attirbute '+ attrib + ' from element '+locator);
            return e.getAttribute(attrib);
        }).catch(function(){
            failTest('not able to get Attribute '+attrib + ' from '+locator);
        });
    },
    expectAttributeEqualTo: function(locator,attrib,match,milliseconds){
        var e=getElementByLocator(locator);
        verifyElementPresent(e,milliseconds).then(function(){
            log('getting attirbute '+ attrib + ' from element '+locator);
            expect(e.getAttribute(attrib)).to.eventually.equal(match);
        }).catch(function(){
            logger.warn('not able to get Attribute '+attrib + ' from '+locator);
        });
    },
    expectGetTextEqualTo:function(locator,match,milliseconds){
        var e=getElementByLocator(locator);
        verifyElementPresent(e,milliseconds).then(function(){
            expect(e.getText().to.eventually.equal(match));
        }).catch(function(){
            logger.warn('not able to get text from '+locator);
        });
    },
    getText: function(locator,milliseconds){
        var e=getElementByLocator(locator);
        verifyElementPresent(e,milliseconds).then(function(){
            log('getting text from element '+locator);
            e.getText().then(function(text) {
                log('text fetched from getText '+text);
                return text;
            });
        });
    },
    switch2Frame: function(locator,milliseconds){
        if(milliseconds===undefined){
            milliseconds=constant.SHORT_WAIT_TIMEOUT;
        }
        var e=getElementByLocator(locator);
        verifyElementPresent(e,milliseconds).then(function(){
            log('[UI Action] switching to frame '+locator);
            return driver.switchTo().frame(e.getWebElement());
        }).catch(function(){
            logger.warn('not able to switch to frame');
        });
    },
    switch2WindowHandle:function(handle){
        return browser.switchTo().window(handle);
    },
    switch2DefaultContent: function(){
        return driver.switchTo().defaultContent();
    },
    acceptAlert: function(){
        expectedConditions.alertIsPresent().then(function(){
            log('[UI Action] accepting alert');
            return driver.switchto().alert().accept();
        }).catch(function(){
            failTest('not able to accept alert');
        });
        
    },
    navigateTo: function(url){
        log('[UI Action] navigating to '+url);
        return driver.get(url);
    },
    getPageTitle:function(){
        log('get page title');
        driver.getTitle().then(function(title){
            return title;
        });
    },
    getAllWindowHandles:function(){
        driver.getAllWindowHandles().then(function(handles){
            return handles;
        })
    },
    waitUntilElementPresent:function(locator,milliseconds){
        log('waiting till element is present '+locator);
        var e=getElementByLocator(locator);
        driver.wait(EC.presenceOf(e),milliseconds,'element was not visibile even after '+milliseconds + ' miili sec');
    },
    mouseMove: function(locator,milliseconds){
        var e=getElementByLocator(locator);
        verifyElementPresent(e,milliseconds).then(function(){
            log('[UI Action] moving mouse to '+locator);
            return driver.actions().mouseMove(e).perform(); 
        }).catch(function(){
            failTest('not able to move mouse'+locator);
        });
    },
    dragNDrop: function(locator1, locator2){
        var e1=getElementByLocator(locator1);
        var e2=getElementByLocator(locator2);
        verifyElementPresent(e1,milliseconds).then(function(){
            verifyElementPresent(e2,milliseconds).then(function(){
                return driver.actions().mouseMove(e1).mouseDown().mouseMove(e2).mouseUp().perform();
            }).catch(function(){
                failTest('element not present '+locator1);
            });
        }).catch(function(){
            failTest('element not present '+locator2);
        });
    },
    refreshPage:function(){
        log('[UI Action] refreshing page');
        driver.waitForAngular();
        driver.ignoreSynchronization = false;
        return driver.navigate().refresh();
        
    },
    checkCheckbox:function(locator,milliseconds){
        log('[UI Action] checking checkbox');
        var e=getElementByLocator(locator);
        verifyElementDisplayed(e,milliseconds).then(function(){
            if(!isSelected(locator)){
                return e.click();
            }
        });
    },
    selectDropDownByIndex:function(locator,index,waitSecond){
        log('[UI Action] select dropdown by index '+index);
        if (typeof milliseconds !== 'undefined') {
            return browser.sleep(milliseconds);
        }
        var e=getElementByLocator(locator);
        verifyElementPresent(e);
        element.findElements(by.tagName('option'))
            .then(function(options) {
                return options[index].click();
            });
        
    },
    pressKey:function(protractorKey){
        log('[UI Action] Pressing key '+protractorKey);
        return driver.actions().sendKeys(protractorKey).perform();
    },
    sleep:function(timeInMillis){
        return driver.sleep(timeInMillis);
    },
    takescreenshot:function(){
        var filename=constant.SCREENSHOT_PATH+uuid()+".png";
        var stream = fs.createWriteStream(filename);
        stream.write(new Buffer(data, 'base64'));
        stream.end();

        driver.takeScreenshot().then(function (png) {
            writeScreenShot(png, filename);
        });
        //Add Screenshot to report
        return filename;
    },
    select:function(locator){
        log('[UI Action] selecting from dropdown');
        return selectWrapper(locator);
    },
    isSelected:function(locator){
        log('verifying if element is already selected ');
        var e=getElementByLocator(locator);
        return element.isSelected();
    },
    closeBrowser:function(){
        log('[UI Action] close browser');
        driver.close();
    },
    get:function(url,milliseconds){
        log('set page url '+url);
        if(milliseconds===undefined){
            milliseconds=constant.DEFAULT_TIMEOUT;
        }
        return driver.get(url,milliseconds);
    },
    refreshPage:function(){
        log('refersh page');
        return driver.navigate().refresh();
    },
    maximizeBrowser:function(){
        return driver.manage().window().maximize();
    },
    minimizeBrowser:function(){
        return driver.manage().window().minimize();
    },
    navigateBack:function(){
        return driver.navigate().back();
    },
    navigateForward:function(){
        return driver.navigate().forward();
    },
    isVisible:function(locator){
        var e=getElementByLocator(locator);
        return element(e).isDisplayed();
    },
    isElementPresent: function(locator){
        var e=getElementByLocator(locator);
        return e.isPresent();
    },
    getElementByLocator:getElementByLocator,
    getByLocator:getByLocator,
    expectedConditions:expectedConditions,
    EC:protractor.ExpectedConditions,
    switch2Angular:switch2Angular,
    getElementByLinkText:getElementByLinkText,
    verifyElementPresent:verifyElementPresent,
    logger:logger,
    explicitWait:explicitWait,
    getElementsByLocator:getElementsByLocator,
    getElementsCountByLocator:getElementsCountByLocator
}