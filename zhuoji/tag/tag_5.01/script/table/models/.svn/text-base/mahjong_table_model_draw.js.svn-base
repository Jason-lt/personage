/*****************************************
 *  mahjong_table_model_draw.js
    (摸牌)牌桌相关model
 *  mahjong
 *
 *  Created by zengxx on 16-06-13
 *  
    协议说明：
    
    {
        "cmd": "send_tile",
        "result": {
            "seatId": 0,          // 目标座位号
            "action_id": 1,
            "timeout": 30,        // 出牌倒计时
            "remained_count": 83, // 剩余牌张数
            "tile": 24,           // 摸牌花色  
            "standup_tiles": [1,2,3,4,5], //手牌数据
            "peng_tiles": [1,2,3],//已碰牌数据 [1,1,1],[2,2,2],[3,3,3]
            "gang_tiles": [[1,1],[2,0]],//已杠牌数据 明杠1[1，1，1，1],暗杠0[2,2,2,2]
            "chi_tiles": [1,2,3], //已吃牌数据 [1,2,3],[2,3,4],[3,4,5]
            
            //可操作字段
            "win_degree":2,  //可以选择胡（自摸），番数2
            "gang_action": [
                  {
                    "tile": 5,
                    "pattern": [
                      1,
                      1,
                      1,
                      1
                    ],
                    "style": 0
                  },
                  {
                    "tile": 5,
                    "pattern": [
                      1,
                      1,
                      1,
                      12
                    ],
                    "style": 0
                  }
                ],
            "ting_action":[ 
                [ 3, [ [ 23, 5, 4 ], ... ] ] //打出牌3即可听牌，听牌23，也就是拿到23这张牌就胡了，胡5番数，23这张牌还剩余4张
            ], //可以选择听牌，

            "is_ting": 1, //是否听牌，1听牌，0或没有这个字段，没听牌
            "ting_tiles":[[22,5,2],[24,6,2]], //和ting字段配套出现

            //无效字段
            "chi_action":[0,1,2], //可以选择吃牌的方式 [24,25,26], [23,24,25], [22,23,24] PS：摸牌不可能吃，所以该协议这个字段无效
            "peng_action":24, //可以碰 [24,24,24] PS：摸牌不可能碰，所以该协议这个字段无效
            "trustee": 0, 托管标记，PS：托管有专门的协议处理，此字段只有tableinfo里断线重连时存在，所以该协议这个字段无效
        }
    }

    使用说明:

 */

guiyang.table.models.Draw = (function(){
    var GLOBAL_OBJ = guiyang;
    
    /*
    私有数据+接口
    TODO:
    数据的原型，存储以及通知的抛出
    */

    /* @数据缓存*/
    var CACHE             = {};
    var PROTOTYPE         = GLOBAL_OBJ.table.models.Prototype;

    /* @私有属性 */
    PROTOTYPE.setPrivateProperty(CACHE, "ready_hand_tiles", {}, "听牌之后的听牌信息，\
        也就是得到哪些牌就可以胡了 [[22, 5, 3],[]]  22 听胡的牌，5 番数 3 剩余张数");
    PROTOTYPE.setPrivateProperty(CACHE.ready_hand_tiles, 0, [], "每个玩家的数据");
    PROTOTYPE.setPrivateProperty(CACHE.ready_hand_tiles, 1, [], "每个玩家的数据");
    PROTOTYPE.setPrivateProperty(CACHE.ready_hand_tiles, 2, [], "每个玩家的数据");
    PROTOTYPE.setPrivateProperty(CACHE.ready_hand_tiles, 3, [], "每个玩家的数据");

    PROTOTYPE.setPrivateProperty(CACHE, "activeSeatId", -1, "摸牌玩家服务端座位号");
    PROTOTYPE.setPrivateProperty(CACHE, "style", 1, "默认明杠(服务器不带这个字段)");
    PROTOTYPE.setPrivateProperty(CACHE, "isReadyHand", 0, "打牌玩家是否听牌");
    PROTOTYPE.setPrivateProperty(CACHE, "tiles", [], "手牌信息");

    /* @共享属性 */
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TILE );
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TIME_OUT);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_ACTION_ID);

    /*
    摸牌时不可能有吃或者碰，但是有可能本家托管了，其他玩家打出一张牌，本家可以吃或者碰，但是托管时服务器代替本家立即做出选择
    不吃或碰（不通知客户端），且立即代替本家摸一张新牌，这个时候只要本家摸牌了，就代表不能出现吃碰杠面板了（其他玩家打牌时带来的信息），除非
    本协议还带了吃碰杠数据*/
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_CHOW);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_PONG);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_EXPOSED_KONG);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_CONCEALED_KONG);
    
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_WIN_POINTS);
    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_TING_ACTION);

    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_WIND_SEAT_ID);

    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_FAKE_MSG );

    PROTOTYPE.setShareProperty(CACHE, PROTOTYPE.KEYS.KEY_REMAINEDCOUNT);

    /* @数据通知*/
    var ___f_notificate = function(_object, _data, _slient){

        GLOBAL_OBJ.LOGD("table.models.Draw", "table.models.Draw.parse start;");
        if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
            return _slient;
        }
        
        var data               = _data;
        CACHE.activeSeatId     = data.seatId;
        //按座位号分类保存
        CACHE.ready_hand_tiles[ GLOBAL_OBJ.table.models.Draw.getActiveLocalSeatId() ] = data.ting_tiles;
        CACHE.isReadyHand      = data.is_ting;
        CACHE.tiles            = data.standup_tiles;
        CACHE.kou_tiles            = data.kou_tiles;
        CACHE.isTableRecord    = data.isTableRecord || false;
        /*
        important point 
        协议里其他玩家摸牌，居然没有tile这个字段，因为tile是共享存储，所以如果没有，就要给默认值0，否则给其他玩家发的牌都会赋值为
        本家的上一手牌的花色！！！！
        */
        data.tile              = data.tile || 0;

        //因为gang_action可能携带多个杠，不一定都是明杠
        var kong           = data.gang_action || [];
        for(var i in kong){
            var _currentKong=kong[i];
            if(_currentKong.style==1){
                //明杠
                data.exposed_kong   = data.exposed_kong || [];
                data.exposed_kong.push( _currentKong );
            }else if(_currentKong.style==0){
                //暗杠
                data.concealed_kong   = data.concealed_kong || [];
                data.concealed_kong.push( _currentKong );
            }else{
                hall.assert.true(false,"抓牌，杠牌出现了意外情况");
            }
        }

        var lsid = GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( data.seatId );

        //静态数据部分
        PROTOTYPE.parse(_object, CACHE, data);
        
        if (!_slient){
            GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_DRAW, data);
        }
        GLOBAL_OBJ.LOGD("table.models.Draw", "table.models.Draw.end;");
        return _slient;
    };

    return PROTOTYPE.functionsExt(CACHE, {
        _TAG:"table.models.Draw",

                /*
        公有数据+接口
        TODO:
        外部调用
        */
        /* 协议解析*/
        parse:function(_data, _slient){
            var data = _data;
            if (!data){
                return;  
            };
            return ___f_notificate(this, data, _slient);
        },

        /*
        激活model，发送一次数据
        返回值：false数据为空 */
        activate:function(){
            return false;
        },

        // 获得发牌玩家的 本地座位号
        getActiveLocalSeatId:function(){
            return GLOBAL_OBJ.table.utils.Seat.toLocalSeatId( CACHE.activeSeatId );
        },

        // 是否听牌
        isReadyHand:function(){
            return CACHE.isReadyHand;
        },
        
        getReadyHandTilesByLocalSeatId:function(_localSeatId){
            var data       = [];
            var readyHands = CACHE.ready_hand_tiles[_localSeatId] || [];
            for (var i = 0; i < readyHands.length; ++i){
                data.push({
                    "tile":readyHands[i][0],
                    "scoring":readyHands[i][1],
                    "lastCnt":readyHands[i][2],
                })
            }
            return data;
        },

        /*
         获取数据集合，牌桌“吃碰杠胡听面板”需要组合数据
         按照 从上到下从左到右的显示顺序是吃碰杠胡过
         */
        getMethods:function(){
            return GLOBAL_OBJ.table.models.Functions.optionPanelTranslation({
                ting            : this.getTingAction(),
                points          : this.getWinPoints(),
                exposed_kongs   : this.getExposedKong(4),
                concealed_kongs : this.getConcealedKong(4),
                pongs           : [],
                chows           : [],
                tile            : this.getTile()
            });
        },

        /*
        获得当前玩家的手牌信息（不包括发牌）*/
        getTiles:function(){
            CACHE.tiles.sort(function(a, b){ return a<b; });
            return CACHE.tiles;
        },

        getIsTableRecord:function(){
            return CACHE.isTableRecord;
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
                cmds = {"cmd":"send_tile","result":{"seatId":0, "timeout":12, "remained_count":55, "tile":5, "standup_tiles":[34,27,28,26,26,33,21,29,27,28,26,27,34],"peng_tiles":[],"gang_tiles":[],"action_id":0,"trustee":0,"win_action":0,"win_degree":0,"gang_action":[],"gameId":7}};
                break;
                case 1:
                cmds = {"cmd":"send_tile","result":{"seatId":1, "timeout":30,"remained_count":83, "action_id":1, "gameId":7}};
                break;
                case 2:
                cmds = {"cmd":"send_tile","result":{"seatId":2, "timeout":30,"remained_count":83, "action_id":1, "gameId":7}};
                break;
                case 3:
                cmds = {"cmd":"send_tile","result":{"seatId":3, "timeout":30,"remained_count":83, "action_id":1, "gameId":7}};
                break;
                case 4:
                //new 
                cmds = {"cmd":"send_tile","result":{"seatId":0, "tile":1, "peng_tiles": [1], 
                    "gang_action":[{"tile":1, "pattern":[1,1,1,1], "style":0}], "timeout":30,"remained_count":83, "action_id":1, "gameId":7}};
                break;
                case 5:
                //new 
                cmds = {"cmd":"send_tile","result":{"seatId":0, "tile":5, 
                    "gang_action":[{"tile":5, "pattern":[5,5,5,5], "style":1}], "timeout":30,"remained_count":83, "action_id":1, "gameId":7}};
                break;
                case 6:
                cmds = {"cmd":"send_tile","result":{"seatId":0, "tile":11, "timeout":30,"remained_count":83, "action_id":1, "gameId":7}};
                break;
                case 7:
                cmds = {"cmd":"send_tile","result":{"seatId":0, "tile":1, "peng_tiles": [], "gang_action":[1], "timeout":30,"remained_count":83, "action_id":1, "gameId":7}};
                break;
                case 8:
                cmds = {"cmd":"send_tile","result":{"seatId":0, "tile":2, "gang_tiles": [[1,0]], "gang_action":[], "timeout":30,"remained_count":83, "action_id":1, "gameId":7}};
                break;
                case 9:
                cmds = {"cmd":"send_tile","result":{"seatId":0, "tile":2, "ting_action":[[26,[[13,6,1],[18,2,2]]]], "timeout":30,"remained_count":83, "action_id":1, "gameId":7}};
                break;
                case 10:
                cmds = {"cmd":"send_tile","result":{"seatId":0, "tile":45, "flower_action":[[45, 42, 1]], "flower_tiles":[41,42,43,45], "timeout":30,"remained_count":83, "action_id":1, "gameId":7}};
                break;
                case 11:
                cmds = {"cmd":"send_tile","result":{"seatId":0,"timeout":12,"remained_count":117,"gameId":7}};
                break;
                case 12:
                cmds = {"cmd":"send_tile","result":{"seatId":1, "tile":32, "timeout":12,"remained_count":117,"gameId":7}};
                break;
                case 13:
                cmds = {"cmd":"send_tile","result":{"seatId":0,"timeout":30,"remained_count":116,"tile":4,"flower_tiles":[43],"standup_tiles":[17,26,14,24,18,27,37,29,36,33,33,24,23],"peng_tiles":[],"gang_tiles":[],"chi_tiles":[],"action_id":0,"trustee":0,"gameId":7}};
                break;
                case 14:
                //new 
                cmds = {"cmd":"send_tile","result":{"seatId":0, "tile":1, "peng_tiles": [1], 
                    "gang_action":[{"tile":1, "pattern":[1,1,1,1], "style":1}], "timeout":30,"remained_count":83, "action_id":1, "gameId":7}};
                break;
            };
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        }
    });
})();