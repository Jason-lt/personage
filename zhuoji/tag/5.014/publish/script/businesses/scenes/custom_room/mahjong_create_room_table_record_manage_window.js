/*************************************************************
 *  mahjong_create_room_table_record_manage_window.js
    mahjong_create_room_table_record_manage_window
 *  mahjong
 	牌局回放控制窗口 window
 *
 *  Created by zengxx on 16-08-01
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	
	GLOBAL_OBJ.businesses.scenes.CustomRoom.TableRecordManageWindow = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"businesses.scenes.CustomRoom.TableRecordManageWindow",
		ctor: function(_params) {
			this._super();
			this.params = _params;
			this.speed  = 0;  // 播放速度
            this.state = "show";

		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();

			// 暂停/继续 按钮节点组
			this.groups = GLOBAL_OBJ.businesses.functions.nodeGroup("setVisible",[false,true],[this.pauseBtn,this.startBtn]);
			this.groups.setVisible(0);
		},

		/*
		弹窗弹出完毕
		*/
		onEase:function(){
			this._super();
			var that = this;

			// 只要有本窗口，一定是在最上层，这个和test_tool类似
			this.getRootNode().setLocalZOrder(99999999);
			
			GLOBAL_OBJ.businesses.modules.TableRecord.Module.bind(
				this,
				this.params,
				function(_event){
					that.speed = typeof(_event.speed) != 'defined' ? _event.speed - 1 : 0; // module中，播放速度1开始，这里从0开始
					that['speedBtnLabel'].setString("X" + (that.speed + 1));
				},
				function(_event){
					if (_event.code == 0){
						GLOBAL_OBJ.LOGD(" record log ", " _event.code = 0 ");
					}else{
						GLOBAL_OBJ.LOGD(" record log ", " huifang message download failed ");
						ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
							text:"回放信息下载失败，请重新下载",
							duration:3
						});
						that.windowClose();
					}
				}
			);
		},

		onCleanup:function(){
			this._super();

			GLOBAL_OBJ.businesses.modules.TableRecord.Module.unbind();
		},

		/*
		touch响应，基类重载
		*/
		onTouchBegan:function(_touch,_event){
			this._super();
 			return true;
		},

		/*
		@ 按钮
		*/

		// 控制控制层按钮组显示和隐藏
		onControl:function(){
			// 当前控制层显示状态  show 显示  hide 隐藏
            switch(this.state){
                case "show":
                    this.playAnim("hide");
                    this.state = "hide";
                    break;
                case "hide":
                    this.playAnim("show");
                    this.state = "show";
                    break;
                default:
                    break;
            }
		},

		onBack:function(){
			this.tableRecordExit();
			ty.NotificationCenter.trigger(hall.EventType.HALL_TRANS_HALL);
		},

		// 上一局
		onPrevious:function()
		{
			this.tableRecordPrevious(function()
			{


			}, function(){
				ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                    text:"当前已经是第一局了",
                    duration:1
                });
			});
		},

		// 下一局
		onNext:function(){
            var that = this;
			this.tableRecordNext(function(){

			}, function(){
				ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                    text:"当前已经是最后一局了",
                    duration:1
                });
			});
		},

		// 回放
		onReStart:function(){
			GLOBAL_OBJ.LOGD("restart_check ", "check restart log ");
			this.tableRecordReStart();
		},

		// 暂停
		onPause:function(){
			this.groups.setVisible(1);
			this.tableRecordPause();
		},

		// 继续播放
		onStart:function(){
			this.groups.setVisible(0);
			this.tableRecordStart();
		},

		// _n倍播放速度
		onSpeed:function(){
			var max_speed = 3;

			this.speed = (this.speed+1)%max_speed;
			this['speedBtnLabel'].setString("X"+(this.speed+1));
			this.tableRecordAccelerate(this.speed+1);
		}
	});
	//end
})();

