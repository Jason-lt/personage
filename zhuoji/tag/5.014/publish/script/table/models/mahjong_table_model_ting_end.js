/***********************************
 * mahjong_table_model_ting_end
 * 听牌结束
 * Create by simon on 17-12-22
 * 协议说明：
 {
     "cmd":"first_end",
     "result":{
         "gameId":720,
         "roomId":7201001001,
         "tableId":72010010010100,
         "userId":10005,
         "seatId":3,
         "timeOut":12,
         "reconnect":false,
         "action_id":8,
         "ting_state_list":[0, 0, 0, 0]
     }
 }
 */

(function () {
    "use strict";
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.table.models.Ting_End = (function () {
        // 数据缓存
        var CACHE = {};
        var PROTOTYPE = GLOBAL_OBJ.table.models.Prototype;

        // 私有属性
        PROTOTYPE.setPrivateProperty(CACHE, "ting_state_list", [], "0代表未听牌，1代表软听，2代表硬听");

        // 数据通知
        var ___f_notificate = function (_object, _data, _slient) {
            if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true) {
                return _slient;
            }
            var data = _data;

            CACHE.ting_state_list = data.ting_state_list;

            // 静态数据部分
            PROTOTYPE.parse(_object, CACHE, data);

            if (!_slient) {
                GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_TABLE_TING_END, data);
            };

            return _slient;
        };

        return PROTOTYPE.functionsExt(CACHE, {
            _TAG:"table.models.Ting_End",

            /*
             公有数据+接口
             TODO:
             外部调用
             */

            // 协议解析
            parse:function (_data, _slient) {
                var data = _data;
                if (!data) {
                    return;
                };
                return ___f_notificate(this, data, _slient);
            },

            /*
             激活model，发送一次数据
             返回值：false数据为空 */
            activate:function () {
                return false;
            },

            getTingStateByLocalSeatId:function (_localSeatId) {
                var serverId = GLOBAL_OBJ.table.utils.Seat.toServerSeatId(_localSeatId);
                return CACHE.ting_state_list[serverId];
            },
        });
    })();
})();