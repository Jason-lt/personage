guiyang.table.models.Test = (function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;
    /*
    私有数据+接口
    TODO:
    数据的原型，存储以及通知的抛出
    */

    /* @数据缓存*/
    var CACHE  = {
        timeout:0,
        seatId:-1,
    };

    var KEYS   = GLOBAL_OBJ.table.models.Prototype.KEYS;
    GLOBAL_OBJ.table.models.Prototype.setShareProperty(CACHE, KEYS.KEY_TILE );
    GLOBAL_OBJ.table.models.Prototype.setShareProperty(CACHE, KEYS.KEY_ACTION_ID);
    GLOBAL_OBJ.table.models.Prototype.setShareProperty(CACHE, KEYS.KEY_CHOW);
    GLOBAL_OBJ.table.models.Prototype.setShareProperty(CACHE, KEYS.KEY_PONG);
    GLOBAL_OBJ.table.models.Prototype.setShareProperty(CACHE, KEYS.KEY_EXPOSED_KONG);
    GLOBAL_OBJ.table.models.Prototype.setShareProperty(CACHE, KEYS.KEY_WIN_POINTS);



    /* @数据通知*/
    var ___f_notificate = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        }
        
        var data      = _data;

        //私有数据部分
        CACHE.timeout = data.timeout || 0;
        CACHE.seatId  = typeof(data.seatId)=='undefined'?-1:data.seatId;

        //静态数据部分
        GLOBAL_OBJ.table.models.Prototype.parse(_object, CACHE, data);
        
        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_PONG, data);
        };
        return _slient;
    };

    return GLOBAL_OBJ.table.models.Prototype.functionsExt(CACHE, {
        _TAG:"table.models.Test",
        parse: function(_data, _slient){
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

        // 本地seat_id
        getLocalSeatId:function(){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(CACHE.seatId);
        },

        test: function(){
            var CACHE1  = {
                timeout:0,
                seatId:-1,
            };
            GLOBAL_OBJ.table.models.Prototype.setShareProperty(CACHE1, KEYS.KEY_ACTION_ID);

            var cmds = {"cmd":"peng","result":{"peng_action":3, "action_id":4}};
            GLOBAL_OBJ.table.models.Test.parse(cmds.result, true);
        }
    });
})();