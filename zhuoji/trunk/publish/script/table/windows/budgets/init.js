/*****************************************
 *  init.js
    初始化麻将 结算 JS环境
 *  mahjong
 *  听牌提示信息
 *  Created by nick.kai.lee on 16-09-28
 *  特殊说明：

    使用说明:
 */
(function(){
    "use strict";
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.windows.WuHan = {};
	
	GLOBAL_OBJ.table.windows.LiuJu = {};
	GLOBAL_OBJ.table.windows.WuHan.Budgets = {};
	
	GLOBAL_OBJ.table.windows.SiChuan = {};
	GLOBAL_OBJ.table.windows.SiChuan.XueZhan = {};
	GLOBAL_OBJ.table.windows.SiChuan.XueZhan.Budgets = {};
	GLOBAL_OBJ.table.windows.gdmj = {};

	GLOBAL_OBJ.table.windows.gymj = {};
	GLOBAL_OBJ.table.windows.gymj.result = {};
	GLOBAL_OBJ.table.windows.gymj.result.Budgets = {};

	GLOBAL_OBJ.table.windows.gdmj.jipinghu = {};
	GLOBAL_OBJ.table.windows.gdmj.jipinghu.Budgets = {};
})();