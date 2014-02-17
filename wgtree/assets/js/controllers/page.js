xdataApp.controller('PageCtrl',function($scope,fbXDataPages,RepoPage0,RepoPage1){

    $scope.pages = fbXDataPages;
    $scope.canSaveXlog = false;
    $scope.saveToXlog = function(){
        //copy the data from angularFireCollection
        var len = $scope.pages.length,
            pages0=[],
            tempPage1,
            tempPage2;
        for(var i=0;i<len;i++){
            tempPage1 = $scope.pages[i];
            tempPage2 = {};
            for(var c in tempPage1){
                if(c=='$id'){
                    tempPage2['$id']= tempPage1[c];
                    continue;
                };
                if(!c || c.indexOf('$')===0){
                    continue;
                };
                tempPage2[c]=tempPage1[c];
            };
            tempPage2.sn = tempPage2.sn||0;
            pages0.push(tempPage2);
        };
        $scope.canSaveXlog = false;
        //按SN排序
        pages0.sort(function(a,b){
            return (a.sn-b.sn);
        });
        //console.log(pages0);
        RepoPage1.update(pages0,function(err,msg){
            $scope.canSaveXlog = true;
            if(err){
                alert('Server Error!'+err);
                return;
            }
            if(msg.code==='0'){
                alert('保存失败！'+msg.info);
                return;
            }
            alert('数据已经保存至Xlog数据库!');
        });
    };
    $scope.initXLog = function(){
        RepoPage1.query(function(err,msg){
            if(err){
                console.log('Error initXLog [query]'+err);
                $scope.canSaveXlog = false;
                return;
            };
            var noRecords = msg.code=='0';
            if (noRecords){ 
                //初始化数据
                RepoPage1.add([],function(err1,msg1){
                    $scope.canSaveXlog = !err1;
                    if(err1){
                        console.log('Error initXLog [add]'+err1);
                        return;
                    }
                    console.log('Done initXLog [add]');
                });
                return;
            }
            $scope.canSaveXlog = true;
        });
    };
    $scope.initXLog();

    $scope.$watch('pages',function(){
        console.log('pages changed!',new Date().getTime());
    });

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