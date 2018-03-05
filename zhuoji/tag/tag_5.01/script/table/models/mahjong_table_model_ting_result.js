/***********************************
 * mahjong_table_model_ting_result
 * 上听后的数据更新
 * Create by simon on 17-12-16
 * 协议说明：
 {
     "cmd":"table_call",
     "result":{
         "action":"updateTingResult",
         "gameId":720,
         "roomId":7201001001,
         "tableId":72010010010099,
         "seatId":0,
         "tingResult":[
             [
                 21,
                 10,
                 2
             ],
             [
                 22,
                 10,
                 1
             ]
         ],
         "ishuAll":false
     }
 }
 */

(function () {
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.table.models.Ting_Result = (function () {
        // 数据缓存
        var CACHE = {};
        var PROTOTYPE = GLOBAL_OBJ.table.models.Prototype;

        // 私有属性
        PROTOTYPE.setPrivateProperty(CACHE, "seatId", 0, "听牌玩家服务端ID");
        PROTOTYPE.setPrivateProperty(CACHE, "ting_type", 0, "1代表，硬（天）听，2代表软（地）听");
        PROTOTYPE.setPrivateProperty(CACHE, "tingResult", [], "听牌数组");

        // 数据通知
        var ___f_notificate = function (_object, _data, _slient) {
            if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true) {
                return _slient;
            }
            var data = _data;

            CACHE.seatId     = data.seatId;
            CACHE.ting_type  = data.ting_type;
            CACHE.tingResult = data.tingResult;

            // 静态数据部分
            PROTOTYPE.parse(_object, CACHE, data);

            if (!_slient) {
            };
            return _slient;
        };

        return PROTOTYPE.functionsExt(CACHE, {
            _TAG:"table.models.Ting_Result",

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

            // 获得听牌玩家的 本地座位号
            getLocalSeatId:function () {
                return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(CACHE.seatId);
            },

            getTingType:function () {
                return CACHE.ting_type;
            },

            getTingResult:function () {
                var result = [];
                var data = CACHE.tingResult;
                var dataSize = data.length;
                if (dataSize) {
                    for (var i = 0; i < dataSize; i++) {
                        result.push({
                            "tile" :    data[i][0],
                            "scoring" : data[i][1],
                            "lastCnt" : data[i][2],
                        });
                    }
                }
                return result;
            },

        });
    })();
})();