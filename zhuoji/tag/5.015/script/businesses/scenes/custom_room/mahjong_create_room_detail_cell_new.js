/*************************************************************
 *  mahjong_create_room_detail_cell_new.js
    mahjong_create_room_detail_cell_new
 *  mahjong
 	创建房间 玩法详情 cell
 *
 *  Created by xujing on 17-05-16
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var LINE_HEIGHT = 50;

	GLOBAL_OBJ.businesses.scenes.CustomRoom.DetailCellNew = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.CustomRoom.DetailCellNew",
		ctor: function(_data ,group) {
			this._super();

			this.btns = [];
			this.data = _data;
			this.displayType = this.data.type;

			this.group = group;

			this.LINE_NUM = this.data.col;
			this.BTN_WIIDTH = 720.0 / this.LINE_NUM;

			this.haveTips = this.data.hasOwnProperty("haveTips") && this.data.haveTips;

        	//初始化CCB
        	this.init(GLOBAL_OBJ.RES.CREATE_ROOM_RULE_CELL_CCBI);
		},

		onLoad: function() {
			this._super();
			this.initBtns();
		},

		/**
		 * 初始化按钮列表
		 */
		initBtns:function () {

			var data_list = this.data.list;

			if (this.data.itemName == "cardCount"){

				GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_CARD_COUNT,this.onPlayerChange, this);
				data_list = [];
				for (var j = 0; j < this.data.list.length; j++){
					if (this.data.list[j]['playercount'] == this.data.defultPlayerCount){
						data_list.push(this.data.list[j]);
					}
				}

				this.data.cardCountName = "cardCount" + this.data.defultPlayerCount;
			}

			//显示操作按钮列表

			var dataCount = data_list.length;
			var contentHeight = Math.ceil(dataCount / this.LINE_NUM) * LINE_HEIGHT;

			if (this.haveTips){
				this.nodeTips.setVisible(true);
				contentHeight += 50;
				this.nodeTips.setPositionY(8);
			}
			else{
				this.nodeTips.setVisible(false);
			}

			var size = this.getRootNode().getContentSize();
			this.getRootNode().setContentSize(size.width, contentHeight);

			if (this.displayType == GLOBAL_OBJ.businesses.scenes.CustomRoom.CREATE_ROOM_BTN_DISPLAY_TYPE.SC){
				this.selectValue = 0;
			}
			else{
				this.selectValue = {};
			}

			var btn, btnNode, lineIndex, nameY , btnY, btnData;
			for (var i = 0; i < dataCount; i++){

				btnData = data_list[i];
				btn = new GLOBAL_OBJ.businesses.scenes.CustomRoom.DetailCellBtn(this.displayType, i, btnData, this);
				this.btns.push(btn);

				if (this.displayType == GLOBAL_OBJ.businesses.scenes.CustomRoom.CREATE_ROOM_BTN_DISPLAY_TYPE.SC){
					if (btnData.default == 1){
						this.selectValue = btnData.id;
						if (this.haveTips){
							this.showTips(btnData);
						}
					}
				}
				else{
					this.selectValue[btnData["id"]] = btnData["default"];
				}

				lineIndex = Math.floor(i / this.LINE_NUM);

				btnNode = btn.getRootNode();
				btnNode.setPositionX((i % this.LINE_NUM) * this.BTN_WIIDTH);
				btnY = contentHeight - (lineIndex * LINE_HEIGHT + LINE_HEIGHT/2);
				btnNode.setPositionY(btnY);

				if (lineIndex == 0){
					nameY = btnY;
				}

				this.nodeContent.addChild(btnNode);
			}

			if (this.data.name.length > 0){
				this.txtName.setString(this.data.name + "：");
			}
			else{
				this.txtName.setString("");
			}

			this.txtName.setPositionY(nameY);

			//是否显示
			var showSpLine = false;
			if(this.data.hasOwnProperty("spLine") && this.data.spLine == true){
				showSpLine = true;
			}

			if(this.spLine){
				this.spLine.setVisible(showSpLine);
				this.spLine.setPositionY(contentHeight - 1);
			}


		},

		removeAllBtns:function () {
			var btn;
			for(var i = 0; i < this.btns.length; i++){
				btn = this.btns[i];
				btn.doDestroy();
				btn.getRootNode().removeFromParent();
			}

			this.btns.length = 0;
		},

		/**
		 * 根据选择的人数，刷新列表
		 * @param playerData
		 */
		onPlayerChange:function (playerData) {

			this.removeAllBtns();

			//显示操作按钮列表
			var data_list = [];
			for (var j = 0; j < this.data.list.length; j++){
				if (this.data.list[j]['playercount'] == playerData.count){
					data_list.push(this.data.list[j]);
				}
			}

			this.data.cardCountName = "cardCount" + playerData.count;

			var dataCount = data_list.length;

			var contentHeight = Math.ceil(dataCount / this.LINE_NUM) * LINE_HEIGHT;

			var size = this.getRootNode().getContentSize();
			this.getRootNode().setContentSize(size.width, contentHeight);


			var btn, btnNode, lineIndex, nameY , btnY, btnData;
			for (var i = 0; i < dataCount; i++){

				btnData = data_list[i];
				btn = new GLOBAL_OBJ.businesses.scenes.CustomRoom.DetailCellBtn(this.displayType, i, btnData, this);
				this.btns.push(btn);

				if (btnData.default == 1){
					this.selectValue = btnData.id;
				}

				lineIndex = Math.floor(i / this.LINE_NUM);

				btnNode = btn.getRootNode();
				btnNode.setPositionX((i % this.LINE_NUM) * this.BTN_WIIDTH);
				btnY = contentHeight - (lineIndex * LINE_HEIGHT + LINE_HEIGHT/2);
				btnNode.setPositionY(btnY);

				if (lineIndex == 0){
					nameY = btnY;
				}

				this.nodeContent.addChild(btnNode);
			}

			this.txtName.setPositionY(nameY);

			this.group.refreshContenteSize();
		},

		setValue:function (btnData, isSelected) {
			if (this.displayType == GLOBAL_OBJ.businesses.scenes.CustomRoom.CREATE_ROOM_BTN_DISPLAY_TYPE.SC){
				this.selectValue = btnData.id;
				if (this.data.itemName == "playerType"){
					//要发送消息，告诉CardCount ,刷新列表
					GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_CARD_COUNT, btnData);
				}

				if (this.data.itemName == "cardCount"){
					this.data.cardCountName = "cardCount" + btnData.playercount;
				}

				if (this.haveTips){
					this.showTips(btnData);
				}

			}
			else{
				this.selectValue[btnData.id] = isSelected == GLOBAL_OBJ.businesses.scenes.CustomRoom.BTN_STATE.SELECTED ? 1 : 0;
			}
		},
		
		showTips:function (btnData) {
			this.txtTips.setString(btnData.tips);
			this.bgTxt.setContentSize(this.txtTips.getContentSize().width + 24, 34);
		},

		onCleanup:function() {

			//清理按钮
			this.removeAllBtns();
			this.btns = null;

			this.selectValue = null;
			this.group = null;

			this.data = null;
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);

			this._super();
		},


		/*
		界面刷新
		*/
		update:function(_index, _config){
		}

	});
})();