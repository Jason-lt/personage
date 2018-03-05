/*************************************************************
 *  mahjong_table_ting_window.js
 *	麻将牌桌听牌
 *  Created by simon on 17-12-14
 */

(function(){
	var GLOBAL_OBJ = guiyang;
    var MODEL_TINGRESULT = GLOBAL_OBJ.table.models.Ting_Result;

	GLOBAL_OBJ.table.windows.Ting.TingWindow = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"table.windows.Ting.TingWindow",
		ctor: function() {
			this._super();
			this.data = [];
		},

		init:function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();

			this.panel = new GLOBAL_OBJ.table.windows.TingPreview.Tips();
			this.panelNode.addChild(this.panel.getRootNode());
		},

		onCleanup:function() {
			this._super();
		},

		onEase:function(){
			this._super();
		},

		// 阻断吃碰杠按钮
        onTouchBlock:function () {},

		/*
		@touch响应，基类重载*/
        onTouchBegan:function(_touch, _event){
        	GLOBAL_OBJ.LOGD(this._TAG, "ting_touch_begin");
            var that  = this;
            var touch = _touch;

            var point = this.view.ccbRootNode.convertToWorldSpace(touch.getLocation());
            var pos = this.panel.bgSpr.convertToWorldSpace(cc.p(0, 0));
            var rect  = this.panel.bgSpr.getBoundingBox();
            rect.x = pos.x;
            rect.y = pos.y;
            if (!cc.rectContainsPoint(rect, point)) {
            	if (that.panelNode.isVisible()) {
                    that.panel.onClose();
                    this.panelNode.setVisible(false);
				}
            };

            return false;
        },

		onCheckTingDetail:function(){
        	var data = MODEL_TINGRESULT.getTingResult();
			this.panel.update(data.length > 0 ? data : this.data);
			this.panelNode.setVisible(!this.panelNode.isVisible());
		},
		
		/*
		@是否监听物理返回键，默认监听。不监听的在子类中重写返回false即可*/ 
		isKeyBackListenEnabled:function(){
			return false;
		},

		// 刷新听胡详情数据
		update:function(_data){
			this.data = _data || [];
            var count = _data ? _data.length : 0;
            this.panelNode.setVisible( count > 0 );
            this.panel.update(_data);
		},
	});
	//end
})();

