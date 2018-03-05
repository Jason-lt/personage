/************************************************************************
 *  mahjong_none_tableview.js
    
 *  framework
 *
 *  Created by nick.kai.lee on 16-09-29
 *  特殊说明:
	使用说明：
	和tableView使用方式一致，除了少了部分api，不支持touch等
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var noneTableView  = cc.Layer.extend({ 
		_TAG:"noneTableView",
	    ctor:function () { 
	    	this._super();
	        cc.associateWithNative( this, cc.Layer );

	        this.counts = 0;
	        this.cache  = [];//变长格子使用

	        this.used   = [];
	        this.unused = [];
	    }, 

	    onCleanup:function () {
	    	/*@缓存释放*/
	    	GLOBAL_OBJ.LOGD(this._TAG,"释放noneTableView cache");
			for(var i = 0; i < this.cache.length; ++i){
				if (this.cache[i].node) {
					this.cache[i].node.view.ccbRootNode.release();
				};
			};
			this.cache = [];

			for(var i = 0; i < this.used.length; ++i){
				this.used[i].removeFromParent();
		    	this.unused.push(this.used[i]);
			};
			this.used = [];

			for(var i = 0; i < this.unused.length; ++i){
				this.unused[i].release();
			};
			this.unused = [];
		},

	    init:function ( _config ) { 
	        if (!this._super( )) return false;

	        this.config   = _config;
	        var winSize   = cc.Director.getInstance().getWinSize();
	       	var viewSize  = this.config["viewSize"]  || cc.size(0,0);
		    var direction = (typeof(this.config["direction"])=="number")? this.config["direction"] : cc.SCROLLVIEW_DIRECTION_VERTICAL;
		    
		    var fillOrder = this.config["fillOrder"] || cc.TABLEVIEW_FILL_TOPDOWN;
			
		    this.setContentSize(viewSize);

			//初始化cctableview，第一个参数是dataSource，第二个参数是初始化的大小
			this.tv 	  = cc.Node.create();
			this.tv.setContentSize(viewSize);
			this.tv.setPosition( cc.p( 0, 0 ) );
			this.addChild(this.tv);
	        return true;
	    },

	   	numberOfCellsInTableView: function() {
	        return this.counts;
		},

		tableCellSizeForIndex: function(_index) {
			return this.config["cell"].getSize(_index, this.config, this.cache);
		},

		tableCellAtIndex: function(_index) {//idx start from 0
		    var cell  = this.dequeueCell();
		    if (!cell) {
				cell  = this.config["cell"].create( this.config, this.cache );
				cell.retain();
		        cell.initCell( _index,  this );
		    }else{
		    	cell.updateCell( _index,this );
		    };
		    return cell;
		},

		dequeueCell:function(){
			return this.unused.shift(); //删除并返回数组第一个元素
		},

		reloadData:function( _count ){
			this.counts = _count || 0;
		    
		    //释放cell，已备复用
		    for(var i = 0; i < this.used.length; ++i){
		    	this.used[i].removeFromParent();
		    	this.unused.push(this.used[i]);
		    };
		    this.used = [];

		    var count = this.numberOfCellsInTableView();
		    for(var i = 0, x = null , y = null ; i < count; ++i){
		    	var cell  = this.tableCellAtIndex(i);
		    	var size  = this.tableCellSizeForIndex(i);

				if (cc.SCROLLVIEW_DIRECTION_VERTICAL == this.config.direction) { // SCROLLVIEW_DIRECTION_HORIZONTAL
					x 	  = 0;
			    	if (cc.TABLEVIEW_FILL_TOPDOWN == this.config.fillOrder) { //TABLEVIEW_FILL_BOTTOMUP
			    		y = y == null ? this.config.viewSize.height-size.height : y;
			    		//越界
						if (y - size.height < -size.height) { break; };
			    	}else{
			    		y = y == null ? 0 : y;
			    		//越界
						if (y + size.height>= this.config.viewSize.height) { break; };
			    	};
			    } else {
			    	y 	  = 0;
					if (cc.TABLEVIEW_FILL_TOPDOWN == this.config.fillOrder) {
						x = x == null ? 0 : x;
						//越界
						if (x + size.width > this.config.viewSize.width) { break; };
			    	}else{
						x = x == null ? this.config.viewSize.width - this.config.viewSize.width : x;
						//越界
						if (x - size.width < -size.width) { break; };
			    	};
			    };

			    //cell's anchor point is ccp(0, 0)
			   	this.used.push( cell );
		    	this.tv.addChild( cell );
			    cell.setPosition(cc.p(x, y));

			    if (cc.SCROLLVIEW_DIRECTION_VERTICAL == this.config.direction){
			    	
			    	if (cc.TABLEVIEW_FILL_TOPDOWN == this.config.fillOrder) {
			    		y = y - size.height;
			    	}else{
			    		y = y + size.height;
			    	};
			    }else{
			    	if (cc.TABLEVIEW_FILL_TOPDOWN == this.config.fillOrder) {
			    		x = x + size.width;	
			    	}else{
			    		x = x - size.width;	
			    	};
			    };
		    };
		}
	});
	
	GLOBAL_OBJ.bkernel.utils.NoneTableView.Layer = {
		create:function(_config){
			var layer = new noneTableView();
			if(layer && layer.init(_config)){
				return layer;
			}
			return null;
		},
	};
})();
