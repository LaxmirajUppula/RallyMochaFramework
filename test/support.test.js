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
const TestRailApi = require("./util/TestRailApi");


describe("Implementation", () => {
    try {
        const GTUPrimaryFiles = fs.readdirSync("/Users/abhinay.marapaka/Documents/RallyMochaFramework/clientTestData", ["**.xlsx"]);
        for (let i = 0; i < GTUPrimaryFiles.length; i++) {
            const files = GTUPrimaryFiles[i];
            const workbook = XLSX.readFile("/Users/abhinay.marapaka/Documents/RallyMochaFramework/clientTestData" + files);
            const workbookSheets = workbook.SheetNames;
            const sheet = workbookSheets[0];
            const testData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
            const clientName =
                "'" + testData[0]["CUST_LEG_NM"] + " - " + launchDate.launchDate + "'";
            describe(clientName, () => {
                it(" T447585402 Support Details Page", () => {
                    try {
                        // Taking Requirement from Salesforce
                        rof.getCustomerSupportNumber(
                            constants.username,
                            constants.password,
                            clientName
                        );
                        action.doWaitForElement($(SFPage.customerSupportNumber));
                        $(SFPage.customerSupportNumber).scrollIntoView();
                        const CustomerSupportNumber = action.doGetText(
                            $(SFPage.customerSupportNumber)
                        );
                        browser.takeScreenshot();
                        if (CustomerSupportNumber === "Optum Support Custom") {
                            const SFsupportNumber = action
                                .doGetText($(SFPage.customCustomerSN))
                                .replace(/[^0-9]/g, "");
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
                                SFsupportNumber,
                                RSupportNumber,
                                "Invalid Customer Support Number"
                            );
                            console.log(
                                clientName +
                                " Support Details Validation Completed Successfully"
                            );
                            browser.reloadSession();
                        } else {
                            const supportNumber = CustomerSupportNumber.replace(
                                /[^0-9]/g,
                                ""
                            );
                            const SFsupportNumber = supportNumber.slice(1);

                            // Rally UI Validation
                            src.Login(
                                clientData.LoginURL,
                                testData[0]["RALLY_EMAIL"],
                                testData[0]["RALLY_PASSWORD"]
                            );
                            src.SupportPage();
                            const RSupportNumber = action
                                .doGetText($(supportPage.contactSupportNumber))
                                .replace(/[^0-9]/g, "");
                            browser.takeScreenshot();
                            assert.equal(
                                SFsupportNumber,
                                RSupportNumber,
                                "Invalid Customer Support Number"
                            );
                            console.log(
                                clientName +
                                " Support Details Validation Completed Successfully"
                            );
                            browser.reloadSession();
                        }

                        new TestRailApi().updateRun(447585402, 1, 'Ran via automation')
                    } catch (exception) {
                        browser.reloadSession();
                        new TestRailApi().updateRun(447585402, 5, 'Ran via automation')
                        throw exception;
                    }
                });
            });
        }
    } catch (exception) {
        throw exception;
    }
});