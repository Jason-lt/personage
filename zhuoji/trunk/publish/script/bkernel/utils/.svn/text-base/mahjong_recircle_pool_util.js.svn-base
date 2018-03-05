/*****************************************
 *  mahjong_recircle_pool_util.js
    麻将复用，麻将池
 *  mahjong

 *  Created by lcr on 17-09-05
 *  特殊说明：
    1. 麻将池管理类
 */

(function(){
    var GLOBAL_OBJ = guiyang;

    var ClsMahjPool = cc.Class.extend({
        _TAG : 'recircle_pool_util',
        ctor:function () {
            this.unuse = [];
        },
        checkInUnuse:function (mahj) {
            return this.unuse.indexOf(mahj) > -1;
        },
        addMahj:function (mahj) {
            GLOBAL_OBJ.LOGD(this._TAG, "addMahj: tileId " + mahj.tileId + "; unuse.lenght : " + this.unuse.length);
            this.unuse.push(mahj);
        },
        getMahj:function (_seatId) {

            var seatId;
            if(_seatId != null && _seatId == 0){
                seatId = 0;
            }else{
                seatId = 2;
            }
            var mahj = null;
            // for (var i in this.unuse) {
            //     mahj = this.unuse[i];
            //     if (seatId == 0){
            //         if (mahj._TAG == "table.scenes.Table.Mahjong.Mahj.Own")
            //         {
            //             this.unuse.splice(i,1);
            //             break;
            //         }
            //     }
            //     else{
            //         this.unuse.splice(i,1);
            //         break;
            //     }
            // }
            var ti = -1;
            if (seatId == 0){
                for (var mi = 0; mi < this.unuse.length; mi++){
                    if (this.unuse[mi]._TAG == "table.scenes.Table.Mahjong.Mahj.Own"){
                        ti = mi;
                        break;
                    }
                }
                if (ti > -1){
                    GLOBAL_OBJ.LOGD(this._TAG, "重复利用了一个，本家麻将");
                    mahj = this.unuse.splice(ti,1)[0];
                    GLOBAL_OBJ.LOGD(this._TAG, "原花色为" + mahj.getTile());
                }

            }else{
                for (var mi = 0; mi < this.unuse.length; mi++){
                    if (this.unuse[mi]._TAG == "table.scenes.Table.Mahjong.Mahj"){
                        ti = mi;
                        break;
                    }
                }
                if (ti > -1){
                    GLOBAL_OBJ.LOGD(this._TAG, "重复利用了一个其他家麻将");
                    mahj = this.unuse.splice(ti,1)[0];
                    GLOBAL_OBJ.LOGD(this._TAG, "原花色为" + mahj.getTile());
                }
            }

            if (mahj){
                GLOBAL_OBJ.LOGD(this._TAG, "getMahj: tileId " + mahj.tileId + "; unuse.lenght : " + this.unuse.length);
            }

            return mahj;
        },
        destroy:function () {
            if (this.unuse){
                var mahj;
                for (var i in this.unuse){
                    mahj = this.unuse[i];
                    mahj.destroy();
                }

                this.unuse.length = 0;
            }
        }
    });

    GLOBAL_OBJ.mahjPool = new ClsMahjPool();

})();