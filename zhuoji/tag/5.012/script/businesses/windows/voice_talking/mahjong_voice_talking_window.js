/*************************************************************
 *  mahjong_voice_talking_window.js
    mahjong_voice_talking_window
 *  mahjong
 	任务系统window
 *
 *  Created by zengxx on 16-08-11
 *  Modify  by Simon on  17-03-08
 *  特殊说明：

    使用方法:
 */

(function(){
	var GLOBAL_OBJ   = guiyang;
	var AUDIO               = GLOBAL_OBJ.bkernel.utils.Audio;

	GLOBAL_OBJ.businesses.windows.VoiceTalking.Window = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:'GLOBAL_OBJ.businesses.windows.VoiceTalking.Window',
		ctor:function(){
			this._super();
			this.init(GLOBAL_OBJ.RES.MAHJONG_VOICE_TALKING_NEW_CCBI);
			this.btnEnabled = true;
			this.huData		= [];
			this.isMethod   = 0;
			this.isVoiced   = false;
		},

		onLoad:function(){
			this._super();
		},

		controlVisible:function ( _seen ) {
			this.getRootNode().setVisible(_seen);
		},
        
		initData:function(params_){
			this.params = params_;

			var that = this;

	        GLOBAL_OBJ.businesses.windows.VoiceTalking.Module.bind(this, this.params, function(_event){
	        	that['bh_recordTime'].setString(_event.time || 0);
				if(_event.time >= 20 && !that.isVoiced){
					GLOBAL_OBJ.LOGD(this._TAG," 录音时长超过20秒,主动结束录音");
					// 录音结束
					that.stopRecorder(function(){
						that.playAnim("Default Timeline");
					});
					that.isVoiced = true;

					ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
						text:"录音时长不能超过20s",
						duration:3
					});
				}
	        }, function(_event){
	        	that['voiceNodeBtn'].setEnabled(false);
	        	that.playAnim("voiceOut");
	        	that['talkName'].setString(_event.name || "")
	        }, function(){
	        	that.playAnim("Default Timeline");
	        	that['voiceNodeBtn'].setEnabled(true);
	        });

            //IOS 提审隐藏麦克风
	        var user_type = hall.PluginInterface.getUserType();

            GLOBAL_OBJ.LOGD("查看 用户类型 ", user_type);
            // that.micSprBg.setVisible(user_type);
            // that.voiceNodeBtn.setVisible(user_type);

            this.addEventListener(GLOBAL_OBJ.EventType.EVT_SHOW_VOICE_BTN, this.onEvtShowBtn, this);
            this.addEventListener(GLOBAL_OBJ.EventType.EVT_HIDE_VOICE_BTN, this.onEvtHideBtn, this);

			GLOBAL_OBJ.bkernel.utils.Notification.listen( MAHJ_OWN_EVENTS.ON_DRAG, this.changeBtnState,this);

		},
		changeBtnState:function (startDrag) {

			if (this.btnEnabled == startDrag) return;
			this.btnEnabled = startDrag;

			this['voiceNodeBtn'].setEnabled(!this.btnEnabled);
			this['chatNodeBtn'].setEnabled(!this.btnEnabled);
		},
        onEvtHideBtn:function () {
            this.view.ccbRootNode.setVisible(false);
        },
        onEvtShowBtn:function () {
            this.view.ccbRootNode.setVisible(true);
        },
		onCleanup:function(){
			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
			this._super();


			GLOBAL_OBJ.businesses.windows.VoiceTalking.Module.unbind(this);
			GLOBAL_OBJ.bkernel.utils.Notification.ignore( MAHJ_OWN_EVENTS.ON_DRAG, this.changeBtnState,this);
		},



		onEase:function(){
			this._super();

			if (typeof(this.params['action_name']) != 'undefined'){
				this.playAnim(this.params['action_name']);	
			}
		},

		// 是否监听物理返回键，默认监听。不监听的在子类中重写返回false即可
		isKeyBackListenEnabled:function(){
			return false;
		},

		/*
		touch响应，基类重载
		*/
		onTouchBegan:function(_touch,_event){
			this._super();
 			return false;
		},

		// 开始录音
		startVoicingCallBack:function(sender, controlEvent){
			var that = this;

			GLOBAL_OBJ.LOGD(this._TAG,"startVoicingCallBack -> controlEvent : "+controlEvent); 
			if(controlEvent == cc.CONTROL_EVENT_TOUCH_DOWN){
				// 开始录音
				that.isVoiced = false;
				this.startRecordAudio(function(){
					that.playAnim("voiceIng");
				});
				that['bh_recordTime'].setString("0");
			}else if(
				controlEvent == cc.CONTROL_EVENT_TOUCH_UP_OUTSIDE
				||
				controlEvent == cc.CONTROL_EVENT_TOUCH_DRAG_EXIT 
				|| 
				controlEvent == cc.CONTROL_EVENT_TOUCH_UP_INSIDE
			){
				GLOBAL_OBJ.LOGD(this._TAG," 录音按键的其他相应 ");
				if(!this.isVoiced){
					// 录音结束
					that.stopRecorder(function(){
						that.playAnim("Default Timeline");

						// // 录音结束后，给录音按钮做限制，2s后可点击
						// that['voiceNodeBtn'].setEnabled(false);
						// that.unschedule("voice_node_btn_touch");
						// that.schedule("voice_node_btn_touch", function(){
						// 	// 恢复当前状态
						// 	that['voiceNodeBtn'].setEnabled(true);
						// }, 2, 1);
					});
					that.isVoiced = true;
				}
			}
		},

		// 表情文字按钮响应事件
		onClickChatting:function(sender, controlEvent)
		{
			if(controlEvent == cc.CONTROL_EVENT_TOUCH_UP_INSIDE)
			{
				AUDIO.audio(GLOBAL_OBJ.RES.UI_CLICKBUTTON_MP3);
				GLOBAL_OBJ.LOGD("表情文字按钮响应   ");
				GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.UPDATE_NEW_CHAT,{});
			}
		}

	});
})();
