/*****************************************
 *  mahjong_table_model_showtips.js
    (牌桌提示)牌桌相关model
 *  mahjong
 *
 *  Created by lcr on 17-05-31
 *  
    协议说明：

    使用说明:

 */

guiyang.table.models.showtips = (function(){
    "use strict";
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
    PROTOTYPE.setPrivateProperty(CACHE, "showtips", 0, "牌桌提示对应的id");

    /* @共享属性 */

    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_FAKE_MSG );
    
    /* @数据通知*/
    var ___f_notificate    = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        };
        
        var data            = _data;
        CACHE.showtips      = data.tips || "";

        // GLOBAL_OBJ.LOGD("showtips_data:", JSON.stringify(data) );
        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);
        
        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_SHOWTIPS, data);
        };
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.showtips",

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

        //包胡情况下需要打出去的花色数据
        getShowtipsId:function(){
            return CACHE.showtips;
        },


    });
})();