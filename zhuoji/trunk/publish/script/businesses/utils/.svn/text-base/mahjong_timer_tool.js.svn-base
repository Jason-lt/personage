/*************************************************************
 *  mahjong_timer_tool.js
 *  Created by simon on 18-01-23
 *  特殊说明：
    计算函数执行时间，分析性能
 *  使用方法:
 *  在需要添加记录的函数首尾添加:
    GLOBAL_OBJ.businesses.utils.Timer.start("mahjong_table_module.js", "onRecvTableInfo");
    GLOBAL_OBJ.businesses.utils.Timer.stop("mahjong_table_module.js", "onRecvTableInfo");
    在需要保存log的地方添加:
    GLOBAL_OBJ.businesses.utils.Timer.saveLog();
 */

(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;
    var debug = GLOBAL_OBJ.businesses.global.DEBUG;

    GLOBAL_OBJ.businesses.utils.Timer = {
        totalData : {},
        data : {},

        start:function(file, funcName){
            if (!debug) {
                return;
            }

            var key = file+"_"+funcName;
            var found = this.totalData[key];
            if (typeof found === "undefined") {
                this.totalData[key] = {
                    max: 0,
                    min: 1000,
                    avg: 0,
                    count: 0,
                    array:[]
                };
            }
            this.data[key] = new Date();
        },

        stop:function(file, funcName){
            if (!debug) {
                return;
            }

            var key = file+"_"+funcName;
            var sec, total, i, sum = 0, num;
            var time = this.data[key];
            if(time) {
                sec = new Date() - time;
                this.data[key] = sec;
                GLOBAL_OBJ.LOGD(key, "run_time = "+sec);

                total = this.totalData[key];
                total.array.push(sec);
                total.count = total.array.length;
                total.max = total.max > sec ? total.max : sec;
                total.min = total.min <= sec ? total.min : sec;
                for (i = 0; i < total.count; i++) {
                    sum += total.array[i];
                }
                num = parseFloat(sum/total.count);
                total.avg = num.toFixed(2);
            }
        },

        getTime:function(file, funcName){
            if (!debug) {
                return;
            }

            var key = file+"_"+funcName;
            return this.data[key];
        },

        saveLog:function () {
            if (!debug) {
                return;
            }
            
            var curDate = new Date();
            var day     = curDate.getFullYear() + '_' + (curDate.getMonth() + 1) + '_' + curDate.getDate();
            var curTime = curDate.toLocaleTimeString() + curDate.getSeconds();
            var path    = jsb.fileUtils.getWritablePath()+"MJ_TIMER_LOG/";

            curTime     = curTime.replace("/","_");
            curTime     = curTime.replace(":","_");
            var name    = day + '_'+ curTime + ".js"
            var replay_file  = path + name;
            ty.FileManager.createFile(replay_file);
            var str;

            for(var i in this.totalData ){
                str = JSON.stringify({ KEY: i, DATA: this.totalData[i]});
                str += '\n';
                ty.FileManager.writeFile(replay_file, str, true);
            };
            GLOBAL_OBJ.LOGD("执行时间日志保存成功! "+replay_file);
        }
    };
	
})();