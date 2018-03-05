/*****************************************
 *  init.js
    初始化麻将 牌桌相关modules JS环境
 *  mahjong
 *  Created by zengxx on 16-06-07
 *  特殊说明：

    使用说明:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.table.modules = {};

	/*
	@启动module业务(不希望使用者关注流程，只需要启动业务即可)
	*/
	GLOBAL_OBJ.table.modules.boot = function(){
		/*
		@module层*/
		GLOBAL_OBJ.table.modules.Table.boot();
		GLOBAL_OBJ.table.modules.Mahjong.boot();
	};

	/*
	@关闭业务
	*/
	GLOBAL_OBJ.table.modules.shut = function(){
		GLOBAL_OBJ.table.modules.Table.shut();
		GLOBAL_OBJ.table.modules.Mahjong.shut();
	};
})();