/*****************************************
 *  mahjong_table_model_discard.js
    (出牌)牌桌相关model
 *  mahjong
 *
 *  Created by zengxx on 16-06-13
 *  
    协议说明：
    
    {"cmd":"play","result":{
        "seatId":1, //出牌玩家的座位号（服务器）
        "tile":21, //出牌花色
        "action_id":2, //回合数
        "timeout":8,//（收到此协议的玩家可以吃碰杠）8秒倒计时
        "player_seat_id":1,//这个没有意义和seatId是一样的 按理说应该是能吃碰杠的玩家的sid
        "peng_action":21,//碰21
        "chi_action":[0],//吃的位置是0号位，21 22 23
        "gang_action": [
                          {
                            "tile": 5,
                            "pattern": [
                              1,
                              1,
                              1,
                              1
                            ],
                            "style": 0
                          },
                          {
                            "tile": 5,
                            "pattern": [
                              1,
                              1,
                              1,
                              12
                            ],
                            "style": 0
                          }
                        ],
        "win_action":1, //可以胡，没有该字段就表示不能胡
        "win_degree":2, //胡的番数
        "grabTing_action": {
            "chi_action": [
                [
                    11,
                    12,
                    13
                ]
            ],
            "peng_action": [
                [
                    11,
                    11,
                    11
                ]
            ],
            "gang_action": [
                    {
                        "style": 0,
                        "pattern":
                        [
                            11,
                            11,
                            11
                        ],
                        "tile": 11
                    }
            ]
        },
        "ting":1, // 是否听牌，1听牌，0或没有这个字段，没听牌
        "noPass", // 1 代表没有过提示。
        "gameId":7}}

    使用说明:

 */
guiyang.table.models.Discard = (function(){
    var GLOBAL_OBJ = guiyang;
    
    /*
    私有数据+接口
    TODO:
    数据的原型，存储以及通知的抛出
    */

    /* @数据缓存*/
    var GLOBAL_T             = GLOBAL_OBJ.table.global;
    var CACHE                = {};
    var PROTOTYPE            = GLOBAL_OBJ.table.models.Prototype;

    /* @私有属性 */
    PROTOTYPE.setPrivateProperty(CACHE, "activeSeatId", -1, "打牌玩家的服务端座位号");
    PROTOTYPE.setPrivateProperty(CACHE, "isReadyHand", 0, "打牌玩家是否听牌");
    PROTOTYPE.setPrivateProperty(CACHE, "ting_result", [], "听牌预览数据");
    PROTOTYPE.setPrivateProperty(CACHE, "hasAction", false, "是否有人关注这张牌");
    PROTOTYPE.setPrivateProperty(CACHE, "timeout", 0, "被关注时的超时时间");
    PROTOTYPE.setPrivateProperty(CACHE, "key", -1, "麻将牌的唯一性ID");
    PROTOTYPE.setPrivateProperty(CACHE, "ishuAll", false, "是否可以胡任意牌");
    PROTOTYPE.setPrivateProperty(CACHE, "isChongFengJi", false, "是否有冲锋鸡");

    PROTOTYPE.setPrivateProperty(CACHE, "noPass", 0, "必胡不能过");

    /* @共享属性 */
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TIME_OUT);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TILE );
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_ACTION_ID);

    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_CHOW);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_PONG);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_EXPOSED_KONG);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_CONCEALED_KONG);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_WIN_POINTS);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TING_ACTION);

    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_FAKE_MSG );
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_REMAINEDCOUNT);


    /* @数据通知*/
    var ___f_notificate = function(_object, _data, _slient){

        GLOBAL_OBJ.LOGD("table.models.Discard", "table.models.Discard.parse start;");

        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        }
        
        var data            = _data;
        CACHE.activeSeatId  = data.seatId;
        CACHE.isReadyHand   = data.ting;
        CACHE.ting_result   = data.ting_result || [];
        CACHE.hasAction     = data.hasAction || false;
        CACHE.timeout       = data.timeout || 0;
        CACHE.key           = data.key || -1;
        CACHE.ishuAll       = data.ishuAll || false;
        CACHE.isChongFengJi = data.isChongFengJi || false;
        CACHE.noPass        = data.noPass || 0;

        //因为gang_action可能携带多个杠，不一定都是明杠
        var kong            = data.gang_action || [];
        for(var i in kong){
            var _currentKong=kong[i];
            //明杠
            if(_currentKong.style==1){
                data.exposed_kong   = data.exposed_kong || [];
                data.exposed_kong.push( _currentKong );
            }else{
               hall.assert.true(false,"别人打牌 不可能有暗杠的情况发生");
            }
        }

        //静态数据部分
        data.fakeMsg = data.fakeMsg || { direct: false};
        PROTOTYPE.parse(_object, CACHE, data);


        if (!_slient) {
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_DISCARD, data );    
        }

        GLOBAL_OBJ.LOGD("table.models.Discard", "table.models.Discard.parse end;");
        return _slient;
    };
 
    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.Discard",
        /*
        公有数据+接口
        TODO:
        外部调用
        */
        /* 协议解析*/
        parse:function(_data, _slient){
            var data = _data;
            if (!data){
                GLOBAL_OBJ.LOGD(this._TAG," 服务器 出牌 协议数据异常！");
                return;
            }

            GLOBAL_OBJ.LOGD(this._TAG," 收到服务器 出牌 协议");
            return ___f_notificate(this, data, _slient);
        },

        /*
        激活model，发送一次数据
        返回值：false数据为空 */
        activate:function(){
            return false;
        },

        // 获得出牌玩家的 本地座位号
        getActiveLocalSeatId:function(){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.activeSeatId );
        },

        // 是否听牌
        isReadyHand:function(){
            return CACHE.isReadyHand;
        },

        // 是否是冲锋鸡
        isChongFengJi:function(){
            return CACHE.isChongFengJi;
        },
        
        isNoPass:function(){
            return CACHE.noPass;
        },

        getMethods:function(){
            return GLOBAL_OBJ.table.models.Functions.optionPanelTranslation({
                points          : this.getWinPoints(),
                chows           : this.getChow(3),
                pongs           : this.getPong(3),
                exposed_kongs   : this.getExposedKong(4),
                concealed_kongs : this.getConcealedKong(4),
                ting            : this.getTingAction(),
            });
        },

        /*
        本来应该服务器来告知的，暂时不走prototype
        */
        getWindLocalSeatId:function(){
            return GLOBAL_OBJ.table.global.MYSEAT;
        },

        getTingResult:function () {
            return CACHE.ting_result;
        },

        /**
         * 是否有主关注
         * @returns {boolean|*}
         */
        getHasAction:function () {
            return CACHE.hasAction;
        },

        /**
         * 被关注时的超时时间
         * @returns {*}
         */
        getTimeOut:function () {
            return CACHE.timeout;
        },

        /**
         * 获取麻将唯一性ID
         * @returns {*|number}
         */
        getKey:function () {
            return CACHE.key;
        },

        /**
         * 是否可以胡所有牌
         * @returns {boolean|*}
         */
        getIsHuAll:function () {
            return CACHE.ishuAll;
            // return true;
        },

        /*
        测试用例
        TODO:
        model测试用例
        */
        test:function(_index){
            var cmds = {};
            switch (_index){}
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        },
    });
})();