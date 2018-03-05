/*****************************************
 *  mahjong_table_model_notify_timeout.js
    (牌桌倒计时)相关model
 *
 *  Created by lcr on 17-06-29
 *  
    协议说明：
 {
     "cmd": "notifyTimeOut",
     "result":{
         "gameId": 701,
         "roomId": 7309011001,
         "tableId": 73090110010200,
         "seatId": 0,  //超时玩家座位号
         "timeOut": 12,   //超时时间
         "times":3 //超时次数
     }
 }
    使用说明:

 */

guiyang.table.models.notifytimeout = (function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;
    
    /*
    私有数据+接口
    TODO:
    数据的原型，存储以及通知的抛出
    */

    /* @数据缓存*/
    var CACHE                 = {}
    var PROTOTYPE             = GLOBAL_OBJ.table.models.Prototype;

    /* @私有属性 */
    PROTOTYPE.setPrivateProperty(CACHE, "gameId", 701, "游戏id");
    PROTOTYPE.setPrivateProperty(CACHE, "roomId", 0, "房间id");
    PROTOTYPE.setPrivateProperty(CACHE, "tableId", 701, "牌桌id");
    PROTOTYPE.setPrivateProperty(CACHE, "seatId", 0, "超时玩家座位号");

    PROTOTYPE.setPrivateProperty(CACHE, "timeOut", 12, "超时时间");
    PROTOTYPE.setPrivateProperty(CACHE, "times", 0, "超时次数");


    /* @共享属性 */

    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_FAKE_MSG );
    
    /* @数据通知*/
    var ___f_notificate    = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        };
        
        var data            = _data;
        CACHE.timeOut       = data.timeOut;
        CACHE.times         = data.times;
        CACHE.seatId        = data.seatId;
        // GLOBAL_OBJ.LOGD("notifytimeout_data:", JSON.stringify(data) );


        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);
        
        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_NOTIFY_TIMEOUT, data);
        };
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.notifytimeout",

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

        getNotifyTimeOut:function(){
            return CACHE.timeOut || 0;
        },

        getNotifyTimes:function(){
            return CACHE.times || 0;
        },

        getNotifyTimeActivitySeatId:function () {
            var localSeatId 		= GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(CACHE.seatId);
            return localSeatId;
        }

    });
})();