/*************************************************************
 *  mahjong_table_panels_discard.js
    mahjong_table_panels_discard
 *  mahjong
 	牌桌弃牌（打出去的牌）panel
 *
 *  Created by nick.kai.lee on 16-05-31
 *  特殊说明：
 	1. 吃碰在此，杠可能在此
    使用方法:
 */
(function(){
    "use strict";
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_T 				         = GLOBAL_OBJ.table.global;
	var GLOBAL_FUNCS                     = GLOBAL_OBJ.businesses.functions;
	var GLOBAL_FUNCS_T					 = GLOBAL_OBJ.table.scenes.Table.Functions;
	var AUDIO                            = GLOBAL_OBJ.bkernel.utils.Audio;
	var MODEL_TABLEINFO           = GLOBAL_OBJ.table.models.TableInfo;

	GLOBAL_OBJ.table.scenes.Table.Panels.Discard = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"table.scenes.Table.Panels.Discard",
		ctor: function(_tag) {
			this._super();
			this.tag 	= _tag;
			this.MAX_TILE_NUM = 24; //每个面板最多装21张牌
			this.MAX_TILE_NUM_IN_ROW = 8;
			this.MAX_ROW_NUM = this.MAX_TILE_NUM / this.MAX_TILE_NUM_IN_ROW;

			var playerNum = MODEL_TABLEINFO.getSeatCount();
			if (playerNum == 2) {
				this.MAX_TILE_NUM = 42; //每个面板最多装40张牌
				this.MAX_TILE_NUM_IN_ROW = 14;
				this.MAX_ROW_NUM = this.MAX_TILE_NUM / this.MAX_TILE_NUM_IN_ROW;
			}

			this.huDrop = {};//和牌点炮弃牌标记

			this._viewQueue = [];

			var winSize = cc.view.getFrameSize();
			this.is4_3 = winSize.height/winSize.width == 0.75;
		},

		onLoad: function() {

			this._super();

			this.getRootNode().setTag( this.tag ); //设置唯一TAG

			this.arrow  = new GLOBAL_OBJ.table.scenes.Table.Mahjong.Arrow();
			this.getRootNode().addChild( this.arrow.getRootNode() );
			this.arrow.getRootNode().setScale(0.9);
			this.setArrowVisible(false);
			/*
			@四家弃牌区域*/
			this.drop 	= {}; // 保存各家最后一张弃牌，以本地座位号为key
			this.panels = [];

			if (this.is4_3){
				//4：3下，上，下两家的弃牌区，要适当的向上和向下挪一些距离，避免过于拥挤。
				this['topNode'].y += 39;
				this['bottomNode'].y -= 39;
			}

			this.panels[ GLOBAL_T.SEATS.N0 ] = this['bottomNode'];

			this.panels[ GLOBAL_T.SEATS.N1 ] = this['rightNode'];

			this.panels[ GLOBAL_T.SEATS.N2 ] = this['topNode'];

			this.panels[ GLOBAL_T.SEATS.N3 ] = this['leftNode'];

			var playerNum = MODEL_TABLEINFO.getSeatCount();
			if (playerNum == 2) {
				this.panels[ GLOBAL_T.SEATS.N2 ] = this['topNode_two'];
				this.panels[ GLOBAL_T.SEATS.N0 ] = this['bottomNode_two'];
			}

			var panel;
			for (var i in this.panels){
				//删除无用Node;
				panel = this.panels[i];
				panel.removeAllChildren();
			}

			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.HIDE_THIS, this.onHideTHis, this);

		},

		onHideTHis:function () {
			this.getRootNode().setVisible(false);
		},

		onCleanup:function() {

			this._viewQueue.length = 0;
			this._viewQueue = null;

			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);

			this.arrow.getRootNode().removeFromParent();

			this._super();
		},

		setArrowVisible:function( _seen ) {
			if (_seen){
				this.arrow.play();
			}
			else{
				this.arrow.stop();
			}
		},


		/*
		@弃牌区 收取弃牌
		*/
		doRecv:function(_seatId, _object, _isReconnect, discardModel){
			var isReconnect = _isReconnect || false;

			if (_object) {
				if (!isReconnect){
					var that = this;

					this.setArrowVisible(false);
					GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.HIDE_PROGRESS, _seatId);

					if (_seatId == GLOBAL_T.MYSEAT && discardModel && !discardModel.getHasAction()){
						//如果是自己打出的牌，没人关注，直接放到弃牌区。
						this.addToDiscard(_seatId,_object);
						return;
					}

                    _object.doLock();
                    _object.disableTouch();
                    _object.doTakeOff();

					this.drop[_seatId] = _object;
					this.huDrop[_seatId] = _object;
					var worldPos = _object.getRootNode().convertToWorldSpace(cc.p(0,0)); //中心点

					//添加出牌放大的动画效果
					var panel = this.tableScene.getPanelByLocalSeatId(_seatId);
					var ccp = panel.getEffectPoint();

					var sc = 1;

					switch (_seatId){
						case GLOBAL_T.SEATS.N0:{
							sc = 1;
							break;
						}
						case GLOBAL_T.SEATS.N1:{
							worldPos.x = worldPos.x - 24;
							sc = 0.576;
							if (this.is4_3){
								ccp.y -= 60;
							}
							break;
						}
						case GLOBAL_T.SEATS.N3:{
							sc = 0.576;
							if (this.is4_3){
								ccp.y -= 60;
							}
							break;
						}
						case GLOBAL_T.SEATS.N2:{
							sc = 0.5;
							worldPos.x = worldPos.x - 20;
							worldPos.y = worldPos.y - 28;
							if (this.is4_3){
								ccp.y -= 60;
							}
							break;
						}
					}

					var flyPanel = this.tableScene.discard_ani_node;

					_object.getRootNode().setScale(sc);
					GLOBAL_FUNCS.changeParent(_object.getRootNode(), flyPanel, worldPos);

					var hasAction = discardModel && discardModel.getHasAction();

					var flyTime;

					switch (_seatId){
						case GLOBAL_T.SEATS.N0:{
							flyTime = 0.2;
							break;
						}
						case GLOBAL_T.SEATS.N1:{
							flyTime = 0.1;
							break;
						}
						case GLOBAL_T.SEATS.N2:{
							flyTime = 0.16;
							break;
						}
						case GLOBAL_T.SEATS.N3:{
							flyTime = 0.1;
							break;
						}
					}

					var bigMahjong = {
						_TAG : "bigMahjong",
						flyTime : flyTime,
						seatId : _seatId,
						mahjong : _object,
						ccp : ccp,
						tileId : _object.getTile(),
						hasAction : hasAction,
						runActon : function () {
							var self = this;

							var move = cc.MoveTo.create(this.flyTime, this.ccp);
							var ease = cc.EaseExponentialOut.create(move);
							var scTo = cc.ScaleTo(this.flyTime,1);
							var toTarget = cc.Spawn.create(ease,scTo);

							this.mahjong.doStandTransform(GLOBAL_T.SEATS.N0, true);

							var nextFuc = cc.CallFunc.create(function(){
								self.mahjong.showLtBd();
								GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.SHOW_METHOD_BTN, self.tileId);
							});

							var seq;
							if (this.hasAction){
								// GLOBAL_OBJ.LOGD(this._TAG, "YYYYYYYYYYYY 有人关注这张牌 ： " + _object.getTile());
								seq = cc.Sequence.create(
									toTarget,
									nextFuc
								);
							}
							else{
								// GLOBAL_OBJ.LOGD(this._TAG, "WWWWWWWWWWWW 没人关注这张牌 ： " + _object.getTile());
								var delayFun = function () {
									GLOBAL_OBJ.LOGD(self._TAG, "悬停超时 : seatId :" + self.seatId + ";tileId:" + self.tileId);
									that.addToDiscard(self.seatId, self.mahjong);
								};

								seq = cc.Sequence.create(
									toTarget,
									nextFuc,
									cc.DelayTime.create(0.6),
									cc.CallFunc.create(delayFun)
								);
							}

							this.mahjong.getRootNode().runAction(seq);
						}
					};

					bigMahjong.runActon();

					if (bigMahjong.hasAction){
						//把有人关注的，放到队列里
						this._viewQueue.push(bigMahjong);
					}

				}
				else{
					this.addToDiscard(_seatId, _object, isReconnect);
				}
			}
		},

		/*
		@弃牌区 收取弃牌
		是否断线重连回来的处理
		*/
		addToDiscard:function(_seatId, _object, _isReconnect){

			GLOBAL_OBJ.LOGD("addToDiscard!!!");

			var isReconnect = _isReconnect || false;
			var panel    	= this.panels[_seatId];
			var that        = this;

			if (_object) {
				var view    = _object.getRootNode();
				view.setVisible(true);
				view.stopAllActions();

				_object.doLock();
				_object.disableTouch();
				_object.doTakeOff();
				_object.getRootNode().setScale(1);
				_object.doLayTransform( _seatId, true); //先变形，再获得实际size

				var indexInPanel = panel.getChildrenCount();

				var rowNum = Math.floor(indexInPanel / this.MAX_TILE_NUM_IN_ROW);//1/7 = 0
				var colNum = indexInPanel % this.MAX_TILE_NUM_IN_ROW;

				//弃牌区，牌摆放位置计算
				var zorder = 0;
				var px,py;
				var tile_s, _tempWidth, _tempHeight;

				switch(_seatId){
					case GLOBAL_T.SEATS.N0://下

						tile_s  = _object.mahj_size;
						_tempWidth = tile_s.width;
						_tempHeight = tile_s.height - _object.thickness;

						px = (colNum + 0.5) * _tempWidth;
						py = tile_s.height * 0.5 + (this.MAX_ROW_NUM - rowNum - 1) * _tempHeight;

						break;
					case GLOBAL_T.SEATS.N1://右

						tile_s  = _object.mahj_size_lay;
						_tempWidth = tile_s.width;
						_tempHeight = tile_s.height - _object.thickness;

						px = (rowNum + 0.5) * _tempWidth;
						py = tile_s.height * 0.5 + colNum * _tempHeight;
						zorder = this.MAX_TILE_NUM - indexInPanel;
						break;
					case GLOBAL_T.SEATS.N2://上

						tile_s  = _object.mahj_size;
						_tempWidth = tile_s.width;
						_tempHeight = tile_s.height - _object.thickness;

						px = (this.MAX_TILE_NUM_IN_ROW - colNum - 0.5) * _tempWidth;
						py = tile_s.height * 0.5 + rowNum * _tempHeight;
						zorder = this.MAX_TILE_NUM - indexInPanel;
						break;
					case GLOBAL_T.SEATS.N3://左

						tile_s  = _object.mahj_size_lay;
						_tempWidth = tile_s.width;
						_tempHeight = tile_s.height - _object.thickness;

						px = (this.MAX_ROW_NUM - rowNum - 0.5) * _tempWidth;
						py = tile_s.height * 0.5 + (this.MAX_TILE_NUM_IN_ROW - colNum - 1) * _tempHeight;
						break;
				}

				var offset  = cc.p(px, py);

				var size    = view.getContentSize();
				GLOBAL_FUNCS.changeParent(view, panel);
				view.setLocalZOrder(zorder);
				GLOBAL_FUNCS.changeParent(that.arrow.getRootNode(), view);

				// that.arrow.getRootNode().setPosition(cc.p(size.width * 0.5, size.height * 1.3));
				that.arrow.getRootNode().setPosition(cc.p(0, size.height * 0.5));
				that.arrow.getRootNode().setLocalZOrder(98);
				if (!isReconnect){
					that.setArrowVisible(true);
				}

				view.setPosition(offset);

				if (!isReconnect){
					AUDIO.audio(GLOBAL_OBJ.RES.JIPINGHU_EFFECT_EFFECT_SEL_SWAP_BTN_MP3);
				}
			}
		},

		/*
		@清理记录的弃牌
		比如 在摸牌的时候，弃牌区记录的最新的弃牌已经没有用了（没有被吃碰杠）
		*/
		doClean:function(){
			//有人关注的牌，才会被顶掉
			////收到新的弃牌，要把原来没有放入弃牌区的大牌，放入对应的弃牌区
			var bigObj;
			for (var i = 0; i  < this._viewQueue.length; i++){
				bigObj = this._viewQueue[i];
				this.addToDiscard(bigObj.seatId, bigObj.mahjong);
			}

			this._viewQueue.length = 0;

			this.drop = {};
		},

		/*
		@被执行吃碰杠时，出牌区的牌要转移到玩家区域，所以出牌要丢弃*/
		doMethods:function(_seatId){
			var drop = this.drop[_seatId];
			if (drop){
				drop.getRootNode().setVisible(true);
			}
			this.drop[_seatId] = null;
			this._viewQueue.length = 0;

			GLOBAL_FUNCS.changeParent(this.arrow.getRootNode(), this.getRootNode());
			this.setArrowVisible(false);
			if(drop){
				drop.getRootNode().setScale(1.0);
				drop.hideLtBd();
			}
			return drop;
		},

		/*
		 @点炮的牌删除*/
		doRemoveSeatDrop:function(_seatId){
			var hudrop = this.huDrop[_seatId];
			var hudropNode = hudrop.getRootNode();
			if (this.arrow.getRootNode().parent != this.getRootNode()){
				GLOBAL_FUNCS.changeParent(this.arrow.getRootNode(), this.getRootNode());
			}

			if(hudropNode){
				hudropNode.removeFromParent();
			}
			this.huDrop[_seatId] = null;
			this.drop[_seatId] = null;

			GLOBAL_FUNCS.changeParent(this.arrow.getRootNode(), this.getRootNode());
			this.setArrowVisible(false);
		},

		/*
		@当自己打出一张牌，但是服务器没收到，并下发自己出牌play消息时，进行校验
		return 如果需要校验，返回true，否则返回false
		*/
		doDiscardCheck:function(_tileId, _seatId){
			var getMj = this.drop[_seatId];
			if (getMj && getMj.getTile() != _tileId){
				getMj.setTile(_tileId);
				return true;
			}
			return false;
		},

		/*
		@判断drop是否还在，以便收到自己play的时候判断是否需要校验*/
		getDrop:function(_seatId){
			return this.drop[_seatId] || null;
		}

	});
	//end
})();