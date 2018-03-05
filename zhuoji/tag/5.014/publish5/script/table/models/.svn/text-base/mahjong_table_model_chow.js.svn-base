/*****************************************
 *  mahjong_table_model_chow.js
    (吃牌)牌桌相关model
 *  mahjong
 *
 *  Created by zengxx on 16-06-13
 *
    协议说明：

    {
        "cmd": "chi",
        "result": {
            "tile": 23,            // 吃的牌

            "pattern":[22,23,24]

            "seatId": 0,          // 吃牌的玩家座位号
            "player_seat_id": 2,  // 出被吃的牌的玩家座位号
            "timeout": 9,
            "action_id": 2,
            "gameId": 7
            "ting_action": //有可能是其他玩家听牌的牌信息
            "grabTing":[[27,[[8,3,2],[14,3,2]]]], // 抢听操作之后吃牌，这个字段表示听牌信息
        }
    }

    使用说明:

 */

guiyang.table.models.Chow = (function(){
    "use strict";
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
    PROTOTYPE.setPrivateProperty(CACHE, "tile", 0, "吃的牌花色");
    // PROTOTYPE.setPrivateProperty(CACHE, "index", 0, "吃的牌所在位置（0～2）");
    PROTOTYPE.setPrivateProperty(CACHE, "pattern", null, "吃的牌形");

    PROTOTYPE.setPrivateProperty(CACHE, "activeSeatId", -1, "吃牌方服务端座位号");
    PROTOTYPE.setPrivateProperty(CACHE, "passiveSeatId", -1, "被吃者服务端座位号");
    PROTOTYPE.setPrivateProperty(CACHE, "grabTing", false, "是否用来抢听");

    /* @共享属性 */
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TIME_OUT);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_ACTION_ID);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_WIND_SEAT_ID);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_FAKE_MSG );

    //吃牌时只有听牌消息，但是预防吃碰杠消息是上一条摸牌或者打牌协议携带过来的，
    //所以一旦牌桌有碰吃行为发生，默认是要关闭本家的吃碰杠面板的
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_CHOW);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_PONG);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_EXPOSED_KONG);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_CONCEALED_KONG);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_WIN_POINTS);

    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TING_ACTION);

    /* @数据通知*/
    var ___f_notificate = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        }
        // GLOBAL_OBJ.LOGD(this._TAG,"___f_notificate -> data : "+JSON.stringify(_data));
        var data = _data;
        // CACHE.index         = data.style;
        CACHE.pattern       = data.pattern || null;
        hall.assert.true(CACHE.pattern,"吃 下发牌形不能为空");
        CACHE.tile          = data.tile || 0;
        CACHE.activeSeatId  = data.seatId;
        CACHE.passiveSeatId = data.player_seat_id;
        CACHE.grabTing      = data.grabTing||false;

        //因为gang_action不可能携带杠信息，因为吃了以后一定要打牌
        //var kong           = data.gang_action || [];


        //此时，ting_action是别人的听牌信息
        if ( GLOBAL_OBJ.table.global.MYSEAT != GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( data.seatId ) ){
            data.ting_action = [];
        };

        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);

        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHOW, data);
        };
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.Chow",

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

        // 获得碰牌花色
        getTile:function(){
            return CACHE.tile;
        },

        // 获得被吃牌玩家的 本地座位号
        getPassiveLocalSeatId:function(){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.passiveSeatId );
        },

        // 获得吃牌玩家的 本地座位号
        getActiveLocalSeatId:function(){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.activeSeatId );
        },

        /*
        返回当前吃牌(完整)
        chowTranslation 返回的是一个安全的二维数组
        params _mode:返回值模式 1：返回CACHE.tile，2：返回非CACHE.tile的剩下两枚，3：完整返回
        */
        getChowed:function(_mode){
            return GLOBAL_OBJ.table.models.Functions.chowTranslation( CACHE.tile, [CACHE.pattern], _mode )[0] || [];
        },

        /*
         获取数据集合，牌桌“吃碰杠胡听面板”需要组合数据
         按照 从上到下从左到右的显示顺序是吃碰杠胡过
         */
        getMethods:function(){
            return GLOBAL_OBJ.table.models.Functions.optionPanelTranslation({
                ting  : this.getTingAction(),
                tile  : this.getTile()
            });
        },

        //当前的吃是不是，上听用的
        getGrabTing:function(){
            return CACHE.grabTing;
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
            cmds = {"cmd":"chi","result":{"tile":26, "style":0, "pattern":[26,27,28], "seatId":0, "player_seat_id":1,"timeout":9,"action_id":2,"gameId":7}};
            break;
            case 1:
            cmds = {"cmd":"chi","result":{"tile":26,"style":0, "pattern":[26,27,28], "seatId":2,"player_seat_id":1,"timeout":9,"action_id":2,"gameId":7}};
            break;
            case 2:
            cmds = {"cmd":"chi","result":{"tile":21,"style":0, "pattern":[21,22,23], "seatId":1,"player_seat_id":0,"timeout":9,"action_id":2,"gameId":7}};
            break;
            case 3:
            cmds = {"cmd":"chi","result":{"tile":15,"style":0, "pattern":[15,16,17], "seatId":1,"player_seat_id":2,"timeout":9,"action_id":2,"gameId":7}};
            break;
            case 4:
            cmds = {"cmd":"chi","result":{"tile":32,"style":0, "pattern":[32,33,34],"seatId":1,"player_seat_id":0,"timeout":12,"action_id":9,"gameId":7}};
            break;
            case 5:
            cmds = {"cmd":"chi","result":{"tile":32,"style":0, "pattern":[32,33,34],"seatId":0,"player_seat_id":1,"timeout":12,"action_id":9,"gameId":7}};
            break;
            case 6:
            cmds = {"cmd":"chi","result":{"tile":13,"style":0, "grabTing":[[9,[[21,1,3]]],[11,[[15,1,1]]]],"pattern":[11,12,13],"seatId":0,"player_seat_id":1,"timeout":12,"action_id":9,"gameId":7}};
            break;
            };
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        }
    });
})();
