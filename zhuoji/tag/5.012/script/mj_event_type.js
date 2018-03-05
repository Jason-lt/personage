//
//  mj_event_type.js
//  framework
//
//  Created by luzhiming on 14-1-24.
(function(){
    var GLOBAL_OBJ = guiyang;
    
    GLOBAL_OBJ.EventType = {

    // 网络消息，客户端发给server的叫 CMD_XXX, server 发给客户端的叫 MSG_XXX
    // 把所有的消息名字写到这里，防止写到各个文件内时，引起的混乱
    MSG_ROOM_LIST                   : "room_list",                      // 房间列表
    MSG_ROOM_ONLINE_INFO            : 'room_online_info',               // 房间动态信息（服务器跟随心跳推送）
    MSG_QUICKSTART                  : "quick_start",                    // 启动游戏返回的数据
    MSG_LOCATION                    : "location",                       // quick_start后取到的房间信息
    MSG_TABLE_INFO                  : "table_info",                     // 游戏桌面信息
    MSG_TABLE_INFO_RECOVERY         : "table_info_recovery",            // 服务端发现客户端数据错误发送纠正信息，和table_info格式一致
    MSG_ONLINE_REWARD               : "online_reward",                  // 宝箱，在线奖励
    MSG_INIT_TILES                  : "init_tiles",	                    // 初始化手牌
    MSG_SEND_TILE                   : "send_tile",		                // 收到一张牌
    MSG_SEND_3TILE                  : "send_3tiles",		            // 收到三张牌
    MSG_DECIDE_ABSENCE_CREATE       : "decideAbsence",                  // modify by zengxx 自建桌 将默认定缺从send_3tiles中拆出来
    MSG_PLAY_TILE                   : "play",			                // 打出一张牌
    MSG_SEEN_TILE                   : "seen_tile",                      // 允许亮牌
    MSG_PENG_TILE                   : "peng",                           // 碰牌消息
    MSG_GANG_TILE                   : "gang",                           // 杠牌消息
    MSG_WIN_TILE                    : "win",                            // 胡牌消息
    MSG_WIN_TILE_THIRD              : "third_win",                      // 第三个人胡牌消息(补丁)
    MSG_DISPLAY_GANG                : "display_gang",                   // 展示杠
    MSG_GRAB_GANG                   : "grab_gang",                      // 抢杠
    MSG_CHI_TILE                    : "chi",
    MSG_TING                        : "ting",

    MSG_SIT                         : 'sit',                            // 坐下
    MSG_READY                       : 'ready',				            // 准备
    MSG_NEXT_ROUND                  : 'next_round',				        // 准备下一局

    MSG_LEAVE                       : "leave",				            // 离开
    MSG_TRUSTEE                     : "set_trustee",                    // 托管
    MSG_REMOVE_TRUSTEE              : "remove_trustee",                 // 取消托管
    MSG_DISPLAY_BUDGET              : 'display_budget',                 // 最后胡消息
    MSG_CANCEL_SUGGESTION           : "cancel_suggestion",              // 终止碰杠吃
    MSG_TABLE_PLAYER_RANK           : 'players_rank',                   // 桌面大赛排名
    MSG_PREPARE_COUNT_DOWN          : 'count_down',                     // 准备倒计时

    MSG_GRAB_TING                   : 'grabTing',                       // 抢听消息

    MSG_ISSUE_BENEFIT               : "issue_benefit",                  // 救济金
    MSG_LOGIN_REWARD                : "login_reward",                   // 每日登录奖励
    MSG_RAFFLE_ITEM                 : 'raffle_item',                    // 抽奖
    MSG_SET_USER                    : 'set_user',                       // 设置个人信息
    MSG_BUY_PRODUCT                 : 'buy_prod',                       // 购买商品
    MSG_GET_RANK_LIST               : "get_rank_list",                  // 得到城市列表
    MSG_GET_FRIEND_RANK_LIST        : "getRank",                        // 得到好友列表，直接来自SDK。
    MSG_CONFIRM_PROPS               : "confirm_props",                  // 道具
    MSG_COMFIRM_FIVE_STRA_ACK       : "five_star_rating_ack",           // 五星好评加金币确认回调
    MSG_ACTIVITY_ITEM               : "get_activity_item",              // 活动消息
    MSG_MY_MESSAGE                  : "message",                        // 我的消息

    MSG_GAME_DATA                   : 'game_data',                      // 游戏数据
    MSG_MSG_BOX                     : "msg_box",                        // 提示框

    MSG_LED_MSG                     : "invite_led",                     // led信息
    MSG_SYS_LED_MSG                 : "led",                            // 系统led

    MSG_GBVIP_ROOM_INFO             : "gbvip_room_info",                // 贵宾房

    MSG_PRODUCT_DELIVERY            : 'prod_delivery',                  // 购买成功

    MSG_TABLE_EVENT                 : 'table_event',                    // 桌子信息

    /**
     * 比赛相关
     */
    MSG_CONTEST_RANK_LIST           : 'match_rank_list',                // 比赛排行
    MSG_CONTEST_REWARD              : 'award_certificate',              // 比赛奖励
    MSG_MATCH_ROOM_LIST             : 'match_room_list',                // 比赛大厅房间列表
    MSG_MATCH_RESULT_LIST           : 'match_result_list',              // 比赛大厅人名信息
    MSG_MATCH_STATE                 : 'match_state',                    // 比赛状态
    MSG_CONTEST_NOTIFY              : 'match_notify',                   // 比赛通知
    CMD_FRIEND_CALL                 : 'friend_call',                    // 好友相关的处理
    MSG_START_WAIT                  : 'm_start_wait',                   // modify by zengxx 新比赛开始前配桌
    MSG_MATCH_UPDATE                : 'm_update',                       // modify by zengxx 新比赛刷新比赛信息
    MSG_MATCH_INFO                  : 'majiang_match_info',             // modify by zengxx 刷新单场比赛数据

    /**
     * mtt比赛相关
     */
    MSG_MATCH_SIGNS                 : 'm_signs',                         // 各个比赛报名状态

    /**
     * 聊天
     */
    MSG_CHAT                        : 'table_chat',

    /**
     * 任务
     */
    MSG_TASK                        : 'every_task',

    // 比赛
    EVT_REFRESH_MATCH_STATE         : 'EVT_REFRESH_MATCH_STATE',        // 用于更新比赛状态
    EVT_CONTEST_REWARD_BOX_CLOSED   : 'EVT_CONTEST_REWARD_BOX_CLOSED',  // 奖状界面关闭
    EVT_MATCH_UPDATE                : 'EVT_MATCH_UPDATE',               // 比赛update

    //gamescene
    EVT_GAMESCENE_CANPLAY           : 'EVT_GAMESCENE_CANPLAY',          // 可以出牌
    EVT_SHOW_SETTING                : 'EVT_SHOW_SETTING' ,              // 打开设置
    EVT_BACK_TO_HALL_ONLINE         : 'EVT_BACK_TO_HALL_ONLINE',        // 游戏场景返回大厅

    // 桌面
    EVT_TABLE_COUNTDOWN_DISABLE						: 'EVT_TABLE_COUNTDOWN_DISABLE',					//换三张结束，关闭倒计时EVT_TABLE_COUNTDOWN_BEGIN						: 'EVT_TABLE_COUNTDOWN_BEGIN',						//换三张开始倒计时
    EVT_TILE_PATTERNS_REFRESH                       : 'EVT_TILE_PATTERNS_REFRESH',                      //刷新牌面视图
    EVT_TABLE_LP_DO_OPTION_EAT                      : 'EVT_TABLE_LP_DO_OPTION_EAT',                     // 本地玩家操作菜单吃(param:{tileId, eatIndex)
    EVT_TABLE_LP_DO_OPTION_TOUCH                    : 'EVT_TABLE_LP_DO_OPTION_TOUCH',                   // 本地玩家操作菜单碰(param:tileId)
    EVT_TABLE_LP_DO_OPTION_BAR                      : 'EVT_TABLE_LP_DO_OPTION_BAR',                     // 本地玩家操作菜单杠(param:tileId)
    EVT_TABLE_LP_DO_OPTION_TING                     : 'EVT_TABLE_LP_DO_OPTION_TING',                    // 本地玩家操作菜单听(param:tingTiles)
    EVT_TABLE_LP_DO_OPTION_WIN                      : 'EVT_TABLE_LP_DO_OPTION_WIN',                     // 本地玩家操作菜单和(param:winDegree)
    EVT_TABLE_LP_DO_OPTION_PASS                     : 'EVT_TABLE_LP_DO_OPTION_PASS',                    // 本地玩家操作菜单过
    EVT_TABLE_LP_CANCEL_TING                        : 'EVT_TABLE_LP_CANCEL_TING',                       // 取消听
    EVT_TABLE_LP_SHOW_TING                          : 'EVT_TABLE_LP_SHOW_TING',                         // 显示听牌界面
    EVT_TABLE_LP_CLOSE_TING                         : 'EVT_TABLE_LP_CLOSE_TING',                        // 关闭听牌界面
    EVT_TABLE_LP_SHOW_TING_TIPS                     : 'EVT_TABLE_LP_SHOW_TING_TIPS',                    // 显示听牌提示(param:{mTingTile,pos})
    EVT_TABLE_LP_SHOW_OR_CLOSE_TING_TIPS            : 'EVT_TABLE_LP_SHOW_OR_CLOSE_TING_TIPS',           // 显示或关闭听牌提示(param:{mTingTile,pos})
    EVT_TABLE_LP_CLOSE_TING_TIPS                    : 'EVT_TABLE_LP_CLOSE_TING_TIPS',                   // 关闭听牌提示
    EVT_TABLE_PLAY_EFFECT                           : 'EVT_TABLE_PLAY_EFFECT',                          // 播放桌面特效(param:{seatIndex, effectName})
    EVT_TABLE_SHOW_PLAYED_TILE_POINTER              : 'EVT_TABLE_SHOW_PLAYED_TILE_POINTER',             // 显示出牌指示(param:{seatIndex, pos})
    EVT_TABLE_HIDE_PLAYED_TILE_POINTER              : 'EVT_TABLE_HIDE_PLAYED_TILE_POINTER',             // 隐藏出牌指示
    EVT_TABLE_SHOW_PLAYER_INFO_TIPS                 : 'EVT_TABLE_SHOW_PLAYER_INFO_TIPS',                // 显示玩家信息面板(param:seatIndex)
    EVT_TABLE_CLOSE_PLAYER_INFO_TIPS                : 'EVT_TABLE_CLOSE_PLAYER_INFO_TIPS',               // 隐藏玩家信息面板
    EVT_TABLE_SHOW_OR_CLOSE_PLAYER_INFO_TIPS        : 'EVT_TABLE_SHOW_OR_CLOSE_PLAYER_INFO_TIPS',       // 显示/隐藏玩家信息面板(param:seatIndex)
    EVT_TABLE_SHOW_PLAYER_WIN_INFO_TIPS             : 'EVT_TABLE_SHOW_PLAYER_WIN_INFO_TIPS',            // 显示玩家信息面板(param:seatIndex)
    EVT_TABLE_CLOSE_PLAYER_WIN_INFO_TIPS            : 'EVT_TABLE_CLOSE_PLAYER_WIN_INFO_TIPS',           // 隐藏玩家和牌信息面板
    EVT_TABLE_SHOW_OR_CLOSE_PLAYER_WIN_INFO_TIPS    : 'EVT_TABLE_SHOW_OR_CLOSE_PLAYER_WIN_INFO_TIPS',   // 显示/隐藏玩家信息面板(param:seatIndex)
    EVT_TABLE_SHOW_CHAT                             : 'EVT_TABLE_SHOW_CHAT',                            // 显示聊天界面
    EVT_TABLE_CLOSE_CHAT                            : 'EVT_TABLE_CLOSE_CHAT',                           // 关闭聊天界面（param:isAnimate)
    EVT_TABLE_CHAT                                  : 'EVT_TABLE_CHAT',                                 // 桌面聊天（param:json)
    EVT_TABLE_CLICK_SHARE                           : 'EVT_TABLE_CLICK_SHARE',                          // 桌面分享
    EVT_TABLE_CLOSE_MORE_MENU                       : 'EVT_TABLE_CLOSE_MORE_MENU',                      // 关闭更多菜单
    EVT_NEWBIE_CLOSE_TIPS                           : 'EVT_NEWBIE_CLOSE_TIPS',                          // 新手引导提示单击出牌
    EVT_TABLE_HIDE_SECOND_FLOOR_PLAYED_TILES        : 'EVT_TABLE_HIDE_SECOND_FLOOR_PLAYED_TILES',       // 隐藏出牌区第二层牌
    EVT_TABLE_SHOW_SECOND_FLOOR_PLAYED_TILES        : 'EVT_TABLE_SHOW_SECOND_FLOOR_PLAYED_TILES',       // 显示出牌区第二层牌
    EVT_TABLE_SHOW_TASK                             : 'EVT_TABLE_SHOW_TASK',                            // 显示任务界面
    EVT_TABLE_CLOSE_TASK                            : 'EVT_TABLE_CLOSE_TASK',                           // 关闭任务界面
    EVT_TABLE_SHOW_OR_CLOSE_TASK                    : 'EVT_TABLE_SHOW_OR_CLOSE_TASK',                   // 显示/关闭任务界面
    EVT_TABLE_UN_SELECT_TILE                        : 'EVT_TABLE_UN_SELECT_TILE',                       // 取消选中牌
    EVT_TABLE_SHOW_CONTEST_BOARD                    : 'EVT_TABLE_SHOW_CONTEST_BOARD',                   // 显示排行面板
    EVT_TABLE_CLOSE_CONTEST_BOARD                   : 'EVT_TABLE_CLOSE_CONTEST_BOARD',                  // 关闭排行面板
    EVT_TABLE_CONTEST_BOARD_SHOWED                  : 'EVT_TABLE_CONTEST_BOARD_SHOWED',                 // 排行面板已打开
    EVT_TABLE_CONTEST_BOARD_CLOSED                  : 'EVT_TABLE_CONTEST_BOARD_CLOSED',                 // 关闭排行已关闭
    EVT_SELECT_TILE                                 : 'EVT_SELECT_TILE',                                // 选中牌
    EVT_PLAY_TILE                                   : 'EVT_PLAY_TILE',                                  // 出牌

    EVT_TABLE_CLEAR_ALL_TILES_FOR_CHANGE            : 'EVT_TABLE_CLEAR_ALL_TILES_FOR_CHANGE',           // 换三张取消选中的牌
    EVT_TABLE_CLOSE_TREASURE_TILES                  : 'EVT_TABLE_CLOSE_TREASURE_TILES',                 // 关闭宝牌牌列表
    EVT_TABLE_RESULT_SHOW_MY_RESULT                 : 'EVT_TABLE_RESULT_SHOW_MY_RESULT',                // 显示自己的结果

    EVT_CUR_SCENE_CONTROLLER_CHANGE                 : 'EVT_CUR_SCENE_CONTROLLER_CHANGE',                // 当前场景管理器改变(param:controller)
    EVT_RUN_HALL_SCENE                              : 'EVT_RUN_HALL_SCENE',                             // 切换到大厅场景
    EVT_RETURN_HALL_SCENE                           : 'EVT_RETURN_HALL_SCENE',                          // 麻将插件返回大厅
    EVT_RUN_SHOP_SCENE                              : 'EVT_RUN_SHOP_SCENE',                             // 切换到商城场景
    EVT_ENABLE_MUSIC                                : 'EVT_ENABLE_MUSIC',                               // 开关音乐(param:isEnable)
    EVT_ENABLE_SOUND                                : 'EVT_ENABLE_SOUND',                               // 开关音效(param:isEnable)

    EVT_QUICK_START_REQUEST                         : 'EVT_QUICK_START_REQUEST',                        // 开始请求快速开始
    EVT_QUICK_START_RESULT                          : 'EVT_QUICK_START_RESULT',                         // 快速开始结果

    EVT_TABLE_INFO                                  : 'EVT_TABLE_INFO',                                 // 收到桌面初始化信息
    EVT_TABLE_QUICK_BUY                             : 'EVT_TABLE_QUICK_BUY',                            // 收到桌面快速充值信息
    EVT_NONE                                        : 'EVT_NONE',

    EVT_TABLE_SHOW_PLAYER_WIN_TILE_TIPS             : 'EVT_TABLE_SHOW_PLAYER_WIN_TILE_TIPS',            // 显示玩家已胡牌信息
    EVT_TABLE_CLOSE_PLAYER_WIN_TILE_TIPS            : 'EVT_TABLE_CLOSE_PLAYER_WIN_TILE_TIPS',           // 隐藏玩家已胡牌信息
    EVT_TABLE_SHOW_OR_CLOSE_PLAYER_WIN_TILE_TIPS    : 'EVT_TABLE_SHOW_OR_CLOSE_PLAYER_WIN_TILE_TIPS',   // 显示/隐藏玩家已胡牌信息

    EVT_HALL                                        : 'hall',                                           // 大厅消息
    EVT_ACTION_VIP_TABLE_LIST                       : 'vipTableList',                                   // 贵宾桌列表
    EVT_USER                                        : 'user',                                           // user消息
    EVT_ACTION_USER_INFO                            : 'info',                                           // 贵宾桌上的玩家信息
    EVT_VIP_TALBE_LIST_USER_INFO                    : 'EVT_VIP_TALBE_LIST_USER_INFO',                   // 刷新贵宾桌列表上的个人信息页面
    };
})();