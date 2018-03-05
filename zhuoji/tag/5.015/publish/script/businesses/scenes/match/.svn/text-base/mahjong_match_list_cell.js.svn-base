/*************************************************************
 * mahjong_match_list_cell.js
 *  mahjong
 	房间列表 cell
 *
 *  Created by xujing on 17-11-10
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ  = guiyang;
	var MODEL;
	var MODEL_MATCH;

	GLOBAL_OBJ.businesses.scenes.Match.Cell = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.RoomList.Cell",

		ctor: function(_index,_playMode, owner_p) {
			this._super();
                        MODEL_MATCH = GLOBAL_OBJ.businesses.scenes.Match.Model;
			MODEL       = GLOBAL_OBJ.businesses.scenes.RoomList.Model;

			this.index  = _index;
			this.playMode = _playMode;
			this._owner = owner_p;

			this._matchType = GLOBAL_OBJ.MatchType.quick_upgrade_match;

			this.init(GLOBAL_OBJ.RES.MAHJ_MATCH_LIST_ELL_CCBI);
		},

		isTimeMatch:function () {
			return this._matchType == GLOBAL_OBJ.MatchType.stage_match;
		},

		onLoad: function() {
			this._super();

			/*
			@bind_block_scrolling_touch扩展，可以扩展一个适用于tableview的按钮扩展，该api返回touch管理者，提供默认的几个api
			详情参考源码
			该模块将edgeNode设置的和touchNode一致，就是一个普通按钮，仅仅是滑动时不支持touch响应而已
			外部使用getTouchManager暴露出去的touch管理者，重新设置edgeNode，以便支持tableview边界时屏蔽touch
			*/

			// var playMode = this.playMode;
			var that = this;

			var roomModel = MODEL.getMatchRoom(this.index);
			this._roomInfo = roomModel;
			this._matchType = roomModel.type;
			// if (this._matchType == GLOBAL_OBJ.MatchType.stage_match && this._roomInfo.roomId.toString().length > 6){
			// 	this._roomInfo.roomId = parseInt(this._roomInfo.roomId.toString().substr(0,6));
			// }

			var imgMask = this['imgMask'];
			var bgNode = this['bgNode'];

			this.manager = GLOBAL_OBJ.bkernel.extend.Touch.bind_simple_touch(
				bgNode,
				false,
				function(listener, touch, event){ /*touch began*/
					imgMask.setVisible(true);
					hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);
					return true;
				},
				function(listener, touch, event){
					var point = bgNode.convertToNodeSpace(touch.getLocation());
					var rect  = GLOBAL_OBJ.bkernel.Functions.boundingBoxRefSelf(bgNode);
					imgMask.setVisible(cc.rectContainsPoint(rect, point));
				},
				function(listener, touch, event){
					/*touch ended*/
					imgMask.setVisible(false);
					//弹出报名窗口
					that._owner.showDetailsWin(roomModel);
				},
				function(){ /*touch canceled*/
					imgMask.setVisible(false);
					return false;
				}
			);

			this['txtTitle'].setString(roomModel.name + "");
			this['txtOnLine'].setString( roomModel.onlineCount + "");
			// this['txtTask'].setString(roomModel.taskDesc);

			if (this.isTimeMatch()){
				this._showTimeMatchInfo();
			}
			else {
				this['txtTask'].setString(roomModel.taskDesc);
			}

			this['imgSeleced'].setVisible(GLOBAL_OBJ.MATCH_SELECT_ID == this.index);

			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_MAHJ_TIME_MATCH_SIGNIN, this._onTimeMatchSignIn, this);
			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_MAHJ_TIME_MATCH_SIGNOUT, this._onTimeMatchSignIn, this);
			GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_OBJ.businesses.Events.UPDATE_ROOM_ONLINE, this._updateOnline, this);
			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_TIME_MATCH_SIGNS, this._signStageChange, this);
		},

		_updateOnline:function () {
			//更新在线人数
			var onlineNum = MODEL.getRoomOnlines(this._roomInfo.roomId, this._roomInfo.matchId);
			this['txtOnLine'].setString( onlineNum + "");
		},

		_signStageChange:function () {
			if (this.isTimeMatch()){
				this._showTimeMatchInfo();
			}
		},
		
		_showTimeMatchInfo:function () {
			var leftTime = this._getLeftTime();
			GLOBAL_OBJ.LOGD(this._TAG, "_showTimeMatchInfo : " + leftTime);
			if (this._getLeftTime() <= GLOBAL_OBJ.MatchStartCountDownTime){
				//即将开赛的，显示即将开赛角标，并显示倒计时
				this._startCountDown();
			}
			else{
				this._prepareCountDown();
			}
		},

		_onTimeMatchSignIn:function (val) {
			if (val.roomId != this._roomInfo.roomId) return;
			this._showTimeMatchInfo();
		},

		/**
		 * 获取当前剩余时间
		 * @returns {number}
		 * @private
		 */
		_getLeftTime:function () {
			var curTime = GLOBAL_OBJ.bkernel.utils.GlobalTimer.getTime();
			GLOBAL_OBJ.LOGD(this._TAG, "_showTimeMatchInfo : curTime " + curTime);
			GLOBAL_OBJ.LOGD(this._TAG, "_showTimeMatchInfo : this._roomInfo.startTime " + this._roomInfo.startTime);
			return this._roomInfo.startTime - curTime;
		},

		_getStartTime:function () {
			return GLOBAL_OBJ.Util.formatTimeForTimeStamp('yy-mm-dd h:m:s', this._roomInfo.startTime) + "开赛";
		},

		/**
		 * 准备倒计时
		 * @private
		 */
		_prepareCountDown:function () {
			GLOBAL_OBJ.LOGD(this._TAG, "_prepareCountDown ");
			this['txtTask'].setString(this._getStartTime());
			this['imgWillStart'].setVisible(false);
			this['imgBao'].setVisible(MODEL_MATCH.checkIsSign(this._roomInfo.roomId));

			var leftTime = this._getLeftTime() - GLOBAL_OBJ.MatchStartCountDownTime;
			var that = this;
			if (leftTime <= 0) {
				that._startCountDown();
				return;
			}
			this.rootNode.scheduleOnce(function () {
				that._startCountDown();
			},leftTime);
		},

		_startCountDown:function () {
			var that = this;
			that['imgBao'].setVisible(false);
			var leftTime = this._getLeftTime();
			if (leftTime < 0) {
				that['txtTask'].setString("... ...");
				that.rootNode.unscheduleAllCallbacks();
				GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_MAHJ_MATCH_LIST,{});
				return;
			} else {
				that['imgWillStart'].setVisible(true);
				that['txtTask'].setString(hall.GlobalFuncs.formatMinuteSecond(leftTime));
				that.rootNode.schedule(function () {
					leftTime--;
					if (leftTime < 0){
						that.rootNode.unscheduleAllCallbacks();
						GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_MAHJ_MATCH_LIST,{});
						return;
					}
					that['txtTask'].setString(hall.GlobalFuncs.formatMinuteSecond(leftTime));
				}, 1);
			}

		},

		onCleanup:function() {

			this.manager.unbind();
			this.manager = null;
			this._owner = null;

			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
			this._super();
		}
	});

})();