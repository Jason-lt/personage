/*************************************************************
 *  mahjong_room_list_scene.js
    mahjong_room_list_scene
 *  mahjong
    房间列表场景
 *
 *  Created by nick.kai.lee on 16-07-07
 *  特殊说明：

    使用方法:
 */

(function(){
    var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS                             = GLOBAL_OBJ.businesses.functions;
    var MODEL                                    = GLOBAL_OBJ.businesses.scenes.RoomList.Model;

	GLOBAL_OBJ.businesses.scenes.RoomList.Scene = GLOBAL_OBJ.bkernel.base.BaseSceneController.extend({
		_TAG:"table.scenes.RoomList.Scene",
		ctor: function(_gameType, playMode) {
			this._super();
            this.gameType = _gameType;
            this.playMode = playMode;
            this.itemCells = [];
            GLOBAL_OBJ.businesses.utils.Scene.setDs();
            this.init(GLOBAL_OBJ.RES.ROOM_LIST_MAIN_CCBI);
		},

		onLoad: function() {
			this._super();

            this._sceneCtr = new GLOBAL_OBJ.businesses.scenes.SceneCtrlPanel(this,this.playMode);
            this.rootNode.addChild(this._sceneCtr.rootNode);

            var titlePath;
            if (this.playMode == GLOBAL_OBJ.table.global.PLAYMODE.ZhuoJi) {
                titlePath = GLOBAL_OBJ.RES.MAHJ_ROOM_TITLE_3_PNG;
            }
            else if (this.playMode == GLOBAL_OBJ.table.global.PLAYMODE.ErDingGuai) {
                titlePath = GLOBAL_OBJ.RES.MAHJ_ROOM_TITLE_1_PNG;
            }
            else if (this.playMode == GLOBAL_OBJ.table.global.PLAYMODE.SanDingGuai) {
                titlePath = GLOBAL_OBJ.RES.MAHJ_ROOM_TITLE_2_PNG;
            }

            this._sceneCtr.setRoomTitle(titlePath);

            /*
            @通知注册*/
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_ROOM_LIST, this.onUpdateRoomList, this);
            ty.NotificationCenter.listen(hall.EventType.UPDATE_UER_INFO, this.onUpdateUserInf, this);

            var vsize = cc.director.getWinSize();

            var bi = vsize.width / vsize.height;
            if (bi < 1.5){
                GLOBAL_FUNCS.textureChange(this['bgRootNode'],GLOBAL_OBJ.RES.NOPACK_MAHJ_ROOM_LIST_BG_SMALL_JPG);
            }

            var bgSize = this['bgRootNode'].getContentSize();
            var scal = Math.max(vsize.width/bgSize.width, vsize.height/bgSize.height);
            this['bgRootNode'].setScale(scal);

		},

        makeRoomPageView: function() {

            var pageView = new ccui.PageView();
            pageView.setClippingEnabled(false);
            pageView.setCustomScrollThreshold(30);
            pageView.setTouchEnabled(true);
            var pageSize = this['table_container'].getContentSize();
            pageView.setContentSize(pageSize);

            // var anchorPoint = pageView.getAnchorPoint();

            this['table_container'].addChild(pageView);
            pageView.removeAllPages();

            this.roomLen = MODEL.getRoomCount(this.playMode);

            var pageItemCnt = 6;
            var pageCnt = Math.ceil(this.roomLen / pageItemCnt);
            if (pageCnt > 1) {
                this.pageTag = new GLOBAL_OBJ.businesses.scenes.RoomList.pageTag(pageCnt);
                this['page_tag'].addChild(this.pageTag.getNode());
                var s = this['page_tag'].getContentSize();
                this.pageTag.setPosition(cc.p(s.width / 2, s.height / 2));
                this.pageTag.setSelected(0);
            }

            var roomIndex = 0 ; 		//来自本地数据
            var itemCell,listRootNode;
            for (var i = 0; i < pageCnt; i++) {

                var roomStartIndex = i * pageItemCnt;
                var endId = roomStartIndex + pageItemCnt;

                var layout = new ccui.Layout();
                layout.setContentSize(pageSize);
                var layoutRect = layout.getContentSize();

                for (var roomIdx = roomStartIndex; roomIdx < this.roomLen && roomIdx < endId; roomIdx++) {

                    itemCell = new GLOBAL_OBJ.businesses.scenes.RoomList.Cell(roomIndex, this.playMode);
                    this.itemCells.push(itemCell);
                    listRootNode = itemCell.getRootNode();

                    var itemSize = listRootNode.getContentSize();
                    var pos = this.getPageItemPosition(roomIdx - i * pageItemCnt, itemSize, layoutRect);
                    listRootNode.setPosition(pos);

                    layout.addChild(listRootNode);

                    roomIndex++;
                }
                pageView.insertPage(layout, i);
            }
            pageView.addEventListener(this.pageViewEvent, this);
            this._pageView = pageView;
        },

        pageViewEvent: function(sender, type) {
            switch(type) {
                case ccui.PageView.EVENT_TURNING:
                    var pageView = sender;
                    var pageIndex = pageView.getCurPageIndex().valueOf() - 0 + 1;
                    if (this.pageTag) {
                        this.pageTag.setSelected(pageIndex-  1);
                    }
                    break;
                default:
                    break;
            }
        },

        getPageItemPosition: function(pageItemId, itemSize, layoutRect) {
            // X位置
            var pageSize = layoutRect;
            var row = Math.floor(pageItemId / 2);
            var col = pageItemId % 2;

            var xInter = 10;
            var xpos = (ty.Util.getDesignResolutionSize().width - 2 * itemSize.width - xInter)/2;
            xpos = xpos + (col * itemSize.width + (col > 0 ? 1 : 0) * xInter);
            this.interInY = 5 ;
            // var ypos = pageSize.height - row*itemSize.height - (row>0?row:0)*this.interInY;
            var calPosRow = 2 - row;
            var offSet = 0;
            var ypos = 0 + calPosRow * itemSize.height + (calPosRow > 0 ? calPosRow : 0) * this.interInY - offSet;

            return cc.p(xpos, ypos);
        },


        onUpdateRoomList:function () {
            this.makeRoomPageView();
            this.showBestRoom();
        },

        showBestRoom:function () {
            var room;
            var selfCoin = hall.ME.getChip();

            // 大于当前房间最大金币数量

            var selectIndex = 0;
            var itemCell,i;

            for (i = 0; i < this.itemCells.length; i++){
                itemCell = this.itemCells[i];
                itemCell.imgSeleced.setVisible(false);
            }

            for (i = 0; i < this.itemCells.length; i++){
                room = MODEL.getRoom(this.playMode, i);
                itemCell = this.itemCells[i];
                if (room.maxCoin != -1){
                    if (room.maxCoin >= selfCoin && selfCoin > room.minCoin){
                        selectIndex = i;
                        itemCell.imgSeleced.setVisible(true);
                        break;
                    }
                }
                else{
                    if (selfCoin > room.minCoin){
                        selectIndex = i;
                        itemCell.imgSeleced.setVisible(true);
                    }
                    break;
                }
            }
        },
        
        goOut:function () {
            if (this.outing) return;
            this.outing = true;
            this.playAnimation('goout');
        },

        onBackToPluginHall:function () {
            if (this.goOutCallBackFun){
                this.goOutCallBackFun();
            }
            else{
                GLOBAL_OBJ.businesses.utils.Scene.jumpToSecondHall(this.playMode);
            }
        },

        onKeyBackAfterWindowClicked: function (){
            if (this._sceneCtr.menuListIsShow){
                this._sceneCtr.showOrHideMenuList();
            }
            else{
                //点击物理返回键,不退回到二级大厅(可选自建房界面)
                //this.goOut();
                if (this.playMode == GLOBAL_OBJ.table.global.PLAYMODE.ZhuoJi) {
                    this.goOut();
                }else {
                    GLOBAL_OBJ.businesses.utils.Scene.jumpToHall(this);
                }
            }
        },

        onUpdateUserInf:function () {
            this.showBestRoom();
        },

		onCleanup:function() {
			this._super();

            if (this._pageView){
                this._pageView.addEventListener(null, null);
                this._pageView.removeAllPages();
                this._pageView = null;
            }

            this.itemCells.length = 0;
            this.itemCells = null;

            this._sceneCtr = null;

            this.pageTag = null;

            GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
            ty.NotificationCenter.ignoreScope(this);
		},

        onEnterTransitionDidFinish:function(){
            // MODEL.test();
            //请求房间列表
            GLOBAL_OBJ.businesses.network.C2S.requestRoomList(this.playMode);
        }

	});
	//end

})();