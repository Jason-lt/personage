/*****************************************
 *  mahjong_module.js
    麻将 麻将牌模块
 *  mahjong

 *  Created by nick.kai.lee on 16-07-27
 *  特殊说明：

    使用说明:
    
 */

(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;

    var mahjPool = GLOBAL_OBJ.mahjPool;
    /*
    @麻将牌管理模块*/
    GLOBAL_OBJ.table.modules.Mahjong = {
        _TAG:"table.modules.Mahjong",
        boot:function(){
            GLOBAL_OBJ.LOGD(this._TAG,"Mahjong MODULE BOOT");
        },

        shut:function(){
            GLOBAL_OBJ.LOGD(this._TAG,"Mahjong MODULE UNLOAD");
            mahjPool.destroy();
        },

        /*
        @生产一张麻将牌 */
        produce:function( _tile , seatId){

            GLOBAL_OBJ.LOGD(this._TAG, "生产一张麻将牌 : " + _tile + ";");
            var mahj = mahjPool.getMahj(seatId);
            if (!mahj){
                if (arguments.length == 2 && seatId == 0){
                    mahj = new GLOBAL_OBJ.table.scenes.Table.Mahjong.Mahj.Own(_tile);
                }
                else{
                    mahj = new GLOBAL_OBJ.table.scenes.Table.Mahjong.Mahj(_tile);
                }
            }else{
                mahj.recoverNotification();
            }
            mahj.setTile(_tile);
            return mahj;
        },

        /*
         @向麻将牌的弃牌池中添加麻将牌 */
        pushMjToPool:function( _mj ){
            GLOBAL_OBJ.LOGD("pushMjToPool_mj:", _mj.getTile());
            if (!mahjPool.checkInUnuse(_mj)) {
                // if (_mj.getRootNode().parent){
                //     _mj.getRootNode().retain();
                //     _mj.getRootNode().removeFromParent(false);
                // }
                mahjPool.addMahj(_mj);
            }
        }
    };
})();