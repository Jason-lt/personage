/*************************************************************
 *  mahjong_table_info.js
 *  mahjong
 *	麻将牌桌 信息
 *  Created by nick.kai.lee on 16-09-03
 *  特殊说明：

    使用方法:

 */
(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;

	var MODEL_TABLEINFO   = GLOBAL_OBJ.table.models.TableInfo;
    var MODEL_MATCH	= GLOBAL_OBJ.businesses.scenes.Match.Model;
	GLOBAL_OBJ.table.scenes.Table.Info = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"table.scenes.Table.Info",
		ctor: function() {
			this._super();
			this.init(GLOBAL_OBJ.RES.TABLE_INFO_CCBI);
		},

		onLoad: function() {
			this._super();

            var winSize = cc.view.getFrameSize();
            if (winSize.width/winSize.height == 2){
                this.fanghaoLabel.setPositionY(120);
                this.txtMatchInfo.setPositionY(120);
                this.bgFjh.setPositionY(120);
            }

            var is4_3 = winSize.height/winSize.width == 0.75;
            if (is4_3){
                this.fanghaoLabel.setPositionY(150);
                this.txtMatchInfo.setPositionY(150);
                this.bgFjh.setPositionY(150);
            }
            this['txtMatchInfo'].setVisible(false);
            var that = this;
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_MAHJ_MATCH_ROUND_COUNT, that.showRoundCount, that);

            if (MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Match){
                var curDes = MODEL_MATCH.getCurDes();
                if (!curDes) {
                    return
                }
                var stepObj;
                if (curDes.type == GLOBAL_OBJ.MatchType.stage_match){
                    //定时赛
                    this['bgFjh'].setVisible(true);
                    this['txtMatchInfo'].setVisible(true);
                    var isFinal = false;
                    var curWaitInfo = MODEL_MATCH.getCurWaitInfo();
                    if (curWaitInfo){
                        for (var i = 0; i < curWaitInfo.steps.length; i++){
                            if (curWaitInfo.steps[i].isCurrent == 1){
                                stepObj = curDes.stages[i];
                                if (i == curWaitInfo.steps.length - 1){
                                    isFinal = true;
                                }
                                break;
                            }
                        }
                        var infoStr = "";
                        var curNum = curWaitInfo.cardCount + 1;
                        if(curWaitInfo.riseWait == 5){//断线重连状态为5,数为多少就是多少,不加1
                            curNum = curNum - 1;
                        }
                        if (stepObj.type == GLOBAL_OBJ.MatchStageType.ass){
                            infoStr = stepObj.riseUserCount + "人晋级" + "/" +  stepObj.riseUserRefer + "人截止";
                        }
                        else{
                            if (isFinal){
                                infoStr = "决赛局（" + curNum + "/" + stepObj.cardCount + "局）";
                            }else {
                                infoStr = stepObj.riseUserCount + "人晋级（" + curNum + "/" + stepObj.cardCount + "局）";
                            }
                        }

                        // xxx人晋级xxx人截止(1/2局)
                        this['txtMatchInfo'].setString(infoStr);
                        this['bgFjh'].width = this['txtMatchInfo'].width + 10;
                    }
                }

                var optionInfo =  MODEL_TABLEINFO.getOptionInfo();
                GLOBAL_OBJ.LOGD(this._TAG, "快速赛显示底分 optionInfo = " + JSON.stringify(optionInfo));
                if(optionInfo && optionInfo[1]){
                    this.wanfaLabel_2.setString(optionInfo[1].toString());
                    // this.wanfaLabel_2.setColor(cc.color(27,95,75));
                }
            }
            else{
                that.showInfo();
            }
		},

        showInfo:function(){
            GLOBAL_OBJ.LOGD(this._TAG, "showInfo   ");
            //重置背景文字
            var isCreate = MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;
            if(isCreate){
                var roomId = MODEL_TABLEINFO.getCustomTableId();
                this.fanghaoLabel.setString("房号:" + roomId.toString());
            }
            var optionInfo =  MODEL_TABLEINFO.getOptionInfo();
            var service_fee =  MODEL_TABLEINFO.getServerFee();
            if(optionInfo && optionInfo[0]){
                this.wanfaLabel.setString( optionInfo[0].toString() );
            }
            if(optionInfo && optionInfo[1]){
                // 底分; + 服务费
                var difen = optionInfo[1].toString();
                var servece = "";
                if (service_fee > 0) {
                    servece = "服务费:" + service_fee;
                }
                var str = difen + " " +  servece;
                GLOBAL_OBJ.LOGD(this._TAG, "table_info信息   str = " + str);
                this.fanghaoLabel.setString( str.toString() );
                var b_leng = 170;
                if (this.fanghaoLabel.width > b_leng){
                    this['bgFjh'].width = this.fanghaoLabel.width + 10;
                }
                // that.fanghaoLabel.setString( optionInfo[1].toString() );
            }
            if(optionInfo && optionInfo[2]){
                this.wanfaLabel_2.setString( optionInfo[2].toString() );
            }

            // GLOBAL_OBJ.bkernel.utils.Notification.ignore(GLOBAL_OBJ.businesses.Events.UPDATE_CREATE_TABLE_DESC_LIST,this.showInfo,this);
        },

        showRoundCount:function () {
            if (MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Match){
                var curDes = MODEL_MATCH.getCurDes();
                if (!curDes) {
                    return
                }
                if (curDes.type == GLOBAL_OBJ.MatchType.stage_match){
                    //定时赛不走这的逻辑
                    return;
                }

                var roundInfo = MODEL_MATCH.getCurRoundCount();
                var waitInfo = MODEL_MATCH.getCurWaitInfo();

                var isFinal = MODEL_MATCH.isFinalMatch(waitInfo.roomId, waitInfo.matchId, waitInfo.stageIndex);
                var msgStr;
                if (isFinal){
                    msgStr = "决赛桌";
                }
                else{
                    if (curDes.type == GLOBAL_OBJ.MatchType.arena_match){
                        msgStr = "";
                        var stageObj;
                        for (var i = 0; i < curDes.stages.length; i++){
                            stageObj = curDes.stages[i];
                            if (waitInfo.stageIndex == stageObj.index){
                                msgStr = "前" + stageObj.riseUserCount + "名晋级";
                                break;
                            }
                        }
                    }
                    else{
                        msgStr = "当桌前两名晋级";
                    }
                }
                msgStr += "  (" + roundInfo.curCount + "/" + roundInfo.totalCount + "局)";
                GLOBAL_OBJ.LOGD(this._TAG, "更新比赛场次进度   msgStr = " + msgStr);
                this['fanghaoLabel'].setString(msgStr);

                this['bgFjh'].width = this['fanghaoLabel'].width + 4;
            }
        },

		onCleanup:function() {
            GLOBAL_OBJ.LOGD(this._TAG, "更新比赛场次进度  onCleanup ");
            GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
			this._super();
		}
	});
	//end
})();

