const clientData = require("../client.data");
const rof = require("../main/rof");
const src = require("../main/sourse");
const constants = require("../constants");
const action = require("../helpers/actionHelpers");
const SFPage = require("../pages/rof.page");
const loginPage = require("../pages/login.page");
const supportPage = require("../pages/support.page");
const launchDate = require("../launchDate");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
var CustomerSupportNumber;

describe("Implementation", () => {
  try {
    const dataPath = path.resolve(__dirname, "./../clientTestData");
    const GTUPrimaryFiles = fs.readdirSync(dataPath, ["**.xlsx"]);
    for (let i = 0; i < GTUPrimaryFiles.length; i++) {
      const files = GTUPrimaryFiles[i];
      const workbook = XLSX.readFile("clientTestData/" + files);
      const workbookSheets = workbook.SheetNames;
      const sheet = workbookSheets[0];
      const testData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
      if (
        testData[0]["CUST_LEG_NM"] === undefined ||
        testData[0]["RALLY_EMAIL"] === undefined ||
        testData[0]["RALLY_PASSWORD"] === undefined
      ) {
        console.log(
          "Required data not available for this client : " +
            testData[0]["CUST_LEG_NM"]
        );
      } else {
        const clientName =
          testData[0]["CUST_LEG_NM"] + " - " + launchDate.launchDate;
        describe(clientName, () => {
          it("Support Details Page", () => {
            try {
              // Taking Requirement from Salesforce
              rof.getCustomerSupportNumber(
                constants.username,
                constants.password,
                clientName
              );
              action.doWaitForElement($(SFPage.customerSupportNumber));
              $(SFPage.customerSupportNumber).scrollIntoView();
              const SFCustomCustomerSupportNumber = action.doGetText(
                $(SFPage.customCustomerSN)).replace(/[^0-9]/g, "");
              console.log(
                "Custom Number is : " + SFCustomCustomerSupportNumber
              );
              browser.takeScreenshot();
              if (SFCustomCustomerSupportNumber === "") {
                console.log("Inside if block");
                CustomerSupportNumber = action
                  .doGetText($(SFPage.customerSupportNumber))
                  .replace(/[^0-9]/g, "")
                  .slice(1);
              } else {
                CustomerSupportNumber = action
                  .doGetText($(SFPage.customCustomerSN))
                  .replace(/[^0-9]/g, "");
              }
              console.log(
                "customer support number is : " + CustomerSupportNumber
              );
              // Rally UI Validation
              src.Login(
                clientData.LoginURL,
                testData[0]["RALLY_EMAIL"],
                testData[0]["RALLY_PASSWORD"]
              );
              src.SupportPage();
              const RSupportNumber = action
                .doGetText($(supportPage.contactSupportNumber))
                .replace(/[^a-zA-Z0-9]/g, "");
              browser.takeScreenshot();
              assert.equal(
                CustomerSupportNumber,
                RSupportNumber,
                "Invalid Customer Support Number"
              );
              console.log(
                clientName +
                  " Support Details Validation Completed Successfully"
              );
              browser.reloadSession();
            } catch (exception) {
              browser.takeScreenshot();
              browser.reloadSession();
              throw exception;
            }
          });
        });
      }
    }
  } catch (exception) {
    browser.takeScreenshot();
    browser.reloadSession();
    throw exception;
  }
});
