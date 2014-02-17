J(function($,p,pub){
    pub.id="repoPages";
    p.provider = {
        isAuthenticated:false,
        url:'http://log.oxox.io/api.php',
        rock:function(_params,cbk,postData){
            _params = $.extend({
                "xn":"wgdata",
                "xk":"pages"
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
        setData:function(data){
            this.data = data;
            this.dataStr = JSON.stringify(data);

            //获取当前页面
            var pid = J.util.getPageId(),
                page = this._getItemById(pid);
            if(!page){
                alert('页面'+pid+'不存在!');
                history.back();
                return;
            }
            document.getElementById('pageName').innerHTML = page.name;
        },
        getData:function(fromDataStr){
            if (fromDataStr) {
                return JSON.parse(this.dataStr);
            };
            return this.data;
        },
        _getItemById:function(id){
            var items = this.data||[],
                len = items.length,
                item = null,
                found=false;
            for(var i = 0 ;i<len;i++){
                item = items[i];
                if(item.$id==id){
                    found = true;
                    break;
                };
            };
            return (found?item:null);
        },
        _init:function(){
            J.util.$win.bind(J.auth.EVT.done,function(e,d){
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
        return p.provider._getItemById(id);
    };
    pub.EVT = {
        init:'onPageInitializing.repo',
        initError:'onPageInitError.repo',
        inited:'onPageInited.repo'
    };
});