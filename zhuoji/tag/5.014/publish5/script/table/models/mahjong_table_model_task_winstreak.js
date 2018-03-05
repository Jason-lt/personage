/*****************************************
 *  mahjong_table_model_task_winstreak.js
    (连胜任务模块)牌桌相关model
 *  mahjong
 *
 *  Created by lcr on 17-07-19
 *  
    协议说明：
    //  血战／血流现添加连胜任务，连胜任务消息分为两种：1、连胜消息 2、连胜中断消息。连胜消息需要携带连胜描述信息，
        比如胜1场奖励20金币，胜2场奖励30金币...等。连胜中断需要发送连胜的中断时的次数，及最大连胜纪录。
    {

        "cmd": "game",
        "result": {
            "action": "winStreakTask",
            "gameId": 701,
            "roomId": 701104,
            "userId": 10108,
            "winStreaks": True //True表明连胜  False表明连胜中断
            "desc": Object{}, //连胜奖励描述信息 连胜中有
            "winCount": 2, //连胜次数
            "winMaxCount": 2 //最大连胜次数
            "firstBlood": true //首次游戏获得的连胜
        }
    }

    使用说明:

 */

guiyang.table.models.winstreaktask = (function(){
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
    PROTOTYPE.setPrivateProperty(CACHE, "gameId", 0, "gameId");
    PROTOTYPE.setPrivateProperty(CACHE, "roomId", 0, "roomId");
    PROTOTYPE.setPrivateProperty(CACHE, "userId", 701, "userId");
    PROTOTYPE.setPrivateProperty(CACHE, "winStreaks", true, "True表明连胜  False表明连胜中断");
    PROTOTYPE.setPrivateProperty(CACHE, "desc", [], "连胜奖励描述信息 连胜中有");
    PROTOTYPE.setPrivateProperty(CACHE, "winCount", 0, "连胜次数");
    PROTOTYPE.setPrivateProperty(CACHE, "winMaxCount", 0, "最大连胜次数");
    PROTOTYPE.setPrivateProperty(CACHE, "firstBlood", false, "是否是首胜");
    PROTOTYPE.setPrivateProperty(CACHE, "newLog", false, "是否是新记录");
    PROTOTYPE.setPrivateProperty(CACHE, "isHaveWinStreak", false, "是否配置了连胜任务");
    for(var i = 0 ; i < 1 ; ++i) {
        PROTOTYPE.setPrivateProperty(CACHE, i, {}, i + "#座位（本地座位号）玩家");
    }

    /* @共享属性 */
    
    /* @数据通知*/
    var ___f_notificate    = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        }
        
        var data                = _data;
        CACHE.gameId            = data.gameId;
        CACHE.userId            = data.userId;
        CACHE.roomId            = data.roomId;
        CACHE.winStreaks        = data.winStreaks;
        CACHE.desc              = data.desc;
        CACHE.winCount          = data.winCount;
        CACHE.winMaxCount       = data.winMaxCount;
        CACHE.newLog            = data.isHistoryMax;
        CACHE.firstBlood        = data.firstBlood;
        CACHE.firstGetCoupon    = data.firstGetCoupon;
        CACHE.isHaveWinStreak   = true;

        if (null != data.userTileInfo) {
            var playInfo                = data.userTileInfo;
            CACHE[0].tiles              = playInfo.tiles || [];
            CACHE[0].tiles.sort(function(a,b){ return a<b; });
            CACHE[0].chow               = playInfo.chi || [];
            CACHE[0].pong               = playInfo.peng || [];
            CACHE[0].kong               = playInfo.gang || [];
            CACHE[0].tile               = playInfo.tile;
        }

        GLOBAL_OBJ.LOGD("winstreaktask's data is :", JSON.stringify(data));
        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);
        
        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_WIN_STREAK_BTN_STATE, data);
        }
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.winstreaktask",
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

        //True表明连胜  False表明连胜中断
        getWinStreaks:function(){
            return CACHE.winStreaks;
        },

        //连胜奖励描述信息 连胜中有
        getWinStreakDesc:function(){
            return CACHE.desc;
        },

        //连胜次数
        getWinStreakCount:function(){
            return CACHE.winCount || 0;
        },

        //最大连胜次数
        getMaxWinCount:function(){
            return CACHE.winMaxCount || 0;
        },

        //是否创造了新记录
        getIsNewLog:function(){
            return CACHE.newLog || false;
        },

        //是否是首胜
        getFirstWin:function(){
            return CACHE.firstBlood;
        },

        //是否是初次获得奖券
        getFirstGetCoupon:function(){
            return CACHE.firstGetCoupon || false;
        },

        getIsHaveWinStreak:function () {
            return CACHE.isHaveWinStreak || false;
        },


        /*
         获取手牌数量*/
        getTilesCount:function( _localSeatId ){
            if(CACHE[_localSeatId].tiles){
                return CACHE[_localSeatId].tiles.length;
            }else{
                return 0;
            }
        },

        // 获取 手牌 花色
        getTileByIndex:function(_localSeatId, _index){
            return CACHE[_localSeatId].tiles[_index];
        },

        //得到和牌
        getWinTile:function(_localSeatId){
            var aa = CACHE[_localSeatId].tile;
            // var aa = [1,1,2,5,4,4,7];
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

            // return CACHE[_localSeatId].tile;
        },

        /*
         返回当前所有的吃牌(完整)数组
         chowTranslation 返回的是一个安全的二维数组*/
        getChowed:function(_localSeatId){
            return CACHE[_localSeatId].chow || [];
        },

        /*
         返回当前所有的碰牌(完整)数组
         pongTranslation 返回的是一个安全的二维数组*/
        getPonged:function(_localSeatId){
            return  CACHE[_localSeatId].pong || [];
        },

        /*
         返回当前所有的杠牌(完整)数组
         pongTranslation 返回的是一个安全的对象{style:0, tiles:[0,0,0,0]}*/
        getKonged:function(_localSeatId){
            var kongs = [];
            for(var i in CACHE[_localSeatId].kong){
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
        }

    });
})();