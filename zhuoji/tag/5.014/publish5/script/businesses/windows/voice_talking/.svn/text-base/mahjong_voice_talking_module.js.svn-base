/*****************************************
 *  mahjong_voice_talking_module.js
    麻将 牌局纪录
 *  mahjong

 *  Created by zengxx on 16-08-12
 *  特殊说明：

    使用说明:
	
 */

(function(){
	var GLOBAL_OBJ = guiyang;
	var MODEL   = GLOBAL_OBJ.businesses.windows.VoiceTalking.Model;
	var SETTING = GLOBAL_OBJ.bkernel.utils.Setting;
	GLOBAL_OBJ.businesses.windows.VoiceTalking.Module = {
		_TAG:'GLOBAL_OBJ.businesses.windows.VoiceTalking.Module',

		/*
		 * _binder:绑定的对象
		 * _param :外部传递的一些参数，主要是在table_chat中用到
		 * _recordingCallFunc:正在录音中需要处理的回调，一般就是用来刷新录音时长
		 * _prePlayCallFunc:播放音频文件之前的回调
		 * _afterPlayCallFunc:播放完一个音频文件之后的回调
		 */
		bind:function(_binder, _param, _recordingCallFunc, _prePlayCallFunc, _afterPlayCallFunc){
			var binder = _binder || null;
			if (!binder){
				return ;
			}

			var param  = _param || {};
			var recordingCallfunc = _recordingCallFunc || function(){};
			var prePlayCallFunc   = _prePlayCallFunc || function(){};
			var afterPlayCallFunc = _afterPlayCallFunc || function(){};

			var TIME = 0; // 录音时长
			var RECORDING = false; // 是否正在录音，true表示正在录音
			var PLAYING   = false; // 是否正在播放一段录音，tru表示正在播放

			// 背景音乐控制器
			var _f_music_manage_ = {
				open:function(){
			        cc.AudioEngine.getInstance().setMusicVolume(SETTING.get(SETTING.KEY_MUSIC,1));
			        cc.AudioEngine.getInstance().setEffectsVolume(SETTING.get(SETTING.KEY_EFFECT,1));
				},
				close:function(){
					cc.AudioEngine.getInstance().setMusicVolume(0);
					cc.AudioEngine.getInstance().setEffectsVolume(0);
				}
			}

			// 开始录音
			binder.startRecordAudio = function(_callFunc){
				var callFunc = _callFunc || function(){};

				if (PLAYING == false && RECORDING == false){
					RECORDING = true;
					callFunc();
					// 防止录音时，定时器已经开启了
					// binder.unschedule("record_audio_play_over");
					GLOBAL_OBJ.bkernel.utils.GlobalTimer.clean(_binder);
					// 录音前暂停背景音乐
					_f_music_manage_.close();
					ty.VoiceRecorder.startRecordAudio();
				}
			};

			// 停止录音
			binder.stopRecorder = function(_callFunc){
				var callFunc = _callFunc || function(){};

				if (PLAYING == false){
					RECORDING = false;
					callFunc();

					ty.VoiceRecorder.stopRecorder();
					// 停止录音后，根据玩家设置状态，进行恢复
					_f_music_manage_.open();
					// 结束录音后马上播放音频
					this.playRecordedAudioFromData();
				}
			};

			// 播放音频数据
			binder.playRecordedAudioFromData = function(){
				if (RECORDING == false && PLAYING == false){
					var msg = MODEL.getMsg();
					if (msg != null){
						PLAYING = true;
						prePlayCallFunc({name:msg.name});
						// 播放前暂停背景音乐
						_f_music_manage_.close();
						ty.VoiceRecorder.playRecordedAudioFromData(msg.audioData);

						GLOBAL_OBJ.bkernel.utils.GlobalTimer.clean(_binder);
						GLOBAL_OBJ.bkernel.utils.GlobalTimer.set(msg.time, function(){
							PLAYING = false;
							afterPlayCallFunc();
							// 播放完之后，根据玩家设置状态，进行恢复
							_f_music_manage_.open();
				            binder.playRecordedAudioFromData();
						}, _binder);
						// 音频播放后的处理，播放完一条后继续播放下一条
						// binder.schedule("record_audio_play_over",function(){
						// 	PLAYING = false;
						// 	cc.log("sdfjklsdjfklsjdfkkdslfjklsdjfkljsdlkfjklsdjfkl:");
						// 	afterPlayCallFunc();
						// 	// 播放完之后，根据玩家设置状态，进行恢复
						// 	_f_music_manage_.open();
				  //           binder.playRecordedAudioFromData();
				  //           // MODEL.activate();
				  //       },msg.time,1);
					} else {
						PLAYING = false;
                        afterPlayCallFunc();
                        // 播放完之后，根据玩家设置状态，进行恢复
                        _f_music_manage_.open();
					}
				}
			};

			/*
			 @ 语音模块来自框架层的回调
			 */

			// 语音数据
			binder.onRecorderEncode = function(_obj){
				// 限定录音时长，超过30s无效
				if (TIME > 20){
					ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                        text:"录音时长不能超过20s,请重新录制",
                        duration:3
                    });
					return ;
				}

				if (TIME < 1){
                    ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                        text:"录音时长太短",
                        duration:1
                    });
                    return ;
                }
                
				var obj = JSON.parse(_obj);
				GLOBAL_OBJ.businesses.network.C2S.requestVoiceTalking(
					GLOBAL_OBJ.table.models.TableInfo.getRoomId(),
					GLOBAL_OBJ.table.models.TableInfo.getTableId(),
					GLOBAL_OBJ.table.models.TableInfo.getActiveServerSeatId(),
	                GLOBAL_OBJ.businesses.modules.User.Model.getName(hall.AccountInfo.userID),
	                obj.audioData,
	                TIME+1   // 因为播放结束目前只能通过时长来判断，这里时长＋1只是保险起见
	            );
	            TIME = 0;
			};

			// 录音时长
			binder.onRecorderTime = function(_time){
				TIME = _time;
				recordingCallfunc({time:TIME});
			};

			binder.onRecorderError = function(_err){
				// 调试的时候可以打印错误信息
			};

			this.register(binder);
		},

		unbind:function(_binder){
			// _binder.unschedule("record_audio_play_over");
			GLOBAL_OBJ.bkernel.utils.GlobalTimer.clean(_binder);
			this.unregister(_binder);
		},

		// 注册监听
		register:function(_binder){
			ty.NotificationCenter.listen(ty.EventType.RECORDER_ENCODE, _binder.onRecorderEncode, _binder);
	        ty.NotificationCenter.listen(ty.EventType.RECORDER_ERROR, _binder.onRecorderError, _binder);
	        ty.NotificationCenter.listen(ty.EventType.RECORDER_TIME, _binder.onRecorderTime, _binder);

	        GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_VOICE_TALKING_INFO, _binder.playRecordedAudioFromData, _binder);
		},

		// 取消监听
		unregister:function(_binder){
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(_binder);

			ty.NotificationCenter.ignore(ty.EventType.RECORDER_ENCODE, _binder.onRecorderEncode, _binder);
	        ty.NotificationCenter.ignore(ty.EventType.RECORDER_ERROR, _binder.onRecorderError, _binder);
	        ty.NotificationCenter.ignore(ty.EventType.RECORDER_TIME, _binder.onRecorderTime, _binder);
		}
	}
})();