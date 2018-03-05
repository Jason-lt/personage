#!/bin/sh
#------------------------------------------------------------------------
# 将游戏资源拷贝至框架的res目录下
# param 1 - 框架目录
# param 2 - 游戏名称
#-----------------------------------------------------------------------

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo dir=$DIR
GAME=majiang

if [ $# -lt 1 ]
then
	DST=$DIR/../../FrameWork2/branches/tuyoo-cocos2d-js-v3.5/tuyougame/tools/copyRes
	GAME=ddz
elif [ $# -lt 2 ]
then 
	DST=$1
elif [ $# -lt 3 ]
then
	DST=$1 
	GAME=$2
fi

echo DST=$DST
echo GAME=$GAME

# 检测是否有资源目录
if [ ! -d $DIR/publish/img ]; then
	echo "斗地主publish目录下没有img，需要执行skins/makeskin.sh的脚本"
	exit 0;
fi

if [[ ! -d $DIR/publish/ccbi ]]; then
	echo "斗地主publish目录下没有ccbi，需要执行skins/makeskin.sh的脚本"
	exit 0;
fi
# 框架的copy_res.sh是一个基本的拷贝单位，会将游戏目录的ccbi,img,img_small,script,sound一起拷贝至框架/res/games/$GAME下面
sh $DST/copy_res.sh $GAME $DIR/publish

# 清理框架下的res/frame/sound res/frame/img
rm -rf $DST/res/frame/sound
rm -rf $DST/res/frame/img
