/*******************************************************
 *  mahjong_global_timer.js
    全局定时器
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-01-03
 *  特殊说明：
    暂时没有服务器时间同步

    使用说明:
 */

(function(){
    var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.bkernel.utils.GlobalTimer = {
		_TAG:"bkernel.utils.GlobalTimer",
        boot:function(){
            var that  = this;
            this.task = {};
            this.time = Math.floor((new Date()).getTime()/1000);
            /*
            @事件代理
            */
            ty.extend.schedulerExtend(this);

            var tickCt = 0;

            this.schedule("GLOBAL_TIME",function(){
                if (tickCt >= 10){
                    tickCt = 0;
                    GLOBAL_OBJ.businesses.network.C2S.requestTimeStamp();
                }
                tickCt++;

                that.update();
            }, 1);
            GLOBAL_OBJ.LOGD(this._TAG,"MODULE LOAD");
        },

        shut:function(){
            if (this.unscheduleAll) { this.unscheduleAll(); };
            GLOBAL_OBJ.LOGD(this._TAG,"MODULE UNLOAD");
        },

        /*
        设置超时
        */
        set:function(_timeout, _callback, _object){
            var time = this.time+_timeout;
            var tag  = _object._TAG?_object._TAG:_object;
            cc.log(tag+"注册一个闹钟:"+time);
            this.task[time] = this.task[time] || [];
            this.task[time].push({
                callback : _callback||function(){},
                guest    : _object,
            });
            return time;
        },

        /*
        清理超时(全部清理)
        */
        clean:function(_object){
            var that = this;
            var tag  = _object._TAG?_object._TAG:_object;
            for(var time in this.task){
                if (null==this.task[time]) {continue;};
                this.task[time] = this.task[time].filter(function(f){
                    var ret = f.guest!=_object;
                    if (!ret) {//log 释放的事件
                        GLOBAL_OBJ.LOGD(tag+": 释放闹钟！");
                    };
                    return ret;
                });
            };
        },

        getTime:function(){
            return this.time;
        },

        // 设置当前时间戳，主要用来同步服务器时间戳
        setTime:function(_ts){
            var that = this;
            this.time = _ts || Math.floor((new Date()).getTime()/1000);
        },

        /*
        私有api
        */
        update:function(){
            // GLOBAL_OBJ.LOGD(this._TAG, "GlobalTimer Tick start");
            for(var time in this.task){
                if (time<=this.time) {
                    var object = this.task[time] || [];
                    var tag    = object._TAG?object._TAG:object;
                    for(var i in object){
                        GLOBAL_OBJ.LOGD(this._TAG, tag+": 激活闹钟！");
                        object[i].callback.call(object[i].guest);
                    }
                    this.task[time] = null;//通知完毕 干掉
                }
            }

            // GLOBAL_OBJ.LOGD(this._TAG, "GlobalTimer loop end");

            //全局time通知
            GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.bkernel.Events.TICK,{ time: this.time });
            ++this.time;
            // GLOBAL_OBJ.LOGD(this._TAG, "GlobalTimer Tick end");
        }
	};
})();