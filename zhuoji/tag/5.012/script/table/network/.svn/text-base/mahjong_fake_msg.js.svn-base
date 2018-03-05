/*****************************************
 *  mahjong_fake_msg.js
    模拟服务器消息
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-07-19
 *  特殊说明：
    1.在特定场合，比如table info中，可能会携带很多信息，比如吃碰杠，发牌等等
    为了统一处理流程，使用fakemsg模块来进行服务器协议模拟（同步）
    
    2.有时候需要一些非标准协议的特殊数据，所以添加一个非标准字段 fakeMsg 来传递
    该字段定义在prototype里，是共享数据，收到后，各处理模块记得及时处理，以防被
    覆盖

    使用说明:
    模拟服务器发送协议。

 */
(function(){
    var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.network.FakeMsg = {
		_TAG:"table.network.FakeMsg",
		boot:function() {
        },

        shut:function() {
        },

        fakeReady:function(_seatId){
            var cmds  = {"cmd":"ready","result":{"seatId":_seatId,"gameId":7}};
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        },
        
        fakeCustomReady:function(_seatId){
            var cmds  = {"cmd":"create_table","result":{"action":"ready","seatId":_seatId, "gameId":GLOBAL_OBJ.GAMEID}}
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        },

        fakeDealing:function(_tiles, _seatId, _fakeMsg) {
            var cmds  = { "cmd":"init_tiles", "result": { "header_seat_id": _seatId, "action_id":GLOBAL_OBJ.table.models.ActionId.getActionId(), "tiles": _tiles, "fakeMsg": _fakeMsg, "gameId":GLOBAL_OBJ.GAMEID }};
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        },

        fakeDraw:function(_tile, _seatId, _fakeMsg, _rc) {
            var cmds  = {"cmd":"send_tile","result":{"seatId":_seatId, "tile":_tile, "remained_count":_rc, "action_id":GLOBAL_OBJ.table.models.ActionId.getActionId(), "fakeMsg": _fakeMsg, "gameId":GLOBAL_OBJ.GAMEID}};
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        },

        fakeChow:function(_pattern, _seatId, _fromSeatId, _fakeMsg) {
            var cmds  = { "cmd":"chi","result": { "tile":0, "pattern":_pattern, "seatId": _seatId, "player_seat_id":_fromSeatId, "action_id":GLOBAL_OBJ.table.models.ActionId.getActionId(), "fakeMsg": _fakeMsg, "gameId":GLOBAL_OBJ.GAMEID }};
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        },

        fakePong:function(_pattern, _seatId, _fromSeatId, _fakeMsg) {
            var cmds  = {"cmd":"peng","result":{"tile":0, "pattern":_pattern, "seatId":_seatId, "player_seat_id":_fromSeatId, "action_id":GLOBAL_OBJ.table.models.ActionId.getActionId(), "fakeMsg": _fakeMsg, "gameId":GLOBAL_OBJ.GAMEID}};
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        },
        
        fakeReadyHand:function(_tingInfo, _winTiles, _kouTiles, _seatId, _fakeMsg){
            var cmds  = {"cmd":"ting","result":{"standup_tiles":_tingInfo, "kou_tiles":_kouTiles, "all_win_tiles":_winTiles, "seatId":_seatId,"action_id":GLOBAL_OBJ.table.models.ActionId.getActionId(), "fakeMsg": _fakeMsg, "gameId":GLOBAL_OBJ.GAMEID}};
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        },

        fakeKong:function(_kongInfo, _seatId, _fromSeatId, _fakeMsg){
            var cmds  = {"cmd":"gang","result":{"gang":_kongInfo,"seatId":_seatId, "player_seat_id":_fromSeatId, "action_id":GLOBAL_OBJ.table.models.ActionId.getActionId(),  "fakeMsg": _fakeMsg, "gameId":GLOBAL_OBJ.GAMEID}};
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        },

        fakeTrustee:function(_fakeMsg){
            var cmds  = {"cmd":"set_trustee","result":{ "fakeMsg": _fakeMsg, "gameId":GLOBAL_OBJ.GAMEID }};
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        },

        fakeTrusteeOther:function(_seatId, _isTrustee, _fakeMsg){
            var cmds  = {"cmd":"trustee_info","result":{ "seatId":_seatId, "isTrustee":_isTrustee, "fakeMsg": _fakeMsg, "gameId":GLOBAL_OBJ.GAMEID }};
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        },

        fakeDiscard:function(_tile, _seatId, _tingResult, _fakeMsg,rc){
            rc = rc || 0;
            var cmds  = {"cmd":"play","result":{"seatId":_seatId,"tile":_tile, "ting_result":_tingResult, "remained_count":rc, "action_id":GLOBAL_OBJ.table.models.ActionId.getActionId(), "fakeMsg": _fakeMsg, "gameId":GLOBAL_OBJ.GAMEID}};
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        },

        fakeSit:function(_seatId, _uid, _fakeMsg){
            var cmds  = {"cmd":"sit","result":{"seatId":_seatId, "userId":_uid, "stat":"ready", "fakeMsg": _fakeMsg, "gameId":GLOBAL_OBJ.GAMEID}};
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        },



        fakeLeave:function(_seatId, _fakeMsg){
            var cmds  = {"cmd":"leave","result":{"seatId":_seatId, "fakeMsg": _fakeMsg, "gameId":GLOBAL_OBJ.GAMEID}};;
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        },
        
        fakeVote:function(_vote, _fakeMsg){
            var name  = GLOBAL_OBJ.businesses.modules.User.Model.getName(_vote.userId);
            var cmds  = {"cmd":"create_table_dissolution","result":{
                "seatId":GLOBAL_OBJ.table.models.TableInfo.getActiveServerSeatId(),
                "userId":_vote.userId,
                "seatNum":_vote.seatNum,
                "vote_info":{"disagree":_vote.vote_info.disagree,"agree":_vote.vote_info.agree},
                "vote_info_detail":[],"name":name,"vote_cd":60, "fakeMsg": _fakeMsg}}
            for(var i in _vote.vote_info_detail){
                cmds.result.vote_info_detail.push({
                    "name":_vote.vote_info_detail[i].name,"purl":_vote.vote_info_detail[i].purl,
                    "vote":_vote.vote_info_detail[i].vote,"userId":_vote.vote_info_detail[i].userId
                });
            };
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        },

        fakeWin:function(_userId, _seatId, _mode, _tiles, _chow, _pong, _kong, _wonTiles, _loserInfo, _fakeMsg){
            var cmds  = {"cmd":"win","result":{
                "userId":_userId,
                "final":false,
                "seatId":_seatId,
                "winMode":_mode,
                "tilesInfo":{
                    "tiles":_tiles,
                    "gang":_kong,
                    "chi":_chow,
                    "peng":_pong,
                }, 
                "loserInfo":_loserInfo,
                "wonTiles":_wonTiles,
                "fakeMsg": _fakeMsg}};
            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
        },
	};
})();