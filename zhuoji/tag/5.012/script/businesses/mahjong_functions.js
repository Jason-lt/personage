/*****************************************
 *  mahjong_global.js
    麻将全局变量
 *  mahjong
 *  业务层
 *  Created by nick.kai.lee on 15-12-29
 *  特殊说明：

    使用说明:
 */
(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.businesses.functions = {
		/*
		节点组
		将一定量的节点的某一个特性的方法形成一种toggle开关的效果.
		_prototype:原型方法
		_params:原型方法的参数数组(1:开,0关)
		_nodes:节点数组
		使用方法:
		var groups = _PA_GLOBAL_FUNCS.nodeGroup("setColor",
				[WHITE,YELLOW],[emojiIcon,defaultTxtIcon,chatIcon,broadcastIcon]);
		模式1：
		groups.setColor(0); 除了emojiIcon是YELLOW,其他4个都是WHITE
		groups.setColor(1); 除了defaultTxtIcon是YELLOW,其他4个都是WHITE
		模式2：
		groups.setColor(YELLOW,"all");//所有都设置为YELLOW
		*/
		nodeGroup:function(_prototype,_params,_nodes){
			var group  = {
				index  : null,
			};

			//group的_prototype方法可以有开关控制，第2个参数传bool即可
			group[_prototype] = function(){

				if (arguments[1] == "all") {
					for(var i in _nodes){
						_nodes[i][_prototype](arguments[0]);
					};
					group.index = null;
					return;
				};
				group.index   = arguments[0];
				var target    = _nodes[group.index];
				for(var i     = _nodes.length-1 ; i >= 0; --i){
					if (_nodes[i]&&_nodes[i]!=target) { _nodes[i][_prototype](_params[0]); };
				};
				
				if (target) { target[_prototype](_params[1]); };
			};

			group.getIndex = function(){
				return group.index;
			};	
			return group;
		},

		/*
		toggle按钮
		*/
		toggleButtonGroup:function(){
			var arg = arguments;
			for(var i in arg){
				if (arg[i].addTargetWithActionForControlEvents) {
					arg[i].addTargetWithActionForControlEvents(arg[i].getParent(), (function(_arguments,_index){
	        			return function(){
	        				 for(var j in _arguments){
		        			 	if (_arguments[j].setEnabled) {
		        			 		_arguments[j].setEnabled(_index!=j);
		        			 	};
		        			 };
	        			};
	        		})(arg,i), cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
				};
			};
		},

		/*
		CCControlButton用的在tableview上的按钮扩展,只要滑动了 就不响应按钮了
		*/
		tableViewButtonExtend:function( _controller, _node, _callFunc, _priorty ){
			
	        // 滑动按钮
	        var isScrolled = false;
	        _node.addTargetWithActionForControlEvents(_controller, function(){
	        	if (!isScrolled) { 
	        		_callFunc.apply(_controller,[]);
	        	};
	            isScrolled = false;
	        }, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);

	        _node.addTargetWithActionForControlEvents(_controller, function(){
	        	isScrolled = true;
	        }, cc.CONTROL_EVENT_TOUCH_CANCEL);

	        _node.addTargetWithActionForControlEvents(_controller, function(){
	            isScrolled = false;
	        }, cc.CONTROL_EVENT_TOUCH_DOWN);
	        if (_priorty) {
	        	_node.setTouchPriority(_priorty);
	        };
	        //tableview上的按钮可以穿透,优先级必须>tableview的-1,不然不能滑动
		},

		tableViewEdgeBlockExtend:function(_controller,_container,_blockFunc,_unblockFunc){
			var layer = cc.LayerColor.create(cc.c4b(127,0,0,0));
			layer.setTouchMode(cc.TOUCHES_ONE_BY_ONE); 
			layer.setContentSize(_controller.view.ccbRootNode.getContentSize());	
			_controller.view.ccbRootNode.addChild(layer);
			layer.setTouchEnabled(true);

			var blockFunc   = _blockFunc   || function(){};
			var unblockFunc = _unblockFunc || function(){};
			layer.onTouchBegan = function(touch, event){
				//获取GL坐标
				var s     = _container.getContentSize();
				var rec   = cc.rect(0,0,s.width,s.height);//cc.rect(p.x,p.y,s.width,s.height);
				var point1 = _container.convertToNodeSpace(touch.getLocation());

				if (!cc.rectContainsPoint(rec, point1)) {
					blockFunc();
				    return false; 
				};
				unblockFunc();
 				return false;
			};
		},

		/*
    	节点换父节点
    	return 旧父节点
    	*/
    	changeParent: function (_child, _newParent, _cpp) {
        	var child  = _child;
        	var parent = _newParent;
        	var oldParent;
        	if (child&&parent) {

				oldParent = child.getParent();
				if (!oldParent){
					this.addToParent(_child,_newParent,_cpp);
					return null;
				}

        		child.stopAllActions();

        		var size  = parent.getContentSize();
        		child.retain();
        		if (oldParent) {
        			child.removeFromParent(false);        			
        		}
        		parent.addChild(child);
        		child.release();
        		child.setPosition(_cpp?_cpp:cc.p(size.width*0.5,size.height*0.5));
        	}
        	return oldParent;
    	},

    	addToParent: function (_child, _newParent, _cpp) {
        	var child  = _child;
        	var parent = _newParent;
        	if (child&&parent) {
        		child.stopAllActions();
        		var size  = parent.getContentSize();
        		parent.addChild(child);
        		child.setPosition(_cpp?_cpp:cc.p(size.width*0.5,size.height*0.5));
        	}
    	},

		/*
		 节点换父节点
		 return 旧父节点
		 */
		changeParentByZOrder: function (_child, _newParent, _cpp,_zorder) {
			var child  = _child;
			var parent = _newParent;
			var oldParent;
			if (child && parent) {
				child.stopAllActions();
				oldParent = child.getParent();
				var size  = parent.getContentSize();
				child.retain();
				if (oldParent) {
					child.removeFromParent(false);
				}
				parent.addChild(child,_zorder);
				child.release();
				child.setPosition(_cpp?_cpp:cc.p(size.width*0.5,size.height*0.5));
			}
			return oldParent;
		},

    	randomRange: function (n,m){
  	       var c = m-n+1;  
           return Math.floor(Math.random()*c + n);
   		},

   		getWorldBoundingRect:function(_node,_scale){
			var scale   = _scale || 1;
            var point   = _node.getParent().convertToWorldSpace(_node.getPosition())
            var size    = _node.getContentSize();
            size.width  = size.width*scale;
            size.height = size.height*scale
            var bound = cc.rect(
                point.x-size.width*_node.getAnchorPoint().x,
                point.y-size.height*_node.getAnchorPoint().y,
                size.width,size.height);
            return bound;
		},

		progressBuilder:function(_parent,_type,_res){
			var progress    = cc.ProgressTimer.create(
				cc.Sprite.createWithSpriteFrameName(_res));
	        progress.setType(_type);
	        progress.setMidpoint(cc.p(0,0.5));
	        progress.setBarChangeRate(cc.p(1,0));
	        progress.setAnchorPoint(cc.p(0,0.5));
	        _parent.addChild(progress);
	        progress.setPercentage(0);
            progress.setPositionY(_parent.getContentSize().height/2);
            
            progress.update = function(_value){
            	progress.setPercentage(_value);
            };
            return progress;
	    },

		/**
		 * 格式化金币值，不带舍入
		 * @param score
		 * @returns {string}
		 */
		formatGold:function(score){
			var tar = "";
			if (score < 0){
				tar = "-";
				score = -score;
			}

	    	var scoreText = "";
			var arr;
			var endStr;
			var sp;
			if (score < 100000){
				scoreText = score + "";
			}
			else if (score >= 100000 && score < 100000000){
				scoreText = (score / 10000) + "";
				if (scoreText.indexOf(".") == -1){
					scoreText += ".000";
				}
				else{
					scoreText += "000";
				}
				arr =  scoreText.split(".");
				var wanStr = arr[0];
				sp = 1;
				if (wanStr.length == 1){
					sp = 3;
				}
				else if (wanStr.length == 2){
					sp = 2;
				}
				else if (wanStr.length == 3){
					sp = 1;
				}
				else if (wanStr.length == 4){
					sp = 1;
				}

				endStr = arr[1].substr(0,sp);
				scoreText = wanStr + "." + endStr + "万";

			}
			else{
				scoreText = (score / 100000000) + "";

				if (scoreText.indexOf(".") == -1){
					scoreText += ".000";
				}
				else{
					scoreText += "000";
				}

				arr =  scoreText.split(".");

				var yiStr = arr[0];
				sp = 1;
				if (yiStr.length == 1){
					sp = 3;
				}
				else if (yiStr.length == 2){
					sp = 2;
				}
				else if (yiStr.length == 3){
					sp = 1;
				}
				else{
					sp = 1;
				}

				endStr = arr[1].substr(0,sp);
				scoreText = yiStr + "." + endStr + "亿";
			}

			return tar + scoreText;
		},

		formatTimeString:function(strFormat, seconds){
			//源自原版麻将代码
		    var _seconds = seconds;
		    if(!strFormat)
		    {
		        GLOBAL_OBJ.LOGD('formatTimeString', 'Null format! - formatTimeString');
		        return '';
		    }
		    _seconds = Math.ceil(_seconds);
		    var s = _seconds % 60;
		    var m = Math.floor(_seconds / 60) % 60;
		    var h = Math.floor(_seconds / 3600);

		    var str = strFormat.replace('s', s < 10 ? '0' + s : s);
		    str = str.replace('m', m < 10 ? '0' + m : m);
		    str = str.replace('h', h < 10 ? '0' + h : h);
		 
		    return str;
		},

		currencyUnitFormat:function(_value){
			return _value>=100000?(_value/10000)+"万":_value;
		},

		textureChange : function(_sprite,_image){
			if (_sprite == null || _image == null) { return; }

            var path  = jsb.fileUtils.fullPathForFilename(_image);
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(_image);

            if (!frame && path) {
				var sp    = cc.Sprite.create(path);
	            var size  = sp.getContentSize();
	            var rect  = cc.rect(0, 0, size.width, size.height);
	            frame = cc.SpriteFrame.create(path, rect);

            }

	    	if (frame){
	    		var size = frame.getOriginalSizeInPixels();
	            _sprite.setSpriteFrame(frame);
	            _sprite.setContentSize(size);
	        }
        },

        // 将数字格式化为 100,000这种格式
        formatInteger:function(_num){
			var str = _num.toString();
			var newStr = "";

			var index = 0;
			for (var i = str.length-1; i >= 0; i--){
				newStr += str[i];
				index++;
				if (index == 3 && i > 0){
					index = 0;
					newStr += ",";
				}
			}

			return newStr.split("").reverse().join("");
		},

		// 将大于等于1万的数字以万为单位返回
		formatBigInteger:function(_num, _point){
			var num   = _num || 0;
			var point = _point || 2; // 保留到小数点后几位

			if (num > 9999){
				var result = num/10000;
				return result.toFixed(point)+"万";
			}else{
				return num;
			}
		},

		/**
		 * 根据时间戳格式化时间字符串
		 * @param _strFormat (yy-mm-dd h:m:s)
		 * @param seconds
		 * @returns {*}
		 */
		formatTimeForTimeStamp:function(_strFormat, _timestamp){
		    var dt = new Date(_timestamp*1000);
		    
		    var yy = dt.getFullYear();
		    var mm = dt.getMonth()+1;
		    var dd = dt.getDate();
		    var h  = dt.getHours();
		    var m  = dt.getMinutes();
		    var s  = dt.getSeconds();

		    var str = _strFormat.replace('yy', yy < 10 ? '0' + yy : yy);
		    str = str.replace('mm', mm < 10 ? '0' + mm : mm);
		    str = str.replace('dd', dd < 10 ? '0' + dd : dd);
		    str = str.replace('h', h < 10 ? '0' + h : h);
		    str = str.replace('m', m < 10 ? '0' + m : m);
		    str = str.replace('s', s < 10 ? '0' + s : s);

		    return str;
		},

		/**
		 * 根据时间戳返回周几，如果是当天，返回“今天”
		 */
		getDayForTimeStamp:function(_timestamp){
			var dt    = new Date(_timestamp*1000);
			var curDt = new Date(GLOBAL_OBJ.bkernel.utils.GlobalTimer.getTime()*1000);

			if (dt.getDate() == curDt.getDate()){
				return "今天";
			}else if (dt.getDate()-curDt.getDate() == 1){
				return "明天"
			}else{
				var days = ["周日","周一","周二","周三","周四","周五","周六"];
				return days[dt.getDay()] || "";
			}
		},

		/*
		 * 给出一组进度条刻度以及当前刻度，计算出进度条的显示百分比
		 * 这里有一个前提，就是每个相邻刻度之间UI显示长度是一样的
		 */
		getProcessPercent:function(_processes, _curProcess, _length, _totalLength){
			var processes  = _processes  || [];
			var curProcess = _curProcess || 0;

			if (processes.length <= 0){
				return 0;
			}

			if (curProcess >= processes[processes.length-1]){
				return 100;
			}

			var index = 0; // 处于第几个刻度之前 0开始
			for (var i = 0; i < processes.length; i++){
				if (curProcess <= processes[i]){
					index = i;
					break;
				}
			}

			// 计算显示百分比
			var front  = _length / _totalLength * 100;       // 第一个刻度前面那段的显示百分比
			var normal = processes.length>1?(100-front)/(processes.length-1):0; // 每个刻度之间的显示百分比
			if (index <= 0){
				return curProcess/processes[0]*front;
			}else{
				return front + normal*(index-1) + (curProcess-processes[index-1])/(processes[index]-processes[index-1])*normal;
			}
		},

		/* 
		 * 用户名按规则进行截取
		 * _enLen 纯英文字母保留长度，_chLen 如果有中文保留长度
		 */
		formatUserName:function(_name, _enLen, _chLen){
			var formatName = "";
			var enLen = _enLen || 9;
			var chLen = _chLen || 6;

			if (_name){
				for (var i = 0; i < enLen; i++){
					if (_name.charAt(i).charCodeAt() > 255){
						formatName += i<chLen
						?(_name.length>chLen?_name.slice(0, chLen)+"...":_name)
						:_name.slice(0, i+1) + (_name.length-1==i?"":"...");

						return formatName;
					}
				}

				formatName += _name.length>enLen?(_name.slice(0, enLen)+"..."):_name;
			}

			return formatName;
		},

		/*
		@每日特定时间点时分秒和当前时间的时间差（时间已经过去，则返回明日特定时刻的时间差）*/
		daily_time_difference:function(_hour, _min, _sec){
			var date  = new Date()
			var year  = date.getFullYear();
			var month = date.getMonth();//0~11
			var day   = date.getDate();
			var hour  = date.getHours();
			var min   = date.getMinutes();
			var sec   = date.getSeconds();

			//计算白天10点的时间戳
			var special = new Date();
			special.setFullYear(year);
			special.setMonth(month);
			special.setDate(day);
			special.setHours(_hour);
			special.setMinutes(_min);
			special.setSeconds(_sec);

			var diff = Math.floor( (special.getTime() - date.getTime()) / 1000 );
			return diff >= 0?diff:24*3600-diff;
		},

		autoScaleFactor:function(){
	    	var size   = cc.Director.getInstance().getWinSize();
	    	var origin = GLOBAL_OBJ.businesses.global.SCREEN_SIZE.w/GLOBAL_OBJ.businesses.global.SCREEN_SIZE.h;
	    	var cur    = size.width/size.height;
	    	var value  = cur/origin;
	    	// return value>=1?1:value;
	    	var a = GLOBAL_OBJ.businesses.global.SCREEN_SIZE.h/size.height
	    	var b = GLOBAL_OBJ.businesses.global.SCREEN_SIZE.w/size.width
	    	return a>b?a:b
	    },

	    ccpSub:function(a,b){
	    	return cc.p(a.x-b.x,a.y-b.y);
	    },

		/*
		 动态创建分享图片 */
		createShareImg:function(_callFunc, _shareNode){
			var winSize = cc.Director.getInstance().getWinSize();

			var parentNode = cc.Node.create();
			parentNode.setContentSize(winSize);

			var sprite1 = cc.Sprite.create(GLOBAL_OBJ.RES.NOPACK_XLMJ_ZM_TX_DAHU_BJ_JPG);//大背景图
			this.changeParent(_shareNode.womanAnimal, sprite1, cc.p(301.0, -1.0));
			_shareNode.womanAnimal.setVisible(true);
			var sprite3 = cc.Sprite.create(GLOBAL_OBJ.RES.NOPACK_BUDGETS_SICHUAN_TASK_SHARE_BOTTOM_PNG);//底部

			parentNode.addChild(sprite1);
			parentNode.addChild(sprite3);

			var curSceen = cc.Director.getInstance().getRunningScene();
			curSceen.addChild(parentNode);//把父节点加载到当前场景上去，不然绘制不出来
			parentNode.setPosition(0, 0);

			// var screenTexture = cc.RenderTexture.create(winSize.width*0.7, winSize.height*0.7, cc.Texture2D.PIXEL_FORMAT_RGBA8888);
			var screenTexture = cc.RenderTexture.create(winSize.width, winSize.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);

			sprite1.setPosition(winSize.width/2, winSize.height/2);
			sprite1.setPosition(cc.director.convertToGL(sprite1.getPosition()));
			sprite3.setAnchorPoint(cc.p(0.5,0));
			sprite3.setPosition(winSize.width/2, winSize.height);
			sprite3.setPosition(cc.director.convertToGL(sprite3.getPosition()));

			var sharenode = _shareNode.getRootNode();
			sharenode.setPosition(winSize.width/2, winSize.height/2);
			sharenode.setPosition(cc.director.convertToGL(sharenode.getPosition()));

			// 渲染纹理开始捕捉
			screenTexture.begin();

			// 参与绘制
			parentNode.visit();
			sharenode.visit();
			_shareNode.task_share_mj_node.visit();
			_shareNode.task_share_tou.visit();

			// 结束捕捉
			screenTexture.end();
			parentNode.setVisible(false);
			// 保存为JPEG图片
			var name = 'mj_task_share.png';
			screenTexture.saveToFile(name, true);
            var pic =   jsb.fileUtils.getWritablePath() + name;
            GLOBAL_OBJ.LOGD(this._TAG, "share图片路径： "+pic );
			// 处理回调
			var callFunc = _callFunc || function(){};
			callFunc(name);
		},

		getTableFuzzyBg : function () {//高斯模糊
            var curSceen = cc.Director.getInstance().getRunningScene();
            // curSceen.setScale(1);
            curSceen.setAnchorPoint(cc.p(0, 0));

			var _winSize = cc.director.getWinSize();
			var bgTexture = new cc.RenderTexture(_winSize.width, _winSize.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
			bgTexture.begin();

			// 当前场景参与绘制
			curSceen.visit();

			bgTexture.end();

			var bgTemp = ty.DisplayUtil.getScreenBlurSprite(bgTexture.getSprite().getTexture(), 1, 30, 8);
			bgTemp.setFlippedY(false);
			bgTemp.setAnchorPoint(cc.p(0, 0));
			// bgTemp.setPosition(cc.p(_winSize.width/2, _winSize.height/2));
            bgTemp.setPosition(cc.p(0, 0));
			bgTemp.getTexture().setAntiAliasTexParameters();
			// bgTemp.retain();
			return bgTemp;
		},

	    /*
	     截屏 */
	    screenShot:function(_callFunc){
	    	var curSceen = cc.Director.getInstance().getRunningScene();
	    	var ancPos = curSceen.getAnchorPoint();
	    	curSceen.setScale(0.7);
	    	curSceen.setAnchorPoint(cc.p(0, 0));
    		var winSize = cc.Director.getInstance().getWinSize();
			// var screenTexture = cc.RenderTexture.create(winSize.width*0.7, winSize.height*0.7, cc.Texture2D.PIXEL_FORMAT_RGBA8888);
    		var screenTexture = cc.RenderTexture.create(winSize.width*0.7, winSize.height*0.7, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
            // 渲染纹理开始捕捉
            screenTexture.begin();

            // 当前场景参与绘制
            curSceen.visit();
            // 结束捕捉
            screenTexture.end();
            // 保存为JPEG图片
            var name = 'mj_screen_shot.png';
            screenTexture.saveToFile(name, true);

            // 处理回调
            var callFunc = _callFunc || function(){};
            // 截图  延迟0.5s再截图，不然会出现显示不全(用了tableview的时候，安卓机上会出现这个问题)
            curSceen.runAction(cc.Sequence.create(
	        	cc.DelayTime.create(1), 
	        	cc.CallFunc.create(function(){
	        		callFunc(name);
	        		curSceen.setScale(1);
                    curSceen.setAnchorPoint(ancPos);
	        	}))
            );
	    },

		/**
		 * 播放一个任意位置的牌桌特效
		 * @param ccbName 特效名
		 * @param pt 世界坐标值
		 * @param clean 播放完，是否清理
		 * @param scale 特效放大倍数
		 * @param beforePlayFun 开始之前的方法
		 * @param afterPlayFun 开始之后的方法
		 */
		playTableEffct:function(ccbName, pt, clean, scale, beforePlayFun, afterPlayFun){

			var pars = [ccbName, pt, clean];

			if (!scale){
				scale = 1
			}

			pars.push(scale);

			if (beforePlayFun != null){
				pars.push(beforePlayFun);
			}
			else{
				pars.push(null);
			}

			if (afterPlayFun != null){
				pars.push(afterPlayFun);
			}
			else{
				pars.push(null);
			}

			GLOBAL_OBJ.bkernel.utils.Notification.trigger(GLOBAL_OBJ.businesses.Events.SHOW_TABLE_EFFECT, pars);
		},

		getPreResCfg:function () {
			if (!this.preResCfg){
				var searchPach = hall.searchPach;
				if (ty.LOCAL_JS_DEBUG && ty.LOCAL_JS_DEBUG.enabled) {
					searchPach = ty.LOCAL_JS_DEBUG.gymjPath + "/publish";
				}
				else{
					searchPach = hall.searchPach || "games/";
					searchPach += GLOBAL_OBJ.GAMENAME;
				}

				this.preResCfg = [
					searchPach + "/img/budget_001.png",
					searchPach + "/img/common.png",
					searchPach + "/img/mahj_create_room_001.png",
					searchPach + "/img/mahj_emo_001.png",

					searchPach + "/img/mahj_table_001.png",
					searchPach + "/img/mahj_new_tiles_001.png",

					searchPach + "/img/mahj_zhanji_001.png",
					searchPach + "/img/xlmj_zm_tx_kaiju.png",
					searchPach + "/img/mahj_effect.png",

					searchPach + "/img/xlmj_zm_tx_pxtx.png",
					searchPach + "/img/xlmj_zm_tx_pxtx1.png",
					searchPach + "/img/xlmj_zm_tx_pxtx2.png",
				];
			}

			return this.preResCfg;
		},
		/**
		 * 资源预加载
		 */
		loadPreRes:function () {
			//资源预加载
			var RES = this.getPreResCfg();
			ty.Util.addImageArrAsync(
				RES,
				this,
				function(pointer, fullFileName){
					var filePath = fullFileName.replace('.png', '.plist');
					GLOBAL_OBJ.LOGD("addImageArrAsync", "加载大图:"+filePath);
					// 加到精灵帧缓存中
					cc.SpriteFrameCache.getInstance().addSpriteFrames(filePath);
				},
				function(){
				}
			);
		},
		/**
		 * 卸载预加载资源
		 */
		unLoadPreRes:function () {
			var RES = this.getPreResCfg();
			var filePath;
			for (var i = 0; i < RES.length; i++){
				filePath = RES[i];
				filePath = filePath.replace('.png', '.plist');
				cc.SpriteFrameCache.getInstance().removeSpriteFrameByName(filePath);
				GLOBAL_OBJ.LOGD("unLoadPreRes", "从缓存中删除预加载资源:" + filePath);
			}
		},

		/**
		 * 根据坐位号返回风位名
		 * @param seatId 坐位号
		 * @returns {*} 风位名
		 */
		getWindName:function (seatId) {
			var windMapName = [
				["东", "南", "西", "北"],
				["北", "东", "南", "西"],
				["西", "北", "东", "南"],
				["南", "西", "北", "东"]];

			var winds = windMapName[GLOBAL_OBJ.table.models.TableInfo.getBankerSeatId()];
			return winds[seatId];
		},
		
		getMaiMaInfoBySeatId:function (seatId) {
			var winName = this.getWindName(seatId);
			var maInfo = "";
			if (winName == "东"){
				maInfo = "1.5.9.东";
			}
			else if (winName == "南"){
				maInfo = "2.7.南.中";
			}
			else if (winName == "西"){
				maInfo = "3.7.西.发";
			}
			else if (winName == "北"){
				maInfo = "4.8.北.白";
			}

			return maInfo;
		},

		/**
		 * 动态适配node坐标
		 * 参数：中点坐标，间距，宽度/高度，node总数
		 * 以(0，0)为锚点
		 */
		adapterPos4Nodes:function (_pos, _space, _length, _count)
		{
			var scope_ = {};
			if (_count <= 0)
			{
				return;
			}
			else if (_count == 1)
			{
				scope_[0] = _pos - _length/2;
				return scope_;
			}

			// 偶数，则平均中点左右，奇数，则双倍间距平均中心node左右
			var index = _count / 2;
			if (_count % 2)
			{
                _space *= 2;
                for (var i = 0; i < _count; i++)
                {
                	if (i <= index)
					{
                        scope_[i] = _pos - (index-i) * (_length+_space);
					}
					else
					{
                        scope_[i] = _pos + (i-index) * (_length+_space);
					}
                }
			}
			else
			{
				for (var i = 0; i < _count; i++)
				{
					if (i < index)
					{
						scope_[i] = _pos - (index-i) * _length - _space/2 - (index-i-1) * _space;
					}
					else
					{
						scope_[i] = _pos + (i-index) * (_length+_space) + _space/2;
					}
				}
			}

			return scope_;
		},

		/**
		 * 金币场，下一局
		 */
		coinTableDoNext:function () {

			var reason = GLOBAL_OBJ.table.models.Leave.getMineLeaveReson();
			var playMode = GLOBAL_OBJ.table.models.TableInfo.getPlayMode();
			var roomId = GLOBAL_OBJ.table.models.TableInfo.getRoomId();
			var tableId = GLOBAL_OBJ.table.models.TableInfo.getTableId();
			var seatId = GLOBAL_OBJ.table.models.TableInfo.getActiveServerSeatId();

			GLOBAL_OBJ.LOGD("onContinue : ", reason);
			GLOBAL_OBJ.LOGD("playMode :", playMode);

			var quickWhere = GLOBAL_OBJ.QuickStartWhere.table;

			if (reason){
				if( reason == "chipNotEnough"){//服务端已经离开，并且原因是金币不足,发送当前玩法的快速开始
					GLOBAL_OBJ.businesses.network.C2S.requestGameStartOnlyPlayMode(playMode, quickWhere);
				}else if(reason == "autoDecide"){//服务端离开了，原因托管，如果金币不足跟托管同时发生，金币不足优先级高
					GLOBAL_OBJ.businesses.network.C2S.requestGameStartCoin(playMode, roomId, quickWhere);
				}else if(reason == "normalReadyTimeOut"){//金币场未准备超时踢出
					GLOBAL_OBJ.businesses.network.C2S.requestGameStartCoin(playMode, roomId, quickWhere);
				}else if(reason == "coinTableFinish"){//金币桌牌桌结束，用户离桌，重新组桌
					GLOBAL_OBJ.businesses.network.C2S.requestGameStartOnlyPlayMode(playMode, quickWhere);
				}else{//服务端离开了，原因不是金币不足,其他reason发送当前玩法，当前房间的快速开始
					GLOBAL_OBJ.businesses.network.C2S.requestGameStartCoin(playMode, roomId, quickWhere);
				}
			}else{
				//没收到leave消息，此时还在牌桌上，点击继续或者下一句
				GLOBAL_OBJ.table.network.C2S.requestNextRound(roomId, tableId, seatId);
			}
		},

        getMahjPlugInVersion:function () {
            var file = 'games/' + GLOBAL_OBJ.GAMENAME + '/version.json';
            var that = this;
            var plugInVersion;
            if(that.version){

                plugInVersion =  that.version;
            }else {
                hall.GlobalFuncs.readFile(file,function(content) {
                    GLOBAL_OBJ.LOGD(that._TAG, "getMahjPlugInVersion: " + content);
                    if ("" != content) {
                        var jsonVersion = JSON.parse(content);
                        that.version = jsonVersion['version'];
                        plugInVersion = that.version;
                        GLOBAL_OBJ.LOGD(that._TAG, "plugInVersion: " + that.version);

                    } else {
                        that.version = '0';
                    }
                })
            }
            return plugInVersion + "";
        },

    };
})();