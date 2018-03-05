/*************************************************************
 *  mahjong_base_scene_controller.js
    mahjong_base_scene_controller
 *  mahjong
 	麻将scene controller基类
 *
 *  Created by nick.kai.lee on 16-05-31
 *  特殊说明：
    使用方法:
 */

(function(){
	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.bkernel.base.BaseSceneController = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG: 'GLOBAL_OBJ.bkernel.base.BaseSceneController',
		ctor:function () {
			this._super();
		},

		init:function(_ccbi){
			this._super(_ccbi);
		},

		onLoad:function () {
			// 继承
			this._super();
			GLOBAL_OBJ.bkernel.utils.TestTool.create(this.getRootNode());
		},
		/*
		提供场景的提前释放资源*/
		onBeforeCleanup:function(){

		}
	});

})();
