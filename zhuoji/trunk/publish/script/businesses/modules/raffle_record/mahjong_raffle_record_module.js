/*****************************************
 *  mahjong_raffle_record_module.js
    麻将 抽奖记录系统
 *  mahjong

 *  Created by nick.kai.lee on 16-02-22
 *  特殊说明：

    使用说明:
	
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS	                           = GLOBAL_OBJ.businesses.functions;
	var C2S 							           = GLOBAL_OBJ.businesses.network.C2S;
	var MODEL 							           = GLOBAL_OBJ.businesses.modules.RaffleRecord.Model;
	GLOBAL_OBJ.businesses.modules.RaffleRecord.Module = {
		_TAG:"businesses.modules.RaffleRecord.Module",
		boot:function(){
		},

		shut:function(){
		},

		/*
		@询问具体模块的提示*/
		query:function(_part){
			var part = _part || -1;//start from 1,防止0也认为是假
			switch(part){
				case GLOBAL_OBJ.businesses.modules.RaffleRecord.Consts.RAFFLERECORD_0000://幸运转盘美女
				C2S.requestLuckyWheelRecordInfo();
				break;
				case GLOBAL_OBJ.businesses.modules.RaffleRecord.Consts.RAFFLERECORD_0001://拜雀神财神
				C2S.requestTableRaffleRecordInfo();
				break;
				default:
				break;
			};
		},
	};
})();