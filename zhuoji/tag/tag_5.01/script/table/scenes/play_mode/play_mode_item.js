(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table=GLOBAL_OBJ.table||{};
	GLOBAL_OBJ.table.playmode=GLOBAL_OBJ.table.playmode||{};
	//桌面玩法，图片字添加到CCB中，这里关联一下
	GLOBAL_OBJ.table.playmode.item = hall.BaseController.extend({
	    _TAG                    : 'GLOBAL_OBJ.table.playmode.item',
	    ctor: function(data_) {
	        this._super();
	        this.init(GLOBAL_OBJ.RES.TABLE_PLAY_MODE_CCBI);
	        this.itemData=null;
	        this.parentUI=null;
	        this.init_data_bool=false;
		},
	    onLoad: function(){
	        this._super();
	    },
	    onDestroy: function(){
	        this.parentUI=null;
	        this.itemData=null;
	        this._super();
	    },

	    //初始化数据
	    initData:function(){
	    	if(this.init_data_bool==false){
	            this.init_data_bool=true;
	        }
	    	
	    },

	    //作为列表项必须实现------------------------------------------------------------------
	    getItemSize:function(){
	        var _currentSize=cc.size(150,45);
	        return _currentSize;
	    },
	    reInitItemByData:function(data_){
	        this.itemData=data_;
	        if(typeof(this.itemData)=="string"){
	        	// GLOBAL_OBJ.LOGD(this._TAG,"reInitItemByData 数据是字符串 : "+this.itemData.toString());

				var _bmf = cc.LabelTTF.create(this.itemData.toString(), "FZY3JW--GB1-0", 25);
				_bmf.setAnchorPoint(cc.p(0, 0.5));
				_bmf.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
				var color = cc.color(231, 248, 245);
				_bmf.setColor(color);


				if(this.textContainer && _bmf){
	        		this.textContainer.addChild(_bmf);
	        		GLOBAL_OBJ.LOGD(this._TAG," 有 textContainer");
	        	}else{
	        		GLOBAL_OBJ.LOGD(this._TAG," 没有 textContainer");

	        	}
	        }else{
	        	// GLOBAL_OBJ.LOGD(this._TAG,"reInitItemByData 数据不是字符串 : "+JSON.stringify(this.itemData));
	        }
	        return this.getItemSize();
	    },
	});
})();
