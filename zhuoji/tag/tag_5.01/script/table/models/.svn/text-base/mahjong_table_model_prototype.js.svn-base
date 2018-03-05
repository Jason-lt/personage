/*****************************************
 *  mahjong_table_model_prototype.js
    牌桌相关model 静态数据原型和接口
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-06-21
 *
    协议说明：

    使用说明:

    麻将中很多协议里都会带相同的字段（功能一致），比如action_id，chi_action, peng_action, ting_action等，所以将
    这部分数据抽象出来作为静态数据，该model作为原型model，通过统一的方式提供访问接口

    1.在“注册区域”注册 新添加的静态数据
    ___f__default__reg__( "KEY_ACTION_ID", "actionId", 0, "getActionId", null, "获得actionId");
    params #1: "KEY_ACTION_ID"作为静态数据的访问KEY的全局变量，外部通过 GLOBAL_OBJ.table.models.Prototype.KEYS.KEY_ACTION_ID（只读） 来访问
    params #2: "actionId" 静态数据的访问key，GLOBAL_OBJ.table.models.Prototype.KEYS.KEY_ACTION_ID = "actionId";
    params #3: 静态数据的缺省值
    params #4: 静态数据的get接口名
    params #5: 静态数据的get方法，如果传null，接口将为默认接口（直接返回静态数据）
    params #6: 仅仅是注册的描述信息（none sense）

    2. 给数据对象扩展静态数据

    var object  = { //对象私有数据
        timeout:0,
        seatId:-1,
    };

        1.给对象设置属性 GLOBAL_OBJ.table.models.Prototype.KEYS.KEY_TILE
        2.设置后，可以直接通过 object[ GLOBAL_OBJ.table.models.Prototype.KEYS.KEY_TILE ] 读写（model内部，外部只能通过接口访问）
        3.静态数据（对象本身并不包含该数据的副本）
    GLOBAL_OBJ.table.models.Prototype.setShareProperty(object, GLOBAL_OBJ.table.models.Prototype.KEYS.KEY_TILE );

    PS: object扩展的静态数据字段是不可以通过for进行遍历的

    3. 给对象扩展 静态数据的访问接口
    var model = GLOBAL_OBJ.table.models.Prototype.functionsExt(object, {
        getNewApi:function(){

        },
    })

    model 将拥有 object对象设置过属性的 静态数据的 访问接口 getTile
    var tile = model.getTile();

    4. model更新静态数据
    var data; // 从服务器传输过来的协议数据
    GLOBAL_OBJ.table.models.Prototype.parse( model , object, data);
    PS：
        1.根据model的object所设置的静态数据属性来进行数据更新，
        2.model没有设置的属性，将不更新，
        3.如若data没有数据，将赋值null
 */

(function(){
    var GLOBAL_OBJ = guiyang;

    /*
    @只读模式设置*/
    var ___f__writable__     = function(_data, _key, _value ){
        Object.defineProperty(_data, _key, {
            value:_value,
            writable: false,
            enumerable: true,
            configurable: true,
        } );
    };

    var ___static_keys__      = {}; /*@静态keys*/
    var ___static_types__     = {}; /*@静态types：value类型直接复制，dict类型展开按key赋值*/
    var ___static_data__      = {}; /*@静态数据*/
    var ___static_default__   = {}; /*@静态数据默认值*/
    var ___static_functions__ = {}; /*@静态数据接口*/

    /*
    @静态数据等初始化
    params _key: 静态key
    params _value: 静态key对应的值
    params _default: 以_value做key的静态数据初始值
    params _functionName: 静态数据getter接口名
    params _callFunction: 静态数据getter接口
    params _brief: 仅仅是说明
     */
    var ___f__default__reg__  = function( _key, _value, _default, _functionName, _callFunction, _type, _brief){

        var cb                               = _callFunction?_callFunction:function(){ return ___static_data__[ _value ] };
        ___static_keys__[ _key ]             = _value;
        ___static_default__[ _value ]        = _default;
        ___static_types__[_value]            = _type || "value";
        ___static_data__[ _value ]           = _default;

        //以属性作key
        ___static_functions__[_value]        = {};
        ___static_functions__[_value][_functionName] = function(){
            return cb(_value, arguments);
        };
    };

    /*
    注册区域
    @设置字段key和静态数据初始值
    外部通过 GLOBAL_OBJ.table.models.Prototype.KEYS.KEY_ACTION_ID （“actionId”） 作为key来访问静态数据
    */
    var ___f__init__ =  function(){
        // TODO:
        // 有时候需要给客户端发送模拟消息，携带部分非标准协议的参数

        /*  value  type */
        ___f__default__reg__( "KEY_FAKE_MSG", "fakeMsg", {}, "getFakeMsg", null, null, "获取客户端模拟协议数据");

        ___f__default__reg__( "KEY_PLAY_MODE", "playMode", "", "getPlayMode", null, null, "获得牌桌模式，区分是什么玩法");

        ___f__default__reg__( "KEY_BASE_CHIP", "baseChip", 0, "getBaseChip", null, null, "底注");

        ___f__default__reg__( "KEY_TABLE_TYPE", "tableType", "", "getTableType", null, null, "获得牌桌类型，区分普通和贵宾");

        ___f__default__reg__( "KEY_TABLE_ID", "tableId", 0, "getTableId", null, null, "获得牌桌ID");

        ___f__default__reg__( "KEY_ROOM_ID", "roomId", 0, "getRoomId", null, null, "获得房间ID");

        ___f__default__reg__( "KEY_SEAT_COUNT", "seatCount", 0, "getSeatCount", null, null, "获得座位数");

        ___f__default__reg__( "KEY_WIND_SEAT_ID", "windSeatId", -1, "getWindLocalSeatId", function( _key, _arg ){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( ___static_data__[ _key ] );
        }, null, "获得门风ID");

        ___f__default__reg__( "KEY_TIME_OUT", "timeout", 0, "getTimeout", null, null, "获得操作超时");

        ___f__default__reg__( "KEY_ACTION_ID", "actionId", 0, "getActionId", null, null, "获得actionId");

        ___f__default__reg__( "KEY_TILE", "tile", 0, "getTile", null, null, "获得花色");

        ___f__default__reg__( "KEY_CHOW", "chow", [], "getChow", function( _key, _arg ){
            return GLOBAL_OBJ.table.models.Functions.chowTranslation( ___static_functions__[ "tile" ].getTile(), ___static_data__[ _key ], _arg[0] );
        }, null, "获得吃牌提示 回传一个二维数组，表示可选的吃的牌形，如[ [1,2,3], [2,3,4] ]");

        ___f__default__reg__( "KEY_PONG", "pong", [], "getPong", function( _key, _arg ){
            return GLOBAL_OBJ.table.models.Functions.pongTranslation( ___static_functions__[ "tile" ].getTile(), ___static_data__[ _key ], _arg[0] );
        }, null, "是一个二维数组，表示我们可碰的牌形，如[ [1,2,3], [2,3,4] ]");

        ___f__default__reg__( "KEY_EXPOSED_KONG", "exposed_kong", [], "getExposedKong", function( _key, _arg ){
            return GLOBAL_OBJ.table.models.Functions.kongTranslation( ___static_data__[ _key ], GLOBAL_OBJ.table.global.METHODS.EXPOSED_KONG, _arg[0] );
        }, null, "获得明杠牌提示 回传一个数组，内含具体花色(只包含碰的自己的两张牌，不包含别人出的牌)");

        ___f__default__reg__( "KEY_CONCEALED_KONG", "concealed_kong", [], "getConcealedKong" ,function( _key, _arg ){
            return GLOBAL_OBJ.table.models.Functions.kongTranslation( ___static_data__[ _key ], GLOBAL_OBJ.table.global.METHODS.CONCEALED_KONG, _arg[0] );
        }, null, "获得明杠牌提示 回传一个数组，内含具体花色(只包含碰的自己的两张牌，不包含别人出的牌)");
        
        ___f__default__reg__( "KEY_REMAINEDCOUNT", "remainedCount", 0, "getRemainedCount", null, null, "获得剩余手牌数量");

        ___f__default__reg__( "KEY_WIN_POINTS", "win_points", null, "getWinPoints", null, null, "获取可以胡的番数");

        ___f__default__reg__( "KEY_TING_ACTION", "ting_action", [], "getTingAction", function (_key, _arg) {
            return GLOBAL_OBJ.table.models.Functions.askTingTranslation( ___static_data__[ _key ] );
        }, null, "从吃碰杠胡等消息中获取听牌操作数据");

        ___f__default__reg__( "KEY_ASK_TING", "all_win_tiles", [], "getAskTing", function (_key, _arg) {
            return GLOBAL_OBJ.table.models.Functions.askTingTranslation( ___static_data__[ _key ] );
        }, null, "服务器主动询问听牌操作，例如闲家天听");

        ___f__default__reg__( "KEY_TRUSTEE", "trustee", {"0":0, "1":0, "2":0, "3":0}, "getTrustee", function( _key, _arg ){
            //_arg 必须是本地座位号
            return GLOBAL_OBJ.table.models.Functions.trusteeTranslation( ___static_data__[ _key ][_arg[0]] );
        }, "dict", "获得本地座位号对应的玩家是否托管的信息");

        ___f__default__reg__( "KEY_PLAYER", "players", {"0":null, "1":null, "2":null, "3":null}, "getPlayer", function( _key, _arg ){
            //_arg 必须是本地座位号
            return ___static_data__[ _key ][ _arg[0] ];
        }, "dict", "获得本地座位号获得玩家的UID");

    };
    ___f__init__();

    GLOBAL_OBJ.table.models.Prototype = {
        _TAG:"table.models.Prototype",
        /*
        @设置共享数据属性*/
        setShareProperty:function( _data, _key ){
            if ('undefined'==typeof(___static_data__[_key])) {
                GLOBAL_OBJ.LOGD(this._TAG," model原型中没有该static字段！key:"+_key);
                return;
            };

            Object.defineProperty(_data, _key, (function(_key){
                return {
                    get:function() { return ___static_data__[_key]; },
                    set:function( _value ) { ___static_data__[_key] = _value; },
                    enumerable: false,
                    configurable: true,
                };

            })(_key) );
        },

        /*
        @设置数据安全私有属性
        如果数据属性赋值为null时，自动赋值为缺省值，所以属性是安全的，不需要判断
        */
        setPrivateProperty:function( _src, _key, _default ){
            if ( _key && _src && _key in _src ) {
                GLOBAL_OBJ.LOGD(this._TAG," model的私有属性中已经存在该字段！key:"+_key+" _default:"+_default);
                return;
            };
            Object.defineProperty(_src, _key, (function(_k, _d){
                return {
                    get:function() { return _k; },
                    set:function( _value ) {
                        _k = (null != _value ? _value : _d);
                    },
                    enumerable: true,
                    configurable: true,
                };

            })(_key, _default) );

            _src[_key] = _default;
        },

        /*
        @扩展接口*/
        functionsExt:function( _data, _src ){
            var src = _src || {};
            for(var key in ___static_functions__) {
                for(var name in ___static_functions__[key]){

                    if ('undefined'==typeof(_data[key])) {
                        //没有 setShareProperty 过的key不需要bind函数
                        continue;
                    }

                    if ('undefined'!=typeof(src[name])) {
                        GLOBAL_OBJ.LOGD(this._TAG," src原型中已经存在同名函数！name:"+name);
                        continue;
                    }

                    // functions copy ( same pointer )
                    src[name] = ___static_functions__[key][name];
                }
            }

            // 额外给_data扩展一个doClean的方法，用来设置私有属性为缺省值
            if ('function'==typeof(src["doClean"])) {
                GLOBAL_OBJ.LOGD(this._TAG," src原型中已经存在同名函数 doClean!");
            }else{
                //安全清理，设置CACHE私有字段的值为缺省值
                src["doClean"] = function(){
                    var flag = GLOBAL_OBJ.GlobalVars.getIsTableRecord();
                    if (flag) 
                    {
                        return;
                    }
                    
                    for(var key in _data){
                        if ("object" == typeof(_data[key])) {
                            for(var k in _data[key]){
                                _data[key][k] = null;
                            }
                        }
                        _data[key] = null;
                    }
                };
            }

            return src;
        },

        parse: (function(){

            var ___f_setter___ = function( _object, _src, _key, _value ){

                if ( 'undefined' != typeof(_src[ _key ])) {
                    // var ds = new Date().getTime();

                    switch(___static_types__[ _key ]){
                        case "value":
                        ___static_data__[ _key ] = typeof(_value)!='undefined'?_value:___static_default__[ _key ];
                        break;
                        case "dict":
                        if (typeof(_value)!='undefined') {
                            for(var i in _value){
                                ___static_data__[ _key ][i] = _value[i];
                            };
                        }else{
                            ___static_data__[ _key ] = ___static_default__[ _key ];
                        };
                        break;
                    };
                    // var de = new Date().getTime();
                    //
                    // GLOBAL_OBJ.LOGD('___f_setter___，耗时：' + (de - ds));
                }

            };
            return function( _object, _src, _data ){
                var data = _data;
                var src  = _src || {};
                if (!data){
                    return;
                }

                // var ds = new Date().getTime();

                ___f_setter___( _object, src, this.KEYS.KEY_FAKE_MSG, data.fakeMsg );//非标准协议组成部分 temp

                ___f_setter___( _object, src, this.KEYS.KEY_PLAY_MODE, data.play_mode );

                ___f_setter___( _object, src, this.KEYS.KEY_BASE_CHIP, data.baseChip || data.base_chip );

                ___f_setter___( _object, src, this.KEYS.KEY_TABLE_TYPE, data.tableType );

                ___f_setter___( _object, src, this.KEYS.KEY_TABLE_ID, data.tableId );

                ___f_setter___( _object, src, this.KEYS.KEY_ROOM_ID, data.roomId );

                ___f_setter___( _object, src, this.KEYS.KEY_SEAT_COUNT, data.maxSeatN );

                ___f_setter___( _object, src, this.KEYS.KEY_ACTION_ID, data.action_id ? data.action_id : data.actionId );

                ___f_setter___( _object, src, this.KEYS.KEY_TILE, data.tile );

                ___f_setter___( _object, src, this.KEYS.KEY_PONG, data.peng_action );

                ___f_setter___( _object, src, this.KEYS.KEY_CHOW, data.chi_action );

                ___f_setter___( _object, src, this.KEYS.KEY_EXPOSED_KONG, data.exposed_kong );

                ___f_setter___( _object, src, this.KEYS.KEY_CONCEALED_KONG, data.concealed_kong );

                ___f_setter___( _object, src, this.KEYS.KEY_REMAINEDCOUNT, data.remained_count );
                
                ___f_setter___( _object, src, this.KEYS.KEY_WIN_POINTS, data.win_degree );

                // 摸牌，吃碰杠胡等操作夹带的听牌操作
                ___f_setter___( _object, src, this.KEYS.KEY_TING_ACTION, data.ting_action );

                // 服务器主动询问听操作，例如闲家天听
                ___f_setter___( _object, src, this.KEYS.KEY_ASK_TING, data.all_win_tiles);

                //多字段操作，tableinfo里是current_player_seat_id, draw&chow&pong&kong协议seatId
                ___f_setter___( _object, src, this.KEYS.KEY_WIND_SEAT_ID,
                    null != data.current_player_seat_id ? data.current_player_seat_id : data.seatId );

                //多字段操作，tableinfo里是play_timeout，其他协议timeout
                ___f_setter___( _object, src, this.KEYS.KEY_TIME_OUT,
                    null != data.play_timeout ? data.play_timeout : data.timeout );

                /*  dict type 特殊的处理，人为转换的数据*/
                ___f_setter___( _object, src, this.KEYS.KEY_PLAYER,  data.__client_players );

                ___f_setter___( _object, src, this.KEYS.KEY_TRUSTEE, data.__client_trustee );

                // var de = new Date().getTime();

                // GLOBAL_OBJ.LOGD('共享属性解析，耗时：' + (de - ds));
            };

        })(),

        doClean:function(){
            ___f__init__();
        },

        doDefault:function(_key){
            ___static_default__[ ___static_keys__[ _key ] ] = ___static_data__[ ___static_keys__[ _key ] ];
        },
    };


    /*
    GLOBAL_OBJ.table.models.Prototype.KEYS 设置只读模式
    @*/
    ___f__writable__(GLOBAL_OBJ.table.models.Prototype, "KEYS", (function(){
        var d = {};
        for(var key in ___static_keys__){
            ___f__writable__(d, key, ___static_keys__[key]);
        };
        return d;
    })() );
})();
