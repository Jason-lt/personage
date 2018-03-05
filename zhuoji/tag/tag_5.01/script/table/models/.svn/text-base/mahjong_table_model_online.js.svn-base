/*****************************************
 *  mahjong_table_model_online.js
    (碰牌)牌桌相关model
 *  mahjong
 *
 *  Created by nick.kai.lee on 17-01-12
 *  
    协议说明：
    
    {"cmd":"user_online_info","result":{"roomId":7200041001,"gameId":720,"tableId":72000410010200,
    "online_info":[{"seatId":0,"userId":10074,"online":1}]}} 

    使用说明:

 */

guiyang.table.models.Online = (function(){
    var GLOBAL_OBJ = guiyang;
    
    /*
    私有数据+接口
    TODO:
    数据的原型，存储以及通知的抛出
    */

    /* @数据缓存*/
    var CACHE             = {}
    var PROTOTYPE         = GLOBAL_OBJ.table.models.Prototype;

    /* @私有属性 */
    PROTOTYPE.setPrivateProperty(CACHE, "info", [], "离线状态");

    /* @共享属性 */

    /* @数据通知*/
    var ___f_notificate = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        }
        
        var data            = _data;
        CACHE.info          = data.online_info;
        
        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);
        
        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_OFFLINE, data);
        }
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.Online",

        /*
        公有数据+接口
        TODO:
        外部调用
        */
        /* 协议解析*/
        parse:function(_data, _slient){
            var data = _data;
            if (!data){
                return;  
            };
            return ___f_notificate(this, data, _slient);
        },

        /*
        激活model，发送一次数据
        返回值：false数据为空 */
        activate:function(){
            return false;
        },

        checkIsLeaved:function(_localSeatId){
            var info = CACHE.info;
            var isHaveSeatId = true;//默认这次离开，离线消息中，这个人已经离线了，如果有这个人的seatId，才进行后面的判断
            for(var j = 0; j < info.length; ++j){
                if(GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(info[j].seatId) == _localSeatId){
                    isHaveSeatId = false;
                }
            }
            return isHaveSeatId;
        },

        checkIfOnline:function(_localSeatId){
            var info = CACHE.info;
            var ret  = true;
            for(var i = 0; i < info.length; ++i){
                if (GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(info[i].seatId) == _localSeatId && info[i].online == 0) {
                    ret = false;
                    break;
                }
            }

            return ret;
        },

        /**
         *  检查是否已经离开
         * @param _localSeatId 坐位号
         * @returns {boolean} 是否已经离开
         */
        checkIfLeft:function(_localSeatId){
            var info = CACHE.info;
            var ret  = true;
            for(var i = 0; i < info.length; ++i){
                if (GLOBAL_OBJ.table.utils.Seat.toLocalSeatId(info[i].seatId) == _localSeatId && info[i].state == 1) {
                    ret = false;
                    break;
                }
            }

            return ret;
        },
        
        /*
        测试用例
        TODO:
        model测试用例
        */
        test:function(_index){
            var cmds = {};
            switch (_index){
                case 0:
                cmds = {"cmd":"user_online_info","result":{"roomId":7200041001,"gameId":720,"tableId":72000410010200,
                            "online_info":[{"seatId":0,"userId":10074,"online":0}]}};
                break;
            };
            cmds.result.gameId = GLOBAL_OBJ.GAMEID;
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        }
    });
})();