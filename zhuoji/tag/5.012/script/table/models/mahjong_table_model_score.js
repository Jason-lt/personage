/*****************************************
 *  mahjong_table_model_score.js
    地方牌桌 玩家积分 相关model
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-11-16
 *  
    协议说明：
{
    "cmd": "score",
    "result": {
        "tableId": 71050210010200,
        "gameId": 710,
        "roomId": 7105021001,
        "score": [
            -1,
            4,
            -2,
            -1
        ],
        "delta": [
            -1,
            3,
            -1,
            -1
        ]
    }
}

    使用说明:

 */

guiyang.table.models.Score = (function(){
    var GLOBAL_OBJ = guiyang;
    
    /*
    私有数据+接口
    TODO:
    数据的原型，存储以及通知的抛出
    */

    /* @数据缓存*/
    var CACHE                   = {};
    var PROTOTYPE               = GLOBAL_OBJ.table.models.Prototype;

    /* @私有属性 */
    PROTOTYPE.setPrivateProperty(CACHE, "score",  {}, "玩家实时积分");
    /* @共享属性 */
    
    /* @数据通知*/
    var ___f_notificate         = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        }
        
        var data                = _data;
        var score               = data.score || [];
        CACHE.score             = {};


        var sid,i,uid;

        for(i = 0 ; i < score.length; ++i){
            sid             = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( i );
            uid             = GLOBAL_OBJ.table.models.TableInfo.getPlayer( sid );
            CACHE.score[uid]    = score[i];
        }


        var tableCoin               = data.tableCoin || [];
        CACHE.tableCoin             = {};

        for(i = 0 ; i < tableCoin.length; ++i){
            sid             = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( i );
            uid             = GLOBAL_OBJ.table.models.TableInfo.getPlayer( sid );
            CACHE.tableCoin[uid]    = tableCoin[i];
        }
        
        PROTOTYPE.parse(_object, CACHE, data);

        if (!_slient){
            // GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_SCORE, data);
        }
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.Score",

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
            }
            return ___f_notificate(this, data, _slient);
        },

        /*
        激活model，发送一次数据
        返回值：false数据为空 */
        activate:function(){
            // GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_SCORE, {});
            return false;
        },

        getUserId:function(_sid){
            return GLOBAL_OBJ.table.models.TableInfo.getPlayer( _sid );
        },

        getScore:function(_uid){
            return CACHE.score[_uid] || 0;
        },

        getTableCoin:function(_uid){
            return CACHE.tableCoin[_uid] || 0;
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
                cmds = {"cmd":"score","result":{ "score":[1,2,3,4], "delta":[-1,3,-1,-1] }};
                break;
            }
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        }
    });
})();