/*************************************************************
 *  mahjong_match_result_scene.js
 *  mahjong
    比赛结算场景
 *
 *  Created by xujing on 17-11-14
 *  特殊说明：

    使用方法:
 */

(function(){
	"use strict";
    var GLOBAL_OBJ       = guiyang;
	var GLOBAL_FUNCS     = GLOBAL_OBJ.businesses.functions;
	var MODEL_USER       = GLOBAL_OBJ.businesses.modules.User.Model;
	var MODEL_MATCH;

	GLOBAL_OBJ.businesses.scenes.Match.ResultScene = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"table.scenes.RoomList.ResultScene",
		ctor: function() {
			MODEL_MATCH = GLOBAL_OBJ.businesses.scenes.Match.Model;
			this._super();
			this._info = MODEL_MATCH.getMatchResultData();
            this.init(GLOBAL_OBJ.RES.MAHJ_MATCH_RESULT_CCBI);

			// {
			// 	"cmd":"room",
			// 	"result":{
			// 		"info":"比赛：血流成河1元红包赛
			// 		名次：第64名
			// 		胜败乃兵家常事 大侠请重新来过！",
			// 		"gameId":701,
			// 		"mcount":128,
			// 		"rewardDesc":"",
			// 		"reward":[  //结算奖励，支持多个
			// 			{"name":"金币", "count":1000, "icon":"user:chip", "iconPath":"http://........png"},
			// 			{"name":"金币", "count":1000, "icon":"user:chip", "iconPath":"http://........png"},
			// 			{"name":"金币", "count":1000, "icon":"user:chip", "iconPath":"http://........png"}
			// 		],
			// 		"mname":"血流成河1元红包赛",
			// 		"matchId":701221,
			// 		"userId":11248,
			// 		"rank":64,
			// 		"date":"2017-11-14",
			// 		"reason":0,
			// 		"time":"11:40",
			// 		"action":"over",
			// 		"roomId":7012201000
			// 	}
			// }
		},

		onLoad: function() {
			this._super();

            var playMode = GLOBAL_OBJ.GlobalVars.getCurPlayMode();
			var bottomImg;

            var vsize = cc.director.getWinSize();

            var bgSize = this['img_bg'].getContentSize();
            var scal = Math.max(vsize.width/bgSize.width, vsize.height/bgSize.height);
            this['img_bg'].setScale(scal);

            if (playMode == "jipinghu") {
            	bottomImg = GLOBAL_OBJ.RES.GDMJ_SHARE_TITLE_PNG;
			}
            else if (playMode == "dazhong") {
                bottomImg = GLOBAL_OBJ.RES.DZMJ_SHARE_BOTTOM_PNG;
			}
            GLOBAL_FUNCS.textureChange(this.imgMatchBottom, bottomImg);

			this._initDesc(this._info);
			this._initDate(this._info);

			//添加奖励
			if (this._info.reason == 0){
				//输了，显示info
				this['txtReward'].setString(this._info.info);
			}
			else{
				var rewardList = this._info.rewards;
				if (rewardList && rewardList.length > 0){
					var rewardObj;
					var rewardCell,rewardCellNode;
					for (var i = 0; i < rewardList.length; i++){
						rewardObj = rewardList[i];
						//添加奖励Cell
						rewardCell = new GLOBAL_OBJ.businesses.scenes.Match.ResultCell(rewardObj);
						rewardCellNode = rewardCell.getRootNode();
						this['nodeRewardList'].addChild(rewardCellNode);
						rewardCellNode.x = i * rewardCellNode.width;
					}

					this['nodeRewardList'].width = rewardList.length * rewardCellNode.width;
				}
				else{
					this['txtReward'].setString(this._info.rewardDesc);
				}
			}

			this['label_rank'].setString(this._info.rank + "");
			this['node_share'].setVisible(false);
			this['node_btn'].setVisible(true);

			var pwidth = this['btnDoAgain'].parent.width;

			var curDes = MODEL_MATCH.getCurDes();

			if (curDes.type === GLOBAL_OBJ.MatchType.stage_match){
				//定时赛，不显示下一局
				this['continuedhBtn_fnt'].setVisible(false);
				this['btnDoAgain'].setVisible(false);

				if(GLOBAL_FUNCS.isCanShareWeiXin()){//配置了微信分享
					this['btnShare'].setVisible(true);
					this['shareBtn_fnt'].setVisible(true);

					this['btnShare'].x = this['shareBtn_fnt'].x = pwidth * 0.5;
				}else {
					this['btnShare'].setVisible(false);
					this['shareBtn_fnt'].setVisible(false);
				}
			}
			else{
				if(GLOBAL_FUNCS.isCanShareWeiXin()){//配置了微信分享
					this['btnShare'].setVisible(true);
					this['shareBtn_fnt'].setVisible(true);

					this['continuedhBtn_fnt'].x = this['btnDoAgain'].x = pwidth * 0.63;
				}else {
					this['btnShare'].setVisible(false);
					this['shareBtn_fnt'].setVisible(false);

					this['continuedhBtn_fnt'].x = this['btnDoAgain'].x = pwidth * 0.5;
				}
			}
		},

		_checkTouch:function(){
			if (this._noTouched) return false;
			this._noTouched = true;
			//添加时间调度,1.5秒后恢复按钮可点击
			ty.Timer.setTimer(this, this._updateTouch, 1.5, 0, 0);
			return true;
		},

		_updateTouch:function(){
			delete this._noTouched;
		},

		// 描述文本 ## 恭喜谁谁谁在比赛中获得 ##
		_initDesc:function(info){
			this['label_userName'].setString(MODEL_USER.getName(info.userId));
			this['label_matchName'].setString(' [' + info.mname + '] ');

			this['label_gongxi'].x = 0;
			this['label_userName'].x = this['label_gongxi'].width;
			this['label_zai'].x = this['label_userName'].x + this['label_userName'].width;
			this['label_matchName'].x = this['label_zai'].x + this['label_zai'].width;
			this['label_ronghuo'].x = this['label_matchName'].x + this['label_matchName'].width;

			this['node_desc'].width = this['label_ronghuo'].x + this['label_ronghuo'].width;
		},

		_initDate:function(info){
			this['label_time'].setString(info.date + ' ' + info.time);
		},

		// 按照规定大小设置图片
		_setImgWithSize : function (sprite, w, h) {
			var s = sprite.getContentSize();
			sprite.setScale(Math.min(w/s.width, h/s.height));
		},

		_onNext:function(){
			if (!this._checkTouch()) return;
			hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);

			var curDes = GLOBAL_OBJ.businesses.scenes.Match.Model.getMatchRoomDes(this._info.roomId, this._info.matchId);
			if (curDes.type != GLOBAL_OBJ.MatchType.stage_match){
				//发送报名消息
				GLOBAL_OBJ.businesses.network.C2S.requestMatchSignin(this._info.roomId, this._info.feeIndex, this._info.matchId);
			}
			else{
				this._toMatchList();
			}
		},

		_onShare:function(){
			if (!this._checkTouch()) return;
			hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);
			var self = this;
			this._share(function(params){
				self.rootNode.scheduleOnce(function(){
					hall.ShareInterface.shareWithPic(params.title, params.des, params.pic, hall.ShareInterface.SHARE2WEIXIN);
				}, 0.2);
			});
		},

		// 获取分享图片等数据
		_share:function(callBackFun){
			var winSize = cc.Director.getInstance().getWinSize();
			var screenTexture = new cc.RenderTexture(winSize.width, winSize.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888);
			this['btn_back'].setVisible(false);
			this['node_btn'].setVisible(false);
			this['node_share'].setVisible(true);
			screenTexture.begin();
			this.rootNode.visit();
			screenTexture.end();
			this['node_share'].setVisible(false);
			this['btn_back'].setVisible(true);
			this['node_btn'].setVisible(true);

			var name = 'tuyoo_mahj_screen_shot.jpg';
			var result = screenTexture.saveToFile(name, cc.IMAGE_FORMAT_JPEG);
			if (result) {
				var pic = jsb.fileUtils.getWritablePath() + name;
				GLOBAL_OBJ.LOGD(this._TAG, "_share :" + pic);
				if(ty.FileManager.checkFileExist(pic)){
					var pars = {
						'title' : "途游麻将，就是爽！",
						'des' : "途游麻将，就是爽！",
						'pic' : pic
					};
					callBackFun(pars);
				}
			}
		},

		_toMatchList:function () {
			this.getRootNode().removeFromParent();
			var playMode = GLOBAL_OBJ.GlobalVars.getCurPlayMode();
			GLOBAL_OBJ.businesses.utils.Scene.jumpToMatch(playMode);
		},

		_onBack:function(){
			if (!this._checkTouch()) return;
			hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);
			this._toMatchList();
		},

		onCleanup:function() {
			this._super();

            GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
            ty.NotificationCenter.ignoreScope(this);
		}

	});

})();