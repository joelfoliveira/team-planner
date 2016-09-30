
// Initialize Firebase
var config = {
    apiKey: appSettings.firebaseApiKey,
    authDomain: appSettings.firebaseAuthDomain,
    databaseURL: appSettings.firebaseDatabaseURL,
    storageBucket: appSettings.firebaseStorageBucket,
};

firebase.initializeApp(config);

// Setup Angular
var teamPlayerApp = angular.module('teamPlayerApp', ['ngRoute']);

teamPlayerApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/players', {
                templateUrl: 'views/players.html',
                controller: 'PlayerListController',
                resolve: { "isAdmin": function() { return false; } }
            }).
            when('/god-mode', {
                templateUrl: 'views/players.html',
                controller: 'PlayerListController',
                resolve: { "isAdmin": function() { return true; } }
            }).
            otherwise({
                redirectTo: '/players'
            });
    }
]);