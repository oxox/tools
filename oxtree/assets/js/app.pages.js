J(function($,p,pub){
    pub.id="pages";
    pub.cfg={
        "1000":"首页",
        "6849421":"商详页",
        "7058922":"搜索页",
        "610":"发现",
        "630":"逛逛"
    };
    
    p.main = {
        _init:function(){
            var pid = J.util.getPageId(),
                txt = pub.cfg[pid];
            if(!txt){
                location.search="1000";
                return;
            }
            $('#rootTxt').text(txt);
        }
    };
});