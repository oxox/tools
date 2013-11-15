xdataApp.controller('PageCtrl',function($scope,fbXDataPages,RepoPage){

    $scope.pages = fbXDataPages;

}).controller('PageCreateCtrl',function($scope,$location,$timeout,fbXDataPages){
    $scope.save = function() {
        fbXDataPages.add($scope.page, function() {
            $timeout(function() { $location.path('/'); });
        });
    }
}).controller('PageEditCtrl',function($scope,$location,$routeParams,fbXDataPage){
    fbXDataPage($routeParams.pageId,$scope)
        .then(function(){
            $scope.page = angular.copy($scope.page0);
            $scope.page.$id=$routeParams.pageId;
            $scope.isClean = function(){
                return angular.equals($scope.page0, $scope.page);
            };
            $scope.destroy = function(){
                $scope.page0 = null;
                $location.path('/');
            };
            $scope.save = function(){
                $scope.page0 = angular.copy($scope.page);
                $location.path('/');
            };
        });
});