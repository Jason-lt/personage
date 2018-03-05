/*****************************************
 *  init.js
    初始化麻将 modules JS环境
 *  mahjong
 *  一些完整功能性的模块
 *  Created by nick.kai.lee on 15-12-28
 *  特殊说明：

    使用说明:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.businesses.modules = {};

	/*
	@启动module业务(不希望使用者关注流程，只需要启动业务即可)
	*/
	GLOBAL_OBJ.businesses.modules.boot = function(){	
		/*
		@module层*/
		GLOBAL_OBJ.businesses.modules.User.boot();
	};

	/*
	@关闭业务
	*/
	GLOBAL_OBJ.businesses.modules.shut = function(){
		GLOBAL_OBJ.businesses.modules.User.shut();
	};
})();