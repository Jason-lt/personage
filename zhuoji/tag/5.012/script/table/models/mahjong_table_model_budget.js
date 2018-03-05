/*****************************************
 *  mahjong_table_model_budget_ii.js
    牌桌结算相关model
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-07-26
 *
    协议说明：
    对应 cmd：third_win
    结算第一条协议，（二人场例外，二人场收到的是third_win）
    使用说明:

 cmd: win
 result:{
        gameId: xxx,
        roomId: xxx,
        tableId: xxx,
        userId: xxx,
        seatId: xxx,
        banker: xxx,
        tile: xxxx,          胡的那张牌
        fanTile: xxx,      翻出的牌(捉鸡牌）
        realScore: xxx     实际输赢分数（输赢金币数，桌上的）
        curScore: xxx      结算后剩余金币数（当为0时代表破产）
        totalScore: xxx    输赢理论分数
        winScore: xxx      胡的分数
        douScore: xxx     豆的分数
        jiScore: xxxx        鸡的分数
        bFlow: 1    1代表流局。 默认发0
        fanPattern： [name,番数]  胡牌番型，最大胡牌番型  [‘平胡’,1]，['大对子’,5]，[‘清一色’,10]，
            [‘单吊’,10]， [‘双清’,20]（清一色单吊）[‘清大队’,15]，[‘七对’,10]，['龙七对’,20]，['清七对’,20]，[‘青龙背’,30]
        extPattern:  [[x,x]] [‘自摸’,1]，['杠上胡’,3]，[‘热跑’,1]，
            ['抢杠胡’,9]，[‘硬报’,20]，['杀硬报’,20]，[‘软报’,10], ['杀软报’,10]
        winMode: xxx    胡牌模式，0赢 -1输 -2点炮
        jiaoZui: xxx          叫嘴状态，0 未叫嘴， 1叫嘴
        mingDou: xxx      明豆个数
        menDou: xxx       闷豆个数
        zhuanWanDou: xxx   转弯豆个数
        chongFengJi: xx        冲锋鸡分数 有负数
        zeRenJi: xxx            责任鸡分数 有负数
        fanPaiJi: xxx        捉鸡个数
        puTongJi: xxx    普通鸡个数
        jinJi: xxx            金鸡个数
        wuGuJi: xxx       乌骨鸡个数
        bFlow:false       是否流局
        dianPaoSeatId:1  点炮

        absence:0

        timeStamp: xxxx 时间戳_
 */

guiyang.table.models.Budget  = (function(){
    var GLOBAL_OBJ = guiyang;

    /*
    私有数据+接口
    TODO:
    数据的原型，存储以及通知的抛出
    */

    /* @数据缓存*/
    var CACHE                  = {};
    var PROTOTYPE              = GLOBAL_OBJ.table.models.Prototype;
    var MODEL_TABLEINFO        = GLOBAL_OBJ.table.models.TableInfo;
    var GLOBAL_T               = GLOBAL_OBJ.table.global;
    var AUDIO                  = GLOBAL_OBJ.bkernel.utils.Audio;
    /* @私有属性 */
    // 国标
    // PROTOTYPE.setPrivateProperty(CACHE, 0,  {}, "0#座位（本地座位号）玩家");
    // PROTOTYPE.setPrivateProperty(CACHE, 1,  {}, "1#座位（本地座位号）玩家");
    // PROTOTYPE.setPrivateProperty(CACHE, 2,  {}, "2#座位（本地座位号）玩家");
    // PROTOTYPE.setPrivateProperty(CACHE, 3,  {}, "3#座位（本地座位号）玩家");

    for(var i = 0 ; i < 4 ; ++i){
        PROTOTYPE.setPrivateProperty(CACHE, i,  {}, i+"#座位（本地座位号）玩家");

        /*  国标区间 */
        PROTOTYPE.setPrivateProperty(CACHE[i], "userId",  0, "结算玩家uid");
        PROTOTYPE.setPrivateProperty(CACHE[i], "seatId",  -1, "结算玩家服务器座位号");
        PROTOTYPE.setPrivateProperty(CACHE[i], "winMode", -1, "赢的类型，0赢 -1输 -2点炮");
        PROTOTYPE.setPrivateProperty(CACHE[i], "timestamp", 0, "结算时间戳");

        PROTOTYPE.setPrivateProperty(CACHE[i], "banker", 0, "庄家seatId");
        PROTOTYPE.setPrivateProperty(CACHE[i], "fanTile", 0, "翻牌鸡翻出的牌");
        PROTOTYPE.setPrivateProperty(CACHE[i], "tile", 0, "胡的那张牌");
        PROTOTYPE.setPrivateProperty(CACHE[i], "realScore", 0, "实际输赢分数");
        PROTOTYPE.setPrivateProperty(CACHE[i], "curScore", -1, "结算后剩余的钱数");  // 等于 0 时代表破产
        PROTOTYPE.setPrivateProperty(CACHE[i], "totalScore", 0, "输赢理论分数");
        PROTOTYPE.setPrivateProperty(CACHE[i], "winScore", 0, "胡的分数");
        PROTOTYPE.setPrivateProperty(CACHE[i], "douScore", 0, "豆的分数");
        PROTOTYPE.setPrivateProperty(CACHE[i], "jiScore", 0, "鸡的分数");
        PROTOTYPE.setPrivateProperty(CACHE[i], "jiaoZui", -1, "是否叫嘴");
        PROTOTYPE.setPrivateProperty(CACHE[i], "mingDou", 0, "明豆");
        PROTOTYPE.setPrivateProperty(CACHE[i], "menDou", 0, "闷豆");
        PROTOTYPE.setPrivateProperty(CACHE[i], "zhuanWanDou", 0, "转弯豆");
        PROTOTYPE.setPrivateProperty(CACHE[i], "chongFengJi", 0, "冲锋鸡分数");
        PROTOTYPE.setPrivateProperty(CACHE[i], "zeRenJi:", 0, "责任鸡分数");
        PROTOTYPE.setPrivateProperty(CACHE[i], "fanPaiJi:", 0, "翻牌鸡");
        PROTOTYPE.setPrivateProperty(CACHE[i], "puTongJi:", 0, "普通鸡");
        PROTOTYPE.setPrivateProperty(CACHE[i], "jinJi:", 0, "金鸡");
        PROTOTYPE.setPrivateProperty(CACHE[i], "wuGuJi:", 0, "乌骨鸡");
        PROTOTYPE.setPrivateProperty(CACHE[i], "index:", 0, "该模块输赢排第几");
        PROTOTYPE.setPrivateProperty(CACHE[i], "bFlow:", false, "是否流局");
        PROTOTYPE.setPrivateProperty(CACHE[i], "dianPaoSeatId:", -1, "点炮seatId");


        PROTOTYPE.setPrivateProperty(CACHE[i], "gameFlow",  false,  "是否流局，输的时候才有效果");
        PROTOTYPE.setPrivateProperty(CACHE[i], "fanPattern", [], "胡牌所有的番型");
        PROTOTYPE.setPrivateProperty(CACHE[i], "extPattern", [], "额外番型");

        PROTOTYPE.setPrivateProperty(CACHE[i], "douAndJiScore", [], "豆分和鸡分");

        PROTOTYPE.setPrivateProperty(CACHE[i], "absence", 0, "缺牌");    //待确定,二丁拐,三丁拐中的字段

        // PROTOTYPE.setPrivateProperty(CACHE[i], "score", 0, "当前分");
        // PROTOTYPE.setPrivateProperty(CACHE[i], "deltaWinScore", 0, "输赢和牌分数");
        // PROTOTYPE.setPrivateProperty(CACHE[i], "awordTileScore", 0, "兑奖分");
        // PROTOTYPE.setPrivateProperty(CACHE[i], "total_delta_score", 0, "从开始到现在的总变化分");

        // PROTOTYPE.setPrivateProperty(CACHE[i], "loserFanPattern", [], "查花猪，查大叫，退税");
        //
        // PROTOTYPE.setPrivateProperty(CACHE[i], "gangScore", 0, "杠分");
        // PROTOTYPE.setPrivateProperty(CACHE[i], "awordTileScores", 0, "总计");
        //
        //
        // PROTOTYPE.setPrivateProperty(CACHE[i], "winNum", 0, "血战麻将特有字段，表明是第几个胡牌的");
        // PROTOTYPE.setPrivateProperty(CACHE[i], "hideTiles", 0, "hideTiles且hideTiles为1，则表明扣下手牌");
        PROTOTYPE.setPrivateProperty(CACHE[i], "multiWinTiles", [], "一炮多响牌的index");
        PROTOTYPE.setPrivateProperty(CACHE[i], "isReconnect", 0, "有这个字段且字段值为1，表明玩家重连");
        // PROTOTYPE.setPrivateProperty(CACHE[i], "todo", [], "控制结算按钮显示哪个");
        //
        // PROTOTYPE.setPrivateProperty(CACHE[i], "roofReal", 0, "封顶0,金顶1,阳光顶2,光明顶3");
    }

    PROTOTYPE.setPrivateProperty(CACHE, "currentSeatId",  -1, "当前最新的结算玩家服务器座位号，用来定位最新的一条协议来自谁");

    /* @共享属性 */
    // PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_CURRENT_BUDGET_SEATID );

    /* @数据通知*/
    var ___f_notificate00   = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        }

        // GLOBAL_OBJ.LOGD("结算界面数据显示   =", JSON.stringify(_data));
        var data                 = _data;

        var localSeatId          = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( data.seatId );

        CACHE.currentCount                    = CACHE.currentCount || 0;
        CACHE[localSeatId].userId             = data.userId;
        CACHE[localSeatId].seatId             = data.seatId;
        CACHE[localSeatId].winMode            = data.winMode;
        CACHE[localSeatId].timestamp          = data.timestamp;
        CACHE[localSeatId].banker             = data.banker;

        CACHE[localSeatId].fanTile            = data.fanTile;
        CACHE[localSeatId].tile               = data.tile;
        CACHE[localSeatId].realScore      = data.realScore;
        CACHE[localSeatId].curScore           = data.curScore;
        CACHE[localSeatId].totalScore         = data.totalScore;
        CACHE[localSeatId].winScore           = data.winScore;
        CACHE[localSeatId].douScore           = data.douScore;

        //
        CACHE[localSeatId].jiScore            = data.jiScore;


        CACHE[localSeatId].jiaoZui            = data.jiaoZui;
        CACHE[localSeatId].mingDou            = data.mingDou;
        CACHE[localSeatId].menDou             = data.menDou;
        CACHE[localSeatId].zhuanWanDou        = data.zhuanWanDou;
        CACHE[localSeatId].chongFengJi        = data.chongFengJi;
        CACHE[localSeatId].zeRenJi            = data.zeRenJi;
        CACHE[localSeatId].fanPaiJi             = data.fanPaiJi;
        CACHE[localSeatId].puTongJi           = data.puTongJi;
        CACHE[localSeatId].jinJi              = data.jinJi;
        CACHE[localSeatId].wuGuJi             = data.wuGuJi;
        CACHE[localSeatId].fanPattern             = data.fanPattern;
        CACHE[localSeatId].extPattern             = data.extPattern;
        CACHE[localSeatId].index              = -1;
        //CACHE[localSeatId].awordTileScores    = data.awordTileScores;//小结算总计
        CACHE[localSeatId].bFlow              = data.bFlow;
        CACHE[localSeatId].dianPaoSeatId      = data.dianPaoSeatId;
        CACHE[localSeatId].absence            = data.absence;

        CACHE[localSeatId].multiWinTiles = []

        if (null != data.tilesInfo) {
            CACHE[localSeatId].tiles              = data.tilesInfo.tiles;
            CACHE[localSeatId].tiles.sort(function(a,b){ return a < b; });
            CACHE[localSeatId].chow               = data.tilesInfo.chi;
            CACHE[localSeatId].pong               = data.tilesInfo.peng;
            CACHE[localSeatId].kong               = data.tilesInfo.gang;
            CACHE[localSeatId].gangFromSeat       = data.tilesInfo.gangFromSeat;
            //CACHE[localSeatId].tile               = data.tilesInfo.tile;
            CACHE[localSeatId].win_tiles          = data.tilesInfo.win_tiles || [];
        }

        CACHE.currentSeatId             = data.seatId;

        // GLOBAL_OBJ.LOGD("服务器座位号:", data.seatId);
        // GLOBAL_OBJ.LOGD("本地座位号:", localSeatId);
        // GLOBAL_OBJ.LOGD("本地玩家数据:", JSON.stringify(data));

        //四人 horseResult: [1, [[4,1,5,0], [21,0], [18,1], [36,0]],[256, 256, -256, -256]]  这是原始信息，要解析的解析
        //自摸 horseResult: [2, [4,0, 21,1], [256, 256, -256, -256]] 这是原始信息，要解析的解析

        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);

        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_BUDGET, data);
        }

        return _slient
    };

    var ___f_notificate01   = function(_object, _data, _slient){
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        }

        return _slient
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.Budget",

                /*
        公有数据+接口
        TODO:
        外部调用
        */
        /* 协议解析*/
        parse:function(_data, _slient){
            var data = _data;
            //GLOBAL_OBJ.LOGD("mahjong_table_model_budget.js","parse data：" + JSON.stringify(data));
            if (!data){
                return;
            }
            return ___f_notificate00(this, data, _slient);
        },

        /* 自建桌 投票离桌后 弹出的结算页面 */
        parseVote:function(_data, _slient){
            var data = _data;
            if (!data){
                return;
            }
            return ___f_notificate01(this, data, _slient);
        },

        /*
        激活model，发送一次数据
        返回值：false数据为空 */
        activate:function(){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_BUDGET, {});
            return false;
        },

        /*
        胡牌玩家userid
        */
        getUserId:function(_localSeatId){
            return CACHE[_localSeatId].userId;
        },

        /*
        @获得当前协议中的玩家的本地座位号*/
        getCurrentLocalSeatId:function(){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.currentSeatId );
        },

        /*
        获得胡牌玩家的 本地座位号*/
        getActiveLocalSeatId:function(_localSeatId){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE[_localSeatId].seatId );
        },

        /*
         是否是点炮玩家*/
        isDianPaoPlayer:function(_localSeatId){
            return CACHE[_localSeatId].dianPaoSeatId == CACHE[_localSeatId].seatId;
        },

        /*
        获取手牌数量*/
        getTilesCount:function(_localSeatId){
            return CACHE[_localSeatId].tiles.length;
        },

        // 获取 手牌 花色
        getTileByIndex:function(_localSeatId, _index){
            return CACHE[_localSeatId].tiles[_index];
        },

        /*
        获得胡牌的花色*/
        getWinTile:function(_localSeatId){
            return CACHE[_localSeatId].tile;
        },

        /*
         获得胡牌的花色，这里是个数组，因为血流可以胡多张牌*/
        getWinTiles:function(_localSeatId){
            return CACHE[_localSeatId].win_tiles;
        },

        /*
         获得win_tiles和牌数组中一炮多响牌的index*/
        getMultiWinTiles:function (_localSeatId) {
            return CACHE[_localSeatId].multiWinTiles;
        },

        /*
         获得牌局结束后的其他玩家手牌*/
        getStandUpTiles:function(_localSeatId){
            return CACHE[_localSeatId].tiles;
        },

        //判断当前结算是否是属于自建桌。
        isNormalTable:function(_localSeatId){
            return CACHE[_localSeatId].isNormalTable||false;
        },

        /*
        返回当前所有的吃牌(完整)数组
        chowTranslation 返回的是一个安全的二维数组*/
        getChowed:function(_localSeatId){
            return CACHE[_localSeatId].chow;
        },

        /*
        返回当前所有的碰牌(完整)数组
        pongTranslation 返回的是一个安全的二维数组*/
        getPonged:function(_localSeatId){
            return  CACHE[_localSeatId].pong;
        },

        /*
        返回当前所有的杠牌(完整)数组
        pongTranslation 返回的是一个安全的对象{style:0, tiles:[0,0,0,0]}*/
        getKonged:function(_localSeatId){
            var kongs = [];
            for(var i in CACHE[_localSeatId].kong){
                GLOBAL_OBJ.LOGD(this._TAG,"CACHE[_localSeatId].kong ["+i+"] ");
                kongs.push(
                    GLOBAL_OBJ.table.models.Functions.kongTranslation(
                        [ CACHE[_localSeatId].kong[i] ],
                        CACHE[_localSeatId].kong[i].style == 1 ?
                            GLOBAL_OBJ.table.global.METHODS.EXPOSED_KONG
                            :
                            GLOBAL_OBJ.table.global.METHODS.CONCEALED_KONG,
                        4
                    )[0] || {}
                );
            }
            return kongs;
        },

        /*
         获取当前明杠牌来自谁
         "gangFromSeat":[{"tile":2,"playerSeatId":3},{"tile":21,"playerSeatId":2}]*/
        getKongedSeatId:function(_localSeatId,tile){
            GLOBAL_OBJ.LOGD(this._TAG,"getKongedSeatId _localSeatId = " + _localSeatId);
            GLOBAL_OBJ.LOGD(this._TAG,"getKongedSeatId tile = " + tile);
            //GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE[_localSeatId].seatId );

            var kongList = CACHE[_localSeatId].gangFromSeat;
            if(kongList.length <= 0) {
                return -1;
            }
            for(var i in kongList) {
                if(kongList[i].tile == tile) {
                    //补杠,获取当前杠牌就来自于自己;  当前状态没有区分明杠和补杠,这里自行判断一下;
                    var _playerSeatId = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( kongList[i].playerSeatId );
                    if(_localSeatId != _playerSeatId) {
                        return _playerSeatId;
                    }else {
                        return -1;
                    }
                }
            }
            return -1;
        },

        getKongedFromPos:function(_localSeatId,tile){
            var _seatId = this.getKongedSeatId(_localSeatId,tile);
            GLOBAL_OBJ.LOGD(this._TAG,"getKongedFromPos _seatId = " + _seatId);
            if (_seatId < 0) {
                return;
            }
            var str = "";
            switch(_seatId){
                case GLOBAL_T.SEATS.N0:
                    str = "自己"
                    break;
                case GLOBAL_T.SEATS.N1:
                    str = "下家"
                    break;
                case GLOBAL_T.SEATS.N2:
                    str = "对家"
                    break;
                case GLOBAL_T.SEATS.N3:
                    str = "上家"
                    break;
                default:
                    str = "";
            }
            GLOBAL_OBJ.LOGD(this._TAG,"getKongedFromPos str = " + str);
            return str;
        },


        // 获取时间戳
        getTimeStamp:function(_localSeatId)
        {
            return CACHE[_localSeatId].timestamp || 0;
        },

        /*
        获取当前玩家真实输赢钱数*/
        getrealScore:function(_localSeatId){
            return CACHE[_localSeatId].realScore || 0;
        },

        /*
         获取转弯豆*/
        getZhuanWAnDou:function(_localSeatId){
            return CACHE[_localSeatId].zhuanWanDou || 0;
        },

        /*
         获取闷豆*/
        getMenDou:function(_localSeatId){
            return CACHE[_localSeatId].menDou || 0;
        },
        /*
         获取明豆*/
        getMingDouWin:function(_localSeatId){
            return CACHE[_localSeatId].mingDou[0] || 0;
        },

        /*
         获取明豆*/
        getMingDouLose:function(_localSeatId){
            return CACHE[_localSeatId].mingDou[1] || 0;
        },

        /*
         获取冲锋鸡分数*/
        getChongFengJi:function(_localSeatId){
            return CACHE[_localSeatId].chongFengJi || 0;
        },

        /*
         获取责任鸡分数*/
        getZeRenJi:function(_localSeatId){
            return CACHE[_localSeatId].zeRenJi || 0;
        },
        /*
         获取普通鸡分数*/
        getPuTongJi:function(_localSeatId){
            return CACHE[_localSeatId].puTongJi || 0;
        },
        /*
         获取金鸡分数*/
        getJinJi:function(_localSeatId){
            return CACHE[_localSeatId].jinJi || 0;
        },


        /*
         获取当前玩家是否存在金鸡*/
        isHaveJinJi:function(_localSeatId){
            return this.getJinJi(_localSeatId) != 0;
        },
        /*
         获取乌骨分数*/
        getWuGuJi:function(_localSeatId){
            return CACHE[_localSeatId].wuGuJi || 0;
        },

        /*
         缺牌*/
        getAbsence:function(_localSeatId){
            return CACHE[_localSeatId].absence || 0;
        },


        /*
         根据 totalScore 设置每个玩家的index(排序)*/
        getPlayerIndex:function(){
            var playerLength=0;
            var playerTotalScore = []
            for(var pl in CACHE){
                playerLength++;
            }
            GLOBAL_OBJ.LOGD("mahjong_table_model_budget.js","getPlayerIndex playerLength:" + playerLength);
            for (var i = 0; i < playerLength; ++i)
            {
                if (null != CACHE[i] && CACHE[i].seatId >= 0){
                    playerTotalScore.push(CACHE[i].winScore)
                }
            }
            playerTotalScore.sort(function(a,b){ return a < b; });
            GLOBAL_OBJ.LOGD("mahjong_table_model_budget.js","getPlayerIndex playerTotalScore:" + JSON.stringify(playerTotalScore));
            var ___find_index___  = function(_index,_index_list){
                for (var i = 0; i < _index_list.length; ++i){
                    if (_index == _index_list[i]){
                        return true
                    }
                }
                return false
            };

            var index_list = [];
            for(var pl in CACHE){
                for (var i = 0; i < playerTotalScore.length; i++){
                    if (CACHE[pl].index == -1 && CACHE[pl].seatId >= 0 && CACHE[pl].winScore == playerTotalScore[i]){
                        if (___find_index___(i,index_list) == false){
                            CACHE[pl].index = i;
                            index_list.push(i)
                            GLOBAL_OBJ.LOGD("mahjong_table_model_budget.js","getPlayerIndex pl:" + pl +" index"+i);
                            break;
                        }
                    }
                }
            }
        },

        getIndex:function(_localSeatId){
            return CACHE[_localSeatId].index;
        },

        /*
         结算时剩余的钱数   等于 0 时破产*/
        getcurScore:function(_localSeatId){
            return CACHE[_localSeatId].curScore;
        },

        /*
         获取是否叫嘴   0是未叫嘴  1是叫嘴 */
        getIsJiaoZui:function(_localSeatId){
            var winmode = this.getWinMode(_localSeatId);
            isWin = winmode > -1;
            if (isWin){
                //赢家叫嘴情况无意义
                GLOBAL_OBJ.LOGD("mahjong_table_model_budget.js","getIsJiaoZui isWin:");
                return -1
            }else {
                GLOBAL_OBJ.LOGD("mahjong_table_model_budget.js","getIsJiaoZui CACHE[_localSeatId].jiaoZui:"+CACHE[_localSeatId].jiaoZui);
                return CACHE[_localSeatId].jiaoZui;
            }
        },

        /*
         是否是庄家 */
        getIsBanker:function(_localSeatId){
            return CACHE[_localSeatId].banker == CACHE[_localSeatId].seatId;
        },
        /*
         获得翻牌鸡 */
        getFanPaiJi:function(_localSeatId){
            //加层保护,防止发过来的消息fanTile = 0,fanPaiJi > 0
            if (CACHE[_localSeatId].fanTile > 0) {
                return CACHE[_localSeatId].fanPaiJi;
            }
            return 0;
        },

        /*
         获得翻牌鸡tile */
        getFanTile:function(_localSeatId){
            return CACHE[_localSeatId].fanTile || 0;
        },

        /*
         获得翻牌鸡加一后的值*/
        getaddFanTile:function(_localSeatId){
            if(CACHE[_localSeatId].fanTile > 0){
                var addFanTile = CACHE[_localSeatId].fanTile;
                ++addFanTile;
                if (addFanTile%10 == 0){
                    addFanTile = addFanTile - 9;
                }
                return addFanTile;
            }else {
                return 0;
            }
        },

        /*
        获得番型数组 数量 */
        getFanPatternCount:function(_localSeatId){
            return CACHE[_localSeatId].fanPattern.length;
        },

        /*
         获得番型数组  */
        getFanPattern:function(_localSeatId){
            GLOBAL_OBJ.LOGD("mahjong_table_model_budget.js","  fanPattern = " + JSON.stringify(CACHE[_localSeatId].fanPattern) );
            return CACHE[_localSeatId].fanPattern;
        },

        /*
         获得额外番型数组 数量 */
        getExtPattern:function(_localSeatId){
            return CACHE[_localSeatId].extPattern;
        },

        /*
         庄闲、番型、额外番数、 (这里主要是番型 额外番型)*/
        getAllFanXingScore:function(_localSeatId){
            var fanXing = [];
            var fanPattern = this.getFanPattern(_localSeatId);
            var extPattern = this.getExtPattern(_localSeatId);
            if (fanPattern.length > 0){
                //fanXing.push(JSON.stringify(fanPattern[0]));
                fanXing.push(fanPattern[0].toString());
            }
            if (extPattern.length > 0){
                for (var i = 0; i < extPattern.length; ++i){
                    //fanXing.push(JSON.stringify(extPattern[i][0]));
                    fanXing.push(extPattern[i][0].toString());
                }
            }
            return fanXing
        },
        /*
         庄闲、番型、额外番数、1:转弯豆、2:明豆正分、3:明豆负分、4:闷豆、5:冲锋 6:责任鸡、7:缺、8:普通鸡、9:翻牌鸡、 10:金鸡、 (这里主要是豆 鸡)*/
        getAllDouAndJi:function(_localSeatId){
            var douAndJi = [];
            if (this.getZhuanWAnDou(_localSeatId) != 0){
                douAndJi.push([1,this.getZhuanWAnDou(_localSeatId)]);
            }
            if (this.getMingDouWin(_localSeatId) != 0){
                douAndJi.push([2,this.getMingDouWin(_localSeatId)]);
            }
            if (this.getMingDouLose(_localSeatId) != 0){
                douAndJi.push([3,this.getMingDouLose(_localSeatId)]);
            }
            if (this.getMenDou(_localSeatId) != 0){
                douAndJi.push([4,this.getMenDou(_localSeatId)]);
            }
            if (this.getChongFengJi(_localSeatId) != 0 ){
                douAndJi.push([5,this.getChongFengJi(_localSeatId)]);
            }
            if (this.getZeRenJi(_localSeatId) != 0){
                douAndJi.push([6,this.getZeRenJi(_localSeatId)]);
            }
            if (this.getAbsence(_localSeatId) != 0){
                douAndJi.push([7,this.getAbsence(_localSeatId)]);
            }
            if (this.getPuTongJi(_localSeatId) != 0){
                if (this.isHaveJinJi(_localSeatId) != true) {
                    douAndJi.push([8,this.getPuTongJi(_localSeatId)]);
                }
            }
            if (this.getFanPaiJi(_localSeatId) != 0){
                if (this.isHaveJinJi(_localSeatId) != true) {
                    douAndJi.push([9,this.getFanPaiJi(_localSeatId)]);
                }
            }
            if (this.getJinJi(_localSeatId) != 0){
                douAndJi.push([10,this.getJinJi(_localSeatId)]);
            }
            return douAndJi
        },

        /*
        获取赢的方式 0赢 -1输 -2点炮  (>-1  赢)*/
        getWinMode:function(_localSeatId){
            return CACHE[_localSeatId].winMode;
        },

        /*
        获取流局信息*/
        getGameFlow:function(_localSeatId){
            return CACHE[_localSeatId].bFlow || false;
        },


        getIsReconnect:function(_localSeatId)//有这个字段且字段值为1，表明玩家重连
        {
            return CACHE[_localSeatId].isReconnect || 0;
        },

        dealWithWinModeInPatterns:function ( _localSeatId, _dahuPattern ) {
            var fanPattern = [];
            var extPattern = [];
            if(_dahuPattern && _dahuPattern.length > 0){
                fanPattern = _dahuPattern;
            }else{
                fanPattern = this.getFanPattern(_localSeatId);
            }
            extPattern = this.getExtPattern(_localSeatId);

            var fanshu = [['平胡',1],['大对子',5],['清一色',10],['单吊',10], ['双清',20],['清大对',15],['七对',10],
                ['龙七对',20],['清七对',20],['青龙背',30],['自摸',1],['杠上胡',3],['热炮',1],
                ['抢杠胡',9],['硬报',20],['杀硬报',20],['软报',10], ['杀软报',10],['一炮多响',0]];
            //因为番型动画最后播放的特效是由前端根据胡型（可能多种）来得出播放哪种特效的，所以如果服务器增加胡型，这里也要添加
            var localPattern = [
                "平胡","大对子","清一色","单吊","双清","清大对",
                "七对","龙七对","清七对","青龙背","自摸","杠上胡",
                "热炮","抢杠胡","硬报",
                "杀硬报","软报","杀软报","一炮多响"
            ];

            var bestUpPatt = "平胡";
            if (fanPattern.length > 0){
                bestUpPatt = fanPattern[0];
            }
            var isFind = false;
            var exparr = "平胡";
            for (var i = 0; i < localPattern.length; i++) {
                for (var j =0; j < extPattern.length; j++) {
                    if (localPattern[i] == extPattern[j][0]) {
                        exparr = localPattern[i];
                        isFind = true;
                        break;
                    }
                }
                if (isFind) {
                    break;
                }
            }
            var exparrFanshu = 0;
            var bestUpPattFanshu = 0;
            for (var i = 0; i < fanshu.length; i++) {
                if (fanshu[i][0] == exparr){
                    exparrFanshu = fanshu[i][1]
                }
                if (fanshu[i][0] == bestUpPatt){
                    bestUpPattFanshu = fanshu[i][1]
                }
            }

            if (exparrFanshu > bestUpPattFanshu){
                bestUpPatt = exparr
            }

            var sound_ccb = {};
            sound_ccb.sound = "win";
            sound_ccb.ccb = GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_H_CCBI;

            if ("平胡" == bestUpPatt) {
                sound_ccb.ccb = GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_PH_CCBI;
            }
            else if ("七对" == bestUpPatt){
                sound_ccb.ccb = GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_7D_CCBI;
            }
            else if ("清一色" == bestUpPatt) {
                sound_ccb.ccb = GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_QYS_CCBI;
            }
            else if ("地胡" == bestUpPatt) {
                sound_ccb.ccb = GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_DH_CCBI;
            }
            else if("天胡" == bestUpPatt){
                sound_ccb.ccb = GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_TH_CCBI;
            }
            else if ("自摸" == bestUpPatt) {
                sound_ccb.ccb = GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_ZIMO_CCBI;
            }
            else if ("抢杠胡" == bestUpPatt) {
                sound_ccb.ccb = GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_QGH_CCBI;
            }
            else if ("清七对" == bestUpPatt) {
                sound_ccb.ccb = GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_Q7D_CCBI;
            }else if ("龙七对" == bestUpPatt) {
                sound_ccb.ccb = GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_L7D_CCBI;
            }else if ("清龙七对" == bestUpPatt) {
                sound_ccb.ccb = GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_QL7D_CCBI;
            }else if ("清对" == bestUpPatt) {
                sound_ccb.ccb = GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_QD_CCBI;
            }
            return sound_ccb;
        },

        getPatternCCBByWinMode:function (_winMode) {
            var tx_ccb = "";
            if (_winMode == 0) { // 胡
                tx_ccb = GLOBAL_OBJ.RES.XZ_ZM_TX_PXTX_H_CCBI;
            }
            return tx_ccb;
        },

        /*
        测试用例
        TODO:
        model测试用例
        */
        test:function(_index){
            var cmds = {};
            switch(_index){
                case 0:
                break;
            }

            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        }
    });
})();
