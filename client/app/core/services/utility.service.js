﻿(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('utilityService', utilityService);

    /* @ngInject */
    function utilityService($location, $anchorScroll, $window, envService, constants) {
        var showHealthInformationMenu = false;
        var service = {};

        service.getYear = getYear;
        service.redirectTo = redirectTo;
        service.isUnDefinedOrNull = isUnDefinedOrNull;
        service.isDefinedAndNotNull = isDefinedAndNotNull;
        service.setShowHealthInformationMenu = setShowHealthInformationMenu;
        service.getShowHealthInformationMenu = getShowHealthInformationMenu;
        service.scrollTo = goTo;
        service.hasString = hasString;
        service.startsWith = startsWith;
        service.endsWith = endsWith;
        service.randomAlphanumeric = randomAlphanumeric;
        service.isNotEmpty = isNotEmpty;
        service.formatZipCode = formatZipCode;
        service.formatDate = formatDate;
        service.isIndividualProvider = isIndividualProvider;
        service.isOrganizationProvider = isOrganizationProvider;
        service.getProviderByNPI = getProviderByNPI;
        service.getProviderByNpis = getProviderByNpis;
        service.getIndividualProvidersNpi = getIndividualProvidersNpi;
        service.getOrganizationalProvidersNpi = getOrganizationalProvidersNpi;
        service.downloadFile = downloadFile;
        service.isValidDate = isValidDate;
        service.isSecuredApi = isSecuredApi;
        service.digitFormat = digitFormat;
        service.isValidDate = isValidDate;


        return service;

        function getYear() {
            return (new Date()).getFullYear();
        }

        function redirectTo(path) {
            $location.path(path);
        }

        function isUnDefinedOrNull(value) {
            return (angular.isUndefined(value) || value === null );
        }

        function isDefinedAndNotNull(value) {
            return (value !== null && angular.isDefined(value) );
        }

        function setShowHealthInformationMenu(show) {
            showHealthInformationMenu = show;
        }

        function getShowHealthInformationMenu() {
            return showHealthInformationMenu;
        }

        function goTo(position) {
            $location.hash(position);
            $anchorScroll();
        }

        function hasString(str) {
            return angular.isDefined(str) && angular.isString(str) && str.length > 0 ? str : undefined;
        }

        function startsWith(str, prefix) {
            return angular.isString(str) && angular.isString(prefix) &&
                str.substring(0, prefix.length) === prefix;
        }

        function endsWith(str, suffix) {
            return angular.isString(str) && angular.isString(suffix) &&
                str.substring(str.length - suffix.length, str.length) === suffix;
        }

        function randomAlphanumeric(len, charSet) {
            charSet = charSet || constants.alphanumericConstant;
            var randomString = '';
            for (var i = 0; i < len; i++) {
                var randomPoz = Math.floor(Math.random() * charSet.length);
                randomString += charSet.substring(randomPoz, randomPoz + 1);
            }
            return randomString;
        }

        function isNotEmpty(arr) {
            return angular.isDefined(arr) && angular.isArray(arr) && arr.length > 0;
        }

        function formatZipCode(zipCode) {
            var formattedZipCode = parseInt(zipCode).toString();
            if (formattedZipCode.toString().length > 5) {
                formattedZipCode = formattedZipCode.slice(0, 5) + "-" + formattedZipCode.slice(5);
            }
            return formattedZipCode;
        }

        function formatDate(dateObj) {
            var today = new Date(dateObj);
            var day = today.getDate();
            var month = today.getMonth() + 1;
            var year = today.getFullYear();
            if (day < 10) {
                day = "0" + day;
            }
            if (month < 10) {
                month = "0" + month;
            }
            var formatedDate = month + "/" + day + "/" + year;

            return formatedDate;
        }

        function isIndividualProvider(provider) {
            return angular.isDefined(provider) && angular.equals(provider.entityType, 'Individual');
        }

        function isOrganizationProvider(provider) {
            return angular.isDefined(provider) && angular.equals(provider.entityType, 'Organization');
        }

        function getProviderByNPI(providerList, npi) {
            if (angular.isDefined(providerList)) {
                for (var i = 0; i < providerList.length; i++) {
                    if (providerList[i].npi === npi) {
                        return providerList[i];
                    }
                }
            }
            return {};
        }

        function findProviderByNpi(providers, npi) {
            for (var i = 0; i < providers.length; i++) {
                if (providers[i].npi === npi) {
                    return providers[i];
                }
            }
        }

        function getProviderByNpis(providers, listOfNpi1, listOfNpi2) {
            var result = [];
            var listOfNpi = listOfNpi1.concat(listOfNpi2);

            if (angular.isDefined(providers)) {
                for (var i = 0; i < listOfNpi.length; i++) {
                    var provider = findProviderByNpi(providers, listOfNpi[i]);
                    if (provider.npi) {
                        result.push(provider);
                    }
                }
            }
            return result;
        }

        function getIndividualProvidersNpi(providers) {
            var result = [];
            for (var i = 0; i < providers.length; i++) {
                if (isIndividualProvider(providers[i])) {
                    result.push(providers[i].npi);
                }
            }
            return result;
        }

        function getOrganizationalProvidersNpi(providers) {
            var result = [];
            for (var i = 0; i < providers.length; i++) {
                if (isOrganizationProvider(providers[i])) {
                    result.push(providers[i].npi);
                }
            }
            return result;
        }

        function downloadFile(content, filename, fileFormat) {
            var file = new Blob([content], {
                type: fileFormat
            });
            var blobURL = ($window.URL || $window.webkitURL).createObjectURL(file);
            var anchor = document.createElement("a");
            anchor.download = filename;
            anchor.href = blobURL;
            anchor.click();
        }

        // Expect input as m/d/y
        function isValidDate(dateStr) {
            // Checks for the following valid date formats:
            // MM/DD/YYYY
            // Also separates date into month, day, and year variables
            var datePat = /^(\d{2,2})(\/)(\d{2,2})\2(\d{4}|\d{4})$/;

            var matchArray = dateStr.match(datePat); // is the format ok?
            if (matchArray === null) {
                return false;
            }

            var month = matchArray[1]; // parse date into variables
            var day = matchArray[3];
            var year = matchArray[4];
            if (month < 1 || month > 12) { // check month range
                return false;
            }
            if (day < 1 || day > 31) {
                return false;
            }
            if ((month === 4 || month === 6 || month === 9 || month === 11) && day === 31) {
                return false;
            }
            if (month === 2) { // check for february 29th
                var isleap = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
                if (day > 29 || (day === 29 && !isleap)) {
                    return false;
                }
            }
            return true;  // date is valid
        }

        function digitFormat(number, digitLength) {
            var output = number + '';
            while (output.length < digitLength) {
                output = '0' + output;
            }
            return output;
        }

        function isSecuredApi(url) {
            var isSecured = false;
            angular.forEach(envService.securedApis, function (value) {
                if (startsWith(url.toLowerCase(), value.toLowerCase())) {
                    isSecured = true;
                }
            });
            return isSecured;
        }


    }
})();
