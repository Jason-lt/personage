/***********************************
 * mahjong_table_model_chong_feng
 * 独立冲锋鸡
 * Create by simon on 17-12-18
 * 协议说明：
 cmd: table_call
 result: {
            action: chong_feng,
            gameId: 720,
            roomId: xxx,
            tableId: xxx,
            userId: xxxx,
            seatId: x
}
 */

(function () {
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.table.models.Chong_Feng = (function () {
        // 数据缓存
        var CACHE = {};
        var PROTOTYPE = GLOBAL_OBJ.table.models.Prototype;

        // 私有属性
        PROTOTYPE.setPrivateProperty(CACHE, "seatId", 0, "冲锋鸡玩家seatId");
        PROTOTYPE.setPrivateProperty(CACHE, "userId", 0, "冲锋鸡玩家userId");

        // 共享属性
        PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_ACTION_ID);

        // 数据通知
        var ___f_notificate = function (_object, _data, _slient) {
            if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true) {
                return _slient;
            }
            var data = _data;

            CACHE.seatId        = data.seatId;
            CACHE.currentSeatId = data.seatId;
            CACHE.userId        = data.userId;

            // 静态数据部分
            PROTOTYPE.parse(_object, CACHE, data);

            if (!_slient) {
                GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHONG_FENG, data);
            };
            return _slient;
        };

        return PROTOTYPE.functionsExt(CACHE, {
            _TAG:"table.models.Chong_Feng",

            /*
             公有数据+接口
             TODO:
             外部调用
             */
            /* 协议解析*/
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

            /*
             @获得当前协议中的玩家的本地座位号*/
            getCurrentLocalSeatId:function(){
                return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.currentSeatId );
            },

            // 获得听牌玩家的 本地座位号
            getLocalSeatId:function () {
                return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(CACHE.seatId);
            },
        });
    })();
})();