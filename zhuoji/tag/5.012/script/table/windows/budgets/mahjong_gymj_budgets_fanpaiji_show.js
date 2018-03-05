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
        ctor: function(_params) {
            this.init(GLOBAL_OBJ.RES.TABLE_FANPAIJI_SHOW_CCBI);
            this.tile = _params.tile;
            this.callFunc = _params.callFunc;
        },

        init:function(_ccbi){
            GLOBAL_OBJ.LOGD(this._TAG, "init: _ccbi = " + _ccbi);
            this.rootNode = cc.BuilderReader.loadWithController(_ccbi, this, this);
            this.onLoad();
        },

        getRootNode:function () {
            return this.rootNode;
        },

        onLoad: function() {
            this.playEffec();
        },
        playEffec:function() {
            GLOBAL_OBJ.LOGD(this._TAG, "playEffec start");
            var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
            var winSize  = cc.Director.getInstance().getWinSize();
            var ftCenter = cc.p(-winSize.width/2, -winSize.height/2);
            var that = this;
            that['fanPaiJiNode'].scheduleOnce(function () {
                GLOBAL_OBJ.bkernel.utils.Animation.play(
                    that['effectNode'],
                    GLOBAL_OBJ.RES.GYMJ_FANPAIJI_CCBI,
                    ftCenter,
                    function(_ani){
                        var res = GLOBAL_OBJ.GAMENAME.toUpperCase() + "_" + that.tile + "_PNG";
                        if (res) {
                            GLOBAL_FUNCS.textureChange(_ani['tileNode'],GLOBAL_OBJ.RES[res]);
                        }
                    },
                    function(_ani){
                        that.updateXZ();
                        that['fanPaiJiNode'].scheduleOnce(function () {
                            that.callFunc();
                        },2);
                    },
                    true
                );
            },0.5);
        },
        updateXZ:function(){
            var isHave = false;
            for (var i = 0; i < 4; ++i){
                var seatId 	   = i;
                var fanpaiji_num   = MODEL_BUDGETS.getFanPaiJi(seatId);
                fanpaiji_num = Math.abs(fanpaiji_num);
                GLOBAL_OBJ.LOGD(this._TAG, "seatId = " + seatId + " updateXZ fanpaiji_num = " + fanpaiji_num);
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