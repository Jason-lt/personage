/*************************************************************
 *  mahjong_create_room_detail_cell_btn.js
    mahjong_create_room_detail_cell_btn
 *  mahjong
 	基本列表按钮
 *
 *  Created by xujing on 17-05-16
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS					            = GLOBAL_OBJ.businesses.functions;
	GLOBAL_OBJ.businesses.scenes.CustomRoom.BTN_STATE  = {
		SELECTED : "SELECTED",
		NORMAL   : "NORMAL"
	};

	GLOBAL_OBJ.businesses.scenes.CustomRoom.DetailCellBtn = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.CustomRoom.DetailCellBtn",
		ctor: function(_displayType,_index,_data,btnPanel) {
			this._super();

			this.displayType      = _displayType;
			this.index            = _index;
			this.data             = _data;
			this.btnState         = GLOBAL_OBJ.businesses.scenes.CustomRoom.BTN_STATE.NORMAL;
			this.btnPanel         = btnPanel;

        	this.init(GLOBAL_OBJ.RES.CREATE_ROOM_RULE_CELL_BTN_CCBI);
		},

		onLoad: function() {
			this._super();

			this.initBtn();

			//注册点击事件
			this.touchManager = GLOBAL_OBJ.bkernel.extend.Touch.bind_simple_touch(
				this.getRootNode(),
				false,
				this.touchStart,
				this.touchMove,
				this.touchEnd,
				this.touchCancel
			);
		},

		initBtn:function () {
			this.txtName.setString(this.data.desc);
			// this.txtName.setTextColor(cc.color(255,255,0));
			// this.txtName.enableOutline(cc.color(0,0,0), 1);
			// this.txtName.setFontName("宋体");
			//this.txtName.setSystemFontName("STKaitiSC-Regular");
			// this.txtName.setString(this.txtName.getSystemFontName());


			//按钮要求显示成各种样式的按钮
			if (this.displayType == GLOBAL_OBJ.businesses.scenes.CustomRoom.CREATE_ROOM_BTN_DISPLAY_TYPE.SC){
				//单选
				if (this.data.default == 1){
					this.btnState = GLOBAL_OBJ.businesses.scenes.CustomRoom.BTN_STATE.SELECTED;
					GLOBAL_FUNCS.textureChange(this.imgType,GLOBAL_OBJ.RES.RADIOBTN_SELECT_PNG);
				}
				else{
					this.btnState = GLOBAL_OBJ.businesses.scenes.CustomRoom.BTN_STATE.NORMAL;
					GLOBAL_FUNCS.textureChange(this.imgType,GLOBAL_OBJ.RES.RADIOBTN_PNG);
				}
			}
			else{
				//多选
				if (this.data.default == 1){
					this.btnState = GLOBAL_OBJ.businesses.scenes.CustomRoom.BTN_STATE.SELECTED;
					GLOBAL_FUNCS.textureChange(this.imgType,GLOBAL_OBJ.RES.CHECKBOX_SELECT_PNG);
				}
				else{
					this.btnState = GLOBAL_OBJ.businesses.scenes.CustomRoom.BTN_STATE.NORMAL;
					GLOBAL_FUNCS.textureChange(this.imgType,GLOBAL_OBJ.RES.CHECKBOX_PNG);
				}
			}

			this.changeTxtColor();
		},

		changeTxtColor:function () {
			var color = this.btnState == GLOBAL_OBJ.businesses.scenes.CustomRoom.BTN_STATE.SELECTED ? cc.color(169,37,7) : cc.color(132,88,12);
			// this.txtName.setTextColor(color);
			this.txtName.setColor(color);
		},

		unSelect:function () {
			if (this.displayType == GLOBAL_OBJ.businesses.scenes.CustomRoom.CREATE_ROOM_BTN_DISPLAY_TYPE.SC){
				if (this.btnState == GLOBAL_OBJ.businesses.scenes.CustomRoom.BTN_STATE.SELECTED){
					this.btnState = GLOBAL_OBJ.businesses.scenes.CustomRoom.BTN_STATE.NORMAL;
					GLOBAL_FUNCS.textureChange(this.imgType, GLOBAL_OBJ.RES.RADIOBTN_PNG);
				}
			}
			else{
				if (this.btnState == GLOBAL_OBJ.businesses.scenes.CustomRoom.BTN_STATE.SELECTED){
					this.btnState = GLOBAL_OBJ.businesses.scenes.CustomRoom.BTN_STATE.NORMAL;
					GLOBAL_FUNCS.textureChange(this.imgType,GLOBAL_OBJ.RES.CHECKBOX_PNG);
				}
			}

			this.changeTxtColor();
		},

		touchStart:function (listener, touch, event) {
			return true;
		},

		touchMove:function (listener, touch, event) {

		},

		touchEnd:function (listener, touch, event, cp) {

			var that = event.getCurrentTarget().controller;

			if (that.displayType == GLOBAL_OBJ.businesses.scenes.CustomRoom.CREATE_ROOM_BTN_DISPLAY_TYPE.SC){
				if (that.btnState == GLOBAL_OBJ.businesses.scenes.CustomRoom.BTN_STATE.NORMAL){
					that.btnState = GLOBAL_OBJ.businesses.scenes.CustomRoom.BTN_STATE.SELECTED;
					GLOBAL_FUNCS.textureChange(that.imgType, GLOBAL_OBJ.RES.RADIOBTN_SELECT_PNG);
					that.setOtherBtn(that.index, that.data, that.btnState, that.btnPanel);
				}
			}
			else{
				if (that.btnState == GLOBAL_OBJ.businesses.scenes.CustomRoom.BTN_STATE.NORMAL){
					that.btnState = GLOBAL_OBJ.businesses.scenes.CustomRoom.BTN_STATE.SELECTED;
					GLOBAL_FUNCS.textureChange(that.imgType,GLOBAL_OBJ.RES.CHECKBOX_SELECT_PNG);
				}
				else{
					that.btnState = GLOBAL_OBJ.businesses.scenes.CustomRoom.BTN_STATE.NORMAL;
					GLOBAL_FUNCS.textureChange(that.imgType,GLOBAL_OBJ.RES.CHECKBOX_PNG);
				}

				that.setOtherBtn(that.index, that.data, that.btnState, that.btnPanel);
			}

			that.changeTxtColor();
		},

		touchCancel:function (listener, touch, event) {
			return false;
		},

		setOtherBtn:function(btnindex, btndata, btnState, scope){
			//子按钮按下后的操作
			if (scope.displayType == GLOBAL_OBJ.businesses.scenes.CustomRoom.CREATE_ROOM_BTN_DISPLAY_TYPE.SC){
				//取消其它按钮的选中状态
				var btn;
				for (var i = 0; i < scope.btns.length; i++){
					if (btnindex != i){
						btn = scope.btns[i];
						btn.unSelect();
					}
				}
			}
			scope.setValue(btndata,btnState);
		},

		doDestroy:function () {
			if(this.touchManager != null){
				this.touchManager.unbind();
				this.touchManager = null;

				this.data = null;
				this.btnPanel = null;
			}
		},

		onCleanup:function() {



			this._super();
		}
	});
})();