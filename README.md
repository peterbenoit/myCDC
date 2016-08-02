#Installation Steps


##Install homebrew
`homebrew: ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

##Install Node:

`brew install node`

`brew update`

##Install Node Plugins
`npm install -g grunt-cli`

`npm install -g cordova`

`npm install -g ionic`

`xcode-select --install`

`npm install -g ios-deploy`

###Install Bower

`npm install -g bower`

`bower install ngCordova`

#Cordova Plugins

These will likely change as the app matures.

Here are some currently being used:

`cordova plugin add ionic-plugin-keyboard`
`cordova plugin add cordova-plugin-inappbrowser`
`cordova plugin add cordova-plugin-network-information`
`cordova plugin add https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin.git`
`cordova plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git`
`cordova plugin add https://github.com/Pushwoosh/pushwoosh-phonegap-3.0-plugin.git`
`ionic plugin add https://github.com/apache/cordova-plugin-whitelist.git`

	$ cordova plugins ls
	com.pushwoosh.plugins.pushwoosh 3.6.11 "Pushwoosh"
	cordova-plugin-console 1.0.1 "Console"
	cordova-plugin-device 1.0.1 "Device"
	cordova-plugin-inappbrowser 1.0.1 "InAppBrowser"
	cordova-plugin-network-information 1.0.1 "Network Information"
	cordova-plugin-screen-orientation 1.4.0 "Screen Orientation"
	cordova-plugin-splashscreen 2.1.0 "Splashscreen"
	cordova-plugin-statusbar 1.0.1 "StatusBar"
	cordova-plugin-whitelist 1.1.1-dev "Whitelist"
	cordova-plugin-x-socialsharing 5.0.4 "SocialSharing"
	cordova-plugin-x-toast 2.2.1 "Toast"
	ionic-plugin-keyboard 1.0.7 "Keyboard"

##Ionic View & Plugins
Ionic View only supports a small subset of plugins, so not all functions/features will work in it. You will need to test for the existance of the plugin before using it.

	if (window.plugins && window.plugins.socialsharing) {
		// code to use socialsharing plugin here
	}

[Ionic View usage](#http://docs.ionic.io/docs/view-usage)

#Platforms

Current adding Android, iOS, Windows (not WP8) and Browser.

`cordova platform add android`

`cordova platform add ios`

`cordova platform add windows`

`cordova platform add browser`
	
	
#Issues

####Issue:
`xcode-select: error: tool 'xcodebuild' requires Xcode, but active developer directory '/Library/Developer/CommandLineTools' is a command line tools instance`

This problem happens when xcode-select developer directory was pointing to `/Library/Developer/CommandLineTools`, when a full regular XCode was required (happens when CLT are installed after XCode)

####Solution:

[Install Xcode](https://developer.apple.com/xcode/) if you don't have it yet,
Point xcode-select to the Xcode Developer directory using the following command:

`sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`

Note: Make sure your Xcode app directory is the same as in the address above; most notably, it'll be probably `/Applications/Xcode-Beta.app/Contents/Developeror /Applications/Xcode-beta.app/Contents/Developer` if you installed beta XCode release instead.

####Issue:
`Failed to load resource: The resource could not be loaded because the App Transport Security policy requires the use of a secure connection`

####Solution:
[Stack Overflow](http://stackoverflow.com/questions/30731785/how-do-i-load-an-http-url-with-app-transport-security-enabled-in-ios-9/30732693#30732693) article.

####Issue
	ERROR: Error: Failed to find 'ANDROID_HOME' environment variable. Try setting setting it manually.
	Failed to find 'android' command in your 'PATH'. Try update your 'PATH' to include path to valid SDK directory.
	
####Solution:
Probably related to missing Android Studio installation.

1. Install [JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html)
2. Install [Android Studio](http://developer.android.com/sdk/installing/index.html?pkg=studio)
3. Install Android Targets

Open the SDK manager by running: /Users/peterbenoit/Library/Android/sdk/tools/android
You will require:

1. "SDK Platform" for android-22
2. "Android SDK Platform-tools (latest)
3. "Android SDK Build-tools" (latest)
