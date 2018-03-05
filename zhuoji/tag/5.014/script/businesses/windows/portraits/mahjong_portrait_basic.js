/*************************************************************
 *  mahjong_portrait_basic.js
    mahjong_portrait_basic
 *  mahjong
 	麻将 基础头像
 *
 *  Created by nick.kai.lee on 16-08-06
 *  特殊说明：
 	
    使用方法:

 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var MODEL                            	   = GLOBAL_OBJ.businesses.modules.User.Model;
	GLOBAL_OBJ.businesses.windows.Portraits.Basic = GLOBAL_OBJ.businesses.base.Portrait.extend({
		_TAG:"table.windows.Portrait.Basic",
		ctor: function(_params) {
			this._super(_params);
		},

		onLoad: function() {
			this._super();
		},

		onCleanup:function() {
			this._super();
		},

		update:function(_userId, _imagePath) {
			this._super(_userId, _imagePath);
			if (true == GLOBAL_OBJ.businesses.global.DEBUG) {
				this.userIdLabel.setString(this.getUserId());	
			}
		}
	});
	//end

	/*
	测试用例*/
	GLOBAL_OBJ.businesses.windows.Portraits.Basic.test = function( _uid ){
		GLOBAL_OBJ.businesses.modules.User.Portrait.produce( _uid,
            GLOBAL_OBJ.businesses.windows.consts.C_PORTRAIT_BASIC_WINDOW, cc.Director.getInstance().getRunningScene());
	};
})();

