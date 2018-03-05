/*************************************************************
 *  mahjong_table_offline_window.js
    mahjong_table_offline_window
 *  mahjong
 	麻将牌 掉线
 *
 *  Created by nick.kai.lee on 17-01-16
 *  特殊说明：
    使用方法:
 */
 
(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.windows.Offline.Window = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"table.windows.Offline.Window",
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

		onEase:function(){
			this._super();
		},

		/*
		@是否监听物理返回键，默认监听。不监听的在子类中重写返回false即可*/ 
		isKeyBackListenEnabled:function(){
			return false;
		},

				/*
		@touch响应，基类重载*/
        onTouchBegan:function(_touch, _event){
            var touch = _touch;
            var point = this.view.ccbRootNode.convertToNodeSpace(touch.getLocation());
            var rect  = this._bgNode.getBoundingBox();
            if (cc.rectContainsPoint(rect, point)) {
            	hall.GlobalFuncs.checkNet();
            };
            return true;
        },
	});
	//end

})();

