/*****************************************
 *  mahjong_table_model_ready.js
    牌桌准备相关model
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-08-25
 *  
    协议说明：
    {"cmd":"sit","result":{"isTableHost":1,"createTableNo":"000775","itemParams":{"cardCount":0},"score":0,"tableId":781310010200,"roomId":78131001,"seatId":0,"userId":10027,"ip":"111.203.187.129","name":"低调ing","sex":0,"pic":"http://ddz.image.tuyoo.com/avatar/head_horse.png","coin":1000,"max_win_sequence_count":0,"win_sequence_count":0,"max_degree":0,"master_point":0,"master_point_level":1,"master_point_level_diff":[0,5],"week_master_point":0,"charm":0,"new_win_sequence_count":0,"stat":"ready","member":{"flag":0},"gameId":7}}
    
    count:字段不依赖，没有什么意义，直接统计当前桌上的人数即可。
    使用说明:

 */

(function () {
    "use strict";
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.table.models.Sit      = (function(){
        /*
         私有数据+接口
         TODO:
         数据的原型，存储以及通知的抛出
         */

        /* @数据缓存*/
        var CACHE                   = {};
        var PROTOTYPE               = GLOBAL_OBJ.table.models.Prototype;

        /* @私有属性 */
        PROTOTYPE.setPrivateProperty(CACHE, "activeSeatId",  -1, "玩家服务器座位号");

        for(var i = 0 ; i < 4 ; ++i){
            PROTOTYPE.setPrivateProperty(CACHE, i,  {}, i+"#座位（本地座位号）玩家");
            /*  国标区间 */
            PROTOTYPE.setPrivateProperty(CACHE[i], "userId",  0, "玩家uid");
            PROTOTYPE.setPrivateProperty(CACHE[i], "activeSeatId",  -1, "玩家服务器座位号");
        }

        /* @共享属性 */
        PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_PLAYER);

        /* @数据通知*/
        var ___f_notificate         = function(_object, _data, _slient){
            if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
                return _slient;
            }

            var data                = _data;
            var localSeatId         = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( data.seatId );

            CACHE.activeSeatId              = data.seatId;
            CACHE[localSeatId].activeSeatId = data.seatId;
            CACHE[localSeatId].userId       = data.userId;

            data.__client_players = {};
            data.__client_players[ GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(CACHE.activeSeatId) ] = data.userId;

            PROTOTYPE.parse(_object, CACHE, data);

            if (!_slient){
                GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_SIT, data);
            }
            return _slient;
        };

        return PROTOTYPE.functionsExt(CACHE, {
            _TAG:"table.models.Sit",

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
                GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_SIT, {});
                return false;
            },

            // 获得玩家的 本地座位号
            getActiveLocalSeatId:function(){
                return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.activeSeatId );
            },

            // 获得玩家的 uid
            getUserIdByLocalSeatId:function(_localSeatId){
                return CACHE[_localSeatId].userId;
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
                        cmds = {"cmd":"sit","result":{"isTableHost":1,"createTableNo":"000775","itemParams":{"cardCount":0},"score":0,"tableId":781310010200,"roomId":78131001,"seatId":0,"userId":10027,"ip":"111.203.187.129","name":"低调ing","sex":0,"pic":"http://ddz.image.tuyoo.com/avatar/head_horse.png","coin":1000,"max_win_sequence_count":0,"win_sequence_count":0,"max_degree":0,"master_point":0,"master_point_level":1,"master_point_level_diff":[0,5],"week_master_point":0,"charm":0,"new_win_sequence_count":0,"stat":"ready","member":{"flag":0},"gameId":7}}
                        break;
                    case 1:
                        cmds = {"cmd":"sit","result":{"isTableHost":0,"createTableNo":"000775","itemParams":{"cardCount":0},"score":1,"tableId":781310010200,"roomId":78131001,"seatId":1,"userId":10001,"ip":"111.203.187.111","name":"低调@","sex":1, "pic":"http://ddz.image.tuyoo.com/avatar/head_horse.png","coin":1000,"max_win_sequence_count":0,"win_sequence_count":0,"max_degree":0,"master_point":0,"master_point_level":1,"master_point_level_diff":[0,5],"week_master_point":0,"charm":0,"new_win_sequence_count":0,"stat":"waiting","member":{"flag":0},"gameId":7}}
                        break;
                };
                ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
            }
        });
    })();
})();

