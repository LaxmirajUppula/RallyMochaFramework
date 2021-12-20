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
    browser.setTimeout({ implicit: 4000 });
    let alertFlag = $(loginPage.alertBanner).isDisplayed();
    if (alertFlag) {
      assert.equal(
        alertFlag,
        false,
        "The email/password combination you entered is not valid. Please try again."
      );
    }
  }

  ResourcePage() {
    // page.open("https://member.werally.com/home/");
    action.doClick($("#rh-header-company-info-image"))
    action.doWaitForElement($(homePage.benefit));
    action.doClick($(homePage.benefit));
    action.doWaitForElement($(benefitPage.headline));
  }

  SupportPage() {
    $(homePage.myprofile).moveTo();
    action.doClick($(homePage.helpcenter));
    page.moveToTab("helpcenter.werally.com/rally/s/");
    browser.setTimeout({ implicit: 2000 });
    let elemFlag = $(supportPage.carrierDropdown).isExisting();
    if (elemFlag) {
      $(supportPage.carrierDropdown).selectByIndex(1);
    }
    action.doClick($(supportPage.contactSupportBtn));
  }

  RewardsPage() {
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
    browser.setTimeout({ implicit: 4000 });
    let alertFlag = $(loginPage.alertBanner).isDisplayed();
    if (alertFlag) {
      assert.equal(
        alertFlag,
        false,
        "The email/password combination you entered is not valid. Please try again."
      );
    }
    action.doClick($("#rh-header-company-info-image"));
  }
}
module.exports = new buildPage();
