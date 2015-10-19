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

###Install Bower

`npm install -g bower`

`bower install ngCordova`

#Cordova Plugins

`cordova plugin add cordova-plugin-inappbrowser`
`cordova plugin add cordova-plugin-network-information`
`cordova plugin add https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin.git`
`cordova plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git`
`cordova plugin add https://github.com/Pushwoosh/pushwoosh-phonegap-3.0-plugin.git`

##Ionic View & Plugins
Ionic View only supports a small subset of plugins, so not all functions/features will work in it. You will need to test for the existance of the plugin before using it.

	if (window.plugins && window.plugins.socialsharing) {
		// code to use socialsharing plugin here
	}

[Ionic View usage](#http://docs.ionic.io/docs/view-usage)