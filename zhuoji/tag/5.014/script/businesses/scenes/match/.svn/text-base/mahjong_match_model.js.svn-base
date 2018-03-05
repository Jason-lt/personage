/*****************************************
 *  mahjong_room_list_model.js
    房间列表model
 *  mahjong
 *
 *  Created by xujing on 17-11-11
 *  
    协议说明：

    使用说明:

 */
(function () {
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.businesses.scenes.Match.Model = {

        _TAG:"businesses.scenes.RoomList.Model",
        /**
         * 数据缓存
         */
        CACHE:{},

        /**
         * 解析比赛详情
         * @param _data
         */
        parseDes:function(_data){
            GLOBAL_OBJ.LOGD(this._TAG, "解析比赛详情");

            if (!this.CACHE.condition){
                this.CACHE.condition = {};
            }

            if (!this.CACHE.roomDes){
                this.CACHE.roomDes = {};
            }

            var match_id = "";
            if (_data.hasOwnProperty('matchId')){
                match_id = _data.matchId;
            }

            var key_condition = _data.roomId + "_" + match_id;
            if (!this.CACHE.condition.hasOwnProperty(key_condition)){
                this.CACHE.condition[key_condition] = _data.condition;
            }

            this.CACHE.roomDes[key_condition] = _data;

            this.CACHE.curDesc = _data;

            GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_DESC, _data);
        },

        /**
         * 获取当前比赛的详情
         * @returns {*}
         */
        getCurDes:function () {
            return this.CACHE.curDesc;
        },

        getMatchRoomDes:function (roomId, matchId) {
            var key_condition = roomId + "_" + matchId;
            return this.CACHE.roomDes[key_condition];
        },

        isFinalMatch:function (roomId, matchId, stageIndex) {
            var curMatchRoomDes = this.getMatchRoomDes(roomId, matchId);
            return stageIndex == curMatchRoomDes.stages.length;
        },

        /**
         * 获取开赛条件
         * @param roomId 房间ID
         * @param matchId 比赛ID
         * @returns {*|number} 满多少人开赛
         */
        getCondition:function (roomId, matchId) {
            var key_condition = roomId + "_" + matchId;
            return this.CACHE.condition[key_condition] || 0;
        },

        // setFeeIndex:function (roomId, matchId, feeIndex) {
        //
        //     if (!this.CACHE.feeIndexs){
        //         this.CACHE.feeIndexs = {};
        //     }
        //
        //     var key_condition = roomId + "_" + matchId;
        //     this.CACHE.feeIndexs[key_condition] = feeIndex;
        // },

        // getFeeIndex:function (roomId, matchId) {
        //     if (!this.CACHE.feeIndexs){
        //         return null;
        //     }
        //     var key_condition = roomId + "_" + matchId;
        //     var feeIndex = null;
        //     if (this.CACHE.feeIndexs.hasOwnProperty(key_condition)){
        //         feeIndex = this.CACHE.feeIndexs[key_condition];
        //     }
        //     return feeIndex;
        // },

        /**
         * 获取比赛场牌桌上的实时名次
         * @param _userId 用户ID
         * @returns {number} 大于0，说明有名次（只返回前两名）
         */
        getRealRank:function (_userId) {
            var rankObj;
            var rank = 0;
            for (var i = 0; i < this.CACHE.ranks.length; i++){
                rankObj = this.CACHE.ranks[i];
                if (rankObj.userId == _userId){
                    rank = i+ 1;
                    break;
                }
            }

            return rank;
        },

        /**
         * 解析比赛报名
         * @param _data
         */
        parseSignin:function(_data){
            GLOBAL_OBJ.LOGD(this._TAG, "解析比赛报名");

            // {
            //     "cmd": "room",
            //     "result": {
            //         "gameId": 701,
            //         "matchId": 701221,
            //         "userId": 10788,
            //         "signs": 1,
            //         "action": "signin",
            //         "roomId": 7012201000
            //     }
            // }

            this.CACHE.curRoomInfo = _data;

            GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_MAHJ_MATCH_SIGNIN, _data);
        },

        getCurRoomInfo:function () {
            return this.CACHE.curRoomInfo;
        },

        parseWait:function(_data){
            GLOBAL_OBJ.LOGD(this._TAG, "解析比赛报名");

            // {
            //     "cmd":"room",
            //     "result":{
            //         "gameId":701,
            //         "isLevelUp":false,
            //         "stageIndex":1,
            //         "matchId":701221,
            //         "userId":11248,
            //         "rank":85,
            //         "rankName":"86/128",
            //         "action":"wait",
            //         "roomId":7012201000，
            //         "cardCount": 1,  //比赛要打几副牌
            //         "tableRank": 1   //如果晋级了，在本桌上的名次
            //     }
            // }

            this.CACHE.curWaitInfo = _data;

            var curSce = hall.SceneManager.getCurrentController();
            var waitingPanel;
            //展示等待面板
            if (!_data.isLevelUp){
                //赛前等待
                waitingPanel = new GLOBAL_OBJ.businesses.scenes.Match.WaitingPanel(_data);
            }
            else{
                //赛间等待（晋级等待）
                waitingPanel = new GLOBAL_OBJ.businesses.scenes.Match.LvUpPanel(_data);
            }
            curSce.getRootNode().addChild(waitingPanel.getRootNode());
        },

        getCurWaitInfo:function () {
            return this.CACHE.curWaitInfo;
        },

        parseRealRank:function(_data){
            GLOBAL_OBJ.LOGD(this._TAG, "解析牌桌上实时名次");

            // {
            //     "cmd": "table_call",
            //     "result": {
            //         "action": "match_real_rank",
            //         "tableId": 70122010010200,
            //         "gameId": 701,
            //         "roomId": 7012201001,
            //         "ranks": [
            //             {
            //                 "seatId": 1,
            //                 "score": 120,
            //                 "userId": 9667
            //             },
            //             {
            //                 "seatId": 0,
            //                 "score": 0,
            //                 "userId": 10788
            //             }
            //         ]
            //     }
            // }

            this.CACHE.ranks = _data.ranks || [];

            GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_MAHJ_MATCH_REAL_RANK, _data);
        },

        parseRank:function(_data){
            GLOBAL_OBJ.LOGD(this._TAG, "解析牌桌右上角名次");

            // {
            //     "cmd": "room",
            //     "result": {
            //         "gameId": 701,
            //         "stageIndex": 1,
            //         "matchId": 701221,
            //         "userId": 10788,
            //         "rank": 123,
            //         "rankName": "124/128",
            //         "action": "rank",
            //         "roomId": 7012201000
            //     }
            // }
            this.CACHE.curRank = _data;
            GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_MAHJ_MATCH_RANK, {rank:_data.rankName});
        },
        
        getCurRank:function () {
            return this.CACHE.curRank;
        },

        parseGiveUp:function(_data){
            GLOBAL_OBJ.LOGD(this._TAG, "解析退赛");

            // {
            //     "cmd":"room",
            //     "result":{
            //         "giveup":1,
            //         "gameId":701,
            //         "matchId":701221,
            //         "userId":10788,
            //         "action":"match_giveup",
            //         "tips":"\u60a8\u5df2\u9000\u51fa\u6bd4\u8d5b\uff0c\u6bd4\u8d5b\u7ed3\u675f\u540e\uff0c\u540d\u6b21\u5956\u4ee5\u6d88\u606f\u65b9\u5f0f\u53d1\u7ed9\u 60a8\u3002",
            //         "roomId":7012201000
            //     }
            // }

            //收到退赛协议，返回比赛场房间列表
            var curSce = hall.SceneManager.getCurrentController();
            if (!(curSce instanceof GLOBAL_OBJ.businesses.scenes.Match.Scene)){
                GLOBAL_OBJ.businesses.utils.Scene.jumpToMatch(GLOBAL_OBJ.GlobalVars.getCurPlayMode());
            }
        },

        parseMatchOver:function(_data){
            GLOBAL_OBJ.LOGD(this._TAG, "解析比赛结算");

            // {
            //     "cmd":"room",
            //     "result":{
            //         "giveup":1,
            //         "gameId":701,
            //         "matchId":701221,
            //         "userId":10788,
            //         "action":"match_giveup",
            //         "tips":"\u60a8\u5df2\u9000\u51fa\u6bd4\u8d5b\uff0c\u6bd4\u8d5b\u7ed3\u675f\u540e\uff0c\u540d\u6b21\u5956\u4ee5\u6d88\u606f\u65b9\u5f0f\u53d1\u7ed9\u 60a8\u3002",
            //         "roomId":7012201000
            //     }
            // }

            this.CACHE.matchResultData = _data;

            // GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_MAHJ_MATCH_REAL_RANK, _data);

            var curSce = hall.SceneManager.getCurrentController();
            var resultPanel = new GLOBAL_OBJ.businesses.scenes.Match.ResultScene(_data);
            curSce.getRootNode().addChild(resultPanel.getRootNode());
        },

        parseMatchRoundCount:function(_data){
            GLOBAL_OBJ.LOGD(this._TAG, "解析比赛场次进度");

            // {
            //     "cmd":"table_call",
            //     "result":{
            //         "gameId":701,
            //         "totalCount":1,
            //         "tableId":70122010010198,
            //         "action":"updateRoundCount",
            //         "curCount":1,
            //         "roomId":7012201001
            //     }
            // }

            this.CACHE.roundCountInfo = _data;

            GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_MAHJ_MATCH_ROUND_COUNT, _data);
        },

        parseEnterQueue:function (_data) {
            GLOBAL_OBJ.LOGD(this._TAG, "进入队列，开始匹配玩家");
            var curSce = hall.SceneManager.getCurrentController();
            var pipeiLayer = new GLOBAL_OBJ.table.scenes.Table.Enter_Queue(_data);
            curSce.getRootNode().addChild(pipeiLayer.getRootNode());
        },

        parseLeaveQueue:function (_data) {
            GLOBAL_OBJ.LOGD(this._TAG, "离开队列，匹配超时");
        },

        getCurRoundCount:function () {
            return this.CACHE.roundCountInfo;
        },

        cleanMatchResult:function () {
            this.CACHE.matchResultData = null;
        },

        getMatchResultData:function () {
            return this.CACHE.matchResultData;
        },

        /**
         * 报名后，更新已经报名的房间号
         * @param data
         */
        parseMatchSigns:function (data) {
            this.CACHE.signMatchRoomIds = data.rooms;
            // for(var roomId in data.rooms){
            //     this.CACHE.signMatchRoomIds.push(roomId);
            // }
            GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_TIME_MATCH_SIGNS, data.rooms);
        },

        /**
         * 解析排行榜
         * @param data
         */
        parseMatchRanks:function (data) {
            this.CACHE.ranks = data.mranks;
            GLOBAL_OBJ.LOGD(this._TAG, "解析排行榜 :" + JSON.stringify(data));
            GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_TIME_MATCH_RANK, this.CACHE.ranks);
        },

        /**
         * 解析定时赛信息
         * @param data
         */
        parseUpDateMatchInfo:function (data) {
            GLOBAL_OBJ.LOGD(this._TAG, "解析定时赛信息 :" + JSON.stringify(data));

            // {
            //     "cmd":"match",
            //     "result":{
            //     "action":"update",
            //         "roomId":701230,
            //         "state":20,
            //         "inst":"701230.2957",
            //         "curPlayer":4,
            //         "curTimeLeft":0,
            //         "startTime":"",
            //         "waitInfo":{
            //             "uncompleted":1,
            //             "tableRunk":"0/3",
            //             "runk":"1/4",
            //             "chip":20000,
            //             "info":"\u8bf7\u8010\u5fc3\u7b49\u5f85\u5176\u4ed6\u73a9\u5bb6"
            //         },
            //         "progress":0,
            //         "onlinePlayerCount":0,
            //         "signinPlayerCount":0
            //     }
            // }

            GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_TIME_MATCH_INFO, data);
        },
        /**
         * 解析定时赛晋级
         * @param data
         */
        parseRise:function (data) {
            GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_TIME_MATCH_RISE, data);
        },
        /**
         * 解析定时赛开始
         * @param data
         */
        parseMatchStart:function (data) {

            // {
            //     "cmd": "match",
            //     "result": {
            //         "action": "start",
            //         "gameId": 701,
            //         "roomId": 701230
            //     }
            // }

            var curSce = hall.SceneManager.getCurrentController();
            var waitingPanel = new GLOBAL_OBJ.businesses.scenes.Match.WaitingPanel();
            curSce.getRootNode().addChild(waitingPanel.getRootNode());

            this.CACHE.curStartInfo = data;

            GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_TIME_MATCH_START, data);
        },

        getCurStartInfo:function () {
            return this.CACHE.curStartInfo;
        },

        /**
         * 解析定时赛取消
         * @param data
         */
        parseMatchCancel:function (data) {
            // {
            //     "cmd": "match",
            //     "result": {
            //         "action": "cancel",
            //         "gameId": 701,
            //         "roomId": 701230,
            //         "reason": 1,
            //         "info": "由于参赛人数不足,比赛取消"
            //     }
            // }

            var todotask = {
                "action":"pop_tip",
                "params": {
                    "duration": 2,
                    "text": data.info
                }
            };
            hall.ToDoTask.runOneTask(todotask);

            GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_TIME_MATCH_CANCEL, data);
        },

        /**
         * 解析定时赛赛间等待
         * @param data
         */
        parseTimeMatchWait:function (data) {

            // {
            //     "cmd": "match",
            //     "result": {
            //         "action": "wait",
            //         "gameId": 701,
            //         "roomId": 701230,
            //         "tableId": 70123010000000,
            //         "riseWait": 3,
            //         "mname": "\\u8840\\u6d41\\u6210\\u6cb3iPhoneX\\u4e89\\u9738\\u8d5b",
            //         "steps": [
            //             {
            //                 "des": "810人晋级",
            //                 "isCurrent": 1,
            //                 "name": "海选赛"
            //             },
            //             {
            //                 "des": "192人晋级",
            //                 "name": "选拔赛"
            //             }
            //         ]
            //     }
            // }

            //riseWait
            // 0:未知 1:配桌中 2:轮空等待 3:晋级等待

            this.CACHE.curWaitInfo = data;

            var waitPanel;
            if (data.riseWait == 3){
                //弹出晋级面板
                waitPanel = new GLOBAL_OBJ.businesses.scenes.MatchWait.MatchWaitingInMatchController(data);
            }
            else if (data.riseWait == 1){
                //弹出正常等待面板
                waitPanel = new GLOBAL_OBJ.businesses.scenes.MatchWait.MatchWaitingPanel();
            }

            if (waitPanel){
                var curSce = hall.SceneManager.getCurrentController();
                curSce.getRootNode().addChild(waitPanel.getRootNode());
            }

        },

        /**
         * 检查是否报名过某比赛
         * @param roomId 比赛房间ID
         * @returns {boolean}
         */
        checkIsSign:function (roomId) {
            if (!this.CACHE.signMatchRoomIds){
                this.CACHE.signMatchRoomIds = [];
            }
            return this.CACHE.signMatchRoomIds.indexOf(roomId+"") > -1;
        },

        parseSigninTimeMatch:function (_data) {
            GLOBAL_OBJ.LOGD(this._TAG, "解析定时赛报名返回！");
            // {
            //     "cmd":"match",
            //     "result":{
            //         "action":"signin",
            //         "ok":1,
            //         "gameId":6,
            //         "roomId":6998,
            //         "userId":10001
            //     }
            // }
            if (!this.checkIsSign(_data.roomId)){
                this.CACHE.signMatchRoomIds.push(_data.roomId);
            }
            GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_MAHJ_TIME_MATCH_SIGNIN, _data);
        },

        parseSignOutTimeMatch:function (_data) {
            // {
            //     "cmd":"match",
            //     "result":{
            //         "action":"signout",
            //         "gameId":6,
            //         "roomId":6998,
            //         "userId":10001
            //     }
            // }
            var todotask = {
                "action":"pop_tip",
                "params": {
                    "duration": 2,
                    "text": "退赛成功！"
                }
            };
            hall.ToDoTask.runOneTask(todotask);
            var idx = this.CACHE.signMatchRoomIds.indexOf(_data.roomId);
            if (idx > -1){
                this.CACHE.signMatchRoomIds.splice(idx,1); //从已经报名的列表中删除
            }
            GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_MAHJ_TIME_MATCH_SIGNOUT, _data);
        },

        /*
         公有数据+接口
         TODO:
         外部调用
         */
        /* 协议解析*/
        parseRoomFromMatchMsg:function (_data) {
            var data = _data;
            if (!data){
                return;
            }

            if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(data)){
                return;
            }

            switch (data.action){
                case "desc":{
                    //比赛详情
                    this.parseDes(data);
                    break;
                }
                case "signin":{
                    //比赛报名
                    this.parseSigninTimeMatch(data);
                    break;
                }
                case "signout":{
                    //退赛
                    this.parseSignOutTimeMatch(data);
                    break;
                }
                case "wait":{
                    //定时赛
                    this.parseTimeMatchWait(data);
                    break;
                }
                case "over":{
                    //比赛结算
                    this.parseMatchOver(data);
                    break;
                }
                case "signs":{
                    //比赛报名列表（存储的报过名的比赛roomId）
                    this.parseMatchSigns(data);
                    break;
                }
                case "rank":{
                    this.parseMatchRanks(data);
                    break;
                }
                case "update":{
                    this.parseUpDateMatchInfo(data);
                    break;
                }
                case "rise":{
                    this.parseRise(data);
                    break;
                }
                case "start":{
                    this.parseMatchStart(data);
                    break;
                }
                case "cancel":{
                    this.parseMatchCancel(data);
                    break;
                }
            }
        },

        /*
         公有数据+接口
         TODO:
         外部调用
         */
        /* 协议解析*/
        parseRoomFromMsg:function (_data) {
            var data = _data;
            if (!data){
                return;
            }

            if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(data)){
                return;
            }

            switch (data.action){
                case "match_des":{
                    //比赛详情
                    this.parseDes(data);
                    break;
                }
                case "signin":{
                    //比赛报名
                    this.parseSignin(data);
                    break;
                }
                case "wait":{
                    //开赛/晋级时主动通知前端
                    this.parseWait(data);
                    break;
                }
                case "match_real_rank":{
                    //实时晋级排名，牌桌上人物头像上的小旗子
                    this.parseRealRank(data);
                    break;
                }
                case "rank":{
                    //实时总排名，牌桌上右上角
                    this.parseRank(data);
                    break;
                }
                case "match_giveup":{
                    //退赛
                    this.parseGiveUp(data);
                    break;
                }
                case "over":{
                    //比赛结算
                    this.parseMatchOver(data);
                    break;
                }
                case "updateRoundCount":{
                    //比赛场次进度
                    this.parseMatchRoundCount(data);
                    break;
                }
                case "enter_queue": {
                    // 进入队列，牌桌开始匹配
                    this.parseEnterQueue(data);
                    break;
                }
                case "leave_queue": {
                    // 离开队列
                    this.parseLeaveQueue(data);
                    break;
                }
            }
        }
    }
})();