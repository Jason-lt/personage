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
    "use strict";
	var GLOBAL_OBJ = guiyang;
    var GLOBAL_T = GLOBAL_OBJ.table.global;

	var AUDIO = GLOBAL_OBJ.bkernel.utils.Audio;



	GLOBAL_OBJ.table.scenes.Table.Mahjong.Mahj.Own = GLOBAL_OBJ.table.scenes.Table.Mahjong.Mahj.extend({
		_TAG:"table.scenes.Table.Mahjong.Mahj.Own",
		ctor: function(_tileId) {
			this._super(_tileId);

			this.state 				= GLOBAL_T.MAHJ_OWN_STATE.NORMAL;
			this.lastState 			= GLOBAL_T.MAHJ_OWN_STATE.NORMAL;
			this.positionState 		= GLOBAL_T.MAHJ_OWN_POSITION_STATE.NORMAL;
			this.canTouch 			= true;
			this.oldPosition 		= cc.p(39, 58);
			GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_T.MAHJ_OWN_EVENTS.DO_UP, this.onRevDoUp, this);
			if (true == GLOBAL_OBJ.businesses.global.DEBUG) {
				this.tileLabel.setColor(cc.color(0,0,0,255));
			}
		},

		onCleanup:function() {
			//删除事件
			GLOBAL_OBJ.LOGD(this._TAG, "本家麻将销毁！！！！花色：" + this.getTile());
			GLOBAL_OBJ.bkernel.utils.Notification.ignore( GLOBAL_T.MAHJ_OWN_EVENTS.DO_UP, this.onRevDoUp,this);
			// GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);

			this._super();
		},

		destroy:function () {
			GLOBAL_OBJ.bkernel.utils.Notification.ignore( GLOBAL_T.MAHJ_OWN_EVENTS.DO_UP, this.onRevDoUp,this);
			// GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
			this.oldPosition = null;
			this._super();
		},

		/*
		 清理操作*/
		doClean:function(){
			this.state 			= GLOBAL_T.MAHJ_OWN_STATE.NORMAL;
			this.lastState 		= GLOBAL_T.MAHJ_OWN_STATE.NORMAL;
			this.positionState 	= GLOBAL_T.MAHJ_OWN_POSITION_STATE.NORMAL;
			this.canTouch 		= true;

			this._super();
		},

		recoverNotification:function () {
			GLOBAL_OBJ.LOGI("recoverNotification", "麻将复用，恢复本家麻将状态和监听");
			GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_T.MAHJ_OWN_EVENTS.DO_UP, this.onRevDoUp, this);
			this.state 				= GLOBAL_T.MAHJ_OWN_STATE.NORMAL;
			this.lastState 			= GLOBAL_T.MAHJ_OWN_STATE.NORMAL;
			this.positionState 		= GLOBAL_T.MAHJ_OWN_POSITION_STATE.NORMAL;
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

			if (this.positionState == GLOBAL_T.MAHJ_OWN_POSITION_STATE.UP){
				return;
			}
			
			this.positionState = GLOBAL_T.MAHJ_OWN_POSITION_STATE.UP;
			this.toUpLocation();
			var tileId = this.getTile();

			AUDIO.audio(GLOBAL_OBJ.RES.UI_TILECLICK_MP3);

			GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_T.MAHJ_SAME_TILE_EVENTS.SHOW_SAME_TILE,{tile: tileId});
			GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_T.MAHJ_OWN_EVENTS.DO_UP, {id: this.getObjectIdentifier(),tileId:tileId});
			GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_T.MAHJ_OWN_EVENTS.DO_SHOW_TING_PREVIEW, this);
			
			GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.DO_SHOW_HU_PREVIEW, {_mahj:this,isShow:true});
		},


		doUpSimple:function (showSameTile) {
			if (!this.canTouch){
				return;
			}
			if (this.positionState == GLOBAL_T.MAHJ_OWN_POSITION_STATE.UP){
				return;
			}

			this.positionState = GLOBAL_T.MAHJ_OWN_POSITION_STATE.UP;
			this.toUpLocation();

			if (showSameTile){
				var tileId = this.getTile();
				AUDIO.audio(GLOBAL_OBJ.RES.UI_TILECLICK_MP3);
				GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_T.MAHJ_SAME_TILE_EVENTS.SHOW_SAME_TILE,{tile: tileId});
			}
		},

		doDownSimple:function (par) {
			if (!this.canTouch){
				return;
			}
			if (this.positionState == GLOBAL_T.MAHJ_OWN_POSITION_STATE.NORMAL){
				return;
			}

			this.positionState = GLOBAL_T.MAHJ_OWN_POSITION_STATE.NORMAL;
			this.getRootNode().setPositionY(this.oldPosition.y);
			// this.getRootNode().setPositionX(this.oldPosition.x);

			if (par){
				var tileId = this.getTile();
				GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_T.MAHJ_SAME_TILE_EVENTS.HIDE_SAME_TILE,{tile: tileId});
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
			if (this.positionState == GLOBAL_T.MAHJ_OWN_POSITION_STATE.NORMAL){
				return;
			}

			this.positionState = GLOBAL_T.MAHJ_OWN_POSITION_STATE.NORMAL;
			this.getRootNode().setPositionY(this.oldPosition.y);
			// this.getRootNode().setPositionX(this.oldPosition.x);
			var tileId = this.getTile();
			if (par)
				GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_T.MAHJ_SAME_TILE_EVENTS.HIDE_SAME_TILE,{tile: tileId});

			if(this.state == GLOBAL_T.MAHJ_OWN_STATE.TING_UP){
				GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_T.MAHJ_OWN_EVENTS.DO_HIDE_TING_PREVIEW, this);
			}
			GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.DO_SHOW_HU_PREVIEW, {_mahj: this,isShow:false});
		},

		checkIsOut:function () {

			var mjNode = this.getRootNode();
			var ctn = mjNode.getParent();
			var size = ctn.getContentSize();

			var getY = mjNode.getPositionY();
			var maxY = this.getMaxYInPanel();

			this.positionState = GLOBAL_T.MAHJ_OWN_POSITION_STATE.NORMAL;

			GLOBAL_OBJ.LOGI(this._TAG, "----------- 检查牌是否在手牌区，当前Y坐标为：" + getY + ",当前最高限制为：" + maxY + ";当前花色：" + this.getTile());
			if (getY > maxY){

				this.doDiscard();

				GLOBAL_OBJ.LOGI(this._TAG, "-----------  要出牌了..............");
				// this.resetPosition();
			}
			else{
				//返回原坐标
				GLOBAL_OBJ.LOGI(this._TAG, "----------- 返回原坐标");
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
			this.positionState = GLOBAL_T.MAHJ_OWN_POSITION_STATE.NORMAL;
			var mjNode = this.getRootNode();
			mjNode.setPosition(this.oldPosition);
			GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_T.MAHJ_SAME_TILE_EVENTS.HIDE_SAME_TILE,{tile:0});
		},

		/*
		 出牌操作*/
		doDiscard:function(){
			this._super();
			GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_T.MAHJ_OWN_EVENTS.DO_DISCARD, this);
			GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_T.MAHJ_SAME_TILE_EVENTS.HIDE_SAME_TILE,{tile:0});
		},

		disableTouch:function () {
			this._super();
			this.canTouch = false;
		},

		enableTouch:function () {
			this._super();
			this.canTouch = true;
		},
		setPatternSprPosY:function (_posY) {
			this._super(_posY);
		},

		doMarkAbsenceMahj:function (_type, _mahj) {
			this._super(_type, _mahj);
		},

		// 不允许出牌
		doLock:function(){
			this.state = GLOBAL_T.MAHJ_OWN_STATE.NORMAL;
		},

		// 允许出牌
		doUnlock:function(){
			this.state = GLOBAL_T.MAHJ_OWN_STATE.CANOUT;
		},

		//设置麻将状态
		setMJTingKouState:function ( isTing ) {
			if(isTing){
				this.lastState = this.state;
				this.state = GLOBAL_T.MAHJ_OWN_STATE.TING_UP;
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