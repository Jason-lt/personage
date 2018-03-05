/**
 * Created by 许敬 on 2017/6/22.
 */
(function(){
    var GLOBAL_OBJ = guiyang;

    GLOBAL_OBJ.businesses.scenes.SceneCtrlPanel = GLOBAL_OBJ.bkernel.base.BaseController.extend({
        _TAG:"businesses.scenes.SceneCtrlPanel",
        ctor: function(owener, playMode) {

            this.owner = owener;
            this._super();
            this.playMode = playMode;

            this._curHour = '00';
            this._curMin = '00';
            this.isExitScene = false;
            this.menuListIsShow = false;

            this.init(GLOBAL_OBJ.RES.MAHJ_SCENE_CTRL_PANEL_CCBI);
        },

        onLoad: function() {
            this._super();

            var that     = this;

            //插件大厅加载完成
            GLOBAL_OBJ.LOGD(this._TAG, "==== 操作面板 加载完成，当前 index:" + this.index);

            this.isPlugInScene = this.owner instanceof GLOBAL_OBJ.businesses.scenes.PluginHall.Scene;
            this.changeBackBtn(this.isPlugInScene && GLOBAL_OBJ.plugInStep == 0); // true
            // this.changeBackBtn(true); // true

            var menuListSize = this['menuList'].getContentSize();
            this['menuList'].setPositionY(-menuListSize.height);

            this.smallAvatar = new GLOBAL_OBJ.Avatar(hall.ME.udataInfo.m_purl, this['nodeAvatar'], cc.size(65 ,65), null, null, GLOBAL_OBJ.RES.AVATAR_COVER_PNG);
            this.MenuAvatar = new GLOBAL_OBJ.Avatar(hall.ME.udataInfo.m_purl, this['menuAvatarNode'], cc.size(136 ,136), null, null, GLOBAL_OBJ.RES.MENU_AVATAR_COVER_PNG);
            this.smallAvatar.canTouch = true;

            var userName = hall.GlobalFuncs.SliceStringToLength(hall.ME.udataInfo.m_name, 14);
            this['txtPlayerName'].setString(userName);

            this.refreshUserInfo();

            this._refreshTime();
            ty.Timer.setTimer(this, this._refreshTime, 1, cc.REPEAT_FOREVER, 0);
            ty.NotificationCenter.listen(GLOBAL_OBJ.businesses.scenes.PluginHall.Events.SHOW_OR_HIDE_MENULIST , this.onMore, this);

            this.menuSetBtn = new GLOBAL_OBJ.SpriteBtn(GLOBAL_OBJ.RES.MENU_BTN_SET_PNG ,GLOBAL_OBJ.RES.MENU_BTN_BG_PNG, this['btnNode_0'] ,"menuSetBtn");
            this.rechargeSetBtn = new GLOBAL_OBJ.SpriteBtn(GLOBAL_OBJ.RES.MENU_BTN_RECHARGE_PNG ,GLOBAL_OBJ.RES.MENU_BTN_BG_PNG, this['btnNode_1'], "rechargeSetBtn");
            this.ruleSetBtn = new GLOBAL_OBJ.SpriteBtn(GLOBAL_OBJ.RES.MENU_BTN_HELP_PNG ,GLOBAL_OBJ.RES.MENU_BTN_HELP_PNG, this['btnNode_2'], "ruleSetBtn");

            ty.NotificationCenter.listen(GLOBAL_OBJ.businesses.scenes.PluginHall.Events.SPRITE_BTN_TOUCH , this.onSpriteBtnTouch, this);

            ty.netMsgDispatcher.registerMsg(hall.EventType.UPDATE_UER_INFO, this.refreshUserInfo, this);

            this['touchLayer'].setVisible(false);
            this['touchLayer'].swallowTouches = true;

            this._touchListener = GLOBAL_OBJ.bkernel.extend.Touch.bind_simple_touch(this['touchLayer'], true, null, null,
                function (listener, touch, event, inRect) {
                    ty.NotificationCenter.trigger(GLOBAL_OBJ.businesses.scenes.PluginHall.Events.SHOW_OR_HIDE_MENULIST , {"name":"touchLayer"});
                },
                null,this);

            if (GLOBAL_OBJ.inPlugInHall){
                this.playAnimation("Default Timeline");
            }
            else {
                this.playAnimation("in");
                GLOBAL_OBJ.inPlugInHall = true;
            }

            this.resetTitle();
            this.controlMatchOrCoin();
        },

        resetTitle:function () {
            var titlePath;

            if (this.playMode == GLOBAL_OBJ.table.global.PLAYMODE.ZhuoJi) {
                titlePath = GLOBAL_OBJ.RES.MAHJ_ROOM_TITLE_3_PNG;
            }
            else if (this.playMode == GLOBAL_OBJ.table.global.PLAYMODE.ErDingGuai) {
                titlePath = GLOBAL_OBJ.RES.MAHJ_ROOM_TITLE_1_PNG;
            }
            else if (this.playMode == GLOBAL_OBJ.table.global.PLAYMODE.SanDingGuai) {
                titlePath = GLOBAL_OBJ.RES.MAHJ_ROOM_TITLE_2_PNG;
            }

            this.setRoomTitle(titlePath);
        },

        /**
         * 更改返回按钮
         * @param val true : 显示返回大厅按钮，false:显示返回按钮
         */
        changeBackBtn:function (val) {
            this['btnBackToHall'].setVisible(val);
            this['btnBack'].setVisible(!val);
        },

        refreshUserInfo:function () {
            var coinNum = GLOBAL_OBJ.businesses.functions.formatGold(hall.ME.getChip());
            // var quanNum = GLOBAL_OBJ.businesses.functions.formatGold(hall.ME.udataInfo.m_couponCount);
            var quanNum = GLOBAL_OBJ.businesses.functions.formatQuang(hall.ME.udataInfo.m_couponCount);
            this['txtMenuCoin'].setString(coinNum);
            this['txtMenuQuan'].setString(quanNum);
            this['txtCoin'].setString(coinNum);
            this['txtQuan'].setString(quanNum);
        },

        hideTitle:function () {
            this["_roomTitle"].setVisible(false);
        },

        onSpriteBtnTouch:function (flag) {
            hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);
            if (flag == "menuSetBtn"){
                GLOBAL_OBJ.LOGD(this._TAG, "==== 设置按钮点击");
                if (hall.PluginInterface.isHall5){
                    hall.GlobalFuncs.showHallSettingView(true);
                }
                else{
                    var win = GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.table.windows.consts.C_TABLE_MENU_SETTING,
                        {}, cc.director.getRunningScene());

                    var size = this.getRootNode().getContentSize();
                    win.getRootNode().setPosition(cc.p(size.width/2, size.height/2));
                }
            }
            else if (flag == "rechargeSetBtn"){
                GLOBAL_OBJ.LOGD(this._TAG, "==== 充值按钮点击");

                //Fixed: 地主自己的统计事件加到自己的StateInfo中
                // shell.selfLoginObj.clickStat(ddz.StatInfo.PluginGameStoreClickCount);
                hall.MsgFactory.getQuickBuyInfo();
            }else if (flag == "ruleSetBtn"){
                GLOBAL_OBJ.LOGD(this._TAG, "==== 玩法介绍按钮点击" + this.playMode);
                var curSceen = cc.Director.getInstance().getRunningScene();
                GLOBAL_OBJ.bkernel.windows.Factory.produce(
                    GLOBAL_OBJ.businesses.windows.consts.GDMJ_INTRODUCTION_WND,
                    {playMode:this.playMode, ruleIndex:"base_rule"}, curSceen
                );
            }
        },

        _refreshTime:function(){
            var time = new Date();
            var hour = time.getHours();
            var min = time.getMinutes();
            hour = (hour < 10) ? "0" + hour : "" + hour;
            min = (min < 10) ? "0" + min : "" + min;

            if (this._curHour != hour || this._curMin != min) {
                this["txtTime"].setString(hour + ":" + min);
                this._curHour = hour;
                this._curMin = min;
            }
        },

        onP:function () {
            //阻止事件专用，不要删除
        },

        onBack:function (sender,controlEvent) {
            if (controlEvent == cc.CONTROL_EVENT_TOUCH_DOWN || controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_ENTER){
                sender.setOpacity(255*0.5);
            }
            else if (controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_EXIT){
                sender.setOpacity(255);
            }
            else if (controlEvent == cc.CONTROL_EVENT_TOUCH_UP_INSIDE){
                sender.setOpacity(255);
                this.backFun();
            }
        },

        backFun:function () {
            GLOBAL_OBJ.LOGD(this._TAG, "==== 操作面板 当前 backFun ");
            if (this.isPlugInScene){
                if (GLOBAL_OBJ.plugInStep == 1){
                    //发消息给子大厅，显示子大厅第一页面内容
                    GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.scenes.PluginHall.Events.TO_ZDT ,null);
                }
                else{
                    GLOBAL_OBJ.businesses.utils.Scene.jumpToHall(this.owner);
                }
            }
            else{
                if (this.isExitScene) return;
                this.isExitScene = true;

                hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);
                //当前不是在子大厅，返回子大厅
                var curSce = hall.SceneManager.getCurrentController();
                if (curSce instanceof GLOBAL_OBJ.businesses.scenes.RoomList.Scene){
                    curSce.goOut();
                }
                else{
                    // 返回二级子大厅
                    // GLOBAL_OBJ.businesses.utils.Scene.jumpToSecondHall(this.playMode);
                    // 返回金币场房间列表
                    GLOBAL_OBJ.businesses.utils.Scene.jumpToRoomList(GLOBAL_OBJ.PluginGameType.JinBi, this.playMode);
                }
            }
        },

        setRoomTitle:function(picPath){
            if(picPath){
                this["_roomTitle"].setVisible(true);
                GLOBAL_OBJ.businesses.functions.textureChange(this["_roomTitle"], picPath);
            }
            else{
                this["_roomTitle"].setVisible(false);
            }
        },

        onBackToHome:function (sender, controlEvent) {
            GLOBAL_OBJ.LOGD(this._TAG, "==== 操作面板 当前 onBackToHome ");
            if (controlEvent == cc.CONTROL_EVENT_TOUCH_DOWN || controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_ENTER){
                sender.setOpacity(255 * 0.5);
            }
            else if (controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_EXIT){
                sender.setOpacity(255);
            }
            else if (controlEvent == cc.CONTROL_EVENT_TOUCH_UP_INSIDE){
                sender.setOpacity(255);
                if (this.isExitScene) return;
                this.isExitScene = true;

                hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);
                // hall.PluginInterface.backHall(this.owner);
                GLOBAL_OBJ.businesses.utils.Scene.jumpToHall(this.owner);
            }
        },

        onMore:function (sender, controlEvent) {

            //显示用户菜单
            GLOBAL_OBJ.LOGD(this._TAG, "显示或隐藏 用户菜单 " + (controlEvent).toString());

            if (sender.name == "touchLayer"){
                this.showOrHideMenuList();
            }
            else{
                if (controlEvent == cc.CONTROL_EVENT_TOUCH_DOWN || controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_ENTER){
                    if (cc.isFunction(sender.setOpacity))
                        sender.setOpacity(255*0.5);
                }
                else if (controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_EXIT){
                    sender.setOpacity(255);
                }
                else if (controlEvent == cc.CONTROL_EVENT_TOUCH_UP_INSIDE){
                    if (cc.isFunction(sender.setOpacity))
                        sender.setOpacity(255);
                    this.showOrHideMenuList();
                }
            }
        },

        showOrHideMenuList:function () {
            hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);
            var pY = this['menuList'].getPositionY();
            var menuListSize = this['menuList'].getContentSize();
            var opTime = 0.15;
            var toY;
            if (pY == 0){
                //下降
                toY = -menuListSize.height;
                ty.Timer.setTimer(this, this.showBgContent, opTime, 1, 0);
                this['touchLayer'].setVisible(false);
                this.menuListIsShow = false;
            }
            else{
                //上升
                toY = 0;
                this['nodeBottom'].setVisible(false);
                if (this.owner['table_container']){
                    this.owner['table_container'].setVisible(false);
                }
                if (this.owner['page_tag']){
                    this.owner['page_tag'].setVisible(false);
                }

                this['bgLayer'].setOpacity(255*0.1);
                this['touchLayer'].setVisible(true);

                this.menuListIsShow = true;
            }

            var moveUpAction = cc.MoveTo.create(opTime, cc.p(0, toY));
            this['menuList'].runAction(cc.EaseInOut.create(moveUpAction, 5));
        },

        showBgContent:function () {
            this['nodeBottom'].setVisible(true);
            if (this.owner['table_container']){
                this.owner['table_container'].setVisible(true);
            }
            if (this.owner['page_tag']){
                this.owner['page_tag'].setVisible(true);
            }

            this['bgLayer'].setOpacity(0);

            ty.Timer.cancelTimer(this, this.showBgContent);
        },

        // 切换到金币场
        onGoCoin:function (sender, controlEvent) {
            GLOBAL_OBJ.LOGD(this._TAG, "点击金币场按钮 ");
            if (controlEvent == cc.CONTROL_EVENT_TOUCH_DOWN || controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_ENTER){
                sender.setOpacity(255 * 0.5);
            }
            else if (controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_EXIT){
                sender.setOpacity(255);
            }
            else if (controlEvent == cc.CONTROL_EVENT_TOUCH_UP_INSIDE){
                sender.setOpacity(255);

                var curSce = hall.SceneManager.getCurrentController();
                var that = this;

                curSce.goOutCallBackFun = function () {
                    GLOBAL_OBJ.plugInStep = 0;
                    GLOBAL_OBJ.businesses.utils.Scene.jumpToRoomList(GLOBAL_OBJ.PluginGameType.JinBi, that.playMode);
                };
                curSce.goOut();
            }
        },

        // 切换到比赛场
        onGoMatch:function (sender, controlEvent) {
            GLOBAL_OBJ.LOGD(this._TAG, "点击比赛场按钮 ");
            if (controlEvent == cc.CONTROL_EVENT_TOUCH_DOWN || controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_ENTER){
                sender.setOpacity(255 * 0.5);
            }
            else if (controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_EXIT){
                sender.setOpacity(255);
            }
            else if (controlEvent == cc.CONTROL_EVENT_TOUCH_UP_INSIDE){
                sender.setOpacity(255);

                var curSce = hall.SceneManager.getCurrentController();
                var that = this;

                curSce.goOutCallBackFun = function () {
                    GLOBAL_OBJ.plugInStep = 0;
                    GLOBAL_OBJ.businesses.utils.Scene.jumpToMatch(that.playMode);
                };
                curSce.goOut();
            }
        },

        controlMatchOrCoin:function () {

            if (this.playMode == GLOBAL_OBJ.table.global.PLAYMODE.ZhuoJi) {
                this.btnHaoYouFang.setVisible(false);
                if(this.isPlugInScene){
                    this.goMatch.setVisible(false);
                    this.goCoin.setVisible(false);
                }else if(this.owner instanceof GLOBAL_OBJ.businesses.scenes.Match.Scene){
                    this.goMatch.setVisible(false);
                    this.goCoin.setVisible(true);
                }else if(this.owner instanceof GLOBAL_OBJ.businesses.scenes.RoomList.Scene){
                    this.goMatch.setVisible(true);
                    this.goCoin.setVisible(false);
                }
            }else {
                this.changeBackBtn(true);
                this.btnHaoYouFang.setVisible(false);
                this.goMatch.setVisible(false);
                this.goCoin.setVisible(false);
            }

        },

        onHaoYouFang:function (sender, controlEvent) {
            GLOBAL_OBJ.LOGD(this._TAG, "点击好友房按钮 ");
            if (controlEvent == cc.CONTROL_EVENT_TOUCH_DOWN || controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_ENTER){
                if (cc.isFunction(sender.setOpacity))
                    sender.setOpacity(255*0.5);
            }
            else if (controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_EXIT){
                sender.setOpacity(255);
            }
            else if (controlEvent == cc.CONTROL_EVENT_TOUCH_UP_INSIDE){
                if (cc.isFunction(sender.setOpacity)){
                    sender.setOpacity(255);
                }

                var curSce = hall.SceneManager.getCurrentController();
                var that = this;
                if (this.isPlugInScene){
                    curSce.onToHyf();
                }
                else{
                    curSce.goOutCallBackFun = function () {
                        GLOBAL_OBJ.plugInStep = 1;
                        //GLOBAL_OBJ.businesses.utils.Scene.jumpToHaoYouHall(that.playMode);
                    };
                    curSce.goOut();
                }
            }
        },

        onDestroy:function () {
            this._super();

            ty.netMsgDispatcher.removeMsg(hall.EventType.UPDATE_UER_INFO, this.refreshUserInfo, this);

            ty.Timer.cancelTimer(this, this._refreshTime);
            ty.NotificationCenter.ignore(GLOBAL_OBJ.businesses.scenes.PluginHall.Events.SHOW_OR_HIDE_MENULIST , this.onMore, this);
            this.owner = null;

            this.smallAvatar.destroy();
            this.smallAvatar = null;

            this.MenuAvatar.destroy();
            this.MenuAvatar = null;

            this.menuSetBtn.destroy();
            this.rechargeSetBtn.destroy();
            this.ruleSetBtn.destroy();

            this.menuSetBtn = null;
            this.rechargeSetBtn = null;
            this.ruleSetBtn = null;
            ty.NotificationCenter.ignore(GLOBAL_OBJ.businesses.scenes.PluginHall.Events.SPRITE_BTN_TOUCH , this.onSpriteBtnTouch, this);

            if (this._touchListener && this._touchListener.__nativeObj){
                cc.eventManager.removeListener(this._touchListener);
            }
            this._touchListener = null;

        },

        update:function(){
        }
    });
//end
})();