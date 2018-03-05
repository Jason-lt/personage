/*****************************************
 *  mahjong_c2s_ex.js
    table C2S扩展
 *  mahjong
 *
 *  Created by zengxx on 16-06-16
 *  特殊说明：

    使用说明:

 */
(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;
    // 出牌
    GLOBAL_OBJ.table.network.C2S.requestTableCallDiscard = function(_model, _tile, _isTing, key){
        GLOBAL_OBJ.table.network.C2S.send({
            "cmd": "table_call",
            "params": {
                "action":"play",
                "action_id":_model.getActionId(),
                "tile":_tile,
                "ting":_isTing ? _isTing : -1,
                "key":key
            }
        });
    };

    // 吃牌
	GLOBAL_OBJ.table.network.C2S.requestTableCallChow = function(_model, _pattern){
		GLOBAL_OBJ.table.network.C2S.send({
            "cmd": "table_call",
            "params": {
                "action":"chi",
                "action_id":_model.getActionId(),
                "tile":_model.getTile(),
                "pattern":_pattern
            }
        });
	};

    // 碰牌
    GLOBAL_OBJ.table.network.C2S.requestTableCallPong = function(_model, _pattern){
        var _c2sData={
            "cmd": "table_call",
            "params": {
                "action":"peng",
                "action_id":_model.getActionId(),
                "tile":_model.getTile(),
                "pattern":_pattern
            }
        };
        // GLOBAL_OBJ.LOGD("requestTableCallPong","_c2sData : "+JSON.stringify(_c2sData));
        GLOBAL_OBJ.table.network.C2S.send(_c2sData);
    };

    // 杠牌 _kong 包含 pattern
    GLOBAL_OBJ.table.network.C2S.requestTableCallKong = function(_model, _kong){
        GLOBAL_OBJ.table.network.C2S.send({
            "cmd": "table_call",
            "params": {
                "action":"gang",
                "action_id":_model.getActionId(),
                "tile":_model.getTile(),
                "gang":_kong
            }
        });
    };

    // 过牌
    GLOBAL_OBJ.table.network.C2S.requestTableCallPass = function(_model){
        GLOBAL_OBJ.table.network.C2S.send({
            "cmd": "table_call",
            "params": {
                "action":"pass",
                "action_id":_model.getActionId(),
                "style":-1
            }
        });

        // 老麻将中加的
        var cmds = {"cmd":"custom_action_id", "result":{"action_id":_model.getActionId(), "gameId":7}};
        ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
    };

    // 胡
    GLOBAL_OBJ.table.network.C2S.requestTableCallWin = function(_model){
        GLOBAL_OBJ.table.network.C2S.send({
            "cmd": "table_call",
            "params": {
                "action":"win",
                "action_id":_model.getActionId(),
                "tile":_model.getTile()
            }
        });
    };

    // 取消托管
    GLOBAL_OBJ.table.network.C2S.requestTableRemoveTrustee = function(){
        GLOBAL_OBJ.table.network.C2S.send({
            "cmd": "table_call",
            "params": {
                "action":"remove_trustee"
            }
        });
    };

    // 离开牌桌
    GLOBAL_OBJ.table.network.C2S.requestTableLeave = function(_roomId, _tableId, _seatId){
        GLOBAL_OBJ.table.network.C2S.send({
            "cmd": "table_call",
            "params": {
                "action":"leave",
                "style":-1,
                "roomId":_roomId,
                "tableId":_tableId,
                "seatId":_seatId
            }
        });
    };

    GLOBAL_OBJ.table.network.C2S.requestInTableCheck = function( _userId ){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": "game",
            "params": {
                "action":"in_table_check",
                "target":_userId,
            }
        });
    };

    // 牌桌聊天
    GLOBAL_OBJ.table.network.C2S.requestTableChat   = function(_roomId, _tableId, _seatId, _type, _content){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": "table_chat",
            "params": {
                "roomId" :_roomId,
                "tableId":_tableId,
                "seatId" :_seatId,
                "isFace" :0,
                "msg":{"seatId":_seatId,"type":_type,"content":_content}
            }
        });
    };

    // 回应服务器，充值结果
    GLOBAL_OBJ.table.network.C2S.requestTableCharge = function(_model, _data)
    {
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd": "table_call",
            "params":{
                "action" : "charge",
                "seatId": _data.seatId,// 待充值的座位号
                "action_id":_model.getActionId(),
                "result": _data.result, // 1 充值；-1 不充值
                "roomId" : _data.roomId,
                "tableId": _data.tableId,
            }
        });
    };

    // 用户报听
    GLOBAL_OBJ.table.network.C2S.requestTableAskTing = function (_model, _type, _tile) {

        var type = _type || _model.getTingType();

        var msg = {
            "cmd": "table_call",
            "params": {
                "action": "ting",
                "actionId":_model.getActionId(),
                "type": type,
            }
        };

        if (_tile) {
            msg.params.tileOut = _tile;
        }

        GLOBAL_OBJ.table.network.C2S.send(msg);
    };

    // 定缺
    GLOBAL_OBJ.table.network.C2S.requestTableAbsence = function (data) {

        var msg = {
            "cmd": "table_call",
            "params": {
                "action": "ding_absence",
                "color": data.color  // 0, 1, 2 代表万筒条
            }
        };

        GLOBAL_OBJ.table.network.C2S.send(msg);
    };

})();