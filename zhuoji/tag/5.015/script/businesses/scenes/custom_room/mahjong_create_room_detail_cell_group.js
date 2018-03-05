/*************************************************************
 *  mahjong_create_room_detail_cell_group.js
    mahjong_create_room_detail_cell_group
 *  mahjong
 	创建房间 玩法详情 列表项目分组
 *
 *  Created by xujing on 17-05-25
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.businesses.scenes.CustomRoom.CellGroup = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.CustomRoom.CellGroup",
		ctor: function(_datas ,owner_panel) {
			this._super();

			this.datas = _datas;
			this.items = [];
			this.owner_panel = owner_panel;
        	//初始化CCB
        	this.init(GLOBAL_OBJ.RES.CREATE_ROOM_RULE_GROUP_CCBI);
		},

		onLoad: function() {
			this._super();
			this.initItems();
		},

		/**
		 * 初始化列表
		 */
		initItems:function () {

			var item;
			for (var i = 0; i < this.datas.length; i++){
				item = new GLOBAL_OBJ.businesses.scenes.CustomRoom.DetailCellNew(this.datas[i] ,this);
				this.items.push(item);
				this.getRootNode().addChild(item.getRootNode());
			}

			this.refreshContenteSize();
		},

		/**
		 * 刷新面板大小及列表项的坐标
		 */
		refreshContenteSize:function () {

			var allHeight = 0;
			var item, itemHeight, i, itemY;
			//第一步，进行排列（把列表从上到下排列）
			for (i = 0; i < this.items.length; i++){

				item = this.items[i];
				itemHeight = item.getRootNode().getContentSize().height;
				allHeight += itemHeight;

				item.getRootNode().setPositionY(-allHeight);
			}

			//第二步，设置当前框的大小
			var size = this.getRootNode().getContentSize();
			this.getRootNode().setContentSize(size.width, allHeight);

			this.imgBG.setContentSize(size.width, allHeight);

			//第三步，把所有列表项目，挪回到原来的框内
			for (i = 0; i < this.items.length; i++){

				item = this.items[i];
				itemY = item.getRootNode().getPositionY();
				item.getRootNode().setPositionY(itemY + allHeight + 3);
			}

			this.owner_panel.refreshContenteSize();
		},

		/**
		 * 删除所有列表项目
		 */
		removeAllItems:function () {

			var item;
			for (var i = 0; i < this.items.length; i++){
				item = this.items[i];
				item.getRootNode().removeFromParent();
			}

			this.items.length = 0;
		},

		onCleanup:function() {

			//清理列表
			this.removeAllItems();
			this.items = null;

			this.datas = null;
			this.owner_panel = null;

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