J(function($,p,pub){
    pub.id = "tip";
    
    p.tip = {
        $d:$('#tip'),
        timer:null,
        clDanger:'label-danger',
        show:function(txt,duration,isDanger){
            clearTimeout(this.timer);
            this.$d.removeClass('hide').html(txt);
            if(isDanger){
                this.$d.addClass(this.clDanger);
            }else{
                this.$d.removeClass(this.clDanger);
            };
            if (duration) {
                this.timer = setTimeout(function(){
                    loader.hide();
                },duration);
            };
        },
        hide:function(){
            this.$d.addClass('hide');
        },
        _init:function(){
            J.util.$win.on(J.repoMods.EVT.init+' '+J.repoPages.EVT.init,function(e){
                pub.show('准备数据中...',null,false);
            }).on(J.repoMods.EVT.initError+' '+J.repoPages.EVT.initError,function(e,err){
                pub.show('Init Error:'+err,null,true);
            }).on(J.repoMods.EVT.inited+' '+J.repoPages.EVT.inited,function(e){
                pub.hide();
            }).on(J.repoMods.EVT.updating,function(e){
                pub.show('保存数据中...',null,false);
            }).on(J.repoMods.EVT.updateError,function(e,err){
                pub.show('操作失败:'+err,null,true);
            }).on(J.repoMods.EVT.updated,function(e){
                pub.hide();
            });
        }
    };
    pub.show = function(txt,dur,isDanger){
        p.tip.show(txt,dur,isDanger);
    };
    pub.hide = function(){
        p.tip.hide();
    };
});