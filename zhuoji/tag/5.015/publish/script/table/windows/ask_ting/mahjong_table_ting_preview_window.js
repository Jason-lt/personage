/*************************************************************
 * mahjong_table_ting_preview_window.js
 * 麻将牌桌听牌预览弹窗
 *  Created by simon on 17-12-13
 */
(function(){
	"use strict";
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.windows.TingPreview.Window = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"table.windows.TingPreview.Window",
		ctor: function( _params ) {
			this._super();
			this.params = _params;
			this.onClose = _params.onClose;
		},

		init:function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();
            //信息面板
            this.panel = new GLOBAL_OBJ.table.windows.TingPreview.Tips();
            this.tingPreviewPanelNode.addChild(this.panel.getRootNode());
            this.tingPreviewPanelNode.setVisible(false);
			
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
			this._super();

            // var that  = this;
            // var touch = _touch;
            //
            // var point = this.view.ccbRootNode.convertToWorldSpace(touch.getLocation());
            // var pos = this.panel.bgSpr.convertToWorldSpace(cc.p(0, 0));
            // var rect  = this.panel.bgSpr.getBoundingBox();
            // rect.x = pos.x;
            // rect.y = pos.y;
            // if (!cc.rectContainsPoint(rect, point)) {
            //     that.onClose();
            //     return false;
            // };

			return false;
		},

		onTouchEnded:function(_touch, _event){
			this._super();
		},

		setTipsVisible:function (_visible) {
			this.tingPreviewPanelNode.setVisible(_visible);
        },


		/*
		@更新数据，动态改变panel size
		params _data:panel里需要的数据
		params _slotPositon:操作区域里牌槽的坐标
		*/
		update:function(_data, _slotPositon){
			var count = _data ? _data.length : 0;
			this.tingPreviewPanelNode.setVisible( count > 0 );
			this.panel.update(_data);
			// var point       = _slotPositon;
			// var panel_size  = this.panel.getRootNode().getContentSize();
			// var parent_size = this.tingPreviewPanelNode.getContentSize();
			// var fixed_x     = 0;
			// if 		 (point.x-panel_size.width*0.5<0) {
			// 	fixed_x = panel_size.width*0.5-point.x;
			// }else if (point.x+panel_size.width*0.5>parent_size.width) {
			// 	fixed_x = -(panel_size.width*0.5-(parent_size.width-point.x));
			// };
			// this.panel.getRootNode().setPosition( cc.p(point.x+fixed_x, 0) );//原来是跟随点击麻将的位置显示

			var size = cc.director.getWinSize();
			this.panel.getRootNode().setPosition( cc.p(size.width/2, _slotPositon) );//放在屏幕中间
		},

	});
	//end

})();