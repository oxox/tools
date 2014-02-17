J(function($,p,pub){
    pub.id="repoMods";
    p.provider = {
        isAuthenticated:false,
        url:'http://log.oxox.io/api.php',
        rock:function(_params,cbk,postData){
            _params = $.extend({
                "xn":"wgdata",
                "xk":"mods_"+J.util.getPageId()
            },_params||{});
            var url = this.url+'?'+$.param(_params,true);
            var xhr = $.ajax({
                url:url,
                dataType:'json',
                data:JSON.stringify(postData),
                type:postData?'POST':'GET'
            });
            xhr.done(function(d,txtStatus,jqXhr){
                cbk(null,d);
            }).fail(function(jqXhr,txtStatus,err){
                cbk(err+txtStatus);
            });
        },
        initData:function(){
            this.rock({
                act:'add'
            },function(err,msg){
                if(err){
                    J.util.$win.trigger(pub.EVT.initError,[err]);
                    return;
                }
                if(msg.code=='0'){
                    J.util.$win.trigger(pub.EVT.initError,[msg.info]);
                    return;
                }
                p.provider.setData(pub.dummyData);
                J.util.$win.trigger(pub.EVT.inited,[pub.dummyData,true]);
            },pub.dummyData);
        },
        update:function(data,cbk){
            J.util.$win.trigger(pub.EVT.updating);
            this.rock({
                act:'update'
            },function(err,msg){
                cbk(err,msg);
                if(err){
                    J.util.$win.trigger(pub.EVT.updateError,[err]);
                    return;
                }
                if(msg.code=='0'){
                    J.util.$win.trigger(pub.EVT.updateError,[msg.info]);
                    return;
                }
                J.util.$win.trigger(pub.EVT.updated);
            },data);
            //备份至localstorage
            var k = 'wgdata_mods_'+J.util.getPageId();
            localStorage[k] = JSON.stringify(data);
        },
        setData:function(data){
            this.data = data;
            this.dataStr = JSON.stringify(data);
            //备份至localstorage
            var k = 'wgdata_mods_'+J.util.getPageId();
            localStorage[k] = this.dataStr;
        },
        getData:function(fromDataStr){
            if (fromDataStr) {
                return JSON.parse(this.dataStr);
            };
            return this.data;
        },
        _getItemById:function(items,id,cbk){
            var len = items.length,
                item = null,
                found=false;
            for(var i = 0 ;i<len;i++){
                item = items[i];
                if(item.id==id){
                    found = true;
                    cbk&&cbk(i,items);
                    break;
                };
                if (!item.babies) {
                    continue;
                };
                item = this._getItemById(item.babies,id,cbk);
                if(!item){
                    continue;
                };
                found=true;
                break;
            };
            return (found?item:null);
        },
        _init:function(){
            J.util.$win.bind(J.repoPages.EVT.inited,function(e,d){
                p.provider.isAuthenticated=true;
                p.provider.bootup();
            });
        },
        bootup:function(){
            J.util.$win.trigger(pub.EVT.init);
            this.rock({
                act:'query'
            },function(err,msg){
                if(err){
                    J.util.$win.trigger(pub.EVT.initError,[err]);
                    return;
                }
                var noRecords = msg.code=='0';
            
                if (noRecords){
                    //初始化数据
                    p.provider.initData();
                    return;
                }

                if(msg.code!=='1'){
                    J.util.$win.trigger(pub.EVT.initError,[msg.info]);
                    return;
                }

                //初始化树形菜单
                p.provider.setData(msg.info.xv);
                J.util.$win.trigger(pub.EVT.inited,[msg.info.xv]);
            });
        }
    };
    
    pub.getItemById = function(id){
        return p.provider._getItemById(p.provider.data,id);
    };
    pub.deleteItemById = function(id,cbk){
        p.provider._getItemById(p.provider.data,id,function(idx,subs){
            subs.splice(idx,1);
            //存数据库
            p.provider.update(p.provider.data,cbk);
        });
    };
    pub.updateItem = function(item,cbk){
        var _repo = p.provider;
        _repo._getItemById(_repo.data,item.id,function(idx,subs){
            subs[idx] = $.extend(subs[idx],item);
            //存数据库
            _repo.update(_repo.data,cbk);
        });
    };
    
    pub.addItem = function(selectedItem,newItem,pos,cbk){
        var _repo = p.provider;
        if(!selectedItem){
            if(pos=='last'){
                //last
                _repo.data.push(newItem);
            }else{
                //first
                _repo.data.splice(0,0,newItem);
            };
            _repo.update(_repo.data,cbk);
            console.log(_repo.data);
            return;
        };
        //用户选择了某个节点
        _repo._getItemById(_repo.data,selectedItem.id,function(idx,subs){
            switch(pos){
                case "before":
                    subs.splice(idx,0,newItem);
                    break;
                case "after":
                    subs.splice(idx+1,0,newItem);
                    break;
                default:
                    subs[idx].babies = subs[idx].babies||[];
                    subs[idx].babies.push(newItem);
                    break;
            };
            //存数据库
            _repo.update(_repo.data,cbk);
            console.log(_repo.data);
        });
    };
    
    pub.EVT = {
        init:'onModInitializing.repo',
        initError:'onModInitError.repo',
        inited:'onModInited.repo',
        updating:'onModUpdating.repo',
        updateError:'onModUpdateError.repo',
        updated:'onModUpdated.repo'
    };
    pub.dummyData = [];

    pub.initDataFromOldDB = function(){
        
        if(!J.auth.checkIdAdmin()){
            alert('无权限！');
            return;
        };
        
        var map = {

        };
        var tempData = null;
        for(var c in map){
            tempData = JSON.parse(localStorage['wgdata_mods_'+map[c]]||'[]');
            console.log(c,tempData);
            p.provider.rock({
                xk:'mods_'+c,
                act:'update'
            },function(err,msg){
                console.log(arguments);
            },tempData);
        }

    };

});