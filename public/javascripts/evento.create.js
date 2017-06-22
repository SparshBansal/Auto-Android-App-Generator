$(document).ready(function () {

    var appObject = {};
    appObject.eventType = "birthday";
    appObject.properties = {};

    // set sensible defaults;
    appObject.properties.theme = {
        "colorPrimary": "",
        "colorPrimaryDark": "",
        "colorAccent": ""
    };

    // navigation defaults
    appObject.properties.navigation = {
        "type": "sliding_tabs"
    };


    appObject.properties.pages = {
        page1: {
            backgroundTexture: "birthday_texture.png",
            cardType: "card_default"
        },
        page2: {
            inviteButton: "true",
            listItemType: "list_item_default"
        },
        page3: {
            layout: "info_page_layout_default",
            info: {
                host: "hostname",
                venue: {
                    name: "venue_name",
                    map_location: {
                        name: "map_location_name",
                        latitude: "latitude",
                        longitude: "logitude"
                    }
                },
                description: {
                    short: "This is birthday party",
                    long: "Today we celebrate the auspicious occasion of the the brithday...."
                }
            }
        }
    };


    // now alter properties based on user selections

});

