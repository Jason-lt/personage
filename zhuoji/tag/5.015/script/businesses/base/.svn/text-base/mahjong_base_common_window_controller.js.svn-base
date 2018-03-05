/*************************************************************
 *  mahjong_base_common_window_controller.js
    mahjong_base_common_window_controller
 *  mahjong
 	tip 弹窗
 *
 *  Created by nick.kai.lee on 15-09-11
 	Modify by zengxx on 16-01-11
 *  特殊说明：
	
    使用方法:
	
 */
(function(){
	var GLOBAL_OBJ = guiyang;

	var GLOBAL_FUNCS					               = GLOBAL_OBJ.businesses.functions;
	GLOBAL_OBJ.businesses.base.BaseCommonWindowController = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG: 'GLOBAL_OBJ.businesses.base.BaseCommonWindowController',
		ctor:function (_params) {
			this._super();
	       	this.params = _params;
		},

		init:function(_ccb){
			this._super(_ccb);
		},

		onLoad: function() {
			// 继承
			this._super();
		},

		onClose:function(){
			this.playAnim("default");
			this.windowClose();
		},

		onEase:function(){
			this._super();
		},

		setContent:function(_controller){
			var that        = this;
			this.controller = _controller;
			this._contentNode.addChild(_controller.view.ccbRootNode);
			_controller.addEventListener("CLOSE",function(){
				that.onClose();
			});
		},
	});
})();
