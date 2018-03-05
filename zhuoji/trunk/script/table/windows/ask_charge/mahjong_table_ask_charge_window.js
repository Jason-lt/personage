/*************************************************************
 * 	mahjong_table_ask_charge_window.js
 	mahjong_table_ask_charge_window
 *  mahjong
 	麻将牌桌 充值界面
 *
 *  Created by lcr on 17-06-30
 *  特殊说明：
 	
    使用方法:

 */
(function() {
    "use strict";
	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.table.windows.AskCharge.Window = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG: "GLOBAL_OBJ.table.windows.AskCharge.Window",
		ctor: function(_params) {
			this._super();
			this._params = _params;
			this.data = this._params.chargeData;
			this.serverId = this.data.sid;
			this.model    = this.data.model;
			this.timedjs  = this.data.timeout || 12;
			this.roomId	  = this.data.roomid;
			this.tableId  = this.data.tableid;

		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();
			var that = this;

			// cc.log("AskCharge_window_params_data=" + JSON.stringify(this._params));
			this.charge_dis.setString(this.data.dis);

			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.bkernel.Events.TICK, function(_params){

				that.timedjs = that.timedjs < 0 ? 0 : that.timedjs;
				// //播放倒计时音效
				if (that.timeout <= 3 && that.timeout>0) { AUDIO.audio( GLOBAL_OBJ.RES.ZHUOJI_EFFECT_EFFECT_GAME_3S_TIS_MP3 ); };
				var tm = that.timedjs--;
				that.chargeRenShuTxt.setString( "认输(" + tm + ")"  );
			}, this);


		},

		onChargeClose:function () {//关闭
			var _data = {};
			_data.seatId = this.serverId;
			_data.result = -1;
			_data.roomId = this.roomId;
			_data.tableId= this.tableId;

			// cc.log("onChargeClose=" + JSON.stringify(_data));
			
			GLOBAL_OBJ.table.network.C2S.requestTableCharge(this.model, _data);
		},

		onChargeRenshu:function () {//认输
			var _data = {};
			_data.seatId = this.serverId;
			_data.result = -1;
			_data.roomId = this.roomId;
			_data.tableId= this.tableId;

			// cc.log("onChargeRenshu=" + JSON.stringify(_data));

			GLOBAL_OBJ.table.network.C2S.requestTableCharge(this.model, _data)
		},

		onChargeOk:function () {//确定
			var _data = {};
			_data.seatId = this.serverId;
			_data.result = 1;
			_data.roomId = this.roomId;
			_data.tableId= this.tableId;

			// cc.log("onChargeOk=" + JSON.stringify(_data));

			GLOBAL_OBJ.table.network.C2S.requestTableCharge(this.model, _data);
		},



		onCleanup: function() {
			this._super();
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
		},

		onEase: function() {
			this._super();
		},

		/*
		@touch响应，基类重载*/
		onTouchBegan: function(_touch, _event) {
			return false;
		},

		/*
		 @是否监听物理返回键，默认监听。不监听的在子类中重写返回false即可*/
		isKeyBackListenEnabled: function() {
			return false;
		},

	});
	//end

})();