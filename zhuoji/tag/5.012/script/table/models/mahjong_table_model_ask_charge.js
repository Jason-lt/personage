/*****************************************
 *  mahjong_table_model_ask_charge.js
    (充值者的模块)牌桌相关model
 *  mahjong
 *
 *  Created by lcr on 17-06-30
 *  
    协议说明：

 {
     "cmd": "table_call",
     "result": {
         "aciton": "ask_charge", // 询问是否充值
         "seatId": 0,          // 待充值的座位号
         "action_id": 10,
         "timeout": 12,
         "dis": "补充60万金币，继续游戏"
     }
 }
    使用说明:

 */

guiyang.table.models.ask_charge = (function(){
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
    PROTOTYPE.setPrivateProperty(CACHE, "seatId", 0, "待充值的座位号");
    PROTOTYPE.setPrivateProperty(CACHE, "dis", "", "补充60万金币，继续游戏");
    PROTOTYPE.setPrivateProperty(CACHE, "roomId", 0, "roomId");
    PROTOTYPE.setPrivateProperty(CACHE, "tableId", 0, "tableId");

    /* @共享属性 */

    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TIME_OUT);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_ACTION_ID);
    
    /* @数据通知*/
    var ___f_notificate    = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        };
        
        var data            = _data;
        CACHE.seatId        = data.seatId;
        CACHE.dis           = data.dis;
        CACHE.roomId        = data.roomId;
        CACHE.tableId       = data.tableId;
        // GLOBAL_OBJ.LOGD("ask_charge_data=", JSON.stringify(data) );
        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);
        
        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_ASK_CHARGE, data);
        }
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.ask_charge",

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

        //待充值的服务器座位号
        getAskChargeServerId:function(){
            return CACHE.seatId;
        },

        //待充值的服务器roomId
        getAskChargeRoomId:function(){
            return CACHE.roomId;
        },

        //待充值的服务器tableId
        getAskChargeTableId:function(){
            return CACHE.tableId;
        },

        //待充值的本地座位号
        getAskChargeLocalId:function(){
            var sid = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(CACHE.seatId);
            return sid;
        },

        getAskChargeDis:function(){
            return CACHE.dis || "";
        },
    });
})();