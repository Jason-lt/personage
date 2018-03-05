/*****************************************
 *  mahjong_loop_scroll_view_factory.js
    循环scroll view
 *  mahjong

 *  Created by nick.kai.lee on 16-07-08
 *  特殊说明：
	为了滑动效果，默认会多创建一个cell

    使用说明:
    GLOBAL_OBJ.businesses.utils.LoopScrollView.Factory.install("vip", {
        node: this.viewNode,
        count: 4,
        cell: GLOBAL_OBJ.businesses.scenes.RoomList.SingleCell,
        direction: "horizontal", 
    });

    GLOBAL_OBJ.businesses.utils.LoopScrollView.Factory.uninstall("vip")
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS	= GLOBAL_OBJ.businesses.functions;

	/*
	@拖尾模块工厂*/

	GLOBAL_OBJ.businesses.utils.LoopScrollView = {
		Factory:(function(){
			/*
			@拖尾对象*/
			var LoopScrollView = cc.Class.extend({
				_TAG:"LoopScrollView",
				ctor:function(){
					/*
					@配置参数*/
					this.config = {
						count:0,
						node:null,
						data:null,
						direction:"horizontal", // vertical
						listener:function(){},
					};

					this.cells   = [];
					this.status  = "positive"; //"negative" "positive"
					this.offset  = cc.p(0,0);
					/*
			        @ extend 区域
			        */
			        ty.extend.schedulerExtend(this);
				},

				reload:function(_count){
					this.config.count = _count || -1;
					this.clipNode.removeAllChildren();
					this.unschedule("update");

					var add    = 0;
					switch(this.config.count){
						case 1:
						add    = 1;
						break;
						case 2:
						add    = 2;
						break;
						default:
						add    = 0;
						break;
					};

					this.cells = [];
		            for(var i  = 0 ; i < this.config.count + add; ++i){
		            	//创建节点
		                var cell = this.config.listener(i>=this.config.count?i-this.config.count:i, this.config);
		                var size = cell.getRootNode().getContentSize();
		            	var node = cc.Node.create();
		            	node.setContentSize(size);
		            	node.setAnchorPoint(cc.p(0.5,0.5));		                
		                node.addChild(cell.getRootNode());

		                switch(this.config.direction){
                        	case "horizontal":
	                        node.setPosition(cc.p(size.width*0.5+size.width*i,size.height*0.5));
                        	break;
                        	case "vertical":
                        	node.setPosition(cc.p(size.width*0.5,size.height*0.5+size.height*i));
                        	break;
                        };

		                this.cells.push(node);
		                this.clipNode.addChild(node);
		            };


		            this.schedule("update", this.update(), 0.03);
				},

				init:function(_config){
					var that              = this;
					this.config.node      = _config.node  || this.config.node;
					this.config.direction = _config.direction || this.config.direction;
					this.config.listener  = _config.listener || this.config.listener;
					this.config.data      = _config.data || this.config.data; 
					
					var viewSize          = this.config.node.getContentSize();
            		this.clipNode         = cc.ClippingNode.create( cc.LayerColor.create(cc.color(255, 255, 255, 255), viewSize.width, viewSize.height) );
            		this.config.node.addChild(this.clipNode);

					// this.cells = [];
		            // for(var i  = 0 ; i < this.config.count + 1; ++i){
		            // 	//创建节点
		            //     var cell = this.config.listener(i);
		            //     var size = cell.getRootNode().getContentSize();
		            // 	var node = cc.Node.create();
		            // 	node.setContentSize(size);
		            // 	node.setAnchorPoint(cc.p(0.5,0.5));		                
		            //     node.addChild(cell.getRootNode());

		            //     switch(that.config.direction){
              //           	case "horizontal":
	             //            node.setPosition(cc.p(size.width*0.5+size.width*i,size.height*0.5));
              //           	break;
              //           	case "vertical":
              //           	node.setPosition(cc.p(size.width*0.5,size.height*0.5+size.height*i));
              //           	break;
              //           };

		            //     this.cells.push(node);
		            //     this.clipNode.addChild(node);
		            // };

					if (!this.config.node) { return; };

					var point1 = cc.p(0,0), point2 = cc.p(0,0), time1 = 0, time2 = 0;
					/*
					@核心函数
					*/
					var onTouchEnded = function(_listener, _touch, _event){
						//touch ended
						var speed  = 0, offset = cc.p(0,0), time = 0.05, distance = 0;
						time2      = (new Date()).getTime();
						point2     = _touch.getLocation();
						distance   = speed*time;

						/*
						根据滑动时间和偏移量 获得速度，然后预估1秒（1000ms）的偏移
						*/
						switch(that.config.direction){
                        	case "horizontal":
		                        speed = Math.floor( Math.abs(point2.x - point1.x)/(Math.abs(time2 - time1)/1000) );
		                        if ("positive" == that.status) { //左
		                        	offset = cc.p(-speed*time, 0);
		                        }else if ("negative" == that.status) { //右
		                        	offset = cc.p(speed*time, 0);
		                        };
                        	break;
                        	case "vertical":
	                        	speed = Math.floor( Math.abs(point2.y - point1.y)/(Math.abs(time2 - time1)/1000) );
	                        	if ("positive" == that.status) { //下
		                        	offset = cc.p(0, -speed*time);
		                        }else if ("negative" == that.status) { //上
		                        	offset = cc.p(0, speed*time);
		                        };
                        	break;
                        };
                        that.offset = offset;
      //                   var offset= cc.p(0,0);
      //                   var view, size, point;

						// for(var j in that.cells){
      //                   	view  = that.cells[j];
      //                       point = view.getPosition();
      //                       size  = view.getContentSize();

							// switch(that.config.direction){
	      //                   	case "horizontal":
			    //                     if ("positive" == that.status && point.x > viewSize.width*0.5 && point.x < viewSize.width) { //左
			    //                     	offset = cc.p(viewSize.width*0.5-point.x,0);
			    //                     }else if ("negative" == that.status && point.x > 0 && point.x < viewSize.width*0.5 ) { //右
			    //                     	offset = cc.p(viewSize.width*0.5-point.x,0);
			    //                     };
	      //                   	break;
	      //                   	case "vertical":
	      //                   		if ("positive" == that.status && point.y < size.height*0.5 && point.y > -size.height*0.5) { //下
			    //                     	offset = cc.p(0, -size.height*0.5-point.y);
			    //                     }else if ("negative" == that.status && point.y > (viewSize.height - size.height*0.5) && point.y < (viewSize.height + size.height*0.5) ) { //上
			    //                     	offset = cc.p(0, viewSize.height+size.height*0.5-point.y);
			    //                     };
	      //                   	break;
	      //                   };
                        // };
						
                        
      //                   for(var j in that.cells){
      //                       that.cells[j].runAction( cc.MoveBy.create(1, offset) );
      //                   };
       //                  return;

                        for(var i = 0; i < that.cells.length; ++i){

            //             	that.cells[i].runAction( cc.Sequence.create(
            //                     cc.EaseExponentialOut.create( cc.MoveBy.create(8, offset) ),
            //                     cc.CallFunc.create((function(_index){
            //                         return function(){
            //                         	//最后一个cell完成偏移，准备集体归位
            //                             if (_index == that.cells.length-1) {
            //                                 for(var j in that.cells){
            //                                 	view  = that.cells[j];
            //                                     point = view.getPosition();
            //                                     size  = view.getContentSize();
												
												// // switch(that.config.direction){
						      // //                   	case "horizontal":
								    // //                     if ("positive" == that.status && point.x > -size.width*0.5 && point.x < size.width*0.5) { //左
								    // //                     	offset = cc.p(-size.width*0.5-point.x,0);
															
								    // //                     }else if ("negative" == that.status && point.x > (viewSize.width - size.width*0.5) && point.x < (viewSize.width + size.width*0.5) ) { //右
								    // //                     	offset = cc.p(viewSize.width+size.width*0.5-point.x,0);
								    // //                     };
						      // //                   	break;
						      // //                   	case "vertical":
						      // //                   		if ("positive" == that.status && point.y < size.height*0.5 && point.y > -size.height*0.5) { //下
								    // //                     	offset = cc.p(0, -size.height*0.5-point.y);
								    // //                     }else if ("negative" == that.status && point.y > (viewSize.height - size.height*0.5) && point.y < (viewSize.height + size.height*0.5) ) { //上
								    // //                     	offset = cc.p(0, viewSize.height+size.height*0.5-point.y);
								    // //                     };
						      // //                   	break;
						      // //                   };
            //                                 };
            //                             };
            //                         };
            //                     })(i))

            //                 ));
							// that.cells[i].runAction( cc.RepeatForever.create( cc.MoveBy.create(2, offset) ) );
                        };
					};

					
					GLOBAL_OBJ.bkernel.extend.Touch.bind_simple_touch(this.config.node, false, function(_listener, _touch, _event){
						//touch began
						time1  		= (new Date()).getTime();
						point1 		= _touch.getLocation();
						that.offset = cc.p(0,0);
						return true;
					}, function(_listener, _touch, _event){
						//touch moved
	                    var delta = _touch.getDelta();
	                    var point;
	                    for(var i in that.cells){
	                    	point = that.cells[i].getPosition();
							switch(that.config.direction){
	                        	case "horizontal":
	                        	if (_touch.getLocation().x>point1.x) {
	                        		that.status = "negative";
	                        	}else if (_touch.getLocation().x<point1.x){
	                        		that.status = "positive";
	                        	};
		                        that.cells[i].setPositionX( delta.x*1.4 + point.x );
	                        	break;
	                        	case "vertical":
		                        	if (_touch.getLocation().y>point1.y) {
		                        		that.status = "negative";
		                        	}else if (_touch.getLocation().y<point1.y){
		                        		that.status = "positive";
		                        	};
	                        	that.cells[i].setPositionY( delta.y*1.4 + point.y );
	                        	break;
	                        };
	                    };

					}, onTouchEnded, onTouchEnded);
				},

				destroy:function(){
					this.unscheduleAll();
				},

				update:function(){
					var index0 = 0; //移动到左端 可视范围 外的 cell 的索引 from 0
					var index1; //移动到右端 可视范围 外的 cell 的索引 from 0
					return function(){
	                    var max;
	                    var maxs;
	                    var view, point, size, edage_point, edage_size;
	                    var cells     = this.cells;
	                    var direction = this.config.direction;
	                    var viewSize  = this.config.node.getContentSize();

	                    for(var i in this.cells){
	                    	this.cells[i].setPositionX( this.cells[i].getPositionX() + this.offset.x )
	                    	this.cells[i].setPositionY( this.cells[i].getPositionY() + this.offset.y )
	                    };

	                    if (this.offset.x!=0 || this.offset.y != 0 ) {
							switch(this.config.direction){
	                        	case "horizontal":
	                        		if ("positive" == this.status) { //左
	                        			this.offset.x += 2;
			                        }else if ("negative" == this.status) { //右
			                        	this.offset.x -= 2;
			                        };
	                        	break;
	                        	case "vertical":
		                        	if ("positive" == this.status) { //下
		                        		this.offset.y += 2;
			                        }else if ("negative" == this.status) { //上
			                        	this.offset.y -= 2;
			                        };
	                        	break;
	                        };
	                    };
						
						if ("positive" == this.status) { //左
                			if (this.offset.x >= 0) {
                        		this.offset.x = 0;
                        	};
                        	if (this.offset.y >= 0) {
                        		this.offset.y = 0;
                        	};
                        }else if ("negative" == this.status) { //右
                        	if (this.offset.x <= 0) {
	                        	this.offset.x = 0;
	                        };
	                        if (this.offset.y <= 0) {
	                        	this.offset.y = 0;
	                        };
                        };
                        

	                    for(var i in cells){
	                    	view  = cells[i];
	                        point = view.getPosition();
	                        
	                        if ( !edage_point ) {
	                            edage_point = point;
	                            edage_size  = view.getContentSize();
		                    };

	                        /*
	                        @根据走向（水平或垂直）和滑动方向（右，上为正negative，左，下为负positive）
	                        找到位于最左或下边的cell，或者最右或上边的cell，视其为边界cell，记录其边界坐标和size
	                        然后将出界的cell 坐标移动到 边界cell的 “后方”，这里“后方”解释为相对滑动方向的后方*/
	                        switch(direction){
	                        	case "horizontal":
		                        if ( ( "positive" == this.status && edage_point.x < point.x ) || ( "negative" == this.status && edage_point.x > point.x ) ) {
		                            edage_point = point;
		                            edage_size  = view.getContentSize();
		                        };
	                        	break;
	                        	case "vertical":
	                        	if ( ( "positive" == this.status && edage_point.y < point.y ) || ( "negative" == this.status && edage_point.y > point.y ) ) {
		                            edage_point = point;
		                            edage_size  = view.getContentSize();
		                        };
	                        	break;
	                        };
	                    };

	                    if ("positive" == this.status) {
		                    for(var i = index0; i < cells.length; ++i){
		                    	view  = cells[i];
		                        point = view.getPosition();
		                        size  = view.getContentSize();

								switch(direction){
		                        	case "horizontal":
			                        	if (point.x < -size.width*0.5) {
			                        		//左滑
			                        		view.setPosition(cc.p(edage_point.x+edage_size.width, edage_point.y));
			                            	index0 = i>=cells.length-1?0:i;
			                            	return;
			                        	};
		                        	break;
		                        	case "vertical":
			                       		if (point.y < -size.height*0.5) {
			                       			//下滑
			                        		view.setPosition(cc.p(edage_point.x, edage_point.y+edage_size.height));
			                            	index0 = i>=cells.length-1?0:i;
			                            	return;
			                        	};
		                        	break;
		                        };
		                    };
	                    }else if ("negative" == this.status) {
	                    	index1    = null == index1?cells.length-1:index1;
		                    for(var i = index1; i >= 0; --i){
		                    	view  = cells[i];
		                        point = view.getPosition();
		                        size  = view.getContentSize();

								switch(direction){
		                        	case "horizontal":
			                        	if ( point.x > (viewSize.width + size.width*0.5) ) {
			                        		//右滑
			                       			view.setPosition(cc.p(edage_point.x-edage_size.width, edage_point.y));
			                       			index1 = i<=0?cells.length-1:i;
			                            	return;
			                        	};
		                        	break;
		                        	case "vertical":
			                       		if ( point.y > (viewSize.height + size.height*0.5) ) {
			                        		//上滑
			                       			view.setPosition(cc.p(edage_point.x, edage_point.y-edage_size.height));
			                            	index1 = i<=0?cells.length-1:i;
			                            	return;
			                        	};
		                        	break;
		                        };
		                    };
	                    };
	                };
				},
			});
			
			var objects = {};
			return {
				/*
				@装载一个*/
				install:function(_name, _config){
					var name = _name||"";
					if (objects[name]) {
						this.uninstall(name)
					};
					objects[name] = new LoopScrollView();
					objects[name].init(_config);
					return objects[name];
				},

				/*
				@卸载一个*/
				uninstall:function(_name){
					var name = _name||"";
					if (objects[name]) {
						objects[name].destroy();
						objects[name] = null;
					};
				},
				
				/*
				@卸载全部*/
				uninstallAll:function(){
					for(var name in objects){
						if (objects[name]) {
							objects[name].destroy();
							objects[name] = null;
						};
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
			};
		})(), // Factory end

	};

})();