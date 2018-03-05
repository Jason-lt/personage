/*************************************************************
 *  mahjong_table_banker_play_tips.js
    mahjong_table_banker_play_tips
 *  mahjong
 	麻将牌桌文字提示
 *
 *  Created by xujing 17-11-1
 *  特殊说明：
 	庄家优先出牌TIPS
    使用方法:

 */
(function(){
    var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.windows.TableTips.BankerPlayTips = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"table.windows.TableTips.BankerPlayTips",
		ctor: function(_params) {
			this._super();
			this.init(GLOBAL_OBJ.RES.TABLE_BANKER_PLAY_TIPS_CCBI);
		},

		init:function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();
		},

		onCleanup:function() {
			this._super();
		}
	});
	//end

})();

