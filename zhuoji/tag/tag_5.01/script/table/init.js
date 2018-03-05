/*****************************************
 *  init.js
    初始化麻将 table JS环境
 *  mahjong
 *  牌桌层
 *  Created by nick.kai.lee on 16-05-31
 *  特殊说明：

 	业务模块的结构：
	include.json tuyoo项目中无效
	init.js 模块的命名空间初始化
	mahjong_c2s.js 业务需要的通用请求api
	mahjong_events.js 业务需要的通知事件
	mahjong_functions.js 一些通用方法
	mahjong_global.js 全局通用数据，如游戏id
	boot.js 启动
    使用说明:
 */
(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table = GLOBAL_OBJ.table || {
		_TAG:"table",
	};

	/*
	@启动table(不希望使用者关注流程，只需要启动业务即可)
	*/
	GLOBAL_OBJ.table.boot = function(){
		GLOBAL_OBJ.LOGD(this._TAG,"牌桌层加载");

		//1.启动业务层-游戏世界
		GLOBAL_OBJ.table.GameWorld.boot();

		/*
		@table层*/
		GLOBAL_OBJ.table.network.boot();

		// module
		GLOBAL_OBJ.table.modules.boot();

		// utils
		GLOBAL_OBJ.table.utils.boot();
	};

	/*
	@关闭table
	*/
	GLOBAL_OBJ.table.shut = function(){
		GLOBAL_OBJ.LOGD(this._TAG,"牌桌层卸载");

		// utils
		GLOBAL_OBJ.table.utils.shut();

		// module
		GLOBAL_OBJ.table.modules.shut();

		/*
		@table层*/
		GLOBAL_OBJ.table.network.shut();
		GLOBAL_OBJ.table.GameWorld.shut();
	};
	
})();