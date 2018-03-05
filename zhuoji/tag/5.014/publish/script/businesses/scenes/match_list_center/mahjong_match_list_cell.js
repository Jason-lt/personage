/*****************************************
 *  mahjong_match_list_cell.js
    比赛列表cell
 *  mahjong
 *
 *  Created by zengxx on 16-03-26

 */

(function(){
    var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
	var GLOBAL_TIMER = GLOBAL_OBJ.bkernel.utils.GlobalTimer;
	var MODEL = GLOBAL_OBJ.businesses.scenes.MatchListCenter.Model;
	var STATIC = GLOBAL_OBJ.businesses.scenes.MatchListCenter.static;
	var HTTP_KEY = "MATCHLISTCELL";

	GLOBAL_OBJ.businesses.scenes.MatchListCenter.Cell = GLOBAL_OBJ.bkernel.base.BaseCellController.extend({
		_TAG:'businesses.scenes.MatchListCenter.Cell',

		ctor:function(_index,_config){
			this._super();
			this.mIndex  = _index;
			this.mConfig = _config;
			this.init(GLOBAL_OBJ.RES.MATCHLISTCELL_CCBI);
		},

		init:function(_ccb){
			this._super(_ccb);
		},

		onLoad:function(){
			this._super();
			var that = this;

			var ___f_click    = (function(){
                var interrupt = false;
                return [ function(){
                    if (!interrupt) {
                    	GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.businesses.windows.consts.C_MATCH_INFO, {"cellIndex":that.mIndex}, STATIC.GET.curSceneRootNode());
                    }
                },
                function(){
                	if (!interrupt){
                		var roomId = MODEL.getRoomIdByTabIndexAndCellIndex(STATIC.index, that.mIndex);
                		if (roomId != -1){
				    		GLOBAL_OBJ.businesses.network.C2S.requestMatchSignin(roomId);
				    		GLOBAL_OBJ.businesses.network.C2S.requestMatchUpdate(roomId, MODEL.getMatchInstIdByRoomId(roomId));
				    	}
                	}
                },
                function(){
                	if (!interrupt){
                		var roomId = MODEL.getRoomIdByTabIndexAndCellIndex(STATIC.index, that.mIndex);
                		if (roomId != -1){
				    		GLOBAL_OBJ.businesses.network.C2S.requestMatchSignout(roomId, MODEL.getMatchInstIdByRoomId(roomId));
				    		GLOBAL_OBJ.businesses.network.C2S.requestMatchUpdate(roomId, MODEL.getMatchInstIdByRoomId(roomId));
				    	}
                	}
                },
                function(){
                	if (!interrupt){
                		STATIC.CLICK.enterGame({
                			"matchState":MODEL.getStateByTabIndexAndCellIndex(STATIC.index, that.mIndex),
                			"playMode":MODEL.getPlayModeByTabIndexAndCellIndex(STATIC.index, that.mIndex),
                			"roomId":MODEL.getRoomIdByTabIndexAndCellIndex(STATIC.index, that.mIndex)
                		});
                	}
                },
                function(){
                    interrupt = true;
                },
                function(){
                    interrupt = false;
                } ];
            })();

            // cell btn
            GLOBAL_OBJ.bkernel.extend.Node.bind_scale_button_ext(this.cellBtnNode, ___f_click[0], 
            	true, this.mConfig.container, ___f_click[4], ___f_click[5]);

           	// 其他按钮
            GLOBAL_OBJ.bkernel.extend.Node.bind_scale_button_ext(this.signinNode, ___f_click[1],
            	true, this.mConfig.container, ___f_click[4], ___f_click[5]);
            GLOBAL_OBJ.bkernel.extend.Node.bind_scale_button_ext(this.signoutNode, ___f_click[2],
            	true, this.mConfig.container, ___f_click[4], ___f_click[5]);
            GLOBAL_OBJ.bkernel.extend.Node.bind_scale_button_ext(this.enterMatchNode, ___f_click[3],
            	true, this.mConfig.container, ___f_click[4], ___f_click[5]);
            GLOBAL_OBJ.bkernel.extend.Node.bind_scale_button_ext(this.backMatchNode, ___f_click[3],
            	true, this.mConfig.container, ___f_click[4], ___f_click[5]);

            /*
			注册图片http下载
			*/
			ty.AsyncImgDownload.addAsyncImgDownloadObserver(
            	HTTP_KEY+this.getObjectIdentifier()
            	, this
            	, this.onFinishDownload);

            // 底注类型节点组
            this.anteGroup  = GLOBAL_FUNCS.nodeGroup("setVisible",[false,true],[this.anteSpr0,this.anteSpr1]);
            // 是否开始节点组
            this.startGroup = GLOBAL_FUNCS.nodeGroup("setVisible",[false,true],[this.startedLabel,this.unStartNode]);
            // 按钮状态节点组
            this.btnGroup   = GLOBAL_FUNCS.nodeGroup("setVisible",[false,true],[this.signinNode,this.signoutNode,this.enterMatchNode,this.backMatchNode,this.matchOverSpr,this.enteringLabel]);
		},

		onEnter:function(){
			this._super();
		},

		onCleanup:function(){
			GLOBAL_OBJ.bkernel.utils.GlobalTimer.clean(this);
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);

			/*
			移除图片http下载
			*/
			ty.AsyncImgDownload.removeAsyncImgDownloadObserver(
                HTTP_KEY+this.getObjectIdentifier()
                , this
                , this.onFinishDownload);
			this._super();
		},

		onFinishDownload:function(_object, _params){
			var tex  = cc.textureCache.addImage(_object.path);
			if (tex instanceof cc.Texture2D){
				var size = tex.getContentSize();
				this.objectSpr.setTexture(tex);
				this.objectSpr.setTextureRect(cc.rect(0, 0, size.width, size.height));
			}
		},

		update:function(_index, _config){
			this.mIndex  = _index;
			this.mConfig = _config;

			this.anteGroup.setVisible(MODEL.getAnteTypeByTabIndexAndCellIndex(STATIC.index, this.mIndex)-1);

			// 实物图片下载
			var url = MODEL.getUrlByTabIndexAndCellIndex(STATIC.index, this.mIndex);
			if (url != ""){
				ty.AsyncImgDownload.downloadImgAsync(
                HTTP_KEY+this.getObjectIdentifier()
                , url
                , "games/" + GLOBAL_OBJ.GAMENAME + "/img/match_list_center/"
                , {});
			}

			// 比赛名
			this.matchNameLabel.setString(MODEL.getNameByTabIndexAndCellIndex(STATIC.index, this.mIndex));

			// 玩法
			var res = "";
			switch(MODEL.getPlayModeByTabIndexAndCellIndex(STATIC.index, this.mIndex)){
				case STATIC.PLAYMODE.SiChuan:
					res = GLOBAL_OBJ.RES["QUESHEN_LIST_TYPE_JDSC_PNG"]; // 四川
					break;
				case STATIC.PLAYMODE.GuoBiao:
				case STATIC.PLAYMODE.GuoBiaoMatch:
					res = GLOBAL_OBJ.RES["QUESHEN_LIST_TYPE_DZGB_PNG"];  // 国标
					break;
				case STATIC.PLAYMODE.GuoBiao1v1:
				case STATIC.PLAYMODE.GuoBiao1v1Match:
					res = GLOBAL_OBJ.RES["QUESHEN_LIST_TYPE_ERMJ_PNG"];  // 二人
					break;
				case STATIC.PLAYMODE.HaErBin:
					res = GLOBAL_OBJ.RES["QUESHEN_LIST_TYPE_HEB_PNG"];   // 哈尔滨
					break;
				case STATIC.PLAYMODE.XueLiuChengHe:
					res = GLOBAL_OBJ.RES["QUESHEN_LIST_TYPE_XLCH_PNG"];  // 血流成河
					break;
				case STATIC.PLAYMODE.SiChuanDq:
					res = GLOBAL_OBJ.RES["QUESHEN_LIST_TYPE_XZDD_PNG"];  // 血战到底
					break;
				default:
					break;
			}
			if (res != ""){
				GLOBAL_FUNCS.textureChange(this.playModeSpr, res);
			}

			// 人数
			this.personLabel.setString(MODEL.getPersonByTabIndexAndCellIndex(STATIC.index, this.mIndex));

			// 比赛状态
			this.refreshMatchState();
			// 按钮状态
			this.refreshBtnState();
		},

		// 刷新比赛状态
		refreshMatchState:function(){
			var that      = this;
			var state     = MODEL.getStateByTabIndexAndCellIndex(STATIC.index, this.mIndex);
			var matchType = MODEL.getMatchTypeByTabIndexAndCellIndex(STATIC.index, this.mIndex);

			// 开赛倒计时
			var __countdownTime = function(_event){
				var time = MODEL.getStartTimeByTabIndexAndCellIndex(STATIC.index, that.mIndex) - _event.time;
				if (time < 0){ // 已经到了开赛时间
					if (MODEL.hasSigninedByRoomId(MODEL.getRoomIdByTabIndexAndCellIndex(STATIC.index, this.mIndex))==1){ // 已经报名了
						that.btnGroup.setVisible(5);
					}
					GLOBAL_OBJ.bkernel.utils.Notification.ignore(GLOBAL_OBJ.bkernel.Events.TICK,__countdownTime,that);

					switch(matchType){
						case STATIC.MATCHTYPE.OLD:
							GLOBAL_OBJ.businesses.network.C2S.requestMatchState(MODEL.getRoomIdByTabIndexAndCellIndex(STATIC.index,that.mIndex),MODEL.getMatchIdByTabIndexAndCellIndex(STATIC.index, that.mIndex));
							break;
						case STATIC.MATCHTYPE.MTT:
							// 开赛了马上请求下一场比赛
							GLOBAL_OBJ.businesses.network.C2S.requestMatchInfo(MODEL.getRoomIdByTabIndexAndCellIndex(STATIC.index, that.mIndex));
							break;
						default:
							break;
					}
				}else{
					var timeStr = GLOBAL_FUNCS.formatTimeString("ms", time);
					that.timeLabel0.setString(timeStr.substr(0,2));
					that.timeLabel1.setString(timeStr.substr(2,2));
				}
			};

			if (state == STATIC.MATCHSTATE.BeforeMatch){ // 开赛前
				this.startGroup.setVisible(1);
				// 距离开赛剩余时间
				var time = MODEL.getStartTimeByTabIndexAndCellIndex(STATIC.index, this.mIndex) - GLOBAL_OBJ.bkernel.utils.GlobalTimer.getTime();
				if (time >= 3600){ // 1小时以外显示周几(当天就显示“今天”,明天显示"明天")，1小时以内倒计时
					this.timeDescLabel.setString(GLOBAL_FUNCS.getDayForTimeStamp(MODEL.getStartTimeByTabIndexAndCellIndex(STATIC.index, this.mIndex)));
					this.playAnim("timeColorBrown");
					
					var timeStr = GLOBAL_FUNCS.formatTimeForTimeStamp("hm", MODEL.getStartTimeByTabIndexAndCellIndex(STATIC.index, this.mIndex));
					this.timeLabel0.setString(timeStr.substr(0,2));
					this.timeLabel1.setString(timeStr.substr(2,2));

					// 设置闹钟，到了1小时开启倒计时
					GLOBAL_OBJ.bkernel.utils.GlobalTimer.clean(this);
					GLOBAL_OBJ.bkernel.utils.GlobalTimer.set(time-3600+1, function(){
						that.timeDescLabel.setString("即将开始");
						that.playAnim("timeColorGreen");

						// 开启倒计时
						GLOBAL_OBJ.bkernel.utils.Notification.ignore(GLOBAL_OBJ.bkernel.Events.TICK,__countdownTime,that);
						GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.bkernel.Events.TICK,__countdownTime,that);
					}, this);
				}else if(time > 0){
					this.timeDescLabel.setString("即将开始");
					this.playAnim("timeColorGreen");

					// 开启倒计时
					GLOBAL_OBJ.bkernel.utils.Notification.ignore(GLOBAL_OBJ.bkernel.Events.TICK,__countdownTime,this)
					GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.bkernel.Events.TICK,__countdownTime,this);
				}else{
					GLOBAL_OBJ.businesses.network.C2S.requestMatchInfo(MODEL.getRoomIdByTabIndexAndCellIndex(STATIC.index, this.mIndex));
				}
			}else{
				this.startGroup.setVisible(0);

				switch(state){
					case STATIC.MATCHSTATE.DurationOfMatch:
						this.startedLabel.setString("比赛中");
						break;
					case STATIC.MATCHSTATE.WaittingMatch:
						this.startedLabel.setString(matchType==STATIC.MATCHTYPE.OLD?"等待比赛结束":"配桌中");
						break;
					case STATIC.MATCHSTATE.MatchEnd:
						this.startedLabel.setString("比赛结束");
						if (matchType==STATIC.MATCHTYPE.OLD){ // 老比赛比赛结束了再请求刷新
							GLOBAL_OBJ.businesses.network.C2S.requestMatchInfo(MODEL.getRoomIdByTabIndexAndCellIndex(STATIC.index, this.mIndex));
						}
						break;
					default:
						break;
				}

				GLOBAL_OBJ.businesses.network.C2S.requestMatchInfo(MODEL.getRoomIdByTabIndexAndCellIndex(STATIC.index, this.mIndex));
			}
		},

		// 刷新按钮状态
		refreshBtnState:function(){
			var state     = MODEL.getStateByTabIndexAndCellIndex(STATIC.index, this.mIndex);
			var matchType = MODEL.getMatchTypeByTabIndexAndCellIndex(STATIC.index, this.mIndex);
			var roomId    = MODEL.getRoomIdByTabIndexAndCellIndex(STATIC.index, this.mIndex);

			if (state == STATIC.MATCHSTATE.MatchEnd){ // 比赛结束
				this.btnGroup.setVisible(4);
			}else{
				switch(matchType){
					case STATIC.MATCHTYPE.OLD:
						if (MODEL.hasPlayedByRoomId(roomId)==0){ // 还没打过
							this.btnGroup.setVisible(2);
							this.conditionLabel.setString(MODEL.getConditionByTabIndexAndCellIndex(STATIC.index, this.mIndex));
						}else{
							this.btnGroup.setVisible(3);
						}
						break;
					case STATIC.MATCHTYPE.MTT:
						if (MODEL.hasSigninedByRoomId(roomId)==1){ // 已经报名了
							var time = MODEL.getStartTimeByTabIndexAndCellIndex(STATIC.index, this.mIndex) - GLOBAL_TIMER.getTime();
							this.btnGroup.setVisible(time<0?5:1);
						}else{
							this.btnGroup.setVisible(0);
							this.signFeeLabel.setString(MODEL.getFeesByTabIndexAndCellIndex(STATIC.index, this.mIndex));
						}
						break;
					default:
						break;
				}
			}
		}
	});
})();