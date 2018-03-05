/*****************************************
 *  mahjong_game_plugin_remind_model.js
 *
 *  Created by xujing on 18-01-19
 *  
    协议说明：

    使用说明:

 {
    "cmd":"game",
    "result":{
        "enter_param":{
            "type":"game",
            "pluginParams":{
                "playMode":"xuezhan"
            }
        },
        "name":"大众麻将",
        "userId":10078,
        "gameId":702,
        "action":"get_exit_plugin_remind",
        "tips":"去您最喜欢的疯狂麻将玩一玩儿吧"
    }
}

 */
(function () {
    var GLOBAL_OBJ = guiyang;

    GLOBAL_OBJ.businesses.modules.Game.PluginRemindModel = {
        _TAG:"businesses.modules.Game.PluginRemindModel",

        CACHE:null,

        /*
         私有接口
         TODO:
         内部调用
         */
        parse:function(_data){
            GLOBAL_OBJ.LOGD(this._TAG, "parse");
            this.CACHE = _data;
        },
        /**
         * 获取缓存数据
         * @returns {sichuan.Game.modules.businesses.PluginRemindModel.CACHE|{}}
         */
        getCache:function () {
            return this.CACHE;
        },

        doClean:function () {
            GLOBAL_OBJ.LOGD(this._TAG, "doClean");
            this.CACHE = null;
        }
    };
})();