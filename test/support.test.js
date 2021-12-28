const src = require("../main/sourse");
const action = require("../helpers/actionHelpers");
const supportPage = require("../pages/support.page");
const clientData = require("../client.data");
const fs = require("fs");
const path = require("path");
const rallyUtil = require("../helpers/rallyHelpers");
const rof = require("../main/rof");
const constants = require("../constants");
const launchDate = require("../testdata/generic.json");
let objectJson = require("./../testdata/expected/support.json");
let userName, password, contactNumber;

describe("Implementation", () => {
  before(function () {
    rof.loginSalesforce(constants.username, constants.password);
    rallyUtil.saveClientDetailsFromSF("support");
    const out = "./../testdata/expected/support.json";
    const outPath = path.resolve(__dirname, out);
    let Json1 = fs.readFileSync(outPath);
    objectJson = JSON.parse(Json1);
  });

  // Validations
  for (let key in objectJson) {
    try {
      const clientName = JSON.stringify(key);
      describe(clientName, () => {
        it("Support Center Details", () => {
          console.log("Complete Json: " + JSON.stringify(objectJson));
          if (action.isArray(objectJson[key])) {
            try {
              if (objectJson[key][0].username) {
                userName = objectJson[key][0].username;
              }
              else {
                userName = null;
              }

              if (objectJson[key][0].password) {
                password = objectJson[key][0].password;
              }
              else {
                password = null;
              }

              if (objectJson[key][0].contactNumber) {
                contactNumber = objectJson[key][0].contactNumber
                  .replace(/[^0-9]/g, "");
              }
              else {
                contactNumber = null;
              }

              console.log("Contact number is: " + contactNumber);

              // Rally UI Validation
              src.Login(clientData.LoginURL, userName, password);
              src.SupportPage();
              const RSupportNumber = action
                .doGetText($(supportPage.contactSupportNumber))
                .replace(/[^a-zA-Z0-9]/g, "");
              browser.takeScreenshot();
              assert.equal(
                contactNumber,
                RSupportNumber,
                "Invalid Customer Support Number"
              );
              console.log(" Support Details Validation Completed Successfully");
              browser.reloadSession();
            }
            catch (exception) {
              browser.takeScreenshot();
              browser.reloadSession();
              throw exception;
            }

          } else {
            try {
              console.log("Complete Json inside else: " + JSON.stringify(objectJson));

              if (objectJson[key].username) {
                userName = objectJson[key].username;
              }
              else {
                userName = null;
              }

              if (objectJson[key].password) {
                password = objectJson[key].password;
              }
              else {
                password = null;
              }

              if (objectJson[key].contactNumber) {
                contactNumber = objectJson[key].contactNumber
                  .replace(/[^0-9]/g, "");
              }
              else {
                contactNumber = null;
              }

              console.log("Contact number is: " + contactNumber);

              src.Login(clientData.LoginURL, userName, password);
              src.SupportPage();
              const RSupportNumber = action
                .doGetText($(supportPage.contactSupportNumber))
                .replace(/[^a-zA-Z0-9]/g, "");
              browser.takeScreenshot();
              assert.equal(
                contactNumber,
                RSupportNumber,
                "Invalid Customer Support Number"
              );
              console.log(" Support Details Validation Completed Successfully");
              browser.reloadSession();
            } catch (exception) {
              browser.takeScreenshot();
              browser.reloadSession();
              throw exception;
            }
          }
        });
      });
    } catch (exception) {
      browser.takeScreenshot();
      browser.reloadSession();
      throw exception;
    }
  }
});
