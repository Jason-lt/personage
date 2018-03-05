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

	GLOBAL_OBJ.bkernel.utils = {};
	GLOBAL_OBJ.bkernel.utils.boot = function(){
		GLOBAL_OBJ.bkernel.utils.GlobalTimer.boot();
		GLOBAL_OBJ.bkernel.utils.ToDoTasks.boot();
		GLOBAL_OBJ.bkernel.utils.AsyncDownload.boot();
	};

	GLOBAL_OBJ.bkernel.utils.shut = function(){
		GLOBAL_OBJ.bkernel.utils.GlobalTimer.shut();
		GLOBAL_OBJ.bkernel.utils.ToDoTasks.shut();
		GLOBAL_OBJ.businesses.utils.LoopScrollView.Factory.uninstallAll();
		GLOBAL_OBJ.bkernel.utils.AsyncDownload.shut();
	};
})();