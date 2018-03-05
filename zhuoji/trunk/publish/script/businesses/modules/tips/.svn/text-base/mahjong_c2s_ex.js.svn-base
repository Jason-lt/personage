/*****************************************
 *  mahjong_c2s_ex.js
    tips系统C2S扩展
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-02-22
 *  特殊说明：

    使用说明:

 */
(function(){
    var GLOBAL_OBJ = guiyang;
    /*@
    请求大转盘tip信息*/
    GLOBAL_OBJ.businesses.network.C2S.requestLuckyWheelTipInfo = function(){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd"   : GLOBAL_OBJ.businesses.network.EventType.USER,
            "params": {
                "action" :"get_lucky_raffle_tips",
            }
        });
    };

    /*@
    请求拜雀神tip信息*/
    GLOBAL_OBJ.businesses.network.C2S.requestTableRaffleTipInfo = function(){
        GLOBAL_OBJ.bkernel.network.C2S.send({
            "cmd"   : GLOBAL_OBJ.businesses.network.EventType.USER,
            "params": {
                "action" :"get_table_raffle_tips",
            }
        });
    };
})();