/*************************************************************
 *  mahjong_plugin_hall_scene.js.js
    插件大厅 场景
 *
 *  Created by nick.kai.lee on 16-01-26
 *  特殊说明：

    使用方法:
 */
(function(){
    var GLOBAL_OBJ = guiyang;
    var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
    GLOBAL_OBJ.businesses.scenes.PluginHall.Scene = GLOBAL_OBJ.bkernel.base.BaseSceneController.extend({
        _TAG:"businesses.scenes.PluginHall.Scene",
        ctor:function(playMode){
            this._super();
            this.playMode = playMode;
            GLOBAL_OBJ.businesses.utils.Scene.setDs();
        },

        onLoad:function(){
            this._super();

            this._sceneCtr = new GLOBAL_OBJ.businesses.scenes.SceneCtrlPanel(this,this.playMode);
            this.rootNode.addChild(this._sceneCtr.rootNode);

            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.scenes.PluginHall.Events.TO_HYZ ,this.onIconBtnTouch , this);
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.scenes.PluginHall.Events.TO_ZDT ,this.onToZDT , this);

            var iconList = GLOBAL_OBJ.businesses.scenes.PluginHall.iconMap;

            var btnIcon;
            for (var i = 0; i < iconList.length; i++){
                btnIcon = new GLOBAL_OBJ.businesses.scenes.PluginHall.PluginIcon(i);
                this['slot_' + i].addChild(btnIcon.rootNode);
            }
            this.changeBtns(false);
            var vsize = cc.director.getWinSize();

            var bi = vsize.width / vsize.height;
            if (bi < 1.5){
                GLOBAL_FUNCS.textureChange(this['bgRootNode'],GLOBAL_OBJ.RES.NOPACK_MAHJ_ROOM_LIST_BG_SMALL_JPG);
            }

            var bgSize = this['bgRootNode'].getContentSize();
            var scal = Math.max(vsize.width/bgSize.width, vsize.height/bgSize.height);
            this['bgRootNode'].setScale(scal);
        },

        changeBtns:function (needOutAni) {
            // for (var j = 0; j < 2; j++){
            //     this['btn_container' + j].setVisible(j == GLOBAL_OBJ.plugInStep);
            // }

            var that = this;

            if (GLOBAL_OBJ.plugInStep == 0){
                //两个出场
                if (needOutAni){
                    this['slot_2'].children[0].controller.runZoomOut();
                    this['slot_3'].children[0].controller.runZoomOut();

                    this.rootNode.scheduleOnce(function () {
                        that['btn_container0'].setVisible(true);
                        that['btn_container1'].setVisible(false);
                        that['slot_0'].children[0].controller.runZoomIn();
                        that['slot_1'].children[0].controller.runZoomIn();
                    },0.15);
                }
                else{
                    that['btn_container0'].setVisible(true);
                    that['btn_container1'].setVisible(false);
                    that['slot_0'].children[0].controller.runZoomIn();
                    that['slot_1'].children[0].controller.runZoomIn();
                }
            }
            else{

                if (needOutAni) {
                    this['slot_0'].children[0].controller.runZoomOut();
                    this['slot_1'].children[0].controller.runZoomOut();

                    this.rootNode.scheduleOnce(function () {
                        that['btn_container0'].setVisible(false);
                        that['btn_container1'].setVisible(true);
                        that['slot_2'].children[0].controller.runZoomIn();
                        that['slot_3'].children[0].controller.runZoomIn();
                    }, 0.15);
                }
                else{
                    that['btn_container0'].setVisible(false);
                    that['btn_container1'].setVisible(true);
                    that['slot_2'].children[0].controller.runZoomIn();
                    that['slot_3'].children[0].controller.runZoomIn();
                }
            }
        },

        onToZDT:function () {
            hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);
            GLOBAL_OBJ.plugInStep = 0;
            this.changeBtns(true);
            this._sceneCtr.changeBackBtn(true);
            this._sceneCtr.changeBackBtn(true);
            this._sceneCtr.resetTitle();
        },

        onToHyf:function () {
            hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);
            GLOBAL_OBJ.plugInStep = 1;
            this.changeBtns(true);
            this._sceneCtr.changeBackBtn(false);
            this._sceneCtr.setRoomTitle(GLOBAL_OBJ.RES.MAHJ_ROOM_TITLE_HYF_PNG);
        },

        onZhanji:function () {
            hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);
            var curPlayMode = this.playMode;
            var addParent = this.getRootNode().parent;
            GLOBAL_OBJ.bkernel.windows.Factory.produce(
                GLOBAL_OBJ.businesses.windows.consts.C_CREATE_ROOM_RECORD_HALL, {playMode : curPlayMode}, addParent);
        },

        onIconBtnTouch:function (idx) {

            var that = this;
            switch (idx){
                case 0:{
                    this.onToHyf();
                    break;
                }
                case 1:{
                    //去房间列表
                    hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);

                    this['slot_0'].children[0].controller.runZoomOut();
                    this['slot_1'].children[0].controller.runZoomOut();

                    this.rootNode.scheduleOnce(function () {
                        GLOBAL_OBJ.businesses.utils.Scene.jumpToRoomList( GLOBAL_OBJ.PluginGameType.JinBi, that.playMode );
                    },0.15);

                    break;
                }
                case 2:{
                    //弹出加入房间窗口
                    hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);
                    var task = {
                        "action":"hall_enter_friend_table",
                        "params":{}
                    };
                    hall.ToDoTask.runOneTask(task);
                    break;
                }
                case 3:{
                    //弹出创建房间窗口
                    hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);
                    GLOBAL_OBJ.GlobalVars.setCreatePlayModes([this.playMode]);
                    GLOBAL_OBJ.bkernel.utils.ToDoTasks.runOneTask({
                        "action": "pop_create_room_create",
                        "params": {
                            "hasRobot": 0
                        }
                    });
                    break;
                }
            }
        },

        /**
         * 物理返回键
         * @returns {boolean}
         */
        onKeyBackAfterWindowClicked: function (){
            GLOBAL_OBJ.LOGD(this._TAG,".onKeyBackAfterWindowClicked");
            if (this._sceneCtr.menuListIsShow){
                this._sceneCtr.showOrHideMenuList();
            }
            else{
                this._sceneCtr.backFun();
            }
        },

        /**
         * 清理处理
         */
        onCleanup: function ()
        {
            GLOBAL_OBJ.LOGD(this._TAG,'onDestroy begin');
            GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
            this._sceneCtr = null;
            this.param = null;
            this._super();
        }

    });
//end
})();