var xdataApp = angular.module('wgdataApp', ['ngRoute','firebase','wgdataServices']).
    value('fbURL','https://oxox.firebaseio.com/wgdata/').
    factory('fbXDataPages',function(angularFireCollection,fbURL){
        return angularFireCollection(new Firebase(fbURL+'pages'));
    }).
    factory('fbXDataPage',function(angularFire,fbURL){
        return function(id,$scope){
            return angularFire(new Firebase(fbURL+'pages/'+id),$scope,'page0',{});
        };
    }).
    config(function($routeProvider) {
        $routeProvider.
            when('/', {controller:'PageCtrl', templateUrl:'list.html'}).
            when('/edit/:pageId', {controller:'PageEditCtrl', templateUrl:'detail.html'}).
            when('/new', {controller:'PageCreateCtrl', templateUrl:'detail.html'}).
            otherwise({redirectTo:'/'});
    });