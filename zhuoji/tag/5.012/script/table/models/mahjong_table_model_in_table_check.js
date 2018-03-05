/*****************************************
 *  mahjong_table_model_trustee.js
    检查玩家是否在牌桌上 相关model
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-07-05
 *  
    协议说明：
    

    使用说明:

 */

guiyang.table.models.InTableCheck = (function(){
    var GLOBAL_OBJ = guiyang;
    
    /*
    私有数据+接口
    TODO:
    数据的原型，存储以及通知的抛出
    */

    /* @数据缓存*/
    var CACHE                = {}
    var PROTOTYPE            = GLOBAL_OBJ.table.models.Prototype;

    /* @私有属性 */
    PROTOTYPE.setPrivateProperty(CACHE, "userId",  0, "用户ID");
    PROTOTYPE.setPrivateProperty(CACHE, "roomId",  0, "房间ID");
    PROTOTYPE.setPrivateProperty(CACHE, "tableId", 0, "牌桌ID");
    PROTOTYPE.setPrivateProperty(CACHE, "seatId",  -1, "牌桌服务器座位号ID");
    /* @共享属性 */
    

    /* @数据通知*/
    var ___f_notificate = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        };
        
        var data      = _data;
        CACHE.userId  = _data.target;
        CACHE.tableId = _data.tableId;
        CACHE.roomId  = _data.roomId;
        CACHE.seatId  = _data.seatId;

        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHECK_IN_TABLE, data);
        };
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.InTableCheck",

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
            };
            return ___f_notificate(this, data, _slient);
        },

        /*
        激活model，发送一次数据
        返回值：false数据为空 */
        activate:function(){
            return false;
        },

        getUserId:function(){
            return CACHE.userId;
        },

        getTableId:function(){
            return CACHE.tableId;
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
                cmds = {"cmd":"game","result":{"action":"in_table_check","gameId":7,"userId":10001,"target":10001,"roomId":0,"tableId":0,"seatId":-1}};
                break;
            };
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        }
    });//end

})();