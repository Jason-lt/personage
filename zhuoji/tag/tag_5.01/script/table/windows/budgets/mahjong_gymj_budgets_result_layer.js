/*************************************************************
 *  mahjong_gdmj_budgets_layer.js
 *  mahjong
 	广东麻将-鸡平胡 玩法结算layer
 *
 *  Created by simon on 17-10-16
 *  特殊说明：
 	
    使用方法:

 */
(function(){
	var GLOBAL_OBJ         = guiyang;
	var GLOBAL_T           = GLOBAL_OBJ.table.global;
	var GLOBAL_FUNCS       = GLOBAL_OBJ.businesses.functions;
	var MODEL_TABLEINFO    = GLOBAL_OBJ.table.models.TableInfo;
	var MODEL_USER         = GLOBAL_OBJ.businesses.modules.User.Model;
	var C2S                = GLOBAL_OBJ.table.network.C2S;
	var MODEL_ROUND_RESULT = GLOBAL_OBJ.table.models.roundresult;
    var MODEL_TASK_WINSTREAK = GLOBAL_OBJ.table.models.winstreaktask;
    var MODEL_TASK_LOOPACVIVETASK = GLOBAL_OBJ.table.models.loopacvivetask;
    var MODEL_TASK_LOOPWINTIMESTASK = GLOBAL_OBJ.table.models.loopwintimestask;
	var MODEL_BUDGETS      = GLOBAL_OBJ.table.models.Budget;
    var MODEL_FLOW         = GLOBAL_OBJ.table.models.Flow;

    GLOBAL_OBJ.table.windows.gymj.result.Budgets.Layer = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"table.windows.gymj.result.Budgets.Layer",
		ctor: function(_params) {
			this._super();
			this.params 		 = _params;

			this.init(GLOBAL_OBJ.RES.GYMJ_BUDGET_RESULT_CCBI);
		},

		init:function(_ccbi){
			this._super(_ccbi);
		},

		onLoad: function() {
			this._super();
			//this.isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;
			// 菜单中详情按钮监听
			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_MENU_DETAILS, this.onXiangQingBtn, this);
			var winSize = cc.view.getFrameSize();
			this.is4_3 = winSize.height/winSize.width == 0.75;
			this.updateXZ();
		},

		onCleanup:function() {
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
			this._super();
		},

		updateXZ:function(){
			var playerNum = MODEL_TABLEINFO.getSeatCount();

            GLOBAL_OBJ.LOGD("mahjong_gymj_budgets_result_layer.js","updateXZ");

			var uid, seatId;
            var userCell;

			// if (this.is4_3) {
			// 	var size   = cc.Director.getInstance().getWinSize();
			// 	var _scale = size.height/GLOBAL_OBJ.businesses.global.SCREEN_SIZE.h;
			// 	GLOBAL_OBJ.LOGD("mahjong_gymj_budgets_result_layer.js","updateXZ _scale = " + _scale);
			// 	this['_budgetBgNode'].setScaleY(_scale);
			// }
            MODEL_BUDGETS.getPlayerIndex();
			for(var i = 0 ; i < playerNum; ++i){
				seatId 	   = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(i);
                var index = MODEL_BUDGETS.getIndex(seatId)
                GLOBAL_OBJ.LOGD("mahjong_gymj_budgets_result_layer.js","updateXZ seatId:" + seatId);
                GLOBAL_OBJ.LOGD("mahjong_gymj_budgets_result_layer.js","updateXZ index:" + index);
                if (index != 0){
                    userCell = new GLOBAL_OBJ.table.windows.gymj.result.Budgets.UserLoseCell(seatId);
                    this['cell_node_' + (index+1)].addChild(userCell.getRootNode());
                }
                else{
					//是否流局
					//var isLiuJu = MODEL_BUDGETS.getGameFlow(GLOBAL_T.MYSEAT);
					// if (isLiuJu) {
					// 	userCell = new GLOBAL_OBJ.table.windows.gymj.result.Budgets.UserLoseCell(seatId);
					// }else {
					// 	userCell = new GLOBAL_OBJ.table.windows.gymj.result.Budgets.UserWinCell(seatId);
					// }
					var winmode = MODEL_BUDGETS.getWinMode(seatId);
					var isWin = winmode > -1;
					if (isWin) {
						userCell = new GLOBAL_OBJ.table.windows.gymj.result.Budgets.UserWinCell(seatId);
					}else {
						userCell = new GLOBAL_OBJ.table.windows.gymj.result.Budgets.UserLoseCell(seatId);
					}
                    this['cell_node_' + (index+1)].addChild(userCell.getRootNode());
                }
				
			}

            //捉鸡牌
            var fanTile = MODEL_BUDGETS.getFanTile(seatId);
			
            GLOBAL_OBJ.LOGD("mahjong_gymj_budgets_result_layer.js","updateXZ fanTile:" + fanTile);
            if (fanTile > 0){
                this['zhuojipai_node'].setVisible(true);
                this['zhuojipai_ttf'].setVisible(true);
                var res = GLOBAL_OBJ.GAMENAME.toUpperCase() + "_"+fanTile+"_PNG";
                GLOBAL_FUNCS.textureChange(this['zhuojipai_tile'], GLOBAL_OBJ.RES[res]);
            }else{
                GLOBAL_OBJ.LOGD("mahjong_gymj_budgets_result_layer.js","updateXZ fanTile: false");
                this['zhuojipai_node'].setVisible(false);
                this['zhuojipai_ttf'].setVisible(false);
            }

			var timer = 20;
			var that = this;
			//倒计时
			that['continue_btn0_txt'].setString("继续("+ timer + ")");
			var ___count_down___ = function(){
				if (timer > 0) {
					that['continue_btn0_txt'].setString("继续("+ --timer + ")");
					// that['next_node'].scheduleOnce(function () {
					// 	___count_down___();
					// },1);
					that['next_node'].runAction(cc.Sequence.create(cc.DelayTime.create(1),cc.CallFunc.create(function(){
						___count_down___();
					})))
				}else if(timer == 0) {
					that.onBackToTable()
				}
			}
			___count_down___()
		},

		onBackToTable:function(){
            this['back_btn'].setVisible(false);
            this['_budgetBgNode'].setVisible(false);//玩家结算数据面板不可见
            this['closeBaseDetailBtn'].setVisible(false);
            this['widgetNode'].setVisible(false);
            this['colorLayerBg'].setVisible(false);
			this['table_btns_node'].setVisible(true);//牌桌按钮可见
            this.params.scene.menu.setDetailSprVisible(true)
			this.params.scene.menu.setMenuState("table_end");
			this.setSwallowTouches(false);
			this['next_node'].stopAllActions();
			this['continue_btn0_txt'].setString("继续("+ 0 + ")");
		},

        onContinueGame_0:function(){//玩家结算继续按钮事件
            GLOBAL_OBJ.LOGD("mahjong_gymj_budgets_result_layer.js","onContinueGame_0");
            this.onContinueGame();
        },

		onContinueGame_1:function(){//牌桌继续按钮
            GLOBAL_OBJ.LOGD("mahjong_gymj_budgets_result_layer.js","onContinueGame_1");
			this.onContinueGame();
		},

		onContinueGame:function(){
			GLOBAL_OBJ.LOGD("onContinueXZ_sichuan_xuezhan!!");
            GLOBAL_FUNCS.coinTableDoNext();
		},

		onXiangQingBtn:function () {
            GLOBAL_OBJ.LOGD("mahjong_gdmj_budgets_layer.js", "onXiangQingBtn" );
			this['_budgetBgNode'].setVisible(true);
			this['widgetNode'].setVisible(true);
            this['closeBaseDetailBtn'].setVisible(true);
            this['colorLayerBg'].setVisible(true);
            this['back_btn'].setVisible(true);
			this['table_btns_node'].setVisible(false);//牌桌按钮不可见

		},

	});
    //end
})();