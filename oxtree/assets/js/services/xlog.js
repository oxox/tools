angular.module('xdataServices',['ngResource'])
    .constant('URL',{
        url0:'http://log.oxox.io/api.php',
        url1:'http://log.oxox.io/api.php?xn=xdata&xk=:xk&act=:actId'
    })
    .factory('RepoPage0',['$resource','URL',function($resource,URL){
        return $resource(URL.url1, {actId:'@act',xk:'pages'}, {
            query: {method:'GET', params:{actId:'query'}, isArray:false}
        });
    }])
    .factory('RepoPage1',['$http','URL',function($http,URL){
        var actions = {
                'request':function(_params,cbk,postData){
                    _params = angular.extend({
                        "xn":"xdata",
                        "xk":"pages"
                    },_params||{});
                    return $http({
                        url:URL.url0,
                        params:_params,
                        data:JSON.stringify(postData),
                        method:postData?'POST':'GET'
                    }).success(function(data, status, headers, config){
                        cbk(null,data, status, headers, config);
                    }).error(function(data, status, headers, config){
                        cbk(status+'',data, status, headers, config);
                    });
                },
                'update':function(data,cbk){
                    return this.request({act:'update'},cbk,data);
                },
                'add':function(data,cbk){
                    return this.request({act:'add'},cbk,data);
                },
                'query':function(cbk){
                    return this.request({act:'query'},cbk);
                }
            };
        return actions;
    }]);