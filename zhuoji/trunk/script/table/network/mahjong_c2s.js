/*****************************************
 *  mahjong_c2s.js
    C2S 雏形 给模块进行扩展
 *  mahjong
 *
 *  Created by zengxx on 16-06-07
 *  特殊说明：

    使用说明:

 */
(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;

    var C2S = GLOBAL_OBJ.bkernel.network.C2S;
	GLOBAL_OBJ.table.network.C2S = {
		_TAG:"table.network.C2S",
		boot:function() {
        },

        shut:function() {
        },

        send:function(_json) {
            var json = _json;
            // 填充统一的三个元素
            json.params.seatId  = null == json.params.seatId ? GLOBAL_OBJ.table.models.TableInfo.getActiveServerSeatId() : json.params.seatId;
            json.params.roomId  = null == json.params.roomId ? GLOBAL_OBJ.table.models.TableInfo.getRoomId() : json.params.roomId;
            json.params.tableId = null == json.params.tableId ? GLOBAL_OBJ.table.models.TableInfo.getTableId() : json.params.tableId;

            GLOBAL_OBJ.LOGD('send msg in GLOBAL_OBJ.table.network.C2S :', JSON.stringify(json));
            GLOBAL_OBJ.bkernel.network.C2S.send(json);
        }
	};
})();