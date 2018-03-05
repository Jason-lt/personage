/*************************************************************
 *  mahjong_create_room_final_result_window.js
 *  Created by nick.kai.lee on 16-06-29
 */
(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;
    var GLOBAL_T = GLOBAL_OBJ.table.global;
	var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
    var MODEL_TABLEINFO = GLOBAL_OBJ.table.models.TableInfo;
    var MODEL_BUDGETS_FINAL = GLOBAL_OBJ.table.models.FinalBudget;

	GLOBAL_OBJ.table.scenes.Custom.Final = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"table.scenes.Custom.Final",
		ctor: function(_params) {
			this._super();
			this.params = _params;
			this.sharePicName = ""
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();

			GLOBAL_OBJ.LOGD("coutom_final_budget_setPanelAndDisCardVisible");
			this.params.scene.setPanelAndDisCardVisible(false); // 大结算界面，隐藏掉牌桌上的玩家面板和弃牌区面板

			GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.HIDE_THIS, {});

			this.final_share_fanghao.setString( "房间号:"+ MODEL_TABLEINFO.getCustomTableId() );
			this.final_share_time.setString(GLOBAL_FUNCS.formatTimeForTimeStamp("yy-mm-dd", MODEL_BUDGETS_FINAL.getRegionTime(GLOBAL_T.MYSEAT)));

			this.roomIdLabel.setString( "房间号 : "+ MODEL_TABLEINFO.getCustomTableId() );
			this.timeLabel.setString(GLOBAL_FUNCS.formatTimeForTimeStamp("yy-mm-dd", MODEL_BUDGETS_FINAL.getRegionTime(GLOBAL_T.MYSEAT)));

			var _contentWidth = this.nodeCenter.getContentSize().width;
			var _percentage = MODEL_TABLEINFO.getSeatCount()/4;
			var _oldPosX = this.nodeCenter.getPositionX();
			var _newPosX=_oldPosX + _contentWidth * (1-_percentage) * 0.5;
			this.nodeCenter.setPositionX(_newPosX);

			// 玩家列表
			this.data     = { data:[] };
            var tableView = GLOBAL_OBJ.bkernel.utils.NoneTableView.Layer.create({
                viewSize   :this.viewNode.getContentSize(),
                direction  :cc.SCROLLVIEW_DIRECTION_HORIZONTAL,
                fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
                bounce     :true,
                cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Cache,
                controller :GLOBAL_OBJ.table.scenes.Custom.Final.Cell,
                container  :this.viewNode,
                data       :this.data
            });
            this.viewNode.addChild(tableView);
            tableView.reloadData(MODEL_TABLEINFO.getSeatCount());

            var titlePath;
            var playMode = MODEL_TABLEINFO.getPlayMode();
            if (playMode == GLOBAL_T.PLAYMODE.ZhuoJi) {
                titlePath = GLOBAL_OBJ.RES.MAHJ_ROOM_TITLE_3_PNG;
            }
            else if (playMode == GLOBAL_T.PLAYMODE.ErDingGuai) {
                titlePath = GLOBAL_OBJ.RES.MAHJ_ROOM_TITLE_1_PNG;
            }
            else if (playMode == GLOBAL_T.PLAYMODE.SanDingGuai) {
                titlePath = GLOBAL_OBJ.RES.MAHJ_ROOM_TITLE_2_PNG;
            }

            GLOBAL_FUNCS.textureChange(this.imgTitle, titlePath);

			// 通知注册
            // GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_OBJ.bkernel.Events.TICK,   function(_params){
            //     that.clockLabel.setString( (new Date( _params.time*1000 )).toLocaleTimeString() );
            // }, this);
		},

		// 弹窗弹出完毕
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

		// touch响应，基类重载
		onTouchBegan:function(_touch,_event){
			this._super();
 			return true;
		},

		// 是否监听物理返回键，默认监听。不监听的在子类中重写返回false即可
		isKeyBackListenEnabled:function(){
			return false;
		},

		// 低调炫耀（分享）
        onShare:(function(){
            var isTouched = false;
            return function(){
                if (isTouched == true){
                    return;
                }
                // 点击限制
                isTouched = true;
                this.async(function(){
                    isTouched = false;
                }, 3);

                var title = GLOBAL_OBJ.GlobalVars.getAppName();
                var desc  = "";
                if (MODEL_BUDGETS_FINAL.getTotalDeltaScore(GLOBAL_T.MYSEAT) >= 0){
                    desc  = "我刚在"+GLOBAL_OBJ.GlobalVars.getAppName()+"中赢了"+MODEL_BUDGETS_FINAL.getTotalDeltaScore(GLOBAL_T.MYSEAT)+"积分，求超越";
                }else{
                    desc = "我刚在"+GLOBAL_OBJ.GlobalVars.getAppName()+"中打了一把"+(GLOBAL_OBJ.businesses.scenes.CustomRoom.static.NAMES[ MODEL_TABLEINFO.getPlayMode() ] || "")+"  房间号:"+MODEL_TABLEINFO.getCustomTableId();
                }

                // 显示分享界面
                var that = this;
                GLOBAL_FUNCS.screenShot(function(_name){
                    GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.businesses.windows.consts.C_TABLE_SHARE_WND,
                        {shareUrl: null, shareTitle: title, shareDesc: desc, picName:_name}, that.params.scene.getShareNode());
                });
            };
        })(),

		// 分享到朋友圈
		onPyq:function()
		{
			this.shareByType('0');
		},

		// 分享给一个朋友
		onHaoYou:function()
		{
			this.shareByType('1');
		},

		// 继续游戏
		onContinue:function(){
			this.continueBtn.setEnabled(false);
			// 返回二级子大厅
			// GLOBAL_OBJ.businesses.utils.Scene.jumpToSecondHall(MODEL_TABLEINFO.getPlayMode());
			// 返回金币场房间列表
            GLOBAL_OBJ.businesses.utils.Scene.jumpToRoomList(GLOBAL_OBJ.PluginGameType.JinBi, MODEL_TABLEINFO.getPlayMode());
		},

		share:function(type){
			var pic =   jsb.fileUtils.getWritablePath() + this.sharePicName;
			if(ty.FileManager.checkFileExist(pic))
			{
				var title = GLOBAL_OBJ.GlobalVars.getAppName();
				var desc  = "";
				if (MODEL_BUDGETS_FINAL.getTotalDeltaScore(GLOBAL_T.MYSEAT) >= 0){
					desc = "我刚在" + GLOBAL_OBJ.GlobalVars.getAppName() + "中赢了" + MODEL_BUDGETS_FINAL.getTotalDeltaScore(GLOBAL_T.MYSEAT) + "积分，求超越";
				}else{
					desc = "我刚在" + GLOBAL_OBJ.GlobalVars.getAppName() + "中打了一把" + (GLOBAL_OBJ.businesses.scenes.CustomRoom.static.NAMES[ MODEL_TABLEINFO.getPlayMode() ] || "") + "  房间号:" + MODEL_TABLEINFO.getCustomTableId();
				}

				GLOBAL_OBJ.LOGD(this._TAG, "截图分享的截图图片路径： "+pic );
				hall.ShareInterface.shareWithPic(title, desc, pic, type);
			}
			else
			{
				GLOBAL_OBJ.LOGD(this._TAG, "截图分享截图失败 " );
			}
		},

		controlShareView:function ( _isShare ) {
			if(_isShare){
				// 大结算背景，多分辨率适配
				var winSize = cc.director.getWinSize();
				var bgSize = this.final_bottom_spr.getContentSize();
				this.final_bottom_spr.setScaleX(winSize.width/bgSize.width);
			}

			this.final_share_node.setVisible(_isShare);
			this.shareNode.setVisible(!_isShare);
			this.continueBtn.setVisible(!_isShare);
			this.txtAlert.setVisible(!_isShare);
			this.roomIdLabel.setVisible(!_isShare);
			this.timeLabel.setVisible(!_isShare);
		},

		// 分享类型
		shareByType:function(type)
		{
			GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.scenes.Custom.VISIT_ITEM, {});

			if (this.sharePicName.length == 0){
				var that = this;
				that.controlShareView(true);
				GLOBAL_OBJ.LOGD(this._TAG, "之前没有截图，要先截图再分享" );
				// 截图
				GLOBAL_FUNCS.screenShot(function (val) {
					that.sharePicName = val;
					that.controlShareView(false);
					that.share(type);
				});
			}
			else{
				// 之前有截图，直接分享
				GLOBAL_OBJ.LOGD(this._TAG, "之前有截图，直接分享" );
				this.share(type);
			}
		}
	});
	//end
})();
