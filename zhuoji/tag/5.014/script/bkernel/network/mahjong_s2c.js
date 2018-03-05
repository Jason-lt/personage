/*****************************************
 *  mahjong_s2c.js
    S2C
 *  mahjong
 *
 *  Created by nick.kai.lee on 15-12-29
 *  特殊说明：
    受框架限制，重写netMsgDispatcher的processMsg方法
    使用说明:

 */
(function(){
    var GLOBAL_OBJ = guiyang;
	var ORIGIN_FUNC = ty.netMsgDispatcher.processMsg;
    
	GLOBAL_OBJ.bkernel.network.S2C = {
		_TAG:"bkernel.network.S2C",
        listeners:{},
		boot:function(){
            var that = this;

            /*
            @重写netDispatcher的方法
            这个习惯特别不好，直接覆盖框架的接口，非常危险！！！！
            */
            ty.netMsgDispatcher.processMsg = function(){
                ORIGIN_FUNC.apply(this,arguments);
                var cmd  = arguments[0];
                var data = arguments[1];//arguments由cmd&cmd+result构成
                cc.log("\n"+that._TAG+"RECEIVE CMD Response:"+JSON.stringify(data));

                var message = data[0];
                if (typeof(message) == 'undefined') {
                    GLOBAL_OBJ.LOGD(this._TAG, 'not valide message...');
                    return;
                }

                if (typeof(message['result']) == 'undefined'){
                    GLOBAL_OBJ.LOGE(this._TAG, 'not valid message, no result/gameId data, do not process');
                    return;
                }

                var gameId = message['result']['gameId'] || 0;
                if (gameId != GLOBAL_OBJ.GAMEID){
                    // 不是自己游戏的消息不处理
                    GLOBAL_OBJ.LOGD(this._TAG, 'not message of this game, do not process...');
                    return;
                }

                if(message.error && message.error.code) {
                    GLOBAL_OBJ.LOGD('TAG', 'quick_start error code:' + message.error.code + ' info:' + message.error.info);
                    ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                        text : message.error.info,
                        duration : 2
                    });
                }

                for(var tag in that.listeners){
                    var lsn = that.listeners[tag];
                    lsn.callback.apply(lsn.scope,[cmd, message["result"]]||{});
                }
            };

            GLOBAL_OBJ.LOGD(this._TAG,"MODULE LOAD");
        },

        shut:function(){
            ty.netMsgDispatcher.processMsg = ORIGIN_FUNC || function(msg, argArr){
                ty.netMsgDispatcher.dispatcher.trigger(msg, argArr);
            };
            this.listeners = {};
            GLOBAL_OBJ.LOGD(this._TAG,"MODULE UNLOAD");
        },

        hook:function(_tag,_callback,_object){
            this.listeners[_tag] = {scope:_object,callback:_callback};
        },

        unhook:function(_tag){
            this.listeners[_tag] = {};
        },
	};
})();