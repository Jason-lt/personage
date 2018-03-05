/*****************************************
 *  mahjong_events_ex.js
    model 模块用到的通知 扩展
 *  mahjong
 *
 *  Created by zengxx on 16-06-07
 *  特殊说明：

    使用说明:
 */
(function(){
    var GLOBAL_OBJ = guiyang;

    GLOBAL_OBJ.table.Events.UPDATE_GAME_BEGIN                 = "UPDATE_GAME_BEGIN";                   //游戏开始
    GLOBAL_OBJ.table.Events.UPDATE_BEFORE_ENTER_ROOM          = "UPDATE_BEFORE_ENTER_ROOM";
    GLOBAL_OBJ.table.Events.UPDATE_ENTER_ROOM                 = "UPDATE_ENTER_ROOM";
    GLOBAL_OBJ.table.Events.UPDATE_LEAVE_ROOM                 = "UPDATE_LEAVE_ROOM";
    
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_TABLE_INFO           = "UPDATE_TABLE_TABLE_INFO";
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_LOCATION             = "UPDATE_TABLE_LOCATION";
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_EVENT                = "UPDATE_TABLE_EVENT";
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_DEAL                 = "UPDATE_TABLE_DEAL";
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_DRAW                 = "UPDATE_TABLE_DRAW";                   // 摸牌
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_DISCARD              = "UPDATE_TABLE_DISCARD";                // 出牌
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHOW                 = "UPDATE_TABLE_CHOW";                   // 吃牌
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_PONG                 = "UPDATE_TABLE_PONG";                   // 碰牌
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_KONG                 = "UPDATE_TABLE_KONG";                   // 杠牌
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHAT                 = "UPDATE_TABLE_CHAT";
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_TRUSTEE              = "UPDATE_TABLE_TRUSTEE";                // 刷新托管状态
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_LEAVE                = "UPDATE_TABLE_LEAVE";                  // 牌桌离开
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_BUDGET               = "UPDATE_TABLE_BUDGET";

    GLOBAL_OBJ.table.Events.UPDATE_TABLE_OTHERLEAVESIT        = "UPDATE_TABLE_OTHERLEAVESIT";          // 玩家站起

    GLOBAL_OBJ.table.Events.UPDATE_TABLE_COUNT_DOWN           = "UPDATE_TABLE_COUNT_DOWN";
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_READY                = "UPDATE_TABLE_READY";

    GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHECK_IN_TABLE       = "UPDATE_TABLE_CHECK_IN_TABLE";

    GLOBAL_OBJ.table.Events.UPDATE_TABLE_SITDOWN_INVITE       = "UPDATE_TABLE_SITDOWN_INVITE";         // 用来控制好友场第一局房主邀请按钮在人满后隐藏的协议
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_MENU_DETAILS         = "UPDATE_TABLE_MENU_DETAILS";           // 菜单中详情按钮监听

    GLOBAL_OBJ.table.Events.UPDATE_TABLE_SIT                  = "UPDATE_TABLE_SIT";
    GLOBAL_OBJ.table.Events.UPDATE_CUSTOM_TABLE_READY         = "UPDATE_CUSTOM_TABLE_READY";
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_VOTE                 = "UPDATE_TABLE_VOTE";
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_VOTE_BUDGET          = "UPDATE_TABLE_VOTE_BUDGET";
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_SCORE                = "UPDATE_TABLE_SCORE";

    GLOBAL_OBJ.table.Events.UPDATE_TABLE_OFFLINE              = "UPDATE_TABLE_OFFLINE";

    GLOBAL_OBJ.table.Events.UPDATE_TABLE_RENSHU_LEAVE         = "UPDATE_TABLE_RENSHU_LEAVE";           // 金币场认输离开监听
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_TRUSTEE_ISSHOW       = "UPDATE_TABLE_TRUSTEE_ISSHOW";         // 托管监听
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHAT_SCROLLING       = "UPDATE_TABLE_CHAT_SCROLLING";         // 聊天界面的tableView的scroll属性的监听

    GLOBAL_OBJ.table.Events.UPDATE_TABLE_VOICE_TALKING_METHOD = "UPDATE_TABLE_VOICE_TALKING_METHOD";   // 通知听牌预览按钮界面弹出时是否有吃碰杠界面
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_ROUND_RESULT         = "UPDATE_TABLE_ROUND_RESULT";           // 大结算
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_CRAPSHOOT            = "UPDATE_TABLE_CRAPSHOOT";              // 掷骰子
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_SHOWTIPS             = "UPDATE_TABLE_SHOWTIPS";               // 牌桌提示
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_SHOWTASKTIPS         = "UPDATE_TABLE_SHOWTASKTIPS";           // 牌桌任务进度提示
    GLOBAL_OBJ.table.Events.UPDATE_SHOWZHUANGSPR              = "UPDATE_SHOWZHUANGSPR";                // 显示头像上的庄提示
    GLOBAL_OBJ.table.Events.UPDATE_PIAO_ZHUANG                = "UPDATE_PIAO_ZHUANG";                  // 显示漂庄动画
    GLOBAL_OBJ.table.Events.UPDATE_PIAO_ZHUANG_COMPLETE       = "UPDATE_PIAO_ZHUANG_COMPLETE";         // 显示漂庄动画完成
    GLOBAL_OBJ.table.Events.UPDATE_COUNTDOWNTX                = "UPDATE_COUNTDOWNTX";                  // 显示头像上的倒计时特效
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_NOTIFY_TIMEOUT       = "UPDATE_TABLE_NOTIFY_TIMEOUT";         // 牌桌倒计时刷新协议
    GLOBAL_OBJ.table.Events.UPDATE_GRAB_GANG_HU               = "UPDATE_GRAB_GANG_HU";                 // 抢杠胡
    GLOBAL_OBJ.table.Events.UPDATE_NOTIFY_GRAB_GANG_HU        = "UPDATE_NOTIFY_GRAB_GANG_HU";          // 抢杠胡结果广播

    GLOBAL_OBJ.table.Events.UPDATE_TABLE_FLOW                 = "UPDATE_TABLE_FLOW";                   // 牌局流水
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHARGING             = "UPDATE_TABLE_CHARGING";               // 发给牌桌除了充值者的所有人
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_ASK_CHARGE           = "UPDATE_TABLE_ASK_CHARGE";             // 发给牌桌充值者
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHARGD               = "UPDATE_TABLE_CHARGD";                 // 充值结果广播

    GLOBAL_OBJ.table.Events.UPDATE_TABLE_GAME_OVER            = "UPDATE_TABLE_GAME_OVER";              // 游戏结束
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_UPDATE_ROUNDCOUNT    = "UPDATE_TABLE_UPDATE_ROUNDCOUNT";      // 好友场圈数刷新
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_READY_BUTTON         = "UPDATE_TABLE_READY_BUTTON";           // 金币场牌局结束后，闪断回到牌桌后需要显示游戏开始按钮
    GLOBAL_OBJ.table.Events.SHUT_METHODS_BTN_WINDOW           = "SHUT_METHODS_BTN_WINDOW";             // 关闭操作面板
    GLOBAL_OBJ.table.Events.SHUT_TRUSTEE                      = "SHUT_TRUSTEE";                        // 关闭托管面板
    GLOBAL_OBJ.table.Events.WIN_LOCK_PANEL                    = "WIN_LOCK_PANEL";                      // 胡牌锁住面板不可再出牌
    GLOBAL_OBJ.table.Events.UPDATE_WIN_STREAK_BTN_STATE       = "UPDATE_WIN_STREAK_BTN_STATE";         // 更新连胜任务按钮的状态
    GLOBAL_OBJ.table.Events.SHOW_BUDGETS_DETAIL_PANEL         = "SHOW_BUDGETS_DETAIL_PANEL";

    // 贵阳听牌
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_TING_BEGIN           = "UPDATE_TABLE_TING_BEGIN";             // 收到听牌开始触发
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_TING_END             = "UPDATE_TABLE_TING_END";               // 收到听牌结束触发
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_ASK_TING             = "UPDATE_TABLE_ASK_TING";               // 收到听牌消息触发
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_TING_STATE           = "UPDATE_TABLE_TING_STATE";             // 收到听牌状态触发
    GLOBAL_OBJ.table.Events.UPDATE_TABLE_BTN_TING             = "UPDATE_TABLE_BTN_TING";               // 点击'听'按钮触发

    GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHONG_FENG           = "UPDATE_TABLE_CHONG_FENG";               // 收到独立冲锋鸡消息触发

})();