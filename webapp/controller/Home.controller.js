sap.ui.define(
  ["sap/ui/core/mvc/Controller"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller) {
    "use strict";
    var plantuser;
    var sUserId;
    var created_by;

    return Controller.extend("bts.controller.Home", {
      onInit: function () {

        //just for graph

        // var statusCounts = {}; // Object to store status counts
        // var statusJson = [];

        // var oChart = this.getView().byId("idpiechart");
        // var vizPopover = new sap.viz.ui5.controls.Popover({});

        // // Connect the popover to the VizFrame
        // vizPopover.connect(oChart.getVizUid());

        // // Assuming oModel is your ODataModel and "EntitySet" is the name of your entity set
        // var oModel = new sap.ui.model.odata.v2.ODataModel(
        //   "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
        // );
        // // Assuming oModel is your ODataModel
        // oModel.read("/ZbtsRepShSet", {
        //   success: function (oData, response) {
        //     var statusCounts = {}; // Object to store status counts

        //     oData.results.forEach(function (item) {
        //       var status = item.STATUS; // Assuming "STATUS" is the property containing status information
        //       var prctr = item.PRCTR; // Assuming "PRCTR" is the property containing PRCTR information

        //       if (status === "PENDING") { // Filter for PENDING status
        //         if (!statusCounts[prctr]) {
        //           statusCounts[prctr] = 0;
        //         }
        //         statusCounts[prctr]++; // Increment count for the current PRCTR
        //       }
        //     });

        //     var statusJson = []; // JSON array to store status counts
        //     Object.keys(statusCounts).forEach(function (prctr) {
        //       statusJson.push({
        //         PRCTR: prctr, // Group by PRCTR
        //         Count: statusCounts[prctr]
        //       });
        //     });
        //     console.log(statusJson);

        //     // Create a JSON model and set the status counts as its data
        //     var oStatusModel = new sap.ui.model.json.JSONModel();
        //     oStatusModel.setData({ Items: statusJson });

        //     // Assuming that this is a controller method and this.getView() returns the view instance
        //     this.getView().setModel(oStatusModel, "StatusModel");
        //   }.bind(this),
        //   error: function (oError) {
        //     console.error("Error fetching data:", oError);
        //   }
        // });


        // var oIceCreamModel = new sap.ui.model.json.JSONModel();
        // oIceCreamModel.setData(statusJson);
        // this.getView().setModel(oIceCreamModel, "IceCreamModel");





        //till here for graph


        if (
          sap.ushell &&
          sap.ushell.Container &&
          sap.ushell.Container.getUser
        ) {
          // Get the user ID
          var oUser = sap.ushell.Container.getUser();
          sUserId = oUser.getId();
          // var sUserId = "FIORI_TEST1";
          console.log("user id", sUserId);

          created_by = sUserId;
          console.log("Created By:", created_by);


          var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZBTS_ODATA_SRV/");
          var oFilter = new sap.ui.model.Filter("BNAME", sap.ui.model.FilterOperator.EQ, sUserId);
          oModel1.read("/ZeicShSet", {
            filters: [oFilter],
            success: function (oData) {
              console.log('User id and Email:', oData);
              if (oData.results && oData.results.length > 0) {
                created_mail = oData.results[0].SMTP_ADDR;  // Assuming you want the first result
                console.log("Created Email:", created_mail);
              }
            }
          });
        }

        // var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZBTS_ODATA_SRV/");
        // var oFilter = new sap.ui.model.Filter("ZUSER", sap.ui.model.FilterOperator.EQ, created_by);
        // oModel1.read("/ZplantuserShSet", {
        //   filters: [oFilter],
        //   success: function (oData) {
        //     console.log('PLANT:', oData);
        //     if (oData.results && oData.results.length > 0) {
        //       plantuser = oData.results[0].WERKS;  // Assuming you want the first result
        //       console.log("USER PLANT:", plantuser);
        //     }
        //   }
        // });

        var statusValue = this.getView().byId("_IDGenNumericContent1");
        var draftValue = this.getView().byId("_IDGenNumericContent2");

        var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZBTS_ODATA_SRV/");
        this.getView().setModel(oModel);
        // oModel.read("/ZbtsDidShSet", {
        //   success: function (data) {
        //     var ddata = data.results;
        //     // var oFilter = new sap.ui.model.Filter("PLANT", sap.ui.model.FilterOperator.EQ, plantuser);
        //     // var ddata = data.results.filter(item => item.DRAFT_ID === '');
        //     // var ddata = data.results.filter(item => item.PLANT === plantuser );
        //     // console.log(pdata);
        //     // console.log(pdata.length);
        //     // statusValue.setValue(pdata.length);
        //     draftValue.setValue(ddata.length);

        //   },
        //   error: function () {

        //   }
        // });

        oModel.read("/ZbtsDidShSet/$count", {
          success: function (count) {
            draftValue.setValue(count); // Directly set the count value
          },
          error: function () {
            console.error("Error fetching count.");
          }
        });

        oModel.read("/ZbtsRepShSet/$count", {
          success: function (count) {
            statusValue.setValue(count); // Directly set the count value
          },
          error: function () {
            console.error("Error fetching count.");
          }
        });

        // oModel.read("/ZbtsRepShSet", {
        //   success: function (data) {
        //     // var pdata = data.results;
        //     // var pdata = data.results.filter(item => item.BWKEY === plantuser );
        //     var pdata = data.results.filter(item => item.DRAFT_ID != '');
        //     // console.log(pdata);
        //     // console.log(pdata.length);
        //     // statusValue.setValue(pdata.length);
        //     statusValue.setValue(pdata.length);

        //   },
        //   error: function () {

        //   }
        // });

      },


      Createpress: function () {
        // Get the router instance
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        // Navigate to a new view using the router
        oRouter.navTo("create");
      },

      Displaypress: function () {
        // Get the router instance
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        // Navigate to a new view using the router
        oRouter.navTo("display_table");
      },

      Editpress: function () {
        // Get the router instance
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        // Navigate to a new view using the router
        oRouter.navTo("edit");
      },
    });
  }
);
