sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel) {
    "use strict";
    var _btsdata;
    var btsdata = [];
    var created_by;
    var plantuser;
    var sUserId;
    var oFilter1;
    var statusValue;
    return Controller.extend("bts.bts.controller.Display_Table", {
      onInit: function () {
        var that = this; // Capture the reference to the controller instance

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

          var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZBTS_ODATA_SRV/");
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
        }

        this.getOwnerComponent()
          .getService("ShellUIService")
          .then(function (oShellService) {
            oShellService.setBackNavigation(function () {
              // Use 'that' instead of 'this' to refer to the controller instance
              that.OnBack();
            });
          });
        
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter
            .getRoute("display_table")
            .attachPatternMatched(this._onRouteMatched, this);


            

            

          
      },

      _onRouteMatched: function (oEvent) {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.totalPages = 0;
        var iSkip = (this.currentPage - 1) * this.itemsPerPage; // Calculate the number of records to skip
        console.log(iSkip);
        var that = this;
        var oModel = new sap.ui.model.odata.v2.ODataModel(
          "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
        );

        oModel.read("/ZbtsRepShSet", {
          success: function (data) {
            // var pdata = data.results;
            // var pdata = data.results.filter(item => item.BWKEY === plantuser );
            var pdata = data.results.filter(item => item.DRAFT_ID != '');
            // console.log(pdata);
            // console.log(pdata.length);
            // statusValue.setValue(pdata.length);
            statusValue = pdata.length;
          },
          error: function () {

          }
        });

        console.log('total number of data:',statusValue);

        // var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZBTS_ODATA_SRV/");
        //   var oFilter = new sap.ui.model.Filter("ZUSER", sap.ui.model.FilterOperator.EQ, created_by);
        //   oModel1.read("/ZplantuserShSet", {
        //     filters: [oFilter],
        //     success: function (oData) {
        //       console.log('PLANT:', oData);
        //       if (oData.results && oData.results.length > 0) {
        //         plantuser = oData.results[0].WERKS;  // Assuming you want the first result
        //         console.log("USER PLANT:", plantuser);
        //         tabledata();
        //       }
        //     }
        //   });


        // function tabledata(){
       
        var oFilter = new sap.ui.model.Filter("BTSID", sap.ui.model.FilterOperator.NE, "");
        // oFilter1 = new sap.ui.model.Filter("BWKEY", sap.ui.model.FilterOperator.EQ, plantuser);
        console.log('FIlter plant', oFilter1);
        that.getView().setModel(oModel);
        oModel.read("/ZbtsRepShSet", {
          filters: [oFilter],
          urlParameters: { //added for paging on 12.09.2024
            "$top": this.itemsPerPage.toString(), // Number of items per page
            "$skip": iSkip.toString() // Items to skip
          }, //till here added for paging on 12.09.2024
          success: function (data) {
            console.log(data);
            var BTSData = data.results;
            var oModelSearch = new JSONModel({
              btsdata: BTSData,
            });
            that.getView().setModel(oModelSearch, "btsdata");
            that.totalPages = Math.ceil(statusValue / that.itemsPerPage); //BTSData.length , data.__count
            
            var buttonNext = that.getView().byId("Next");
            buttonNext.setVisible(true);
            var buttonPrev = that.getView().byId("Previous");
            buttonPrev.setVisible(true);
            that.updateTableData(that);
          },
          error: function () {},
        });
        // }

        
      },

      onPurHelpRequest: function (oEvent) {
        var oInput = oEvent.getSource();
        var sInputId = oInput.getId();
        var PO = this.getView().byId("purchaseOrderInput").getValue();
        sap.ui.getCore().byId(sInputId).setValueState("None");

        // Invoke the value help function
        valueHelp();

        // Function to create and open the value help dialog
        function valueHelp() {
          // Create the value help dialog
          var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
            title: "Purchase Oder",
            supportMultiselect: false,
            supportRanges: false,
            key: "EBELN",
            // descriptionKey: "LIFNR",
            stretch: sap.ui.Device.system.phone,
            ok: function (oControlEvent) {
              var aTokens = oControlEvent.getParameter("tokens");
              console.log("Token: ", aTokens);

              if (aTokens.length > 0) {
                var oToken = aTokens[0];
                sap.ui.getCore().byId(sInputId).setValue(oToken.getKey());
                sap.ui.getCore().byId(sInputId).setValueState("None");

                // var t1 = oToken.mAggregations.customData[0].mProperties.value;

                // VendorCode.setValue(t1.LIFNR);
                // vendorName.setValue(t1.NAME1);
              }

              oDialog.close();
            },
            cancel: function () {
              oDialog.close();
            },
          });

          // Define the search help table columns and model
          var oColModel = new sap.ui.model.json.JSONModel({
            cols: [
              {
                label: "PO Number",
                template: "EBELN",
              },
            ],
          });

          oDialog.getTable().setModel(oColModel, "columns");

          // Define the OData model and bind the search help table to an entity set
          var oModel = new sap.ui.model.odata.v2.ODataModel(
            "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
          );
          var oTable = oDialog.getTable();
          oTable.setModel(oModel);

          oDialog.getTable().setModel(oModel);
          // var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
          // console.log('PO Filtered', oFilter);
          oDialog.getTable().bindAggregation("rows", {
            path: "/ZbtspurShSet",
          });

          // Open the value help dialog
          oDialog.open();
        }
      },

      onBtsHelpRequest: function (oEvent) {
        var oInput = oEvent.getSource();
        var sInputId = oInput.getId();
        sap.ui.getCore().byId(sInputId).setValueState("None");

        // Invoke the value help function
        valueHelp();

        // Function to create and open the value help dialog
        function valueHelp() {
          // Create the value help dialog
          var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
            title: "BTS ID",
            supportMultiselect: false,
            supportRanges: false,
            key: "BTS_ID",
            // descriptionKey: "LIFNR",
            stretch: sap.ui.Device.system.phone,
            ok: function (oControlEvent) {
              var aTokens = oControlEvent.getParameter("tokens");
              console.log("Token: ", aTokens);

              if (aTokens.length > 0) {
                var oToken = aTokens[0];
                sap.ui.getCore().byId(sInputId).setValue(oToken.getKey());
                sap.ui.getCore().byId(sInputId).setValueState("None");

                // var t1 = oToken.mAggregations.customData[0].mProperties.value;

                // VendorCode.setValue(t1.LIFNR);
                // vendorName.setValue(t1.NAME1);
              }

              oDialog.close();
            },
            cancel: function () {
              oDialog.close();
            },
          });

          // Define the search help table columns and model
          var oColModel = new sap.ui.model.json.JSONModel({
            cols: [
              {
                label: "BTS ID",
                template: "BTS_ID",
              },
            ],
          });

          oDialog.getTable().setModel(oColModel, "columns");

          // Define the OData model and bind the search help table to an entity set
          var oModel = new sap.ui.model.odata.v2.ODataModel(
            "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
          );
          var oTable = oDialog.getTable();
          oTable.setModel(oModel);

          oDialog.getTable().setModel(oModel);
          // var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
          // console.log('PO Filtered', oFilter);
          oDialog.getTable().bindAggregation("rows", {
            path: "/ZbtsidShSet",
          });

          // Open the value help dialog
          oDialog.open();
        }
      },

      onVenHelpRequest: function (oEvent) {
        var oInput = oEvent.getSource();
        var sInputId = oInput.getId();
        sap.ui.getCore().byId(sInputId).setValueState("None");

        // Invoke the value help function
        valueHelp();

        // Function to create and open the value help dialog
        function valueHelp() {
          // Create the value help dialog
          var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
            title: "Vendor Code",
            supportMultiselect: false,
            supportRanges: false,
            key: "LIFNR",
            // descriptionKey: "LIFNR",
            stretch: sap.ui.Device.system.phone,
            ok: function (oControlEvent) {
              var aTokens = oControlEvent.getParameter("tokens");
              console.log("Token: ", aTokens);

              if (aTokens.length > 0) {
                var oToken = aTokens[0];
                sap.ui.getCore().byId(sInputId).setValue(oToken.getKey());
                sap.ui.getCore().byId(sInputId).setValueState("None");

                // var t1 = oToken.mAggregations.customData[0].mProperties.value;

                // VendorCode.setValue(t1.LIFNR);
                // vendorName.setValue(t1.NAME1);
              }

              oDialog.close();
            },
            cancel: function () {
              oDialog.close();
            },
          });

          // Define the search help table columns and model
          var oColModel = new sap.ui.model.json.JSONModel({
            cols: [
              {
                label: "Vendor Code",
                template: "LIFNR",
              },
            ],
          });

          oDialog.getTable().setModel(oColModel, "columns");

          // Define the OData model and bind the search help table to an entity set
          var oModel = new sap.ui.model.odata.v2.ODataModel(
            "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
          );
          var oTable = oDialog.getTable();
          oTable.setModel(oModel);

          oDialog.getTable().setModel(oModel);
          // var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
          // console.log('PO Filtered', oFilter);
          oDialog.getTable().bindAggregation("rows", {
            path: "/ZbtsvenShSet",
          });

          // Open the value help dialog
          oDialog.open();
        }
      },

      
      onUserHelpRequest: function (oEvent) {
        var oInput = oEvent.getSource();
        var sInputId = oInput.getId();
        sap.ui.getCore().byId(sInputId).setValueState("None");

        // Invoke the value help function
        valueHelp();

        // Function to create and open the value help dialog
        function valueHelp() {
          // Create the value help dialog
          var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
            title: "User ID",
            supportMultiselect: false,
            supportRanges: false,
            key: "USER_ID",
            // descriptionKey: "LIFNR",
            stretch: sap.ui.Device.system.phone,
            ok: function (oControlEvent) {
              var aTokens = oControlEvent.getParameter("tokens");
              console.log("Token: ", aTokens);

              if (aTokens.length > 0) {
                var oToken = aTokens[0];
                sap.ui.getCore().byId(sInputId).setValue(oToken.getKey());
                sap.ui.getCore().byId(sInputId).setValueState("None");

                // var t1 = oToken.mAggregations.customData[0].mProperties.value;

                // VendorCode.setValue(t1.LIFNR);
                // vendorName.setValue(t1.NAME1);
              }

              oDialog.close();
            },
            cancel: function () {
              oDialog.close();
            },
          });

          // Define the search help table columns and model
          var oColModel = new sap.ui.model.json.JSONModel({
            cols: [
              {
                label: "User",
                template: "USER_ID",
              },
            ],
          });

          oDialog.getTable().setModel(oColModel, "columns");

          // Define the OData model and bind the search help table to an entity set
          var oModel = new sap.ui.model.odata.v2.ODataModel(
            "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
          );
          var oTable = oDialog.getTable();
          oTable.setModel(oModel);

          oDialog.getTable().setModel(oModel);
          // var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
          // console.log('PO Filtered', oFilter);
          oDialog.getTable().bindAggregation("rows", {
            path: "/ZbtsUserShSet",
          });

          // Open the value help dialog
          oDialog.open();
        }
      },

      onStatusHelpRequest: function (oEvent) {
        var oInput = oEvent.getSource();
        var sInputId = oInput.getId();
        sap.ui.getCore().byId(sInputId).setValueState("None");

        // Invoke the value help function
        valueHelp();

        // Function to create and open the value help dialog
        function valueHelp() {
          // Create the value help dialog
          var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
            title: "Status",
            supportMultiselect: false,
            supportRanges: false,
            key: "STATUS",
            // descriptionKey: "LIFNR",
            stretch: sap.ui.Device.system.phone,
            ok: function (oControlEvent) {
              var aTokens = oControlEvent.getParameter("tokens");
              console.log("Token: ", aTokens);

              if (aTokens.length > 0) {
                var oToken = aTokens[0];
                sap.ui.getCore().byId(sInputId).setValue(oToken.getKey());
                sap.ui.getCore().byId(sInputId).setValueState("None");

                // var t1 = oToken.mAggregations.customData[0].mProperties.value;

                // VendorCode.setValue(t1.LIFNR);
                // vendorName.setValue(t1.NAME1);
              }

              oDialog.close();
            },
            cancel: function () {
              oDialog.close();
            },
          });

          // Define the search help table columns and model
          var oColModel = new sap.ui.model.json.JSONModel({
            cols: [
              {
                label: "Status",
                template: "STATUS",
              },
            ],
          });

          oDialog.getTable().setModel(oColModel, "columns");

          // Define the OData model and bind the search help table to an entity set
          var oModel = new sap.ui.model.odata.v2.ODataModel(
            "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
          );
          var oTable = oDialog.getTable();
          oTable.setModel(oModel);

          oDialog.getTable().setModel(oModel);
          // var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
          // console.log('PO Filtered', oFilter);
          oDialog.getTable().bindAggregation("rows", {
            path: "/ZbtsstaShSet",
          });

          // Open the value help dialog
          oDialog.open();
        }
      },

      onBillingLocHelpRequest: function (oEvent) {
        var oInput = oEvent.getSource();
        var sInputId = oInput.getId();
        sap.ui.getCore().byId(sInputId).setValueState("None");

        // Invoke the value help function
        valueHelp();

        // Function to create and open the value help dialog
        function valueHelp() {
          // Create the value help dialog
          var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
            title: "Billing Location",
            supportMultiselect: false,
            supportRanges: false,
            key: "BaseLocation",
            // descriptionKey: "LIFNR",
            stretch: sap.ui.Device.system.phone,
            ok: function (oControlEvent) {
              var aTokens = oControlEvent.getParameter("tokens");
              console.log("Token: ", aTokens);

              if (aTokens.length > 0) {
                var oToken = aTokens[0];
                sap.ui.getCore().byId(sInputId).setValue(oToken.getKey());
                sap.ui.getCore().byId(sInputId).setValueState("None");

                // var t1 = oToken.mAggregations.customData[0].mProperties.value;

                // VendorCode.setValue(t1.LIFNR);
                // vendorName.setValue(t1.NAME1);
              }

              oDialog.close();
            },
            cancel: function () {
              oDialog.close();
            },
          });

          // Define the search help table columns and model
          var oColModel = new sap.ui.model.json.JSONModel({
            cols: [
              {
                label: "Billing Location",
                template: "BaseLocation",
              },
            ],
          });

          oDialog.getTable().setModel(oColModel, "columns");

          // Define the OData model and bind the search help table to an entity set
          var oModel = new sap.ui.model.odata.v2.ODataModel(
            "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
          );
          var oTable = oDialog.getTable();
          oTable.setModel(oModel);

          oDialog.getTable().setModel(oModel);
          // var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
          // console.log('PO Filtered', oFilter);
          oDialog.getTable().bindAggregation("rows", {
            path: "/ZbillLocShSet",
          });

          // Open the value help dialog
          oDialog.open();
        }
      },

      onNextPagePress: function () {
        var that = this;

        if (that.currentPage < that.totalPages) {
          that.currentPage++;
          that.updateTableData(that);
        }
      },

      onPreviousPagePress: function () {
        var that = this;
        if (that.currentPage > 1) {
          that.currentPage--;
          that.updateTableData(that);
        }
      },

      updateTableData: function (that) {
        // Calculate the skip value based on the current page
        var iSkip = (that.currentPage - 1) * that.itemsPerPage;
      
        // Fetch the data from OData service using $top and $skip for pagination
        var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZBTS_ODATA_SRV/");
        var oFilter = new sap.ui.model.Filter("BTSID", sap.ui.model.FilterOperator.NE, "");
        // Read the data from the OData service with pagination
        oModel.read("/ZbtsRepShSet", {
          filters: [oFilter], // Add your filters if any
          urlParameters: {
            "$top": that.itemsPerPage.toString(), // Number of records per page
            "$skip": iSkip.toString()             // Number of records to skip
          },
          success: function (data) {
            console.log("UPDATE TABLE", data.results);
            _btsdata = data.results;

            console.log("table after next", _btsdata);
      
            // Set the data to the table model
            var oTableModel = new sap.ui.model.json.JSONModel({
              btsdata: data.results,
            });
            var table = that.getView().byId("dataTable");
            table.setModel(oTableModel, "btsdata");
      
            // Update the buttons' enabled state
            that.getView().byId("Next").setEnabled(that.currentPage < that.totalPages);
            that.getView().byId("Previous").setEnabled(that.currentPage > 1);
      
            console.log("Total Page: ", that.totalPages);
          },
          error: function () {
            // Handle error
            console.error("Error fetching paginated data");
          }
        });
      },

      // updateTableData: function (that) {
      //   var table = that.getView().byId("dataTable");
      //   table.setVisible(true);
      //   var startIndex = (that.currentPage - 1) * that.itemsPerPage;
      //   var endIndex = startIndex + that.itemsPerPage;
      //   var btsData = that
      //     .getView()
      //     .getModel("btsdata")
      //     .getProperty("/btsdata")
      //     .slice(startIndex, endIndex);
      //   console.log("UPDATE TABLE", btsData);
      //   _btsdata = btsData;
      //   // Set the data to the table model
      //   var oTableModel = new sap.ui.model.json.JSONModel({
      //     btsdata: btsData,
      //   });
      //   table.setModel(oTableModel, "btsdata");

      //   console.log("Total Page: ", that.totalPages);
      //   that
      //     .getView()
      //     .byId("Next")
      //     .setEnabled(that.currentPage < that.totalPages);
      //   that
      //     .getView()
      //     .byId("Previous")
      //     .setEnabled(that.currentPage > 1);
      // },

      OnBack: function () {
        // Get the router instance
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        // Navigate to a new view using the router
        oRouter.navTo("RouteHome");
        location.reload();
      },

      OnRowPress: function (oEvent) {
        var that = this;
        // Get the selected row context
        var oContext = oEvent.getSource().getBindingContext("btsdata");
        var oRowData = oContext.getObject();

        var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZBTS_ODATA_SRV/");
        var oFilter = new sap.ui.model.Filter("BTSID", sap.ui.model.FilterOperator.EQ, oRowData.BTSID);
        // Read the data from the OData service with pagination
        oModel.read("/ZbtsRepShSet", {
          filters: [oFilter],
          success: function (data) {
            console.log("UPDATE TABLE", data.results);
            _btsdata = data.results;
            fetchrow();
          },
          error: function () {
            // Handle error
            console.error("Error fetching paginated data");
          }
        });

        function fetchrow() {
          
          // Get the data associated with the selected row
          var oRowData = oContext.getObject();
          console.log("bts data", _btsdata);

          var btsData = that.getView()
            .getModel("btsdata")
            .getProperty("/btsdata");
          console.log("UPDATE TABLE", btsData);
          // _btsdata = btsData;  //commented on 19.09.2024

          // Assuming _btsdata contains your JSON data
          var filteredData = _btsdata.filter(function (item) {
            // Define your filter condition here
            return item.BTSID === oRowData.BTSID && item.XBLNR === oRowData.XBLNR;
          });
          console.log(filteredData);

          var rowDataArray = {
            // ZAMT: encodeURIComponent(filteredData[0].ZAMT),
            // ZDATE: encodeURIComponent(filteredData[0].ZDATE),
            // EBELN: encodeURIComponent(filteredData[0].EBELN),
            BTSID: encodeURIComponent(filteredData[0].BTSID),
            // LIFNR: encodeURIComponent(filteredData[0].LIFNR),
            // EMAIL_ID: encodeURIComponent(filteredData[0].EMAIL_ID),
            // NAME1: encodeURIComponent(filteredData[0].NAME1),
            // PRCTR: encodeURIComponent(filteredData[0].PRCTR),
            // ZREMARK: encodeURIComponent(filteredData[0].ZREMARK),
            // ZTEXT: encodeURIComponent(filteredData[0].ZTEXT),
            // XBLNR: encodeURIComponent(filteredData[0].XBLNR),
            // DOKNR: encodeURIComponent(filteredData[0].DOKNR),
            // STATUS: encodeURIComponent(filteredData[0].STATUS),
          };

          console.log("Row Data:", rowDataArray);

          // Get the router instance
          var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
          // Navigate to a new view using the router and pass row data as a parameter
          
          // oRouter.navTo("display_report", {
          //   data: JSON.stringify(rowDataArray), // Pass the JSON string as a parameter
          // });


          oRouter.navTo("details", {
            data: JSON.stringify(rowDataArray), // Pass the JSON string as a parameter
          });

        }



      },

      // OnRowPress: function (oEvent) {
      //   // Get the selected row context
      //   var oContext = oEvent.getSource().getBindingContext("btsdata");

      //   // Get the data associated with the selected row
      //   var oRowData = oContext.getObject();
      //   console.log("bts data", _btsdata);

      //   var btsData = this.getView()
      //     .getModel("btsdata")
      //     .getProperty("/btsdata");
      //   console.log("UPDATE TABLE", btsData);
      //   // _btsdata = btsData;  //commented on 19.09.2024

      //   // Assuming _btsdata contains your JSON data
      //   var filteredData = _btsdata.filter(function (item) {
      //     // Define your filter condition here
      //     return item.BTSID === oRowData.BTSID && item.XBLNR === oRowData.XBLNR;
      //   });
      //   console.log(filteredData);

      //   var rowDataArray = {
      //     // ZAMT: encodeURIComponent(filteredData[0].ZAMT),
      //     // ZDATE: encodeURIComponent(filteredData[0].ZDATE),
      //     // EBELN: encodeURIComponent(filteredData[0].EBELN),
      //     BTSID: encodeURIComponent(filteredData[0].BTSID),
      //     // LIFNR: encodeURIComponent(filteredData[0].LIFNR),
      //     // EMAIL_ID: encodeURIComponent(filteredData[0].EMAIL_ID),
      //     // NAME1: encodeURIComponent(filteredData[0].NAME1),
      //     // PRCTR: encodeURIComponent(filteredData[0].PRCTR),
      //     // ZREMARK: encodeURIComponent(filteredData[0].ZREMARK),
      //     // ZTEXT: encodeURIComponent(filteredData[0].ZTEXT),
      //     // XBLNR: encodeURIComponent(filteredData[0].XBLNR),
      //     // DOKNR: encodeURIComponent(filteredData[0].DOKNR),
      //     // STATUS: encodeURIComponent(filteredData[0].STATUS),
      //   };

      //   console.log("Row Data:", rowDataArray);

      //   // Get the router instance
      //   var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      //   // Navigate to a new view using the router and pass row data as a parameter
      //   oRouter.navTo("display_report", {
      //     data: JSON.stringify(rowDataArray), // Pass the JSON string as a parameter
      //   });
      // },

      onFilterPress: function (oEvent) {
        var itemId = oEvent.getSource().getId();
      
        itemId = itemId.split("Display_Table--")[1];
        var oFilter;
        var oFilter1;

        // Check if the pressed item is "All"
        if (itemId.includes("_IDGenMenuItem4")) {
          this.currentPage = 1;
          this.itemsPerPage = 10;
          this.totalPages = 0;
          var that = this;
          oFilter = new sap.ui.model.Filter("BTSID",sap.ui.model.FilterOperator.NE, "");
          // oFilter1 = new sap.ui.model.Filter("BWKEY",sap.ui.model.FilterOperator.EQ, plantuser );
          var oModel = new sap.ui.model.odata.v2.ODataModel(
            "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
          );
          this.getView().setModel(oModel);
          oModel.read("/ZbtsRepShSet", {
            filters: [oFilter],
            success: function (data) {
              console.log(data);
              var BTSData = data.results;
              var oModelSearch = new JSONModel({
                btsdata: BTSData,
              });
              that.getView().setModel(oModelSearch, "btsdata");
              that.totalPages = Math.ceil(BTSData.length / that.itemsPerPage);
              var buttonNext = that.getView().byId("Next");
              buttonNext.setVisible(true);
              var buttonPrev = that.getView().byId("Previous");
              buttonPrev.setVisible(true);
              that.updateTableData(that);
            },
            error: function () {},
          });
        }

        var PO = this.getView().byId("purchaseOrderInput");
        var BTSID = this.getView().byId("BTSIDInput");
        var VC = this.getView().byId("vendorcodeInput");
        var STA = this.getView().byId("Statusinput");
        var DATE = this.getView().byId("DateField");
        var BILLLOC = this.getView().byId("Billinginput");
        var USER = this.getView().byId("UserInput");

        

        // Check if the pressed item is the "Purchase Order"
        if (itemId === "_IDGenMenuItem1") {
          this.getView().byId("inputPanel1").setVisible(true);
          var btsvalue = BTSID.setValue("");
          var povalue = PO.setValue("");
          var vcvalue = VC.setValue("");
          var statusvalue = STA.setValue("");
          var datevalue = DATE.setValue("");
          var billLocation = BILLLOC.setValue("");
          var uservalue = USER.setValue("");
        } else {
          this.getView().byId("inputPanel1").setVisible(false);
        }
        // Check if the pressed item is the "BTS ID"
        if (itemId === "_IDGenMenuItem2") {
          this.getView().byId("inputPanel2").setVisible(true);
          var btsvalue = BTSID.setValue("");
          var povalue = PO.setValue("");
          var vcvalue = VC.setValue("");
          var statusvalue = STA.setValue("");
          var datevalue = DATE.setValue("");
          var billLocation = BILLLOC.setValue("");
          var uservalue = USER.setValue("");
        } else {
          this.getView().byId("inputPanel2").setVisible(false);
        }

        // Check if the pressed item is the "Vendor Code"
        if (itemId === "_IDGenMenuItem6" ) {
          this.getView().byId("inputPanel5").setVisible(true);
          var btsvalue = BTSID.setValue("");
          var povalue = PO.setValue("");
          var vcvalue = VC.setValue("");
          var statusvalue = STA.setValue("");
          var datevalue = DATE.setValue("");
          var billLocation = BILLLOC.setValue("");
          var uservalue = USER.setValue("");
        } else {
          this.getView().byId("inputPanel5").setVisible(false);
        }
        // Check if the pressed item is the "Status"
        if (itemId === "_IDGenMenuItem8") {
          this.getView().byId("inputPanel7").setVisible(true);
          var btsvalue = BTSID.setValue("");
          var povalue = PO.setValue("");
          var vcvalue = VC.setValue("");
          var statusvalue = STA.setValue("");
          var datevalue = DATE.setValue("");
          var billLocation = BILLLOC.setValue("");
          var uservalue = USER.setValue("");
        } else {
          this.getView().byId("inputPanel7").setVisible(false);
        }
        // Check if the pressed item is the "Date"
        if (itemId === "_IDGenMenuItem9") {
          this.getView().byId("inputPanel9").setVisible(true);
          var btsvalue = BTSID.setValue("");
          var povalue = PO.setValue("");
          var vcvalue = VC.setValue("");
          var statusvalue = STA.setValue("");
          var datevalue = DATE.setValue("");
          var billLocation = BILLLOC.setValue("");
          var uservalue = USER.setValue("");
        } else {
          this.getView().byId("inputPanel9").setVisible(false);
        }
          // Check if the pressed item is the "Billing Location"
          if (itemId === "_IDGenMenuItem10") {
            this.getView().byId("inputPanel8").setVisible(true);

            var btsvalue = BTSID.setValue("");
            var povalue = PO.setValue("");
            var vcvalue = VC.setValue("");
            var statusvalue = STA.setValue("");
            var datevalue = DATE.setValue("");
            var billLocation = BILLLOC.setValue("");
            var uservalue = USER.setValue("");
          } else {
            this.getView().byId("inputPanel8").setVisible(false);
          }
          
           // Check if the pressed item is the "User"
           if (itemId === "_IDGenMenuItem11") {
            this.getView().byId("inputPanel10").setVisible(true);

            var btsvalue = BTSID.setValue("");
            var povalue = PO.setValue("");
            var vcvalue = VC.setValue("");
            var statusvalue = STA.setValue("");
            var datevalue = DATE.setValue("");
            var billLocation = BILLLOC.setValue("");
            var uservalue = USER.setValue("");
          } else {
            this.getView().byId("inputPanel10").setVisible(false);
          }
      },

      onInputSubmit: function (oEvent) {
        var that = this;
        var PO = this.getView().byId("purchaseOrderInput");
        var BTSID = this.getView().byId("BTSIDInput");
        var VC = this.getView().byId("vendorcodeInput");
        var STA = this.getView().byId("Statusinput");
        var DATE = this.getView().byId("DateField");
        var BILL = this.getView().byId("Billinginput");
        var USER = this.getView().byId('UserInput');

        var povalue = PO.getValue();
        var btsvalue = BTSID.getValue();
        var vcvalue = VC.getValue();
        var statusvalue = STA.getValue();
        var datevalue = DATE.getValue();
        var billLocation = BILL.getValue();
        var uservalue = USER.getValue();

        // Get the value of the input
        var sQuery = oEvent.getParameter("value");
        console.log("PO VALUE", povalue);
        console.log("BTS ID VALUE", btsvalue);
        console.log("VENDOR CODE VALUE", vcvalue);
        console.log("STATUS VALUE", statusvalue);
        console.log("DATE VALUE", datevalue);
        console.log("Billing Location", billLocation);
        console.log("User", uservalue);
        console.log(sQuery);
        console.log(typeof vcvalue, vcvalue); // Check type and value

        var oModel = new sap.ui.model.odata.v2.ODataModel(
          "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
        );

        // var oFilter1 = new sap.ui.model.Filter("BWKEY",sap.ui.model.FilterOperator.EQ, plantuser );
        oModel.read("/ZbtsRepShSet", {
          // filters: [oFilter1],
          success: function (data) {
            console.log(data);

            var BTSDataa = data.results;
            if (povalue != "") {
              var BTSData = BTSDataa.filter(function (items) {
                return items.EBELN === povalue && items.BTSID !== "";
              });
            }
            if (uservalue != "") {
              var BTSData = BTSDataa.filter(function (items) {
                return items.LAST_CHANGED_BY === uservalue && items.BTSID !== "";
              });
            }
            if (btsvalue !== "") {
              var BTSData = BTSDataa.filter(function (items) {
                return items.BTSID === btsvalue && items.BTSID !== "";
              });
            }
            if (vcvalue !== "") {
              var BTSData = BTSDataa.filter(function (items) {
                return items.LIFNR === vcvalue && items.BTSID !== "";
              });
              sQuery = vcvalue;
            }
            if (statusvalue !== "") {
              var BTSData = BTSDataa.filter(function (items) {
                return items.STATUS === statusvalue && items.BTSID !== "";
              });
            }

            if (billLocation !== "") {
              var BTSData = BTSDataa.filter(function (items) {
                return items.PRCTR === billLocation && items.BTSID !== "";
              });
            }

            if (datevalue !== "") {
              var BTSData = BTSDataa.filter(function (items) {
                const dateString = items.ZDATE;
                const date = new Date(dateString);
                const day = date.getDate().toString().padStart(2, "0");
                const month = (date.getMonth() + 1).toString().padStart(2, "0");
                const year = date.getFullYear();
                const formattedDate = `${day}.${month}.${year}`;
                console.log(formattedDate);
                return formattedDate === datevalue && items.BTS_ID !== "";
              });
            }

            console.log("Filtered Data:", BTSData);

            //bind data to the table
            var table = that.getView().byId("dataTable");
            if (table) {
              console.log("Table found");
              var oTableModel = new sap.ui.model.json.JSONModel({
                btsdata: BTSData,
              });
              console.log("BTS Data:", btsdata);
              table.setModel(oTableModel, "btsdata");
            } else {
              console.error("Table not found or undefined");
            }

            // PO.setValue("");
            // BTSID.setValue("");
            // VC.setValue("");
            // STA.setValue("");

            var buttonNext = that.getView().byId("Next");
            buttonNext.setVisible(false);
            var buttonPrev = that.getView().byId("Previous");
            buttonPrev.setVisible(false);
          },
          error: function () {
            // Handle errors, e.g., display an error message
          },
        });
      },
    });
  }
);
