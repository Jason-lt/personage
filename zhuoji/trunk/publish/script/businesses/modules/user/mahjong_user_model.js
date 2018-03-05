/*****************************************
 *  mahjong_user_model.js
    用户 model
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-06-25
 *  
    协议说明：

    使用说明:

 */
(function () {
    var GLOBAL_OBJ = guiyang;

    GLOBAL_OBJ.businesses.modules.User.Model = (function(){


        /*
         私有数据+接口
         TODO:
         数据的原型，存储以及通知的抛出
         */
        var CACHE                  = {};

        /* @基础数据模板*/
        var ___user_basic_template = function(){
            return {
                uid: 0,
                name: "anonymous",
                sex: 0, //male:0, female:1
                portrait: null, //头像url地址
                coin: 0, //金币数
                ip:"", //ip地址
                vip:{
                    exp: 0,
                    level: 0
                },
                tableCoin:0,
                card:null,
                custom:null
            };
        };

        /* @牌桌名片数据模板*/
        var ___user_card_template = function(){
            return {
                rankInfo:"",
                masterPoint:0,
                charm:0,
                maxDegree:0,
                maxContinuousWin:0,
            };
        };

        /* @自建桌数据模板*/
        var ___user_custom_template = function(){
            return {
                ip:"0.0.0.0",
                score:0,
            };
        };

        return {
            _TAG:"businesses.modules.User.Model",

            /*
             私有接口
             TODO:
             内部调用
             */
            parse:function(_user){
                GLOBAL_OBJ.LOGD(this._TAG, " mahjong_user_model parse _user = " + JSON.stringify(_user));
                var user         = (CACHE[ _user.userId ] = CACHE[ _user.userId ] || {});
                var basic        = user.basic = user.basic || ___user_basic_template();
                var card         = user.card  = user.card  || ___user_card_template();
                var custom       = user.custom  = user.custom  || ___user_custom_template();
                var vip          = _user.vipInfo || { vipLevel:{} };

                basic.uid        = _user.userId;
                basic.name       = _user.name || basic.name;
                basic.sex        = _user.sex  || basic.sex;
                basic.portrait   = _user.pic  || basic.portrait;
                basic.coin       = _user.coin || basic.coin;
                // basic.tableCoin  = _user.tableCoin || basic.tableCoin;
                basic.tableCoin  = _user.tableCoin != null ? _user.tableCoin : basic.tableCoin;
                basic.ip         = _user.ip   || basic.ip;

                basic.vip.exp    = vip.vipExp || basic.vip.exp;
                basic.vip.level  = vip.vipLevel.level != null ? vip.vipLevel.level : basic.vip.level;

                //名片部分
                user.card.rankInfo         = _user.rank_index != null ? (_user.rank_name || "") + " 第" + _user.rank_index + "名" : user.card.rankInfo;
                user.card.masterPoint      = _user.master_point != null ? _user.master_point : user.card.masterPoint;
                user.card.charm            = _user.charm != null ? _user.charm : user.card.charm;
                user.card.maxDegree        = _user.max_degree != null ? _user.max_degree : user.card.maxDegree;
                user.card.maxContinuousWin = _user.max_win_sequence_count != null ? _user.max_win_sequence_count : user.card.maxContinuousWin;

                //自建桌部分
                user.custom.score          = _user.score != null ? _user.score : user.custom.score;
                user.custom.ip             = _user.ip != null ? _user.ip : user.custom.ip;

                GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.businesses.Events.UPDATE_USER_INFO, { uid: basic.uid });
            },

            /*
             公有数据+接口
             TODO:
             外部调用
             */

            /*
             激活model，发送一次数据
             返回值：false数据为空 */
            activate:function(_uid){
                GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.businesses.Events.UPDATE_USER_INFO, { uid: _uid });
                return false;
            },

            clean:function(){
                CACHE = {};
            },


            /* 
             @协议解析
             因为服务器协议字段名不统一，比如userId字段，有些协议叫userId，有些叫uid，
             所以在此统一转存
             */

            //来自牌桌 tableInfo
            parseFromTableInfo:function(_data){
                var players = _data.players;
                if (!_data || !players){
                    return;
                }
                for( var i in players ){
                    this.parse( players[i] );
                }
            },

            parseFromTableSit:function(_data){
                var data = _data;
                if (!data){
                    return;
                }
                this.parse( data );
            },

            //来自牌桌 location
            parseFromTableLocation:function(_data){
                this.parseFromTableInfo(_data);
            },

            //来自牌桌 table event 
            parseFromTableEvent:function(_data){
                this.parseFromTableInfo(_data);
            },

            //来自贵宾桌房间列表
            parseFromVipRoomList:function(_data){
                var data = _data;
                if (!data||!data.tables){
                    return;
                }

                for(var i in data.tables){
                    var users = data.tables[i].users || [];
                    for( var j in users ){
                        if ( null == users[j] || null == users[j].uid ) {continue;}
                        this.parse( {
                            userId: users[j].uid,
                            pic: users[j].purl
                        } );
                    }
                }
            },

            parseFromTableScore:function(_data){
                var score    = _data.score || _data.tableCoin;
                var sid;
                var _isconnect= _data.isReconnect || false;
                for(var i = 0 ; i < score.length; ++i){
                    sid = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( i );
                    var _uid  = GLOBAL_OBJ.table.models.Score.getUserId(sid);
                    GLOBAL_OBJ.LOGD("mahjong_user_model.js_parseFromTableScore:", _uid + ":" +_uid + "Score:" + GLOBAL_OBJ.table.models.Score.getScore(_uid));
                    if ( !_uid || _uid <=0 ) { continue; }
                    // GLOBAL_OBJ.LOGD("mahjong_user_model.js_parseFromTableScore:", _uid+":"+GLOBAL_OBJ.table.models.Score.getScore(_uid));
                    var user = { userId: _uid, score : GLOBAL_OBJ.table.models.Score.getScore(_uid),tableCoin :  GLOBAL_OBJ.table.models.Score.getTableCoin(_uid) };
                    this.parse( user );
                    GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_SCORE, { uid : _uid, isconnect : _isconnect });
                }

            },

            /*  公有数据+接口  */
            getName:function(_uid){
                var user = CACHE[ _uid ];
                return user?user.basic.name:"";
            },

            getSex:function(_uid){
                var user = CACHE[ _uid ];
                return user?user.basic.sex:0;
            },

            getIP:function(_uid){
                var user = CACHE[ _uid ];
                return user?user.custom.ip:"0.0.0.0";
            },

            getCustomScore:function(_uid){
                var user = CACHE[ _uid ];
                if (user){
                    GLOBAL_OBJ.LOGD(this._TAG, "getCustomScore ：user.custom.score = " + user.custom.score);
                }
                else {
                    GLOBAL_OBJ.LOGD(this._TAG, "getCustomScore ：user = null");
                }
                return user?user.custom.score:0;
            },

            getPortraitUrl:function(_uid){
                var user = CACHE[ _uid ];
                return user ? user.basic.portrait:null;
            },

            getCoin:function(_uid){
                var user = CACHE[ _uid ];
                return user?user.basic.coin:0;
            },
            getTableCoin:function(_uid){
                var user = CACHE[ _uid ];
                return user ? user.basic.tableCoin : 0;
            },

            getVipExp:function(_uid){
                var user = CACHE[ _uid ];
                return user?user.basic.vip.exp:0;
            },

            getVipLevel:function(_uid){
                var user = CACHE[ _uid ];
                return user?user.basic.vip.level:0;
            },

            /*  牌桌名片部分 */
            getRankInfo:function(_uid){
                var user = CACHE[ _uid ];
                return user?user.card.rankInfo:"";
            },

            getMasterPoint:function(_uid){
                var user = CACHE[ _uid ];
                return user?user.card.masterPoint:0;
            },

            getCharmPoint:function(_uid){
                var user = CACHE[ _uid ];
                return user?user.card.charm:0;
            },

            getMaxDegree:function(_uid){
                var user = CACHE[ _uid ];
                return user?user.card.maxDegree:0;
            },

            getMaxContinuousWin:function(_uid){
                var user = CACHE[ _uid ];
                return user?user.card.maxContinuousWin:0;
            },


            /*
             测试用例
             TODO:
             model测试用例
             */
            test:function(){

            }
        }
    })();

})();
