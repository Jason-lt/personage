/**
 * mahj_match_rank_flag.js
 * 进度节点
 * Created by xujing on 17-11-13
 */
(function(){

	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.businesses.scenes.Match.RankFlag = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG :'businesses.scenes.Match.RankFlag',

		ctor:function () {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG," in ctor new");

			this.init(GLOBAL_OBJ.RES.MAHJ_MATCH_RANK_FLG_CCBI);
		},


		onLoad:function () {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG," _load");
		},

		/**
		 * 设置状态
		 * @param state 0：正常，1，当前选中的，2：未达成
		 */
		setState:function (state) {
			for (var i = 0; i < 3; i++){
				this['bg_' + i].setVisible(i == state);
			}
			//设置文字颜色
			this['txtRank'].setColor(state == 2 ? cc.color(255,255,255) : cc.color(66,66,66));
		},

		setNum:function (num) {
			this['txtRank'].setString(num+"");
		},

		onCleanup:function () {
			GLOBAL_OBJ.LOGD(this._TAG," destroy");
		}

	});

})();