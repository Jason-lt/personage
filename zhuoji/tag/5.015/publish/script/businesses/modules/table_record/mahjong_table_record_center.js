/*****************************************
 *  mahjong_table_record_center.js
    麻将 牌局纪录

 *  Created by zengxx on 16-08-03
 *  特殊说明：
    1、写部分：负责监听牌桌相关的协议，并将协议组织起来进行本地存储
    2、读部分：从本地读区需要的数据，给外部提供使用

    数据结构
	// 以数组保存建的一张桌子上面全部的牌局纪录，文件保存目录为  uid/key
	// key唯一标记一张桌子，回放时，通过key来调用getRecord接口获取回放数据
	[
		// 下标从0开始
		{
			"prePlay":[],   // 存 table_info  sit   init_tiles，这组协议提供初始化环境，直接进入到牌桌并发好牌
			"playing":[]    // 存init_tiles之后，到display_budget间的协议
		},
		{

		}
	]

	注:这里每局数据是单独存的，每次获取本场数据，其实是把所有存的局数数据读取拼接

    使用说明:

 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var FILE_SYSTEM  =  GLOBAL_OBJ.businesses.modules.TableRecord.FileSystem;

	GLOBAL_OBJ.businesses.modules.TableRecord.Center = GLOBAL_OBJ.businesses.modules.TableRecord.Center || {
		_TAG:'GLOBAL_OBJ.businesses.modules.TableRecord.Center',

		boot:function(){
			this.curCardCount = -1;  // 当前第几局，从1开始
			this.recordInfo   = []; // 当前桌子的记录
			this.register();
		},

		shut:function(){
			this.curCardCount = -1;
			this.key          = "";
			this.recordInfo   = [];
	        this.unregister();
		},

		// 注册监听
		register:function(){
            var listenNet = GLOBAL_OBJ.bkernel.utils.Notification.listen;
			listenNet(GLOBAL_OBJ.EventType.MSG_CANCEL_SUGGESTION,	     this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_ONLINE_REWARD,		     this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_SEND_TILE, 		     this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_PLAY_TILE, 		     this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_SEEN_TILE,              this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_PENG_TILE, 		     this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_GANG_TILE, 		     this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_BU_TILE, 		         this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_CHI_TILE, 			     this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_WIN_TILE, 			     this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_ALARM_SHOW, 			 this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_TABLE_CALL, 			  this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_WIN_TILE_THIRD, 	     this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_PLAYER_CHICK_TYPE,      this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_PLAYER_CLAIM_TING,      this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_TING, 				     this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_DECIDE_ABSENCE, 	     this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_ABSENCE_BROADCAST,      this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_GRAB_TING,              this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_UPDATE_HAND_TILES,      this.onMsg, this);
	        listenNet(GLOBAL_OBJ.EventType.MSG_PLAY_TILE_LIST,         this.onMsg, this);

            //南昌麻将
            listenNet(GLOBAL_OBJ.EventType.MSG_SHOW_LAIZI_TILES,      this.onMsg, this);
            listenNet(GLOBAL_OBJ.EventType.MSG_FAN_JING,      this.onMsg, this);
            listenNet(GLOBAL_OBJ.EventType.MSG_DISPLAY_JING_BUDGET,      this.onMsg, this);


            // table_info
	        listenNet(GLOBAL_OBJ.EventType.MSG_TABLE_INFO,          this.onMsg, this);
        	listenNet(GLOBAL_OBJ.EventType.MSG_TABLE_INFO_RECOVERY, this.onMsg, this);

        	// sit
        	listenNet(GLOBAL_OBJ.EventType.MSG_SIT, this.onMsg, this);

        	// init_tiles
        	listenNet(GLOBAL_OBJ.EventType.MSG_INIT_TILES, this.onMsg, this);

        	// mj_table_record_msg
        	listenNet(GLOBAL_OBJ.EventType.MSG_MJ_TABLE_RECORD_MSG, this.onMjTableRecordMsg, this);
		},

		// 注销监听
		unregister:function(){
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
        },

		/*
		@ 一些协议回放需要，但是服务器不会下发(目前只遇到过play，自己出牌只会广播给其他玩家，这样自己的出牌动作就无法获取保存)
		  这种情况服务器统一通过cmd:mj_table_record_msg协议来处理，在result->msgs中放入回放需要补充的协议
		  这里先从result->msgs中获取到协议，然后调用this.onMsg回归正常流程
		*/
		onMjTableRecordMsg:function(_msg){
			var msg = _msg[0];
			if (msg['result'] && msg['result']['msgs']){
				for (var i = 0; i < msg['result']['msgs'].length; ++i){
					// 这里把协议放到[]中是为了和onMsg处理的服务器过来的协议格式保持一致
					this.onMsg([msg['result']['msgs'][i]]);
				}
			}
		},

		onMsg:function(_msg){
			GLOBAL_OBJ.LOGD("msg_check receive msg_table_info   1");
			// 检查GameId
	        if(!GLOBAL_OBJ.TCPConnection.checkMsgGameId(_msg))
	        {
	            return;
	        }
            GLOBAL_OBJ.LOGD("msg_check receive msg_table_info   2");
	        var msg = _msg[0];
	        switch(msg['cmd']){
	        	case "table_info":
	        		this.handleTableInfo(msg);
	        		break;
	        	case "sit":
	        		this.handleSit(msg);
	        		break;
	        	case "init_tiles":
	        		this.handleInitTiles(msg);
	        		break;
	        	default:
	        		this.handleDefault(msg);
	        		break;
	        }
		},

		/* 记录拆分 */
		handleTableInfo:function(msg){
			var result = msg['result'] || {};
			GLOBAL_OBJ.LOGD("handleTableInfo ", JSON.stringify(result));
			// 如果本身就是回放协议，就不存储了
			if (typeof(result['isTableRecord']) != 'undefined' && result['isTableRecord'] == true){
				this.curCardCount = -1;
				return ;
			}

			if (result['tableType'] == "create" && result['create_table_extend_info']){
				this.curCardCount = typeof(result['create_table_extend_info']['create_now_cardcount'])=='undefined'?-1:result['create_table_extend_info']['create_now_cardcount']-1;
				this.key          = result['create_table_extend_info']['tableRecordKey'] || "";

				// 只要收到table_info,根据key创建本场纪录的文件夹
				this.createDir(this.key);
				// 记录下局数下标
				var cardCountRecord = this.read(this.key, -1) || [];
				if (cardCountRecord.indexOf(this.curCardCount) == -1){
					cardCountRecord.push(this.curCardCount);
					cardCountRecord.sort();
					this.write(this.key, -1, cardCountRecord);
				}

				// 读取当前局的数据
				this.recordInfo = this.read(this.key, this.curCardCount) || {};

				/*
				@ 如果收到table_info，prePlay里面已经有了本局数据，说明是断线重连
				  如果是断线重连，根据断线重连的地方做出不同处理
				  如果不是断线重连，则创建一条新的记录
				*/
				if (this.recordInfo && this.recordInfo['prePlay'] && this.recordInfo['prePlay'].length > 0){
					var len = this.recordInfo['prePlay'].length
					/*
					@ 判断prePlay中最后一条协议，如果是init_tiles说明是牌桌内断线重连，那么把这个table_info当作playing中的一条协议
					  如果不是init_tiles说明是等待界面断线重连回来，那么直接清空prePlay里面的协议，再将table_info放入到prePlay中
					*/
					if (this.recordInfo['prePlay'][len-1]['cmd'] == "init_tiles"){
						this.recordInfo['playing'].push(msg);
					}else{
						this.recordInfo['prePlay'] = [];
						this.recordInfo['prePlay'].push(msg);
					}
				}else{
					this.recordInfo = {"prePlay":[],"playing":[]};
					this.recordInfo['prePlay'].push(msg);
				}
				this.write(this.key, this.curCardCount, this.recordInfo);
			}
		},

		handleSit:function(msg){
			if (this.curCardCount != -1){
				this.recordInfo['prePlay'].push(msg);
				this.write(this.key, this.curCardCount, this.recordInfo);
			}
		},

		handleInitTiles:function(msg){
			if (this.curCardCount != -1){
				this.recordInfo['prePlay'].push(msg);
				this.write(this.key, this.curCardCount, this.recordInfo);
			}
		},

		handleDefault:function(msg){
			if (this.curCardCount != -1){
				this.recordInfo['playing'].push(msg);
				this.write(this.key, this.curCardCount, this.recordInfo);
			}
		},

		read:function(_key, _curCardCount){
			var str  = hall.GlobalFuncs.base64decode(FILE_SYSTEM.read(_key, _curCardCount));
			return str.length>0?JSON.parse(str):null;
		},

		write:function(_key, _curCardCount, _content){
			FILE_SYSTEM.write(_key, _curCardCount, hall.GlobalFuncs.base64encode(JSON.stringify(_content)));
		},

		createDir:function(_dirName){
			FILE_SYSTEM.createDir(_dirName)
		},

		/*
		@ 以下为对外接口
		*/
		getRecord:function(_key){
			var cardCountRecord = this.read(_key, -1) || [];
			var data = [];
			for (var i = 0; i < cardCountRecord.length; ++i){
				data.push(this.read(_key, cardCountRecord[i]));
			}

			return data;
		}
	};
})();
