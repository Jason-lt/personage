/*****************************************
 *  mahjong_s2c.js
    S2C
 *  mahjong
 *
 *  Created by nick.kai.lee on 15-12-29
 *  特殊说明：

    使用说明:

 */
(function(){
    var GLOBAL_OBJ = guiyang;

	var S2C                        = GLOBAL_OBJ.bkernel.network.S2C;
	GLOBAL_OBJ.businesses.network.S2C = {
		_TAG:"businesses.network.S2C",
        MAPS:{},
		boot:function() {
            /*
            @和游戏世界挂接，处理cmd逻辑
            */
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.USER]                     = GLOBAL_OBJ.businesses.GameWorld.parseUSER;
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.FRIEND_CALL]              = GLOBAL_OBJ.businesses.GameWorld.parseFriendCall;
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.MAHJONG_TODOTASK]         = GLOBAL_OBJ.businesses.GameWorld.parseTodotasks;
            // this.MAPS[GLOBAL_OBJ.businesses.network.EventType.PLUGIN_TODOTASK]          = GLOBAL_OBJ.businesses.GameWorld.parseTodotasks;
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.EVERY_TASK]               = GLOBAL_OBJ.businesses.GameWorld.parseTaskSystem;
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.MATCH_RANK_LIST]          = GLOBAL_OBJ.businesses.GameWorld.parseMatchRankList;
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.WIN]                      = GLOBAL_OBJ.businesses.GameWorld.parseTableOver;
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.THIRD_WIN]                = GLOBAL_OBJ.businesses.GameWorld.parseTableOver;
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.MATCH_UPDATE]             = GLOBAL_OBJ.businesses.GameWorld.parseMatchUpdate;
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.MATCH_ROOM_LIST]          = GLOBAL_OBJ.businesses.GameWorld.parseMatchRoomList;
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.MATCH_STATE]              = GLOBAL_OBJ.businesses.GameWorld.parseMatchState;
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.MATCH_SIGNS]              = GLOBAL_OBJ.businesses.GameWorld.parseMatchSigns;
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.MATCH_NOTE]               = GLOBAL_OBJ.businesses.GameWorld.parseMatchNote;
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.CREATE_TABLE]             = GLOBAL_OBJ.businesses.GameWorld.parseCreateRoom;
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.CREATE_TABLE_DISSOLUTION] = GLOBAL_OBJ.businesses.GameWorld.parseCreateTableDissolution;
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.USER_LEAVE_VOTE]          = GLOBAL_OBJ.businesses.GameWorld.parseUserLeaveVote;
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.ROOM_LIST]                = GLOBAL_OBJ.businesses.GameWorld.parseRoomList;
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.HALL]                     = GLOBAL_OBJ.businesses.GameWorld.parseVipRoomList;
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.INVITE_INFO]              = GLOBAL_OBJ.businesses.GameWorld.parseInviteInfo;
                        
            // 语音消息走table_chat
            this.MAPS[GLOBAL_OBJ.businesses.network.EventType.TABLE_CHAT]               = GLOBAL_OBJ.businesses.GameWorld.parseTableChat;
            
            //挂接接收服务端CMD数据
            S2C.hook(this._TAG,this.onRecieved,this);
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
        onRecieved:function(_cmd,_result){
            var cmd    = _cmd;
            var result = _result;
            // cc.log("sdklfjsdklfjlksdflsdlkfs:"+cmd+" "+result)
            cc.log("\n"+this._TAG+"收到CMD:"+cmd);
            if (this.MAPS[cmd]) {
                this.MAPS[cmd](result);
            };
        },
	};
})();