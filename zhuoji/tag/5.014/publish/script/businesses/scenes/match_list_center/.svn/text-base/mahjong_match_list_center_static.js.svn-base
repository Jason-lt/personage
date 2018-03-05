/*****************************************
 *  mahjong_plugin_hall_static.js
    比赛列表中心里用到的静态共享数据
 *  mahjong
 *
 *  Created by zengxx on 16-03-26
 *  特殊说明：
 */

(function(){

    var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.businesses.scenes.MatchListCenter.static = {
		_TAG: 'GLOBAL_OBJ.businesses.scenes.MatchListCenter.static',
        
        index:0,

        /*
        @比赛类型*/
        MATCHTYPE:{
            OLD        : 1,       // 老比赛
            SNG        : 2,       // sng
            MTT        : 3        // mtt
        },

        /*
        @比赛规则*/
        HELP:{
            "old":[{"type":"title","content":"基本规则:"},{"type":"content","content":"1、玩家每局中赢得的金币数即为本局获得的积分，若在本局中没有赢得金币数，则积分为0，积分之和作为本场比赛积分。\n2、比赛结束时按积分多少排序，积分最多的玩家为冠军。"},{"type":"title","content":"报名规则:"},{"type":"content","content":"所有符合报名条件的用户均可报名本比赛。"},{"type":"title","content":"奖励规则:"},{"title":"content","content":"比赛结束之后，虚拟奖品将直接发到玩家账户，获取记录可以在“我的消息“中查看。"}],
            "mtt":[{"type":"title","content":"基本规则:"},{"type":"content","content":"1、所有玩家加入比赛后初始积分均为固定值，根据结算时的番数和底注结算积分。\n2、若玩家积分小于等于0或低于淘汰基数，则该玩家被淘汰。\n3、比赛结束时按积分多少排序，积分最多的玩家为冠军。"},{"type":"title","content":"报名规则:"},{"title":"content","content":"1、所有符合报名条件的用户均可报名本比赛。\n2、如果游戏人数达到最大人数，则不能报名。"},{"type":"title","content":"奖励规则:"},{"title":"content","content":"比赛结束之后，虚拟奖品将直接发到玩家账户，获取记录可以在“我的消息“中查看。"}]
        },

        /*
         @比赛状态*/
        MATCHSTATE:{
            BeforeMatch     : 0,  // 比赛前
            DurationOfMatch : 1,  // 比赛中
            WaittingMatch   : 2,  // 配桌中(老比赛为 等待比赛结束)
            MatchEnd        : 3   // 比赛结束(新比赛没啥用)
        },

        /*
        @比赛玩法*/
        PLAYMODE:{
            SiChuan             : 'sichuan',            // 四川
            GuoBiao             : 'guobiao',            // 国标
            GuoBiaoMatch        : 'guobiaomatch',       // 国标比赛
            GuoBiao1v1          : 'guobiao2ren',        // 二人国标
            GuoBiao1v1Match     : 'guobiao2renmatch',   // 二人国标比赛
            HaErBin             : 'harbin',             // 哈尔滨
            XueLiuChengHe       : 'sichuan_xlch',       // 血流成河
            SiChuanDq           : 'sichuan_dq'          // 有定缺步骤的四川麻将
        },

        /*
        @底注类型*/
        ANTETYPE:{
            COIN       : 1,       // 金币赛
            SCORE      : 2        // 积分赛
        },

		/*
        @点击响应*/
        CLICK:{
        	back:function(){
        		GLOBAL_OBJ.LOGD(this._TAG,"比赛列表中心返回大厅");

                AUDIO.audio(GLOBAL_OBJ.RES.UI_CLICKBUTTON_MP3);
        		GLOBAL_OBJ.SceneManager.closeMsgTips();

		        var enterType = GLOBAL_OBJ.GlobalVars.getEnterType();
		        if (enterType == hall.Enums.GAMESLOT.ROOMLIST || enterType == hall.Enums.GAMESLOT.QUICKSTART) {
		            GLOBAL_OBJ.LOGD(this._TAG, "return to hall scene");
		            GLOBAL_OBJ.interface.backHall(this);
		            GLOBAL_OBJ.GlobalVars.setPluginGameType(""); // modify by zengxx  正常返回的时候清除插件标记
		        }else {
		            if(GLOBAL_OBJ.GlobalVars.isAsPlugin()){
			            GLOBAL_OBJ.SceneManager.runHallPluginScene();
			        }else{
			            GLOBAL_OBJ.SceneManager.runHallScene();
			        }
		        }
        	},

  			addCoin:function(){
  				GLOBAL_OBJ.LOGD(this._TAG,"接入大厅商城入口");
  				hall.MsgFactory.getQuickBuyInfo();
  			},

            enterGame:function(_param){
                GLOBAL_OBJ.LOGD(this._TAG,"老比赛加入比赛或回到比赛");

                switch(_param.matchState){
                    case GLOBAL_OBJ.businesses.scenes.MatchListCenter.static.MATCHSTATE.DurationOfMatch:
                        GLOBAL_OBJ.gConsoleRemote.requestStart(_param.playMode, GLOBAL_OBJ.TableType.Normal, true, true, _param.roomId);
                        break;
                    default:
                        var params = {
                            txt                 : GLOBAL_OBJ.STRING.MJ_MJC_QUESHEN_HALL_STRING_1003,
                            duration            : 1,
                            onTimeOutCallback   : null,
                            onTimeOutTarget     : null
                        };
                        GLOBAL_OBJ.SceneManager.showMsgTips('MsgBox', params);

                        break;
                }
            }
        },

        /*
        @添加子节点*/
        CHILD:{
        	led:function(_obj, _ledNode){
        		GLOBAL_OBJ.LOGD(this._TAG,"添加led");
        		if(_ledNode && _obj){
		            _obj.createChildUI(GLOBAL_OBJ.control.Led,'Led',_ledNode,null);
		        }
        	}
        },

        /*
        @获取数据*/
        GET:{
        	coin:function(){
        		GLOBAL_OBJ.LOGD(this._TAG,"获取玩家金币数");
        		return GLOBAL_OBJ.Util.genCurrencyString(GLOBAL_OBJ.model.gUser.getChip(),false);
        	},

            curSceneRootNode:function(){
                GLOBAL_OBJ.LOGD(this._TAG,"获取当前场景的根节点");
                return hall.SceneManager.getCurrentController().getRootNode();
            }
        }

	};
})();