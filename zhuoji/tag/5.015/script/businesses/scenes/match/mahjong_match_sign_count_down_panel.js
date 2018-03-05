/*************************************************************
 *  mahjong_match_sign_count_down_panel.js
 *  mahjong
 	报名窗口倒计时
 *
 *  Created by xujing on 17-11-10
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.businesses.scenes.Match.SignCountDownPanel = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.Match.SignCountDownPanel",

		ctor: function() {
			this._super();
			this._curRestSeconds = 0;
			this.init(GLOBAL_OBJ.RES.MAHJ_MATCH_WAITING_COUNTDOWN_CCBI);
		},

		onLoad: function() {
			this._super();

		},

		// 倒计时数据
		_refreshCountdown:function (secs_p) {
			if (secs_p < 0) secs_p = 0;
			var secs = Math.round(secs_p);
			var hours = Math.floor(secs / (60 * 60));
			var divisor_for_minutes = secs % (60 * 60);
			var minutes = Math.floor(divisor_for_minutes / 60);
			var divisor_for_seconds = divisor_for_minutes % 60;
			var seconds = Math.ceil(divisor_for_seconds);
			function _format (num) {
				num = Math.min(9, Math.floor(num));
				return "" + num;
			}

			this["label_hours_1"].setString(_format(hours/10));
			this["label_hours_2"].setString(_format(hours%10));
			this["label_minutes_1"].setString(_format(minutes/10));
			this["label_minutes_2"].setString(_format(minutes%10));
			this["label_seconds_1"].setString(_format(seconds/10));
			this["label_seconds_2"].setString(_format(seconds%10));
		},

		/**
		 * 设置倒计时时间
		 * @param restTime 倒计时时间
		 */
		setCountdownTime:function (restTime) {
			if (restTime <=0) {
				return;
			}
			GLOBAL_OBJ.LOGD(this._TAG," setCountdownTime restTime = " + restTime);
			this._curRestSeconds = restTime;
			this._refreshCountdown(restTime);
			// 开始倒计时
			// var that = this;
			// this.unCountDown();
			// this.rootNode.schedule(function () {
			// 	// GLOBAL_OBJ.LOGD(this._TAG," setCountdownTime that._curRestSeconds = " + that._curRestSeconds);
			// 	that._curRestSeconds--;
			// 	that._refreshCountdown(that._curRestSeconds);
			// }, 1);

			ty.Timer.setTimer(this, this.onTick, 1, restTime-1);
		},

		onTick:function () {
			this._curRestSeconds--;
			this._refreshCountdown(this._curRestSeconds);
		},

		/**
		 * 取消倒计时
		 */
		unCountDown:function () {
			ty.Timer.cancelTimer(this, this.onTick);
			GLOBAL_OBJ.LOGD(this._TAG, "*********** 比赛停止倒计时");
			// this.rootNode.unscheduleAllCallbacks();
		},

		onCleanup:function() {
			this._super();
			this.rootNode.unscheduleAllCallbacks();
		}
	});

})();