/*****************************************
 *  mahjong_upload_game_msg_model.js
    
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-09-21
 * 

 */
(function () {
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.table.Test.UploadGameMsg.Model = (function(){
        /*
         私有数据+接口
         TODO:
         数据的原型，存储以及通知的抛出
         */

        /* @数据缓存*/
        var CACHE           = {
            name:""
        };

        /* @数据通知*/
        var ___f_notificate = function(_object, _data, _slient){
            if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
                return _slient;
            }

            var data = _data;

            CACHE.name = data.name;

            if (!_slient){
                GLOBAL_OBJ.bkernel.utils.Notification.trigger( "debug_upload_msg", data);
            }
            return _slient;
        };

        return {
            _TAG:"table.Test.UploadGameMsg.Model",

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

                if (data.action != "debug_upload_msg") {
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
                var cmds = {"cmd":"game", "result":{"action":"debug_upload_msg", "name":"ok","gameId":7}};
                ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
            }
        };
    })();
})();
