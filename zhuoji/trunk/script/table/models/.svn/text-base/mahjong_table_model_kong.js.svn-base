/*****************************************
 *  mahjong_table_model_kong.js
    (杠牌)牌桌相关model
 *  mahjong
 *
 *  Created by zengxx on 16-06-13
 *  
    协议说明：
    {
        "cmd": "gang",
        "result": {
            "seatId": 0,         // 杠牌的玩家座位号
            "player_seat_id": 1, // 出被杠的牌的玩家座位号
            "loser_seat_ids": [  // 杠牌时，输金币的玩家座位号
              1
            ],
            "gang":{
                            "tile": 5,
                            "pattern": [
                              1,
                              1,
                              1,
                              1
                            ],
                            "style": 0
                          },
            "gameId": 7
            "ting_action": //有可能是其他玩家听牌的牌信息
            "detailChangeScores":[{"gangScore":6},{"gangScore":-2},{"gangScore":-2},{"gangScore":-2}],//杠分
        }
    }
    使用说明:
    {
      "cmd": "gang",
      "result": {
        "gameId": 710,
        "player_seat_id": 2,
        "loser_seat_ids": [
          2
        ],
        "tableId": 71050210010199,
        "gang": {
          "tile": 5,
          "pattern": [
            1,
            1,
            1,
            1
          ],
          "style": 0
        },
        "tile": 5,
        "seatId": 2,
        "roomId": 7105021001,
        "action_id": 1
      }
    }
 */

(function () {
    "use strict";
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.table.models.Kong = (function(){
        /*
         私有数据+接口
         TODO:
         数据的原型，存储以及通知的抛出
         */

        /* @数据缓存*/
        var CACHE             = {};
        var PROTOTYPE         = GLOBAL_OBJ.table.models.Prototype;

        /* @私有属性 */
        PROTOTYPE.setPrivateProperty(CACHE, "tile", 0, "杠牌花色");
        PROTOTYPE.setPrivateProperty(CACHE, "activeSeatId", -1, "吃牌方服务端座位号");
        PROTOTYPE.setPrivateProperty(CACHE, "passiveSeatId", -1, "被吃者服务端座位号");
        PROTOTYPE.setPrivateProperty(CACHE, "winCharge", 0, "杠牌方进钱数");
        PROTOTYPE.setPrivateProperty(CACHE, "losers", [], "输钱方");
        PROTOTYPE.setPrivateProperty(CACHE, "loseCharges", [], "输钱方输钱数");
        PROTOTYPE.setPrivateProperty(CACHE, "kongInfo", {}, "杠的牌型信息");
        PROTOTYPE.setPrivateProperty(CACHE, "detailChangeScores", [], "杠分");
        PROTOTYPE.setPrivateProperty(CACHE, "isZeRenJi", false, "是否是责任鸡");
        PROTOTYPE.setPrivateProperty(CACHE, "zeRenFrom", -1, "责任鸡来自谁seatId");
        PROTOTYPE.setPrivateProperty(CACHE, "isReadyHand", 0, "打牌玩家是否听牌");

        /* @共享属性 */
        PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TIME_OUT);
        PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_ACTION_ID);
        PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_WIND_SEAT_ID);
        PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_FAKE_MSG );

        //杠牌时只有听牌消息，但是预防吃碰杠消息是上一条摸牌或者打牌协议携带过来的，
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
            };

            var data            = _data;
            CACHE.tile          = data.tile;
            CACHE.kongInfo      = data.gang;
            CACHE.activeSeatId  = data.seatId;
            CACHE.passiveSeatId = data.player_seat_id;

            CACHE.winCharge     = data.real_win_coin;
            CACHE.losers        = data.loser_seat_ids;
            CACHE.loseCharges   = data.loser_coins;
            CACHE.detailChangeScores = data.detailChangeScores;
            CACHE.isZeRenJi = data.isZeRenJi || false;
            CACHE.zeRenFrom = data.zeRenFrom;
            CACHE.isReadyHand      = data.is_ting;

            //此时，ting_action是别人的听牌信息
            if ( GLOBAL_OBJ.table.global.MYSEAT != GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( data.seatId ) ){
                data.ting_action = [];
            };

            //静态数据部分
            PROTOTYPE.parse(_object, CACHE, data);
            if (!_slient){
                GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_KONG, data);
            };
            return _slient;
        };

        return PROTOTYPE.functionsExt(CACHE, {
            _TAG:"table.models.Kong",

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

            getStyle:function(){
                var playMode = GLOBAL_OBJ.table.models.TableInfo.getPlayMode();
                switch(playMode){
                    case GLOBAL_OBJ.table.global.PLAYMODE.WuHan:
                        return (CACHE.kongInfo.style == 1) || (CACHE.kongInfo.style == -1) ? GLOBAL_OBJ.table.global.METHODS.EXPOSED_KONG : GLOBAL_OBJ.table.global.METHODS.CONCEALED_KONG;
                    default:
                        return CACHE.kongInfo.style == 1 ? GLOBAL_OBJ.table.global.METHODS.EXPOSED_KONG : GLOBAL_OBJ.table.global.METHODS.CONCEALED_KONG;
                }
                // return CACHE.kongInfo.style == 1 ? GLOBAL_OBJ.table.global.METHODS.EXPOSED_KONG : GLOBAL_OBJ.table.global.METHODS.CONCEALED_KONG;
            },

            //抢杠胡 的 那张杠牌
            getGrabHuTile:function(){
                return CACHE.kongInfo.tile;
            },

            // 获得碰牌花色
            getTile:function(){
                return CACHE.tile;
            },

            /*
             返回当前杠的牌
             kongTranslation 返回的是一个安全的对象
             params _mode:返回值模式 1：返回CACHE.kongInfo.tile，3：返回非CACHE.kongInfo.pattern的剩下三枚，4：完整返回
             params _drop:别人打的那张牌，没有的话，就是自己抓的
             */
            getKonged:function( _mode, _style, _drop){
                hall.assert.true(_style!=null,"杠牌下行协议，必须指明明暗杠");
                // GLOBAL_OBJ.LOGD(this._TAG," CACHE.kongInfo : "+JSON.stringify(CACHE.kongInfo));
                return GLOBAL_OBJ.table.models.Functions.kongTranslation( [CACHE.kongInfo], _style, _mode , _drop)[0] || {};
            },

            // 获得被碰牌玩家的 本地座位号
            getPassiveLocalSeatId:function() {
                return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.passiveSeatId );
            },

            // 获得碰牌玩家的 本地座位号
            getActiveLocalSeatId:function() {
                return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.activeSeatId );
            },

            getWinCharge:function() {
                return CACHE.winCharge;
            },

            getLosersLocalSeatId:function() {
                var seats = [];
                for(var i in CACHE.losers){
                    seats.push( GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.losers[i] ) );
                };
                return seats;
            },

            getLosersCharge:function() {
                var charges = [];
                for(var i in CACHE.loseCharges){
                    charges.push( -1*CACHE.loseCharges[i] );
                };
                return charges;
            },

            /*
            是否是责任鸡
             */
            isZeRenJi:function () {
                return CACHE.isZeRenJi;
            },
            /*
             责任鸡来自谁
             */
            zeRenFrom:function () {
                return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.zeRenFrom );
            },

            // getIsTingAction:function () {
            //     if (CACHE.isReadyHand === 1) {
            //         return this.getTingAction();
            //     }else {
            //         return {};
            //     }
            // },

            // getHuAction:function () {
            //     return this.getTingAction() || {};
            // },

            // 是否听牌
            isReadyHand:function(){
                return CACHE.isReadyHand || 0;
            },

            /*
             获取数据集合，牌桌“吃碰杠胡听面板”需要组合数据
             按照 从上到下从左到右的显示顺序是吃碰杠胡过
             */
            getMethods:function(){
                return GLOBAL_OBJ.table.models.Functions.optionPanelTranslation({
                    //杠广播中携带的胡，是抢胡。组织数据是，要赋成GLOBAL_OBJ.table.global.METHODS.GRAB_HU_KONG
                    grabPoints : this.getWinPoints(),
                    ting       : this.getTingAction(),
                    tile       : this.getTile()
                });
            },

            /*
             别人打/自己抓 的这张牌，是否在吃牌牌型里
             */
            getPatternTile:function(){
                var _kongInfo = CACHE.kongInfo;
                var _tile = _kongInfo.tile||null;
                return _tile;
            },

            getDetailGangScores:function ( _localSeatId ) {
                var gangScores = CACHE.detailChangeScores;
                return gangScores;
            },

            /*
             测试用例
             TODO:
             model测试用例
             */
            test:function(_index){
                var cmds = {};
                switch (_index){
                };
                ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
            }
        });
    })();
})();

