#! /usr/bin/python   
# -*- coding: UTF-8 -*-  
# 搜索项目目录下png图片
# 工作原理:遍历tps文件夹内.tps文件和nopack目录下文件
#   根据tps文件内filename节点找到图片路径,遍历文件
#
# 脚本会对生成的js文件变量做重复验证,并打印出来,请注意脚本执行结果
#
# 使用方法: 
#   1 编辑并保存最新的tps文件
#   2 确保.tps文件在tps文件夹中nopack文件在nopack文件夹中
#   3 执行命令(根据项目修改路径): python resource.py ddz resource.js /User/my/project/skin/img_src/ 
#
# 约定:
#   1 tps引用资源不能是单图,一定要是文件夹,单图会被忽略或影响大图路径
#   2 导出文件以执行脚本时散图状态为准,大图需要同步更新,否则可能resource.js与大图不匹配
#   3 目前只支持下划线分割图片格式,不支持驼峰格式
# 注意:
#   本脚本所有项目应当统一,如果需要修改,请尽量通过修改make_resource.sh完成!!!
#

__author__     = 'kink'
__version__    = '$Revision: 1.1 $'
__date__       = '$Date: 2014/10/10 $'
__copyright__  = 'Copyright (c) 2014'
__license__    = 'Python' 

import sys, os, re 
import Image 

try:
    import xml.etree.cElementTree as ET
except ImportError:
    import xml.etree.ElementTree as ET

#输出头
OUTPUT_HEAD = ''''''

#nopack头
OUTPUT_NOPACK_HEAD_FORMAT = '''
        #nopack
'''

#nopack格式
OUTPUT_NOPACK_FORMAT = ''' find /Users/kink/Project/games/hall-js/trunk/script -name "*"  | while read f; do echo $f;  sed -i '' 's/ddz.RES.NOPACK_{0}/{1}.RES.NOPACK_{0}/g' $f; done;
find /Users/kink/Project/games/hall-js/trunk/script/ -name "*.DS_Store"  | xargs rm -f ;
'''

#nopack格式
OUTPUT_CCB_FORMAT = ''''''

#nopack格式
OUTPUT_TPS_HEAD_FORMAT = '''
        #tps
'''

#tps格式
OUTPUT_TPS_FORMAT = '''
        #大图 {0} {1}
'''

#png格式
OUTPUT_PNG_FORMAT = '''  find /Users/kink/Project/games/hall-js/trunk/script -name "*"  | while read f; do echo $f;  sed -i '' 's/ddz.RES.{0}/{1}.RES.{0}/g' $f; done;
find /Users/kink/Project/games/hall-js/trunk/script/ -name "*.DS_Store"  | xargs rm -f ;
'''

#输出尾
OUTPUT_TAIL = '''

'''

# find /Users/kink/Project/games/dizhu-js/trunk/ddz/script -name "*"  | while read f; do echo $f;  sed -i '' 's/"activity_img_demo\.png"/ddz.RES.ACTIVITY_IMG_DEMO_PNG/g;s/"activity_img_demo2\.png"/ddz.RES.ACTIVITY_IMG_DEMO2_PNG/g;s/"alert_bg\.png"/ddz.RES.ALERT_BG_PNG/g;s/"apply_progress_bg\.png"/ddz.RES.APPLY_PROGRESS_BG_PNG/g;s/"bottom_bg\.png"/ddz.RES.BOTTOM_BG_PNG/g;s/"buy_coins\.png"/ddz.RES.BUY_COINS_PNG/g;s/"buy_diamonds\.png"/ddz.RES.BUY_DIAMONDS_PNG/g;s/"chat_bg\.png"/ddz.RES.CHAT_BG_PNG/g;s/"chat_input_bg\.png"/ddz.RES.CHAT_INPUT_BG_PNG/g;s/"curtain_top\.png"/ddz.RES.CURTAIN_TOP_PNG/g' $f; done


#结果
result = {}
result['nopack'] = []
result['tps'] = []
result['ccb'] = []

#检查
sameNameMap = {}
sameAttrMap = {}
checkResult = {}
checkResult["sameAttr"] = []
checkResult["sameName"] = []

#替换脚本
replace = []
replaceCcb = []

#打印结果
def printResult(outputFile,gameName):
    print '打印结果...'

    outputFile = open(outputFile,'w')

    print '打印 头...'
    output(outputFile,OUTPUT_HEAD.format(gameName,"{")) #.format(gameName)

    print '打印 ccb...'
    for ccb in result['ccb']:
        #生成变量名
        upper = attrFormat(ccb)
        recodeReplaceCcb(ccb,upper)
        output(outputFile,OUTPUT_CCB_FORMAT.format(upper,ccb,gameName))

    print '打印 nopack...'
    output(outputFile,OUTPUT_NOPACK_HEAD_FORMAT)
    for png in result['nopack']:
        #生成变量名
        upper = attrFormat(png)
        checkSameName(upper)
        checkSameAttr(png)
        recodeReplace(png,upper)
        output(outputFile,OUTPUT_NOPACK_FORMAT.format(upper,gameName))


    print '打印 tps...'
    output(outputFile,OUTPUT_TPS_HEAD_FORMAT)
    for tps in result['tps']:
        #print tps
        output(outputFile,OUTPUT_TPS_FORMAT.format(tps['plist'],tps['png']));
        for png in tps['pngs']:
            #生成变量名
            upper = attrFormat(png)
            checkSameName(upper)
            checkSameAttr(png)
            recodeReplace(png,upper)
            output(outputFile,OUTPUT_PNG_FORMAT.format(upper,gameName))

    print '打印 尾...'
    output(outputFile,OUTPUT_TAIL)

    outputFile.close()

    printCheckResoult()

    print '============= searchPng.py 全部结束!!! ============='

#记录替换字符串
def recodeReplace(fromStr,toStr):
    pair = {};
    pair["from"] = fromStr
    pair["to"] = toStr
    replace.append(pair)

#记录ccb替换字符串
def recodeReplaceCcb(fromStr,toStr):
    pair = {};
    pair["from"] = fromStr
    pair["to"] = toStr
    replaceCcb.append(pair)

#检查同名文件
def checkSameName(name):
    if sameNameMap.has_key(name):
        checkResult["sameName"].append(name)
    else:
        sameNameMap[name] = True

#检查同名属性
def checkSameAttr(name):
    if sameAttrMap.has_key(name):
        checkResult["sameAttr"].append(name)
    else:
        sameAttrMap[name] = True

def printCheckResoult():
    print "===检查结果==="
    print "同名图片检查结果:"
    print "    重复图片数:"+str(len(checkResult["sameName"]))
    for f in checkResult["sameName"]:
        print "        "+f
    print "同名属性检查结果:"
    print "    重复属性数:"+str(len(checkResult["sameAttr"]))
    for f in checkResult["sameAttr"]:
        print "        "+f

 
#文件路径转换全大写 好像会修改实参!!!
def attrFormat(file):
    f = file
    f = f.replace('.','_')
    f = f.replace('/','_')

    #判断数字开头
    numStart = re.compile('\d*')
    if len(numStart.match(file).group()) != 0:
        f = "_" + f

    f = f.upper()
    return f

#搜索nopack 不考虑子文件夹!!!
def searchNoPack(path):
    print '搜索nopack...'
    nopack = result['nopack']
    if os.path.isdir(path):
        for root, dirs, files in os.walk(path):
            for file in files:
                # 遍历文件名,组装为 onpack/xxx.png
                if isImg(file):
                    nopack.append(file)
    else:
        print 'nopack路径不存在!!!'

#搜索ccb 不考虑子文件夹!!!
def searchCcb(path):
    print '搜索ccb...'
    ccb = result['ccb']
    if os.path.isdir(path):
        for root, dirs, files in os.walk(path):
            for file in files:
                # 遍历文件名,组装为 onpack/xxx.png
                if isCcb(file):
                    ccb.append(file+"i")
    else:
        print 'ccb路径不存在!!!'

#搜索tps
def searchTps(path):
    print '搜索tps...'
    if os.path.isdir(path):
        for root, dirs, files in os.walk(path):
            for file in files:
                if file.endswith('.tps'):
                    # 遍历tps,内filelist 组装为 { plist: xxx.plist , png : xxx.png , pngs : [xxx.png,xxx.png] }
                    fullFile = os.path.join(root,file)
                    tps = searchTpsFile(fullFile)
                    result['tps'].append(tps)
            pass
    else:
        print 'tps路径不存在!!!'
        print path


#抽取一个tps文件内容
def searchTpsFile(rootPath):
    print rootPath
    tps = {}
    tps['pngs'] = []
    tree = ET.ElementTree(file= rootPath)
    for elem in tree.iter(tag='filename'):
        text = elem.text
        if text != None:
            if text.endswith('.png'):
                # 大图png路径
                tps['png'] = os.path.basename(text)
                pass
            elif text.endswith('.plist'):
                # 大图plist路径
                tps['plist'] = os.path.basename(text)
                pass
            elif text.endswith('.java'):
                pass
            else:
                #小图路径
                dirPath = os.path.join(os.path.dirname(rootPath),text)
                print dirPath
                searchDir(dirPath,tps['pngs'])
    return tps

def isImg(file):
    return file.endswith('.png') or file.endswith('.jpg')

def isCcb(file):
    return file.endswith('.ccb')

#抽取路径下所有图片
def searchDir(path,output):
    if os.path.isdir(path):
        for root, dirs, files in os.walk(path):
            #原文件夹相对路径
            relPath = os.path.relpath(root,path)

            #组装目标绝对路径
            if relPath == '.':
                relPath = ''

            for file in files:
                if isImg(file):
                    output.append(os.path.join(relPath,file))

#输出内容
def output(outputFile,str):
    outputFile.write(str)

#搜索目录
def searchImgPath(gameName,outputFile,imgPath,ccbPath,nopackDirName,tpsDirName):
    print gameName
    print outputFile
    print imgPath
    print ccbPath
    print nopackDirName
    print tpsDirName
    searchNoPack(os.path.join(imgPath,nopackDirName))
    searchTps(os.path.join(imgPath,tpsDirName))
    if ccbPath:
        searchCcb(ccbPath)
    printResult(outputFile,gameName)

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print '需要带参数: 游戏命名空间(ddz|hall|common) 和 输出路径 (ddz_resource.js) 和 图片根目录路径(img_src) < 和 ccb根目录路径(ccbproj/doudizhu/ccb)> '
    elif len(sys.argv) == 5:
        searchImgPath(sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],'nopack','tps')
    else:
        searchImgPath(sys.argv[1],sys.argv[2],sys.argv[3],None,'nopack','tps')

