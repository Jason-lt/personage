/*****************************************
 *  mahjong_time_sync_model.js
    同步服务器时间戳model
 *  mahjong
 *
 *  Created by zengxx on 16-05-12
 *  特殊说明：
    1.数据存储不直接暴露出去
    2.要什么功能提供什么接口函数，外部view不参与数据处理，完全放权给model
    使用说明:

 */
(function () {
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.businesses.modules.TimeSync.Model = (function(){
        /*
         @数据缓存*/
        var CACHE        = {
        };

        return {
            _TAG:"businesses.modules.TimeSync.Model",
            parse:function(_data){
                var data   = _data;
                var action = data["action"] || "";

                switch(action){
                    case "mj_timestamp":
                        this.parseTimeStamp(data);
                        break;
                    default:
                        break;
                };
            },

            /*
             激活model，发送一次数据
             返回值：false数据为空
             */
            activate:function(){
            },

            /*
             以下接口都是私有接口
             TODO:
             实现数据的组装&通知的抛出
             */
            parseTimeStamp:function(_data){
                var data = _data;
                if (!data){
                    return;
                };

                if (_data.current_ts != null){
                    GLOBAL_OBJ.bkernel.utils.GlobalTimer.setTime(_data.current_ts);
                };
            },
        };
    })();
})();