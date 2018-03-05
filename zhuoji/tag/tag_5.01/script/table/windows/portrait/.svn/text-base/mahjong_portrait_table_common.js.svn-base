/*************************************************************
 *  mahjong_portrait_table_common.js
    mahjong_portrait_table_common
 *  mahjong
 	牌桌普通牌桌头像容器（非头像本身）
 *
 *  Created by nick.kai.lee on 16-08-05
 *  特殊说明：


    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var C2S 			      = GLOBAL_OBJ.businesses.network.C2S;
	var GLOBAL_T     	              = GLOBAL_OBJ.table.global;
	var GLOBAL_FUNCS		      = GLOBAL_OBJ.businesses.functions;
	var MODEL_USERS			      = GLOBAL_OBJ.businesses.modules.User.Model;
	var MODEL_TABLEINFO                   = GLOBAL_OBJ.table.models.TableInfo;
	var MODEL_ONLINE                      = GLOBAL_OBJ.table.models.Online;
	var MODEL_CUSTOM                      = GLOBAL_OBJ.table.models.Custom;
	var MODEL_SIT                         = GLOBAL_OBJ.table.models.Sit;
	var MODEL_USER                        = GLOBAL_OBJ.businesses.modules.User.Model;

	GLOBAL_OBJ.table.windows.Portrait.Common = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"table.windows.Portrait.Common",
		ctor: function(_params) {
			this._super(_params);
			this.params = _params;
			this.score = 0;
			this.countdown = null;
		},

		onLoad: function() {
			this._super();
			var that    = this;

			this.isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;

			this.hostSpr.setVisible( false );
			this.bankerSpr.setVisible( false );

			/*
            @ 注册通知*/    
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_SCORE, function(_params){
                if (_params && _params.uid == that.params.uid) {
                	that.updatePortraitCommon( _params.isconnect);
                }else{
                	GLOBAL_OBJ.LOGD(this._TAG,"banker update userInfo");
                }
            }, this);

			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_EVENT, this.onSetChipsByTAbleEvent, this);

            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_OFFLINE, function(_params){

				var isLeave   = MODEL_ONLINE.checkIsLeaved(that.params.sid);
				if(isLeave){//后端校验这个认识否已经离线，离开已经没有这个人的数据了，说明这个人已经离开了，就不在对这个人头像上的状态进行改变了
					return;
				}

            	var isOffLine = !MODEL_ONLINE.checkIfOnline(that.params.sid);

				if (that.params.sid == GLOBAL_T.MYSEAT){
					//自己的离线不再显示。
					return;
				}

				that.offlineSpr.setVisible(isOffLine);
				that.imgLeft.setVisible(false);

				if (!isOffLine){
					//只有在线状态，才校验是否已经离开
					that.imgLeft.setVisible(MODEL_ONLINE.checkIfLeft(that.params.sid));
				}
            }, this);

			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_RENSHU_LEAVE, this.showRenshuLeave, this);
			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_TRUSTEE_ISSHOW, this.showTrustee, this);
            
			var userName = GLOBAL_OBJ.businesses.modules.User.Model.getName(this.params.uid);
			if (userName.length > 4){
				userName = userName.substr(0,4) + "..";
			}
			this.txtUserName.setString(userName);


			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_SHOWZHUANGSPR, this.showZhuangSpr, this);
			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_PIAO_ZHUANG, this.piaoZhuang, this);

			// 要求头像上没有倒计时进度条，所以注释掉，估计以后又回恢复回来
			// GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_COUNTDOWNTX, this.playCountdownTX, this);

			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.SHOW_PROGRESS, this.showProgress, this);
			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.HIDE_PROGRESS, this.hideProgress, this);

			this.score = this.updateScore();
			this.addPlayerPortraitNode();

			this.showLastBanker();
		},

		showProgress:function (val) {
			if (val == this.params.sid && this.countdown){
				this.countdown.setVisible(true);
			}
		},

		hideProgress:function (val) {
			if (val == this.params.sid && this.countdown){
				this.countdown.setVisible(false);
			}
		},
		
		removeBanker:function () {
			if (this._bankerAni && this._bankerAni.rootNode.parent == this['bankerSpr']){
				GLOBAL_OBJ.tableEffectPlayer.removeEffect(this._bankerAni);
                GLOBAL_OBJ.LOGD(this._TAG, "------------ 删除庄 : " + this.params.sid);
			}
			this._bankerAni = null;
			this['bankerSpr'].setVisible(false);
		},

		showBanker:function () {
			if (!this._bankerAni){
				var ptBanker = cc.p(this['bankerSpr'].width/2, this['bankerSpr'].height/2);
				this._bankerAni = GLOBAL_OBJ.tableEffectPlayer.play(this['bankerSpr'], GLOBAL_OBJ.RES.MJ_ZM_PIAOZHUANG01_CCBI, ptBanker, null, null, true);
			}
			this['bankerSpr'].setVisible(true);
		},

		//显示冲锋鸡icon
		showChong:function(_index){
			if (this._chong){
				GLOBAL_OBJ.LOGD(this._TAG, "showChong return");
				return;
			}
			GLOBAL_OBJ.LOGD(this._TAG, "showChong _index = " + _index);
			this._chong = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES.GYMJ_ICON_CHONG_PNG);
			//_index: 1 冲锋鸡 2 责任鸡
			if (_index == 1){
				GLOBAL_FUNCS.textureChange(this._chong, GLOBAL_OBJ.RES.GYMJ_ICON_CHONG_PNG);
			}else if (_index == 2){
				GLOBAL_FUNCS.textureChange(this._chong, GLOBAL_OBJ.RES.GYMJ_ICON_ZE_PNG);
			}
			this._chong.setAnchorPoint(cc.p(0,0));
			var chong_pos = this['chongNode'].getPosition();
			var ting_pos = this['tingNode'].getPosition();
			this._chong.setPosition(chong_pos);
			// this._chong.setPosition(cc.p(0,0));
			this['chongTingNode'].addChild(this._chong);
			// this['chongNode'].addChild(this._chong);
			//GLOBAL_FUNCS.addToParent(this._chong,this['chongTingNode'],chong_pos);

			if (this._ting){
				this._ting.setPosition(ting_pos);
			}
		},
		//移除冲锋鸡icon
		removeChong:function(){
			if (this._chong) {
				this._chong.removeFromParent();
			}
			this._chong = null;
		},

		//显示听icon
		showTing:function(_type){
			if (this._ting){
				return;
			}
			GLOBAL_OBJ.LOGD(this._TAG, "show_Ting _type = " + _type);

			var imgPath = ""
			if (_type == 1) {
				// 软报听 blue
				imgPath = GLOBAL_OBJ.RES.GYMJ_ICON_TING_BLUE_PNG;
			}
			else if (_type == 2) {
				// 硬报听
				imgPath = GLOBAL_OBJ.RES.GYMJ_ICON_TING_RED_PNG;
			}

			this._ting = cc.Sprite.createWithSpriteFrameName(imgPath);

			this._ting.setAnchorPoint(cc.p(0,0));

			var chong_pos = this['chongNode'].getPosition();
			var ting_pos = this['tingNode'].getPosition();

			this._ting.setPosition(chong_pos);
			this['chongTingNode'].addChild(this._ting);

			if (this._chong){
				this._ting.setPosition(ting_pos);
			}
		},

		//移除听
		removeTing:function(){
			if (this._ting) {
				this._ting.removeFromParent();
			}
			this._ting = null;
		},

		onSetChipsByTAbleEvent:function () {
			this.score = this.updateScore();
		},

		// onSelfOffLine:function(){
		// 	this.offlineSpr.setVisible(true);
		// 	this.imgLeft.setVisible(false);
		// },

		onCleanup:function(){
			this._super();

			this.removeBanker();
			this.removeChong();
			this.removeTing();

			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
			
		},

		/*
		弹窗弹出完毕
		*/
		onEase:function(){
		},

		/*
		touch响应，基类重载
		*/
		onTouchBegan:function(_touch,_event){
			this._super();
 			return false;
		},

		// 是否监听物理返回键，默认监听。不监听的在子类中重写返回false即可
		isKeyBackListenEnabled:function(){
			return false;
		},

		updateScore:function () {
			var score,scoreText;

			if (this.isCreate){
				score = MODEL_USERS.getCustomScore(this.params.uid);
				scoreText = score + "";
			}
			else{
				score = MODEL_USERS.getTableCoin(this.params.uid);
				scoreText = GLOBAL_FUNCS.formatGold(score);
			}

			GLOBAL_OBJ.LOGD(this._TAG, "********* 更新头像下金币：" + scoreText);
			this.chipLabel.setString( scoreText );
			return score;
		},

		updatePortraitCommon:function( _isconnect ){
			var score = this.updateScore();
            var changVal = score - this.score;
            if (changVal != 0) {
                this.score = score;
            }
            this.hostSpr.setVisible(  this.params.uid == MODEL_TABLEINFO.getCustomTableHostUid() );
		},

		onCheckDetail:function(){
			var callFunc = this.params.callFunc || function(){};
			callFunc();
		},

		showRenshuLeave:function ( _data ) {
			this.imgLeft.setVisible(this.params.sid == _data);
		},

		showTrustee:function ( _data ) {
			GLOBAL_OBJ.LOGD("showTrustee_data:" + JSON.stringify(_data));
			if(_data.seatId ==this.params.sid){
				this.protraitTrustee.setVisible(_data.isTrustee);
			}
		},

		showZhuangSpr:function () {
			if (this.params.sid == MODEL_TABLEINFO.getBankerSeatId()){
				this.showBanker();
			}
		},

		piaoZhuang:function () {
			if (this.params.sid == MODEL_TABLEINFO.getBankerSeatId())
			{
				var tableScence = hall.SceneManager.getCurrentController();
				if (tableScence instanceof GLOBAL_OBJ.table.scenes.Table.Scene){

					var ptStart;

					if (!this.isCreate){
						ptStart = tableScence['windNode'].getPosition();
					}
					else{
                        //好友桌
						if (MODEL_TABLEINFO.getLastBankerId() > -1){
							if (MODEL_TABLEINFO.getLastBankerId() == MODEL_TABLEINFO.getBankerSeatId()){
								//连庄，不再飞
								GLOBAL_OBJ.lastBankerPortrait = null;
								GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_PIAO_ZHUANG_COMPLETE,null);
								return;
							}
							var bkCtn = GLOBAL_OBJ.lastBankerPortrait['bankerSpr'];
							ptStart = bkCtn.parent.convertToWorldSpace(bkCtn.getPosition());
							GLOBAL_OBJ.lastBankerPortrait.removeBanker();
							GLOBAL_OBJ.lastBankerPortrait = null;
						}
						else{
							ptStart = tableScence['windNode'].getPosition();
						}
					}

					this.icoZhuangFly(ptStart);
				}
			}
		},
		
		icoZhuangFly:function (startPt) {

			var bankerSpr = this['bankerSpr'];
            var endPt = bankerSpr.parent.convertToWorldSpace(bankerSpr.getPosition());

			var tableScence = hall.SceneManager.getCurrentController();
			var icoZhuang = GLOBAL_OBJ.tableEffectPlayer.play(tableScence.getRootNode(), GLOBAL_OBJ.RES.MJ_ZM_PIAOZHUANG_CCBI, startPt, null, null, true, 1, "play");

			var moveToAct = cc.EaseExponentialInOut.create(cc.MoveTo.create(0.5, endPt));
			var self = this;

			var ptBanker = cc.p(bankerSpr.width/2, bankerSpr.height/2);
			var callBack = cc.CallFunc.create(function () {

				self.showBanker();
				GLOBAL_OBJ.tableEffectPlayer.removeEffect(icoZhuang);
				GLOBAL_OBJ.tableEffectPlayer.play(bankerSpr, GLOBAL_OBJ.RES.MJ_ZM_PIAOZHUANG_CCBI, ptBanker, null, null, false, 1, "playShow");

				GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_PIAO_ZHUANG_COMPLETE,null);
			});
			icoZhuang.rootNode.runAction(cc.Sequence.create(cc.DelayTime.create(0.9),moveToAct,cc.DelayTime.create(0.6),callBack));
		},

		addPlayerPortraitNode:function () { // 添加头像玩家坐下（doSit）和玩家准备（OK）的监听
			var that 		= this;
			var localSeatId = this.params.sid;

			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_SIT, function(){
				var sid = MODEL_SIT.getActiveLocalSeatId();
				var uid = MODEL_SIT.getUserIdByLocalSeatId( sid );
				if (that.portraitNode.getChildrenCount() == 0 && uid > 0 && localSeatId == sid) {
					GLOBAL_OBJ.businesses.modules.User.Portrait.produce( uid, GLOBAL_OBJ.businesses.windows.consts.C_PORTRAIT_BASIC_WINDOW, that.portraitNode, true);
					//刷新
					that.updateIp();
				}
			}, this);

			GLOBAL_OBJ.bkernel.utils.Notification.listen(
				GLOBAL_OBJ.table.Events.UPDATE_CUSTOM_TABLE_READY,
				function(){
					GLOBAL_OBJ.LOGD(this._TAG,"1111UPDATE_CUSTOM_TABLE_READY 头像");
					var sid  = MODEL_CUSTOM.getActiveLocalSeatId();
					if (localSeatId == sid) {
						that.readySpr.setVisible( true );
						//只有自己的位置，才有这个函数。
						if (that.readyFunction){
							that.readyFunction();
						}
					}
				},
				this
			);
		},

        showLastBanker:function () {
            var localSeatId = this.params.sid;
            if (this.isCreate && !MODEL_TABLEINFO.getReconnect() && MODEL_TABLEINFO.getLastBankerId()== localSeatId){
                //添加上一次庄
                GLOBAL_OBJ.LOGD(this._TAG, "============添加上一次庄 : " + localSeatId);
                this.showBanker();
                GLOBAL_OBJ.lastBankerPortrait = this;
            }
        },

		updateIp:function(){
			var localSeatId = this.params.sid;
			var uid      	= MODEL_SIT.getUserIdByLocalSeatId( localSeatId );
			var host     	= MODEL_TABLEINFO.getCustomTableHostUid();

			//只有第一局，玩家姓名+IP
			if(MODEL_TABLEINFO.getCustomTablePlayTimes() == 0){
				var userIp = MODEL_USER.getIP(uid);
				if(userIp && userIp.length > 0){
					this.ipLabel.setString( "IP: "+MODEL_USER.getIP(uid) );
				}else{
					this.ipLabel.setString("");
				}
				//只变更一次，刷新触发，不会在进行更新
				if(this.ipLabel.isVisible()==false){
					var _x = this.ipLabel.getPositionX();
					var _xBuffer=this.portraitRegionNode.getContentSize().width/2;
					if(localSeatId == 1){
						//IP 右对齐
						this.ipLabel.setPositionX(_x+_xBuffer);
						this.ipLabel.setAnchorPoint(cc.p(1,0.5));
						this.ipLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_RIGHT);
					}else if(localSeatId == 3){
						//IP 左对齐
						this.ipLabel.setPositionX(_x-_xBuffer);
						this.ipLabel.setAnchorPoint(cc.p(0,0.5));
						this.ipLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
					}
				}
				this.ipLabel.setVisible(true);
			}

			//房主默认准备
			if (uid == host && MODEL_TABLEINFO.getCustomTablePlayTimes() == 0) {
				this.readySpr.setVisible( true );
			}

			//金币场逻辑判断
			if (MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Normal || MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Match){
				this.ipLabel.setVisible(false);
			}
		},

		playCountdownTX:function ( _data ) {

			var that = this;
			var data = _data;
			if(that.countdown){
				that.countdown.removeFromParent();
				that.countdown = null;
			}
			var portraitFunc = function () {
				var act1 = cc.ScaleTo.create(0.1, 1.2, 1.2);
				var act2 = cc.ScaleTo.create(0.1, 1.0, 1.0);
				that.portraitRegionNode.runAction(cc.Sequence.create(act1, act2));
			};
			if(this.params.sid == data){
				var _progress = cc.ProgressTimer.create(cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES.ZM_GENERAL_HEADFRAME_PROGRESS_PNG));
				_progress.setType(cc.ProgressTimer.TYPE_RADIAL);

				that.animNode.addChild(_progress);
				_progress.setMidpoint(cc.p(0.5,0.5));//设置旋转圆的中心点
				_progress.setReverseDirection(true); //设置反向
				// _progress.setRotation(-36);
				_progress.y -= 10;

				_progress.runAction(
					cc.Sequence.create(
						cc.CallFunc.create(function(){ _progress.setColor(cc.color(50,242,77) ) } ),
						cc.ProgressFromTo.create(4.8, 100, 60),
						cc.CallFunc.create(function(){ _progress.setColor(cc.color(243,203,66) ) } ),
						cc.ProgressFromTo.create(3.6, 60, 30),
						cc.CallFunc.create(function(){ _progress.setColor(cc.color(248,30,50) ) } ),
						cc.ProgressFromTo.create(3.6, 30,0),
						cc.CallFunc.create(function(){
							that.countdown.removeFromParent();
							that.countdown = null;
							portraitFunc();
						})
					)
				);

				this.countdown = _progress;
			}
		}
	});
	//end

	GLOBAL_OBJ.table.windows.Portrait.Common.test = function(_uid){
        var wnd = GLOBAL_OBJ.bkernel.windows.Factory.produce(
            GLOBAL_OBJ.table.windows.consts.C_PORTRAIT_TABLE_COMMON, { uid:_uid }, 
            hall.SceneManager.getCurrentController().getRootNode());
	};

})();