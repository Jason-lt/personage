/*****************************************
 *  mahjong_table_record_module.js
    麻将 牌局纪录
 *  mahjong

 *  Created by zengxx on 16-07-25
 *  特殊说明：

    使用说明:

 */

var RECORD    = [];  // 本局协议数组

(function(){
    var GLOBAL_OBJ = guiyang;
    
	var manager = (function(){
		var DOWNLOADINFO = []; // 一场下来所有局数的下载信息
		var BASE      = 1;   // 标准播放协议事件间隔(s)
		var SPEED     = 1;   // 播放倍速
		var KEY       = "";  // 唯一标记当前回放数据代表的场次以及局数
		var PLAYING   = false; // 当前播放状态 true表示正在播放中，false表示暂停播放
		var INDEX     = 0;   // 当前播放到playing中的协议下标(从0开始)
		var CARDCOUNT = -1;  // 当前播放的是第几局，0表示第一局，依次类推
		var USERID    = 0;   // 自己的ID
        var BATTLEDATAS  = [];  //所有已经下载好了的记录

        var STARTED    = false;
		return {
            exitTablrRecord:function(){
                STARTED = false;
                GLOBAL_OBJ.GlobalVars.setIsTableRecord(false);
            },
			boot:function(){
				ty.extend.schedulerExtend(this);
				GLOBAL_OBJ.businesses.modules.TableRecord.AsyncDownload.boot();
			},

			shut:function(){
				GLOBAL_OBJ.businesses.modules.TableRecord.AsyncDownload.shut();
			},

			// 播放协议
			play:function(logStr){
                //pk modify:先停止
                this.unschedule("playing");
				GLOBAL_OBJ.LOGD('BASE/SPEED ', BASE/SPEED);
				var that = this;

                var doPlay = function(){
                    that.doPlay();
                };
				this.schedule("playing", doPlay, BASE/SPEED);
			},

            doPlay:function(){
                var that = this;
                var cmds = RECORD[INDEX++];
				GLOBAL_OBJ.LOGD('schedule playing INDEX begin :', INDEX + ' CMDS:' + JSON.stringify(cmds));

                if(cmds)
                {
                    if(cmds.cmd == 'score')
                    {
                        /*胡牌分数变化时的处理，后面的win lose消息一起触发*/
                        for(var i = 0 ; i < 4 ; i ++)
                        {
                            var msg = RECORD[INDEX+i];
                            if(msg && (msg.cmd == 'win' || msg.cmd == 'lose'))
                            {
                                var uid = msg['record_uid_list'][0] || 0;
		                        if (uid == hall.AccountInfo.userID)
		                        {
		                            that.processMsg(msg);
		                        }
                            }
                            else
                            {
                                INDEX = INDEX + i;
                                break;
                            }
                        }


                    }
                    else if (cmds.cmd == 'init_tiles')
                    {
                        /*发牌协议一起发出*/
                        for(var i = 0 ; i < 4 ; i ++)
                        {
                            var msg = RECORD[INDEX+i];
                            if(msg && (msg.cmd == 'init_tiles'))
                            {
                                that.processMsg(msg);
                            }else{
                                INDEX = INDEX + i;
                                break;
                            }
                        }
                    }

					that.processMsg(cmds);
                }
                else 
                {
					GLOBAL_OBJ.LOGD('unschedule playing');
                    that.unschedule("playing");
                }
            },
			// 退出回放
			reset:function(){
				BASE      = 1;
				SPEED     = 1;
				KEY       = "";
				PLAYING   = false;
				INDEX     = 0;
				RECORD    = [];
				// CARDCOUNT = -1;

				this.unschedule("playing");
			},

			// 上一局
			previous:function(_preCallFunc, _afterCallFunc){
				var that = this;
				var preCallFunc   = _preCallFunc || function(){};
				var afterCallFunc = _afterCallFunc || function(){};

				if (CARDCOUNT < 0){
					return ;
				}else if (CARDCOUNT == 0){
					// 如果当前已经是第一局，但是UI没有隐藏下一局按钮，那么外部可以通过_preCallFunc来给玩家提示
					afterCallFunc();
				}
				else
				{
					var loadingWnd = GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.businesses.windows.consts.C_CREATE_ROOM_TABLE_RECORD_LOADING,null,hall.SceneManager.getCurrentController().getRootNode());
					var record_download_info = DOWNLOADINFO[CARDCOUNT-1];
                    /*新后端不会给.zip 自己补上*/
                    this.fixZIP(record_download_info);
					GLOBAL_OBJ.businesses.modules.TableRecord.AsyncDownload.doDownload("", record_download_info,
						function(_key, _code, _event, jsonData){

							if (_event['MD5'] != record_download_info['MD5']){
								return ;
							}
							// 如果下载成功，开始播放新的回放数据

							if (_code == 0)
							{
								// 如果之前是第二局，那么点击上一局之后，外部可以通过_afterCallFunc来决定是否隐藏下一局按钮
								if (CARDCOUNT == 1){
									preCallFunc();
								}
								CARDCOUNT--;

								that.reset();
								KEY = _event['MD5'];
								PLAYING = true;

								that.filterRecords(jsonData);

								that.play(2);
							}else{
                                if (loadingWnd){
                                    //关闭的太快了，创建牌桌还需要时间
                                    loadingWnd.windowClose();
                                }
                            }
						}
					);
				}
			},

            //协议处理
            protocol_handle : function(_data){
                var list   = [];
                var source = JSON.parse(_data);
				GLOBAL_OBJ.LOGD('protocol_handle ', source.length);
                list  = source.filter(function(item){
                    if(!item.record_uid_list){
                        item.record_uid_list = [USERID];
						GLOBAL_OBJ.LOGD('not have record_uid_list ', JSON.stringify(item));
                    }

                    var b = ("table_chat" != item.cmd
					&& ("init_tiles" == item.cmd || "sit" == item.cmd || (item.record_uid_list.indexOf(USERID) >= 0) || item.record_uid_list.indexOf(USERID) >= 0)
					&& "table_event" != item.cmd
					&& "create_table_dissolution" != item.cmd
					&& "create_table" != item.cmd
					&& "user_leave_vote" != item.cmd
					&& !("table_info" == item.cmd && true == item.result.reconnect));

                  return b;
                });
                return list;
            },

            filterRecords:function(jsonData){
                jsonData = this.protocol_handle(jsonData);
				GLOBAL_OBJ.LOGD('filterRecords ', jsonData.length);
                // 读取本局回放数据,并存入RECORD中
                if (jsonData != ""){
                    // 所有协议，需要过滤掉其他玩家的
                    var record_arr = jsonData;
                    var init_tilesed = false;
                    var param = {};
                    var needRemove = [];
					var cmds,i;

                    for (i = 0; i < record_arr.length; ++i){
                        cmds = record_arr[i];
                        if(cmds.cmd == 'init_tiles'){
                            if(init_tilesed){
                                cmds.result.ignoreRunTable = 1;
                            }
                            init_tilesed = true;
                        }else if(cmds.cmd == 'table_info'){
                            if(param.haveTableInfo){
                                //多个table_info,去掉后面的
                                needRemove.push(cmds);
                            }
                            param.haveTableInfo = true;
                        }else if(cmds.cmd == 'location'){
                            if(param.haveLocation || param.haveTableInfo){
                                //多个location,去掉后面的
                                needRemove.push(cmds);
                            }
                            param.haveLocation = true;
                        }
                    }

                    for (i = needRemove.length-1; i > -1 ; --i){
                        cmds = needRemove[i];
                        record_arr.splice(record_arr.indexOf(cmds),1);
                    }

                    RECORD = record_arr;
                }

				GLOBAL_OBJ.LOGD('filterRecords end ', RECORD.length);
            },
			// 暂停
			pause:function(){
				PLAYING = false;
				this.unschedule("playing");
			},

			// 取消暂停，继续播放
			resume:function(){
				var that = this;
				PLAYING = true;
				this.play(3);
			},
			//是否是最后一局
			isFinal:function ()
			{
				return CARDCOUNT == DOWNLOADINFO.length - 1;
			},
            //是否是投票结束的
            isVoteFinal:function(){
                return false;
            },
			// 设置播放速度
			setSpeed:function(_speed){
				var that = this;

				SPEED = _speed;
				if (PLAYING == true){
                    //pk modify:先停止之前的
                    this.unschedule("playing");
					this.play(4);
				}
			},

			getSpeed:function(){
				return SPEED;
			},

			// 回放
			reStart:function(){
                var loadingWnd = GLOBAL_OBJ.bkernel.windows.Factory.produce(
                    GLOBAL_OBJ.businesses.windows.consts.C_CREATE_ROOM_TABLE_RECORD_LOADING,
                    null,hall.SceneManager.getCurrentController().getRootNode());

                PLAYING = false;
				this.unschedule("playing");
				INDEX = 0;
				var that = this;
				PLAYING = true;
				this.play(5);
			},

            //设置USERID
            initUSERID:function(){
                if(GLOBAL_OBJ.GlobalVars.getCheckOtherRecordType())
				{
					GLOBAL_OBJ.LOGD("check_restart_4_record true");
					USERID = GLOBAL_OBJ.GlobalVars.getCheckOtherRecordUserID();
				}
				else
				{
					GLOBAL_OBJ.LOGD("check_restart_4_record false");
					USERID = this._params.targetUserID || hall.AccountInfo.userID;
				}
            },

            fixZIP:function(record_download_info){
            },

            // 下一局
			next:function(_preCallFunc, _afterCallFunc){
				var that = this;
				var preCallFunc   = _preCallFunc || function(){};
				var afterCallFunc = _afterCallFunc || function(){};

				if (CARDCOUNT < 0)
				{
					return ;
				}

				else if (CARDCOUNT < DOWNLOADINFO.length-1)
				{
					var loadingWnd = GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.businesses.windows.consts.C_CREATE_ROOM_TABLE_RECORD_LOADING,null,hall.SceneManager.getCurrentController().getRootNode());
					var record_download_info = DOWNLOADINFO[CARDCOUNT+1];
                    /*新后端不会给.zip 自己补上*/
                    this.fixZIP(record_download_info);
					GLOBAL_OBJ.businesses.modules.TableRecord.AsyncDownload.doDownload("", record_download_info,
						function(_key, _code, _event, jsonData){

							if (_event['MD5'] != record_download_info['MD5']){
								return ;
							}

							// 如果下载成功，开始播放新的回放数据
							if (_code == 0){
								// 倒数第二局
								if (CARDCOUNT == DOWNLOADINFO.length-2){
									preCallFunc();
								}
								CARDCOUNT++;

								that.reset();
								KEY = _event['MD5'];
								PLAYING = true;

								that.filterRecords(jsonData);
								that.play(6);
							}else{
                                if (loadingWnd){
                                    //关闭的太快了，创建牌桌还需要时间
                                    loadingWnd.windowClose();
                                }
                            }
						}
					);
				}
				else
				{
					afterCallFunc();
				}
			},
			// 开始播放一局
			start:function(_params, _callFunc)
			{
                this._params = _params;
				this.initUSERID();
				this.start_callFunc = _callFunc || function(){};
                BATTLEDATAS = [];
                this.downLoadRecord();
			},
            //获取下载key
            getDownLoadKey:function(){
                var cardCount = this._params.cardCount;
                var key = "";
				if (this._params.record_download_info &&
                    cardCount&&
                    this._params.record_download_info[cardCount]){
					DOWNLOADINFO = this._params.record_download_info || [];
					key = DOWNLOADINFO[cardCount]['MD5'] || "";
				}
                return key;
            },
            //下载数据
            downLoadRecord:function(_params){
                var _params = this._params;
                var that = this;
                var key = this.getDownLoadKey();
				if (KEY != key && key != ""){
					var loadingWnd = GLOBAL_OBJ.bkernel.windows.Factory.produce(
                        GLOBAL_OBJ.businesses.windows.consts.C_CREATE_ROOM_TABLE_RECORD_LOADING,
                        null,hall.SceneManager.getCurrentController().getRootNode());

                        var record_download_info = _params.record_download_info[_params.cardCount];

                        /*新后端不会给.zip 自己补上*/
                        this.fixZIP(record_download_info);
                        GLOBAL_OBJ.businesses.modules.TableRecord.AsyncDownload.doDownload("", record_download_info,
                            function(_key, _code, _event, jsonData){
                                that.downLoadCallBack(_key, _code, _event, jsonData,record_download_info,key,_params,loadingWnd);
                        }
					);
				}
            },
            downLoadCallBack:function(_key, _code, _event, jsonData,record_download_info,key,_params,loadingWnd){
                if (_event['MD5'] != record_download_info['MD5']){
                    return ;
                }
                var that = this;
                if(this.start_callFunc){
                    this.start_callFunc({
                        code:_code
                    });
                }

                // 如果下载成功，开始播放新的回放数据
                if (_code == 0){
                    that.reset();
                    KEY = key;
                    PLAYING = true;
                    CARDCOUNT = _params.cardCount;

                    that.filterRecords(jsonData);
                    that.play(1);
                }else{
                    if (loadingWnd){
                        //关闭的太快了，创建牌桌还需要时间
                        loadingWnd.windowClose();
                    }
                }
            },

			// 模拟服务器发消息，这里table_info需要特殊处理下，加上isTableRecord字段来标记是回放协议
			processMsg:function(_cmds){
				GLOBAL_OBJ.LOGD(INDEX-1 + " analog server send message ", JSON.stringify(_cmds));
                if(_cmds.result){
                    _cmds.result.isTableRecord = true;
                }
				ty.netMsgDispatcher.processMsg(_cmds.cmd, [_cmds]);
			}
		}
	})();

	// 启动管理器环境
	manager.boot();
	GLOBAL_OBJ.businesses.modules.TableRecord.Module = {
		_TAG:"businesses.modules.TableRecord.Module",
		/*
		@ _initCallFunc 绑定之后的回调，主要做一些初始化相关的操作
		@ _callFunc     下载回放记录之后的回调
		*/
		bind:function(_obj, _params, _initCallFunc, _callFunc){
			var binder = _obj || null;
			if (!binder){
				return ;
			}

			/*
			@ 上一局
			  _preCallFunc:当前是第二局，点击进入第一局时的回调
			  _afterCallFunc:已经进入第一局了点击回调
			*/
			binder.tableRecordPrevious = function(_preCallFunc, _afterCallFunc){
				manager.previous(_preCallFunc, _afterCallFunc);
			};

			/*
			@ 下一局
			  _preCallFunc:当前是倒数第二局，点击进入最后一局时的回调
			  _afterCallFunc:已经进入最后一局了点击回调
			*/
			binder.tableRecordNext = function(_preCallFunc, _afterCallFunc){
				manager.next(_preCallFunc, _afterCallFunc)
			};

			// 回放
			binder.tableRecordReStart = function(){
				manager.reStart();
			};

			// 暂停
			binder.tableRecordPause = function(){
				manager.pause();
			};
			binder.isFinalRecored = function () {
				return manager.isFinal();
			};
            //是否是投票结束的
            binder.isVoteFinalRecored = function () {
				return manager.isVoteFinal();
			};
			// 继续播放
			binder.tableRecordStart = function(){
				manager.resume();
			};

			// 加速播放
			binder.tableRecordAccelerate = function(_speed){
				manager.setSpeed(_speed);
			};

			// 退出回放
			binder.tableRecordExit = function(){
				manager.reset();
                manager.exitTablrRecord();
			};

			// 初始化UI
			var initCallFunc = _initCallFunc || function(){};
			initCallFunc({
				speed:manager.getSpeed()
			});
			// 播放
			manager.start(_params, _callFunc);
		},
		unbind:function(){

		}
	};
})();