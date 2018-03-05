/*****************************************
 *  init.js
    初始化麻将 env JS环境
 *  mahjong
 *
 *  Created by nick.kai.lee on 15-12-26
 *  特殊说明：

    使用说明:
 */
(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.bkernel.env = {
		_TAG:"bkernel.env",
	};

	/*
	@启动模块
	*/
	GLOBAL_OBJ.bkernel.env.boot = function(){
		GLOBAL_OBJ.LOGD(this._TAG,"MODULE LOAD");

		//内核世界
		GLOBAL_OBJ.bkernel.env.GameWorld.boot();
	};

	/*
	@关闭模块
	*/
	GLOBAL_OBJ.bkernel.env.shut = function(){
		GLOBAL_OBJ.LOGD(this._TAG,"MODULE UNLOAD");
		//内核世界
		GLOBAL_OBJ.bkernel.env.GameWorld.shut();
	};
})();