/*************************************************************
 *  mahjong_tableview_common_cell.js
    mahjong_tableview_common_cell
 *  mahjong
    格子
 *
 *  Created by nick.kai.lee on 16-01-11
 *  特殊说明：

    使用方法:
 */
(function(){
    var GLOBAL_OBJ = guiyang;
    /*
    @格子*/
    var cell = cc.TableViewCell.extend({
        ctor:function (){
            this._super();
            cc.associateWithNative(this, cc.TableViewCell);
        },

        init:function (_config){
            this.config = _config;
            return true;
        },

        initCell:function (_index, _table){
            var size         = this.config.cellSize;
            if (!this.node){
                this.node    = new this.config.controller(_index,this.config);
                this.addChild(this.node.view.ccbRootNode);
            };
            this.node.view.ccbRootNode.setPosition(cc.p(size.width*0.5,size.height*0.5));
            this.node.update(_index, this.config);
        },

        updateCell:function (_index, _table){
            this.initCell(_index, _table);
        }
    });

    /*
     static方法,获取格子的size, 因为tableview先getsize再创建真正的cell
     */
    GLOBAL_OBJ.bkernel.utils.TableView.Cell.Common = {
        _TAG:"bkernel.utils.TableView.Cell.Common",
        getSize:function(_index, _config){
            return _config.cellSize;
        },

        create:function(_config){
            var node = new cell();
            if (node && node.init(_config)){
                return node;
            }
            return null;
        },
    };

})();