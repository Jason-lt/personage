/*************************************************************
 *  mahjong_match_list_scene.js
 *  mahjong
    比赛列表场景
 *
 *  Created by xujing on 17-11-10
 *  特殊说明：

    使用方法:
 */

(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS                             = GLOBAL_OBJ.businesses.functions;
    var MODEL;

	GLOBAL_OBJ.businesses.scenes.Match.Scene = GLOBAL_OBJ.bkernel.base.BaseSceneController.extend({
		_TAG:"table.scenes.RoomList.Scene",
		ctor: function(gametype, playMode) {

            MODEL = GLOBAL_OBJ.businesses.scenes.RoomList.Model;

			this._super();
            this.playMode = playMode;
            this.itemCells = [];
            GLOBAL_OBJ.businesses.utils.Scene.setDs();
            this.init(GLOBAL_OBJ.RES.ROOM_LIST_MAIN_CCBI);
            this._updateTime = 0;
		},

		onLoad: function() {
			this._super();

            this._sceneCtr = new GLOBAL_OBJ.businesses.scenes.SceneCtrlPanel(this,this.playMode);
            this.rootNode.addChild(this._sceneCtr.rootNode);

            this._sceneCtr.resetTitle();
            var that = this;
            this._sceneCtr.backFun = function () {
                that.goOut();
            };

            /*
            @通知注册*/
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_ROOM_LIST, this.onUpdateRoomList, this);
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_MAHJ_MATCH_LIST,this._getRoomList, this);
            ty.Timer.setTimer(this, this.getOnlines, 10, cc.REPEAT_FOREVER, 0);
            var vsize = cc.director.getWinSize();

            var bi = vsize.width / vsize.height;
            if (bi < 1.5){
                GLOBAL_FUNCS.textureChange(this['bgRootNode'],GLOBAL_OBJ.RES.NOPACK_MAHJ_ROOM_LIST_BG_SMALL_JPG);
            }

            var bgSize = this['bgRootNode'].getContentSize();
            var scal = Math.max(vsize.width/bgSize.width, vsize.height/bgSize.height);
            this['bgRootNode'].setScale(scal);
		},

        getOnlines:function () {
            // GLOBAL_OBJ.businesses.network.C2S.requestRoomOnline(this.playMode);
        },

        _getRoomList:function (forceUpdate) {
            // var cmds = {
            //     "cmd":"match",
            //     "result":{
            //         "gameId":701,
            //         "action":"signs",
            //         "rooms":[7012301000]
            //     }
            // };
            //
            // ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);

            if (!forceUpdate){
                var thisTime = GLOBAL_OBJ.bkernel.utils.GlobalTimer.getTime();
                if (thisTime - this._updateTime < 10){
                    //最小频度，10秒一次
                    return;
                }
            }

            // this.getOnlines();

            this._updateTime = thisTime;
            //请求房间列表
            GLOBAL_OBJ.businesses.network.C2S.requestRoomList(this.playMode);
        },

        showDetailsWin:function (roominfo) {
            // GLOBAL_OBJ.LOGD(this._TAG, "showDetailsWin  roominfo = " + JSON.stringify(roominfo));
            if (!this._detailsWin){
                this._detailsWin = new GLOBAL_OBJ.businesses.scenes.Match.MatchDetailsController(this.getRootNode());
            }
            this._detailsWin.enterWithInfo(roominfo);
        },

        makeRoomPageView: function() {

            var itemCell,listRootNode;
            for (var j = 0; j < this.itemCells.length; j++){
                itemCell = this.itemCells[j];
                listRootNode = itemCell.getRootNode();
                listRootNode.removeFromParent();
            }

            this.itemCells.length = 0;
            this['table_container'].removeAllChildren();

            var pageView = new ccui.PageView();
            pageView.setClippingEnabled(false);
            pageView.setCustomScrollThreshold(30);
            pageView.setTouchEnabled(true);
            var pageSize = this['table_container'].getContentSize();
            pageView.setContentSize(pageSize);

            // var anchorPoint = pageView.getAnchorPoint();

            this['table_container'].addChild(pageView);
            pageView.removeAllPages();

            this.roomLen = MODEL.getMatchCount();

            if (!GLOBAL_OBJ.hasOwnProperty('MATCH_SELECT_ID')){
                GLOBAL_OBJ.MATCH_SELECT_ID = Math.floor(this.roomLen * Math.random());
            }

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
            var roomModel;
            var hasTimeMatch = false;

            for (var i = 0; i < pageCnt; i++) {

                var roomStartIndex = i * pageItemCnt;
                var endId = roomStartIndex + pageItemCnt;

                var layout = new ccui.Layout();
                layout.setContentSize(pageSize);
                var layoutRect = layout.getContentSize();

                for (var roomIdx = roomStartIndex; roomIdx < this.roomLen && roomIdx < endId; roomIdx++) {

                    roomModel = MODEL.getMatchRoom(roomIndex);
                    if (!hasTimeMatch && roomModel.type == GLOBAL_OBJ.MatchType.stage_match){
                        hasTimeMatch = true;
                    }
                    itemCell = new GLOBAL_OBJ.businesses.scenes.Match.Cell(roomIndex, this.playMode, this);
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

            if (hasTimeMatch){
                //请求定时赛比赛报名状态列表
                GLOBAL_OBJ.businesses.network.C2S.requestMatchSigns();
            }
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
        },

        goOut:function () {
            if (GLOBAL_OBJ.isWaitMatchStart) return;
            if (this.outing) return;
            this.outing = true;
            this.playAnimation('goout');
        },

        onBackToPluginHall:function () {
            // GLOBAL_OBJ.businesses.utils.Scene.jumpToSecondHall(this.playMode);
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
                this.goOut();
            }
        },

		onCleanup:function() {
			this._super();

            if (this._pageView){
                this._pageView.addEventListener(null, null);
                this._pageView.removeAllPages();
                this._pageView = null;
            }

            if (this._detailsWin){
                this._detailsWin = null;
            }

            this.itemCells.length = 0;
            this.itemCells = null;

            this._sceneCtr.backFun = null;
            this._sceneCtr = null;

            this.pageTag = null;

            GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
            ty.Timer.cancelTimer(this, this.getOnlines);
		},

        onEnterTransitionDidFinish:function(){
            // MODEL.test();
            this._getRoomList();
        }

	});

})();