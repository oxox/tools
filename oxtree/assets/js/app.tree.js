J(function($,p,pub){
    pub.id = "tree";
    
    //树形菜单模块
    p.tree = {
        selectedNode:null,
        tpl:J.util.heredoc(function(){/*
        <ul id="modList{{pid}}" class="mod_list">
            {{#babies}}
            <li id="mod{{id}}" class="mod_item{{cl1}}" data-id="{{id}}" data-global="{{isGlobalMod}}">
                {{#hasChildren}}
                    <a id="modLnk{{id}}" href="javascript:;" class="mod_lk">{{alias}}</a>
                    {{>children}}
                {{/hasChildren}}
                {{^hasChildren}}
                <a id="modLnk{{id}}" href="javascript:;" class="mod_lk">{{alias}}</a>
                {{/hasChildren}}
            </li>
            {{/babies}}
        </ul>
        */}),
        _init:function(){
            J.util.$win.on(J.repo.EVT.inited,function(e,d,first){
                p.tree.render(d);
            });
        },
        render:function(d){
            d = {
                id:'0',
                babies:d,
                isCustomYTag:true
            };
            this.parseTreeData(d,'-1');
            var html = J.util.toHtml(this.tpl,d,{children:this.tpl}),
                id1 = d.hasChildren?d.babies[0].id:null;
                
            this.$tree = $('#modTree').html(html).jstree({
                "core" : { "multiple":false },
                "plugins" : [ "themes", "html_data","ui" , "crrm"]
            }).bind("select_node.jstree", function (e, data) {
                p.tree.selectedNode = data.selected;
                var selectedItem = J.repo.getItemById(data.selected.data('id'));
                if(!selectedItem){
                    return;
                }
                J.editor.show(data.selected.find('>a'),selectedItem);
            });
            if(id1){
                this.$tree.jstree('open_node', '#mod'+id1);
            }
        },
        parseTreeData:function(ctag,pid){
            ctag.pid = pid;
            ctag = this.parseSingleItem(ctag);
            if ( (!ctag.babies) || (ctag.babies.length===0) ) {
                return ctag;
            };
            var len = ctag.babies.length;
            for(var i =0;i<len;i++){
                this.parseTreeData(ctag.babies[i],ctag.id);
            };//for
            return ctag;
        },
        parseSingleItem:function(tempItem){
            tempItem.id = tempItem.isCustomYTag?tempItem.id:tempItem.ytagSelector;
            tempItem.cl1="";
            tempItem.hasChildren = false;
            if(tempItem.readonly){
                tempItem.cl1=' mod_item1';
            }
            //含子级模块
            if(tempItem.babies&&tempItem.babies.length>0){
                tempItem.cl1+=' mod_item2';
                tempItem.hasChildren = true;
            }
            return tempItem;
        }
    };
    
    pub.removeSelectedNode = function(){
        p.tree.$tree.jstree("delete_node",p.tree.selectedNode);
    };
    
    pub.updateSelectedNode = function(data){
        p.tree.$tree.jstree("rename_node",p.tree.selectedNode,data.alias);
    };
    
    pub.createNode = function(data,pos){
        //create_node(par, node, pos)
        p.tree.$tree.jstree('create_node',(p.tree.selectedNode||-1) , {
            data:data,
            title:data.alias,
            li_attr:{
                id:'mod'+data.id,
                'class':'mod_item mod_item1',
                'data-id':data.id+''
            },
            a_attr:{
                href:'javascript:;',
                'class':"mod_lk",
                id:"modLnk"+data.id
            }
        },pos);
    };
    
    pub.hasSoleNode = function(){
        return (p.tree.$tree.find('>ul').children().length===1);
    };
    
});