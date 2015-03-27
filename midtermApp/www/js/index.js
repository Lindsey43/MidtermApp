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
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

//------- App Javascript -------//
var midtermapp = function(){
    var Page_Loaded = 0;
    var Device_Ready = 1;
    var maxcontacts = 12;

    var mappapp = function(n){
        var values = n;
        var setthebit = function(bitIndex){
            values |= (0x01<<bitIndex);
        }

        var BitwasSet = function(bitIndex){
            return values &(0x01<<bitIndex);
        }

        var reload = function(){
            values = 0;
        }
    };

    var storageapp = function(){
        var apps =[];

        var validkeys = function(key){
            var freekeys = ['id','name','phoneNumbers','latLng'];
            return (-1 !== freekeys.indexOf(key));
        };

        var reload = function(){
            apps = [];
            if('localStorage' in window){
                localStorage.setItem("contactsInfo", JSON.stringify(apps));
            }
        }

        var updateData = function(userId, data){
            if( (MAXIMUM_NUMBER_OF_DISPLAYED_CONTACTS> userId) &&
                ("object" === typeof data)){
                    for(var key in data){
                    /* validate key.*/
                    if(validkeys(key)){
                        apps[userId][key] = data[key];
                    }
                }

                if('localStorage' in window){
                    localStorage.setItem("contactsInfo", JSON.stringify(apps));
                }
            }
        }

        var getData = function(userId, key){
            var values = null;

            if('localStorage' in window){
                apps = JSON.parse(localStorage.getItem("contactsInfo"));
                if(null === apps){
                    apps = [];
                }
            }

            if( (maxcontacts > userId) &&
                (apps.length > userId) &&
                (validkeys(key)) ){
                    values = apps[userId][key];
            }

            return values;
        };

        var saveData = function(userId, data){
            data.id = userId;
            if( (maxcontacts> userId) &&
                ("object" === typeof data)){
                var finalt = {};
                for(var key in data){
                    if(validkeys(key)){
                        final[key] = data[key];
                    }
                }
                apps.push(finalObject);
            }

            if('localStorage' in window){
                localStorage.setItem("contactsInfo", JSON.stringify(apps));
            }
        };
    };

    var mapDriverClass = function (){
        var maps;
        var markers = [];

        var loadedMaps = function (){
            console.log("Map are trying to loading");

        var styles = [
                        {
                          featureType: "water",
                          stylers: [
                                        { color: "#Pink" },
                                        { saturation: -24}
                                    ]
                        }
                      ];


        if(position.isNull()){
            console.log("position is null");
            var mapOptions = {
                               center: {lat:0, lng:0},
                               zoom:3,
                               disableDoubleClickZoom: true
                             };
        }else{
            document.querySelector(".fail").style.opacity = 0;
            var mapOptions = {
                               center: position.CurrentCoordinates(),
                               zoom: 15,
                               disableDoubleClickZoom: true
                             };

        }

        maps =  new google.maps.Map(document.getElementById('map-canvas'),
                    mapOptions);
        maps.setOptions({styles: styles});
        };

        var resizing = function(){
            google.maps.event.trigger(map, 'resizing');
            //maps are zoom on to the map,mapCanvas.setZoom(mapCanvas.getZoom());
        }

        var registertheevent = function (eventType, callback,object){
            if(!object){
                object = maps;
            }
            /* To save memory, register the event only once. */
            google.maps.event.addListenerOnce(object, eventType, callback);
        }

        var addNewMarker =  function(event){
            var marker = new google.maps.Marker({
                position: event.latLng,
                draggable:true,
                animation: google.maps.Animation.BOUNCE,
                icon: { fillColor:"red",
                        fillOpacity: 1,
                        path:"M45.1,45.9H2.9c2-7.6,6.5-11.2,12.2-12.7c2.6,1.4,5.6,2.2,8.8,2.2c3.2,0,6.2-0.8,8.8-2.2C38.5,34.8,43,38.3,45.1,45.9z M38.7,16.7c0,8.1-6.6,14.7-14.7,14.7c-8.1,0-14.7-6.6-14.7-14.7C9.3,8.6,15.9,2.1,24,2.1C32.1,2.1,38.7,8.6,38.7,16.7z M35.2,21.1 H14.3c2.2,4.3,6.1,7.2,10.5,7.2C29.1,28.3,32.9,25.5,35.2,21.1z"
                      },
                maps: maps
              });

            /* get current user id */
            var userId = siteNavigator.CurrerntId();

            if("function" === typeof event.latLng.lat){
                var objects = { "lat": event.latLng.lat(),
                                "lng":event.latLng.lng()};
            }else{
                var objects = {"lat": event.latLng.lat, "lng":event.latLng.lng};
            }

            /* save coordinates to local storage. */
            storage.updateData(userId, {"latLng":object});

            markers.splice(userId,0,marker);
            /* add listener to the event of dragging the marker. */
            var markerDragHandler = google.maps.event.addListener(marker, "drag", function(event){

                if("function" === typeof event.latLng.lat){
                    var objects = { "lat": event.latLng.lat(),
                                    "lng":event.latLng.lng()};
                }else{
                    var objects = {"lat": event.latLng.lat, "lng":event.latLng.lng};
                }

                /* saving the coordinates to local storage. */
                storage.updateData(userId, {"latLng":object});
                markers[userId].position = event.latLng;
            });

            var contentString = '<div id="info-window"><p>Contact name: '+
                                    storage.getData(userId, "name")+
                                    '</p></div>';
            console.log(contentString);
            var infowindow = new google.maps.InfoWindow({content: contentString});
            google.maps.event.addListener(marker, 'click', function() {
                                    infowindow.open(map,marker);
                                  });

            setTimeout(function(){
                marker.setAnimation(null);
                // infowindow.open(map,marker);
            }, 3000);

        }

        var loadSaveMarker = function(latLng){
            var objects = {"latLng": latLng};
            /* adding the marker to the map when it is loaded */
            addNewMarker(object);
        }

        var clearingMarkers = function(){
            for(var i=0; i< markers.length; i++){
                markers[i].setMap(null);
                markers[i] = null;
            }
            markers = [];
        }

        var changetheCenter = function(latLng){
            maps.setCenter(latLng);
        }
    };

    var geoclass = function (){

        var coordinates = {"lat":null, "lng":null};
        var errorsBitMap = new geoclass(0);

        var PERMISSION_DENIED= 0;
        var POSITION_UNAVAILABLE = 1;
        var TIMEOUT = 2;

        var Requesttig = function(){
          if( navigator.geolocation ){
              var params = {enableHighAccuracy: true, timeout:3500, maximumAge:7000};
              navigator.geolocation.getCurrentPosition( reportPosition, gpsError, params );
          }else{
            //browser does not support map api
            alert("your browser does not support the location based.")
          }
        }

        var reportPosition = function ( position ){
            coordinates.lat  = parseFloat(position.coords.latitude);
            coordinates.lng  = parseFloat(position.coords.longitude);
        }

        var gpsError = function ( error ){
          coordinates.lat  = null;
          coordinates.lng  = null;

          switch(error.code){
            case error.PERMISSION_DENIED:
                console.error("permission denied");
                errorsBitMap.setBit(PERMISSION_DENIED_BIT_INDEX);
                break;
            case error.POSITION_UNAVAILABLE:
                console.error("position unavailable");
                errorsBitMap.setBit(POSITION_UNAVAILABLE_BIT_INDEX);
                break;
            case error.TIMEOUT:
                console.error("position request timeout");
                errorsBitMap.setBit(TIMEOUT_BIT_INDEX);
                if(errorsBitMap.isBitSet(POSITION_UNAVAILABLE_BIT_INDEX)){
                    /* clear bit map and return since warning gps modal window have been displayed before
                    to the user upon receiving position unavailable error*/
                    errorsBitMap.reset();
                    return;
                }
          }

          /* display notification message to the user to make sure that GPS is turned on. */
          document.querySelector('#gps-modal-window').className = "show";
        }

        var CurrentCoordinates = function(){
            return coordinates;
        }

        var IsNull = function(){
            return ((null === coordinates.lat) && (null === coordinates.lng));
        }
    };

    var SiteNavigatorClass = function(){
        var pages = {};
        var numPages = 0;
        var currentPageId = null;
        var mapCanvas = null;
        var currentId = -1;

        var init = function(){

            var pagesArray = document.querySelectorAll('[data-role="page"]');
            numPages = pagesArray.length;


            /* save pages into js object where the key is the same as the given page id*/
            for(var i=0; i< numPages; i++){
                pages[pagesArray[i].getAttribute("id")] = pagesArray[i];
            }
            delete pagesArray; //Free the memory to increase performance.

            doPageTransition(null, "contacts");

            /* Add tap/double tap event listeners to list view of contacts. */
            var contactsListView = document.querySelector('ul[data-role="listview"]');

            /* Relate tap and double tap events to list view of contacts using hammer API */
            var contactListHammerManager = new Hammer.Manager(contactsListView);

            /* Create specifications for single tap and double tap events. */
            var doubleTapEvent = new Hammer.Tap({ event: 'doubletap', taps: 2 }) ;
            var singleTapEvent = new Hammer.Tap({ event: 'singletap', domEvents:true });

            /* Add single/double tap events to hammer manager.*/
            contactListHammerManager.add( doubleTapEvent );
            contactListHammerManager.add( singleTapEvent);

            /* we want to recognize single/double tap simulatenously. Otherwise single tap handler will be always triggered during double tap event.
            So a double tap will be detected even a single tap has been recognized.*/
            doubleTapEvent.recognizeWith('singletap');

            /* we only want to trigger a tap, when we don't have detected a doubletap. */
            singleTapEvent.requireFailure('doubletap');

            /* register handler for single/double tap events. */
            contactListHammerManager.on("doubletap", handleContactDoubleTap );
            contactListHammerManager.on("singletap", handleContactSingleTap);

            var cancelBtnHammerManager = new Hammer( document.getElementById("btnCancel"));
            cancelBtnHammerManager.on('tap', handleCancelTap);

            var okBtnHammerManager = new Hammer( document.getElementById("btnOk"));
            okBtnHammerManager.on('tap', handleOkTap);

            var cancelBtnGPSHammerManager = new Hammer( document.getElementById("btnCancelGPS"));
            cancelBtnGPSHammerManager.on('tap', handleCancelTapForGPS);

            var settingsBtnGPSHammerManager = new Hammer( document.getElementById("btnSettingsGPS"));
            settingsBtnGPSHammerManager.on('tap', handleSettingsTapForGPS);

            okBtnHammerManager = new Hammer(document.getElementById("btnOkUserLoc"));
            okBtnHammerManager.on('tap', handleOkTap);

            var backBtnHammerManager = new Hammer(document.querySelector('svg[data-icon-name="back"]'));
            backBtnHammerManager.on('tap', handleBackButton);

            /* Wait until the trigger of current location request is timed-out.
            handle error case by showing a warning message to the user to open his GPS */
            setTimeout(mapDriver.loadMap, 3600);
        }

        var handleSettingsTapForGPS = function(ev){
            document.querySelector('#gps-modal-window').className = "hide";
            /* TODO: Show Device settings app.*/
        }

        var handleCancelTapForGPS = function(ev){
            document.querySelector('#gps-modal-window').className = "hide";
        }

        var handleCancelTap = handleOkTap = function(ev){
            if('btnOkUserLoc' === ev.target.getAttribute("id")){
                document.querySelector('#user-loc-modal-window').className = "hide";
            }else{
                document.querySelector('#contacts-modal-window').className = "hide";
            }

        }

        var handleContactDoubleTap = function(ev){
            console.log("Double tap event has been recognized");

            /* Get which list item have been tapped. Since hammer.js does not have currentTarget property, a bubbling
             * navigation must be done toward the parent element(s) to find out which contact has been double-tapped */
             // var timeStamp1 = Date.now();
             var currentTarget = ev.target;
             var contactId = currentTarget.getAttribute("data-ref");
             while(null === contactId){
                currentTarget = currentTarget.parentNode;
                contactId     = currentTarget.getAttribute("data-ref");
             }

             /* Make sure that we find a valid contanct list item */
             if(contactId){
                currentId = contactId;

                /* Get the location information stored in local storage (if any) using the contact id. */
                var latLng = storage.getData(currentId, "latLng");

                /* clear any markers on the map. */
                mapDriver.clearMarkers();

                /*  Using the fetched current gps position as the center of the map clear any markers that are currently on the map.*/
                doPageTransition("contacts","area", true);

                /*  since location section was hidden while loading the map, div dimensions were zero,
                    trigger resize event so that map tiles are rendered properly after showing the location section.*/
                mapDriver.resizing();

                /* Check the localStorage data to see if the selected user has a latitude and longitude.*/
                if(latLng){
                    /*If the user has a saved cooardinates in local storage, add an animated marker to the map.*/
                    mapDriver.loadSavedMarker(latLng);
                    mapDriver.changeCenter(latLng);

                }else{ /* case user does NOT have a stored cooardinates in local storage. */

                    if(position.Null()){
                        /* User might double-tapped an item list before triggering loadMap method. Make sure to reset
                        opacity to zero if the postion cooradinates have been obtained successfully afterwards.*/
                        console.log("sitting opacity of toast message to 1");
                        document.querySelector(".fail").styles.opacity = 1;
                    }else{
                        console.log("toast message will not be displayed");
                        /* display a dialog box that tells the app user to double tap anywhere on the map to set a position for that contact.*/
                        document.querySelector('#user-loc-modal-window').className = "show";
                    }

                    mapDriver.registerEvent("dblclick", mapDriver.addNewMarker);
                }
             }

        }

        var handleContactSingleTap = function(ev){
            console.log("Single tap event has been recognized");
            var contactModalWindow = document.querySelector('#contacts-modal-window');

            /* display modal window that will display the contact's name as well as all phone numbers for that contact. */

            /* Get which list item have been tapped. Since hammer.js does not have currentTarget property, a bubbling
             * navigation must be done toward the parent element(s) to find out which contact has been tapped */
             // var timeStamp1 = Date.now();
             var currentTarget = ev.target;
             var contactId = currentTarget.getAttribute("data-ref");
             while(null === contactId){
                currentTarget = currentTarget.parentNode;
                contactId     = currentTarget.getAttribute("data-ref");
             }

             /* Make sure that we find a valid contanct list item */
             if(contactId){
                currentId = contactId;
                /* information stored in local storage. */
                var tablePlaceHolders = document.querySelectorAll("table tr td");
                tablePlaceHolders[0].innerHTML = storage.getData(currentId, "name");
             }
                tablePlaceHolders[2].innerHTML = "";
                var contactPhoneNumbers = storage.getData(currentId, "phoneNumbers");
                var contactPhoneNumbers = storage.getData(currentId, "phoneNumbers");
                for(var j=0; j<contactPhoneNumbers.length; j++ ){
                    tablePlaceHolders[2].innerHTML += contactPhoneNumbers[j] + "<br>";
                }
             }

             contactModalWindow.className = "show";

        }

        var loadDynamicContents = function(pageId){
            switch(pageId){
                case "contacts":
                    document.querySelector('.col-header:first-child').classList.add("hide");

                    /* Generate a random number from the available contacts to be displayed.
                    Note that a random number will be generated in the range (0, maximum length of contacts -1)*/

                     if(contacts.getEntries()){
                        var listView = document.querySelector('ul[data-role="listview"]');
                        /* display maximum 12 contacts. */
                        for(var i=0;
                            (i< contacts.getEntries().length) &&  (i< MAXIMUM_NUMBER_OF_DISPLAYED_CONTACTS);
                            i++){

                            var listItems = listView.querySelector('li[data-ref="'+i+'"]');

                            var contactNameTag = listItem.querySelector('p.contact-name');
                            contactNameTag.innerHTML = contacts.getDisplayName(i);

                            listItem.classList.remove("hide");

                            /* save displayed contacts to local storage. */
                            storage.saveData(i,
                                {
                                     "name"       : contacts.getDisplayName(i),
                                     "phoneNumbers": contacts.getPhoneNumbers(i),
                                     "latLng"     : storage.getData("latLng")
                                });
                        }
                    }


                    break;
                case "area":
                    document.querySelector('.col-header:first-child').classList.remove("hide");
                    break;
                default:
            }
        }

        var animatePage = function(pg){
            pg.classList.add("active-page");
        }

        var hidePage = function(pg){
            pg.className = "hide";
        }

        //Deal with history API and switching divs
        var doPageTransition = function( srcPageId, destPageId, isHistoryPush){

            if(srcPageId == null){

                pages[destPageId].classList.add("pt-page-current");
                loadDynamicContents(destPageId);
                setTimeout(animatePage, 30, pages[destPageId]);
                history.replaceState(null, null, "#"+destPageId);
            }else{

                pages[srcPageId].classList.add("pt-page-current");
                pages[destPageId].classList.add("pt-page-current");
                pages[srcPageId].classList.add("pt-page-flipOutLeft");
                pages[destPageId].classList.add("pt-page-flipInRight");

                loadDynamicContents(destPageId);

                setTimeout(function(){
                                    pages[srcPageId].classList.remove("pt-page-current");
                                    pages[srcPageId].classList.remove("pt-page-flipOutLeft");
                                    pages[destPageId].classList.remove("pt-page-flipInRight");
                                }, 1500); 

                if (isHistoryPush)
                    history.pushState(null, null, "#" + destPageId);

                currentPageId = destPageId;
            }

            setTimeout(function(){
                            window.scrollTo(0,0);
                        }, 10);
        }

        //Listener for the popstate event to handle the back button
        var handleBackButton = function (ev){
            ev.preventDefault();
            var destPageId = "contacts";
            var currentPageId = "area";
            //update the visible data page.
            doPageTransition(currentPageId, destPageId, false);
        }

        var getCurrerntId = function(){
            return currentId;
        }
    };

    var contactClass = function(){
        var numOfEntries=-1;
        var displays =
        [
//            {
//                displayName:"Taylor Hunter",
//                phoneNumbers:[{value:"342-765-8900"},{value:"613-788-9875"}]
//            },
//            {
//                displayName:"Sarah Lock",
//                phoneNumbers:[{value:"423-678-3425"},{value:"613-346-7676"}]
//
//            },
//            {
//                displayName:"Francine Smith",
//                phoneNumbers:[{value:"647-773-6945"},{value:"613-788-7683"}]
//
//            },
//            {
//                displayName:"Lindsey Baker",
//                phoneNumbers:[{value:"613-314-2442"},{value:"613-272-3047"}]
//            },
//            {
//                displayName:"Shawn McCurdy",
//                phoneNumbers:[{value:"647-897-9823"},{value:"613-909-1232"}]
//
//            },
//            {
//                displayName:"Stan Smith",
//                phoneNumbers:[{value:"757-123-4562"},{value:"613-346-7676"}]
//
//            },
//
//            {
//                displayName:"Magen Long",
//                phoneNumbers:[{value:"712-908-6543"},{value:"613-519-3476"}]
//            },
//            {
//                displayName:"kelly French",
//                phoneNumbers:[{value:"647-773-6945"},{value:"613-346-8909"}]
//
//            },
//            {
//                displayName:"britney Blair",
//                phoneNumbers:[{value:"567-908-2342},{value:"757-658-1234}]
//
//            },
//            {
//                displayName:"Sophia Blair",
//                phoneNumbers:[{value:"613-444-1278"},{value:"613-598-2452"}]
//            },
//            {
//                displayName:"Laim Johnson",
//                phoneNumbers:[{value:"647-678-7575},{value:"613-312-4532"}]
//
//            },
//            {
//                displayName:"Mason Peterson12",
//                phoneNumbers:[{value:"613-447-3721"},{value:"613-283-6597}]
//
//            }
        ];
        var load = function(){

            var options      = new ContactFindOptions();
            options.filter   = ""; // A string can be used as a search filter when querying the contacts database
            options.multiple = true; // return multiple results.

            var fields       = [navigator.contacts.fieldType.displayName,
                                navigator.contacts.fieldType.phoneNumbers]

            navigator.contacts.find(fields, onSuccess, onError, options);
        

        var onSuccess = function(contacts){
            console.log("Found "+ contacts.length+ " on the phone");
            entries = contacts;
            numOfEntries = contacts.length;
            siteNavigator.loadDynamicContents("contacts");
        }

        var onError = function(contacts){
            console.error("Error:"+ contacts.code);
            numOfEntries = -1;
            entries = [];
        }

        var getEntries = function(){
            return entries;
        }

        var DisplayName = function(index){
            var displayName = "";
            if(entries[index]){
                displayName = entries[index].displayName;
            }

            return displayName;
        }

        var PhoneNumbers = function(index){
            var phones=[];
            if(entries[index]){
                var array = entries[index].phoneNumbers;
                for (var i=0; array && i< array.length; i++){
                    phones.push(array[i].value);
                }
            }
            return phones;
        }
    }


    /* This is a bit map that represents a bit for every events that is needed to be fired before
    using locations/contacts services in the device.
    There is a bit for DOMContentLoaded event and another bit for deviceready event.
    Create a new instance for bit map with value zero which means no events have been recieved yet. */
    var readyBitMap = new bitMapClass(0);
    var position = new geoClass();
    var siteNavigator = new SiteNavigatorClass();
    var mapDriver = new mapDriverClass();
    var contacts = new contactClass();
    var storage = new storageClass();

 var init = function(){
        document.addEventListener("deviceready", onDeviceReady, false);
        document.addEventListener("DOMContentLoaded", onPageLoaded, false);
        window.addEventListener("resize", onWindowResize, true);

        //add the listener for the back button
        window.addEventListener("popstate", siteNavigator.handleBackButton, false);
    }

    var onDeviceReady = function(){
        console.log("Device is ready");
        readyBitMap.setBit(Device_Ready);
        onReady();
    }

    var onPageLoaded = function(){
        console.log("Page is loaded");
        readyBitMap.setBit(Page_Loaded);
        
        var svgIcons = new svgClass();
        svgIcons.load();
        onReady();
    }

    var onReady = function(){
        if(readyBitMap.isBitSet(Device_Ready) &&
            readyBitMap.isBitSet(Page_Loaded)){
            console.log("Both events have been fired");
            contacts.load();
            position.Requestig();
            siteNavigator.init();
        }else{
            console.log("Both evenets has not been fired yet");
        }

    var onWindowResize = function(){
        console.log("Window resize event has been fired");
    }
    }
}

//<!-- other code work---->
//var allData = new Object();
//var app = {
//        // Application Constructor
//        initialize: function () {
//            //this.bindEvents();
//            this.bindEvents();
//        },
//        // Bind Event Listeners
//        //
//        // Bind any events that are required on startup. Common events are:
//        // 'load', 'deviceready', 'offline', and 'online'.
//        bindEvents: function () {
//            document.addEventListener('deviceready', this.onDeviceReady, false);
//        },
//        // deviceready Event Handler
//        //
//        // The scope of 'this' is the event. In order to call the 'receivedEvent'
//        // function, we must explicitly call 'app.receivedEvent(...);'
//        onDeviceReady: function () {
//            app.receivedEvent('deviceready');
//        },
//        // Update DOM on a Received Event
//
//        receivedEvent: function () {
//
//            var options = new ContactFindOptions();
//            options.filter = ""; //leaving this empty will find return all contacts
//            options.multiple = true; //return multiple results
//            var filter = ["displayName"]; //an array of fields to compare against the options.filter 
//            navigator.contacts.find(filter, app.successFunc, app.errFunc, options);
//
//        },
//        successFunc: function (matches) {
//            console.log(matches);
//            var div = document.querySelector("#listcontacts");
//            var ul = document.createElement("ul");
//
//            data = {
//                'contactInfor': [],
//                'state': true
//            };
//            for (var i = 0; i < 12; i++) {
//                //var li1,li2,li3 = document.createElement("li");
//                // console.log(li);
//                //li1.innerHTML= matches[i].displayName;
//                //li2.innerHTML = matches[i].phoneNumber[0].value;
//                //li3.innerHTML = matches[i].phoneNumber[1].value;
//                //ul. appendChild(li);
//                data.contactInfor.push({
//                    'id': matches[i].id,
//                    'name': matches[i].displayName,
//                    'home': matches[i].phoneNumbers[0].value,
//                    'mobile': matches[i].phoneNumbers[1].value
//                });
//                localStorage.setItem('data', JSON.stringify(data));
//                allData = JSON.parse(localStorage.getItem('data'));
//
//                var li = document.createElement("li");
//                li.id = matches[i].id;
//                li.innerHTML = allData.contactInfor[i].name;
//                //   li.innerHTML += allData.contactInfor[i].home;
//                // li.innerHTML += allData.contactInfor[i].mobile;
//                ul.appendChild(li);
//                li.addEventListener("click", changePage,false);
//            }
//
//            div.appendChild(ul);
//
//        },
//
//        errFunc: function (err) {
//            console.log("Error Text: " + err);
//        },
//
//
//        getGeo: function () {
//            if (navigator.geolocation) {
//                //code goes here to find position
//                var params = {
//                    enableHighAccuracy: false,
//                    timeout: 60000,
//                    maximumAge: 60000
//                };
//                navigator.geolocation.getCurrentPosition(app.reportPosition, app.gpsError, params);
//
//                //to continually check the position (in case it changes) use
//                // navigator.geolocation.watchPosition( reportPosition, gpsError, params)
//            } else {
//                //browser does not support geolocation api
//                alert("Sorry, but your browser does not support location based awesomeness.")
//            }
//        },
//
//        reportPosition: function (position) {
//            console.log("got to reportPosition");
//            console.log(position.coords.latitude);
//            console.log(position.coords.longitude);
//            var locationHere = "http://maps.googleapis.com/maps/api/staticmap?sensor=false&center=" + position.coords.latitude + "," + position.coords.longitude + "&zoom=14&size=400x400&markers=color:red|label:Q|" + position.coords.latitude + "," + position.coords.longitude;
//            var canvas = document.createElement("canvas");
//            var context = canvas.getContext("2d");
//            canvas.width = 400;
//            canvas.height = 400;
//
//            var imageObj = new Image();
//            imageObj.src = locationHere;
//
//            imageObj.onload = function () {
//                context.drawImage(imageObj, 0, 0);
//                geo.innerHTML = "";
//                geo.appendChild(canvas);
//
//            }
//        },
//        gpsError: function (error) {
//            var errors = {
//                1: 'Permission denied',
//                2: 'Position unavailable',
//                3: 'Request timeout'
//            };
//            alert("Error: " + errors[error.code]);
//        },
//        //Listener for the popstate event to handle the back button
//        handleBackButton: function (ev) {
//            ev.preventDefault();
//            var destPageId = "contacts";
//            var currentPageId = "location";
//            //update the visible data page.
//            doPageTransition(currentPageId, destPageId, false);
//        },
//
//        Currerntid: function () {
//            return currentId;
//        }
//    };
//        
//    function changePage(ev){
//        var currentId = ev.currentTarget.id;
//        ev.getElementById('two').style.display = "block";
//        ev.getElementById('Three').style.display = "none";
//    }
//        app.initialize();