/*****************************************
 *  mahjong_table_model_pong.js
    (碰牌)牌桌相关model
 *  mahjong
 *
 *  Created by zengxx on 16-06-13
 *
    协议说明：

    {
        "cmd": "peng",
        "result": {
            "tile": 2,            // 碰的牌
            "seatId": 2,          // 碰牌的玩家座位号
            "player_seat_id": 0,  // 出被碰的牌的玩家座位号
            "timeout": 9,
            "action_id": 4,
            "gameId": 7,
            "ting_action": //有可能是其他玩家听牌的牌信息
            "grabTing":[[27,[[8,3,2],[14,3,2]]]], // 抢听操作之后碰牌，这个字段表示听牌信息
        }
    }

    使用说明:

 */

guiyang.table.models.Pong = (function(){
    var GLOBAL_OBJ = guiyang;

    /*
    私有数据+接口
    TODO:
    数据的原型，存储以及通知的抛出
    */

    /* @数据缓存*/
    var CACHE             = {}
    var PROTOTYPE         = GLOBAL_OBJ.table.models.Prototype;

    /* @私有属性 */
    PROTOTYPE.setPrivateProperty(CACHE, "tile", 0, "碰牌花色");
    PROTOTYPE.setPrivateProperty(CACHE, "activeSeatId", -1, "碰牌方服务端座位号");
    PROTOTYPE.setPrivateProperty(CACHE, "passiveSeatId", -1, "被碰者服务端座位号");
    PROTOTYPE.setPrivateProperty(CACHE, "pattern", null, "吃的牌形");
    PROTOTYPE.setPrivateProperty(CACHE, "grabTing", false, "是否用来抢听");
    PROTOTYPE.setPrivateProperty(CACHE, "isZeRenJi", false, "是否是责任鸡");
    PROTOTYPE.setPrivateProperty(CACHE, "zeRenFrom", -1, "责任鸡来自谁seatId");

    /* @共享属性 */
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TIME_OUT);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_ACTION_ID);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_WIND_SEAT_ID);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_FAKE_MSG );

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

        var data            = _data;
        CACHE.tile          = data.tile;
        CACHE.pattern       = data.pattern || null;
        hall.assert.true(CACHE.pattern,"碰 下发牌形不能为空");
        CACHE.activeSeatId  = data.seatId ;
        CACHE.passiveSeatId = data.player_seat_id;
        CACHE.grabTing      = data.grabTing||false;
        CACHE.isZeRenJi      = data.isZeRenJi || false;
        CACHE.zeRenFrom      = data.zeRenFrom;

        // 因为gang_action不可能携带杠信息，因为吃了以后一定要打牌
        var kong            = data.gang_action || [];
        data.concealed_kong = [];
        data.exposed_kong   = [];
        for(var i = 0 ; i < kong.length; ++i){
            if (0 == kong[i].style) { //暗杠
                data.concealed_kong.push( kong[i] );    
            }else{
                data.exposed_kong.push( kong[i] );
            };
        };

        // 此时，ting_action是别人的听牌信息
        if ( GLOBAL_OBJ.table.global.MYSEAT != GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( data.seatId ) ){
            data.ting_action = [];
        };

        // 静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);

        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_PONG, data);
        }
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.Pong",

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

        /*
        返回当前碰的牌
        pongTranslation 返回的是一个安全的二维数组
        params _mode:返回值模式 1：返回CACHE.tile，2：返回非CACHE.tile的剩下两枚，3：完整返回
        */
        getPonged:function( _mode ){
            return GLOBAL_OBJ.table.models.Functions.pongTranslation( CACHE.tile,[CACHE.pattern], _mode )[0] || [];
        },

        // 获得被碰牌玩家的 本地座位号
        getPassiveLocalSeatId:function(){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.passiveSeatId );
        },

        // 是否是责任鸡
        isZeRenJi:function () {
            return CACHE.isZeRenJi;
        },

        /*
         责任鸡来自谁
         */
        zeRenFrom:function () {
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.zeRenFrom );
        },

        // 获得碰牌玩家的 本地座位号
        getActiveLocalSeatId:function(){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.activeSeatId );
        },

        /*
         获取数据集合，牌桌“吃碰杠胡听面板”需要组合数据
         按照 从上到下从左到右的显示顺序是吃碰杠胡过
         */
        getMethods:function(){
            return GLOBAL_OBJ.table.models.Functions.optionPanelTranslation({
                ting       : this.getTingAction(),
                tile       : this.getTile()
            });
        },

        //当前的碰是不是，上听用的
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
            switch (_index){
                case 0:
                cmds = {"cmd":"peng","result":{"tile":1,"seatId":0,"player_seat_id":3,"timeout":9,"action_id":1,"gameId":7}};
                break;
                case 1:
                cmds = {"cmd":"peng","result":{"tile":26,"seatId":0,"player_seat_id":1,"timeout":9,"action_id":1,"gameId":7}};
                break;
                case 2:
                cmds = {"cmd":"peng","result":{"tile":26,"seatId":2,"player_seat_id":1,"timeout":9,"action_id":1,"gameId":7}};
                break;
                case 3:
                cmds = {"cmd":"peng","result":{"tile":28,"seatId":2,"player_seat_id":0,"timeout":9,"action_id":1,"gameId":7}};
                break;
                case 4:
                cmds = {"cmd":"peng","result":{"tile":28,"seatId":3,"player_seat_id":2,"timeout":9,"action_id":1,"gameId":7}};
                break;
                case 5:
                cmds = {"cmd":"peng","result":{"tile":1,"seatId":2,"player_seat_id":3,"timeout":9,"action_id":1,"gameId":7}};
                break;
            };
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        }
    });
})();
