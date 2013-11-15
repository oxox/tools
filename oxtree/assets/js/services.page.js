angular.module('pageServices',['ngResource'])
    .factory('RepoPage',['$resource',function($resource){
        var url = 'http://log.oxox.io/api.php?xn=xdata&xk=page&act=:actId';
        return $resource(url, {actId:'@act'}, {
          query: {method:'GET', params:{actId:'query'}, isArray:false}
        });
    }]);