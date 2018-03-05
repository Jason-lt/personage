/***********************************
 * mahjong_table_model_ask_ting
 * 贵阳听牌
 * Create by simon on 17-12-5
 * 协议说明：
 cmd: table_call
 result: {
            action: ask_ting,
            action_id: xxx,
            gameId: 720,
            roomId: xxx,
            tableId: xxx,
            userId: xxxx,
            all_win_tiles: [],
            timeOut: 6,
            type: 1          1代表，硬（天）听，2代表软（地）听
         }
 */

(function () {
    "use strict";
    var GLOBAL_OBJ = guiyang;
    var MODEL_DRAW = GLOBAL_OBJ.table.models.Draw;

    GLOBAL_OBJ.table.models.Ask_Ting = (function () {
        // 数据缓存
        var CACHE = {};
        var PROTOTYPE = GLOBAL_OBJ.table.models.Prototype;

        // 私有属性
        PROTOTYPE.setPrivateProperty(CACHE, "seatId", 0, "听牌玩家服务端ID");
        PROTOTYPE.setPrivateProperty(CACHE, "type", 0, "1代表，硬（天）听，2代表软（地）听");
        PROTOTYPE.setPrivateProperty(CACHE, "all_win_tiles", [], "听牌预览数组");
        PROTOTYPE.setPrivateProperty(CACHE, "activeSeatId", -1, "听牌玩家服务端ID")

        // 共享属性
        PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_ACTION_ID);
        PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_WIN_POINTS);
        PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_ASK_TING);
        PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TILE);

        // 数据通知
        var ___f_notificate = function (_object, _data, _slient) {
            if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true) {
                return _slient;
            }
            var data = _data;

            CACHE.seatId        = data.seatId;
            CACHE.activeSeatId  = data.seatId;
            CACHE.type          = data.type;
            CACHE.all_win_tiles = data.all_win_tiles;

            // 静态数据部分
            PROTOTYPE.parse(_object, CACHE, data);

            if (!_slient) {
                GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_TABLE_ASK_TING, data);
            };
            return _slient;
        };

        return PROTOTYPE.functionsExt(CACHE, {
            _TAG:"table.models.Ask_Ting",

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

            getActiveLocalSeatId:function () {
                return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(CACHE.activeSeatId);
            },

            // 获得听牌玩家的 本地座位号
            getLocalSeatId:function () {
                return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(CACHE.seatId);
            },

            getTingType:function () {
                return CACHE.type || 0;
            },

            getTingAction:function () {
                return this.getAskTing();
            },

            getTingWinTiles:function () {
                var data = [];
                var readyHands = CACHE.all_win_tiles[0][1] || [];
                for (var i = 0; i < readyHands.length; ++i){
                    data.push({
                        "tile":readyHands[i][0],
                        "scoring":readyHands[i][1],
                        "lastCnt":readyHands[i][2],
                    })
                }
                return data;
            },


            getExposedKong:function () {
                return MODEL_DRAW.getMingGangData();
            },

            getConcealedKong:function () {
                return MODEL_DRAW.getAnGangData();
            },

            getMethods:function () {
                return GLOBAL_OBJ.table.models.Functions.optionPanelTranslation({
                    points          : this.getWinPoints(),
                    ting            : this.getAskTing(),
                    exposed_kongs   : MODEL_DRAW.getMingGangData(),
                    concealed_kongs : MODEL_DRAW.getAnGangData(),
                    tile            : this.getTile()
                });
            },

        });
    })();
})();