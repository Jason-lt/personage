/*****************************************
 *  mahjong_events.js
    bkernel通知 母文件
 *  mahjong
 *
 *  Created by nick.kai.lee on 15-12-26
 *  特殊说明：
    放置一些通用的通知，模块所需要的事件 各自模块通过后缀ex的文件进行扩展
    使用说明:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.bkernel.Events = {
		TICK:"TICK",
		CELL:"CELL"
    };
})();