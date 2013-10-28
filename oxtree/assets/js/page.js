angular.module('page', ['pageServices']).
  config(function($routeProvider) {
    $routeProvider.
      when('/', {controller:ListCtrl, templateUrl:'list.html'}).
      when('/edit/:pageId', {controller:EditCtrl, templateUrl:'detail.html'}).
      when('/new', {controller:CreateCtrl, templateUrl:'detail.html'}).
      otherwise({redirectTo:'/'});
  });
 
function ListCtrl($scope, $http,RepoPage) {
  $scope.pages = RepoPage.query();
}
 
function CreateCtrl($scope, $location, $timeout, Projects) {
  $scope.save = function() {
    Projects.add($scope.project, function() {
      $timeout(function() { $location.path('/'); });
    });
  }
}
 
function EditCtrl($scope, $location, $routeParams,RepoPage) {
  $scope.page = RepoPage.get($routeParams,function(page){
    $scope.page0 = angular.copy(page);
  });

  $scope.isClean = function() {
    return angular.equals($scope.page0, $scope.page);
  };

  $scope.destroy = function() {
    $scope.page0 = null;
    $location.path('/');
  };

  $scope.save = function() {
    console.log($scope);
    $scope.page.$save(function(res){
      //ok callback
    },function(res){
      //error callback
      console.log('res',res);
      console.log('arguments',arguments);
    });
  };

  /*
  angularFire(fbURL + $routeParams.projectId, $scope, 'remote', {}).
  then(function() {
    $scope.project = angular.copy($scope.remote);
    $scope.project.$id = $routeParams.projectId;
    $scope.isClean = function() {
      return angular.equals($scope.remote, $scope.project);
    }
    $scope.destroy = function() {
      $scope.remote = null;
      $location.path('/');
    };
    $scope.save = function() {
      $scope.remote = angular.copy($scope.project);
      $location.path('/');
    };
  });
  */
}