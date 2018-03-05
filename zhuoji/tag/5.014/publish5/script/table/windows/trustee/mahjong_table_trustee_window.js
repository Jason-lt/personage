/*************************************************************
 *  mahjong_table_ready_hand_window.js
    mahjong_table_ready_hand_window
 *  mahjong
 	麻将牌桌听牌
 *
 *  Created by nick.kai.lee on 16-06-17
 *  特殊说明：
 	
    使用方法:

 */
(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.windows.Trustee.Window = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"table.windows.Trustee.Window",
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

		onCancelTrustee:function(){
			this.dispatchEvent({name:"CANCEL"});
		},

		onPingBiTrustee:function () {},//托管界面屏蔽吃碰杠按钮
		
		/*
		@是否监听物理返回键，默认监听。不监听的在子类中重写返回false即可*/ 
		isKeyBackListenEnabled:function(){
			return false;
		},

		/*
		@touch响应，基类重载*/
        onTouchBegan:function(_touch, _event){
            var touch = _touch;
            var point = this._bgNode.convertToNodeSpace(touch.getLocation());
            var rect  = GLOBAL_OBJ.bkernel.Functions.boundingBoxRefWorld( this._bgNode );
            if (!cc.rectContainsPoint(rect, point)) {
                return false;
            };
            return true;
        },
	});
	//end

	/*
	测试用例*/
	GLOBAL_OBJ.table.windows.Trustee.Window.test = function(){
		
	};
})();

