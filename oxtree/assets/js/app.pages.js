J(function($,p,pub){
    pub.id="pages";
    pub.cfg={
        "1000":"首页",
        "6849421":"商详页",
        "7058932":"搜索页-电视",
        "610":"发现",
        "630":"逛逛",
        "11708430":"我的优惠券",
        "11649770":"我的易迅",
        "11594060":"我的订单",
        "11703220":"我的收藏"
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