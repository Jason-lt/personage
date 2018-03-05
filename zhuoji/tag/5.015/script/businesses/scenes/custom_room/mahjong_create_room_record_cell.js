/*************************************************************
 *  mahjong_create_room_record_cell.js
    mahjong_create_room_record_cell
 *  mahjong
    自建桌 我的战绩 cell
 *
 *  Created by nick.kai.lee on 16-06-23
 *  特殊说明：

    使用方法:
 */
(function(){
    var GLOBAL_OBJ = guiyang;
    var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
    var STATIC = GLOBAL_OBJ.businesses.scenes.CustomRoom.static;
    var MODEL = GLOBAL_OBJ.businesses.scenes.CustomRoom.Model;

    GLOBAL_OBJ.businesses.scenes.CustomRoom.RecordCell = GLOBAL_OBJ.bkernel.base.BaseController.extend({
        _TAG:"businesses.scenes.CustomRoom.RecordCell",
        
        ctor: function(_index,_config) {
            this._super();
            this.config = _config;
            this.index  = _index;
            this.players = [];

            this.init(GLOBAL_OBJ.RES.CREATE_ROOM_RECORD_CELL_CCBI);
        },

        init: function(_ccb) {
            this._super(_ccb);
        },

        onLoad: function() {
            this._super();
        },

        onDetails:function()
        {
            var that = this;
            var data = that.config.data.data[that.index];
            var __params = {
                record_download_info:data['record_download_info'],
                users_info  : data['users_info'],
                tableId     : data.tableId,
                record_data : data.record_data,
                table_record_key : data['table_record_key'],
                playMode    : data.playMode,
                from        : "hall",
            };

            MODEL.setMarkRoomIndex(that.index);//new add sc 标记选中了哪个数据索引

            GLOBAL_OBJ.bkernel.windows.Factory.produce(
                        GLOBAL_OBJ.businesses.windows.consts.C_CREATE_ROOM_TABLE_RECORD,
                        __params,
                        that.config.data.tableRecordNode);
        },

        onCleanup:function() {
            this.removeAllPlayers();
            this.players = [];
            this._super();
        },

        removeAllPlayers:function () {

            var player;
            for (var i = 0; i < this.players.length; i++){
                player = this.players[i];
                player.getRootNode().removeFromParent();
            }

            this.players.length = 0;
        },

        onPreBtn:function(){
            if(this.dataParam &&this.dataParam.preFunc &&this.dataParam.funcThis){
                this.dataParam.preFunc.call(this.dataParam.funcThis);
            }
        },

        onNextBtn:function(){
            if(this.dataParam && this.dataParam.nextFunc &&this.dataParam.funcThis){
                this.dataParam.nextFunc.call(this.dataParam.funcThis);
            }
        },

        updateOperatorCell:function(tf){
            GLOBAL_OBJ.LOGD("record_cell_log", "updateOperatorCell function ");
            var array = [
                "createTableNoLabel",
                "createTableModeLabel",
                "userNode0",
                "userNode1",
                "userNode2",
                "userNode3",
                "detailBtnNode",
                "dateLabel",
                "timeLabel"
            ];
            for(var i = 0 ; i < array.length;i++){
                this[array[i]].setVisible(!tf);
            }
            //this.opNode.setVisible(tf);

            this.pageLabel.setString(this.dataParam.pagestr||"");

            // if(tf){
            //     this.dataParam.funcThis.prePageBtn = this.preBtn;
            //     this.dataParam.funcThis.nextPageBtn = this.nextBtn;
            // }
        },

        /*
        界面刷新
        */
        update:function(_index, _config){
            this.index  = _index;
            this.config = _config;
            var data = _config.data.data[_index];
            this.dataParam = data;

            this.updateOperatorCell(data.isOperatorCell);
            if(data.isOperatorCell == true){
                return;
            }
            // GLOBAL_OBJ.LOGD("this.dataParam "+JSON.stringify(this.dataParam));

            if(typeof(data.record_data) != "undefined") {
                var playMode = data.record_data.playMode;
                var str = playMode.replace("-", "");
                var pmStr = GLOBAL_OBJ.businesses.scenes.CustomRoom.static.NAMES[str];
                if(pmStr){
                    this.createTableModeLabel.setString(pmStr);
                    //this.createTableModeLabel.setFontSize(30);
                }
            }

            // 房间号
            this['createTableNoLabel'].setString("房间号：" + data.create_table_no);

            // 用户信息
            var player;
            for (var i = 0; i < data.users_info.length; i++){
                var userData = data.users_info[i];
                // GLOBAL_OBJ.LOGD("check_user_info, player  "+i, JSON.stringify(userData));
                player = new GLOBAL_OBJ.businesses.scenes.CustomRoom.RecordPlayerCell(userData, true);
                this.players.push(player);
                var node = player.getRootNode();
                this["userNode" + i].addChild(node);
                player.setHostUid(data.record_data.hostUid);
                player.setPaoUid(data.record_data.paoUid);
            }

            // 时间
            this['dateLabel'].setString(GLOBAL_FUNCS.formatTimeForTimeStamp("yy/mm/dd", data.time_stamp));
            this['timeLabel'].setString(GLOBAL_FUNCS.formatTimeForTimeStamp("h:m", data.time_stamp));
        },

        changeUserNodePos:function(_userInfo)
        {
            var size = _userInfo.length;
            if (size == 4)
            {
                return;
            }
            else if (size == 3)
            {
                var posx = 0;
                for (var i = 0; i < size; i++)
                {
                    posx = this['userNode'+i].getPositionX();
                    this['userNode'+i].setPositionX(posx + 50);
                };
            }
            else if (size == 2)
            {
                var posx = 0;
                for (var i = 0; i < size; i++)
                {
                    posx = this['userNode'+i].getPositionX();
                    this['userNode'+i].setPositionX(posx + 150);
                };

            }
            else
            {
                return;
            }
        },

    });
    //end
})();

