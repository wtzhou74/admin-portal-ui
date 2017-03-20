/**
 * Created by ZHOU WENTAO on 3/19/2017.
 * deal with the issue that AngularJS sanitizes any html string during its interpolation.
 * Mark the HTML as safe in $sce before injecting. Then also use ngBindHtml to output the html.
 */
(function () {
        'use strict';

        angular.module("app").filter("htmlSafe", ['$sce', function($sce) {
            return function(htmlCode){
                return $sce.trustAsHtml(htmlCode);
            };
        }]);
    }

)();
