/*****************************************
 *  mahjong_table_model_vote.js
    (自建桌投票)牌桌相关model
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-11-04
 *  
    协议说明：
    
    {
    "cmd": "create_table_dissolution",
    "result": {
    "seatId": 1,
    "userId": 10027,
    "seatNum": 2,
    "vote_info": {
      "disagree": 0,
      "agree": 1
    },
    "vote_info_detail": [
      {
        "name": "低调ing",
        "purl": "http://ddz.image.tuyoo.com/avatar/head_horse.png",
        "vote": 1,
        "userId": 10027
      }
    ],
    "name": "低调ing",
    "vote_cd": 60,
    "fakeMsg": {
      "direct": true
    }
    }
    }

    使用说明:

 */
(function(){
    var GLOBAL_OBJ = guiyang;

    GLOBAL_OBJ.table.models.Vote = (function(){
        /*
        私有数据+接口
        TODO:
        数据的原型，存储以及通知的抛出
        */

        /* @数据缓存*/
        var CACHE                = {}
        var PROTOTYPE            = GLOBAL_OBJ.table.models.Prototype;

        /* @私有属性 */
        PROTOTYPE.setPrivateProperty(CACHE, "userId", -1, "发起投票者UID");
        PROTOTYPE.setPrivateProperty(CACHE, "voters", [], "投票者参与者信息");
        PROTOTYPE.setPrivateProperty(CACHE, "coldTime", 0, "投票冷却时间");
        PROTOTYPE.setPrivateProperty(CACHE, "closeDelayTime", 2, "投票关闭延迟时间");
        PROTOTYPE.setPrivateProperty(CACHE, "closeIt", 0, "是否关闭（1/0）");
        PROTOTYPE.setPrivateProperty(CACHE, "leaveTip", "", "解散牌桌成功提示");
        
        /* @共享属性 */


        /* @数据通知*/
        var ___f_notificate = function(_object, _data, _slient){
            if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
                return _slient;
            };
            
            var data       = _data;
            CACHE.userId   = data.userId;
            CACHE.voters   = data.vote_info_detail;
            CACHE.closeIt  = data.close_vote;
            CACHE.coldTime = data.vote_cd;
            CACHE.closeDelayTime = data.close_vote_cd;

            PROTOTYPE.parse(_object, CACHE, data);

            GLOBAL_OBJ.LOGD("check_vote_id 发起id = " + CACHE.userId + ",  当前_seatId = " + data.seatId);
            if (!_slient){
                GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_VOTE, data);
            };
            return _slient;
        };

        return PROTOTYPE.functionsExt(CACHE, {
            _TAG:"table.models.Vote",

                    /*
            公有数据+接口
            TODO:
            外部调用
            */
            /* 协议解析*/
            parse:function(_data, _slient){
                var data = _data;
                if (null == data){
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

            getActivateUserId:function(){
                return CACHE.userId;
            },

            getVotersCount:function(){
                return CACHE.voters.length;
            },

            getColdTime:function(){
                return CACHE.coldTime;
            },

            getVoterUserIdByIndex:function(_index){
                var voter = CACHE.voters[_index] || {};
                return voter.userId;
            },

            checkIfIsVoter:function(_uid){
                var count = this.getVotersCount();
                for(var i = 0 ; i < count ; ++i){
                    if (_uid == this.getVoterUserIdByIndex(i)){
                        return true;
                    };
                };
                return false;
            },

            checkIfNeedClose:function(){
                return CACHE.closeIt;
            },

            getVoterActionByIndex:function(_index){
                var voter = CACHE.voters[_index] || {};
                return voter.vote; //1 or 0
            },

            getVoterUrlByIndex:function (_index) {
                var url = CACHE.voters[_index].purl || "";
                return url;
            },

            getVoteCloseDelayTime:function(){
                return CACHE.closeDelayTime;
            },

            getVoteCloseTip:function(){
                return CACHE.leaveTip;
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
                    cmds = {"cmd":"create_table_dissolution","result":{"vote_info_detail":[{"vote":1,"userId":10001,"name":"\u6469\u5929\u8f6e","purl":"http://ddz.image.tuyoo.com/avatar/head_sea.png"}],"seatNum":4,"gameId":710,"name":"\u6469\u5929\u8f6e","vote_info":{"disagree":0,"agree":1},"userId":10001,"tableId":71080110010200,"seatId":0,"roomId":7108011001,"vote_cd":60}}
                    break;
                    case 1:
                    cmds = {"cmd":"user_leave_vote","result":{"vote_info_detail":[],"gameId":710,"userId":10001,"close_vote":1,"close_vote_cd":1,"tableId":71080110010200,"seatId":0,"roomId":7108011001}};
                    break;
                };
                ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
            }
        });//end

    })();
})();