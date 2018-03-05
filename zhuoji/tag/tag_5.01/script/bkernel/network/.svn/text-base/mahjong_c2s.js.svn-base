/*****************************************
 *  mahjong_c2s.js
    C2S
 *  mahjong
 *
 *  Created by nick.kai.lee on 15-12-26
 *  特殊说明：

    使用说明:

 */
(function(){
    var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.bkernel.network.C2S = {
		_TAG:"bkernel.network.C2S",
		boot:function() {
            GLOBAL_OBJ.LOGD(this._TAG,"MODULE LOAD");
        },

        shut:function() {
            GLOBAL_OBJ.LOGD(this._TAG,"MODULE UNLOAD");
        },

        /*
        @SEND消息
        */
        send:function(_json){
            hall.GlobalFuncs.checkNet();
            if (false==GLOBAL_OBJ.bkernel.network.C2SFrequency.check(_json)){
                // GLOBAL_OBJ.LOGD(this._TAG,"本次请求被挂起销毁");
                return ;
            };
            var json             = _json;
            //@补足3元素
            json.params.gameId   = GLOBAL_OBJ.GAMEID;
            json.params.userId   = hall.AccountInfo.userID;
            json.params.clientId = hall.AccountInfo.clientId;

            var data             = JSON.stringify(json) + '\r\n';
            GLOBAL_OBJ.LOGD(this._TAG, 'send msg in GLOBAL_OBJ.bkernel.C2S :' + data);
            ty.TCPConnection.sendMsg(data);
        },
	};
})();