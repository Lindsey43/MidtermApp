# MidtermApp

###Instructions To do

This Android App project tests your ability to use the Cordova Contacts api, Touch events, and the Google Maps Javascript API.

The app will have two screens: a contact list; a dynamic map. After both the DOMContentLoaded and deviceready events have fired, your app should read all the contacts from the device / emulator AND fetch the user's current gps position.

On the contact list (home) page read the list of contacts and display all the contacts (up to a max of 12) as a list view. Each item in the list will display the contact's full name. Add all the contacts that you are displaying to localStorage. Use the JSON object to parse( ) and stringify( ) the data as you are adding and removing from localStorage. In localStorage you will save the contact's full name, all their phone numbers, plus their latitudinal and longitudinal position. When you first bring them into the app they will not have a latitude or longitude. You may add an optional id for each contact, if you like.

On the dynamic map page you need to add a map that fits properly into the calculated size of the screen with a decent margin around the outside of the map. The map can be added after both DOMContentLoaded and deviceready events fire.

A single tap on the contact will display some type of dialog box (modal window eg: http://codepen.io/mad-d/pen/Pwdbgq (Links to an external site.) ) that will display the contact's name as well as all phone numbers for that contact.

A double tap on the contact in the listview will transition to the dynamic map screen. Using the fetched current gps position as the center of the map clear any markers that are currently on the map.

Check the localStorage data to see if the selected user has a latitude and longitude. If they do, add an animated marker to the map. If they do NOT have a stored latitude or longitude then display a dialog box that tells the app user to double tap anywhere on the map to set a position for that contact.

Using the Google Maps API capture the latitude and longitude when the app user double taps. Add an animated marker to the map at that position and save the latitude and longitude to the localStorage data for the selected contact. The next time the app user views this contact their position will automatically be added by your script.

To navigate back to the listview of contacts you should have a back button in the header of your pages. Listen for a tap event on the back button and ALSO listen for the popstate event that happens when the user clicks the hardware back button. (reference - https://algonquin.instructure.com/courses/340160/pages/history-api-pushstate-replacestate-and-popstate?module_item_id=6376505 ).

Use the hammer.js library to handle the single and double tap events on the list view.

Do NOT use jQuery.

If you want to use a small library from http://microjs.com/ (Links to an external site.) you may.
