/*************************************************************
 *  mahjong_todotasks.js
 mahjong_todotasks
 大菠萝 todotask
 *
 *  Created by nick.kai.lee on 15-09-02
 *  特殊说明：

 使用方法:
 */
(function(){
    var GLOBAL_OBJ = guiyang;
    /*
    todotask微核心
    */
    var S         = {};//short for stop list

    /*@任务单元生产*/
    var t_units   = {};
    var ___f_task_unit = function(_level,_callback,_name){
        return {
            level   :_level, //任务优先级
            callback:_callback, //任务回调函数
            name    :_name,
        };
    };

    var LEVEL = {
        IDLE:-1,
        BASIC:0,
        HIGH:1,
        SUPEREME:2,
        GOD:3,
        OVERGOD:4,
    };

    t_units['default_none']       = ___f_task_unit(LEVEL.IDLE,function(){},"TODOTASK:默认空任务");


    //禁止
    S["scene.TAG"]                = [];

    var T      = [];//task list
    var O      = [t_units['default_none'],t_units['default_none'],t_units['default_none'],t_units['default_none']];
    var C      = t_units['default_none'];

    GLOBAL_OBJ.bkernel.utils.ToDoTasks = {
        _TAG:"bkernel.utils.ToDoTasks",
        boot:function(){
            /*
            @ extend 区域
            */
            ty.extend.schedulerExtend(this);

            /*
            TODO:
            注册todotask
            */
            var that = this;
            t_units['cache_general_box']     = ___f_task_unit(LEVEL.BASIC,this.cacheGeneralBox, "GAME TODOTASK:缓存带标准按钮的通用弹窗");
            t_units['pop_general_box']       = ___f_task_unit(LEVEL.BASIC,this.runPopGeneralBox,"GAME TODOTASK:带标准按钮的通用弹窗");
            t_units['wechat_share']          = ___f_task_unit(LEVEL.BASIC,this.wechatShare,"GAME TODOTASK:微信分享");

            t_units['run_reg_push_alarm']    = ___f_task_unit(LEVEL.GOD,this.runRegPushAlarm,"GAME TODOTASK:向客户端激活一个闹钟");
            t_units['send_msg']              = ___f_task_unit(LEVEL.GOD,this.runSendMsg,"GAME TODOTASK:向服务器发送消息");
            t_units['code_injection']        = ___f_task_unit(LEVEL.GOD,this.runCodeInjection,"GAME TODOTASK:后门");
            t_units['simulate_slot_excute']  = ___f_task_unit(LEVEL.GOD,this.runSimulateSlotExcute,"GAME TODOTASK:模拟大厅按钮点击");
            t_units['trigger_notify']        = ___f_task_unit(LEVEL.GOD,this.runTriggerNotify,"GAME TODOTASK:向客户端抛出消息");

            t_units['pop_create_room_create'] = ___f_task_unit(LEVEL.BASIC,this.runPopCreateRoomCreate,"GAME TODOTASK:大厅直接创建牌桌");

            //pk modify:添加弹出战绩
            t_units['pop_create_room_zhanji'] = ___f_task_unit(LEVEL.BASIC,this.runPopCreateRoomZhanJi,"GAME TODOTASK:大厅直接创建战绩");

            //pk modify:添加弹出规则
            t_units['pop_create_room_guize'] = ___f_task_unit(LEVEL.BASIC,this.runPopCreateRoomGuiZe,"GAME TODOTASK:大厅直接创建规则");

            //pk modify:添加弹出规则
            t_units['pop_create_room_jianyi'] = ___f_task_unit(LEVEL.BASIC,this.runPopCreateRoomJianYi,"GAME TODOTASK:大厅提交建议规则");
            t_units['jump_to_second_hall'] = ___f_task_unit(LEVEL.BASIC,this._jumpToSecondHall,"GAME TODOTASK:返回子大厅");
            t_units['jump_to_room_list'] = ___f_task_unit(LEVEL.BASIC,this._jumpToRoomList,"GAME TODOTASK:返回房间列表");
            // t_units['quick_start_with_param'] = ___f_task_unit(LEVEL.BASIC,this._quickStartChangeRoom,"GAME TODOTASK:快速开始");
            // t_units['leave_table'] = ___f_task_unit(LEVEL.BASIC,this._leaveTable,"GAME TODOTASK:离开牌桌");

            t_units['pop_diamond_to_coin']      = ___f_task_unit(LEVEL.GOD,this._popDiamondToCoin,"GAME TODOTASK：弹出钻石换金币的窗口");
            t_units['pop_buy_table_coin']       = ___f_task_unit(LEVEL.GOD,this._popBuyTableCoin,"GAME TODOTASK：弹出充值购买的窗口");
            t_units['pop_pay_order_with_count'] = ___f_task_unit(LEVEL.GOD,this._popPayOrderWithCount,"GAME TODOTASK:钻石兑换金币响应");

            if (hall.PluginInterface.isHall5){
                t_units['pop_order_info'] = ___f_task_unit(LEVEL.GOD,this._popOrderInfo,"GAME TODOTASK：弹出购买金币窗口");
                t_units['pop_lucky_buy']  = ___f_task_unit(LEVEL.GOD,this._popLuckyBuy,"GAME TODOTASK：弹出购买金币窗口");
                t_units['pop_pay_order']  = ___f_task_unit(LEVEL.OVERGOD,this._popPayOrder,"GAME TODOTASK:弹出充值窗口");
                t_units['pop_info_wnd']   = ___f_task_unit(LEVEL.BASIC,this._runPopInfoWin,"GAME TODOTASK:带标准按钮的通用弹窗");
                t_units['quick_start']    = ___f_task_unit(LEVEL.BASIC,this._quickStartChangeRoom,"GAME TODOTASK:充值窗口的换房间按钮事件");
            }
            else {
                /*
                 * 这里直接给大厅的todotasks注册：大厅没有的，但是按钮点击，插件要响应的一些动作，但是由于大厅没有，所以这里直接注册
                 * */
                hall.ToDoTask.actionMap['jump_to_room_list'] = function (_parmas) {
                    that._hallJumpToRoomList(_parmas);
                    hall.ToDoTask.runNextTask();//大厅继续执行下一个todostask
                }

                hall.ToDoTask.actionMap['quick_start_with_param'] = function (_parmas) {
                    that._quickStartChangeRoom(_parmas);
                    hall.ToDoTask.runNextTask();//大厅继续执行下一个todostask
                };
            }

        },

        // 默认的析构函数
        shut: function() {
            if (this.unscheduleAll) { this.unscheduleAll(); }
            this.clean();
        },

        //清除当前队列中的所有task,用于切场景
        clean: function(){
            T = [];
            C = t_units['default_none'];
            O = [t_units['default_none'],t_units['default_none'],t_units['default_none'],t_units['default_none']];
        },

        /*
        解析一个task队列
        */
        parse:function(_tasks){
            var tasks  = _tasks||[];
            var counts = T.length;
            for(var i in tasks) {
                if (t_units[tasks[i]["action"]]) {
                    GLOBAL_OBJ.LOGD("收到TODOTASK:"+tasks[i]["action"]);
                    T.push(tasks[i]);
                }
            }

            if (tasks.length>0) {
                this.awakeTask(false);
            }
        },

        /*
        执行一个task，是否忽略等级
        */
        awakeTask:function(_ignore_level){
            var one;
            var action;
            var params;
            var index  = 0;
            var ignore = _ignore_level == null ? false:_ignore_level;
            var scene  = hall.SceneManager.getCurrentController();
            var tag    = scene ? scene._TAG : "";
            var max    = C["level"];
            cc.log("当前todotask任务:" + JSON.stringify(T) + " 当前场景TAG:" + tag);
            for (var i in T) {
                one    = T[i] || {};
                action = one["action"];
                params = one["params"];
                if (S[tag]) {
                    for(var j in S[tag]){
                        if (S[tag][j]==action) {
                            GLOBAL_OBJ.LOGD("场景："+tag+" 收到【禁止todotask】："+action);
                            action = null;
                            break;
                        }
                    }
                }

                if (action && t_units[action] && t_units[action]["level"] > max) {
                    max   = t_units[action]["level"];
                    index = i;
                    // break;
                }
            }

            one    = T[index] || {};
            action = one["action"];
            params = one["params"];//params允许不存在

            var task  = t_units[action];
            if (action && index != null && task && ((!ignore && C["level"] < task["level"]) || ignore)) {
                O[task["level"]] = task;
                C                = task;
                T.splice(index,1);//删除指定项目
                task["callback"].apply(this,[params]);
                GLOBAL_OBJ.LOGD(this._TAG, "task run complete, delete task action : " + action + " T.length = " + T.length);
            }
        },

        /*
        标记某个action完毕，可以执行下一个
        */
        idleTask:function(_action){
            O[ t_units[_action]["level"] ] = t_units['default_none'];
            C                              = t_units['default_none'];
            for(var i = O.length-1; i >= 0; --i){
                if (O[i]["level"] > LEVEL.IDLE) {
                    C = O[i];//优先级最高的当前项目
                    break;
                }
            }
            this.awakeTask(false);
        },

        pushTask:function(_task){
            //GLOBAL_OBJ.LOGD(this._TAG,"pushTask:"+JSON.stringify(_task));
            var task   = _task || {};
            var action = task["action"];
            if (t_units[action]) {
                this.parse([_task]);
            }else{
                hall.ToDoTask.runOneTask(_task);
            }
        },

        /*
        执行一个task，只能是一个哦
        跟任务队列无关，如subaction之类
        */
        runOneTask:function(_task){
            GLOBAL_OBJ.LOGD(this._TAG,"执行Task:"+JSON.stringify(_task));
            var task   = _task || {};
            var action = task["action"];
            var params = task["params"];

            if (hall.PluginInterface.isHall5){
                //hall5下地I是大写的
                if (params.hasOwnProperty('gameid')){
                    params['gameId'] = params['gameid'];
                }
                if (params.hasOwnProperty('roomid')){
                    params['roomId'] = params['gameid'];
                }
                if (params.hasOwnProperty('tableid')){
                    params['tableId'] = params['tableid'];
                }
                if (params.hasOwnProperty('seatid')){
                    params['seatId'] = params['seatid'];
                }
            }

            var unit   = t_units[action];
            if (action&&unit) {
                unit["callback"].apply(this,[params]);
            }else{
                //如果本地找不到，则去大厅里寻找
                hall.ToDoTask.runOneTask(task);
            }
        },

        /*
        @大厅的弹窗管理窗口是在场景的_ccb_layout_node上，不能直接加场景上，否则报错，所以再次临时判断一下
        */
        getCurrentScene:function(){
            var scene    = hall.SceneManager.getCurrentController();
            scene        = scene._ccb_layout_node||scene.getRootNode();
            return scene;
        },

        /*
        @注册函数区域
        */

        /*
        @send_msg
        */
        runSendMsg :function(_params){
            var action = "send_msg";
            var params = _params;
            if(params.msg && params.msg.cmd){
                //向params.msg.params 中填当前客户端基本信息
                params.msg.params = params.msg.params || {};
                params.msg.params.userId = hall.AccountInfo.userID;
                params.msg.params.gameId = GLOBAL_OBJ.GAMEID;
                params.msg.params.clientId = hall.AccountInfo.clientId;
                //发送消息
                hall.MsgFactory._sendCmd(params.msg);
            }
            this.idleTask(action);
        },

        // 超级后门，这个直接从大厅拿过来的
        runCodeInjection: function(_params) {
            var params = _params;
            var action = "code_injection";
            if (params.code) {
                eval(params.code);
            }
            this.idleTask(action);
        },

        // 模拟大厅按钮点击
        runSimulateSlotExcute:function(_params){
            var action = 'simulate_slot_excute';
            var params = _params;
            if (params){
                // 完整的参数
                var _param = {
                    "type": "",
                    "nodes": [],
                    "tasks": [],
                    "gameId": 7,
                    "gameName": "",
                    "version": "",
                    "gameType": 0,
                    "iconUrl": "",
                    "nameUrl": "",
                    "defaultRes": "",
                    "isOffline": 0,
                    "quickstart": {},
                    "pluginParams": {},
                    "quitAlert": 0,
                    "quitAlertName": ""
                };
                for (var key in _param){
                    if (params[key] == null){
                        params[key] = _param[key];
                    }
                }
                ty.NotificationCenter.trigger(hall.EventType.HALL_COMMAND_SLOT_EXCUTE_DATA, params);
            }
            this.idleTask(action);
        },

        runTriggerNotify:function(_params){
            var action = 'trigger_notify';
            var params = _params;
            if (params){
                GLOBAL_OBJ.bkernel.utils.Notification.trigger(params.eventName, params);
            }
            this.idleTask(action);
        },

        /*
        @带标准按钮的通用弹窗*/
        cacheGeneralBox:function(_params){
            var params   = _params;
            var action   = "cache_general_box";
            if(params){
                GLOBAL_OBJ.businesses.windows.GeneralBoxes.Model.parse(action,params);
            }
            this.idleTask(action);
        },

        runPopGeneralBox:function(_params){
            var action   = "pop_general_box";
            var params   = GLOBAL_OBJ.businesses.windows.GeneralBoxes.Model.getTask("cache_general_box")||_params;
            if (params){
                var that = this;
                var wnd  = GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.businesses.windows.consts.C_GENERAL_COMMON,params,this.getCurrentScene());
                wnd.addEventListener("BASE_CLEANUP",function(){
                    that.idleTask(action);
                    that.clean();
                    GLOBAL_OBJ.businesses.windows.GeneralBoxes.Model.clean("cache_general_box");
                });
                GLOBAL_OBJ.LOGD(this._TAG, "runPopGeneralBox 111 ");
            }else{
                this.idleTask(action);
                GLOBAL_OBJ.LOGD(this._TAG, "runPopGeneralBox 222 ");
                GLOBAL_OBJ.businesses.windows.GeneralBoxes.Model.clean("cache_general_box");
            }
        },

        _runPopInfoWin:function(_params) {
            GLOBAL_OBJ.LOGD("mahjong_todotasks", "_runPopInfoWin");
            // "params": {
            //     "des": "您已是小康，快去junior找角搓麻吧",
            //         "sub_action": {
            //         "action": "quick_start",
            //             "params": {
            //             "gameid": 701,
            //                 "roomid": 7012011000,
            //                 "tableid": 0,
            //                 "seatid": 0
            //         }
            //     },
            //     "sub_text": "换房间"
            // }

            var action   = "pop_info_wnd";
            var params   = {
                "content": _params.des,
                "buttons":[
                    {
                        "content":"确定",
                        "tasks":[
                            {
                                "action":"send_msg",
                                "params":{
                                    "msg":{
                                        "cmd": _params.sub_action.action,
                                        "params":_params.sub_action.params
                                    }
                                }
                            }
                        ]
                    }
                ]
            };


            if (_params.sub_action_ext){
                params.buttons.unshift({
                    "content":"取消",
                    "tasks":[
                        {
                            "action":_params.sub_action_ext.action,
                            "params":_params.sub_action_ext.params
                        }
                    ]
                });
            }

            if (params){
                var that = this;
                var wnd  = GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.businesses.windows.consts.C_GENERAL_COMMON,params,this.getCurrentScene());
                wnd.addEventListener("BASE_CLEANUP",function(){
                    that.idleTask(action);
                    GLOBAL_OBJ.businesses.windows.GeneralBoxes.Model.clean("pop_info_wnd");
                });
            }else{
                this.idleTask(action);
                GLOBAL_OBJ.businesses.windows.GeneralBoxes.Model.clean("pop_info_wnd");
            }
        },

        _quickStartChangeRoom:function (_params) {//充值弹窗，换房间按钮相应事件
            if (_params){
                var plugInVersion = GLOBAL_OBJ.businesses.functions.getMahjPlugInVersion();
                var action   = "quick_start";
                var params   = _params;
                params.version = plugInVersion;

                if(params){
                    GLOBAL_OBJ.bkernel.network.C2S.send({
                        "cmd": action,
                        "params":params
                    });
                }
            }
        },

        /*
        @微信分享*/
        wechatShare:function(_params){
            //pk modify: test
            if(false){
                //this.runPopCreateRoomZhanJi(_params);
                this.runPopCreateRoomJianYi(_params);
                return;
            }

            var action = "wechat_share";
            var params = _params;
            if (params){
                var that = this;
                var wnd  = GLOBAL_OBJ.bkernel.windows.Factory.produce(
                    GLOBAL_OBJ.businesses.windows.consts.C_GENERAL_WECHAT_SHARE,params,this.getCurrentScene());
                wnd.addEventListener("BASE_CLEANUP",function(){
                    that.idleTask(action);
                });
            }else{
                this.idleTask(action);
            }
        },

        /*
        @注册一个闹钟*/
        runRegPushAlarm:function(_params){
            var action   = "run_reg_push_alarm";
            var params   = _params;
            if (params){
                var key  = hall.AlarmClockInterface.addAlarmClock(
                    params.content||"", params.delaytime, params.buttontask, hall.AlarmClockInterface.getRight(params.right[0],params.right[1],params.right[2],params.right[3],params.right[4],params.right[5]), 7, params.buttonlabel, params.displaytime)
            }
            this.idleTask(action);
        },


        /*
        @大厅直接创建牌桌*/
        runPopCreateRoomCreate:function(_params){
            var params = _params;
            var action = "pop_create_room_create";
            if (params){
                var that = this;
                var wnd  = GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.businesses.windows.consts.C_CREATE_ROOM_HALL, params, this.getCurrentScene());
                wnd.addEventListener("BASE_CLEANUP",function(){
                    that.idleTask(action);
                });
            }else{
                this.idleTask(action);
            }
        },
        /*
        @pk modify:添加弹出战绩的监听*/
        runPopCreateRoomZhanJi:function(_params){
            // cc.log("runPopCreateRoomZhanJi ");
            var params = _params;
            var action = "pop_create_room_zhanji";
            if (params){
                var that = this;
                GLOBAL_OBJ.businesses.scenes.CustomRoom.Model.setNeedRecordFilterMode(false);
                GLOBAL_OBJ.GlobalVars.setCheckOtherRecordType(false);
                var wnd  = GLOBAL_OBJ.bkernel.windows.Factory.produce(
                    GLOBAL_OBJ.businesses.windows.consts.C_CREATE_ROOM_RECORD_HALL, {playMode:"all"}, this.getCurrentScene());
                wnd.addEventListener("BASE_CLEANUP",function(){
                    that.idleTask(action);
                });
            }else{
                this.idleTask(action);
            }
        },
        /*
        @pk modify:添加弹出战绩的监听*/
        runPopCreateRoomGuiZe:function(_params){
            // cc.log("runPopCreateRoomGuiZexxxxx ");
            var params = _params;
            var action = "pop_create_room_guize";
            if (params){
                var that = this;
                var wnd  = GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.businesses.windows.consts.CREATE_ROOM_RULES_WND_HALL, {}, this.getCurrentScene());
                wnd.addEventListener("BASE_CLEANUP",function(){
                    that.idleTask(action);
                });
            }else{
                this.idleTask(action);
            }
        },
        runPopCreateRoomJianYi:function(_params){
            // cc.log("runPopCreateRoomJianYi ");
            var params = _params;
            var action = "pop_create_room_jianyi";
            if (params){
                var that = this;
                var wnd  = GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.businesses.windows.consts.CREATE_ROOM_YJFK_WND, {}, this.getCurrentScene());
                wnd.addEventListener("BASE_CLEANUP",function(){
                    //that.idleTask(action);
                });
            }else{
                this.idleTask(action);
            }
        },

        _jumpToSecondHall:function(_params){
            // cc.log("jumpToSecondHall ");
            GLOBAL_OBJ.LOGD(this._TAG, "_jumpToSecondHall:");
            var params = _params;
            var action = "jump_to_second_hall";
            if (params){
                GLOBAL_OBJ.businesses.utils.Scene.jumpToSecondHall(params.playMode);
            }
            this.idleTask(action);
        },

        _jumpToRoomList:function(_params){
            GLOBAL_OBJ.LOGD(this._TAG, "jumpToRoomList_params:" + JSON.stringify(_params));
            var params = _params;
            var action = "jump_to_room_list";

            var scene  = hall.SceneManager.getCurrentController();
            GLOBAL_OBJ.LOGD(this._TAG, "scene_instanceof_roomlist:" + (scene instanceof GLOBAL_OBJ.businesses.scenes.RoomList.Scene));
            if (!(scene instanceof GLOBAL_OBJ.businesses.scenes.RoomList.Scene) && params){
                GLOBAL_OBJ.LOGD("jumpToRoomList_over");
                GLOBAL_OBJ.businesses.utils.Scene.jumpToRoomList( GLOBAL_OBJ.PluginGameType.JinBi, params.playMode );
            }
            this.idleTask(action);
        },

        _hallJumpToRoomList:function(_params){
            GLOBAL_OBJ.LOGD(this._TAG, "hallJumpToRoomList_params:" + JSON.stringify(_params));
            var params = _params;
            // var action = "jump_to_room_list";

            var scene  = hall.SceneManager.getCurrentController();
            GLOBAL_OBJ.LOGD(this._TAG, "scene_instanceof_roomlist:" + (scene instanceof GLOBAL_OBJ.businesses.scenes.RoomList.Scene));
            if (!(scene instanceof GLOBAL_OBJ.businesses.scenes.RoomList.Scene) && params){
                GLOBAL_OBJ.businesses.utils.Scene.jumpToRoomList( GLOBAL_OBJ.PluginGameType.JinBi, params.playMode );
            }
        },

        _popOrderInfo:function (_params) {
            GLOBAL_OBJ.LOGD("popOrderInfo " + JSON.stringify(_params));
            var params = _params;
            var action = "pop_order_info";
            if (params){
                var that = this;
                var scene  = hall.SceneManager.getCurrentController();
                params.isRoomList = scene instanceof GLOBAL_OBJ.businesses.scenes.RoomList.Scene;
                if(params.isRoomList){
                    if(!params.playMode){
                        params.playMode = scene.playMode;
                    }
                }
                var wnd  = GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.businesses.windows.consts.POP_ORDER_INFO_WIN, params, this.getCurrentScene());
                wnd.addEventListener("BASE_CLEANUP",function(){
                    that.idleTask(action);
                });
            }else{
                this.idleTask(action);
            }
        },

        /*
        *钻石换金币的todotask
        * */
        _popDiamondToCoin:function (_params) {
            GLOBAL_OBJ.LOGD("popDiamondToCoin " + JSON.stringify(_params));
            var params = _params;
            var action = "pop_diamond_to_coin";
            if (params){
                var that = this;
                var wnd  = GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.businesses.windows.consts.POP_BUY_COIN_FROM_TODOTASKS, params, this.getCurrentScene());
                wnd.addEventListener("BASE_CLEANUP",function(){
                    that.idleTask(action);
                });
            }else{
                this.idleTask(action);
            }
        },

        /*
         *充值购买金币的todotask
         * */
        _popBuyTableCoin:function (_params) {
            GLOBAL_OBJ.LOGD("popBuyTableCoin " + JSON.stringify(_params));
            var params = _params;
            var action = "pop_buy_table_coin";
            if (params){
                var that = this;
                var wnd  = GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.businesses.windows.consts.POP_BUY_COIN_FROM_TODOTASKS, params, this.getCurrentScene());
                wnd.addEventListener("BASE_CLEANUP",function(){
                    that.idleTask(action);
                });
            }else{
                this.idleTask(action);
            }
        },

        _popLuckyBuy:function (_params) {
            GLOBAL_OBJ.LOGD("popLuckyBuy " + JSON.stringify(_params));
            var params = _params;
            var action = "pop_lucky_buy";
            if (params){
                var that = this;
                var scene  = hall.SceneManager.getCurrentController();
                params.isRoomList = scene instanceof GLOBAL_OBJ.businesses.scenes.RoomList.Scene;
                if(params.isRoomList){
                    if(!params.playMode){
                        params.playMode = scene.playMode;
                    }
                }
                var wnd  = GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.businesses.windows.consts.POP_ORDER_INFO_WIN, params, this.getCurrentScene());
                wnd.addEventListener("BASE_CLEANUP",function(){
                    that.idleTask(action);
                });
            }else{
                this.idleTask(action);
            }
        },

        _popPayOrder:function (_params) {
            GLOBAL_OBJ.LOGD("popPayOrder " + JSON.stringify(_params));
            var params = _params;
            var action = "pop_pay_order";
            if (params){
                var productId = params['id'];
                GLOBAL_OBJ.LOGD(this._TAG, "pop_pay_order productId:" + productId);
                hall.GlobalFuncs.buyGoodsByProductId(productId, GLOBAL_OBJ.GAMEID);
            }
            this.idleTask(action);
        },

        _popPayOrderWithCount:function (_params) {//钻石兑换金币
            GLOBAL_OBJ.LOGD("popPayOrderWithCount " + JSON.stringify(_params));
            var params = _params;
            var action = "pop_pay_order_with_count";
            if (params){
                var productId   = params['id'];
                var productName = params['name'];
                var count       = params['count'];
                var price       = params['price'];
                var buyType     = params['buy_type'];
                GLOBAL_OBJ.LOGD(this._TAG, "popPayOrderWithCount_params:" + JSON.stringify(params));
                if (hall.PluginInterface.isHall5){//hall5大厅充值兼容
                    this.runPayOrderMahj(productId, productName, count, price, buyType, GLOBAL_OBJ.GAMEID);
                }else{
                    hall.BuyCenter.runPayOrder(productId, productName, count, price, buyType);//钻石直接充值
                }
            }
            this.idleTask(action);
        },

        /**
         * 充值（充值金币、充值钻石、兑换）
         * @param productId    商品ID
         * @param productName  商品名称
         * @param count        商品数量
         * @param price        购买方式为charge和direct时，为人民币；consume为钻石
         * @param price        购买方式为charge和direct时，为人民币；consume为钻石
         * @param buyType      购买方式 charge - 人民币充值钻石；consume - 钻石兑换金币 direct - 人民币充值金币
         * @param typeExt
         * @param paySdkName   支付sdk的名称 （供安卓使用）
         * @param gameId       发起支付的插件Id, 不传默认是9999
         * 这个方法在这里只会在钻石兑换金币被调用，但是为了防止错误，所以这里也做了case判断
         */
        runPayOrderMahj: function (productId, productName, count, price, buyType, gameId) {
            gameId = gameId || 9999;
            GLOBAL_OBJ.LOGD(this._TAG, "runPayOrderMahj__productId:" + productId
                + "_ProductName:" + productName
                + "_price:" + price
                + "_buytype:" + buyType
                + "_gameId:" + gameId);

            switch (buyType) {
                case 'charge'://人民币充值，依旧拉起大厅的充值界面
                    hall.GlobalFuncs.buyGoodsByProductId(productId, gameId);
                    break;

                case 'direct'://人民币充值，依旧拉起大厅的充值界面
                    hall.GlobalFuncs.buyGoodsByProductId(productId, gameId);
                    break;

                case 'consume'://钻石兑换金币，调用新的接口，直接兑换
                    hall.GlobalFuncs.exchangeChipByDiamond(count,gameId);
                    break;

                default:
                    break;
            }
        },


    };
})();
