/*****************************************
 *  init.js
    初始化麻将 windows JS环境
 *  mahjong
 *  一些完整功能性的模块
 *  Created by nick.kai.lee on 15-12-28
 *  特殊说明：
		
	窗体模块的结构：
	include.json tuyoo项目中无效
	init.js 模块的命名空间初始化
	mahjong_c2s_ex.js 模块需要的请求api扩展是业务层mahjong_c2s.js的扩展
	mahjong_events_ex.js 模块需要的通知事件是业务层mahjong_events.js的扩展
	mahjong_window_consts.js 窗体通用的常量，如窗体的名字
    使用说明:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.businesses.windows = {};
})();