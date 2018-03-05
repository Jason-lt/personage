/*****************************************
 *  mahjong_table_model_custom.js
    (自建桌)牌桌相关model
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-11-01
 *  
    协议说明：
    

    使用说明:
    
 */

guiyang.table.models.Custom = (function(){
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
    PROTOTYPE.setPrivateProperty(CACHE, "activeSeatId", -1, "服务端座位号");

    /* @共享属性 */


    /* @数据通知*/
    var ___f_notificate   = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        }

        var data           = _data;
        CACHE.activeSeatId = data.seatId;

        //本地转存
        switch(data.action){
            case "ready":
            break;
        };

        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);

        if (!_slient){
            //本地转存
            switch(data.action){
                case "ready":
                GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_CUSTOM_TABLE_READY, data);
                break;
                // case "leave":
                // GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_LEAVE, data);
                break;
            };
            
        }
        return _slient
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.Custom",

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

        // 获得玩家的 本地座位号
        getActiveLocalSeatId:function(){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.activeSeatId );
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
            cmds = {"cmd":"create_table","result":{"action":"ready","isTableHost":0,"seatId":1,"gameId":710}};
            break;
            case 1:
            cmds = {"cmd":"create_table","result":{"action":"leave","seatId":0,"gameId":710,"state":"win"}};
            break;
            };
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        }
    });
})();