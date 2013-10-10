J(function($,p,pub){
    pub.id="repo";
    p.provider = {
        url:'http://log.oxox.io/api.php',
        rock:function(_params,cbk,postData){
            _params = $.extend({
                "xn":"xdata",
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
            var k = 'xdata_mods_'+J.util.getPageId();
            localStorage[k] = JSON.stringify(data);
        },
        setData:function(data){
            this.data = data;
            this.dataStr = JSON.stringify(data);
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
        _onLoad:function(){
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
        init:'onInitializing.repo',
        initError:'onInitError.repo',
        inited:'onInited.repo',
        updating:'onUpdating.repo',
        updateError:'onUpdateError.repo',
        updated:'onUpdated.repo'
    };
    pub.dummyData = [
    {
        "id":"ic_toolbar",                            //模块id，必须唯一，建议和css类名关联
        "alias": "Toolbar头部工具条",                 //模块名称
        "type": 1,                                    //ytag选择器的类型：1为css选择器，2为多个ytagid以|分隔
        "ytagSelector": ".ic_toolbar",                //ytag选择器的值
        "readonly":true,
        "isCustomYTag":true,
        "babies":[
            {
                "id":"mod_entry",
                "alias": "Toolbar-左侧入口",
                "type": 1,
                "ytagSelector": ".mod_entry",
                "readonly":true,
                "isCustomYTag":true,
                "babies":[
                    {
                        "id":"lnk_qqwangou",
                        "alias": "QQ网购链接",
                        "type": 2,
                        "ytagSelector": "00101",
                        "readonly":true,
                        "isCustomYTag":true
                    },
                    {
                        "id":"lnk_paipai",
                        "alias": "拍拍链接",
                        "type": 2,
                        "ytagSelector": "00102",
                        "readonly":true,
                        "isCustomYTag":true
                    }
                ]
            },
            {
                "id":"mod_sitemap",
                "alias": "Toolbar-右侧入口",
                "type": 1,
                "ytagSelector": ".mod_sitemap",
                "readonly":true,
                "isCustomYTag":true
            }
        ]
    },
    {
        "id":"mod_logo",
        "alias": "网站LOGO",
        "type": 1,
        "ytagSelector": ".mod_logo",
        "readonly":true,
        "isCustomYTag":true
    }];
});