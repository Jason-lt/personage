/*****************************************
 *  init.js
    初始化麻将 用户 modules JS环境
 *  mahjong
 *  Created by nick.kai.lee on 16-06-25
 *  特殊说明：

    使用说明:
 */
(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.businesses.modules.User = {
		_TAG:"businesses.modules.User",
		/*
		@启动module业务(不希望使用者关注流程，只需要启动业务即可)
		*/
		boot:function(){
			/*
			@module层*/
			GLOBAL_OBJ.businesses.modules.User.Portrait.boot();
		},

		/*
		@关闭业务
		*/
		shut:function(){
			GLOBAL_OBJ.businesses.modules.User.Portrait.shut();
			GLOBAL_OBJ.businesses.modules.User.Model.clean();
		},
	};

})();