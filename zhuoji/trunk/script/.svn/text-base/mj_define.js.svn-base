/**
 * Author   WYF
 * Date     14-3-6
 * Time     下午1:38
 * Desc     全局定义
 */

(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;
    // 座位
    GLOBAL_OBJ.SEAT_DOWN          = 0;
    GLOBAL_OBJ.SEAT_RIGHT         = 1;
    GLOBAL_OBJ.SEAT_UP            = 2;
    GLOBAL_OBJ.SEAT_LEFT          = 3;
    GLOBAL_OBJ.SEAT_NUM           = 4;

    // 无效麻将ID
    GLOBAL_OBJ.INVALID_TILE_ID    = -1;

    // 一副牌最大的牌数
    GLOBAL_OBJ.MAX_PATTERNS_TILE_NUM    = 14;

    /**
     * 杠牌类型
     * @type {{DARK: number, BRIGHT: number}}
     */
    GLOBAL_OBJ.BAR_STYLE          = {
        DARK        : 0,
        BRIGHT      : 1
    };

    // 位置类型
    GLOBAL_OBJ.POS_TYPE_LEFT_BOTTOM         = 0;
    GLOBAL_OBJ.POS_TYPE_LEFT_CENTER         = 1;
    GLOBAL_OBJ.POS_TYPE_LEFT_TOP            = 2;
    GLOBAL_OBJ.POS_TYPE_CENTER_BOTTOM       = 3;
    GLOBAL_OBJ.POS_TYPE_CENTRE              = 4;
    GLOBAL_OBJ.POS_TYPE_CENTER_TOP          = 5;
    GLOBAL_OBJ.POS_TYPE_RIGHT_BOTTOM        = 6;
    GLOBAL_OBJ.POS_TYPE_RIGHT_CENTER        = 7;
    GLOBAL_OBJ.POS_TYPE_RIGHT_TOP           = 8;

    // 九个点
    GLOBAL_OBJ.POS = [];
    GLOBAL_OBJ.POS[GLOBAL_OBJ.POS_TYPE_LEFT_BOTTOM]     = cc.p(0.0, 0.0);
    GLOBAL_OBJ.POS[GLOBAL_OBJ.POS_TYPE_LEFT_CENTER]     = cc.p(0.0, 0.5);
    GLOBAL_OBJ.POS[GLOBAL_OBJ.POS_TYPE_LEFT_TOP]        = cc.p(0.0, 1.0);
    GLOBAL_OBJ.POS[GLOBAL_OBJ.POS_TYPE_CENTER_BOTTOM]   = cc.p(0.5, 0.0);
    GLOBAL_OBJ.POS[GLOBAL_OBJ.POS_TYPE_CENTRE]          = cc.p(0.5, 0.5);
    GLOBAL_OBJ.POS[GLOBAL_OBJ.POS_TYPE_CENTER_TOP]      = cc.p(0.5, 1.0);
    GLOBAL_OBJ.POS[GLOBAL_OBJ.POS_TYPE_RIGHT_BOTTOM]    = cc.p(1.0, 0.0);
    GLOBAL_OBJ.POS[GLOBAL_OBJ.POS_TYPE_RIGHT_CENTER]    = cc.p(1.0, 0.5);
    GLOBAL_OBJ.POS[GLOBAL_OBJ.POS_TYPE_RIGHT_TOP]       = cc.p(1.0, 1.0);

    /**
     * 设计分辨率
     * @type {*|cc.Size}
     */
    GLOBAL_OBJ.DesignResolutionSize = cc.size(960, 640);

    /**
     * 性别
     * @type {{Boy: number, Girl: number}}
     */
    GLOBAL_OBJ.Sex =
    {
        Boy     : 0,        // 男
        Girl    : 1         // 女
    };

    /**
     * 触摸优先级
     * @type {{Modal: number}}
     */
    GLOBAL_OBJ.TouchPriority =
    {
        TableTile           : -30,         // 桌面选牌
        TablePlayedTile     : -20,         // 桌面选牌
        TableHeadIcon       : -10,         // 桌面头像
        Normal              : 0,           // 普通
        Scroll              : 200,         // 滚动
        Modal               : 256,         // 模态
        MsgTips             : 512,         // 消息提示
        PopupBox            : 522,         // 弹出框
        MsgBox              : 532          // 消息框
    };

    /**
     * 定义大厅进入插件的位置
     *
     * gameType:
     1 - 金币场
     5 - 比赛
     8 - 单机场
     10 - 自建桌建房
     11 - 自建桌进桌
     * @type {{}}
     */
    GLOBAL_OBJ.PluginGameType =
    {
        JinBi           : 1,  // 金币场
        Match           : 5,  // 比赛
        Single          : 8,  // 单机场
        Create          : 10, // 自建桌建房
        Enter           : 11  // 自建桌进桌
    };

    /**
     * 开始游戏错误码
     * @type {number}
     */
    GLOBAL_OBJ.TABLE_START_ERROR_NONE                   = 0;        // 没有错误
    GLOBAL_OBJ.TABLE_START_ERROR_IN_ANOTHER_GAME        = 1;        // 正在玩另一个游戏
    GLOBAL_OBJ.TABLE_START_ERROR_SYS_ERROR              = 2;        // 系统错误
    GLOBAL_OBJ.TABLE_START_ERROR_FAILED                 = 3;        // 没有分到桌子
    GLOBAL_OBJ.TABLE_START_ERROR_CHIP_TOO_FEW           = 4;        // 金币不足
    GLOBAL_OBJ.TABLE_START_ERROR_CHIP_TOO_MUCH          = 5;        // 金币太多了
    GLOBAL_OBJ.TABLE_START_ERROR_GAME_OVER              = 6;        // 游戏已结束
    GLOBAL_OBJ.TABLE_START_ERROR_CONTINUE_ERROR         = 7;        // 无法继续游戏（贵宾桌，已经被清出桌子）
    GLOBAL_OBJ.TABLE_START_ERROR_PLAYING                = 8;        // 游戏中，无法进入（贵宾桌）
    GLOBAL_OBJ.TABLE_START_ERROR_RECONNECT_ERROR        = 9;        // 无法继续游戏(断线重连，已经被清了)
    GLOBAL_OBJ.TABLE_START_ERROR_CONTEST_NOT_START      = 101;      // 比赛未开始
    GLOBAL_OBJ.TABLE_START_ERROR_CONTEST_FINISH         = 102;      // 比赛已结束
    GLOBAL_OBJ.TABLE_START_ERROR_CONTEST_EXPIRE         = 103;      // 比赛已过期
    GLOBAL_OBJ.TABLE_START_ERROR_CONTEST_CHIP_TOO_FEW   = 104;      // 比赛条件限制 - 金币不足
    GLOBAL_OBJ.TABLE_START_ERROR_CONTEST_CHIP_TOO_MUCH  = 105;      // 比赛条件限制 - 金币太多
    GLOBAL_OBJ.TABLE_START_ERROR_CONTEST_FULL           = 106;      // 比赛条件限制 - 人数超出限制
    GLOBAL_OBJ.TABLE_START_ERROR_UNKNOWN                = -1;       // 未知错误
    GLOBAL_OBJ.TABLE_START_ERROR_CHIP_LIMIT             = -2;       // 金币不足无法进入任何房间

    /**
     * 是否会员标志
     * @type {{Nonmember: number, FullMember: number, Overdue: number}}
     */
    GLOBAL_OBJ.Member =
    {
        Nonmember   : 0,
        FullMember  : 1,
        Overdue     : 2
    };

    /**
     * 比赛状态
     * 比赛状态, 0为未开赛,1为比赛中 2为等待比赛结束,3为比赛已结束,4比赛结果显示结束即将切到下一场比赛。
     *  本地状态：10 即将开始
     */
    GLOBAL_OBJ.MatchState = {
        BeforeMatch     :0,
        DurationOfMatch :1,
        WattingMatched  :2,
        EndMatched      :3,
        MatchedDied     :4,
        willStart       :10001
    };

    /**
     * 比赛类型
     */
    GLOBAL_OBJ.MatchType = {
        quick_upgrade_match :"quick_upgrade_match", //快速赛
        stage_match         :'stage_match',         //定时赛
        arena_match         :'common_arena_match'   //arena
    };
    /**
     * 比赛阶段类型
     */
    GLOBAL_OBJ.MatchStageType = {
        ass :"ass", //打立
        dieout :"dieout" //晋级
    };

    GLOBAL_OBJ.MatchStartCountDownTime = 20; //定时赛开始倒计时的时间（单位：秒）

    /**
     * 牌桌类型
     */
    GLOBAL_OBJ.TableType = {
        Vip           :'vip',       //贵宾桌
        Normal        :'normal',    //普通桌(金币桌)
        Create        :'create',    //自建桌
        Match         :'match'      //比赛场
    };

    GLOBAL_OBJ.QuickStartWhere = {
        table : "table",  //牌桌里
        roomlist : "roomlist" //房间列表
    };

    //end
})();