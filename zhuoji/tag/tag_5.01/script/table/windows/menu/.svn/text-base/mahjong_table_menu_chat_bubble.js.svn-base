/*************************************************************
 *  mahjong_table_menu_chat.js
    mahjong_table_menu_chat
 *  mahjong
 	麻将牌 菜单
 *
 *  Created by nick.kai.lee on 16-06-12
 *  特殊说明：
    使用方法:

 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var C2S = GLOBAL_OBJ.table.network.C2S;
	var GLOBAL_T = GLOBAL_OBJ.table.global;
	var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
	var MODEL_TABLEINFO = GLOBAL_OBJ.table.models.TableInfo;
	
	GLOBAL_OBJ.table.windows.Menu.Chat.Bubble = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"table.windows.Menu.Chat.Bubble",
		ctor: function() {
			this._super();
		},

		init:function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();
		},

		onCleanup:function() {
			this._super();
		},

		setString:function(_content){
			this.lblText.setString(_content);
			var that  = this;
			var size0 = this.lblText.getContentSize();
			var size1 = this.contentSpr.getContentSize();
			var width = size0.width+40;
			this.contentSpr.setContentSize(cc.size(width<174?174:width, size1.height));
			this.async(function(){
				that.getRootNode().removeFromParent();
			}, 3);
		},

		setTextOffset:function()
		{
			this.contentSpr.setScale(-1, 1);
			var offsetX = this.lblText.getContentSize().width;
			this.lblText.setPositionX(this.lblText.getPositionX()+this.contentSpr.getContentSize().width);
		},
	});
	//end

})();

