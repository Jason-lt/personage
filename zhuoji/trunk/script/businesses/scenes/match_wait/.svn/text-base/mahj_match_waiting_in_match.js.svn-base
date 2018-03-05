/**
 *  比赛，赛间等待面板
 * Created by 许敬 on 2017/7/7.
 */

(function () {
    var GLOBAL_OBJ = guiyang;
    var GLOBAL_FUNCS                             = GLOBAL_OBJ.businesses.functions;

    GLOBAL_OBJ.businesses.scenes.MatchWait.MatchWaitingInMatchController = GLOBAL_OBJ.bkernel.base.BaseController.extend({
        _TAG: "businesses.scenes.MatchWait.MatchWaitingInMatchController",
        ctor: function (_data) {
            this._super();
            this._waitData = _data;

            this._waitingTime = 0;

            this.listsLen = 20;
            this._rankingCellControllers = [];

            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_TIME_MATCH_RISE, this.onRise, this);
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_TIME_MATCH_INFO, this.onUpdateMatchInf, this);
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_TIME_MATCH_RANK, this.onUpdateRankLists, this);

            this.init(GLOBAL_OBJ.RES.MAHJ_MATCH_WAITING_IN_MATCH_CCBI);
        },


        onLoad: function () {
            this._super();

            var self = this;

            this['txtTitle'].setString(this._waitData.mname);

            //背景适配
            // var vsize = cc.director.getWinSize();
            // var contentSize = this['waittingInMatchBg'].getContentSize();
            // var scale = Math.max(vsize.width / contentSize.width, vsize.height / contentSize.height);
            // this['waittingInMatchBg'].setScale(scale);

            var m_s = function (seconds) {
                var m = Math.floor(seconds / 60);
                var s = seconds - 60 * m;
                return GLOBAL_FUNCS.leftpad(m.toString(), 2, '0') + ':' + GLOBAL_FUNCS.leftpad(s.toString(), 2, '0');
            };
            self['txtWaitingTime'].setString(m_s(self._waitingTime));

            // 真正的倒计时计时部分
            this.rootNode.schedule(function () {
                self._waitingTime++;
                self['txtWaitingTime'].setString(m_s(self._waitingTime));
            },1);

            //晋级面板
            this._fullAnimationController = new GLOBAL_OBJ.businesses.scenes.MatchWait.MatchWaitingFullAnimationController();
            this['nodeRise'].addChild(this._fullAnimationController.rootNode);
            this._fullAnimationController.rootNode.setPosition(-50, 23);

            var vBoxSize = this['nodeScroll'].getContentSize();
            this._rankList = new GLOBAL_OBJ.VBox(vBoxSize, 2);
            this['nodeScroll'].addChild(this._rankList);

            this._initMatchSchedule();

            // 定时请求消息
            ty.Timer.cancelTimer(this, this.sendUpdateMsg);
            this.sendUpdateMsg();
            ty.Timer.setTimer(this, this.sendUpdateMsg, 6, cc.REPEAT_FOREVER, 0);
        },

        sendUpdateMsg: function () {
            GLOBAL_OBJ.LOGD(this._TAG, "Run sendUpdateMsg-----------------");
            //请求更新
            //测试代码开始
            // var cmds = {
            //     "cmd": "match",
            //     "result": {
            //         "action":"rank",
            //         "gameId": 701,
            //         "roomId": 701230,
            //         "tableId": 70123010000000,
            //         "mranks": [
            //             {
            //                 "userId": 11248,
            //                 "name": "财神正年少",
            //                 "score": 40000,
            //                 "rank": 4
            //             },
            //             {
            //                 "userId": 10007,
            //                 "name": "左右两",
            //                 "score": 400,
            //                 "rank": 1
            //             },
            //             {
            //                 "userId": 10008,
            //                 "name": "左右两q",
            //                 "score": 4000,
            //                 "rank": 2
            //             },
            //             {
            //                 "userId": 10009,
            //                 "name": "左右两w",
            //                 "score": 400,
            //                 "rank": 3
            //             },
            //             {
            //                 "userId": 11248,
            //                 "name": "财神正年少",
            //                 "score": 40000,
            //                 "rank": 4
            //             }
            //         ]
            //     }
            // };
            //
            // var cmds2 = {
            //     "cmd": "match",
            //     "result": {
            //         "action":"update_info",
            //         "gameId": 701,
            //         "roomId": 701230,
            //         "tableId": 70123010000000,
            //         "uncompleted" : 5,
            //         "wait_time" : 50
            //     }
            // };
            // ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
            // ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds2]);
            //测试代码结束

            GLOBAL_OBJ.businesses.network.C2S.requestMatchRank(this._waitData.roomId);
            GLOBAL_OBJ.businesses.network.C2S.requestMatchUpdate(this._waitData.roomId);
        },

        /* 更新比赛信息 */
        onUpdateMatchInf: function (info) {
            GLOBAL_OBJ.LOGD(this._TAG, "Run onUpdateMatchInf-----------------");
            // 剩余的牌桌数
            if (info.waitInfo && typeof(info.waitInfo.uncompleted) !== "undefined") {
                this["txtTableNum"].setString(info.waitInfo.uncompleted + "");
            }
            // 预计等待时间
            var second = 0;
            if (info.waitInfo){
                second = info.waitInfo.wait_time;
            }
            var predict = '';
            if (second > 60) {
                if (second > 60 * 30) {
                    predict = '>30分钟';
                } else {
                    predict = '<' + Math.ceil(second / 60) + '分钟';
                }
            } else {
                predict = '<1分钟';
            }

            this["txtTime"].setString(predict);
        },

        onUpdateRankLists: function (matchRanks) {
            GLOBAL_OBJ.LOGD(this._TAG, "Run onUpdateRankLists -----------------matchRanks.length ：" + matchRanks.length);
            var ranking = [];
            if (matchRanks.length > 0) {
                var rank = matchRanks[0];
                var item = {
                    ranking: rank.rank,
                    name: rank.name,
                    points: rank.score
                };

                // 当前排名
                if (item.ranking) {
                    this["txtOrder"].setString(item.ranking + '');
                }

                if (item.points) {
                    this["txtScore"].setString('' + item.points);
                }

                var loopN = matchRanks.length > this.listsLen ? this.listsLen : matchRanks.length;
                for (var i = 1; i < loopN; i++) {
                    rank = matchRanks[i];
                    item = {
                        ranking: rank.rank,
                        name: rank.name,
                        points: rank.score
                    };
                    ranking.push(item);
                }
            }

            this._refreshRanking(ranking);
        },

        _createRankingCellController: function () {
            return new GLOBAL_OBJ.businesses.scenes.MatchWait.MatchWaitingRankingItemController();
        },

        _refreshRanking: function (info) {
            var rankingInfo = info || [];
            var playerNum = rankingInfo.length; // 排行榜用户的个数
            var cellNumber = this._rankingCellControllers.length;
            var cell = null;

            rankingInfo.sort(function (itema, itemb) {
                return itema.ranking < itemb.ranking;
            });

            rankingInfo.reverse();

            for (var i = 0; i < playerNum; i++) {
                if (i < cellNumber) {
                    cell = this._rankingCellControllers[i];
                } else {
                    cell = this._createRankingCellController();
                    this._rankList.addItem(cell.rootNode);
                    this._rankingCellControllers.push(cell);
                }
                rankingInfo[i].index = i;
                cell.refreshPlayInfo(rankingInfo[i]);
            }

            // 删除多余的cell controller
            while (this._rankingCellControllers.length > playerNum) {
                cell = this._rankingCellControllers.pop();
                if (cell) {
                    cell.rootNode.removeFromParent();
                }
            }

        },


        // 初始化比赛进程
        _initMatchSchedule: function () {

            if (!this._sceduleController) {
                this._sceduleController = new GLOBAL_OBJ.businesses.scenes.MatchWait.MatchWaitingScheduleController();
                this["nodeProgres"].addChild(this._sceduleController.rootNode);
            }

            var steps = this._waitData.steps;
            if (steps) {
                this._sceduleController.refreshWithStages(steps);
                // this.rootNode.scheduleOnce(function () {
                //     this.doRise();
                // }.bind(this),10);
            }
        },

        onClosed: function () {
            //晋级等待，不允许退出比赛
        },

        // 服务器发来的晋级消息
        onRise: function (argument) {
            var result = argument[0];
            // 为了避免升级之后还在刷新界面 干掉界面刷新
            ty.Timer.cancelTimer(this, this.sendUpdateMsg);

            this.doRise();
        },

        // 晋级
        doRise: function () {
            this['txtTableNum'].setString('0');
            var that = this;

            //1.隐藏排行
            that['nodeInfo'].setVisible(false);
            //2.显示晋级动画
            that['nodeRise'].setVisible(true);
            that._fullAnimationController.riseAction();

            this._sceduleController.doRise(function () {

            });

            this.rootNode.unscheduleAllCallbacks();
        },

        onCleanup:function () {
            this._super();

            ty.Timer.cancelTimer(this, this.sendUpdateMsg);

            GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);

            if (this._rankList) {
                this._rankList = null;
            }

            if (this._fullAnimationCOntroller) {
                this._fullAnimationCOntroller = null;
            }

            if (this._sceduleController) {
                this._sceduleController = null;
            }
        }
    });

})();