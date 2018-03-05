/*****************************************
 *  mahjong_events_ex.js
    比赛列表中心 模块用到的通知 扩展
 *  mahjong
 *
 *  Created by zengxx on 16-03-26
 *  特殊说明：

    使用说明:
 */
(function(){
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_ROOM_LIST   = "UPDATE_MATCH_LIST_CENTER_ROOM_LIST";
    GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_ROOM        = "UPDATE_MATCH_LIST_CENTER_ROOM";        // 刷新单场比赛
    GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_ROOM_REQUE  = "UPDATE_MATCH_LIST_CENTER_ROOM_REQUE";  // 重新请求单场比赛
    GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_REWARD_LIST = "UPDATE_MATCH_LIST_CENTER_REWARD_LIST";
    GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_UPDATE      = "UPDATE_MATCH_LIST_CENTER_UPDATE";
    GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_MATCH_STATE = "UPDATE_MATCH_LIST_CENTER_MATCH_STATE";
    GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_MATCH_SIGNS = "UPDATE_MATCH_LIST_CENTER_MATCH_SIGNS";
})();