/*****************************************
 *  mahjong_table_model_trustee.js
 (托管)牌桌相关model
 *  mahjong
 *
 *  Created by zengxx on 16-07-05
 *
 协议说明：

 {"cmd":"set_trustee", "result":{"gameId":7}}
 {"cmd":"remove_trustee", "result":{"gameId":7}}

 使用说明:

 */

guiyang.table.models.Trustee = (function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;

    /*
     私有数据+接口
     TODO:
     数据的原型，存储以及通知的抛出
     */

    /* @数据缓存*/
    var CACHE                = {};
    var PROTOTYPE            = GLOBAL_OBJ.table.models.Prototype;

    /* @私有属性 */


    /* @共享属性 */
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TRUSTEE);

    /* @数据通知*/
    var ___f_notificate = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        }

        var data              = _data;
        data.__client_trustee = {"0": data.trustee};//转存托管数据
        PROTOTYPE.parse(_object, CACHE, data);

        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_TRUSTEE, data);
        }
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.Trustee",

        /*
         公有数据+接口
         TODO:
         外部调用
         */
        /* 协议解析*/
        parse:function(_data, _slient){
            var data = _data;
            if (null == data){
                return;
            }
            return ___f_notificate(this, data, _slient);
        },

        parseFromSetTrustee:function(){
            this.parse({ trustee: 1});
        },

        parseFromRemoveTrustee:function(){
            this.parse({ trustee: 0});
        },

        /*
         激活model，发送一次数据
         返回值：false数据为空 */
        activate:function(){
            return false;
        },

    });

})();