const page = require("../pages/page");
const action = require("../helpers/actionHelpers");
const SFPage = require("../pages/rof.page");
const launchDate = require("../launchDate");

class requirements {
  getCustomerSupportNumber(username, password, impName) {
    page.open("https://rallyhealth.my.salesforce.com/");
    action.doSetValue($(SFPage.username), username);
    action.doSetValue($(SFPage.password), password);
    action.doClick($(SFPage.login));
    action.doWaitForElement($(SFPage.alert));
    action.doClick($(SFPage.alert));
    action.doSetValue($(SFPage.search), impName);
    action.doClick($(SFPage.searchBtn));
    browser.setTimeout({ implicit: 10000 });
    let impElement = $(
      "//*[@id='Milestone1_Project__c_body']/table/tbody/tr[2]/th/a"
    ).isExisting();
    console.log("Implementation Status : " + impElement);
    // assert.equal(impElement, true, "Implementation Name format mismatch");
    if (impElement) {
      action.doClick(
        $("//*[@id='Milestone1_Project__c_body']/table/tbody/tr[2]/th/a")
      );
    } else {
      impName = impName.replace(
        launchDate.launchDate,
        launchDate.launchDateOther
      );
      console.log("New Imp Name : " + impName);
      action.doSetValue($(SFPage.search), impName);
      action.doClick($(SFPage.searchBtn));
      action.doClick(
        $("//*[@id='Milestone1_Project__c_body']/table/tbody/tr[2]/th/a")
      );
    }
  }

  loginSalesforce(username, password) {
    try {
      page.open("https://rallyhealth.my.salesforce.com/");
      action.doSetValue($(SFPage.username), username);
      action.doSetValue($(SFPage.password), password);
      action.doClick($(SFPage.login));
      page.open("https://rallyhealth.lightning.force.com/ltng/switcher?destination=classic&referrer=%2Flightning%2Fpage%2Fhome");
    }
    catch (exception) { 
      console.log("Issue with Salesforce Login");
      throw exception;
    }

  }
}
module.exports = new requirements();
