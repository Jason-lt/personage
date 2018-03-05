/*************************************************************
 * 	mahjong_table_absence_window.js
 *  定缺界面
 *  Created by simon on 17-12-20
 */

(function() {
    "use strict";
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_T 				= GLOBAL_OBJ.table.global;
	var GLOBAL_FUNCS 			= GLOBAL_OBJ.businesses.functions;
	var MODEL_TABLEINFO         = GLOBAL_OBJ.table.models.TableInfo;
	var AUDIO                   = GLOBAL_OBJ.bkernel.utils.Audio;

	GLOBAL_OBJ.table.windows.Absence.Window = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG: "GLOBAL_OBJ.table.windows.Absence.Window",
		ctor: function(_params) {
			this._super();
			this._params 		= _params;
			this.dingqueEffect_1 = null;
			this.dingqueEffect_2 = null;
			this.dingqueEffect_3 = null;
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();
			this.updateFixedMissing();
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

		updateFixedMissing: function() {
			var that = this;
			var data = this._params;

			// var time  = data.time;
			var type  = data.type;       // 如果是begin，则是定缺阶段，如果是end，则是自己定缺完毕，等待其他人定缺结果阶段
			var color = data.color_data; // 提示的默认的定缺花色
			var color_sort = data.color_sort;

			if(type == "begin"){
				var sortLevel, offX, cos;
				for(var ii = 0; ii < color_sort.length; ii++){
					cos = color_sort[ii];
					if(cos == 0){
						sortLevel = ii;
					}else if(cos == 1){
						sortLevel = ii;
					}else if(cos == 2){
						sortLevel = ii;
					}
					offX = -180 + 180 * sortLevel;
					this["dingque_btn_" + cos].setPositionX(offX);
				}

				var animationName = "";
				switch (color){
					case 0:
						animationName = "wan";
						break;
					case 1:
						animationName = "tong";
						break;
					case 2:
						animationName = "tiao";
						break;
				}

				var sizet = this.dingquezhongSpr_1.getContentSize();
				var widtht = sizet.width/2.0;
				var heightt = sizet.height;

				var dingqueFun = function () {
					GLOBAL_OBJ.bkernel.utils.Animation.play( that["dingque_btn_" + color],
						GLOBAL_OBJ.RES.XZ_ZM_DQ2_CCBI, cc.p(widtht-4.5, heightt+10),
						function(_animate){},
						function(_animate){
						}, true, 1.0, animationName )
				};

				this.dingque_button_node.setVisible(true);
				this.dingquezhongNode.setVisible(true);
				dingqueFun();

			}else if(type == "end"){

				this.dingque_button_node.setVisible(false);
				this.dingquezhongNode.setVisible(true);
			}

			var size = this.dingquezhongSpr_1.getContentSize();
			var width = size.width/2.0;
			var height = size.height/2.0;

            var dingqueZhongFun = function(_parent, _father) {
            	_father = GLOBAL_OBJ.bkernel.utils.Animation.play(_parent,
            		GLOBAL_OBJ.RES.XZ_ZM_DQ_CCBI, cc.p(width, height),
            		function(_animate){},
            		function(_animate){},
            		true, 1, "dingque");
            };

            var playMode = MODEL_TABLEINFO.getPlayMode();
            if (playMode == GLOBAL_T.PLAYMODE.ErDingGuai) {
                dingqueZhongFun(this.dingquezhongSpr_2, this.dingqueEffect_2);
			}
			else if (playMode == GLOBAL_T.PLAYMODE.SanDingGuai) {
                dingqueZhongFun(this.dingquezhongSpr_1, this.dingqueEffect_1);
                dingqueZhongFun(this.dingquezhongSpr_3, this.dingqueEffect_3);
			}
		},

		palyDingQueAni:function ( _localSeatId, _dingQueType, _colseCallFunc, _playNum ) {
			var that = this;
			var wtt = [GLOBAL_OBJ.RES.MAHJ_FIXED_MISSING_WAN_PNG, GLOBAL_OBJ.RES.MAHJ_FIXED_MISSING_TONG_PNG, GLOBAL_OBJ.RES.MAHJ_FIXED_MISSING_TIAO_PNG];
			var touPos = this._params.tableScene.getDQPositionByLocalSeatId(_localSeatId);
			var parentNode;
			var parentNodess;
			var animationName = "";
			switch (_dingQueType) {
				case 0:
					animationName = "wan";
					break;
				case 1:
					animationName = "tong";
					break;
				case 2:
					animationName = "tiao";
					break;
			}

            // 自己播放定缺动画
			if(_localSeatId == GLOBAL_T.SEATS.N0) {
				parentNode 		= this["tou_jiaobiao_" + _dingQueType];
				parentNodess	= this["tou_jiaobiaoNode_" + _dingQueType]
			}
			else {	// 其他人播放定缺动画
				parentNode 		= this["wanjia_jiaobiao_" + _localSeatId];
				parentNodess	= this["wanjia_jiaobiaoNode_" + _localSeatId];
				GLOBAL_FUNCS.textureChange(parentNode, wtt[_dingQueType]);
			}
			GLOBAL_OBJ.LOGD("mahjong_table_absence_window.js","palyDingQueAni   _dingQueType = " + _dingQueType);
			var touposover = that.dingque_tile_node.convertToNodeSpace(touPos);// 将世界坐标转换成本节点坐标
			touposover.x = touposover.x +19;
			touposover.y = touposover.y +19;
			parentNodess.runAction(cc.Sequence.create(
				cc.DelayTime.create(1.0),
				cc.MoveTo.create(0.4, touposover),
				cc.CallFunc.create(function(){
					AUDIO.audio(GLOBAL_OBJ.RES.ZHUOJI_EFFECT_EFFECT_DINGQUE_MP3);
					parentNodess.runAction(cc.ScaleTo.create(0.2, 0.50, 0.50));
					GLOBAL_OBJ.tableEffectPlayer.play(
						parentNodess,
						GLOBAL_OBJ.RES.XZ_ZM_DQ4_CCBI, cc.p(0, 0),
						function(_animate){},
						function(_animate){
							GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_SHOW_ABSENCE_FIXD, {seatId:_localSeatId,dqType:_dingQueType});//显示定缺花色种类
							if(_playNum == MODEL_TABLEINFO.getSeatCount() - 1){
								_colseCallFunc();
							}
						}, false, 1.0,
						animationName
					);
				}))
			);

			parentNodess.setVisible(true);
			GLOBAL_OBJ.tableEffectPlayer.play(
				parentNodess,
				GLOBAL_OBJ.RES.XZ_ZM_DQ3_CCBI, cc.p(0, 0),
				function(_animate){},
				function(_animate){}, false, 1.0,
				animationName
			);
		},

		hideNodes:function () {
			this.dingque_button_node.setVisible(false);
		},

		onDingQueWan: function() {
			var upData 		= {};
			upData.color  	= 0;
			GLOBAL_OBJ.table.network.C2S.requestTableAbsence(upData);
		},

		onDingQueTong: function() {
			var upData 		= {};
			upData.color  	= 1;
			GLOBAL_OBJ.table.network.C2S.requestTableAbsence(upData);
		},

		onDingQueTiao: function() {
			var upData 		= {};
			upData.color  	= 2;
			GLOBAL_OBJ.table.network.C2S.requestTableAbsence(upData);
		},

		playMySelfDingQueAni:function ( _color, _fake ) {
			this.hideNodes();
			if( _fake == true){
				GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_SHOW_ABSENCE_FIXD,
					{seatId:GLOBAL_T.SEATS.N0, dqType:_color});//显示自己定缺花色种类
			}else{
				this.palyDingQueAni(GLOBAL_T.SEATS.N0, _color);//不是断线重连播放动画
			}
		},

		updateFixedMissingEnds: function( _colordataend, _colseCallFunc ) {//恢复或展示头像定缺角标
            GLOBAL_OBJ.LOGD(this._TAG, "_update_Fixed_Missing_End_start");
			var i;
			var localSeatId;
			var localseatIdDQType;//定缺牌花色类型
			var pNum = 0;
			//正常广播定缺，播放特效
			this.dingquezhongNode.setVisible(false);
			for(i = 0; i < _colordataend.length; ++i){
				localSeatId 		= GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(i);
				localseatIdDQType 	= _colordataend[i];

				if(localSeatId != GLOBAL_T.SEATS.N0){
					pNum = pNum + 1;
					this.palyDingQueAni(localSeatId, localseatIdDQType, _colseCallFunc, pNum);
				}
			}

		},

		onRemoveEffects:function()
		{
			GLOBAL_OBJ.tableEffectPlayer.removeEffect(this.dingqueEffect_1);
			GLOBAL_OBJ.tableEffectPlayer.removeEffect(this.dingqueEffect_2);
			GLOBAL_OBJ.tableEffectPlayer.removeEffect(this.dingqueEffect_3);
			this.dingqueEffect_1 = null;
			this.dingqueEffect_2 = null;
			this.dingqueEffect_3 = null;
		},

		windowClose:function() {
            this._super();
			this.onRemoveEffects();
		}

	});
	//end

})();