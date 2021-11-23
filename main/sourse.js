const page = require("../pages/page");
const action = require("../helpers/actionHelpers");
const loginPage = require("../pages/login.page");
const homePage = require("../pages/home.page");
const benefitPage = require("../pages/benefit.page");
const supportPage = require("../pages/support.page");
const rewardsPage = require("../pages/rewards.page");
class buildPage {
  Login(loginUrl, email, password) {
    page.open(loginUrl);
    action.doSetValue($(loginPage.email), email);
    action.doSetValue($(loginPage.password), password);
    action.doClick($(loginPage.loginBtn));
    browser.pause(2000);
    const alert = $(loginPage.alertBanner).isDisplayed();
    assert.equal(
      alert,
      false,
      "The email/password combination you entered is not valid. Please try again."
    );
  }

  ResourcePage() {
    action.doWaitForElement($(homePage.notNow));
    action.doClick($(homePage.notNow));
    action.doWaitForElement($(homePage.benefit));
    action.doClick($(homePage.benefit));
    action.doWaitForElement($(benefitPage.headline));
  }

  SupportPage() {
    $(homePage.myprofile).moveTo();
    action.doClick($(homePage.helpcenter));
    page.moveToTab("helpcenter.werally.com/rally/s/");
    browser.setTimeout({ implicit: 1000 });
    let elemFlag = $(supportPage.carrierDropdown).isExisting();
    console.log("Element status: " + elemFlag);
    if (elemFlag) {
      $(supportPage.carrierDropdown).selectByIndex(1);
    }
    action.doClick($(supportPage.contactSupportBtn));
  }

  RewardsPage() {
    // action.doWaitForElement($(homePage.notNow));
    // action.doClick($(homePage.notNow));
    action.doWaitForElement($(homePage.reward));
    action.doClick($(homePage.reward));
  }

  UILogin(loginUrl, email, password){
    browser.newWindow(loginUrl);
    action.doSetValue(
      $(loginPage.email),
      email
    );
    action.doSetValue($(loginPage.password), password);
    action.doClick($(loginPage.loginBtn));
    action.doClick($("#rh-header-company-info-image"));
  }
}
module.exports = new buildPage();
