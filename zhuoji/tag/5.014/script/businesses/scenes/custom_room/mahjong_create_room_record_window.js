/*************************************************************
 *  mahjong_create_room_record_window.js
    mahjong_create_room_record_window
 *  mahjong
    我的战绩 window
 *
 *  Created by nick.kai.lee on 16-06-23
 *  特殊说明：

    使用方法:
 */
(function(){
    var GLOBAL_OBJ = guiyang;
    var C2S = GLOBAL_OBJ.businesses.network.C2S;
    var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
    var MODEL = GLOBAL_OBJ.businesses.scenes.CustomRoom.Model;

    GLOBAL_OBJ.businesses.scenes.CustomRoom.RecordWindow = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
        _TAG:"businesses.scenes.CustomRoom.RecordWindow",
        ctor: function(_params) {
            this._super();
            this.params = _params;
        },

        init: function(_ccb) {
            this._super(_ccb);
        },

        onLoad: function() {
            this._super();

            var that      = this;
            this.none_label.setVisible(false);

            /*
            @我的战绩 */
            this.data     = { data:[], tableRecordNode:that.getRootNode()};
            var size      = this.viewNode.getContentSize();
            var tableview = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
                viewSize   :size,
                direction  :cc.SCROLLVIEW_DIRECTION_VERTICAL,
                fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
                bounce     :true,
                cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Common,
                cellSize   :cc.size(size.width, 113),
                controller :GLOBAL_OBJ.businesses.scenes.CustomRoom.RecordCell,
                container  :this.viewNode,
                data       :this.data,
                //pk modify:添加顺序! 倒叙
                sortType   : GLOBAL_OBJ.bkernel.utils.TableView.SortType.Inverted
            });
            this.viewNode.addChild(tableview);

            MODEL.clearRecordData();
            // 刷新战绩
            var __f_update__ = function(){
                var cnt = MODEL.getRecordCount();
                GLOBAL_OBJ.LOGD("CustomRoom_RecordWindow  check update record  ", cnt);
                if(cnt == 0 && MODEL.isNotHaveNewRecord && that.isClickNextBtn == true){
                    ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                     text:"已经最后一页啦!",
                     duration:2
                    });
                    return;
                }
                var num = MODEL.getNowPageIndex()+1;
                var pagestr = "当前:第"+(num)+"页";
                if(num){
                    that.pageIndx.setString(pagestr);
                    //that.pageIndx.setVisible(true);
                }else{
                    that.pageIndx.setVisible(false);
                }

                that.data.data = [];

                for (var i = 0; i < cnt; ++i){
                    var delta_score = MODEL.getDeltaScoreByIndex(i);
                    //pk Modify:  添加过滤
                    var temp_create_table_no = MODEL.getCreateTableNoByIndex(i);
                    var temp_table_record_key = MODEL.getTableRecordKeyByIndex(i);
                    var temp_time_stamp = MODEL.getTimeStampByIndex(i);
                    var temp_users_info = MODEL.getUsersInfoByIndex(i);
                    var temp_record_data = MODEL.getTableRecordByIndex(i);//记录数据
                    var temp_record_download_info = MODEL.getrecordDownloadInfoByIndex(i);
                    var temp_tableId = MODEL.getRecordTableId(i);
                    var temp_playMode = MODEL.getRecordPlayMode(i);
                    if(that.params['targetUserID'])
                    {
                        if (that.filterRecord(temp_create_table_no,temp_time_stamp,temp_record_data))
                        {
                            that.data.data.push({
                                "res":delta_score == 0 ? (GLOBAL_OBJ.RES['ZJZ_WDZJ_WIE_PNG']):(delta_score>0?GLOBAL_OBJ.RES['ZJZ_WDZJ_WIN_PNG']:GLOBAL_OBJ.RES['ZJZ_WDZJ_LOSE_PNG']),
                                "create_table_no":temp_create_table_no,
                                "table_record_key":temp_table_record_key,
                                "time_stamp":temp_time_stamp,
                                "users_info":temp_users_info,
                                "record_download_info":temp_record_download_info,
                                "record_data" :temp_record_data,
                                "tableId" :temp_tableId,
                                "idx":i,
                                "playMode":temp_playMode
                            });
                        }
                    }
                    else
                    {
                        that.data.data.push({
                            "res":delta_score==0?(GLOBAL_OBJ.RES['ZJZ_WDZJ_WIE_PNG']):(delta_score>0?GLOBAL_OBJ.RES['ZJZ_WDZJ_WIN_PNG']:GLOBAL_OBJ.RES['ZJZ_WDZJ_LOSE_PNG']),
                            "create_table_no":temp_create_table_no,
                            "table_record_key":temp_table_record_key,
                            "time_stamp":temp_time_stamp,
                            "users_info":temp_users_info,
                            "record_download_info":temp_record_download_info,
                            "record_data" :temp_record_data,
                            "tableId" :temp_tableId,
                            "idx":i,
                            "playMode":temp_playMode
                        });
                    }
                }

                //pk Modify:  实际长度
                var length = that.data.data.length;
                GLOBAL_OBJ.LOGD("check data length record_window", length);

                // if(length > 0){
                //     //添加最后的操作按钮
                //     that.data.data.unshift({
                //         "isOperatorCell":true,
                //         "nextFunc":that.onNextPage,
                //         "preFunc":that.onPrePage,
                //         "funcThis":that,
                //         "pagestr" : pagestr,
                //     });
                //     length = length + 1;
                // }
                
                // 今日积分
                var score = MODEL.getRecordScore();
                that.txtJiFen.setString(score);

                tableview.reloadData(length);

                //pk modify:显示无记录
                if(length < 1){
                    that.none_label.setVisible(true);
                }else{
                    that.none_label.setVisible(false);
                }
                that.updateBtns();
            };

            /*
            @通知注册*/
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_RECORD,function(){
                __f_update__();
            },this);
            //进来先刷一次老数据
            //__f_update__();
            this.__f_update__ = __f_update__;
            this.getDataFromNet();
        },

        updateBtns:function(){
        },

        getDataFromNet:function(){
            GLOBAL_OBJ.LOGD("CustomRoom_RecordWindow  getDataFromNet  ");
            // 请求战绩
            var param = MODEL.getNowPageParam();
            var startRecordIndex = param.startRecordIndex || 0;
            var endRecordIndex = param.endRecordIndex || 1;
            var allRecord = false;
            if(this.params.playMode == "all"){
                allRecord = true;
            }

            var params = {};
            params.startRecordIndex = startRecordIndex;
            params.endRecordIndex = endRecordIndex;
            params.allRecord = allRecord;
            params.userID = this.params['targetUserID'];

            if(params.userID)
            {
                GLOBAL_OBJ.businesses.network.C2S.requestCheckCustomRoomRecord(params);
                this.data['targetUserID'] = parseInt(params.userID);
            }
            else
            {
                GLOBAL_OBJ.businesses.network.C2S.requestCustomRoomRecord(params);
            }
        },

        onNextPage:function(){
            this.isClickNextBtn = true;
            if(MODEL.checkNextRecordData()){
                this.__f_update__();
            }else{
                this.getDataFromNet();
            }
        },
        
        onPrePage:function(){
            this.isClickNextBtn = false;
            if(MODEL.getNowPageIndex() == 0){
                ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                 text:"已经是第一页啦!",
                 duration:2
                });
                return;
            }
            if(MODEL.checkPreRecordData()){
                this.__f_update__();
            }else{
                this.getDataFromNet();
            }
        },
        /*
        pk Modify:  添加方法
        过滤记录
        */
        filterRecord:function(roomID,timestamp,record_data){
            var that = this;
            var filters = that.params.filters;
            if(that.params.roomID && that.params.roomID != "" ){
                //房间号
                if(that.params.roomID != roomID ){
                    return false;
                }
            }

            var playmodes = filters.playModes;
            var id2Playmode = GLOBAL_OBJ.SupportPlayModes;

            //cc.log("record_data.playMode  "+record_data.playMode);
            if(playmodes && playmodes.length){
                var ok = false;
                for(var pidx = 0 ; pidx < playmodes.length ; pidx ++){
                    var pm = playmodes[i];
                    if(pm == 100){
                         ok = true;
                         break;
                    }
                    if((pm || pm == 0)&&pm != 100){
                        //游戏类型
                        //cc.log("id2Playmode[pm] "+id2Playmode[pm]);
                        if (id2Playmode[pm] == record_data.playMode){
                            ok = true;
                        }
                    }
                }
                if(!ok){
                    // cc.log("wanFa type wrong: " + JSON.stringify(playmodes) + " " + record_data.playMode);
                    return false;
                }
            }

            if(filters.playingTime && filters.playingTime != 100){
                //游戏时间:推前n-1天

                var dt = new Date(timestamp*1000);
                var yy = dt.getFullYear();
                var mm = dt.getMonth()+1;
                var dd = dt.getDate();

                var nowdt = new Date(GLOBAL_OBJ.bkernel.utils.GlobalTimer.getTime()*1000);
                var nowyy = nowdt.getFullYear();
                var nowmm = nowdt.getMonth()+1;
                var nowdd = nowdt.getDate();

                if((yy != nowyy)||(mm != nowmm)||
                    ((nowdd-dd)!= filters.playingTime - 1)
                    ){
                    // cc.log("game time wrong");
                    return false;
                }
            }
            // cc.log("filterRecord ok");
            return true;
        },
        /*
        弹窗弹出完毕
        */
        onEase:function(){
            this._super();
        },

        onClose:function(){
            this.windowClose();
        },

        onCleanup:function(){
            this._super();

            GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
        },

        /*
        touch响应，基类重载
        */
        onTouchBegan:function(_touch,_event){
            this._super();
            return true;
        },
    });
    //end
})();