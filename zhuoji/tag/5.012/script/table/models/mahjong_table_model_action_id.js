/*****************************************
 *  mahjong_table_model_action.js
    (action_id)牌桌相关model
 *  mahjong
 *
 *  Created by zengxx on 16-06-30
 *  
    协议说明：
    
    {
        "cmd": "custom_action_id",
        "result": {
            "action_id":10,
            "gameId":7
        }
    }
    这是客户端自己模拟发送的，主要用来处理pass，也给所有需要用到action_id的地方提供统一接口

    使用说明:
    这可以说是一个假model，接收的是客户端自己模拟服务器发的协议

 */

guiyang.table.models.ActionId = (function(){
    var GLOBAL_OBJ = guiyang;

    /*
    私有数据+接口
    TODO:
    数据的原型，存储以及通知的抛出
    */

    /* @数据缓存*/
    var CACHE           = {};
    var PROTOTYPE       = GLOBAL_OBJ.table.models.Prototype;
    
    /* @私有属性 */

    /* @共享属性 */
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_ACTION_ID);

    /* @数据通知*/
    var ___f_notificate = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        }
        
        var data = _data;
        PROTOTYPE.parse(_object, CACHE, data);


        if (!_slient){
        }
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.ActionId",

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
        test:function(){
            var cmds = {"cmd":"custom_action_id", "result":{"action_id":10, "gameId":7}};
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        }
    });
})();