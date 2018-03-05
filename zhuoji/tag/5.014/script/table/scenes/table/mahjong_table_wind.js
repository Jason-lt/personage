/*************************************************************
 *  mahjong_table_wind.js
    mahjong_table_wind
 *  mahjong
 	麻将风
 *
 *  Created by nick.kai.lee on 16-06-08
 *  特殊说明：
 	
    使用方法:

 */
(function(){
	"use strict";
	var GLOBAL_OBJ = guiyang;

	var MODEL_TABLEINFO = GLOBAL_OBJ.table.models.TableInfo;
	var AUDIO = GLOBAL_OBJ.bkernel.utils.Audio;

	var windMapImg = [
		["wind_0", "wind_1", "wind_2", "wind_3"],
		["wind_3", "wind_0", "wind_1", "wind_2"],
		["wind_2", "wind_3", "wind_0", "wind_1"],
		["wind_1", "wind_2", "wind_3", "wind_0"]];

	var windRotationMap = [-90, 180, 90, 0];	// 东，南，西，北
	var windRotationMap_2 = [-90, -90, 90, 90];	// 庄,闲

	GLOBAL_OBJ.table.scenes.Table.Wind = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"table.scenes.Table.Wind",
		ctor: function() {
			this._super();

			this.timeout = 0;
			this.seatId  = 0;
			this.times	 = 0;
			this.animate = null;
			this.init(GLOBAL_OBJ.RES.TABLE_WIND_CCBI);

			var fadeInAction = cc.FadeTo.create(0.5, 255);
			var fadeOutAction = cc.FadeTo.create(0.5 ,100);
			this.fadeAction = cc.Sequence.create(fadeInAction,fadeOutAction).repeatForever();
			this.fadeAction.retain();

			this.count = MODEL_TABLEINFO.getSeatCount();
			var imgPath = "";
			if (this.count == 2) {
				imgPath = GLOBAL_OBJ.RES.GYMJ_WIND_ER_DI_PNG;
				windMapImg = [
					["wind_2_0", "wind_2_0","wind_2_1", "wind_2_1"],
					["wind_2_0", "wind_2_0","wind_2_1", "wind_2_1"],
					["wind_2_1", "wind_2_1","wind_2_0", "wind_2_0"],
					["wind_2_1", "wind_2_1","wind_2_0", "wind_2_0"]];
			} else {
				imgPath = GLOBAL_OBJ.RES.ZM_TIHUAN_COUNTERS_FLOOR01_PNG;
				windMapImg = [
					["wind_0", "wind_1", "wind_2", "wind_3"],
					["wind_3", "wind_0", "wind_1", "wind_2"],
					["wind_2", "wind_3", "wind_0", "wind_1"],
					["wind_1", "wind_2", "wind_3", "wind_0"]];
			}
			GLOBAL_OBJ.businesses.functions.textureChange(this.windPanel, imgPath);

		},

		init:function(_ccb){
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();

			var that 		 = this;
			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.bkernel.Events.TICK, function(_params){
				// _params.time
				that.timeout = that.timeout < 0 ? 0 : that.timeout;

				//播放倒计时音效
				if (that.timeout <= 3 && that.timeout>0) { AUDIO.audio( GLOBAL_OBJ.RES.ZHUOJI_EFFECT_EFFECT_GAME_3S_TIS_MP3 ); };

				if(that.times == 0){
					that.counterLabel.setString( that.timeout-- );
					that.counterLabel.setVisible(true);
					that.counterLabel_1.setVisible(false);
				} else if(that.times == 1){
					that.counterLabel_1.setString( that.timeout-- );
					that.counterLabel.setVisible(false);
					that.counterLabel_1.setVisible(true);
				} else if(that.times == 2){
					that.counterLabel_1.setString( that.timeout-- );
					that.counterLabel.setVisible(false);
					that.counterLabel_1.setVisible(true);
				}

			}, this);

			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_GAME_OVER, this.stopWindAnimation, this);
		},

		onCleanup:function() {
			this._super();
			this.animate = null;
			this.fadeAction.release();
			this.fadeAction = null;
			this.effectNode.removeAllChildren();
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
		},

		setWind:function(_seatId)
		{
			var banker = MODEL_TABLEINFO.getBankerSeatId();
			//var mySeatId = MODEL_TABLEINFO.getActiveServerSeatId();
			//GLOBAL_OBJ.LOGD(this._TAG, "check_wind_seatid = " + mySeatId);
			var rotation = windRotationMap[banker];
			if (this.count == 2) {
				rotation = windRotationMap_2[banker];
				this.effectNode_2.setRotation(rotation);
			} else {
				this.effectNode.setRotation(rotation);
			}
			this.windPanel.setRotation(rotation);

			this.seatId = _seatId;
			var winds = windMapImg[banker];

			for (var i in winds){
				this[winds[i]].setVisible(false);
				this[winds[i]].stopAllActions();
			}

			var windName = winds[_seatId];
			this.winSpr = this[windName];
			this.winSpr.setVisible(true);
			this.winSpr.setOpacity(100);
			this.winSpr.runAction(this.fadeAction);
		},


		stopWindAnimation:function()
		{
			this.winSpr.setVisible(false);
			this.timeout = 0;
			this.counterLabel.setString( "0" );
			if (this.animate)
			{
				this.animate.getRootNode().removeFromParent();
			}
			this.animate = null;
		},

		showAction:function (timeOut) {
			this.winSpr.stopAllActions();
			this.winSpr.setVisible(false);
			this.timeout = timeOut;
			this.counterLabel.setString(timeOut +"");
		},

		/*
		 @刷新light以及倒计时
		 _seatId:本地座位号
		 _timeout:倒计时
		 */
		update:function(_seatId, _timeout){
			this.seatId  = _seatId;
			this.timeout = _timeout;
			this.times	 = 0;
			this.setWind(_seatId);
			GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_COUNTDOWNTX, _seatId);
		},

		updateNotifyTimeOut:function( _seatId, _timeout, _times ){
			this.seatId  = _seatId;
			this.timeout = _timeout;
			this.times	 = _times;
			if(this.times == 1){
				GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_COUNTDOWNTX, _seatId);
			}
			this.setWind(_seatId);
		}
	});
	//end
})();