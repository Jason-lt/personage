/*****************************************
 *  mahjong_c2s_ex.js
    同步服务器时间戳C2S扩展
 *  mahjong
 *
 *  Created by zengxx on 16-05-12
 *  特殊说明：

    使用说明:

 */
(function(){
    var GLOBAL_OBJ = guiyang;
    /*@
    请求服务器时间戳*/
    GLOBAL_OBJ.businesses.network.C2S.requestTimeStamp = function(){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd"   : GLOBAL_OBJ.businesses.network.EventType.USER,
            "params": {
                "action" :"mj_timestamp",
            }
        });
    };
})();