/*****************************************
 *  mahjong_table_model_absence_own.js
 *  定缺(自己)
 *  Created by simon on 17-12-20
 *
 *  协议说明：
    //开始定缺
    {
     "cmd": "notify_absence",
     "result":{
         "gameId": 701,
         "roomId": 7309011001,
         "tableId": 73090110010200,
         "seatId": 0,
         "isConnect":0,// 0:不是断线重练。1:断线重练
         "color": 1,// 0:万 1:筒 2:条
        }
    }
 */

(function () {
    "use strict";
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.table.models.Absence_Own = (function(){

        /*
        私有数据+接口
        TODO:
        数据的原型，存储以及通知的抛出
        */

        /* @数据缓存*/
        var CACHE                 = {};
        var PROTOTYPE             = GLOBAL_OBJ.table.models.Prototype;

        /* @私有属性 */
        PROTOTYPE.setPrivateProperty(CACHE, "color", 0, "提示用户定缺哪种花色");
        PROTOTYPE.setPrivateProperty(CACHE, "seatId", 0, "用户服务器的座位号");
        PROTOTYPE.setPrivateProperty(CACHE, "isReconnect", false, "游戏是否断线重连");

        /* @数据通知*/
        var ___f_notificate    = function(_object, _data, _slient){
            if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
                return _slient;
            };

            var data                = _data;
            CACHE.color             = data.color;
            CACHE.seatId            = data.seatId;
            CACHE.isReconnect       = data.reconnect;

            //静态数据部分
            PROTOTYPE.parse(_object, CACHE, data);

            if (!_slient){
                GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_ABSENCE_OWN, data);
            };
            return _slient;
        };

        return PROTOTYPE.functionsExt(CACHE, {
            _TAG:"table.models.Absence_Own",
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

            //获得自己服务器的座位号
            getSeatId:function(){
                return CACHE.seatId;
            },

            getActiveLocalSeatId:function () {
                return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.seatId );
            },

            //获得服务器推荐的定缺花色种类 0:万 1:筒 2:条
            getMySelfColorData:function(){
                return CACHE.color || 0;
            },

            //获取游戏是否断线重连
            getIsConnect:function(){
                return CACHE.isReconnect || false;
            }
        });
    })();
})();