/*****************************************
 *  mahjong_log.js
    log
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-01-06
 *  特殊说明：
    tuyoo框架中，debug和release的log开启受内测工具控制，所以这里只留接口标准
    使用说明:

 */
(function(){
    var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.bkernel.env.Log = {
		_TAG:"bkernel.env.Log",
        /*@ DEBUG 下才打印*/
		D:function(_object,_content){
            GLOBAL_OBJ.LOGD(_object._TAG||"UNKNOWN OBJECT", _content);
        },

        /*@ RELEASE 下也打印*/
        R:function(_object,_content){
            GLOBAL_OBJ.LOGD(_object._TAG||"UNKNOWN OBJECT", _content);
        },

        /*@ 错误log， 什么情况下都打印*/
        E:function(_object,_content){
            GLOBAL_OBJ.LOGD(_object._TAG||"UNKNOWN OBJECT", _content);
        },
	};
})();