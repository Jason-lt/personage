/*************************************************************
 *  mahjong_table_windows_tips_window.js
 	mahjong_table_windows_tips_window
 *  mahjong
 	麻将牌桌文字提示
 *
 *  Created by lcr 17-05-31
 *  特殊说明：
 	
    使用方法:

 */
(function(){
    var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.windows.TableTips.Window = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"table.windows.TableTips.Window",
		ctor: function(_params) {
			this._super();
			this._params = _params;
			this.tipType = _params.tipType;

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
		@touch响应，基类重载*/
        onTouchBegan:function(_touch, _event){
            var touch = _touch;
            var point = this.view.ccbRootNode.convertToNodeSpace(touch.getLocation());
            var rect  = this._bgNode.getBoundingBox();
            if (!cc.rectContainsPoint(rect, point)) {
                return false;
            };
            return true;
        },

		setSwallowTouches:function(_ret){
			//是否吞噬touch
			this.touchListener.setSwallowTouches(_ret);
		},

		update:function(){
			this.setSwallowTouches(false);

			this.tabletipsText_00.setString("");
			if(this.tipType.length > 0){
				this.tabletipsText_00.setString(this.tipType);
			}else{
				this.tableTipNode.setVisible(false);
			}
			this.tabletipsText_00.enableOutline(cc.color(0,0,0), 2);
		},
		
		/*
		@是否监听物理返回键，默认监听。不监听的在子类中重写返回false即可*/ 
		isKeyBackListenEnabled:function(){
			return false;
		},

	});
	//end

})();

