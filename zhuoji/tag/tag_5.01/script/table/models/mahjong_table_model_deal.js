/*****************************************
 *  mahjong_table_model_deal.js
    (发牌)牌桌相关model
 *  mahjong
 *
 *  Created by zengxx on 16-06-13
 *  
    协议说明：
    
    {
        "cmd": "init_tiles",
        "result": {
            "header_seat_id": 0,   // 给发牌玩家的座位号
            "tiles": [
                26,
                1,
                13,
                12,
                1,
                1,
                3,
                34,
                19,
                21,
                13,
                33,
                2
            ],
            "gameId": 7
        }
    }

    使用说明:
    此协议驱动麻将发第一手牌，只有本家能收到该协议，除了给自己发牌还要给其他玩家发1～13张0号牌
 */

guiyang.table.models.Deal = (function(){
    var GLOBAL_OBJ = guiyang;

    /*
    私有数据+接口
    TODO:
    数据的原型，存储以及通知的抛出
    */

    /* @数据缓存*/
    var CACHE             = {};
    var PROTOTYPE         = GLOBAL_OBJ.table.models.Prototype;

    /* @私有属性 */
    PROTOTYPE.setPrivateProperty(CACHE, "tiles", [], "发的牌");
    PROTOTYPE.setPrivateProperty(CACHE, "activeSeatId", -1, "接受发牌玩家的服务端座位号");
    PROTOTYPE.setPrivateProperty(CACHE, "threeTiles", [], "换三张");
    
    PROTOTYPE.setPrivateProperty(CACHE, "flowerReissue", {}, "补花-鄱阳麻将");

    /* @共享属性 */
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_FAKE_MSG );

    /* @数据通知*/
    var ___f_notificate   = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        }

        var data            = _data;
        CACHE.tiles         = data.tiles;

        CACHE.threeTiles    = data.threeTiles;
        CACHE.isTableRecord = data.isTableRecord || false;

        if (CACHE.isTableRecord){
            CACHE.activeSeatId  = data.seatId;
        }
        else{
            CACHE.activeSeatId  = data.header_seat_id;
        }

        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);

        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_DEAL, data);
        }
        return _slient
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.Deal",

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

        getTiles:function(){
            return CACHE.tiles;
        },

        // 获得发牌玩家的 本地座位号
        getActiveLocalSeatId:function(){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.activeSeatId );
        },

        //是否是回放协议
        getIsTableRecord:function(){
            return CACHE.isTableRecord;
        },

        /*
        测试用例
        TODO:
        model测试用例
        */
        test:function(_index){
            var cmds = {};
            switch(_index){
            case 0:
            cmds = {"cmd":"init_tiles","result":{"header_seat_id":0,"tiles":[34,27,28,26,26,33,21,29,27,28,26,27,34],"gameId":7}};
            break;
            case 1:
            cmds = {"cmd":"init_tiles","result":{"header_seat_id":0,"tiles":[1,1,1,26,26,33,21,29,27,28,31,31,31],"gameId":7}};
            break;
            case 2:
            cmds = {"cmd":"init_tiles","result":{"header_seat_id":0,"tiles":[1,1,1,1,26,33,21,29,27,28,26,27,34],"gameId":7}};
            break;
            case 3:
            cmds = {"cmd":"init_tiles","result":{"header_seat_id":0,"tiles":[1,1,2,26,26,33,21,29,27,28,26,27,34],"gameId":7}};
            break;
            case 4:
            cmds = {"cmd":"init_tiles","result":{"header_seat_id":0,"tiles":[1,1,1,26,26,26,26,29,27,28,31,27,34],"gameId":7}};
            break;
            case 5:
            cmds = {"cmd":"init_tiles","result":{"header_seat_id":0,"tiles":[1,11,12,26,26,9,26,11,27,28,31,27,34],"gameId":7}};
            break;
            case 6:
            cmds = {"cmd":"init_tiles","result":{"header_seat_id":0, "tiles":[1,11,12,26,26,9,26,11,27,41,42,43,4], 
                "reissue_flowers":[
                    { "seatId":0, "flower_action":[[41, 1], [42, 2], [43, 3]], "flower_tiles":[41,42,43] },
                    { "seatId":1, "flower_action":[[41, 1], [42, 2], [43, 3]], "flower_tiles":[41,42,43] },
                    { "seatId":2, "flower_action":[[41, 1], [42, 2], [43, 3]], "flower_tiles":[41,42,43] },
                    { "seatId":3, "flower_action":[[41, 1], [42, 2], [43, 3]], "flower_tiles":[41,42,43] },
                ], "gameId":7}};
            break;
            case 7:
            cmds = {"cmd":"init_tiles","result":{"header_seat_id":0,"tiles":[33,6,19,36,34,29,17,18,6,23,2,6,5],"reissue_flowers":[{"seatId":0,"flower_action":[],"flower_tiles":[]},{"seatId":1,"flower_action":[],"flower_tiles":[]}],"gameId":7}};
            break;
            case 8:
            cmds = {"cmd":"init_tiles","result":{"header_seat_id":0,"tiles":[17,26,14,24,18,27,43,29,36,33,33,24,23],"reissue_flowers":[{"seatId":0,"flower_action":[[43,37]],"flower_tiles":[43]},{"seatId":1,"flower_action":[],"flower_tiles":[]}],"gameId":7}};
            break;
            case 9:
            cmds = {"cmd":"init_tiles","result":{"header_seat_id":0,"tiles":[25,19,35,7,47,33,29,33,27,26,42,18,21],"reissue_flowers":[{"seatId":0,"flower_action":[],"flower_tiles":[]},{"seatId":1,"flower_action":[[47,3],[42,23]],"flower_tiles":[47,42]}],"gameId":7}};
            break;
            };
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        }
    });
})();