/*****************************************
 *  mahjong_match_list_center_model.js
    比赛列表中心model
 *  mahjong
 *
 *  Created by zengxx on 16-03-26
 *  特殊说明：
    1.数据存储不直接暴露出去
    2.要什么功能提供什么接口函数，外部view不参与数据处理，完全放权给model
    3.比赛列表协议只存放比赛的基本显示信息，详细信息(如比赛奖励等)将拆分出来
    使用说明:

    注:action中,temp前缀的是cmd为非user的协议，自己复制一份result，并在其中加入的action
    这么做主要考虑以下几点：
    1、为了单条协议新建一个model，觉得没必要
    2、想把比赛列表模块所有数据统一到这里来
    3、在gameworld里面，完全由model实现者来调用，不会影响其他需要使用该协议的model


 */

(function () {
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.businesses.scenes.CustomRoom.Model = (function(){
        /*
         @数据缓存*/
        var CACHE = {
            info:{
                roomList:[],
                chatRecord:[]
            },

            sit:{
                player:{},
                createTableNo:0,
                timesId:0
            },

            leave:{
                seatId:null,
                leave_cd:0  // 收到leave后 停留多久切出去
            },

            record:{
                list:[],        // 战绩列表
                pageList:[],    // 分页的战绩列表
                nowPageIndex:0, // 当前第几页
                onePageNum:10,  // 一页显示个数
                score: 0,       // 玩家今日总积分
            },

            create_table_dissolution:{
                name:"",
                userId:0,
                seatNum:0,
                vote_cd:0,
                vote_info_detail:[]
            },

            user_leave_vote:{
                userId:0,
                vote:0,
                close_vote:0, // 1 表示关闭投票弹窗 0 表示不关闭
                vote_info:{},  // 投票信息，主要用于校验
                close_vote_cd:0, // 投票结束后，投票窗口停留时间s
                vote_info_detail:[]
            },

            create_table_desc_list:[],   // 创建房间配置详情描述列表

            create_table_play_desc_list:[],   // 房间的玩法列表

            wechat_share:{
                title:"",
                desc:"",
                url:"",
                type:""
            },

            room_card:{} // 房卡信息
        };

        var btnMap = {
            "xuezhan":[GLOBAL_OBJ.RES.TXT_QIANJIANG_HUANGHUANG_PNG, GLOBAL_OBJ.RES.TXT_QIANJIANG_HUANGHUANG_SELECT_PNG],
            "xueliu":[GLOBAL_OBJ.RES.TXT_QIANJIANG_HUANGHUANG_PNG, GLOBAL_OBJ.RES.TXT_QIANJIANG_HUANGHUANG_SELECT_PNG],
        };

        return {
            _TAG: 'GLOBAL_OBJ.businesses.scenes.CustomRoom.Model',
            _recordFilterMode:true,
            isNotHaveNewRecord : false,
            parse:function(_data){
                var data   = _data;
                if (!data){
                    return;
                }

                switch(data.action){
                    case GLOBAL_OBJ.businesses.scenes.CustomRoom.static.ACTIONS.INFO:
                        this.parseInfo(data);
                        break;
                    case GLOBAL_OBJ.businesses.scenes.CustomRoom.static.ACTIONS.LEAVE:
                        this.parseLeave(data);
                        break;
                    case GLOBAL_OBJ.businesses.scenes.CustomRoom.static.ACTIONS.READY:
                        this.parseReady(data);
                        break;
                    case GLOBAL_OBJ.businesses.scenes.CustomRoom.static.ACTIONS.RECORD:
                        this.parseRecord(data);
                        break;
                    default:
                        break;
                }
            },

            parseInfo:function(_data){
                // GLOBAL_OBJ.LOGD(this._TAG,"parseInfo _data : "+JSON.stringify( _data ));
                // var playModeList    = GLOBAL_OBJ.GlobalVars.getCreatePlayModes() || [];  // 点击大厅入口，决定能够创建哪些玩法桌子
                var data            = _data;
                CACHE.info.roomList = data.list || [];

                //去除空项，不知道之前什么处理，反正是能产生空的
                for (var i = 0; i < CACHE.info.roomList.length; ++i){
                    if(CACHE.info.roomList[i]==null){
                        CACHE.info.roomList.splice(i, 1);
                        i--;
                    }
                }

                // GLOBAL_OBJ.LOGD(this._TAG,"data.list : "+JSON.stringify( data.list ));
                GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_INFO,{});
            },

            parseSit:function(_data){
                var data                = _data;
                CACHE.sit.timesId       = data.itemParams.cardCount;
                CACHE.sit.createTableNo = data.createTableNo;
                CACHE.sit.player[data.userId]             = CACHE.sit.player[data.userId] || {};
                CACHE.sit.player[data.userId].isTableHost = data.isTableHost;
                GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_SIT,{});
            },

            parseLeave:function(_data){
                var data             = _data;
                CACHE.leave.seatId   = data.seatId;
                CACHE.leave.leave_cd = data.leave_cd || 0;

                GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_LEAVE,{});
            },

            parseReady:function(_data){
                GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_READY,_data);
            },

            //pk modify start!
            //pk modify: 对战记录是否需要过滤类型
            setNeedRecordFilterMode:function(tf){
                this._recordFilterMode = tf;
            },

            getBtnCfg:function (playMode) {
                var obj = btnMap[playMode];
                return obj;
            },

            parseRecord:function(_data){
                var data = _data;

                var playModeList    = GLOBAL_OBJ.GlobalVars.getCreatePlayModes() || [];
                /* 过滤本包不支持的玩法
                 data.list = data.list.filter(function(temp)
                 {
                 var play_mode = temp['playMode'] || '';

                 if (GLOBAL_OBJ.SupportPlayModes.indexOf(play_mode) != -1)
                 {
                 return true;
                 }
                 return false;
                 });

                 //过滤本玩法的回放信息
                 if(this._recordFilterMode){
                 data.list = data.list.filter(function (dataList)
                 {

                 var haveFg = false;
                 for(var loop = 0;loop < playModeList.length;loop++)
                 {
                 if(dataList['playMode'] == playModeList[loop])
                 {
                 haveFg = true;
                 break;
                 }
                 }

                 return haveFg;
                 })
                 }*/

                CACHE.record.list = [];
                switch(data.type){
                    case "update":  // 全量下发
                        CACHE.record.list = data.list || [];
                        break;
                    case "add_update":  //  增量下发
                        CACHE.record.list = data.list.concat(CACHE.record.list);
                        break;
                    default:
                        break;
                }

                //pk modify:按时间排序
                var sortFunc = function(record1,record2){
                    return record2.recordTime - record1.recordTime;
                }
                CACHE.record.list.sort(sortFunc);
                CACHE.record.score = data.score;

                //分页
                this.updateRecordByPage();

                GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_RECORD,{});
            },

            checkNextRecordData:function(){
                if(this.isNotHaveNewRecord == true){
                    return true;
                }
                var nowPageIndex = CACHE.record.nowPageIndex;
                CACHE.record.nowPageIndex = nowPageIndex + 1;
                if(CACHE.record.pageList[CACHE.record.nowPageIndex]){
                    CACHE.record.list = CACHE.record.pageList[CACHE.record.nowPageIndex];
                    return true;
                }else{
                    return false;
                }
            },
            checkPreRecordData:function(){
                var nowPageIndex = CACHE.record.nowPageIndex;
                CACHE.record.nowPageIndex = nowPageIndex - 1;
                if(CACHE.record.pageList[CACHE.record.nowPageIndex]){
                    CACHE.record.list = CACHE.record.pageList[CACHE.record.nowPageIndex];
                    this.isNotHaveNewRecord = false;
                    return true;
                }else{
                    return false;
                }
            },
            //重置记录
            clearRecordData:function(){
                this.clearRecordList();
                CACHE.record.pageList = [];
                CACHE.record.nowPageIndex = 0;
                this.isNotHaveNewRecord = false;
                CACHE.record.score = 0;
            },
            clearRecordList:function () {
                CACHE.record.list = [];
            },
            //分页
            updateRecordByPage:function(){
                if(CACHE.record.list.length < 1){
                    this.isNotHaveNewRecord = true;
                    CACHE.record.nowPageIndex = CACHE.record.pageList.length - 1;
                }else{
                    this.isNotHaveNewRecord = false;
                    CACHE.record.pageList[CACHE.record.nowPageIndex] = CACHE.record.list;
                }
            },

            getNowPageParam:function(){
                var ni = CACHE.record.nowPageIndex;
                var _startRecordIndex = ni * CACHE.record.onePageNum;
                var _endRecordIndex = _startRecordIndex + CACHE.record.onePageNum - 1;
                return {startRecordIndex:_startRecordIndex,endRecordIndex:_endRecordIndex}
            },
            getNowPageIndex:function(){
                //cc.log("getNowPageIndex   " + CACHE.record.nowPageIndex);
                return CACHE.record.nowPageIndex;
            },
            //获取当前页数的记录
            getNowPageList:function(){
                if(CACHE.record.pageList && CACHE.record.pageList.length){
                    if(CACHE.record.pageList[CACHE.record.nowPageIndex]){
                        return CACHE.record.pageList[CACHE.record.nowPageIndex];
                    }
                    return [];
                }
            },
            //依靠页数获取记录
            getPageListByPageIndex:function(pageidx){
                if(CACHE.record.pageList && CACHE.record.pageList.length){
                    if(pageidx >= 0){
                        return CACHE.record.pageList[pageidx];
                    }
                    return [];
                }
            },

            parseCreateTableDissolution:function(_data){
                var data = _data;
                CACHE.create_table_dissolution.name      = data.name || "";
                CACHE.create_table_dissolution.userId    = data.userId || 0;
                CACHE.create_table_dissolution.seatNum   = data.seatNum || 0;
                CACHE.create_table_dissolution.vote_cd   = data.vote_cd || 60;
                CACHE.create_table_dissolution.vote_info_detail = data.vote_info_detail || [];

                GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_DISSOLUTION,{});
            },

            parseUserLeaveVote:function(_data){
                var data = _data;
                CACHE.user_leave_vote.userId     = data.userId || 0;
                CACHE.user_leave_vote.vote       = data.vote || 0;
                CACHE.user_leave_vote.close_vote = data.close_vote || 0;
                CACHE.user_leave_vote.vote_info  = data.vote_info || {};
                CACHE.user_leave_vote.close_vote_cd   = data.close_vote_cd || 2;
                CACHE.user_leave_vote.vote_info_detail = data.vote_info_detail || [];

                GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_VOTE_INFO,{});
            },

            /*
             @解析table_info中的create_table_extend_info，主要用于
             1 断线重连回来一些状态的恢复
             2 微信分享数据
             */
            parseFromTableInfo:function(_data){
                var extend_info = _data['create_table_extend_info'];
                GLOBAL_OBJ.LOGD(this._TAG,"GLOBAL_OBJ.businesses.scenes.CustomRoom.Model.parseFromTableInfo");
                if (extend_info){
                    GLOBAL_OBJ.LOGD(this._TAG,"GLOBAL_OBJ.businesses.scenes.CustomRoom.Model.parseFromTableInfo extend_info have");
                    // info
                    if (extend_info.hasOwnProperty("cur_item_info")){
                        this.parseInfo({
                            "list":[extend_info.cur_item_info]
                        });
                    }

                    // ready
                    GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_READY_LIST,{});

                    // 创建房间配置详情描述列表
                    CACHE.create_table_desc_list = extend_info['create_table_desc_list'] || [];
                    CACHE.create_table_play_desc_list = extend_info['create_table_play_desc_list'] || [];

                    // GLOBAL_OBJ.LOGD(this._TAG,"CACHE.create_table_desc_list : "+JSON.stringify( CACHE.create_table_desc_list ));
                    // GLOBAL_OBJ.LOGD(this._TAG,"CACHE.create_table_play_desc_list : "+JSON.stringify( CACHE.create_table_play_desc_list ));

                    // GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_DESC_LIST,{});

                    // 投票
                    if (extend_info['leave_vote'] && GLOBAL_OBJ.bkernel.Functions.isEmptyObject(extend_info['leave_vote'])!=true){
                        this.parseCreateTableDissolution(extend_info['leave_vote']);
                    }

                    // WeChat share 微信分享
                    if (extend_info['wechat_share']){
                        CACHE.wechat_share.title = extend_info['wechat_share']['title'] || "";
                        CACHE.wechat_share.des   = extend_info['wechat_share']['des'] || "";
                        CACHE.wechat_share.url   = extend_info['wechat_share']['url'] || "";
                        CACHE.wechat_share.type  = extend_info['wechat_share']['type'] || "";
                    }
                }else{
                    GLOBAL_OBJ.LOGD(this._TAG,"GLOBAL_OBJ.businesses.scenes.CustomRoom.Model.parseFromTableInfo extend_info none");

                }
                GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_DESC_LIST,{});
            },

            /*
             激活model，发送一次数据
             返回值：false数据为空
             */
            activate:function(_action){
                switch(_action){
                    case GLOBAL_OBJ.businesses.scenes.CustomRoom.static.ACTIONS.INFO:
                        GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_INFO,{});
                        break;
                    case GLOBAL_OBJ.businesses.scenes.CustomRoom.static.ACTIONS.SIT:
                        GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_SIT,{});
                        break;
                    case GLOBAL_OBJ.businesses.scenes.CustomRoom.static.ACTIONS.READY:
                        break;
                    case GLOBAL_OBJ.businesses.scenes.CustomRoom.static.ACTIONS.RECORD:
                        GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_RECORD,{});
                        break;
                    default:
                        break;
                }
            },

            // 有玩家发起了退出投票
            parseFromCreateTableDissolution:function(_data){
                var data   = _data;
                if (!data){
                    return;
                };

                this.parseCreateTableDissolution(data);
            },

            // 玩家投票结果刷新
            parseFromUserLeaveVote:function(_data){
                var data   = _data;
                if (!data){
                    return;
                };

                this.parseUserLeaveVote(data);
            },

            // 重新组装server传过来的数据，server传的数据格式不是client能接受的格式，server说他的格式是标准格式，所以只能自己改
            reDesignData:function(_array)
            {
                var obj = _array[0];
                var param = {};
                param.name = "局数";
                param.type = "sc";
                obj.paramType.cardCount = param;

                if (obj.paramType.cardCount4)
                {
                    delete obj.paramType.cardCount4;
                }
                if (obj.paramType.cardCount3)
                {
                    delete obj.paramType.cardCount3;
                }
                if (obj.paramType.cardCount2)
                {
                    delete obj.paramType.cardCount2;
                }

                var scope = [];

                if (obj.cardCount4)
                {
                    var tempArray = obj.cardCount4;
                    for (var i = 0; i < tempArray.length; i++)
                    {
                        scope.push(tempArray[i]);
                    }
                    delete obj.cardCount4;
                }

                if (obj.cardCount3)
                {
                    var tempArray = obj.cardCount3;
                    for (var i = 0; i < tempArray.length; i++)
                    {
                        scope.push(tempArray[i]);
                    }
                    delete obj.cardCount3;
                }

                if (obj.cardCount2)
                {
                    var tempArray = obj.cardCount2;
                    for (var i = 0; i < tempArray.length; i++)
                    {
                        scope.push(tempArray[i]);
                    }
                    delete obj.cardCount2;
                }

                obj.cardCount = scope;
                _array[0] = obj;
            },
            /**
             * 返回所有房间列表
             * @returns {Array}
             */
            getAllRooms:function(){
                this.reDesignData(CACHE.info.roomList);
                // GLOBAL_OBJ.LOGD("reDesignData  ", JSON.stringify(CACHE.info.roomList));
                return CACHE.info.roomList;
            },

            /*  根据局数id获得可以房间局数描述 */
            // getRoomTimesDesByRoomTimesId:function(_id){
            //     var list  = CACHE.info.roomList || [];
            //     for( var index in list){
            //         var room  = list[index] || {};
            //         var datas = room.cardCount || [];
            //         for(var i in datas){
            //             if (_id == datas[i].id) {
            //                 return datas[i].desc;
            //             };
            //         };
            //     };
            // },

            /* 自建桌 sit */

            /*  获取局数id */
            // getRoomTimesId:function(){
            //     return CACHE.sit.timesId;
            // },

            /*  获取房间code */
            getRoomCode:function(){
                return CACHE.sit.createTableNo;
            },

            /* 自建桌 leave */
            getLeaveSeatId:function(){
                return CACHE.leave.seatId;
            },

            getLeaveCD:function(){
                return CACHE.leave.leave_cd;
            },

            /* 微信分享 */
            getWeChatShareTitle:function(){
                return CACHE.wechat_share.title;
            },

            getWeChatShareDes:function(){
                return CACHE.wechat_share.des;
            },

            getWeChatShareUrl:function(){
                return CACHE.wechat_share.url;
            },

            getWeChatShareType:function(){
                return CACHE.wechat_share.type;
            },

            /* 自建桌 record */
            getRecordCount:function(){
                // GLOBAL_OBJ.LOGD("check getRecordCount "+JSON.stringify(CACHE.record));
                return CACHE.record.list.length;
            },
            clearRecordList:function () {
                CACHE.record.list = [];
            },

            // 玩家自己输赢的积分
            getDeltaScoreByIndex:function(_index){
                if (CACHE.record.list[_index] && CACHE.record.list[_index]['deltaScore']){
                    return CACHE.record.list[_index]['deltaScore'];
                }
                return 0;
            },

            // 房间号
            getCreateTableNoByIndex:function(_index){
                if (CACHE.record.list[_index] && CACHE.record.list[_index]['createTableNo']){
                    return CACHE.record.list[_index]['createTableNo'];
                }
                return 0;
            },

            // 局号
            getRecordTableId:function(_index){
                if (CACHE.record.list[_index] && CACHE.record.list[_index]['createBaseTableNo'])
                {
                    return CACHE.record.list[_index]['createBaseTableNo'];
                }
                return 0;
            },

            // 战绩的playMode
            getRecordPlayMode:function(_index){
                if (CACHE.record.list[_index] && CACHE.record.list[_index]['playMode'])
                {
                    return CACHE.record.list[_index]['playMode'];
                }
                return 0;
            },

            getCreateRoomDescList:function(){
                return CACHE.create_table_desc_list;
            },

            getCreateRoomPlayDescList:function(){
                return CACHE.create_table_play_desc_list;
            },

            // 用来获取牌局回放数据的key
            getTableRecordKeyByIndex:function(_index){
                if (CACHE.record.list[_index] && CACHE.record.list[_index]['tableRecordKey']){
                    return CACHE.record.list[_index]['tableRecordKey'];
                }
                return "";
            },

            // pk Modify: 用来获取牌局回放数据
            getTableRecordByIndex:function(_index){
                if (CACHE.record.list[_index]){
                    return CACHE.record.list[_index];
                }
                return "";
            },

            // new add sc 回放前记录选中的数据
            getMarkRoomIndex:function () {
                return CACHE.mark_room_index;
            },

            setMarkRoomIndex:function (_index) {
                CACHE.mark_room_index = _index;
            },

            getMarkListLength:function () {
                return CACHE.record.list.length;
            },
            //end

            // 纪录战绩的时间戳
            getTimeStampByIndex:function(_index){
                if (CACHE.record.list[_index] && CACHE.record.list[_index]['recordTime']){
                    return CACHE.record.list[_index]['recordTime'];
                }
                return 0;
            },

            // 所有玩家的昵称和最后积分
            getUsersInfoByIndex:function(_index){
                var info = [];
                if (CACHE.record.list[_index] && CACHE.record.list[_index]['users']){
                    for (var i = 0; i < CACHE.record.list[_index]['users'].length; ++i){
                        info.push({
                            uid        : CACHE.record.list[_index]['users'][i]['userId'] || 0,
                            purl       : CACHE.record.list[_index]['users'][i]['purl'] || "",
                            name       : CACHE.record.list[_index]['users'][i]['name'] || "",
                            score      : CACHE.record.list[_index]['users'][i]['score'] || 0,
                            deltaScore : CACHE.record.list[_index]['users'][i]['deltaScore'] || []
                        });
                    }
                }
                return info;
            },

            // 底数信息
            getDiInfoByIndex:function(_index) {
                if (CACHE.record.list[_index] && CACHE.record.list[_index]['base_no']){
                    return CACHE.record.list[_index]['base_no'];
                }
                return 0;
            },

            // 玩家牌局回放下载信息
            getrecordDownloadInfoByIndex:function(_index){
                var info = [];
                if (CACHE.record.list[_index] && CACHE.record.list[_index]['record_download_info']){
                    for (var i = 0; i < CACHE.record.list[_index]['record_download_info'].length; ++i){
                        info.push({
                            url      : CACHE.record.list[_index]['record_download_info'][i]['url'] || "",
                            fileType : CACHE.record.list[_index]['record_download_info'][i]['fileType'] || "",
                            MD5      : CACHE.record.list[_index]['record_download_info'][i]['MD5'] || ""
                        });
                    }
                }
                return info;
            },

            /* 自建桌 房卡 */
            getRoomCardCount:function(){
                return CACHE.room_card.count || 0;
            },

            // 获取玩家战绩今日积分
            getRecordScore:function()
            {
                return CACHE.record.score || 0;
            },

            getRecordPaoUid:function()
            {
                return CACHE.record.paoUid || 0;
            },

            getRecordHostUid:function()
            {
                return CACHE.record.hostUid || 0;
            },

            test:function(){

            },
        }
    })();
})();

