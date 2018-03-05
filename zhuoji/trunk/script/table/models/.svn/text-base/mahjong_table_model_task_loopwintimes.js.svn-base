/*****************************************
 *  mahjong_table_model_task_ loopwintimes.js
    (循环任务)牌桌相关model
 *  mahjong
 *
 *  Created by lcr on 17-07-25
 *  
    协议说明：
        牌桌循环任务协议
        roomId是bigRoomId，不是当前玩牌的具体roomId
        roundCount - 循环任务局数
        playTimes - 当前局数
        prize - 任务完成后的奖励描述
    {

        "cmd": "game",
        "result": {
            "action": "loopWinTimesTask",
            "gameId": 701,
            "roomId": 701104,
            "userId": 10108,
            "prize": '', //奖励描述信息
            "winTimes": 2,//赢局次数
            "roundCount":3,
            "awardItems":[
                {
                    "count": 2,
                    "itemId": "user:coupon"
                }
            ] //可能会有多个奖励
        }
    }

    使用说明:

 */

guiyang.table.models.loopwintimestask = (function(){
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
    PROTOTYPE.setPrivateProperty(CACHE, "roomId", 0, "roomId是bigRoomId，不是当前玩牌的具体roomId");
    PROTOTYPE.setPrivateProperty(CACHE, "userId", 0, "userId");
    PROTOTYPE.setPrivateProperty(CACHE, "roundCount", 0, "循环任务局数");
    PROTOTYPE.setPrivateProperty(CACHE, "winTimes", 0, "当前赢局数");
    PROTOTYPE.setPrivateProperty(CACHE, "award", "", "奖励内容");
    PROTOTYPE.setPrivateProperty(CACHE, "prize", "", "任务完成后的奖励描述");
    PROTOTYPE.setPrivateProperty(CACHE, "isHaveLoopWinTimes", false, "是否配有任务");

    /* @共享属性 */
    
    /* @数据通知*/
    var ___f_notificate    = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        };
        
        var data                = _data;
        CACHE.gameId            = data.gameId;
        CACHE.roomId            = data.roomId;
        CACHE.userId            = data.userId;
        CACHE.roundCount        = data.roundCount;
        CACHE.winTimes          = data.winTimes;
        CACHE.award             = data.award;
        CACHE.prize             = data.prize;
        CACHE.awardItems        = data.awardItems;
        CACHE.isHaveLoopWinTimes   = true;

        GLOBAL_OBJ.LOGD("loopwintimestask's data is :", JSON.stringify(data));
        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);
        
        // if (!_slient){
        //     GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_NOTIFY_GRAB_GANG_HU, data);
        // };
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.loopwintimestask",
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

        //循环任务局数
        getLoopWinTimesRoundCount:function(){
            return CACHE.roundCount
        },

        //当前赢局数
        getLoopWinTimesPlayTimes:function(){
            return CACHE.winTimes;
        },

        //任务完成后的奖励描述
        getLoopWinTimesPrize:function(){
            return CACHE.prize || "";
        },

        //任务完成后的奖励
        getLoopWinTimesawardItems:function(){
            return CACHE.awardItems || [];
        },

        getIsHaveLoopWinTimes:function () {
            return CACHE.isHaveLoopWinTimes || false;
        },

        //奖励
        getLoopAcviveAward:function(){
            return CACHE.award || "";
        },

        loopAcviveTransition:function () {
            var _data = {};
            _data['current'] = CACHE.winTimes;
            _data['total'] = CACHE.roundCount;
            if (CACHE.awardItems[0] && CACHE.awardItems[0]['itemId']) {
                _data['type'] = CACHE.awardItems[0]['itemId'];
            }
            _data['prize'] = CACHE.prize;
            _data['nextNum'] = CACHE.winTimes;
            if (CACHE.winTimes > 0) {
                _data['current'] = CACHE.winTimes - 1;
            }else {
                _data['current'] = 0;
            }
            if (CACHE.winTimes >= CACHE.roundCount) {
                _data['succeed'] = true;
            }else {
                _data['succeed'] = false;
            }
            return _data;
        },

    });
})();