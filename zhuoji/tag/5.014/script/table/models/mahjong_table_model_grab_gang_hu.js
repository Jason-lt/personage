/*****************************************
 *  mahjong_table_model_grab_gang_hu.js
    (抢杠胡模块)牌桌相关model
 *  mahjong
 *
 *  Created by lcr on 17-07-18
 *  
    协议说明：
    //抢杠胡协议是单独添加的，因为原来的抢杠胡消息是放在gang里面的，这样不太规范，所以添加新的协议来做抢杠胡
    {
     "cmd": "grabGangHu",
        "result": {
            "gameId": 198393,
            "roomId":10901,
            "tableId":1309039,
            "gang":[],
            "seatId": 3,      //要抢杠胡的玩家座位号
            "player_seat_id": 0,  //被抢杠胡玩家座位号
            "action_id":9,
            "win_tile": 21,           //被抢杠胡的牌
            "win_degree":1,
            "mao_action":1 //兼容放锚，但相关前端也需要修改
        }
    }

    使用说明:

 */

guiyang.table.models.grabganghu = (function(){
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
    PROTOTYPE.setPrivateProperty(CACHE, "gang", [], "杠的数据，这里没有用到");
    PROTOTYPE.setPrivateProperty(CACHE, "seatId", 0, "要抢杠胡的玩家座位号");
    PROTOTYPE.setPrivateProperty(CACHE, "player_seat_id", 0, "被抢杠胡玩家座位号");
    PROTOTYPE.setPrivateProperty(CACHE, "win_tile", 0, "被抢杠胡的牌");
    PROTOTYPE.setPrivateProperty(CACHE, "win_degree", 1, "和牌");

    /* @共享属性 */
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_WIN_POINTS);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_ACTION_ID);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TILE );
    
    /* @数据通知*/
    var ___f_notificate    = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        };
        
        var data                = _data;
        CACHE.gameId            = data.gameId;
        CACHE.seatId            = data.seatId;
        CACHE.tableId           = data.tableId;
        CACHE.roomId            = data.roomId;
        CACHE.gang              = data.gang;
        CACHE.player_seat_id    = data.player_seat_id;
        CACHE.win_tile          = data.win_tile;
        CACHE.win_degree        = data.win_degree;
        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);
        
        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_GRAB_GANG_HU, data);
        };
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.grabganghu",
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

        getActiveLocalSeatId:function () {
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(CACHE.seatId);
        },

        //要抢杠胡的玩家座位号
        getGrabSeatId:function(){
            return CACHE.seatId;
        },

        //被抢杠胡玩家座位号
        getGrabPlayerSeatId:function(){
            // return CACHE.player_seat_id;
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(CACHE.player_seat_id);
        },

        //获取游戏id
        getGrabGameId:function(){
            return CACHE.gameId || 701;
        },

        //获取桌号
        getGrabTalbeId:function(){
            return CACHE.tableId;
        },

        //获取房号
        getGrabRoomId:function(){
            return CACHE.roomId;
        },

        //获取杠数据
        getGrabGang:function(){
            return CACHE.gang || [];
        },

        //获取抢杠胡的牌
        getGrabHuTile:function(){
            return CACHE.win_tile || 0;
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