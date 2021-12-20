const clientData = require("../client.data");
const rof = require("../main/rof");
const src = require("../main/sourse");
const constants = require("../constants");
const action = require("../helpers/actionHelpers");
const SFPage = require("../pages/rof.page");
const rallyUtil = require("../helpers/rallyHelpers");
const loginPage = require("../pages/login.page");
const supportPage = require("../pages/support.page");
const launchDate = require("../testdata/generic.json");
const rofPage = require("../pages/rof.page");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const { count } = require("console");
const ssoObjectJson = require("../testdata/ssoInternalLinks.json");
const ssoMapingObjectJson = require("../testdata/ssoMapping.json");
let ActivityName = [];
let subActivitiesId = [];
let RewardActivityID;
let CTAValue;
let CTA;
let activities = "activities";
let ctaAction = "ctaAction";
let ctaValue = "ctaValue";
let rewardActID = "rewardActID";
let chkCT = "chkCT";
let customActivityName = [];

describe("Implementation", () => {
  try {
    const out = "./../testdata/expected/sso.json";
    const outPath = path.resolve(__dirname, out);
    let Json1 = fs.readFileSync(outPath);
    // let Json1 = require("./../testdata/expected/sso.json");
    let objectJson = JSON.parse(Json1);
    console.log("Some value: " + JSON.stringify(objectJson));

    before(function () {
      rof.loginSalesforce(constants.username, constants.password);
    });
    for (let key in objectJson) {
      const clientName =
        JSON.stringify(key).replace(/["]/g, "") + " - " + launchDate.launchDate;
      describe(clientName, () => {
        it("SSO", () => {
          try {
            const ImplementationName =
              JSON.stringify(key).replace(/["]/g, "") +
              " - " +
              launchDate.launchDate;
            console.log(ImplementationName);
            action.doSetValue($(SFPage.search), ImplementationName);
            action.doClick($(SFPage.searchBtn));
            browser.setTimeout({ implicit: 10000 });
            let impElement = $(
              "//*[@id='Milestone1_Project__c_body']/table/tbody/tr[2]/th/a"
            ).isExisting();
            console.log("Implementation Status : " + impElement);
            if (impElement) {
              action.doClick(
                $(
                  "//*[@id='Milestone1_Project__c_body']/table/tbody/tr[2]/th/a"
                )
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
                $(
                  "//*[@id='Milestone1_Project__c_body']/table/tbody/tr[2]/th/a"
                )
              );
            }
            // action.doClick($("=" + ImplementationName));
            browser.setTimeout({ implicit: 10000 });
            const CA = $("=Custom Reward Activities[0]").isExisting();
            console.log(CA);
            if (!CA) {
              // ******************************************   Capturing Custom Reward Activities into an Array   **************************************************

              action.doClick($("*=Custom Reward Activities["));
              var url = browser.getUrl();
              var customActivitiesBody = url
                .replace(/(.*)#/, "")
                .replace("target", "body");
              console.log(customActivitiesBody);
              var customRewardActivities = $$(
                "#" + customActivitiesBody + " th:nth-child(2)"
              );

              if (customRewardActivities.length > 5) {
                action.doClick(
                  $("#" + customActivitiesBody).$("a*=Go to list")
                );
                browser.setTimeout({ implicit: 5000 });
                var customRewardActivities = $$(
                  ".bPageBlock.brandSecondaryBrd.secondaryPalette th:nth-child(2)"
                );
                browser.setTimeout({ implicit: 1000 });
                let moreItems = $("=more").isExisting();
                console.log(moreItems);
                if (moreItems) {
                  $("=more").click();
                }
                var b_xpath =
                  ".bPageBlock.brandSecondaryBrd.secondaryPalette tbody tr:nth-child(";
                var a_xpath = ") th:nth-child(2) a";
              } else {
                var b_xpath =
                  '//*[@id="' + customActivitiesBody + '"]/table/tbody/tr[';
                var a_xpath = "]/th/a";
              }
              for (let j = 2; j <= customRewardActivities.length; j++) {
                const customActivityName = action.doGetText(
                  $(b_xpath + j + a_xpath)
                );
                ActivityName.push(customActivityName);
              }
              console.log(ActivityName);
              // $("div[class='ptBreadcrumb'] a").click();
            } else {
              console.log("No Custom reward Activities");
            }

            // *************************************************************************************************
            if (rallyUtil.isArray(objectJson[key])) {
              for (
                let arrCount = 0;
                arrCount < objectJson[key].length;
                arrCount++
              ) {
                let userName = objectJson[key][arrCount].username;
                let password = objectJson[key][arrCount].password;
                let RewardPlanName = objectJson[key][arrCount].rewardPlanName;
                console.log("Reward Plan Name: " + RewardPlanName);
                if (
                  RewardPlanName === undefined ||
                  userName === undefined ||
                  password === undefined
                ) {
                  console.log("No Reward affiliation user");
                } else {
                  action.doWaitForElement(
                    $(rofPage.rewardPlanDesignsHeaderLink)
                  );
                  action.doClick($(rofPage.rewardPlanDesignsHeaderLink));
                  var url = browser.getUrl();
                  var RewardPlanDesignsBody = url
                    .replace(/(.*)#/, "")
                    .replace("target", "body");
                  var RewardPlanNames = $$(
                    "#" + RewardPlanDesignsBody + " th:nth-child(2)"
                  );
                  browser.setTimeout({ implicit: 2000 });
                  if (RewardPlanNames.length > 5) {
                    action.doClick($("#" + RewardPlanDesignsBody).$("a*=Show"));
                  }

                  action.doClick($("=" + RewardPlanName));
                  console.log("we are in reward plan details page ");
                  const planDetailsPage = browser.getUrl();
                  const ActivitiesBody =
                    planDetailsPage.split("/").pop() + "_00NE0000006Km81_body";
                  let Activities = $$(
                    "#" + ActivitiesBody + " th:nth-child(2)"
                  );
                  browser.setTimeout({ implicit: 2000 });
                  let intActCount;
                  let b_xpath;
                  let a_xpath;

                  let actLength = Activities.length;
                  if (
                    $("#" + ActivitiesBody)
                      .$("a*=Go to list")
                      .isExisting()
                  ) {
                    action.doClick($("#" + ActivitiesBody).$("a*=Go to list"));
                    Activities = $$(
                      ".bPageBlock.brandSecondaryBrd.secondaryPalette th:nth-child(2)"
                    );
                    b_xpath = "//a[normalize-space()='0";
                    a_xpath = "']";
                    intActCount = 1;
                  } else {
                    intActCount = 2;
                    b_xpath =
                      '//*[@id="' + ActivitiesBody + '"]/table/tbody/tr[';
                    a_xpath = "]/th/a";
                  }

                  // *********************   UI ********************************************
                  src.UILogin(clientData.BlueSteelURL, userName, password);
                  src.RewardsPage();
                  browser.switchWindow(clientData.SFUrl);

                  for (
                    let intCount = intActCount;
                    intCount <= Activities.length;
                    intCount++
                  ) {
                    try {
                      const rewardActivityNumber = action.doGetText(
                        $(b_xpath + intCount + a_xpath)
                      );

                      console.log("Activity Number : " + rewardActivityNumber);
                      action.doClick($("=" + rewardActivityNumber));
                      expect($(rofPage.CTA)).toExist();

                      let chkCopyTemp = $(
                        rofPage.checkboxCopyTemplate
                      ).getAttribute("title");

                      CTA = action.doGetText($(rofPage.CTA));

                      expect($(rofPage.RewardActivityID)).toExist();
                      RewardActivityID = action
                        .doGetText($(rofPage.RewardActivityID))
                        .split("\n")[0];
                      console.log(
                        "Reward Activity Id is : " + RewardActivityID
                      );
                      expect($(rofPage.CTAValue)).toExist();
                      CTAValue = action.doGetText($(rofPage.CTAValue));

                      // ***********************************************************Standard Sub-Activity IDS******************************************
                      // browser.setTimeout({ implicit: 2000 });
                      // let noSubActivities = $(
                      //   ".listRelatedObject .noRowsHeader"
                      // ).isExisting();
                      // console.log("Sub-Activities status: " + noSubActivities);
                      // if (noSubActivities) {
                      //   console.log("No Sub-Activities present in it");
                      // } else {
                      //   console.log("Sub-Activities available for this activity");
                      //   var Activitiesurl = browser.getUrl();
                      //   var subActivitiesBody =
                      //     Activitiesurl.split("/").pop() +
                      //     "_00N44000006azw2_body";
                      //   console.log(subActivitiesBody);
                      //   var subActivities = $$(
                      //     "#" + subActivitiesBody + " th:nth-child(2)"
                      //   );
                      //   if (subActivities.length > 5) {
                      //     action.doClick($("a*=Go to list"));
                      //     browser.setTimeout({ implicit: 5000 });
                      //     var subActivities = $$(
                      //       ".bPageBlock.brandSecondaryBrd.secondaryPalette th:nth-child(2)"
                      //     );
                      //     var sb_xpath =
                      //       "//div[@class='bPageBlock brandSecondaryBrd secondaryPalette']  //tr[";
                      //     var sa_xpath = "]/td[2]/a";
                      //   } else {
                      //     var sb_xpath =
                      //       '//*[@id="' +
                      //       subActivitiesBody +
                      //       '"]/table/tbody/tr[';
                      //     var sa_xpath = "]/td[2]/a";
                      //   }
                      //   for (let k = 2; k <= subActivities.length; k++) {
                      //     const StandardActivityid = action.doGetText(
                      //       $(sb_xpath + k + sa_xpath)
                      //     );

                      //     subActivitiesId.push(StandardActivityid);
                      //   }
                      //   console.log(subActivitiesId);
                      //   browser.back();
                      // }

                      // *******************************************************Validating the custom reward Activity id match & capturing values**********************************

                      console.log(
                        "If Reward activity id present in custom Activity returns true status : " +
                          ActivityName.includes(RewardActivityID)
                      );

                      if (ActivityName.includes(RewardActivityID)) {
                        console.log(
                          "Custom Reward Activity " + RewardActivityID
                        );
                        action.doClick($("=" + ImplementationName));
                        action.doClick($("*=Custom Reward Activities["));
                        var url = browser.getUrl();
                        var customActivitiesBody = url
                          .replace(/(.*)#/, "")
                          .replace("target", "body");

                        console.log(customActivitiesBody);

                        const customActivityNames = $$(
                          "#" + customActivitiesBody + " th:nth-child(2)"
                        );

                        if (customActivityNames.length > 5) {
                          action.doClick(
                            $("#" + customActivitiesBody).$("a*=Go to list")
                          );
                          browser.setTimeout({ implicit: 2000 });
                          let moreItems = $("=more").isExisting();
                          console.log(moreItems);
                          if (moreItems) {
                            $("=more").click();
                          }
                          action.doClick($("=" + RewardActivityID));
                        } else {
                          action.doClick($("=" + RewardActivityID));
                        }
                        RewardActivityID = action.doGetText(
                          $("//div[@id='Name_ileinner']")
                        );
                        CTA = action.doGetText(
                          $("div[id='00NE0000006KqBg_ileinner']")
                        );
                        CTAValue = action.doGetText(
                          $("div[id='00NE0000006KqBh_ileinner']")
                        );
                        console.log("Call to Action : " + CTA);
                        console.log("CTA Value : " + CTAValue);
                        console.log("Reward Activity Id : " + RewardActivityID);
                        browser.back();
                        action.doClick($("*=" + ImplementationName));
                        action.doWaitForElement(
                          $(rofPage.rewardPlanDesignsHeaderLink)
                        );
                        action.doClick($(rofPage.rewardPlanDesignsHeaderLink));
                        var url = browser.getUrl();
                        var RewardPlanDesignsBody = url
                          .replace(/(.*)#/, "")
                          .replace("target", "body");
                        var RewardPlanNames = $$(
                          "#" + RewardPlanDesignsBody + " th:nth-child(2)"
                        );
                        browser.setTimeout({ implicit: 2000 });
                        if (RewardPlanNames.length > 5) {
                          action.doClick(
                            $("#" + RewardPlanDesignsBody).$("a*=Show")
                          );
                        }
                        action.doClick($("=" + RewardPlanName));
                        action.doClick($("=" + rewardActivityNumber));

                        if (actLength > 1) {
                          if (!objectJson[key][arrCount][activities]) {
                            objectJson[key][arrCount][activities] = [];
                          }

                          objectJson[key][arrCount][activities].push({
                            [ctaAction]: CTA,
                            [ctaValue]: CTAValue,
                            [rewardActID]: RewardActivityID,
                          });
                        } else {
                          if (!objectJson[key][arrCount][activities]) {
                            objectJson[key][arrCount][activities] = {};
                          }

                          objectJson[key][arrCount][activities] = {
                            [ctaAction]: CTA,
                            [ctaValue]: CTAValue,
                            [rewardActID]: RewardActivityID,
                          };
                        }
                      } else {
                        console.log(
                          "No custom activity for : " + RewardActivityID
                        );

                        if (actLength > 1) {
                          if (!objectJson[key][arrCount][activities]) {
                            objectJson[key][arrCount][activities] = [];
                          }

                          objectJson[key][arrCount][activities].push({
                            [ctaAction]: CTA,
                            [ctaValue]: CTAValue,
                            [rewardActID]: RewardActivityID,
                            [chkCT]: chkCopyTemp,
                          });
                        } else {
                          if (!objectJson[key][arrCount][activities]) {
                            objectJson[key][arrCount][activities] = {};
                          }

                          objectJson[key][arrCount][activities] = {
                            [ctaAction]: CTA,
                            [ctaValue]: CTAValue,
                            [rewardActID]: RewardActivityID,
                            [chkCT]: chkCopyTemp,
                          };
                        }
                      }

                      // console.log("Call to Action : " + CTA);
                      // console.log("CTA Value : " + CTAValue);
                      // console.log("Reward Activity Id : " + RewardActivityID);
                      console.log(
                        "Copy Template Checkbox status is : " + chkCopyTemp
                      );

                      // let activities = "activities";
                      // let ctaAction = "ctaAction";
                      // let ctaValue = "ctaValue";
                      // let rewardActID = "rewardActID";
                      // let chkCT = "chkCT";

                      // if (actLength > 1) {
                      //   if (!objectJson[key][arrCount][activities]) {
                      //     objectJson[key][arrCount][activities] = [];
                      //   }

                      //   objectJson[key][arrCount][activities].push({
                      //     [ctaAction]: CTA,
                      //     [ctaValue]: CTAValue,
                      //     [rewardActID]: RewardActivityID,
                      //     [chkCT]: chkCopyTemp,
                      //   });
                      // } else {
                      //   if (!objectJson[key][arrCount][activities]) {
                      //     objectJson[key][arrCount][activities] = {};
                      //   }

                      //   objectJson[key][arrCount][activities] = {
                      //     [ctaAction]: CTA,
                      //     [ctaValue]: CTAValue,
                      //     [rewardActID]: RewardActivityID,
                      //     [chkCT]: chkCopyTemp,
                      //   };
                      // }

                      console.log(
                        "The new object is: " +
                          JSON.stringify(objectJson[key][activities])
                      );
                    } catch {
                      browser.takeScreenshot();
                      console.log("Selectors are not as per expectation");
                    }

                    if (actLength > 5) {
                      browser.back();
                    } else {
                      action.doClick($("=" + RewardPlanName));
                    }
                    browser.pause(20000);
                    browser.switchWindow(clientData.BSRewardPage);
                    if ($("a[data-testid='missing-reward']").isExisting()) {
                      action.doClick($("a[data-testid='missing-reward']"));
                    }
                    browser.takeScreenshot();
                    if (CTA === "Phone") {
                      var phoneNum = $(
                        "div[data-testid='" + RewardActivityID + "'] button"
                      ).getText();
                    } else if (CTA === "SSO") {
                      $(
                        "button[class='sc-dlnjPT cuIYFB column is-12-touch has-rds-mt-40 rds-primary-button is-white-labeled-btn is-flex'] span[class='has-rds-mr-8']"
                      ).click();
                      browser.switchWindow("Redirecting | Rally Health");
                      $("//a[@id='legal-redirect-link']").click();
                      browser.pause(5000);
                      var valUrl = browser.getUrl();
                      browser.url(clientData.BSRewardPage);
                    } else {
                      $(
                        "div[data-testid='" + RewardActivityID + "'] button"
                      ).click();
                      browser.pause(5000);
                      var valUrl = browser.getUrl();
                      browser.url(clientData.BSRewardPage);
                    }
                    try {
                      if (chkCopyTemp  !== "Not Checked") {
                        switch (CTA) {
                          case "Rally Internal Link":
                            let urlValue = ssoObjectJson[CTAValue];
                            console.log("Rally Internal Link is : " + urlValue);
                            assert.equal(
                              valUrl,
                              urlValue,
                              "Requirement mismatch"
                            );
                            break;
                          case "SSO":
                            let ssoUrlValue = ssoMapingObjectJson[CTAValue];
                            console.log(
                              "SSO to Quest link is : " + ssoUrlValue
                            );
                            assert.equal(
                              ssoUrlValue,
                              valUrl,
                              "Requirement Mismatch"
                            );
                            break;
                          case "Rally Internal Details Page":
                            expect(browser).toHaveUrlContaining(
                              RewardActivityID
                            );
                            break;
                          case "External URL":
                            assert.equal(
                              CTAValue,
                              valUrl,
                              "Requirement mismatch"
                            );
                            break;
                          case "Phone":
                            assert.equal(
                              CTAValue,
                              phoneNum,
                              "Requirement Mismatch"
                            );
                          default:
                            break;
                        }
                      } else {
                        switch (CTA) {
                          case "SSO":
                            let ssoUrlValue = ssoMapingObjectJson[CTAValue];
                            console.log(
                              "SSO to Quest link is : " + ssoUrlValue
                            );
                            assert.equal(
                              ssoUrlValue,
                              valUrl,
                              "Requirement Mismatch"
                            );
                            break;
                          case "External URL":
                            assert.equal(
                              CTAValue,
                              valUrl,
                              "Requirement mismatch"
                            );
                            break;
                          case "Phone":
                            assert.equal(
                              CTAValue,
                              phoneNum,
                              "Requirement Mismatch"
                            );
                          default:
                            break;
                        }
                      }
                    } catch (e1) {
                      browser.takeScreenshot();
                      console.log("CTA mismatch" + e1);
                      //browser.url(clientData.BSLogout);
                      handles = browser.getWindowHandles();
                      if (handles.length > 1) {
                        // browser.switchToWindow(handles[1]);
                        // browser.closeWindow();
                        browser.switchToWindow(handles[0]);
                      }
                      //browser.switchWindow(clientData.SFUrl);
                    }
                  }
                  browser.switchWindow(clientData.SFUrl);
                  //browser.url(clientData.BSLogout);
                  $(".account-bar-item--menu").moveTo();
                  action.doClick(
                    $(
                      "ac-account-menu-item[class='sc-ac-chrome hydrated'][data-ui-element-name='logout']"
                    )
                  );
                  handles = browser.getWindowHandles();
                  if (handles.length > 1) {
                    browser.switchToWindow(handles[1]);
                    browser.closeWindow();
                    browser.switchToWindow(handles[0]);
                  }
                  browser.pause(15000);
                  browser.switchWindow(clientData.SFUrl);
                  action.doClick($("=" + ImplementationName));
                }
              }
            } else {
              console.log("Client has no reward plan members");
            }
          } catch (exception) {
            //throw exception;
            browser.takeScreenshot();
            console.log(
              "Issue with Implementation and the error is " + exception
            );
            //browser.url(clientData.BSLogout);
            handles = browser.getWindowHandles();
            if (handles.length > 1) {
              browser.switchToWindow(handles[1]);
              browser.closeWindow();
              browser.switchToWindow(handles[0]);
            }
            throw exception;
            //browser.switchWindow(clientData.SFUrl);
          }
        });
      });
    }

    console.log(
      "The complete object is: " + JSON.stringify(objectJson, null, 4)
    );
    rallyUtil.writeToFile(outPath, objectJson);
  } catch (exception) {
    browser.takeScreenshot();
    console.log("Issue with required identifiers" + exception);
    //browser.url(clientData.BSLogout);
    handles = browser.getWindowHandles();
    if (handles.length > 1) {
      browser.switchToWindow(handles[1]);
      browser.closeWindow();
      browser.switchToWindow(handles[0]);
    }
    throw exception;
    //browser.switchWindow(clientData.SFUrl);
  }
});
