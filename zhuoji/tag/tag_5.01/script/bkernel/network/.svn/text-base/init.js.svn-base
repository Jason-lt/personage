/*****************************************
 *  init.js
    初始化麻将网络模块的JS环境
 *  mahjong
 *
 *  Created by nick.kai.lee on 15-12-26
 *  特殊说明：

    使用说明:
 */
(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.bkernel.network = {
		_TAG:"bkernel.network",
	};

	/*
	@启动模块
	*/
	GLOBAL_OBJ.bkernel.network.boot = function(){
		GLOBAL_OBJ.LOGD(this._TAG,"MODULE LOAD");

		//C2S Request
		GLOBAL_OBJ.bkernel.network.C2S.boot();
		//S2C Response
		GLOBAL_OBJ.bkernel.network.S2C.boot();
		//C2S freq
		GLOBAL_OBJ.bkernel.network.C2SFrequency.boot();

		GLOBAL_OBJ.bkernel.network.MsgCache.boot();
	};

	/*
	@关闭模块
	*/
	GLOBAL_OBJ.bkernel.network.shut = function(){
		GLOBAL_OBJ.LOGD(this._TAG,"MODULE UNLOAD");
		
		GLOBAL_OBJ.bkernel.network.MsgCache.shutAll();
		GLOBAL_OBJ.bkernel.network.C2SFrequency.shut();
		GLOBAL_OBJ.bkernel.network.S2C.shut();
		GLOBAL_OBJ.bkernel.network.C2S.shut();

	};
})();