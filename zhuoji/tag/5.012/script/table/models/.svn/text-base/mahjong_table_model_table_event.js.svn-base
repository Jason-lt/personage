/*****************************************
 *  mahjong_table_model_location.js
    牌桌等待区相关model
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-07-22
 *  
    协议说明：
    {"cmd":"table_event","result":
        {"count":3,"players":
            [{"name":"我爱的雪","sex":1,"userId":1102,"pic":"http://ddz.image.tuyoo.com/avatar/head_hou.png","coin":826520}],"gameId":7}}
    
    count:字段不依赖，没有什么意义，直接统计当前桌上的人数即可。
    使用说明:

 */

guiyang.table.models.TableEvent = (function(){
    var GLOBAL_OBJ = guiyang;
    
    /*
    私有数据+接口
    TODO:
    数据的原型，存储以及通知的抛出
    */

    /* @数据缓存*/
    var CACHE                   = {}
    var PROTOTYPE               = GLOBAL_OBJ.table.models.Prototype;

    /* @私有属性 */

    /* @共享属性 */
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_PLAYER);
    

    /* @数据通知*/
    var ___f_notificate         = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        };

        var data                = _data;

        //本地转存
        data.__client_players = {};
        for(var i in data.players){
            var lsid = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( data.players[i].seatId );
            data.__client_players[lsid] = data.players[i].userId;
        };

        PROTOTYPE.parse(_object, CACHE, data);

        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_EVENT, data);
        };
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.TableEvent",

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

        /*
        测试用例
        TODO:
        model测试用例
        */
        test:function(_index){
            var cmds = {};
            switch (_index){
                case 0:
                cmds = {"cmd":"table_event","result":{"count":1,"players":[{"name":"地狱赌王","sex":0,"userId":10001,"pic":"http://ddz.image.tuyoo.com/avatar/head_coffee.png","coin":0,"max_win_sequence_count":13,"win_sequence_count":5,"max_degree":64,"master_point":825,"master_point_level":12,"master_point_level_diff":[25,100],"week_master_point":625,"charm":0,"seatId":0}],"gameId":7}};
                break;
                case 1:
                cmds = {"cmd":"table_event","result":{"count":2,"players":[{"name":"第四个","sex":1,"userId":1133,"pic":"http://ddz.image.tuyoo.com/avatar/head_suv.png","coin":631560,"seatId":1}],"gameId":7}};
                break;
                case 2:
                cmds = {"cmd":"table_event","result":{"count":3,"players":[{"name":"钓鱼高手","sex":1,"userId":1136,"pic":"http://ddz.image.tuyoo.com/avatar/head_china.png","coin":994030,"seatId":2}],"gameId":7}};
                break;
                case 3:
                cmds = {"cmd":"table_event","result":{"count":4,"players":[{"name":"孤云","sex":0,"userId":10005,"pic":"http://ddz.image.tuyoo.com/avatar/head_china.png","coin":0,"max_win_sequence_count":5,"win_sequence_count":0,"max_degree":65,"master_point":295,"master_point_level":6,"master_point_level_diff":[95,100],"week_master_point":0,"charm":0,"seatId":0}],"gameId":7}};
                break;
                case 4:
                cmds = {"cmd":"table_event","result":{"count":1,"players":[{"name":"孤云","sex":0,"userId":10005,"pic":"http://ddz.image.tuyoo.com/avatar/head_china.png","coin":0,"max_win_sequence_count":5,"win_sequence_count":0,"max_degree":73,"master_point":295,"master_point_level":6,"master_point_level_diff":[95,100],"week_master_point":0,"charm":0,"new_win_sequence_count":0,"seatId":0}],"gameId":7}};
                break;
                case 5:
                cmds = {"cmd":"table_event","result":{"count":2,"players":[{"name":"天残雨","sex":1,"userId":1033,"pic":"http://ddz.image.tuyoo.com/avatar/head_female_1.png","coin":704150,"seatId":1}],"gameId":7}};
                break;
                case 6:
                cmds = {"cmd":"table_event","result":{"count":3,"players":[{"name":"悲情面具","sex":0,"userId":1065,"pic":"http://ddz.image.tuyoo.com/avatar/head_coffee.png","coin":998780,"seatId":2}],"gameId":7}};
                break;
            };
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        }
    });
})();