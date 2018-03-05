/************************************************************************
 *  mahjong_tableview.js
    
 *  framework
 *
 *  Created by nick.kai.lee on 16-01-11
 *  特殊说明:
	使用说明：
	this.pData    = { data:{}};
	var size      = this._bgNode.getContentSize()
    var tableview = GLOBAL_OBJ.bkernel.utils.TableView.Main.create({
        viewSize  :cc.size(213,size.height),
        direction :cc.SCROLLVIEW_DIRECTION_VERTICAL,
        fillOrder :cc.TABLEVIEW_FILL_TOPDOWN,
        bounce    :true,
        priority  :1,
        cell      :GLOBAL_OBJ.bkernel.utils.TableView.CommonCell,
        controller:GLOBAL_OBJ.businesses.windows.GodRaffle.Tail,
        cellSize  :cc.size(213,111+5),
        data      :this.pData
    });
    tableview.setPosition(cc.p(0,0));
    this._bgNode.addChild(tableview);
    // tableview.setTouchEnabled(false);
    tableview.reloadData( 2 );
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var tableView  = cc.Layer.extend({ 
		_TAG:"tableView",
	    ctor:function () { 
	    	this._super();
	        cc.associateWithNative( this, cc.Layer );

	        this.counts = 0;
	        this.cache  = [];//变长格子使用
	    }, 

	    onCleanup:function () {
	    	/*@缓存释放*/
	    	GLOBAL_OBJ.LOGD(this._TAG,"释放Tableview cache");
			for(var i in this.cache){
				if (this.cache[i].node) {
					this.cache[i].node.view.ccbRootNode.release();
				}
			}
			this.cache = [];
		},

		cleanItems:function () {
			/*@缓存释放*/
			GLOBAL_OBJ.LOGD(this._TAG,"释放Tableview cache");
			var itemNode;
			for(var i in this.cache){
				itemNode = this.cache[i].node;
				if (itemNode) {
					itemNode.view.ccbRootNode.removeFromParent();
					itemNode.view.ccbRootNode.release();
				}
			}
			this.cache.length = 0;
		},

	    init:function ( _config ) { 
	        if (!this._super()) return false;

	        this.config   = _config;
	        var winSize   = cc.director.getWinSize();
	       	var viewSize  = this.config["viewSize"]  || cc.size(0,0);
		    var direction = (typeof(this.config["direction"])=="number")? this.config["direction"] : cc.SCROLLVIEW_DIRECTION_VERTICAL;
		    
		    var fillOrder = this.config["fillOrder"] || cc.TABLEVIEW_FILL_TOPDOWN;
		    var bounce    = this.config["bounce"]    || true;//设置弹性
			
		    this.setContentSize(viewSize);

			//初始化cctableview，第一个参数是dataSource，第二个参数是初始化的大小
	        this.tv = cc.TableView.create(this, viewSize);
	        this.tv.setPosition( cc.p( 0, 0 ) );
	        this.tv.setDirection(direction);
	        this.tv.setDelegate(this);
	        this.tv.setVerticalFillOrder(fillOrder);
	        this.tv.setBounceable(bounce);
	        this.addChild(this.tv);
	        return true;
	    },

	    setPosition: function(_point){
	    	this.tv.setPosition(_point);
	    },

	   	setTouchEnabled: function(_ret) {
	        this.tv.setTouchEnabled(_ret);
		},

	   	numberOfCellsInTableView: function(_table) {
	        return this.counts;
		},

		tableCellSizeForIndex: function(_table, _index) {
			return this.config["cell"].getSize(_index, this.config, this.cache);
		},

		tableCellAtIndex: function(_table, _index) {//idx start from 0
			var table = _table;
		    var cell  = table.dequeueCell();
		    if (!cell) {
				cell  = this.config["cell"].create( this.config, this.cache );
		        cell.initCell( _index, table );
		    }else{
		    	cell.updateCell( _index,table );
		    }
		    return cell;
		},

		setContentOffset:function(_offset){
			this.tv.setContentOffset(_offset);
		},

		getContentOffset:function(){
			return this.tv.getContentOffset();
		},

		getContentSize:function(){
			return this.tv.getContentSize();
		},

		getMinContainerOffset:function(){
			return this.tv.minContainerOffset();
		},

		setViewSize:function(_size){
			this.tv.setViewSize(_size);
		},

		/*
		是否是滚动状态
		*/
		isTouchMoved:function(){
			return this.tv.isTouchMoved();
		},

		reloadData:function( _count, _orient, _moveCnts ){
			this.counts = _count || 0;
			// this.tv.reloadData();
			var offset  = this.tv.getContentOffset(); //reload之前保存数据
		    var offsetX = 0, offsetY = 0;
		    
		    this.tv.reloadData();

		    // if  not  _orient                         then
		    if 	    (!_orient) {
		    	
		    }else if(_orient == "STOP") {
		        var viewSizeW = this.config.viewSize.width;
		        var cellSizeW = this.config["cell"].getSize(0,this.config,this.cache).width;
		        var viewSizeH = this.config.viewSize.height;
		        var cellSizeH = this.config["cell"].getSize(0,this.config,this.cache).height;
		        var direction = this.tv.getDirection();

		        var maxCountsInViewSize   =  direction == cc.SCROLLVIEW_DIRECTION_VERTICAL  ? Math.ceil(viewSizeH/cellSizeH) : Math.ceil(viewSizeW/cellSizeW);

		        if (maxCountsInViewSize <= this.counts) {
					this.tv.setBounceable( false );
		            this.tv.setContentOffset(offset ,false);
		            this.tv.setBounceable( true );
		        }
		    }else if(_orient == "MOVE" && _moveCnts) {
				//纵向没处理
		        var viewSizeW = this.config.viewSize.width;
		        var cellSizeW = this.config["cell"].getSize(0,this.config,this.cache).width;
		        var viewSizeH = this.config.viewSize.height;
		        var cellSizeH = this.config["cell"].getSize(0,this.config,this.cache).height;
		        var direction = this.tv.getDirection();
		        var maxCountsInViewSize   =  direction == cc.SCROLLVIEW_DIRECTION_VERTICAL  ? Math.ceil(viewSizeH/cellSizeH) : Math.ceil(viewSizeW/cellSizeW);
		        var restSize  =  direction == cc.SCROLLVIEW_DIRECTION_VERTICAL ? (maxCountsInViewSize - viewSizeH/cellSizeH)*cellSizeH : (maxCountsInViewSize - viewSizeW/cellSizeW)*cellSizeW;
		        // print("格子个数:",maxCountsInViewSize,viewSizeW/cellSizeW)
		        var moveCnts  = _moveCnts + 1 > this.counts ? this.counts : _moveCnts + 1;

		        if  (maxCountsInViewSize <= this.counts ){
		            offsetX = - this.tv.getContentSize().width  + this.config["cell"].getSize(0,this.config,this.cache).width*( this.counts - ( moveCnts - maxCountsInViewSize )  ) - restSize;
		            offsetY = - this.tv.getContentSize().height + this.config["cell"].getSize(0,this.config,this.cache).height*( this.counts - ( moveCnts - maxCountsInViewSize ) ) - restSize;
		            this.tv.setBounceable( false );
		            if  (direction == cc.SCROLLVIEW_DIRECTION_VERTICAL){
		                if  (( moveCnts  >=  maxCountsInViewSize &&  -offset.y  >=  -offsetY ) || ( moveCnts  <  maxCountsInViewSize &&  -offset.y  <  -offsetY )) {
		                    // 格子个数少时不移位
		                    offset.y  = offset.y - offsetY;
		                    offset.y  = offset.y >= 0 ? 0 : offset.y;
		                }
		            }else{
		                if  (( moveCnts  >=  maxCountsInViewSize &&  offset.x  >=  offsetX ) || ( moveCnts  <  maxCountsInViewSize &&  offset.x  <  offsetX )) {
		                    // 格子个数少时不移位
		                    offset.x  = offsetX >= 0 ? 0 : offsetX;
		                }
		            }

		            this.tv.setContentOffset(offset ,true);
		            this.tv.setBounceable( true );
		        }
		    }else if(_orient == "BOTTOM") {
		        /*
		        禁止tableview滑动
		        让格子到最后一页的位置
		        setBounceable 可以tableview自己控制offset是否越界的问题.,设置初始偏移完毕后要还原
		        */
		        var direction = this.tv.getDirection();
		        if  ( direction == cc.SCROLLVIEW_DIRECTION_VERTICAL ){
		            this.tv.setBounceable( false );
		            offsetY = this.tv.getContentSize().height + this.config.viewSize.height;
		            // 格子个数少时不移位
		            offsetY = offsetY >= 0 ? 0 : offsetY;
		            this.tv.setContentOffset(cc.p( 0 ,offsetY ),false);
		            this.tv.setBounceable( true )
		        }else{
		            this.tv.setBounceable( false );
		            offsetX = - this.tv.getContentSize().width + this.config.viewSize.width;
		            // 格子个数少时不移位
		            offsetX = offsetX >= 0 ? 0 : offsetX;
		            this.tv.setContentOffset(cc.p( offsetX ,0 ),false);
		            this.tv.setBounceable( true )
		        }
		    }
		}
	});
	
	GLOBAL_OBJ.bkernel.utils.TableView.Layer = {
		create:function(_config){
			var layer = new tableView();
			if(layer && layer.init(_config)){
				return layer;
			}
			return null;
		}
	};

	// add 4 record
	GLOBAL_OBJ.bkernel.utils.TableView.SortType = {
		Normal : 1,     //正常
		Inverted : 2,   //倒序
	};
})();