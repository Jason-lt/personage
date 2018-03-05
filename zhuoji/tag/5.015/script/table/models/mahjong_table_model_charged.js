/*****************************************
 *  mahjong_table_model_charged.js
    (充值者通知结果的模块，广播)牌桌相关model
 *  mahjong
 *
 *  Created by lcr on 17-06-30
 *  
    协议说明：

 {
    "cmd": "table_call",
    "result": {
        "aciton": "charged",    // 正在充值
        "seatId": 0,          // 正在充值的座位号
        "action_id": 10,
        "result": 0,          // 0:充值成功，继续游戏； -2:充值失败
        "dis": "您充值180万金币，已为您买入60万金币，还有120万金币"
    }
}
    使用说明:

 */

guiyang.table.models.charged = (function(){
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
    PROTOTYPE.setPrivateProperty(CACHE, "seatId", 0, "待充值的座位号");
    PROTOTYPE.setPrivateProperty(CACHE, "dis", "", "补充60万金币，继续游戏");
    PROTOTYPE.setPrivateProperty(CACHE, "result", 0, "0:充值成功，继续游戏； -2:充值失败");

    /* @共享属性 */

    // PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TIME_OUT);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_ACTION_ID);
    
    /* @数据通知*/
    var ___f_notificate    = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        };
        
        var data            = _data;
        CACHE.seatId        = data.seatId;
        CACHE.dis           = data.dis;
        CACHE.result        = data.result;
        // GLOBAL_OBJ.LOGD("charged_data=", JSON.stringify(data) );
        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);
        
        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHARGD, data);
        };
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.charged",

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

        //充值完成玩家的服务器座位号
        getChargedServerId:function(){
            return CACHE.seatId;
        },

        //充值完成玩家的本地座位号
        gethargedLocalId:function(){
            var sid = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(CACHE.seatId);
            return sid;
        },

        getChargedDis:function(){
            return CACHE.dis || "";
        },

        getChargedResult:function(){
            return CACHE.result;
        },
    });
})();