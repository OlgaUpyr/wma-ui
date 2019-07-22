'use strict';

var app = angular.module('wma', ['ngIdle', 'ngRoute', 'ngStorage', 'ngMaterial', 'ngAnimate', 'ngAria',
    'ngResource', 'ngSanitize', 'ngMessages', 'ngTagsInput', 'ui.bootstrap', 'treasure-overlay-spinner', 'autoCompleteModule']
).run(function ($rootScope) {
});

app.factory('httpRequestInterceptor', ['$q', '$location', '$sessionStorage',
    function ($q, $location, $sessionStorage) {
        return {
            responseError: function (rejection) {
                switch (rejection.status) {
                    case 403:
                        $location.path('/');
                        break;
                    case 401:
                        $sessionStorage.$reset();
                        localStorage.clear();
                        $location.path('/');
                        $location.reload();
                        break;
                    default:
                }

                return $q.reject(rejection);
            }
        };
    }]);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            disableCache: true,
            templateUrl: 'views/signInPage.html'
        })
        .when('/competitions', {
            disableCache: true,
            templateUrl: 'views/competitionsListPage.html'
        })
        .when('/competition/setup/step1', {
            disableCache: true,
            templateUrl: 'views/competitionSetupStep1.html'
        })
        .when('/competition/:competition', {
            disableCache: true,
            templateUrl: 'views/competitionMainPage.html'
        })
        .when('/teams', {
            disableCache: true,
            templateUrl: 'views/teamsListPage.html'
        })
        .when('/sportsmen', {
            disableCache: true,
            templateUrl: 'views/sportsmenListPage.html'
        })
        .when('/results/:competition', {
            disableCache: true,
            templateUrl: 'views/resultsPage.html'
        })
        .when('/typesOfSport', {
            disableCache: true,
            templateUrl: 'views/sportsPage.html'
        })
        .when('/wmaFactors', {
            disableCache: true,
            templateUrl: 'views/wmaParametersListPage.html'
        });
});