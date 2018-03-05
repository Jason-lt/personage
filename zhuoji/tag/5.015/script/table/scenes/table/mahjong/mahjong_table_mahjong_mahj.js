/*************************************************************
 *  mahjong_table_mahjong_mahj.js
    mahjong_table_mahjong_mahj
 *  mahjong
 	麻将牌
 *
 *  Created by nick.kai.lee on 16-05-31
 *
 1.变形
 麻将牌对象有7种变形模式（ccb动画的形式切换）, 分2种状态（stand站立&lay倒下）
 stand01:上&下区域玩家的牌站立，亮牌
 stand02:上&下区域玩家的牌站立，不亮牌
 stand03:左&右区域玩家的牌站立，不亮牌（默认是左向，右向玩家的牌需要flipX）
 lay01:左&右区域玩家的牌倒下，亮牌（右向花色需要flipX flipY）
 lay02:左&右区域玩家的牌倒下，不亮牌
 lay03:上&下区域玩家的牌倒下，亮牌
 lay04:上&下区域玩家的牌倒下，不亮牌

 2.关键节点
 mainNode： 主节点，牌变形时需要动态调整其sizehe居中位置，touch响应范围的决定节点
 faceSpr00：牌正面精灵
 patternSpr：牌花色精灵
 faceSpr01：牌背面精灵

 3. 复用的时候一定要记得清理之前注册的事件
 使用方法:
 var mahj = new GLOBAL_OBJ.table.scenes.Table.Mahjong.Mahj(1);
 mahj.doStandTransform(0, true);

 4. 牌的变形动画本来是做在ccb里的，因为牌涉及到多套风格的皮肤，ccb里默认加载的是普通桌的皮肤(去除，只在代码里改变纹理)，所以在变形函数里
 改变一次牌的纹理。
 ....
 *  特殊说明：
 *
 *
 *  Change by lcr on 17-09-06
 *  优化抛弃之前的ccb，直接用代码创建，麻将类也不在继承base.BaseController类，而是自己定义一个简单类来管理麻将
 *  麻将基类有控件
 *  rootNode  （模仿原ccb大小（112，112），是个layer）
 *  faceSpr00 （牌底，是个精灵）
 *  patternSpr（花色，是个精灵）
 *
 *  麻将的状态站立、放倒 通过doStandTransform、doLayTransform等方法控制
 *  麻将上的蒙版和角标不是立即创建的，是在麻将需要的时候创建（setHintSprOpacity、setMjMaskSprOpacity、听角标），创建后就不在删除了
 *  麻将是不会被彻底删除的，麻将删除会被通过onCleanup方法加入到麻将回收池中（GLOBAL_OBJ.mahjPool），只有在插件销毁时才会通过destroy方法彻底释放
 *
 */
(function(){
    "use strict";
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_T 			                = GLOBAL_OBJ.table.global;
    var GLOBAL_FUNCS                       	 = GLOBAL_OBJ.businesses.functions;

	GLOBAL_OBJ.table.scenes.Table.Mahjong.Mahj = cc.Class.extend({
		_TAG:"table.scenes.Table.Mahjong.Mahj",
		ctor: function(_tileId) {
			var that = this;
			this.isDestory      = false;
			this._ID_TOKEN  	= GLOBAL_OBJ.bkernel.base.ID_TOKEN_Controller.get();
			this.tileId 	 	= _tileId || 0;//缺省花色id
			this.orientation 	= GLOBAL_T.SEATS.N0;
			this.isLaiZi        = false;
			this.isSameTile 	= false;//是否点击了同一花色，进行高亮提示

			this.hintSpr		= null;		// 蒙版1
			this.mjMask		    = null;		// 蒙版2
			this.tingBottom		= null;		// 听牌角标
			this.isDingQue      = false;    // 缺牌
			this.haveNum		= 0;		// 当前花色牌的数量
			this.laiSubscript   = null;		// 赖子角标
			this.tingMark       = null;     // 听牌遮罩

			this.mahj_size 		= cc.size(78,115);//麻将的大小
			this.mahj_size_lay  = cc.size(100,91);//麻将的大小,水平倒下
			this.thickness      = 31; //麻将牌的厚度

			this.standScale = 1;
			this.layScale = 0.96;

			this.mahj_tile_own_stand_pos = cc.p(0,-9);//本家麻将站立时花色位置
			this.mahj_tile_own_lay_pos 	 = cc.p(0,15);//本家麻将放倒时花色位置
			this.mahj_tile_left_lay_pos  = cc.p(0,15);//左家麻将放倒时花色位置
			this.mahj_tile_right_lay_pos = cc.p(0,15);//右家麻将放倒时花色位置

			this.rootNode	    = cc.Layer.create();
			this.rootNode.controller = this;
			this.rootNode.setAnchorPoint(cc.p(0.5,0.5));
			this.rootNode.setContentSize(cc.size(116,116));//麻将所在layer
			this.faceSpr00		= cc.Sprite.create();//牌底
			this.patternSpr		= cc.Sprite.create();//花色
			this.hintSpr 		= cc.Sprite.create();//蒙版-同花色高亮
			this.setTextureByName(this.hintSpr, GLOBAL_OBJ.RES.ZM_PAI_ZHEZHAO_PNG);
			this.hintSpr.setVisible(false);
			this.rootNode.controller = this;

			this.rootNode.addChild(this.faceSpr00);
			this.faceSpr00.setAnchorPoint(cc.p(0.5,0.5));
			this.faceSpr00.setPosition(0,0);

			this.rootNode.addChild(this.patternSpr);
			this.patternSpr.setAnchorPoint(cc.p(0.5,0.5));
			this.patternSpr.setPosition(this.mahj_tile_own_stand_pos);

			this.rootNode.addChild(this.hintSpr);
			this.hintSpr.setAnchorPoint(cc.p(0.5,0.5));
			this.hintSpr.setPosition(0,0);

			this.faceSpr00.setLocalZOrder(0);
			this.patternSpr.setLocalZOrder(1);
			this.hintSpr.setLocalZOrder(6);

			if (true == GLOBAL_OBJ.businesses.global.DEBUG) {//debug模式下的花色提示
				this.tileLabel		= cc.LabelTTF.create("", " Arial-BoldMT", 34);
				this.rootNode.addChild(this.tileLabel);
				this.tileLabel.setAnchorPoint(cc.p(0.5,0.5));
				this.tileLabel.setPosition(-20,30);
				this.tileLabel.setColor(cc.color(100,20,255,255));
				this.tileLabel.setLocalZOrder(2);
			}

			this.setTile(this.tileId);
			//相同花色显示监听
			this.mahjNotification();

			this.rootNode.onCleanup = function () {
				GLOBAL_OBJ.LOGD(that._TAG, "mahjong_mahj_onCleanup!!!!");
				that.onCleanup();
			}
		},

		showLtBd:function () {
			if (!this._ltbd){
				this._ltbd = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES.MAHJ_FLY_SHOW_BG_PNG);
				this._ltbd.setAnchorPoint(0.5,0.5);
				this.rootNode.addChild(this._ltbd,-1);
				var size = this.rootNode.getContentSize();
				// this._ltbd.setPosition(size.width/2, size.height/2);
				this._ltbd.setPosition(0, 0);
			}
			this._ltbd.setVisible(true);
		},

		hideLtBd:function () {
			if (this._ltbd){
				this._ltbd.setVisible(false);
			}
		},

		mahjNotification:function () {
			GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_T.MAHJ_SAME_TILE_EVENTS.SHOW_SAME_TILE, this.showSameTile, this);
			GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_T.MAHJ_SAME_TILE_EVENTS.HIDE_SAME_TILE, this.hideSameTile, this);
		},

		showSameTile:function (_params) {
			if (_params.tile == this.getTile()) {
				if(!this.isDestory){
					try {
						this.doSameTile();
					}
					catch (e){
						GLOBAL_OBJ.LOGD(this._TAG, "showSameTile，执行异常");
						GLOBAL_OBJ.bkernel.utils.Notification.ignore( GLOBAL_T.MAHJ_SAME_TILE_EVENTS.SHOW_SAME_TILE, this.showSameTile,this);
					}

				}else{
					GLOBAL_OBJ.LOGD(this._TAG, "doSameTile_这个麻将已经被销毁，但是有可能存在极端情况，还存在内存中，所以加个destroy属性容错一下");
					GLOBAL_OBJ.bkernel.utils.Notification.ignore( GLOBAL_T.MAHJ_SAME_TILE_EVENTS.SHOW_SAME_TILE, this.showSameTile,this);
				}
			}
		},

		hideSameTile:function (_params) {
			if(!this.isDestory){

				try {
					if (_params.tile == 0){
						this.cancelSameTile();
					}else{
						if (_params.tile == this.getTile()) {
							this.cancelSameTile();
						}
					}
				}
				catch (e){
					GLOBAL_OBJ.LOGD(this._TAG, "hideSameTile，执行异常");
					GLOBAL_OBJ.bkernel.utils.Notification.ignore( GLOBAL_T.MAHJ_SAME_TILE_EVENTS.SHOW_SAME_TILE, this.showSameTile,this);
				}
			}else{
				GLOBAL_OBJ.LOGD(this._TAG, "cancelSameTile_这个麻将已经被销毁，但是有可能存在极端情况，还存在内存中，所以加个destroy属性容错一下");
				GLOBAL_OBJ.bkernel.utils.Notification.ignore( GLOBAL_T.MAHJ_SAME_TILE_EVENTS.HIDE_SAME_TILE, this.hideSameTile,this);
			}
		},

		getRootNode:function () {
			return this.rootNode;
		},

		onCleanup:function() {
			// GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
			GLOBAL_OBJ.bkernel.utils.Notification.ignore( GLOBAL_T.MAHJ_SAME_TILE_EVENTS.SHOW_SAME_TILE, this.showSameTile,this);
			GLOBAL_OBJ.bkernel.utils.Notification.ignore( GLOBAL_T.MAHJ_SAME_TILE_EVENTS.HIDE_SAME_TILE, this.hideSameTile,this);
			this.cancelDrawLaiZi();
			this.doClean();
			this.rootNode.retain();
			GLOBAL_OBJ.table.modules.Mahjong.pushMjToPool(this);
		},

		recoverNotification:function( _from ) {
			GLOBAL_OBJ.LOGD(this._TAG, "recoverNotification" + "麻将复用，本家恢复父类mahj状态和监听" + _from);
			this.mahjNotification();
			if (true == GLOBAL_OBJ.businesses.global.DEBUG) {
				if(_from == "own_mahj"){
					this.tileLabel.setColor(cc.color(255,0,0,255));
				}else{
					this.tileLabel.setColor(cc.color(100,20,255,255));
				}
			}
		},

		//设置麻将花色的高度
		setPatternSprPosY:function(_posY){
			this.patternSpr.setPositionY(_posY);
		},


		getObjectIdentifier:function(){
			return this._ID_TOKEN;
		},

		destroy:function () {
			GLOBAL_OBJ.LOGD(this._TAG, "麻将 destroy");
			GLOBAL_OBJ.bkernel.utils.Notification.ignore( GLOBAL_T.MAHJ_SAME_TILE_EVENTS.SHOW_SAME_TILE, this.showSameTile,this);
			GLOBAL_OBJ.bkernel.utils.Notification.ignore( GLOBAL_T.MAHJ_SAME_TILE_EVENTS.HIDE_SAME_TILE, this.hideSameTile,this);
			this.cancelDrawLaiZi();
			this.doClean();
			this.rootNode.onCleanup = null;
			GLOBAL_OBJ.bkernel.base.ID_TOKEN_Controller.clean(this._ID_TOKEN);
			this.isDestory = true;
			if (this.rootNode.parent){
				this.rootNode.removeFromParent();
			}
			else{
				this.rootNode.release();
			}
		},

		setMJTingKouState:function (_state) {},
		doUpSimple:function () {},
		doDownSimple:function () {},
		toUpLocation:function () {},
		getUpY:function () {},
		doDown:function () {},
		checkIsOut:function () {},
		getMaxYInPanel:function () {},
		resetPosition:function () {},
		disableTouch:function () {},
		enableTouch:function () {},
		// 不允许出牌
		doLock:function(){},
		// 允许出牌
		doUnlock:function(){},

		/*
		出牌操作*/
		doDiscard:function(){
			this.doTakeOff();//出的牌，干掉装饰
			GLOBAL_OBJ.bkernel.utils.Notification.trigger( "DISCARD", this);
		},

		/*
		清理装饰层*/
		doTakeOff:function(){
			this.doClean();//出的牌，干掉装饰
		},

		/*
		清理操作*/
		doClean:function(){
			GLOBAL_OBJ.LOGD(this._TAG, "mahjong_mahj_doClean!!!!");
			this.setHintSprOpacity();
			this.setMjMaskSprOpacity();
			this.cancelTingSuperscript();
			this.getRootNode().setScale(1.0);
			this.hideLtBd();

			this.orientation 	= GLOBAL_T.SEATS.N0;
			this.isDingQue      = false;
			this.haveNum		= 0;
			this.tingBottom     = null;
			this.isSameTile 	= false;
            this.laiSubscript   = null;
            this.tingMark       = null;
		},

		/*
		@设置麻将牌面
		params _tileId: 花色id from 1*/
		setTile:function(_tileId){
			this.tileId = _tileId != null ? _tileId : this.tileId;//缺省花色id
			var res = GLOBAL_OBJ.GAMENAME.toUpperCase() + "_"+this.tileId+"_PNG";
			// GLOBAL_OBJ.LOGD(this._TAG,"花色：" + res);

			this.setTextureByName(this.patternSpr, GLOBAL_OBJ.RES[res]);
			// this.changePatternScale();
			if (true == GLOBAL_OBJ.businesses.global.DEBUG) {
				this.tileLabel.setString( parseInt(this.tileId) );
			}

			if (this.rootNode.getScale() != 1){
				this.rootNode.setScale(1);
			}

			return this;
		},

		getTile:function(){
			return parseInt(this.tileId);
		},

		setTextureByName:function (_sprite, _imageName) {
			var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(_imageName);

			if (frame){
				_sprite.setSpriteFrame(frame);
			}
		},

		/*
		@牌站立
		params _orientation: 方位 0～4 下右上左
		params _isSeen: 是否亮牌 bool */
		doStandTransform:function(_orientation,_isSeen){

			GLOBAL_OBJ.LOGD(this._TAG, "doStandTransform start;");

			this.faceSpr00.setFlippedX(false);
			this.faceSpr00.setFlippedY(false);
			this.patternSpr.setFlippedX(false);
			this.patternSpr.setFlippedY(false);

			this.patternSpr.setVisible(_isSeen);

            switch(_orientation){
				case GLOBAL_T.SEATS.N0://下
				case GLOBAL_T.SEATS.N2://上
					this.patternSpr.setPositionY(this.mahj_tile_own_stand_pos.y);
					if (_isSeen) {
						this.patternSpr.setRotation(0);
						this.setTextureByName( this.faceSpr00, GLOBAL_OBJ.RES.ZM_TIHUAN_PAI_01_PNG);
					} else {
						this.setTextureByName( this.faceSpr00, GLOBAL_OBJ.RES.ZM_TIHUAN_PAI_04_PNG);
					}
					break;
				case GLOBAL_T.SEATS.N1://右
					if (_isSeen) {
						this.patternSpr.setRotation(0);
						this.setTextureByName( this.faceSpr00, GLOBAL_OBJ.RES.ZM_TIHUAN_PAI_05_PNG);
						this.faceSpr00.setFlippedX(true);
					} else {
						this.setTextureByName( this.faceSpr00, GLOBAL_OBJ.RES.ZM_TIHUAN_PAI_05_PNG);
						this.faceSpr00.setFlippedX(true);
					}
					break;

				case GLOBAL_T.SEATS.N3://左
					if (_isSeen) {
						this.patternSpr.setRotation(0);
						this.setTextureByName( this.faceSpr00, GLOBAL_OBJ.RES.ZM_TIHUAN_PAI_05_PNG);
						this.faceSpr00.setFlippedX(false);
					} else {
						this.setTextureByName( this.faceSpr00, GLOBAL_OBJ.RES.ZM_TIHUAN_PAI_05_PNG);
						this.faceSpr00.setFlippedX(false);
					}
					break;
			}
			this.orientation = _orientation;
			this.changePatternScale();
			GLOBAL_OBJ.LOGD(this._TAG, "doStandTransform end;")
		},

		/*
		@牌倒下
		params _orientation: 方位 0～4 下右上左
		params _isSeen: 是否亮牌 bool */
		doLayTransform:function(_orientation,_isSeen){
			this.faceSpr00.setFlippedX(false);
			this.faceSpr00.setFlippedY(false);
			this.patternSpr.setFlippedX(false);
			this.patternSpr.setFlippedY(false);

			this.patternSpr.setVisible(_isSeen);
			switch(_orientation) {
				case GLOBAL_T.SEATS.N0://下
				case GLOBAL_T.SEATS.N2://上
					this.patternSpr.setRotation(0);
					this.patternSpr.setPositionY(this.mahj_tile_own_lay_pos.y);
					if (_isSeen) {
						this.setTextureByName(this.faceSpr00, GLOBAL_OBJ.RES.ZM_TIHUAN_PAI_03_PNG);
					} else {
						this.setTextureByName(this.faceSpr00, GLOBAL_OBJ.RES.ZM_TIHUAN_PAI_02_PNG);
					}
					if (this.isLaiZi && this.laiSubscript)
					{
                        this.laiSubscript.setRotation(0);
                        this.laiSubscript.setPosition(this.mahj_size.width/2, this.mahj_size.height/2);
					}
					break;
				case GLOBAL_T.SEATS.N1://右
					this.patternSpr.setRotation(-90);
					this.patternSpr.setPositionY(this.mahj_tile_right_lay_pos.y);
					if (_isSeen) {
						this.setTextureByName(this.faceSpr00, GLOBAL_OBJ.RES.ZM_TIHUAN_PAI_06_PNG);
					} else {
						this.setTextureByName(this.faceSpr00, GLOBAL_OBJ.RES.ZM_TIHUAN_PAI_07_PNG);
					}
                    if (this.isLaiZi && this.laiSubscript)
                    {
                        this.laiSubscript.setRotation(-90);
                        this.laiSubscript.setPosition(-this.mahj_size_lay.width/2, this.mahj_size_lay.height/2);
                    }
					break;
				case GLOBAL_T.SEATS.N3://左
					this.patternSpr.setRotation(90);
					this.patternSpr.setPositionY(this.mahj_tile_left_lay_pos.y);
					if (_isSeen) {
						this.setTextureByName(this.faceSpr00, GLOBAL_OBJ.RES.ZM_TIHUAN_PAI_06_PNG);
					} else {
						this.setTextureByName(this.faceSpr00, GLOBAL_OBJ.RES.ZM_TIHUAN_PAI_07_PNG);
					}
                    if (this.isLaiZi && this.laiSubscript)
                    {
                        this.laiSubscript.setRotation(90);
                        this.laiSubscript.setPosition(this.mahj_size_lay.width/2, -15);
                    }
					break;
			}
			this.orientation = _orientation;
			this.changePatternScale();
		},

		doDrawAnimation:function (_seatId, _parent, _pos) {//其他家抓牌效果
            var mjNode = this.getRootNode();
			if (_seatId == 0 || _seatId == 2)
			{

                var oldPos = mjNode.getPosition();
                var jupmPos1 = cc.p(oldPos.x, oldPos.y +30);
                var jupmPos2 = cc.p(oldPos.x, oldPos.y +18);

                mjNode.setPosition(jupmPos1);
                var seq = cc.Sequence.create(
                    cc.EaseBounceIn.create(cc.MoveTo.create(0, jupmPos1)),
                    cc.EaseBounceIn.create(cc.MoveTo.create(0.1, oldPos)),
                    cc.EaseBounceIn.create(cc.MoveTo.create(0.07, jupmPos2)),
                    cc.EaseBounceIn.create(cc.MoveTo.create(0.03, oldPos))
                );
                mjNode.runAction(seq);
			}
			else
			{
				var order = _seatId == 1 ? -1 : 14;
                GLOBAL_OBJ.tableEffectPlayer.play(
                    _parent,
                    GLOBAL_OBJ.RES.MAHJ_DEALING_CCBI,
                    _pos,
                    function(_animate){
                        _animate.getRootNode().setLocalZOrder(order);
                    	mjNode.setVisible(false);
					},
                    function(_animate){
                        mjNode.setVisible(true);
					},
					false, 1, _seatId);
			}
		},

		changePatternScale:function () {
			var scl = this.standScale;
			if (this.orientation == GLOBAL_T.SEATS.N1 || this.orientation == GLOBAL_T.SEATS.N3){
				scl = this.layScale;
			}
			this.patternSpr.setScale(scl);
		},

		setHintSprOpacity:function (_value, _color) {
			var that = this;
			var func = function () {
				var clr = _color || cc.color(0,0,0);
				var value = _value || 0;
				if(value != 0){
					that.hintSpr.setColor(clr);
					that.hintSpr.setOpacity(255*value);
					that.controlMaskOrientation(that.hintSpr);
				}
				that.hintSpr.setVisible(value);
			};

			if(this.hintSpr){
				func();
			}else{
				this.hintSpr = cc.Sprite.create();
				this.setTextureByName(this.hintSpr, GLOBAL_OBJ.RES.ZM_PAI_ZHEZHAO_PNG);
				if(this.hintSpr){
					GLOBAL_OBJ.LOGD(this._TAG, "this.hintSpr:" + this.hintSpr);
				}
				if(this.rootNode){//这里的打印是用来找bug的，看看是hintSpr有错还是rootNode有错，因为这个bug是偶现的
					GLOBAL_OBJ.LOGD(this._TAG, "this.rootNode:" + this.rootNode.getChildrenCount);
				}
				this.rootNode.addChild(this.hintSpr);
				this.hintSpr.setAnchorPoint(cc.p(0.5,0.5));
				this.hintSpr.setPosition(0,0);
				this.hintSpr.setLocalZOrder(6);
				func();
			}
		},

		doSameTile:function(){
			this.isSameTile = true;
			this.setHintSprOpacity(0.4,cc.color(28, 157, 205));
		},

		cancelSameTile:function(){
			if (this.isSameTile) {
				this.isSameTile = false;
				this.setHintSprOpacity();
			}
		},
	
		doDrawLaiZi:function () {

			this.isLaiZi = true;
			if (!this.laiSubscript)
			{
				this.laiSubscript = cc.Sprite.create();		// 赖子角标
				this.setTextureByName(this.laiSubscript, GLOBAL_OBJ.RES.ZM_GENERAL_MARK_BOTTOM_LAI_PNG);
				this.rootNode.addChild(this.laiSubscript);
				this.laiSubscript.setAnchorPoint(cc.p(1, 1));
				this.laiSubscript.setPosition(this.mahj_size.width/2, this.mahj_size.height/2-20);
				this.laiSubscript.setLocalZOrder(4);
			}
			this.laiSubscript.setVisible(this.isLaiZi);
		},

		cancelDrawLaiZi:function () {

			this.isLaiZi = false;
			if (this.laiSubscript){
                this.laiSubscript.setPosition(this.mahj_size.width/2, this.mahj_size.height/2-20);
				this.laiSubscript.setVisible(this.isLaiZi);
			}
		},

		getIsLaiZi:function () {
			return this.isLaiZi;
		},

        // 听角标
		doTingSuperscript:function(_tile) {
			if (!this.tingBottom){
				this.tingBottom = cc.Sprite.create();//听角标
				this.setTextureByName(this.tingBottom, GLOBAL_OBJ.RES.ZM_GENERAL_MARK_BOTTOM_TING_PNG);
				this.rootNode.addChild(this.tingBottom);
				this.tingBottom.setAnchorPoint(cc.p(0.0,0.0));
				this.tingBottom.setPosition(-39, -56);
				this.tingBottom.setLocalZOrder(4);
			}
			var ret = this.tileId == _tile;
			this.tingBottom.setVisible(ret);
			this.setMJTingKouState(ret);
			// 添加听牌遮罩
			this.doTingMark(_tile);
		},

        // 听牌遮罩, 听牌遮罩也可以用setMjMaskSprOpacity函数处理，但需要美术提供RGB和alpha值
        doTingMark:function (_tile) {
			GLOBAL_OBJ.LOGD(this._TAG, "__doTingMark__start__  seatId = " + this.seatId);
            if (!this.tingMark) {
                this.tingMark = cc.Node.create();

                var markImg = cc.Scale9Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES.GENERAL_TIPS_BUBBLE02_PNG, cc.rect(20, 20, 20, 20));
                markImg.width = 90;
                markImg.height = 120;
                markImg.setOpacity(125);
                this.tingMark.addChild(markImg);

                var arrowImg = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES.ZM_GENERAL_TOP_ZHIZHEN_PNG);
                GLOBAL_FUNCS.addToParent(arrowImg, this.tingMark, cc.p(0, 60));
                arrowImg.setAnchorPoint(cc.p(0.5, 0.5));
                GLOBAL_OBJ.Util.runNodeHintAction(arrowImg);
                this.rootNode.addChild(this.tingMark);
                this.tingMark.setAnchorPoint(cc.p(0, 0));
                this.tingMark.setPosition(cc.p(0, 0));
                this.tingMark.setLocalZOrder(5);
            }
            var flag = this.tileId == _tile;
            this.tingMark.setVisible(flag);
        },

        cancelTingSuperscript:function() {
            if(this.tingBottom){
                if(this.tingBottom.isVisible()){
                    this.tingBottom.setVisible(false);
                }
            }
            this.setMJTingKouState(false);
            this.cancelTingMark();
        },

		cancelTingMark:function() {
			if (this.tingMark) {
				if (this.tingMark.isVisible()) {
					this.tingMark.setVisible(false);
				}
			}
		},

		doDrawAbsence:function () {
			this.setMjMaskSprOpacity(0.4);
			this.isDingQue = true;
        },

		cancelDrawAbsence:function () {
			this.setMjMaskSprOpacity();
			this.isDingQue = false;
        },

		// 结算时定缺手牌遮罩
		doMarkAbsenceMahj:function (_type, _mahj) {

			var minTile = _type * 10 + 1;
			var maxTile = _type * 10 + 9;
			var mahj = _mahj;
			if (mahj) {
				if (mahj.getTile() >= minTile && mahj.getTile() <= maxTile) {
					mahj.setHintSprOpacity(0.4);
				}
			}
			
		},

		getIsAbsence:function () {
			return this.isDingQue;
        },

		setMjMaskSprOpacity:function (_value, _color) {
			var that = this;
			var func = function () {
				var clr = _color || cc.color(0,0,0);
				var value = _value || 0;
				if(value != 0){
					that.mjMask.setColor(clr);
					that.mjMask.setOpacity(255*value);
					that.controlMaskOrientation(that.mjMask);
				}
				that.mjMask.setVisible(value);
			};

			if(this.mjMask){
				func();
			}else{
				this.mjMask = cc.Sprite.create();//麻将的一个遮罩
				this.setTextureByName(this.mjMask, GLOBAL_OBJ.RES.ZM_PAI_ZHEZHAO_PNG);
				this.rootNode.addChild(this.mjMask);
				this.mjMask.setAnchorPoint(cc.p(0.5,0.5));
				this.mjMask.setPosition(0,0);
				this.mjMask.setLocalZOrder(5);
				func();
			}
		},

		controlMaskOrientation:function (_mask) {//控制蒙版旋转角度
			switch (this.orientation){
				case GLOBAL_T.SEATS.N0:
					_mask.setRotation(0);
					_mask.setPosition(cc.p(0,1));
					_mask.setScale(1.0);
					break;
				case GLOBAL_T.SEATS.N1:
					_mask.setRotation(-90);
					_mask.setPosition(cc.p(0,5));
					_mask.setScaleY(0.89);//为什么会缩放，因为横向放倒的麻将宽是100，对应立着的麻将高是112
					break;
				case GLOBAL_T.SEATS.N2:
					_mask.setRotation(0);
					_mask.setPosition(cc.p(0,1));
					_mask.setScale(1.0);
					break;
				case GLOBAL_T.SEATS.N3:
					_mask.setPosition(cc.p(0,5));
					_mask.setRotation(90);
					_mask.setScaleY(0.89);
					break;
			}
		},

		//一炮多响和牌的处理
		doYPDXColor:function () {
			this.setMjMaskSprOpacity(0.4,cc.color(27, 138, 179));
		},

	});
	//end
})();
