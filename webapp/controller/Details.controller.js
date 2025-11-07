sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageBox", "sap/m/Token"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageBox, Token) {
    "use strict";
    var rootValue;
    var rowDataArray = [];
    let filterdata = [];
    var BTSData;
    var that = this; // Capture the correct 'this' context
    var btsvalue;
    var povalue;
    var AmountValue;
    var formattedDate;
    var isoTime;
    var formattedDate1;
    var sUserId;
    var created_on;
    var created_by;
    var currentDate;
    var VendorCodeValue;
    var VendorNameValue;
    var EmailValue;
    var ProfitValue;
    var TextValue;
    var RemarkValue;
    var PlantValue;
    var filevalue;
    var InvtableData = [];
    var GrntableData = [];
    var SestableData = [];
    var csrfToken;
    var vval;
    var val;
    var draftValue;
    let sesItem;
    let invItem;
    let grnItem;
    var status1;
    var custom;
    var checkbox;
    var data_created;
    var GeMPro1;
    var gemflag;
    var imp = true;
    var grnval = true;
    var sesval = true;
    var AdvPay;
    var gemInvValue;
    var filesUpload = [];
    var attchment;
    var GR_PO = true;
    var SES_PO = true;
    var checkBox = true;
    var checkGRNSESVal;
    var checkValue;

    return Controller.extend("bts.controller.Display_Report", {
      onInit: function () {
        // sap.ui.core.BusyIndicator.show();
        var that = this; // Capture the reference to the controller instance

        //////////////////////////getting the value of PO and Vendor Code//////////////////////////////////////

        var oModel = new sap.ui.model.odata.v2.ODataModel(
          "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
        );
        // oModel.read("/ZbtspoShSet", {
        //   success: function (oData) {
        //     sap.ui.core.BusyIndicator.hide();
        //     console.log(" PO Entities fetched successfully:", oData.results);
        //     that.ZbtspoShSet = oData.results;
        //   },
        //   error: function () {
        //     // Handle error
        //     console.log("Error in fetching entities");
        //   },
        // });

        /////////////////////////this is for getting the profit center/////////////////////////
        var oModelProf = new sap.ui.model.odata.v2.ODataModel(
          "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
        );

        oModelProf.read("/ZpridShSet", {
          success: function (oData) {
            console.log(" Profit Center Entities fetched successfully:", oData);
            that.ProfitCenter = oData.results;
          },
          error: function () {
            // Handle error
            console.log("Error in fetching entities");
          },
        });

        ////////////////////////this is for getting the grn values///////////////////////////////////
        var oModelGrn = new sap.ui.model.odata.v2.ODataModel(
          "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
        );

        oModelGrn.read("/ZbtsgrnShSet", {
          success: function (oData) {
            // Handle success
            console.log(" GRN Entities fetched successfully:", oData);
            that.GRNEntities = oData.results;
          },
          error: function () {
            // Handle error
            console.log("Error in fetching entities");
          },
        });

        /////////////////////////////////THIS IS FOR GETTING THE SES DATA///////////////////////////////////
        oModel.read("/ZbtssesShSet", {
          success: function (oData) {
            // Handle success
            console.log(" SES Entities fetched successfully:", oData);
            that.SESEntities = oData.results;
          },
          error: function () {
            // Handle error
            console.log("Error in fetching entities");
          },
        });

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
        //   .getRoute("display_report")
          .getRoute("details")
          .attachPatternMatched(this._onRouteMatched, this);

        var oModel = new sap.ui.model.json.JSONModel({
          maxDate: new Date(),
          minDate: new Date(),
        });

        this.getView().setModel(oModel, "dateModel");

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

          currentDate = new Date();
          var year1 = currentDate.getFullYear();
          var month1 = ('0' + (currentDate.getMonth() + 1)).slice(-2);
          var day1 = ('0' + currentDate.getDate()).slice(-2);
          var hours = ('0' + currentDate.getHours()).slice(-2);
          var minutes = ('0' + currentDate.getMinutes()).slice(-2);
          var seconds = ('0' + currentDate.getSeconds()).slice(-2);

          isoTime = `PT${hours}H${minutes}M${seconds}S`;

          console.log(isoTime);


          formattedDate1 = year1 + '-' + month1 + '-' + day1 + 'T00:00:00';

          created_on = formattedDate1;
          created_by = sUserId;

          console.log("Created On:", created_on);
          console.log("Created By:", created_by);
        }
      },

      _onRouteMatched: function (oEvent) {
        var that = this;

        var valdata;
        var valdata1;
        var oArgs = oEvent.getParameter("arguments");
        var sData = oArgs.data;
        console.log(sData);
        var oData = JSON.parse(sData);
        var oModel = new sap.ui.model.json.JSONModel(oData);
        this.getView().setModel(oModel, "report");

        console.log(oData);
        // rootValue = oData;

        var BtsNo = this.getView().byId("BTSCode");
        BtsNo.setValue(oData.BTSID);
        console.log(oData.BTSID);

        var BTSID = oData.BTSID;
        // var XBLNR = decodeURIComponent(oData.XBLNR);
        console.log("BTS ID", BTSID);
        // console.log("XBLNR:", XBLNR);

        var VendorCode = this.getView().byId("VendorCode");
        var name1 = this.getView().byId("vendorName");
        var PO = this.getView().byId("PO");
        var Amount = this.getView().byId("Amount");
        // var Currency = this.getView().byId("Currency");
        var DateField = this.getView().byId("DateField");
        var ProfitCenter = this.getView().byId("Profit");
        var Emailid = this.getView().byId("Email");
        var Text = this.getView().byId("Text");
        var Remarks = this.getView().byId("Remarks");
        var Plant = this.getView().byId("Plant");
        var DocNo = this.getView().byId("attach");
        var GRN = this.getView().byId("GRN");
        var SES = this.getView().byId("SES");
        var INV = this.getView().byId("Invoice");
        var VM = that.getView().byId('vendorEmail');
        var VP = that.getView().byId('vendorPhno');
        var advpay = that.getView().byId('paymentMethodSelect');
        var InvDoc = that.getView().byId('InvDocNo');
        var GeMNo = this.getView().byId("GemInvNo"); //uncomment for GeM
        var GeMPro = this.getView().byId("GeM_Procurement"); //uncomment for GeM
        var checkGRNSES = this.getView().byId("VendorActive");
        var advpay1;
        // var check = this.getView().byId("acceptTermsCheckbox");


        var oModel1 = new sap.ui.model.odata.v2.ODataModel(
          "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
        );
        var oFilters = new sap.ui.model.Filter("BTS_ID", sap.ui.model.FilterOperator.EQ, BTSID);

        oModel1.read("/ZBTS_CRTSet", {
          filters: [oFilters],
          success: function (data) {
            valdata = data.results.filter(function (item) {
              return item.BTS_ID === BTSID && item.DOKNR != '';
            });
            console.log("Filtered Table Data:", valdata);
            rootValue = valdata; //03.09.2024
            console.log("Root Value:", rootValue);
            VendorCode.setValue(valdata[0].LIFNR);
            name1.setValue(valdata[0].NAME1);
            PO.setValue(valdata[0].EBELN);
            Amount.setValue(valdata[0].ZAMT);
            INV.setValue(valdata[0].XBLNR);

            //SOC added for GeM //uncomment for GeM
            GeMPro1 = valdata[0].GEM_INV_NO_FLAG;
            if (GeMPro1 === 'Yes') {
              gemflag = "Yes";
              GeMPro.setSelectedKey("Yes");
              GeMNo.setVisible(true);
              GeMNo.setValue(valdata[0].GEM_INV_NO);
            } else if (GeMPro1 === 'No') {
              gemflag = "No";
              GeMPro.setSelectedKey("No");
              GeMNo.setVisible(false);
            } else {
              gemflag = " ";
              GeMPro.setSelectedKey(" ");
              GeMNo.setVisible(false);
            }
            //EOC for GeM

            // Given date string
            var dateString = decodeURIComponent(valdata[0].ZDATE);

            // Create a Date object from the given string
            var date = new Date(dateString);

            // Extract year, month, and day components
            var year = date.getFullYear();
            var month = ("0" + (date.getMonth() + 1)).slice(-2); // Adding 1 because month index starts from 0
            var day = ("0" + date.getDate()).slice(-2);

            // Construct the formatted date string in "YYYY-MM-DD" format
            var formattedDate = year + "-" + month + "-" + day;

            console.log(formattedDate); // Output: "2024-03-07"
            DateField.setValue(formattedDate);
            ProfitCenter.setValue(valdata[0].PRCTR);
            Emailid.setValue(valdata[0].EMAIL_ID);
            console.log(valdata[0].EMAIL_ID);
            Text.setValue(valdata[0].ZTEXT);
            Remarks.setValue(valdata[0].ZREMARK);
            Plant.setValue(valdata[0].PLANT);
            DocNo.setValue(valdata[0].FILE_ATTACH);
            status1 = valdata[0].STATUS; // Assuming you only need the status from the first item
            custom = valdata[0].CUSTOM_INV;
            advpay1 = valdata[0].ADVANCE_PAYMENT;
            checkGRNSESVal = valdata[0].CUSTOM_INV;

            console.log(advpay1);
            if (advpay1 === 'X') {
              advpay.setSelectedKey("Yes");
            } else {
              advpay.setSelectedKey("No");
            }

            if (checkGRNSESVal === 'X') {
              checkGRNSES.setSelected(true);
            } else {
              checkGRNSES.setSelected(false);
            }

            //to get the vendor email and vendor phone number
            var oFilter1 = new sap.ui.model.Filter("LIFNR", sap.ui.model.FilterOperator.EQ, valdata[0].LIFNR);
            var oFilter2 = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, valdata[0].EBELN);
            console.log('PO Filtered', oFilter1);
            oModel1.read("/ZbtspoShSet", {
              filters: [oFilter1, oFilter2],
              success: function (oData) {
                console.log("Filtered Data: ", oData.results);
                console.log("Vendor Email:", oData.results[0].SMTP_ADDR);
                VM.setValue(oData.results[0].SMTP_ADDR);
                VP.setValue(oData.results[0].TELF1);
              }
            });

            checkvalidation(status1);
          },
          error: function (error) {
            console.error("Error occurred:", error); // Log any errors that occur
          },
        });

        var oFilters1 = new sap.ui.model.Filter("BTSID", sap.ui.model.FilterOperator.EQ, BTSID);
        oModel1.read("/ZbtsRepShSet", {
          filters: [oFilters1],
          success: function (data) {
            valdata1 = data.results.filter(function (item) {
              return item.BTSID === BTSID;
            });
            console.log(valdata1);
            InvDoc.setValue(valdata1[0].BELNR);

          }
        });


        var oModel1 = new sap.ui.model.odata.v2.ODataModel(
          "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
        );
        var oFilter = new sap.ui.model.Filter(
          "BTS_ID",
          sap.ui.model.FilterOperator.EQ,
          BTSID
        );
        console.log("Filtered BTS Id:", oFilter);
        this.getView().setModel(oModel1);

        var oModel = that.getView().getModel(); // Assuming your OData Model is already set on the view
        // var sPath = "/ZBTS_CRTSet(BTS_ID='" + BTSID + "',DRAFT_ID='')";
        var etentityset = "/ZBTS_CRTSet"; ///
        oModel.read(etentityset, {
          urlParameters: {
            $expand: "HDRTOGRNNAV,HDRTOSESNAV", // Expand the HDRTOGRNNAV navigation property
            $filter: "BTS_ID eq '" + BTSID + "'",
          },
          success: function (oData) {
            let rowDataArray = []; // Array to hold all row data
            filterdata = []; // Array to hold filtered data for later use
            let rowData = [];

            console.log("Odata data:", oData);
            console.log("Data Created By:", oData.results[0].CREATED_BY);

            data_created = oData.results[0].CREATED_BY;



            // let grnLength = oData.HDRTOGRNNAV && oData.HDRTOGRNNAV.results ? oData.HDRTOGRNNAV.results.length : 0;
            // let sesLength = oData.HDRTOSESNAV && oData.HDRTOSESNAV.results ? oData.HDRTOSESNAV.results.length : 0;
            // let invLength = oData.HDRTOINVNAV && oData.HDRTOINVNAV.results ? oData.HDRTOINVNAV.results.length : 0;

            var grnValue = oData.results[0].HDRTOGRNNAV.results;
            var sesValue = oData.results[0].HDRTOSESNAV.results;
            // var invValue = oData.results[0].HDRTOINVNAV.results;

            var grnLength = grnValue.length;
            var sesLength = sesValue.length;
            // var invLength = invValue.length;

            console.log("grnLength: ", grnLength);
            console.log("sesLength: ", sesLength);

            // if()
            // Use Math.max to find the greatest length
            let greatestLength = Math.max(grnLength, sesLength);

            console.log(`Greatest Length: ${greatestLength}`);
            // Handling HDRTOGRNNAV results
            for (var i = 0; i < greatestLength; i++) {
              console.log("Gen Value:", grnValue);
              if (grnLength > 0) {
                // for (let i = 0; i < grnLength; i++) {
                grnItem = grnValue[i];
                if (grnItem) {
                  var token = new Token({
                    key: grnItem.MBLNR,
                    text: grnItem.MBLNR,
                  });
                  GRN.addToken(token);
                }
                console.log("GRN Item:", grnItem);
                filterdata.push(grnItem); // Storing the GRN item for later use
                // }
              }

              if (sesLength > 0) {
                // for (let i = 0; i < grnLength; i++) {
                sesItem = sesValue[i];
                if (sesItem) {
                  var token1 = new Token({
                    key: sesItem.LBLNI,
                    text: sesItem.LBLNI,
                  });
                  SES.addToken(token1);
                }
                console.log("SES Item:", sesItem);
                filterdata.push(sesItem); // Storing the GRN item for later use
                // }
              }

              rowData = {
                MBLNR: grnItem?.MBLNR || "",
                LBLNI: sesItem?.LBLNI || "",
                // XBLNR: invItem?.XBLNR || ''
              };

              if (
                rowData &&
                (rowData.MBLNR || rowData.LBLNI || rowData.XBLNR)
              ) {
                rowDataArray.push(rowData); // Add rowData to the array
                console.log("Unified Row Data Array:", rowDataArray);
              }
            }

            // Handling HDRTOSESNAV results

            console.log("Unified Row Data Array:", rowDataArray);

            var table = that.getView().byId("DraftTable1");
            if (table) {
              console.log("Table found");
              var oTableModel = new sap.ui.model.json.JSONModel({
                rowDataArray: rowDataArray,
              });
              console.log("BTS Data:", rowDataArray);
              table.setModel(oTableModel, "rowDataArray");
            } else {
              console.error("Table not found or undefined");
            }
          },
          error: function (oError) {
            // Error handler
            console.error("Error retrieving data:", oError);
          },
        });


        function checkvalidation() {
          var save = that.getView().byId("Save");
          var edit = that.getView().byId("Edit");
          var cancel = that.getView().byId("Cancel");
          var deleted = that.getView().byId("Delete");

          if (status1 === "PENDING") {
            //if status is pending then all the fields can be editable (For Eg 0001 is pending)
            save.setVisible(false);
            edit.setVisible(true);
            cancel.setVisible(false);
            deleted.setVisible(true);
          } else {
            deleted.setVisible(false);
            save.setVisible(false);
            edit.setVisible(false);
            cancel.setVisible(false);
          }
        }
        // sap.ui.core.BusyIndicator.hide();
      },

      onPOHelpRequest: function (oEvent) {
        var oInput = oEvent.getSource();
        var sInputId = oInput.getId();
        var grn = this.getView().byId("GRN");
        var ses = this.getView().byId("SES");
        sap.ui.getCore().byId(sInputId).setValueState("None");

        // Invoke the value help function
        valueHelp();

        // Function to create and open the value help dialog
        function valueHelp() {
          // Create the value help dialog
          var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
            title: "PO Nmber",
            supportMultiselect: false,
            supportRanges: false,
            key: "EBELN",
            descriptionKey: "NAME1",
            // descriptionKey: "LIFNR",
            stretch: sap.ui.Device.system.phone,
            ok: function (oControlEvent) {
              var aTokens = oControlEvent.getParameter("tokens");
              console.log("Token: ", aTokens);

              if (aTokens.length > 0) {
                var oToken = aTokens[0];
                sap.ui.getCore().byId(sInputId).setValue(oToken.getKey());
                sap.ui.getCore().byId(sInputId).setValueState("None");

                //validation for grn and ses
                var oModel = new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                );
                var sPath = "/ZbtspoShSet('" + sSelectedPO + "')";
                oModel.read(sPath, {
                  success: function (oData) {
                    console.log('BTS fetch doc type:', oData);
                    if (oData.BSART === 'ZDOM' || oData.BSART === 'ZCDO' || oData.BSART === 'ZEME' || oData.BSART === 'ZRET' || oData.BSART === 'ZRFB' || oData.BSART === 'ZIMP' || oData.BSART === 'ZSTA' || oData.BSART === 'ZSTO' || oData.BSART === 'ZGAS' || oData.BSART === 'ZGAT') {
                      console.log('GRN is Mandatory');
                      grn.setEnabled(true);
                      ses.setEnabled(false);
                      // imp = true;
                    } else if (oData.BSART === 'ZSRV' || oData.BSART === 'ZPSR' || oData.BSART === 'ZIMS' || oData.BSART === 'ZEMS') {
                      console.log('SES is Mandatory');
                      grn.setEnabled(false);
                      ses.setEnabled(true);
                      // imp = true;
                    }
                  }
                });
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
              {
                label: "Vendor Code",
                template: "LIFNR",
              },
              {
                label: "Vendor Name",
                template: "NAME1",
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
          oDialog.getTable().bindAggregation("rows", {
            path: "/ZvcShSet",
          });

          // Open the value help dialog
          oDialog.open();
        }
      },

      onVendorCodeHelpRequest: function (oEvent) {
        var oInput = oEvent.getSource();
        var sInputId = oInput.getId();
        var PO = this.getView().byId("PO").getValue();
        var grn = this.getView().byId("GRN");
        var ses = this.getView().byId("SES");
        sap.ui.getCore().byId(sInputId).setValueState("None");

        var VendorCode = this.byId("VendorCode");
        var vendorName = this.byId("vendorName");

        // Invoke the value help function
        valueHelp();

        // Function to create and open the value help dialog
        function valueHelp() {
          // Create the value help dialog
          var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
            title: "PO Nmber",
            supportMultiselect: false,
            supportRanges: false,
            key: "LIFNR",
            descriptionKey: "NAME1",
            // descriptionKey: "LIFNR",
            stretch: sap.ui.Device.system.phone,
            ok: function (oControlEvent) {
              var aTokens = oControlEvent.getParameter("tokens");
              console.log("Token: ", aTokens);

              if (aTokens.length > 0) {
                var oToken = aTokens[0];
                sap.ui.getCore().byId(sInputId).setValue(oToken.getKey());
                sap.ui.getCore().byId(sInputId).setValueState("None");

                var t1 = oToken.mAggregations.customData[0].mProperties.value;

                VendorCode.setValue(t1.LIFNR);
                vendorName.setValue(t1.NAME1);

                //Import Vendor
                var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZBTS_ODATA_SRV/");
                var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
                var oFilter1 = new sap.ui.model.Filter("LIFNR", sap.ui.model.FilterOperator.EQ, t1.LIFNR);
                console.log('PO Filtered', oFilter);
                console.log('PO Filtered', oFilter1);

                oModel1.read("/ZbtsImpShSet", {
                  filters: [oFilter, oFilter1],
                  success: function (oData) {
                    console.log("Filtered Data: ", oData.results);

                    if (oData.results.length > 0) {
                      // Perform your action when the checkbox is checked
                      grn.setEnabled(false);
                      ses.setEnabled(false);
                      imp = true;
                    } else {
                      //validation for grn and ses
                      var oModel = new sap.ui.model.odata.v2.ODataModel(
                        "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                      );
                      var sPath = "/ZbtspoShSet('" + PO + "')";
                      oModel.read(sPath, {
                        success: function (oData) {
                          console.log('BTS fetch doc type:', oData);
                          if (oData.BSART === 'ZDOM' || oData.BSART === 'ZCDO' || oData.BSART === 'ZEME' || oData.BSART === 'ZRET' || oData.BSART === 'ZRFB' || oData.BSART === 'ZIMP' || oData.BSART === 'ZSTA' || oData.BSART === 'ZSTO' || oData.BSART === 'ZGAS' || oData.BSART === 'ZGAT') {
                            console.log('GRN is Mandatory');
                            grn.setEnabled(true);
                            ses.setValue("");
                            ses.setEnabled(false);
                            grnval = true;
                            sesval = false;
                          } else if (oData.BSART === 'ZSRV' || oData.BSART === 'ZPSR' || oData.BSART === 'ZIMS' || oData.BSART === 'ZEMS') {
                            console.log('SES is Mandatory');
                            grn.setValue("");
                            grn.setEnabled(false);
                            ses.setEnabled(true);
                            grnval = false;
                            sesval = true;
                          }
                        }
                      });

                      // grn.setEnabled(true);
                      // ses.setEnabled(true);
                      imp = false;
                    }


                  },
                  error: function (oError) {
                    console.error("Data fetch error: ", oError);
                  }
                });
                //Import Vendor
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
              {
                label: "Vendor Code",
                template: "LIFNR",
              },
              {
                label: "Vendor Name",
                template: "NAME1",
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
          var oFilter = new sap.ui.model.Filter(
            "EBELN",
            sap.ui.model.FilterOperator.EQ,
            PO
          );
          console.log("PO Filtered", oFilter);

          oModel.read("/ZbtspoShSet", {
            filters: [oFilter],
            success: function (oData) {
              console.log("Filtered Data: ", oData.results);
              // Once data is fetched, create a JSONModel and set the fetched data on it
              var oJSONModel = new sap.ui.model.json.JSONModel();
              oJSONModel.setData({ rows: oData.results }); // Assuming your data is an array of rows

              // Set this model to your dialog or directly to the table
              // If the table does not directly allow setting a model, set it on the dialog or a parent control
              oDialog.getTable().setModel(oJSONModel);

              // Now bind the rows aggregation to this new model
              // The path should be relative to the model's structure; in this case, our structure starts with "rows"
              oDialog.getTable().bindAggregation("rows", {
                path: "/rows"
              });
            },
            error: function (oError) {
              console.error("Data fetch error: ", oError);
            }
          });
          // oDialog.getTable().bindAggregation("rows", {
          //   path: "/ZbtspoShSet",
          //   filters: [oFilter],
          // });

          // Open the value help dialog
          oDialog.open();
        }
      },

      onProfitCenterHelpRequest: function (oEvent) {
        var oInput = oEvent.getSource();
        var sInputId = oInput.getId();
        sap.ui.getCore().byId(sInputId).setValueState("None");

        var Email = this.getView().byId("Email");

        valueHelp();

        // Function to create and open the value help dialog
        function valueHelp() {
          // Create the value help dialog
          var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
            title: "Billing Location",
            supportMultiselect: false,
            key: "BASE_LOCATION",
            descriptionKey: "ZEID",
            // stretch: sap.ui.Device.system.phone,
            ok: function (oControlEvent) {
              var aTokens = oControlEvent.getParameter("tokens");

              if (aTokens.length > 0) {
                var oToken = aTokens[0];
                sap.ui.getCore().byId(sInputId).setValue(oToken.getKey());
                sap.ui.getCore().byId(sInputId).setValueState("None");

                var t1 = oToken.mAggregations.customData[0].mProperties.value;

                Email.setValue(t1.ZEID);
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
                template: "BASE_LOCATION",
              },
              {
                label: "Email Address",
                template: "ZEID",
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
          oDialog.getTable().bindAggregation("rows", {
            path: "/ZpridShSet",
          });

          // Open the value help dialog
          oDialog.open();
        }
      },

      onGRNHelpRequest: function (oEvent) {
        var oInput = oEvent.getSource();
        var sInputId = oInput.getId();
        var oMultiInput = sap.ui.getCore().byId(sInputId).setValueState("None");

        var PO = this.getView().byId("PO").getValue();
        // oMultiInput = this.byId("GRN");
        console.log("PO", PO);
        valueHelp();

        // Function to create and open the value help dialog
        function valueHelp() {
          // Create the value help dialog
          var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
            title: "GRN Number",
            supportMultiselect: true,
            key: "MBLNR",
            descriptionKey: "MBLNR",
            // stretch: sap.ui.Device.system.phone,
            ok: function (oControlEvent) {
              var aTokens = oControlEvent.getParameter("tokens");

              if (aTokens && aTokens.length > 0) {
                aTokens.forEach(function (oToken) {
                  oMultiInput.addToken(
                    new sap.m.Token({
                      text: oToken.getKey(),
                    })
                  );
                });
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
              {
                label: "GRN Number",
                template: "MBLNR",
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

          var oFilter = new sap.ui.model.Filter(
            "EBELN",
            sap.ui.model.FilterOperator.EQ,
            PO
          );
          oDialog.getTable().setModel(oModel);
          oDialog.getTable().bindAggregation("rows", {
            path: "/ZbtsgrnShSet",
            filters: [oFilter],
          });

          // Open the value help dialog
          oDialog.open();
        }
      },

      onSESHelpRequest: function (oEvent) {
        var oInput = oEvent.getSource();
        var sInputId = oInput.getId();
        var oMultiInput = sap.ui.getCore().byId(sInputId).setValueState("None");

        var PO = this.getView().byId("PO").getValue();
        // oMultiInput = this.byId("SES");
        console.log("PO", PO);
        valueHelp();

        // Function to create and open the value help dialog
        function valueHelp() {
          // Create the value help dialog
          var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
            title: "SES Number",
            supportMultiselect: true,
            key: "LBLNI",
            descriptionKey: "LBLNI",
            // stretch: sap.ui.Device.system.phone,
            ok: function (oControlEvent) {
              var aTokens = oControlEvent.getParameter("tokens");

              if (aTokens && aTokens.length > 0) {
                aTokens.forEach(function (oToken) {
                  oMultiInput.addToken(
                    new sap.m.Token({
                      text: oToken.getKey(),
                    })
                  );
                });
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
              {
                label: "SES Number",
                template: "LBLNI",
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

          var oFilter = new sap.ui.model.Filter(
            "EBELN",
            sap.ui.model.FilterOperator.EQ,
            PO
          );
          oDialog.getTable().setModel(oModel);
          oDialog.getTable().bindAggregation("rows", {
            path: "/ZbtssesShSet",
            filters: [oFilter],
          });

          // Open the value help dialog
          oDialog.open();
        }
      },

      onPlantHelpRequest: function (oEvent) {
        var oInput = oEvent.getSource();
        var sInputId = oInput.getId();
        sap.ui.getCore().byId(sInputId).setValueState("None");

        // var plant = this.getView().byId("Plant");

        valueHelp();

        // Function to create and open the value help dialog
        function valueHelp() {
          // Create the value help dialog
          var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
            title: "Plant",
            supportMultiselect: false,
            key: "BWKEY",
            descriptionKey: "NAME1",
            // stretch: sap.ui.Device.system.phone,
            ok: function (oControlEvent) {
              var aTokens = oControlEvent.getParameter("tokens");

              if (aTokens.length > 0) {
                var oToken = aTokens[0];
                sap.ui.getCore().byId(sInputId).setValue(oToken.getKey());
                sap.ui.getCore().byId(sInputId).setValueState("None");

                var t1 = oToken.mAggregations.customData[0].mProperties.value;

                // Email.setValue(t1.ZEID);

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
                label: "Plant",
                template: "BWKEY",
              },
              {
                label: "Plant Description",
                template: "NAME1",
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

          // var oFilter = new sap.ui.model.Filter("ZUSER", sap.ui.model.FilterOperator.EQ, created_by);
          oDialog.getTable().setModel(oModel);
          oDialog.getTable().bindAggregation("rows", {
            path: "/ZbtsPlantShSet",
            // filters: [oFilter]
          });

          // Open the value help dialog
          oDialog.open();
        }
      },

      OnEdit: function () {
        var that = this;

        // var addButton = that.getView().byId("DraftOnAddRow");
        var prof = that.getView().byId("Profit");
        var vend = that.getView().byId("VendorCode");
        var venvalue = vend.getValue();
        var pono = that.getView().byId("PO");
        var amtt = that.getView().byId("Amount");
        var datee = that.getView().byId("DateField");
        var remk = that.getView().byId("Remarks");
        var Plant = that.getView().byId("Plant");
        var textt = that.getView().byId("Text");
        var po = this.getView().byId("PO");
        var povalue = po.getValue();
        var save = that.getView().byId("Save");
        var edit = that.getView().byId("Edit");
        var deleted = that.getView().byId("Delete")
        var cancel = that.getView().byId("Cancel");
        var grn = this.getView().byId("GRN");
        var ses = this.getView().byId("SES");
        var GeMNo = this.getView().byId("GemInvNo"); //uncomment for GeM
        var GeMPro = this.getView().byId("GeM_Procurement"); //uncomment for GeM
        var checkGRNSES = this.getView().byId("VendorActive").getSelected();

        GeMPro.setEnabled(true); //uncomment for GeM
        console.log(gemflag);
        if (gemflag === "Yes") {
          GeMNo.setVisible(true);
          GeMNo.setEditable(true);
        } else if (gemflag === "No") {
          GeMNo.setVisible(false);
          GeMNo.setEditable(false);
        } else {
          GeMNo.setVisible(false);
          GeMNo.setEditable(false);
        } //uncomment for GeM





        // var check = that.getView().byId("acceptTermsCheckbox");
        var change = that.getView().byId("b2");

        // var DraftOnAddRow = that.getView().byId("DraftOnAddRow");
        // var DraftOnDeleteRow = that.getView().byId("DraftOnDeleteRow");

        console.log("data created by:", data_created); //added on 26.09.2024

        if (created_by === data_created) {
          Plant.setEditable(true);
        } else {
          Plant.setEditable(false);
        }  //added on 26.09.2024

        prof.setEditable(true);
        // vend.setEditable(true);
        // pono.setEditable(true);
        amtt.setEditable(true);
        datee.setEditable(true);
        remk.setEditable(true);
        // Plant.setEditable(true);
        textt.setEditable(true);

        edit.setVisible(false);
        save.setVisible(true);
        cancel.setVisible(true);
        // check.setEditable(true);
        deleted.setVisible(false);
        change.setVisible(true);

        var oModel = new sap.ui.model.odata.v2.ODataModel(
          "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
        );

        //Import Vendor
        var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZBTS_ODATA_SRV/");
        var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, povalue);
        var oFilter1 = new sap.ui.model.Filter("LIFNR", sap.ui.model.FilterOperator.EQ, venvalue);
        console.log('PO Filtered', oFilter);
        console.log('PO Filtered', oFilter1);

        // var sPath = "/ZpoShSet('" + povalue + "')";
        // oModel.read(sPath, {
        //   success: function (oData) {
        //     console.log('BTS fetch doc type:', oData);
        //     if (oData.WEBRE === '' && oData.LEBRE === '') {
        //       GR_PO = false;
        //       SES_PO = false;
        //       grn.setEnabled(false);
        //       ses.setEnabled(false);
        //       imp = true;
        //     } else if (oData.WEBRE === 'X' && oData.LEBRE === '') {
        //       GR_PO = true;
        //       SES_PO = false;
        //       grn.setEnabled(true);
        //       ses.setEnabled(false);
        //       imp = true;
        //     } else if (oData.WEBRE === '' && oData.LEBRE === 'X') {
        //       GR_PO = false;
        //       SES_PO = true;
        //       grn.setEnabled(false);
        //       ses.setEnabled(true);
        //       imp = true;
        //     } else if (oData.WEBRE === '') {
        //       GR_PO = false;
        //       grn.setEnabled(false);
        //       ses.setEnabled(false);
        //       imp = true;
        //     } else if (oData.LEBRE === '') {
        //       SES_PO = false;
        //       grn.setEnabled(false);
        //       ses.setEnabled(false);
        //       imp = true;
        //     }
        //   }
        // });

        oModel1.read("/ZbtsImpShSet", {
          filters: [oFilter, oFilter1],
          success: function (oData) {
            console.log("Filtered Data: ", oData.results);

            if (oData.results.length > 0) {
              // Perform your action when the checkbox is checked
              grn.setEnabled(false);
              ses.setEnabled(false);
              imp = true;
            } else if (checkGRNSES === true) {
              checkBox = false;
              grn.setEnabled(false);
              ses.setEnabled(false);
              grn.removeAllTokens();
              ses.removeAllTokens();
            } else {
              //validation for grn and ses
              var oModel = new sap.ui.model.odata.v2.ODataModel(
                "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
              );
              var sPath = "/ZbtspoShSet('" + povalue + "')";
              oModel.read(sPath, {
                success: function (oData) {
                  console.log('BTS fetch doc type:', oData);
                  if (oData.BSART === 'ZDOM' || oData.BSART === 'ZCDO' || oData.BSART === 'ZEME' || oData.BSART === 'ZRET' || oData.BSART === 'ZRFB' || oData.BSART === 'ZIMP' || oData.BSART === 'ZSTA' || oData.BSART === 'ZSTO' || oData.BSART === 'ZGAS' || oData.BSART === 'ZGAT') {
                    console.log('GRN is Mandatory');
                    // if (GR_PO === false) {
                    //   console.log('GR Based PO');
                    //   grn.setEnabled(false);
                    //   ses.setEnabled(false);
                    //   grnval = false;
                    //   sesval = false;
                    // } else {
                    grn.setEnabled(true);
                    ses.setValue("");
                    ses.setEnabled(false);
                    grnval = true;
                    sesval = false;
                    // }
                  } else if (oData.BSART === 'ZSRV' || oData.BSART === 'ZPSR' || oData.BSART === 'ZIMS' || oData.BSART === 'ZEMS') {
                    console.log('SES is Mandatory');
                    // if (GR_PO === false) {
                    //   console.log('GR Based PO');
                    //   grn.setEnabled(false);
                    //   ses.setEnabled(false);
                    //   grnval = false;
                    //   sesval = false;
                    // } else {
                    grn.setValue("");
                    grn.setEnabled(false);
                    ses.setEnabled(true);
                    grnval = false;
                    sesval = true;
                    // }
                  } else if (oData.BSART === 'ZINS' || oData.BSART === 'FO') {
                    console.log('Insurance PO');
                    grn.setEnabled(false);
                    ses.setEnabled(false);
                    // curr.setEnabled(true);
                    imp = true;
                  } else if (oData.BSART === 'ZTUR' || oData.BSART === 'ZCTU' || oData.BSART === 'ZLOC') {
                    // if (SES_PO === false && GR_PO === false) {
                    //   console.log('GRN and SES Based PO');
                    //   grn.setEnabled(false);
                    //   ses.setEnabled(false);
                    //   grnval = false;
                    //   sesval = false;
                    // } else if (SES_PO === false && GR_PO === true) {
                    //   ses.setValue("");
                    //   grn.setEnabled(true);
                    //   ses.setEnabled(false);
                    //   grnval = true;
                    //   sesval = false;
                    // } else if (SES_PO === true && GR_PO === false) {
                    //   grn.setValue("");
                    //   grn.setEnabled(false);
                    //   ses.setEnabled(true);
                    //   grnval = false;
                    //   sesval = true;
                    // } else {
                    grn.setEnabled(true);
                    ses.setEnabled(true);
                    grnval = true;
                    sesval = true;
                  }
                }
                // }
              });

              // grn.setEnabled(true);
              // ses.setEnabled(true);
              imp = false;
            }


          },
          error: function (oError) {
            console.error("Data fetch error: ", oError);
          }
        });


        // // Get a reference to the table
        var table = this.getView().byId("DraftTable1");

        // // Get all items (rows) of the table
        var items = table.getItems();

        // // Log the number of rows
        // console.log("Number of rows:", items.length);

        // if (items.length > 1) {
        //     DraftOnAddRow.setVisible(true);
        //     DraftOnDeleteRow.setVisible(true);
        // } else {
        //     DraftOnAddRow.setVisible(true);
        //     DraftOnDeleteRow.setVisible(false);
        // }

        // Loop through each item
        items.forEach(function (item) {
          // Get the cells of each item
          var cells = item.getCells();

          // Loop through each cell (Input control) and set the editable property to true
          cells.forEach(function (cell) {
            if (cell instanceof sap.m.Input) {
              cell.setEditable(true);
            }
          });
        });

        var povalue = pono.getValue();
        var oModel = new sap.ui.model.odata.v2.ODataModel(
          "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
        );
        var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, povalue);
        oModel.read("/ZbtspoShSet", {
          filters: [oFilter],
          success: function (oData) {

            sap.ui.core.BusyIndicator.hide();
            console.log(" PO Entities fetched successfully:", oData.results);
            that.ZbtspoShSet = oData.results;


          },
          error: function () {
            // Handle error
            console.log("Error in fetching entities");
          },
        });
      },

      onCancel: function () {
        var oData = rootValue;
        console.log(oData);
        var that = this;
        console.log(filterdata);

        var prof = that.getView().byId("Profit");
        var BTS_ID = that.getView().byId("BTSCode");
        var vend = that.getView().byId("VendorCode");
        var pono = that.getView().byId("PO");
        var amtt = that.getView().byId("Amount");
        var datee = that.getView().byId("DateField");
        var remk = that.getView().byId("Remarks");
        var Plant = that.getView().byId("Plant");
        var textt = that.getView().byId("Text");
        var invv = that.getView().byId("_IDGenText5");
        var grnno = that.getView().byId("_IDGenText6");
        var sesno = that.getView().byId("_IDGenText11");
        // var check = that.getView().byId("acceptTermsCheckbox");
        var change = that.getView().byId("b2");
        var file = that.getView().byId("fileUploaderBankMandate");




        var save = that.getView().byId("Save");
        var edit = that.getView().byId("Edit");
        var cancel = that.getView().byId("Cancel");
        var deleted = that.getView().byId("Delete")
        var DraftOnAddRow = that.getView().byId("DraftOnAddRow");
        var DraftOnDeleteRow = that.getView().byId("DraftOnDeleteRow");

        var BTSID = BTS_ID.getValue();
        prof.setEditable(false);
        vend.setEditable(false);
        pono.setEditable(false);
        amtt.setEditable(false);
        datee.setEditable(false);
        remk.setEditable(false);
        Plant.setEditable(false);
        textt.setEditable(false);

        edit.setVisible(true);
        save.setVisible(false);
        cancel.setVisible(false);
        // check.setEditable(false);
        deleted.setVisible(true);
        change.setVisible(false);
        file.setVisible(false);

        var GeMNo = this.getView().byId("GemInvNo"); //uncomment for GeM
        var GeMPro = this.getView().byId("GeM_Procurement"); //uncomment for GeM


        GeMPro.setEnabled(false); //uncomment for GeM
        console.log(gemflag);
        if (gemflag === "Yes") {
          GeMNo.setVisible(true);
          GeMNo.setEditable(false);
        } else if (gemflag === "No") {
          GeMNo.setVisible(false);
          GeMNo.setEditable(false);
        } else {
          GeMNo.setVisible(false);
          GeMNo.setEditable(false);
        }

        GeMPro.setSelectedKey(oData[0].GEM_INV_NO_FLAG); //uncomment for GeM

        // DraftOnAddRow.setVisible(false);
        // DraftOnDeleteRow.setVisible(false);

        vend.setValue(oData[0].LIFNR);

        var name1 = this.getView().byId("vendorName");
        name1.setValue(decodeURIComponent(oData[0].NAME1));

        pono.setValue(oData[0].EBELN);

        amtt.setValue(oData[0].ZAMT);

        // Given date string
        var dateString = decodeURIComponent(oData[0].ZDATE);

        // Create a Date object from the given string
        var date = new Date(dateString);

        // Extract year, month, and day components
        var year = date.getFullYear();
        var month = ("0" + (date.getMonth() + 1)).slice(-2); // Adding 1 because month index starts from 0
        var day = ("0" + date.getDate()).slice(-2);

        // Construct the formatted date string in "YYYY-MM-DD" format
        var formattedDate = year + "-" + month + "-" + day;

        datee.setValue(formattedDate);

        prof.setValue(oData[0].PRCTR);

        textt.setValue(decodeURIComponent(oData[0].ZTEXT));

        remk.setValue(decodeURIComponent(oData[0].ZREMARK));

        Plant.setValue(oData[0].PLANT)


        console.log(custom);
        // if (custom === 'X') {
        //   check.setSelected(true);
        // }

        var table = this.getView().byId("DraftTable1");

        // Get all items (rows) of the table
        var items = table.getItems();

        // Loop through each item
        items.forEach(function (item) {
          // Get the cells of each item
          var cells = item.getCells();

          // Loop through each cell (Input control) and set the editable property to true
          cells.forEach(function (cell) {
            if (cell instanceof sap.m.Input) {
              cell.setEditable(false);
            }
          });
        });

        var oModel = that.getView().getModel(); // Assuming your OData Model is already set on the view
        var etentityset = "/ZBTS_CRTSet";
        // var sPath = "/ZBTS_CRTSet(BTS_ID='" + BTSID + "',DRAFT_ID='')";
        oModel.read(etentityset, {
          urlParameters: {
            $expand: "HDRTOGRNNAV,HDRTOSESNAV", // Expand the HDRTOGRNNAV navigation property
            $filter: "BTS_ID eq '" + BTSID + "'",
          },
          success: function (oData) {
            let rowDataArray = []; // Array to hold all row data
            filterdata = []; // Array to hold filtered data for later use
            let rowData = [];

            // Handling HDRTOGRNNAV results
            console.log("Odata data:", oData);
            let grnLength =
              oData.HDRTOGRNNAV && oData.HDRTOGRNNAV.results
                ? oData.HDRTOGRNNAV.results.length
                : 0;
            let sesLength =
              oData.HDRTOSESNAV && oData.HDRTOSESNAV.results
                ? oData.HDRTOSESNAV.results.length
                : 0;
            let invLength =
              oData.HDRTOINVNAV && oData.HDRTOINVNAV.results
                ? oData.HDRTOINVNAV.results.length
                : 0;

            // Use Math.max to find the greatest length
            let greatestLength = Math.max(grnLength, sesLength, invLength);

            console.log(`Greatest Length: ${greatestLength}`);
            // Handling HDRTOGRNNAV results
            for (var i = 0; i < greatestLength; i++) {
              if (oData.HDRTOGRNNAV && oData.HDRTOGRNNAV.results) {
                // for (let i = 0; i < oData.HDRTOGRNNAV.results.length; i++) {
                grnItem = oData.HDRTOGRNNAV.results[i];
                console.log("GRN Item:", grnItem);
                filterdata.push(grnItem); // Storing the GRN item for later use
              }
              if (oData.HDRTOSESNAV && oData.HDRTOSESNAV.results) {
                // for (let i = 0; i < oData.HDRTOSESNAV.results.length; i++) {
                sesItem = oData.HDRTOSESNAV.results[i];
                console.log("SES Item:", sesItem); // Corrected log to say "SES Item"
                filterdata.push(sesItem); // Storing the SES item for later use
              }

              rowData = {
                MBLNR: grnItem?.MBLNR || "",
                LBLNI: sesItem?.LBLNI || "",
                // XBLNR: invItem?.XBLNR || ''
              };

              if (
                rowData &&
                (rowData.MBLNR || rowData.LBLNI || rowData.XBLNR)
              ) {
                rowDataArray.push(rowData); // Add rowData to the array
                console.log("Unified Row Data Array:", rowDataArray);
              }
            }

            var table = that.getView().byId("DraftTable1");
            if (table) {
              console.log("Table found");
              var oTableModel = new sap.ui.model.json.JSONModel({
                rowDataArray: rowDataArray,
              });
              console.log("BTS Data:", rowDataArray);
              table.setModel(oTableModel, "rowDataArray");
            } else {
              console.error("Table not found or undefined");
            }
          },
        });
      },

      OnSave: function () {
        sap.ui.core.BusyIndicator.show();
        var that = this;

        console.log(" PO Entities fetched values:", that.ZbtspoShSet);
        console.log(" Proftit Center fetched Values: ", that.ProfitCenter);
        console.log(" GRN fetched Values: ", that.GRNEntities);
        console.log(" SES fetched Values: ", that.SESEntities);

        var BTSCode = this.getView().byId("BTSCode");
        var VendorCode = this.getView().byId("VendorCode");
        var name1 = this.getView().byId("vendorName");
        var PO = this.getView().byId("PO");
        var DateField = this.getView().byId("DateField");
        var ProfitCenter = this.getView().byId("Profit");
        var Email = this.getView().byId("Email");
        var Remarks = this.getView().byId("Remarks");
        var Plant = this.getView().byId("Plant");
        var oldattach = this.getView().byId("attach");
        var fileattach = this.getView().byId("fileUploaderBankMandate");
        var filevalue = fileattach.getValue();
        PlantValue = Plant.getValue();
        var dateValue = DateField.getDateValue();
        var GemInvNo = this.getView().byId("GemInvNo"); //uncomment for GeM
        var GeM_Procurement = this.getView().byId("GeM_Procurement"); //uncomment for GeM
        gemInvValue = GemInvNo.getValue(); //uncomment for GeM
        console.log('Date Value:', dateValue);

        var year = dateValue.getFullYear();
        var month = ('0' + (dateValue.getMonth() + 1)).slice(-2);
        var day = ('0' + dateValue.getDate()).slice(-2);

        formattedDate = year + '-' + month + '-' + day + 'T00:00:00';
        console.log(formattedDate);

        ///////////////this is for the table////////////////////

        var Invoice = this.getView().byId("Invoice");
        var invoiceText = this.getView().byId("Text");
        var GRN = this.getView().byId("GRN");
        var Grntoken = GRN.getTokens();
        var SES = this.getView().byId("SES");
        var Sestokens = SES.getTokens();
        var Amount = this.getView().byId("Amount");
        var grnnavValue = [];
        var sesnavValue = [];
        var GRNexistFlag = true;
        var SESexistFlag = true;

        //create token for manually input
        var oTable = this.byId("DraftTable1");
        // Get all rows of the table
        var aRows = oTable.getItems(); // For sap.m.Table or getRows() for sap.ui.table.Table
        aRows.forEach(function (oRow) {
          var aCells = oRow.getCells(); // Assuming MultiInput is directly in the cells; adjust if it's nested
          aCells.forEach(function (oCell) {
            if (oCell instanceof sap.m.MultiInput) {
              var oMultiInput = oCell;

              // var oMultiInput = this.byId("GRN");  
              // Get the trimmed value from the MultiInput
              var grnvalue = oMultiInput.getValue().trim();
              console.log(grnvalue);

              // If there's an actual value, proceed to create a token
              if (grnvalue) {
                var token = new Token({
                  key: grnvalue,
                  text: grnvalue
                });

                // Add the token to the MultiInput
                oMultiInput.addToken(token);

                // Clear the input field for the next entry
                oMultiInput.setValue('');
              }

            }
          });
        });

        var oMultiInput1 = this.byId("SES");
        // Get the trimmed value from the MultiInput
        var sesvalue = oMultiInput1.getValue().trim();
        console.log(sesvalue);

        // If there's an actual value, proceed to create a token
        if (sesvalue) {
          var token1 = new Token({
            key: sesvalue,
            text: sesvalue
          });

          // Add the token to the MultiInput
          oMultiInput1.addToken(token1);

          // Clear the input field for the next entry
          oMultiInput1.setValue('');
        }
        //till here create token for manually input

        validation();

        function validation() {
          if (!PO.getValue()) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error("Please fill PO number field");
            return;
          }

          if (!VendorCode.getValue()) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error("Please fill Vendor Code field");
            return;
          }

          if (!DateField.getValue()) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error("Please fill Date field");
            return;
          }

          if (!ProfitCenter.getValue()) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error("Please fill Profit Center field");
            return;
          } else {
            // console.log(" ProfitCenter Entities fetched successfully:", that.ProfitCenter);

            var profitCen = ProfitCenter.getValue();
            // Filter ZbtspoShSet to find the matching PO
            var filteredEntities = that.ProfitCenter.filter(function (entity) {
              return entity.BASE_LOCATION === profitCen;
            });

            if (filteredEntities.length > 0) {
              console.log(
                "Profit Center Entities fetched successfully:",
                filteredEntities
              );
            } else {
              sap.ui.core.BusyIndicator.hide();
              MessageBox.error(
                "The given ( " + profitCen + " ) Profit Center does not exist"
              );
              return;
            }
          }

          if (!Remarks.getValue()) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error("Please fill Remarks field");
            return;
          }

          if (!Plant.getValue()) {
            Plant.setValueState("Error");
            sap.ui.core.BusyIndicator.hide(); //31
            sap.m.MessageBox.error("Please fill Plant Field", {
              onClose: function () {
                Plant.focus(); //
              },
            });
            return;
          }

          console.log(gemflag); //uncomment for GeM
          if (!gemflag || gemflag === " ") {
            GeM_Procurement.setValueState("Error");
            sap.ui.core.BusyIndicator.hide(); //31
            sap.m.MessageBox.error("Please select GeM Procurement Field", {
              onClose: function () {
                GeM_Procurement.focus(); //
              },
            });
            return;
          }

          if (gemflag === 'Yes') {
            if (!GemInvNo.getValue()) {
              GemInvNo.setValueState("Error");
              sap.ui.core.BusyIndicator.hide(); //31
              sap.m.MessageBox.error("Please fill GeM Invoice Number Field", {
                onClose: function () {
                  GemInvNo.focus(); //
                },
              });
              return;
            }
          } //uncomment for GeM


          // if (Plant.getValue()) {
          //   var oModel = new sap.ui.model.odata.v2.ODataModel(
          //     "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
          //   );

          //   var oFilter = new sap.ui.model.Filter("BWKEY", sap.ui.model.FilterOperator.EQ, PlantValue);
          //   oModel.read("/ZbtsPlantShSet", {
          //     filters: [oFilter],
          //     success: function (oData) {
          //       console.log(" Plant Entities fetched successfully:", oData);
          //       if (oData.results <= 0) {
          //         sap.ui.core.BusyIndicator.hide(); //31
          //         sap.m.MessageBox.error("Plant " + PlantValue + " does not exist.", {
          //             onClose: function () {
          //             Plant.focus();
          //           },
          //         });
          //         return;
          //       }
          //     }, error: function () {
          //       // Handle error
          //       console.log("Error in fetching entities");
          //     }
          //   });

          // }


          if (!Invoice.getValue()) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error("Please fill Invoice field");
            return;
          }

          if (!invoiceText.getValue()) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error("Please fill Invoice Text field");
            return;
          }

          ////////////////////////validating grn based on po doc type/////////////////////////////////////
          // var oModel = new sap.ui.model.odata.v2.ODataModel(
          //   "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
          // );
          // var sPath = "/ZpoShSet('" + povalue + "')";
          // oModel.read(sPath, {
          //   success: function (oData) {
          //     console.log('BTS fetch doc type:', oData);
          //     if (oData.WEBRE === '') {
          //       GR_PO = false;
          //     }
          //   }
          // });

          var PoFilter = that.ZbtspoShSet.filter(function (entity) {
            return entity.EBELN === PO.getValue();
          });
          console.log("PO Filter: ", PoFilter);

          if (!imp) {
            // if (GR_PO === true && SES_PO === true) {
            if (
              PoFilter[0].BSART === "ZLOC" ||
              PoFilter[0].BSART === "ZTUR" ||
              PoFilter[0].BSART === "ZCTU"
            ) {
              console.log(GRN.getTokens().length);
              if (GRN.getTokens().length === 0 && SES.getTokens().length === 0) {
                sap.ui.core.BusyIndicator.hide();
                MessageBox.error("Please Fill either GRN or SES Field!!");
                return;
              } else if (GRN.getTokens().length > 0 && SES.getTokens().length === 0) {
                GrnValidation();
                if (GRNexistFlag === false) {
                  return;
                }
              } else if (GRN.getTokens().length === 0 && SES.getTokens().length > 0) {
                SESValidation();
                if (SESexistFlag === false) {
                  return;
                }
              } else if (GRN.getTokens().length > 0 && SES.getTokens().length > 0) {
                GrnValidation();
                if (GRNexistFlag === false) {
                  return;
                }
                SESValidation();
                if (SESexistFlag === false) {
                  return;
                }
              }

              // if (SES.getTokens().length === 0) {
              //   MessageBox.error("Please fill SES field");
              //   return;
              // } else {
              //   SESValidation();
              //   if (SESexistFlag === false) {
              //     return;
              //   }
              // }
            }
            // }
            // if (GR_PO === true) {
            if (
              PoFilter[0].BSART === "ZDOM" ||
              PoFilter[0].BSART === "ZCDO" ||
              PoFilter[0].BSART === "ZEME" ||
              PoFilter[0].BSART === "ZRET" ||
              PoFilter[0].BSART === "ZRFB" ||
              PoFilter[0].BSART === "ZIMP" ||
              PoFilter[0].BSART === "ZSTA" ||
              PoFilter[0].BSART === "ZSTO" ||
              PoFilter[0].BSART === "ZGAS" ||
              PoFilter[0].BSART === "ZGAT"
            ) {
              console.log("GRN is Mandatory");
              if (GRN.getTokens().length === 0) {
                sap.ui.core.BusyIndicator.hide();
                MessageBox.error("Please fill GRN field");
                return;
              } else {
                GrnValidation();
                if (GRNexistFlag === false) {
                  return;
                }
              }
            }
            // }
            // if (SES_PO === true) {
            if (
              PoFilter[0].BSART === "ZSRV" ||
              PoFilter[0].BSART === "ZPSR" ||
              PoFilter[0].BSART === "ZIMS" ||
              PoFilter[0].BSART === "ZEMS"
            ) {
              console.log("SES is Mandatory");
              if (SES.getTokens().length === 0) {
                sap.ui.core.BusyIndicator.hide();
                MessageBox.error("Please fill SES field");
                return;
              } else {
                SESValidation();
                if (SESexistFlag === false) {
                  return;
                }
              }
            }
            // }
          }

          if (!Amount.getValue()) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error("Please fill Amount field");
            return;
          }

          gettingValue();
        }

        function GrnValidation() {
          Grntoken.forEach(function (token) {
            grnnavValue.push(token.getText());
          });

          // Assuming grnnavValue is an array containing GRN values [1, 2]
          var missingValues = [];

          grnnavValue.forEach(function (value) {
            // Check if the value exists in that.GRNEntities
            var found = that.GRNEntities.some(function (entity) {
              return entity.MBLNR === value;
            });

            // If the value is not found, add it to the missingValues array
            if (!found) {
              missingValues.push(value);
            }
          });

          // Check if there are any missing values
          if (missingValues.length > 0) {
            sap.ui.core.BusyIndicator.hide();
            var message =
              "The following GRN values do not exist: " +
              missingValues.join(", ");
            MessageBox.error(message);
            GRNexistFlag = false;

          }
        }

        function SESValidation() {
          Sestokens.forEach(function (token) {
            sesnavValue.push(token.getText());
          });

          // Assuming grnnavValue is an array containing GRN values [1, 2]
          var missingValues = [];

          sesnavValue.forEach(function (value) {
            // Check if the value exists in that.GRNEntities
            var found = that.SESEntities.some(function (entity) {
              return entity.LBLNI === value;
            });

            // If the value is not found, add it to the missingValues array
            if (!found) {
              missingValues.push(value);
            }
          });

          // Check if there are any missing values
          if (missingValues.length > 0) {
            sap.ui.core.BusyIndicator.hide();
            var message =
              "The following SES values do not exist: " +
              missingValues.join(", ");
            MessageBox.error(message);
            SESexistFlag = false;
          }
        }

        function gettingValue() {
          var count = 0;

          var jsonObjectArrayGrn = []; // Array to store JSON objects
          var jsonObjectArraySES = []; // Array to store JSON objects

          var oFileUpload = that.getView().byId("fileUploaderBankMandate").getValue();
          if (oFileUpload !== "") {
            var oFileUploader = that.getView().byId("fileUploaderBankMandate");
            var filename = that._file.name;
            var fileType = that._file.type;
            that.getView().getModel().refreshSecurityToken();


            oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
              name: "x-csrf-token",
              value: that.getView().getModel().getHeaders()['x-csrf-token']
            }));

          }

          console.log("BTSCode:", BTSCode.getValue());
          console.log("VendorCode:", VendorCode.getValue());
          console.log("name1:", name1.getValue());
          console.log("PO:", PO.getValue());
          console.log("DateField:", DateField.getValue());
          console.log("ProfitCenter:", ProfitCenter.getValue());
          console.log("Email:", Email.getValue());
          console.log("Remarks:", Remarks.getValue());
          console.log("Invoice:", Invoice.getValue());
          console.log("invoiceText:", invoiceText.getValue());
          console.log("GRN:", GRN.getValue());
          console.log("SES:", SES.getValue());
          console.log("Amount:", Amount.getValue());
          console.log("grnnavValue:", grnnavValue);
          console.log("sesnavValue:", sesnavValue);

          var btsvalue = BTSCode.getValue();
          var GRNJSON = [];
          var SESJSON = [];

          Grntoken.forEach(function (token) {
            GRNJSON.push(token.getText());
          });

          Sestokens.forEach(function (token) {
            SESJSON.push(token.getText());
          });

          if (GRNJSON.length > 0) {

            // Iterate through each MBLNR value in the GRNJSON array
            GRNJSON.forEach(function (mblnrValue) {
              // Create a new JSON object for each MBLNR value
              var jsonObjectGrn = {
                BTS_ID: btsvalue, // Set the BTS_ID
                MBLNR: mblnrValue, // Set the MBLNR
              };
              // Push the new JSON object to the jsonObjectArray
              jsonObjectArrayGrn.push(jsonObjectGrn);
            });
            console.log("JSON Object GRN: ", jsonObjectArrayGrn);
          }

          if (SESJSON.length > 0) {


            // Iterate through each MBLNR value in the GRNJSON array
            SESJSON.forEach(function (lblnivalue) {
              // Create a new JSON object for each MBLNR value
              var jsonObjectSes = {
                BTS_ID: btsvalue, // Set the BTS_ID
                LBLNI: lblnivalue, // Set the MBLNR
              };
              // Push the new JSON object to the jsonObjectArray
              jsonObjectArraySES.push(jsonObjectSes);
            });

            console.log("JSON Object SES: ", jsonObjectArraySES);
          }

          var formattedDate = DateField.getValue() + "T00:00:00";

          if (gemflag === 'No') { //uncomment for GeM
            gemInvValue = '';
          } //uncomment for GeM

          if (!filevalue) {
            attchment = oldattach.getValue();
          } else {
            attchment = filevalue;
          }

          console.log(attchment);
          var jsonData = {
            BTS_ID: BTSCode.getValue().toUpperCase(),
            DRAFT_ID: "",
            DOKNR: "",
            EBELN: PO.getValue(),
            GEM_INV_NO_FLAG: gemflag, //uncomment for GeM
            GEM_INV_NO: gemInvValue, //uncomment for GeM
            ZAMT: Amount.getValue(),
            ZDATE: formattedDate,
            LIFNR: VendorCode.getValue(),
            NAME1: name1.getValue(),
            PRCTR: ProfitCenter.getValue(),
            EMAIL_ID: Email.getValue(),
            FILE_ATTACH: attchment,
            ZTEXT: invoiceText.getValue().toUpperCase(),
            ZREMARK: Remarks.getValue().toUpperCase(),
            PLANT: Plant.getValue(),
            CUSTOM_INV: checkbox,
            XBLNR: Invoice.getValue().toUpperCase(),
            STATUS: "PENDING",
            FLAG: "Y",
            CHANGED_ON: created_on,
            CHANGED_BY: created_by,
            CHANGED_TIME: isoTime,
            HDRTOGRNNAV: jsonObjectArrayGrn,
            HDRTOSESNAV: jsonObjectArraySES,
          };
          console.log("JSON DATA: ", jsonData);

          var oModel = new sap.ui.model.odata.v2.ODataModel(
            "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
          );
          var slug;
          var oBusyIndicator = new sap.m.BusyDialog();

          oModel.refreshSecurityToken(
            function () {
              csrfToken = oModel.getHeaders()["x-csrf-token"];
              console.log("CSRF Token:", csrfToken);
            },
            function (error) {
              console.error("Error refreshing CSRF token:", error);
            }
          );

          $.ajax({
            url: "/sap/opu/odata/sap/ZBTS_ODATA_SRV/ZBTS_CRTSet",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(jsonData),
            headers: {
              "X-CSRF-Token": csrfToken,
            },
            success: function (response) {
              console.log("Data sent successfully:", response);
              count++;
              oBusyIndicator.open();
              FileUpload();
              // sap.m.MessageBox.success(
              //   "BTS ID " + btsvalue + " is updated successfully",
              //   {
              //     title: "Success",
              //     onClose: function (sAction) {
              //       location.reload();
              //     },
              //   }
              // );
            },
            error: function (xhr, status, error) {
              oBusyIndicator.close();
              console.error("Error:", error);
            },
          });

          function FileUpload() {
            if (filesUpload.length > 0) {
              slug = btsvalue + "," + filevalue;
              onUpload();

            } else {
              handleUploadComplete();
            }
          }

          function onUpload() {

            console.log(slug);
            oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
              name: "Content-Type",
              value: fileType
            }));

            oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
              name: "SLUG",
              value: slug
            }));
            oFileUploader.attachUploadStart(function () {
              oBusyIndicator.open(); // Show the uploading indicator
            });

            // File upload complete event handler
            oFileUploader.attachUploadComplete(function () {
              oBusyIndicator.close(); // Hide the uploading indicator
              handleUploadComplete();
            });

            oFileUploader.upload();
            // if (count === invnavValue.length) {
            //   oFileUploader.upload();
            // } else {
            //   increment();
            // }


          }

          function handleUploadComplete() {
            sap.ui.core.BusyIndicator.hide(); //31
            sap.m.MessageBox.success(
              "BTS ID " + btsvalue + " is updated successfully",
              {
                title: "Success",
                onClose: function (sAction) {
                  location.reload();
                }
              }
            )
          };

        }
      },

      OnDelete: function () {
        var BTSCode = this.getView().byId("BTSCode");
        var Invoice = this.getView().byId("Invoice");
        var Doknr = this.getView().byId("attach");

        var BTSValue = BTSCode.getValue();
        var InvoiceValue = Invoice.getValue();
        var DoknrValue = Doknr.getValue();

        var encodedXblnr = encodeURIComponent(InvoiceValue);

        console.log('Bts:', BTSValue);
        console.log('Invoice:', encodedXblnr);
        console.log('Doknr:', DoknrValue);

        openRejectRemarksPopup();

        function openRejectRemarksPopup() {

          if (!oReasonDialog) {
            var popid = "reasonInput_" + Date.now();
            // Create a dialog for the reason input
            var oReasonDialog = new sap.m.Dialog({
              title: "Reason for Deletion",
              content: [
                new sap.m.Label({
                  text: "Reason:"
                }),
                new sap.m.TextArea({
                  id: popid,
                  // type: sap.m.TextArea.Text,
                  placeholder: "Enter reason here...",
                  width: "100%",
                  rows: 4,
                  maxLength: 500,
                  growing: false,
                  growingMaxLines: 8
                })
              ],
              buttons: [
                new sap.m.Button({
                  text: "Cancel",
                  press: function () {
                    oReasonDialog.close();
                  }
                }),
                new sap.m.Button({
                  text: "Submit",
                  press: function () {
                    var reason = sap.ui.getCore().byId(popid).getValue();
                    if (!reason) {
                      sap.m.MessageToast.show("Please enter a reason for deletion.");
                      return; // Stop submission if reason is not provided
                    } else {
                      //submit function add here

                      console.log('Submitted');
                      var oModel = new sap.ui.model.odata.v2.ODataModel(
                        "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                      );
                      var sEntitySet = "/ZBTS_CRTSet(BTS_ID='" + BTSValue + "',DRAFT_ID='',XBLNR='" + encodedXblnr + "')";

                      var jsonData = {
                        BTS_ID: BTSValue,
                        STATUS: "DELETED",
                        REASON_DEL: reason
                      };
                      console.log("JSON DATA: ", jsonData);

                      oModel.update(sEntitySet, jsonData, {
                        success: function (Odata) {
                          console.log('Data deleted successfully:', Odata);
                          sap.m.MessageBox.success(
                            "BTS ID " + BTSValue + " is deleted successfully",
                            {
                              title: "Success",
                              onClose: function (sAction) {
                                location.reload();
                              },
                            }
                          );
                        },
                        error: function (error) {
                          console.error('Error:', error);
                        }
                      });
                    }
                    oReasonDialog.close();



                  }
                })
              ]
            });
          }
          sap.ui.getCore().byId(popid).setValue("");

          oReasonDialog.open();
        }
      },

      OnBack: function () {
        // Get the router instance
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        // Navigate to a new view using the router
        oRouter.navTo("display_table");
        location.reload();
      },

      onCheckboxSelect: function (oEvent) {
        var bSelected = oEvent.getParameter("selected"); // Get the checkbox state: true if selected, false otherwise

        if (bSelected) {
          // Perform your action when the checkbox is checked
          checkbox = 'X'
          console.log(checkbox);
        } else {
          // Perform your action when the checkbox is unchecked
          checkbox = ' '
          console.log(checkbox);
        }
      },

      onAfterRendering: function () {
        var oMultiInput = this.byId("GRN");
        var oMultiInput1 = this.byId("SES");
        var GRN = this.getView().byId("GRN");
        var SES = this.getView().byId("SES");

        var oTable = this.byId("DraftTable1");
        // Get all rows of the table
        var aRows = oTable.getItems(); // For sap.m.Table or getRows() for sap.ui.table.Table
        aRows.forEach(function (oRow) {
          var aCells = oRow.getCells(); // Assuming MultiInput is directly in the cells; adjust if it's nested
          aCells.forEach(function (oCell) {
            if (oCell instanceof sap.m.MultiInput) {
              var oMultiInput = oCell;


              oMultiInput.attachBrowserEvent("keypress", function (event) {
                // Check if either Enter or Space is pressed
                if (event.key === 'Enter' || event.key === ' ' || event.key === ',') {
                  console.log('Enter or Space is pressed');

                  // Prevent the default action to stop space from being added to the input
                  event.preventDefault();

                  // Get the trimmed value from the MultiInput
                  var grnvalue = oMultiInput.getValue().trim();
                  console.log(grnvalue);

                  // If there's an actual value, proceed to create a token
                  if (grnvalue) {
                    var token = new Token({
                      key: grnvalue,
                      text: grnvalue
                    });

                    // Add the token to the MultiInput
                    oMultiInput.addToken(token);

                    // Clear the input field for the next entry
                    oMultiInput.setValue('');
                  }
                }
              });

            }
          });
        });

        oMultiInput1.attachBrowserEvent("keypress", function (event) {
          if (event.key === 'Enter' || event.key === ' ' || event.key === ',') {
            console.log('Enter is pressed');
            var sesvalue = oMultiInput1.getValue();
            console.log(sesvalue);
            event.preventDefault(); // Prevent the default action

            // Your logic here
            var inputValue1 = oMultiInput1.getValue().trim();
            if (inputValue1) {
              var token1 = new Token({
                key: sesvalue,
                text: sesvalue
              });
              SES.addToken(token1);
              oMultiInput1.setValue(''); // Clear the input field
            }
          }
        });
      },

      NavButton: function () {
        alert("HAHA");
      },

      onDocButton: function (oEvent) {
        sap.ui.core.BusyIndicator.show();
        var oButton = oEvent.getSource();
        var oListItem = oButton.getParent();
        var oBindingContext = oListItem.getBindingContext();
        var sFileName = this.getView().byId("attach").getValue();
        var sbtsid = this.getView().byId("BTSCode").getValue();


        // alert("Filename: " + sFileName);

        if (sFileName === '') {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageBox.error("No document is available");
        }
        else {
          var url = "/sap/opu/odata/sap/ZBTS_ODATA_SRV/ZDRAFT_UPLOADSet(BTS_ID='" + sbtsid + "',DRAFT_ID='')/$value";

          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.responseType = "blob";

          console.log("Setting up xhr request");

          xhr.onreadystatechange = function () {
            console.log("ReadyState changed: ", xhr.readyState);
            if (xhr.readyState === 4) {
              console.log("Request completed with status: ", xhr.status);
              if (xhr.status === 200) {
                var blob = xhr.response;
                console.log("Blob size:", blob.size);
                console.log("Blob type:", blob.type);
                var fileUrl = URL.createObjectURL(blob);
                console.log("File URL:", fileUrl);
                sap.ui.core.BusyIndicator.hide();
                window.open(fileUrl);
              } else {
                sap.m.MessageBox.error("Failed to retrieve file content");
              }
            }
          };

          console.log("Sending xhr request");
          xhr.send();
        }


      },

      onChangeButton: function (oEvent) {

        var file = this.getView().byId("fileUploaderBankMandate");
        file.setVisible(true);
      },

      handleValueChange: function (oEvent) {
        this._file = oEvent.getParameter("files")[0];
        console.log("After file selection");
        console.log(this._file.name);
        console.log(this._file.type);


        var oFileUploader = oEvent.getSource();
        if (this._file.type !== "application/pdf") {
          oFileUploader.setValueState("Error");
          oFileUploader.setValueStateText("Invalid file type. Only PDF files are allowed.");
          // You can also clear the file selection if desired
          oFileUploader.clear();
          return;
        }

        if (this._file.size > 6 * 1024 * 1024) {
          oFileUploader.setValueState("Error");
          oFileUploader.setValueStateText("File size exceeds the maximum limit of 5MB.");
          // Clear the file selection
          oFileUploader.clear();
          return;
        }


        filesUpload.push(this._file);


        console.log("filesUpload: ", filesUpload);

        oFileUploader.setValueState("None");
        oFileUploader.setValueStateText("");

        var oPreviewButton = this.byId("pdfPreviewButton");
        oPreviewButton.setVisible(true);

        // Read the PDF file
        var oReader = new FileReader();
        oReader.onload = function (e) {
          this._pdfContent = e.target.result; // Store the base64 content
        }.bind(this);

        oReader.readAsDataURL(this._file);
      },

      onPreviewPress: function () {
        if (this._pdfContent) {
          // Remove the base64 prefix from the content
          var base64Content = this._pdfContent.split(',')[1]; // Get the base64 part after the comma

          try {
            var byteCharacters = atob(base64Content); // Decoding the base64 PDF content
            var byteNumbers = new Array(byteCharacters.length);

            for (var i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);
            var blob = new Blob([byteArray], { type: "application/pdf" });

            var url = URL.createObjectURL(blob);
            var win = window.open();
            win.document.write('<iframe src="' + url + '" width="100%" height="100%"></iframe>');
          } catch (e) {
            sap.m.MessageToast.show("Failed to preview PDF: " + e.message);
          }
        } else {
          sap.m.MessageToast.show("No PDF available for preview.");
        }
      },

      //uncomment for GeM
      onSelectChange1: function (oEvent) {
        var GemInvNo = this.getView().byId("GemInvNo");
        AdvPay = oEvent.getParameter("selectedItem").getKey();
        // Handle the selection change
        console.log("Selected payment method:", AdvPay);
        gemflag = AdvPay;

        if (AdvPay === 'Yes') {
          GemInvNo.setVisible(true);
          GemInvNo.setEditable(true);
        } else {
          GemInvNo.setVisible(false);
        }
      }

    });
  }
);
