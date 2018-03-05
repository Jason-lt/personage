/*****************************************
 *  mahjong_table_model_notify_grab_gang_hu.js
    (抢杠胡结果广播模块)牌桌相关model
 *  mahjong
 *
 *  Created by lcr on 17-07-18
 *  
    协议说明：
    //  在抢杠胡成功以后，需要通知被抢杠胡的玩家更新手牌，抢杠胡失败则不需要通知玩家，因为会发送杠成功的消息，
        此消息为广播消息，针对被抢杠玩家，携带tilesInfo，其他玩家不带tilesInfo字段
    {

        "cmd": "notifyGrabGang",
        "result": {
            "gameId": 198393,
            "roomId":10901,
            "tableId":1309039,
            "tile":3  //被抢杠的牌
            "seatId": 3,      // 被抢杠胡的玩家座位号
            "action_id":9,
            "tilesInfo":Object{...} //遵照lose里面的tilesInfo消息
        }
    }

    使用说明:

 */

guiyang.table.models.notifygrabganghu = (function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;
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
    PROTOTYPE.setPrivateProperty(CACHE, "roomId", 0, "roomId");
    PROTOTYPE.setPrivateProperty(CACHE, "tableId", 701, "tableId");
    PROTOTYPE.setPrivateProperty(CACHE, "tile", 0, "被抢杠的牌");
    PROTOTYPE.setPrivateProperty(CACHE, "seatId", 0, "被抢杠胡的玩家座位号");
    PROTOTYPE.setPrivateProperty(CACHE, "tilesInfo", 0, "手牌信息");

    /* @共享属性 */
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_ACTION_ID);
    
    /* @数据通知*/
    var ___f_notificate    = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        };
        
        var data                = _data;
        CACHE.gameId            = data.gameId;
        CACHE.tableId           = data.tableId;
        CACHE.roomId            = data.roomId;
        CACHE.tile              = data.tile;
        CACHE.seatId            = data.seatId;
        CACHE.tilesInfo         = data.tilesInfo;

        // GLOBAL_OBJ.LOGD("notifygrabganghu's data is :", JSON.stringify(data));
        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);
        
        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_NOTIFY_GRAB_GANG_HU, data);
        };
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.notifygrabganghu",
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

        //被抢杠胡玩家座位号
        getNotifyGrabSeatId:function(){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(CACHE.seatId);
        },

        //获取抢杠胡的牌
        getNotifyGrabHuTile:function(){
            return CACHE.tile;
        },

        //被抢杠胡玩家的手牌信息，这个只会发给被抢杠胡的玩家
        getNotifyGrabHuTiles:function(){
            return CACHE.tilesInfo || [];
        },

        getMethods:function(){
            return GLOBAL_OBJ.table.models.Functions.optionPanelTranslation({
                //杠广播中携带的胡，是抢胡。组织数据是，要赋成GLOBAL_OBJ.table.global.METHODS.GRAB_HU_KONG
                grabPoints      : this.getWinPoints(),
                tile            : this.getTile()
            });
        },


    });
})();