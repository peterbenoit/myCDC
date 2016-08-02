#APP Source Configuration

While the structure and behavior of the CDC App does not change, the content can. The `config.json` file is used as a way to manage sources used within the app.

Here is an example:
            
            "id": 17,
            "contentid": 1,
            "title": "Travel Notices",
            "contenttype": "News",
            "appurl": "#/app/travelnotices",
            "contentsource": "sourceUrl",
            "icon": "",
            "enabled": true,
            "checked": true,
            "readonly": false,
            "hasimage": false,
            "backToSource": false,
            "cardtypes": [
                {"phone": ["a1","b1"]},
                {"tablet": ["b1"]}
            ],
            "contentrules": ""
            
            

Setting  | Value
------------- | -------------
Title  | Title used in the application for the source
ContentType  | The type of content (Article, News, Journal, etc...)
appurl | How the app navigates to the source
ContentSource | sourceUrl, syndicateUrl, or directly from the Feed
icon | Icon used to identify sources
enabled | Is the source something users can access?
checked | Is the source selected by default?
readonly | Is the source selected by default and unselectable?
hasImage | Does the source provide an image to display in the source stream?
cardTypes | Which cards can be used for display, per device type
contentRules | The CSS rules are applied to this content source