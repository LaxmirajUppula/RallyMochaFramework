const excelUtil = require("./excelHelpers");
const path = require("path");
const fs = require("fs");
const generic = require("../testdata/generic.json");
const rof = require("../main/rof");
const action = require("../helpers/actionHelpers");
const SFPage = require("../pages/rof.page");
const constants = require("../constants");

class rallyUtil {
  /***************************************************************************************/
  //method to generate timestamp in the format: mm/dd/yy hh:mi:ss
  /***************************************************************************************/
  saveUserDetailsFromInputFiles(memberFlag) {
    const dir = "./../testdata/clientTestData";
    const out = "./../testdata/expected";
    const dirPath = path.resolve(__dirname, dir);
    const outPath = path.resolve(__dirname, out);

    let files = this.getFiles(dirPath);

    let objUserData = this.createUserData(memberFlag, files, dirPath);

    console.log("objUserData: " + JSON.stringify(objUserData));

    this.writeToFile(outPath + "/support.json", objUserData);
    this.writeToFile(outPath + "/resource.json", objUserData);
  }

  /***************************************************************************************/
  //method to generate timestamp in the format: mm/dd/yy hh:mi:ss
  /***************************************************************************************/
  saveClientDetailsFromSF(scenario) {
    const out = "./../testdata/expected";
    let objJson;
    const outPath = path.resolve(__dirname, out);
    const releaseDate_SF = generic["launchDate"];

    let objClientData;
    if (scenario === "support") {
      objJson = require("./../testdata/expected/support.json");
      objClientData = this.createClientData(
        JSON.parse(JSON.stringify(objJson)),
        releaseDate_SF,
        scenario
      );
      this.writeToFile(outPath + "/support.json", objClientData);
    } else {
      objJson = require("./../testdata/expected/resource.json");
      objClientData = this.createClientData(
        JSON.parse(JSON.stringify(objJson)),
        releaseDate_SF,
        scenario
      );
      this.writeToFile(outPath + "/resource.json", objClientData);
    }
  }

  isArray(o) {
    return Object.prototype.toString.call(o) === "[object Array]";
  }

  getFiles(pathOfDir) {
    let files = fs.readdirSync(pathOfDir);
    return files;
  }

  writeToFile(pathOfDir, jsonObj) {
    fs.writeFileSync(pathOfDir, JSON.stringify(jsonObj));
    // , (err) => {
    //   if (err) {
    //     throw err;
    //   }
    //   console.log("JSON data is saved.");
    // });
  }

  createUserData(flag, clientFiles, dirPath) {
    let sfExpectation = {};
    let username;
    let password;

    username = "username";
    password = "password";

    console.log("All files" + clientFiles);

    clientFiles.forEach(function (file) {
      excelUtil.excel_getTableRows(
        dirPath + "/" + file,
        "Sheet1",
        function (results) {
          let custLegalName;
          let custEmail;
          let custPassword;

          if (flag != "with") {
            custLegalName = results[0].CUST_LEG_NM;
            custEmail = results[0].RALLY_EMAIL;
            custPassword = results[0].RALLY_PASSWORD;
            if (custLegalName) {
              if (custEmail || custPassword) {
                sfExpectation[results[0].CUST_LEG_NM] = {
                  [username]: results[0].RALLY_EMAIL,
                  [password]: results[0].RALLY_PASSWORD,
                };
              }
            }
          } else {
            results.forEach(function (record) {
              custLegalName = record.CUST_LEG_NM;
              custEmail = record.RALLY_EMAIL;
              custPassword = record.RALLY_PASSWORD;

              if (!sfExpectation[custLegalName]) {
                if (custLegalName) {
                  sfExpectation[custLegalName] = [];
                }
              }

              if (flag != "without") {
                if (custLegalName) {
                  if (custEmail || custPassword) {
                    sfExpectation[custLegalName].push({
                      [username]: custEmail,
                      [password]: custPassword,
                    });
                  }
                }
              }
            });
          }
        }
      );
    });
    return sfExpectation;
  }

  createClientData(jsonObj, dateOfRelease, scenario) {
    for (let key in jsonObj) {
      try {
        console.log(key + " -> " + jsonObj[key]);

        let clientImp = key + " - " + dateOfRelease;
        let contactNumber = "contactNumber";
        let resourceHeadline = "resourceHeadline";
        let resourceBody = "resourceBody";
        let Headline;
        let BodyText;
        let CustomerSupportNumber;

        browser.setTimeout({ pageLoad: 50000 });

        // action.doSetValue($(SFPage.search), clientImp);

        // browser.setTimeout({ 'pageLoad': 50000 })
        // browser.pause(3000);

        // action.doClick($(SFPage.searchBtn));

        // console.log("Client Implementation Name: " + clientImp);
        // browser.setTimeout({ 'implicit': 5000 })

        // $(`//a[normalize-space()= "${clientImp}"]`).click();

        action.doSetValue($(SFPage.search), clientImp);

        action.doClick($(SFPage.searchBtn));

        browser.setTimeout({ implicit: 15000 });

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
          clientImp = clientImp.replace(
            generic.launchDate,

            generic.launchDateOther
          );

          console.log("New Imp Name : " + clientImp);

          action.doSetValue($(SFPage.search), clientImp);

          action.doClick($(SFPage.searchBtn));

          action.doClick(
            $("//*[@id='Milestone1_Project__c_body']/table/tbody/tr[2]/th/a")
          );
        }
        if (scenario === "support") {
          console.log("Inside support");
          action.doWaitForElement($(SFPage.customerSupportNumber));
          $(SFPage.customerSupportNumber).scrollIntoView();
          CustomerSupportNumber = action.doGetText(
            $(SFPage.customerSupportNumber)
          );

          browser.takeScreenshot();

          if (CustomerSupportNumber === "Optum Support Custom") {
            CustomerSupportNumber = action
              .doGetText($(SFPage.customCustomerSN))
              .replace(/[^0-9]/g, "");
          }
          console.log("Value of support number is: " + CustomerSupportNumber);
        } else {
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
            Headline = action.doGetText($(SFPage.resourcePageHeadline));
            BodyText = action.doGetText($(SFPage.resourcePageBodyText));
            browser.takeScreenshot();
          } else {
            Headline = null;
            BodyText = null;
          }
        }
        if (this.isArray(jsonObj[key])) {
          for (let arrCount = 0; arrCount < jsonObj[key].length; arrCount++) {
            if (scenario === "support") {
              jsonObj[key][arrCount][contactNumber] = CustomerSupportNumber;
            } else {
              jsonObj[key][arrCount][resourceHeadline] = Headline;
              jsonObj[key][arrCount][resourceBody] = BodyText;
            }
          }
        } else {
          if (scenario === "support") {
            jsonObj[key][contactNumber] = CustomerSupportNumber;
          } else {
            jsonObj[key][resourceHeadline] = Headline;
            jsonObj[key][resourceBody] = BodyText;
          }
        }
      }
      catch (exception) {
        // browser.reloadSession();
        // rof.loginSalesforce(constants.username, constants.password);
        console.log("Issue with fetching data from Salesforce for client: " + key)
        throw exception;
      }

    }
    return jsonObj;
  }
}

module.exports = new rallyUtil();
