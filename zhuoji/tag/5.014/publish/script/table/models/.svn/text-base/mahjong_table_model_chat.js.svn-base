/*****************************************
 *  mahjong_table_model_chat.js
    牌桌聊天model
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-07-04
 *  
    协议说明：

    使用说明:

 */

guiyang.table.models.Chat = (function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;
    
    /*
    私有数据+接口
    TODO:
    数据的原型，存储以及通知的抛出
    */

    /* @数据缓存*/
    var CACHE             = {};
    var PROTOTYPE         = GLOBAL_OBJ.table.models.Prototype;

    /* @私有属性 */
    PROTOTYPE.setPrivateProperty(CACHE, "msg", [], "聊天消息队列");
    PROTOTYPE.setPrivateProperty(CACHE, "type", 0, "聊天类型");
    PROTOTYPE.setPrivateProperty(CACHE, "activeSeatId", -1, "聊天发起方服务端座位号");
    PROTOTYPE.setPrivateProperty(CACHE, "passiveSeatId", -1, "聊天接收方服务端座位号");
    PROTOTYPE.setPrivateProperty(CACHE, "emojiId", 0, "互动表情id");
    PROTOTYPE.setPrivateProperty(CACHE, "emoId", 0, "表情id");

    /* @共享属性 */

    /* @数据通知*/
    var ___f_notificate = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        }
        
        CACHE.type              = _data.msg.type;

        //文字
        if (CACHE.type == 0) {
            CACHE.msg.push({userId: _data.userId, seatId: _data.msg.seatId, content: _data.msg.content});
            //只保留固定条数记录
            if (CACHE.msg.length>GLOBAL_OBJ.table.global.CHATRECORDS) {
                CACHE.msg.splice(0,1);
            };    
            CACHE.activeSeatId  = _data.msg.seatId;
        //自我表情
        }else if (CACHE.type == 1) {
            CACHE.activeSeatId  = _data.msg.seatId;
            CACHE.emoId         = parseInt(_data.msg.content);
        //互相撇鸡蛋 
        }else if (CACHE.type == 2) {
            CACHE.activeSeatId  = _data.msg.seatId;
            CACHE.passiveSeatId = _data.msg.targetSeatId;
            CACHE.emojiId       = _data.msg.emoId;
        };

        // GLOBAL_OBJ.LOGD("model_chat_data:", JSON.stringify(_data));
        
        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_CHAT, {});
        }
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.Chat",

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

        getType:function(){
            return CACHE.type;
        },

        /* 获得聊天记录长度 */
        getChatRecordsCount:function(){
            return CACHE.msg.length;
        },

        /* 获得聊天记录内容 根据索引 from 0 */
        getChatRecordsContentByIndex:function(_index){
            var data =  CACHE.msg[_index] || {};
            return data.content||"";
        },

        /* 获得聊天记录userId 根据索引 from 0 */
        getChatRecordsUidByIndex:function(_index){
            var data =  CACHE.msg[_index] || {};
            return data.userId;
        },
        
        /* 获得聊天记录seatId 根据索引 from 0 */
        getChatRecordsSidByIndex:function(_index){
            var data =  CACHE.msg[_index] || {};
            return data.seatId;
        },

        // 聊天发起方本地座位号
        getPassiveLocalSeatId:function(){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.passiveSeatId );
        },

        // 聊天接收方本地座位号
        getActiveLocalSeatId:function(){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.activeSeatId );
        },
        
        getEmoId:function(){
            return CACHE.emoId;
        },
        
        // 获得互动表情id
        getEmojiId:function(){
            return CACHE.emojiId;
        },
        /*
        测试用例
        TODO:
        model测试用例
        */
        test:function(_index){
            switch(_index){
                case 0://普通聊天
                var cmds = {"cmd":"table_chat","result":{"userId":10014,"gameId":7,"msg":{"seatId":0,"type":0,"content":"sdfsdfdsfsfsdf"},"isFace":0}}
                break;
                case 1://普通聊天
                var cmds = {"cmd":"table_chat","result":{"userId":10014,"gameId":7,"msg":{"seatId":1,"type":0,"content":"sdfsdfdsfsfsdf"},"isFace":0}}
                break;
                case 2://互动表情
                var cmds = {"cmd":"table_chat","result":{"userId":10001,"gameId":7,"msg":{"seatId":1,"type":2,"emoId":0,"targetSeatId":0},"isFace":0}}
                break;
                case 3://普通聊天
                var cmds = {"cmd":"table_chat","result":{"userId":10014,"gameId":7,"msg":{"seatId":0,"type":1,"content":"0"},"isFace":0}}
                break;
                case 4://普通聊天
                var cmds = {"cmd":"table_chat","result":{"userId":10014,"gameId":7,"msg":{"seatId":1,"type":1,"content":"5"},"isFace":0}}
                break;
            };
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        }
    });
})();