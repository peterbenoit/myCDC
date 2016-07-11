/**
 *
 */
angular.module('mycdc.services', ['ionic'])

.factory('DeviceInfo', function() {
    var ua = navigator.userAgent;
    //Mozilla/5.0 (Linux; Android 4.4.2; SM-T310 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Safari/537.36
    //Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LVY48H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36

    if (ua.indexOf('Android') > -1 && ua.indexOf('Mobile') === -1) {
        ionic.Platform.setPlatform('androidtablet');
    }

    return {
        'deviceInformation': ionic.Platform.device(),
        'isWebView': ionic.Platform.isWebView(),
        'isIPad': ionic.Platform.isIPad(),
        'isIOS': ionic.Platform.isIOS(),
        'isAndroid': ionic.Platform.isAndroid(),
        'isAndroidTablet': ionic.Platform.platform() === 'androidtablet', //ionic.Platform.is('androidtablet')
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
})

.factory('iFrameReady', ['$rootScope', function ($rootScope) {

    return function () {

        var iframe = $('#contentframe');
            anchors = iframe.contents().find('#contentArea a'); // only anchors in the content area

        //iframe.contentWindow ? iframe.contentWindow.document : iframe.contentDocument

        $rootScope.$broadcast('source-detail-load-complete');

        // I RECENTLY COMMENTED THIS OUT AS IT WAS BREAKING THE APP (NOT JUST IFRAME CONTENT)
        if (window.device) {
            body = iframe.contents().find('body');
            $(body).unbind("scroll");
            //$(body).unbind("click");
        }

        /*if (body.length) {
        body.append('<style>header, footer, #socialMediaShareContainer { display:none !important; }</style>')
        }*/

        // Capture any anchors clicked in the iframe document
        anchors.on('click', function(e) {
            e.preventDefault();

            alert('CLICK');

            var framesrc = iframe.attr('src'),
                  href = $(this).attr('href'),
                  anchor = document.createElement('a'),
                  anchorhost,
                  frameanchor,
                  framehost,
                  frameprotocol;

            anchor.href = href;
            anchorhost = anchor.hostname;
            // create an anchor with the href set to the iframe src to fetch the domain & protocol
            // WARN: cannot assume "http" || "www.cdc.gov"
            frameanchor = document.createElement('a');
            frameanchor.href = framesrc;
            framehost = frameanchor.hostname
            frameprotocol = frameanchor.protocol;

            // if this anchor doesn't have a hostname
            if (anchorhost === '') {
                href = frameprotocol + '//' + framehost + href;
            }

            window.open(href, '_system');
        });
    };
}])

.service('returnToState', function($ionicHistory) {
    return function(stateName) {
        var historyId = $ionicHistory.currentHistoryId(),
            history = $ionicHistory.viewHistory().histories[historyId];

        for (var i = history.stack.length - 1; i >= 0; i--) {
            if (history.stack[i].stateName == stateName) {
                $ionicHistory.backView(history.stack[i]);
                $ionicHistory.goBack();
            }
        }
    }
})

.service('goBackMany', function($ionicHistory) {
    return function(depth) {
        var historyId = $ionicHistory.currentHistoryId(),
            history = $ionicHistory.viewHistory().histories[historyId],
            targetViewIndex = history.stack.length - 1 - depth;             // set the view 'depth' back in the stack as the back view

        $ionicHistory.backView(history.stack[targetViewIndex]);
        // navigate to it
        $ionicHistory.goBack();
    }
});
