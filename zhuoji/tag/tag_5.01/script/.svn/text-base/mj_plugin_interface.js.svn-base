/**
 * Author   WYF
 * Date     14-10-20
 * Time     下午8:28
 * Desc     麻将插件接口
 */
(function(){
    var GLOBAL_OBJ = guiyang;
    var TAG = 'mj_plugin_interface';
    
    GLOBAL_OBJ.PluginInterface = {
        /**
         * 成员变量
         */
        _hallInterface          : null,         // 大厅接口
        _isResourcePreLoaded    : false,        // 资源是否已经预加载
        _quickStartRequestTime  : null,         // 快速开始请求的时刻
        _quickStartSuccessTime  : null,         // 快速开始成功的时刻

        /**
         * 启动，只执行一次
         */
        start:function()
        {
            // 管理外部场景
            GLOBAL_OBJ.SceneManager.getExternalCurrentSceneController = function()
            {
                return hall.PluginInterface.getCurrentSceneController();
            };

            // 大厅事件
            ty.NotificationCenter.listen(hall.EventType.MJ_TRANS_TABLE, this.onHallEvtEnterTable, this);
            ty.NotificationCenter.listen(hall.EventType.HALL_EXCUTE_DEFAULT_GAME_QUICK_START, this.onHallEvtQuickStart, this);
            ty.NotificationCenter.listen(hall.EventType.HALL_LOAD_DEFAULT_GAME_RESOURCE, this.onHallEvtLoadResource, this);
            ty.NotificationCenter.listen(hall.EventType.HALL_ENTER_PLUGIN_GAME, this.onHallEvtEnterOtherPlugin, this);
            ty.NotificationCenter.listen(hall.EventType.UPDATE_UER_INFO, this.onHallEvtUpdateUserInfo, this);
            ty.NotificationCenter.listen(hall.EventType.MSG_ON_LOC, this.onHallEvtHandleLocation, this);
        },

        /**
         * 初始化，每次进入插件都执行
         * @returns {boolean}
         */
        init:function()
        {
            // 先销毁
            this.destroy();

            this._hallInterface = hall.PluginInterface;

            // Account
            this.updateAccount();
            GLOBAL_OBJ.GlobalTips.destroy();
            GLOBAL_OBJ.GlobalTips.init();
            // UserInfo
            this.updateUserInfo();

            // 请求开始不检查金币
            GLOBAL_OBJ.gConsoleRemote.enableCheckChip(false);

            // 音乐音效设置
            // GLOBAL_OBJ.UserDefault.shareUserDefault().setMusicStatus(!this._hallInterface.isMusicMute());
            // GLOBAL_OBJ.UserDefault.shareUserDefault().setEffectStatus(!this._hallInterface.isEffectsMute());

            // 游戏事件
            GLOBAL_OBJ.EventCenter.addEventListener(GLOBAL_OBJ.EventType.EVT_CUR_SCENE_CONTROLLER_CHANGE, this.onEvtCurrentSceneControllerChange, this, 0);
            GLOBAL_OBJ.EventCenter.addEventListener(GLOBAL_OBJ.EventType.EVT_RUN_HALL_SCENE, this.onEvtRunHallScene, this, 0);
            GLOBAL_OBJ.EventCenter.addEventListener(GLOBAL_OBJ.EventType.EVT_RETURN_HALL_SCENE, this.onRemoveEvent, this, 0);
            GLOBAL_OBJ.EventCenter.addEventListener(GLOBAL_OBJ.EventType.EVT_RUN_SHOP_SCENE, this.onEvtRunShopScene, this, 0);
            GLOBAL_OBJ.EventCenter.addEventListener(GLOBAL_OBJ.EventType.EVT_ENABLE_MUSIC, this.onEvtEnableMusic, this, 0);
            GLOBAL_OBJ.EventCenter.addEventListener(GLOBAL_OBJ.EventType.EVT_ENABLE_SOUND, this.onEvtEnableSound, this, 0);
            GLOBAL_OBJ.EventCenter.addEventListener(GLOBAL_OBJ.EventType.EVT_QUICK_START_REQUEST, this.onEvtQuickStartRequest, this, 0);
            GLOBAL_OBJ.EventCenter.addEventListener(GLOBAL_OBJ.EventType.EVT_QUICK_START_RESULT, this.onEvtQuickStartResult, this, 0);
            GLOBAL_OBJ.EventCenter.addEventListener(GLOBAL_OBJ.EventType.EVT_TABLE_INFO, this.onEvtTableInfo, this, 0);

            return true;
        },

        /**
         * 销毁
         */
        destroy:function()
        {
            GLOBAL_OBJ.LOGI(TAG, "GLOBAL_OBJ.PluginInterface destory");
            // 清空场景管理器, 场景交给外部管理
            GLOBAL_OBJ.SceneManager.clear();

            this._hallInterface = null;

            // 游戏事件
            GLOBAL_OBJ.EventCenter.removeEventListener(GLOBAL_OBJ.EventType.EVT_CUR_SCENE_CONTROLLER_CHANGE, this.onEvtCurrentSceneControllerChange, this, 0);
            GLOBAL_OBJ.EventCenter.removeEventListener(GLOBAL_OBJ.EventType.EVT_RUN_HALL_SCENE, this.onEvtRunHallScene, this, 0);
            GLOBAL_OBJ.EventCenter.removeEventListener(GLOBAL_OBJ.EventType.EVT_RUN_SHOP_SCENE, this.onEvtRunShopScene, this, 0);
            GLOBAL_OBJ.EventCenter.removeEventListener(GLOBAL_OBJ.EventType.EVT_ENABLE_MUSIC, this.onEvtEnableMusic, this, 0);
            GLOBAL_OBJ.EventCenter.removeEventListener(GLOBAL_OBJ.EventType.EVT_ENABLE_SOUND, this.onEvtEnableSound, this, 0);
            GLOBAL_OBJ.EventCenter.removeEventListener(GLOBAL_OBJ.EventType.EVT_QUICK_START_REQUEST, this.onEvtQuickStartRequest, this, 0);
            GLOBAL_OBJ.EventCenter.removeEventListener(GLOBAL_OBJ.EventType.EVT_QUICK_START_RESULT, this.onEvtQuickStartResult, this, 0);
            GLOBAL_OBJ.EventCenter.removeEventListener(GLOBAL_OBJ.EventType.EVT_TABLE_INFO, this.onEvtTableInfo, this, 0);
            GLOBAL_OBJ.EventCenter.removeEventListener(GLOBAL_OBJ.EventType.EVT_RETURN_HALL_SCENE, this.onRemoveEvent, this, 0);
        },

        onRemoveEvent:function()
        {
            GLOBAL_OBJ.GlobalTips.destroy();
            ty.NotificationCenter.ignore(hall.EventType.MJ_TRANS_TABLE, this.onHallEvtEnterTable, this);
            ty.NotificationCenter.ignore(hall.EventType.HALL_EXCUTE_DEFAULT_GAME_QUICK_START, this.onHallEvtQuickStart, this);
            ty.NotificationCenter.ignore(hall.EventType.HALL_LOAD_DEFAULT_GAME_RESOURCE, this.onHallEvtLoadResource, this);
            ty.NotificationCenter.ignore(hall.EventType.HALL_ENTER_PLUGIN_GAME, this.onHallEvtEnterOtherPlugin, this);

        },

        /**
         * 添加好友
         */
        addFriend:function(friendList){
            if (!this._hallInterface){
                return ;
            }

            this._hallInterface.addFriend(friendList);
        },

        /**
         * 接受好友请求
         */
        acceptFriend:function(friendList){
            if (!this._hallInterface){
                return ;
            }
            this._hallInterface.acceptFriend(friendList);
        },

        /**
         * 拒绝好友请求
         */
        refuseFriend:function(friendList){
            if (!this._hallInterface){
                return ;
            }

            this._hallInterface.refuseFriend(friendList);
        },

        /**
         * 更新账号数据
         */
        updateAccount:function()
        {
            if(!this._hallInterface)
            {
                return;
            }

            GLOBAL_OBJ.model.gAccount.setAccountName('');
            GLOBAL_OBJ.model.gAccount.setNewAccount(false);
            GLOBAL_OBJ.model.gAccount.setUserId(this._hallInterface.getUserId());
            GLOBAL_OBJ.model.gAccount.setAuthorCode(this._hallInterface.getAuthorCode());
            GLOBAL_OBJ.model.gAccount.setAuthInfo(this._hallInterface.getAuthInfo());
            GLOBAL_OBJ.model.gAccount.setUserType(this._hallInterface.getUserType());

            GLOBAL_OBJ.model.gAccount.setServerAddress(this._hallInterface.getTcpServerAddress());
            GLOBAL_OBJ.model.gAccount.setServerPort(this._hallInterface.getTcpServerPort());

            if(!GLOBAL_OBJ.model.gAccount.hasInit())
            {
                GLOBAL_OBJ.model.gAccount.onInitComplete();
            }
        },

        /**
         * 更新userInfo
         */
        updateUserInfo:function()
        {
            if(!this._hallInterface)
            {
                return;
            }

            GLOBAL_OBJ.model.gUser.setUserId(this._hallInterface.getUserId());
            GLOBAL_OBJ.model.gUser.setName(this._hallInterface.getUserName());
            GLOBAL_OBJ.model.gUser.setSex(this._hallInterface.getUserSex());
            GLOBAL_OBJ.model.gUser.setHeadIconUrl(this._hallInterface.getUserHeadIconUrl());
            GLOBAL_OBJ.model.gUser.setVipInfo(this._hallInterface.getVipInfo());
            // 断线重连通过事件处理
            GLOBAL_OBJ.model.gUser.setLocation(null);

            if(!GLOBAL_OBJ.model.gUser.hasUserDataInit())
            {
                GLOBAL_OBJ.model.gUser.onUserDataInitComplete();
            }
        },

        /**
         * 当前场景管理器改变事件
         * @param param
         */
        onEvtCurrentSceneControllerChange:function(param)
        {
            this._hallInterface.setCurrentSceneController(param);
        },

        /**
         * 显示大厅场景事件
         */
        onEvtRunHallScene:function()
        {
            GLOBAL_OBJ.LOGI(TAG, 'PluginInterface.onEvtRunHallScene');

            // 销毁
            this.destroy();

            // 返回大厅
            ty.NotificationCenter.trigger(hall.EventType.HALL_TRANS_HALL);
        },

        /**
         * 显示商城事件
         */
        onEvtRunShopScene:function()
        {
            GLOBAL_OBJ.LOGI(TAG, 'PluginInterface.onEvtRunShopScene');

            // 销毁
            this.destroy();

            // 返回大厅
            ty.NotificationCenter.trigger(hall.EventType.HALL_TRANS_EXCHANGE);
        },

        /**
         * 开关音乐消息响应
         * @param isEnable
         */
        onEvtEnableMusic:function(isEnable)
        {
            GLOBAL_OBJ.LOGI(TAG, 'PluginInterface.onEvtEnableMusic - ' + isEnable);

            this._hallInterface.setMusicMute(!isEnable);
        },

        /**
         * 开关音效消息响应
         * @param isEnable
         */
        onEvtEnableSound:function(isEnable)
        {
            GLOBAL_OBJ.LOGI(TAG, 'PluginInterface.onEvtEnableSound - ' + isEnable);

            this._hallInterface.setEffectsMute(!isEnable);
        },

        /**
         * 请求快速开始
         */
        onEvtQuickStartRequest:function()
        {
            // 记录时间
            this._quickStartRequestTime = Date.now();
            this._quickStartSuccessTime = null;
        },

        /**
         * 快速开始成功
         * @param isSuccess
         */
        onEvtQuickStartResult:function(isSuccess)
        {
            GLOBAL_OBJ.LOGI(TAG, 'PluginInterface.onEvtQuickStartResult - ' + isSuccess);

            ty.NotificationCenter.trigger(hall.EventType.HALL_EXCUTE_DEFAULT_GAME_QUICK_START_RESULT, { success: isSuccess, transSceneParam: {isShowWaiting: true}});

            if(isSuccess)
            {
                // 记录时间
                this._quickStartSuccessTime = Date.now();

                // 发送统计事件
                if(this._quickStartRequestTime !== null)
                {
                    var paramStatistic = {gameId: GLOBAL_OBJ.GAMEID, timer: this._quickStartSuccessTime - this._quickStartRequestTime};
                    ty.NotificationCenter.trigger(hall.StatisticType.HALL_STAT_PLUGIN_GAME_QUICKSTART_DURATION, paramStatistic);
                }
            }
        },

        /**
         * 收到TableInfo
         */
        onEvtTableInfo:function()
        {
            // 发送统计事件
            if(this._quickStartSuccessTime !== null)
            {
                var paramStatistic = {gameId: GLOBAL_OBJ.GAMEID, timer: Date.now() - this._quickStartSuccessTime};
                ty.NotificationCenter.trigger(hall.StatisticType.HALL_STAT_PLUGIN_GAME_TABLEINFO_DURATION, paramStatistic);
            }
        },

        /**
         * 大厅事件，进入桌面
         * @param param
         */
        onHallEvtEnterTable:function(param)
        {
            if(param.isShowWaiting)
            {
                GLOBAL_OBJ.gConsoleRemote.enterTableWaiting();
            }
            else
            {
                // 收到table_info会自动进入桌面
            }
        },

        /**
         * 大厅事件，快速开始
         */
        onHallEvtQuickStart:function()
        {
            GLOBAL_OBJ.LOGI(TAG, 'PluginInterface.onHallEvtQuickStart');

            // 初始化
            this.init();

            // 请求快速开始
            GLOBAL_OBJ.gConsoleRemote.requestQuickStart(false, true, GLOBAL_OBJ.GlobalVars.getGameType());
        },

        /**
         * 大厅事件，预加载资源
         */
        onHallEvtLoadResource:function()
        {
            GLOBAL_OBJ.LOGI(TAG, 'PluginInterface.onHallEvtLoadResource');

            // 加载完成
            this._isResourcePreLoaded = true;
            ty.NotificationCenter.trigger(hall.EventType.HALL_LOAD_DEFAULT_GAME_RESOURCE_DONE);
        },

        /**
         * 大厅事件，进入其它插件
         */
        onHallEvtEnterOtherPlugin:function()
        {
            GLOBAL_OBJ.LOGI(TAG, 'PluginInterface.onHallEvtEnterOtherPlugin');

            this._isResourcePreLoaded = false;
        },

        /**
         * 大厅事件，更新userInfo
         */
        onHallEvtUpdateUserInfo:function()
        {
            this.updateUserInfo();
        },

        /**
         * 大厅事件，断线重连
         */
        onHallEvtHandleLocation:function(arrLocation)
        {
            GLOBAL_OBJ.LOGI(TAG, "onHallEvtHandleLocation.");
            // 不在插件，不处理
            if(!this._hallInterface)
            {
                return;
            }
            if(!(this._hallInterface.getCurrentSceneController() instanceof GLOBAL_OBJ.control.Controller))
            {
                return;
            }

            // 发送事件
            GLOBAL_OBJ.model.gUser.sendEvent(GLOBAL_OBJ.model.User.EVT_HANDLE_LOCATION, GLOBAL_OBJ.Util.isValidLocation(arrLocation));
        }
    };
})();
