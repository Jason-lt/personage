/*****************************************
 *  mahjong_table_model_absence_end.js
 *  定缺结束
 *  Created by simon on 17-12-20
 *  
 *  协议说明：
    //后端发送定缺完毕-> 广播
    {
     "cmd": "absence_end",
     "result":{
         "gameId": 701,
         "roomId": 7309011001,
         "tableId": 73090110010200,
         "isConnect":0, // 0:不是断线重练。1:断线重练
         "color": [1,1,1,1] // 0:万 1:筒 2:条 数组下标代表seatId
        }
    }
 */

(function () {
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.table.models.Absence_End = (function(){
        /*
        私有数据+接口
        TODO:
        数据的原型，存储以及通知的抛出
        */

        // 数据缓存
        var CACHE = {};
        var PROTOTYPE = GLOBAL_OBJ.table.models.Prototype;

        // 私有属性
        PROTOTYPE.setPrivateProperty(CACHE, "color", [], "玩家定缺结果数据");
        PROTOTYPE.setPrivateProperty(CACHE, "isReconnect", false, "游戏是否断线重连");
        PROTOTYPE.setPrivateProperty(CACHE, "standup_tiles", [], "手牌花色数据");
        PROTOTYPE.setPrivateProperty(CACHE, "win_tile", 0, "抓牌花色数据");
        PROTOTYPE.setPrivateProperty(CACHE, "timeOut", 12, "倒计时");
        PROTOTYPE.setPrivateProperty(CACHE, "banker", 0, "庄服务器的seatId");
        PROTOTYPE.setPrivateProperty(CACHE, "win_degree", -1, "胡牌");
        PROTOTYPE.setPrivateProperty(CACHE, "action_id", -1, "庄action_id");
        PROTOTYPE.setPrivateProperty(CACHE, "tile", 0, "庄 tile");

        // 共有属性
        PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TING_ACTION);

        /* @数据通知*/
        var ___f_notificate    = function(_object, _data, _slient){
            if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
                return _slient;
            };

            var data              = _data;
            CACHE.color           = data.color;
            CACHE.isReconnect     = data.reconnect;
            CACHE.standup_tiles   = data.standup_tiles;
            CACHE.win_tile        = data.tile;
            CACHE.timeOut         = data.timeOut;
            CACHE.banker          = data.banker;

            CACHE.win_degree      = data.win_degree;
            CACHE.actionId        = data.action_id;
            CACHE.tile            = data.tile;

            // 因为gang_action可能携带多个杠，不一定都是明杠
            var kong = data.gang_action || [];
            if(kong.length > 0){
                CACHE.exposed_kong = [];
                CACHE.concealed_kong = [];
            }
            for(var i in kong){
                var _currentKong=kong[i];
                if(_currentKong.style==1){
                    // 明杠
                    CACHE.exposed_kong.push( _currentKong );
                }else if(_currentKong.style==0){
                    //  暗杠
                    CACHE.concealed_kong.push( _currentKong );
                }else{
                    hall.assert.true(false,"抓牌，杠牌出现了意外情况");
                }
            }

            // 静态数据部分
            PROTOTYPE.parse(_object, CACHE, data);

            if (!_slient){
                GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_ABSENCE_END, data);
            };
            return _slient;
        };

        return PROTOTYPE.functionsExt(CACHE, {
            _TAG:"table.models.Absence_End",
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
                return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.banker );
            },

            //获得服务器推荐的定缺花色种类 0:万 1:筒 2:条
            getColorDataEnd:function(){
                return CACHE.color || 0;
            },

            getIsConnect:function(){
                return CACHE.isReconnect || false;
            },

            getActionId:function(){
                return CACHE.actionId;
            },

            getExposedKong:function () {
                return CACHE.exposed_kong;
            },

            getConcealedKong:function () {
                return GLOBAL_OBJ.table.models.Functions.kongTranslation(CACHE.concealed_kong || [],
                    GLOBAL_OBJ.table.global.METHODS.CONCEALED_KONG, 4, null);
            },

            getWinDegree:function () {
                return CACHE.win_degree;
            },

            // 获得和牌花色
            getTile:function () {
                return CACHE.tile;
            },

            // 获取手牌花色数据
            getStandUpTiles:function(){
                return CACHE.standup_tiles || null;
            },

            // 获取抓牌花色
            getDrawTile:function(){
                return CACHE.win_tile || null;
            },

            // 得到自己属于自己定缺的花色种类
            getMyAbsenceColor:function () {
                var colors              = CACHE.color || [];
                var localseatIdDQType   = null;
                var localSeatId         = null;
                var i;
                for(i = 0; i < colors.length; ++i){
                    localSeatId 		= GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(i);
                    if(localSeatId == GLOBAL_OBJ.table.global.SEATS.N0){
                        localseatIdDQType 	= colors[i];
                    }
                }
                return localseatIdDQType;
            },

            // 通过seatId获取定缺的花色
            getAbsenceColorToSeatId:function (_seatId) {
                var colors              = CACHE.color || [];
                var localseatIdDQType   = -1;
                var localSeatId         = -1;
                var seatId = _seatId;
                var i;
                for(i = 0; i < colors.length; ++i){
                    localSeatId 		= GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(i);
                    if(localSeatId == seatId){
                        localseatIdDQType 	= colors[i];
                    }
                }
                return localseatIdDQType;
            },

            // 重置数据
            setMySelfFixedMissColor:function () {
                CACHE.color = [];
                CACHE.ting_action = [];
                CACHE.concealed_kong = [];
            },

            // 获取游戏倒计时
            getTimeOut:function(){
                return CACHE.timeOut;
            },

            // 获取庄seatId
            getAbsenceBanker:function(){
                return CACHE.banker;
            },

            getMethods:function(){
                return GLOBAL_OBJ.table.models.Functions.optionPanelTranslation({
                    ting            : this.getTingAction(),
                    concealed_kongs : this.getConcealedKong(),
                    points          : this.getWinDegree(),
                    tile            : this.getTile()
                });
            },

        });
    })();
})();