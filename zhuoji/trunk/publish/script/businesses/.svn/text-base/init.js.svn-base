/*****************************************
 *  init.js
    初始化麻将 businesses JS环境
 *  mahjong
 *  业务层
 *  Created by nick.kai.lee on 15-12-28
 *  特殊说明：

 	业务模块的结构：
	include.json tuyoo项目中无效
	init.js 模块的命名空间初始化
	mahjong_c2s.js 业务需要的通用请求api（给子模块扩展）
	mahjong_events.js 业务需要的通知事件（给子模块扩展）
	mahjong_functions.js 一些通用方法
	mahjong_game_world.js 游戏世界，负责转接S2C数据到注册模块的model层
	mahjong_resource.js  资源宏，禁止手动修改
	mahjong_global.js 全局通用数据，如游戏id
	boot.js 启动（业务内核+业务）
    使用说明:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.businesses = GLOBAL_OBJ.businesses || {
		_TAG:"businesses",
	};

	/*
	@启动业务(不希望使用者关注流程，只需要启动业务即可)
	*/
	GLOBAL_OBJ.businesses.boot = function(){
		GLOBAL_OBJ.businesses.shut();//关闭环境

		//1.启动内核层
		GLOBAL_OBJ.bkernel.boot();

		GLOBAL_OBJ.LOGD(this._TAG,"\n业务环境启动");
		
		//2.启动业务层-游戏世界
		GLOBAL_OBJ.businesses.GameWorld.boot();

		/*
		@业务层*/
		//C2S Request
		GLOBAL_OBJ.businesses.network.C2S.boot();
		//S2C Response
		GLOBAL_OBJ.businesses.network.S2C.boot();
		//modules
		GLOBAL_OBJ.businesses.modules.boot();

		GLOBAL_OBJ.table.boot();
	};

	/*
	@关闭业务
	*/
	GLOBAL_OBJ.businesses.shut = function(){
		GLOBAL_OBJ.LOGD(this._TAG,"\n业务环境关闭");
		
		GLOBAL_OBJ.table.shut();

		/*
		@业务层*/
		GLOBAL_OBJ.businesses.modules.shut();
		GLOBAL_OBJ.businesses.network.S2C.shut();
		GLOBAL_OBJ.businesses.network.C2S.shut();
		GLOBAL_OBJ.businesses.GameWorld.shut();

		GLOBAL_OBJ.bkernel.shut();

		if (GLOBAL_OBJ.tableEffectPlayer)
		{
			GLOBAL_OBJ.tableEffectPlayer.destroy();
			GLOBAL_OBJ.tableEffectPlayer = null;
		}

		GLOBAL_OBJ.inPlugInHall = false;
		GLOBAL_OBJ.plugInStep = 0;
	};
})();