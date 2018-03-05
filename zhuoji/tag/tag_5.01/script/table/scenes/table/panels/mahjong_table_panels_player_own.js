/*************************************************************
 *  mahjong_table_panels_player_own.js
    mahjong_table_panels_player_own
 *  @mahjong
 	牌桌玩家panel(玩家操作区域)
 *
 *  Created by nick.kai.lee on 16-05-31
 *  @特殊说明：
    1.玩家区域，管理每个玩家所拥有的麻将牌
 	2.本家区域，每一个麻将牌是可以操作的，麻将牌本身能够做出“出牌”动作
 	3.其他玩家区域，由玩家区域来控制出牌，麻将牌本身不能做出“出牌”动作（实际可以）
    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var TAG = 'table.scenes.Table.Panels.Player.Own';

	var MODEL_ACTIONID = GLOBAL_OBJ.table.models.ActionId;
	var MODEL_TABLEINFO = GLOBAL_OBJ.table.models.TableInfo;
	var MODEL_SHOWTIPS = GLOBAL_OBJ.table.models.showtips;
	var MODEL_TINGRESULT = GLOBAL_OBJ.table.models.Ting_Result;

	var curSlideNode = null;
	var playerPanel = null;
	var curForbiddentTiles = [];

	GLOBAL_OBJ.table.scenes.Table.Panels.Player.Own = GLOBAL_OBJ.table.scenes.Table.Panels.Player.extend({
		_TAG:"table.scenes.Table.Panels.Player.Own",
		/*
		@
		params _seatId: 座位id 0～3*/
		ctor: function(_seatId) {
			this._super(_seatId);
			this.seenable  = true; //是否亮牌
			this.startDragTime = 0;
			this.endDragTime = 0;
			this.upMajh = null;

			this.lock_lcr		 =false;   // 是否锁牌

			this.isMethod        = 0;
			this.isHuanDuiShou   = false;
			this.isHuState       = false;  // 是否已经胡牌
			this.tingResultData  = [];
		},

		slideStart:function (listener, touch, event) {
			// playerPanel.startDragTime = new Date().getTime();
            if(playerPanel.lock_lcr){//如果锁牌，就不让点击,这个是专门为定缺添加的字段
                return false;
            }

            var mahj = playerPanel.getMahjongByLocation(touch.getLocation());

            if (!mahj)
			{
                if (curSlideNode && curSlideNode.positionState == MAHJ_OWN_POSITION_STATE.UP)
                {
                    curSlideNode.doDown(true);
                }
                return false;
			}

            if (mahj.getIsLaiZi())
            {
                if (mahj.positionState == MAHJ_OWN_POSITION_STATE.NORMAL){
                    mahj.doUp();
                }
                else {
                    mahj.doDown(true);
                }
                return false;
            }

            GLOBAL_OBJ.LOGD("player_own_slideStart_locked:", playerPanel.locked);

			if (!playerPanel.locked){
				//未锁定，可出牌
				if (mahj.positionState == MAHJ_OWN_POSITION_STATE.NORMAL){
					mahj.doUp();
				}
				else {
					mahj.doDiscard();
					return false;
				}
			}
			else {
				//被锁定，不能出牌
				if (mahj.positionState == MAHJ_OWN_POSITION_STATE.NORMAL){
					mahj.doUp();
				}
				else{
					mahj.doDown(true);
				}
			}

			if (curSlideNode != mahj){
				mahj.doUp();
				curSlideNode = mahj;
			}

			return true;
		},

		slideMove:function (listener, touch, event) {

			var sl = touch.getStartLocation();
			var lc = touch.getLocation();

			var ow = Math.abs(sl.x - lc.x);
			var oh = Math.abs(sl.y - lc.y);

			var mjTemp;
			// var mj = curSlideNode;
			if (!curSlideNode) return;

			GLOBAL_OBJ.LOGD("player_own_slideMove_locked:", playerPanel.locked);

			if (!playerPanel.locked){

				GLOBAL_OBJ.bkernel.utils.Notification.trigger( MAHJ_OWN_EVENTS.ON_DRAG, true);

				var pointInPanel = playerPanel.touchLayer.convertToNodeSpace(lc);

				var mjNode = curSlideNode.getRootNode();

				var parentNode = mjNode.getParent();
				if (!parentNode) return;
				var pn = parentNode.convertToNodeSpace(touch.getLocation());
				var size = parentNode.getContentSize();

				var ptNode;

				var oy,ox,toX,toY;

				//计算偏移量
				ox = 0;
				oy = 0;

				toY = pn.y - oy;
				toX = pn.x - ox;

				if (toY < curSlideNode.oldPosition.y){
					toY = curSlideNode.oldPosition.y;
				}

				if (curSlideNode.positionState == MAHJ_OWN_POSITION_STATE.UP && toY < curSlideNode.getUpY()){
					toY = curSlideNode.getUpY();
				}

				if (toY < curSlideNode.getMaxYInPanel()){
					toX = curSlideNode.oldPosition.x;
				}

				if (pointInPanel.y < 96){
					//在手牌区
					if (ow > oh){
						//水平滑动
						mjTemp = playerPanel.getMahjongByLocation(touch.getLocation());

						if (mjTemp != null && curSlideNode != mjTemp){
							// parentNode = mjTemp.getRootNode().getParent();
							// ptNode = parentNode.convertToNodeSpace(touch.getLocation());
							// mjTemp.startDragPos = ptNode;

							mjTemp.doUp();
							curSlideNode = mjTemp;
						}
					}
					else{
						mjNode.setPositionX(curSlideNode.oldPosition.x);
						mjNode.setPositionY(toY);
					}
				}
				else{
					// 出了手牌区，可以自由拖动
					mjNode.setPositionY(toY);
					mjNode.setPositionX(toX);
				}
			}else{
				mjTemp = playerPanel.getMahjongByLocation(touch.getLocation());
				if (mjTemp != null && curSlideNode != mjTemp){
					// parentNode = mjTemp.getRootNode().getParent();
					// ptNode = parentNode.convertToNodeSpace(touch.getLocation());
					// mjTemp.startDragPos = ptNode;

					mjTemp.doUp();
					curSlideNode = mjTemp;
				}

			}
		},

		slideEnd:function (listener, touch, event, cp) {
			// playerPanel.endDragTime = new Date().getTime();
			GLOBAL_OBJ.bkernel.utils.Notification.trigger( MAHJ_OWN_EVENTS.ON_DRAG, false);
			if (!curSlideNode) {
				return;
			}

			// var sl = touch.getStartLocation();
			// var lc = touch.getLocation();
            //
			// var ow = Math.abs(sl.x - lc.x);
			// var oh = Math.abs(sl.y - lc.y);

			if (!playerPanel.locked) {

				var pY = curSlideNode.getRootNode().getPositionY();
				var maxY = curSlideNode.getMaxYInPanel();

				var tm = playerPanel.endDragTime - playerPanel.startDragTime;

				if (pY > maxY){
					//检查拖动结果
					curSlideNode.checkIsOut();
				}
				else{
					//没有拖动出手牌区
					if (curSlideNode.positionState == MAHJ_OWN_POSITION_STATE.UP){
						if (pY != curSlideNode.getUpY()){
							curSlideNode.toUpLocation();
						}
					}
					else{
						curSlideNode.resetPosition();
					}
				}
			}
		},

		slideCancel:function (listener, touch, event) {

			playerPanel.slideEnd(listener, touch, event);
			return false;
		},

		onLoad: function() {
			this._super();
			playerPanel = this;

			/*
	        @ 听牌预览提示系统代理
	        当玩家满足听牌条件时，服务器推来 ”听牌“ 面板，玩家可以选择 听 或者 过
	        当玩家选择听时，会在玩家持牌区 标记 哪些牌是 可以听牌的（有角标），玩家点击这些牌时可以显示 听牌的信息面板
	        本代理就是执行这些操作的*/
			playerPanel.PROXY_TING_PREVIEW = GLOBAL_OBJ.table.proxy.TingPreview.produce();
			playerPanel.PROXY_TING         = GLOBAL_OBJ.table.proxy.Ting.produce();

			playerPanel.PROXY_TABLETIPS    = GLOBAL_OBJ.table.proxy.TableTipsPreview.produce(); // 牌桌文字提示

			GLOBAL_OBJ.bkernel.utils.Notification.listen(MAHJ_OWN_EVENTS.DO_DISCARD, this.onRevDoDiscard,this);

            // 展示听牌详细数据面板
			GLOBAL_OBJ.bkernel.utils.Notification.listen(MAHJ_OWN_EVENTS.DO_SHOW_TING_PREVIEW, this.onRevDoShowTingPreview,this);

            // 隐藏听牌详细面板
			GLOBAL_OBJ.bkernel.utils.Notification.listen(MAHJ_OWN_EVENTS.DO_HIDE_TING_PREVIEW, this.onRevDoHideTingPreview,this);

			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_VOICE_TALKING_METHOD, this.onSetOwnIsMethod, this);

			// 给手牌区域添加触摸事件
			this.touchManager = GLOBAL_OBJ.bkernel.extend.Touch.bind_simple_touch(this.touchLayer, false, this.slideStart, this.slideMove, this.slideEnd, this.slideCancel);

		},

		setMahjsTag:function () {
			this._super();
            playerPanel.PROXY_TING_PREVIEW.shut();
		},

		getHuState:function () {
			return this.isHuState;
		},

		setHuState:function ( _isHu ) {
			this.isHuState = _isHu;
			this.tableScene.menu.setMenuHuState(_isHu);//给菜单按钮window添加是否胡了的标记
		},

		getMahjongByLocation:function(ptWorld){

			var panel = playerPanel.unseenNode;
			var point = panel.convertToNodeSpace(ptWorld);

			var chd;
			var rect;
			var mj;
			for (var i = 0; i < panel.childrenCount; i++){
				chd = panel.children[i];
				if (chd && chd.hasOwnProperty('controller') && chd.controller instanceof guiyang.table.scenes.Table.Mahjong.Mahj.Own){
					// rect =  cc.rect(chd.x - 39,chd.y - 56,78,112);
					rect =  cc.rect(chd.x - 39,chd.y - 79,78,135);//这里提高麻将点击范围，是因为当麻将抬起的时候，如果点击麻将牌下面空隙，牌也要打出
					if (cc.rectContainsPoint(rect, point)){
						mj = chd.controller;
						return mj;
					}
				}
			}

			return null;
		},

		doLock:function(){
			GLOBAL_OBJ.LOGI(TAG, "设置自己的面板上所有麻将为，不可以出牌");
			for(var i in this.mahjs){
				if (!this.mahjs[i]) {continue;}
				this.mahjs[i].doLock();
			}

			if (this.draw){
				this.draw.doLock();
			}

			this.locked = true;
		},

		doUnlock:function(){
			GLOBAL_OBJ.LOGI(TAG, "设置自己的面板上所有麻将为，可以出牌");
			for(var i in this.mahjs){
				if (!this.mahjs[i]) {continue;}
				this.mahjs[i].doUnlock();
			}

			if (this.draw){
				this.draw.doUnlock();
			}

			this.locked = false;
		},

		doLock_LCR:function(){
			GLOBAL_OBJ.LOGI(TAG, "lcr设置自己的面板上所有麻将为，不可以出牌");
			for(var i in this.mahjs){
				if (!this.mahjs[i]) {continue;}
				this.mahjs[i].doLock();
			}

			if (this.draw){
				this.draw.doLock();
			}

			this.lock_lcr = true;
		},

		doUnlock_LCR:function(){
			GLOBAL_OBJ.LOGI(TAG, "lcr设置自己的面板上所有麻将为，可以出牌");
			for(var i in this.mahjs){
				if (!this.mahjs[i]) {continue;}
				this.mahjs[i].doUnlock();
			}

			if (this.draw){
				this.draw.doUnlock();
			}

			this.lock_lcr = false;
		},

		onRevDoDiscard:function (mahj) {
			if (this.checkCanOut() && !mahj.getIsLaiZi()){
				this.doRequestDiscard(mahj);
				this.doLock();
			}
		},

		onSetOwnIsMethod:function (_method) {
			// GLOBAL_OBJ.LOGD("onSetOwnIsMethod=", JSON.stringify(_method));
			if(_method){
				this.isMethod = 1;
			}else{
				this.isMethod = 0;
			}
		},
		
		onRevDoShowTingPreview:function (mahj) {
			GLOBAL_OBJ.LOGD(this._TAG, "onRev_DoShowTingPreview_start; seatId:" + this.seatId);
			var didDoReadyHand = playerPanel.PROXY_TING_PREVIEW.didDoReadyHand();
			GLOBAL_OBJ.LOGI(TAG, "onRev_DoShowTingPreview_didDoReadyHand:" + didDoReadyHand);
			if(didDoReadyHand){
                this.upMajh = mahj;
                var _tile = this.upMajh.getTile();

                var isTingTile = playerPanel.PROXY_TING_PREVIEW.doTileReadyHandCheck(_tile);
                playerPanel.PROXY_TING_PREVIEW.setModeVisible(isTingTile);
                if (isTingTile){
                    var offY = 100 * this.isMethod;
                    playerPanel.PROXY_TING_PREVIEW.update(_tile, offY);
                }
            }
			GLOBAL_OBJ.LOGD(this._TAG, "onRev_DoShowTingPreview_end; seatId:" + this.seatId);
		},

		onRevDoHideTingPreview:function (mahj) {
			if(playerPanel.PROXY_TING_PREVIEW.didDoReadyHand() && this.upMajh){
				if(this.upMajh.state != MAHJ_OWN_STATE.TING_UP ||
					this.upMajh.getObjectIdentifier() == mahj.getObjectIdentifier()) {
					playerPanel.PROXY_TING_PREVIEW.setModeVisible(false);
				}
			}
		},

		onCleanup:function() {
            playerPanel.PROXY_TING_PREVIEW.shut();
            playerPanel.PROXY_TING.shut();
			if (this.touchManager){
				this.touchManager.unbind();
				this.touchManager = null;
			}

			if (curForbiddentTiles){
				curForbiddentTiles.length = 0;
				curForbiddentTiles = null;
			}

			this.isHuState = false;
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
			this._super();
		},

		//缓存一下 出牌函数
		doDealing:function(){
			this.FRIEND_DISCARD_FUNCTION = arguments[2]; this._super.apply(this, arguments);
		},

		doDrawing:function(){
			this.FRIEND_DISCARD_FUNCTION = arguments[3];
			this._super.apply(this, arguments);
		},

		/*
		@请求出牌*/
        doRequestDiscard:function(_mahj){
			GLOBAL_OBJ.LOGD(this._TAG, "doRequestDiscard start; seatId:" + this.seatId);

			var tileId        = _mahj.getTile();
			var readyHandTile = playerPanel.PROXY_TING_PREVIEW.doTileReadyHandCheck( tileId ); // 打出的牌是否是听牌

			if (readyHandTile) {
                playerPanel.PROXY_TING_PREVIEW.setModeVisible(false);
                GLOBAL_OBJ.table.network.C2S.requestTableAskTing(MODEL_ACTIONID, 2, tileId);
                // 存储当前听牌之后，可以胡的牌
                this.tingResultData = playerPanel.PROXY_TING_PREVIEW.getResultByTile(tileId);
			}

			GLOBAL_OBJ.table.network.C2S.requestTableCallDiscard(MODEL_ACTIONID, tileId, readyHandTile ? 1 : -1, _mahj.getObjectIdentifier());
			GLOBAL_OBJ.LOGD(this._TAG, "doRequestDiscard end; seatId:" + this.seatId);
		},

		// 检测手牌，添加听牌角标
		doTingPreview:function (_data, _mode) {
            GLOBAL_OBJ.LOGD(this._TAG, "__do_Ting_Preview__start__  seatId = " + this.seatId);
            var data = _data || {};

            var _addTingSubscript = function(_mahj, data) {
                var ret = false;
                for (var tile in data) {
                    ret = _mahj.getTile() == tile;
                    if (ret) {
                        _mahj.doTingSuperscript(tile);
                        break;
                    }
                }
            };

            // 添加听角标
			for (var i in this.mahjs) {
                _addTingSubscript(this.mahjs[i], data);
			}
			if (this.draw) {
				_addTingSubscript(this.draw, data);
			}

			var that = this;
			// 启动听牌预览弹窗
            playerPanel.PROXY_TING_PREVIEW.boot(this.tableScene.getReadyHandNode(), data, _mode, function () {
				that.doCancelTingPreview();
            });

            GLOBAL_OBJ.LOGD(this._TAG, " __do_TingPreview__end__");
        },

		// 取消听牌角标
		doCancelTingPreview:function () {
			GLOBAL_OBJ.LOGD(this._TAG, " __doCancalTingPreview__start ");

			var mahj;
			for (var i in this.mahjs) {
				mahj = this.mahjs[i];
				if (mahj) {
					mahj.cancelTingSuperscript();
				}
			}

			if (this.draw) {
				this.draw.cancelTingSuperscript();
			}

			GLOBAL_OBJ.LOGD(this._TAG, " __doCancalTingPreview__end ");
        },

		// 上听
		doTing:function (_type) {
			GLOBAL_OBJ.LOGD(this._TAG, "__do_Ting__start__");

            playerPanel.PROXY_TING.boot(this.tableScene.getReadyHandNode(), "ting", this.tingResultData);
            this.doShowTingIcon(_type);

			GLOBAL_OBJ.LOGD(this._TAG, "__do_Ting__end__");
        },

        shutTingProxy:function () {
            playerPanel.PROXY_TING_PREVIEW.shut();
            playerPanel.PROXY_TING.shut();
        },

		downAllTile:function () {
			//放下所有牌
			GLOBAL_OBJ.bkernel.utils.Notification.trigger( MAHJ_OWN_EVENTS.DO_UP,{id:0,tileId:0});
			GLOBAL_OBJ.bkernel.utils.Notification.trigger( MAHJ_SAME_TILE_EVENTS.HIDE_SAME_TILE,{tile:0});
		},

		doShowTips:function(_parent){//正常的桌面文字提示如：赖子皮需要打出等提示
			var tipsType = MODEL_SHOWTIPS.getShowtipsId();
			playerPanel.PROXY_TABLETIPS.shut();
			playerPanel.PROXY_TABLETIPS.boot( _parent, {tipType:tipsType});//创建提示窗口

			playerPanel.PROXY_TABLETIPS.update();
		},

		doShutShowTips:function () {
			playerPanel.PROXY_TABLETIPS.shut();
		},

        doDrawLaiZiTile:function(_tiles) {
			this._super(_tiles);
        },

		createEffectJi:function(_index) {
			this._super(_index);
		},

		doShowChongIcon:function(_index){
			this._super(_index);
		},

		doShowTingIcon:function(_type){
			this._super(_type);
		},

		getPanelOwnIsHDS:function () {
			return this.isHuanDuiShou;
		},

		setPanelOwnIsHDS:function ( _bool ) {
			this.isHuanDuiShou = _bool;
		},

		setOwnLCButtonVisible:function ( _seen ) {
			this.panel_own_leave.setVisible(_seen);
			this.panel_own_continue.setVisible(_seen);
		},

		onPanelOwnLeave:function () {
			//金币场 换对手
			var isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;
			if(!isCreate){
				this.isHuanDuiShou = true;
				GLOBAL_OBJ.table.network.C2S.requestTableLeave(
					MODEL_TABLEINFO.getRoomId(),
					MODEL_TABLEINFO.getTableId(),
					MODEL_TABLEINFO.getActiveServerSeatId()
				);
			}
		},

		onPanelOwnContinue:function () {
			//金币场 继续
			// cc.log("onPanelOwnContinue_serverSeatId=" + MODEL_TABLEINFO.getActiveServerSeatId());
			var isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;
			if(!isCreate) {
				this.setOwnLCButtonVisible(false);
			}
		},

		/*
		 @麻将队列删除指定花色的手牌，这里是用来删除抢杠胡的杠牌-这里只有续杠才走删牌
		 params _mahjs: 待删除的麻将手牌对象列表（数组）
		 */
		pteShortenMahjsTeamByTile:function(_mahjsTile) {

			GLOBAL_OBJ.LOGD(this._TAG, "pteShortenMahjsTeamByTile start; seatId:" + this.seatId);

			var _mahj = null;
			if(this.draw){//当有抓牌，并且是明杠的时候，是续杠
				if(_mahjsTile == this.draw.getTile()){
					_mahj = this.draw;
					this.draw = null;
				}
			}
			if(_mahj == null){
				for(var jj in this.mahjs){
					if(_mahjsTile == this.mahjs[jj].getTile()){
						_mahj = this.mahjs[jj];
						break;
					}
				}
			}
			// cc.log("pteShortenMahjsTeamByTile=" + _mahjsTile );
			if(_mahj == null){
				return;
			}

			this.removeMahjFrom(_mahj);
			_mahj.getRootNode().removeFromParent();
			this.doSorting(this.draw);
			GLOBAL_OBJ.LOGD(this._TAG, "pteShortenMahjsTeamByTile end; seatId:" + this.seatId);
		},

		/*
		@ 传达“麻将牌操作代理”操作，所以前缀say，表示不是本类来做的操作，而是通过本类间接来完成的操作
		panel锁定
		锁定牌槽触摸，禁止点击抬起牌槽
		解锁麻将牌触摸，允许麻将出牌
		*/
		sayReady:function(_status) {
			this._super(_status);
			// this.PROXY_HANDLE_LOCK.doReady(_status);
			if (_status == "UNLOCK"){
				this.doUnlock();
			}
			else if (_status == "LOCK"){
				this.doLock();
			}

			return this;
		},

		/**
		 * 检查当前是否可以出牌
		 * @returns {boolean}
		 */
		checkCanOut:function() {

			if (GLOBAL_OBJ.table.global.tableMethodState > 0){
				return false;
			}

			var mjs = this.mahjs.length;
			if (this.draw)
				mjs += 1;

			if (mjs > 14)
				mjs = 14;

			var b = mjs % 3 == 2;

			return b;
		},

		sayGo:function() {
			this._super();

			var b = this.checkCanOut();
			if (b){
				//可以出牌
				this.doUnlock();
			}
			else
			{
				//锁定牌
				this.doLock();
			}
		},

	});

})();