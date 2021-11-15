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
// const ssoObjectJson = require("../testdata/ssoInternalLinks.json");
// const ssoMapingObjectJson = require("../testdata/ssoMapping.json");
let ActivityName = [];
let RewardActivityID;
let CTAValue;
let CTA;

describe("Implementation", () => {
  try {
    const out = "./../testdata/expected/sso.json";
    const outPath = path.resolve(__dirname, out);
    let Json1 = fs.readFileSync(outPath);
    let objectJson = JSON.parse(Json1);
    console.log("Some value: " + objectJson);

    before(function () {
      rof.loginSalesforce(constants.username, constants.password);
    });
    it("SSO Validation", () => {
      for (let key in objectJson) {
        try {
          const ImplementationName =
            JSON.stringify(key).replace(/["]/g, "") +
            " - " +
            launchDate.launchDate;
          console.log(ImplementationName);
          action.doSetValue($(SFPage.search), ImplementationName);
          action.doClick($(SFPage.searchBtn));
          action.doClick($("=" + ImplementationName));
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
              action.doClick($("#" + customActivitiesBody).$("a*=Go to list"));
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
            $("div[class='ptBreadcrumb'] a").click();
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
                action.doWaitForElement($(rofPage.rewardPlanDesignsHeaderLink));
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
                let Activities = $$("#" + ActivitiesBody + " th:nth-child(2)");
                browser.setTimeout({ implicit: 2000 });
                let intActCount;
                let b_xpath;
                let a_xpath;

                let actLength = Activities.length;
                if (actLength > 5) {
                  action.doClick($("#" + ActivitiesBody).$("a*=Go to list"));
                  Activities = $$(
                    ".bPageBlock.brandSecondaryBrd.secondaryPalette th:nth-child(2)"
                  );
                  b_xpath = "//a[normalize-space()='0";
                  a_xpath = "']";
                  intActCount = 1;
                } else {
                  intActCount = 2;
                  b_xpath = '//*[@id="' + ActivitiesBody + '"]/table/tbody/tr[';
                  a_xpath = "]/th/a";
                }

                for (
                  let intCount = intActCount;
                  intCount <= Activities.length - 1;
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
                    RewardActivityID = action.doGetText(
                      $(rofPage.RewardActivityID)
                    );

                    expect($(rofPage.CTAValue)).toExist();
                    CTAValue = action.doGetText($(rofPage.CTAValue));

                    console.log(
                      "If Reward activity id present in custom Activity returns true status : " +
                      ActivityName.includes(RewardActivityID)
                    );

                    // *******************************************************Validating the custom reward Activity id match & capturing values**********************************

                    if (ActivityName.includes(RewardActivityID)) {
                      console.log("Custom Reward Activity " + RewardActivityID);
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
                      action.doWaitForElement($(rofPage.rewardPlanDesignsHeaderLink));
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
                      action.doClick($("=" + rewardActivityNumber));
                    }
                    else {
                      console.log("No custom activity for : " + RewardActivityID);
                    }

                    // switch (CTA) {
                    //   case "Rally Internal Link":
                    //     let urlValue = ssoObjectJson[CTAValue];
                    //     console.log("Rally Internal Link is : " + urlValue);
                    //     break;
                    //   case "SSO":
                    //     let ssoUrlValue = ssoMapingObjectJson[CTAValue];
                    //     console.log("SSO to Quest link is : " + ssoUrlValue);
                    //     break;
                    //   default:
                    //     break;
                    // }

                    console.log("Call to Action : " + CTA);
                    console.log("CTA Value : " + CTAValue);
                    console.log("Reward Activity Id : " + RewardActivityID);
                    console.log(
                      "Copy Template Checkbox status is : " + chkCopyTemp
                    );

                    const activities = "activities";
                    const ctaAction = "ctaAction";
                    const ctaValue = "ctaValue";
                    const rewardActID = "rewardActID";
                    const chkCT = "chkCT";

                    if (actLength > 1) {
                      if (!objectJson[key][activities]) {
                        objectJson[key][activities] = [];
                      }

                      objectJson[key][activities].push({
                        [ctaAction]: CTA,
                        [ctaValue]: CTAValue,
                        [rewardActID]: RewardActivityID,
                        [chkCT]: chkCopyTemp,
                      });
                    } else {
                      if (!objectJson[key][activities]) {
                        objectJson[key][activities] = {};
                      }

                      objectJson[key][activities] = {
                        [ctaAction]: CTA,
                        [ctaValue]: CTAValue,
                        [rewardActID]: RewardActivityID,
                        [chkCT]: chkCopyTemp,
                      };
                    }

                    console.log(
                      "The new object is: " +
                      JSON.stringify(objectJson[key][activities])
                    );
                  } catch {
                    console.log("Selectors are not as per expectation");
                  }

                  if (actLength > 5) {
                    browser.back();
                  } else {
                    action.doClick($("=" + RewardPlanName));
                  }
                }
                action.doClick($("*=Reward Plan Design:"));
                action.doClick($("=" + ImplementationName));
              }
            }
          }
          else {
            console.log("Client has no reward plan members");
          }
        } catch (exception) {
          console.log(
            "Issue with Implementation and the error is " + exception
          );
        }
      }
    });

    // rallyUtil.writeToFile(outPath, objectJson);
  } catch (exception) {
    throw exception;
  }
});
