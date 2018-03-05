/*****************************************
 *  init.js
    初始化麻将 bkernel JS环境
 *  mahjong
 *
 *  Created by nick.kai.lee on 15-12-28
 *  特殊说明：
	bkernel: businesses kernel(业务内核)
    使用说明:
 */
(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.bkernel = GLOBAL_OBJ.bkernel || {
		_TAG:"bkernel",
	};

	/*
	@启动业务内核
	*/
	GLOBAL_OBJ.bkernel.boot = function(){
		GLOBAL_OBJ.LOGD(this._TAG,"\n内核环境启动");
		//游戏env
		GLOBAL_OBJ.bkernel.env.boot();
		
		//网络模块
		GLOBAL_OBJ.bkernel.network.boot();

		//windows
		GLOBAL_OBJ.bkernel.windows.boot();

		GLOBAL_OBJ.bkernel.utils.boot();
	};

	/*
	@关闭业务内核
	*/
	GLOBAL_OBJ.bkernel.shut = function(){
		GLOBAL_OBJ.LOGD(this._TAG,"\n内核环境关闭");
		GLOBAL_OBJ.bkernel.utils.shut();
		GLOBAL_OBJ.bkernel.windows.shut();
		GLOBAL_OBJ.bkernel.network.shut();
		GLOBAL_OBJ.bkernel.env.shut();
	};

})();