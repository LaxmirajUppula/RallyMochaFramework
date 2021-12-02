const page = require("../pages/page");
const action = require("../helpers/actionHelpers");
const SFPage = require("../pages/rof.page");

class requirements {
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
