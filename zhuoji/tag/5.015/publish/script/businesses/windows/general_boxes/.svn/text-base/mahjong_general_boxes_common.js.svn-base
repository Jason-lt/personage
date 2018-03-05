/*************************************************************
 *  mahjong_general_boxes_common.js
    mahjong_general_boxes_common
 *  mahjong
 	通用弹窗window
 *
 *  Created by nick.kai.lee on 16-03-08
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var C2S = GLOBAL_OBJ.businesses.network.C2S;
	var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
	var MODEL = GLOBAL_OBJ.businesses.windows.GeneralBoxes.Model;
	
	GLOBAL_OBJ.businesses.windows.GeneralBoxes.Common = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"businesses.windows.GeneralBoxes.Common",
		ctor: function(_params) {
			this._super();
			this.params = _params;
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();

			//中间内容
			var content = this.params["content"]||"";
			this.contentLabel.setString(content);

            // GLOBAL_OBJ.LOGD("boxex_common:", JSON.stringify(content));

			var buttons = this.params["buttons"] || [];
            // GLOBAL_OBJ.LOGD("boxex_common_buttons:", JSON.stringify(buttons));
			if (this.midNode)   { this.midNode.setVisible(false); }
			if (this.rightNode) { this.rightNode.setVisible(false); }
			if (this.leftNode)  { this.leftNode.setVisible(false); }
			switch(buttons.length){
				case 1:
					this.midNode.setVisible(true);
					this.midButtonTextLabel.setString(buttons[0]["content"]||"");
					break;
				case 2:
					this.rightNode.setVisible(true);
					this.leftNode.setVisible(true);
					this.leftButtonTextLabel.setString(buttons[0]["content"]||"");
					this.rightButtonTextLabel.setString(buttons[1]["content"]||"");
					break;
				default:
					break;
			}

		},

		/*
		弹窗弹出完毕
		*/
		onEase:function(){
			this._super();
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
			var button  = buttons[0]||{};
			var tasks   = button["tasks"]||[];
			if (tasks.length > 0) {
				var task = tasks[0] || {};
				GLOBAL_OBJ.bkernel.utils.ToDoTasks.pushTask(task);
			}
			this.onClose();
		},

		onClickMidButton:function(){
			var buttons = this.params["buttons"] || [];
			var button  = buttons[0]||{};
			var tasks   = button["tasks"]||[];
			if (tasks.length > 0){
				var task    = tasks[0]||{};
				GLOBAL_OBJ.bkernel.utils.ToDoTasks.pushTask(task);
			}
			this.onClose();
		},

		onClickRightButton:function(){
			var buttons = this.params["buttons"] || [];
			var button  = buttons[1]||{};
			var tasks   = button["tasks"]||[];
			if (tasks.length > 0) {
				var task = tasks[0] || {};
				GLOBAL_OBJ.bkernel.utils.ToDoTasks.pushTask(task);
			}
			this.onClose();
		},
	});
	//end
})();

