/*************************************************************
 *  mahjong_funtions.js
    mahjong_funtions
 *  mahjong
 	extend模块的全局函数
 *
 *  Created by nick.kai.lee on 16-06-16
 *  特殊说明：
 	
    使用方法:

 */
(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.bkernel.extend.Functions = {
		_TAG:"bkernel.extend.Functions",
		propertyExt:function(_src, _dst){
			for(var key in _dst){
				if (!_src[key]) {
					_src[key] = _dst[key];
				}else{
					GLOBAL_OBJ.LOGD(this._TAG,"propertyExtend扩展已经存在的属性！key："+key);
				};
			};
		},

		/*
		@基本触摸listener管理者对象工厂
		生成一个基本的touch管理类，所有扩展通过这个manger来进行touch事件的管控
		返回的manager对象，开发者本身也可以进行再次扩充
		params _listener:touch句柄
		*/
		commonTouchMangerFactory:function( _listener ){
			var listener = _listener;
			return {
                setTouchEnabled:function(_ret){
                    if(null!=listener){
                        listener.setEnabled(_ret);
                    };
                },

                isTouchEnabled:function(){
                    return listener&&listener.isEnabled();
                },

                setSwallowTouches:function(_ret){
                    if(null!=listener){
                        listener.setSwallowTouches(_ret);
                    };
                },

                isSwallowTouches:function(){
                	return listener?listener.isSwallowTouches():false;
                },

                /*
                @扩展一个解除的方法*/
                unbind:function(){
                   	if(null!=listener){
	            		cc.eventManager.removeListener(listener);
	                	listener = null;	
	            	};
                },
            };
		},
	};
	//end
})();

