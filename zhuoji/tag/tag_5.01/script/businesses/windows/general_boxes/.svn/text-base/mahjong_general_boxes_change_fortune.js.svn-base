/*************************************************************
 *  mahjong_general_boxes_fortune.js
    mahjong_general_boxes_fortune
 *  mahjong
 	转运礼包window
 *
 *  Created by nick.kai.lee on 16-03-08
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var C2S 								              = GLOBAL_OBJ.businesses.network.C2S;
	var GLOBAL_FUNCS							          = GLOBAL_OBJ.businesses.functions;
	var MODEL                                             = GLOBAL_OBJ.businesses.windows.GeneralBoxes.Model;
	GLOBAL_OBJ.businesses.windows.GeneralBoxes.ChangeFortune = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"businesses.windows.GeneralBoxes.ChangeFortune",
		ctor: function(_params) {
			this._super();
			this.params = _params;
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();

			var buttons = this.params["buttons"] || [];
			this.leftButtonTextLabel.setString(buttons[1]["content"]||"");
			this.rightButtonTextLabel.setString(buttons[0]["content"]||"");

			this.contentLabel_1.setString(this.params["content1"]||"");
			this.contentLabel_2.setString(this.params["content2"]||"");
			this.rmbLabel.setString(this.params["rmb"]||"");
			this.chipLabel.setString( GLOBAL_FUNCS.currencyUnitFormat(this.params["coin"]||0) );
		},

		/*
		弹窗弹出完毕
		*/
		onEase:function(){
			this._super();
			/*
			@请求数据*/
			MODEL.activate()
		},

		onClose:function(){
			this.windowClose();
		},

		onCleanup:function(){
			this._super();
		},

		/*
		touch响应，基类重载
		*/
		onTouchBegan:function(_touch,_event){
			this._super();
 			return true;
		},

		/*
		@按钮
		按钮分左，中，右3种，只能同时出现左右或者中。
		右和中代表确定，左代表否定*/
		onClickLeftButton:function(){
			var buttons = this.params["buttons"] || [];
			var button  = buttons[1]||{};
			var tasks   = button["tasks"]||[];
			var task    = tasks[0]||{};
			GLOBAL_OBJ.bkernel.utils.ToDoTasks.pushTask(task);
			this.onClose();
		},

		onClickRightButton:function(){
			var buttons = this.params["buttons"] || [];
			var button  = buttons[0]||{};
			var tasks   = button["tasks"]||[];
			var task    = tasks[0]||{};
			GLOBAL_OBJ.bkernel.utils.ToDoTasks.pushTask(task);
			this.onClose();
		},

	});
	//end
})();

