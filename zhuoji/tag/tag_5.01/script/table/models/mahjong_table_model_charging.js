/*****************************************
 *  mahjong_table_model_charging.js
    (有人在充值,提示其他人的模块)牌桌相关model
 *  mahjong
 *
 *  Created by lcr on 17-06-30
 *  
    协议说明：
 {
     "cmd": "table_call",
     "result": {
         "aciton": "charging",   // 正在充值
         "seatId": 0,          // 正在充值的座位号
         "action_id": 10,
         "timeout": 12
     }
 }
    使用说明:

 */
(function () {
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.table.models.charging = (function(){

        /*
         私有数据+接口
         TODO:
         数据的原型，存储以及通知的抛出
         */

        /* @数据缓存*/
        var CACHE                 = {}
        var PROTOTYPE             = GLOBAL_OBJ.table.models.Prototype;

        /* @私有属性 */
        PROTOTYPE.setPrivateProperty(CACHE, "seatId", 0, "正在充值的座位号");
        /* @共享属性 */

        // PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_FAKE_MSG );
        PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TIME_OUT);
        PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_ACTION_ID);

        /* @数据通知*/
        var ___f_notificate    = function(_object, _data, _slient){
            if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
                return _slient;
            };

            var data            = _data;
            CACHE.seatId        = data.seatId;
            // GLOBAL_OBJ.LOGD("charging_data:", JSON.stringify(data) );
            //静态数据部分
            PROTOTYPE.parse(_object, CACHE, data);

            if (!_slient){
                GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHARGING, data);
            };
            return _slient;
        };

        return PROTOTYPE.functionsExt(CACHE, {
            _TAG:"table.models.charging",

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

            //正在充值的服务器座位号
            getChargingServerId:function(){
                return CACHE.seatId;
            },

            //正在充值的本地座位号
            getChargingLocalId:function(){
                var sid = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(CACHE.seatId);
                return sid;
            },

        });
    })();
})();

