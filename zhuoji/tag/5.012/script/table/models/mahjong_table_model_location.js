/*****************************************
 *  mahjong_table_model_location.js
    牌桌等待区相关model
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-07-22
 *  
    协议说明：
    {"cmd":"location","result":{"tableId":710210010200,"roomId":71021001,"seatId":0,"gameId":7}}

    使用说明:

 */

guiyang.table.models.Location = (function(){
    var GLOBAL_OBJ = guiyang;
    
    /*
    私有数据+接口
    TODO:
    数据的原型，存储以及通知的抛出
    */

    /* @数据缓存*/
    var CACHE                 = {}
    var PROTOTYPE             = GLOBAL_OBJ.table.models.Prototype;

    /* @私有属性 */
    PROTOTYPE.setPrivateProperty(CACHE, "activeSeatId", -1, "本家服务器座位号");

    /* @共享属性 */
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_PLAY_MODE);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TABLE_TYPE);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TABLE_ID);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_ROOM_ID);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_SEAT_COUNT);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_PLAYER);

    /* @数据通知*/
    var ___f_notificate     = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        };
        
        //共享数据删除
        GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_GAME_BEGIN, {});

        GLOBAL_OBJ.table.utils.Seat.init({ num: _data.maxSeatN, seatId:_data.seatId }); //初始化座位映射

        var data            = _data;
        CACHE.activeSeatId  = data.seatId;

        //静态数据部分

        //本地转存
        data.__client_players = {};
        for(var i in data.players){
            var lsid = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( data.players[i].seatId );
            data.__client_players[lsid] = data.players[i].userId;
        };

        PROTOTYPE.parse(_object, CACHE, data);

        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_LOCATION, data);
        };
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.Location",

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
            GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_TABLE_LOCATION);
            return false;
        },

        // 获得本家 本地座位号
        getActiveLocalSeatId:function(){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( this.getActiveServerSeatId() );
        },

        // 获得本家 服务端座位号
        getActiveServerSeatId:function(){
            return CACHE.activeSeatId;
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
                cmds = {"cmd":"location","result":{"tableId":700410010200,"roomId":70041001,"seatId":0,"maxSeatN":4,"play_mode":"sichuan","tableType":"normal","players":[{"name":"地狱赌王","sex":0,"userId":10001,"pic":"http://ddz.image.tuyoo.com/avatar/head_coffee.png","coin":0,"max_win_sequence_count":13,"win_sequence_count":5,"max_degree":64,"master_point":825,"master_point_level":12,"master_point_level_diff":[25,100],"week_master_point":625,"charm":0,"seatId":0}],"gameId":7}};
                break;
                case 1:
                cmds = {"cmd":"location","result":{"tableId":790610010199,"roomId":79061001,"seatId":0,"maxSeatN":4,"play_mode":"sichuan_xlch","tableType":"vip","players":[{"name":"孤云","sex":0,"userId":10005,"pic":"http://ddz.image.tuyoo.com/avatar/head_china.png","coin":0,"max_win_sequence_count":5,"win_sequence_count":0,"max_degree":65,"master_point":295,"master_point_level":6,"master_point_level_diff":[95,100],"week_master_point":0,"charm":0,"seatId":0},{"name":"","sex":0,"userId":1160,"pic":"","coin":0,"seatId":1},{"name":"","sex":0,"userId":1057,"pic":"","coin":0,"seatId":2},{"name":"","sex":0,"userId":1039,"pic":"","coin":0,"seatId":3}],"gameId":7}};
                break;
                case 2:
                cmds = {"cmd":"location","result":{"tableId":710410010200,"roomId":71041001,"seatId":0,"maxSeatN":4,"play_mode":"guobiao","tableType":"normal","players":[{"name":"孤云","sex":0,"userId":10005,"pic":"http://ddz.image.tuyoo.com/avatar/head_china.png","coin":0,"max_win_sequence_count":5,"win_sequence_count":0,"max_degree":73,"master_point":295,"master_point_level":6,"master_point_level_diff":[95,100],"week_master_point":0,"charm":0,"new_win_sequence_count":0,"seatId":0}],"gameId":7}};
                break;
                case 3:
                cmds = {"cmd":"location","result":{"tableId":780210010200,"roomId":78021001,"seatId":0,"maxSeatN":4,"play_mode":"guobiao","tableType":"create","players":[{"name":"低调ing","sex":0,"userId":10027,"pic":"http://ddz.image.tuyoo.com/avatar/head_horse.png","coin":0,"max_win_sequence_count":0,"win_sequence_count":0,"max_degree":0,"master_point":0,"master_point_level":1,"master_point_level_diff":[0,5],"week_master_point":0,"charm":0,"new_win_sequence_count":0,"seatId":0}],"gameId":7}};
                break;
            };
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        }
    });
})();