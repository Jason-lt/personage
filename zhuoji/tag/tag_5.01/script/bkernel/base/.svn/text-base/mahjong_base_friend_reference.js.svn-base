/*************************************************************
 *  mahjong_table_mahjong_mahj_friend_discard.js
    mahjong_table_mahjong_mahj_friend_discard
 *  mahjong
 	麻将牌出牌 （麻将牌的友元）
 *
 *  Created by nick.kai.lee on 16-07-27
 *  特殊说明：
	
	1.该友元类允许直接访问friend里的成员变量。
	2.2dx的脚本回调onCleanup只要在对象从父节点移除后就会回调，不会管引用计数是否是0，此时对象有可能没有被释放（在目前的框架中，
	2dx的获取引用计数数量的接口没有倒出来，且游戏开发组没有权限）, 所以直接hook对象的retain方法和release方法，来定义js层的引用计数。
	当对象js层手动release时，如果引用计数为0，对象就要销毁，这个时候调用JS层的onCleanup来完成脚本
	层的内容释放。
    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.bkernel.base.Friends.Reference = function( _friend ){
		var friend    = _friend;
		var reference = 0;
		return {
			_TAG:"bkernel.base.Friends.Reference",

			/*
			启动
			*/
			boot:function(){
				GLOBAL_OBJ.LOGD(this._TAG, "OBJECT LOAD");
				var that 	 = this;

                GLOBAL_OBJ.bkernel.extend.Node.bind_prototype_function( friend.getRootNode(), "retain",  function(){
                	++reference;
                });

                GLOBAL_OBJ.bkernel.extend.Node.bind_prototype_function( friend.getRootNode(), "release",  function(){
                	--reference;
                	reference = reference < 0 ? 0 : reference;
                	if (0 == that.getReferenceCount()) {
						friend.onCleanup();
					}
                });

				return this;		
			},

			shut:function(){
				GLOBAL_OBJ.LOGD(this._TAG, "OBJECT UNLOAD; friend._TAG: " + friend._TAG);
				reference = 0;
			},
			
			/*
			获得引用计数
			*/
			getReferenceCount:function(){
				return reference;
			},
		};
	};
	
	//end
})();

