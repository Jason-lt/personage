/*****************************************
 *  mahjong_c2s_ex.js
    抽奖记录C2S扩展
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-02-16
 *  特殊说明：

    使用说明:

 */
(function(){
    var GLOBAL_OBJ = guiyang;
    /*@
    请求大转盘抽奖记录信息*/
    GLOBAL_OBJ.businesses.network.C2S.requestLuckyWheelRecordInfo = function(){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd"   : GLOBAL_OBJ.businesses.network.EventType.USER,
            "params": {
                "action" :"get_lucky_raffle_records",
            }
        });
    };

    /*@
    请求拜雀神抽奖记录信息*/
    GLOBAL_OBJ.businesses.network.C2S.requestTableRaffleRecordInfo = function(){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd"   : GLOBAL_OBJ.businesses.network.EventType.USER,
            "params": {
                "action" :"get_table_raffle_records",
            }
        });
    };
})();