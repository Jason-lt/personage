/*****************************************
 *  mahjong_voice_talking_model.js
    任务系统model
 *  mahjong
 *
 *  Created by zengxx on 16-08-11
 *  特殊说明：
    1.数据存储不直接暴露出去
    2.要什么功能提供什么接口函数，外部view不参与数据处理，完全放权给model
    使用说明:

 */
(function () {
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.businesses.windows.VoiceTalking.Model = (function(){
        /*
         @数据缓存*/
        var CACHE      = {
            list:[]   // 所有音频数据列表 [{},{}]
        };

        return {
            _TAG:'GLOBAL_OBJ.businesses.windows.VoiceTalking.Model',

            parse:function(_data){
                var data = _data;
                if (data == null){
                    return ;
                }

                this.parseTableChat(data);
            },

            /*
             激活model，发送一次数据
             返回值：false数据为空
             */
            activate:function(){
                GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_VOICE_TALKING_INFO,{});
            },

            /*
             以下接口都是私有接口
             TODO:
             实现数据的组装&通知的抛出
             */
            parseTableChat:function(_data){
                // {"cmd":"table_chat","params":{"roomId":78061001,"tableId":780610010200,"seatId":0,"isFace":0,"msg":{"seatId":0,"type":0,"content":"sfskfslkjfksjfksdjfkdsjfsff"},"gameId":7,"userId":10121,"clientId":"IOS_3.781_tuyoo.appStore,weixinPay,alipay.0-hall7.appStore.youlescmj"}}
                // {"cmd":"table_chat","result":{"userId":10121,"gameId":7,"msg":{"seatId":0,"type":0,"content":"**skfslkjfksjfksdjfkdsjf**f"},"isFace":0}}
                var data = _data;
                if (data['msg'] && data['msg']['type'] == 3){
                    CACHE.list.push({
                        name:data['msg']['name'],
                        audioData:data['msg']['audioData'],
                        time:data['msg']['time']
                    });
                }

                GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_VOICE_TALKING_INFO,{});
            },

            /*
             外部获取数据接口
             */

            /*
             @ 获取当前应该播放的音频信息
             音频按先来先播放的顺序，所以每次调用，都返回第一条数据，并将其清空
             */
            getMsg:function(){
                if (CACHE.list.length > 0){
                    return CACHE.list.shift();
                }
                return null;
            }
        };
    })();
})();
