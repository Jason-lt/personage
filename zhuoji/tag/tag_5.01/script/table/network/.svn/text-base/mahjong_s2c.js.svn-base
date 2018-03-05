/*****************************************
 *  mahjong_s2c.js
    S2C
 *  mahjong
 *
 *  Created by zengxx on 16-06-07
 *  特殊说明：

    使用说明:

 */
(function(){
    var GLOBAL_OBJ = guiyang;
	var S2C                        = GLOBAL_OBJ.bkernel.network.S2C;
	GLOBAL_OBJ.table.network.S2C = {
		_TAG:"table.network.S2C",
        MAPS:{},
		boot:function() {
            /*
            @和游戏世界挂接，处理cmd逻辑
            */

            // 牌桌相关cmd处理函数
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.GAME]                = GLOBAL_OBJ.table.GameWorld.parseInTableCheck;

            // 国标
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_LOCATION]           = GLOBAL_OBJ.table.GameWorld.parseTableLocation;
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_EVENT]              = GLOBAL_OBJ.table.GameWorld.parseTableEvent;
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_INFO]               = GLOBAL_OBJ.table.GameWorld.parseTableInfo;
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_DEAL]               = GLOBAL_OBJ.table.GameWorld.parseTableDeal;

            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_DRAW]               = GLOBAL_OBJ.table.GameWorld.parseTableDraw;
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_DISCARD]            = GLOBAL_OBJ.table.GameWorld.parseTableDiscard;
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_CHOW]               = GLOBAL_OBJ.table.GameWorld.parseTableChow;
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_PONG]               = GLOBAL_OBJ.table.GameWorld.parseTablePong;
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_KONG]               = GLOBAL_OBJ.table.GameWorld.parseTableKong;            
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_WIN]                = GLOBAL_OBJ.table.GameWorld.parseTableBudget;
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_LOSE]               = GLOBAL_OBJ.table.GameWorld.parseTableBudget;

            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_CUSTOM_ACTION_ID]   = GLOBAL_OBJ.table.GameWorld.parseTableCustomActionId;
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_CHAT]               = GLOBAL_OBJ.table.GameWorld.parseTableChat;
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_TRUSTEE_INFO]       = GLOBAL_OBJ.table.GameWorld.parseTableSetTrusteeOther;
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_SET_TRUSTEE]        = GLOBAL_OBJ.table.GameWorld.parseTableSetTrustee;
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_REMOVE_TRUSTEE]     = GLOBAL_OBJ.table.GameWorld.parseTableRemoveTrustee;
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_LEAVE]              = GLOBAL_OBJ.table.GameWorld.parseTableLeave;

            // 贵宾厅等
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_COUNT_DOWN]         = GLOBAL_OBJ.table.GameWorld.parseVipWatingCountDown;
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_READY]              = GLOBAL_OBJ.table.GameWorld.parseVipWatingReady;
            
            // 自建桌等
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_SIT]                = GLOBAL_OBJ.table.GameWorld.parseSit;
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_CUSTOM]             = GLOBAL_OBJ.table.GameWorld.parseCustom;
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_CUSTOM_VOTE]        = GLOBAL_OBJ.table.GameWorld.parseCustomVote;
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_CUSTOM_VOTE_LEAVE]  = GLOBAL_OBJ.table.GameWorld.parseCustomVote;
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_CUSTOM_VOTE_BUDGET] = GLOBAL_OBJ.table.GameWorld.parseCustomVoteBudget;
            
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_SCORE]              = GLOBAL_OBJ.table.GameWorld.parseTableScore;

            // 玩家离线
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_ONLINE]             = GLOBAL_OBJ.table.GameWorld.parseTableOnline;

            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_CALL]               = GLOBAL_OBJ.table.GameWorld.parseTableCall;

            // 金币场牌桌上任务进度描述协议
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_SHOWTASKTIPS]       = GLOBAL_OBJ.table.GameWorld.parseTableShowTaskTips;

            // 抢杠胡
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_GRAB_GANG_HU]       = GLOBAL_OBJ.table.GameWorld.parseTableGrabGangHu;

            // 抢杠胡结果广播
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_NOTIFY_GRAB_GANG_HU]= GLOBAL_OBJ.table.GameWorld.parseTableNotifyGrabGangHu;

            // 牌桌文字提示
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_SHOWTIPS]           = GLOBAL_OBJ.table.GameWorld.parseTableShowtips;

            // 牌局最终结算数据
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_ROUND_RESULT]       = GLOBAL_OBJ.table.GameWorld.parseTableRoundResult;

            // 牌局流水
            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_FLOW]               = GLOBAL_OBJ.table.GameWorld.parseTableFlow;

            this.MAPS[GLOBAL_OBJ.table.network.EventType.TABLE_NOTIFY_TIMEOUT]     = GLOBAL_OBJ.table.GameWorld.parseTableNotifyTimeOut;

            // 挂接接收服务端CMD数据
            S2C.hook(this._TAG, this.onRecieved, this);
            GLOBAL_OBJ.LOGD(this._TAG,"MODULE LOAD");
        },

        shut:function() {
            
            this.MAPS = {};
            
            //解除挂接接收服务端CMD数据
            S2C.unhook(this._TAG);
            GLOBAL_OBJ.LOGD(this._TAG,"MODULE UNLOAD");
        },

        /*
        接收到网络消息【cmd:user】
        */
        onRecieved:function(_cmd, _result){
            var cmd    = _cmd;
            var result = _result;
            cc.log("\n"+this._TAG+"RECEIVE CMD:"+cmd);
            if (this.MAPS[cmd]) {
                if (true == ty.IS_DEBUG) {
                    GLOBAL_OBJ.table.Test.Record.record(cmd, result);
                };
                this.MAPS[cmd](result);
            };
        },
	};
})();