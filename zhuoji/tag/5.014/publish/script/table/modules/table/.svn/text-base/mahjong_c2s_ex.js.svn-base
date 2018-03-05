/*****************************************
 *  mahjong_c2s_ex.js
    module C2S扩展
 *  mahjong
 *
 *  Created by zengxx on 16-06-15
 *  特殊说明：

    使用说明:

 */
(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.network.C2S.requestTableCallTing = function(_model, _tingInfo){
		GLOBAL_OBJ.table.network.C2S.send({
            "cmd": "table_call",
            "params": {
                "action":"ting",
                "action_id":_model.getActionId(),
                "ting_infos":_tingInfo
            }
        });
	};
    // 抢听
    GLOBAL_OBJ.table.network.C2S.requestTableCallGrab = function(_model, _pattern ,_type){
        //根据类型组装协议
        var _data=null;

        var _c2sData={
            "cmd": "table_call",
            "params": {
                "action":"grabTing",
                "action_id":_model.getActionId(),
                "tile":_model.getTile()
            }
        };
        
        if(_type=="chow"){
            _c2sData.params.chi=_pattern;
        }else if(_type=="pong"){
            _c2sData.params.peng=_pattern;

        }else if(_type=="kong"){
            _c2sData.params.gang={
                "style":1,
                "pattern":_pattern
            }
        }

        // GLOBAL_OBJ.LOGD("requestTableCallGrab","_c2sData : "+JSON.stringify(_c2sData));
        GLOBAL_OBJ.table.network.C2S.send(_c2sData);
    };
    // 抢 胡 杠
    GLOBAL_OBJ.table.network.C2S.requestTableCallGrabHuKong = function(_model, _tile){
        var _c2sData={
            "cmd": "table_call",
            "params": {
                "action":"grabHuGang",
                "action_id":_model.getActionId(),
                "tile":_tile
            }
        };
        // GLOBAL_OBJ.LOGD("requestTableCallGrabHuKong","_c2sData : "+JSON.stringify(_c2sData));
        GLOBAL_OBJ.table.network.C2S.send(_c2sData);
    };

    /**
     * 智能提示消息
     * @param _model
     */
    GLOBAL_OBJ.table.network.C2S.requestTableCallAI = function(_model){
        var _c2sData={
            "cmd": "table_call",
            "params": {
                "action":"smart_operate",
                "action_id":_model.getActionId()
            }
        };
        // GLOBAL_OBJ.LOGD("requestTableCallGrabHuKong","_c2sData : "+JSON.stringify(_c2sData));
        GLOBAL_OBJ.table.network.C2S.send(_c2sData);
    };
})();