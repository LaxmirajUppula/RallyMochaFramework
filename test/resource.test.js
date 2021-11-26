const clientData = require("../client.data");
const rof = require("../main/rof");
const src = require("../main/sourse");
const constants = require("../constants");
const action = require("../helpers/actionHelpers");
const SFPage = require("../pages/rof.page");
const ResourcePage = require("../pages/benefit.page");
const launchDate = require("../launchDate");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
require('chromedriver');

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
      const clientName =
        testData[0]["CUST_LEG_NM"] + " - " + launchDate.launchDate;
      describe(clientName, () => {
        it("Benefits Page", () => {
          try {
            //Taking requirement from Salesforce
            rof.getCustomerSupportNumber(
              constants.username,
              constants.password,
              clientName
            );
            const CustomResoucePageChkBox = SFPage.customResoursePage;
            action.doWaitForElement($(CustomResoucePageChkBox));
            $(CustomResoucePageChkBox).scrollIntoView();
            browser.takeScreenshot();
            const check = $(CustomResoucePageChkBox)
              .getAttribute("title")
              .toLowerCase();
            if (check === "checked") {
              action.doWaitForElement($(SFPage.resourcePageRequirement));
              action.doClick($(SFPage.resourcePageRequirement));
              action.doWaitForElement($(SFPage.resourcePageHeadline));
              const Headline = action.doGetText($(SFPage.resourcePageHeadline));
              const BodyText = action.doGetText($(SFPage.resourcePageBodyText));
              browser.takeScreenshot();
              // UI Validation
              src.Login(
                clientData.LoginURL,
                testData[0]["RALLY_EMAIL"],
                testData[0]["RALLY_PASSWORD"]
              );
              src.ResourcePage();
              action.doWaitForElement($(ResourcePage.headline));
              const ResourcePageHeadline = action.doGetText(
                $(ResourcePage.headline)
              );
              const ResourcePageBodyText = action.doGetText(
                $(ResourcePage.bodytext)
              );
              browser.takeScreenshot();
              assert.equal(
                Headline,
                ResourcePageHeadline,
                "Invalid page Headline"
              );
              assert.equal(
                BodyText,
                ResourcePageBodyText,
                "Invalid page Body Text"
              );
              console.log(
                clientName + " Benefits Page Validation Completed Successfully"
              );
              browser.reloadSession();
            } else {
              //Rally UI Validation
              src.Login(
                clientData.LoginURL,
                testData[0]["RALLY_EMAIL"],
                testData[0]["RALLY_PASSWORD"]
              );
              src.ResourcePage();
              browser.takeScreenshot();
              console.log(
                clientName + " Benefits Page Validation Completed Successfully"
              );
              browser.reloadSession();
            }
          } catch (exception) {
            browser.reloadSession();
            throw exception;
          }
        });
      });
    }
  } catch (exception) {
    browser.reloadSession();
    throw exception;
  }
});
