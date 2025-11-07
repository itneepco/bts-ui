sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/Token", "sap/ui/unified/FileUploaderParameter"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, Token, FileUploaderParameter) {
    "use strict";
    var MBLNR;
    var LBLNI;
    var jsonObjects;
    var povalue;
    var AmountValue;
    var CurrencyValue;
    var formattedDate;
    var isoTime;
    var formattedDate1;
    var VendorCodeValue;
    var VendorNameValue;
    var VendorEmailValue;
    var VendorPhNoValue;
    var EmailValue;
    var PlantValue;
    var advance_paymentValue;
    var advance_payment;
    var AdvPay;
    var AdvPay1;
    var ProfitValue;
    var TextValue;
    var RemarkValue;
    var filevalue;
    var gemInvValue;
    var InvtableData = [];
    var GrntableData = [];
    var SestableData = [];
    var csrfToken;
    var vval;
    var val;
    var sesvalue1 = [];
    var grnvalue1 = [];
    var checkbox;
    var currentDate;
    var dupflag = true;
    var dupflag1 = true;
    var grnbts = [];
    var imp = true;
    var grnval = true;
    var sesval = true;
    var sUserId;
    var created_on;
    var created_by;
    var created_mail;
    var filesUpload = [];
    var gemflag;
    var checkBox = true;
    var checkValue;
    let stopExecution;

    return Controller.extend("bts.controller.Create", {
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
          .getRoute("create")
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


      },

      _onRouteMatched: function () {
        // var scsrf = this.getView().getModel().getHeaders()["x-csrf-token"];
        //     console.log(scsrf);

        // Create a new instance of ODataModel
        var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZBTS_ODATA_SRV");

        // Function to handle successful data retrieval
        function onSuccess(data, response) {
          // Extract headers from the response
          var headers = response.headers;
          console.log('Response Headers:', headers);

          // Extract specific headers if needed
          var csrfToken = headers['x-csrf-token'];
          console.log('CSRF Token:', csrfToken);
        }

        // Function to handle error
        function onError(error) {
          console.error('Error:', error);
        }

        // Read data from the service
        oModel.read("/ZBTS_CRTSet", {
          success: onSuccess,
          error: onError
        });



        // Assuming this code is within a controller or a JavaScript file related to the view
        // var oMultiInput = this.getView().byId("GRN");

        // Assuming you have a JSONModel named "oModel" containing the data
        // oMultiInput.bindAggregation("suggestionItems", {
        //   path: "/ZbtsgrnShSet", // Specify your model path here
        //   template: new sap.ui.core.Item({
        //     key: "{MBLNR}",
        //     text: "{MBLNR}"
        //   })
        // });


        var oDatePicker = this.byId("DateField");
        // Set the current system date as the initial value of the DatePicker
        oDatePicker.setDateValue(new Date());

      },

      onInputChange: function (oEvent) {
        var oInput = oEvent.getSource();
        var sInputId = oInput.getId();
        sap.ui.getCore().byId(sInputId).setValueState("None");

        var userInput = oEvent.getParameter("value");
        var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZBTS_ODATA_SRV/");
        var oInput = this.getView().byId("PO");
        var VendorCode = this.getView().byId("VendorCode");
        var name1 = this.getView().byId("vendorName");
        var Invoice = this.getView().byId("Invoice");
        var Amount = this.getView().byId("Amount");
        var DateField = this.getView().byId("DateField");
        var ProfitCenter = this.getView().byId("Profit");
        var Email = this.getView().byId("Email");
        var Text = this.getView().byId("Text");
        var Remarks = this.getView().byId("Remarks");
        var fileattach = this.getView().byId("fileUploaderBankMandate");
        var prvAMt = this.getView().byId("PreAmount");
        var checkb = this.getView().byId("acceptTermsCheckbox");
        var grn = this.getView().byId("GRN");
        var ses = this.getView().byId("SES");



        var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.Contains, userInput);

        // Bind the suggestion items with the filtered data
        oInput.bindAggregation("suggestionItems", {
          path: "/ZvcShSet",
          template: new sap.ui.core.Item({
            text: "{EBELN}"
          }),
          filters: [oFilter]
        });

        oInput.setModel(oModel);

        var inputValue = oEvent.getParameter("value");
        var maxLength = 10;

        if (inputValue.length > maxLength) {
          console.log('Max length is exceeding 10');
          var trimmedValue = inputValue.substring(0, maxLength);
          console.log('trimmed po', trimmedValue);
          sap.m.MessageBox.error("PO Number cannot exceed 10 digits", {
            onClose: function () {
              oInput.focus();
              oInput.setValue(trimmedValue);
            },
          });
          return;
        } else {
          //validation for grn and ses
          var oModel = new sap.ui.model.odata.v2.ODataModel(
            "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
          );
          var sPath = "/ZbtspoShSet('" + inputValue + "')";
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
        var Profit = this.getView().byId("Profit").getValue(),
          Email = this.getView().byId("Email");

        if (!Profit) {
          Email.setValue("");
        }

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

      onVendorChange: function (oEvent) {
        var oInput = this.getView().byId("VendorCode");
        var inputValue = oEvent.getParameter("value");
        var maxLength = 10;

        if (inputValue.length > maxLength) {
          console.log('Max length is exceeding 10');
          sap.m.MessageBox.error("Vendor Code cannot exceed 10 digits", {
            onClose: function () {
              oInput.focus();
            },
          });
          return;
        }
      },

      // This is Search Help for PO NUmber
      onPOHelpRequest: function (oEvent) {
        var that = this;
        var oInput = oEvent.getSource();
        var sInputId = oInput.getId();
        var VendorCode = this.getView().byId("VendorCode");
        var name1 = this.getView().byId("vendorName");

        var Invoice = this.getView().byId("Invoice");
        var Amount = this.getView().byId("Amount");
        var DateField = this.getView().byId("DateField");
        var ProfitCenter = this.getView().byId("Profit");
        var Email = this.getView().byId("Email");
        var Text = this.getView().byId("Text");
        var Remarks = this.getView().byId("Remarks");
        var fileattach = this.getView().byId("fileUploaderBankMandate");
        var grn = this.getView().byId("GRN");
        var ses = this.getView().byId("SES");


        sap.ui.getCore().byId(sInputId).setValueState("None");

        // Invoke the value help function
        valueHelp();

        // Function to create and open the value help dialog
        function valueHelp() {
          // Create the value help dialog
          var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
            title: "PO Number",
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

                var oPOInput = sap.ui.getCore().byId(sInputId);
                // Check if the selected PO is different from the current value
                if (oPOInput.getValue() !== sSelectedPO) {
                  // The PO has changed, clear all relevant fields here
                  clearOtherFields();
                  oPOInput.setValue(sSelectedPO); // Update the PO field with the selected value
                } else {
                  // PO hasn't changed, no need to clear fields
                  oPOInput.setValue(sSelectedPO);
                }
                oPOInput.setValueState("None");


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

              function clearOtherFields() {

                VendorCode.setValue("");
                name1.setValue("");
                Invoice.setValue("");
                Amount.setValue("");
                // DateField.setValue("");
                ProfitCenter.setValue("");
                Email.setValue("");
                Text.setValue("");
                Remarks.setValue("");
                fileattach.setValue("");
                grn.setEnabled(true);
                ses.setEnabled(true);

                var oTable = that.getView().byId("Table1");
                oTable.getItems().forEach(function (oItem) {
                  var inv = oItem.getCells()[0];
                  var invtext = oItem.getCells()[1];
                  var grn = oItem.getCells()[2];
                  var ses = oItem.getCells()[3];
                  var amt = oItem.getCells()[4];
                  var doc = oItem.getCells()[5];
                  if (inv) {
                    inv.setValue("");
                  }
                  if (invtext) {
                    invtext.setValue("");
                  }
                  if (grn && grn.removeAllTokens) {
                    grn.removeAllTokens();
                  }
                  if (ses && ses.removeAllTokens) {
                    ses.removeAllTokens();
                  }
                  if (amt) {
                    amt.setValue("");
                  }
                  if (doc) {
                    doc.setValue("");
                  }
                });
              }

              // if (aTokens.length > 0) {
              //   var oToken = aTokens[0];
              //   sap.ui.getCore().byId(sInputId).setValue(oToken.getKey());
              //   sap.ui.getCore().byId(sInputId).setValueState("None");
              // }

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
        // var curr = this.getView().byId("Currency");
        sap.ui.getCore().byId(sInputId).setValueState("None");
        console.log('PO value', PO);

        var VendorCode = this.byId("VendorCode");
        var vendorName = this.byId("vendorName");
        var venemail = this.getView().byId("vendorEmail");
        var venphone = this.getView().byId("vendorPhno");

        // Invoke the value help function


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
            // else{
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

                            //validation for grn and ses
                            // var oModel = new sap.ui.model.odata.v2.ODataModel(
                            //   "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                            // );
                            // var sPath = "/ZbtspoShSet('" + PO + "')";
                            // oModel.read(sPath, {
                            //   success: function (oData) {
                            //     console.log('BTS fetch doc type:', oData);
                            //     if (oData.BSART === 'ZDOM' || oData.BSART === 'ZCDO' || oData.BSART === 'ZEME' || oData.BSART === 'ZRET' || oData.BSART === 'ZRFB' || oData.BSART === 'ZIMP' || oData.BSART === 'ZSTA' || oData.BSART === 'ZSTO' || oData.BSART === 'ZGAS' || oData.BSART === 'ZGAT') {
                            //       console.log('GRN is Mandatory');
                            //       grn.setEnabled(true);
                            //       ses.setValue("");
                            //       ses.setEnabled(false);
                            //       grnval = true;
                            //       sesval = false;
                            //     } else if (oData.BSART === 'ZSRV' || oData.BSART === 'ZPSR' || oData.BSART === 'ZIMS' || oData.BSART === 'ZEMS') {
                            //       console.log('SES is Mandatory');
                            //       grn.setValue("");
                            //       grn.setEnabled(false);
                            //       ses.setEnabled(true);
                            //       grnval = false;
                            //       sesval = true;
                            //     } else if (oData.BSART === 'ZINS' || oData.BSART === 'FO') {
                            //       console.log('Insurance PO');
                            //       grn.setEnabled(false);
                            //       ses.setEnabled(false);
                            //       // curr.setEnabled(true);
                            //       imp = true;
                            //     }
                            //   }
                            // });

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
                                // if (GR_PO === false) {
                                //   console.log('GR Based PO');
                                //   grn.setEnabled(false);
                                //   ses.setEnabled(false);
                                //   // curr.setEnabled(true);
                                //   imp = true;
                                // } 
                                // else {
                                if (oData.BSART === 'ZDOM' || oData.BSART === 'ZCDO' || oData.BSART === 'ZEME' || oData.BSART === 'ZRET' || oData.BSART === 'ZRFB' || oData.BSART === 'ZIMP' || oData.BSART === 'ZSTA' || oData.BSART === 'ZSTO' || oData.BSART === 'ZGAS' || oData.BSART === 'ZGAT') {
                                  console.log('GRN is Mandatory');
                                  // if (GR_PO === false) {
                                  //   console.log('GR Based PO');
                                  //   grn.removeAllTokens();
                                  //   ses.removeAllTokens();
                                  //   grn.setEnabled(false);
                                  //   ses.setEnabled(false);
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
                                  //   grn.removeAllTokens();
                                  //   ses.removeAllTokens();
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
                                  // }
                                }
                                // }

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
            // }

          }
        });

        // // Function to create and open the value help dialog for ZSTA and ZSTO
        // function valueHelp() {
        //   // Create the value help dialog
        //   var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
        //     title: "Vendor Code",
        //     supportMultiselect: false,
        //     supportRanges: false,
        //     key: "LIFNR",
        //     descriptionKey: "NAME1",
        //     // descriptionKey: "LIFNR",
        //     stretch: sap.ui.Device.system.phone,
        //     ok: function (oControlEvent) {
        //       var aTokens = oControlEvent.getParameter("tokens");
        //       console.log("Token: ", aTokens);

        //       if (aTokens.length > 0) {
        //         var oToken = aTokens[0];
        //         sap.ui.getCore().byId(sInputId).setValue(oToken.getKey());
        //         sap.ui.getCore().byId(sInputId).setValueState("None");

        //         var t1 = oToken.mAggregations.customData[0].mProperties.value;

        //         VendorCode.setValue(t1.LIFNR);
        //         vendorName.setValue(t1.NAME1);
        //         venemail.setValue(t1.SMTP_ADDR);
        //         venphone.setValue(t1.TELF1);

        //         //Import Vendor
        //         var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZBTS_ODATA_SRV/");
        //         var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
        //         var oFilter1 = new sap.ui.model.Filter("LIFNR", sap.ui.model.FilterOperator.EQ, t1.LIFNR);
        //         console.log('PO Filtered', oFilter);
        //         console.log('PO Filtered', oFilter1);

        //         oModel1.read("/ZbtsImpShSet", {
        //           filters: [oFilter, oFilter1],
        //           success: function (oData) {
        //             console.log("Filtered Data: ", oData.results);

        //             if (oData.results.length > 0) {
        //               // Perform your action when the checkbox is checked
        //               grn.setEnabled(false);
        //               ses.setEnabled(false);
        //               // curr.setEnabled(true);
        //               imp = true;
        //             } else {
        //               // curr.setEnabled(false);
        //               // curr.setValue("INR");
        //               //validation for grn and ses
        //               var oModel = new sap.ui.model.odata.v2.ODataModel(
        //                 "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
        //               );
        //               var sPath = "/ZbtspoShSet('" + PO + "')";
        //               oModel.read(sPath, {
        //                 success: function (oData) {
        //                   console.log('BTS fetch doc type:', oData);
        //                   if (oData.BSART === 'ZDOM' || oData.BSART === 'ZCDO' || oData.BSART === 'ZEME' || oData.BSART === 'ZRET' || oData.BSART === 'ZRFB' || oData.BSART === 'ZIMP' || oData.BSART === 'ZSTA' || oData.BSART === 'ZSTO' || oData.BSART === 'ZGAS' || oData.BSART === 'ZGAT') {
        //                     console.log('GRN is Mandatory');
        //                     grn.setEnabled(true);
        //                     ses.setValue("");
        //                     ses.setEnabled(false);
        //                     grnval = true;
        //                     sesval = false;
        //                   } else if (oData.BSART === 'ZSRV' || oData.BSART === 'ZPSR' || oData.BSART === 'ZIMS' || oData.BSART === 'ZEMS') {
        //                     console.log('SES is Mandatory');
        //                     grn.setValue("");
        //                     grn.setEnabled(false);
        //                     ses.setEnabled(true);
        //                     grnval = false;
        //                     sesval = true;
        //                   } else if (oData.BSART === 'ZINS' || oData.BSART === 'FO') {
        //                     console.log('Insurance PO');
        //                     grn.setEnabled(false);
        //                     ses.setEnabled(false);
        //                     // curr.setEnabled(true);
        //                     imp = true;
        //                   }
        //                 }
        //               });

        //               // grn.setEnabled(true);
        //               // ses.setEnabled(true);
        //               imp = false;
        //             }


        //           },
        //           error: function (oError) {
        //             console.error("Data fetch error: ", oError);
        //           }
        //         });
        //         //Import Vendor



        //       }
        //       oDialog.close();
        //     },
        //     cancel: function () {
        //       oDialog.close();
        //     },
        //   });

        //   // Define the search help table columns and model
        //   var oColModel = new sap.ui.model.json.JSONModel({
        //     cols: [
        //       {
        //         label: "PO Number",
        //         template: "EBELN",
        //       },
        //       {
        //         label: "Vendor Code",
        //         template: "LIFNR",
        //       },
        //       {
        //         label: "Vendor Name",
        //         template: "NAME1",
        //       },
        //       {
        //         label: "Vendor Email",
        //         template: "SMTP_ADDR",
        //       },
        //       {
        //         label: "Vendor Phone Number",
        //         template: "TELF1",
        //       },
        //     ],
        //   });

        //   oDialog.getTable().setModel(oColModel, "columns");

        //   // Define the OData model and bind the search help table to an entity set
        //   var oModel = new sap.ui.model.odata.v2.ODataModel(
        //     "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
        //   );
        //   var oTable = oDialog.getTable();
        //   oTable.setModel(oModel);

        //   oDialog.getTable().setModel(oModel);
        //   var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
        //   console.log('PO Filtered', oFilter);

        //   oModel.read("/ZbtspoShSet", {
        //     filters: [oFilter],
        //     success: function (oData) {
        //       console.log("Filtered Data: ", oData.results);
        //       // Once data is fetched, create a JSONModel and set the fetched data on it
        //       var oJSONModel = new sap.ui.model.json.JSONModel();
        //       oJSONModel.setData({ rows: oData.results }); // Assuming your data is an array of rows

        //       // Set this model to your dialog or directly to the table
        //       // If the table does not directly allow setting a model, set it on the dialog or a parent control
        //       oDialog.getTable().setModel(oJSONModel);

        //       // Now bind the rows aggregation to this new model
        //       // The path should be relative to the model's structure; in this case, our structure starts with "rows"
        //       oDialog.getTable().bindAggregation("rows", {
        //         path: "/rows"
        //       });
        //     },
        //     error: function (oError) {
        //       console.error("Data fetch error: ", oError);
        //     }
        //   });


        //   // oDialog.getTable().bindAggregation("rows", {
        //   //   path: "/ZbtspoShSet",
        //   //   filters: [oFilter]
        //   // });

        //   // Open the value help dialog
        //   oDialog.open();
        // }

        // Function to create and open the value help dialog
        // function valueHelp() {
        //   // Create the value help dialog
        //   var oDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
        //     title: "Vendor Code",
        //     supportMultiselect: false,
        //     supportRanges: false,
        //     key: "LIFNR",
        //     descriptionKey: "NAME1",
        //     // descriptionKey: "LIFNR",
        //     stretch: sap.ui.Device.system.phone,
        //     ok: function (oControlEvent) {
        //       var aTokens = oControlEvent.getParameter("tokens");
        //       console.log("Token: ", aTokens);

        //       if (aTokens.length > 0) {
        //         var oToken = aTokens[0];
        //         sap.ui.getCore().byId(sInputId).setValue(oToken.getKey());
        //         sap.ui.getCore().byId(sInputId).setValueState("None");

        //         var t1 = oToken.mAggregations.customData[0].mProperties.value;

        //         VendorCode.setValue(t1.LIFNR);
        //         vendorName.setValue(t1.NAME1);
        //         venemail.setValue(t1.SMTP_ADDR);
        //         venphone.setValue(t1.TELF1);

        //         //Import Vendor
        //         var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZBTS_ODATA_SRV/");
        //         var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
        //         var oFilter1 = new sap.ui.model.Filter("LIFNR", sap.ui.model.FilterOperator.EQ, t1.LIFNR);
        //         console.log('PO Filtered', oFilter);
        //         console.log('PO Filtered', oFilter1);

        //         oModel1.read("/ZbtsImpShSet", {
        //           filters: [oFilter, oFilter1],
        //           success: function (oData) {
        //             console.log("Filtered Data: ", oData.results);

        //             if (oData.results.length > 0) {
        //               // Perform your action when the checkbox is checked
        //               grn.setEnabled(false);
        //               ses.setEnabled(false);
        //               // curr.setEnabled(true);
        //               imp = true;
        //             } else {
        //               // curr.setEnabled(false);
        //               // curr.setValue("INR");
        //               //validation for grn and ses
        //               var oModel = new sap.ui.model.odata.v2.ODataModel(
        //                 "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
        //               );
        //               var sPath = "/ZbtspoShSet('" + PO + "')";
        //               oModel.read(sPath, {
        //                 success: function (oData) {
        //                   console.log('BTS fetch doc type:', oData);
        //                   if (oData.BSART === 'ZDOM' || oData.BSART === 'ZCDO' || oData.BSART === 'ZEME' || oData.BSART === 'ZRET' || oData.BSART === 'ZRFB' || oData.BSART === 'ZIMP' || oData.BSART === 'ZSTA' || oData.BSART === 'ZSTO' || oData.BSART === 'ZGAS' || oData.BSART === 'ZGAT') {
        //                     console.log('GRN is Mandatory');
        //                     grn.setEnabled(true);
        //                     ses.setValue("");
        //                     ses.setEnabled(false);
        //                     grnval = true;
        //                     sesval = false;
        //                   } else if (oData.BSART === 'ZSRV' || oData.BSART === 'ZPSR' || oData.BSART === 'ZIMS' || oData.BSART === 'ZEMS') {
        //                     console.log('SES is Mandatory');
        //                     grn.setValue("");
        //                     grn.setEnabled(false);
        //                     ses.setEnabled(true);
        //                     grnval = false;
        //                     sesval = true;
        //                   } else if (oData.BSART === 'ZINS' || oData.BSART === 'FO') {
        //                     console.log('Insurance PO');
        //                     grn.setEnabled(false);
        //                     ses.setEnabled(false);
        //                     // curr.setEnabled(true);
        //                     imp = true;
        //                   }
        //                 }
        //               });

        //               // grn.setEnabled(true);
        //               // ses.setEnabled(true);
        //               imp = false;
        //             }


        //           },
        //           error: function (oError) {
        //             console.error("Data fetch error: ", oError);
        //           }
        //         });
        //         //Import Vendor



        //       }
        //       oDialog.close();
        //     },
        //     cancel: function () {
        //       oDialog.close();
        //     },
        //   });

        //   // Define the search help table columns and model
        //   var oColModel = new sap.ui.model.json.JSONModel({
        //     cols: [
        //       {
        //         label: "PO Number",
        //         template: "EBELN",
        //       },
        //       {
        //         label: "Vendor Code",
        //         template: "LIFNR",
        //       },
        //       {
        //         label: "Vendor Name",
        //         template: "NAME1",
        //       },
        //       {
        //         label: "Vendor Email",
        //         template: "SMTP_ADDR",
        //       },
        //       {
        //         label: "Vendor Phone Number",
        //         template: "TELF1",
        //       },
        //     ],
        //   });

        //   oDialog.getTable().setModel(oColModel, "columns");

        //   // Define the OData model and bind the search help table to an entity set
        //   var oModel = new sap.ui.model.odata.v2.ODataModel(
        //     "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
        //   );
        //   var oTable = oDialog.getTable();
        //   oTable.setModel(oModel);

        //   oDialog.getTable().setModel(oModel);
        //   var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, PO);
        //   console.log('PO Filtered', oFilter);

        //   oModel.read("/ZbtspoShSet", {
        //     filters: [oFilter],
        //     success: function (oData) {
        //       console.log("Filtered Data: ", oData.results);
        //       // Once data is fetched, create a JSONModel and set the fetched data on it
        //       var oJSONModel = new sap.ui.model.json.JSONModel();
        //       oJSONModel.setData({ rows: oData.results }); // Assuming your data is an array of rows

        //       // Set this model to your dialog or directly to the table
        //       // If the table does not directly allow setting a model, set it on the dialog or a parent control
        //       oDialog.getTable().setModel(oJSONModel);

        //       // Now bind the rows aggregation to this new model
        //       // The path should be relative to the model's structure; in this case, our structure starts with "rows"
        //       oDialog.getTable().bindAggregation("rows", {
        //         path: "/rows"
        //       });
        //     },
        //     error: function (oError) {
        //       console.error("Data fetch error: ", oError);
        //     }
        //   });


        //   // oDialog.getTable().bindAggregation("rows", {
        //   //   path: "/ZbtspoShSet",
        //   //   filters: [oFilter]
        //   // });

        //   // Open the value help dialog
        //   oDialog.open();
        // }
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

      OnSave: function () {
        dupflag = true;
        dupflag1 = true;

        sap.ui.core.BusyIndicator.show();

        var that = this;
        var grnnavValue = [];
        var sesnavValue = [];
        var invnavValue = [];
        var VendorCode = this.getView().byId("VendorCode");
        var name1 = this.getView().byId("vendorName");
        var vendoremail = this.getView().byId("vendorEmail");
        var vendorphno = this.getView().byId("vendorPhno");
        var PO = this.getView().byId("PO");
        var Invoice = this.getView().byId("Invoice");
        var Amount = this.getView().byId("Amount");
        var DateField = this.getView().byId("DateField");
        var ProfitCenter = this.getView().byId("Profit");
        var Plant = this.getView().byId("Plant");
        var Email = this.getView().byId("Email");
        var Text = this.getView().byId("Text");
        var Remarks = this.getView().byId("Remarks");
        var fileattach = this.getView().byId("fileUploaderBankMandate");

        //uncomment for GeM
        var GemInvNo = this.getView().byId("GemInvNo");
        var GeM_Procurement = this.getView().byId("GeM_Procurement");


        var Save = that.getView().byId("Save");
        var Draft = that.getView().byId("Draft");
        var Back = that.getView().byId("Back");
        var pdfPreviewButton = that.getView().byId("pdfPreviewButton")

        Save.setEnabled(false);
        Draft.setEnabled(false);
        Back.setEnabled(false);
        pdfPreviewButton.setEnabled(false);

        var csrfToken;
        var csrfTokenAd;

        console.log(checkBox);
        if (checkBox === false) {
          checkValue = 'X';
        } else {
          checkValue = ' ';
        }

        if (filesUpload.length > 0) {
          // Refresh security token to get the CSRF token
          this.getView().getModel().refreshSecurityToken();

          // Add header parameter to retrieve CSRF token
          csrfToken = new sap.ui.unified.FileUploaderParameter({
            name: "x-csrf-token",
            value: this.getView().getModel().getHeaders()["x-csrf-token"],
          });

          csrfTokenAd = csrfToken.getValue();
          console.log("CSRF Token:", csrfTokenAd);
        }



        var dateValue = DateField.getDateValue();
        console.log('Date Value:', dateValue);

        // Ensure dateValue is valid
        if (!dateValue || !(dateValue instanceof Date)) {
          console.error('Invalid dateValue:', dateValue);
          return;
        }

        // Create current date
        var currentDate = new Date();

        // Extract parts from dateValue
        var year = dateValue.getFullYear();
        var month = ('0' + (dateValue.getMonth() + 1)).slice(-2);
        var day = ('0' + dateValue.getDate()).slice(-2);

        // Extract current time
        var hours = ('0' + currentDate.getHours()).slice(-2);
        var minutes = ('0' + currentDate.getMinutes()).slice(-2);
        var seconds = ('0' + currentDate.getSeconds()).slice(-2);

        // Create ISO time
        var isoTime = `PT${hours}H${minutes}M${seconds}S`;
        console.log('ISO Time:', isoTime);

        // Create formatted date
        var formattedDate = `${year}-${month}-${day}T00:00:00`;
        console.log('Formatted Date:', formattedDate);




        console.log("Vendor Code:", VendorCode.getValue());
        console.log("Vendor Name:", name1.getValue());
        console.log("PO:", PO.getValue());
        console.log("Invoice:", Invoice.getValue());
        console.log("Amount:", Amount.getValue());
        // console.log("Currency:", Currency.getValue());
        console.log("Date:", DateField.getDateValue());
        console.log("Profit Center:", ProfitCenter.getValue());
        console.log("Text:", Text.getValue());
        console.log("Remarks:", Remarks.getValue());
        console.log("File:", fileattach.getValue());
        // console.log("Previous GRN Amount:", prvgrnvalue);
        // console.log("Prvious SES Amount:", prvsesvalue);
        // console.log("Total GRN Amount:", totgrnvalue);
        // console.log("Total SES Amount:", totsesvalue);
        console.log("Created On:", created_on);
        console.log("Created By:", created_by);

        povalue = PO.getValue();
        AmountValue = Amount.getValue();
        VendorCodeValue = VendorCode.getValue();
        VendorNameValue = name1.getValue();
        VendorEmailValue = vendoremail.getValue();
        VendorPhNoValue = vendorphno.getValue();
        ProfitValue = ProfitCenter.getValue();
        EmailValue = Email.getValue();
        TextValue = Text.getValue();
        RemarkValue = Remarks.getValue();
        PlantValue = Plant.getValue();
        filevalue = fileattach.getValue();
        gemInvValue = GemInvNo.getValue(); //uncomment for GeM

        if (AdvPay === 'Yes') {
          advance_payment = 'X'
        } else {
          advance_payment = ''
        }

        var oTable = this.getView().byId("Table1");
        var aItems = oTable.getItems();

        // Array to store the data

        InvtableData = [];
        GrntableData = [];
        SestableData = [];
        var grntablefinal = [];
        var sestablefinal = [];
        var invoiceValidation = [];

        //create token for manually input
        var oTable = this.byId("Table1");
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
          var invoiceValidation = [];
          // Assuming the GRN and SES MultiInput controls are directly inside the cells of the table's rows
          // and each row follows the same structure

          var oGRNMultiInput = aCells[2]; // Adjust the index according to your table structure
          var oSESMultiInput = aCells[3]; // Adjust the index according to your table structure
          var invoiceCell = aCells[0]; // Accessing the first cell in the row
          var invoiceValue = invoiceCell.getValue(); // Retrieving the text content of the cell
          console.log("INDEXXXX: ", index);
          // Check if the invoice cell is empty
          if (invoiceValue === '') {
            sap.ui.core.BusyIndicator.hide(); //31
            console.log("Invoice cell is empty in row ", index);
            sap.m.MessageBox.error("Invoice Number is Mandatory")
            Save.setEnabled(true);
            Draft.setEnabled(true);
            Back.setEnabled(true);
            pdfPreviewButton.setEnabled(true);

            stopExecution = false;
            return;
          } else {
            stopExecution = true;
            console.log("Invoice Value:", invoiceValidation);
            // var cellValue = oItem.getCells()[0];
            aCells.forEach(function (oCell, index) {
              // Get the value of the cell
              var cellValue = oCell.getValue();
              console.log('cell value:', cellValue);

              // Assign the value to the corresponding property in the rowData object
              if (index === 0) {
                if (cellValue) {
                  InvrowData["Invoice"] = cellValue;
                }

              }
            });

            InvtableData.push(InvrowData);

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
                  sap.ui.core.BusyIndicator.hide(); //31
                  sap.m.MessageBox.error('Duplicate GRN found: ' + aGRNValues[i]);
                  Save.setEnabled(true);
                  Draft.setEnabled(true);
                  Back.setEnabled(true);
                  pdfPreviewButton.setEnabled(true);
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
                  Save.setEnabled(true);
                  Draft.setEnabled(true);
                  Back.setEnabled(true);
                  pdfPreviewButton.setEnabled(true);
                  dupflag1 = false;
                }
              }
            }

            console.log(dupflag);
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


            // GrntableData.push({ GRN: aGRNValues }); // Adjust this if you need a different structure
            // SestableData.push({ SES: aSESValues });

            console.log("Row " + (index + 1) + " GRN MultiInput Values:", aGRNValues);
            console.log("Row " + (index + 1) + " SES MultiInput Values:", aSESValues);


            //////////////////////
            console.log(' Grn Table Data:', GrntableData);
            console.log(' Ses Table Data:', SestableData);
            console.log(' Inv Table Data:', InvtableData);

          }

        });

        if (dupflag && dupflag1) {

          if (stopExecution) {

            validation(GrntableData, SestableData, InvtableData);

            function validation(GrntableData, SestableData, InvtableData) {
              // Validate each field


              if (!PO.getValue()) {
                PO.setValueState("Error");
                sap.ui.core.BusyIndicator.hide(); //31
                sap.m.MessageBox.error("Please Select PO No.", {
                  onClose: function () {
                    PO.focus();
                    Save.setEnabled(true);
                    Draft.setEnabled(true);
                    Back.setEnabled(true);
                    pdfPreviewButton.setEnabled(true);
                  },
                });
                return;
              }

              if (PO.getValue()) {
                var oModel = new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                );

                var oFilter = new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, povalue);
                oModel.read("/ZpoShSet", {
                  filters: [oFilter],
                  success: function (oData) {
                    console.log(" PO Entities fetched successfully:", oData);
                    if (oData.results <= 0) {
                      sap.ui.core.BusyIndicator.hide(); //31
                      sap.m.MessageBox.error("Purchase Order " + povalue + " does not exist.", {
                        onClose: function () {
                          PO.focus();
                          Save.setEnabled(true);
                          Draft.setEnabled(true);
                          Back.setEnabled(true);
                          pdfPreviewButton.setEnabled(true);
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
                  sap.ui.core.BusyIndicator.hide(); //31
                  sap.m.MessageBox.error("Please Select Vendor Code", {
                    onClose: function () {
                      VendorCode.focus(); // Set focus back to the Vendor Code input field
                      Save.setEnabled(true);
                      Draft.setEnabled(true);
                      Back.setEnabled(true);
                      pdfPreviewButton.setEnabled(true);
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
                              sap.ui.core.BusyIndicator.hide(); //31
                              sap.m.MessageBox.error("Supplying Plant " + VendorCodeValue + " does not exist with the given PO.", {
                                onClose: function () {
                                  VendorCode.focus();
                                  Save.setEnabled(true);
                                  Draft.setEnabled(true);
                                  Back.setEnabled(true);
                                  pdfPreviewButton.setEnabled(true);
                                },
                              });
                              return;
                            }
                            VN();
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
                              sap.ui.core.BusyIndicator.hide(); //31
                              sap.m.MessageBox.error("Vendor Code " + VendorCodeValue + " does not exist with the given PO.", {
                                onClose: function () {
                                  VendorCode.focus();
                                  Save.setEnabled(true);
                                  Draft.setEnabled(true);
                                  Back.setEnabled(true);
                                  pdfPreviewButton.setEnabled(true);
                                },
                              });
                              return;
                            }
                            VN();
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

              function VN() {
                if (!name1.getValue()) {
                  Text.setValueState("Error");
                  sap.ui.core.BusyIndicator.hide(); //31
                  sap.m.MessageBox.error("Vendor Name is Required", {
                    onClose: function () {
                      name1.focus(); //
                      Save.setEnabled(true);
                      Draft.setEnabled(true);
                      Back.setEnabled(true);
                      pdfPreviewButton.setEnabled(true);
                    },
                  });
                  return;
                }
                if (name1.getValue()) {
                  VE();
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
                        sap.ui.core.BusyIndicator.hide(); //31
                        sap.m.MessageBox.error("Please maintain the Vendor Email", {
                          onClose: function () {
                            vendoremail.focus(); //
                            Save.setEnabled(true);
                            Draft.setEnabled(true);
                            Back.setEnabled(true);
                            pdfPreviewButton.setEnabled(true);
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
                      Date();
                    } else {
                      if (!vendorphno.getValue()) {
                        vendorphno.setValueState("Error");
                        sap.ui.core.BusyIndicator.hide(); //31
                        sap.m.MessageBox.error("Please maintain the Vendor Phone Number", {
                          onClose: function () {
                            vendorphno.focus(); //
                            Save.setEnabled(true);
                            Draft.setEnabled(true);
                            Back.setEnabled(true);
                            pdfPreviewButton.setEnabled(true);
                          },
                        });
                        return;
                      }
                      if (vendoremail.getValue()) {
                        Date();
                      }
                    }
                  }
                });
              }

              function Date() {
                if (formattedDate > currentDate) {
                  sap.ui.core.BusyIndicator.hide(); //31
                  sap.m.MessageBox.error("Future date is not allowed");
                  Save.setEnabled(true);
                  Draft.setEnabled(true);
                  Back.setEnabled(true);
                  pdfPreviewButton.setEnabled(true);
                  return;
                } else {
                  amount();
                }
              }

              function amount() {
                if (!Amount.getValue()) {
                  Amount.setValueState("Error");
                  sap.ui.core.BusyIndicator.hide(); //31
                  sap.m.MessageBox.error("Please fill Amount Field", {
                    onClose: function () {
                      Amount.focus(); //
                      Save.setEnabled(true);
                      Draft.setEnabled(true);
                      Back.setEnabled(true);
                      pdfPreviewButton.setEnabled(true);
                    },
                  });
                  return;
                } else {
                  DateFunction();
                  // if (Amount.getValue()) {
                  //   var amountvalue;
                  //   amountvalue = Amount.getValue();
                  //   console.log(amountvalue);
                  //   if (GrntableData.length > 0 && SestableData.length === 0) { //if only GRN is present
                  //     var grntotal;
                  //     if (prvgrnvalue) {
                  //       console.log("GRNTOTAL:", grntotal);
                  //       grntotal = parseFloat(prvgrnvalue) + parseFloat(amountvalue);
                  //       if (grntotal > totgrnvalue) {
                  //         sap.ui.core.BusyIndicator.hide(); //31
                  //         sap.m.MessageBox.warning(
                  //           "Invoice amount is greater than Balance GRN Amount",
                  //           {
                  //             title: "Warning",
                  //             onClose: function (sAction) {
                  //               DateFunction();
                  //             },
                  //           }
                  //         );
                  //       } else {
                  //         DateFunction();
                  //       }
                  //     } else {
                  //       grntotal = parseFloat(amountvalue);
                  //       console.log("GRNTOTAL:", grntotal);
                  //       if (grntotal > totgrnvalue) {
                  //         sap.ui.core.BusyIndicator.hide(); //31
                  //         sap.m.MessageBox.warning(
                  //           "Invoice amount is greater than Total GRN Amount",
                  //           {
                  //             title: "Warning",
                  //             onClose: function (sAction) {
                  //               DateFunction();
                  //             },
                  //           }
                  //         );
                  //       } else {
                  //         DateFunction();
                  //       }
                  //     }


                  //   }
                  //   if (GrntableData.length === 0 && SestableData.length > 0) { //if only SES is present
                  //     var sestotal;
                  //     if (prvsesvalue) {
                  //       sestotal = parseFloat(prvsesvalue) + parseFloat(amountvalue);
                  //       console.log("SESTOTAL:", sestotal);
                  //       if (sestotal > totsesvalue) {
                  //         sap.ui.core.BusyIndicator.hide(); //31
                  //         sap.m.MessageBox.warning(
                  //           "Invoice amount is greater than Balance SES Amount",
                  //           {
                  //             title: "Warning",
                  //             onClose: function (sAction) {
                  //               DateFunction();
                  //             },
                  //           }
                  //         );
                  //       } else {
                  //         DateFunction();
                  //       }
                  //     } else {
                  //       sestotal = parseFloat(amountvalue);
                  //       console.log("SESTOTAL:", sestotal);
                  //       if (sestotal > totsesvalue) {
                  //         sap.ui.core.BusyIndicator.hide(); //31
                  //         sap.m.MessageBox.warning(
                  //           "Invoice amount is greater than Total SES Amount",
                  //           {
                  //             title: "Warning",
                  //             onClose: function (sAction) {
                  //               DateFunction();
                  //             },
                  //           }
                  //         );
                  //       } else {
                  //         DateFunction();
                  //       }
                  //     }

                  //   }
                  //   if (GrntableData.length > 0 && SestableData.length > 0) { //if both SES and GRN is present
                  //     var grntotal;
                  //     var sestotal;
                  //     var total;
                  //     //previous grn is there
                  //     if (prvgrnvalue != '' && prvsesvalue === '') {
                  //       console.log("GRNTOTAL:", grntotal);
                  //       grntotal = parseFloat(prvgrnvalue) + parseFloat(amountvalue);
                  //       if (grntotal > totgrnvalue) {
                  //         sap.ui.core.BusyIndicator.hide(); //31
                  //         sap.m.MessageBox.warning(
                  //           "Invoice amount is greater than Balance GRN Amount",
                  //           {
                  //             title: "Warning",
                  //             onClose: function (sAction) {
                  //               DateFunction();
                  //             },
                  //           }
                  //         );
                  //       } else {
                  //         DateFunction();
                  //       }
                  //     }

                  //     //previous ses is there
                  //     if (prvgrnvalue != '' && prvsesvalue === '') {
                  //       console.log("SESTOTAL:", sestotal);
                  //       sestotal = parseFloat(prvsesvalue) + parseFloat(amountvalue);
                  //       if (sestotal > totsesvalue) {
                  //         sap.ui.core.BusyIndicator.hide(); //31
                  //         sap.m.MessageBox.warning(
                  //           "Invoice amount is greater than Balance SES Amount",
                  //           {
                  //             title: "Warning",
                  //             onClose: function (sAction) {
                  //               DateFunction();
                  //             },
                  //           }
                  //         );
                  //       } else {
                  //         DateFunction();
                  //       }
                  //     }

                  //     //both previous grn and ses is there
                  //     if (prvgrnvalue != '' && prvsesvalue != '') {
                  //       total = parseFloat(prvgrnvalue) + parseFloat(prvsesvalue) + parseFloat(amountvalue);
                  //       console.log("TOTAL:", total);
                  //       var totalgrnses;
                  //       totalgrnses = parseFloat(totgrnvalue) + parseFloat(totsesvalue)
                  //       console.log(totalgrnses);
                  //       if (total > totalgrnses) {
                  //         sap.ui.core.BusyIndicator.hide(); //31
                  //         sap.m.MessageBox.warning(
                  //           "Invoice amount is greater than Balance GRN and SES Amount",
                  //           {
                  //             title: "Warning",
                  //             onClose: function (sAction) {
                  //               DateFunction();
                  //             },
                  //           }
                  //         );
                  //       } else {
                  //         DateFunction();
                  //       }
                  //     }


                  //     //both previous gen and ses is empty
                  //     if (prvgrnvalue === '' && prvsesvalue === '') {
                  //       total = amountvalue;
                  //       console.log("TOTAL:", total);
                  //       var totalgrnses;
                  //       totalgrnses = parseFloat(totgrnvalue) + parseFloat(totsesvalue)
                  //       if (total > totalgrnses) {
                  //         sap.ui.core.BusyIndicator.hide(); //31
                  //         sap.m.MessageBox.warning(
                  //           "Invoice amount is greater than the total GRN and SES Amount",
                  //           {
                  //             title: "Warning",
                  //             onClose: function (sAction) {
                  //               DateFunction();
                  //             },
                  //           }
                  //         );
                  //       } else {
                  //         DateFunction();
                  //       }
                  //     }

                  //   }
                  //   if (GrntableData.length <= 0 && SestableData.length <= 0) { //if both SES and GRN is present
                  //     var grntotal;
                  //     var sestotal;
                  //     var total;
                  //     //both previous gen and ses is empty
                  //     if (prvgrnvalue === '' && prvsesvalue === '') {
                  //       total = amountvalue;
                  //       console.log("TOTAL:", total);
                  //       var totalgrnses;
                  //       totalgrnses = parseFloat(totgrnvalue) + parseFloat(totsesvalue)
                  //       if (total > totalgrnses) {
                  //         sap.ui.core.BusyIndicator.hide(); //31
                  //         sap.m.MessageBox.warning(
                  //           "Invoice amount is greater than the total GRN and SES Amount",
                  //           {
                  //             title: "Warning",
                  //             onClose: function (sAction) {
                  //               DateFunction();
                  //             },
                  //           }
                  //         );
                  //       } else {
                  //         DateFunction();
                  //       }
                  //     }




                  //   }
                  //   // DateFunction();
                  // }
                }

              }

              function DateFunction() {
                if (!DateField.getValue()) {
                  DateField.setValueState("Error");
                  sap.ui.core.BusyIndicator.hide(); //31
                  sap.m.MessageBox.error("Please Select Date Field", {
                    onClose: function () {
                      DateField.focus(); //
                      Save.setEnabled(true);
                      Draft.setEnabled(true);
                      Back.setEnabled(true);
                      pdfPreviewButton.setEnabled(true);
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
                  sap.ui.core.BusyIndicator.hide(); //31
                  sap.m.MessageBox.error("Please fill the Billing Authority Field", {
                    onClose: function () {
                      ProfitCenter.focus(); //
                      Save.setEnabled(true);
                      Draft.setEnabled(true);
                      Back.setEnabled(true);
                      pdfPreviewButton.setEnabled(true);
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
                        sap.ui.core.BusyIndicator.hide(); //31
                        sap.m.MessageBox.error("Profit Center " + ProfitValue + " does not exist.", {
                          onClose: function () {
                            PO.focus();
                            Save.setEnabled(true);
                            Draft.setEnabled(true);
                            Back.setEnabled(true);
                            pdfPreviewButton.setEnabled(true);
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
                  sap.ui.core.BusyIndicator.hide(); //31
                  sap.m.MessageBox.error("Please fill Invoice Text Field", {
                    onClose: function () {
                      Text.focus(); //
                      Save.setEnabled(true);
                      Draft.setEnabled(true);
                      Back.setEnabled(true);
                      pdfPreviewButton.setEnabled(true);
                    },
                  });
                  return;
                }
                if (Text.getValue()) {
                  if (Text.getValue().length > 80) {
                    sap.m.MessageBox.error("Invoice Text Field Length Exceeds the Maximum Length(80)", {
                      onClose: function () {
                        Text.focus(); //
                        Save.setEnabled(true);
                        Draft.setEnabled(true);
                        Back.setEnabled(true);
                        pdfPreviewButton.setEnabled(true);
                      },
                    });
                    return;
                  } else {
                    Remark();
                  }
                  // Remark();
                }

              }

              function Remark() {
                if (!Remarks.getValue()) {
                  Remarks.setValueState("Error");
                  sap.ui.core.BusyIndicator.hide(); //31
                  sap.m.MessageBox.error("Please fill Remarks Field", {
                    onClose: function () {
                      Remarks.focus(); //
                      Save.setEnabled(true);
                      Draft.setEnabled(true);
                      Back.setEnabled(true);
                      pdfPreviewButton.setEnabled(true);
                    },
                  });
                  return;
                }
                if (Remarks.getValue()) {
                  Plants();
                }
              }

              function Plants() {
                if (!Plant.getValue()) {
                  Plant.setValueState("Error");
                  sap.ui.core.BusyIndicator.hide(); //31
                  sap.m.MessageBox.error("Please fill Plant Field", {
                    onClose: function () {
                      Plant.focus(); //
                      Save.setEnabled(true);
                      Draft.setEnabled(true);
                      Back.setEnabled(true);
                      pdfPreviewButton.setEnabled(true);
                    },
                  });
                  return;
                }
                if (Plant.getValue()) {
                  GeMFlag();
                }
                // if (Plant.getValue()) {
                //   var oModel = new sap.ui.model.odata.v2.ODataModel(
                //     "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                //   ); //created_by

                //   var oFilter = new sap.ui.model.Filter("BWKEY", sap.ui.model.FilterOperator.EQ, PlantValue);
                //   var oFilter1 = new sap.ui.model.Filter("ZUSER", sap.ui.model.FilterOperator.EQ, created_by);
                //   oModel.read("/ZbtsPlantShSet", {
                //     filters: [oFilter,oFilter1],
                //     success: function (oData) {
                //       console.log(" Plant Entities fetched successfully:", oData);
                //       if (oData.results <= 0) {
                //         sap.ui.core.BusyIndicator.hide(); //31
                //         sap.m.MessageBox.error("Plant " + PlantValue + " does not exist for this user .", {
                //           onClose: function () {
                //             Plant.focus();
                //           },
                //         });
                //         return;
                //       }
                //       attach();
                //     }, error: function () {
                //       // Handle error
                //       console.log("Error in fetching entities");
                //     }
                //   });
                // } //uncomment it later
              }

              //uncomment for Gem
              function GeMFlag() {
                if (!gemflag) {
                  GeM_Procurement.setValueState("Error");
                  sap.ui.core.BusyIndicator.hide(); //31
                  sap.m.MessageBox.error("Please Select GeM Procurement Field", {
                    onClose: function () {
                      GeM_Procurement.focus(); //
                      Save.setEnabled(true);
                      Draft.setEnabled(true);
                      Back.setEnabled(true);
                      pdfPreviewButton.setEnabled(true);
                    },
                  });
                  return;
                }
                if (gemflag) {
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
                        Save.setEnabled(true);
                        Draft.setEnabled(true);
                        Back.setEnabled(true);
                        pdfPreviewButton.setEnabled(true);
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
                if (!fileattach.getValue()) {
                  fileattach.setValueState("Error");
                  sap.ui.core.BusyIndicator.hide(); //31
                  sap.m.MessageBox.error("Attachment is Mandatory", {
                    onClose: function () {
                      fileattach.focus(); //
                      Save.setEnabled(true);
                      Draft.setEnabled(true);
                      Back.setEnabled(true);
                      pdfPreviewButton.setEnabled(true);
                    },
                  });
                  return;
                }
                if (fileattach.getValue()) {
                  tablefunc();
                }
              }

              function tablefunc() {
                var oModel = new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                );
                var sPath = "/ZpoShSet('" + povalue + "')";  // ZbtspoShSet
                var grnflag = false;
                var sesflag = false;




                oModel.read(sPath, {
                  success: function (oData) {
                    console.log('BTS fetch doc type:', oData);
                    if (!checkBox) {
                      console.log('Check box is checked');
                      if (InvtableData && InvtableData.length > 0) {
                        for (var i = 0; i < InvtableData.length; i++) {
                          if (!InvtableData[i].Invoice || InvtableData[i].Invoice === '') {
                            sap.ui.core.BusyIndicator.hide(); //31
                            sap.m.MessageBox.error("Please fill the Invoice Field");
                            Save.setEnabled(true);
                            Draft.setEnabled(true);
                            Back.setEnabled(true);
                            pdfPreviewButton.setEnabled(true);
                            break;
                            // Focus the correct field here
                          } else {
                            val = 'true';
                            vval = 'true';
                            confirm();
                          }
                        }
                      }
                    } else {
                      //commented on 10.8.2024 for ZTUR and ZLOC document type 
                      if (oData.BSART === 'ZLOC' || oData.BSART === 'ZTUR' || oData.BSART === 'ZCTU') {
                        console.log('GRN and SES is Mandatory');
                        // if (GrntableData && GrntableData.length > 0 && SestableData && SestableData.length > 0 && InvtableData && InvtableData.length > 0) {
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
                              sap.ui.core.BusyIndicator.hide(); //31
                              sap.m.MessageBox.error("Please fill the Invoice Field");
                              Save.setEnabled(true);
                              Draft.setEnabled(true);
                              Back.setEnabled(true);
                              pdfPreviewButton.setEnabled(true);
                              break;
                              // Focus the correct field here
                            } else if (GrntableData && GrntableData.length === 0 && SestableData && SestableData.length === 0) {
                              sap.ui.core.BusyIndicator.hide(); //31
                              sap.m.MessageBox.error("Please Fill either GRN or SES Field!!");
                              Save.setEnabled(true);
                              Draft.setEnabled(true);
                              Back.setEnabled(true);
                              pdfPreviewButton.setEnabled(true);
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
                        if (GrntableData && GrntableData.length > 0 && InvtableData && InvtableData.length > 0 || (SestableData && SestableData.length > 0)) {
                          // for (var i = 0; i < GrntableData.length; i++) {
                          console.log('GRN data', GrntableData[0].MBLNR);
                          for (var i = 0; i < InvtableData.length; i++) {
                            if (!InvtableData[i].Invoice || InvtableData[i].Invoice === '') {
                              sap.ui.core.BusyIndicator.hide(); //31
                              sap.m.MessageBox.error("Please fill the Invoice Field", {
                                onClose: function () {
                                  Save.setEnabled(true);
                                  Draft.setEnabled(true);
                                  Back.setEnabled(true);
                                  pdfPreviewButton.setEnabled(true);
                                  return;
                                  // Focus the correct field here
                                },
                              });
                            } else {
                              for (var i = 0; i < GrntableData.length; i++) {
                                for (var j = 0; j < GrntableData[i].length; j++) {
                                  if (!GrntableData[i][j].MBLNR || GrntableData[i][j].MBLNR.length === 0) {
                                    // Throw an error if the GRN array is empty
                                    sap.ui.core.BusyIndicator.hide(); //31
                                    sap.m.MessageBox.error("GRN does not exist", {
                                      onClose: function () {
                                        ProfitCenter.focus(); //
                                        Save.setEnabled(true);
                                        Draft.setEnabled(true);
                                        Back.setEnabled(true);
                                        pdfPreviewButton.setEnabled(true);
                                        return;

                                      },
                                    });
                                    grnflag = false;
                                    sesflag = false;
                                  }
                                  else {
                                    grnflag = true;
                                    sesflag = true;
                                  }
                                }
                              }
                            }
                          }
                          if (grnflag && sesflag) {
                            grnValueValidation1();
                          }
                        }
                        else {
                          sap.ui.core.BusyIndicator.hide(); //31
                          sap.m.MessageBox.error("GRN is mandatory!!", {
                            onClose: function () {
                              Save.setEnabled(true);
                              Draft.setEnabled(true);
                              Back.setEnabled(true);
                              pdfPreviewButton.setEnabled(true);
                              return;
                              // Focus the correct field here
                            },
                          });
                        }
                        // }
                      } else if (oData.BSART === 'ZSRV' || oData.BSART === 'ZPSR' || oData.BSART === 'ZIMS' || oData.BSART === 'ZEMS') {
                        console.log('SES is Mandatory');
                        //to check duplicate invoice
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
                        for (var i = 0; i < InvtableData.length; i++) {
                          var invoiceNumber = InvtableData[i].Invoice;
                          console.log('Invoice Number:', invoiceNumber);
                          if (!InvtableData[i].Invoice || InvtableData[i].Invoice === '') {
                            sap.ui.core.BusyIndicator.hide(); //31
                            sap.m.MessageBox.error("Please fill the Invoice Field", {
                              onClose: function () {
                                Save.setEnabled(true);
                                Draft.setEnabled(true);
                                Back.setEnabled(true);
                                pdfPreviewButton.setEnabled(true);
                                return;
                                // Focus the correct field here
                              },
                            });
                            break; // Exit the loop if an empty invoice field is found
                          } else {
                            if (SestableData.length <= 0) {
                              sap.ui.core.BusyIndicator.hide(); //31
                              sap.m.MessageBox.error("SES is mandatory!!", {
                                onClose: function () {
                                  ProfitCenter.focus(); //
                                  Save.setEnabled(true);
                                  Draft.setEnabled(true);
                                  Back.setEnabled(true);
                                  pdfPreviewButton.setEnabled(true);
                                  return;
                                },
                              });
                              grnflag = false;
                              sesflag = false;
                            } else {
                              for (var i = 0; i < SestableData.length; i++) {
                                for (var j = 0; j < SestableData[i].length; j++) {
                                  if (!SestableData[i][j].LBLNI || SestableData[i][j].LBLNI.length === 0) {
                                    // Throw an error if the GRN array is empty
                                    sap.ui.core.BusyIndicator.hide(); //31
                                    sap.m.MessageBox.error("SES is mandatory!!", {
                                      onClose: function () {
                                        ProfitCenter.focus(); //
                                        Save.setEnabled(true);
                                        Draft.setEnabled(true);
                                        Back.setEnabled(true);
                                        pdfPreviewButton.setEnabled(true);
                                        return;
                                      },
                                    });
                                    grnflag = false;
                                    sesflag = false;
                                  }
                                  else {
                                    grnflag = true;
                                    sesflag = true;
                                  }
                                }
                              }
                            }
                            for (var i = 0; i < SestableData.length; i++) {
                              for (var j = 0; j < SestableData[i].length; j++) {
                                if (!SestableData[i][j].LBLNI || SestableData[i][j].LBLNI.length === 0) {
                                  // Throw an error if the GRN array is empty
                                  sap.ui.core.BusyIndicator.hide(); //31
                                  sap.m.MessageBox.error("SES is mandatory!!", {
                                    onClose: function () {
                                      ProfitCenter.focus(); //
                                      Save.setEnabled(true);
                                      Draft.setEnabled(true);
                                      Back.setEnabled(true);
                                      pdfPreviewButton.setEnabled(true);
                                      return;
                                    },
                                  });
                                  grnflag = false;
                                  sesflag = false;
                                }
                                else {
                                  grnflag = true;
                                  sesflag = true;
                                }
                              }
                            }

                          }
                        }
                        if (grnflag && sesflag) {
                          grnValueValidation2();
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
                            sap.ui.core.BusyIndicator.hide(); //31
                            sap.m.MessageBox.error("Please fill Invoice Field", {
                              onClose: function () {
                                ProfitCenter.focus(); //
                                Save.setEnabled(true);
                                Draft.setEnabled(true);
                                Back.setEnabled(true);
                                pdfPreviewButton.setEnabled(true);
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
                          sesValueValidation();
                        }

                      } else {
                        sap.ui.core.BusyIndicator.hide(); //31
                        sap.m.MessageBox.error("GRN Number " + errorgrn + " does not exist.");
                        Save.setEnabled(true);
                        Draft.setEnabled(true);
                        Back.setEnabled(true);
                        pdfPreviewButton.setEnabled(true);
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
                        sap.ui.core.BusyIndicator.hide(); //31
                        sap.m.MessageBox.error("SES Number is mandatory.");
                        Save.setEnabled(true);
                        Draft.setEnabled(true);
                        Back.setEnabled(true);
                        pdfPreviewButton.setEnabled(true);
                        allses = false; // Mark success as false due to failure in this iteration
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
                              var errorses = SestableData[i][j].LBLNI;
                              allses = false; // Mark success as false due to failure in this iteration
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
                        sap.ui.core.BusyIndicator.hide(); //31
                        sap.m.MessageBox.error("SES Number " + errorses + " does not exist.");
                        Save.setEnabled(true);
                        Draft.setEnabled(true);
                        Back.setEnabled(true);
                        pdfPreviewButton.setEnabled(true);
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
                            sap.ui.core.BusyIndicator.hide(); //31
                            sap.m.MessageBox.error("GRN Number " + GrntableData[i][j].MBLNR + " does not exist.");
                            Save.setEnabled(true);
                            Draft.setEnabled(true);
                            Back.setEnabled(true);
                            pdfPreviewButton.setEnabled(true);
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
                            sap.ui.core.BusyIndicator.hide(); //31
                            sap.m.MessageBox.error("SES Number " + SestableData[i][j].LBLNI + " does not exist.");
                            Save.setEnabled(true);
                            Draft.setEnabled(true);
                            Back.setEnabled(true);
                            pdfPreviewButton.setEnabled(true);
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
                            Draft.setEnabled(true);
                            Back.setEnabled(true);
                            pdfPreviewButton.setEnabled(true);
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
                            sap.ui.core.BusyIndicator.hide(); //31
                            sap.m.MessageBox.error("GRN Number " + GrntableData[i].GRN + " does not exist.");
                            Save.setEnabled(true);
                            Draft.setEnabled(true);
                            Back.setEnabled(true);
                            pdfPreviewButton.setEnabled(true);
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
                            sap.ui.core.BusyIndicator.hide(); //31
                            sap.m.MessageBox.error("SES Number " + SestableData[i].LBLNI + " does not exist.");
                            Save.setEnabled(true);
                            Draft.setEnabled(true);
                            Back.setEnabled(true);
                            pdfPreviewButton.setEnabled(true);
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
                        Draft.setEnabled(true);
                        Back.setEnabled(true);
                        pdfPreviewButton.setEnabled(true);
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
                            sap.ui.core.BusyIndicator.hide(); //31
                            sap.m.MessageBox.error("SES Number " + SestableData[i].LBLNI + " does not exist.");
                            Save.setEnabled(true);
                            Draft.setEnabled(true);
                            Back.setEnabled(true);
                            pdfPreviewButton.setEnabled(true);
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
                            Draft.setEnabled(true);
                            Back.setEnabled(true);
                            pdfPreviewButton.setEnabled(true);
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
                    sap.ui.core.BusyIndicator.hide(); //31
                    sap.m.MessageBox.confirm("Do you want to submit?", {
                      title: "Confirmation",
                      onClose: function (sAction) {
                        sap.ui.core.BusyIndicator.hide(); //31
                        if (sAction === sap.m.MessageBox.Action.OK) {
                          console.log(sAction);
                          save(InvtableData, GrntableData, SestableData);
                        } else {
                          Save.setEnabled(true);
                          Draft.setEnabled(true);
                          Back.setEnabled(true);
                          pdfPreviewButton.setEnabled(true);
                          return;
                        }
                      },
                    });
                  }
                }

              }
            }


            function save(InvtableData, GrntableData, SestableData) {
              sap.ui.core.BusyIndicator.show(); //31
              console.log('InvrowData:', InvtableData);
              console.log('GrntableData:', GrntableData);
              console.log('SesrowData:', SestableData);

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
                var filename = that._file.name;
                var fileType = that._file.type;
                that.getView().getModel().refreshSecurityToken();


                oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
                  name: "x-csrf-token",
                  value: that.getView().getModel().getHeaders()['x-csrf-token']
                }));

              }

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
                    return entity.EBELN === povalue && entity.BTS_ID != '';
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
                var grnbts = []
                let jsonObjects = []; // This will store your JSON objects
                var loop = 0;

                var BTS = [];
                var count = 0;


                ///////////////////////////////////////////THIS IS TO LOOP FOR MULTIPLE INVOICE/////////////////////////////////////

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
                  if (checkbox === '') {
                    checkbox = ""
                  }

                  var jsonData = {
                    "BTS_ID": newBTS_ID,
                    "DRAFT_ID": "",
                    "DOKNR": "", // DMS Document number
                    "EBELN": povalue,
                    "GEM_INV_NO_FLAG": gemflag, //uncomment for Gem
                    "GEM_INV_NO": gemInvValue,  //uncomment for Gem
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
                    "FLAG": "",
                    "CREATED_ON": created_on,
                    "CREATED_TIME": isoTime,
                    "CREATED_BY": created_by,
                    "CREATED_MAIL": created_mail,
                    "HDRTOGRNNAV": grnvalue1, // Assuming these don't change per invoice item
                    "HDRTOSESNAV": sesvalue1 // Assuming these don't change per invoice item
                    // "HDRTOINVNAV": [item] // Here you might want just the current item, or adjust as needed
                  };

                  console.log('JSON', jsonData);

                  var oModell = new sap.ui.model.odata.v2.ODataModel(
                    "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
                  );
                  var slug;
                  var oBusyIndicator = new sap.m.BusyDialog();

                  oModell.create("/ZBTS_CRTSet", jsonData, {
                    success: function (Odata) {

                      console.log('Data sent successfully:', Odata);
                      BTS.push(newBTS_ID);
                      count++;

                      // if (filevalue != '') {
                      // slug = newBTS_ID + "," + filevalue;

                      oBusyIndicator.open();
                      FileUpload();
                    },
                    error: function (error) {
                      console.error('Error:', error);
                      oBusyIndicator.close();
                    }
                  });

                  function FileUpload() {
                    if (filesUpload.length > 0) {
                      slug = newBTS_ID + "," + filevalue;
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

                    if (count === invnavValue.length) {
                      oFileUploader.upload();
                    } else {
                      increment();
                    }


                  }

                  function handleUploadComplete() {
                    sap.ui.core.BusyIndicator.hide(); //31
                    sap.m.MessageBox.success(
                      "BTS ID " + BTS + " is created successfully",
                      {
                        title: "Success",
                        onClose: function (sAction) {
                          location.reload();
                        }
                      }
                    )
                  };

                  // $.ajax({
                  //   url: '/sap/opu/odata/sap/ZBTS_ODATA_SRV/ZBTS_CRTSet',
                  //   type: 'POST',
                  //   contentType: 'application/json',
                  //   data: JSON.stringify(jsonData),
                  //   headers: {
                  //     'X-CSRF-Token': csrfToken
                  //   },
                  //   success: function (response) {
                  //     console.log('Data sent successfully:', response);
                  //     sap.m.MessageBox.success(
                  //       "BTS ID " + newBTS_ID + " is created successfully",
                  //       {
                  //         title: "Success",
                  //         onClose: function (sAction) {
                  //           location.reload();
                  //         },
                  //       }
                  //     );
                  //   },
                  //   error: function (xhr, status, error) {
                  //     console.error('Error:', error);
                  //   }
                  // });

                  jsonObjects.push(jsonData); // Add the generated JSON object to the array
                  var idString = newBTS_ID.toString(); //change the bts_id to string to get the last 4 digit
                  console.log('STringID:', idString);
                  var lastFourDigits = idString.match(/\d{6}$/)[0]; //get the last 4 digit from the bts id
                  console.log("Last four digits:", lastFourDigits);
                  var incrementedDigits = (parseInt(lastFourDigits, 10) + 1).toString(); //increment the last four digit by 1 and convert back to string

                  // Pad the incremented digits with leading zeros to ensure four digits
                  incrementedDigits = incrementedDigits.padStart(6, '0');

                  console.log("Last four digits incremented:", incrementedDigits);

                  // newId = povalue + '-BTS-' + incrementedDigits; //get the next bts id
                  newId = povalue + '-B' + lastTwoDigits + '-' + incrementedDigits; //get the next bts id
                  console.log('Json data:', jsonData);

                  var headers = that.getView().getModel().getHeaders();
                  console.log(headers);
                  sesvalue1 = [];
                  grnvalue1 = [];
                  loop++;
                  // }


                });
                //till here newly added

                // var jsonData = {
                //   "BTS_ID": newId,
                //   "DRAFT_ID": "",
                //   "DOKNR": "",  //DMS Document number
                //   "EBELN": povalue,
                //   "ZAMT": AmountValue,
                //   "ZDATE": formattedDate,
                //   "LIFNR": VendorCodeValue,
                //   "NAME1": VendorNameValue,
                //   "PRCTR": ProfitValue,
                //   "EMAIL_ID": EmailValue,
                //   "ZTEXT": TextValue,
                //   "ZREMARK": RemarkValue,
                //   "STATUS": "",
                //   "FILE_ATTACH": filevalue,
                //   "FLAG": "",
                //   "HDRTOGRNNAV": grnnavValue,
                //   "HDRTOSESNAV": sesnavValue,
                //   "HDRTOINVNAV": invnavValue
                // };


              }
            }

          }
        }

      },

      OnSaveDraft: function () {
        sap.ui.core.BusyIndicator.show();
        var that = this;
        var grnnavValue = [];
        var sesnavValue = [];
        var invnavValue = [];
        var VendorCode = this.getView().byId("VendorCode");
        var name1 = this.getView().byId("vendorName");
        var PO = this.getView().byId("PO");
        var Invoice = this.getView().byId("Invoice");
        var Amount = this.getView().byId("Amount");
        var Plant = this.getView().byId("Plant");
        var DateField = this.getView().byId("DateField");
        var ProfitCenter = this.getView().byId("Profit");
        var Email = this.getView().byId("Email");
        var Text = this.getView().byId("Text");
        var Remarks = this.getView().byId("Remarks");
        var fileattach = this.getView().byId("fileUploaderBankMandate");
        var GeMNo = this.getView().byId("GemInvNo");  //uncomment for Gem

        var currentDate = new Date();
        var year = currentDate.getFullYear();
        var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
        var day = ('0' + currentDate.getDate()).slice(-2);
        var hours = ('0' + currentDate.getHours()).slice(-2);
        var minutes = ('0' + currentDate.getMinutes()).slice(-2);
        var seconds = ('0' + currentDate.getSeconds()).slice(-2);

        isoTime = `PT${hours}H${minutes}M${seconds}S`;

        console.log(isoTime);

        formattedDate = year + '-' + month + '-' + day + 'T00:00:00';
        console.log(formattedDate);
        stopExecution = false;

        console.log("Vendor Code:", VendorCode.getValue());
        console.log("Vendor Name:", name1.getValue());
        console.log("PO:", PO.getValue());
        console.log("Invoice:", Invoice.getValue());
        console.log("Amount:", Amount.getValue());
        // console.log("Currency:", Currency.getValue());
        console.log("Date:", DateField.getDateValue());
        console.log("Profit Center:", ProfitCenter.getValue());
        console.log("Text:", Text.getValue());
        console.log("Remarks:", Remarks.getValue());
        console.log("File:", fileattach.getValue());

        povalue = PO.getValue();
        AmountValue = Amount.getValue();
        // CurrencyValue = Currency.getValue();
        VendorCodeValue = VendorCode.getValue();
        VendorNameValue = name1.getValue();
        ProfitValue = ProfitCenter.getValue();
        EmailValue = Email.getValue();
        TextValue = Text.getValue();
        RemarkValue = Remarks.getValue();
        filevalue = fileattach.getValue();
        PlantValue = Plant.getValue();
        gemInvValue = GeMNo.getValue();  //uncomment for Gem

        if (AdvPay === 'Yes') {
          advance_payment = 'X'
        } else {
          advance_payment = ''
        }

        if (checkBox === false) {
          checkValue = 'X';
        } else {
          checkValue = ' ';
        }

        console.log(checkValue);
        var oTable = this.getView().byId("Table1");
        var aItems = oTable.getItems();

        // Array to store the data

        InvtableData = [];
        GrntableData = [];
        SestableData = [];
        var grntablefinal = [];
        var sestablefinal = [];

        aItems.forEach(function (oItem, index) {
          var aCells = oItem.getCells();
          var InvrowData = {};
          var SesrowData = {};
          var invoiceValidation = [];
          // Assuming the GRN and SES MultiInput controls are directly inside the cells of the table's rows
          // and each row follows the same structure
          var oGRNMultiInput = oItem.getCells()[2]; // Adjust the index according to your table structure
          var oSESMultiInput = oItem.getCells()[3]; // Adjust the index according to your table structure
          var invoiceCell = aCells[0]; // Accessing the first cell in the row
          var invoiceValue = invoiceCell.getValue(); // Retrieving the text content of the cell

          console.log("INDEXXXX: ", index);
          // Check if the invoice cell is empty
          if (invoiceValue === '') {
            console.log("Invoice cell is empty in row ", index);
            sap.ui.core.BusyIndicator.hide(); //31
            sap.m.MessageBox.error("Invoice Number is Mandatory")
            stopExecution = false;
            return;
          } else if (PlantValue === '') {
            sap.ui.core.BusyIndicator.hide(); //31
            sap.m.MessageBox.error("Please Select a Plant!!")
            stopExecution = false;
            return;
          } else {
            stopExecution = true;
            console.log("Invoice Value:", invoiceValidation);
            // var cellValue = oItem.getCells()[0];
            aCells.forEach(function (oCell, index) {
              // Get the value of the cell
              var cellValue = oCell.getValue();
              console.log('cell value:', cellValue);

              // Assign the value to the corresponding property in the rowData object
              if (index === 0) {
                if (cellValue) {
                  InvrowData["Invoice"] = cellValue;
                }

              }
            });

            InvtableData.push(InvrowData);

            var aGRNTokens = oGRNMultiInput.getTokens(); // Retrieve all tokens from the GRN MultiInput
            var aGRNValues = aGRNTokens.map(function (token) {
              return token.getText(); // Use .getKey() if you have set keys for the tokens
            })


            aGRNValues.forEach(function (item) {
              // For each GRN value, create an object with MBLNR property and add it to the array
              grntablefinal.push({ "MBLNR": item });
            });
            console.log('grn table 1:', grntablefinal);

            GrntableData.push(grntablefinal);
            grntablefinal = [];
            console.log('grn final', GrntableData);

            var aSESTokens = oSESMultiInput.getTokens(); // Retrieve all tokens from the SES MultiInput
            var aSESValues = aSESTokens.map(function (token) {
              return token.getText(); // Use .getKey() if you have set keys for the tokens
            });


            aSESValues.forEach(function (item) {
              // For each GRN value, create an object with MBLNR property and add it to the array
              sestablefinal.push({ "LBLNI": item });
            });
            console.log('ses table 1:', sestablefinal);

            SestableData.push(sestablefinal);
            sestablefinal = [];
            console.log('ses final', SestableData);

            // aCells.forEach(function (oCell, index) {
            //   // Get the value of the cell
            //   var cellValue = oCell.getValue();

            //   // Assign the value to the corresponding property in the rowData object
            //   if (index === 0) {
            //     InvrowData["Invoice"] = cellValue;
            //   }
            // });

            // InvtableData.push(InvrowData);
            // GrntableData.push({ GRN: aGRNValues }); // Adjust this if you need a different structure
            // SestableData.push({ SES: aSESValues });

            console.log("Row " + (index + 1) + " GRN MultiInput Values:", aGRNValues);
            console.log("Row " + (index + 1) + " SES MultiInput Values:", aSESValues);
          }
        });

        // Now, the tableData array contains all the data from the table
        console.log(' Grn Table Data:', GrntableData);
        console.log(' Ses Table Data:', SestableData);
        console.log(' Inv Table Data:', InvtableData);



        if (stopExecution) {
          save(InvtableData, GrntableData, SestableData);
        }

        function save(InvtableData, GrntableData, SestableData) {

          console.log('InvrowData:', InvtableData);
          console.log('GrntableData:', GrntableData);
          console.log('SesrowData:', SestableData);

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

          var oModel = new sap.ui.model.odata.v2.ODataModel(
            "/sap/opu/odata/sap/ZBTS_ODATA_SRV"
          );
          var oFilter = new sap.ui.model.Filter("BTS_ID", sap.ui.model.FilterOperator.EQ, '');
          var sEntitySet = "/ZBTS_CRTSet";
          var newId;

          oModel.read(sEntitySet, {
            filters: [oFilter],
            success: function (oData) {
              // Handle success
              console.log("Entities fetched successfully:", oData);

              // Filter the data based on EBELN value
              var filteredData = oData.results.filter(function (entity) {
                return entity.BTS_ID === '';
              });

              console.log("Filtered Data:", filteredData);


              // Get the highest DRAFT_ID
              var highestDraftID = Math.max(...filteredData.map(entity => parseInt(entity.DRAFT_ID)));

              console.log("Highest DRAFT_ID:", highestDraftID);

              if (filteredData.length > 0) {

                newId = highestDraftID + 1;
                // Now HDRTOGRNNAV contains the jsonObject data
                console.log("GrnNavValue:", grnnavValue);
                console.log("SesNavValue:", sesnavValue);
                console.log("InvNavValue:", invnavValue);

                jsonformat(); // call the jsonformat function 
              } else { //if no existing ID is present with the given PO
                newId = '1000000001';
                console.log("Filtered Data is empty. Saving draft ID as:", newId);

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

            var loop = 0;
            let newBTS_ID = newId;
            var BTS = [];
            var count = 0;
            console.log(InvtableData.length);
            if (InvtableData.length > 0) {
              InvtableData.forEach((item) => {
                var j;
                var k;
                for (var i = loop; i < SestableData.length; i++) {
                  if (j !== SestableData[i].length) {
                    for (j = 0; j < SestableData[i].length; j++) {
                      // sesvalue.push(SestableData[i][j]);
                      var LBLNI = SestableData[i][j].LBLNI;
                      console.log('LBLNI data:', LBLNI);
                      if (LBLNI !== undefined && LBLNI != '') {
                        var jsonObject1 = {}; // Create a new object in each iteration
                        jsonObject1.DRAFT_ID = newId.toString();
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
                        jsonObject2.DRAFT_ID = newId.toString();
                        jsonObject2.MBLNR = MBLNR;
                        console.log("Json GRN", jsonObject2);
                        grnvalue1.push(jsonObject2);
                      }
                    }
                  } else { break; }
                }
                // "InitialBaseID" should be replaced with actual base part of your ID
                if (AmountValue === '') {
                  AmountValue = "0";
                }
                else {
                  AmountValue = AmountValue;
                }
                var jsonData = {
                  "BTS_ID": "",
                  "DRAFT_ID": newBTS_ID.toString(),
                  "DOKNR": "", // DMS Document number
                  "EBELN": povalue,
                  "GEM_INV_NO_FLAG": gemflag,  //uncomment for Gem
                  "GEM_INV_NO": gemInvValue,  //uncomment for Gem
                  "ADVANCE_PAYMENT": advance_payment,
                  "ZAMT": AmountValue,
                  "WAERS": "",
                  "XBLNR": item.Invoice,
                  "ZDATE": formattedDate,
                  "LIFNR": VendorCodeValue,
                  "NAME1": VendorNameValue,
                  "PRCTR": ProfitValue,
                  "EMAIL_ID": EmailValue,
                  "ZTEXT": TextValue,
                  "ZREMARK": RemarkValue,
                  "PLANT": PlantValue,
                  "CUSTOM_INV": checkValue,
                  "STATUS": "",
                  "FILE_ATTACH": filevalue,
                  "FLAG": "",
                  "CREATED_ON": created_on,
                  "CREATED_TIME": isoTime,
                  "CREATED_BY": created_by,
                  "CREATED_MAIL": created_mail,
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

                    if (count === invnavValue.length) {
                      if (filevalue != '') {
                        var slug = newBTS_ID + "," + filevalue;
                        var oBusyIndicator = new sap.m.BusyDialog();
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
                      } else {
                        handleUploadComplete();
                      }


                      function handleUploadComplete() {
                        sap.ui.core.BusyIndicator.hide(); //31
                        sap.m.MessageBox.success(
                          "Draft ID " + newBTS_ID + " is created successfully",
                          {
                            title: "Success",
                            onClose: function (sAction) {
                              location.reload();
                            }
                          }
                        )
                      };
                    }
                    // location.reload();
                  },
                  error: function (error) {
                    console.error('Error:', error);
                  }
                });


                loop++;
                sesvalue1 = [];
                grnvalue1 = [];

              });
            } else {
              if (AmountValue === '') {
                AmountValue = "0";
              }
              else {
                AmountValue = AmountValue;
              }
              console.log(SestableData);
              console.log(GrntableData);
              var j;
              var k;
              for (var i = loop; i < SestableData.length; i++) {
                if (j !== SestableData[i].length) {
                  for (j = 0; j < SestableData[i].length; j++) {
                    // sesvalue.push(SestableData[i][j]);
                    var LBLNI = SestableData[i][j].LBLNI;
                    console.log('LBLNI data:', LBLNI);
                    if (LBLNI !== undefined && LBLNI != '') {
                      var jsonObject1 = {}; // Create a new object in each iteration
                      jsonObject1.DRAFT_ID = newId.toString();
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
                      jsonObject2.DRAFT_ID = newId.toString();
                      jsonObject2.MBLNR = MBLNR;
                      console.log("Json GRN", jsonObject2);
                      grnvalue1.push(jsonObject2);
                    }
                  }
                } else { break; }
              }

              var jsonData = {
                "BTS_ID": "",
                "DRAFT_ID": newBTS_ID.toString(),
                "DOKNR": "", // DMS Document number
                "EBELN": povalue,
                "ZAMT": AmountValue,
                "XBLNR": "",
                "ZDATE": formattedDate,
                "LIFNR": VendorCodeValue,
                "NAME1": VendorNameValue,
                "PRCTR": ProfitValue,
                "EMAIL_ID": EmailValue,
                "ZTEXT": TextValue,
                "ZREMARK": RemarkValue,
                "PLANT": PlantValue,
                "CUSTOM_INV": checkValue,
                "STATUS": "",
                "FILE_ATTACH": filevalue,
                "FLAG": "",
                "HDRTOGRNNAV": grnvalue1, // Assuming these don't change per invoice item
                "HDRTOSESNAV": sesvalue1 // Assuming these don't change per invoice item
                // "HDRTOINVNAV": [item] // Here you might want just the current item, or adjust as needed
              };
              console.log(jsonData)

              var oModell = new sap.ui.model.odata.v2.ODataModel(
                "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
              );

              oModell.create("/ZBTS_CRTSet", jsonData, {
                success: function (Odata) {
                  console.log('Data sent successfully:', Odata);
                  sap.ui.core.BusyIndicator.hide(); //31
                  sap.m.MessageBox.success(
                    "Draft ID " + newBTS_ID + " is created successfully",
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

            loop++;
            sesvalue1 = [];
            grnvalue1 = [];

          }
        }
      },

      OnBack: function () {
        // Get the router instance
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        // Navigate to a new view using the router
        oRouter.navTo("RouteHome");
        location.reload();
      },

      OnAddRowPress: function () {
        var that = this;
        var deleteButton = this.getView().byId("OnDeleteRow");
        var oTable = this.getView().byId("Table1");
        var oItems = oTable.getItems();
        var grn = this.getView().byId("GRN");
        var ses = this.getView().byId("SES");


        console.log('GRN flag', grnval);
        console.log('SES flag', sesval);

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
                // new sap.m.Input({
                //   width: "100%"
                // }),
                new sap.ui.unified.FileUploader({
                  change: that.handleValueChange.bind(that), // Bind the controller context to access 'this'
                  uploadUrl: "/sap/opu/odata/sap/ZBTS_ODATA_SRV/ZDRAFT_UPLOADSet",
                  tooltip: "Upload your file", sendXHR: true,
                  useMultipart: false, // As it's not multipart, the request body is sent as raw data
                  placeholder: "Upload Attachment",
                }),
              ],
            });
          } else {
            if (grnval) {
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
                    enabled: false
                  }),
                  new sap.m.Input({
                    width: "100%"
                  }),
                  // new sap.m.Input({
                  //   width: "100%"
                  // }),
                  new sap.ui.unified.FileUploader({
                    width: "100%",
                    change: that.handleValueChange.bind(that), // Bind the controller context to access 'this'
                    uploadUrl: "/sap/opu/odata/sap/ZBTS_ODATA_SRV/ZDRAFT_UPLOADSet",
                    tooltip: "Upload your file", sendXHR: true,
                    useMultipart: false, // As it's not multipart, the request body is sent as raw data
                    placeholder: "Upload Attachment",
                  }),
                ],
              });
            } else if (sesval) {
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

                  }),
                  new sap.m.Input({
                    width: "100%"
                  }),
                  // new sap.m.Input({
                  //   width: "100%"
                  // }),
                  new sap.ui.unified.FileUploader({
                    width: "100%",
                    change: that.handleValueChange.bind(that), // Bind the controller context to access 'this'
                    uploadUrl: "/sap/opu/odata/sap/ZBTS_ODATA_SRV/ZDRAFT_UPLOADSet",
                    tooltip: "Upload your file", sendXHR: true,
                    useMultipart: false, // As it's not multipart, the request body is sent as raw data
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
                  // new sap.m.Input({
                  //   width: "100%"
                  // }),
                  new sap.ui.unified.FileUploader({
                    width: "100%",
                    change: that.handleValueChange.bind(that), // Bind the controller context to access 'this'
                    uploadUrl: "/sap/opu/odata/sap/ZBTS_ODATA_SRV/ZDRAFT_UPLOADSet",
                    tooltip: "Upload your file", sendXHR: true,
                    useMultipart: false, // As it's not multipart, the request body is sent as raw data
                    placeholder: "Upload Attachment",
                  }),
                ],
              });
            }

          }

          attachKeyPressToMultiInput(oColumnListItem.getCells()[2]); // For GRN MultiInput
          attachKeyPressToMultiInput(oColumnListItem.getCells()[3]); // For SES MultiInput

          // Add the new row to the table
          oTable.addItem(oColumnListItem);
        }

        // var bSelected = oEvent.getParameter("selected"); // Get the checkbox state: true if selected, false otherwise




      },

      OnDeleteRowPress: function () {
        var oTable = this.getView().byId("Table1");
        var aItems = oTable.getItems();
        var NoofRows = aItems.length;
        var lastRow = aItems.length - 1;
        console.log("Number of rows: " + NoofRows);
        console.log(lastRow);





        var deleteButton = this.getView().byId("OnDeleteRow");
        if (NoofRows > 1) {
          var oLastItem = aItems[lastRow];
          oTable.removeItem(oLastItem);
          console.log("Last row deleted.");
        }

        var oTable1 = this.getView().byId("Table1");
        var aItems1 = oTable1.getItems();



        var NoofRows1 = aItems1.length;
        console.log("Number of rows: " + NoofRows1);
        var oFirstItem = aItems[NoofRows1].getCells();
        var Cellfilename = oFirstItem[5].getValue()

        // Find the index of the file with the specified name
        var fileIndex = filesUpload.findIndex(function (fileAuth) {
          return fileAuth.name === Cellfilename;
        });

        // Check if the file was found
        if (fileIndex !== -1) {
          // Remove the file at the found index from the array
          filesUpload.splice(fileIndex, 1);
          console.log("FileName: ", filesUpload);
        } else {
          console.log("File not found in the array.");
        }


        console.log(filesUpload);

        if (NoofRows1 === 1) {
          deleteButton.setVisible(false);
        } else {
          deleteButton.setVisible(true);
        }
      },

      onAfterRendering: function () {
        dupflag = true;
        var that = this;
        var succ = true;
        var oMultiInput = this.byId("GRN");
        var oMultiInput1 = this.byId("SES");
        var GRN = this.getView().byId("GRN");
        var SES = this.getView().byId("SES");
        var grnamt = this.getView().byId("GRNAmount");
        var sesamt = this.getView().byId("SESAmount");
        var totgrnamt = this.getView().byId("totgrnamt");
        var totsesamt = this.getView().byId("totsesamt");
        var POval = this.byId("PO");
        var checkb = this.getView().byId("acceptTermsCheckbox");
        // var PO = this.getValue.byId(POval);
        var oModel = new sap.ui.model.odata.v2.ODataModel(
          "/sap/opu/odata/sap/ZBTS_ODATA_SRV/"
        );


        POval.attachBrowserEvent("keypress", function (event) {
          if (event.key === 'Enter' || event.key === ' ' || event.key === ',') {
            console.log('Enter is pressed');
            var PO = POval.getValue();
            console.log(PO);
            event.preventDefault(); // Prevent the default action

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
                  GRN.setEnabled(true);
                  SES.setValue("");
                  SES.setEnabled(false);
                  // imp = true;
                } else if (oData.BSART === 'ZSRV' || oData.BSART === 'ZPSR' || oData.BSART === 'ZIMS' || oData.BSART === 'ZEMS') {
                  console.log('SES is Mandatory');
                  GRN.setValue("");
                  GRN.setEnabled(false);
                  SES.setEnabled(true);
                  // imp = true;
                }
              }
            });

            //fiscal year
            // function getLastTwoDigitsOfFiscalYear(dateString, fiscalStartMonth) {
            //   // Parse the date string into a Date object
            //   var date = new Date(dateString);

            //   // Get the year and month of the date
            //   var year = date.getFullYear();
            //   var month = date.getMonth() + 1; // JavaScript months are 0-indexed, so add 1

            //   // Calculate fiscal year based on fiscal start month
            //   if (month < fiscalStartMonth) {
            //     // If the month is before the fiscal start month, the fiscal year is the previous year
            //     year -= 1;
            //   }

            //   // Get the last two digits of the fiscal year
            //   var lastTwoDigits = year % 100;

            //   return lastTwoDigits;
            // }

            // // Example usage:
            // var date = '2024-03-30';
            // var fiscalStartMonth = 4; // Assuming fiscal year starts in April
            // var lastTwoDigits = getLastTwoDigitsOfFiscalYear(date, fiscalStartMonth);
            // console.log(lastTwoDigits); // Output: 24
            //fiscal year

            // var sPath = "/ZbtspoShSet('" + PO + "')";
            // oModel.read(sPath, {
            //   success: function (oData) {
            //     console.log('BTS fetch doc type:', oData);
            //     if (oData.BSART === 'ZIMP' || oData.BSART === 'ZIMS') {
            //       checkb.setEnabled(true);
            //       // grn.setEnabled(false);
            //       // ses.setEnabled(false);

            //     } else {
            //       checkb.setEnabled(false);
            //       // grn.setEnabled(true);
            //       // ses.setEnabled(true);
            //     }
            //   }
            // });
          }
        });


        var oTable = this.byId("Table1");
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

                  //added on 24.04,2024
                  var oTable = that.getView().byId("Table1");
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

                          // Once all promises are resolved, call the information function
                          // Promise.all(promises).then(() => {
                          //   console.log("All GRN values have been processed:", grnbts);
                          //   informationfunc(grnbts);  // Call the function only once after all asynchronous operations are completed
                          // }).catch(error => {
                          //   console.error("An error occurred processing the GRN values", error);
                          // });
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

                          // Once all promises are resolved, call the information function
                          // Promise.all(promises).then(() => {
                          //   console.log("All GRN values have been processed:", grnbts);
                          //   informationfunc(grnbts);  // Call the function only once after all asynchronous operations are completed
                          // }).catch(error => {
                          //   console.error("An error occurred processing the GRN values", error);
                          // });
                        }


                        // for (var i = 0; i < aSESValues.length; i++) {
                        //   var oFilter = new sap.ui.model.Filter("LBLNI", sap.ui.model.FilterOperator.EQ, aSESValues[i]);
                        //   oModel.read("/ZSES_PRV_AMTSet", {
                        //     filters: [oFilter],
                        //     success: function (oData) {
                        //       console.log(" SES Entities fetched successfully:", oData.results);
                        //       if (oData.results.length > 0) {
                        //         for (var j = 0; j < oData.results.length; j++) {
                        //           amount1 = parseFloat(oData.results[j].ZAMOUNT); // Assuming AMOUNT is a property in the result object
                        //           btsid1.push(oData.results[j].BTS_ID);
                        //           console.log("Amount:", amount);
                        //           amtsum1 = amtsum1 + amount1;
                        //           console.log("amtsum:", amtsum1);
                        //           sesamt.setValue(amtsum1);
                        //         }
                        //         sap.m.MessageBox.success(
                        //           "BTS ID already exists for the SES " + oData.results[i].LBLNI + " : " + btsid1,
                        //           {
                        //             title: "Note***",
                        //             onClose: function (sAction) {

                        //             },
                        //           }
                        //         );

                        //         // prvAMt.setValue(amount); // Assuming prvAMt is a control or variable where you want to set the amount
                        //       }
                        //       else {
                        //         sesamt.setValue("");
                        //       }
                        //     },
                        //     error: function () {
                        //       // Handle error
                        //       console.log("Error in fetching entities");
                        //     },
                        //   });
                        //   amount1 = 0;

                        // }
                      } else {
                        sesamt.setValue("");
                        totsesamt.setValue("");
                      }
                    } else {
                      sesamt.setValue("");
                      totsesamt.setValue("");
                    }
                  });
                  //added on 24.04,2024

                  // console.log(dupflag);
                  // if (aGRNValues.length > 0) {
                  //   aGRNValues.forEach(function (item) {
                  //     // For each GRN value, create an object with MBLNR property and add it to the array
                  //     grntablefinal.push({ "MBLNR": item });
                  //   });
                  //   console.log('grn table 1:', grntablefinal);

                  //   GrntableData.push(grntablefinal);
                  //   grntablefinal = [];
                  // }
                  // console.log('grn final', GrntableData);

                  // if (aSESValues.length > 0) {
                  //   aSESValues.forEach(function (item) {
                  //     // For each GRN value, create an object with MBLNR property and add it to the array
                  //     sestablefinal.push({ "LBLNI": item });
                  //   });
                  //   console.log('ses table 1:', sestablefinal);

                  //   SestableData.push(sestablefinal);
                  //   sestablefinal = [];
                  // }
                  // console.log('ses final', SestableData);


                  // // GrntableData.push({ GRN: aGRNValues }); // Adjust this if you need a different structure
                  // // SestableData.push({ SES: aSESValues });

                  // console.log("Row " + (index + 1) + " GRN MultiInput Values:", aGRNValues);
                  // console.log("Row " + (index + 1) + " SES MultiInput Values:", aSESValues);


                  // //////////////////////
                  // console.log(' Grn Table Data:', GrntableData);
                  // console.log(' Ses Table Data:', SestableData);
                  // console.log(' Inv Table Data:', InvtableData);

                  //////////////////////


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
                  var oTable = that.getView().byId("Table1");
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

                          // Once all promises are resolved, call the information function
                          // Promise.all(promises).then(() => {
                          //   console.log("All GRN values have been processed:", grnbts);
                          //   informationfunc(grnbts);  // Call the function only once after all asynchronous operations are completed
                          // }).catch(error => {
                          //   console.error("An error occurred processing the GRN values", error);
                          // });
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

                          // Once all promises are resolved, call the information function
                          // Promise.all(promises).then(() => {
                          //   console.log("All GRN values have been processed:", grnbts);
                          //   informationfunc(grnbts);  // Call the function only once after all asynchronous operations are completed
                          // }).catch(error => {
                          //   console.error("An error occurred processing the GRN values", error);
                          // });
                        }


                        // for (var i = 0; i < aSESValues.length; i++) {
                        //   var oFilter = new sap.ui.model.Filter("LBLNI", sap.ui.model.FilterOperator.EQ, aSESValues[i]);
                        //   oModel.read("/ZSES_PRV_AMTSet", {
                        //     filters: [oFilter],
                        //     success: function (oData) {
                        //       console.log(" SES Entities fetched successfully:", oData.results);
                        //       if (oData.results.length > 0) {
                        //         for (var j = 0; j < oData.results.length; j++) {
                        //           amount1 = parseFloat(oData.results[j].ZAMOUNT); // Assuming AMOUNT is a property in the result object
                        //           btsid1.push(oData.results[j].BTS_ID);
                        //           console.log("Amount:", amount);
                        //           amtsum1 = amtsum1 + amount1;
                        //           console.log("amtsum:", amtsum1);
                        //           sesamt.setValue(amtsum1);
                        //         }
                        //         sap.m.MessageBox.success(
                        //           "BTS ID already exists for the SES " + oData.results[i].LBLNI + " : " + btsid1,
                        //           {
                        //             title: "Note***",
                        //             onClose: function (sAction) {

                        //             },
                        //           }
                        //         );

                        //         // prvAMt.setValue(amount); // Assuming prvAMt is a control or variable where you want to set the amount
                        //       }
                        //       else {
                        //         sesamt.setValue("");
                        //       }
                        //     },
                        //     error: function () {
                        //       // Handle error
                        //       console.log("Error in fetching entities");
                        //     },
                        //   });
                        //   amount1 = 0;

                        // }
                      } else {
                        sesamt.setValue("");
                        totsesamt.setValue("");
                      }
                    } else {
                      sesamt.setValue("");
                      totsesamt.setValue("");
                    }
                  });
                  //added on 24.04,2024

                  // console.log(dupflag);
                  // if (aGRNValues.length > 0) {
                  //   aGRNValues.forEach(function (item) {
                  //     // For each GRN value, create an object with MBLNR property and add it to the array
                  //     grntablefinal.push({ "MBLNR": item });
                  //   });
                  //   console.log('grn table 1:', grntablefinal);

                  //   GrntableData.push(grntablefinal);
                  //   grntablefinal = [];
                  // }
                  // console.log('grn final', GrntableData);

                  // if (aSESValues.length > 0) {
                  //   aSESValues.forEach(function (item) {
                  //     // For each GRN value, create an object with MBLNR property and add it to the array
                  //     sestablefinal.push({ "LBLNI": item });
                  //   });
                  //   console.log('ses table 1:', sestablefinal);

                  //   SestableData.push(sestablefinal);
                  //   sestablefinal = [];
                  // }
                  // console.log('ses final', SestableData);


                  // // GrntableData.push({ GRN: aGRNValues }); // Adjust this if you need a different structure
                  // // SestableData.push({ SES: aSESValues });

                  // console.log("Row " + (index + 1) + " GRN MultiInput Values:", aGRNValues);
                  // console.log("Row " + (index + 1) + " SES MultiInput Values:", aSESValues);


                  // //////////////////////
                  // console.log(' Grn Table Data:', GrntableData);
                  // console.log(' Ses Table Data:', SestableData);
                  // console.log(' Inv Table Data:', InvtableData);

                  //////////////////////


                  // If there's an actual value, proceed to create a token
                  // if (grnvalue) {
                  //   var token = new Token({
                  //     key: grnvalue,
                  //     text: grnvalue
                  //   });

                  //   // Add the token to the MultiInput
                  //   oMultiInput.addToken(token);

                  //   // Clear the input field for the next entry
                  //   oMultiInput.setValue('');
                  // }
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

      // onPreviewPress: function () {  //This is to preview the pdf before saving 
      //   if (this._pdfContent) {
      //     // Open PDF in a new tab
      //     var win = window.open();
      //     win.document.write('<iframe src="' + this._pdfContent + '" width="100%" height="100%"></iframe>');
      //   } else {
      //     sap.m.MessageToast.show("No PDF available for preview.");
      //   }
      // },

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


      onSelectChange: function (oEvent) {
        AdvPay = oEvent.getParameter("selectedItem").getKey();
        // Handle the selection change
        console.log("Selected payment method:", AdvPay);
      },

      onSelectChange1: function (oEvent) {  //uncomment for Gem
        var GemInvNo = this.getView().byId("GemInvNo");  //uncomment for Gem
        AdvPay1 = oEvent.getParameter("selectedItem").getKey();
        // Handle the selection change
        console.log("Selected payment method:", AdvPay1);
        gemflag = AdvPay1;

        if (AdvPay1 === 'Yes') {
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




        // if (bSelected) {
        //   checkBox = false;
        //   grn.setEnabled(false);
        //   ses.setEnabled(false);
        //   grn.removeAllTokens();
        //   ses.removeAllTokens();
        // } else {
        //   checkBox = true;
        //   grn.setEnabled(true);
        //   ses.setEnabled(true);
        // }
      }
    });
  }
);
