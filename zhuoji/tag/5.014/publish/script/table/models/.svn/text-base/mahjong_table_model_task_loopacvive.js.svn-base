/*****************************************
 *  mahjong_table_model_task_loopacvive.js
    (循环任务)牌桌相关model
 *  mahjong
 *
 *  Created by lcr on 17-07-19
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
            "action": "loopActiveTask",
            "gameId": 701,
            "roomId": 701104,
            "userId": 10108,
            "roundCount": 2,
            "playTimes": 0,
            "prize": "\\u8fde\\u7eed\\u73a92\\u5c40\\uff0c\\u900110\\u5f20\\u5956\\u5238",
            "award": "金币",
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
(function () {
    "use strict";
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.table.models.loopacvivetask = (function(){


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
        PROTOTYPE.setPrivateProperty(CACHE, "playTimes", 0, "当前局数");
        PROTOTYPE.setPrivateProperty(CACHE, "prize", "", "任务完成后的奖励描述");
        PROTOTYPE.setPrivateProperty(CACHE, "award", "", "奖励内容");

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
            CACHE.playTimes         = data.playTimes;
            CACHE.prize             = data.prize;
            CACHE.award             = data.award;
            CACHE.awardItems        = data.awardItems;
            CACHE.isHaveLoopActive  = true;

            // GLOBAL_OBJ.LOGD("loopacvivetask's data is :", JSON.stringify(data));
            //静态数据部分
            PROTOTYPE.parse(_object, CACHE, data);

            // if (!_slient){
            //     GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_NOTIFY_GRAB_GANG_HU, data);
            // };
            return _slient;
        };

        return PROTOTYPE.functionsExt(CACHE, {
            _TAG:"table.models.loopacvivetask",
            /*
             公有数据+接口
             TODO:
             外部调用
             */
            /* 协议解析*/
            parse:function(_data, _slient){
                var data = _data;
                // GLOBAL_OBJ.LOGD(this._TAG, "task_loopacvive parse data = " + JSON.stringify(data));
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
            getLoopAcviveRoundCount:function(){
                return CACHE.roundCount || 0;
            },

            //当前局数
            getLoopAcvivePlayTimes:function(){
                return CACHE.playTimes;
            },
            

            loopAcviveTransition:function () {
                var _data = {};
                _data['current'] = CACHE.playTimes;
                _data['total'] = CACHE.roundCount;
                _data['type'] = CACHE.awardItems[0]['itemId'];
                _data['award'] = CACHE.award;
                _data['prize'] = CACHE.prize;
                _data['nextNum'] = CACHE.playTimes;
                if (CACHE.playTimes > 0) {
                    _data['current'] = CACHE.playTimes - 1;
                }else {
                    _data['current'] = 0;
                }
                if (CACHE.playTimes >= CACHE.roundCount) {
                    _data['succeed'] = true;
                }else {
                    _data['succeed'] = false;
                }
                return _data;
            },

            //当前完成比例
            getLoopAcviveScale:function(){
                if (CACHE.roundCount === 0) {
                    return 0
                }
                return CACHE.playTimes/CACHE.roundCount;
            },

            //任务完成后的奖励描述
            getLoopAcvivePrize:function(){
                return CACHE.prize || "";
            },

            //奖励
            getLoopAcviveAward:function(){
                return CACHE.award || "";
            },

            //奖励
            getLoopAcviveAwardItems:function(){
                return CACHE.awardItems || [];
            },

            getIsHaveLoopActive:function () {
                return CACHE.isHaveLoopActive || false;
            },


        });
    })();
})();

