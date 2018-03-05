/*************************************************************
 *  mahjong_table_cpg.js
    mahjong_table_cpg
 *  mahjong
 	麻将吃碰杠
 *
 *  Created by nick.kai.lee on 16-06-06
 *  特殊说明：
	1.3种类型：吃，碰，杠（明杠，暗杠）
	2.由实际的mahjs对象构成，单从ccb看不出来什么

    使用方法:
	var cpg = GLOBAL_OBJ.table.scenes.Table.Mahjong.Cpg.produce(GLOBAL_OBJ.table.global.METHODS.PONG);
	cpg.setMahjs(1,[object,object,...],null,function(_mahjs){});
 */
(function(){
    "use strict";
	var GLOBAL_OBJ = guiyang;

	var GLOBAL_T          = GLOBAL_OBJ.table.global;
	var GLOBAL_FUNCS      = GLOBAL_OBJ.businesses.functions;
	var MODEL_TABLEINFO   = GLOBAL_OBJ.table.models.TableInfo;
	
	var CPG          	= GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"CPG",
		ctor: function(_method) {
			this._super();

			this.method = _method;
			this.mahjs  = []; // 保存吃碰杠的牌组
			this.passSeatId = 0;
		},
		init:function(_ccb){
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();
			this.slots=[];
			//有几个位置就添加几个
			for (var i = 0; i < 4; i++) {
				var _currentSlot = this["slotNode_"+(i+1).toString()];
				if(_currentSlot){
					this.slots.push(_currentSlot);
					// GLOBAL_OBJ.LOGD(this._TAG,"slotNode_"+(i+1).toString()+" : "+(this.slots[this.slots.length-1].getPositionY()).toString());
				}else{
					break;
				}
			} 
			// GLOBAL_OBJ.LOGD(this._TAG,"吃碰杠粘 位置 创建。可放置位置个数为 : "+this.slots.length);
		},

		onCleanup:function() {
			this._super();
		},

		/*
		@设置吃碰杠牌面 
		params _seatId: 座位id
		params _mahjs:  牌对象数组
		params _isSeen: 是否亮牌 bool 轻易别传参数，按默认即可，除非杠牌需要亮牌了
		params _callFunc: 完事回调*/
		setMahjs:function(_seatId, _mahjs, _isSeen, _callFunc, _passiveSeatId, _activeSeatId){
			// GLOBAL_OBJ.LOGD(this._TAG,"吃碰杠粘 位置 设置麻将牌 , 设置的个数: "+_mahjs.length);
			// GLOBAL_OBJ.LOGD(this._TAG,"吃碰杠粘 位置 的个数: "+this.slots.length);
			var callFunc = _callFunc || function(){};
			this.mahjs    = _mahjs || [];

			this.mahjs.sort(function (a, b) {
				return a.getTile() > b.getTile();
			});

			for(var j = 0 ; j < this.mahjs.length; ++j){
				this.mahjs[j].disableTouch();
			}

			//牌的摆放位置是从左到右的。
			if(_seatId == GLOBAL_T.SEATS.N2 && _mahjs.length == 2){
				//如果坐上位的玩家粘牌了,两张牌在左面，右面的是空的。会被手牌压住
				//所以，占用中间和右面的位置。
				GLOBAL_FUNCS.changeParent(this.mahjs[0].getRootNode(), this.slots[0]);
				GLOBAL_FUNCS.changeParent(this.mahjs[1].getRootNode(), this.slots[1]);
				//禁止触摸了
				this.mahjs[0].doLock();
				this.mahjs[1].doLock();
			}else{
				for(var i = 0 ; i < this.mahjs.length; ++i){
					GLOBAL_FUNCS.changeParent(this.mahjs[i].getRootNode(), this.slots[i]);
					this.mahjs[i].doLock(); //禁止触摸了
				}
			}

			this.doLayTransform(_seatId, _isSeen);
			this.doShowArrow(_activeSeatId, _passiveSeatId);

			this.showGetTile();

			switch(_seatId){
				case GLOBAL_T.SEATS.N0:
					this.playAnim("bottom", callFunc);
					break;
				case GLOBAL_T.SEATS.N1:
					this.playAnim("right", callFunc);
					break;
				case GLOBAL_T.SEATS.N2:
					this.playAnim("top", callFunc);
					break;
				case GLOBAL_T.SEATS.N3:
					this.playAnim("left", callFunc);
					break;
			}
		},

		/**
		 * 吃牌的情况下，着重显示吃来的牌
		 */
		showGetTile:function () {
			if (this.method == GLOBAL_T.METHODS.CHOW && this.getTile){
				for(var j = 0 ; j < this.mahjs.length; ++j){
					if (this.mahjs[j].tileId == this.getTile){
						this.mahjs[j].setHintSprOpacity(0.26, cc.color(158, 33, 0));
					}
				}
			}
		},

		/*
		@设置吃碰杠牌面
		params _seatId: 座位id
		params _tiles:  花色数组
		params _isSeen: 是否亮牌 bool 轻易别传参数，按默认即可，除非杠牌需要亮牌了
		params _callFunc: 完事回调*/
		setTiles:function(_seatId, _tiles, _isSeen, _callFunc, _passiveSeatId, _activeSeatId){
			var tiles  = _tiles || [];
			// GLOBAL_OBJ.LOGD(this._TAG,"_tiles  : "+tiles);
			// GLOBAL_OBJ.LOGD(this._TAG," this.slots  : "+JSON.stringify(  this.slots ));
			// var mahjs  = GLOBAL_OBJ.table.scenes.Table.Functions.init_tiles( tiles, GLOBAL_OBJ.table.scenes.Table.Mahjong.Mahj, this.slots, _seatId, true, function(){} )

			if (this.method == GLOBAL_T.METHODS.CHOW && tiles.length == 4){
				this.getTile = tiles[3];
				tiles.length = 3;
			}

			GLOBAL_OBJ.LOGD(this._TAG, "setTiles");
			var mahjs = [];
			for(var i = 0; i < tiles.length; i ++){
				mahjs.push(GLOBAL_OBJ.table.modules.Mahjong.produce(tiles[i],_seatId));
			}
			this.setMahjs(_seatId, mahjs, _isSeen, _callFunc, _passiveSeatId, _activeSeatId);
		},

		/*
		@获取吃碰杠牌组 */
		getMahjs:function(){
			return this.mahjs;
		},

		/*
		@吃碰杠类型 */
		getMethods:function(){
			return this.method;
		},

		doShowArrow: function(_activeSeatId, _passiveSeatId) {

			if (this.method == GLOBAL_T.METHODS.CONCEALED_KONG){
				return;// 暗杠是不需要说明指向的
			}

			var activeSeatId = _activeSeatId;
			var seatIdInterval = _passiveSeatId - activeSeatId;
			// cc.log('Show Arrow _activeSeatId=' + activeSeatId + '   _passiveSeatId==' + _passiveSeatId + '   seatIdInterval==' + seatIdInterval);
			this.passSeatId = _passiveSeatId;
			switch (activeSeatId) {
				case GLOBAL_T.SEATS.N0:
					if (seatIdInterval == 1) {
						this.doShowRightArrow();
					} else if (seatIdInterval == 2) {
						this.doShowUpArrow();
					} else if (seatIdInterval == 3) {
						this.doShowLeftArrow();
					} else {
						this.doHideAllArrow();
					}
					break;
				case GLOBAL_T.SEATS.N1:
					if (seatIdInterval == 1) {
						this.doShowUpArrow();
					} else if (seatIdInterval == 2) {
						this.doShowLeftArrow();
					} else if (seatIdInterval == -1) {
						this.doShowBottomArrow();
					} else {
						this.doHideAllArrow();
					}
					break;
				case GLOBAL_T.SEATS.N2:
					if (seatIdInterval == -1) {
						this.doShowRightArrow();
					} else if (seatIdInterval == -2) {
						this.doShowBottomArrow();
					} else if (seatIdInterval == 1) {
						this.doShowLeftArrow();
					} else {
						this.doHideAllArrow();
					}
					break;
				case GLOBAL_T.SEATS.N3:
					if (seatIdInterval == -1) {
						this.doShowUpArrow();

					} else if (seatIdInterval == -2) {
						this.doShowRightArrow();
					} else if (seatIdInterval == -3) {
						this.doShowBottomArrow();
					} else {
						this.doHideAllArrow();
					}
					break;

				default:
					this.doHideAllArrow();
					break;
			}

		},

		getPassSeatId:function () {
			return this.passSeatId;
		},

		doShowUpArrow: function() {
			this.arrowUpNode.setVisible(true);
			this.arrowLeftNode.setVisible(false);
			this.arrowRightNode.setVisible(false);
			this.arrowBottomNode.setVisible(false);
		},
		doShowLeftArrow: function() {
			this.arrowUpNode.setVisible(false);
			this.arrowLeftNode.setVisible(true);
			this.arrowRightNode.setVisible(false);
			this.arrowBottomNode.setVisible(false);
		},
		doShowBottomArrow: function() {
			this.arrowUpNode.setVisible(false);
			this.arrowLeftNode.setVisible(false);
			this.arrowRightNode.setVisible(false);
			this.arrowBottomNode.setVisible(true);
		},
		doShowRightArrow: function() {
			this.arrowUpNode.setVisible(false);
			this.arrowLeftNode.setVisible(false);
			this.arrowRightNode.setVisible(true);
			this.arrowBottomNode.setVisible(false);
		},
		doHideAllArrow: function() {
			this.arrowUpNode.setVisible(false);
			this.arrowLeftNode.setVisible(false);
			this.arrowRightNode.setVisible(false);
			this.arrowBottomNode.setVisible(false);
		},

		/*
		@牌站立
		params _orientation: 方位 0～4 下右上左
		params _isSeen: 是否亮牌 bool 轻易别传参数，按默认即可，除非杠牌需要亮牌了*/
		doStandTransform:function(_orientation, _isSeen){
			switch(this.method){
				case GLOBAL_T.METHODS.PONG:
				case GLOBAL_T.METHODS.CHOW:
				case GLOBAL_T.METHODS.GRAB_PONG:
				case GLOBAL_T.METHODS.GRAB_CHOW:
				case GLOBAL_T.METHODS.EXPOSED_KONG:
					for(var i = 1 ; i <= this.mahjs.length; ++i){
						this.mahjs[i-1].doStandTransform(_orientation, null == _isSeen ? true : _isSeen);
					}
					break;
				case GLOBAL_T.METHODS.CONCEALED_KONG:				
					//暗杠最上面一张牌，且只能是自己，才允许亮牌，其他玩家不允许亮牌
					this.mahjs[0].doStandTransform(_orientation, false);
					this.mahjs[1].doStandTransform(_orientation, false);
					this.mahjs[2].doStandTransform(_orientation, false);

					// TRIP 按照 MODEL_TABLEINFO.getPlayMode()
					//this.mahjs[3].doStandTransform(_orientation, _orientation==GLOBAL_T.MYSEAT ? true : (null != _isSeen ? _isSeen : false) );
					this.mahjs[3].doStandTransform(_orientation, _orientation == GLOBAL_T.MYSEAT);

				break;
			}
		},

		/*
		@牌倒下
		params _orientation: 方位 0～4 下右上左
		params _isSeen: 是否亮牌 bool 轻易别传参数，按默认即可，除非杠牌需要亮牌了*/
		doLayTransform:function(_orientation, _isSeen){
			switch(this.method){
				case GLOBAL_T.METHODS.PONG:
				case GLOBAL_T.METHODS.CHOW:
				case GLOBAL_T.METHODS.GRAB_PONG:
				case GLOBAL_T.METHODS.GRAB_CHOW:
				case GLOBAL_T.METHODS.EXPOSED_KONG:
					for(var i = 1 ; i <= this.mahjs.length; ++i){
						this.mahjs[i-1].doLayTransform(_orientation, null == _isSeen ? true : _isSeen);
					}
					break;
				case GLOBAL_T.METHODS.CONCEALED_KONG:
					//暗杠最上面一张牌，且只能是自己，才允许亮牌，其他玩家不允许亮牌
					this.mahjs[0].doLayTransform(_orientation, false);
					this.mahjs[1].doLayTransform(_orientation, false);
					this.mahjs[2].doLayTransform(_orientation, false);

					this.mahjs[3].doLayTransform(_orientation, _orientation==GLOBAL_T.MYSEAT ? true : (null != _isSeen ? _isSeen : false) );

					break;
			}
		}
	});
	//end

	GLOBAL_OBJ.table.scenes.Table.Mahjong.Cpg = {
		produce:function(_method){
			var cpg = new CPG(_method);
			switch(_method){
				case GLOBAL_T.METHODS.PONG:
				case GLOBAL_T.METHODS.GRAB_PONG:
					cpg.init(GLOBAL_OBJ.RES.TABLE_PONG_CCBI);
					break;
				case GLOBAL_T.METHODS.GRAB_KONG_BU:
					cpg.init(GLOBAL_OBJ.RES.TABLE_KONG_BU_CCBI);
					break;
				case GLOBAL_T.METHODS.CHOW:
				case GLOBAL_T.METHODS.GRAB_CHOW:
					cpg.init(GLOBAL_OBJ.RES.TABLE_CHOW_CCBI);
					break;
				case GLOBAL_T.METHODS.CONCEALED_KONG:
					cpg.init(GLOBAL_OBJ.RES.TABLE_CONCEALED_KONG_CCBI);
					break;
				case GLOBAL_T.METHODS.EXPOSED_KONG:
					cpg.init(GLOBAL_OBJ.RES.TABLE_EXPOSED_KONG_CCBI);
					break;
			}
			return cpg;
		}
	};

})();