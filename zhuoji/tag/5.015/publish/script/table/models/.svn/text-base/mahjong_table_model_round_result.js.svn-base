/*****************************************
 *  mahjong_table_model_round_result.js
    (最终结算数据)牌桌相关model
 *  mahjong
 *
 *  Created by lcr on 17-06-22
 *  
    协议说明：
    {
     "cmd":"round_result",
     "result":{
         "gameId":7,
         "tableId" 8343894,
         "timestamp":1473782986.013167,
         "gameFlow":true,//是否流局
         "create_final":1,//自建桌是否是最后一局
         "infos":[
             {
                 "userId":1008,
                 "seatId":1,
                 "totalFan":4, //显示总共多少番 目前只有杠分+番型
                 "patternInfo": ["清一色"], //设置为列表，方便扩展，有该字段就是大胡
                 "totalScore":20，
                 "tilesInfo":Object{...} //遵照lose里面的tilesInfo消息
             },
             {

             }
            ]
        }
    }
    使用说明:
 */

guiyang.table.models.roundresult = (function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;
    
    /*
    私有数据+接口
    TODO:
    数据的原型，存储以及通知的抛出
    */

    /* @数据缓存*/
    var CACHE                 = {};
    var PROTOTYPE             = GLOBAL_OBJ.table.models.Prototype;

    /* @私有属性 */
    for(var i = 0 ; i < 4 ; ++i) {
        PROTOTYPE.setPrivateProperty(CACHE, i, {}, i + "#座位（本地座位号）玩家");
    }
    PROTOTYPE.setPrivateProperty(CACHE, "gameFlow", false, "是否是流局");
    PROTOTYPE.setPrivateProperty(CACHE, "gameId", 701, "游戏id");
    PROTOTYPE.setPrivateProperty(CACHE, "tableId", 0, "牌桌号");
    PROTOTYPE.setPrivateProperty(CACHE, "infos", [], "牌局结束最终数据");
    PROTOTYPE.setPrivateProperty(CACHE, "final", 0, "牌局局数是否结束");

    /* @共享属性 */
    
    /* @数据通知*/
    var ___f_notificate    = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        };

        var data                = _data;
        CACHE.gameFlow          = data.gameFlow;
        CACHE.gameId            = data.gameId;
        CACHE.tableId           = data.tableId;
        CACHE.final             = data.create_final;
        CACHE.infos             = data.infos;

        if (null != data.infos) {
            var playInfo;
            var localSeatId;
            for(var i = 0; i < data.infos.length; ++i){
                playInfo  = data.infos[i];
                localSeatId                           = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( playInfo.seatId );
                CACHE[localSeatId].tiles              = playInfo.tilesInfo.tiles;
                CACHE[localSeatId].tiles.sort(function(a,b){ return a<b; });
                CACHE[localSeatId].chow               = playInfo.tilesInfo.chi || [];
                CACHE[localSeatId].pong               = playInfo.tilesInfo.peng || [];
                CACHE[localSeatId].kong               = playInfo.tilesInfo.gang || [];
                CACHE[localSeatId].tile               = playInfo.tilesInfo.tile;

                CACHE[localSeatId].userid             = playInfo.userId;             // 用户userid
                CACHE[localSeatId].seatId             = playInfo.seatId;             // 用户seatId
                CACHE[localSeatId].totalFan           = playInfo.totalFan;           // 总共多少番
                CACHE[localSeatId].patternInfo        = playInfo.patternInfo || [];  // 大胡数据 ["清一色"]
                CACHE[localSeatId].iswin              = playInfo.iswin || 0;         // 是否是胜利
                CACHE[localSeatId].totalScore         = playInfo.totalScore;         // 分或金币数
                CACHE[localSeatId].bankrupt           = playInfo.bankrupt;           // 是否破产
                CACHE[localSeatId].actionHuInfo       = playInfo.actionHuInfo || ""; // 胡法 "杠上开花 海底捞月"
            }
        }

        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);

        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_ROUND_RESULT, data);
        };
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.roundresult",
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
            };
            return ___f_notificate(this, data, _slient);
        },

        /*
        激活model，发送一次数据
        返回值：false数据为空 */
        activate:function(){
            return false;
        },

        //获得是否流局
        getGameFlow:function(){
            return CACHE.gameFlow || false;
        },

        getSiChuanFinal:function(){
            return CACHE.final || 0;
        },
        
        //得到userid
        getUserIdByLocalId:function ( _localSeatId ) {
            return CACHE[_localSeatId].userid;
        },

        //得到是否破产
        getBankrupt:function ( _localSeatId ) {
            return CACHE[_localSeatId].bankrupt || false;
        },

        //得到分数
        getTotalScoreByLocalId:function ( _localSeatId ) {
            return CACHE[_localSeatId].totalScore;
        },

        //得到番数
        getTotalFanByLocalId:function ( _localSeatId ) {
            return CACHE[_localSeatId].totalFan;
        },

        //得到大胡数据
        getPatternInfoByLocalId:function ( _localSeatId ) {
            return CACHE[_localSeatId].patternInfo;
        },

        getIsWin:function (_localSeatId) {
            return CACHE[_localSeatId].iswin;
        },

        /*
         获取手牌*/
        getStandUpOverTiles:function( _localSeatId ){
            return CACHE[_localSeatId].tiles;
        },

        /*
         获取手牌数量*/
        getTilesCount:function( _localSeatId ){
            return CACHE[_localSeatId].tiles.length;
        },

        // 获取 手牌 花色
        getTileByIndex:function(_localSeatId, _index){
            return CACHE[_localSeatId].tiles[_index];
        },

        //得到和牌
        getWinTile:function(_localSeatId){
            var aa = CACHE[_localSeatId].tile;
            var bb = {};
            for(var i in aa){
                var tile = aa[i];
                var isNothing = true;
                for(var j in bb){
                    if(parseInt(j) == tile){
                        bb[j] = bb[j] + 1;
                        isNothing = false;
                    }
                }
                if(isNothing){
                    bb[aa[i].toString()] = 1;
                }
            }
            return bb;
        },

        /*
         返回当前所有的吃牌(完整)数组
         chowTranslation 返回的是一个安全的二维数组*/
        getChowed:function(_localSeatId){
            return CACHE[_localSeatId].chow;
        },

        /*
         返回当前所有的碰牌(完整)数组
         pongTranslation 返回的是一个安全的二维数组*/
        getPonged:function(_localSeatId){
            return  CACHE[_localSeatId].pong;
        },

        /*
         返回当前所有的杠牌(完整)数组
         pongTranslation 返回的是一个安全的对象{style:0, tiles:[0,0,0,0]}*/
        getKonged:function(_localSeatId){
            var kongs = [];
            for(var i in CACHE[_localSeatId].kong){
                GLOBAL_OBJ.LOGD(this._TAG,"CACHE[_localSeatId].kong ["+i+"] ");
                kongs.push(
                    GLOBAL_OBJ.table.models.Functions.kongTranslation(
                        [ CACHE[_localSeatId].kong[i] ],
                        CACHE[_localSeatId].kong[i].style == 1 ?
                            GLOBAL_OBJ.table.global.METHODS.EXPOSED_KONG
                            :
                            GLOBAL_OBJ.table.global.METHODS.CONCEALED_KONG,
                        4
                    )[0] || {}
                );
            }
            return kongs;
        },

        getActionHuInfoByLocalId:function (_localSeatId) {
            return CACHE[_localSeatId].actionHuInfo;
        },

        getBigWinTile:function (_localSeatId) {
            var wintile = CACHE[_localSeatId].winTile || null;
            return wintile;
        }

    });
})();