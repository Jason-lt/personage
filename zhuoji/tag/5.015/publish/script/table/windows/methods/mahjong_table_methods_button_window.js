/*************************************************************
 *  mahjong_table_methods_button_panel.js
    mahjong_table_methods_button_panel
 *  mahjong
 	麻将牌 吃碰杠主动操作按钮面板
 *
 *  Created by nick.kai.lee on 16-06-12
 *  特殊说明：
    使用方法:

 */
(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.windows.Methods.Window = cc.Class.extend({
		_TAG:"table.windows.Methods.Window",
		ctor: function() {

			this._contentSize = cc.size(852, 480);

			this.rootNode = cc.Node.create();
			this.rootNode.setContentSize(this._contentSize);
			this.rootNode.setAnchorPoint(0, 0);

			this.cells = [];

			GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_OBJ.businesses.Events.SHOW_METHOD_BTN, this.show, this);

			var that = this;
			this.rootNode.onCleanup = function () {
				that.onCleanup();
				that.rootNode.onCleanup = null;
			}
		},

		getRootNode:function () {
			return this.rootNode;
		},

		show:function () {
			if (GLOBAL_OBJ.inStart){
				return;
			}
			GLOBAL_OBJ.LOGD(this._TAG, "show_methods_button_windows");
			this.getRootNode().setVisible(true);
		},

		hide:function () {
			GLOBAL_OBJ.LOGD(this._TAG, "hide_methods_button_windows");
			this.getRootNode().setVisible(false);
		},

		shut:function () {
			//关闭窗口，清除面板上的cell
			this.hide();
			this.removeAllCell();
		},

		onCleanup:function() {
			this.cleanned = true;
			GLOBAL_OBJ.LOGD(this._TAG, "onCleanup");
			GLOBAL_OBJ.bkernel.utils.Notification.ignore( GLOBAL_OBJ.businesses.Events.SHOW_METHOD_BTN , this.show, this);
		},

		/*
		@刷新界面*/
		doUpdate:function( _data, _model){
			//创建 吃 碰 杠 取消
			var cellCount = Math.ceil(_data.length / 3);

			var cell;
			for (var i = 0; i < cellCount; i++){
				cell = new GLOBAL_OBJ.table.windows.Methods.Cell(i, _data, _model);
				this.cells.push(cell);
				this.rootNode.addChild(cell.getRootNode());
				cell.getRootNode().setPosition(0, i * cell._contentSize.height);
			}
		},

		removeAllCell:function () {
			GLOBAL_OBJ.LOGD(this._TAG, "removeAllCell");
			var cell;
			for (var i = 0; i < this.cells.length; i++){
				cell = this.cells[i];
				cell.destroy();
			}
			this.cells.length = 0;
		},

		destroy:function()
		{
			GLOBAL_OBJ.LOGD(this._TAG, "destroy");
			this.removeAllCell();
			this.cells = null;
			if (!this.cleanned){
				this.rootNode.removeFromParent();
			}
		}

	});

})();
