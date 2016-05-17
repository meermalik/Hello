var QueriesArray = [];
    $(document).ready(function () {
            
		 var db = openDatabase('PropertyServeydb', '1.0', 'Property Management Servey', 2 * 1024 * 1024);
         var msg;

            db.transaction(function (tx) {

                tx.executeSql('CREATE TABLE IF NOT EXISTS ServeyDetails (SurveyId  integer primary key autoincrement,OwnerName text,Mobile text,Address text,SCO text,Sector text,City text,NoOfFloors text,NoOfTenants text,TenantNames text,VacantArea text,ImageUrl text,IsDeleted text)');

                tx.executeSql('CREATE TABLE IF NOT EXISTS ServeyImages (ImageId integer primary key autoincrement,ImageName text,ImageUrl text,ImageDescription text,IsDeleted text)');

            });

            db.transaction(function (tx) {
                var i;
                try {

                    for (i = 0; i < QueriesArray.length; ++i) {
                        var qrstr = QueriesArray[i];
                        tx.executeSql(qrstr);
                    }
                }
                catch (e) {
                    console.log(e.message);
                }
            });

            $('#btnSaveServey').on('click', function () {

                var OwnerName = $('#OwnerName').val();
                var Mobile = $('#Mobile').val();
                var Address = $('#Address').val();
                var SCO = $('#SCO').val();
                var Sector = $('#Sector').val();
                var City = $('#City').val();
                var NoOfFloors = $('#NoOfFloors').val();
                var NoOfTenants = $('#NoOfTenants').val();
                var TenantNames = $('#TenantNames').val();
                var VacantArea = $('#VacantArea').val();
                var ImageUrl = $('#ImageUrl').val();

                var db = openDatabase('PropertyServeydb', '1.0', 'Property Management Servey', 2 * 1024 * 1024);
                var msg;

                db.transaction(function (tx) {

                    tx.executeSql('Insert into ServeyDetails(OwnerName,Mobile,Address,SCO,Sector,City,NoOfFloors,NoOfTenants,TenantNames,VacantArea,ImageUrl,IsDeleted)values(?,?,?,?,?,?,?,?,?,?,?,?)', [OwnerName, Mobile, Address, SCO, Sector, City, NoOfFloors, NoOfTenants, TenantNames, VacantArea, ImageUrl, 1])
                });
                clearForm();
                $('#lblMsg').html('Data Has Been Saved Successfully').css('color', '#E41171');
               

            });
            //$('#btnGetData').on('click', function () {
            $('#btnSyncNow').on('click', function () {
                if (!window.openDatabase) {
                    alert('Databases are not supported in this browser.');
                    return;
                }

                // this line tries to open the database base locally on the device if it does not exist, it will create it and return a database object stored in variable db

                db = openDatabase('PropertyServeydb', '1.0', 'Property Management Servey', 2 * 1024 * 1024);

                // this line clears out any content in the #lbUsers element on the page so that the next few lines will show updated content and not just keep repeating lines

                $('#lbUsers').html('');
                db.transaction(function (transaction) {
                    transaction.executeSql('SELECT * FROM ServeyDetails;', [], function (transaction, result) {
                        var objServeyDetaileMultiple = [];

                        if (result != null && result.rows != null) {

                            for (var i = 0; i < result.rows.length; i++) {
                                var row = result.rows.item(i);
                                objServeyDetaileMultiple.push({
                                    ownerName: row.OwnerName,
                                    Mobile: row.Mobile,
                                    Address: row.Address,
                                    SCO: row.SCO,
                                    Sector: row.Sector,
                                    City: row.City,
                                    NoOfFloors: row.NoOfFloors,
                                    NoOfTenants: row.NoOfTenants,
                                    TenantNames: row.TenantNames,
                                    VacantArea: row.VacantArea,
                                    ImageUrl: row.ImageUrl,
                                });
                            }
                            $.ajax({

                                type: "POST",
                                url: 'http://animatestudioz.com/surveyweb/Controller.asmx/SaveServeyFrommobile' + '?callback=jsonCallback', // the method we are calling
                                //url: 'Controller.asmx/SaveServeyFrommobile',
                                contentType: "application/json; charset=utf-8",
                                crossDomain: true,
                                data: JSON.stringify({ 'objServeyDetaileMultiple': objServeyDetaileMultiple }),
                                //data: {
                                //    objServeyDetaileMultiple: objServeyDetaileMultiple
                                //},
                                processData: true,
                                dataType: "json",
                                beforeSend: function (x) {
                                    $('#btnSyncNow').disabled = true;
                                    $('#btnSyncNow').attr("disabled", true);
                                    if (x && x.overrideMimeType) {
                                        x.overrideMimeType("application/j-son;charset=UTF-8");
                                    }
                                },
                                success: function (result) {
                                  //  alert('Yay! It worked!');
                                    $('#btnSyncNow').disabled = false;
                                    $('#btnSyncNow').attr("disabled", false);
                                    $('#lblSyncSuccessMsg').css('visibility', 'block');
                                    $('#lblSyncErrorMsg').css('visibility', 'none');
                                    db.transaction(function (transaction) {
                                        transaction.executeSql('delete from ServeyDetails');
                                    });
                                },
                                error: function (xhr, ajaxOptions, thrownError) {

                                    console.log('Oh no :' + xhr.responseText);
                                    if (xhr.status == 200) {
                                        db.transaction(function (transaction) {
                                            transaction.executeSql('delete from ServeyDetails');
                                        });
                                        $('#lblSyncSuccessMsg').css('display', 'block');
                                        $('#lblSyncErrorMsg').css('display', 'none');
                                    }
                                    else {
                                        $('#lblSyncSuccessMsg').css('display', 'none');
                                        $('#lblSyncErrorMsg').css('display', 'block');
                                    }
                                    $('#btnSyncNow').disabled = false;
                                    $('#btnSyncNow').attr("disabled", false);

                                }
                            });
                        }


                    });
                }, nullHandler);

                return;
                alert('in list end');


                // this is called when a successful transaction happens
                function successCallBack() {
                    alert("DEBUGGING: success");

                }

                function nullHandler() {
                    alert('null handler');
                };

               
            });

            

            $("#btnSaveToDataBase").on('click', function () {
                UploadOnline();
            })
            function clearForm() {

                $('#OwnerName').val('');
                $('#Mobile').val('');
                $('#Address').val('');
                $('#SCO').val('');
                $('#Sector').val('');
                $('#City').val('');
                $('#NoOfFloors').val('');
                $('#NoOfTenants').val('');
                $('#TenantNames').val('');
                $('#VacantArea').val('');
                $('#ImageUrl').val('');
            }

            function UploadOnline() {
                debugger;
                $.ajax({
                    type: "POST",
                    url: "Interaction.aspx/SimpleContact", // the method we are calling
                    //contentType: "application/json; charset=utf-8",
                    data: { number: 1 },
                    //dataType: "json",
                    success: function (result) {
                        alert('Yay! It worked!');
                    },
                    error: function (result) {
                        alert('Oh no :(');
                    }
                });
            }

            //View Servey Details on View Servey Click
            $("#menu1link").on('click', function () {
                $("#Details").html("");
                db = openDatabase('PropertyServeydb', '1.0', 'Property Management Servey', 2 * 1024 * 1024);
                db.transaction(function (transaction) {
                    transaction.executeSql('SELECT * FROM ServeyDetails;', [], function (transaction, result) {
                        var Tablerow = "";
                        if (result != null && result.rows != null) {

                            for (var i = 0; i < result.rows.length; i++) {
                                var row = result.rows.item(i);
                                var Tablerow = '<tr>';
                                Tablerow += '<td>' + row.OwnerName, + '</td>';
                                Tablerow += '<td>' + row.Mobile + '</td>';
                                Tablerow += '<td>' + row.Address + '</td>';
                                Tablerow += '<td>' + row.SCO + '</td>';
                                Tablerow += '<td>' + row.Sector + '</td>';
                                Tablerow += '<td>' + row.City + '</td>';
                                Tablerow += '<td>' + row.NoOfFloors + '</td>';
                                Tablerow += '<td>' + row.NoOfTenants + '</td>';
                                Tablerow += '<td>' + row.TenantNames + '</td>';
                                Tablerow += '<td>' + row.VacantArea + '</td>';
                                Tablerow += '</tr>';
                                $("#Details").append(Tablerow);
                            }
                        }
                    });
                });

            });
            $("#sync").on('click', function () {
                checkNetConnection();
            })
            function checkNetConnection() {

                var status = navigator.onLine;
                if (status) {
                    //  alert("online");
                    $(".offline").css('display', 'none');
                    $(".online").css('display', 'block');
                    $(".online1").css('display', 'block');
                    $('#btnSyncNow').disabled = false;
                    $('#btnSyncNow').attr("disabled", false);
                } else {
                    //  alert("offline");
                    $(".offline").css('display', 'block');
                    $(".online").css('display', 'none');
                    $(".online1").css('display', 'none');
                    $('#btnSyncNow').disabled = true;
                    $('#btnSyncNow').attr("disabled", true);
                }

            }
			
			
			$('#ImageUrl').on('click', function () {
			 	capturePhoto();
			});
			function capturePhoto() {
				// Take picture using device camera and retrieve image as base64-encoded string
				navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,destinationType: Camera.DestinationType.FILE_URI });
			}
			function onPhotoDataSuccess(imageData) {
			
			  // Get image handle
               var smallImage = document.getElementById('smallImage');

               // Unhide image elements
               smallImage.style.display = 'block';
               smallImage.src = imageData;
			   console.log("Image taken");
			   //movePic(imageData);
			   getFileEntry(imageData);
			}
					
			function onFail(message) {
             alert('Failed because: ' + message);
			}
			
			//function to move file to another location
			function movePic(file){ 
				window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
           
				window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError); 
			} 
			
			//Callback function when the file system uri has been resolved
			function resolveOnSuccess(entry){ 
			  //alert(cordova.file.externalDataDirectory);
			  //alert(cordova.file.applicationStorageDirectory);
				var d = new Date();
				var n = d.getTime();
				//new file name
				var newFileName = "survey-"+n + ".jpg";
				var myFolderApp = cordova.file.applicationStorageDirectory+"/files";

				window.requestFileSystem(LocalFileSystem.PERSISTENT, 100*1024*1024, function(fileSys) {      
				//The folder is created if doesn't exist
				fileSys.root.getDirectory( myFolderApp,
                    {create:true, exclusive: false},
                    function(directory) {
                        entry.moveTo(directory, newFileName,  successMove, resOnError);
                    },
                    resOnError);
                    },
				resOnError);
			}

			//Callback function when the file has been moved successfully - inserting the complete path
			function successMove(entry) {
				//I do my insert with "entry.fullPath" as for the path
				alert("path is- "+entry.fullPath);
				alert("saved successfully");
			}

			function resOnError(error) {
				alert("error code - "+error.code);
				alert("error code - "+error.message);
			}
			
			
			
			function getFileEntry(imgUri) {
				window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {

				 // Do something with the FileEntry object, like write to it, upload it, etc.
				 // writeFile(fileEntry, imgUri);
				 alert.log("got file: " + fileEntry.fullPath);
				 // displayFileData(fileEntry.nativeURL, "Native URL");

			    }, function () {
				  // If don't get the FileEntry (which may happen when testing
				  // on some emulators), copy to a new FileEntry.
				  createNewFileEntry(imgUri);
			    });
			}
			
			function createNewFileEntry(imgUri) {
				window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function success(dirEntry) {

				// JPEG file
				dirEntry.getFile("tempFile.jpeg", { create: true, exclusive: false }, function (fileEntry) {

				 // Do something with it, like write to it, upload it, etc.
				 // writeFile(fileEntry, imgUri);
				 console.log("got file: " + fileEntry.fullPath);
				 // displayFileData(fileEntry.fullPath, "File copied to");

				}, null);

                }, null);
			}
		
    });