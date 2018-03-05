#!/bin/sh
# @changed at 2015/1/27
# write makeskin result to /tmp/default_makeskin
# 1 - SUCC
# 0 - FAIL
# 其他说明：
# 传入的参数有效性内部判断
# 出错请退出
#

#获取当前路径
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo dir=$DIR

# python $DIR/tools/ccb-大图转单图处理.py mahjong $DIR/common/ccb $DIR/test
# python $DIR/tools/ccb-单图转大图处理.py $DIR/tools $DIR/test/img_src $DIR/games

cp -r $DIR/games/img $DIR/../publish/img
cp -r $DIR/games/ccbi $DIR/../publish/ccbi
cp -r $DIR/test/html $DIR/../publish/html
cp -r $DIR/test/particle $DIR/../publish/particle
cp -r $DIR/test/sound $DIR/../publish/sound
cp -r $DIR/../config $DIR/../publish/config
cp -r $DIR/../script $DIR/../publish/script