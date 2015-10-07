/**
 *
 */
angular.module('mycdc.services', ['ionic'])

.factory('DeviceInfo', function() {
    return {
        'deviceInformation': ionic.Platform.device(),
        'isWebView': ionic.Platform.isWebView(),
        'isIPad': ionic.Platform.isIPad(),
        'isIOS': ionic.Platform.isIOS(),
        'isAndroid': ionic.Platform.isAndroid(),
        'isWindowsPhone': ionic.Platform.isWindowsPhone(),
        'currentPlatform': ionic.Platform.platform(),
        'currentPlatformVersion': ionic.Platform.version()
    };
})

.factory('Orientation', function() {
    var mq,
        retval = 'landscape';

    if (window.matchMedia) {
        mq = window.matchMedia('(orientation: portrait)');

        return mq.matches ? 'portrait' : 'landscape';
    }

    return undefined;
})

.factory('ScreenSize', function() {
    return {
        'width': window.innerWidth,
        'height': window.innerHeight
    };
})

.factory('FindAllURLsInText', function() {
    return function(text) {
        if (!text) return undefined;

        var source = (text || '').toString(),
            urlArray = [],
            matchArray,
            regexToken;

        // Regular expression to find FTP, HTTP(S) and email URLs.
        regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;

        // Iterate through any URLs in the text.
        while ((matchArray = regexToken.exec(source)) !== null) {
            var token = matchArray[0];
            urlArray.push(token);
        }

        return urlArray;
    }
});
