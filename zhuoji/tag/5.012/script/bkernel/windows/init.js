/*****************************************
 *  init.js
    初始化麻将 functions JS环境
 *  mahjong
 *  一些完整功能性的模块
 *  Created by nick.kai.lee on 15-12-28
 *  特殊说明：

    使用说明:
 */
(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.bkernel.windows = {
		_TAG:"bkernel.windows",
	};

	/*
	@启动模块
	*/
	GLOBAL_OBJ.bkernel.windows.boot = function(){
		GLOBAL_OBJ.LOGD(this._TAG,"MODULE LOAD");

		//windows factory
		GLOBAL_OBJ.bkernel.windows.Factory.boot();
	};

	/*
	@关闭模块
	*/
	GLOBAL_OBJ.bkernel.windows.shut = function(){
		GLOBAL_OBJ.LOGD(this._TAG,"MODULE UNLOAD");
		
		//windows factory
		GLOBAL_OBJ.bkernel.windows.Factory.shut();
	};
})();