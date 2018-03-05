/*****************************************
 *  mahjong_table_model_count_down.js
    等待区倒计时 model
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-08-24
 *  
    协议说明：
    比较典型的就是贵宾厅的设计，不知道为什么location和tableInfo协议要同时下发，导致贵宾厅和普通桌完全不能
    用同一套设计。
    普通桌收到location协议后入等待区场景，人数够了tableinfo拉进牌桌，所以tableinfo应该作为唯一的入桌接口。
    贵宾厅收到location后同时tableInfo就会下发，所以等待区不能作为场景存在，只能设计一个等待区的弹窗，且只能收到
    该模块的通知时再行弹出。。。。。实属无奈

    使用说明:
    
 */

guiyang.table.models.CountDown = (function(){
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
    PROTOTYPE.setPrivateProperty(CACHE, "activeSeatId", -1, "当前倒计时玩家的服务端座位号");
    PROTOTYPE.setPrivateProperty(CACHE, "countDown", 0, "倒计时");

    /* @共享属性 */

    /* @数据通知*/
    var ___f_notificate = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        };
        
        var data            = _data;
        CACHE.activeSeatId  = data.seatId;
        CACHE.countDown     = data.secs;

        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);

        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_COUNT_DOWN, data);
        }
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.CountDown",

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
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_COUNT_DOWN, {});
            return false;
        },

        // 获得当前玩家的 本地座位号
        getActiveLocalSeatId:function(){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.activeSeatId );
        },

        // 获得当前玩家的 本地座位号
        getTimeout:function(){
            return CACHE.countDown;
        },
        
        /*
        测试用例
        TODO:
        model测试用例
        */
        test:function(_index){
            var cmds;
            switch (_index){
            case 0:
            cmds = {"cmd":"count_down","result":{"tableId":790610010199,"roomId":79061001,"seatId":0,"userId":10005,"secs":30,"gameId":7}};
            break;
            };
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        }
    });
})();