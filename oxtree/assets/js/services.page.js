angular.module('pageServices',['ngResource'])
    .factory('RepoPage',['$resource',function($resource){
        return $resource('assets/js/data.pages.:pageId.json', {pageId:'@id'}, {
          query: {method:'GET', params:{pageId:'all'}, isArray:true}
        });
    }]);