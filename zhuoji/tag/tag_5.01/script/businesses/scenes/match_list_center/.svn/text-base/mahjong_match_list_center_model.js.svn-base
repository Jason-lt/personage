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

    GLOBAL_OBJ.businesses.scenes.MatchListCenter.Model = (function(){
        /*
         @数据缓存*/
        var CACHE = {
            list:{},     // 房间列表,key为room_id
            tabs:["all", "free", "hot"],      // 比赛列表分类 // all 全部赛事  free 免费赛事  hot 热门赛事
            tabList:{}  // 每个tab对应的比赛room列表，这里只存room_id
        };

        return {
            _TAG: 'GLOBAL_OBJ.businesses.scenes.MatchListCenter.Model',

            parse:function(_data){
                var data   = _data;
                var action = data["action"] || "";

                switch(action){
                    case "match_room_list":
                        this.parseRoomList(data);
                        break;
                    case "match_reward_list":
                        this.parseRewardList(data);
                        break;
                    case "majiang_match_info":  // 刷新单场比赛数据
                        // cc.log("---the step 0---\n"+GLOBAL_OBJ.bkernel.utils.GlobalTimer.getTime())
                        this.parseMatchInfo(data);
                        break;
                    case "match_update_played": // 老比赛 是不是第一局打一场比赛
                        this.parseMatchPlayed(data);
                        break;
                    case "match_room_list_remove": // 从列表中删除指定的比赛
                        this.parseRoomListRemove(data);
                        break;
                    case "temp_match_update": // 刷新人数
                        this.parseMatchUpdate(data);
                        break;
                    case "temp_match_state": // 比赛状态
                        this.parseMatchState(data);
                        break;
                    case "temp_match_signs": // 各个比赛报名状态
                        this.parseMatchSigns(data);
                        break;
                    default:
                        break;
                }
            },

            /*
             激活model，发送一次数据
             返回值：false数据为空
             */
            activate:function(){
                GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_ROOM_LIST,{});
            },

            /*
             外部获取数据接口
             */

            /* 比赛列表基础数据部分 */

            getMatchListCountByTabIndex:function(_tabIndex){
                if (CACHE.tabs[_tabIndex] != null &&  CACHE.tabList[CACHE.tabs[_tabIndex]] != null){
                    return CACHE.tabList[CACHE.tabs[_tabIndex]].length;
                }
                return 0;
            },

            getRoomIdByTabIndexAndCellIndex:function(_tabIndex, _cellIndex){
                var room = this.getMatchRoomByTabIndexAndCellIndex(_tabIndex, _cellIndex);
                if (room != null){
                    return room.room_id;
                }
                return -1;
            },

            // 底注类型
            getAnteTypeByTabIndexAndCellIndex:function(_tabIndex, _cellIndex){
                var room = this.getMatchRoomByTabIndexAndCellIndex(_tabIndex, _cellIndex);
                if (room != null){
                    return room.anteType;
                }
                return 1;
            },

            // 实物下载链接
            getUrlByTabIndexAndCellIndex:function(_tabIndex, _cellIndex){
                var room = this.getMatchRoomByTabIndexAndCellIndex(_tabIndex, _cellIndex);
                if (room != null){
                    return room.purl;
                }
                return "";
            },

            getNameByTabIndexAndCellIndex:function(_tabIndex, _cellIndex){
                var room = this.getMatchRoomByTabIndexAndCellIndex(_tabIndex, _cellIndex);
                if (room != null){
                    return room.title;
                }
                return "";
            },

            getPlayModeByTabIndexAndCellIndex:function(_tabIndex, _cellIndex){
                var room = this.getMatchRoomByTabIndexAndCellIndex(_tabIndex, _cellIndex);
                if (room != null){
                    return room.play_mode;
                }
                return "";
            },

            // 人数 mtt为报名人数 old为比赛进行中的人数
            getPersonByTabIndexAndCellIndex:function(_tabIndex, _cellIndex){
                var room = this.getMatchRoomByTabIndexAndCellIndex(_tabIndex, _cellIndex);
                if (room != null){
                    return room.nowPlayer;
                }
                return 0;
            },

            getStateByTabIndexAndCellIndex:function(_tabIndex, _cellIndex){
                var room = this.getMatchRoomByTabIndexAndCellIndex(_tabIndex, _cellIndex);
                if (room != null){
                    return room.match_state;
                }
                return 0;
            },

            // 比赛类型
            getMatchTypeByTabIndexAndCellIndex:function(_tabIndex, _cellIndex){
                var room = this.getMatchRoomByTabIndexAndCellIndex(_tabIndex, _cellIndex);
                if (room != null){
                    return room.match_type;
                }
                return 0;
            },

            getMatchTypeByRoomId:function(_roomId){
                var room = CACHE.list[_roomId];
                if (room != null){
                    return room.match_type;
                }
                return 0;
            },

            // 返回开赛时间戳
            getStartTimeByTabIndexAndCellIndex:function(_tabIndex, _cellIndex){
                var room = this.getMatchRoomByTabIndexAndCellIndex(_tabIndex, _cellIndex);
                if (room != null){
                    return room.start_ts;
                }
                return 0;
            },

            // 返回结束比赛时间戳 (老比赛)
            getEndTimeByTabIndexAndCellIndex:function(_tabIndex, _cellIndex){
                var room = this.getMatchRoomByTabIndexAndCellIndex(_tabIndex, _cellIndex);
                if (room != null){
                    return room.end_ts;
                }
                return 0;
            },

            // 参赛人数上限 (老比赛)
            getPersonLimitByTabIndexAndCellIndex:function(_tabIndex, _cellIndex){
                var room = this.getMatchRoomByTabIndexAndCellIndex(_tabIndex, _cellIndex);
                if (room != null){
                    return room.players[1] || 0;
                }
                return 0;
            },

            // 参赛条件 (老比赛)
            getConditionByTabIndexAndCellIndex:function(_tabIndex, _cellIndex){
                var room = this.getMatchRoomByTabIndexAndCellIndex(_tabIndex, _cellIndex);
                if (room != null){
                    return room.ticket;
                }
                return 0;
            },

            // 比赛时长
            getContinueTimeByTabIndexAndCellIndex:function(_tabIndex, _cellIndex){
                var room = this.getMatchRoomByTabIndexAndCellIndex(_tabIndex, _cellIndex);
                if (room != null){
                    return room.continue_time;
                }
                return 0;
            },

            // 报名费用
            getFeesByTabIndexAndCellIndex:function(_tabIndex, _cellIndex){
                var room = this.getMatchRoomByTabIndexAndCellIndex(_tabIndex, _cellIndex);
                if (room != null){
                    var str = "";
                    for (var i = 0; i < room.fees.length; i++){
                        str += (i>0?"+":"") + (room.fees[i]['num']>10000?room.fees[i]['num']/10000+"万":room.fees[i]['num']);
                    }
                    return str==""?"免费":str;
                }
                return "免费";
            },

            // 距离开始多少S以内可以报名，0表示没有限制
            getSigninCDByTabIndexAndCellIndex:function(_tabIndex, _cellIndex){
                var room = this.getMatchRoomByTabIndexAndCellIndex(_tabIndex, _cellIndex);
                if (room != null){
                    return room.signinCd;
                }
                return 0;
            },

            getSigninCDByRoomId:function(_roomId){
                var room = CACHE.list[_roomId];
                if (room != null){
                    return room.signinCd;
                }
                return 0;
            },

            // 请求比赛update的时间间隔
            getReqUpdateIntervalByRoomId:function(_roomId){
                var room = CACHE.list[_roomId];
                if (room != null){
                    return room.req_interval;
                }
                return 6;
            },

            getMatchIdByTabIndexAndCellIndex:function(_tabIndex, _cellIndex){
                var room = this.getMatchRoomByTabIndexAndCellIndex(_tabIndex, _cellIndex);
                if (room != null){
                    return room.match_id;
                }
                return 0;
            },

            getMatchIdByRoomId:function(_roomId){
                var room = CACHE.list[_roomId];
                if (room != null){
                    return room.match_id;
                }
                return null;
            },

            getMatchInstIdByRoomId:function(_roomId){
                var room = CACHE.list[_roomId];
                if (room != null){
                    return room.matchInstId;
                }
                return null;
            },

            // 是否报名
            hasSigninedByRoomId:function(_roomId){
                var room = CACHE.list[_roomId];
                if (room != null){
                    return room.hasSignined;
                }
                return 0;
            },

            // 已经玩了多少把(老比赛)
            getPlayCountByRoomId:function(_roomId){
                var room = CACHE.list[_roomId];
                if (room != null){
                    return room.play_count;
                }
                return 0;
            },

            // 是否已经打过了(老比赛)
            hasPlayedByRoomId:function(_roomId){
                var room = CACHE.list[_roomId];
                if (room != null){
                    return room.played;
                }
                return 0;
            },

            /* 奖励部分 */
            getRewardListCountByRoomId:function(_roomId){
                var room = CACHE.list[_roomId];
                if (room != null){
                    return room.award_detail.length;
                }
                return 0;
            },

            //
            getStartByRoomIdAndIndex:function(_roomId, _index){
                var room = CACHE.list[_roomId];
                if (room != null && room.award_detail[_index] != null){
                    return room.award_detail[_index].start;
                }
                return 0;
            },

            //
            getEndByRoomIdAndIndex:function(_roomId, _index){
                var room = CACHE.list[_roomId];
                if (room != null && room.award_detail[_index] != null){
                    return room.award_detail[_index].end;
                }
                return 0;
            },

            getDescByRoomIdAndIndex:function(_roomId, _index){
                var room = CACHE.list[_roomId];
                if (room != null && room.award_detail[_index] != null){
                    return room.award_detail[_index].desc;
                }
                return "";
            },

            /*
             辅助函数，都是私有接口
             */

            // 获取房间数据，主要给自己用
            getMatchRoomByTabIndexAndCellIndex:function(_tabIndex, _cellIndex){
                if (CACHE.tabs[_tabIndex] != null
                    && CACHE.tabList[CACHE.tabs[_tabIndex]] != null
                    && CACHE.tabList[CACHE.tabs[_tabIndex]][_cellIndex] != null
                    && CACHE.list[CACHE.tabList[CACHE.tabs[_tabIndex]][_cellIndex]] != null){
                    return CACHE.list[CACHE.tabList[CACHE.tabs[_tabIndex]][_cellIndex]];
                }
                return null;
            },

            // 排序
            sort:function(){
                // 生成临时tab列表
                var tempTabList = {};
                for (var key in CACHE.tabList){
                    tempTabList[key] = [];
                    for (var i = 0; i < CACHE.tabList[key].length; i++){
                        tempTabList[key].push(CACHE.tabList[key][i]);
                    }
                }

                for (var key in tempTabList){
                    for (var i = 0; i < tempTabList[key].length; i++){
                        for (var j = 0; j < tempTabList[key].length-i-1; j++){
                            var tempRoomL = CACHE.list[tempTabList[key][j]];
                            var tempRoomR = CACHE.list[tempTabList[key][j+1]];

                            if (tempRoomL["list_level"] < tempRoomR["list_level"]){
                                tempTabList[key][j] = tempTabList[key].splice(j+1, 1, tempTabList[key][j])[0];
                            }else if (tempRoomL["list_level"] == tempRoomR["list_level"]){
                                if (tempRoomL["start_ts"] > tempRoomR["start_ts"]){
                                    tempTabList[key][j] = tempTabList[key].splice(j+1, 1, tempTabList[key][j])[0];
                                }
                            }else{
                                // do nothing
                            }
                        }
                    }
                }
                CACHE.tabList = tempTabList;
            },

            // 删除比赛
            remove:function(_list){
                // 生成临时tab列表
                var tempTabList = {};
                for (var key in CACHE.tabList){
                    tempTabList[key] = [];
                    for (var i = 0; i < CACHE.tabList[key].length; i++){
                        tempTabList[key].push(CACHE.tabList[key][i]);
                    }
                }

                for (var i = 0; i < _list.length; ++i){
                    for (var key in tempTabList){
                        var index = tempTabList[key].indexOf(_list[i]);
                        if (index != -1){
                            tempTabList[key].splice(index, 1);
                        }
                    }
                }
                // cc.log("before remove "+JSON.stringify(CACHE.tabList))
                CACHE.tabList = tempTabList;
                // cc.log("after remove "+JSON.stringify(CACHE.tabList))
            },

            /*
             以下接口都是私有接口
             TODO:
             实现数据的组装&通知的抛出
             */
            parseRoomList:function(_data){
                var data = _data;
                if (data == null){
                    return ;
                }

                if (data.rooms != null){
                    CACHE.list = {};
                    CACHE.tabList = {};
                    for (var i = 0; i < data.rooms.length; ++i){
                        var room = {
                            "list_level"    :data.rooms[i].list_level || 0,     // 排序优先级
                            "anteType"      :data.rooms[i].anteType || 2,       // 底注类型 1 金币赛 2 积分赛
                            "tab"           :data.rooms[i].tab || ["all"],      // 比赛所属分类
                            "match_type"    :data.rooms[i].match_type || 1,     // 比赛类型 1 麻将老比赛, 2 麻将sng,3 麻将mtt
                            "purl"          :data.rooms[i].purl || "",          // 实物下载链接
                            "title"         :data.rooms[i].title || "",         // 比赛名称
                            "play_mode"     :data.rooms[i].play_mode,           // 玩法
                            "nowPlayer"     :data.rooms[i].nowPlayer || 0,      // 老比赛正在玩的人数，新比赛报名人数
                            "match_state"   :data.rooms[i].match_state || 0,    // 老比赛状态 0为未开赛,1为比赛中 2为等待比赛结束,3为比赛已结束,4比赛结果显示结束即将切到下一场比赛 mtt 0:比赛前 1:比赛中 2:配桌中
                            "start_ts"      :data.rooms[i].start_ts || 0,       // 开赛时间戳
                            "room_id"       :data.rooms[i].room_id || -1,
                            "end_ts"        :data.rooms[i].end_ts || 0,         // 比赛结束时间戳(老比赛)
                            "players"       :data.rooms[i].players || [0,0],    // 比赛人数上下限(老比赛)
                            "played"        :data.rooms[i].played || 0,         // 是否参加过本次比赛(老比赛)
                            "ticket"        :data.rooms[i].ticket || "",        // 比赛准入条件(老比赛)
                            "match_id"      :data.rooms[i].match_id,            // (老比赛)
                            "play_count"    :data.rooms[i].play_count || 0,     // 比赛已经进行的局数(老比赛)
                            "continue_time" :data.rooms[i].continue_time || 0,  // 比赛持续时间，单位s(新比赛)
                            "fees"          :data.rooms[i].fees || [],          // 比赛报名费用(新比赛)
                            "matchInstId"   :data.rooms[i].matchInstId,         // (新比赛)
                            "signinCd"      :data.rooms[i].signinCd || 0,       // 开赛前多少秒可以报名,0表示随时(新比赛)
                            "hasSignined"   :data.rooms[i].hasSignined || 0,    // 是否报名了次场比赛(新比赛)
                            "refresh_list"  :data.rooms[i].refresh_list || 0,   // 是否需要单独请求刷新本场比赛(新比赛)
                            "req_interval"  :data.rooms[i].req_interval || 6,   // 请求m_update时间间隔
                            "award_detail"  :[]                                 // 奖励详情，由奖励列表而来，每次获取奖励时生成，避免每次调用的时候重新计算{start:1,end:1,desc:""}
                        };

                        if (room.room_id != -1){
                            CACHE.list[room.room_id] = room;
                            for (var key in room.tab){
                                if (CACHE.tabList[room.tab[key]] == null){
                                    CACHE.tabList[room.tab[key]] = [];
                                }
                                CACHE.tabList[room.tab[key]].push(room.room_id);
                            }
                        }
                    }

                    this.sort();
                    GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_ROOM_LIST,{});
                }
            },

            parseRewardList:function(_data){
                var data = _data;
                if (data == null){
                    return ;
                }

                if (CACHE.list[data.room_id] != null){
                    CACHE.list[data.room_id].award_detail = [];
                    for (var i = 0; i < data.award_list.length; ++i){
                        var award = {};
                        if (data.award_list[i].award_list != null){ // 新比赛
                            award.start = data.award_list[i].start;
                            award.end   = data.award_list[i].end;
                            award.desc  = "";
                            for (var j = 0; j < data.award_list[i].award_list.length; ++j){
                                award.desc += (j>0?"+":"") + data.award_list[i].award_list[j]['name'] + "x" +
                                    (data.award_list[i].award_list[j]['num']>10000
                                        ?data.award_list[i].award_list[j]['num']/10000+"万"
                                        :data.award_list[i].award_list[j]['num']);
                            }
                        }else{ // 老比赛
                            award.start = i+1;
                            award.end   = i+1;
                            award.desc  = data.award_list[i].desc;
                        }
                        CACHE.list[data.room_id].award_detail.push(award);
                    }

                    GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_REWARD_LIST,{});
                }
            },

            parseMatchInfo:function(_data){
                var data = _data;
                if (data == null){
                    return ;
                }

                // cc.log("---the step 0-1---\n"+GLOBAL_OBJ.bkernel.utils.GlobalTimer.getTime()+"\n"+JSON.stringify(data)+"\n"+JSON.stringify(CACHE.list[data.room_id])+"\n-------------")
                if (CACHE.list[data.room_id] != null){
                    if (data.matchInstId != CACHE.list[data.room_id].matchInstId){
                        // cc.log("---the step 1---\n"+GLOBAL_OBJ.bkernel.utils.GlobalTimer.getTime())
                        CACHE.list[data.room_id].hasSignined = data.hasSignined!='undefined'?data.hasSignined:CACHE.list[data.room_id].hasSignined;
                        CACHE.list[data.room_id].match_state = data.match_state!='undefined'?data.match_state:CACHE.list[data.room_id].match_state;
                        CACHE.list[data.room_id].matchInstId = data.matchInstId || CACHE.list[data.room_id].matchInstId;
                        CACHE.list[data.room_id].start_ts    = data.start_ts || CACHE.list[data.room_id].start_ts;
                        CACHE.list[data.room_id].end_ts      = data.end_ts || CACHE.list[data.room_id].end_ts;
                        CACHE.list[data.room_id].played      = 0;

                        this.sort();
                        // cc.log("---the step 2---\n"+GLOBAL_OBJ.bkernel.utils.GlobalTimer.getTime())
                        GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_ROOM,{"roomId":data.room_id});
                    }else{ // 因为和服务器时间戳不同步，有偏差，有时候前端已经到了开赛时间但是服务器还没到，导致请求的还是当前场次比赛，使界面不刷新，所以再次请求
                        // cc.log("---the step 1-1---\n"+GLOBAL_OBJ.bkernel.utils.GlobalTimer.getTime())
                        GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_ROOM_REQUE,{"roomId":data.room_id});
                    }
                }
            },

            parseMatchPlayed:function(_data){
                var data = _data;
                if (data == null){
                    return ;
                }

                var roomId = data.roomId;
                if (CACHE.list[roomId] != null && data.played != null){
                    CACHE.list[roomId].played = data.played;
                }
            },

            parseRoomListRemove:function(_data){
                var data = _data;
                if (data == null){
                    return ;
                }

                // cc.log("remove data is "+JSON.stringify(data))
                if (data.remove_list != null && data.remove_list.length > 0){
                    this.remove(data.remove_list);
                    GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_ROOM_LIST,{});
                }
            },

            /*
             cmd非user的协议
             */
            parseMatchUpdate:function(_data){
                var data = _data;
                if (data == null){
                    return ;
                }

                var roomId = data.roomId;
                if (CACHE.list[roomId] != null && data.curPlayer != null){
                    CACHE.list[roomId].nowPlayer = data.curPlayer;
                    GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_UPDATE,{"roomId":data.roomId, "curPlayer":data.curPlayer});
                }
            },

            parseMatchState:function(_data){
                var data = _data;
                if (data == null){
                    return ;
                }

                var roomId = data.roomId;
                if (CACHE.list[roomId] != null && data.state != null){
                    CACHE.list[roomId].match_state = data.state;
                    GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_MATCH_STATE,{"roomId":data.roomId});
                }
            },

            parseMatchSigns:function(_data){
                // cc.log("fdskjfksdjflksdf "+JSON.stringify(_data))
                var data = _data;
                if (data == null){
                    return ;
                }

                if (data.signs != null){
                    for (var key in data.signs){
                        if (CACHE.list[key] != null){
                            CACHE.list[key].hasSignined = data.signs[key];
                        }
                    }
                    GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_LIST_CENTER_MATCH_SIGNS,{"roomId":data.roomId});
                }
            }
        }
    })();
})();

