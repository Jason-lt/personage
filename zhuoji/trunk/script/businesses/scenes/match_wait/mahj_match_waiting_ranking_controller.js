// File: mahj_match_waiting_ranking_controller.js
// Date: 2016-04-13 20:37:55
// Author: wuyangwei
/* Description:
*  定时比赛中场等待界面的比赛排名界面 位于主等待界面的右下角
*/
(function () {
	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.businesses.scenes.MatchWait.MatchWaitingRankingItemController = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.MatchWait.MatchWaitingRankingItemController",

		ctor:function () {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG, " ctor new");
			//  排名参赛人的积分信息
			// * ranking:排名
			// * name:昵称
			// * points:积分

			this.init(GLOBAL_OBJ.RES.MAHJ_MATCH_WAITING_RANKING_ITEM_CCBI);
		},

		onLoad: function () {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG," in _load");
		},

		onCleanup:function () {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG," in destroy");
		},

		// 刷新参赛者的信息
		refreshPlayInfo:function (info) {
			this["txtOrder"].setString(info.ranking);
			var showName = hall.GlobalFuncs.SliceStringToLength(info.name, 14);
			this["txtName"].setString(showName);
			if(!info.points && info.points != 0){
				this["txtScroe"].setString("null");
			}else{
				this["txtScroe"].setString(info.points);
			}

			this._refreshBackground(info.name);
		},

		_refreshBackground:function (name) {
			this["spriteBg"].setVisible(name == hall.ME.udataInfo.m_name);
		}
	});
})();
