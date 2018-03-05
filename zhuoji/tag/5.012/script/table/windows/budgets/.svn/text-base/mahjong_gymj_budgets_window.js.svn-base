/*************************************************************
 *  mahjong_gymj_budgets_window.js
    mahjong_gymj_budgets_window
 *  mahjong
 	贵阳捉鸡麻将牌桌结算
 *
 *  Created by LiaoTao
 *  特殊说明：
 	
    使用方法:

 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_T = GLOBAL_OBJ.table.global;

    GLOBAL_OBJ.table.windows.gymj.Budgets = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"table.windows.gymj.Budgets",
		ctor: function(_params) {
			this._super();
			this.params = _params;
		},

		onLoad: function() {
			this._super();
			var that    = this;
            var layer;

            // var patternFan = MODEL_ROUND_RESULT.getPatternInfoByLocalId(GLOBAL_T.MYSEAT);
            // GLOBAL_OBJ.LOGD("mahjong_gdmj_budgets_window.js", "是否是大胡");
            // if(patternFan.length > 0){//是否是大胡
             //    layer = new GLOBAL_OBJ.table.windows.SiChuan.XueZhan.Budgets.XZDHLayer( { parents:that, scene: this.params.scene});
            // }else{
             //    layer = new GLOBAL_OBJ.table.windows.gymj.result.Budgets.Layer( { parents:that, scene: this.params.scene});
            // }
			layer = new GLOBAL_OBJ.table.windows.gymj.result.Budgets.Layer( { parents:that, scene: this.params.scene});
			that.layerParentNode.addChild(layer.getRootNode());

			that.setSwallowTouches(false);
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
            return true;
        }
	});
	//end
})();