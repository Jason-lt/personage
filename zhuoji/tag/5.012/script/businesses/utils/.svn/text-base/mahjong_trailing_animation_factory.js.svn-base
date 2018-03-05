/*****************************************
 *  mahjong_trailing_animation_factory.js
    麻将 拖尾工厂
 *  mahjong

 *  Created by nick.kai.lee on 15-12-28
 *  特殊说明：

    使用说明:
	1.必要参数，可选参数参考init函数说明
	GLOBAL_OBJ.businesses.utils.Trailing.Factory.install("Trailing name",{
		class     : GLOBAL_OBJ.businesses.windows.LuckyWheel.Tail,
		parents   : [this.slotNode_1,this.slotNode_2,this.slotNode_3,this.slotNode_4,this.slotNode_5],
		count     : 1,
		//可选参数
		order     : GLOBAL_OBJ.businesses.utils.Trailing.Order.CLOCKWISE,
		mode      : GLOBAL_OBJ.businesses.utils.Trailing.Mode.SNAKE
	});

	GLOBAL_OBJ.businesses.utils.Trailing.Factory.uninstall("Trailing name");
	
	PS:
	框架3.78开始 playEffect 返回值安卓上不可靠，因为是异步实现。


	2.3个控制api
	GLOBAL_OBJ.businesses.utils.Trailing.Factory.start("Trailing name",0);
	GLOBAL_OBJ.businesses.utils.Trailing.Factory.stop("Trailing name",0,function(){});
	GLOBAL_OBJ.businesses.utils.Trailing.Factory.cancel("Trailing name");
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS	= GLOBAL_OBJ.businesses.functions;
	
	/*
	@数值单向边界判断*/
	var ___f_single_edge = function(_value,_min,_max){
		var value = _value;
		value     = value<_min?_min:value;
		value     = value>_max?_max:value;
		return value
	};

	/*
	@数值反向边界判断*/
	var ___f_oppsite_edge = function(_value,_min,_max){
		var value = _value;
		value     = value<_min?_max:value;
		value     = value>_max?_min:value;
		return value
	};

	/*
	@拖尾效果工厂*/
	var EFFECT_FACTORYS = {
		/*
		@贪吃蛇效果工厂*/
		snakes:function(_start,_value,_count){
			// var v = _value;
			var p = [];
			var v = [];
			for(var i = 0; i < _count; ++i){
				v[i]  = _value;//每次运动的位移量
				p[i]  = _start;//每个尾节点的起始位置
 			};
 			/*
 			@真正记步函数
 			@param _index: 每个尾巴的编号，因为每个尾巴的位置都不一样
 			@param _min: 尾巴移动位置编号的最小编号
 			@param _max: 尾巴移动位置编号的最大编号	*/
			return function(_index,_min,_max){
				var index = p[_index];
				p[_index] = p[_index] + v[_index];
				p[_index] = ___f_oppsite_edge(p[_index],_min,_max);
				return index;
			};
		},
		/*
		@雨刷器效果工厂*/
		wipers:function(_start,_value,_count){
			var p = [];
			var v = [];
			for(var i = 0; i < _count; ++i){
				v[i]  = _value;
				p[i]  = _start;
 			};
			return function(_index,_min,_max){
				var index = p[_index];
				v[_index] = p[_index]<=_min? 1:v[_index];
				v[_index] = p[_index]>=_max?-1:v[_index];
				p[_index] += v[_index];
				return index;
			};
		}
	};

	/*
	@拖尾模块 模式&顺序*/
	GLOBAL_OBJ.businesses.utils.Trailing = {
		Mode:{
			SNAKE :"snake",
			WIPER :"wiper",
		},

		Order:{
			CLOCKWISE     : "clockwise",
			ANTICLOCKWISE : "anticlockwise",
		},
	};

	/*
	@拖尾模块工厂*/
	GLOBAL_OBJ.businesses.utils.Trailing.Factory = (function(){
		/*
		@拖尾对象*/
		var Trailing = cc.Class.extend({
			_TAG:"Trailing",
			ctor:function(){
				/*
				@配置参数*/
				this.params = {
					start   : 0,
					stop    : null,
					sprites : [],
					onFinished : function(){},
				};

				this.audioEffectId = null;

				/*
		        @ extend 区域
		        */
		        ty.extend.schedulerExtend(this);
			},

			delete:function(){
				this.unscheduleAll(); 
				for(var i in this.params.sprites){
					this.params.sprites[i].view.ccbRootNode.removeFromParent();
				};
				this.params = null;
				this.config = null;
				if (this.audioEffectId) {
					hall.AudioHelper.stopEffect(this.audioEffectId);
					this.audioEffectId = null;
				};
				this.unschedule("SOUND");
			},

			/*
			@拖尾配置
			parents
			class
			count
			order：顺序（clockwise&anticlockwise）顺时针逆时针
			mode: 模式 （贪吃蛇，雨刷器）
			*/
			init:function(_config){
				this.config = {
					parents : _config.parents||[],
					class   : _config.class||"",
					count   : _config.count||0,
					order   : _config.order||GLOBAL_OBJ.businesses.utils.Trailing.Order.CLOCKWISE,
					mode    : _config.mode ||GLOBAL_OBJ.businesses.utils.Trailing.Mode.SNAKE,
				};
			},

			/*
			@控制接口*/
			stop:function(_position,_callback){
				this.params.stop       = _position;
				this.params.onFinished = _callback||function(){};
			},

			cancel:function(){
				this.unscheduleAll();
				for(var i in this.params.sprites){
					this.params.sprites[i].view.ccbRootNode.setVisible(false);	
				};

				if (this.audioEffectId) {
					hall.AudioHelper.stopEffect(this.audioEffectId);
					this.audioEffectId = null;
				};
				this.unschedule("SOUND");
			},

			start:function(_positon){
				var that     = this;
				var config   = this.config;
				var params   = this.params;
				var max      = config.count;//尾巴数量

				params.start = _positon||0;//拖尾动画起点
				//@顺序模式
				var ORDER    = { 
					order : config.order,//顺时针&逆时针
					value : config.order == GLOBAL_OBJ.businesses.utils.Trailing.Order.CLOCKWISE?1:-1,//量
				};

				//@特效模式
				var MODE     = {
					mode  : config.mode||GLOBAL_OBJ.businesses.utils.Trailing.Mode.SNAKE,//默认贪吃蛇模式
					f    : function(){},
				};

				switch(config.mode){
					case GLOBAL_OBJ.businesses.utils.Trailing.Mode.SNAKE:
					//每一个尾节点 下一步位置的编号
					MODE.f   = EFFECT_FACTORYS.snakes(params.start,ORDER.value,max);
					break;
					case GLOBAL_OBJ.businesses.utils.Trailing.Mode.WIPER:
					MODE.f   = EFFECT_FACTORYS.wipers(params.start,ORDER.value,max);
					break;
					default:
					break;
				};

				/*
				@尾巴开始移动&结束移动*/
				var ___f_motions = (function( _start ){
					var start    = _start; //当前移动起始位置(拖尾移动初始位置 start from 0)
					return [
						/*
						@开始移动*/
						function(_count,_callback){
							var callback = _callback||function(){};
							var count    = _count >= max ? max : _count;//移动的尾巴数量
							var index    = 0;
							for(var i = 0; i<count; ++i){
								/*
								@尾巴节点复用
								如果新创建的尾节点 一律从起始位置_start创建
								*/
								if (null==params.sprites[i]) {
									params.sprites[i] = new config.class(i);
									params.sprites[i].view.ccbRootNode.setVisible(false);
								};

								/*
								尾节点运行完毕后均不可见状态，第一次移动都出现在起始位置_start，然后才可以位移 
								MODE.f执行一次后，位置才发生改变_start+位移量，发生改变的位置下一次执行才返回
								*/
								index    = MODE.f(i,0,config.parents.length-1);
								start    = i == 0 ? index : start;
								GLOBAL_FUNCS.changeParent( params.sprites[i].view.ccbRootNode, 
									config.parents[index], cc.p(0,0));
								params.sprites[i].view.ccbRootNode.setVisible(true);
							};
							
							return callback();
						},//end
						/*
						@结束移动*/
						function(_count,_callback){
							var tail = params.sprites.length-1;
							if (tail>0) {
								params.sprites[tail].view.ccbRootNode.removeFromParent();
								params.sprites.splice(tail,1);
							}else{
								if (params.stop!=null&&start == params.stop) {
									params.sprites[0].playAnim("ending");
									that.unschedule("TIMING");
									that.audioEffectId = hall.AudioHelper.playEffect(GLOBAL_OBJ.RES.UI_WRSLOT_RUN_2_MP3, false);
									that.params.onFinished();
									return;					
								};
							};

							var index = 0;
							for(var i in params.sprites ){
								index = MODE.f(i,0,config.parents.length-1);
								start = i == 0 ? index : start;
								GLOBAL_FUNCS.changeParent( params.sprites[i].view.ccbRootNode, 
									config.parents[index], cc.p(0,0));
							};
						},//end
					];
				})(params.start);

				this.schedule("TIMING",(function(){
					var times        = 0;
					var count        = 1;
					var status       = "accelerating";
					var ___f_foreach = function(){
						count        = ___f_single_edge(count,0,config.count);
					};

					/*
					@起步加速*/
					var ___f_accelerating = function(){
						___f_motions[0](count++,___f_foreach);
						if      (times==0) {
							that.audioEffectId = hall.AudioHelper.playEffect(GLOBAL_OBJ.RES.UI_WRSLOT_RUNSTART_0_MP3, false);
						}else if(times==7) {
							// that.audioEffectId = hall.AudioHelper.playEffect(GLOBAL_OBJ.RES.UI_WRSLOT_RUN_0_MP3, false);
							that.schedule("SOUND", function(){
								that.audioEffectId = hall.AudioHelper.playEffect(GLOBAL_OBJ.RES.UI_WRSLOT_RUN_0_MP3, false);
							}, 0.12);
						}else if(times>7){
							status = "instant";
							// that.audioEffectId = hall.AudioHelper.playEffect(GLOBAL_OBJ.RES.UI_WRSLOT_RUN_0_MP3, false);
						};
					};

					/*
					@匀速*/
					var ___f_instant      = function(){
						___f_motions[0](++count,___f_foreach);
						/*
						@只有收到stop位置&循环30圈后才可以结束*/
						if (params.stop!=null&&times>30) {
							if (that.audioEffectId) {
								hall.AudioHelper.stopEffect(that.audioEffectId);
								that.audioEffectId = null;
							};

							that.unschedule("SOUND");

							status   = "decelerating";
							that.audioEffectId = hall.AudioHelper.playEffect(GLOBAL_OBJ.RES.UI_WRSLOT_RUN_1_MP3, false);
						};
					};

					/*
					@减速*/
					var ___f_decelerating = function(){
						___f_motions[1](--count);
					};
					return function(){
						switch(status){
							case "accelerating":
							___f_accelerating();
							break;
							case "instant":
							___f_instant();
							break;
							case "decelerating":
							___f_decelerating();
							break;
						};
						++times;
					};
				})(),0.12);
			},
		});
		
		/*
		@拖尾对象map，不暴露对象给外部，只开放指定的接口*/
		var objects = {};
		return {
			/*
			@装载一个拖尾*/
			install:function(_name,_config){
				var name = _name||"";
				if (objects[name]) {
					this.uninstall(name)
				};
				objects[name] = new Trailing();
				objects[name].init(_config);
			},

			/*
			@卸载一个拖尾*/
			uninstall:function(_name){
				var name = _name||"";
				if (objects[name]) {
					objects[name].delete();
					objects[name] = null;
				};
			},
			
			/*
			@开放的接口*/
			start:function(_name,_positon){
				var name = _name||"";
				if (objects[name]) {
					objects[name].start(_positon);
				};
			},

			stop:function(_name,_positon,_callback){
				var name = _name||"";
				if (objects[name]) {
					objects[name].stop(_positon,_callback);
				};
			},

			cancel:function(_name){
				var name = _name||"";
				if (objects[name]) {
					objects[name].cancel();
				};
			},
		};
	})();
})();