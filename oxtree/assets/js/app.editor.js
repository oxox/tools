J(function($,p,pub){
    pub.id = "editor";
    //管理员
    p.adminUser = [''];

    //编辑器模块
    p.editor = {
        clNewRecord:'mod_editor1',
        clError:'has-error',
        prevData:null,
        data:null,
        isAdding:false,
        _init:function(){
            this.$d = $('#editor');
            this.$name = $('#iptName');
            this.$val = $('#iptYTags');
            this.$rowType = $('#formRowType');
            this.$nodePosType = $('#ddlCreateNodePositionType');
            this.$formGroup1 = $('#formGroup1');
            this.$formGroup2 = $('#formGroup2');
            this.$d.find('.close').on('click',function(e){
                p.editor.hide();
            });
            this.$btnAdd = $('#btnAdd').on('click',function(e){
                p.editor.show(p.editor.$btnAdd,null);
            });

            $('#btnSave').on('click',function(e){
                p.editor.save();
            });
            $('#btnDelete').on('click',function(e){
                p.editor.delete();
            });
        },
        save:function(){
            var d = this.getValue();
            //validation
            var obj = this.validate(d);
            if(!obj){
                return false;
            };
            d = obj;
            
            if (!d.id){
                d.id = new Date().getTime();
            };
            
            //更新客户端树形数据
            if(!this.isAdding){
                J.repoMods.updateItem(d,function(err,msg){
                    if(err||msg.code=='0'){
                        return;
                    };
                    //更新成功
                    J.tree.updateSelectedNode(d);
                    p.editor.hide();
                });
                return;
            }
            //新增节点
            this.addNew(d);
        },
        addNew:function(d){
            var pos = 'last';
            //是否选择了父节点
            if(this.prevData){
                //选择了父节点
                pos = this.$nodePosType.val();
            };
            J.repoMods.addItem(this.prevData,d,pos,function(err,msg){
                if(err||msg.code=='0'){
                    return;
                };
                //更新成功
                J.tree.createNode(d,pos);
                p.editor.hide();
            });
        },
        delete:function(){
            if(!this.data){
                this.hide();
                return;
            };
            
            //最后一个一级节点不给删除
            if(J.tree.hasSoleNode()){
                alert('最后一个节点啦，别删了吧...');
                this.hide();
                return;
            };
            
            J.repoMods.deleteItemById(this.data.id,function(err,msg){
                if(err||msg.code=='0'){
                    return;
                };
                //删除成功
                J.tree.removeSelectedNode();
                p.editor.hide();
            });
        },
        show:function($t,data){
            var offset = $t.offset(),
                w = $t.outerWidth();

            this.reset();
            this.$d.css({
                left:(offset.left+w+10),
                top:(offset.top-10)
            }).addClass('in');
            this.data = data;
            this.isAdding = (data===null);
            if(data){
                this.prevData = data;
                this.$name[0].value = data.alias;
                this.$val[0].value = data.ytagSelector;
            }else{
                this.$d.addClass(this.clNewRecord);
                if(this.prevData){
                    this.$rowType.removeClass('hide');
                }else{
                    this.$rowType.addClass('hide');
                };
            };
        },
        hide:function(){
            this.$d.removeClass('in');
            this.reset();
        },
        reset:function(){
            this.$name.val('');
            this.$val.val('');
            this.$d.removeClass(this.clNewRecord);
        },
        resetFormErrors:function(){
            this.$formGroup1.removeClass('has-error');
            this.$formGroup2.removeClass('has-error');
        },
        getValue:function(){
            var d={};
            d.alias = $.trim(this.$name[0].value);
            d.ytagSelector = $.trim(this.$val[0].value);
            d.isCustomYTag = true;
            d.readonly = true;
            d.type=1;
            if(this.data){
                d.id=this.data.id;
            };
            return d;
        },
        validate:function(d){
            this.resetFormErrors();
            var isValid = true;
            if(d.alias.length==0){
                this.$formGroup1.addClass(this.clError);
                isValid = false;
            };
            if(d.ytagSelector.length==0){
                this.$formGroup2.addClass(this.clError);
                isValid = isValid&&false;
            };
            
            if (!isValid){
                return null;
            }
            
            //ytag为css选择器
            if(d.ytagSelector.indexOf('.')!=-1 || d.ytagSelector.indexOf('#')!=-1){
                return d;
            };
            //ytag id，|分隔
            if( d.ytagSelector.indexOf('|')==-1 && (!/^[0-9]+$/.test(d.ytagSelector)) ){
                J.tip.show('ytag选择器必须是有效的css选择器，或则是以|分隔的有效的ytag id！',3000,true);
                this.$formGroup2.addClass(this.clError);
                return null;
            };
            
            var tags = d.ytagSelector.split('|'),
                len = tags.length;
            for(var i =0;i<len;i++){
                if(!(/^[0-9]+$/.test(tags[i])) ){
                    isValid=false;
                    break;
                }
            };//for
            if(!isValid){
                J.tip.show('ytag选择器必须是有效的css选择器，或则是以|分隔的有效的ytag id！',3000,true);
                this.$formGroup2.addClass(this.clError);
                return null;
            };
            d.type=2;
            return d;
        }


    };
    
    pub.show = function($t,data){
        p.editor.show($t,data);
    };
    
});