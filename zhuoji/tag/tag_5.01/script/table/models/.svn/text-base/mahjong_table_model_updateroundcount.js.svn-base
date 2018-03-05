/*****************************************
 *  mahjong_table_model_updateroundcount.js
    (刷新好友场圈数)牌桌相关model
 *  mahjong
 *
 *  Created by lcr on 17-07-28
 *  
    协议说明：

 {
    "cmd": "table_call",
    "result":{
        "action": "updateRoundCount", //更新圈数
        "gameId": 701,
        "roomId": 7309011001,
        "tableId": 73090110010200,
        "curCount": 0, //当前圈数
        "totalCount": [0,1],     //总圈数
    }
}
    使用说明:

 */

guiyang.table.models.updateroundcount = (function(){
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
    PROTOTYPE.setPrivateProperty(CACHE, "curCount", 0, "当前圈数");

    /* @共享属性 */
    
    /* @数据通知*/
    var ___f_notificate    = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        };
        
        var data                 = _data;
        CACHE.curCount           = data.curCount;
        CACHE.totalCount         = data.totalCount;
        // GLOBAL_OBJ.LOGD("GLOBAL_OBJ.table.models.updateroundcount",JSON.stringify(data));
        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);
        
        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_UPDATE_ROUNDCOUNT, data);
        };
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.updateroundcount",

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

        //获取好友桌当前圈数
        getCurCount:function(){
            return CACHE.curCount;
        },

        //获取好友桌总圈数
        getTotalCount:function(){
            return CACHE.totalCount;
        },

    });
})();