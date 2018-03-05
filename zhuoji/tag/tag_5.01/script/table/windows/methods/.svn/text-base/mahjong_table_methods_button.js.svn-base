/*************************************************************
 *  mahjong_table_methods_button.js
    mahjong_table_methods_button
 *  mahjong
 	麻将牌 吃碰杠主动操作按钮
 *
 *  Created by nick.kai.lee on 16-06-12
 *  特殊说明：
	目前分3大类：
	1.吃碰杠（文字+牌型）
	2.纯文字类，听 抢听，过，取消等
	3.文字+描述，胡+番数
	
	ccb分为3类制作，所以对变量命名有规定
	buttonSpr  按钮CCSprite，扩展touch
	txtSpr 功能的文字描述CCSprite，标注是吃或者碰等等

	其他特殊的专有变量命名不做要求。

    使用方法:
    var pong = GLOBAL_OBJ.table.windows.Methods.Buttons.produce( GLOBAL_T.METHODS.PONG );
    pong.setTiles([1,2,3]);
    parent.addChild(pong.getRootNode());

	var kong = GLOBAL_OBJ.table.windows.Methods.Buttons.produce( GLOBAL_T.METHODS.EXPOSED_KONG );
    kong.setTiles([1,1,1,1]);
    parent.addChild(kong.getRootNode());

   	var pass = GLOBAL_OBJ.table.windows.Methods.Buttons.produce( GLOBAL_T.METHODS.PASS );
    parent.addChild(pass.getRootNode());

   	var win = GLOBAL_OBJ.table.windows.Methods.Buttons.produce( GLOBAL_T.METHODS.WIN );
    win.setPoints(200);
    parent.addChild(win.getRootNode());

 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_T = GLOBAL_OBJ.table.global;
	var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
	var C2S = GLOBAL_OBJ.table.network.C2S;

	var MethodsButton  = cc.Class.extend({
		_TAG:"MethodsButton",
		ctor: function(_method, _model) {
			this.method = _method;
			this.tiles  = null;
			this._ani = null;
			this._model = _model;

			this.rootNode = cc.Node.create();
			this._contentSize = cc.size(252, 120);

			//这种是有多个框的情况，这个按钮的尺寸要大
			this.rootNode.setContentSize(this._contentSize);
			this.rootNode.setAnchorPoint(1, 0);

			this.playBtnAni();
			/*
			 @bind_block_scrolling_touch扩展，可以扩展一个适用于tableview的按钮扩展，该api返回touch管理者，提供默认的几个api
			 详情参考源码
			 该模块将edgeNode设置的和touchNode一致，就是一个普通按钮，仅仅是滑动时不支持touch响应而已
			 外部使用getTouchManager暴露出去的touch管理者，重新设置edgeNode，以便支持tableview边界时屏蔽touch
			 */
			var that = this;

			this.manager = GLOBAL_OBJ.bkernel.extend.Touch.bind_simple_touch(
				this.rootNode,
				true,
				null,
				null,
				function(listener, touch, event, hit){
					if (hit){
						that.btnTouch();
					}
				}, function(){ return false; }
			);

			this.rootNode.onCleanup = function () {
				that.rootNode.onCleanup = null;
				that.onCleanup();
			}
		},

		getRootNode:function () {
			return this.rootNode;
		},

		destroy:function () {
			GLOBAL_OBJ.LOGD(this._TAG, "destroy");
			this.onRemoveEffects();
			this.rootNode.removeFromParent();
		},

		onCleanup:function() {
			GLOBAL_OBJ.LOGD(this._TAG, "onCleanup");
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
			this._model = null;

			this.rootNode = null;

			if (this.manager){
				this.manager.unbind();
				this.manager = null;
			}

			if (this.tiles){
				this.tiles.length = 0;
				this.tiles = null;
			}

			if (this._bgSprite){
				this._bgSprite = null;
			}

		},

		btnTouch: function(){
			var tiles = this.tiles || [];

			//从服务器下发的杠牌列表中，取得当前杠到的牌
			var _clientToServerKong = function(model_, kongs_, tiles_){
				//数组比较<碰牌的 pattern 一致的判断用><数组是原封不动的传递服务器的pattern数据，所以不用排序>
				var _isSame = function(a,b){
					for (var i = 0; i < a.length; i++) {
						if(a[i]!=b[i]){
							return false
						}
					}
					return true
				};
				//两个数组完全一致，才标示使用的是这个
				var _sendKongBoo = false;
				for (var i = 0; i < kongs_.length; ++i){
					var _currentKong=kongs_[i];
					var _pattern = _currentKong.pattern;
					//数组一致，证明是用的是这个杠牌
					if(_isSame(_pattern,tiles_)){
						_sendKongBoo=true;
						//把本地style转意回去
						if(_currentKong.style == GLOBAL_OBJ.table.global.METHODS.CONCEALED_KONG){
							_currentKong.style=0;
						}else if(_currentKong.style == GLOBAL_OBJ.table.global.METHODS.EXPOSED_KONG){
							_currentKong.style=1;
						}
						C2S.requestTableCallKong(model_ , _currentKong);
						break;
					}
				}
				if(!_sendKongBoo){
					hall.assert.true(false, "杠牌发生，但是没找到原始数据");
				}
			};


			switch(this.method){
				case GLOBAL_T.METHODS.PONG:
					C2S.requestTableCallPong(this._model,tiles);
					break;
				case GLOBAL_T.METHODS.CHOW:
					C2S.requestTableCallChow(this._model,tiles);
					break;
				case GLOBAL_T.METHODS.CONCEALED_KONG:
					_clientToServerKong(this._model,this._model.getConcealedKong(),tiles);
					break;
				case GLOBAL_T.METHODS.EXPOSED_KONG:
					_clientToServerKong(this._model,this._model.getExposedKong(),tiles);
					break;
				case GLOBAL_T.METHODS.PASS:
					C2S.requestTableCallPass(this._model);
					break;
				case GLOBAL_T.METHODS.WIN:
                    GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.WIN_LOCK_PANEL, null);
					C2S.requestTableCallWin(this._model);
					break;
				case GLOBAL_T.METHODS.GRAB_PONG: // 碰（抢听）
					C2S.requestTableCallGrab(this._model,tiles,"pong");
					break;
				case GLOBAL_T.METHODS.GRAB_KONG: // 杠（抢听）
					C2S.requestTableCallGrab(this._model,tiles,"kong");
					//发出杠牌请求后，设置状态为等杠，等待杠的状态，
					GLOBAL_OBJ.table.global.tableMethodState = 1;
					break;
				case GLOBAL_T.METHODS.GRAB_HU_KONG: //抢 杠 胡
                    GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.WIN_LOCK_PANEL, null);
					C2S.requestTableCallGrabHuKong(this._model,this._model.getGrabHuTile());
					break;
				case GLOBAL_T.METHODS.AI: // 智能提示
					C2S.requestTableCallAI(this._model);
					break;
				case GLOBAL_T.METHODS.TING: // 听
					GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.UPDATE_TABLE_BTN_TING, this._model);
					break;
				default:
					break;
			}

			//如果操作了非pass字段，取消托管
			if (GLOBAL_T.METHODS.PASS != this.method) {
				GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.SHUT_TRUSTEE, {});
			}
			GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.table.Events.SHUT_METHODS_BTN_WINDOW, this.method);
		},

		/*
		@设置吃碰杠牌面*/
		setTiles:function(_tiles){
			GLOBAL_OBJ.LOGD(this._TAG,"setTiles this.method : " + this.method);
			switch(this.method){
				case GLOBAL_T.METHODS.PONG:
				case GLOBAL_T.METHODS.CHOW:
				case GLOBAL_T.METHODS.CONCEALED_KONG:
				case GLOBAL_T.METHODS.EXPOSED_KONG:
				case GLOBAL_T.METHODS.GRAB_PONG:
				case GLOBAL_T.METHODS.GRAB_CHOW:
					this.tiles = _tiles;
					//用对家的牌座位号来创建和显示，缺门时，用本家位置，缺门会带角标，但是花色会有上移动
					//导致三万显示像一万
					var cpg = GLOBAL_OBJ.table.scenes.Table.Mahjong.Cpg.produce(this.method);
					// GLOBAL_OBJ.LOGD(this._TAG,"cpg -> setTiles" + _tiles);
					cpg.setTiles( GLOBAL_T.MYSEAT ,_tiles);
					GLOBAL_FUNCS.addToParent(cpg.getRootNode(), this.cpgNode);
					break;
				default:
					break;
			}
		},

		addBtnBg:function (bgPath) {
			this._bgSprite = cc.Sprite.createWithSpriteFrameName(bgPath);
			this._bgSprite.setAnchorPoint(1, 0);
			this._bgSprite.setPosition(this.rootNode.width, 0);
			this.rootNode.addChild(this._bgSprite);
		},
		
		addTileBg:function () {
			//大按钮上，有牌预览位

			var _tileBg = cc.Scale9Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES.GZMJ_TABLE_METHODS_BTN_TILE_BG_PNG, cc.rect(10 , 18, 8, 45));
			_tileBg.setAnchorPoint(0.5, 0.5);
			_tileBg.setPosition(132, 57);
			_tileBg.width = 138;
			this.rootNode.addChild(_tileBg);

			this.cpgNode = cc.Node.create();
			this.cpgNode.setContentSize(234, 112);
			this.cpgNode.setPosition(132, 60);
			this.cpgNode.setAnchorPoint(0.5, 0.5);
			this.rootNode.addChild(this.cpgNode);

			this.cpgNode.setScale(0.55);
		},

		playBtnAni:function()
		{
			switch(this.method)
			{
				case GLOBAL_T.METHODS.PONG:
					this.addBtnBg(GLOBAL_OBJ.RES.GY_TABLE_METHODS_BTN_PONG_PNG);
					this.addTileBg();
					break;
				case GLOBAL_T.METHODS.CHOW:
					this.addBtnBg(GLOBAL_OBJ.RES.GY_TABLE_METHODS_BTN_CHI_PNG);
					this.addTileBg();
					break;
				case GLOBAL_T.METHODS.CONCEALED_KONG:
				case GLOBAL_T.METHODS.EXPOSED_KONG:
					this.addBtnBg(GLOBAL_OBJ.RES.GY_TABLE_METHODS_BTN_KONG_PNG);
					this.addTileBg();
					break;
				case GLOBAL_T.METHODS.WIN:
				case GLOBAL_T.METHODS.GRAB_HU_KONG:
					this.addBtnBg(GLOBAL_OBJ.RES.GY_TABLE_METHODS_BTN_HU_PNG);
					break;
				case GLOBAL_T.METHODS.PASS:
					this.addBtnBg(GLOBAL_OBJ.RES.GY_TABLE_METHODS_BTN_GUO_PNG);
					break;
				case GLOBAL_T.METHODS.AI:
					this.addBtnBg(GLOBAL_OBJ.RES.GY_TABLE_METHODS_BTN_AI_PNG);
					break;
				case GLOBAL_T.METHODS.TING:
					this.addBtnBg(GLOBAL_OBJ.RES.GY_TABLE_METHODS_BTN_TING_PNG);
					break;
			}
		},

		onRemoveEffects:function()
		{
			GLOBAL_OBJ.LOGD(this._TAG, "onRemoveEffects");
			GLOBAL_OBJ.tableEffectPlayer.removeEffect(this._ani);
			this._ani = null;
		}
	});

	/**
	 * 吃碰杠听等操作按钮
	 * @type {{produce: guiyang.Methods.windows.table.Buttons.produce}}
	 */
	GLOBAL_OBJ.table.windows.Methods.Buttons = {
		produce:function(_method, _model){
			return new MethodsButton(_method, _model);
		}
	};

})();