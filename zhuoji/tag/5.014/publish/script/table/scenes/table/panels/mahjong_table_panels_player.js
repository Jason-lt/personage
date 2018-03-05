/*************************************************************
 *  mahjong_table_panels_player.js
 mahjong_table_panels_player
 *  mahjong
 牌桌玩家panel(玩家操作区域)
 *
 *  Created by nick.kai.lee on 16-05-31
 *  特殊说明：
 1.玩家区域，管理每个玩家所拥有的麻将牌
 2.本家区域，每一个麻将牌是可以操作的，麻将牌本身能够做出“出牌”动作
 3.其他玩家区域，由玩家区域来控制出牌，麻将牌本身不能做出“出牌”动作（实际可以）
 使用方法:
 */

(function(){
    "use strict";
	var GLOBAL_OBJ = guiyang;
	var TAG = 'table.scenes.Table.Panels.Player';

	var GLOBAL_T 						   	 = GLOBAL_OBJ.table.global;
	var AUDIO                                = GLOBAL_OBJ.bkernel.utils.Audio;
	var GLOBAL_FUNCS                       	 = GLOBAL_OBJ.businesses.functions;
	var MODEL_TABLEINFO           		   	 = GLOBAL_OBJ.table.models.TableInfo;
	var MODEL_BUDGETS             		   	 = GLOBAL_OBJ.table.models.Budget;
	var C2S                              	 = GLOBAL_OBJ.table.network.C2S;

	var MAX_MAHJS 						   	 = 14;
	var DRAW_INDEX						   	 = 13;

	GLOBAL_OBJ.table.scenes.Table.Panels.Player = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"table.scenes.Table.Panels.Player",
		/*
		 @
		 params _seatId: 座位id 0～3*/
		ctor: function(_seatId) {
			this._super();

			this.seatId = _seatId;

			/*
			 麻将牌初始化各家13张，由函数GLOBAL_OBJ.table.scenes.Table.Functions.getE_tiles进行初始化操作，数组形式返回
			 无论麻将牌最后处于其他玩家区或者弃牌区，均由最初的归属玩家区进行最后的内存释放*/
			this.mahjs     	= [];   //未打的牌
			this.draw      	= null; //摸牌
			this.seenable  	= false; //是否亮牌
			this.cpgs      	= [null, null, null, null];   // 吃碰杠面板数组 0～3分别对应cpg面板加入父节点在this.methodSlots中的下标
			this.portrait  	= null; //头像
			this.locked    	= true;
			// this.trace     	= {draw:null, drop:null};     //	操作轨迹
			this.isGameOver = false;
			this.ma = [];
			this.isLayPanel = false;
            this.isHuState  = false;//是否已经胡过了

			/*
			 @ 出牌友元
			 根据不同类型的玩法，出牌是否允许的规则控制，比如四川定缺出牌时必须先出缺门等
			 */
			GLOBAL_OBJ.LOGD(this._TAG,"GLOBAL_OBJ.table.scenes.Table.Panels.Friends.Discard( this ).boot()");
			this.FRIEND_DISCARD_RULE = GLOBAL_OBJ.table.scenes.Table.Panels.Friends.Discard( this ).boot();
		},

		onLoad: function() {
			this._super();

			this.getRootNode().setTag( this.seatId ); //设置唯一TAG

			//未亮牌节点组
			this.unseenSlots = [];

			var i = 1;
			var tempCf;
			var slotObj;
			for (i = 1; i < 16; i++){
				slotObj = this['unseenSlot_' + i];
				if (slotObj) {
					tempCf = {
						parent : slotObj.parent,
						x : slotObj.x ,
						y : slotObj.y ,
						width : slotObj.width ,
						height : slotObj.height ,
						_pos : cc.p(slotObj.x, slotObj.y),
						_size : cc.size(slotObj.width, slotObj.height),
						getPosition:function () {
							return this._pos;
						},
						getContentSize:function () {
							return this._size;
						},
					};
					this.unseenSlots.push(tempCf);
					slotObj.removeFromParent();
				}
			}

			//亮牌节点组
			this.seenSlots = [];
			for (i = 1; i < 16; i++){
				slotObj = this['seenSlot_' + i];
				if (slotObj){
					tempCf = {
						parent : slotObj.parent,
						x : slotObj.x ,
						y : slotObj.y ,
						width : slotObj.width ,
						height : slotObj.height ,
						_pos : cc.p(slotObj.x, slotObj.y),
						_size : cc.size(slotObj.width, slotObj.height),
						getPosition:function () {
							return this._pos;
						},
						getContentSize:function () {
							return this._size;
						},
					};
					this.seenSlots.push(tempCf);
					slotObj.removeFromParent();
				}
			}

			//吃碰杠节点组
			this.methodSlots = [
				this.cpgNode_1,  this.cpgNode_2,  this.cpgNode_3,  this.cpgNode_4
			];

			this.positions  = [this.seatId != GLOBAL_T.MYSEAT ? this.seenNode.getPosition() : this.unseenNode.getPosition(), this.unseenNode.getPosition()];

			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.HIDE_THIS, this.onHideTHis, this);

			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.table.Events.UPDATE_TABLE_OTHERLEAVESIT, this.doLeaveSit, this);

		},

		/**
		 * 设置手牌可见
		 */
		showMahjNode:function () {
			this['mahjNode'].setVisible(true);
		},

		/**
		 * 设置手牌不可见
		 */
		unShowMahjNode:function () {
			this['mahjNode'].setVisible(false);
		},

		onHideTHis:function () {
			this.getRootNode().setVisible(false);
		},

		onCleanup:function() {
            this._super();
			this.FRIEND_DISCARD_RULE.shut();
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);

			this.seenSlots.length = 0;
			this.seenSlots = null;

			this.unseenSlots.length = 0;
			this.unseenSlots = null;
            this.setLocalTingState(true);
		},

		/*
		 @清空所有牌
		 */
		doClean:function() {},

		/*
		 @麻将牌初始化, 返回麻将牌对象数组
		 params _tiles:牌面数组
		 params _parents:牌槽数组*/
		pteInitTiles:function( _tiles, _parents){

			GLOBAL_OBJ.LOGD(this._TAG, "pteInitTiles start;");

			var mahjs   = [];
			var tiles  	= _tiles || [];
			var parents = _parents || [];
			//一次性清理，麻将牌可以复用

			var i;
			var mahj;

			for(i = 0; i < tiles.length; ++i){
				mahj = GLOBAL_OBJ.table.modules.Mahjong.produce( _tiles[i] ,this.seatId);
				mahjs.push(mahj);
				if (this.seatId == GLOBAL_T.MYSEAT || false == this.isSeenable() ) {

					var tingLiangStatus = MODEL_TABLEINFO.getTingLiangByLocalSeatId(GLOBAL_T.MYSEAT);
					if (this.seatId == GLOBAL_T.MYSEAT && tingLiangStatus){
						mahj.doLayTransform(this.seatId, this.isSeenable());
					}
					else{
						mahj.doStandTransform(this.seatId, this.isSeenable());
					}

				}else{
					mahj.doLayTransform(this.seatId, this.isSeenable());
				}


				if (parents.length > 0 && null != parents[i]) {
					GLOBAL_FUNCS.addToParent(mahj.getRootNode(), parents[i].parent, parents[i].getPosition());
				}
				else{
					GLOBAL_FUNCS.addToParent(mahj.getRootNode(), this.pteInitMahjsNode());
				}
			}

			GLOBAL_OBJ.LOGD(this._TAG, "pteInitTiles end;");
			return mahjs;
		},

		/*
		 @麻将牌槽初始化选择, 返回合适的牌槽*/
		pteInitMahjsSlots:function(){
			return (this.isSeenable() && this.seatId != GLOBAL_T.MYSEAT) ? this.seenSlots: this.unseenSlots;
		},

		pteInitMahjsNode:function(){
			return (this.isSeenable() && this.seatId != GLOBAL_T.MYSEAT) ? this['seenNode']: this['unseenNode'];
		},

		// 删除抢杠胡的杠牌-这里只有续杠才走删牌,优先删抓牌，没有抓牌删手牌，因为是其他家手牌所以随便一张手牌即可
		pteShortenMahjsTeamOfOne:function(){
			GLOBAL_OBJ.LOGD(this._TAG, "pteShortenMahjsTeamOfOne start;");
			var _mahj = null;
			if(this.draw){
				// 当有抓牌，并且是明杠的时候，是续杠
				_mahj = this.draw;
				this.draw = null;
			}else{
				_mahj = this.mahjs[0];
				this.removeMahjFrom(_mahj);
			}
			GLOBAL_OBJ.LOGD("pteShortenMahjsTeamOfOne=");
			if(_mahj == null){
				return;
			}
			_mahj.getRootNode().removeFromParent();
			this.doSorting(this.draw);
			GLOBAL_OBJ.LOGD(this._TAG, "pteShortenMahjsTeamOfOne end;");
		},

		removeMahjByArr:function (_mahjs) {
			var mahj;
			for(var i in _mahjs){
				mahj = _mahjs[i];
				if (mahj){
					this.removeMahjFrom(mahj);
				}
			}
		},

		removeMahjFrom:function (mahj_p) {
			var idex = this.mahjs.indexOf(mahj_p);
			if (idex > -1){
				this.mahjs.splice(idex,1);
			}
		},

		doPteSort:function () {
			GLOBAL_OBJ.LOGD(this._TAG, "do_PteSort start; seatId:" + this.seatId);

			// 实际想要的排序是从小到大，但是ccb中牌槽是从数组的大到小，所以排序就逆着来
			this.mahjs.sort(function(a, b) {
				if (a.isDingQue && !b.isDingQue) {
					return false;
				} else if (!a.isDingQue && b.isDingQue) {
					return true;
				} else {
					return b.getTile() - a.getTile();
				}
			});
			GLOBAL_OBJ.LOGD(this._TAG, "do_PteSort end; seatId:" + this.seatId);
		},

		pteSorting: function() {
			this.doPteSort();
			this.changeMahjPosByStartIndex(0);
		},

		changeMahjPosByStartIndex:function (startIndex) {
			var parents 		= this.pteInitMahjsSlots();
			var mahj, mahjNode;
			var slotIndex = startIndex;
			var tagNode, lzo;
			GLOBAL_OBJ.LOGD(this._TAG, "changeMahjPosByStartIndex start; seatId:" + this.seatId);
			for (var i = 0; i < this.mahjs.length; ++i) {
				mahj = this.mahjs[i];
				mahjNode = mahj.getRootNode();
				slotIndex = startIndex + i;
				tagNode = parents[slotIndex];
				GLOBAL_OBJ.LOGD('手牌排序---->i=' + i + '    牌色为:' + mahj.getTile() + " ;当前放入的牌槽索引为：" + slotIndex);
				if (this.seatId == GLOBAL_T.SEATS.N3){
					lzo = this.mahjs.length - i;
					mahjNode.setLocalZOrder(lzo);
					if (mahjNode.getScale() != 1){

						//手牌有可能被缩放过
						mahjNode.setScale(1);
					}
				}
				else if (this.seatId == GLOBAL_T.SEATS.N1){
					lzo = i;
					mahjNode.setLocalZOrder(lzo);
					if (mahjNode.getScale() != 1){

						//手牌有可能被缩放过
						mahjNode.setScale(1);
					}
				}

				this.setMahjPos(mahj, tagNode.getPosition());
			}
			GLOBAL_OBJ.LOGD(this._TAG, "changeMahjPosByStartIndex end; seatId:" + this.seatId);
		},

		getNormalMahjByTileId:function (tileId, mahjs) {
			var mahj;
			for (var i in this.mahjs){
				mahj = this.mahjs[i];
				if (tileId == mahj.tileId && mahjs.indexOf(mahj) == -1){
					break;
				}
			}
			return mahj;
		},

		/*
		 @坐下
		 params _tiles: 麻将牌花色数组
		 params _callFunc: 头像点击回掉
		 */
		doSit:function(_uid, _callFunc){
			var type = GLOBAL_OBJ.table.windows.consts.C_PORTRAIT_TABLE_COMMON;
			var that     = this;
			this.doinviteBtnVisible(false);
			if(this.portrait != null){
				//cc.log("这里不知道为什么，创建过的头像（自己的）居然还会在多创建一次，暂时没有找到哪里导致的，所以这里进行判断，这个方法很low " + this.seatId);
				return;
			}
			this.portrait = GLOBAL_OBJ.bkernel.windows.Factory.produce(type,{ uid: _uid, sid: this.seatId, callFunc:_callFunc ,panel:that}, this.portraitNode);
			this.portrait.playAnim( this.getSeatId() );

            // 玩家坐下，显示ip，隐藏积分信息，游戏开始（发牌协议中设为false）
			this.setPortraitIpVisbile(true);
			var isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;
			GLOBAL_OBJ.LOGD("panels_palyer_doSit:" + isCreate);
			if(isCreate){
				GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_SITDOWN_INVITE, {});
			}
		},

		doShowChongIcon:function(_index){
			GLOBAL_OBJ.LOGD(this._TAG, "doShowChongIcon _index = " + _index);
			if(this.portrait != null){
				this.portrait.showChong(_index);
			}
		},
		
		doShowTingIcon:function(_type){
			GLOBAL_OBJ.LOGD(this._TAG, "doShow_TingIcon seatId = " + this.seatId);
			if(this.portrait != null){
				this.portrait.showTing(_type);
			}
		},

		//离开牌桌
		doLeaveSit:function ( _tableState ) {
			GLOBAL_OBJ.LOGD("doLeaveSit_tableState :", JSON.stringify(_tableState));
			if(this.portrait && this.portrait.getRootNode() && _tableState.seatID == this.seatId) {
				var isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;
				if(isCreate){
					switch (_tableState.leaveReason) {
						case "gameOver":  // 自建桌打完结束，其他玩家离开头像还保留
						case "friendTableDissolve": // 自建桌解散
							break;

						default://其余离开都让头像消失，显示加号图标
							this.doLeave();
							this.portrait = null;
							this.doinviteBtnVisible(true);
							if(isCreate){
								GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_SITDOWN_INVITE, {});
							}
							break;
					}
				}else{

					switch (_tableState.leaveReason) {
						case "isConfirmLoose"://金币场，玩家认输或者金币不足
						case "chipNotEnough":
							GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_RENSHU_LEAVE, this.seatId);
							break;

						default:
							if(_tableState.tabState == "waitting"){
								this.doLeave();
								this.portrait = null;
								this.doinviteBtnVisible(true);
							}
							break;

					}
				}
			}
		},

		/*让其他玩家站起，表现就是头像消失，这里为什么要用trigger, 是因为如果房主主动解散房间，
		 *房主就会直接跳到子大厅，scene被clean，但是js层对象view还缓存，如果直接用panel.doLeaveSit
		 *去隐藏干掉头像，就找不到C++层的对象了
		 *  */
		doLeaveSitTrigger:function ( _leaveReason, _sid, _tableState ) {
			GLOBAL_OBJ.LOGD("doLeaveSitTrigger :", _leaveReason);
			GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_OTHERLEAVESIT, {leaveReason:_leaveReason, seatID:_sid, tabState:_tableState});
		},

		doinviteBtnVisible:function (isSeen) {
			this.inviteNode.setVisible(isSeen);
		},

		getPortraitZhuangPos:function () {
			var pos = this.portraitNode.convertToWorldSpace(cc.p(0,0));
			if(this.portrait){
				pos = this.portrait.bankerSpr.convertToWorldSpace(cc.p(0,0));
			}
			return pos;
		},

		getPortraitDingQuePos:function () {
			var pos = this.portraitNode.convertToWorldSpace(cc.p(0, 0));
			if (this.portrait) {
				pos = this.portrait.dingqueSpr.convertToWorldSpace(cc.p(0, 0));
			}
			return pos;
        },

		setPortraitIpVisbile:function ( isseen ) {
			if(this.portrait) {
				//ip
				this.portrait.ipLabel.setVisible(isseen);

				//金币，积分
				this.portrait.chipLabel.setVisible(true);
				this.portrait.readySpr.setVisible(false);//ok
			}
		},

		// 离开
		doLeave:function(){
			if(this.getRootNode()){
				this['portraitNode'].removeAllChildren();
			}
		},

		/*
		 @手牌检测
		 params _tiles: 手牌花色（不含摸牌）
		 */
		doTilesCheck:function(_tiles){

			GLOBAL_OBJ.LOGD(this._TAG, "doTilesCheck start;seadId:" + this.seatId);

			var tiles  = _tiles;
			var errors = [];
			var mark   = {};
			var i, tile;

			for(i  = 0; i < tiles.length; ++i){
				mark[ tiles[i] ] = ++mark[ tiles[i] ] || 1;
			}
			for(i  = 0; i < this.mahjs.length; ++i){
				tile = this.mahjs[i].getTile();
				if ( mark[tile] && mark[tile] > 0 ) {
					--mark[tile];
				}else{
					GLOBAL_OBJ.LOGD(this._TAG, "异常的牌需要清理，花色："+this.mahjs[i].getTile() );
					errors.push( this.mahjs[i] );
				}
			}

			for(tile in mark){
				if (mark[tile] > 0) {
					GLOBAL_OBJ.LOGD(this._TAG, "缺失的牌需要还原，花色："+tile+":"+mark[tile] );
					var data  = [];
					for(i = 0 ; i < mark[tile]; ++i){
						data.push(tile);
					}
					var recovers = this.pteInitTiles(data);
					for(i = 0 ; i < recovers.length; ++i){
						this.mahjs.push( recovers[i] );
					}
				}
			}

			// 清理出错的牌
			this.removeMahjByArr(errors);

			// 重新排序
			if (errors.length > 0) {
				this.pteSorting();
			}

			GLOBAL_OBJ.LOGD(this._TAG, "doTilesCheck end;seadId:" + this.seatId);

			return errors;
		},

		doSorting: function(_draw) {
			GLOBAL_OBJ.LOGD(this._TAG, "doSorting start;seadId:" + this.seatId);
			if (_draw) {
				this.mahjs.push(_draw); // 将“摸牌”插入手牌中
				if(this.getHuState() && this.seatId != GLOBAL_T.MYSEAT){
					// 如果玩家和牌了，整理手牌的时候，需要先将抓牌父节点转换到seenSlot上
					var tarNode = this.seenSlots[14];
					this.draw.doLayTransform(this.seatId, false);
					GLOBAL_FUNCS.changeParent(_draw.getRootNode(), this.seenNode,tarNode.getPosition());
				}
			}
			this.pteSorting();
			GLOBAL_OBJ.LOGD(this._TAG, "doSorting end;seadId:" + this.seatId);
		},

		/*
		 @发牌
		 params _tiles: 麻将牌花色数组
		 params _dealingCallFunc: 首次发牌结束后回调
		 params _discardCallFunc: 首次发牌创建的麻将对象出牌时回调
		 */
		doDealing:function(_tiles, _dealingCallFunc, _discardCallFunc){
			GLOBAL_OBJ.LOGD(this._TAG, "doDealing start;seadId:" + this.seatId);
			var tiles        = _tiles || [];
			var onDealing    = _dealingCallFunc || null;
			var onDiscarding = _discardCallFunc || function(){};
			var parents      = this.pteInitMahjsSlots();

			tiles.sort(function(a, b){ return a < b });

			this.mahjs 	     = this.pteInitTiles( tiles,  parents );

			this.pteSorting();

			// 发牌完毕
			if (onDealing != null){
				onDealing();
			}

			GLOBAL_OBJ.LOGD(this._TAG, "doDealing end;seadId:" + this.seatId);
		},

		/*
		 @摸牌
		 params _tile: 摸牌花色
		 params _direct: 是否直接创建摸牌
		 params _drawingCallFunc: 麻将牌摸牌回调
		 params _discardCallFunc: 牌摸创建的麻将对象出牌时回调 */
		doDrawing:function(_tile, _direct, _drawingCallFunc, _discardCallFunc){

			GLOBAL_OBJ.LOGD(this._TAG, "doDrawing start;seadId:" + this.seatId);
			GLOBAL_OBJ.LOGD(this._TAG, "doDrawing start;_direct:" + _direct);
			var that  		 = this;
			var onDrawing    = _drawingCallFunc || function(){};
			var onDiscarding = _discardCallFunc || function(){};
			var parents      = this.pteInitMahjsSlots();
			var size  		 = parents[0].getContentSize();

			// GLOBAL_OBJ.LOGD("doDrawing_tiles" + JSON.stringify(tiles));

			//断线重连回来偶尔手牌会多一张,
			if (this.draw) {
				GLOBAL_OBJ.LOGD(this._TAG, "doDrawing this.draw 已存在:");
				this.draw.getRootNode().removeFromParent();
				this.draw = null;
			}

			this.draw	= GLOBAL_OBJ.table.modules.Mahjong.produce( _tile ,this.seatId);
			this.pteInitMahjsNode().addChild(this.draw.getRootNode());
			this.setMahjPos(this.draw, parents[ DRAW_INDEX ].getPosition());

			if(this.getHuState() && this.seatId != GLOBAL_T.MYSEAT){//如果玩家和牌了，虽然放倒了seenSlot上，但是抓牌仍是不可见的
				this.draw.doStandTransform(this.seatId, false);
			}else{
				this.draw.doStandTransform(this.seatId, this.isSeenable());
			}

			if (this.seatId == GLOBAL_T.MYSEAT){
				this.draw.doUnlock();
				this.draw.enableTouch();
				GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_T.MAHJ_OWN_EVENTS.DO_UP,{id:0,tileId:0});
				GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_T.MAHJ_SAME_TILE_EVENTS.HIDE_SAME_TILE,{tile:0});
                this.draw.doDrawAnimation(0);
			}
            else if (this.seatId == GLOBAL_T.SEATS.N1){
                this.draw.getRootNode().setLocalZOrder(-1);
                if (this.getHuState()){

                    // 因为亮牌区与非亮牌区的缩放倍数不一样，所以这里要改，否则会导致抓牌过大
                    this.draw.getRootNode().setScale(0.64);
                }
                this.draw.doDrawAnimation(1, this.pteInitMahjsNode(), parents[ DRAW_INDEX ].getPosition());
            }
            else if(this.seatId == GLOBAL_T.SEATS.N2){
                this.draw.doDrawAnimation(2);
            }
			else if (this.seatId == GLOBAL_T.SEATS.N3){
				this.draw.getRootNode().setLocalZOrder(14);
				if (this.getHuState()){

					// 因为亮牌区与非亮牌区的缩放倍数不一样，所以这里要改，否则会导致抓牌过大
					this.draw.getRootNode().setScale(0.64);
				}
				this.draw.doDrawAnimation(3, this.pteInitMahjsNode(), parents[ DRAW_INDEX ].getPosition());
			}

			// this.trace.draw = this.draw;

			// 允许出牌
			onDrawing();

			GLOBAL_OBJ.LOGD(this._TAG, "doDrawing start;seadId:" + this.seatId);
		},

		// 请求出牌
		doRequestDiscard:function(){},

		/*
		 @当自己打出一张牌，但是服务器没收到，并下发自己出牌play消息时，进行校验
		 @param:_discard 自己打出去的牌的tileId
		 @param:_replace 实际应该打的牌的tileId，即play下发的
		 */
		doDiscardCheck:function(_discard, _replace){
			// 在手牌中找出_replace，并且设置花色为_discard
			GLOBAL_OBJ.LOGD(this._TAG, "doDiscardCheck start;");
			for (var i = 0; i < this.mahjs.length; ++i){
				if (this.mahjs[i].getTile() == _replace){
					this.mahjs[i].setTile(_discard);
					// 重新排序
					this.pteSorting();
					break;
				}
			}
			GLOBAL_OBJ.LOGD(this._TAG, "doDiscardCheck end;");
		},

		/*
		 @出牌
		 返回指定手牌或者指定花色的手牌挪到弃牌区去
		 params _key: 唯一性ID(自己打出的牌，一定有key,服务器代发的，没有)
		 params _tile: 麻将花色
		 params _dicardFunc: 弃牌回掉
		 */
		doDiscard:function(_key, _tile, _dicardFunc){

			GLOBAL_OBJ.LOGD(this._TAG, "doDiscard start;seadId:" + this.seatId);

			var tileKey = _key;
			var tile  = _tile || 0;
			var dFunc = _dicardFunc || function(){};
			var target = null;

			GLOBAL_OBJ.LOGD(this._TAG,"当前出牌的玩家ID:" + this.seatId);
			var i;

			if (tileKey > -1) {

				// 手动出牌（本家出牌）
				if (this.draw && this.draw.getObjectIdentifier() == tileKey) {
					target = this.draw;
					this.draw = null;
				} else {
					for(i = 0; i < this.mahjs.length; ++i) {

						// 本家或者其他玩家手牌处理
						if (this.mahjs[i].getObjectIdentifier() == tileKey) {
							target = this.mahjs[i];
							break;
						}
					}
				}
			}else if (null != tile) {

				// 检测打牌是否摸牌，非本家没亮牌时有摸牌先打出摸牌（客户端rule）
				if (this.draw && (this.draw.getTile() == tile || 0 == this.draw.getTile())) {
					target = this.draw;
					this.draw = null;
					target.setTile(tile);	// 修正花色，其他玩家没亮牌无花色
				}else{

					// 自动出牌（本家托管出牌或其他玩家出牌广播）
					for(i = 0; i < this.mahjs.length; ++i){

						// 本家或者其他玩家手牌处理
						if (this.mahjs[i].getTile() == tile || 0 == this.mahjs[i].getTile()) {
							target = this.mahjs[i];
							target.setTile(tile);	// 修正花色，其他玩家没亮牌无花色
							break;
						}
					}
				}
			}

			if (target) {

				var outIndex = this.mahjs.indexOf(target);

				// 将打牌从手牌列表中删除（如果存在）
				this.removeMahjFrom(target);

				// 将打牌转移到弃牌区
				dFunc( target, this.seatId );

				if (null != this.draw && target.getObjectIdentifier() != this.draw.getObjectIdentifier()) {

					/*这里对抓牌进行处理，抓牌上有听角标，由于this.draw加入this.mahjs数组需要在麻将移动到位置后进行操作，这就导致
					 *这个时间段麻将手牌还没有加入this.draw，但是this.draw这个时候已经置为null了，所以在这个时间段对this.mahjs和this.draw
					 *进行操作（比如去掉听角标），就失效了，因为找不到draw了
					 */
					this.draw.cancelTingSuperscript();		// 去掉听角标

					// 打出的牌不是摸牌, 整理剩余手牌
					this.insertDraw(this.draw, outIndex);
				}else{

					// 整理剩余手牌
					if(this.seatId == GLOBAL_T.MYSEAT){
						this.pteSorting();
					}
				}
				this.draw = null;
			}
			GLOBAL_OBJ.LOGD(this._TAG, "doDiscard end;seadId:" + this.seatId);
		},

		/**
		 * 获取抓牌的插入点
		 * @param _draw 抓牌
		 * @returns {*}
		 */
		getInsertPoint:function(_draw) {

			this.mahjs.push(_draw);
			this.doPteSort();
			var place = this.mahjs.indexOf(_draw);
			GLOBAL_OBJ.LOGD(this._TAG, 'Inserting 返回 麻将插入点为:' + place);

			return place;
		},

		/**
		 * 插入抓牌
		 * @param _draw 抓牌
		 */
		insertDraw:function(_draw ,outIndex_p) {

			var draw = _draw; // 摸牌
			var parents = this.pteInitMahjsSlots();
			var swidth = 78;
			var moveTime = 0.3;
			var moveUpTime = 0.1;
			var moveDownTime = 0.1;

			var outIndex = outIndex_p;
			GLOBAL_OBJ.LOGI(TAG, ">>>>  本次被打出的牌的索引是：" + outIndex);

			var place = this.getInsertPoint(draw);	// 找到“摸牌”插入位置索引
			this.mahjs.splice(place,1);

			var toSlot = parents[place];
			var moveLeft;
			var seqMoveToTarget;
			var pt, i;

			var mjNode = draw.getRootNode();
			var mahj;

			var that = this;

			var targetPos = toSlot.getPosition();

			var moveEndFun = cc.CallFunc.create(function(){
				that.mahjs.push(draw);
				that.doPteSort();
			});

			var baseTime = moveTime / 13;

			if (place == 0){

				if (place == outIndex){//出牌跟抓牌插入的位置一样，都是最右侧
					//不动
				}
				else if (place < outIndex){//出牌不是最右侧位置为0的，抓牌插入的位置是0位置
					for (i = place; i < outIndex; i++){
						// GLOBAL_OBJ.LOGD(this._TAG, "当前移动手牌索引：" + i);
						mahj = this.mahjs[i];
						if (mahj){
							mjNode = mahj.getRootNode();
							pt = mjNode.getPosition();
							mjNode.runAction(cc.MoveTo.create(moveTime, cc.p(pt.x - swidth, pt.y)));
						}
					}
				}

				//在最右边
				//1.手牌水平飞入插入点
				mjNode = draw.getRootNode();
				moveLeft = cc.MoveTo.create(moveTime, cc.p(targetPos.x, targetPos.y));
				seqMoveToTarget = cc.Sequence.create(moveLeft, moveEndFun);

				mjNode.runAction(seqMoveToTarget);
			}
			else{
				//正常插入到手牌区

				//1.插入点右侧的手牌向右移动一个牌位；

				if (place == outIndex){
					//不动
				}
				else if (place > outIndex){
					for (i = place; i > outIndex; i--){
						// GLOBAL_OBJ.LOGD(this._TAG, "当前移动手牌索引：" + i);
						mahj = this.mahjs[i-1];
						if (mahj){
							mjNode = mahj.getRootNode();
							pt = mjNode.getPosition();
							mjNode.runAction(cc.MoveTo.create(moveTime, cc.p(pt.x + swidth, pt.y)));
						}
					}
				}
				else if (place < outIndex){
					for (i = place; i < outIndex; i++){
						// GLOBAL_OBJ.LOGD(this._TAG, "当前移动手牌索引：" + i);
						mahj = this.mahjs[i];
						if (mahj){
							mjNode = mahj.getRootNode();
							pt = mjNode.getPosition();
							mjNode.runAction(cc.MoveTo.create(moveTime, cc.p(pt.x - swidth, pt.y)));
						}
					}
				}

				//2.手牌飞入插入点

				mjNode = draw.getRootNode();
				pt = mjNode.getPosition();

				var moveUp = cc.MoveTo.create(moveUpTime, cc.p(pt.x, pt.y + 116));
				moveLeft = cc.MoveTo.create((place + 1) * baseTime, cc.p(targetPos.x, pt.y + 116));
				var moveDown = cc.MoveTo.create(moveDownTime, cc.p(targetPos.x, targetPos.y));

				seqMoveToTarget = cc.Sequence.create(moveUp, moveLeft, moveDown, moveEndFun);

				mjNode.runAction(seqMoveToTarget);
			}

		},

		/*
		 @吃碰杠检测
		 目前发现服务器漏发消息，对家打牌，本家碰牌，接着本家出牌，对家碰牌，这个时候
		 服务器漏发“本家出牌”这个阶段的协议，导致两次碰牌协议先后下发，客户端找不到弃牌也找不到摸牌，
		 所以需要进行校验，去手牌和摸牌中找寻花色作为弃牌打出去。
		 旧版本麻将也有这个问题，这个时候就会多一张牌，直到下一次进行手牌纠正。
		 @param:_tile 吃碰杠的花色
		 */
		doMethodsCheck:function(_tile){
			GLOBAL_OBJ.LOGD(this._TAG, "doMethodsCheck start; seatId:" + this.seatId);
			var that   = this;
			var target = null;
			if (this.draw && ( _tile == this.draw.getTile() || 0 == this.draw.getTile() )) {
				target    = this.draw;
				target.setTile(_tile);
				this.draw = null; //打出去摸牌
				this.pteSorting();
				return target;
			}

			for (var i = 0; i < this.mahjs.length; ++i){
				if ( this.mahjs[i].getTile() == _tile || 0 == this.mahjs[i].getTile() ){
					target = this.mahjs[i];
					target.setTile(_tile);

					this.removeMahjFrom(target);

					this.doSorting(this.draw);
					this.draw = null;
					return target;
				}
			}
			GLOBAL_OBJ.LOGD(this._TAG, "doMethodsCheck end; seatId:" + this.seatId);
		},

		/**
		 * 检查当前是否可以出牌
		 * @returns {boolean}
		 */
		checkCanOut:function(){
			var mjs = this.mahjs.length;
			if (this.draw)
				mjs += 1;

			if (mjs > 14)
				mjs = 14;

			var b = mjs % 3 == 2;

			return b;
		},

		/**
		 * 吃碰杠牌型创建，返回吃碰杠牌型对象
		 * @param _method 吃、碰、杠
		 * @param _mahjs 传入麻将组
		 * @param _parent 父节点
		 * @param _seatId 客户端座位号0～3
		 * @param _isDirect 是否播放动画
		 * @param _effectNode
		 * @param _effectPoint
		 * @param _passiveSeatId
		 * @param _activeSeatId
		 * @param _cpgPeng
		 * @returns {*}
		 */
		createCpg:function(_method, _mahjs, _parent, _seatId, _isDirect, _effectNode, _effectPoint, _passiveSeatId, _activeSeatId, _cpgPeng){
			if (_parent == null){ return null; }

			GLOBAL_OBJ.LOGD(this._TAG, "createCpg start; seatId:" + this.seatId);

			GLOBAL_OBJ.LOGD(this._TAG," 创建一个 吃碰杠 的位置 ");
			var cpg      = GLOBAL_OBJ.table.scenes.Table.Mahjong.Cpg.produce( _method );

            if(_method == GLOBAL_T.METHODS.EXPOSED_KONG){//进行玩法判断是因为怕把别的玩法改出bug，毕竟之前很稳定，lcr
                if(_cpgPeng){//原来的碰转杠是在碰上面加上一个明杠，这样会有问题，所以这里处理下，创建明杠前，removeChild
                    _passiveSeatId = _cpgPeng.getPassSeatId();
                    // _parent.removeAllChildren();
                }
            }

			if (false == _isDirect) {
				if(_parent){//播放吃碰杠冒烟特效
					var sizet = _parent.getBoundingBox();
					var widtht = sizet.width/2.0;
					var heightt = sizet.height/2.0;
					GLOBAL_OBJ.tableEffectPlayer.play( _parent,
						GLOBAL_OBJ.RES.XZ_ZM_TX_PPD_CCBI, cc.p(widtht, heightt),
						function(_animate){},
						function(_animate){},
						false, 1.0, "shunshi" );
				}
			}
			cpg.setMahjs( _seatId, _mahjs, null, null, _passiveSeatId, _activeSeatId);

			var cpg_size = _parent.getContentSize();
			// var point, offset;
			// switch(_seatId){
			// 	case GLOBAL_T.SEATS.N0:
			// 		point  = cc.p(cpg_size.width*0.5,cpg_size.height*1.5);
			// 		offset = cc.p(0, -cpg_size.height);
			// 		break;
			// 	case GLOBAL_T.SEATS.N1:
			// 		point  = cc.p(-cpg_size.width*0.5,cpg_size.height*0.5);
			// 		offset = cc.p(0,0);
			// 		break;
			// 	case GLOBAL_T.SEATS.N2:
			// 		point  = cc.p(cpg_size.width*0.5,cpg_size.height*1.5);
			// 		offset = cc.p(0, -cpg_size.height);
			// 		break;
			// 	case GLOBAL_T.SEATS.N3:
			// 		point  = cc.p(cpg_size.width*1.5,cpg_size.height*0.5);
			// 		offset = cc.p(0,0);
			// 		break;
			// 	default:
			// 		return null;
			// }

			GLOBAL_FUNCS.changeParent(cpg.getRootNode(), _parent, cc.p(cpg_size.width*0.5, cpg_size.height*0.5));

			if (false == _isDirect) {
				AUDIO.audio( GLOBAL_OBJ.RES.UI_DOWN_MP3 );
				var size = cpg.getRootNode().getContentSize();
				switch(_method){
					case GLOBAL_T.METHODS.PONG:
						//碰 特效
						GLOBAL_OBJ.tableEffectPlayer.play(  _effectNode,
							GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_P_CCBI, _effectPoint,
							function(_animate){},
							function(_animate){}, false );
						break;
					case GLOBAL_T.METHODS.CHOW:
						//吃 特效
						GLOBAL_OBJ.tableEffectPlayer.play(  _effectNode,
							GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_CHI_CCBI, _effectPoint,
							function(_animate){},
							function(_animate){}, false );
						break;
						case GLOBAL_T.METHODS.EXPOSED_KONG:
							//杠 特效
				            GLOBAL_OBJ.tableEffectPlayer.play(  _effectNode,
				                GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_GANG_CCBI, _effectPoint,
				                function(_animate){}, 
				                function(_animate){}, false );
			            break;
						case GLOBAL_T.METHODS.CONCEALED_KONG:
							//杠 特效
				            GLOBAL_OBJ.tableEffectPlayer.play(  _effectNode,
				                GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_GANG_CCBI, _effectPoint,
				                function(_animate){}, 
				                function(_animate){}, false );
			            break;
					}
				}
			GLOBAL_OBJ.LOGD(this._TAG, "createCpg end; seatId:" + this.seatId);
			return cpg;
		},

		/*
		 @吃碰杠
		 params _method:   吃 碰 杠
		 params _tiles:    花色数组；吃碰由玩家手牌2张+弃牌构成 eg：[1,2] + 3
		 params _drop: 	  弃牌 麻将牌对象，有可能是null
		 params _callFunc: 执行完毕回调
		 params _isDirect: 是否直接创建而不从手牌中查找 如断线重连时，_isDirect为true
		 */
		doMethods:function(_method, _tiles, _drop, _methodCallFunc, _isDirect, _passiveSeatId, _activeSeatId ){

			GLOBAL_OBJ.LOGD(this._TAG, "doMethods start; seatId:" + this.seatId);

			var that  	 = this;
			var isDirect = _isDirect || false;
			var tiles 	 = _tiles || [];
			var drop  	 = _drop; //是否有弃牌，有弃牌代表吃，碰或者明杠的一种
			var onMethod = _methodCallFunc || function(){};

			var target 	 = []; //形成“吃碰杠”的牌对象数组
			var record 	 = {};

			var passiveSeatId = _passiveSeatId;
			var activeSeatId = _activeSeatId;
			GLOBAL_OBJ.LOGD(this._TAG, "doMethods start; isDirect:" + isDirect);
			if (isDirect == false){
				switch(_method){
					case GLOBAL_T.METHODS.EXPOSED_KONG: // 明杠
						/*
						 明杠2种形成方式：明杠tiles中有真实的值
						 1. 杠其他玩家的牌（手牌3张+弃牌） 处理逻辑同吃碰
						 2. 杠自己摸的牌 （已碰牌3张（手牌中查找不到，需去“吃碰杠”列表里查询）+摸牌）其他玩家没亮牌时，摸牌值是0
						 */

						//模式2，查询吃碰杠列表
						var parts = null;
						for (var i in this.cpgs){
							if (null ==  this.cpgs[i]) { continue; };
							parts = this.cpgs[i].getMahjs() || [];
							// 满足条件：有碰牌，获取碰牌对象中包含的3个麻将牌对象数组成功，碰牌有父节点
							var flagPong = GLOBAL_T.METHODS.PONG == this.cpgs[i].getMethods();
							if( (flagPong) && parts.length > 0 && this.methodSlots[i].getChildrenCount() > 0 ){
								// 碰牌花色和杠牌花色一致
								if ( tiles[0] == parts[0].getTile() ) {
									//抓牌
									if(this.draw){
										//自己抓
										if(this.draw.getTile()!=0){
											//抓牌不在杠牌里
											if(tiles.indexOf(this.draw.getTile())<0){
												//需要杠的牌在手牌里
												for(var j = 0; j < this.mahjs.length; ++j){
													if ( 0 == this.mahjs[j].getTile() || this.mahjs[j].getTile() == tiles[0] ){
														parts.push(this.mahjs[j]);
														//手牌中删除这个牌
														this.removeMahjFrom(this.mahjs[j]);
														//手牌排序
														this.pteSorting();
														break;
													}
												}
											}else{
												//需要杠的牌在抓牌里
												parts.push( this.draw );
												this.draw = null;
											}
										}else{
											// 纠正摸牌花色（如果是其他玩家，没有亮牌时，其摸牌花色是0）
											this.draw.setTile( tiles[0] );
											parts.push( this.draw );
											this.draw = null;
										}
									}else{
										//不是抓牌 进不来
										// hall.assert.true(false,"碰牌区中的 碰牌 和 杠牌 牌型有重叠，那么这个杠就是自摸的明杠，且使用了自己的碰牌区牌组。")
									}
									//碰牌转杠牌
									var cpgPeng  = this.cpgs[i];
									this.cpgs[i] = this.createCpg(_method, parts, this.methodSlots[i], this.seatId, isDirect, this.getEffectNodeWorld(), this.getEffectPoint(), passiveSeatId, activeSeatId, cpgPeng);
									//摸牌也整理进来，传递空的话，证明是摸牌为空
									this.doSorting( this.draw );
									this.draw = null;
									return;
								}
							}
						}
						break;
					case GLOBAL_T.METHODS.CONCEALED_KONG: // 暗杠
					case GLOBAL_T.METHODS.CHOW: // 吃
					case GLOBAL_T.METHODS.PONG: // 碰
						break;
				}

				GLOBAL_OBJ.LOGD(this._TAG,"吃碰杠操作 座位号: " + this.seatId);
				// GLOBAL_OBJ.LOGD(this._TAG,"吃碰杠操作 花色列表 doMethods :tiles = "+JSON.stringify(tiles));

				// 手牌中搜集
				// 2张“吃碰”牌
				// 3张或4张杠的牌

				for(var i = 0; i < tiles.length; ++i){
					for(var j = 0; j < this.mahjs.length; ++j){
						if ( null == record[ this.mahjs[j].getObjectIdentifier() ] &&
							(0 == this.mahjs[j].getTile() || this.mahjs[j].getTile() == tiles[i]) ){
							record[ this.mahjs[j].getObjectIdentifier() ] = true;//标记找到的牌
							target.push(this.mahjs[j]);
							this.mahjs[j].setTile(tiles[i]); // 纠正花色，其他玩家手牌没亮牌时是0
							break;
						}
					}
				}

				if (drop)
					GLOBAL_OBJ.LOGD(this._TAG,"吃碰杠操作 弃牌: " + drop.getTile());
				GLOBAL_OBJ.LOGD(this._TAG,"吃碰杠操作 摸牌: " + this.draw);
				GLOBAL_OBJ.LOGD(this._TAG,"吃碰杠操作 类型: " + _method);
				GLOBAL_OBJ.LOGD("cpg_target_data:", target.length);
				for(var fff in target){
					GLOBAL_OBJ.LOGD("target_tile:", target[fff].getTile());
				}
				if(this.draw){
					GLOBAL_OBJ.LOGD("this.draw_tile", this.draw.getTile());
				}
				if(drop){
					GLOBAL_OBJ.LOGD("drop_tile", drop.getTile());
				}
				switch(_method)
				{
					case GLOBAL_T.METHODS.EXPOSED_KONG: // 明杠
					case GLOBAL_T.METHODS.CONCEALED_KONG: // 暗杠
						if (null != drop || (this.draw && target[0] && (target[0].getTile() == this.draw.getTile()) )) {
							var m = drop || this.draw;
							if (m) {
								if (!target[0]){
									GLOBAL_OBJ.LOGD(this._TAG, "Kong Err!");
								}
								else{
									m.setTile( target[0].getTile() );
								}
							}
							target.push( m );
							this.draw = null; // 摸牌已经归入吃碰杠，置空
						}
						break;
					case GLOBAL_T.METHODS.CHOW: // 吃
					case GLOBAL_T.METHODS.PONG: // 碰
						target.push( drop );
						break;
				}
				GLOBAL_OBJ.LOGD(this._TAG, "吃碰杠粘操作牌数组的长度:" + target.length);

				//ADDNEW 吃碰时，吃别人的牌放到中间。
				//中间 <-> 最后，两者交换。
				if(tiles.length==2 && target.length == 3){
					var _lastTile = target[2] != null ? target[2].getTile() : 0;
					var _middleTile = target[1].getTile();
					target[1].setTile(_lastTile);
					target[2].setTile(_middleTile);
				}

				for(var i = 0; i < target.length; ++i){
					target[i].getRootNode().setVisible(true);//发牌动画过慢，导致手牌setVisible(false)还来不及恢复可见
					GLOBAL_OBJ.LOGD(this._TAG,"吃碰杠粘操作牌数组里的花色:" + target[i].getTile());
				}

				switch(_method){
					case GLOBAL_T.METHODS.PONG:
					case GLOBAL_T.METHODS.CHOW:
						if (3 != target.length) {
							GLOBAL_OBJ.LOGD(this._TAG, "吃碰数据异常 : "+target );
							return;
						}
						break;
					case GLOBAL_T.METHODS.EXPOSED_KONG:
					case GLOBAL_T.METHODS.CONCEALED_KONG:
						if (4!=target.length) {
							GLOBAL_OBJ.LOGD(this._TAG, "杠数据异常 : "+target );
							return;
						}
						break;
				}

				// 清理记录的牌
				this.removeMahjByArr( target );
			}else{
				for (var i = 0; i < tiles.length; ++i){
					var mahj = GLOBAL_OBJ.table.modules.Mahjong.produce( tiles[i] ,that.seatId);
					target.push(mahj);
				}
			}

			/*
			 创建吃碰杠ccb
			 1.创建chow pong kong 位于cpgNode上方
			 2.执行未出牌整理
			 3.未出牌列表整体偏移，给cpg腾位置 (杠牌不需要偏移)
			 4.cpg归位
			 5.出牌后，未出牌列表整体偏移回归
			 右边玩家花色顺序要相反
			 */

			for(var i = 0; i < this.methodSlots.length; ++i){
				if (0 == this.methodSlots[i].getChildrenCount()){
					this.cpgs[i] = this.createCpg(_method, target, this.methodSlots[i], this.seatId, isDirect, this.getEffectNodeWorld(), this.getEffectPoint(), passiveSeatId, activeSeatId);
					break;
				}
			}

			if (!isDirect)
			{
				this.doSorting(this.draw);
				this.draw = null;
			}

			// 碰牌之后，手牌要向右移位，不能挡住杠牌，同时还要有一张牌放到出牌位置
			var count = this.mahjs.length;
			for (var i in this.cpgs)
			{
				if (null != this.cpgs[i])
				{
					count += 3;
				}
			}

			if (count >= MAX_MAHJS && !this.draw)
			{
				GLOBAL_OBJ.LOGD("check_doMethodsMove ");
				this.doMethodsMove();
			}

			GLOBAL_OBJ.LOGD(this._TAG, "doMethods end; seatId:" + this.seatId);
		},

		/*
		 @最后胡牌时选择将牌反转亮出*/
		doBudgetLiang: function(_tiles, _gameOver, callBackfun) {
			GLOBAL_OBJ.LOGD(this._TAG, "doBudgetLiang start; seatId:" + this.seatId);

			var that = this;
			if (arguments.length == 3){
				this.rootNode.scheduleOnce(function () {
					if ("function" == typeof(callBackfun)) {
						callBackfun(that.seatId);
					}
				},1.5);
			}

			var huNode = this.getPanelHuNode();
			huNode.removeAllChildren();//亮牌后，需要去掉和牌数和认输等图片
			this.isGameOver = _gameOver;
			if (this.seatId == GLOBAL_T.MYSEAT) {
				//没有胡牌，牌结束本家亮牌
				if(!this.getHuState()){
					if ((this.draw != null)) {
						this.draw.doLayTransform(this.seatId, true);
						this.draw.doDownSimple();//牌落下
						this.draw.cancelTingSuperscript();//如果有听牌，取消听角标
					}
					for (var i = 0; i < this.mahjs.length; ++i) {
						var mahjss = this.mahjs[i];
						if (mahjss) {
							mahjss.doLayTransform(this.seatId, true);
							mahjss.doDownSimple();//牌落下
							mahjss.cancelTingSuperscript();//如果有听牌，取消听角标
						}
					}
				}
				for(var index = 0; index < this.cpgs.length; index++){
					var cpg = this.cpgs[index];
					if (null == cpg) { continue; };
					if(cpg.method == GLOBAL_T.METHODS.CONCEALED_KONG){
						if(cpg.mahjs[3]){
							cpg.mahjs[3].doLayTransform(this.seatId, true);
						}
					}
				}
				this.downAllTile();
				this.doLock();//锁牌

				return true;
			}
			GLOBAL_OBJ.LOGD(this._TAG, 'tiles>>>>' + JSON.stringify(_tiles));

			/*
			* 除本家外的其他玩家，这是手牌第一次初始化花色
			* 那么顺序如下：
			* 初始化手牌
			* 初始化赖子
			* 手牌推倒
			* 杠牌区推倒
			* */
			if (_tiles != undefined) {
				this.seenable = true;

				if (this.draw) {
					this.draw.setTile(MODEL_BUDGETS.getWinTile(this.seatId));
					this.setMahjPos(this.draw , this.seenSlots[14].getPosition());
				}
                var pt;
                for (var i = 0; i < _tiles.length; ++i) {
                    if (this.mahjs[i]) {
                        this.mahjs[i].setTile(_tiles[i]);
                        GLOBAL_FUNCS.changeParent(this.mahjs[i].getRootNode(), this.seenNode);
                        pt = this.seenSlots[i].getPosition();
                        this.setMahjPos(this.mahjs[i], pt);
                    }
                }

                if (this.draw)
				{
                    this.draw.doLayTransform(this.seatId, true);
				}
                for (var i = 0; i < _tiles.length; ++i) {
                    if (this.mahjs[i]) {
                        this.mahjs[i].doLayTransform(this.seatId, true);
                    }
                }

				for(var index = 0; index < this.cpgs.length; index++){
					var cpg = this.cpgs[index];
					if (null == cpg) { continue; };
					if (cpg.method == GLOBAL_T.METHODS.CONCEALED_KONG) {
						if(cpg.mahjs[3]) {
							cpg.mahjs[3].doLayTransform(this.seatId, true);
						}
					}
				}
			}

			GLOBAL_OBJ.LOGD(this._TAG, "doBudgetLiang end; seatId:" + this.seatId);
		},

		doBudgetUpDrawMahj:function () {
			if(this.draw){
				this.draw.getRootNode().removeFromParent();
				this.draw = null;
			}
		},

		setOwnLCButtonVisible:function ( _seen ) {},

		// 最后胡牌时选择将牌扣下
		doBudgetDownMahj: function( _fake, _isFirst, _playmode, _winNum ) {
			if(this.isGameOver){
				GLOBAL_OBJ.LOGD("doBudgetDownMahj_over_return");
				return;//牌局结束了，说明已经亮过牌了，就不在扣牌了，状态控制
			}

			GLOBAL_OBJ.LOGD(this._TAG, "doBudgetDownMahj start; seatId:" + this.seatId);

			var that = this;
			var _parent;
			GLOBAL_OBJ.LOGD("now_player_seatId = ", this.seatId);

			if (_isFirst && !_fake)
			{
				AUDIO.audio(GLOBAL_OBJ.RES.JIPINGHU_EFFECT_EFFECT_TUIDAO_MP3);
			}
			var mjss;

			if(_isFirst || _fake) { // 只有第一次胡才扣牌和断线重联
				if(!this.isLayPanel){ // 牌没有扣倒，和牌了就扣倒（加这个字段是因为金币场-血流，即使这个人胡了，也有可能破产认输进行扣牌，这里为了防止两个动作重复）
					this.isLayPanel = true;
					if (this.seatId == GLOBAL_T.MYSEAT) {
						_parent = that.unseenNode;
						this.setHuState(true);//本家已经胡了的标记
						if (this.draw != null) {
							this.draw.doLayTransform(this.seatId, true);
							this.draw.doDownSimple(true);//牌落下
							this.draw.cancelTingSuperscript();//如果有听牌，取消听角标
						}

						for (var i = 0; i < this.mahjs.length; ++i) {
							mjss = this.mahjs[i];
							if (mjss) {
								mjss.doLayTransform(this.seatId, true);
								mjss.doDownSimple(true);//牌落下
								mjss.cancelTingSuperscript();//如果有听牌，取消听角标
							}
						}

						this.doLock();//锁牌

					} else {//只有其他玩家手牌扣倒
						_parent = that.seenNode;
                        this.seenable = true;
                        this.setHuState(true);//其他家已经胡了的标记
						var tarNode, lzo;
						if (this.draw != null) {
							tarNode = this.seenSlots[14];
							this.draw.doLayTransform(this.seatId, false);
							if (this.seatId == GLOBAL_T.SEATS.N3){
								this.draw.getRootNode().setLocalZOrder(14);
							}
							else if (this.seatId == GLOBAL_T.SEATS.N1){
								this.draw.getRootNode().setLocalZOrder(-1);
							}
							if (this.draw.getRootNode().getScale() != 1){
								//手牌有可能被缩放过
								this.draw.getRootNode().setScale(1);
							}
							GLOBAL_FUNCS.changeParent(this.draw.getRootNode(), _parent,tarNode.getPosition());
						}

						for (var i = 0; i < this.mahjs.length; ++i) {
							mjss = this.mahjs[i];
							if (mjss) {
								tarNode = this.seenSlots[i];
								mjss.doLayTransform(this.seatId, false);
								if (this.seatId == GLOBAL_T.SEATS.N3){
									lzo = this.mahjs.length - i;
									mjss.getRootNode().setLocalZOrder(lzo);
									GLOBAL_OBJ.LOGD(this._TAG, "mjss.setLocalZOrder; getLocalZOrder():" + lzo + ";seatId:" + this.seatId);
								}
								if (this.mahjs[i].getRootNode().getScale() != 1){
									//手牌有可能被缩放过
									this.mahjs[i].getRootNode().setScale(1);
								}
								GLOBAL_FUNCS.changeParent(this.mahjs[i].getRootNode(), _parent, tarNode.getPosition());
							}
						}
					}
				}
			}

			GLOBAL_OBJ.LOGD(this._TAG, "doBudgetDownMahj end; seatId:" + this.seatId);
		},

		doShowRenShu:function () {

			GLOBAL_OBJ.LOGD(this._TAG, "doShowRenShu start; seatId:" + this.seatId);
			
			var huNode          = this.getPanelHuNode();
			var renshuSpr_1     = cc.Sprite.create();
			var shuSpr_1 		= GLOBAL_OBJ.RES.XLMJ_ZM_TX_SHU01_PNG;
			var renshuSpr_2     = cc.Sprite.create();
			var shuSpr_2 		= GLOBAL_OBJ.RES.XLMJ_ZM_TX_SHU_RS_PNG;

			GLOBAL_FUNCS.textureChange(renshuSpr_1, shuSpr_1);
			GLOBAL_FUNCS.addToParent(renshuSpr_1,huNode,cc.p(0,0));
			GLOBAL_FUNCS.textureChange(renshuSpr_2, shuSpr_2);
			GLOBAL_FUNCS.addToParent(renshuSpr_2,huNode,cc.p(0,0));

			if(!this.isLayPanel){
				this.isLayPanel = true;
				var _parent = this.seenNode;
				var tarNode, lzo;
				if (this.draw != null) {
					tarNode = this.seenSlots[14];
					this.draw.doLayTransform(this.seatId, false);
					if (this.seatId == GLOBAL_T.SEATS.N3){
						this.draw.getRootNode().setLocalZOrder(14);
					}
					else if (this.seatId == GLOBAL_T.SEATS.N1){
						this.draw.getRootNode().setLocalZOrder(-1);
					}
					GLOBAL_FUNCS.changeParent(this.draw.getRootNode(), _parent,tarNode.getPosition());
				}

				for (var i = 0; i < this.mahjs.length; ++i) {
					var mjss = this.mahjs[i];
					if (mjss) {
						tarNode = this.seenSlots[i];
						mjss.doLayTransform(this.seatId, false);
						if (this.seatId == GLOBAL_T.SEATS.N3){
							lzo = this.mahjs.length - i;
							mjss.getRootNode().setLocalZOrder(lzo);
						}
						GLOBAL_FUNCS.changeParent(this.mahjs[i].getRootNode(), _parent, tarNode.getPosition());
					}
				}
			}
            GLOBAL_OBJ.LOGD(this._TAG, "doShowRenShu end; seatId:" + this.seatId);
		},

        setHuState:function ( _isHu ) {
            this.isHuState = _isHu;
        },

        getHuState:function () {
            return this.isHuState;
        },

		/*
		 @是否亮牌*/
		isSeenable:function(){
			return this.seenable;
		},

		doMethodsMove:function()
		{
			GLOBAL_OBJ.LOGD(this._TAG, "doMethodsMove start; seatId:" + this.seatId);
			var slots = this.pteInitMahjsSlots();
			this.draw = this.mahjs.shift();
			this.pteSorting();

			// GLOBAL_FUNCS.changeParent( this.draw.getRootNode(), slots[14] );
			this.setMahjPos(this.draw,slots[14].getPosition());

			GLOBAL_OBJ.LOGD(this._TAG, "doMethodsMove end; seatId:" + this.seatId);
		},
		
		setMahjPos:function (mahj,pt) {
			// GLOBAL_OBJ.LOGD(this._TAG, "setMahjPos start; seatId:" + this.seatId);
			mahj.getRootNode().setPosition(pt);
			if (mahj instanceof guiyang.table.scenes.Table.Mahjong.Mahj.Own){
				mahj.oldPosition.x = pt.x;
				mahj.oldPosition.y = pt.y;
			}
			// GLOBAL_OBJ.LOGD(this._TAG, "setMahjPos end; seatId:" + this.seatId);
		},

		/*
		 @ 传达“麻将牌操作代理”操作，所以前缀say，表示不是本类来做的操作，而是通过本类间接来完成的操作 */
		sayReady:function(_status){ return this; },
		sayGo:function(){},

		/*
		 @返回当前panel的本地座位号*/
		getSeatId:function(){
			return this.seatId;
		},

		doShowTips:function( _parent ){},
		doShutShowTips:function(){},
		onPanelOwnLeave:function () {},
		onPanelOwnContinue:function () {},
		doLock:function () {},
		doUnlock:function () {},

		doDrawLaiZiTile:function(_tiles) {
            // 显示赖子角标
            var curTiles = _tiles || [];
            if (this.draw)
            {
                if (curTiles.indexOf(this.draw.getTile()) >= 0)
                {
                    this.draw.doDrawLaiZi();
                }
            }

            for (var i = 0; i < this.mahjs.length; i++)
            {
                if (curTiles.indexOf(this.mahjs[i].getTile()) >= 0)
                {
                    this.mahjs[i].doDrawLaiZi();
                }
            }
            // 赖子排序
            this.pteSorting();
		},

		/*
		添加冲锋鸡责任鸡特效*/
		createEffectJi:function(_index,isRecover){
			var effectNode = this.getEffectNodeWorld();
			var effectPoint = this.getEffectPoint();
			var that = this;
			//断线重连不播放特效
			if (isRecover) {
				that.doShowChongIcon(_index)
				return
			}
			var _path = null;
			switch(_index){
				case 1:
					//冲锋鸡 特效
					_path = GLOBAL_OBJ.RES.XZ_ZM_TX_CHONGFENGJI_CCBI;
					break;
				case 2:
					//责任鸡 特效
					_path = GLOBAL_OBJ.RES.XZ_ZM_TX_ZERENJI_CCBI;
					break;
			}
			if (_path) {
				GLOBAL_OBJ.bkernel.utils.Animation.play(
					effectNode,
					_path,
					effectPoint,
					function(ani){},
					function(ani){
						that.doShowChongIcon(_index)
					},
					false
				);
			}
		},

		/*
		 获取特效节点*/
		getEffectNodeWorld:function(){
			return this.tableScene.effectPanel;
		},

		/*获取特效节点*/
		getEffectNode:function(){
			return this.effectNode;
		},

		getEffectPoint:function(){
			var pw = this.getEffectNode().convertToWorldSpace(cc.p(0,0));
			var pl = this.getEffectNodeWorld().convertToNodeSpace(pw);
			return pl;
		},

		/*
		 获取头像节点*/
		getPortraitNode:function(){
			return this.portraitNode;
		},

		getWinNode:function(){
			return this.winNode;
		},

		setMahjsTag:function(){
			this.reSetMahjsTag();
		},

		getPanelHuNode: function () {//获取胡牌后胡圆图标的节点
			return this.huNumNode;
		},

		getPanelHuSeenNode: function () {//获取胡牌展示节点
			return this.huSeenNode;
		},

		gethuSeenNodeSpr:function(){//得到和牌展示节点中的牌底
			return this.huSeenNodeSpr;
		},

		playZimoOrDianPaoAni:function ( _winMode, _seatId ) {
            var tx_ccb = MODEL_BUDGETS.getPatternCCBByWinMode(_winMode);
            if (tx_ccb == "") {
				return;
			}
            GLOBAL_OBJ.LOGD(this._TAG, "playZimoOrDianPaoAni seatid ="+_seatId+",  winmode = "+_winMode+"ccb = "+tx_ccb);
			var scaleTx = _seatId == 0 ? 0.9 : 0.7;

			var parent = this.getEffectNodeWorld();
			var pos	= this.getEffectPoint();
			GLOBAL_OBJ.bkernel.utils.Animation.play(
				parent,
                tx_ccb,
				pos,
				function(_animate) {},
				function(_animate) {},
				false, scaleTx);
		},

		reSetMahjsTag:function () {
			var mahj;
			for(var i in this.mahjs){
				mahj = this.mahjs[i];
				mahj.doClean();
			}

			if (this.draw){
				this.draw.doClean();
			}

			GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_T.MAHJ_OWN_EVENTS.DO_UP,{id:0,tileId:0});
			GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_T.MAHJ_SAME_TILE_EVENTS.HIDE_SAME_TILE,{tile:0});
		},

		/*
		 @微信邀请*/
		onInviteJia:function(){
			//如果这个节点内有东西，证明当前这个位置，有玩家坐下
			var isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;
			if(this.portraitNode.getChildrenCount() == 0 && hall.AccountInfo.userID == MODEL_TABLEINFO.getCustomTableHostUid() && isCreate){
				C2S.requestInvite(
					MODEL_TABLEINFO.getRoomId(),
					MODEL_TABLEINFO.getTableId(),
					MODEL_TABLEINFO.getActiveServerSeatId()
				);
			}
		},

		doGetXYAndWH:function ( _winTiles ) {//设置和牌九宫格底框位置及大小，计算牌位置偏移
			GLOBAL_OBJ.LOGD(this._TAG, "doGetXYAndWH start;");
			var winTiles        = _winTiles;
			var seatId          = this.seatId;
			var huSeenSpr       = this.gethuSeenNodeSpr();	//九宫格底框

			var mahj_size		= cc.size(80, 116);		// 麻将的大小
			var mahj_size_lay   = cc.size(100,92);		// 麻将的大小,水平倒下
			var thickness       = 31; 					// 麻将牌的厚度
			var mjcols          = 6;					// 一行有几个麻将
			var kuang           = 12;					// 底框九宫格比麻将多出来的像素
			var winTilesIndex   = winTiles.length - 1;
			var winIndex        = winTilesIndex;
			var lineNum         = Math.floor(winTilesIndex / mjcols);//叠了几层
			var sizeWidth;
			var sizeHeight;
			if(winTilesIndex > mjcols - 1){
				winIndex = mjcols - 1;
			}
			switch (seatId){
				case 0:
					sizeWidth   = kuang + mahj_size.width + mahj_size.width * winIndex;
					sizeHeight  = kuang + mahj_size.height;
					break;
				case 1:
					sizeWidth   = kuang + mahj_size_lay.width;
					sizeHeight  = kuang + mahj_size_lay.height + (mahj_size_lay.height - thickness)  * winIndex;
					break;
				case 2:
					sizeWidth   = kuang + mahj_size.width + mahj_size.width * winIndex;
					sizeHeight  = kuang + mahj_size.height;
					break;
				case 3:
					sizeWidth   = kuang + mahj_size_lay.width;
					sizeHeight  = kuang + mahj_size_lay.height + (mahj_size_lay.height - thickness) * winIndex;
					break;
			}
			GLOBAL_OBJ.LOGD("doGetXYAndWH_bgsize:", JSON.stringify(cc.size(sizeWidth, sizeHeight)));
			huSeenSpr.setContentSize(cc.size(sizeWidth,sizeHeight));
			huSeenSpr.setVisible(false);
		},

		doGetHuPaiOffXY:function ( _winTilesLength ) {//获得和牌砸牌位置偏移量
			var winTilesLength  = _winTilesLength;
			var seatId          = this.seatId;
			var mahj_size		= cc.size(80, 116);			// 麻将的大小
			var mahj_size_lay   = cc.size(100,92);			// 麻将的大小,水平倒下
			var thickness       = 31; 						// 麻将牌的厚度

			var mjcols          = 6;						// 一行有几个麻将
			var winTilesIndex   = winTilesLength - 1;
			var lineNum         = Math.floor(winTilesIndex / mjcols);//叠了几层
			var offXX           = 0;
			var offYY           = 0;
			var zorder			= 0;
			GLOBAL_OBJ.LOGD("doGetHuPaiOffXY_winTilesLength:", winTilesLength);
			switch (seatId){
				case 0:
					offYY       = lineNum * thickness;
					offXX		= (winTilesIndex % mjcols) * (mahj_size.width);
					zorder		= winTilesLength;
					break;
				case 1:
					offYY       = lineNum * thickness - (winTilesIndex % mjcols) * (mahj_size_lay.height - thickness);
					zorder		= winTilesLength;
					break;
				case 2:
					offYY       = lineNum * thickness;
					offXX		= (winTilesIndex % mjcols) * (mahj_size.width);
					zorder		= winTilesLength;
					break;
				case 3:
					// offYY       = lineNum * thickness + (winTilesIndex % mjcols) * (mahj_size_lay.height - thickness);
					// zorder		= mjcols*(lineNum + 1) - winTilesLength;
					offYY       = lineNum * thickness - (winTilesIndex % mjcols) * (mahj_size_lay.height - thickness);
					zorder		= winTilesLength;
					break;
			}
			var datas = {};
			datas.offX = offXX;
			datas.offY = offYY;
			datas.zorder = zorder;

			GLOBAL_OBJ.LOGD("doGetHuPaiOffXY_datas:", JSON.stringify(datas));
			return datas;
		},

		//胡牌状态
		playHuAnimation:function (_winTiles, _multiWinTiles) {
			var seatId          = this.seatId;
			var winTiles        = _winTiles;
			var multiWinTiles   = _multiWinTiles || [];//一炮多响的牌在winTiles数组里的index
			var fake            = MODEL_BUDGETS.getIsReconnect(seatId);
			var winTilesIndex   = winTiles.length - 1;
			var _tiesColor      = winTiles[winTilesIndex];

			this.doGetXYAndWH( winTiles );//设置牌底九宫格缩放

			// GLOBAL_OBJ.LOGD("seatId=" + _seatId + "   和牌的花色=" + _tiesColor + "winTiles=" + JSON.stringify(winTiles));
			// GLOBAL_OBJ.LOGD("_multiWinTiles:", JSON.stringify(_multiWinTiles));

			if(fake){
				for(var wi = 0; wi < winTiles.length; wi++){
					var datas       = this.doGetHuPaiOffXY( wi+1 );//获取和牌展示位置偏移
					var multiTile;
					var isDX = false;
					for(var mu = 0; mu < multiWinTiles.length; mu++){
						multiTile = multiWinTiles[mu];
						if(wi == (multiTile -1)){
							isDX = true;
							break;
						}
					}
					var huseenNode  = this.getPanelHuSeenNode();
					_tiesColor      = winTiles[wi];
					var mahj        = GLOBAL_OBJ.table.modules.Mahjong.produce( _tiesColor );
					mahj.doLayTransform(seatId, true);
					if(isDX){
						mahj.doYPDXColor();
					}
					GLOBAL_FUNCS.addToParent( mahj.getRootNode(), huseenNode, cc.p(datas.offX, datas.offY) );
					mahj.getRootNode().setLocalZOrder(datas.zorder);
				}
			}else{

				var datas       = this.doGetHuPaiOffXY( winTiles.length );//获取和牌展示位置偏移
				var isDX        = false;
				var multiTile   = multiWinTiles[multiWinTiles.length - 1] - 1;
				if(multiTile == winTilesIndex){
					isDX = true;
				}
				var huseenNode      = this.getPanelHuSeenNode();
				var mahj = GLOBAL_OBJ.table.modules.Mahjong.produce( _tiesColor );

				mahj.doLayTransform(seatId, true);
				mahj.getRootNode().setVisible(true);
				if(isDX){
					mahj.doYPDXColor();
				}
				GLOBAL_FUNCS.addToParent( mahj.getRootNode(), huseenNode, cc.p(datas.offX, datas.offY) );
				mahj.getRootNode().setLocalZOrder(datas.zorder);
			}

			GLOBAL_OBJ.LOGD(this._TAG, "playHuAnimation end;");
		},

		// 其他人视角上听
		doTing:function (_type) {
			GLOBAL_OBJ.LOGD(this._TAG, "__other_doTing_start__");

			if (this.seatId == GLOBAL_T.MYSEAT) {
				return;
			}

			this.setLocalTingState(true);
            this.doShowTingIcon(_type);

            for(var i = 0; i < this.mahjs.length; ++i){
                this.mahjs[i].doLayTransform(this.seatId, false);
            }

            var huNode = this.getPanelHuNode();
			var tingImg = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES.TABLE_PANEL_TING_PNG);
			GLOBAL_FUNCS.addToParent(tingImg, huNode, cc.p(0, 0));

            GLOBAL_OBJ.LOGD(this._TAG, "__other_doTing_end__");
        },

		setLocalTingState:function (_state) {
			this.panelTingState = _state;
        },

		getLocalTingState:function () {
			return this.panelTingState || false;
        },

	});
	//end
})();