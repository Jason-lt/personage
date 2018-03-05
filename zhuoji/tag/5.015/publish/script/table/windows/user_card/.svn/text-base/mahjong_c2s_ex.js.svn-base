/*****************************************
 *  mahjong_c2s_ex.js
    table C2S扩展
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-09-10
 *  特殊说明：
    {"cmd":"table_chat","params":{"gameId":7,"clientId":"IOS_3.735_tyGuest,tyAccount.appStore,weixin,alipay.0-hall7.appStore.sichuan","userId":10005,"roomId":71041001,"tableId":710410010200,"seatId":0,"isFace":0,"msg":{"seatId":0,"type":2,"emoId":0,"targetSeatId":3}}}
    使用说明:

 */
(function(){
    var GLOBAL_OBJ = guiyang;
    // 发送互动表情
    GLOBAL_OBJ.table.network.C2S.requestSendEmoji = function(_roomId, _tableId, _from, _to, _emojId){
        GLOBAL_OBJ.table.network.C2S.send({
            "cmd": "table_chat",
            "params": {
                "roomId":_roomId,
                "tableId":_tableId,
                "seatId":_from,
                "isFace":0,
                "msg":{
                    "seatId":_from,"type":2,"emoId":_emojId,"targetSeatId":_to
                }
            }
        });
    };
})();