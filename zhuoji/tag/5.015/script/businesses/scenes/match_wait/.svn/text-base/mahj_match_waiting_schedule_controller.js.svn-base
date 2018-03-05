// File: mahj_match_waiting_schedule_controller.js
// Date: 2017-11-22
// Author: xujing
/* Description:
*  比赛主等待界面的上的比赛进程界面 位于主等待界面的上方 属于公共UI
*/
(function () {
	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.businesses.scenes.MatchWait.MatchWaitingScheduleController = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.MatchWait.MatchWaitingScheduleController",

		ctor:function () {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG, " ctor new");

			// 进程上的站点距离左边界和右边界的距离
			this._leftSpace = 80;
			this._rightSpace = 80;

			this._scrollviewWidth = 770;
			this._scrollviewHeight = 60;

			// 比赛进程上的站点
			this._stationControllers = [];
			// 比赛进程间的路线
			this._lines = [];
			this._curStationNo = 0; // 当前所在比赛站点
			this._lineLength = 200;
			this._lineSpriteLength = 817;

			this._stagesList = null;

			this.init(GLOBAL_OBJ.RES.MAHJ_MATCH_WAITING_MATCH_PROGRESS_SMALL_CCBI);
		},

		onLoad: function () {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG," in _load");

			this["schedule_scrollview"].setTouchEnabled(false);
			this["schedule_scrollview"].setBounceable(true);

			this['s9s_progress_bg'].removeFromParent(false);
			this["schedule_scrollview"].addChild(this['s9s_progress_bg'], 0);
			this['s9s_progress_bg'].setVisible(false);
		},

		_destroyArrController:function (arr, remove) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].destroy) {
					arr[i].destroy();
				}
				if (remove) {
					arr[i].rootNode.removeFromParent();
				}
			}
		},

		onCleanup:function () {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG," in onCleanup");

			this._destroyArrController(this._stationControllers, false);
			this._stationControllers = null;
			this._lines = null;
		},

		// 创建站点
		_createStationController:function (posX) {
			var station = new GLOBAL_OBJ.businesses.scenes.MatchWait.MatchWaitingStationController();
			station.rootNode.setPosition(posX, this._scrollviewHeight/2);
			return station;
		},

		// 创建进度条
		_createLineProgress:function () {
			var sprite = cc.Sprite.createWithSpriteFrameName(GLOBAL_OBJ.RES.MAHJ_MATCH_SCHEDUL_PROGRESS_PNG);
			var bar = new cc.ProgressTimer(sprite);
			bar.type = cc.ProgressTimer.TYPE_BAR;
			//    Setup for a bar starting from the bottom since the midpoint is 0 for the y
			bar.midPoint = cc.p(0, 0);
			//    Setup for a vertical bar since the bar change rate is 0 for x meaning no horizontal change
			bar.barChangeRate = cc.p(1, 0);
			bar.setPercentage(0);
			bar.setAnchorPoint(cc.p(0, 0.5));
			return bar;
		},

		// 进度条从0涨到100
		// lineIndex-进度条索引 stationIndex-站点索引 delta-等待时间
		_runLineProgress:function (lineIndex, stationIndex, delta) {
			var station = this._stationControllers[stationIndex];
			this._lines[lineIndex].runAction(
				cc.sequence(cc.DelayTime.create(delta || 0),
					cc.progressTo(0.8, this._lineLength/this._lineSpriteLength * 100),
					cc.CallFunc.create(function () {
						// station.setPassState(true);
						// station.setCurState(true);
						station.arriveAction();
					})
				)
			);

			var that = this;
			var cur_station = this._stationControllers[stationIndex-1];
			this._lines[lineIndex].scheduleOnce(function () {
				cur_station.passAction();
				// 移动比赛进度所在的滚动框
				var offset_x = that["schedule_scrollview"].getContentOffset().x;
				var pos_x = that._stationControllers[stationIndex].rootNode.x;
				var off_side_x = that._scrollviewWidth - (pos_x + offset_x); // 目标站点距离右边界的距离
				if (off_side_x < that._rightSpace) {
					var next_offset_x = offset_x - (that._rightSpace - off_side_x);
					that["schedule_scrollview"].setContentOffset(cc.p(next_offset_x, 0), true);
				}
			}, delta || 0);
		},

		// 进度条运动到最终的站点
		_runToCurStation:function (finalStationNo, callback) {
			var curStationNo = this._curStationNo;
			finalStationNo = Math.min(this._stationControllers.length - 1, finalStationNo);
			if (finalStationNo > curStationNo) {
				this._curStationNo = finalStationNo;
				for (var i = curStationNo; i < finalStationNo; i++) {
					this._runLineProgress(i, i + 1, 0.8 * (i - curStationNo));
				}

				if (callback) {
					this['schedule_scrollview'].scheduleOnce(callback, 0.8 * (finalStationNo - curStationNo) + 1.5);
				}
			}
		},

		_initScheduleInfo:function (info) {
			var stagesList = info || [];
			if (stagesList.length == 0) {
				return;
			}
			this._stagesList = stagesList;
			var stationNum = stagesList.length;

			// 清空
			this._destroyArrController(this._stationControllers, true);
			this._stationControllers = [];
			var i;
			for (i = 0; i < this._lines.length; i++) {
				this._lines[i].removeFromParent();
			}
			this._lines = [];

			// 判断当前已经通过的比赛点 【0 ~ pos_i】
			var pos_i = 0;
			for (i = 0; i < stationNum; i++) {
				if (this._stagesList[i].hasOwnProperty('isCurrent') && this._stagesList[i].isCurrent == 1) {
					pos_i = i;
					break;
				}
			}

			// 比赛站点间距调整
			if (stationNum == 1) {
				this._leftSpace = this._scrollviewWidth / 2;
				this._rightSpace = this._scrollviewWidth / 2;
			} else if (this._leftSpace + this._lineLength * (stationNum - 1) + this._rightSpace < this._scrollviewWidth) {
				this._lineLength = (this._scrollviewWidth - this._leftSpace - this._rightSpace) / (stationNum - 1);
			} else {
				// 比赛进程的路线图比scrollview长，设置触摸滑动
				this["schedule_scrollview"].setTouchEnabled(true);
			}

			// 比赛进程背景大小的设置
			this['s9s_progress_bg'].setPosition(cc.p(this._leftSpace, this._scrollviewHeight/2 - 5));
			this['s9s_progress_bg'].setContentSize(cc.size(this._lineLength * (stationNum - 1), 20.0));
			if (stationNum == 1) {
				this['s9s_progress_bg'].setVisible(false);
			} else {
				this['s9s_progress_bg'].setVisible(true);
			}

			// 添加比赛站点
			for (i = 0; i < stationNum; i++) {
				var station = this._createStationController(this._leftSpace + this._lineLength * i);
				this["schedule_scrollview"].addChild(station.rootNode, 2);
				station.refreshWithInfo(this._stagesList[i], i == stationNum - 1);
				this._stationControllers.push(station);
			}

			// 添加比赛进度条
			if (stationNum > 1) {
				for (i = 0; i < stationNum - 1; i++) {
					var line = this._createLineProgress();
					this["schedule_scrollview"].addChild(line, 1);
					line.setPosition(cc.p(this._leftSpace + this._lineLength * i, this._scrollviewHeight/2 - 5));
					this._lines.push(line);
					if (i < pos_i) {
						line.setPercentage(this._lineLength/this._lineSpriteLength * 100);
					}
				}
			}

			this._curStationNo = pos_i;

			// 设置scrollview的内容框大小
			this["schedule_scrollview"].setContentSize(cc.size(
				this._leftSpace + this._lineLength * (stationNum - 1) + this._rightSpace,
				this._scrollviewHeight
			));

			// 移动比赛进度所在的滚动框 让当前站点可见
			var offset_x = this["schedule_scrollview"].getContentOffset().x;
			var pos_x = this._stationControllers[this._curStationNo].rootNode.x;
			var off_side_x = this._scrollviewWidth - (pos_x + offset_x); // 目标站点距离右边界的距离
			if (off_side_x < this._rightSpace) {
				var next_offset_x = offset_x - (this._rightSpace - off_side_x);
				this["schedule_scrollview"].setContentOffset(cc.p(next_offset_x, 0), false);
			}

			this._stationControllers[this._curStationNo].arriveAction();

			// var that = this;
			// this.rootNode.scheduleOnce(function () {
			// 	that.wavesAction();
			// }, Math.random(10) + 5);
		},

		// 晋级 进度条前进一格
		doRise:function (callback) {
			this._runToCurStation(this._curStationNo + 1, callback);
		},

		refreshWithStages:function (info) {
			var stagesList = info || [];
			if (stagesList.length == 0) {
				return;
			}

			if (!this._stagesList || this._stagesList.length != stagesList.length) {
				this._initScheduleInfo(stagesList);
				return;
			}

			var stationNum = stagesList.length;
			// 判断当前已经通过的比赛点 【0 ~ pos_i】
			var pos_i = 0;
			for (var i = 0; i < stationNum; i++) {
				if (this._stagesList[i].isHere) {
					pos_i = i;
					break;
				}
			}

			if (pos_i > this._curStationNo) {
				this._runToCurStation(pos_i);
			}
		}

	});
})();