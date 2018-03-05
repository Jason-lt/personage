/*************************************************************
 *  mahjong_create_room_window_new.js
 *  自建桌，创建牌桌窗口
 *
 *  Created by xujing on 17-05-16
 *  特殊说明：

 使用方法:
 */
(function() {
	var GLOBAL_OBJ = guiyang;
	var MODEL = GLOBAL_OBJ.businesses.scenes.CustomRoom.Model;

	GLOBAL_OBJ.businesses.scenes.CustomRoom.CreateWindowNew = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG: "businesses.scenes.CustomRoom.CreateWindowNew",
		ctor: function(_params) {
			this._super();

			this.params = _params;
			this.msgIsBack = false;
			this.allRoomList = [];
			this.itemListData = [];

			this.groups = [];

			var guandong_jipinghu_GroupCfg = {
				"wanFa" : {
					"col" : 4,
					"groupNum" : 0
				},
				"jiabei" : {
					"col" : 3,
					"groupNum" : 1
				},
				"chengbao" : {
					"col" : 3,
					"groupNum" : 1
				},
				"maima" : {
					"col" : 2,
					"groupNum" : 2
				},
				"cardCount" : {
					"col" : 2,
					"groupNum" : 4
				},
				"playerType" : {
					"col" : 2,
					"groupNum" : 3
				},
				"macount" : {
					"col" : 4,
					"groupNum" : 2
				}
			};

			this.groupsConfig = {
				"jipinghu"              : guandong_jipinghu_GroupCfg
			}

		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {

			var that = this;
			this._super();

			/*
			 @玩法类型按钮 左边*/
			this.btnTableView = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
				viewSize: that.typeNode.getContentSize(),
				// direction: cc.SCROLLVIEW_DIRECTION_HORIZONTAL, //创建Tab 横向摆排
				direction: cc.SCROLLVIEW_DIRECTION_VERTICAL, //创建Tab 竖向摆排
				fillOrder: cc.TABLEVIEW_FILL_TOPDOWN,
				bounce: true,
				cell: GLOBAL_OBJ.bkernel.utils.TableView.Cell.Cache,
				// cellSize   :cc.size(0, 0),
				controller: GLOBAL_OBJ.businesses.scenes.CustomRoom.TypeButtonCell,
				container: that.typeNode,
				data: that.allRoomList
			});
			this.typeNode.addChild(this.btnTableView);

			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_TAB_TOUCH,this.onTabTouch, this);
			/*
			 @通知注册*/
			GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_INFO, this.dataBack, this);
		},

		onTabTouch:function (tabIndex) {

			this.roomIndex = tabIndex;
			var tempList = this.allRoomList[this.roomIndex].configList;
			// GLOBAL_OBJ.LOGD("Total log allRoomList = ", JSON.stringify(this.allRoomList));

			this.itemListData.length = 0;

			var itemName;
			var groupList = {};
			var cfgObj;
			var subGroup;
			var groupCfg = this.groupsConfig[ this.allRoomList[ this.roomIndex ].playMode ];

			//数据分组
			// GLOBAL_OBJ.LOGD("Total log ==", JSON.stringify(tempList));
			for (var i = 0; i < tempList.length; i++){
				this.itemListData.push(tempList[i]);

				itemName = tempList[i].itemName;
				// GLOBAL_OBJ.LOGD("CHECK_ITEM  " + itemName);
				cfgObj = groupCfg[itemName];

				subGroup = groupList[cfgObj.groupNum];
				if (!subGroup){
					subGroup = [];
					groupList[cfgObj.groupNum] = subGroup;
				}

				tempList[i]["col"] = cfgObj["col"]; //显示几列；
				subGroup.push(tempList[i]);
			}

			//刷新右侧列表
			this.refreshGoupList(groupList);

		},

		onCloseWin:function () {
			this.windowClose();
		},

		/**
		 * 删除所有组
		 */
		removeAllGroups:function () {
			var group, i;
			for (i = 0 ; i < this.groups.length; i++){
				group = this.groups[i];
				group.getRootNode().removeFromParent();
			}

			this.groups.length = 0;
		},

		/**
		 * 刷新组列表
		 * @param groupList
		 */
		refreshGoupList:function (groupList) {
			//清除列表项目

			this.removeAllGroups();

			var group;

			for (var i in groupList){
				group = new GLOBAL_OBJ.businesses.scenes.CustomRoom.CellGroup(groupList[i],this);
				this.groups.push(group);
				this.detailNode.addChild(group.getRootNode());
			}

			this.refreshContenteSize();
		},

		/**
		 * 刷新面板大小及列表项的坐标
		 */
		refreshContenteSize:function () {
			var size = this.detailNode.getContentSize();
			var allHeight = 0;
			var group, i;

			for (i = 0; i < this.groups.length; i++){
				group = this.groups[i];
				allHeight += group.getRootNode().getContentSize().height + 3;

				group.getRootNode().setPositionY(size.height - allHeight);
				group.getRootNode().setPositionX(0);
			}
		},

		/**
		 * 服务器返回数据
		 */
		dataBack:function () {

			this['txtLoading'].setVisible(false);

			var tempAllRoomList = MODEL.getAllRooms();
			//服务器返回的信息格式不是列表，不可以直接使用，要先进行处理
			var roomCfg, room, itemCfg, item;

			this.allRoomList.length = 0;

			for (var i = 0; i < tempAllRoomList.length; i++){

				roomCfg = tempAllRoomList[i];

				room = {};
				room.playMode          = roomCfg.playMode;
				room.playModeDesc      = roomCfg.playModeDesc;
				room.configList        = [];

				for (var itemName in roomCfg.paramType){

					itemCfg = roomCfg.paramType[itemName];

					item = {};

					item.name     = itemCfg.name;
					item.type     = itemCfg.type;
					item.itemName = itemName;

					if (itemName == "cardCount"){
						//这个字段比较特殊，要与playerType进行配合，因为房卡的消耗与所选人数有关。
						item.defultPlayerCount = roomCfg.playerType[0].count;
					}

					if (itemCfg.hasOwnProperty("spLine")){
						//如果存在分隔线配置项，也进行复制
						item.spLine = itemCfg.spLine;
					}
					if (itemCfg.hasOwnProperty("haveTips")){
						//如果存在Tips配置项，也进行复制
						item.haveTips = itemCfg.haveTips;
					}

					item.list = roomCfg[itemName];
					room.configList.push(item);
				}

				this.allRoomList.push(room);
			}

			this.btnTableView.reloadData(this.allRoomList.length);

			//数据返回默认取第一个
			GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_TAB_TOUCH, 0);

			this.msgIsBack = true;
		},

		/*
		 弹窗弹出完毕
		 */
		onEase: function() {
			this._super();
			var playModes    = GLOBAL_OBJ.GlobalVars.getCreatePlayModes() || [];
			GLOBAL_OBJ.businesses.network.C2S.requestCustomRoomInfo(playModes);
		},

		onClose: function() {
			hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);
			this.goOut();
		},

		goOut:function () {
			if (this.outing) return;
			this.outing = true;
			this.playAnimation('goOut');
		},

		onCleanup: function() {

			this._super();
			this.msgIsBack = false;

			this.params = null;

			this.allRoomList.length = 0;
			this.allRoomList = null;

			this.itemListData.length = 0;
			this.itemListData = null;

			this.removeAllGroups();
			this.groups = null;

			this.btnTableView.removeFromParent();
			this.btnTableView = null;

			this.groupsConfig = null;

			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
		},

		onHistory:function () {
			// var tasks = [{"action":"enter_game","params":{"gameId":701,"enter_param":{"pluginParams":{"gameType":11,"tasks":[{"action":"pop_create_room_zhanji","params":{}}]},"type":"roomlist"},"delay":0}}]
			// hall.ToDoTask.pushTasks(tasks);

			var curPlayMode = this.allRoomList[ this.roomIndex ].playMode;
			var addParent = this.getRootNode().parent;
			GLOBAL_OBJ.bkernel.windows.Factory.produce(
				GLOBAL_OBJ.businesses.windows.consts.C_CREATE_ROOM_RECORD_HALL, {playMode : curPlayMode}, addParent);

		},

		/* 创建牌桌 */
		onCreate: function() {

			if (!this.msgIsBack){
				//请稍等，数据正在获取中
				//弹提示信息
				ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
					text:"请稍等，数据正在获取中...",
					duration:1
				});
				return;
			}

			// 点击限制
			this['createBtn'].setEnabled(false);
			var that = this;
			this.async(function() {
				that['createBtn'].setEnabled(true);
			}, 3);


			//遍历列表中所有列表项，装配服务器要求数据
			var pars = {};
			var item;
			var group;
			for(var j = 0; j < this.groups.length; j++){

				group = this.groups[j];

				for (var i = 0; i < group.items.length; i++){
					item = group.items[i];
					if (item.displayType == GLOBAL_OBJ.businesses.scenes.CustomRoom.CREATE_ROOM_BTN_DISPLAY_TYPE.SC){
						if (item.data.itemName == "cardCount"){
							pars[item.data.cardCountName] = item.selectValue;
						}
						else{
							pars[item.data.itemName] = item.selectValue;
						}
					}
					else{
						for (var key in item.selectValue){
							pars[key] = item.selectValue[key];
						}
					}
				}

			}

			if (!pars.hasOwnProperty('playerType')){
				//有些地方的玩法，只有固定人数的，后端有可能，不会要求前端显示，但是这个字段是必须的
				//如果显示列表中，没有人数选项，给加一个默认值
				var tempAllRoomList = MODEL.getAllRooms();
				pars['playerType'] = tempAllRoomList[this.roomIndex].playerType[0].id;
			}

			var playMode = this.allRoomList[this.roomIndex].playMode;

			// GLOBAL_OBJ.LOGD("check_create_room_pars : ", JSON.stringify(pars));
			GLOBAL_OBJ.businesses.network.C2S.requestCreateCustomRoom(playMode, pars, this.params);
		}
	});

})();