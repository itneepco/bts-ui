sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageBox", "sap/m/Token", "sap/ui/unified/FileUploaderParameter"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageBox, Token, FileUploaderParameter) {
    "use strict";
    var rootValue;
    var rowDataArray = []
    var rowDataArray1 = [];
    let filterdata = [];
    var formattedDate;
    var MBLNR;
    var LBLNI;
    var jsonObjects;
    var povalue;
    var AmountValue;
    var formattedDate;
    var formattedDate1;
    var isoTime;
    var sUserId;
    var created_on;
    var created_by;
    var currentDate;
    var VendorCodeValue;
    var VendorNameValue;
    var advance_payment;
    var EmailValue;
    var ProfitValue;
    var TextValue;
    var RemarkValue;
    var PlantValue;
    var filevalue;
    var gemInvValue;
    var InvtableData = [];
    var GrntableData = [];
    var SestableData = [];
    var csrfToken;
    var CurrencyValue;
    var vval;
    var advpay1;
    var GeMPro1;
    var AdvPay;
    var AdvPay2;
    var val;
    var draftValue;
    let sesItem;
    let invItem;
    let grnItem;
    var sesvalue = [];
    var grnvalue = [];
    var sesvalue1 = [];
    var grnvalue1 = [];
    var custom;
    var dupflag = true;
    var dupflag1 = true;
    var checkbox;
    var imp = true;
    var grnval = true;
    var sesval = true;
    var gemflag;
    var gemflag1;
    var checkBox = true;
    var checkGRNSESVal;
    var checkValue;
    // var plantuser;
    return Controller.extend("bts.controller.Edit", {
      onInit: function () {

        var that = this; // Capture the reference to the controller instance

        this.getOwnerComponent().getService("ShellUIService").then(function (oShellService) {
          oShellService.setBackNavigation(function () {
            // Use 'that' instead of 'this' to refer to the controller instance
            that.OnBack();
          });
        });

        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter
          .getRoute("edit")
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


          formattedDate1 = year1 + '-' + month1 + '-' + day1 + 'T00:00:00';

          created_on = formattedDate1;
          created_by = sUserId;

          console.log("Created On:", created_on);
          console.log("Created By:", created_by);
        }

        var oInput = this.getView().byId("DraftCode");
        oInput.attachBrowserEvent("keypress", function (e) {
          if (e.which === 13 || e.keyCode === 13) {
            // Enter key is pressed
            console.log("Enter pressed");
            // Execute your specific logic here
          }
        }.bind(this));

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
      },

      _onRouteMatched: function (oEvent) {
        console.log("Edit Route");
      },

      onInputChange1: function (oEvent) {
        // Bind the suggestion items with the filtered data
        var oInput = oEvent.getSource();
        var sInputId = oInput.getId();
        sap.ui.getCore().byId(sInputId).setValueState("None");
        var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZBTS_ODATA_SRV/");
        oInput.bindAggregation("suggestionItems", {
          path: "/ZcurrShSet",
          template: new sap.ui.core.Item({
            text: "{WAERS}"
            // text: "{WAERS} {LTEXT}"

          }),
        });

        console.log("Input Currency:", oInput);



        oInput.setModel(oModel);
      },

      onDraftIDHelpRequest: function (oEvent) {
        var that = this; // Capture the controller instance
        var oInput = oEvent.getSource();

        var sInputId = oInput.getId();
        var PO = that.getView().byId('PO');
        var AMOUNT = that.getView().byId('Amount');
        // var CURRENCY = that.getView().byId('Currency');
        var PC = that.getView().byId('Profit');
        var DATE = that.getView().byId('DateField');
        var TEXT = that.getView().byId('Text');
        var VC = that.getView().byId('VendorCode');
        var VN = that.getView().byId('vendorName');
        var VM = that.getView().byId('vendorEmail');
        var VP = that.getView().byId('vendorPhno');
        var EMAIL = that.getView().byId('Email');
        var REMARKS = that.getView().byId('Remarks');
        var Plant = that.getView().byId("Plant");
        var INV = that.getView().byId('Invoice');
        var SES = that.getView().byId('SES');
        var GRN = that.getView().byId('GRN');
        var attach = that.getView().byId('attach');
        var check = that.getView().byId('acceptTermsCheckbox');
        var advpay = that.getView().byId('paymentMethodSelect');
        var grn = this.getView().byId("GRN");
        var ses = this.getView().byId("SES");
        var GeMNo = this.getView().byId("GemInvNo");  //uncomment for Gem
        var GeMPro = this.getView().byId("GeM_Procurement");  //uncomment for Gem
        var checkGRNSES = this.getView().byId("VendorActive");

        grn.removeAllTokens();
        ses.removeAllTokens();

        var invvalue = INV.getValue();

        sap.ui.getCore().byId(sInputId).setValueState("None");

        valueHelp();

        // Function to create and open the value help dialog
        function valueHelp() {
          // Create the value help dialog
          var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
            title: "Draft ID",
            supportMultiselect: false,
            key: "DRAFT_ID",
            descriptionKey: "EBELN",
            // stretch: sap.ui.Device.system.phone,
            ok: function (oControlEvent) {
              var aTokens = oControlEvent.getParameter("tokens");

              if (aTokens.length > 0) {
                var oToken = aTokens[0];
                var draftId = oToken.getKey(); // Extracted Draft ID

                console.log(draftId);
                // Set the input value as before
                sap.ui.getCore().byId(sInputId).setValue(draftId);
                sap.ui.getCore().byId(sInputId).setValueState("None");

                // Now, use the draftId to perform a read operation on ZBTS_CRTSet
                var oModel = that.getView().getModel(); // Assuming your OData Model is already set on the view
                var etentityset = "/ZBTS_CRTSet";
                // var sPath = "/ZBTS_CRTSet(BTS_ID='',DRAFT_ID='" + draftId + "',DOKNR='',XBLNR='')";
                var oFilter = new sap.ui.model.Filter("DRAFT_ID", sap.ui.model.FilterOperator.EQ, draftId);

                oModel.read(etentityset, {
                  urlParameters: {
                    $expand: "HDRTOGRNNAV,HDRTOSESNAV", // Expand the HDRTOGRNNAV navigation property
                    $filter: "DRAFT_ID eq '" + draftId + "'"
                  },
                  success: function (odata) {
                    // Success handler
                    console.log("Data retrieved successfully:", odata);

                    var oData = odata.results[0];
                    rootValue = oData;
                    console.log('Root Value:', rootValue);
                    console.log("DraftID:", oData.DRAFT_ID); // Assuming 'DraftID' is the correct property name
                    PO.setValue(oData.EBELN);
                    GeMNo.setValue(oData.GEM_INV_NO);  //uncomment for Gem
                    AMOUNT.setValue(oData.ZAMT);
                    // CURRENCY.setValue(oData.WAERS);
                    // CurrencyValue = oData.WAERS;
                    PC.setValue(oData.PRCTR);
                    // DATE.setValue(oData.ZDATE);
                    TEXT.setValue(oData.ZTEXT);
                    VC.setValue(oData.LIFNR);
                    VN.setValue(oData.NAME1);
                    EMAIL.setValue(oData.EMAIL_ID);
                    REMARKS.setValue(oData.ZREMARK);
                    Plant.setValue(oData.PLANT);
                    attach.setValue(oData.FILE_ATTACH);
                    custom = oData.CUSTOM_INV;
                    advpay1 = oData.ADVANCE_PAYMENT;
                    GeMPro1 = oData.GEM_INV_NO_FLAG;  //uncomment for Gem
                    gemflag1 = oData.GEM_INV_NO_FLAG;  //uncomment for Gem
                    checkGRNSESVal = oData.CUSTOM_INV;
                    console.log(custom);

                    console.log(advpay1);
                    if (advpay1 === 'X') {
                      advpay.setSelectedKey("Yes");
                    } else {
                      advpay.setSelectedKey("No");
                    }

                    if (GeMPro1 === 'Yes') {  //uncomment for Gem
                      gemflag = "Yes";
                      GeMPro.setSelectedKey("Yes");
                      GeMNo.setVisible(true);
                    } else if (GeMPro1 === 'No') {
                      gemflag = "No";
                      GeMPro.setSelectedKey("No");
                    } else {
                      gemflag = " ";
                      GeMPro.setSelectedKey(" ");
                    }

                    if (checkGRNSESVal === 'X') {
                      checkGRNSES.setSelected(true);
                    } else {
                      checkGRNSES.setSelected(false);
                    }

                    console.log('adv:', advpay); // uncomment for Gem


                    // oSelect.setSelectedKey(advpay);

                    //to get the vendor email and vendor phone number
                    var oFilter1 = new sap.ui.model.Filter("LIFNR", sap.ui.model.FilterOperator.EQ, oData.LIFNR);
                    var oFilter2 = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, oData.EBELN);
                    console.log('PO Filtered', oFilter1);
                    oModel.read("/ZbtspoShSet", {
                      filters: [oFilter1, oFilter2],
                      success: function (oData) {
                        console.log("Filtered Data: ", oData.results);
                        console.log("Vendor Email:", oData.results[0].SMTP_ADDR);
                        VM.setValue(oData.results[0].SMTP_ADDR);
                        VP.setValue(oData.results[0].TELF1);
                      }
                    });


                    //Import Vendor
                    var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZBTS_ODATA_SRV/");
                    var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, oData.EBELN);
                    // var oFilter1 = new sap.ui.model.Filter("LIFNR", sap.ui.model.FilterOperator.EQ, t1.LIFNR);
                    console.log('PO Filtered', oFilter);
                    // console.log('PO Filtered', oFilter1);

                    oModel1.read("/ZbtsImpShSet", {
                      filters: [oFilter],
                      success: function (oData) {
                        console.log("Filtered Data: ", oData.results);

                        if (oData.results.length > 0) {
                          // Perform your action when the checkbox is checked
                          grn.setEnabled(false);
                          ses.setEnabled(false);
                          // curr.setEnabled(true);
                          imp = true;
                        } else {

                          grn.setValue("");
                          grn.setEnabled(true);
                          ses.setEnabled(false);
                          grnval = false;
                          sesval = true;


                          imp = false;
                        }


                      },
                      error: function (oError) {
                        console.error("Data fetch error: ", oError);
                      }
                    });
                    //Import Vendor

                    oModel.read("/ZbtsImpShSet", {
                      filters: [oFilter1, oFilter2],
                      success: function (oData) {
                        console.log("Filtered Data: ", oData.results);

                        if (oData.results.length > 0) {
                          // Perform your action when the checkbox is checked
                          GRN.setEnabled(false);
                          SES.setEnabled(false);
                          // CURRENCY.setEnabled(true);
                          // CURRENCY.setValue(CurrencyValue);
                          imp = true;
                        } else {
                          GRN.setEnabled(true);
                          SES.setEnabled(true);
                          // CURRENCY.setEnabled(false);
                          // CURRENCY.setValue("");
                        }
                      }
                    });

                    if (custom === 'X') {
                      check.setSelected(true);
                    }

                    console.log('Currency Value:', CurrencyValue);




                    INV.setValue(oData.XBLNR);

                    var dateString = decodeURIComponent(oData.ZDATE);
                    var date = new Date(dateString);

                    // Extract year, month, and day components
                    var year = date.getFullYear();
                    var month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding 1 because month index starts from 0
                    var day = ('0' + date.getDate()).slice(-2);

                    // Construct the formatted date string in "YYYY-MM-DD" format
                    var formattedDate = year + '-' + month + '-' + day;

                    console.log(formattedDate); // Output: "2024-03-07"
                    DATE.setValue(formattedDate);

                    let rowDataArray = []; // Array to hold all row data
                    // let filterdata = []; // Array to hold filtered data for later use
                    let rowData = [];

                    // Handling HDRTOGRNNAV results
                    console.log('Odata data:', oData);
                    let grnLength = oData.HDRTOGRNNAV && oData.HDRTOGRNNAV.results ? oData.HDRTOGRNNAV.results.length : 0;
                    let sesLength = oData.HDRTOSESNAV && oData.HDRTOSESNAV.results ? oData.HDRTOSESNAV.results.length : 0;
                    let invLength = oData.HDRTOINVNAV && oData.HDRTOINVNAV.results ? oData.HDRTOINVNAV.results.length : 0;

                    // Use Math.max to find the greatest length
                    let greatestLength = Math.max(grnLength, sesLength, invLength);

                    console.log(`Greatest Length: ${greatestLength}`);
                    // Handling HDRTOGRNNAV results
                    for (var i = 0; i < greatestLength; i++) {
                      if (oData.HDRTOGRNNAV && oData.HDRTOGRNNAV.results) {
                        // for (let i = 0; i < oData.HDRTOGRNNAV.results.length; i++) {
                        grnItem = oData.HDRTOGRNNAV.results[i];
                        if (grnItem) {
                          var token = new Token({
                            key: grnItem.MBLNR,
                            text: grnItem.MBLNR
                          });
                          GRN.addToken(token);
                        }


                        console.log("GRN Item:", grnItem);
                        filterdata.push(grnItem); // Storing the GRN item for later use
                      }
                      if (oData.HDRTOSESNAV && oData.HDRTOSESNAV.results) {
                        // for (let i = 0; i < oData.HDRTOSESNAV.results.length; i++) {
                        sesItem = oData.HDRTOSESNAV.results[i];
                        if (sesItem) {
                          var tokenS = new Token({
                            key: sesItem.LBLNI,
                            text: sesItem.LBLNI
                          });
                          SES.addToken(tokenS);
                        }

                        console.log("SES Item:", sesItem); // Corrected log to say "SES Item"
                        filterdata.push(sesItem); // Storing the SES item for later use
                      }
                      // if (oData.HDRTOINVNAV && oData.HDRTOINVNAV.results) {
                      //   // for (let i = 0; i < oData.HDRTOINVNAV.results.length; i++) {
                      //   invItem = oData.HDRTOINVNAV.results[i];
                      //   console.log("INV Item:", invItem); // Corrected log to say "INV Item"
                      //   filterdata.push(invItem); // Storing the INV item for later use
                      // }
                      rowData = {
                        MBLNR: grnItem?.MBLNR || '',
                        LBLNI: sesItem?.LBLNI || '',
                        // XBLNR: invItem?.XBLNR || ''

                      };

                      if (rowData && (rowData.MBLNR || rowData.LBLNI || rowData.XBLNR)) {
                        rowDataArray.push(rowData); // Add rowData to the array
                        console.log("Unified Row Data Array:", rowDataArray);
                      }

                    }


                    console.log("Unified Row Data Array:", rowDataArray);


                    var table = that.getView().byId("DraftTable1");
                    if (table) {
                      console.log("Table found");
                      var oTableModel = new sap.ui.model.json.JSONModel({
                        rowDataArray: rowDataArray
                      });
                      console.log('BTS Data:', rowDataArray);
                      table.setModel(oTableModel, "rowDataArray");
                    } else {
                      console.error("Table not found or undefined");
                    }

                  },
                  error: function (oError) {
                    // Error handler
                    console.error("Error retrieving data:", oError);
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
                label: "Draft ID",
                template: "DRAFT_ID",
              },
              {
                label: "Purchase Order",
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

          // var oFilter = new sap.ui.model.Filter("PLANT", sap.ui.model.FilterOperator.EQ, plantuser);
          // console.log('FIlter',oFilter);
          oDialog.getTable().setModel(oModel);
          oDialog.getTable().bindAggregation("rows", {
            path: "/ZbtsDidShSet",
            // filters: [oFilter]
          });

          // Open the value help dialog
          oDialog.open();
        }
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
                var sSelectedPO = oToken.getKey();
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
        // var Currency = this.getView().byId("Currency");
        sap.ui.getCore().byId(sInputId).setValueState("None");

        var VendorCode = this.byId("VendorCode");
        var vendorName = this.byId("vendorName");
        var venemail = this.getView().byId("vendorEmail");
        var venphone = this.getView().byId("vendorPhno");
        var checkGRNSES = this.getView().byId("VendorActive").getSelected();

        if (checkGRNSES === true) {
          grn.setEnabled(false);
          ses.setEnabled(false);
          grn.removeAllTokens();
          ses.removeAllTokens();
        } else {
          grn.setEnabled(true);
          ses.setEnabled(true);
        }

        var oModel = new sap.ui.model.odata.v2.ODataModel(
          "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
        );
        var sPath = "/ZpoShSet('" + PO + "')";
        oModel.read(sPath, {
          success: function (oData) {
            console.log('BTS fetch doc type:', oData);
            // if (oData.WEBRE === '' && oData.LEBRE === '') {
            //   GR_PO = false;
            //   SES_PO = false;
            // } else if (oData.WEBRE === 'X' && oData.LEBRE === '') {
            //   GR_PO = true;
            //   SES_PO = false;
            // } else if (oData.WEBRE === '' && oData.LEBRE === 'X') {
            //   GR_PO = false;
            //   SES_PO = true;
            // } else if (oData.WEBRE === '') {
            //   GR_PO = false;
            // } else if (oData.LEBRE === '') {
            //   SES_PO = false;
            // }

            if (oData.BSART === 'ZSTA' || oData.BSART === 'ZSTO') {
              valueHelp1();
              function valueHelp1() {
                // Create the value help dialog
                var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
                  title: "Supplying Plant",
                  supportMultiselect: false,
                  supportRanges: false,
                  key: "RESWK",
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

                      VendorCode.setValue(t1.RESWK);
                      vendorName.setValue(t1.NAME1);
                      // venemail.setValue(t1.SMTP_ADDR);
                      // venphone.setValue(t1.TELF1);

                      //Import Vendor
                      var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZBTS_ODATA_SRV/");
                      var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
                      // var oFilter1 = new sap.ui.model.Filter("LIFNR", sap.ui.model.FilterOperator.EQ, t1.LIFNR);
                      console.log('PO Filtered', oFilter);
                      // console.log('PO Filtered', oFilter1);

                      oModel1.read("/ZbtsImpShSet", {
                        filters: [oFilter],
                        success: function (oData) {
                          console.log("Filtered Data: ", oData.results);

                          if (oData.results.length > 0) {
                            // Perform your action when the checkbox is checked
                            grn.setEnabled(false);
                            ses.setEnabled(false);
                            // curr.setEnabled(true);
                            imp = true;
                          } else {

                            grn.setValue("");
                            grn.setEnabled(true);
                            ses.setEnabled(false);
                            grnval = false;
                            sesval = true;


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
                      label: "Supplying Plant",
                      template: "RESWK",
                    },
                    {
                      label: "Description",
                      template: "NAME1",
                    }
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
                var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
                console.log('PO Filtered', oFilter);

                oModel.read("/ZsuppPlantShSet", {
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
                //   filters: [oFilter]
                // });

                // Open the value help dialog
                oDialog.open();
              }
            } else {
              // Function to create and open the value help dialog
              valueHelp();
              function valueHelp() {
                // Create the value help dialog
                var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
                  title: "Vendor Code",
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
                      venemail.setValue(t1.SMTP_ADDR);
                      venphone.setValue(t1.TELF1);

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
                            // curr.setEnabled(true);
                            imp = true;
                          } else if (checkGRNSES === true) {
                            grn.setEnabled(false);
                            ses.setEnabled(false);
                            grn.removeAllTokens();
                            ses.removeAllTokens();
                          } else {
                            // curr.setEnabled(false);
                            // curr.setValue("INR");
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
                                  // if (GR_PO === false) {
                                  //   console.log('GR Based PO');
                                  //   grn.setEnabled(false);
                                  //   ses.setEnabled(false);
                                  //   grn.removeAllTokens();
                                  //   ses.removeAllTokens();
                                  //   // curr.setEnabled(true);
                                  //   imp = true;
                                  // } else {
                                  grn.setEnabled(true);
                                  ses.setEnabled(false);
                                  grn.removeAllTokens();
                                  ses.removeAllTokens();
                                  grnval = true;
                                  sesval = false;
                                  // }
                                } else if (oData.BSART === 'ZSRV' || oData.BSART === 'ZPSR' || oData.BSART === 'ZIMS' || oData.BSART === 'ZEMS') {
                                  console.log('SES is Mandatory');
                                  // if (SES_PO === false) {
                                  //   console.log('SES Based PO');
                                  //   grn.setEnabled(false);
                                  //   ses.setEnabled(false);
                                  //   grn.removeAllTokens();
                                  //   ses.removeAllTokens();
                                  //   // curr.setEnabled(true);
                                  //   imp = true;
                                  // }
                                  // else {
                                  grn.setEnabled(false);
                                  ses.setEnabled(true);
                                  grn.removeAllTokens();
                                  ses.removeAllTokens();
                                  grnval = false;
                                  sesval = true;
                                  // }
                                } else if (oData.BSART === 'ZINS' || oData.BSART === 'FO') {
                                  console.log('Insurance PO');
                                  grn.setEnabled(false);
                                  ses.setEnabled(false);
                                  grn.removeAllTokens();
                                  ses.removeAllTokens();
                                  // curr.setEnabled(true);
                                  imp = true;
                                } else if (oData.BSART === 'ZLOC' || oData.BSART === 'ZTUR' || oData.BSART === 'ZCTU') { //Added on 11.08.2025 for GR and SES based PO
                                  console.log('GRN and SES is Mandatory');
                                  // if (SES_PO === false && GR_PO === false) {
                                  //   console.log('GRN and SES Based PO');
                                  //   grn.setEnabled(false);
                                  //   ses.setEnabled(false);
                                  //   grn.removeAllTokens();
                                  //   ses.removeAllTokens();
                                  //   // curr.setEnabled(true);
                                  //   imp = true;
                                  // } else if (SES_PO === false && GR_PO === true) {
                                  //   grn.setEnabled(true);
                                  //   ses.setEnabled(false);
                                  //   grn.removeAllTokens();
                                  //   ses.removeAllTokens();
                                  //   grnval = true;
                                  //   sesval = false;
                                  // } else if (SES_PO === true && GR_PO === false) {
                                  //   grn.setEnabled(false);
                                  //   ses.setEnabled(true);
                                  //   grn.removeAllTokens();
                                  //   ses.removeAllTokens();
                                  //   grnval = false;
                                  //   sesval = true;
                                  // } else {
                                  grn.setEnabled(true);
                                  ses.setEnabled(true);
                                  grn.removeAllTokens();
                                  ses.removeAllTokens();
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
                    {
                      label: "Vendor Email",
                      template: "SMTP_ADDR",
                    },
                    {
                      label: "Vendor Phone Number",
                      template: "TELF1",
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
                var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
                console.log('PO Filtered', oFilter);

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
                //   filters: [oFilter]
                // });

                // Open the value help dialog
                oDialog.open();
              }
            }
          }
        });
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
            path: "/ZpridShSet"
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
                  oMultiInput.addToken(new sap.m.Token({
                    text: oToken.getKey()
                  }));
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
          var grnarray = [];
          var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
          oModel.read("/ZbtsgrnShSet", {
            filters: [oFilter],
            success: function (oData) {
              console.log("ODATAGRN: ", oData.results);
              // Open the value help dialog
              grnarray = oData.results;
              // Create a JSONModel and set the data array
              var oJsonModel = new sap.ui.model.json.JSONModel();
              oJsonModel.setData({ rows: grnarray });

              oDialog.getTable().setModel(oJsonModel);
              oDialog.getTable().bindAggregation("rows", {
                path: "/rows", // Path to the array in the JSONModel
              });

              oDialog.open();
            },
            error: function () {

            }
          });


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
                  oMultiInput.addToken(new sap.m.Token({
                    text: oToken.getKey()
                  }));
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

          var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
          oDialog.getTable().setModel(oModel);
          oDialog.getTable().bindAggregation("rows", {
            path: "/ZbtssesShSet",
            filters: [oFilter]
          });

          // Open the value help dialog
          oDialog.open();
        }
      },

      onCURRHelpRequest: function (oEvent) {
        var oInput = oEvent.getSource();
        var sInputId = oInput.getId();
        var PO = this.getView().byId("PO").getValue();
        var grn = this.getView().byId("GRN");
        var ses = this.getView().byId("SES");
        var curr = this.getView().byId("Currency");
        sap.ui.getCore().byId(sInputId).setValueState("None");
        console.log('PO value', PO);

        var VendorCode = this.byId("VendorCode");
        var vendorName = this.byId("vendorName");
        var venemail = this.getView().byId("vendorEmail");
        var venphone = this.getView().byId("vendorPhno");

        // Invoke the value help function
        valueHelp();

        // Function to create and open the value help dialog
        function valueHelp() {
          // Create the value help dialog
          var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
            title: "Currency",
            supportMultiselect: false,
            supportRanges: false,
            key: "WAERS",
            descriptionKey: "LTEXT",
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

                // VendorCode.setValue(t1.LIFNR);
                // vendorName.setValue(t1.NAME1);
                // venemail.setValue(t1.SMTP_ADDR);
                // venphone.setValue(t1.TELF1);

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
                      curr.setEnabled(true);
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
                label: "Currency",
                template: "WAERS",
              },
              {
                label: "Description",
                template: "LTEXT",
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
          var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
          console.log('PO Filtered', oFilter);

          oModel.read("/ZcurrShSet", {
            // filters: [oFilter],
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
          //   filters: [oFilter]
          // });

          // Open the value help dialog
          oDialog.open();
        }
      },

      OnBack: function () {
        // Get the router instance
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        // Navigate to a new view using the router
        oRouter.navTo("RouteHome");
        location.reload();
      },

      OnEdit: function () {

        var filteredData = [];
        var DraftID = this.getView().byId("DraftCode");
        var po = this.getView().byId("PO");
        var povalue = po.getValue();
        var ven = this.getView().byId("VendorCode");
        var venvalue = ven.getValue();
        var Plant = this.getView().byId("Plant");
        PlantValue = Plant.getValue();
        var doc = this.getView().byId("attach");
        var docvalue = doc.getValue();
        var viewbut = this.getView().byId("b1");
        var changebut = this.getView().byId("b2");
        var checkb = this.getView().byId("acceptTermsCheckbox");
        var draftvalue = DraftID.getValue();
        var text = this.getView().byId("id2");
        var file = this.getView().byId("fileUploaderBankMandate");
        var grn = this.getView().byId("GRN");
        var ses = this.getView().byId("SES");
        var checkGRNSES = this.getView().byId("VendorActive").getSelected();

        if (!docvalue) {
          file.setVisible(true);
          text.setVisible(false);
          doc.setVisible(false);
          viewbut.setVisible(false);
          changebut.setVisible(false);
        } else {
          doc.setVisible(true);
          viewbut.setVisible(false);
          changebut.setVisible(true);
        }
        var oModel = new sap.ui.model.odata.v2.ODataModel(
          "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
        );

        //Import Vendor
        var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZBTS_ODATA_SRV/");
        var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, povalue);
        var oFilter1 = new sap.ui.model.Filter("LIFNR", sap.ui.model.FilterOperator.EQ, venvalue);
        console.log('PO Filtered', oFilter);
        console.log('PO Filtered', oFilter1);
        var oModel = new sap.ui.model.odata.v2.ODataModel(
          "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
        );
        // var sPath = "/ZpoShSet('" + povalue + "')";
        // oModel.read(sPath, {
        //   success: function (oData) {
        //     console.log('BTS fetch doc type:', oData);
        //     // if (oData.WEBRE === '' && oData.LEBRE === '') {
        //     //   GR_PO = false;
        //     //   SES_PO = false;
        //     //   grn.setEnabled(false);
        //     //   ses.setEnabled(false);
        //     //   imp = true;
        //     // } else if (oData.WEBRE === 'X' && oData.LEBRE === '') {
        //     //   GR_PO = true;
        //     //   SES_PO = false;
        //     //   grn.setEnabled(true);
        //     //   ses.setEnabled(false);
        //     //   imp = true;
        //     // } else if (oData.WEBRE === '' && oData.LEBRE === 'X') {
        //     //   GR_PO = false;
        //     //   SES_PO = true;
        //     //   grn.setEnabled(false);
        //     //   ses.setEnabled(true);
        //     //   imp = true;
        //     // } else if (oData.WEBRE === '') {
        //     //   GR_PO = false;
        //     //   grn.setEnabled(false);
        //     //   ses.setEnabled(false);
        //     //   imp = true;
        //     // } else if (oData.LEBRE === '') {
        //     //   SES_PO = false;
        //     //   grn.setEnabled(false);
        //     //   ses.setEnabled(false);
        //     //   imp = true;
        //     // }
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
              // curr.setEnabled(true);
              imp = true;
            } else if (checkGRNSES === true) {
              checkBox = false;
              grn.setEnabled(false);
              ses.setEnabled(false);
              grn.removeAllTokens();
              ses.removeAllTokens();
            } else {
              checkBox = true;
              // curr.setEnabled(false);
              // curr.setValue("INR");
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

        oModel.read("/ZBTS_CRTSet", {
          success: function (oData) {
            filteredData = oData.results.filter(function (entity) {
              return entity.DRAFT_ID === draftvalue;
            });
            console.log(" DRAFT ID successfully:", filteredData);
            // console.log("Draft Created by:", filteredData[0].CREATED_BY);
            if (created_by === filteredData[0].CREATED_BY) {
              Plant.setEditable(true);
            } else {
              Plant.setEditable(false);
            }
          },
          error: function () {
            // Handle error
            console.log("Error in fetching entities");
          },
        });

        if (!DraftID.getValue()) {
          DraftID.setValueState("Error");
          sap.ui.core.BusyIndicator.hide();
          MessageBox.error("Please fill Draft ID Field", {
            onClose: function () {
              DraftID.focus(); //
            },
          });
          return;
        }

        var GeMNo = this.getView().byId("GemInvNo");  //uncomment for Gem
        GeMNo.setEditable(true);

        var GeMPro = this.getView().byId("GeM_Procurement");  //uncomment for Gem
        GeMPro.setEnabled(true);

        var VendorCode = this.getView().byId("VendorCode");
        VendorCode.setEditable(true);

        var CheckBox = this.getView().byId("VendorActive");
        CheckBox.setEditable(true);

        var PO = this.getView().byId("PO");
        PO.setEditable(true);

        var Amount = this.getView().byId("Amount");
        Amount.setEditable(true);

        var DateField = this.getView().byId("DateField");
        DateField.setEditable(true);

        var ProfitCenter = this.getView().byId("Profit");
        ProfitCenter.setEditable(true);

        var Text = this.getView().byId("Text");
        Text.setEditable(true);

        var Remarks = this.getView().byId("Remarks");
        Remarks.setEditable(true);

        var Plants = this.getView().byId("Plant");
        Plants.setEditable(true);

        var Edit = this.getView().byId("Edit");
        Edit.setVisible(false);

        var Submit = this.getView().byId("Save");
        Submit.setVisible(true);

        var Cancel = this.getView().byId("Cancel");
        Cancel.setVisible(true);

        var advancepayment = this.getView().byId("paymentMethodSelect");
        advancepayment.setEnabled(true);

        var DraftOnAddRow = this.getView().byId("DraftOnAddRow");
        var DraftOnDeleteRow = this.getView().byId("DraftOnDeleteRow");
        // Get a reference to the table
        var table = this.getView().byId("DraftTable1");

        // Get all items (rows) of the table
        var items = table.getItems();

        // Log the number of rows
        console.log("Number of rows:", items.length);

        if (items.length > 1) {
          DraftOnAddRow.setVisible(true);
          DraftOnDeleteRow.setVisible(true);
        } else {
          DraftOnAddRow.setVisible(true);
          DraftOnDeleteRow.setVisible(false);
        }

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
      },

      onCancel: function () {
        var that = this;
        var data = rootValue;
        console.log(data);
        console.log(filterdata);

        var VendorCode = this.getView().byId("VendorCode");
        var PO = this.getView().byId("PO");
        var Amount = this.getView().byId("Amount");
        var DateField = this.getView().byId("DateField");
        var ProfitCenter = this.getView().byId("Profit");
        var Text = this.getView().byId("Text");
        var Remarks = this.getView().byId("Remarks");
        var Plant = this.getView().byId("Plant");
        var checkbox = this.getView().byId("acceptTermsCheckbox");
        var DraftOnAddRow = this.getView().byId("DraftOnAddRow");
        var DraftOnDeleteRow = this.getView().byId("DraftOnDeleteRow");
        var check = this.getView().byId("acceptTermsCheckbox");
        var file = that.getView().byId("fileUploaderBankMandate");
        var change = that.getView().byId("b2");
        var document = this.getView().byId("attach");
        var viewbutton = this.getView().byId("b1");
        var grn = this.getView().byId("GRN");
        var ses = this.getView().byId("SES");
        var advancepayment = this.getView().byId("paymentMethodSelect");
        var checkGRNSES = this.getView().byId("VendorActive");
        var advpaydata;
        console.log(custom);

        // var changebutton = this.getView().byId("b2");
        var GeMNo = this.getView().byId("GemInvNo");  //uncomment for Gem
        var GeMPro = this.getView().byId("GeM_Procurement");

        var gemproval = data.GEM_INV_NO_FLAG;

        GeMPro.setEnabled(false);
        console.log(gemproval);
        if (gemproval === "Yes") {
          GeMNo.setValue(data.GEM_INV_NO);
          GeMNo.setVisible(true);
          GeMNo.setEditable(false);
        } else if (gemproval === "No") {
          GeMNo.setVisible(false);
          GeMNo.setEditable(false);
        } else {
          GeMNo.setVisible(false);
          GeMNo.setEditable(false);
        }  //uncomment for Gem

        GeMPro.setSelectedKey(data.GEM_INV_NO_FLAG);  //uncomment for Gem
        GeMNo.setValue(data.GEM_INV_NO);  //uncomment for Gem

        file.setVisible(false);
        document.setVisible(true);
        viewbutton.setVisible(true);
        // changebutton.setVisible(false);

        //to set the fields to previous values

        VendorCode.setValue(data.LIFNR);
        PO.setValue(data.EBELN);
        Amount.setValue(data.ZAMT);
        ProfitCenter.setValue(data.PRCTR);
        Text.setValue(data.ZTEXT);
        Remarks.setValue(data.ZREMARK);
        Plant.setValue(data.PLANT);
        advpaydata = data.ADVANCE_PAYMENT;
        checkGRNSESVal = data.CUSTOM_INV;
        if (advpaydata === 'X') {
          advancepayment.setSelectedKey("Yes");
        } else {
          advancepayment.setSelectedKey("No");
        }

        if (checkGRNSESVal === 'X') {
          checkGRNSES.setSelected(true);
        } else {
          checkGRNSES.setSelected(false);
        }

        // var custom = data.CUSTOM_INV;
        // console.log(custom);
        // if (custom === 'X') {
        //   check.setSelected(true);
        // }

        var dateString = decodeURIComponent(data.ZDATE);
        var date = new Date(dateString);

        // Extract year, month, and day components
        var year = date.getFullYear();
        var month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding 1 because month index starts from 0
        var day = ('0' + date.getDate()).slice(-2);

        // Construct the formatted date string in "YYYY-MM-DD" format
        var formattedDate = year + '-' + month + '-' + day;

        console.log('formatted date:', formattedDate);

        DateField.setValue(formattedDate);


        //to disable the fields
        PO.setEditable(false);
        Amount.setEditable(false);
        ProfitCenter.setEditable(false);
        DateField.setEditable(false);
        Text.setEditable(false);
        VendorCode.setEditable(false);
        Remarks.setEditable(false);
        Plant.setEditable(false);
        // checkbox.setEditable(false);
        file.setVisible(false);
        change.setVisible(false);
        advancepayment.setEnabled(false);
        grn.setEnabled(false);
        ses.setEnabled(false);

        // var GeMNo = this.getView().byId("GemInvNo");
        // GeMNo.setEditable(false);

        // var GeMPro = this.getView().byId("GeM_Procurement");
        // GeMPro.setEnabled(false);

        var Edit = this.getView().byId("Edit");
        Edit.setVisible(true);

        var Cancel = this.getView().byId("Cancel");
        Cancel.setVisible(false);

        var Submit = this.getView().byId("Save");
        Submit.setVisible(false);

        var CheckBox = this.getView().byId("VendorActive");
        CheckBox.setEditable(false);

        DraftOnAddRow.setVisible(false);
        DraftOnDeleteRow.setVisible(false);

        // Get a reference to the table
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

        rowDataArray = [];
        for (var i = 0; i < filterdata.length; i++) {
          var rowData = {
            MBLNR: filterdata[i]?.MBLNR,
            LBLNI: filterdata[i]?.LBLNI,
            XBLNR: filterdata[i]?.XBLNR
          };
          if (rowData && (rowData.MBLNR || rowData.LBLNI || rowData.XBLNR)) {
            rowDataArray.push(rowData); // Add rowData to the array
          }

        }
        console.log("Row Data Array:", rowDataArray);


        // Set rowDataArray as a model for the table

        var table = that.getView().byId("DraftTable1");
        if (table) {
          console.log("Table found");
          var oTableModel = new sap.ui.model.json.JSONModel({
            rowDataArray: rowDataArray
          });
          console.log('BTS Data:', rowDataArray);
          table.setModel(oTableModel, "rowDataArray");
        } else {
          console.error("Table not found or undefined");
        }


      },

      OnAddRowPress: function () {
        var that = this;
        var deleteButton = this.getView().byId("DraftOnDeleteRow");
        var oTable = this.getView().byId("DraftTable1");
        var oItems = oTable.getItems();

        addNewRow(oTable);


        function addNewRow(oTable) {
          deleteButton.setVisible(true);

          var attachKeyPressToMultiInput = function (oMultiInput) {
            oMultiInput.attachBrowserEvent("keypress", function (event) {
              if (event.key === 'Enter' || event.key === ' ' || event.key === ',') {
                event.preventDefault();
                var inputValue = oMultiInput.getValue().trim();
                console.log(inputValue);

                if (inputValue) {
                  // Assuming sap.m.Token is imported
                  var token = new sap.m.Token({
                    key: inputValue,
                    text: inputValue
                  });
                  oMultiInput.addToken(token);
                  oMultiInput.setValue('');
                }
              }
            });
          };


          // Create a new ColumnListItem with the required controls
          if (imp) {
            var oColumnListItem = new sap.m.ColumnListItem({
              cells: [
                new sap.m.Input({
                  width: "100%"
                }),
                new sap.m.Input({
                  width: "100%"
                }),
                new sap.m.MultiInput({
                  width: "100%",
                  showValueHelp: true,
                  valueHelpRequest: that.onGRNHelpRequest.bind(that),
                  enabled: false
                }),
                new sap.m.MultiInput({
                  width: "100%",
                  showValueHelp: true,
                  valueHelpRequest: that.onSESHelpRequest.bind(that),
                  enabled: false
                }),
                new sap.m.Input({
                  width: "100%"
                }),
                new sap.ui.unified.FileUploader({

                  placeholder: "Upload Attachment",
                }),
              ],
            });
          } else {
            var oColumnListItem = new sap.m.ColumnListItem({
              cells: [
                new sap.m.Input({
                  width: "100%"
                }),
                new sap.m.Input({
                  width: "100%"
                }),
                new sap.m.MultiInput({
                  width: "100%",
                  showValueHelp: true,
                  valueHelpRequest: that.onGRNHelpRequest.bind(that),
                }),
                new sap.m.MultiInput({
                  width: "100%",
                  showValueHelp: true,
                  valueHelpRequest: that.onSESHelpRequest.bind(that),
                }),
                new sap.m.Input({
                  width: "100%"
                }),
                new sap.ui.unified.FileUploader({

                  placeholder: "Upload Attachment",
                }),
              ],
            });
          }


          attachKeyPressToMultiInput(oColumnListItem.getCells()[2]); // For GRN MultiInput
          attachKeyPressToMultiInput(oColumnListItem.getCells()[3]); // For SES MultiInput

          // Add the new row to the table
          oTable.addItem(oColumnListItem);
        }

        // Define the valueHelpRequest event function for GRN
        function onGRNHelpRequest(oEvent) {
          // Your valueHelpRequest event logic for GRN here
          var oInput = oEvent.getSource();
          var sInputId = oInput.getId();
          var PO = that.getView().byId("PO").getValue();
          sap.ui.getCore().byId(sInputId).setValueState("None");

          valueHelp();

          // Function to create and open the value help dialog
          function valueHelp() {
            // Create the value help dialog
            var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
              title: "GRN Nmber",
              supportMultiselect: false,
              supportRanges: false,
              key: "MBLNR",
              descriptionKey: "MBLNR",
              stretch: sap.ui.Device.system.phone,
              ok: function (oControlEvent) {
                var aTokens = oControlEvent.getParameter("tokens");
                console.log("Token: ", aTokens);

                if (aTokens.length > 0) {
                  var oToken = aTokens[0];
                  sap.ui.getCore().byId(sInputId).setValue(oToken.getKey());
                  sap.ui.getCore().byId(sInputId).setValueState("None");

                  var t1 = oToken.mAggregations.customData[0].mProperties.value;

                }

                oDialog.close();
              },
              cancel: function () {
                oDialog.close();
              },
            });

            // Define the search help table columns and model
            var oColModel = new sap.ui.model.json.JSONModel({
              cols: [{
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

            oDialog.getTable().setModel(oModel);
            var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
            oDialog.getTable().bindAggregation("rows", {
              path: "/ZbtsgrnShSet",
              filters: [oFilter]
            });

            // Open the value help dialog
            oDialog.open();
          }
        }

        function onSESHelpRequest(oEvent) {
          // Your valueHelpRequest event logic for GRN here
          var oInput = oEvent.getSource();
          var sInputId = oInput.getId();
          var PO = that.getView().byId("PO").getValue();
          sap.ui.getCore().byId(sInputId).setValueState("None");

          valueHelp();

          // Function to create and open the value help dialog
          function valueHelp() {
            // Create the value help dialog
            var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
              title: "SES Nmber",
              supportMultiselect: false,
              supportRanges: false,
              key: "LBLNI",
              descriptionKey: "LBLNI",
              stretch: sap.ui.Device.system.phone,
              ok: function (oControlEvent) {
                var aTokens = oControlEvent.getParameter("tokens");
                console.log("Token: ", aTokens);

                if (aTokens.length > 0) {
                  var oToken = aTokens[0];
                  sap.ui.getCore().byId(sInputId).setValue(oToken.getKey());
                  sap.ui.getCore().byId(sInputId).setValueState("None");

                  var t1 = oToken.mAggregations.customData[0].mProperties.value;

                }

                oDialog.close();
              },
              cancel: function () {
                oDialog.close();
              },
            });

            // Define the search help table columns and model
            var oColModel = new sap.ui.model.json.JSONModel({
              cols: [{
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

            oDialog.getTable().setModel(oModel);
            var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
            oDialog.getTable().bindAggregation("rows", {
              path: "/ZbtssesShSet",
              filters: [oFilter]
            });

            // Open the value help dialog
            oDialog.open();
          }
        }

      },

      OnDeleteRowPress: function () {
        var oTable = this.getView().byId("DraftTable1");
        var aItems = oTable.getItems();
        var NoofRows = aItems.length;
        var lastRow = aItems.length - 1;
        console.log("Number of rows: " + NoofRows);
        console.log(lastRow);
        var deleteButton = this.getView().byId("DraftOnDeleteRow");
        if (NoofRows > 1) {
          var oLastItem = aItems[lastRow];
          oTable.removeItem(oLastItem);
          console.log("Last row deleted.");
        }

        var oTable1 = this.getView().byId("DraftTable1");
        var aItems1 = oTable1.getItems();
        var NoofRows1 = aItems1.length;
        console.log("Number of rows: " + NoofRows1);
        if (NoofRows1 === 1) {
          deleteButton.setVisible(false);
        } else {
          deleteButton.setVisible(true);
        }
      },

      OnSave: function () {
        sap.ui.core.BusyIndicator.show();
        dupflag = true;
        dupflag1 = true;

        var that = this;
        var grnnavValue = [];
        var sesnavValue = [];
        var invnavValue = [];
        var draftid = this.getView().byId("DraftCode").getValue();
        var VendorCode = this.getView().byId("VendorCode");
        var vendoremail = this.getView().byId("vendorEmail");
        var vendorphno = this.getView().byId("vendorPhno");
        var name1 = this.getView().byId("vendorName");
        var PO = this.getView().byId("PO");
        var Invoice = this.getView().byId("Invoice");
        var Amount = this.getView().byId("Amount");
        // var Currency = this.getView().byId("Currency");
        var DateField = this.getView().byId("DateField");
        var ProfitCenter = this.getView().byId("Profit");
        var Email = this.getView().byId("Email");
        var Text = this.getView().byId("Text");
        var Remarks = this.getView().byId("Remarks");
        var Plant = this.getView().byId("Plant");
        var DraftAttach = this.getView().byId("attach");
        var DraftAttachValue = DraftAttach.getValue();
        var fileattach = this.getView().byId("fileUploaderBankMandate");
        var newfilevalue = fileattach.getValue();
        var advance = this.getView().byId("paymentMethodSelect");
        var GemInvNo = this.getView().byId("GemInvNo");  //uncomment for Gem
        var GeM_Procurement = this.getView().byId("GeM_Procurement"); //uncomment for Gem

        var Save = that.getView().byId("Save");
        // var Back = that.getView().byId("Back");

        Save.setEnabled(false);
        // Back.setEnabled(false);

        console.log('Advance:', advance);

        var dateValue = DateField.getDateValue();
        console.log('Date Value:', dateValue);

        var year = dateValue.getFullYear();
        var month = ('0' + (dateValue.getMonth() + 1)).slice(-2);
        var day = ('0' + dateValue.getDate()).slice(-2);
        var hours = ('0' + currentDate.getHours()).slice(-2);
        var minutes = ('0' + currentDate.getMinutes()).slice(-2);
        var seconds = ('0' + currentDate.getSeconds()).slice(-2);

        isoTime = `PT${hours}H${minutes}M${seconds}S`;

        console.log(isoTime);

        formattedDate = year + '-' + month + '-' + day + 'T00:00:00';
        console.log(formattedDate);

        console.log("Vendor Code:", VendorCode.getValue());
        console.log("Vendor Name:", name1.getValue());
        console.log("PO:", PO.getValue());
        console.log("Invoice:", Invoice.getValue());
        console.log("Amount:", Amount.getValue());
        console.log("Date:", DateField.getDateValue());
        console.log("Profit Center:", ProfitCenter.getValue());
        console.log("Text:", Text.getValue());
        console.log("Remarks:", Remarks.getValue());
        // console.log("File:", fileattach.getValue());

        povalue = PO.getValue();
        AmountValue = Amount.getValue();
        // CurrencyValue = Currency.getValue();
        VendorCodeValue = VendorCode.getValue();
        VendorNameValue = name1.getValue();
        ProfitValue = ProfitCenter.getValue();
        EmailValue = Email.getValue();
        TextValue = Text.getValue();
        RemarkValue = Remarks.getValue();
        PlantValue = Plant.getValue();
        gemInvValue = GemInvNo.getValue();  //uncomment for Gem
        // filevalue = attach.getValue();

        console.log("AdvPay", AdvPay);
        console.log("advpay1", advpay1);
        console.log("advpay2", AdvPay2);

        if (AdvPay === 'Yes' && advpay1 === 'X') {
          advance_payment = 'X'
          // } else if (advpay1 === 'X')  {
          //   advance_payment = 'X'
        } else {
          advance_payment = ''
        }

        if (checkBox === false) {
          checkValue = 'X';
        } else {
          checkValue = ' ';
        }

        console.log(advance_payment);
        console.log(checkBox);
        var oTable = this.getView().byId("DraftTable1");
        var aItems = oTable.getItems();

        // Array to store the data

        InvtableData = [];
        GrntableData = [];
        SestableData = [];
        var grntablefinal = [];
        var sestablefinal = [];

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

        aItems.forEach(function (oItem, index) {
          var aCells = oItem.getCells();
          var InvrowData = {};
          var SesrowData = {};
          // Assuming the GRN and SES MultiInput controls are directly inside the cells of the table's rows
          // and each row follows the same structure
          var oGRNMultiInput = oItem.getCells()[2]; // Adjust the index according to your table structure
          var oSESMultiInput = oItem.getCells()[3]; // Adjust the index according to your table structure
          // var cellValue = oItem.getCells()[0];

          var aGRNTokens = oGRNMultiInput.getTokens(); // Retrieve all tokens from the GRN MultiInput
          var aGRNValues = aGRNTokens.map(function (token) {
            return token.getText(); // Use .getKey() if you have set keys for the tokens
          })

          var aSESTokens = oSESMultiInput.getTokens(); // Retrieve all tokens from the SES MultiInput
          var aSESValues = aSESTokens.map(function (token) {
            return token.getText(); // Use .getKey() if you have set keys for the tokens
          });

          console.log('aGRNValues', aGRNValues);

          for (var i = 0; i < aGRNValues.length; i++) {
            for (var j = i + 1; j < aGRNValues.length; j++) {
              if (aGRNValues[i] === aGRNValues[j]) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageBox.error('Duplicate GRN found: ' + aGRNValues[i]);
                Save.setEnabled(true);
                dupflag = false;
              } else {
                dupflag = true;
              }
            }
          }

          for (var k = 0; k < aSESValues.length; k++) {
            for (var l = k + 1; l < aSESValues.length; l++) {
              if (aSESValues[k] === aSESValues[l]) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageBox.error('Duplicate SES found: ' + aSESValues[k]);
                Save.setEnabled(true);
                dupflag1 = false;
              }
            }
          }

          console.log(dupflag);
          // if (dupflag === true || dupflag1 === true) {
          if (aGRNValues.length > 0) {
            aGRNValues.forEach(function (item) {
              // For each GRN value, create an object with MBLNR property and add it to the array
              grntablefinal.push({ "MBLNR": item });
            });
            console.log('grn table 1:', grntablefinal);

            GrntableData.push(grntablefinal);
            grntablefinal = [];
          }
          console.log('grn final', GrntableData);

          if (aSESValues.length > 0) {
            aSESValues.forEach(function (item) {
              // For each GRN value, create an object with MBLNR property and add it to the array
              sestablefinal.push({ "LBLNI": item });
            });
            console.log('ses table 1:', sestablefinal);

            SestableData.push(sestablefinal);
            sestablefinal = [];
          }

          console.log('ses final', SestableData);
          // }





          console.log(aCells);
          // aCells.forEach(function (oCell, index) {
          for (var index = 0; index < aCells.length; index++) {
            // Get the value of the cell
            // console.log(aCells[index].getValue());
            var cellValue
            if (index === 0 || index === 1 || index === 4) {
              cellValue = aCells[index].getValue();
            }
            if (index === 2 || index === 3) {
              cellValue = aCells[index].mProperties._semanticFormValue;
            }



            // Assign the value to the corresponding property in the rowData object
            if (index === 0) {
              InvrowData["Invoice"] = cellValue;
            }
          }
          // });

          InvtableData.push(InvrowData);
          // GrntableData.push({ GRN: aGRNValues }); // Adjust this if you need a different structure
          // SestableData.push({ SES: aSESValues });

          console.log("Row " + (index + 1) + " GRN MultiInput Values:", aGRNValues);
          console.log("Row " + (index + 1) + " SES MultiInput Values:", aSESValues);
        });


        // Now, the tableData array contains all the data from the table
        console.log(' Grn Table Data:', GrntableData);
        console.log(' Ses Table Data:', SestableData);
        console.log(' Inv Table Data:', InvtableData);
        console.log('Dupflag', dupflag);
        console.log('Dupflag1', dupflag1);
        if (dupflag === true && dupflag1 === true) {
          validation(GrntableData, SestableData, InvtableData);

          function validation(GrntableData, SestableData, InvtableData) {
            // Validate each field


            if (!PO.getValue()) {
              PO.setValueState("Error");
              sap.ui.core.BusyIndicator.hide();
              sap.m.MessageBox.error("Please Select PO No.", {
                onClose: function () {
                  PO.focus();
                  Save.setEnabled(true);
                },
              });
              return;
            }

            if (PO.getValue()) {
              var oModel = new sap.ui.model.odata.v2.ODataModel(
                "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
              );

              var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, povalue);
              oModel.read("/ZpoShSet", { ///ZbtspoShSet
                filters: [oFilter],
                success: function (oData) {
                  console.log(" PO Entities fetched successfully:", oData);
                  if (oData.results <= 0) {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageBox.error("Purchase Order " + povalue + " does not exist.", {
                      onClose: function () {
                        PO.focus();
                        Save.setEnabled(true);
                      },
                    });
                    return;
                  }
                  VC();
                }, error: function () {
                  // Handle error
                  console.log("Error in fetching entities");
                }
              });
            }

            function VC() {
              if (!VendorCode.getValue()) {
                VendorCode.setValueState("Error");
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageBox.error("Please Select Vendor Code", {
                  onClose: function () {
                    VendorCode.focus(); // Set focus back to the Vendor Code input field
                    Save.setEnabled(true);
                  },
                });
                return;
              }
              if (VendorCode.getValue()) {
                var oModel = new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                );

                var sPath = "/ZpoShSet('" + povalue + "')";
                oModel.read(sPath, {
                  success: function (oData) {
                    console.log('BTS fetch doc type:', oData);
                    if (oData.BSART === 'ZSTA' || oData.BSART === 'ZSTO') {
                      var oFilter1 = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, povalue);
                      oModel.read("/ZsuppPlantShSet", {
                        filters: [oFilter1],
                        success: function (oData) {
                          console.log(" Vendor Code Entities fetched successfully:", oData);
                          var filter = oData.results.filter(function (items) {
                            return items.EBELN === povalue && items.RESWK === VendorCodeValue;
                          });
                          console.log(" VENDOR CODE Filters fetched successfully:", filter);
                          if (filter.length <= 0) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageBox.error("Supplying Plant " + VendorCodeValue + " does not exist with the given PO.", {
                              onClose: function () {
                                VendorCode.focus();
                                Save.setEnabled(true);
                              },
                            });
                            return;
                          }
                          VE();
                        }, error: function () {
                          // Handle error
                          console.log("Error in fetching entities");
                        }
                      });
                    } else {
                      var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, povalue);
                      oModel.read("/ZbtspoShSet", {
                        filters: [oFilter],
                        success: function (oData) {
                          console.log(" Vendor Code Entities fetched successfully:", oData);
                          var filter = oData.results.filter(function (items) {
                            return items.EBELN === povalue && items.LIFNR === VendorCodeValue;
                          });
                          console.log(" VENDOR CODE Filters fetched successfully:", filter);
                          if (filter.length <= 0) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageBox.error("Vendor Code " + VendorCodeValue + " does not exist with the given PO.", {
                              onClose: function () {
                                VendorCode.focus();
                                Save.setEnabled(true);
                              },
                            });
                            return;
                          }
                          VE();
                        }, error: function () {
                          // Handle error
                          console.log("Error in fetching entities");
                        }
                      });
                    }


                  }
                });
              }
            }

            function VE() {
              var oModel = new sap.ui.model.odata.v2.ODataModel(
                "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
              );
              var sPath = "/ZpoShSet('" + povalue + "')";
              oModel.read(sPath, {
                success: function (oData) {
                  console.log('BTS fetch doc type:', oData);
                  if (oData.BSART === 'ZSTA' || oData.BSART === 'ZSTO') {
                    VP();
                  } else {
                    if (!vendoremail.getValue()) {
                      vendoremail.setValueState("Error");
                      sap.ui.core.BusyIndicator.hide();
                      sap.m.MessageBox.error("Please maintain the Vendor Email", {
                        onClose: function () {
                          vendoremail.focus(); //
                          Save.setEnabled(true);
                        },
                      });
                      return;
                    }
                    if (vendoremail.getValue()) {
                      VP();
                    }
                  }
                }
              });


            }

            function VP() {
              var oModel = new sap.ui.model.odata.v2.ODataModel(
                "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
              );
              var sPath = "/ZpoShSet('" + povalue + "')";
              oModel.read(sPath, {
                success: function (oData) {
                  console.log('BTS fetch doc type:', oData);
                  if (oData.BSART === 'ZSTA' || oData.BSART === 'ZSTO') {
                    amount();
                  } else {
                    if (!vendorphno.getValue()) {
                      vendorphno.setValueState("Error");
                      sap.ui.core.BusyIndicator.hide();
                      sap.m.MessageBox.error("Please maintain the Vendor Phone Number", {
                        onClose: function () {
                          vendorphno.focus(); //
                          Save.setEnabled(true);
                        },
                      });
                      return;
                    }
                    if (vendoremail.getValue()) {
                      amount();
                    }
                  }
                }
              });
            }

            function amount() {
              if (!Amount.getValue()) {
                Amount.setValueState("Error");
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageBox.error("Please fill Amount Field", {
                  onClose: function () {
                    Amount.focus(); //
                    Save.setEnabled(true);
                  },
                });
                return;
              }
              if (Amount.getValue()) {
                DateFunction();
              }
            }

            function DateFunction() {
              if (!DateField.getValue()) {
                DateField.setValueState("Error");
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageBox.error("Please Select Date Field", {
                  onClose: function () {
                    DateField.focus(); //
                    Save.setEnabled(true);
                  },
                });
                return;
              }
              if (DateField.getValue()) {
                profit();
              }
            }

            function profit() {
              if (!ProfitCenter.getValue()) {
                ProfitCenter.setValueState("Error");
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageBox.error("Please fill Billing Location Field", {
                  onClose: function () {
                    ProfitCenter.focus(); //
                    Save.setEnabled(true);
                  },
                });
                return;
              }
              if (ProfitCenter.getValue()) {
                var oModel = new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                );

                var oFilter = new sap.ui.model.Filter("BASE_LOCATION", sap.ui.model.FilterOperator.EQ, ProfitValue);
                oModel.read("/ZpridShSet", {
                  filters: [oFilter],
                  success: function (oData) {
                    console.log(" Profit Center Entities fetched successfully:", oData);
                    if (oData.results <= 0) {
                      sap.ui.core.BusyIndicator.hide();
                      sap.m.MessageBox.error("Profit Center " + ProfitValue + " does not exist.", {
                        onClose: function () {
                          PO.focus();
                          Save.setEnabled(true);
                        },
                      });
                      return;
                    }
                    text();
                  }, error: function () {
                    // Handle error
                    console.log("Error in fetching entities");
                  }
                });
              }

            }

            function text() {
              if (!Text.getValue()) {
                Text.setValueState("Error");
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageBox.error("Please fill Invoice Text Field", {
                  onClose: function () {
                    Text.focus(); //
                    Save.setEnabled(true);
                  },
                });
                return;
              }
              if (Text.getValue()) {
                Remark();
              }

            }

            function Remark() {
              if (!Remarks.getValue()) {
                Remarks.setValueState("Error");
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageBox.error("Please fill Remarks Field", {
                  onClose: function () {
                    Remarks.focus(); //
                    Save.setEnabled(true);
                  },
                });
                return;
              }
              if (Remarks.getValue()) {
                Plants(); //Plants();
              }
            }

            function Plants() {
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
              if (Plant.getValue()) {
                GeMFlag();
              }
            }

            //uncomment for GeM
            function GeMFlag() {
              console.log('Gemflag from route:', gemflag1);
              console.log('Gemflag from onselect:', gemflag);
              if (!gemflag1 && gemflag === " ") {
                GeM_Procurement.setValueState("Error");
                sap.ui.core.BusyIndicator.hide(); //31
                sap.m.MessageBox.error("Please Select GeM Procurement Field", {
                  onClose: function () {
                    GeM_Procurement.focus(); //
                    Remarks.focus(); //
                    Save.setEnabled(true);
                  },
                });
                return;
              }
              if (!gemflag1 && !gemflag) {
                GeM_Procurement.setValueState("Error");
                sap.ui.core.BusyIndicator.hide(); //31
                sap.m.MessageBox.error("Please Select GeM Procurement Field", {
                  onClose: function () {
                    GeM_Procurement.focus(); //
                    Remarks.focus(); //
                    Save.setEnabled(true);
                  },
                });
                return;
              }
              if (gemflag1 || gemflag) {
                GeMNo();
              }

            }

            function GeMNo() {
              if (gemflag === 'Yes') {
                if (!GemInvNo.getValue()) {
                  GemInvNo.setValueState("Error");
                  sap.ui.core.BusyIndicator.hide(); //31
                  sap.m.MessageBox.error("Please Input GeM Invoice Number Field", {
                    onClose: function () {
                      GemInvNo.focus(); //
                      Remarks.focus(); //
                      Save.setEnabled(true);
                    },
                  });
                  return;
                } else {
                  attach();
                }
              } else {
                attach();
              }
            }

            function attach() {
              //25.04.2024 for attachment
              if (!DraftAttachValue && !newfilevalue) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageBox.error("Attachment is Mandatory", {
                  onClose: function () {
                    Save.setEnabled(true);
                    // fileattach.focus(); //
                  },
                });
                return;
              } else {
                tablefunc();
              }
              //25.04.2024 for attachment
            }

            function tablefunc() {
              var oModel = new sap.ui.model.odata.v2.ODataModel(
                "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
              );
              var sPath = "/ZpoShSet('" + povalue + "')"; //ZbtspoShSet
              var grnflag = true;
              var sesflag = true;
              oModel.read(sPath, {
                success: function (oData) {
                  console.log('BTS fetch doc type:', oData);
                  if (!checkBox) {
                    console.log('Check box is checked');
                    if (InvtableData && InvtableData.length > 0) {
                      for (var i = 0; i < InvtableData.length; i++) {
                        if (!InvtableData[i].Invoice || InvtableData[i].Invoice === '') {
                          sap.ui.core.BusyIndicator.hide();
                          sap.m.MessageBox.error("Please fill the Invoice Number Field");
                          Invoice.focus();
                          Save.setEnabled(true);
                          break;

                        } else {
                          val = 'true';
                          vval = 'true';
                          confirm();
                        }
                      }
                    }
                  } else {
                    if (oData.BSART === 'ZLOC' || oData.BSART === 'ZTUR' || oData.BSART === 'ZCTU') {
                      console.log('GRN and SES is Mandatory');
                      // if (oData.WEBRE === ' ' && oData.LEBRE === ' ') { //added for new CR for GR Based PO on 06.08.2025
                      //   console.log('None is Mandatory');
                      //   if (InvtableData && InvtableData.length > 0 || (GrntableData && GrntableData.length > 0 && SestableData && SestableData.length > 0)) {
                      //     if (InvtableData[0].Invoice === '') {
                      //       console.log('INV field is empty');
                      //       grnflag = false;
                      //       sesflag = false;
                      //       sap.ui.core.BusyIndicator.hide(); //31
                      //       sap.m.MessageBox.error("Please fill Invoice Field", {
                      //         onClose: function () {
                      //           ProfitCenter.focus(); //
                      //           Save.setEnabled(true);
                      //           Draft.setEnabled(true);
                      //           Back.setEnabled(true);
                      //           pdfPreviewButton.setEnabled(true);
                      //           return;
                      //         },
                      //       });
                      //       return;
                      //     } else if (InvtableData[0].Invoice != '') {
                      //       grnflag = true;
                      //       sesflag = true;
                      //       grnValueValidation3();
                      //     }
                      //   }
                      // } else {
                      if (InvtableData && InvtableData.length > 0) {
                        // for (var i = 0; i < GrntableData.length; i++) {
                        for (var i = 0; i < InvtableData.length; i++) {
                          if (!InvtableData[i].Invoice || InvtableData[i].Invoice === '') {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageBox.error("Please fill the Invoice Field");
                            Save.setEnabled(true);
                            return;
                            // Focus the correct field here
                          } else if (GrntableData && GrntableData.length === 0 && SestableData && SestableData.length === 0) {
                            sap.ui.core.BusyIndicator.hide(); //31
                            sap.m.MessageBox.error("Please Fill either GRN or SES Field!!");
                            Save.setEnabled(true);
                            return;
                          } else if (GrntableData && GrntableData.length > 0 && SestableData && SestableData.length === 0) {
                            grnValueValidation4();
                            return;
                          }
                          else if (GrntableData && GrntableData.length === 0 && SestableData && SestableData.length > 0) {
                            sesValueValidation5();
                            return;
                          }
                          else if (GrntableData && GrntableData.length > 0 && SestableData && SestableData.length > 0) {
                            grnValueValidation();
                            return;
                          }
                          // else {
                          //   grnValueValidation();
                          // }
                        }
                      } else {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageBox.error("Both SES and GRN Field are mandatory!!", {
                          onClose: function () {
                            Save.setEnabled(true);
                            return;
                            // Focus the correct field here
                          },
                        });
                      }
                      // }
                    } else if (oData.BSART === 'ZDOM' || oData.BSART === 'ZCDO' || oData.BSART === 'ZEME' || oData.BSART === 'ZRET' || oData.BSART === 'ZRFB' || oData.BSART === 'ZIMP' || oData.BSART === 'ZSTA' || oData.BSART === 'ZSTO' || oData.BSART === 'ZGAS' || oData.BSART === 'ZGAT') {
                      console.log('GRN is Mandatory');
                      // if (oData.WEBRE === ' ') { //added for new CR for GR Based PO on 06.08.2025
                      //   console.log('None is Mandatory');
                      //   if (InvtableData && InvtableData.length > 0 || (GrntableData && GrntableData.length > 0 && SestableData && SestableData.length > 0)) {
                      //     if (InvtableData[0].Invoice === '') {
                      //       console.log('INV field is empty');
                      //       grnflag = false;
                      //       sesflag = false;
                      //       sap.ui.core.BusyIndicator.hide(); //31
                      //       sap.m.MessageBox.error("Please fill Invoice Field", {
                      //         onClose: function () {
                      //           ProfitCenter.focus(); //
                      //           Save.setEnabled(true);
                      //           Draft.setEnabled(true);
                      //           Back.setEnabled(true);
                      //           pdfPreviewButton.setEnabled(true);
                      //           return;
                      //         },
                      //       });
                      //       return;
                      //     } else if (InvtableData[0].Invoice != '') {
                      //       grnflag = true;
                      //       sesflag = true;
                      //       grnValueValidation3();
                      //     }
                      //   }
                      // } else {
                      if (GrntableData && GrntableData.length > 0) {
                        // for (var i = 0; i < GrntableData.length; i++) {
                        for (var i = 0; i < InvtableData.length; i++) {
                          if (!InvtableData[i].Invoice || InvtableData[i].Invoice === '') {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageBox.error("Please fill the Invoice Number Field");
                            Invoice.focus();
                            Save.setEnabled(true);
                            return;
                            // Focus the correct field here

                          } else {
                            grnValueValidation1();
                          }
                        }
                      }
                      else {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageBox.error("GRN is mandatory!!", {
                          onClose: function () {
                            Save.setEnabled(true);
                            return;
                            // Focus the correct field here
                          },
                        });
                      }
                      // }

                    } else if (oData.BSART === 'ZSRV' || oData.BSART === 'ZPSR' || oData.BSART === 'ZIMS' || oData.BSART === 'ZEMS') {
                      console.log('SES is Mandatory');
                      // if (oData.LEBRE === ' ') { //added for new CR for SES Based PO on 06.08.2025
                      //   console.log('None is Mandatory');
                      //   if (InvtableData && InvtableData.length > 0 || (GrntableData && GrntableData.length > 0 && SestableData && SestableData.length > 0)) {
                      //     if (InvtableData[0].Invoice === '') {
                      //       console.log('INV field is empty');
                      //       grnflag = false;
                      //       sesflag = false;
                      //       sap.ui.core.BusyIndicator.hide(); //31
                      //       sap.m.MessageBox.error("Please fill Invoice Field", {
                      //         onClose: function () {
                      //           ProfitCenter.focus(); //
                      //           Save.setEnabled(true);
                      //           Draft.setEnabled(true);
                      //           Back.setEnabled(true);
                      //           pdfPreviewButton.setEnabled(true);
                      //           return;
                      //         },
                      //       });
                      //       return;
                      //     } else if (InvtableData[0].Invoice != '') {
                      //       grnflag = true;
                      //       sesflag = true;
                      //       grnValueValidation3();
                      //     }
                      //   }
                      // } else {
                      if (SestableData && SestableData.length > 0 && InvtableData && InvtableData.length > 0) {
                        // for (var i = 0; i < GrntableData.length; i++) {
                        for (var i = 0; i < InvtableData.length; i++) {
                          if (!InvtableData[i].Invoice || InvtableData[i].Invoice === '') {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageBox.error("Please fill the Invoice Field");
                            Save.setEnabled(true);
                            return;
                            // Focus the correct field here

                          } else {
                            grnValueValidation2();
                          }
                        }
                      } else {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageBox.error("SES Field is mandatory!!", {
                          onClose: function () {
                            Save.setEnabled(true);
                            return;
                            // Focus the correct field here
                          },
                        });
                      }
                      // }

                    } else if (oData.BSART === 'FO' || oData.BSART === 'ZINS') {
                      console.log('None is Mandatory');
                      if (InvtableData && InvtableData.length > 0 || (GrntableData && GrntableData.length > 0 && SestableData && SestableData.length > 0)) {
                        // for (var i = 0; i < GrntableData.length; i++) {
                        // console.log('GRN data', GrntableData[0].MBLNR);
                        if (InvtableData[0].Invoice === '') {
                          console.log('INV field is empty');
                          grnflag = false;
                          sesflag = false;
                          sap.ui.core.BusyIndicator.hide();
                          sap.m.MessageBox.error("Please fill Invoice Field", {
                            onClose: function () {
                              ProfitCenter.focus(); //
                              Save.setEnabled(true);
                              return;
                            },
                          });
                          return;
                        } else if (InvtableData[0].Invoice != '') {
                          grnflag = true;
                          sesflag = true;
                          grnValueValidation3();
                        }
                      }
                    }

                  }

                }, error: function () {
                  // Handle error
                  console.log("Error in fetching entities");
                }
              });

              //for GRN and SES Mandatory
              function grnValueValidation() {

                var allSuccess = true; // Flag to track success
                // Define the OData model and bind the search help table to an entity set
                var oModel = new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                );

                var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, povalue);
                oModel.read("/ZbtsgrnShSet", {
                  filters: [oFilter],
                  success: function (oData) {

                    // Handle success
                    console.log(" GRN Entities fetched successfully:", oData);
                    for (var i = 0; i < GrntableData.length; i++) {
                      for (var j = 0; j < GrntableData[i].length; j++) {
                        var filter = oData.results.filter(function (items) {
                          return items.EBELN === povalue && items.MBLNR === GrntableData[i][j].MBLNR;
                        });

                        console.log(" GRN Filters fetched successfully:", filter);
                        if (filter.length <= 0) {
                          sap.ui.core.BusyIndicator.hide();
                          sap.m.MessageBox.error("GRN Number " + GrntableData[i][j].MBLNR + " does not exist.");
                          Save.setEnabled(true);
                          allSuccess = false; // Mark success as false due to failure in this iteration
                          val = 'false';
                          break; // Exit the loop since we found a failure
                        }
                      }


                    }
                    // // Check if all iterations were successful
                    if (allSuccess) {
                      console.log("All GRN numbers exist.");
                      val = 'true';
                      if (val === 'true') {
                        val = 'true';
                        vval = 'true';
                        sesValueValidation();
                      }

                    } else {
                      console.log('Some GRN does not exist');
                    }

                  }, error: function () {
                    // Handle error
                    console.log("Error in fetching entities");
                  }
                });

              }

              //for GRN and SES Mandatory
              function sesValueValidation() {

                var allses = true; // Flag to track success
                // Define the OData model and bind the search help table to an entity set
                var oModel = new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                );

                var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, povalue);
                oModel.read("/ZbtssesShSet", {
                  filters: [oFilter],
                  success: function (oData) {

                    // Handle success
                    console.log(" SES Entities fetched successfully:", oData);
                    console.log(SestableData.length);
                    console.log(SestableData);
                    if (SestableData.length === 0) {
                      sap.ui.core.BusyIndicator.hide();
                      sap.m.MessageBox.error("SES Number is mandatory.");
                      Save.setEnabled(true);
                      allSuccess = false; // Mark success as false due to failure in this iteration
                      val = 'false';
                      return;
                    } else {
                      for (var i = 0; i < SestableData.length; i++) {
                        for (var j = 0; j < SestableData[i].length; j++) {
                          var filter = oData.results.filter(function (items) {
                            return items.EBELN === povalue && items.LBLNI === SestableData[i][j].LBLNI;
                          });

                          console.log(" SES Filters fetched successfully:", filter);
                          if (filter.length <= 0) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageBox.error("SES Number " + SestableData[i][j].LBLNI + " does not exist.");
                            Save.setEnabled(true);
                            allSuccess = false; // Mark success as false due to failure in this iteration
                            val = 'false';
                            break; // Exit the loop since we found a failure
                          }
                        }
                      }
                    }


                    // Check if all iterations were successful
                    if (allses) {
                      console.log("All SES numbers exist.");
                      vval = 'true';
                      if (vval === 'true') {
                        val = 'true';
                        vval = 'true';
                        confirm();
                      }
                      // confirm();
                    } else {
                      console.log('SES does not exist');
                    }

                  }, error: function () {
                    // Handle error
                    console.log("Error in fetching entities");
                  }
                });

              }

              //for GRN Mandatory
              function grnValueValidation1() {

                var allSuccess = true; // Flag to track success
                // Define the OData model and bind the search help table to an entity set
                var oModel = new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                );

                var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, povalue);
                oModel.read("/ZbtsgrnShSet", {
                  filters: [oFilter],
                  success: function (oData) {

                    // Handle success
                    console.log(" GRN Entities fetched successfully:", oData);
                    for (var i = 0; i < GrntableData.length; i++) {
                      for (var j = 0; j < GrntableData[i].length; j++) {
                        var filter = oData.results.filter(function (items) {
                          return items.EBELN === povalue && items.MBLNR === GrntableData[i][j].MBLNR;
                        });

                        console.log(" GRN Filters fetched successfully:", filter);
                        if (filter.length <= 0) {
                          sap.ui.core.BusyIndicator.hide();
                          sap.m.MessageBox.error("GRN Number " + GrntableData[i][j].MBLNR + " does not exist.");
                          Save.setEnabled(true);
                          allSuccess = false; // Mark success as false due to failure in this iteration
                          val = 'false';
                          break; // Exit the loop since we found a failure
                        }
                      }


                    }
                    // Check if all iterations were successful
                    if (allSuccess) {
                      console.log("All GRN numbers exist.");
                      val = 'true';
                      if (val === 'true') {
                        val = 'true';
                        vval = 'true';
                        sesValueValidation1();
                      }

                    } else {
                      console.log('Some GRN does not exist');
                    }

                  }, error: function () {
                    // Handle error
                    console.log("Error in fetching entities");
                  }
                });

              }
              //for GRN Mandatory
              function sesValueValidation1() {

                var allses = true; // Flag to track success
                // Define the OData model and bind the search help table to an entity set
                var oModel = new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                );

                var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, povalue);
                oModel.read("/ZbtssesShSet", {
                  filters: [oFilter],
                  success: function (oData) {

                    // Handle success
                    console.log(" SES Entities fetched successfully:", oData);
                    for (var i = 0; i < SestableData.length; i++) {
                      for (var j = 0; j < SestableData[i].length; j++) {
                        var filter = oData.results.filter(function (items) {
                          return items.EBELN === povalue && items.LBLNI === SestableData[i][j].LBLNI;
                        });

                        console.log(" SES Filters fetched successfully:", filter);
                        if (filter.length <= 0) {
                          sap.ui.core.BusyIndicator.hide();
                          sap.m.MessageBox.error("SES Number " + SestableData[i][j].LBLNI + " does not exist.");
                          Save.setEnabled(true);
                          allSuccess = false; // Mark success as false due to failure in this iteration
                          val = 'false';
                          break; // Exit the loop since we found a failure
                        }
                      }


                    }

                    // Check if all iterations were successful
                    if (allses) {
                      console.log("All SES numbers exist.");
                      vval = 'true';
                      if (vval === 'true') {
                        val = 'true';
                        vval = 'true';
                        confirm();
                      }
                      // confirm();
                    } else {
                      console.log('Some SES does not exist');
                    }

                  }, error: function () {
                    // Handle error
                    console.log("Error in fetching entities");
                  }
                });

              }

              //for SES mandatory
              function grnValueValidation2() {

                var allSuccess = true; // Flag to track success
                // Define the OData model and bind the search help table to an entity set
                var oModel = new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                );

                var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, povalue);
                oModel.read("/ZbtsgrnShSet", {
                  filters: [oFilter],
                  success: function (oData) {

                    // Handle success
                    console.log(" GRN Entities fetched successfully:", oData);
                    for (var i = 0; i < GrntableData.length; i++) {
                      var filter = oData.results.filter(function (items) {
                        return items.EBELN === povalue && items.MBLNR === GrntableData[i].GRN;
                      });

                      console.log(" GRN Filters fetched successfully:", filter);
                      if (filter.length <= 0) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageBox.error("GRN Number " + GrntableData[i].GRN + " does not exist.");
                        Save.setEnabled(true);
                        allSuccess = false; // Mark success as false due to failure in this iteration
                        val = 'false';
                        break; // Exit the loop since we found a failure
                      }

                    }
                    // Check if all iterations were successful
                    if (allSuccess) {
                      console.log("All GRN numbers exist.");
                      val = 'true';
                      if (val === 'true') {
                        val = 'true';
                        vval = 'true';
                        sesValueValidation2();
                      }

                    } else {
                      console.log('Some GRN does not exist');
                    }

                  }, error: function () {
                    // Handle error
                    console.log("Error in fetching entities");
                  }
                });

              }
              //for SES Mandatory
              function sesValueValidation2() {

                var allses = true; // Flag to track success
                // Define the OData model and bind the search help table to an entity set
                var oModel = new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                );

                var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, povalue);
                oModel.read("/ZbtssesShSet", {
                  filters: [oFilter],
                  success: function (oData) {

                    // Handle success
                    console.log(" SES Entities fetched successfully:", oData);
                    for (var i = 0; i < SestableData.length; i++) {
                      for (var j = 0; j < SestableData[i].length; j++) {
                        var filter = oData.results.filter(function (items) {
                          return items.EBELN === povalue && items.LBLNI === SestableData[i][j].LBLNI;
                        });

                        console.log(" SES Filters fetched successfully:", filter);
                        if (filter.length <= 0) {
                          sap.ui.core.BusyIndicator.hide();
                          sap.m.MessageBox.error("SES Number " + SestableData[i][j].LBLNI + " does not exist.");
                          Save.setEnabled(true);
                          allses = false; // Mark success as false due to failure in this iteration
                          val = 'false';
                          break; // Exit the loop since we found a failure
                        }
                      }
                    }
                    // Check if all iterations were successful
                    if (allses) {
                      console.log("All SES numbers exist.");
                      vval = 'true';
                      if (vval === 'true') {
                        val = 'true';
                        vval = 'true';
                        confirm();
                      }
                    } else {
                      console.log('Some SES does not exist');
                    }

                  }, error: function () {
                    // Handle error
                    console.log("Error in fetching entities");
                  }
                });

              }

              //NONE
              function grnValueValidation3() {

                var allSuccess = true; // Flag to track success
                // Define the OData model and bind the search help table to an entity set
                var oModel = new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                );

                var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, povalue);
                oModel.read("/ZbtsgrnShSet", {
                  filters: [oFilter],
                  success: function (oData) {

                    // Handle success
                    console.log(" GRN Entities fetched successfully:", oData);
                    for (var i = 0; i < GrntableData.length; i++) {
                      var filter = oData.results.filter(function (items) {
                        return items.EBELN === povalue && items.MBLNR === GrntableData[i].GRN;
                      });

                      console.log(" GRN Filters fetched successfully:", filter);
                      if (GrntableData[0].GRN != '') {
                        if (filter.length <= 0) {
                          sap.ui.core.BusyIndicator.hide();
                          sap.m.MessageBox.error("GRN Number " + GrntableData[i].GRN + " does not exist.");
                          Save.setEnabled(true);
                          allSuccess = false; // Mark success as false due to failure in this iteration
                          val = 'false';
                          break; // Exit the loop since we found a failure
                        }
                      }
                    }
                    // Check if all iterations were successful
                    if (allSuccess) {
                      console.log("All GRN numbers exist.");
                      val = 'true';
                      if (val === 'true') {
                        val = 'true';
                        vval = 'true';
                        sesValueValidation3();
                      }

                    } else {
                      console.log('Some GRN does not exist');
                    }

                  }, error: function () {
                    // Handle error
                    console.log("Error in fetching entities");
                  }
                });

              }
              // NONE
              function sesValueValidation3() {

                var allses = true; // Flag to track success
                // Define the OData model and bind the search help table to an entity set
                var oModel = new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                );

                var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, povalue);
                oModel.read("/ZbtssesShSet", {
                  filters: [oFilter],
                  success: function (oData) {

                    // Handle success
                    console.log(" SES Entities fetched successfully:", oData);
                    for (var i = 0; i < SestableData.length; i++) {
                      var filter = oData.results.filter(function (items) {
                        return items.EBELN === povalue && items.LBLNI === SestableData[i].LBLNI;
                      });

                      console.log("SES Filters fetched successfully:", filter);
                      if (SestableData[0].SES != '') {
                        if (filter.length <= 0) {
                          sap.ui.core.BusyIndicator.hide();
                          sap.m.MessageBox.error("SES Number " + SestableData[i].LBLNI + " does not exist.");
                          Save.setEnabled(true);
                          allses = false; // Mark success as false due to failure in this iteration
                          vval = 'false';
                          break; // Exit the loop since we found a failure
                        }
                      }
                    }
                    // Check if all iterations were successful
                    if (allses) {
                      console.log("All SES numbers exist.");
                      vval = 'true';
                      if (vval === 'true') {
                        val = 'true';
                        vval = 'true';
                        confirm();
                      }
                      // confirm();
                    } else {
                      console.log('Some SES does not exist');
                    }

                  }, error: function () {
                    // Handle error
                    console.log("Error in fetching entities");
                  }
                });

              }

              function grnValueValidation4() {

                var allSuccess = true; // Flag to track success
                // Define the OData model and bind the search help table to an entity set
                var oModel = new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                );

                var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, povalue);
                oModel.read("/ZbtsgrnShSet", {
                  filters: [oFilter],
                  success: function (oData) {

                    // Handle success
                    console.log(GrntableData);
                    console.log(" GRN Entities fetched successfully:", oData);
                    for (var i = 0; i < GrntableData.length; i++) {
                      for (var j = 0; j < GrntableData[i].length; j++) {
                        var filter = oData.results.filter(function (items) {
                          return items.EBELN === povalue && items.MBLNR === GrntableData[i][j].MBLNR;
                        });

                        console.log(" GRN Filters fetched successfully:", filter);
                        if (filter.length <= 0) {
                          var errorgrn = GrntableData[i][j].MBLNR;
                          allSuccess = false; // Mark success as false due to failure in this iteration
                          val = 'false';
                          break; // Exit the loop since we found a failure
                        }
                      }
                    }
                    // // Check if all iterations were successful
                    if (allSuccess) {
                      console.log("All GRN numbers exist.");
                      val = 'true';
                      if (val === 'true') {
                        val = 'true';
                        vval = 'true';
                        sesValueValidation4();
                      }

                    } else {
                      sap.ui.core.BusyIndicator.hide(); //31
                      sap.m.MessageBox.error("GRN Number " + errorgrn + " does not exist.");
                      Save.setEnabled(true);
                      console.log('Some GRN does not exist');
                    }

                  }, error: function () {
                    // Handle error
                    console.log("Error in fetching entities");
                  }
                });

              }

              function sesValueValidation4() {

                var allses = true; // Flag to track success
                // Define the OData model and bind the search help table to an entity set
                var oModel = new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                );

                var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, povalue);
                oModel.read("/ZbtssesShSet", {
                  filters: [oFilter],
                  success: function (oData) {

                    // Handle success
                    console.log(" SES Entities fetched successfully:", oData);
                    for (var i = 0; i < SestableData.length; i++) {
                      var filter = oData.results.filter(function (items) {
                        return items.EBELN === povalue && items.LBLNI === SestableData[i].LBLNI;
                      });

                      console.log("SES Filters fetched successfully:", filter);
                      if (SestableData[0].SES != '') {
                        if (filter.length <= 0) {
                          sap.ui.core.BusyIndicator.hide();
                          sap.m.MessageBox.error("SES Number " + SestableData[i].LBLNI + " does not exist.");
                          Save.setEnabled(true);
                          allses = false; // Mark success as false due to failure in this iteration
                          vval = 'false';
                          break; // Exit the loop since we found a failure
                        }
                      }
                    }
                    // Check if all iterations were successful
                    if (allses) {
                      console.log("All SES numbers exist.");
                      vval = 'true';
                      if (vval === 'true') {
                        val = 'true';
                        vval = 'true';
                        confirm();
                      }
                      // confirm();
                    } else {
                      console.log('Some SES does not exist');
                    }

                  }, error: function () {
                    // Handle error
                    console.log("Error in fetching entities");
                  }
                });

              }

              function sesValueValidation5() {

                var allses = false; // Flag to track success
                // Define the OData model and bind the search help table to an entity set
                var oModel = new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                );

                var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, povalue);
                oModel.read("/ZbtssesShSet", {
                  filters: [oFilter],
                  success: function (oData) {

                    // Handle success
                    console.log(" SES Entities fetched successfully:", oData);
                    for (var i = 0; i < SestableData.length; i++) {
                      for (var j = 0; j < SestableData[i].length; j++) {
                        var filter = oData.results.filter(function (items) {
                          return items.EBELN === povalue && items.LBLNI === SestableData[i][j].LBLNI;
                        });

                        console.log(" SES Filters fetched successfully:", filter);
                        if (filter.length <= 0) {
                          sap.ui.core.BusyIndicator.hide(); //31
                          sap.m.MessageBox.error("SES Number " + SestableData[i][j].LBLNI + " does not exist.");
                          Save.setEnabled(true);
                          allses = false; // Mark success as false due to failure in this iteration
                          val = 'false';
                          break; // Exit the loop since we found a failure
                        } else {
                          allses = true
                        }

                      }
                    }
                    // Check if all iterations were successful
                    if (allses) {
                      console.log("All SES numbers exist.");
                      vval = 'true';
                      if (vval === 'true') {
                        val = 'true';
                        vval = 'true';
                        confirm();
                      }
                    } else {
                      console.log('Some SES does not exist');
                      sap.ui.core.BusyIndicator.hide(); //31
                      // sap.m.MessageBox.error("SES Number is Invalid or SES number cannot be empty");
                      //     allses = false; // Mark success as false due to failure in this iteration
                      //     val = 'false';
                      //     // break; // Exit 
                    }

                  }, error: function () {
                    // Handle error
                    console.log("Error in fetching entities");
                  }
                });

              }

              function confirm() {
                console.log('Val', val);
                console.log('VVal', vval);
                if (val === 'true' && vval === 'true') {
                  console.log('called');
                  sap.m.MessageBox.confirm("Do you want to submit?", {
                    title: "Confirmation",
                    onClose: function (sAction) {
                      if (sAction === sap.m.MessageBox.Action.OK) {
                        console.log(sAction);
                        save(InvtableData, GrntableData, SestableData);
                      } else {
                        sap.ui.core.BusyIndicator.hide();
                        Save.setEnabled(true);
                        return;
                      }
                    },
                  });
                }
              }

            }
          }
          function save(InvtableData, GrntableData, SestableData) {

            console.log('InvrowData:', InvtableData);
            console.log('GrntableData:', GrntableData);
            console.log('SesrowData:', SestableData);
            console.log('New file Name:', newfilevalue);

            //fiscal year for bts id
            function getLastTwoDigitsOfFiscalYear(dateString, fiscalStartMonth) {
              // Parse the date string into a Date object
              var date = new Date(dateString);

              // Get the year and month of the date
              var year = date.getFullYear();
              var month = date.getMonth() + 1; // JavaScript months are 0-indexed, so add 1

              // Calculate fiscal year based on fiscal start month
              if (month < fiscalStartMonth) {
                // If the month is before the fiscal start month, the fiscal year is the previous year
                year -= 1;
              }

              // Get the last two digits of the fiscal year
              var lastTwoDigits = year % 100;

              return lastTwoDigits;
            }

            // Example usage:
            // var date = formattedDate;
            var currentDate = new Date();
            var fiscalStartMonth = 4; // Assuming fiscal year starts in April
            var lastTwoDigits = getLastTwoDigitsOfFiscalYear(currentDate, fiscalStartMonth);
            console.log(lastTwoDigits); // Output: 24
            //fiscal year for bts id

            var oFileUpload = that.getView().byId("fileUploaderBankMandate").getValue();
            if (oFileUpload !== "") {
              var oFileUploader = that.getView().byId("fileUploaderBankMandate");
              console.log(that._file);
              var filename = that._file.name;
              var fileType = that._file.type;
              that.getView().getModel().refreshSecurityToken();


              oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
                name: "x-csrf-token",
                value: that.getView().getModel().getHeaders()['x-csrf-token']
              }));

            }


            //25.04.2024 for attachment
            if (newfilevalue === '' && DraftAttachValue != '') {
              filevalue = DraftAttachValue;
            } else if (newfilevalue != '' && DraftAttachValue === '') {
              filevalue = newfilevalue;
            } else if (newfilevalue != '' && DraftAttachValue != '') {
              filevalue = newfilevalue;
            }
            //25.04.2024 for attachment

            var oModel = new sap.ui.model.odata.v2.ODataModel(
              "/sap/opu/odata/sap/ZBTS_ODATA_SRV"
            );
            var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, povalue);
            var sEntitySet = "/ZBTS_CRTSet";
            var newId;

            oModel.read(sEntitySet, {
              filters: [oFilter],
              success: function (oData, response) {
                // Handle success
                console.log("Entities fetched successfully:", oData);

                // Filter the data based on EBELN value
                var filteredData = oData.results.filter(function (entity) {
                  return entity.EBELN === povalue && entity.BTS_ID !== '';
                }).sort(function (a, b) {
                  // Assuming BTS_ID is numerical, if it's alphanumeric, you might need a different comparison logic
                  return a.BTS_ID.localeCompare(b.BTS_ID);
                });


                console.log("Filtered Data:", filteredData);

                if (filteredData.length > 0) {
                  filteredData.forEach(function (entity) {
                    console.log("BTS_ID:", entity.BTS_ID);
                    var idString = entity.BTS_ID.toString(); //change the bts_id to string to get the last 4 digit
                    console.log('STringID:', idString);
                    var lastFourDigits = idString.match(/\d{6}$/)[0]; //get the last 4 digit from the bts id
                    console.log("Last four digits:", lastFourDigits);
                    var incrementedDigits = (parseInt(lastFourDigits, 10) + 1).toString(); //increment the last four digit by 1 and convert back to string

                    // Pad the incremented digits with leading zeros to ensure four digits
                    incrementedDigits = incrementedDigits.padStart(6, '0');

                    console.log("Last four digits incremented:", incrementedDigits);

                    // newId = entity.EBELN + '-BTS-' + incrementedDigits; //get the next bts id
                    newId = entity.EBELN + '-B' + lastTwoDigits + '-' + incrementedDigits; //get the next bts id
                    console.log('Next BTS ID:', newId);
                  });

                  // Now you can set the GRN properties
                  GrntableData.forEach(function (item, index) {
                    if (item) {
                      var MBLNR = item["GRN"];
                      if (MBLNR !== undefined && MBLNR != '') {
                        var jsonObject = {}; // Create a new object in each iteration
                        jsonObject.BTS_ID = newId;
                        jsonObject.MBLNR = MBLNR;
                        console.log("Json GRN", jsonObject);
                        grnnavValue.push(jsonObject);
                        console.log('GRN at index ' + index + ':', MBLNR);
                      }
                    } else {
                      grnnavValue = [];
                      console.log("Item at index " + index + " is undefined or null.");
                    }
                  });

                  // Now you can set the INV properties
                  InvtableData.forEach(function (item, index) {
                    if (item) {
                      var XBLNR = item["Invoice"];
                      if (XBLNR !== undefined && XBLNR != '') {
                        var jsonObject2 = {}; // Create a new object in each iteration
                        jsonObject2.BTS_ID = newId;
                        jsonObject2.XBLNR = XBLNR;
                        console.log("Json INV", jsonObject2);
                        invnavValue.push(jsonObject2);
                        console.log('SES at index ' + index + ':', LBLNI);
                      }
                    } else {
                      invnavValue = [];
                      console.log("Item at index " + index + " is undefined or null.");
                    }
                  });


                  // Now HDRTOGRNNAV contains the jsonObject data
                  console.log("GrnNavValue:", grnnavValue);
                  console.log("SesNavValue:", sesnavValue);
                  console.log("InvNavValue:", invnavValue);

                  jsonformat(); // call the jsonformat function 
                } else { //if no existing ID is present with the given PO
                  newId = povalue + '-B' + lastTwoDigits + '-000001';
                  console.log("Filtered Data is empty. Saving ID as:", newId);

                  // Now you can set the GRN properties
                  GrntableData.forEach(function (item, index) {
                    if (item) {
                      var MBLNR = item["GRN"];
                      if (MBLNR !== undefined && MBLNR != '') {
                        var jsonObject = {}; // Create a new object in each iteration
                        jsonObject.BTS_ID = newId;
                        jsonObject.MBLNR = MBLNR;
                        console.log("Json GRN", jsonObject);
                        grnnavValue.push(jsonObject);
                        console.log('GRN at index ' + index + ':', MBLNR);
                      }
                    } else {
                      console.log("Item at index " + index + " is undefined or null.");
                    }
                  });

                  // Now you can set the INV properties
                  InvtableData.forEach(function (item, index) {
                    if (item) {
                      var XBLNR = item["Invoice"];
                      if (XBLNR !== undefined && XBLNR != '') {
                        var jsonObject2 = {}; // Create a new object in each iteration
                        jsonObject2.BTS_ID = newId;
                        jsonObject2.XBLNR = XBLNR;
                        console.log("Json INV", jsonObject2);
                        invnavValue.push(jsonObject2);
                        console.log('SES at index ' + index + ':', LBLNI);
                      }
                    } else {
                      console.log("Item at index " + index + " is undefined or null.");
                    }
                  });


                  // Now HDRTOGRNNAV contains the jsonObject data
                  console.log("GrnNavValue:", grnnavValue);
                  console.log("SesNavValue:", sesnavValue);
                  console.log("InvNavValue:", invnavValue);


                  jsonformat(); // call the jsonformat function 
                }

              },
              error: function (oError) {
                // Handle error
                console.error("Error fetching entities:", oError);
              }
            });

            function jsonformat() { //do not touch this

              //newly added
              let jsonObjects = []; // This will store your JSON objects
              var loop = 0;

              var BTS = [];
              var count = 0;
              invnavValue.forEach((item) => {
                var j;
                var k;
                var invoice = item.XBLNR;
                console.log(invoice);
                var uppercaseInvoice = invoice.toUpperCase();
                console.log(uppercaseInvoice); //

                for (var i = loop; i < SestableData.length; i++) {
                  if (j !== SestableData[i].length) {
                    for (j = 0; j < SestableData[i].length; j++) {
                      // sesvalue.push(SestableData[i][j]);
                      var LBLNI = SestableData[i][j].LBLNI;
                      console.log('LBLNI data:', LBLNI);
                      if (LBLNI !== undefined && LBLNI != '') {
                        var jsonObject1 = {}; // Create a new object in each iteration
                        jsonObject1.BTS_ID = newId;
                        jsonObject1.LBLNI = LBLNI;
                        console.log("Json SES", jsonObject1);
                        sesvalue1.push(jsonObject1);
                      }
                    }
                  } else { break; }
                }
                for (var l = loop; l < GrntableData.length; l++) {
                  if (k !== GrntableData[l].length) {
                    for (k = 0; k < GrntableData[l].length; k++) {
                      // grnvalue.push(GrntableData[l][k]);
                      var MBLNR = GrntableData[l][k].MBLNR;
                      console.log('MBLNR data:', MBLNR);
                      if (MBLNR !== undefined && MBLNR != '') {
                        var jsonObject2 = {}; // Create a new object in each iteration
                        jsonObject2.BTS_ID = newId;
                        jsonObject2.MBLNR = MBLNR;
                        console.log("Json GRN", jsonObject2);
                        grnvalue1.push(jsonObject2);
                      }
                    }
                  } else { break; }
                }
                let newBTS_ID = newId; // "InitialBaseID" should be replaced with actual base part of your ID

                if (custom === '') {
                  custom = "";
                }

                if (gemflag === 'No') { //uncomment for GeM
                  gemInvValue = '';
                }


                var jsonData = {
                  "BTS_ID": newBTS_ID,
                  "DRAFT_ID": draftid,
                  "DOKNR": "", // DMS Document number
                  "EBELN": povalue,
                  "GEM_INV_NO_FLAG": gemflag, //uncomment for GeM
                  "GEM_INV_NO": gemInvValue, //uncomment for GeM
                  "ADVANCE_PAYMENT": advance_payment,
                  "ZAMT": AmountValue,
                  "WAERS": "",
                  "XBLNR": uppercaseInvoice,
                  "ZDATE": formattedDate,
                  "LIFNR": VendorCodeValue,
                  "NAME1": VendorNameValue,
                  "PRCTR": ProfitValue,
                  "EMAIL_ID": EmailValue,
                  "ZTEXT": TextValue,
                  "ZREMARK": RemarkValue,
                  "PLANT": PlantValue,
                  "CUSTOM_INV": checkValue,
                  "STATUS": "PENDING",
                  "FILE_ATTACH": filevalue,
                  "FLAG": "X",
                  "CHANGED_ON": created_on,
                  "CHANGED_BY": created_by,
                  "CHANGED_TIME": isoTime,
                  "HDRTOGRNNAV": grnvalue1, // Assuming these don't change per invoice item
                  "HDRTOSESNAV": sesvalue1 // Assuming these don't change per invoice item
                  // "HDRTOINVNAV": [item] // Here you might want just the current item, or adjust as needed
                };

                var oModell = new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                );

                oModell.create("/ZBTS_CRTSet", jsonData, {
                  success: function (Odata) {
                    console.log('Data sent successfully:', Odata);
                    BTS.push(newBTS_ID);
                    count++;
                    if (count === invnavValue.length) {
                      if (filevalue != '') {
                        var slug = newBTS_ID + "," + filevalue;
                        var oBusyIndicator = new sap.m.BusyDialog();
                        console.log(slug);
                        console.log(fileType)
                        if (typeof fileType !== 'undefined') {
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
                        } else {
                          handleUploadComplete();
                        }

                      } else {
                        handleUploadComplete();
                      }


                      function handleUploadComplete() {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageBox.success(
                          "BTS ID " + newBTS_ID + " is created successfully",
                          {
                            title: "Success",
                            onClose: function (sAction) {
                              location.reload();
                            }
                          }
                        )
                      };
                      // sap.m.MessageBox.success(
                      //   "BTS ID " + BTS + " is created successfully",
                      //   {
                      //     title: "Success",
                      //     onClose: function (sAction) {
                      //       location.reload();
                      //     },
                      //   }
                      // );
                    }

                  },
                  error: function (error) {
                    console.error('Error:', error);
                  }
                });

                jsonObjects.push(jsonData); // Add the generated JSON object to the array
                var idString = newBTS_ID.toString(); //change the bts_id to string to get the last 4 digit
                console.log('STringID:', idString);
                var lastFourDigits = idString.match(/\d{4}$/)[0]; //get the last 4 digit from the bts id
                console.log("Last four digits:", lastFourDigits);
                var incrementedDigits = (parseInt(lastFourDigits, 10) + 1).toString(); //increment the last four digit by 1 and convert back to string

                // Pad the incremented digits with leading zeros to ensure four digits
                incrementedDigits = incrementedDigits.padStart(4, '0');

                console.log("Last four digits incremented:", incrementedDigits);

                newId = povalue + '-BTS-' + incrementedDigits; //get the next bts id
                console.log('Json data:', jsonData);

                var headers = that.getView().getModel().getHeaders();
                console.log(headers);

                loop++;
                sesvalue1 = [];
                grnvalue1 = [];

              });
              //till here newly added

            }
          }
        }

      },

      onCheckboxSelect: function (oEvent) {
        var bSelected = oEvent.getParameter("selected"); // Get the checkbox state: true if selected, false otherwise
        var grn = this.getView().byId("GRN");
        var ses = this.getView().byId("SES");

        if (bSelected) {
          // Perform your action when the checkbox is checked
          checkbox = 'X'
          console.log(checkbox);
          grn.setEnabled(false);
          ses.setEnabled(false);
        } else {
          // Perform your action when the checkbox is unchecked
          checkbox = ' '
          console.log(checkbox);
          grn.setEnabled(true);
          ses.setEnabled(true);
        }
      },

      onAfterRendering: function () {
        var that = this;
        var oMultiInput = this.byId("GRN");
        var oMultiInput1 = this.byId("SES");
        var GRN = this.getView().byId("GRN");
        var SES = this.getView().byId("SES");
        var grnamt = this.getView().byId("GRNAmount");
        var sesamt = this.getView().byId("SESAmount");
        var totgrnamt = this.getView().byId("totgrnamt");
        var totsesamt = this.getView().byId("totsesamt");
        var DRAFTID = this.getView().byId("DraftCode");

        var PO = this.getView().byId('PO');
        var AMOUNT = this.getView().byId('Amount');
        var CURRENCY = this.getView().byId('Currency');
        var PC = this.getView().byId('Profit');
        var DATE = this.getView().byId('DateField');
        var TEXT = this.getView().byId('Text');
        var VC = this.getView().byId('VendorCode');
        var VN = this.getView().byId('vendorName');
        var VM = this.getView().byId('vendorEmail');
        var VP = this.getView().byId('vendorPhno');
        var EMAIL = this.getView().byId('Email');
        var REMARKS = this.getView().byId('Remarks');
        var PLANT = this.getView().byId('Plant');
        var INV = this.getView().byId('Invoice');
        var attach = this.getView().byId('attach');
        var check = this.getView().byId('acceptTermsCheckbox');
        var oModel = new sap.ui.model.odata.v2.ODataModel(
          "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
        );


        DRAFTID.attachBrowserEvent("keypress", function (event) {
          if (event.key === 'Enter' || event.key === ' ' || event.key === ',') {
            console.log('Enter or Space is pressed');
            var draftValue = DRAFTID.getValue();
            console.log(draftValue);
            var oModel = new sap.ui.model.odata.v2.ODataModel(
              "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
            ); // Assuming your OData Model is already set on the view
            var etentityset = "/ZBTS_CRTSet";
            oModel.read(etentityset, {
              urlParameters: {
                $expand: "HDRTOGRNNAV,HDRTOSESNAV", // Expand the HDRTOGRNNAV navigation property
                $filter: "DRAFT_ID eq '" + draftValue + "'"
              },
              success: function (odata) {
                // Success handler
                console.log("Data retrieved successfully:", odata);
                if (odata.results.length === 0) {
                  sap.m.MessageBox.error("Draft Id is Invalid", {
                    onClose: function () {
                      DRAFTID.focus(); //
                      PO.setValue("");
                      VC.setValue("");
                      VN.setValue("");
                      DATE.setValue("");
                      VM.setValue("");
                      VP.setValue("");
                      REMARKS.setValue("");
                      EMAIL.setValue("");
                      attach.setValue("");
                      INV.setValue("");
                      AMOUNT.setValue("");
                      TEXT.setValue("");
                      GRN.setValue("");
                      SES.setValue("");
                      grnamt.setValue("");
                      sesamt.setValue("");
                      totgrnamt.setValue("");
                      totsesamt.setValue("");
                      PC.setValue("");
                      PLANT.setValue("");
                      // PO.setValue("");
                      // PO.setValue("");
                      // PO.setValue("");
                      // PO.setValue("");
                      // PO.setValue("");
                      // PO.setValue("");
                    },
                  });
                  return;
                } else {
                  var oData = odata.results[0];
                  if (oData.DRAFT_ID === '') {
                    sap.m.MessageBox.error("Draft Id is Invalid", {
                      onClose: function () {
                        DRAFTID.focus(); //
                      },
                    });
                    return;
                  } else {

                    //to get the vendor email and vendor phone number
                    var oFilter1 = new sap.ui.model.Filter("LIFNR", sap.ui.model.FilterOperator.EQ, oData.LIFNR);
                    var oFilter2 = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, oData.EBELN);
                    console.log('PO Filtered', oFilter1);
                    oModel.read("/ZbtspoShSet", {
                      filters: [oFilter1, oFilter2],
                      success: function (oData) {
                        console.log("Filtered Data: ", oData.results);
                        console.log("Vendor Email:", oData.results[0].SMTP_ADDR);
                        VM.setValue(oData.results[0].SMTP_ADDR);
                        VP.setValue(oData.results[0].TELF1);
                      }
                    });

                    rootValue = oData;
                    console.log('Root Value:', rootValue);
                    console.log("DraftID:", oData.DRAFT_ID); // Assuming 'DraftID' is the correct property name
                    PO.setValue(oData.EBELN);
                    AMOUNT.setValue(oData.ZAMT);
                    PC.setValue(oData.PRCTR);
                    // DATE.setValue(oData.ZDATE);
                    TEXT.setValue(oData.ZTEXT);
                    VC.setValue(oData.LIFNR);
                    VN.setValue(oData.NAME1);
                    // VM.setValue(oData.)
                    EMAIL.setValue(oData.EMAIL_ID);
                    REMARKS.setValue(oData.ZREMARK);
                    PLANT.setValue(oData.PLANT);
                    attach.setValue(oData.FILE_ATTACH);
                    custom = oData.CUSTOM_INV;
                    console.log(custom);
                    if (custom === 'X') {
                      check.setSelected(true);
                    }
                    INV.setValue(oData.XBLNR);

                    var dateString = decodeURIComponent(oData.ZDATE);
                    var date = new Date(dateString);

                    // Extract year, month, and day components
                    var year = date.getFullYear();
                    var month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding 1 because month index starts from 0
                    var day = ('0' + date.getDate()).slice(-2);

                    // Construct the formatted date string in "YYYY-MM-DD" format
                    var formattedDate = year + '-' + month + '-' + day;

                    console.log(formattedDate); // Output: "2024-03-07"
                    DATE.setValue(formattedDate);

                    let rowDataArray = []; // Array to hold all row data
                    // let filterdata = []; // Array to hold filtered data for later use
                    let rowData = [];

                    // Handling HDRTOGRNNAV results
                    console.log('Odata data:', oData);
                    let grnLength = oData.HDRTOGRNNAV && oData.HDRTOGRNNAV.results ? oData.HDRTOGRNNAV.results.length : 0;
                    let sesLength = oData.HDRTOSESNAV && oData.HDRTOSESNAV.results ? oData.HDRTOSESNAV.results.length : 0;
                    let invLength = oData.HDRTOINVNAV && oData.HDRTOINVNAV.results ? oData.HDRTOINVNAV.results.length : 0;

                    // Use Math.max to find the greatest length
                    let greatestLength = Math.max(grnLength, sesLength, invLength);

                    console.log(`Greatest Length: ${greatestLength}`);
                    // Handling HDRTOGRNNAV results
                    for (var i = 0; i < greatestLength; i++) {
                      if (oData.HDRTOGRNNAV && oData.HDRTOGRNNAV.results) {
                        // for (let i = 0; i < oData.HDRTOGRNNAV.results.length; i++) {
                        grnItem = oData.HDRTOGRNNAV.results[i];
                        if (grnItem) {
                          var token = new Token({
                            key: grnItem.MBLNR,
                            text: grnItem.MBLNR
                          });
                          GRN.addToken(token);
                        }


                        console.log("GRN Item:", grnItem);
                        filterdata.push(grnItem); // Storing the GRN item for later use
                      }
                      if (oData.HDRTOSESNAV && oData.HDRTOSESNAV.results) {
                        // for (let i = 0; i < oData.HDRTOSESNAV.results.length; i++) {
                        sesItem = oData.HDRTOSESNAV.results[i];
                        if (sesItem) {
                          var tokenS = new Token({
                            key: sesItem.LBLNI,
                            text: sesItem.LBLNI
                          });
                          SES.addToken(tokenS);
                        }

                        console.log("SES Item:", sesItem); // Corrected log to say "SES Item"
                        filterdata.push(sesItem); // Storing the SES item for later use
                      }
                      // if (oData.HDRTOINVNAV && oData.HDRTOINVNAV.results) {
                      //   // for (let i = 0; i < oData.HDRTOINVNAV.results.length; i++) {
                      //   invItem = oData.HDRTOINVNAV.results[i];
                      //   console.log("INV Item:", invItem); // Corrected log to say "INV Item"
                      //   filterdata.push(invItem); // Storing the INV item for later use
                      // }
                      rowData = {
                        MBLNR: grnItem?.MBLNR || '',
                        LBLNI: sesItem?.LBLNI || '',
                        // XBLNR: invItem?.XBLNR || ''

                      };

                      if (rowData && (rowData.MBLNR || rowData.LBLNI || rowData.XBLNR)) {
                        rowDataArray.push(rowData); // Add rowData to the array
                        console.log("Unified Row Data Array:", rowDataArray);
                      }

                    }

                    console.log("Unified Row Data Array:", rowDataArray);
                  }
                }

              },
              error: function (oError) {
                // Error handler
                sap.m.MessageBox.error("Draft Id is Invalid");
                console.error("Error retrieving data:", oError);
              }

            });
          }
        });

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


                  //Added on 07.09.2024 for enter pressed
                  var oTable = that.getView().byId("DraftTable1");
                  var aItems = oTable.getItems();

                  // Array to store the data

                  InvtableData = [];
                  GrntableData = [];
                  SestableData = [];
                  var grntablefinal = [];
                  var sestablefinal = [];
                  var invoiceValidation = [];
                  aItems.forEach(function (oItem, index) {
                    var aCells = oItem.getCells();
                    dupflag = true;
                    dupflag1 = true;
                    var InvrowData = {};
                    var SesrowData = {};
                    var invoiceValidation = [];
                    // Assuming the GRN and SES MultiInput controls are directly inside the cells of the table's rows
                    // and each row follows the same structure

                    var oGRNMultiInput = aCells[2]; // Adjust the index according to your table structure
                    var oSESMultiInput = aCells[3]; // Adjust the index according to your table structure
                    var invoiceCell = aCells[0]; // Accessing the first cell in the row
                    var invoiceValue = invoiceCell.getValue(); // Retrieving the text content of the cell
                    console.log("INDEXXXX: ", index);
                    // Check if the invoice cell is empty
                    var aGRNTokens = oGRNMultiInput.getTokens(); // Retrieve all tokens from the GRN MultiInput
                    var aGRNValues = aGRNTokens.map(function (token) {
                      return token.getText(); // Use .getKey() if you have set keys for the tokens
                    })

                    var aSESTokens = oSESMultiInput.getTokens(); // Retrieve all tokens from the SES MultiInput
                    var aSESValues = aSESTokens.map(function (token) {
                      return token.getText(); // Use .getKey() if you have set keys for the tokens
                    });

                    console.log('aGRNValues', aGRNValues);
                    console.log('aSESValues', aSESValues);

                    for (var i = 0; i < aGRNValues.length; i++) {
                      for (var j = i + 1; j < aGRNValues.length; j++) {
                        if (aGRNValues[i] === aGRNValues[j]) {
                          sap.ui.core.BusyIndicator.hide(); //31
                          sap.m.MessageBox.error('Duplicate GRN found: ' + aGRNValues[i]);
                          dupflag = false;
                        } else {
                          dupflag = true;
                        }
                      }
                    }

                    for (var k = 0; k < aSESValues.length; k++) {
                      for (var l = k + 1; l < aSESValues.length; l++) {
                        if (aSESValues[k] === aSESValues[l]) {
                          sap.ui.core.BusyIndicator.hide(); //31
                          sap.m.MessageBox.error('Duplicate SES found: ' + aSESValues[k]);
                          dupflag1 = false;
                        }
                      }
                    }

                    if (dupflag) {
                      if (aGRNValues.length > 0) {
                        var amtsum = 0;
                        var amount;
                        var totamtsum = 0;
                        var totamt;

                        handleGRNValues(aGRNValues);
                        handleGRNAmount(aGRNValues);
                        function handleGRNValues(aGRNValues) {
                          var promises = [];  // Array to hold promises from each asynchronous operation
                          var grnbts = [];    // Array to collect all results to be used in the informationfunc

                          for (var i = 0; i < aGRNValues.length; i++) {
                            // Create a promise for each asynchronous operation
                            var promise = new Promise((resolve, reject) => {
                              var oFilter = new sap.ui.model.Filter("MBLNR", sap.ui.model.FilterOperator.EQ, aGRNValues[i]);
                              oModel.read("/ZGRN_PRV_AMTSet", {
                                filters: [oFilter],
                                success: function (oData) {
                                  console.log("GRN Entities fetched successfully:", oData.results);
                                  if (oData.results.length > 0) {
                                    oData.results.forEach(result => {
                                      grnbts.push(result.BTS_ID);  // Assuming you want to collect BTS_IDs
                                      amount = parseFloat(result.ZAMOUNT);
                                      amtsum = amtsum + amount;
                                      console.log("amtsum:", amtsum);
                                      grnamt.setValue(amtsum);
                                    });
                                  }
                                  resolve();  // Resolve the promise when the read is successful and data has been processed
                                },
                                error: function (err) {
                                  console.log("Error fetching GRN entities", err);
                                  reject(err);  // Reject the promise if there's an error
                                }
                              });
                            });
                            promises.push(promise);
                          }

                          // Once all promises are resolved, call the information function
                          Promise.all(promises).then(() => {
                            console.log("All GRN values have been processed:", grnbts);
                            informationfunc(grnbts);  // Call the function only once after all asynchronous operations are completed
                          }).catch(error => {
                            console.error("An error occurred processing the GRN values", error);
                          });
                        }

                        function informationfunc(grnbts) {
                          if (grnbts.length > 0) {
                            sap.ui.core.BusyIndicator.hide(); //31
                            sap.m.MessageBox.success(
                              "BTS ID already exists for the selected GRN : " + grnbts.join(", "),
                              {
                                title: "Note***",
                                onClose: function (sAction) {
                                  // Actions to perform on close, if necessary
                                },
                              }
                            );
                          }

                        }

                        function handleGRNAmount(aGRNValues) {
                          // var promises2 = [];  // Array to hold promises from each asynchronous operation

                          for (var i = 0; i < aGRNValues.length; i++) {
                            // Create a promise for each asynchronous operation
                            // var promise = new Promise((resolve, reject) => {
                            var oFilter = new sap.ui.model.Filter("MBLNR", sap.ui.model.FilterOperator.EQ, aGRNValues[i]);
                            oModel.read("/ZbtsgrnShSet", {
                              filters: [oFilter],
                              success: function (oData) {
                                console.log("GRN Entities fetched successfully:", oData.results);
                                if (oData.results.length > 0) {
                                  oData.results.forEach(result => {
                                    // grnbts.push(result.BTS_ID);  // Assuming you want to collect BTS_IDs
                                    totamt = parseFloat(result.DMBTR);
                                    totamtsum = totamtsum + totamt;
                                    console.log("amtsum:", totamtsum);
                                    totgrnamt.setValue(totamtsum);
                                  });
                                }
                                // resolve();  // Resolve the promise when the read is successful and data has been processed
                              },
                              error: function (err) {
                                console.log("Error fetching GRN entities", err);
                                reject(err);  // Reject the promise if there's an error
                              }
                            });
                            // });
                            // promises.push(promise);
                          }

                        }
                      } else {
                        grnamt.setValue("");
                        totgrnamt.setValue("");
                      }
                    } else {
                      grnamt.setValue("");
                      totgrnamt.setValue("");
                    }

                    if (dupflag1) {
                      if (aSESValues.length > 0) {
                        var amtsum1 = 0;
                        var amount1;
                        var totamtsum1 = 0;
                        var totamount1;
                        var btsid1 = [];

                        handleSESValues(aSESValues);
                        handleSESAmount(aSESValues);
                        function handleSESValues(aSESValues) {
                          var promises1 = [];  // Array to hold promises from each asynchronous operation
                          var sesbts = [];    // Array to collect all results to be used in the informationfunc

                          for (var i = 0; i < aSESValues.length; i++) {
                            // Create a promise for each asynchronous operation
                            var promise1 = new Promise((resolve, reject) => {
                              var oFilter = new sap.ui.model.Filter("LBLNI", sap.ui.model.FilterOperator.EQ, aSESValues[i]);
                              oModel.read("/ZSES_PRV_AMTSet", {
                                filters: [oFilter],
                                success: function (oData) {
                                  console.log("SES Entities fetched successfully:", oData.results);
                                  if (oData.results.length > 0) {
                                    oData.results.forEach(result => {
                                      sesbts.push(result.BTS_ID);  // Assuming you want to collect BTS_IDs
                                      amount1 = parseFloat(result.ZAMOUNT);
                                      amtsum1 = amtsum1 + amount1;
                                      console.log("amtsum:", amtsum1);
                                      sesamt.setValue(amtsum1);
                                    });
                                  }
                                  resolve();  // Resolve the promise when the read is successful and data has been processed
                                },
                                error: function (err) {
                                  console.log("Error fetching GRN entities", err);
                                  reject(err);  // Reject the promise if there's an error
                                }
                              });
                            });
                            promises1.push(promise1);
                          }

                          // Once all promises are resolved, call the information function
                          Promise.all(promises1).then(() => {
                            console.log("All SES values have been processed:", sesbts);
                            informationfunc1(sesbts);  // Call the function only once after all asynchronous operations are completed
                          }).catch(error => {
                            console.error("An error occurred processing the GRN values", error);
                          });
                        }
                        function informationfunc1(sesbts) {
                          if (sesbts.length > 0) {
                            sap.ui.core.BusyIndicator.hide(); //31
                            sap.m.MessageBox.success(
                              "BTS ID already exists for the selected SES : " + sesbts.join(", "),
                              {
                                title: "Note***",
                                onClose: function (sAction) {
                                  // Actions to perform on close, if necessary
                                },
                              }
                            );
                          }

                        }

                        function handleSESAmount(aSESValues) {
                          // var promises2 = [];  // Array to hold promises from each asynchronous operation

                          for (var i = 0; i < aSESValues.length; i++) {
                            // Create a promise for each asynchronous operation
                            // var promise = new Promise((resolve, reject) => {
                            var oFilter1 = new sap.ui.model.Filter("LBLNI", sap.ui.model.FilterOperator.EQ, aSESValues[i]);
                            oModel.read("/ZbtssesShSet", {
                              filters: [oFilter1],
                              success: function (oData) {
                                console.log("SES Entities fetched successfully:", oData.results);
                                if (oData.results.length > 0) {
                                  oData.results.forEach(result => {
                                    // grnbts.push(result.BTS_ID);  // Assuming you want to collect BTS_IDs
                                    totamount1 = parseFloat(result.NETWR);
                                    totamtsum1 = totamtsum1 + totamount1;
                                    console.log("amtsum:", totamtsum1);
                                    totsesamt.setValue(totamtsum1);
                                  });
                                }
                                // resolve();  // Resolve the promise when the read is successful and data has been processed
                              },
                              error: function (err) {
                                console.log("Error fetching GRN entities", err);
                                reject(err);  // Reject the promise if there's an error
                              }
                            });
                            // });
                            // promises.push(promise);
                          }
                        }
                      } else {
                        sesamt.setValue("");
                        totsesamt.setValue("");
                      }
                    } else {
                      sesamt.setValue("");
                      totsesamt.setValue("");
                    }
                  });
                  //Added till here on 07.09.2024 for enter pressed

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

            //added on 13.05.2024 enter press in amount field
            if (oCell instanceof sap.m.Input) {
              var oMultiInput2 = oCell;


              oMultiInput2.attachBrowserEvent("keypress", function (event) {
                // Check if either Enter or Space is pressed
                if (event.key === 'Enter' || event.key === ' ' || event.key === ',') {
                  console.log('Enter or Space is pressed');

                  // Prevent the default action to stop space from being added to the input
                  // event.preventDefault(); // commented on 20.06.2024 due to space not allowing to enter

                  // Get the trimmed value from the MultiInput
                  var grnvalue = oMultiInput2.getValue().trim();
                  console.log(grnvalue);

                  //added on 24.04,2024
                  var oTable = that.getView().byId("DraftTable1");
                  var aItems = oTable.getItems();

                  // Array to store the data

                  InvtableData = [];
                  GrntableData = [];
                  SestableData = [];
                  var grntablefinal = [];
                  var sestablefinal = [];
                  var invoiceValidation = [];
                  aItems.forEach(function (oItem, index) {
                    var aCells = oItem.getCells();
                    dupflag = true;
                    dupflag1 = true;
                    var InvrowData = {};
                    var SesrowData = {};
                    var invoiceValidation = [];
                    // Assuming the GRN and SES MultiInput controls are directly inside the cells of the table's rows
                    // and each row follows the same structure

                    var oGRNMultiInput = aCells[2]; // Adjust the index according to your table structure
                    var oSESMultiInput = aCells[3]; // Adjust the index according to your table structure
                    var invoiceCell = aCells[0]; // Accessing the first cell in the row
                    var invoiceValue = invoiceCell.getValue(); // Retrieving the text content of the cell
                    console.log("INDEXXXX: ", index);
                    // Check if the invoice cell is empty
                    var aGRNTokens = oGRNMultiInput.getTokens(); // Retrieve all tokens from the GRN MultiInput
                    var aGRNValues = aGRNTokens.map(function (token) {
                      return token.getText(); // Use .getKey() if you have set keys for the tokens
                    })

                    var aSESTokens = oSESMultiInput.getTokens(); // Retrieve all tokens from the SES MultiInput
                    var aSESValues = aSESTokens.map(function (token) {
                      return token.getText(); // Use .getKey() if you have set keys for the tokens
                    });

                    console.log('aGRNValues', aGRNValues);
                    console.log('aSESValues', aSESValues);

                    for (var i = 0; i < aGRNValues.length; i++) {
                      for (var j = i + 1; j < aGRNValues.length; j++) {
                        if (aGRNValues[i] === aGRNValues[j]) {
                          sap.ui.core.BusyIndicator.hide(); //31
                          sap.m.MessageBox.error('Duplicate GRN found: ' + aGRNValues[i]);
                          dupflag = false;
                        } else {
                          dupflag = true;
                        }
                      }
                    }

                    for (var k = 0; k < aSESValues.length; k++) {
                      for (var l = k + 1; l < aSESValues.length; l++) {
                        if (aSESValues[k] === aSESValues[l]) {
                          sap.ui.core.BusyIndicator.hide(); //31
                          sap.m.MessageBox.error('Duplicate SES found: ' + aSESValues[k]);
                          dupflag1 = false;
                        }
                      }
                    }

                    if (dupflag) {
                      if (aGRNValues.length > 0) {
                        var amtsum = 0;
                        var amount;
                        var totamtsum = 0;
                        var totamt;

                        handleGRNValues(aGRNValues);
                        handleGRNAmount(aGRNValues);
                        function handleGRNValues(aGRNValues) {
                          var promises = [];  // Array to hold promises from each asynchronous operation
                          var grnbts = [];    // Array to collect all results to be used in the informationfunc

                          for (var i = 0; i < aGRNValues.length; i++) {
                            // Create a promise for each asynchronous operation
                            var promise = new Promise((resolve, reject) => {
                              var oFilter = new sap.ui.model.Filter("MBLNR", sap.ui.model.FilterOperator.EQ, aGRNValues[i]);
                              oModel.read("/ZGRN_PRV_AMTSet", {
                                filters: [oFilter],
                                success: function (oData) {
                                  console.log("GRN Entities fetched successfully:", oData.results);
                                  if (oData.results.length > 0) {
                                    oData.results.forEach(result => {
                                      grnbts.push(result.BTS_ID);  // Assuming you want to collect BTS_IDs
                                      amount = parseFloat(result.ZAMOUNT);
                                      amtsum = amtsum + amount;
                                      console.log("amtsum:", amtsum);
                                      grnamt.setValue(amtsum);
                                    });
                                  }
                                  resolve();  // Resolve the promise when the read is successful and data has been processed
                                },
                                error: function (err) {
                                  console.log("Error fetching GRN entities", err);
                                  reject(err);  // Reject the promise if there's an error
                                }
                              });
                            });
                            promises.push(promise);
                          }

                          // Once all promises are resolved, call the information function
                          Promise.all(promises).then(() => {
                            console.log("All GRN values have been processed:", grnbts);
                            informationfunc(grnbts);  // Call the function only once after all asynchronous operations are completed
                          }).catch(error => {
                            console.error("An error occurred processing the GRN values", error);
                          });
                        }

                        function informationfunc(grnbts) {
                          if (grnbts.length > 0) {
                            sap.ui.core.BusyIndicator.hide(); //31
                            sap.m.MessageBox.success(
                              "BTS ID already exists for the selected GRN : " + grnbts.join(", "),
                              {
                                title: "Note***",
                                onClose: function (sAction) {
                                  // Actions to perform on close, if necessary
                                },
                              }
                            );
                          }

                        }

                        function handleGRNAmount(aGRNValues) {
                          // var promises2 = [];  // Array to hold promises from each asynchronous operation

                          for (var i = 0; i < aGRNValues.length; i++) {
                            // Create a promise for each asynchronous operation
                            // var promise = new Promise((resolve, reject) => {
                            var oFilter = new sap.ui.model.Filter("MBLNR", sap.ui.model.FilterOperator.EQ, aGRNValues[i]);
                            oModel.read("/ZbtsgrnShSet", {
                              filters: [oFilter],
                              success: function (oData) {
                                console.log("GRN Entities fetched successfully:", oData.results);
                                if (oData.results.length > 0) {
                                  oData.results.forEach(result => {
                                    // grnbts.push(result.BTS_ID);  // Assuming you want to collect BTS_IDs
                                    totamt = parseFloat(result.DMBTR);
                                    totamtsum = totamtsum + totamt;
                                    console.log("amtsum:", totamtsum);
                                    totgrnamt.setValue(totamtsum);
                                  });
                                }
                                // resolve();  // Resolve the promise when the read is successful and data has been processed
                              },
                              error: function (err) {
                                console.log("Error fetching GRN entities", err);
                                reject(err);  // Reject the promise if there's an error
                              }
                            });
                            // });
                            // promises.push(promise);
                          }
                        }
                      } else {
                        grnamt.setValue("");
                        totgrnamt.setValue("");
                      }
                    } else {
                      grnamt.setValue("");
                      totgrnamt.setValue("");
                    }

                    if (dupflag1) {
                      if (aSESValues.length > 0) {
                        var amtsum1 = 0;
                        var amount1;
                        var totamtsum1 = 0;
                        var totamount1;
                        var btsid1 = [];

                        handleSESValues(aSESValues);
                        handleSESAmount(aSESValues);
                        function handleSESValues(aSESValues) {
                          var promises1 = [];  // Array to hold promises from each asynchronous operation
                          var sesbts = [];    // Array to collect all results to be used in the informationfunc

                          for (var i = 0; i < aSESValues.length; i++) {
                            // Create a promise for each asynchronous operation
                            var promise1 = new Promise((resolve, reject) => {
                              var oFilter = new sap.ui.model.Filter("LBLNI", sap.ui.model.FilterOperator.EQ, aSESValues[i]);
                              oModel.read("/ZSES_PRV_AMTSet", {
                                filters: [oFilter],
                                success: function (oData) {
                                  console.log("SES Entities fetched successfully:", oData.results);
                                  if (oData.results.length > 0) {
                                    oData.results.forEach(result => {
                                      sesbts.push(result.BTS_ID);  // Assuming you want to collect BTS_IDs
                                      amount1 = parseFloat(result.ZAMOUNT);
                                      amtsum1 = amtsum1 + amount1;
                                      console.log("amtsum:", amtsum1);
                                      sesamt.setValue(amtsum1);
                                    });
                                  }
                                  resolve();  // Resolve the promise when the read is successful and data has been processed
                                },
                                error: function (err) {
                                  console.log("Error fetching GRN entities", err);
                                  reject(err);  // Reject the promise if there's an error
                                }
                              });
                            });
                            promises1.push(promise1);
                          }

                          // Once all promises are resolved, call the information function
                          Promise.all(promises1).then(() => {
                            console.log("All SES values have been processed:", sesbts);
                            informationfunc1(sesbts);  // Call the function only once after all asynchronous operations are completed
                          }).catch(error => {
                            console.error("An error occurred processing the GRN values", error);
                          });
                        }
                        function informationfunc1(sesbts) {
                          if (sesbts.length > 0) {
                            sap.ui.core.BusyIndicator.hide(); //31
                            sap.m.MessageBox.success(
                              "BTS ID already exists for the selected SES : " + sesbts.join(", "),
                              {
                                title: "Note***",
                                onClose: function (sAction) {
                                  // Actions to perform on close, if necessary
                                },
                              }
                            );
                          }

                        }

                        function handleSESAmount(aSESValues) {
                          // var promises2 = [];  // Array to hold promises from each asynchronous operation

                          for (var i = 0; i < aSESValues.length; i++) {
                            // Create a promise for each asynchronous operation
                            // var promise = new Promise((resolve, reject) => {
                            var oFilter1 = new sap.ui.model.Filter("LBLNI", sap.ui.model.FilterOperator.EQ, aSESValues[i]);
                            oModel.read("/ZbtssesShSet", {
                              filters: [oFilter1],
                              success: function (oData) {
                                console.log("SES Entities fetched successfully:", oData.results);
                                if (oData.results.length > 0) {
                                  oData.results.forEach(result => {
                                    // grnbts.push(result.BTS_ID);  // Assuming you want to collect BTS_IDs
                                    totamount1 = parseFloat(result.NETWR);
                                    totamtsum1 = totamtsum1 + totamount1;
                                    console.log("amtsum:", totamtsum1);
                                    totsesamt.setValue(totamtsum1);
                                  });
                                }
                                // resolve();  // Resolve the promise when the read is successful and data has been processed
                              },
                              error: function (err) {
                                console.log("Error fetching GRN entities", err);
                                reject(err);  // Reject the promise if there's an error
                              }
                            });
                            // });
                            // promises.push(promise);
                          }
                        }
                      } else {
                        sesamt.setValue("");
                        totsesamt.setValue("");
                      }
                    } else {
                      sesamt.setValue("");
                      totsesamt.setValue("");
                    }
                  });
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

      onDocButton: function (oEvent) {
        sap.ui.core.BusyIndicator.show();
        var oButton = oEvent.getSource();
        var oListItem = oButton.getParent();
        var oBindingContext = oListItem.getBindingContext();
        var sFileName = this.getView().byId("attach").getValue();
        var sdraftid = this.getView().byId("DraftCode").getValue();


        // alert("Filename: " + sFileName);

        if (sFileName === '') {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageBox.error("No document is available");
        }
        else {
          var url = "/sap/opu/odata/sap/ZBTS_ODATA_SRV/ZDRAFT_UPLOADSet(BTS_ID='',DRAFT_ID='" + sdraftid + "')/$value";

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
        var document = this.getView().byId("attach");
        var viewbutton = this.getView().byId("b1");
        var changebutton = this.getView().byId("b2");

        file.setVisible(true);
        document.setVisible(false);
        viewbutton.setVisible(false);
        changebutton.setVisible(false);
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

      // onPreviewPress: function () {  //This is to preview the pdf before saving 
      //   if (this._pdfContent) {
      //     // Open PDF in a new tab
      //     var win = window.open();
      //     win.document.write('<iframe src="' + this._pdfContent + '" width="100%" height="100%"></iframe>');
      //   } else {
      //     sap.m.MessageToast.show("No PDF available for preview.");
      //   }
      // },

      onSelectChange: function (oEvent) {
        AdvPay = oEvent.getParameter("selectedItem").getKey();
        // Handle the selection change
        console.log("Selected payment method:", AdvPay);
      },

      //uncomment for GeM
      onSelectChange1: function (oEvent) {
        var GemInvNo = this.getView().byId("GemInvNo");
        AdvPay2 = oEvent.getParameter("selectedItem").getKey();
        // Handle the selection change
        console.log("Selected payment method:", AdvPay2);
        gemflag = AdvPay2;

        if (AdvPay2 === 'Yes') {
          GemInvNo.setVisible(true);
        } else {
          GemInvNo.setVisible(false);
        }
      },

      onVendorCheckSelect: function (oEvent) {
        var bSelected = oEvent.getParameter("selected"); // true = checked, false = unchecked
        console.log("Checkbox state:", bSelected);
        var grn = this.getView().byId("GRN");
        var ses = this.getView().byId("SES");
        var PO = this.getView().byId("PO").getValue();
        var VCode = this.getView().byId("VendorCode").getValue();
        var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZBTS_ODATA_SRV/");
        var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
        var oFilter1 = new sap.ui.model.Filter("LIFNR", sap.ui.model.FilterOperator.EQ, VCode);
        
        if (bSelected) {
          checkBox = false;
          grn.setEnabled(false);
          ses.setEnabled(false);
          grn.removeAllTokens();
          ses.removeAllTokens();
        } else {
          checkBox = true;
          oModel.read("/ZbtsImpShSet", {
            filters: [oFilter, oFilter1],
            success: function (oData) {
              if (oData.results.length > 0) {
                grn.setEnabled(false);
                ses.setEnabled(false);
              } else {
                var sPath = "/ZbtspoShSet('" + PO + "')";
                oModel.read(sPath, {
                  success: function (oData) {
                    if (oData.BSART === 'ZDOM' || oData.BSART === 'ZCDO' || oData.BSART === 'ZEME' || oData.BSART === 'ZRET' || oData.BSART === 'ZRFB' || oData.BSART === 'ZIMP' || oData.BSART === 'ZSTA' || oData.BSART === 'ZSTO' || oData.BSART === 'ZGAS' || oData.BSART === 'ZGAT') {
                      grn.setEnabled(true);
                      ses.setEnabled(false);
                      grn.removeAllTokens();
                      ses.removeAllTokens();
                      grnval = true;
                      sesval = false;
                    } else if (oData.BSART === 'ZSRV' || oData.BSART === 'ZPSR' || oData.BSART === 'ZIMS' || oData.BSART === 'ZEMS') {
                      grn.setEnabled(false);
                      ses.setEnabled(true);
                      grn.removeAllTokens();
                      ses.removeAllTokens();
                    } else if (oData.BSART === 'ZINS' || oData.BSART === 'FO') {
                      grn.setEnabled(false);
                      ses.setEnabled(false);
                      grn.removeAllTokens();
                      ses.removeAllTokens();
                    } else if (oData.BSART === 'ZLOC' || oData.BSART === 'ZTUR' || oData.BSART === 'ZCTU') {
                      grn.setEnabled(true);
                      ses.setEnabled(true);
                      grn.removeAllTokens();
                      ses.removeAllTokens();
                    }
                  }
                });
              }
            }
          });
        }
      }

      // onVendorCheckSelect: function (oEvent) {
      //   var bSelected = oEvent.getParameter("selected"); // true = checked, false = unchecked
      //   console.log("Checkbox state:", bSelected);
      //   var grn = this.getView().byId("GRN");
      //   var ses = this.getView().byId("SES");

      //   if (bSelected) {
      //     checkBox = false;
      //     grn.setEnabled(false);
      //     ses.setEnabled(false);
      //     grn.removeAllTokens();
      //     ses.removeAllTokens();
      //   } else {
      //     checkBox = true;
      //     grn.setEnabled(true);
      //     ses.setEnabled(true);
      //   }
      // }


    });
  }
);
