# CDC Mobile App


Hybrid app written for iOS, Android and Windows Phone, using the [Ionic Framework](https://github.com/driftyco/ionic), and [Angular JS](https://github.com/angular/angular.js).

Much of the code in the app is very literal, very verbose, and purposefully so.

###/www/templates

I've duplicated stream views all over just to be clear on what each has and does. Many of these are duplicative, and *should* be removed when these views are addressed.

####home-
Templates which begin with home- are designated as home stream templates for the device. For instance, home-ipad.html is the home stream template for iPads.

####stream-
Similiar to, or in many cases exactly the same as the home stream templates, each of these templates are defined per device.
