angular.module('pageServices',['ngResource'])
    .factory('Page',['$resource',function($resource){
        return $resource('assets/js/data.pages.:pageId.json', {}, {
          query: {method:'GET', params:{pageId:'all'}, isArray:true}
        });
    }]);