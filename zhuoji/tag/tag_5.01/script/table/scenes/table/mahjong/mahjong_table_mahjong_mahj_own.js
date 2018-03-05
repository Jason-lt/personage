/*************************************************************
 *  mahjong_table_mahjong_mahj_own.js
    mahjong_table_mahjong_mahj_own
 *  mahjong
 	本家麻将牌
 *
 *  Created by nick.kai.lee on 16-06-16
 *  许敬 2017-4-19 重构
 *  特殊说明：
 	参考mahjong_table_mahjong_mahj.js
	
	麻将对象本身会抛出一个”DISCARD“出牌的事件，外部如有需要，监听即可

    使用方法:
    var mahj = new GLOBAL_OBJ.table.scenes.Table.Mahjong.Mahj.Own(1);
    mahj.doStandTransform(0, true);
	
	mahj.addEventListener("DISCARD", function(_params){
		var object = _params.mahj; //就是mahj对象
	});
    ....
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var TAG = 'mahjong_mahj_own';

	var GLOBAL_T 			                    = GLOBAL_OBJ.table.global;
	var GLOBAL_FUNCS                            = GLOBAL_OBJ.businesses.functions;
	var AUDIO                     				= GLOBAL_OBJ.bkernel.utils.Audio;

	MAHJ_OWN_STATE = {
		NORMAL  : 0,  //普通状态，就是不能出牌
		CANOUT  : 1,  //可以被打出去
		BUGANG  : 2,  //补杠
		TING_UP : 3   //听扣
	};

	MAHJ_OWN_POSITION_STATE = {
		NORMAL : 0, //普通状态
		UP : 1      //抬起来的状态
	};

	MAHJ_OWN_EVENTS = {
		DO_UP      : "DO_UP",
		DO_DISCARD : "DO_DISCARD",
		ON_DRAG    : "ON_DRAG",
		DO_SHOW_TING_PREVIEW : "DO_SHOW_TING_PREVIEW",
		DO_HIDE_TING_PREVIEW : "DO_HIDE_TING_PREVIEW"
	};

	GLOBAL_OBJ.table.scenes.Table.Mahjong.Mahj.Own = GLOBAL_OBJ.table.scenes.Table.Mahjong.Mahj.extend({
		_TAG:"table.scenes.Table.Mahjong.Mahj.Own",
		ctor: function(_tileId) {
			this._super(_tileId);

			this.state 				= MAHJ_OWN_STATE.NORMAL;
			this.lastState 			= MAHJ_OWN_STATE.NORMAL;
			this.positionState 		= MAHJ_OWN_POSITION_STATE.NORMAL;
			this.canTouch 			= true;
			this.oldPosition 		= cc.p(39, 58);
			GLOBAL_OBJ.bkernel.utils.Notification.listen( MAHJ_OWN_EVENTS.DO_UP, this.onRevDoUp, this);
			if (true == GLOBAL_OBJ.businesses.global.DEBUG) {
				this.tileLabel.setColor(cc.color(0,0,0,255));
			}
		},

		onCleanup:function() {
			//删除事件
			GLOBAL_OBJ.LOGD(this._TAG, "本家麻将销毁！！！！花色：" + this.getTile());
			GLOBAL_OBJ.bkernel.utils.Notification.ignore( MAHJ_OWN_EVENTS.DO_UP, this.onRevDoUp,this);
			// GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);

			this._super();
		},

		destroy:function () {
			GLOBAL_OBJ.bkernel.utils.Notification.ignore( MAHJ_OWN_EVENTS.DO_UP, this.onRevDoUp,this);
			// GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
			this.oldPosition = null;
			this._super();
		},

		/*
		 清理操作*/
		doClean:function(){
			this.state 			= MAHJ_OWN_STATE.NORMAL;
			this.lastState 		= MAHJ_OWN_STATE.NORMAL;
			this.positionState 	= MAHJ_OWN_POSITION_STATE.NORMAL;
			this.canTouch 		= true;
			this._super();
		},

		recoverNotification:function () {
			GLOBAL_OBJ.LOGI("recoverNotification", "麻将复用，恢复本家麻将状态和监听");
			GLOBAL_OBJ.bkernel.utils.Notification.listen( MAHJ_OWN_EVENTS.DO_UP, this.onRevDoUp, this);
			this.state 				= MAHJ_OWN_STATE.NORMAL;
			this.lastState 			= MAHJ_OWN_STATE.NORMAL;
			this.positionState 		= MAHJ_OWN_POSITION_STATE.NORMAL;
			this.canTouch 			= true;
			this.oldPosition 		= cc.p(39,56);
			// if (true == GLOBAL_OBJ.businesses.global.DEBUG) {
			// 	this.tileLabel.setColor(cc.color(255,0,0,255));
			// }
			this._super("own_mahj");
		},

		onRevDoUp:function (obj) {
			var gid = obj.id;
			var tileId = obj.tileId;
			if (obj.tileId == 0){
				this.doDown(false);
			}
			else {
				if (gid != this.getObjectIdentifier()){//不是自己
					if (this.getTile() != tileId){//不是同一花色
						this.doDown(true);
					}
					else{
						this.doDown(false);
					}
				}
			}
		},

		doUp:function () {
			if (!this.canTouch){
				return;
			}
			if (this.positionState == MAHJ_OWN_POSITION_STATE.UP){
				return;
			}
			
			this.positionState = MAHJ_OWN_POSITION_STATE.UP;
			this.toUpLocation();
			var tileId = this.getTile();

			AUDIO.audio(GLOBAL_OBJ.RES.UI_TILECLICK_MP3);

			GLOBAL_OBJ.bkernel.utils.Notification.trigger( MAHJ_SAME_TILE_EVENTS.SHOW_SAME_TILE,{tile: tileId});
			GLOBAL_OBJ.bkernel.utils.Notification.trigger( MAHJ_OWN_EVENTS.DO_UP, {id: this.getObjectIdentifier(),tileId:tileId});
			GLOBAL_OBJ.bkernel.utils.Notification.trigger( MAHJ_OWN_EVENTS.DO_SHOW_TING_PREVIEW, this);
		},


		doUpSimple:function (showSameTile) {
			if (!this.canTouch){
				return;
			}
			if (this.positionState == MAHJ_OWN_POSITION_STATE.UP){
				return;
			}

			this.positionState = MAHJ_OWN_POSITION_STATE.UP;
			this.toUpLocation();

			if (showSameTile){
				var tileId = this.getTile();
				AUDIO.audio(GLOBAL_OBJ.RES.UI_TILECLICK_MP3);
				GLOBAL_OBJ.bkernel.utils.Notification.trigger( MAHJ_SAME_TILE_EVENTS.SHOW_SAME_TILE,{tile: tileId});
			}
		},

		doDownSimple:function (par) {
			if (!this.canTouch){
				return;
			}
			if (this.positionState == MAHJ_OWN_POSITION_STATE.NORMAL){
				return;
			}

			this.positionState = MAHJ_OWN_POSITION_STATE.NORMAL;
			this.getRootNode().setPositionY(this.oldPosition.y);
			// this.getRootNode().setPositionX(this.oldPosition.x);

			if (par){
				var tileId = this.getTile();
				GLOBAL_OBJ.bkernel.utils.Notification.trigger( MAHJ_SAME_TILE_EVENTS.HIDE_SAME_TILE,{tile: tileId});
			}
		},

		toUpLocation:function(){
			this.getRootNode().setPositionY(this.getUpY());
			// this.getRootNode().setPositionX(this.oldPosition.x);
		},


		/**
		 * 牌落下
		 * @param par 值为true，会发送取消花色高亮的全局消息
		 */
		doDown:function (par) {
			if (!this.canTouch){
				return;
			}
			if (this.positionState == MAHJ_OWN_POSITION_STATE.NORMAL){
				return;
			}

			this.positionState = MAHJ_OWN_POSITION_STATE.NORMAL;
			this.getRootNode().setPositionY(this.oldPosition.y);
			// this.getRootNode().setPositionX(this.oldPosition.x);
			var tileId = this.getTile();
			if (par)
				GLOBAL_OBJ.bkernel.utils.Notification.trigger( MAHJ_SAME_TILE_EVENTS.HIDE_SAME_TILE,{tile: tileId});

			if(this.state == MAHJ_OWN_STATE.TING_UP){
				GLOBAL_OBJ.bkernel.utils.Notification.trigger( MAHJ_OWN_EVENTS.DO_HIDE_TING_PREVIEW, this);
			}
		},

		checkIsOut:function () {

			var mjNode = this.getRootNode();
			var ctn = mjNode.getParent();
			var size = ctn.getContentSize();

			var getY = mjNode.getPositionY();
			var maxY = this.getMaxYInPanel();

			this.positionState = MAHJ_OWN_POSITION_STATE.NORMAL;

			GLOBAL_OBJ.LOGI(TAG, "----------- 检查牌是否在手牌区，当前Y坐标为：" + getY + ",当前最高限制为：" + maxY + ";当前花色：" + this.getTile());
			if (getY > maxY){

				this.doDiscard();

				GLOBAL_OBJ.LOGI(TAG, "-----------  要出牌了..............");
				// this.resetPosition();
			}
			else{
				//返回原坐标
				GLOBAL_OBJ.LOGI(TAG, "----------- 返回原坐标");
				this.resetPosition();
			}
		},

		getUpY:function(){
			return this.oldPosition.y + 20;
		},

		getMaxYInPanel:function(){
			var mjNode = this.getRootNode();
			var ctn = mjNode.getParent();
			var size = ctn.getContentSize();

			var maxY = this.oldPosition.y + size.height - 10;

			return maxY;
		},

		resetPosition:function(){
			if (!this.canTouch){
				return;
			}
			this.positionState = MAHJ_OWN_POSITION_STATE.NORMAL;
			var mjNode = this.getRootNode();
			mjNode.setPosition(this.oldPosition);
			GLOBAL_OBJ.bkernel.utils.Notification.trigger( MAHJ_SAME_TILE_EVENTS.HIDE_SAME_TILE,{tile:0});
		},

		/*
		 出牌操作*/
		doDiscard:function(){
			this._super();
			GLOBAL_OBJ.bkernel.utils.Notification.trigger( MAHJ_OWN_EVENTS.DO_DISCARD, this);
			GLOBAL_OBJ.bkernel.utils.Notification.trigger( MAHJ_SAME_TILE_EVENTS.HIDE_SAME_TILE,{tile:0});
		},

		disableTouch:function () {
			this._super();
			this.canTouch = false;
		},

		enableTouch:function () {
			this._super();
			this.canTouch = true;
		},

		// 不允许出牌
		doLock:function(){
			// GLOBAL_OBJ.LOGI(TAG, "设置自己的麻将为，不可以出牌");
			this.state = MAHJ_OWN_STATE.NORMAL;
		},

		// 允许出牌
		doUnlock:function(){
			// GLOBAL_OBJ.LOGI(TAG, "设置自己的麻将为，可以出牌");
			this.state = MAHJ_OWN_STATE.CANOUT;
		},

		//设置麻将状态
		setMJTingKouState:function ( isTing ) {
			if(isTing){
				this.lastState = this.state;
				this.state = MAHJ_OWN_STATE.TING_UP;
			}else {
				this.resetMJState();
			}
		},

		resetMJState:function () {
			this.state = this.lastState;
		},

	});
	//end
})();