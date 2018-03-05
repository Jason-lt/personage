/*************************************************************
 *  mahjong_gymj_budgets_fanpaiji_show.js
 *  Created by liaotao
 *  特殊说明：

 使用方法:

 */
(function(){
    var GLOBAL_OBJ         = guiyang;
    var GLOBAL_T           = GLOBAL_OBJ.table.global;
    var MODEL_BUDGETS      = GLOBAL_OBJ.table.models.Budget;
    var MODEL_TABLEINFO    = GLOBAL_OBJ.table.models.TableInfo;

    GLOBAL_OBJ.table.windows.gymj.result.Budgets.FanPaiJi = cc.Class.extend({
        _TAG:"table.windows.gymj.result.Budgets.FanPaiJi",
        ctor: function() {
            this.init(GLOBAL_OBJ.RES.TABLE_FANPAIJI_SHOW_CCBI);
        },

        init:function(_ccbi){
            this.rootNode = cc.BuilderReader.loadWithController(_ccbi, this, this);
            this.onLoad();
        },

        getRootNode:function () {
            return this.rootNode;
        },

        onLoad: function() {
            this.updateXZ();
        },
        updateXZ:function(){
            var playerNum = MODEL_TABLEINFO.getSeatCount();
            GLOBAL_OBJ.LOGD("mahjong_gymj_budgets_fanpaiji_show.js", "updateXZ playerNum =" + playerNum);
            var isHave = false;
            for (var i = 0; i < playerNum; ++i){
                var seatId 	   = i;
                var fanpaiji_num   = MODEL_BUDGETS.getFanPaiJi(seatId);
                fanpaiji_num = Math.abs(fanpaiji_num);
                GLOBAL_OBJ.LOGD("mahjong_gymj_budgets_fanpaiji_show.js", "seatId = " + seatId + " updateXZ fanpaiji_num = " + fanpaiji_num);
                var addFanPaiJi   = MODEL_BUDGETS.getaddFanTile(seatId);
                this['fanpaiji_node_' + seatId].setVisible(true);
                if (fanpaiji_num > 0 && fanpaiji_num < 5){
                    var mahj = GLOBAL_OBJ.table.modules.Mahjong.produce(addFanPaiJi,seatId);
                    var size = mahj.mahj_size;
                    var began_posx = 0 - (fanpaiji_num - 1)/2*size.width;
                    for (var j = 0; j < fanpaiji_num; ++j){
                        var mahj = GLOBAL_OBJ.table.modules.Mahjong.produce(addFanPaiJi,seatId);
                        mahj.doStandTransform(GLOBAL_T.SEATS.N2, true);
                        mahj.getRootNode().setPosition(cc.p(began_posx + j*size.width,0));
                        this['fanpaiji_node_' + i].addChild(mahj.getRootNode());
                        isHave = true;
                        //mahj.setTextureByName( mahj.faceSpr00, GLOBAL_OBJ.RES.GDMJ_KAIMA_MJP06_PNG)
                    }
                }else {
                    this['fanpaiji_node_' + i].setVisible(false);
                }
            }
            if (isHave){
                this['layerColor_Node'].setVisible(true);
            }else {
                this['layerColor_Node'].setVisible(false);
            }
        },
    });

})();