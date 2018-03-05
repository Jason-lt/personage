/*************************************************************
 *  mahjong_table_custom_vote.js
    mahjong_table_custom_vote
 *  mahjong
    投票解散牌桌 window
 *
 *  Created by nick.kai.lee on 16-06-24
 *  特殊说明：

    使用方法:
 */
(function(){
    var GLOBAL_OBJ = guiyang;
    var C2S                          = GLOBAL_OBJ.table.network.C2S;
    var GLOBAL_FUNCS                 = GLOBAL_OBJ.businesses.functions;
    var MODEL_VOTE                   = GLOBAL_OBJ.table.models.Vote;
    var MODEL_TABLEINFO              = GLOBAL_OBJ.table.models.TableInfo;
    var MODEL_USER                   = GLOBAL_OBJ.businesses.modules.User.Model;
    GLOBAL_OBJ.table.scenes.Custom.Vote = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
        _TAG:"table.scenes.Custom.Vote",
        ctor: function(_params) {
            this._super();
            this.params = _params;
            this.voterDone = []; // 记录已投票的玩家
        },

        init: function(_ccb) {
            this._super(_ccb);
        },

        onLoad: function() {
            this._super();

            var that = this;

            var activator = MODEL_VOTE.getActivateUserId(); //发起投票的UID
            // 发起投票的用户名
            this.contentLabel.setString(MODEL_USER.getName( activator )+" 发起解散牌桌");

            // 参与投票的人数
            this['playerx'+MODEL_TABLEINFO.getSeatCount()].setVisible(true);

            that.dissolutionNode.setVisible(activator != hall.AccountInfo.userID);

            GLOBAL_OBJ.bkernel.utils.GlobalTimer.set(MODEL_VOTE.getColdTime(), function(){
                // 别人发起的投票，时间到，玩家还没有选择，那么默认表示同意解散
                if (activator != hall.AccountInfo.userID) {
                    //同意解散
                    that.onYes();
                }
            }, this);

            GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_OBJ.bkernel.Events.TICK,  (function(_time){
                var time00 = _time;
                var time01 = _time;
                return function(_params){

                    //自己投票
                    if (time00 > 0 && true == MODEL_VOTE.checkIfIsVoter(hall.AccountInfo.userID)) {
                        --time00;
                        time00 = Math.floor(time00);
                        that.votedLabel.setString("您已经投票，请等待其他玩家投票("+time00+")");

                        that.dissolutionNode.setVisible(false); // 如果是自己发起的投票，那么不显示投票按钮
                    }

                    if (MODEL_VOTE.getVotersCount() == MODEL_TABLEINFO.getSeatCount()) {
                        // that.votedLabel.setString(MODEL_VOTE.getVoteCloseTip());
                    }

                    // 别人发起的投票，解散按钮添加倒计时
                    if (time01 > 0 && activator != hall.AccountInfo.userID) {
                        --time01;
                        time01 = Math.floor(time01);
                        that.yesLabel.setString("解散 ("+time01+")");
                    }
                };
            })(MODEL_VOTE.getColdTime()), this);

            GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_OBJ.table.Events.UPDATE_TABLE_VOTE,  function(){
                var voterCount = MODEL_VOTE.getVotersCount();
                var uiIndex = voterCount - 1 < 0 ? 0 : voterCount - 1;
                var dataIndex = -1;
                var userId;

                for (var i = 0; i < voterCount; i++) {
                    var uid = MODEL_VOTE.getVoterUserIdByIndex(i);
                    if (this.voterDone.indexOf(uid) < 0) {
                        this.voterDone.push(uid);
                        userId = uid;
                        dataIndex = i;
                        break;
                    }
                }

                if (dataIndex < 0) {
                    return;
                }

                var action = MODEL_VOTE.getVoterActionByIndex(dataIndex);
                var max = MODEL_TABLEINFO.getSeatCount();
                that['dissolutionNode_'+max+"_"+uiIndex].setVisible(true);
                // 投票结果
                if (action==1){
                    that['player_'+max+'_'+uiIndex].setHighlighted(true);
                }else{
                    that['player_'+max+'_'+uiIndex].setEnabled(false);
                }

                // 昵称
                that['name_'+max+'_'+uiIndex].setString(MODEL_USER.getName(userId));

                GLOBAL_OBJ.LOGD(this._TAG, "check_vote voteCount = " + uiIndex + ", userId = " + userId);
                // 头像
                that['headNode_'+max+'_'+uiIndex].removeAllChildren();

                GLOBAL_OBJ.businesses.modules.User.Portrait.produce( userId,
                    GLOBAL_OBJ.businesses.windows.consts.C_PORTRAIT_BASIC_WINDOW, that['headNode_'+max+'_'+uiIndex]);
            }, this);
        },

        /*
        弹窗弹出完毕
        */
        onEase:function(){
            this._super();
        },

        onCleanup:function(){
            this._super();
            this.voterDone = [];
            GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
            GLOBAL_OBJ.bkernel.utils.GlobalTimer.clean(this);
        },

        onYes:function(){
            C2S.requestVote(
                MODEL_TABLEINFO.getRoomId(),
                MODEL_TABLEINFO.getTableId(),
                MODEL_TABLEINFO.getActiveServerSeatId(), 1);
        },

        onNo:function(){
            C2S.requestVote(
                MODEL_TABLEINFO.getRoomId(),
                MODEL_TABLEINFO.getTableId(),
                MODEL_TABLEINFO.getActiveServerSeatId(), 0);
        },

        /*
        touch响应，基类重载
        */
        onTouchBegan:function(_touch,_event){
            this._super();
            return true;
        },

        // 是否监听物理返回键，默认监听。不监听的在子类中重写返回false即可
        isKeyBackListenEnabled:function(){
            return false;
        },
    });
    //end
})();
