/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF AN
Y * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



 var app = {
    // Application Constructor
    initialize: function() {
        this.CreateOrOpenDb();
        this.bindEvents();
    },
    populateDB: function(myDb) {
         myDb.transaction(function(tx) {
            //tx.executeSql('DROP TABLE Client', [], function(tx, result) {console.log("Deleted successfully: "+result);}, function(error) {alert("Error occurred while dropping the table");});
             tx.executeSql('CREATE TABLE IF NOT EXISTS Client (Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, QrId TEXT, Name TEXT, Surname TEXT, Division TEXT, Subdivision TEXT, Email TEXT, Mobile TEXT, AuCrDt DateTime)', [], function(tx, result) {console.log("Table Client created successfully");}, function(error) {alert("Error occurred while creating the Client table");});
             tx.executeSql('CREATE TABLE IF NOT EXISTS Payment (Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ClientId INTEGER, PaymentDate DATETIME, Amount REAL, Note TEXT, AuCrDt DateTime)', [], function(tx, result) {console.log("Table Payment created successfully");}, function(error) {alert("Error occurred while creating the Payment table");});
             tx.executeSql('CREATE TABLE IF NOT EXISTS FeeType (Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, Name TEXT, Description TEXT, Amount REAL, AuCrDt DateTime)', [], function(tx, result) {console.log("Table Payment created successfully");}, function(error) {alert("Error occurred while creating the FeeType table");});
             tx.executeSql('CREATE TABLE IF NOT EXISTS ClientFee (Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ClientId INTEGER, FeeTypeId INTEGER, FeeDate DATETIME, Note TEXT, AuCrDt DateTime)', [], function(tx, result) {console.log("Table Payment created successfully");}, function(error) {alert("Error occurred while creating the ClientFee table");});
             //tx.executeSql('DELETE FROM Payment', [], function(tx, result) {console.log("Deleted successfully: "+result);}, function(error) {alert("Error occurred while creating the table");});
             //tx.executeSql('DELETE FROM Client WHERE Id > 2', [], function(tx, result) {console.log("Deleted successfully: "+result);}, function(error) {alert("Error occurred while creating the table");});
             //tx.executeSql('INSERT INTO Client (Name, Surname, Division, Email, Mobile, AuCrDt) VALUES ("Client2", "Client2", "Graad 4", "client2@gmail.com", "000234562", DATETIME("now"))', [], function(tx, result) {console.log("Inserted successfully");}, function(error) {alert("Error occurred while creating the table");});
             //tx.executeSql('INSERT INTO Client (Name, Surname, Division, Email, Mobile, AuCrDt) VALUES ("Client3", "Client3", "Graad 5", "client3@gmail.com", "00075234234", DATETIME("now"))', [], function(tx, result) {console.log("Inserted successfully");}, function(error) {alert("Error occurred while creating the table");});
        });
    },
    CreateOrOpenDb: function() {
        console.log("CreateOrOpenDb");
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
        this.populateDB(myDb);
        //window.sessionStorage.setItem("myDb", myDb);
    },
    loadClientData: function() {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
         myDb.transaction(function(tx) {
            var clientId = sessionStorage.selectedId;
            tx.executeSql('SELECT * FROM Client where id='+clientId, [], 
            function(tx, result) {
                console.log(result.rows.length + " Rows retrieved successfully");
                var len = result.rows.length;
                var client = result.rows.item(0);
                document.getElementById("updateClientQrId").value = client.QrId;
                document.getElementById("updateClientName").value = client.Name;
                document.getElementById("updateClientSurname").value = client.Surname;
                document.getElementById("updateClientEmail").value = client.Email;
                document.getElementById("updateClientMobile").value = client.Mobile;
                document.getElementById("updateClientDivision").value = client.Division;
               
                sessionStorage.oldClientName = client.Name + " " + client.Surname;

            }, 
            function(error) {alert("Error occurred while retrieving client");});
        });
    },
    loadFeeTypeData: function() {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
         myDb.transaction(function(tx) {
            var feetypeId = sessionStorage.selectedFeetypeId;
            tx.executeSql('SELECT * FROM FeeType where id='+feetypeId, [], 
            function(tx, result) {
                console.log(result.rows.length + " Rows retrieved successfully");
                var len = result.rows.length;
                var feetype = result.rows.item(0);
                document.getElementById("updateFeetypeName").value = feetype.Name;
                document.getElementById("updateFeetypeDescription").value = feetype.Description;
                document.getElementById("updateFeetypePrice").value = feetype.Amount;
            }, 
            function(error) {alert("Error occurred while retrieving feetype");});
        });
    },
    selectFeeType: function() {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
         myDb.transaction(function(tx) {
            var feetypeId = sessionStorage.selectedFeetypeId;
            tx.executeSql('SELECT * FROM FeeType where id='+feetypeId, [], 
            function(tx, result) {
                console.log(result.rows.length + " Rows retrieved successfully");
                var len = result.rows.length;
                var feetype = result.rows.item(0);
                document.getElementById("updateFeetypeName").value = feetype.Name;
                document.getElementById("updateFeetypeDescription").value = feetype.Description;
                document.getElementById("updateFeetypePrice").value = feetype.Amount;
            }, 
            function(error) {alert("Error occurred while retrieving feetype");});
        });
    },
    captureUpdateClientQr: function() {
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            if(!result.cancelled)
            {
                    document.getElementById("updateClientQrId").value = result.text;
            }
            else
            {
              alert("You have cancelled scan");
            }
          },
          function (error) {
              alert("Scanning failed: " + error);
          }
        );
    },
    captureNewClientQr: function () {
        cordova.plugins.barcodeScanner.scan(
                function (result) {
                    if (!result.cancelled)
                    {
                        
                                document.getElementById("newClientQrId").value = result.text;
                    } else
                    {
                        alert("You have cancelled scan");
                    }
                },
                function (error) {
                    alert("Scanning failed: " + error);
                }
        );
    },
    getCurrentDate: function() {
        
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        

        if(dd<10) {
            dd='0'+dd;
        } 

        if(mm<10) {
            mm='0'+mm;
        } 

        today = yyyy+'-'+ mm+'-'+dd;
        return today;
    },
    getDateFormat: function(dt) {
        
        var today = new Date();
        var dd = dt.getDate();
        var mm = dt.getMonth()+1; //January is 0!
        var yyyy = dt.getFullYear();
        

        if(dd<10) {
            dd='0'+dd;
        } 

        if(mm<10) {
            mm='0'+mm;
        } 

        dt = yyyy+'-'+ mm+'-'+dd;
        return dt;
    },
    saveNewPayment: function(sendSms) {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
        var cid = document.getElementById("newpaymentClientId").innerHTML;
        var mobile = document.getElementById("newpaymentClientMobile").innerHTML;
        var clientname = document.getElementById("newpaymentClientName").innerHTML;
        var amount = document.getElementById("newpaymentAmount").value;
        
        var paymentdate = document.getElementById("newpaymentDate").value;
        var note = document.getElementById("newpaymentNote").value;
        
        if (sendSms && mobile)
        {
            try {
                var message = "KidsBeGeeks betaling ontvang op " + paymentdate + ":\nOntvang van: " + clientname + "\nBedrag: R" + amount + "\n" + note + "\nDankie vir u ondersteuning!";
                var options = {
                    replaceLineBreaks: true, // true to replace \n by a new line, false by default
                    android: {
                        //intent: 'INTENT'  // send SMS with the native android SMS messaging
                        intent: '' // send SMS without open any other app
                    }
                };
                var success = function () { $.mobile.navigate( "#smssuccess" ); };
                var error = function (e) { document.getElementById("newpaymentError").innerHTML ='Message Failed:' + e; };
                sms.send(mobile, message, options, success, error);
            }
            catch(err) {
                document.getElementById("newpaymentError").innerHTML = err.message;
            }
        }
        
         myDb.transaction(function(tx) {
            var clientId = sessionStorage.selectedId;
            tx.executeSql('INSERT INTO Payment (ClientId, PaymentDate, Amount, Note, AuCrDt) VALUES (?,?,?,?, DATETIME("now"))', [cid, paymentdate, amount, note], 
            function(tx, result) {
                $.mobile.navigate( "#home" );
               
            }, 
            function(error) {alert("Error occurred while inserting into Payment table: "+error.message);});
        });
    },
    refreshPage: function()
    {
        jQuery.mobile.changePage(window.location.href, {
            allowSamePageTransition: true,
            transition: 'none',
            reloadPage: true
        });
    },
    setPaymentClientDetails: function(client) {
        
        document.getElementById("newpaymentClientId").innerHTML = client.Id;
        document.getElementById("newpaymentClientMobile").innerHTML = client.Mobile;
        document.getElementById("newpaymentQrId").innerHTML = client.QrId;
        document.getElementById("newpaymentClientName").innerHTML = client.Name + " " + client.Surname;
        document.getElementById("newpaymentName").innerHTML = "Payment by " + client.Name + " " + client.Surname;
        //document.getElementById("newpaymentSurname").innerHTML = client.Surname;
        document.getElementById("newpaymentAmount").value="";
        document.getElementById("newpaymentDate" ).defaultValue = app.getCurrentDate();    
        document.getElementById("newpaymentError").innerHTML = "";
    },
    setFeeClientDetails: function(client) {
        document.getElementById("newfeeClientId").innerHTML = client.Id;
        document.getElementById("newfeeClientName").innerHTML = "Fee charged for " + client.Name + " " + client.Surname;
        //document.getElementById("newfeeId").value="";
        document.getElementById("newfeeNote").value="";
        document.getElementById("newfeeDate" ).defaultValue = app.getCurrentDate();    
    },
    newPaymentById: function(clientId) {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
        myDb.transaction(function(tx) {
                       
                       tx.executeSql("SELECT * FROM Client where Id=?", [clientId], 
                       function(tx, result) {
                           console.log(result.rows.length + " Rows retrieved successfully");
                           var len = result.rows.length;
                           if (len > 0) {
                                var client = result.rows.item(0);
                                app.setPaymentClientDetails(client);
                                $.mobile.navigate("#newpayment");
                           }
                           else {
                               alert("Client not found");
                               $.mobile.navigate( "#searchclients" );
                           }

                       }, 
                       function(error) {alert("Error occurred while searching the database: " + error.message);});
                       $.mobile.navigate( "#searchclients" );
                   });
    },
    newFeeById: function(clientId) {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
        myDb.transaction(function(tx) {
                       
                       tx.executeSql("SELECT * FROM Client where Id=?", [clientId], 
                       function(tx, result) {
                           console.log(result.rows.length + " Rows retrieved successfully");
                           var len = result.rows.length;
                           if (len > 0) {
                                var client = result.rows.item(0);
                                app.setFeeClientDetails(client);
                                $.mobile.navigate("#newfee");
                           }
                           else {
                               alert("Client not found");
                               $.mobile.navigate( "#searchclients" );
                           }

                       }, 
                       function(error) {alert("Error occurred while searching the database: " + error.message);});
                       $.mobile.navigate( "#searchclients" );
                   });
    },
    viewClientByQr: function() {
        //$.mobile.loadPage( "index.html");
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            if(!result.cancelled)
            {
                    var searchQrId = result.text;
                    var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
                    myDb.transaction(function(tx) {
                       
                       tx.executeSql("SELECT * FROM Client where QrId=?", [searchQrId], 
                       function(tx, result) {
                           console.log(result.rows.length + " Rows retrieved successfully");
                           var len = result.rows.length;
                           if (len > 0) {
                                var client = result.rows.item(0);
                                sessionStorage.selectedId=client.Id;
                                    app.loadClientData();
                                    $.mobile.navigate( "#updateclient" );
                           }
                           else {
                               alert("Client not found");
                               //$.mobile.navigate( "#searchclients" );
                           }

                       }, 
                       function(error) {alert("Error occurred while searching the database: " + error.message);});
                       //$.mobile.navigate( "#searchclients" );
                   });

                  //alert("Barcode type is: " + result.format);
                  //alert("Decoded text is: " + result.text);
            }
            else
            {
              alert("You have cancelled scan");
              //$.mobile.navigate( "#searchclients" );
            }
          },
          function (error) {
              alert("Scanning failed: " + error);
              $.mobile.navigate( "#home" );
          }
        );
    },
    newPaymentByQr: function() {
        $.mobile.loadPage( "index.html");
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            if(!result.cancelled)
            {
                    var searchQrId = result.text;
                    var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
                    myDb.transaction(function(tx) {
                       
                       tx.executeSql("SELECT * FROM Client where QrId=?", [searchQrId], 
                       function(tx, result) {
                           console.log(result.rows.length + " Rows retrieved successfully");
                           var len = result.rows.length;
                           if (len > 0) {
                                var client = result.rows.item(0);
                                app.setPaymentClientDetails(client);
                                $.mobile.navigate("#newpayment");
                           }
                           else {
                               alert("Client not found");
                               $.mobile.navigate( "#searchclients" );
                           }

                       }, 
                       function(error) {alert("Error occurred while searching the database: " + error.message);});
                       $.mobile.navigate( "#searchclients" );
                   });

                  //alert("Barcode type is: " + result.format);
                  //alert("Decoded text is: " + result.text);
            }
            else
            {
              alert("You have cancelled scan");
              $.mobile.navigate( "#searchclients" );
            }
          },
          function (error) {
              alert("Scanning failed: " + error);
              $.mobile.navigate( "#home" );
          }
        );
    },
    updateCurrentClient: function() {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
        var clientId = sessionStorage.selectedId;
        var newQrId = document.getElementById("updateClientQrId").value;
        var newName = document.getElementById("updateClientName").value;
        var newSurname = document.getElementById("updateClientSurname").value;
        var newEmail = document.getElementById("updateClientEmail").value;
        var newMobile = document.getElementById("updateClientMobile").value;
        var newDivision = document.getElementById("updateClientDivision").value;
       
        sessionStorage.newClientName = newName + " " + newSurname;
         myDb.transaction(function(tx) {
            var clientId = sessionStorage.selectedId;
            tx.executeSql('UPDATE Client set QrId=?, Name=?, Surname=?, Email=?, Mobile=?, Division=? WHERE id=?', [newQrId, newName, newSurname, newEmail, newMobile, newDivision, clientId], 
            function(tx, result) {
                console.log("Database updated successfully");
                $.mobile.back();
                // var clientlink = $("#clientinlist"+clientId);
                // if (clientlink && clientlink[0]) {
                //     clientlink[0].innerHTML = clientlink[0].innerHTML.replace(sessionStorage.oldClientName,sessionStorage.newClientName);
                // }
                app.loadData();
                app.searchClientsList();
            }, 
            function(error) {alert("Error occurred while updating Client table");});
        });
    },
    updateCurrentFeetype: function() {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
        var feetypeid = sessionStorage.selectedFeetypeId;
        var newName = document.getElementById("updateFeetypeName").value;
        var newDescr = document.getElementById("updateFeetypeDescription").value;
        var newPrice = document.getElementById("updateFeetypePrice").value;
         myDb.transaction(function(tx) {
            tx.executeSql('UPDATE FeeType set Name=?, Description=?, Amount=? WHERE id=?', [newName, newDescr, newPrice, feetypeid], 
            function(tx, result) {
                console.log("FeeType updated successfully");
                $.mobile.back();
                app.viewFeeTypes();
                
            }, 
            function(error) {
                alert("Error occurred while updating FeeType table: " + error.message);
            });
        });
    },
    deleteHistory: function() {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
        myDb.transaction(function(tx) {
            var clientId = sessionStorage.selectedId;
            tx.executeSql('Delete from Payment WHERE ClientId=?', [clientId], 
            function(tx, result) {
                console.log("Client payments deleted successfully");
                myDb.transaction(function(tx) {
                        var clientId = sessionStorage.selectedId;
                        tx.executeSql('Delete from ClientFee WHERE ClientId=?', [clientId], 
                        function(tx, result) {
                            $("#popupBasic").popup();
                            $.mobile.back();
                            app.loadData();
                            app.searchClientsList();
                        }, 
                        function(error) {alert("Error occurred while deleting Client");});
                    });
            }, 
            function(error) {alert("Error occurred while deleting Client");});
        });
        
    },
    deleteClient: function() {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
        myDb.transaction(function(tx) {
            var clientId = sessionStorage.selectedId;
            tx.executeSql('Delete from client WHERE id=?', [clientId], 
            function(tx, result) {
                console.log("Client deleted successfully");
                $.mobile.back();
                app.loadData();
                app.searchClientsList();
            }, 
            function(error) {alert("Error occurred while deleting Client");});
        });
    },
    deletePayment: function() {
        var paymentId = sessionStorage.SelectedPaymentId;
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
        myDb.transaction(function(tx) {
            tx.executeSql('Delete from Payment WHERE id=?', [paymentId], 
            function(tx, result) {
                console.log("Payment deleted successfully");
            }, 
            function(error) {alert("Error occurred while deleting Payment");});
        });
    },
    deleteFee: function() {
        var feeId = sessionStorage.SelectedFeeId;
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
        myDb.transaction(function(tx) {
            tx.executeSql('Delete from ClientFee WHERE id=?', [feeId], 
            function(tx, result) {
                console.log("Fee deleted successfully");
            }, 
            function(error) {alert("Error occurred while deleting Fee");});
        });
    },
    deleteFeetype: function() {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
        myDb.transaction(function(tx) {
            var FeeTypeId = sessionStorage.selectedFeetypeId;
            tx.executeSql('Delete from FeeType WHERE id=?', [FeeTypeId], 
            function(tx, result) {
                console.log("FeeType delted successfully");
                $.mobile.back();
                app.viewFeeTypes();
                $.mobile.navigate( "#feetypes" );
            }, 
            function(error) {alert("Error occurred while deleting Client");});
        });
    },
    saveNewFeetype: function() {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
        var newName = document.getElementById("newFeetypeName").value;
        var newDescr = document.getElementById("newFeetypeDescr").value;
        var newPrice = document.getElementById("newFeetypePrice").value;
         myDb.transaction(function(tx) {
            tx.executeSql('INSERT INTO FeeType (Name, Description, Amount, AuCrDt) VALUES (?,?,?,DATETIME("now"))', [newName, newDescr, newPrice], 
            function(tx, result) {
                console.log("Record inserted successfully");
                $.mobile.navigate( "#listclients" );
                document.getElementById("newFeetypeName").value = "";
                document.getElementById("newFeetypeDescr").value = "";
                document.getElementById("newFeetypePrice").value = "";
                app.viewFeeTypes();
                $.mobile.navigate( "#feetypes" );
            }, 
            function(error) {alert("Error occurred while inserting into FeeType table: "+error.message);});
        });
    },  
    saveNewFee: function() {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
        var newClientId = document.getElementById("newfeeClientId").innerHTML;
        var newFeeId = document.getElementById("newfeeId").innerHTML;
        var newFeeDate = document.getElementById("newfeeDate").value;
        var newFeeNote = document.getElementById("newfeeNote").value;
         myDb.transaction(function(tx) {
            tx.executeSql('INSERT INTO ClientFee (ClientId, FeeTypeId, FeeDate, Note, AuCrDt) VALUES (?,?,?,?,DATETIME("now"))', [newClientId, newFeeId, newFeeDate, newFeeNote], 
            function(tx, result) {
                console.log("Record inserted successfully");
                $.mobile.navigate( "#listclients" );
                document.getElementById("newfeeClientId").value = "";
                document.getElementById("newfeeNote").value = "";
                
                $.mobile.navigate( "#moreoptions" );
            }, 
            function(error) {alert("Error occurred while inserting into FeeType table: "+error.message);});
        });
    }, 
    saveNewClient: function() {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
        var clientId = sessionStorage.selectedId;
        var newDivision = document.getElementById("newClientDivision").value;
        var newName = document.getElementById("newClientName").value;
        var newSurname = document.getElementById("newClientSurname").value;
        var newEmail = document.getElementById("newClientEmail").value;
        var newMobile = document.getElementById("newClientMobile").value;
        var newQrId = document.getElementById("newClientQrId").value;
        //var newQrId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
        // Clean data on page

        
         myDb.transaction(function(tx) {
            var clientId = sessionStorage.selectedId;
            tx.executeSql('INSERT INTO Client (QrId, Name, Surname, Division, Email, Mobile, AuCrDt) VALUES (?,?,?,?,?,?,DATETIME("now"))', [newQrId, newName, newSurname, newDivision, newEmail, newMobile], 
            function(tx, result) {
                console.log("Record inserted successfully");
                $.mobile.navigate( "#listclients" );
                document.getElementById("newClientQrId").value = "";
                document.getElementById("newClientName").value = "";
                document.getElementById("newClientSurname").value = "";
                document.getElementById("newClientEmail").value = "";
                document.getElementById("newClientMobile").value = "";
                app.loadData();
                app.searchClientsList();
            }, 
            function(error) {alert("Error occurred while inserting into Client table: "+error.message);});
        });
    },
    viewpaymentsOnPageCreate: function() {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
         myDb.transaction(function(tx) {
            tx.executeSql('select Client.Name, Client.Surname, Payment.Id, Payment.PaymentDate, Payment.Amount FROM Payment join Client on Payment.ClientId = Client.Id order by PaymentDate desc, Name, Surname', [], 
            function(tx, result) {
                $.mobile.navigate( "#viewpayments" );
                if (result.rows.length > 0) {
                    console.log(result.rows.length + " Rows retrieved successfully");
                    var node = document.getElementById('paymentListContent');
                    while (node.hasChildNodes()) {
                        node.removeChild(node.firstChild);
                    }
                    var len = result.rows.length, i;
                    var currentMonth="";
                    var firstMonth = true;
                    var appendStr = "";
                    for (i = 0; i < len; i++){
                        var payment = result.rows.item(i);
                        var yyyy = payment.PaymentDate.substring(0,4);
                        var mm = payment.PaymentDate.substring(5,7);
                        var paymentMonth = yyyy + " - " + mm;
                        if (paymentMonth !== currentMonth) {                        
                            currentMonth = paymentMonth;
                            if (firstMonth) {
                                // $("#clientListContent").append("<div data-role='collapsible'><h4>"+currentDivision+"</h4><ul id='clientlv' data-role='listview' data-inset='true'>");
                                appendStr += "<div data-role='collapsible'><h4>"+currentMonth+"</h4><ul data-role='listview' data-inset='true'>";
                                firstMonth=false;
                            }
                            else {
                                appendStr += "</ul></div><div data-role='collapsible'><h4>"+currentMonth+"</h4><ul data-role='listview' data-inset='true'>";
                            }
                        }
                        appendStr += "<p style='font-size:11pt'>"+payment.PaymentDate+" | "+payment.Name + " " + payment.Surname + " | R" + payment.Amount + "<a id='BtnDeletePayment" + payment.Id + "' style='margin:10pt' class='ui-btn ui-mini ui-btn-inline ui-icon-delete ui-btn-icon-left'>Delete</a></p>";
                   };
                    appendStr+="</ul></div>";
                    var node = $("#clientListContent");
                    node.innerHTML="";
                    $("#paymentListContent").append( appendStr ).collapsibleset('refresh');
                    $('#viewpayments').trigger('create');
                    $('#paymentListContent').children().each(function(){
                        var anchor = $(this).find('a');
                        if(anchor)
                        {
                            anchor.click(function(){
                                if (this.id.indexOf('BtnDeletePayment') > -1) {
                                    sessionStorage.SelectedPaymentId = this.id.replace("BtnDeletePayment","");
                                    app.deletePayment();
                                    $.mobile.navigate( "#home" );
                                }
                            });
                        }
                    });
                }
            }, 
            function(error) {alert("Error occurred while retrieving payments: "+error.message);});
        });
    },
    listclientsOnPageCreate: function() {
        app.loadData();
    },
    loadData: function() {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
         myDb.transaction(function(tx) {
            tx.executeSql('SELECT * FROM Client ORDER BY Division, subdivision, Name, Surname', [], 
            function(tx, result) {
                console.log(result.rows.length + " Rows retrieved successfully");
                var node = document.getElementById('clientListContent');
                while (node.hasChildNodes()) {
                    node.removeChild(node.firstChild);
                }
                //$("#clientcontainer").html = "<div data-role='collapsible-set' data-content-theme='d' id='clientListContent'></div>";
                var len = result.rows.length, i;
                var currentDivision="";
                var currentSubdivision="";
                var firstDivision = true;
                var firstClient = true;
                var appendStr = "";
                for (i = 0; i < len; i++){
                    var client = result.rows.item(i);
                    if (client.Division !== currentDivision) {                        
                        currentDivision = client.Division;
                        firstClient = true;
                        if (firstDivision) {
                            // $("#clientListContent").append("<div data-role='collapsible'><h4>"+currentDivision+"</h4><ul id='clientlv' data-role='listview' data-inset='true'>");
                            appendStr += "<div data-role='collapsible' id='division" + client.Id + "'><h4>"+currentDivision+"</h4><ul id='clientlv" + i + "' data-role='listview' data-inset='true'>";
                            firstDivision=false;
                        }
                        else {
                            appendStr += "</ul></div><div data-role='collapsible' id='division" + client.Id + "'><h4>"+currentDivision+"</h4><ul id='clientlv" + i + "' data-role='listview' data-inset='true'>";
                        }
                    }
                    appendStr += "<li><a id='clientinlist"+client.Id+"'>"+client.Name + " " + client.Surname + "</a></li>";
                    // appendStr += "<li><a href='#updateclient'>"+client.Name + " " + client.Surname + "</a></li>";
                    //$("#clientListContent").append("<tr><td>"+result.rows.item(i).Id+"</td><td>"+result.rows.item(i).Name+"</td><td>"+result.rows.item(i).Surname+"</td></tr>");
                };
                appendStr+="</ul></div>";
                //var div = document.getElementById('clientListContent');
                //console.log("Append string:" + appendStr);
                var node = $("#clientListContent");
                node.innerHTML="";
                $("#clientListContent").append( appendStr ).collapsibleset('refresh');
                $('#listclients').trigger('create');
                var clientlinks = $('*[id^="clientinlist"]');
                var clientSize = clientlinks.length;
                $('#clientListContent').children().each(function(){
                //clientlinks.each(function(){
                //for (var i = 0; i < clientSize; i++) {
                    var anchor = $(this).find('a');
                    //var anchor = clientlinks[i];
                    if(anchor)
                    {
                        //if (anchor.attr('id').indexOf('client') > -1) {
                            anchor.click(function(){
                                // save the selected id to the session storage and retrieve it in the next page
                                //sessionStorage.selectedId=anchor.attr('id');
                                if (this.id.indexOf('clientinlist') > -1) {
                                    sessionStorage.selectedId=this.id.replace("clientinlist","");
                                    app.loadClientData();
                                    $.mobile.navigate( "#updateclient" );
                                }
                            });
                        //}
                    }
                });
                //console.log("div content:" + div.innerc)
                //$("#clientListContent").append(appendStr);
                //$('[clientListContent]').collapsibleset().trigger('create');
            }, 
            function(error) {alert("Error occurred while SELECT from table: " + error.message);});
        });
    },
    viewClientPayments: function() {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
         myDb.transaction(function(tx) {
            tx.executeSql('select * FROM Payment where ClientId=? order by PaymentDate desc', [sessionStorage.selectedId], 
            function(tx, result) {
                $.mobile.navigate( "#paymentsforclient" );
                var node = document.getElementById('paymentListPerClient');
                while (node.hasChildNodes()) {
                    node.removeChild(node.firstChild);
                }
                if (result.rows.length > 0) {
                    console.log(result.rows.length + " Rows retrieved successfully");

                    var len = result.rows.length, i;
                    var appendStr = "";
                    for (i = 0; i < len; i++){
                        var payment = result.rows.item(i);
                        appendStr += "<li><p style='font-size:11pt'>"+payment.PaymentDate+"    <b>R"+payment.Amount + "</b></p></li>";
                    }
                    $("#paymentListPerClient").html( appendStr );
                    
                }
            }, 
            function(error) {alert("Error occurred while retrieving payments: "+error.message);});
        });
    },
    viewClientFees: function() {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
         myDb.transaction(function(tx) {
            tx.executeSql("select FeeType.Name, FeeType.Amount, ClientFee.Id, ClientFee.FeeDate, ClientFee.Note FROM ClientFee join FeeType on ClientFee.FeeTypeId = FeeType.Id where ClientFee.ClientId=? order by FeeDate desc", [sessionStorage.selectedId], 
            function(tx, result) {
                $.mobile.navigate( "#feesforclient" );
                var node = document.getElementById('feeListPerClient');
                while (node.hasChildNodes()) {
                    node.removeChild(node.firstChild);
                }
                if (result.rows.length > 0) {
                    console.log(result.rows.length + " Rows retrieved successfully");

                    var len = result.rows.length, i;
                    var appendStr = "";
                    for (i = 0; i < len; i++){
                        var fee = result.rows.item(i);
                        appendStr += "<li><p style='font-size:11pt'>"+fee.FeeDate+" - " + fee.Name + " <b>R"+fee.Amount + "</b></p><a id='BtnDeleteFee" + fee.Id + "' style='margin:10pt' class='ui-btn ui-mini ui-btn-inline ui-icon-delete ui-btn-icon-left'>Delete</a></li>";
                    }
                    $("#feeListPerClient").html( appendStr );
                    $('#feeListPerClient').children().each(function(){
                        var anchor = $(this).find('a');
                        if(anchor)
                        {
                            anchor.click(function(){
                                if (this.id.indexOf('BtnDeleteFee') > -1) {
                                    sessionStorage.SelectedFeeId = this.id.replace("BtnDeleteFee","");
                                    app.deleteFee();
                                    $.mobile.back();
                                }
                            });
                        }
                    });
                }
            }, 
            function(error) {alert("Error occurred while retrieving fees: "+error.message);});
        });
        
    },
    SendStatementAsSms: function() {
        var date = new Date();
        var monthNames = ["Jan", "Febr", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"];
        var currentMonth = monthNames[date.getMonth()];
        var currentYear = date.getFullYear();
        var clientname = document.getElementById("updateClientName").value  + " " + document.getElementById("updateClientSurname").value;
        var smsMsg = "KidsBeGeeks Staat " + currentMonth + " " + currentYear + " vir " + clientname;
        if (sessionStorage.previousBalance < 0)
            smsMsg += "\nVorige uitstaande: R" + (0-sessionStorage.previousBalance);
        else
            smsMsg += "\nVorige balans: R" + sessionStorage.previousBalance;
        smsMsg += "\nFooie: R" + sessionStorage.currentFeeTotal;
        if (sessionStorage.currentPaymentTotal > 0)
            smsMsg += "\nBetalings: R" + sessionStorage.currentPaymentTotal;
        if (sessionStorage.currentBalance < 0)
        {
            smsMsg += "\nUitstaande: R" + (0-sessionStorage.currentBalance);
            smsMsg += "\nFNB Tjek Rek: 62461222839";
        }
        else
        {
            smsMsg += "\nBalans: R" + sessionStorage.currentBalance;
            smsMsg += "\nDankie!"
        }
        
        var options = {
            replaceLineBreaks: true, // true to replace \n by a new line, false by default
            android: {
                //intent: 'INTENT'  // send SMS with the native android SMS messaging
                intent: '' // send SMS without open any other app
            }
        };
        var mobile = document.getElementById("updateClientMobile").value;
        var success = function () { document.getElementById("statementSmsError").innerHTML = 'Message sent successfully'; $.mobile.navigate( "#home" ); };
        var error = function (e) { document.getElementById("statementSmsError").innerHTML ='Message Failed:' + e; };
        sms.send(mobile, smsMsg, options, success, error);
    },
    viewClientStatement: function() {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
        var paymentTotal=0;
        var feeTotal=0;
        $("#statementclientname").html(document.getElementById("updateClientName").value  + " " + document.getElementById("updateClientSurname").value);
        
        var date = new Date();
        var firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        var previousFees = 0;
        var previousPayments = 0;
        var currentFees = 0;
        var currentPayments = 0;
        
        $("#statementfeeListPerClient").html( "" );
        $("#curstatementfeeListPerClient").html( "" );
        $("#statementtotalfees").html("");
        $("#curstatementtotalfees").html("");
        $("#statementpaymentListPerClient").html( "" );
        $("#curstatementpaymentListPerClient").html( "" );
        $("#statementtotalpayments").html("");
        $("#curstatementtotalpayments").html("");
        $("#statementbalance").html("");
        $("#statementCurrentBalance").html("");
        $("#statementPreviousBalance").html("");
        
         myDb.transaction(function(tx) {
            tx.executeSql("select FeeType.Name, FeeType.Amount, ClientFee.FeeDate, ClientFee.Note FROM ClientFee join FeeType on ClientFee.FeeTypeId = FeeType.Id where ClientFee.ClientId=? order by FeeDate desc", [sessionStorage.selectedId], 
            function(tx, result) {
                
                var node = document.getElementById('statementfeeListPerClient');
                while (node.hasChildNodes()) {
                    node.removeChild(node.firstChild);
                }
                if (result.rows.length > 0) {
                    console.log(result.rows.length + " Rows retrieved successfully");

                    var len = result.rows.length, i;
                    var appendStr = "";
                    var curappendStr = "";
                    feeTotal=0;
                    previousFees = 0;
                    for (i = 0; i < len; i++){
                        var fee = result.rows.item(i);
                        feeTotal += fee.Amount;
                        if (new Date(fee.FeeDate) < firstDayOfMonth)
                            previousFees += fee.Amount;
                        else
                        {
                            currentFees += fee.Amount;
                            curappendStr += "<p style='font-size:11pt'>"+fee.FeeDate+" <br>" + fee.Name + " <br><b>R"+fee.Amount + "</b></p>";
                        }
                        appendStr += "<p style='font-size:11pt'>"+fee.FeeDate+" <br>" + fee.Name + " <br><b>R"+fee.Amount + "</b></p>";
                    }
                    $("#statementfeeListPerClient").html( appendStr );
                    $("#curstatementfeeListPerClient").html( curappendStr );
                    $("#statementtotalfees").html("R" + feeTotal);
                    $("#curstatementtotalfees").html("R" + currentFees);
                    sessionStorage.feeTotal = feeTotal;
                    sessionStorage.previousFeeTotal = previousFees;
                    sessionStorage.currentFeeTotal = currentFees;
                }
            }, 
            function(error) {alert("Error occurred while retrieving fees: "+error.message);});
        });
        myDb.transaction(function(tx) {
            tx.executeSql('select * FROM Payment where ClientId=? order by PaymentDate desc', [sessionStorage.selectedId], 
            function(tx, result) {
                
                var node = document.getElementById('statementpaymentListPerClient');
                while (node.hasChildNodes()) {
                    node.removeChild(node.firstChild);
                }
                if (result.rows.length > 0) {
                    console.log(result.rows.length + " Rows retrieved successfully");

                    var len = result.rows.length, i;
                    var appendStr = "";
                    var curappendStr = "";
                    for (i = 0; i < len; i++){
                        var payment = result.rows.item(i);
                        paymentTotal += payment.Amount;
                        if (new Date(payment.PaymentDate) < firstDayOfMonth)
                            previousPayments += payment.Amount;
                        else
                        {
                            currentPayments += payment.Amount;
                            curappendStr += "<p style='font-size:11pt'>"+payment.PaymentDate+"    <br><b>R"+payment.Amount + "</b></p>";
                        }
                        appendStr += "<p style='font-size:11pt'>"+payment.PaymentDate+"    <br><b>R"+payment.Amount + "</b></p>";
                    }
                    $("#statementpaymentListPerClient").html( appendStr );
                    $("#curstatementpaymentListPerClient").html( curappendStr );
                    $("#statementtotalpayments").html("R" + paymentTotal);
                    $("#curstatementtotalpayments").html("R" + currentPayments);
                    var balance = paymentTotal - sessionStorage.feeTotal;
                    $("#statementbalance").html("R" + balance);
                    var previousBalance = previousPayments - sessionStorage.previousFeeTotal;
                    var currentBalance = previousBalance + currentPayments - sessionStorage.currentFeeTotal;
                    $("#statementCurrentBalance").html("R" + currentBalance);
                    $("#statementPreviousBalance").html("R" + previousBalance);
                    sessionStorage.currentBalance = currentBalance;
                    sessionStorage.previousBalance = previousBalance;
                    sessionStorage.currentPaymentTotal = currentPayments;
                }
            }, 
            function(error) {alert("Error occurred while retrieving payments: "+error.message);});
        });
        $.mobile.navigate( "#statementforclient" );
        
    },
    searchClientsLoad: function() {
        $("#NewPaymentHeader").html("New Payment");
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
         myDb.transaction(function(tx) {
            tx.executeSql('SELECT * FROM Client ORDER BY Division, subdivision, Name, Surname', [], 
            function(tx, result) {
                console.log(result.rows.length + " Rows retrieved successfully");
                var arr = [];
                var len = result.rows.length;
                var appendStr = "";
                for (var i=0; i < len; i++) {
                    var client = result.rows.item(i);
                    appendStr += "<li><a id='clientinfilterlist"+client.Id+"'>"+client.Name + " " + client.Surname + "</a></li>";
                };
                //appendStr += "";
                $("#clientlistfilterable").html(appendStr).filterable("refresh");
                $('#clientlistfilterable').children().each(function(){
                //clientlinks.each(function(){
                //for (var i = 0; i < clientSize; i++) {
                    var anchor = $(this).find('a');
                    //var anchor = clientlinks[i];
                    if(anchor)
                    {
                        //if (anchor.attr('id').indexOf('client') > -1) {
                            anchor.click(function(){
                                // save the selected id to the session storage and retrieve it in the next page
                                //sessionStorage.selectedId=anchor.attr('id');
                                if (this.id.indexOf('clientinfilterlist') > -1) {
                                    sessionStorage.selectedId=this.id.replace("clientinfilterlist","");
                                    app.newPaymentById(sessionStorage.selectedId);
                                    //$.mobile.navigate( "#newpayment" );
                                }
                            });
                        //}
                    }
                });
            }, 
            function(error) {alert("Error occurred while creating the table");});
        });
        

    },
    newFee: function() {
        $("#NewPaymentHeader").html("New Fee");
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
         myDb.transaction(function(tx) {
            tx.executeSql('SELECT * FROM Client ORDER BY Name, Surname', [], 
            function(tx, result) {
                console.log(result.rows.length + " Rows retrieved successfully");
                var arr = [];
                var len = result.rows.length;
                var appendStr = "";
                for (var i=0; i < len; i++) {
                    var client = result.rows.item(i);
                    appendStr += "<li><a id='clientinfilterlist"+client.Id+"'>"+client.Name + " " + client.Surname + "</a></li>";
                };
                //appendStr += "";
                $("#clientlistfilterable").html(appendStr).filterable("refresh");
                $('#clientlistfilterable').children().each(function(){
                //clientlinks.each(function(){
                //for (var i = 0; i < clientSize; i++) {
                    var anchor = $(this).find('a');
                    //var anchor = clientlinks[i];
                    if(anchor)
                    {
                        //if (anchor.attr('id').indexOf('client') > -1) {
                            anchor.click(function(){
                                // save the selected id to the session storage and retrieve it in the next page
                                //sessionStorage.selectedId=anchor.attr('id');
                                if (this.id.indexOf('clientinfilterlist') > -1) {
                                    sessionStorage.selectedId=this.id.replace("clientinfilterlist","");
                                    app.newFeeById(sessionStorage.selectedId);
                                    //$.mobile.navigate( "#newfee" );
                                }
                            });
                        //}
                    }
                });
            }, 
            function(error) {alert("Error occurred while creating the table");});
        });
        

    },
    searchClientsList: function() {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
         myDb.transaction(function(tx) {
            tx.executeSql('SELECT * FROM Client ORDER BY Division, subdivision, Name, Surname', [], 
            function(tx, result) {
                console.log(result.rows.length + " Rows retrieved successfully");
                var arr = [];
                var len = result.rows.length;
                var appendStr = "";
                for (var i=0; i < len; i++) {
                    var client = result.rows.item(i);
                    appendStr += "<li><a id='clientinlist"+client.Id+"'>"+client.Name + " " + client.Surname + "</a></li>";
                };
                //appendStr += "";
                $("#clientlistfilterable1").html(appendStr).filterable("refresh");
                $('#clientlistfilterable1').children().each(function(){
                //clientlinks.each(function(){
                //for (var i = 0; i < clientSize; i++) {
                    var anchor = $(this).find('a');
                    //var anchor = clientlinks[i];
                    if(anchor)
                    {
                        //if (anchor.attr('id').indexOf('client') > -1) {
                            anchor.click(function(){
                                // save the selected id to the session storage and retrieve it in the next page
                                //sessionStorage.selectedId=anchor.attr('id');
                                if (this.id.indexOf('clientinlist') > -1) {
                                    sessionStorage.selectedId=this.id.replace("clientinlist","");
                                    app.loadClientData();
                                    //app.newPaymentById(sessionStorage.selectedId);
                                    $.mobile.navigate( "#updateclient" );
                                }
                            });
                        //}
                    }
                });
            }, 
            function(error) {alert("Error occurred while creating the table");});
        });
        

    },
    viewFeeTypes: function() {
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
         myDb.transaction(function(tx) {
            tx.executeSql('SELECT * FROM FeeType ORDER BY Name', [], 
            function(tx, result) {
                console.log(result.rows.length + " Rows retrieved successfully");
                var arr = [];
                var len = result.rows.length;
                var appendStr = "";
                for (var i=0; i < len; i++) {
                    var feetype = result.rows.item(i);
                    appendStr += "<li><a id='feetypeinlist"+feetype.Id+"'>"+feetype.Name + "  R" + feetype.Amount + "</a></li>";
                };
                $("#feetypelist").html(appendStr).filterable("refresh");
                $('#feetypelist').children().each(function(){
                    var anchor = $(this).find('a');
                    if(anchor)
                    {
                            anchor.click(function(){
                                if (this.id.indexOf('feetypeinlist') > -1) {
                                    sessionStorage.selectedFeetypeId=this.id.replace("feetypeinlist","");
                                    app.loadFeeTypeData();
                                    $.mobile.navigate( "#feetypedetail" );
                                }
                            });
                    }
                });
            }, 
            function(error) {alert("Error occurred while retrieving from feetype");});
        });
    },
    selectFeeTypeForClient: function() {
        $.mobile.navigate( "#feetypes" );
        var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
         myDb.transaction(function(tx) {
            tx.executeSql('SELECT * FROM FeeType ORDER BY Name', [], 
            function(tx, result) {
                console.log(result.rows.length + " Rows retrieved successfully");
                var arr = [];
                var len = result.rows.length;
                var appendStr = "";
                for (var i=0; i < len; i++) {
                    var feetype = result.rows.item(i);
                    appendStr += "<li><a id='feetypeinlist"+feetype.Id+"'>"+feetype.Name + "  R" + feetype.Amount + "</a></li>";
                };
                $("#feetypelist").html("");
                $("#feetypelist").html(appendStr).filterable("refresh");
                $('#feetypelist').children().each(function(){
                    var anchor = $(this).find('a');
                    if(anchor)
                    {
                            anchor.click(function(){
                                if (this.id.indexOf('feetypeinlist') > -1) {
                                    sessionStorage.selectedFeetypeId=this.id.replace("feetypeinlist","");
                                    app.PopulateFeeData();
                                    $.mobile.navigate( "#newfee" );
                                }
                            });
                    }
                });
            }, 
            function(error) {alert("Error occurred while retrieving from feetype");});
        });
    },
    PopulateFeeData: function() {
         var myDb = window.openDatabase("QRPaymentDb", "1.0", "QR Payment Database", 200000); 
         myDb.transaction(function(tx) {
            tx.executeSql('select * FROM FeeType where Id=?', [sessionStorage.selectedFeetypeId], 
            function(tx, result) {
                if (result.rows.length > 0) {
                    console.log(result.rows.length + " Rows retrieved successfully");
                    var fee = result.rows.item(0);
                    document.getElementById("newfeeName").innerHTML = fee.Name + " - R" + fee.Amount;
                    document.getElementById("newfeeId").innerHTML = fee.Id;
                }
            }, 
            function(error) {alert("Error occurred while retrieving fee: "+error.message);});
        });
    },
    bindEvents: function() {
        sessionStorage.firstTimeRun=true;
        $(document).on("pagecreate","#listclients",function(event){app.listclientsOnPageCreate();});
        //$(document).on("pagecreate","#viewpayments",function(event){app.viewpaymentsOnPageCreate();});
        $(document).on("pagecreate","#updateclient",function(event){app.loadClientData();});
        //$(document).on("pagecreate","#searchclients",function(event){app.searchClientsLoad();});
        $(document).on("click","#BtnUpdateClient",function(event){app.updateCurrentClient();});
        $(document).on("click","#BtnUpdateFeetype",function(event){app.updateCurrentFeetype();});
        $(document).on("click","#BtnSaveNewClient",function(event){app.saveNewClient();});
        $(document).on("click","#BtnSaveNewFeetype",function(event){app.saveNewFeetype();});
        $(document).on("click","#BtnSaveNewFee",function(event){app.saveNewFee();});
        $(document).on("click","#BtnCaptureNewClientQr",function(event){app.captureNewClientQr();});
        $(document).on("click","#BtnCaptureUpdateClientQr",function(event){app.captureUpdateClientQr();});
        $(document).on("click","#BtnNewPayment",function(event) {app.searchClientsLoad();});
        $(document).on("click","#BtnSaveNewPayment",function(event) {app.saveNewPayment(false);});
        $(document).on("click","#BtnSaveNewPaymentAndSMS",function(event) {app.saveNewPayment(true);});
        $(document).on("click","#BtnSmsStatement",function(event) {app.SendStatementAsSms();});
        $(document).on("click","#BtnViewPayments",function(event) {app.viewpaymentsOnPageCreate();});
        $(document).on("click","#BtnFeeTypes",function(event) {app.viewFeeTypes();});
        $(document).on("click","#BtnNewFeetype",function(event) {$.mobile.navigate( "#addfeetype" );});
        $(document).on("click","#BtnNewFee",function(event) {app.newFee();});
        $(document).on("click","#BtnViewClientPayments",function(event) {app.viewClientPayments();});
        $(document).on("click","#BtnViewClientFees",function(event) {app.viewClientFees();});
        $(document).on("click","#BtnViewClientStatement",function(event) {app.viewClientStatement();});
        
        $(document).on("click",'#BtnSearchClients',function(event) {app.searchClientsList();});
        $(document).on("click","#BtnSearchClientQr",function(event) {app.newPaymentByQr();});
        $(document).on("click","#BtnSearchClientListQr",function(event) {app.viewClientByQr();});
        $(document).on("click","#BtnDeleteClient",function(event) {app.deleteClient();});
        $(document).on("click","#BtnDeleteHistory",function(event) {app.deleteHistory();});
        
        $(document).on("click","#BtnDeleteFeetype",function(event) {app.deleteFeetype();});
        $(document).on("click","#BtnSelectFee",function(event) {app.selectFeeTypeForClient();});
        $(document).on("click","#BtnGoHome",function(event) {$.mobile.navigate("#home");});
        $(document).on("click","#BtnAnotherPayment",function(event) {app.searchClientsLoad();});
        
        
        $(document).on("click",".back-btn",function(event) {$.mobile.back();});
        $(document).on("click",".home-btn",function(event) {$.mobile.navigate( "#home" );});
        
        //$(document).bind("mobileinit", function(){$.mobile.page.prototype.options.degradeInputs.date = true;});	
        // $(document).on("pagecreate","#pagetwo",function(event){
        //     $.(":jqmData(role='my-plugin')").myPlugin();
        // });
        // document.addEventListener('deviceready', this.onDeviceReady, false);
        // $('#add-client-button').click(function() {
        //     $.mobile.changePage($('#addclient'));
        //     //this.goToPage($('#addclient'));
        // });

        // $('#client-list').click(function() {
        //     $.mobile.changePage($('#addclient'));
        // });
    }
};

