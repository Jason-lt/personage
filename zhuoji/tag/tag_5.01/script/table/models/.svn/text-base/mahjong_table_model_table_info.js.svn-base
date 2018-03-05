/*****************************************
 *  mahjong_table_model_table_info.js
 *  (进入牌桌)牌桌相关model
 *  Created by zengxx on 16-06-13
    协议说明：

    使用说明:

 */
guiyang.table.models.TableInfo = (function(){
    var GLOBAL_OBJ = guiyang;
    
    /*
    私有数据+接口
    TODO:
    数据的原型，存储以及通知的抛出
    */

    /* @数据缓存*/
    var CACHE                  = {}
    var PROTOTYPE              = GLOBAL_OBJ.table.models.Prototype;

    /* @私有属性 */
    PROTOTYPE.setPrivateProperty(CACHE, "serverSeatId", -1, "本家服务端座位号");
    PROTOTYPE.setPrivateProperty(CACHE, "userId", 0, "本家UID");
    PROTOTYPE.setPrivateProperty(CACHE, "myPlayers", [], "描述缺失");
    PROTOTYPE.setPrivateProperty(CACHE, "playersInfo", {}, "每个玩家格式化后的信息,每个玩家本地seat_id为key");
    PROTOTYPE.setPrivateProperty(CACHE, "winners", [], "每个赢家格式化后的信息（断线重连");
    PROTOTYPE.setPrivateProperty(CACHE, "map", {}, "uid到seatId的映射");
    PROTOTYPE.setPrivateProperty(CACHE, "matchType", 0, "是否是比赛，0不是");
    PROTOTYPE.setPrivateProperty(CACHE, "roomName", "", "初级场，大师场等等");
    PROTOTYPE.setPrivateProperty(CACHE, "reconnect", false, "断线重连");
    PROTOTYPE.setPrivateProperty(CACHE, "customRoomInfo", {}, "自建桌信息");
    PROTOTYPE.setPrivateProperty(CACHE, "bankerSeatId", -1, "庄家座位号");
    PROTOTYPE.setPrivateProperty(CACHE, "tableType", "", "牌桌类型");
    PROTOTYPE.setPrivateProperty(CACHE, "remained_count", 0, "剩余牌数");

    PROTOTYPE.setPrivateProperty(CACHE, "chat_chip", 0, "金币场聊天花费的金币");
    PROTOTYPE.setPrivateProperty(CACHE, "chat_time", 0, "金币场聊天cd时间");

    /* @共享属性 */
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_ACTION_ID);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_PLAY_MODE);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_BASE_CHIP);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TABLE_TYPE);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TABLE_ID);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_ROOM_ID);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_SEAT_COUNT);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TRUSTEE);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TIME_OUT);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_WIND_SEAT_ID);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_PLAYER);

    /* @数据通知*/
    var ___f_notificate = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        }

        GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_BEFORE_ENTER_ROOM, {});
        
        GLOBAL_OBJ.table.utils.Seat.init({ num: _data.maxSeatN, seatId: _data.seatId }); //初始化座位映射

        var data = _data;

        CACHE.userId                 = data.userId;
        CACHE.serverSeatId           = data.seatId;
        CACHE.myPlayers              = data.players;  
        CACHE.matchType              = data.matchType;
        CACHE.roomName               = data.room_name;
        CACHE.reconnect              = data.reconnect;
        CACHE.emojiConfig            = data.interactive_expression_config;

        CACHE.tableType              = data.tableType;
        CACHE.room_level             = data.room_level;
        CACHE.base_chip              = data.base_chip;
        CACHE.protectValue           = data.protectValue;//金币扣除下限
        if (CACHE.tableType == GLOBAL_OBJ.TableType.Create){
            //自建桌才有这些信息
            CACHE.customRoomInfo     = data.create_table_extend_info || {};
        }

        CACHE.service_fee            = data.service_fee;//金币场服务费
        CACHE.chat_chip              = data.chat_chip;//金币场聊天花费的金币
        CACHE.chat_time              = data.chat_time;//金币场聊天cd时间

        CACHE.paramsOptionInfo       = data.paramsOptionInfo;

        CACHE.bankerSeatId           = data.header_seat_id;
        CACHE.bankerlasttime_id      = data.bankerlasttime_id;

        CACHE.remained_count         = data.remained_count;

        CACHE.map         = {};
        // 用于断线重连
        CACHE.playersInfo = {};
        for (var i = 0; i < data.players.length; ++i){
            var localSeatId = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(data.players[i]['seatId']);
            CACHE.playersInfo[localSeatId] = CACHE.playersInfo[localSeatId] || {};
            
            CACHE.playersInfo[localSeatId]['tiles']            = data.players[i]['standup_tiles'] || [];
            CACHE.playersInfo[localSeatId]['chi_details']      = data.players[i]['chi_details']   || [];
            CACHE.playersInfo[localSeatId]['peng_details']     = data.players[i]['peng_details']  || [];
            CACHE.playersInfo[localSeatId]['gang_details']     = data.players[i]['gang_details']  || [];
            CACHE.playersInfo[localSeatId]['won_tiles']        = data.players[i]['won_tiles']     || [];
            CACHE.playersInfo[localSeatId]['ready_hand_tiles'] = data.players[i]['ting_tiles']    || []; // 听牌之后的听牌信息，也就是得到哪些牌就可以胡了 [[22, 5, 3],[]]  22 听胡的牌，5 番数 3 剩余张数
            CACHE.playersInfo[localSeatId]['drop_tiles']       = data.players[i]['drop_tiles']    || [];
            CACHE.playersInfo[localSeatId]['ting_result']      = data.players[i]['ting_result']   || [];
            
            CACHE.map[ data.players[i]['userId'] ]             = data.players[i]['seatId'];              //uid到sid的影射
            CACHE.playersInfo[localSeatId]['trustee_other']    = data.players[i]['trustee_other']       || false;  // 是否托管
            CACHE.playersInfo[localSeatId]['trustee']          = data.players[i]['trustee']       || 0;  // 是否托管 1 托管 0 没有托管
            CACHE.playersInfo[localSeatId]['state']            = data.players[i]['state']         || ""; // 状态值有：waiting, ready，· playing等等

            CACHE.playersInfo[localSeatId]['pengFromSeat']     = data.players[i]['pengFromSeat']  || [];
            CACHE.playersInfo[localSeatId]['gangFromSeat']     = data.players[i]['gangFromSeat']  || [];
            CACHE.playersInfo[localSeatId]['chiFromSeat']      = data.players[i]['chiFromSeat']   || [];

            CACHE.playersInfo[localSeatId]['ting']             = data.players[i]['ting']          || false; //是否听牌
            CACHE.playersInfo[localSeatId]['all_win_tiles']    = data.players[i]['all_win_tiles'] || [];

        };

        //断线重连，保存赢家的信息
        CACHE.winners = [];
        var winners   = data.hu_infos_reconn || {};
        for(var uid in winners){
            winners[ uid ].win.userId = uid;
            winners[ uid ].win.seatId = CACHE.map[uid];
            CACHE.winners.push(winners[ uid ].win);
        }

        //本地转存
        data.__client_trustee = {};//转存托管数据
        for(var sid in CACHE.playersInfo){
            data.__client_trustee[sid] = CACHE.playersInfo[sid].trustee;
        }

        data.__client_players = {};
        for(var i in data.players){
            var lsid = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( data.players[i].seatId );
            data.__client_players[lsid] = data.players[i].userId;
        }

        PROTOTYPE.parse(_object, CACHE, data);

        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_TABLE_INFO, data);
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_ENTER_ROOM, data);
        }
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.TableInfo",

        /*
        公有数据+接口
        TODO:
        外部调用
        */
        /* 协议解析*/
        parse:function(_data, _slient){
            var data = _data;
            if (!data){
                return;  
            }
            return ___f_notificate(this, data, _slient);
        },

        /*
        激活model，发送一次数据
        返回值：false数据为空 */
        activate:function(){
            return false;
        },
        
        /*
        本家userid
        */ 
        getUserId:function(){
            return CACHE.userId;
        },

        getBankerSeatId:function(){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(CACHE.bankerSeatId);
        },

        /*
        本家服务器seat_id
        */ 
        getActiveServerSeatId:function(){
            return CACHE.serverSeatId;
        },

        /*
        获得比赛类型*/
        getMatchType:function(){
            return CACHE.matchType;
        },

        getRoomName:function(){
            return CACHE.roomName;
        },
        getTableType:function(){
            var _backStr = CACHE.tableType||"";
            GLOBAL_OBJ.LOGD(this._TAG,"getTableType : "+_backStr);
            return _backStr;
        },
        getRoomLevel:function(){
            return CACHE.room_level || "";
        },

        getMinCoin:function(){
            return CACHE.base_chip || 0;
        },

        /*
        是否断线重连*/
        getReconnect:function(){
            return CACHE.reconnect;
        },

        getRemainedCount:function(){
            return CACHE.remained_count;
        },

        /*
        本家本地seat_id
        */ 
        getLocalSeatId:function(){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(CACHE.seatId);
        },

        /*
        需要干掉
        */
        getMyPlayers:function(){
            return CACHE.myPlayers;
        },

        getOptionInfo:function(){
            return CACHE.paramsOptionInfo;
        },

        //根据索引，获取玩家的本地座位号的映射
        getPlayersLocalSeatIdByIndex:function( _index ){
            var player = CACHE.myPlayers[_index] || {};
            var sid    = player.seatId;
            return null != sid ? GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(sid) : null;
        },

        //根据索引，获取玩家的服务器座位号
        getPlayersServerSeatIdByIndex:function( _index ){
            var player = CACHE.myPlayers[_index] || {};
            var sid    = player.seatId;
            return null != sid ? sid : null;
        },

        // 根据本地座位号获取对应玩家手牌
        getDealingTilesByLocalSeatId:function(_localSeatId){
            if (CACHE.playersInfo[_localSeatId]){
                return CACHE.playersInfo[_localSeatId]['tiles'] || [];
            }
            return [];
        },

        // 根据本地座位号获取亮牌
        getLiangTilesByLocalSeatId:function(_localSeatId,Type){
            var liangTiles = [];
            if (CACHE.playersInfo[_localSeatId]){
                if(Type == "liang") {
                    liangTiles = CACHE.playersInfo[_localSeatId]['liangTiles'] || [];
                }else {
                    liangTiles = CACHE.playersInfo[_localSeatId]['tiles'] || [];
                }
            }
            var tempStandTile = [];
            for(var i=0; i<liangTiles.length; i++) {
                if(liangTiles[i] != 0) {
                    tempStandTile.push(liangTiles[i]);
                }
            }
            return tempStandTile;
        },

        // 根据本地座位号获取对应玩家状态
        getTingLiangByLocalSeatId:function(_localSeatId){
            if (CACHE.playersInfo[_localSeatId]){
                return CACHE.playersInfo[_localSeatId]['tingLiang'];
            }
            return "";
        },

        // 根据本地座位号获取对应玩家要胡的牌，也是亮牌后本家禁出的牌
        getWinTilesByLocalSeatId:function(_localSeatId){
            if (CACHE.playersInfo[_localSeatId]){
                return CACHE.playersInfo[_localSeatId]['all_win_tiles'];
            }
            return [];
        },

        // 根据本地座位号获取对应玩家要胡的牌，也是亮牌后本家禁出的牌
        getKouTilesByLocalSeatId:function(_localSeatId){
            if (CACHE.playersInfo[_localSeatId]){
                return CACHE.playersInfo[_localSeatId]['kou_tiles'];
            }
            return [];
        },

        // 根据本地座位号获取对应玩家状态
        getStateByLocalSeatId:function(_localSeatId){
            if (CACHE.playersInfo[_localSeatId]){
                return CACHE.playersInfo[_localSeatId]['state'];
            }
            return "";
        },
        /*
        根据本地座位号获取对应玩家吃的牌
        返回一个数组，数组里包含了吃牌的0号位置牌，如[1,3,4]代表吃[1,2,3],[3,4,5],[4,5,6]
        */
	
        getChowTilesByLocalSeatId:function(_localSeatId){
            if (CACHE.playersInfo[_localSeatId]){
                var _chow_tiles = []; // 二维数组，保存所有吃牌组合
                var chiList = CACHE.playersInfo[_localSeatId]['chi_details'];
                for (var i = 0; i < chiList.length; ++i){
                    _chow_tiles.push(chiList[i]);
                }
                return _chow_tiles;
            }
            return [];
        },

        /*
        根据本地座位号获取对应玩家碰的牌
        返回一个数组，数组里包含了碰牌的0号位置牌，如[1,3,4]代表碰[1,1,1],[3,3,3],[4,4,4]
        */
        getPongTilesByLocalSeatId:function(_localSeatId){
            if (CACHE.playersInfo[_localSeatId]){
                var _pong_tiles = []; // 二维数组，保存所有碰牌组合
                var pongList = CACHE.playersInfo[_localSeatId]['peng_details'];
                for (var i = 0; i < pongList.length; ++i){
                    _pong_tiles.push(pongList[i]);
                }
                return _pong_tiles;
            }
            return [];
        },
        
        /*
        根据本地座位号获取对应玩家杠的牌
        返回一个数组，数组里包含了style（明暗杠标记）和tile（杠牌的0号位置牌花色）
        */
        getKongTilesByLocalSeatId:function(_localSeatId){
            if (CACHE.playersInfo[_localSeatId]){
                var _kong_tiles = []; // 杠牌比较特殊，因为需要标记明暗杠 [{style:0, pattern:[]}]
                var kongList = CACHE.playersInfo[_localSeatId]['gang_details'];
                for (var i = 0; i < kongList.length; ++i){
                    _kong_tiles.push({
                        style: kongList[i].style,
                        pattern : kongList[i].pattern
                    });
                }
                return _kong_tiles;
            }
            return [];
        },

        /*
        根据本地座位号获取对应玩家区域出的弃牌
        返回一个弃牌数组
        */
        getDiscardTilesByLocalSeatId:function(_localSeatId){
            var drop = [];
            if (CACHE.playersInfo[_localSeatId]){
                drop = CACHE.playersInfo[_localSeatId]['drop_tiles'] || [];
            }

            return drop;
        },

        /*
        根据本地座位号获取对应玩家听的牌
        返回一个数组，数组里包含了scoring（胡牌番数）和tile（听牌的花色）以及 lastCnt 剩余张数
        */ 
        getReadyHandTilesByLocalSeatId:function(_localSeatId){
            var data = [];
            if (CACHE.playersInfo[_localSeatId]){
                for (var i = 0; i < CACHE.playersInfo[_localSeatId]['ready_hand_tiles'].length; ++i){
                    data.push({
                        "tile":   CACHE.playersInfo[_localSeatId]['ready_hand_tiles'][i][0],
                        "scoring":CACHE.playersInfo[_localSeatId]['ready_hand_tiles'][i][1],
                        "lastCnt":CACHE.playersInfo[_localSeatId]['ready_hand_tiles'][i][2],
                    })
                }
            }
            return data;
        },

        getTingResult:function (_localSeatId) {
            return CACHE.playersInfo[_localSeatId]['ting_result'];
        },
        getTrusteeStateBySeatId:function (_localSeatId) {//获取托管状态
            return CACHE.playersInfo[_localSeatId]['trustee_other'] || false;
        },

        getServerFee:function () {
            return CACHE.service_fee || 0;
        },
        getChatChip:function () {
            return CACHE.chat_chip || 0;
        },

        getProtectValue:function () {
            return CACHE.protectValue || 0;
        },

        getChatTime:function () {
            return CACHE.chat_time || 0;
        },
	
        /*
        断线重连，获取胡牌玩家数量*/
        getWinnersCount:function(){
            return CACHE.winners.length;
        },

        /**
         * 获取上一局，庄家ID
         * @returns {*}
         */
        getLastBankerId:function () {
            if (CACHE.bankerlasttime_id > -1){
                return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(CACHE.bankerlasttime_id);
            }
            return -1;
        },

        //是否已经胡牌查找
        getWinnerCheck:function(_uid){
            for(var i in CACHE.winners){
                if (CACHE.winners[i].userId == _uid) {
                    return true;
                }
            }
            return false;
        },

        getWinnerUserIdByIndex:function(_index){
            var winner  = CACHE.winners[_index] || {};
            return winner.userId
        },

        getWinnerSeatIdByIndex:function(_index){
            var winner  = CACHE.winners[_index] || {};
            return winner.seatId;
        },

        getWinnerWinModeByIndex:function(_index){
            var winner  = CACHE.winners[_index] || {};
            return winner.type;
        },

        getWinnerTilesInfoByLocalSeatId:function(_localSeatId){
            // var winChow = this.getWinChowTilesByLocalSeatId(_localSeatId);
            // var winPeng = this.getWinPongTilesByLocalSeatId(_localSeatId);
            // var winGang = this.getWinKongTilesByLocalSeatId(_localSeatId);
            return {
                "tiles":CACHE.playersInfo[_localSeatId]['tiles'] || [],
                "pongs":CACHE.playersInfo[_localSeatId]['pong_tiles'] || [],
                "kongs":CACHE.playersInfo[_localSeatId]['kong_tiles'] || [],
                "chows":CACHE.playersInfo[_localSeatId]['chow_tiles'] || [],
                // "pongs":winPeng || [],
                // "kongs":winGang || [],
                // "chows":winChow || [],
                "wonTiles":CACHE.playersInfo[_localSeatId]['won_tiles'] || [],
            };
        },

        /*
        断线重连，根据索引获取胡牌玩家输家信息*/
        getLoserInfoByIndex:function(_index){
            var winner  = CACHE.winners[_index] || {};
            var uids    = winner.loser_uids || [];
            var charges = winner.loser_coins || [];
            var losers = [];
            for(var i in uids){
                losers.push({
                    "userId": uids[i],
                    "seatId": CACHE.map[ uids[i] ],
                    "charge": -1*charges[i],
                    "balance": 100,//这个值没有数据
                });
            }
            return losers;
        },

        getEmojiConfig:function(){
            return CACHE.emojiConfig;
        },

        /*  自建桌  */
        getCustomTableId:function(){
            return CACHE.customRoomInfo.create_table_no || "";
        },

        getCustomTableHostUid:function(){
            return CACHE.customRoomInfo.hostUserId || -1;
        },

        getCurrentProgress:function(){
            return CACHE.customRoomInfo.currentProgress || "等待局数通知";  
        },

        getCustomTableQuan:function(){
            return CACHE.customRoomInfo.quancount_now || 0;
        },

        getTotalTableQuan:function(){
            return CACHE.customRoomInfo.quancount_total || 1;
        },

        getCustomTablePlayTimes:function(){
            return CACHE.customRoomInfo.create_now_cardcount || 0;
        },

        setCustomTablePlayTimes:function( _corCount ){
            CACHE.customRoomInfo.create_now_cardcount = _corCount;
        },
	
        setCustomTableMaxPlayTimes:function( _tolCount ){
            CACHE.customRoomInfo.create_total_cardcount = _tolCount;
        },

        getCustomTableMaxPlayTimes:function(){
            return CACHE.customRoomInfo.create_total_cardcount || 1;
        },

        getFengquan:function(_localSeatId){
            return CACHE.customRoomInfo.fengquan || "北";
        },

        getCustomTableVote:function(){
            return CACHE.customRoomInfo.leave_vote || 0;
        },

        /**
         * 牌桌是否有无字牌选项
         * @returns {*}
         */
        getIsNoFeng:function () {
            if (CACHE.tableType == GLOBAL_OBJ.TableType.Create){
                if (!CACHE.customRoomInfo.itemParams) return false;
                if (!CACHE.customRoomInfo.itemParams.no_feng_arrow_tiles) return false;
                return CACHE.customRoomInfo.itemParams.no_feng_arrow_tiles == 1;
            }
            else{
                return false;
            }
        },

        /*
        测试用例
        TODO:
        model测试用例
        ting_tiles:[1,20,3] 听1万，胡20番，还剩余3张
        */
        test:function(_index){
            
        }
    });//end

})();