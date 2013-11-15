angular.module('xdataServices',['ngResource'])
    .value('xlogURL','http://log.oxox.io/api.php?xn=xdata&xk=:xk&act=:actId')
    .factory('RepoPage',['$resource',function($resource,xlogURL){
        return $resource(xlogURL, {actId:'@act',xk:'page'}, {
          query: {method:'GET', params:{actId:'query'}, isArray:false}
        });
    }]);