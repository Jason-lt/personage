// File: mahj_match_waiting_station_controller.js
// Date: 2017-11-22
// Author: xujing
/* Description:
*  比赛主等待界面的上的比赛进程站点 位于主等待界面的上方 属于公共UI
*/

(function () {
	var GLOBAL_OBJ = guiyang;

	var MatchWordImg = {
		'0' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_NUMBER_0_PNG, 'left':18, 'right':18},
		'1' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_NUMBER_1_PNG, 'left':35, 'right':35},
		'2' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_NUMBER_2_PNG, 'left':24, 'right':20},
		'3' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_NUMBER_3_PNG, 'left':18, 'right':18},
		'4' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_NUMBER_4_PNG, 'left':22, 'right':20},
		'5' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_NUMBER_5_PNG, 'left':18, 'right':18},
		'6' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_NUMBER_6_PNG, 'left':20, 'right':18},
		'7' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_NUMBER_7_PNG, 'left':18, 'right':18},
		'8' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_NUMBER_8_PNG, 'left':18, 'right':18},
		'9' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_NUMBER_9_PNG, 'left':20, 'right':22},
		'比' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_WORD_BI_PNG, 'left':15, 'right':15},
		'第' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_WORD_DI_PNG, 'left':15, 'right':15},
		'分' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_WORD_FEN_PNG, 'left':15, 'right':15},
		'海' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_WORD_HAI_PNG, 'left':15, 'right':15},
		'级' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_WORD_JI_PNG, 'left':15, 'right':15},
		'晋' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_WORD_JIN_PNG, 'left':15, 'right':15},
		'决' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_WORD_JUE_PNG, 'left':15, 'right':15},
		'轮' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_WORD_LUN_PNG, 'left':15, 'right':15},
		'强' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_WORD_QIANG_PNG, 'left':15, 'right':15},
		'赛' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_WORD_SAI_PNG, 'left':15, 'right':15},
		'选' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_WORD_XUAN_PNG, 'left':15, 'right':15},
		'总' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_WORD_ZONG_PNG, 'left':15, 'right':15},
		'组' : {'img':GLOBAL_OBJ.RES.MATCH_WAITING_WORD_ZU_PNG, 'left':15, 'right':15}
	};

	GLOBAL_OBJ.businesses.scenes.MatchWait.MatchWaitingStationController = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.MatchWait.MatchWaitingStationController",

		ctor:function () {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG, " ctor new");

			this.init(GLOBAL_OBJ.RES.MAHJ_MATCH_WAITING_STATION_CCBI);
		},

		onLoad: function () {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG," in _load");

			// 字体描边
			this["label_station_description"].enableOutline(cc.color(38, 96, 168), 3);
		},

		onCleanup:function () {
			this._super();
			GLOBAL_OBJ.LOGD(this._TAG," in onCleanup");
		},


		/// 根据字符串拼出图片
		_stringToImg : function (str, map) {
			var node = new cc.Node();
			var pos_x = 0;
			var height_max = 0;
			for (var i = 0; i < str.length; i++) {
				var charKey = str.charAt(i);
				if (map[charKey]) {
					var charImg = cc.Sprite.createWithSpriteFrameName(map[charKey]['img']);
					charImg.setAnchorPoint(cc.p(0, 0));
					charImg.setPosition(cc.p(pos_x - map[charKey]['left'], 0));
					node.addChild(charImg);
					pos_x += charImg.getContentSize().width - map[charKey]['left'] - map[charKey]['right'];
					var h = charImg.getContentSize().height;
					height_max = Math.max(height_max, h);
				}
			}
			node.setContentSize(cc.size(pos_x, height_max));
			node.setAnchorPoint(cc.p(0.5, 0.5));
			return node;
		},

		_initStation:function (station, crown) {
			var stationInfo = station;
			GLOBAL_OBJ.LOGD(this._TAG, "_initStation:" + JSON.stringify(stationInfo));

			var str = '';
			if (typeof(stationInfo.name) != 'undefined' && stationInfo.name != '') {
				str = stationInfo.name;
			} else {
				if (stationInfo.stationType == "haixuansai") {
					str = '海选赛';
				} else if (stationInfo.stationType == "fenzusai") {
					str = '分组赛';
				} else if (stationInfo.stationType == "jinjisai") {
					str = '晋级赛';
				} else if (stationInfo.stationType == "n_qiangsai") {
					str = stationInfo.n + '强赛';
				} else if (stationInfo.stationType == "zongjuesai") {
					str = '总决赛';
				} else if (stationInfo.stationType == "juesai") {
					str = '决赛';
				} else if (stationInfo.stationType == "lun") {
					str = '第' + stationInfo.n + '轮';
				}
			}
			var nameImg = this._stringToImg(str, MatchWordImg);
			nameImg.setScale(0.4);
			this['match_name_node'].addChild(nameImg);

			if (crown) {
				nameImg.setScale(0.5);
			}

			if (stationInfo.des == '1人晋级') {
				this["label_station_description"].setString('1人');
				this["label_station_description2"].setString('夺冠');
			} else {
				var desc = stationInfo.des.replace("晋级", "");
				this["label_station_description"].setString(desc);
				this["label_station_description2"].setString("晋级");
			}
		},

		_refreshNQiangSai:function (num) {
			if (typeof(num) != "number" || num % 1 !== 0 || num === 0) {
				GLOBAL_OBJ.LOGD(this._TAG, "._refreshNQiangSai ERROR num:" + num);
				return;
			}
			var strNum = String(num);

			var pos_x = 0;
			for (var i = strNum.length - 1; i >= 0; i--) {
				var c = strNum.charAt(i);
				var sprNum = cc.Sprite.createWithSpriteFrameName("match_waiting_number_" + c + ".png");
				sprNum.setAnchorPoint(1.0, 0.5);
				sprNum.setPositionX(-pos_x); // 将数字图片依次放在‘强赛两个字’的左边
				this["o_pos"].addChild(sprNum);

				pos_x += sprNum.getContentSize().width;
			}

			// 强赛 两个字的宽度
			var w_qiangsai = 0.7 * this["img_station_n_qiangsai"].getContentSize().width;

			//pos_x为所有数字的宽度 w_qiangsai为‘强赛’两个字的宽度 img_station_n_qiangsai的anchorpoint在‘强赛‘最右边
			// 因此拼出的'NNN强赛'字样的x坐标在(pos_x + w_qiangsai)/2的时候 居中
			this["img_station_n_qiangsai"].setPositionX((pos_x + w_qiangsai)/2);
		},

		refreshWithInfo:function (info, crown) {
			// {
			// 	isPass: true,               // ---- 是否晋级了
			// 	stationType: "n_qiangsai",  // ---- 比赛类型 [海选赛、分组赛、N强赛、总决赛]
			// 	n: 8,						// ---- n强赛，
			// 	isHere: false,              // ---- 比赛是否达到此处
			// 	desc: "8人晋级"              // ---- 比赛描述
			// }
			this._initStation(info, crown);
		},

		// 玩家从当前站点晋级时 调用该动画
		passAction:function () {
			this._isPassAction = true;
			this.rootNode.animationManager.setCompletedAnimationCallback(this, this._finishPass);
			this.rootNode.animationManager.runAnimationsForSequenceNamedTweenDuration('pass', 0);
		},

		_finishPass:function () {
			if (this._isPassAction) {
				this._isPassAction = false;
			}
		},

		// 玩家晋级到当前站点时 调用当前动画
		arriveAction:function () {
			this.rootNode.animationManager.runAnimationsForSequenceNamedTweenDuration('arrive', 0);
		}
	});

})();