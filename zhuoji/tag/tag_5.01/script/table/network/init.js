/*****************************************
 *  init.js
    初始化麻将网络模块的JS环境
 *  mahjong
 *
 *  Created by zengxx on 16-06-07
 *  特殊说明：

    使用说明:
 */
(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.network = {
		_TAG:"table.network",
	};

	/*
	@启动业务内核
	*/
	GLOBAL_OBJ.table.network.boot = function(){
		GLOBAL_OBJ.LOGD(this._TAG,"MODULE LOAD");

		//C2S Request
		GLOBAL_OBJ.table.network.C2S.boot();
		//S2C Response
		GLOBAL_OBJ.table.network.S2C.boot();
	};

	/*
	@关闭业务内核
	*/
	GLOBAL_OBJ.table.network.shut = function(){
		GLOBAL_OBJ.LOGD(this._TAG,"MODULE UNLOAD");

		GLOBAL_OBJ.table.network.S2C.shut();
		GLOBAL_OBJ.table.network.C2S.shut();
	};
})();