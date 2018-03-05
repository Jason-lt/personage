/*************************************************************
 *  mahjong_general_boxes_wechat_share.js
    mahjong_general_boxes_wechat_share
 *  mahjong
 	分享window
 *
 *  Created by zengxx on 16-07-15
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var C2S 								              = GLOBAL_OBJ.businesses.network.C2S;
	var GLOBAL_FUNCS							          = GLOBAL_OBJ.businesses.functions;
	var MODEL                                             = GLOBAL_OBJ.businesses.windows.GeneralBoxes.Model;
	GLOBAL_OBJ.businesses.windows.GeneralBoxes.WeChatShare = GLOBAL_OBJ.businesses.windows.GeneralBoxes.Common.extend({
		_TAG:"businesses.windows.GeneralBoxes.WeChatShare",

		onLoad:function(){
			this._super();

			this['closeBtn'].setVisible(true);
		},
		/*
		@按钮
		按钮分左，中，右3种，只能同时出现左右或者中。
		右和中代表确定，左代表否定*/
		onClickLeftButton:function(){
			hall.ShareInterface.shareWithUrl(this.params['title'], this.params['desc'], this.params['url'], this.params['buttons'][1]['type']);
			this.onClose();
		},

		onClickRightButton:function(){
			hall.ShareInterface.shareWithUrl(this.params['title'], this.params['desc'], this.params['url'], this.params['buttons'][0]['type']);
			this.onClose();
		},

	});
	//end
})();

