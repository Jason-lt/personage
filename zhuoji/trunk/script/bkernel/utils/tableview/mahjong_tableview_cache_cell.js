/*************************************************************
 *  mahjong_tableview_cache_cell.js
    mahjong_tableview_cache_cell
 *  mahjong
    变长格子
 *
 *  Created by nick.kai.lee on 16-01-11
 *  特殊说明：

    使用方法:
 */
(function(){
    var GLOBAL_OBJ = guiyang;
    /*
    @交换父节点*/
    var ___f_changeParent = function (_child, _newParent, _cpp) {
        var child  = _child;
        var parent = _newParent;
        var oldParent;
        if (child && parent) {
            oldParent = child.getParent();
            var size  = parent.getContentSize();
            child.retain();
            child.removeFromParent(false);
            parent.addChild(child);
            child.release();
            child.setPosition(_cpp?_cpp:cc.p(size.width*0.5,size.height*0.5));
        }
        return oldParent;
    };
    
    /*
    @变长格子*/
    var cell = cc.TableViewCell.extend({
        ctor:function (){
            this._super();
            cc.associateWithNative(this, cc.TableViewCell);
        },

        init:function (_config,_cache){
            this.config = _config;
            this.cache  = _cache;
            return true;
        },

        initCell:function (_index, _table){
            var size = GLOBAL_OBJ.bkernel.utils.TableView.Cell.Cache.getSize(_index,this.config,this.cache);
            var node = this.cache[_index].node;
            this.removeAllChildren();
            ___f_changeParent(node.view.ccbRootNode,this,cc.p(size.width*0.5,size.height*0.5));
        },

        updateCell:function (_index, _table){
            this.initCell(_index, _table);
            var node = this.cache[_index].node;
            node.update(_index, this.config);
        }
    });

    /*
     static方法,获取格子的size, 因为tableview先getsize再创建真正的cell
     */
    GLOBAL_OBJ.bkernel.utils.TableView.Cell.Cache = {
        _TAG:"bkernel.utils.TableView.Cell.Cache",
        getSize:function(_index, _config, _cache){
            var node;
            if (null==_cache[_index]) {
                node = new _config.controller(_index,_config);
                var view = node.view.ccbRootNode;
                node.update(_index,_config);
                var size = view.getContentSize();
                view.retain();
                _cache[_index] = { node:node, size:size };
            }else{
                node = _cache[_index].node;
                node.update(_index,_config);
            }
            return _cache[_index].node.view.ccbRootNode.getContentSize();
        },

        create:function(_config,_cache){
            var node = new cell();
            if (node && node.init(_config,_cache)){
                return node;
            }
            return null;
        }
    };
})();