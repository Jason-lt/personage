/*****************************************
 *  mahjong_table_model_ready.js
    牌桌准备相关model
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-08-25
 *  
    协议说明：
    {"cmd":"ready","result":{"seatId":0,"gameId":7}}
    
    count:字段不依赖，没有什么意义，直接统计当前桌上的人数即可。
    使用说明:

 */

guiyang.table.models.Ready      = (function(){
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
    PROTOTYPE.setPrivateProperty(CACHE, "activeSeatId", -1, "准备玩家的服务端座位号");

    /* @共享属性 */

    /* @数据通知*/
    var ___f_notificate         = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        };
        
        var data                = _data;
        CACHE.activeSeatId      = data.seatId;

        PROTOTYPE.parse(_object, CACHE, data);

        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_READY, data);
        };
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.Ready",

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

        // 获得发牌玩家的 本地座位号
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
            switch (_index){
                case 0:
                cmds = {"cmd":"ready","result":{"seatId":1,"gameId":7}}
                break;
                case 1:
                cmds = {"cmd":"ready","result":{"seatId":2,"gameId":7}}
                break;
                case 2:
                cmds = {"cmd":"ready","result":{"seatId":3,"gameId":7}}
                break;
            };
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        }
    });
})();