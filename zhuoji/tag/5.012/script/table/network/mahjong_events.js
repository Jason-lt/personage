/*****************************************
 *  mahjong_events.js
    网络模块用到的通知
 *  mahjong
 *
 *  Created by zengxx on 16-06-07
 *  特殊说明：

    使用说明:
 */
(function(){
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.table.network.EventType = {
        TABLE_INFO                  : "table_info",        // 牌桌信息
        TABLE_DEAL                  : "init_tiles",        // 初始化手牌
        TABLE_DRAW                  : "send_tile",         // 摸牌
        TABLE_DISCARD               : "play",              // 出牌
        TABLE_CHOW                  : "chi",               // 吃牌
        TABLE_PONG                  : "peng",              // 碰牌
        TABLE_KONG                  : "gang",              // 杠牌
        TABLE_DISPLAY_BUDGET        : "display_budget",    // 最后结算信息
        TABLE_CUSTOM_ACTION_ID      : "custom_action_id",  // 客户端自定义模拟协议，用来管理action_id
        TABLE_CHAT                  : "table_chat",        // 客户端自定义模拟协议，用来管理action_id
        TABLE_TRUSTEE_INFO          : "trustee_info",      // 托管协议（所有人）
        TABLE_SET_TRUSTEE           : "set_trustee",       // 本家托管
        TABLE_REMOVE_TRUSTEE        : "remove_trustee",    // 本家取消托管
        TABLE_CANCEL_METHODS        : "cancel_suggestion", // 关闭吃碰杠面板
        TABLE_LOCATION              : "location",          // 进入等待区
        TABLE_EVENT                 : "table_event",       // 进入等待区后有玩家落座
        TABLE_LEAVE                 : "leave",             // 离桌

        TABLE_WIN                   : "win",               // 胜利
        TABLE_LOSE                  : "lose",              // 输了

        TABLE_COUNT_DOWN            : "count_down",        // 贵宾桌等待区倒计时
        TABLE_READY                 : "ready",             // 贵宾桌等待区准备

        TABLE_SIT                   : "sit",               // 坐下
        TABLE_CUSTOM                : "create_table",
        TABLE_CUSTOM_VOTE           : "create_table_dissolution",
        TABLE_CUSTOM_VOTE_LEAVE     : "user_leave_vote",
        TABLE_CUSTOM_VOTE_BUDGET    : "gaming_leave_display_budget",

        TABLE_SCORE                 : "score",

        TABLE_ONLINE                : "user_online_info",  // 玩家离线
        TABLE_SHOWTIPS              : "showtips",          // 牌桌文字提示
        TABLE_GRAB_GANG_HU          : "grabGangHu",        // 抢杠胡
        TABLE_NOTIFY_GRAB_GANG_HU   : "notifyGrabGang",    // 抢杠胡结果广播
        TABLE_CALL                  : "table_call",

        TABLE_ROUND_RESULT          : "round_result",      // 牌局结束最终数据
        TABLE_NOTIFY_TIMEOUT        : "notifyTimeOut",     // 四川麻将刷新倒计时协议
        TABLE_FLOW                  : "detailInfo",        // 四川麻将流水，服务器发牌局流水

        TABLE_SHOWTASKTIPS          : "showTaskTips",      // 金币场牌桌上任务进度描述协议

        TABLE_ASK_ABSENCE           : "ask_absence",       // 定缺，推荐定缺
        TABLE_ABSENCE_OWN           : "notify_absence",    // 通知自己定缺
        TABLE_ABSENCE_END           : "absence_end",       // 定缺结束，发送定缺结果

    };
})();