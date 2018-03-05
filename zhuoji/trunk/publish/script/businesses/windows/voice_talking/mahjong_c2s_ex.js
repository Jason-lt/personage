/*****************************************
 *  mahjong_c2s_ex.js
    语音聊天C2S扩展
 *  mahjong
 *
 *  Created by zengxx on 16-08-12
 *  特殊说明：

    使用说明:

 */
(function(){
    var GLOBAL_OBJ = guiyang;
    /*
    @ 语音数据,走table_chat
    */
    GLOBAL_OBJ.businesses.network.C2S.requestVoiceTalking = function(_roomId, _tableId, _seatId, _name, _audioData, _time){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd":"table_chat",
            "params":{
                "roomId":_roomId,
                "tableId":_tableId,
                "seatId":_seatId,
                "isFace":0,
                "msg":{"seatId":_seatId,"type":3,"name":_name,"audioData":_audioData,"time":_time}
            }
        })
    };
})();