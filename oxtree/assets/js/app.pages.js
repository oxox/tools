J(function($,p,pub){
    pub.id="pages";
    pub.cfg={
        "1000":"首页",
        "6849421":"商详页",
        "7058932":"搜索页-电视",
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