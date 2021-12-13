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
            for (arrCount = 0; arrCount < objectJson[key].length; arrCount++) {
              try {
                userName = objectJson[key][arrCount].username;
                password = objectJson[key][arrCount].password;
                contactNumber = objectJson[key][arrCount].contactNumber
                  .replace(/[^0-9]/g, "")
                  .substring(1);
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
                browser.reloadSession();
                throw exception;
              }

            }
          } else {
            try {
              console.log("Complete Json inside else: " + JSON.stringify(objectJson));

              userName = objectJson[key].username;
              password = objectJson[key].password;
              contactNumber = objectJson[key].contactNumber
                .replace(/[^0-9]/g, "");
                // .substring(1);
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
              browser.reloadSession();
              throw exception;
            }
          }
        });
      });
    } catch (exception) {
      browser.reloadSession();
      throw exception;
    }
  }
});
