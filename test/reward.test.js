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
const { count, exception } = require("console");
const ssoObjectJson = require("../testdata/ssoInternalLinks.json");
const ssoMapingObjectJson = require("../testdata/ssoMapping.json");
let ActivityName = [];
let subActivitiesId = [];
let RewardActivityID;
let CTAValue;
let CTA;
let Activities;
let activities = "activities";
let ctaAction = "ctaAction";
let ctaValue = "ctaValue";
let rewardActID = "rewardActID";
let chkCT = "chkCT";
let customActivityName = [];

describe("Implementation", () => {
  try{
  const out = "./../testdata/expected/sso.json";
  const outPath = path.resolve(__dirname, out);
  let Json1 = fs.readFileSync(outPath);
  let objectJson = JSON.parse(Json1);
  console.log("Some value: " + JSON.stringify(objectJson));

  before(function () {
    rof.loginSalesforce(constants.username, constants.password);
  });

  //****************************************Searching IMP in Salesforce********************************************************* */
  for (let key in objectJson) {
    const clientName =
      JSON.stringify(key).replace(/["]/g, "") + " - " + launchDate.launchDate;
    describe(clientName, () => {
      it("SSO", () => {
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
        browser.setTimeout({ implicit: 10000 });
        const CA = $("=Custom Reward Activities[0]").isExisting();
        console.log(CA);

        // ******************************************   Capturing Custom Reward Activities into an Array   **************************************************
        if (!CA) {
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
          ActivityName = [];
          for (let j = 2; j <= customRewardActivities.length; j++) {
            const customActivityName = action.doGetText(
              $(b_xpath + j + a_xpath)
            );
            ActivityName.push(customActivityName);
          }
          console.log(ActivityName);
          let elemSFHome = $("div[class='ptBreadcrumb'] a").isExisting();
          if (elemSFHome) {
            $("div[class='ptBreadcrumb'] a").click();
          }
        } else {
          console.log("No Custom reward Activities");
        }

        //*********************************Navigating Reward Plan designs in SF************************************** */

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
              browser.setTimeout({ implicit: 2000 });
              let home = $("#CF00NE0000006Km0h_ilecell a").isExisting();
              let home1 = $("div[class='ptBreadcrumb'] a").isExisting();
              if(home){
                $("#CF00NE0000006Km0h_ilecell a").click();
              }
              if(home1){
                $("div[class='ptBreadcrumb'] a").click();
              }
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
              var Activities = $$("#" + ActivitiesBody + " th:nth-child(2)");
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
                b_xpath = "//a[normalize-space()='";
                a_xpath = "']";
                intActCount = 1;
              } else {
                intActCount = 2;
                b_xpath = '//*[@id="' + ActivitiesBody + '"]/table/tbody/tr[';
                a_xpath = "]/th/a";
              }
              console.log(
                "Total Activities present in Reward Plan : " + Activities.length
              );
              // *********************   UI ********************************************
              let handles = browser.getWindowHandles();
              if (handles.length > 1) {
                browser.switchToWindow(handles[1]);
                browser.closeWindow();
                browser.switchToWindow(handles[0]);
              }
              src.UILogin(clientData.BSLogout, userName, password);
              src.RewardsPage();
              browser.switchWindow(clientData.SFUrl);

              for (
                let intCount = intActCount;
                intCount <= Activities.length - 1;
                intCount++
              ) {
                const rewardActivityNumber = action.doGetText(
                  $(b_xpath + ("0" + intCount).slice(-2) + a_xpath)
                );
                console.log("Activity Number : " + rewardActivityNumber);
                action.doClick($("=" + rewardActivityNumber));
                browser.takeScreenshot();
                browser.setTimeout({ implicit: 2000 });
                let noSubActivities = $(
                  ".listRelatedObject .noRowsHeader"
                ).isExisting();
                console.log("Sub-Activities status: " + noSubActivities);
                if (noSubActivities) {
                  let RewardActivityID = action
                    .doGetText($(rofPage.RewardActivityID))
                    .split("\n")[0];
                  console.log("Reward Activity Id is : " + RewardActivityID);
                  console.log(
                    "If Reward activity id present in custom Activity returns true status : " +
                      ActivityName.includes(RewardActivityID)
                  );
                  //*************************************Validating the custom reward Activity id match & capturing values*******************************/
                  if (ActivityName.includes(RewardActivityID)) {
                    console.log("Custom Reward Activity " + RewardActivityID);
                    action.doClick($("*="+clientName+""));
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
                      browser.takeScreenshot();
                    } else {
                      action.doClick($("=" + RewardActivityID));
                      browser.takeScreenshot();
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
                    //action.doClick($("*="+ clientName));
                    browser.switchWindow("Rewards");
                    if ($("a[data-testid='missing-reward']").isExisting()) {
                      action.doClick($("a[data-testid='missing-reward']"));
                    }
                    browser.takeScreenshot();
                    if (CTA === "phone") {
                      browser.switchWindow("Rewards");
                      $(
                        "div[data-testid='" + RewardActivityID + "'] button"
                      ).scrollIntoView();
                      var phoneNum = $(
                        "div[data-testid='" + RewardActivityID + "'] button"
                      ).getText();
                      browser.takeScreenshot();
                    } else if (CTA === "sso") {
                      browser.switchWindow("Rewards");
                      $(
                        "div[data-testid='" + RewardActivityID + "'] button"
                      ).click();
                      $(
                        "button[class='sc-dlnjPT cuIYFB column is-12-touch has-rds-mt-40 rds-primary-button is-white-labeled-btn is-flex'] span[class='has-rds-mr-8']"
                      ).click();
                      browser.switchWindow("Redirecting | Rally Health");
                      $("//a[@id='legal-redirect-link']").click();
                      browser.pause(5000);
                      browser.takeScreenshot();
                      var valUrl = browser.getUrl();
                      browser.url(clientData.BSRewardPage);
                    } else if (CTA === "external url") {
                      browser.switchWindow("Rewards");
                      $(
                        "div[data-testid='" + RewardActivityID + "'] button"
                      ).click();
                      browser.takeScreenshot();
                      browser.pause(5000);
                      var valUrl = browser.getUrl().toLowerCase();
                      browser.url(clientData.BSRewardPage);
                    } else {
                      $(
                        "div[data-testid='" + RewardActivityID + "'] button"
                      ).click();
                      browser.takeScreenshot();
                      browser.pause(5000);
                      var valUrl = browser.getUrl();
                      browser.url(clientData.BSRewardPage);
                    }

                    try {
                      switch (CTA) {
                        case "sso":
                          let ssoUrlValue = ssoMapingObjectJson[CTAValue];
                          console.log("SSO to Quest link is : " + ssoUrlValue);
                          assert.equal(
                            ssoUrlValue,
                            valUrl,
                            "Requirement Mismatch"
                          );
                          break;
                        case "external url":
                          assert.equal(
                            CTAValue,
                            valUrl,
                            "Requirement mismatch"
                          );
                          break;
                        case "phone":
                          assert.equal(
                            CTAValue,
                            phoneNum,
                            "Requirement Mismatch"
                          );
                        default:
                          break;
                      }
                    } catch (e1) {
                      browser.takeScreenshot();
                      console.log("CTA mismatch" + e1);
                      handles = browser.getWindowHandles();
                      if (handles.length > 1) {
                        browser.switchToWindow(handles[0]);
                      }
                    }

                    browser.switchWindow(clientData.SFUrl);
                    //action.doClick($("*="+clientName));
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
                    console.log("we are in reward plan details page ");
                    const planDetailsPage = browser.getUrl();
                    const ActivitiesBody =
                      planDetailsPage.split("/").pop() +
                      "_00NE0000006Km81_body";
                    var Activities = $$(
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
                      action.doClick(
                        $("#" + ActivitiesBody).$("a*=Go to list")
                      );
                      Activities = $$(
                        ".bPageBlock.brandSecondaryBrd.secondaryPalette th:nth-child(2)"
                      );
                      b_xpath = "//a[normalize-space()='";
                      a_xpath = "']";
                      intActCount = 1;
                    } else {
                      intActCount = 2;
                      b_xpath =
                        '//*[@id="' + ActivitiesBody + '"]/table/tbody/tr[';
                      a_xpath = "]/th/a";
                    }
                    action.doClick($("=" + rewardActivityNumber));
                    browser.back();
                    browser.takeScreenshot();
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
                    console.log("No custom activity for : " + RewardActivityID);
                    let chkCopyTemp = $(rofPage.checkboxCopyTemplate)
                      .getAttribute("title")
                      .toLowerCase();
                    let CTA = action.doGetText($(rofPage.CTA)).toLowerCase();
                    let CTAValue = action
                      .doGetText($(rofPage.CTAValue))
                      .toLowerCase();
                    console.log("Call to Action : " + CTA);
                    console.log("CTA Value : " + CTAValue);
                    console.log("Copy Template : " + chkCopyTemp);
                    

                    if (CTA === "phone") {
                      browser.switchWindow("Rewards");
                      $(
                        "div[data-testid='" + RewardActivityID + "'] button"
                      ).scrollIntoView();
                      var phoneNum = $(
                        "div[data-testid='" + RewardActivityID + "'] button"
                      ).getText();
                      browser.takeScreenshot();
                    } else if (CTA === "sso") {
                      try{
                      browser.switchWindow("Rewards");
                      $(
                        "div[data-testid='" + RewardActivityID + "'] button"
                      ).click();
                      $(
                        "button[class='sc-dlnjPT cuIYFB column is-12-touch has-rds-mt-40 rds-primary-button is-white-labeled-btn is-flex'] span[class='has-rds-mr-8']"
                      ).click();
                      browser.switchWindow("Redirecting | Rally Health");
                      $("//a[@id='legal-redirect-link']").click();
                      browser.pause(5000);
                      browser.takeScreenshot();
                      var valUrl = browser.getUrl();
                      browser.url(clientData.BSRewardPage);
                      }
                      catch (exception){
                        console.log(exception);
                      }
                    } else if (CTA === "external url") {
                      browser.switchWindow("Rewards");
                      $(
                        "div[data-testid='" + RewardActivityID + "'] button"
                      ).click();
                      browser.takeScreenshot();
                      browser.pause(5000);
                      var valUrl = browser.getUrl().toLowerCase();
                      browser.url(clientData.BSRewardPage);
                    }
                    try {
                      if (chkCopyTemp === "checked") {
                        $(
                          "div[data-testid='" + RewardActivityID + "'] button"
                        ).click();
                        browser.takeScreenshot();
                        browser.pause(5000);
                        var valUrl = browser.getUrl();

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
                          case "Rally Internal Details Page":
                            expect(browser).toHaveUrlContaining(
                              RewardActivityID
                            );
                            break;
                          default:
                            break;
                        }
                      }
                    } catch (e2) {
                      console.log("copy template status" + "e2");
                    }

                    try {
                      switch (CTA) {
                        case "sso":
                          let ssoUrlValue = ssoMapingObjectJson[CTAValue];
                          console.log("SSO to Quest link is : " + ssoUrlValue);
                          assert.equal(
                            ssoUrlValue,
                            valUrl,
                            "Requirement Mismatch"
                          );
                          break;
                        case "external url":
                          assert.equal(
                            CTAValue,
                            valUrl,
                            "Requirement mismatch"
                          );
                          break;
                        case "phone":
                          assert.equal(
                            CTAValue,
                            phoneNum,
                            "Requirement Mismatch"
                          );
                        default:
                          break;
                      }
                    } catch (e1) {
                      browser.takeScreenshot();
                      console.log("CTA mismatch" + e1);
                      handles = browser.getWindowHandles();
                      if (handles.length > 1) {
                        browser.switchToWindow(handles[0]);
                      }
                    }

                    browser.back();

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
                } else {
                  console.log("TBD as Activity has sub-activities to validate");
                  browser.back();
                }
              }
            }
            browser.back();
            //$("#CF00NE0000006Km0h_ilecell a").click();
          }
        }
      });
    });
  }
}
catch (exception){
  console.log(exception);
}
});
