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

RESULTFILE=/tmp/default_makeskin
echo "RESULTFILE=$RESULTFILE"
echo 0 > $RESULTFILE

#从参数提取模式和主题
SKIN=common
OP=all

if [ $# -ge 1 ]
then
        SKIN=$1
fi

if [ $# -ge 2 ]
then
      SKIN=$1
      OP=$2
fi

echo "OP=" $OP

# 如果有错误则终止进程
# 工程名称
# 1)guobiao
# 2)sichuan
# common不是单独的皮肤
# makeskin做了一点儿优化，皮肤名支持输入路径
SKIN=$(basename $SKIN)
echo "SKIN=" $SKIN

sh $DIR/$SKIN/mergeskin.sh

# 目标目录
DIR_PUBLISH=$DIR/../publish


IMGSRC=$DIR/$SKIN/img_src
IMGOUTPUT=$DIR_PUBLISH/img
CCB_SRC=$DIR/$SKIN/ccb
CCB_OUTPUT=$DIR_PUBLISH/ccbi
#ccb生成工具路径
CCBPUBLISH_TOOL=$DIR/../tools/ccbpublish

#生成普通图资源(打大图,字体,nopack)   
publish_img()
{
        rm -rf $DIR_PUBLISH/img
        echo "------------------------------------------------------------------------------------------"
        echo "Build img..."
        # 遍历tps
        TPSES=`find $IMGSRC -name "*.tps"`
        echo $IMGSRC

        for tps in $TPSES
        do
        echo 'Process ' $tps
        # 根据全局路径获取文件名
        file=`echo ${tps##*/}`
        fileName=`echo $file|awk -F '.' '{print $1}' `
        echo 'fileName = ' $fileName

        echo TexturePacker $tps --sheet $IMGOUTPUT/$fileName.png --data $IMGOUTPUT/$fileName.plist
        TexturePacker $tps --sheet $IMGOUTPUT/$fileName.png --data $IMGOUTPUT/$fileName.plist
        done

        # copy font and nopack
        rm -rf $IMGOUTPUT/font
        rm -rf $IMGOUTPUT/nopack
        mkdir $IMGOUTPUT/font
        mkdir $IMGOUTPUT/nopack

        cp -rf $IMGSRC/font/*           $IMGOUTPUT/font/ 
        cp -rf $IMGSRC/nopack/*         $IMGOUTPUT/nopack/
        echo "Build img completed."
        echo "------------------------------------------------------------------------------------------"
}

#生成ccbi资源
publish_ccb()
{
        rm -rf $DIR_PUBLISH/ccbi
        # publish ccbi
        echo "------------------------------------------------------------------------------------------"
        echo "Build ccb..."
        rm -rf $CCB_OUTPUT
        mkdir -p $CCB_OUTPUT
        cd $CCB_SRC
        find . -name "*.ccb" | while read file
        do
                #echo $file #打印出所有ccb 文件 格式: ./ccb/Activity/ActivityHd.ccb
            echo file=$file

                noPrefix=${file#./} #去除./
                echo $noPrefix  #输出:ccb/Activity/ActivityHd.ccb

                ccbiName=${noPrefix/.ccb/.ccbi} #替换.ccb为.ccbi
                all_name=`basename $ccbiName`
            echo all_name=$all_name

            newFile=$CCB_OUTPUT/$all_name
            echo $newFile
            $CCBPUBLISH_TOOL -e ccbi -o $newFile -v $noPrefix #-e 输出文件的后缀 -o 输出文件 -v 输入文件
        done
        
        echo "Build ccb completed."
        echo "------------------------------------------------------------------------------------------"
}

publish_res()
{
#    rm -rf $DIR_PUBLISH/particle
#    rm -rf $DIR_PUBLISH/sound

    rm -rf $DIR_PUBLISH/particle
    cp -rf ${DIR}/$SKIN/particle $DIR_PUBLISH

    rm -rf $DIR_PUBLISH/sound
    cp -rf ${DIR}/$SKIN/sound $DIR_PUBLISH

    rm -rf $DIR_PUBLISH/html
    cp -rf ${DIR}/$SKIN/html $DIR_PUBLISH

    #重新生成resource.js
    sh $DIR/../tools/resource/make_resource.sh $SKIN
}


#根据模式生成对应资源
	if [ "$OP" == 'all' ]
	then
		#完全模式,重新生成全部资源
		publish_img
        publish_ccb
        publish_res
	elif [ "$OP" == 'ccb' ]
	then
		#只生成ccb,可用于xcode自动执行脚本
		publish_ccb
#        publish_res
	elif [ "$OP" == 'img' ]
	then
		#重新生成大图
		publish_img
#        publish_res
    elif [ "$OP" == 'pub' ]
	then
		#只拷贝
        publish_res
	fi

# 运行到这一步，没有提前返回，认为执行正确，写结果文件
echo 1 > $RESULTFILE