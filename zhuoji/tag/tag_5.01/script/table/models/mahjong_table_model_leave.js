/*****************************************
 *  mahjong_table_model_leave.js
    (离桌)牌桌相关model
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-07-25
 *  
    协议说明：
    
    {"cmd":"leave","result":{"seatId":1,"gameId":7}}
    使用说明:

 */

guiyang.table.models.Leave = (function(){
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
    PROTOTYPE.setPrivateProperty(CACHE, "activeSeatId", -1, "离桌人服务端座位号");
    PROTOTYPE.setPrivateProperty(CACHE, "reason", "", "一般为空，有readyTimeOut表示超时离开");

    /* @共享属性 */
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_PLAYER);
    
    /* @数据通知*/
    var ___f_notificate    = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        };
        
        var data            = _data;
        CACHE.activeSeatId  = data.seatId;
        CACHE.reason        = data.reason;

        //本地转存(玩家离开)
        var lsid            = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.activeSeatId );
        data.__client_players       = {};
        data.__client_players[lsid] = null;

        if(lsid == GLOBAL_OBJ.table.global.MYSEAT){
            CACHE.my_leave_reason = data.reason;
        }

        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);
        
        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_LEAVE, data);
        };
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.Leave",

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

        // 获得离桌玩家的 本地座位号
        getActiveLocalSeatId:function(){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.activeSeatId );
        },

        // 获得离桌玩家的 服务端座位号
        getActiveServerSeatId:function(){
            return CACHE.activeSeatId;
        },

        // 获得离桌玩家离开理由
        getUserLeaveReson:function(){
            return CACHE.reason;
        },

        // 获得本家离开理由
        getMineLeaveReson:function(){
            return CACHE.my_leave_reason || null;
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
                cmds = {"cmd":"leave","result":{"seatId":1,"gameId":7}};
                break;
                case 1:
                cmds = {"cmd":"leave","result":{"seatId":0,"gameId":7}};
                break;
            };
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        }
    });
})();