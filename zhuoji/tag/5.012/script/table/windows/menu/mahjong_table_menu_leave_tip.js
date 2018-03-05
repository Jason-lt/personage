/*************************************************************
 *  mahjong_table_menu_leave_tip.js
 	mahjong_table_menu_leave_tip
 *  mahjong
 	麻将金币场，当前牌局结束，20面内且配有循环任务的房间，点击菜单离开按钮需要弹出确认弹窗
 *
 *  Created by lcr on 17-09-15
 *  特殊说明：
    使用方法:

 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var MODEL_TABLEINFO 			= GLOBAL_OBJ.table.models.TableInfo;
	var MODEL_LEAVE 				= GLOBAL_OBJ.table.models.Leave;
	
	GLOBAL_OBJ.table.windows.Menu.LeaveTip = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"table.windows.Menu.LeaveTip",
		ctor: function( _params ) {
			this._super();
			this.params = _params;
		},

		init:function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG, "parems:" + JSON.stringify(this.params));
			this.contentLabel.setString(this.params.miaoshu);
			if(this.params.type == 3){//血战和牌后点击离开，需要给予挽回提示
				this.menuCloseBtn.setVisible(true);
				this.huanduishouNode.setVisible(true);
				this.rightNode.setVisible(false);
			}
		},

		onCleanup:function() {
			this._super();
		},

		onEase:function(){
			this._super();
		},

		/*
		@是否监听物理返回键，默认监听。不监听的在子类中重写返回false即可*/ 
		isKeyBackListenEnabled:function(){
			return false;
		},

				/*
		@touch响应，基类重载*/
        onTouchBegan:function(_touch, _event){
            return true;
        },

		onBackTouch:function () {
			this.onClose();
		},

		onClose:function () {
			this.params.setFunc(false);
			this.windowClose();
		},

		onMenuContinueTip:function(){
			GLOBAL_OBJ.businesses.functions.coinTableDoNext();
		},

		onMenuLeaveTip:function(){
			var reason = MODEL_LEAVE.getMineLeaveReson();
			GLOBAL_OBJ.LOGD(this._TAG, "onMenuLeave_Tip_reason:" + reason);
			if(reason){
				// 返回二级子大厅
				// GLOBAL_OBJ.businesses.utils.Scene.jumpToSecondHall(MODEL_TABLEINFO.getPlayMode());
				// 返回金币场房间列表
                GLOBAL_OBJ.businesses.utils.Scene.jumpToRoomList(GLOBAL_OBJ.PluginGameType.JinBi, MODEL_TABLEINFO.getPlayMode());
			}else{
				GLOBAL_OBJ.table.network.C2S.requestTableLeave(
					MODEL_TABLEINFO.getRoomId(),
					MODEL_TABLEINFO.getTableId(),
					MODEL_TABLEINFO.getActiveServerSeatId()
				);
			}
		},

		onMenuHuanDuiShouTip:function(){
		var reason = MODEL_LEAVE.getMineLeaveReson();
		GLOBAL_OBJ.LOGD(this._TAG, "onMenuHuanDuiShouTip_reason:" + reason);
		if(reason){
			if(reason && reason == "chipNotEnough"){//服务端已经离开，并且原因是金币不足,发送当前玩法的快速开始
				GLOBAL_OBJ.businesses.network.C2S.requestGameStartOnlyPlayMode(
					MODEL_TABLEINFO.getPlayMode()
				);

			}else if(reason && reason == "autoDecide"){//服务端离开了，原因托管，如果金币不足跟托管同时发生，金币不足优先级高
				GLOBAL_OBJ.businesses.network.C2S.requestGameStartCoin(
					MODEL_TABLEINFO.getPlayMode(),
					MODEL_TABLEINFO.getRoomId()
				);

			}else if(reason && reason == "normalReadyTimeOut"){//金币场未准备超时踢出
				GLOBAL_OBJ.businesses.network.C2S.requestGameStartCoin(
					MODEL_TABLEINFO.getPlayMode(),
					MODEL_TABLEINFO.getRoomId()
				);

			}else if(reason && reason == "coinTableFinish"){//金币桌牌桌结束，用户离桌，重新组桌
				GLOBAL_OBJ.businesses.network.C2S.requestGameStartOnlyPlayMode(
					MODEL_TABLEINFO.getPlayMode()
				);

			}else if(reason != null){//服务端离开了，原因不是金币不足,其他reason发送当前玩法，当前房间的快速开始
				GLOBAL_OBJ.businesses.network.C2S.requestGameStartCoin(
					MODEL_TABLEINFO.getPlayMode(),
					MODEL_TABLEINFO.getRoomId()
				);

			}
		}else{
			this.params.setFunc(true);
			GLOBAL_OBJ.table.network.C2S.requestTableLeave(
				MODEL_TABLEINFO.getRoomId(),
				MODEL_TABLEINFO.getTableId(),
				MODEL_TABLEINFO.getActiveServerSeatId()
			);
		}
	},

	});
	//end

})();

