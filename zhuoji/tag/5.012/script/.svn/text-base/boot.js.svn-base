/**
 * Author   dp
 * Date     15-7-20
 * Time     下午8:28
 * Desc     麻将插件入口
 */

(function(){
    var GLOBAL_OBJ = guiyang;
    var TAG = 'boot';
        
    /**
     * 加载ccbi。bin文件
     */
    GLOBAL_OBJ.initCCBIPack = function() {
        var fm = ty.FileManager;
        var innerPath = 'games/' + GLOBAL_OBJ.GAMENAME + '/ccbi/' + GLOBAL_OBJ.GAMENAME + '_ccbi_pack.bin';
        var downloadPath = jsb.fileUtils.getWritablePath() + innerPath;

        // 先检查下载路径
        if (fm.checkFileExist(downloadPath)) {
            ty.Util.readCCBIPackFile(downloadPath);
        } else if(fm.checkFileExist(innerPath)) { // 如果没有则检查本地路径
            ty.Util.readCCBIPackFile(innerPath);
        } else {
            GLOBAL_OBJ.LOGD(TAG, 'load ccbi pack failed:  ' + innerPath);
        }
    };

    GLOBAL_OBJ.Interface = hall.HallInterface.extend({
        _TAG                    : "guiyang.Interface",
        _oldController          : null,
        _enterData              : null,

        //返回游戏命名空间名
        //游戏唯一标示,一个名字对应一个游戏,在加载资源和进入游戏时做判断用
        nameSpace:function(){
            return GLOBAL_OBJ.GAMENAME;
        },

        //初始化逻辑,只执行一次
        init:function(){
            GLOBAL_OBJ.LOGD(this._TAG, "guiyang.Interface init " );
            // 初始化全局变量
            GLOBAL_OBJ.GlobalVars.init(true);
        },


        /** 获取入口场景Controller
         *  根据enterData 返回入口场景
         *  {"enterData":{"type":"game","pluginParams":{},"isOffline":0,"defaultRes":"MaJiangDefault"}}

         {
            "enterData": {
                "type": "game",             // 告诉插件做什么
                "pluginParams": {},         // 透传参数
                "isOffline": 0,
                "defaultRes": "MaJiangDefault" // 大厅显示用
            }
         }

        type:
            quickstart - 快速开始
            roomlist - 房间列表
            game - 二级子大厅

        1，quickstart
        1.1 游戏内快速开始
        {
            "type":"quickstart",
            "pluginParams": {}
        }
        1.2 指定玩法快速开始
        {
            "type":"quickstart",
            "pluginParams": {
                "playMode": "kawuxing"       // 玩法卡五星
            }
        }

        2，roomlist
        2.1 自建桌建房
        {
            "type": "roomlist"
                "pluginParams": { 
                  "gameType": 10,             // 自建桌
                  "create_play_modes": [      // 自建桌玩法列表
                     "baicheng"
                   ],
                  "tasks": [
                     {
                         "action": "pop_create_room_create",
                          "params": {
                              "hasRobot": 0
                          }
                     }
                   ]
              }
           }
        
        2.2 金币场
        {
            "type":"roomlist",
            "pluginParams": {
                "gameType" : 1,              // 金币场
                "playMode": "kawuxing"       // 玩法卡五星
            }
        }

        2.3 单机
        {
            "type":"roomlist",
            "pluginParams": {
                "gameType": 8               // 单机场
                "playMode": "kawuxing"      // 玩法卡五星
            }
        }

        3，game
        3.1 进入自建桌
        {
            "type":"game",
            "pluginParams": {
                "gameType": 11,         // 进入自建桌
                "ftId": ftId            // 自建桌ID
            }
        }
        3.2 进入二级子大厅
        {
            "type":"game",
            "pluginParams": {
                "playMode": "zhuoji"
            }
        }


        gameType:
            1 - 金币场
            5 - 比赛
            8 - 单机场
            10 - 自建桌建房
            11 - 自建桌进桌

         */
        enter:function(oldController, enterData){
            GLOBAL_OBJ.LOGI(TAG, " enterScene: " + JSON.stringify(enterData));
            if (!enterData.enterData){
                if (enterData.hasOwnProperty('enter_param')){
                    enterData.enterData = enterData.enter_param ;
                    enterData.enterData.gameType = enterData.params.gameType;
                    delete enterData['params'];
                }
                else{
                    enterData.enterData = enterData.params ;
                }

                enterData.enterData.type = enterData.type;

                //兼容5.1大厅配置
            }

            var params = enterData.enterData.pluginParams;
            GLOBAL_OBJ.initCCBIPack();//release模式下要读取ccb的bin文件，不然读不到ccb

            if (params && params.tasks) {
                GLOBAL_OBJ.LOGD(this._TAG,"进入时候有task");
                // 在大厅弹出一些和具体麻将游戏无关的窗体
                GLOBAL_OBJ.businesses.boot(); // 启动环境
                this.createTable(params.create_play_modes,params.tasks);
                // 现在进入大厅时会暂停音乐
                GLOBAL_OBJ.bkernel.utils.Audio.music(GLOBAL_OBJ.RES.UI_HALL_BACKGROUND_MUSIC_MP3, true);

            }else{
                GLOBAL_OBJ.LOGD(this._TAG,"进入时 GLOBAL_OBJ.GAMEID = " + GLOBAL_OBJ.GAMEID);
                // 非单机
                this._oldController = oldController;
                this._enterData     = enterData;
                this.registerEvents();
                hall.MsgFactory.bindGame(GLOBAL_OBJ.GAMEID);
            }
        },

        createTable:function(create_play_modes,tasks){
            GLOBAL_OBJ.GlobalVars.setCreatePlayModes(create_play_modes || []);
            GLOBAL_OBJ.bkernel.utils.ToDoTasks.parse(tasks);
            hall.PluginInterface.enterGameFaled()
        },

        //加载游戏资源
        loadRes:function(){
            GLOBAL_OBJ.LOGI(TAG, " loadRes");
            var that = this;
            hall.PluginInterface.loadGameResDone(that);

            // cc.director.setDisplayStats(false);
        },

        //释放游戏资源,
        //调用该方法前,大厅会释放所有未使用资源.
        //游戏只需要在这里释放手动管理的资源.
        //所以,如果游戏没有手动管理资源的话,不需要实现该方法.
        releaseRes:function(){
            GLOBAL_OBJ.LOGD(this._TAG,"releaseRes");
        },

        registerEvents: function () {
            GLOBAL_OBJ.LOGD(this._TAG," registerEvents ");
            ty.NotificationCenter.listen(hall.EventType.UPDATE_GAME_DATA, this.onGameData, this);
            ty.NotificationCenter.listen(hall.EventType.UPDATE_HALL_INFO, this.onHallInfo, this);
            ty.NotificationCenter.listen(hall.EventType.HALL_LOAD_DEFAULT_GAME_TIP_DESTORY, this.onHallTipDestroy, this);
        },

        removeEvents: function () {
            GLOBAL_OBJ.LOGD(this._TAG," removeEvents ");
            ty.NotificationCenter.ignore(hall.EventType.UPDATE_GAME_DATA, this.onGameData, this);
            ty.NotificationCenter.ignore(hall.EventType.UPDATE_HALL_INFO, this.onHallInfo, this);
            ty.NotificationCenter.ignore(hall.EventType.HALL_LOAD_DEFAULT_GAME_TIP_DESTORY, this.onHallTipDestroy, this);
        },

        onTableQuickStart:function(tcpResponse) {
            ty.NotificationCenter.ignore(hall.EventType.MSG_TABLE_QUICKSTART, this.onTableQuickStart, this);
            GLOBAL_OBJ.LOGD(this._TAG," onTableQuickStart ");
            var message = tcpResponse[0];
            if(message.error && message.error.code) {
                GLOBAL_OBJ.LOGD('TAG', 'quick_start error code:' + message.error.code + ' info:' + message.error.info);
                hall.PluginInterface.enterGameFaled();
            }
            else {
                GLOBAL_OBJ.LOGD(this._TAG,"quick_start ok...");
            }
        },

        onGameData: function () {
            GLOBAL_OBJ.LOGD(this._TAG, "onGameData");
            hall.MsgFactory.getHallInfo(GLOBAL_OBJ.GAMEID);
        },

        onHallInfo: function (json) {
            GLOBAL_OBJ.LOGD(this._TAG, "onHallInfo " + JSON.stringify(json));
            if( hall.GlobalFuncs.checkMsgWithGameId(json, GLOBAL_OBJ.GAMEID) )
            {
                this.removeEvents();
                this.mj_enterGameUI();
            }
        },

        /**
         *  支持三种进入方式
         */
        mj_enterGameUI: function() {

            GLOBAL_OBJ.LOGD(this._TAG,"mj_enterGameUI begin this._enterData = " + JSON.stringify(this._enterData));
            var enterParser = new hall.EnterDataParse();
            enterParser.parseEnterData(this._enterData);
            if (!enterParser.isValid()) {
                ty.alert('plugin enterData format err, please check!!!!');
                return;
            }

            GLOBAL_OBJ.businesses.functions.loadPreRes();
            
            var params = this._enterData.enterData;

            GLOBAL_OBJ.GlobalVars.setEnterType(params.type);
            GLOBAL_OBJ.businesses.boot();

            var getType   = enterParser.getType();
            var gameType = enterParser.getParams().gameType;

            var playMode, tableId ,roomId;

            if(getType == hall.Enums.GAMESLOT.QUICKSTART) {

                GLOBAL_OBJ.LOGD(this._TAG, "enter mj by quickstart:" + JSON.stringify(params));

                // NOTICE 断线重连回来，决定是在什么玩法下继续
                playMode = "";
                if (params.pluginParams && params.pluginParams.playMode){
                    playMode = params.pluginParams.playMode;
                }
                if (params && typeof(params.playMode)) {
                    playMode = params.playMode;
                }
                GLOBAL_OBJ.GlobalVars.setAsPlugin(false);

                GLOBAL_OBJ.bkernel.utils.Audio.music(GLOBAL_OBJ.RES.UI_HALL_BACKGROUND_MUSIC_MP3, true);

                if (!hall.PluginInterface.isHall5){
                    roomId  = (params.pluginParams && params.pluginParams.roomId) ? params.pluginParams.roomId : -1;
                    tableId = (params.pluginParams && params.pluginParams.tableId) ? params.pluginParams.tableId : -1;
                }
                else{
                    roomId  = params.roomId ? params.roomId : -1;
                    tableId = params.tableId ? params.tableId : -1;
                }

                hall.ToDoTask.clearTasks();
                hall.PluginInterface.getCurrentSceneController().destroy(false);

                //大厅场景需要手动释放。。。。。
                GLOBAL_OBJ.businesses.network.C2S.requestGameStart(playMode, roomId, tableId);
            }
            else if(getType == hall.Enums.GAMESLOT.ROOMLIST){

                // 进入房间列表或者比赛列表
                GLOBAL_OBJ.LOGD(this._TAG, "enter mj by roomlist: " + JSON.stringify(params));
                GLOBAL_OBJ.bkernel.utils.Audio.music(GLOBAL_OBJ.RES.UI_HALL_BACKGROUND_MUSIC_MP3, true);

                if (gameType == GLOBAL_OBJ.PluginGameType.JinBi || gameType == GLOBAL_OBJ.PluginGameType.Match){
                    //金币，比赛
                    //大厅场景需要手动释放。。。。。
                    playMode = params.pluginParams.playMode || "";

                    hall.ToDoTask.clearTasks();
                    hall.PluginInterface.getCurrentSceneController().destroy(false);

                    GLOBAL_OBJ.businesses.utils.Scene.jumpToRoomList( gameType, playMode );
                    GLOBAL_OBJ.GlobalVars.setAsPlugin(false);
                }
            }
            else if(getType == hall.Enums.GAMESLOT.GAME){

                if (gameType == GLOBAL_OBJ.PluginGameType.Create){

                    //支持非tasks创建牌桌
                    var task = {
                        "action": "pop_create_room_create",
                        "params": {
                            "hasRobot": 0
                        }
                    };

                    var create_play_modes = params.pluginParams.create_play_mode || [];
                    this.createTable(create_play_modes, [task]);

                }else if(gameType == GLOBAL_OBJ.PluginGameType.Enter) {

                    // 自建桌进入牌桌 modified by jiashiyang
                    var getPars = enterParser.getParams();
                    tableId = getPars.ftId;
                    if (!tableId && getPars.hasOwnProperty('pluginParams')){
                        tableId = getPars.pluginParams.ftId;
                    }
                    GLOBAL_OBJ.LOGD(this._TAG, "Enter tableId :" + tableId);
                    if (tableId){
                        GLOBAL_OBJ.businesses.network.C2S.requestJoinCustomRoom(tableId);
                        ty.NotificationCenter.listen(hall.EventType.MSG_TABLE_QUICKSTART, this.onTableQuickStart, this);
                    }
                }
                else {
                    playMode = params.pluginParams.playMode || "";

                    // 进入插件游戏二级子大厅
                    // GLOBAL_OBJ.businesses.utils.Scene.jumpToSecondHall(playMode);
                    // 金币场房间列表
                    GLOBAL_OBJ.businesses.utils.Scene.jumpToRoomList(GLOBAL_OBJ.PluginGameType.JinBi, playMode);
                    GLOBAL_OBJ.GlobalVars.setAsPlugin(true);

                    hall.AudioHelper.playMusic(GLOBAL_OBJ.RES.UI_HALL_BACKGROUND_MUSIC_MP3, true);
                }
            }
            // 不支持的插件进入类型
            else{
                GLOBAL_OBJ.LOGD(this._TAG, "enter mj by none: " + JSON.stringify(params));
            }
        },

        onHallTipDestroy: function () {
            GLOBAL_OBJ.LOGD(this._TAG, "onHallTipDestroy");
            this.removeEvents();
        },

        backHall: function (oldController, backParams) {
            GLOBAL_OBJ.LOGD(this._TAG, " backHall");

            //删除插件在启动时，添加到缓存中的大图
            GLOBAL_OBJ.businesses.functions.unLoadPreRes();

            if (!hall.PluginInterface.isHall5){
                //老大厅下，退出插件，恢复原始设计分辨率
                var screenSize = cc.view.getFrameSize();
                if(screenSize.height / screenSize.width  == 0.75){
                    ty.Util.setDesignResolutionSize(960, 640, 'kResolutionFixedHeight');
                }
            }
            
            if (hall.MsgFactory.leaveGame) {
                hall.MsgFactory.leaveGame(GLOBAL_OBJ.GAMEID);
            }

            hall.PluginInterface.backHall(oldController, backParams);
            GLOBAL_OBJ.businesses.shut();
        }
    });

    /**
     * 资源加载器，暂时没用到，以后看效果，如果切换效果不如意就加上相关资源的加载
     */
    GLOBAL_OBJ.ResLoader = cc.Class.extend({

        ctor:function(allDoneCallback){
            this.allDoneCallback = allDoneCallback;
        },

        // 加载需要预先加载的图片
        loadAllImagesAsync:function () {
            GLOBAL_OBJ.LOGD(this._TAG,"loadAllImagesAsync");
        },

        allLoadedCallback:function () {
            GLOBAL_OBJ.LOGD('Loading', 'Loading step three result - load image done....');
            if (this.allDoneCallback) {
                this.allDoneCallback();
            }
        }
    });

    GLOBAL_OBJ.interface = new GLOBAL_OBJ.Interface();
    //end
})();
