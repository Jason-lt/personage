/*************************************************************
 *  mahjong_create_gameplay_introduction.js
    mahjong_create_gameplay_introduction
 *  mahjong
 	自建桌 玩法介绍 window
 *  特殊说明：

    使用方法:
    
    //显示玩法说明，参数：{playMode:"玩法"}：打开界面默认显示玩法
    var wnd  = GLOBAL_OBJ.bkernel.windows.Factory.produce(
        GLOBAL_OBJ.businesses.windows.consts.CREATE_ROOM_RULES_WND_HALL,
        {playMode:"玩法"}, this.getCurrentScene()
    );
 */
(function(){
    var GLOBAL_OBJ = guiyang;

    var GAMEPLAY_INTRODUCTION;
    if (ty.LOCAL_JS_DEBUG && ty.LOCAL_JS_DEBUG.enabled) {
        if (!ty.LOCAL_JS_DEBUG.gymjPath) {
            // 注意前后的顺序,注意文件名中不能有大写字母，否则在android中会有问题
            var requireScripts = function()
            {
                GAMEPLAY_INTRODUCTION = JSON.parse(hall.GlobalFuncs.readFile('games/guiyang/config/mj_gameplay_introduction.json'));
                GLOBAL_OBJ.LOGD("arrScripts_data111111:", JSON.stringify(GAMEPLAY_INTRODUCTION));
                for(var nScript = 0, numScript = GAMEPLAY_INTRODUCTION.length; nScript < numScript; ++nScript)
                {

                }
            };
            requireScripts();
        }
        else
        {
            // 注意前后的顺序,注意文件名中不能有大写字母，否则在android中会有问题
            var MJJSONFILE  = ty.LOCAL_JS_DEBUG.gymjPath + "/config/mj_gameplay_introduction.json";

            var requireScripts = function()
            {
                GAMEPLAY_INTRODUCTION = JSON.parse(ty.FileManager.readFile(MJJSONFILE));
                GLOBAL_OBJ.LOGD("arrScripts_data222222:", JSON.stringify(GAMEPLAY_INTRODUCTION));

                for(var nScript = 0, numScript = GAMEPLAY_INTRODUCTION.length; nScript < numScript; ++nScript)
                {
                }
            };
            requireScripts();
        }
    }
    else
    {
        var requireScripts = function()
        {
            GAMEPLAY_INTRODUCTION = JSON.parse(hall.GlobalFuncs.readFile('games/guiyang/config/mj_gameplay_introduction.json'));
            GLOBAL_OBJ.LOGD("arrScripts_data3333333:", JSON.stringify(GAMEPLAY_INTRODUCTION));
            for(var nScript = 0, numScript = GAMEPLAY_INTRODUCTION.length; nScript < numScript; ++nScript)
            {
            }
        };
        requireScripts();
    };

	GLOBAL_OBJ.businesses.scenes.CustomRoom.gameplayIntroduction = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"businesses.scenes.CustomRoom.gameplayIntroduction",
		ctor: function(params) {
			this._super();
            this.nowIndex = 0;//当前选中的
            this.params = params;
            this.indexOfPlayMode = [];
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_GAMEPLAY_INTRODUCTION_BTN_TOUCH,this.onGameIntrBtnSelect,this);
			this.updateViews()
		},

        onGameIntrBtnSelect:function (_idx) {
		    GLOBAL_OBJ.LOGD("onGameIntrBtnSelect_idx:" + _idx);
            this.refreshGamePlayBtns(_idx);
        },

        updateViews:function(){
            var that   = this;
            /*
			@玩法类型 左边*/
			this.button_details         = { data:[]};
            this.buttonTableView = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
                viewSize   :this.leftBtnsNode.getContentSize(),
                direction  :cc.SCROLLVIEW_DIRECTION_VERTICAL,
                fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
                bounce     :true,
                cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Cache,
                // cellSize   :cc.size(size.width, 100),
                controller :GLOBAL_OBJ.businesses.scenes.CustomRoom.gameplayIntrCell,
                container  :this.leftBtnsNode,
                data       :this.button_details
            });
            this.leftBtnsNode.addChild(this.buttonTableView);

            var nowIndex = 0;
            var plIndex  = 0;
            var btnsData = [];
            var p_mode;
            for (var idata in GAMEPLAY_INTRODUCTION){
                p_mode = GAMEPLAY_INTRODUCTION[idata].play_mode;
                btnsData.push(p_mode);
                this.indexOfPlayMode.push(idata);//一个playmode组成的数组，对应json中的顺序
                if(idata == this.params.playMode){
                    plIndex = nowIndex;
                }
                nowIndex += 1;
            }
            this.button_details.data = btnsData;

            var rule_index = this.params.ruleIndex;
            GLOBAL_OBJ.LOGD(this._TAG, "introduction_plIndex:" + plIndex + "    rule_index:" + rule_index);
            this.refreshGamePlayBtns(plIndex, rule_index);
        },
        refreshGamePlayBtns:function(idx, _ruleIndex){
            this.nowIndex = idx || 0;

            //左侧按钮列表刷新
            this.button_details.selectedIndex = this.nowIndex;
            GLOBAL_OBJ.LOGD(this._TAG, "refreshGamePlayBtnsutton_details_data_length" + this.button_details.data.length );
            this.buttonTableView.reloadData(this.button_details.data.length,"STOP");

            var playModeName = this.indexOfPlayMode[idx];
            for (var idata in GAMEPLAY_INTRODUCTION){
                if(this[idata]){
                    //所有的玩法介绍都不可见
                    this[idata].getRootNode().setVisible(false);
                }
            }
            //创建右侧玩法，规则等介绍面板
            if(!this[playModeName]){
                var size        = this.rightDetailsNode.getContentSize();
                var _data       = GAMEPLAY_INTRODUCTION[playModeName];
                var ruleIndex   = _ruleIndex || "base_rule";
                this[playModeName] = new GLOBAL_OBJ.businesses.scenes.CustomRoom.gameplayIntrDetails({playmode:playModeName, rule_index:ruleIndex, data:_data});
                this.rightDetailsNode.addChild(this[playModeName].getRootNode());
                this[playModeName].getRootNode().setPosition(cc.p(size.width/2.0, size.height))
            }
            //只有当前的玩法介绍可见
            this[playModeName].getRootNode().setVisible(true);

        },
		/*
		弹窗弹出完毕
		*/
		onEase:function(){
			this._super();
		},

		onClose:function(){
			this.windowClose();
		},

		onCleanup:function(){
            GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
			this._super();
		},

		/*
		touch响应，基类重载
		*/
		onTouchBegan:function(_touch,_event){
			this._super();
 			return true;
		}

	});
	//end
})();