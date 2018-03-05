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
# import Image 

try:
    import xml.etree.cElementTree as ET
except ImportError:
    import xml.etree.ElementTree as ET

#输出头
OUTPUT_HEAD = '''/*
    资源文件  {0}_resource.js
    本文件为脚本生成,请不要手工修改
*/
(function(){1}
    {0}.RES = {1}
        //ccb

'''
# 命名空间
nameSpace = ''
# spine文件想对路径
spineRelPath = ''
#spine文件头
OUTPUT_SPINE_FILE_FORMAT = '''
        //spine（骨骼动画）
'''

#spine文件格式
# 1:命名空间 2:spine文件存放的想对路径 3:文件名
OUTPUT_SPINE_FORMAT = '''        SPINE_{0} : 'games/{1}/img/{2}{3}',
'''
#nopack头
OUTPUT_NOPACK_HEAD_FORMAT = '''
        //nopack
'''

#nopack格式
OUTPUT_NOPACK_FORMAT = '''        NOPACK_{0} : 'games/{2}/nopack/{1}',
'''

#language格式
OUTPUT_LANG_FORMAT = '''        {0} : 'games/{2}/language/{1}',
'''
OUTPUT_SOUND_FORMAT= '''        {0} : 'games/{2}/sound/{1}',
'''
#nopack格式
OUTPUT_CCB_FORMAT = '''        {0} : 'games/{2}/ccbi/{1}',
'''

#nopack格式
OUTPUT_TPS_HEAD_FORMAT = '''
        //tps
'''

#tps格式
OUTPUT_TPS_FORMAT = '''
        //大图 {0} {1}
'''

#png格式
OUTPUT_PNG_FORMAT = '''        {0} : '{1}',
'''

#输出尾
OUTPUT_TAIL = '''
    {1};
{1})();
'''

#结果
result = {}
result['nopack'] = []
result['tps'] = []
result['ccb'] = []
result['language'] = []
result['sound'] = []
result['spine'] = [];

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

    print '打印 spine'
    output(outputFile, OUTPUT_SPINE_FILE_FORMAT)
    for spine in result['spine']:
        print '打印spine...' + spine
        # 生成变量名
        upper = attrFormat(spine)
        recodeReplace(upper, spine)
        # 1:命名空间 2:spine文件存放的想对路径 3:文件名
# OUTPUT_SPINE_FORMAT = '''        SPINE_{0} : 'games/{1}/img/{2}/{3}',
# '''
        output(outputFile, OUTPUT_SPINE_FORMAT.format(upper, nameSpace, spineRelPath, spine))
    print '打印 nopack...'
    output(outputFile,OUTPUT_NOPACK_HEAD_FORMAT)
    for png in result['nopack']:
        #生成变量名
        upper = attrFormat(png)
        checkSameName(upper)
        checkSameAttr(png)
        recodeReplace(png,upper)
        output(outputFile,OUTPUT_NOPACK_FORMAT.format(upper,png,gameName+"/img"))


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
            output(outputFile,OUTPUT_PNG_FORMAT.format(upper,png))

    print '打印 language...'
    output(outputFile,OUTPUT_NOPACK_HEAD_FORMAT)
    for lang in result['language']:
        #生成变量名
        upper = attrFormat(lang)
        checkSameName(upper)
        checkSameAttr(lang)
        recodeReplace(lang,upper)
        output(outputFile,OUTPUT_LANG_FORMAT.format(upper,lang,gameName))


    print '打印 sound...'
    output(outputFile,OUTPUT_NOPACK_HEAD_FORMAT)
    for lang in result['sound']:
        #生成变量名
        upper = attrFormat(lang)
        checkSameName(upper)
        checkSameAttr(lang)
        recodeReplace(lang,upper)
        output(outputFile,OUTPUT_SOUND_FORMAT.format(upper,lang,gameName))


    print '打印 尾...'+OUTPUT_TAIL.format(gameName,"}")
    output(outputFile,OUTPUT_TAIL.format(gameName,"}"))


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
            relpath = os.path.relpath(root, path)
            relpathlen = len(relpath)

            if spineRelPath.find(relpath+'/') > 0:
                # 过滤掉骨骼动画
                print '过滤掉骨骼动画'
                continue;
            for file in files:
                # 遍历文件名,组装为 onpack/xxx.png
                if isImg(file) or isPlist(file):
                    p = os.path.split(root)
                    if p[1] != "nopack":
                        nopack.append(p[1]+"/"+file)
                    else:
                        nopack.append(file)    
                    
    else:
        print 'nopack路径不存在!!!'

# 搜索spine（骨骼动画相关资源）
def searchSpine(path):

    if not os.path.isdir(path):
        return

    spine = result['spine']
    WithRelFormat = '{0}/{1}'
    for root, dirs, files in os.walk(path):
        relpath = os.path.relpath(root, path)
        relpathlen = len(relpath)
        for dstFile in files:
            if not isSpineFile(dstFile):
                continue
            if relpathlen > 1:
                dstFile = WithRelFormat.format(relpath, dstFile)
            spine.append(dstFile)

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

#搜索nopack 不考虑子文件夹!!!
def searchLanguage(path):
    print '搜索language...'
    language = result['language']
    if os.path.isdir(path):
        for root, dirs, files in os.walk(path):
            for file in files:
                # 遍历文件名,组装为 language/xxx.xml
                if isXml(file):
                    language.append(file)
    else:
        print 'language路径不存在!!!'
        print path

def searchSound(path):
    print '搜索Sound...'
    sound = result['sound']
    if os.path.isdir(path):
        for root, dirs, files in os.walk(path):
            relPath = os.path.relpath(root,path)
            for file in files:
                # 遍历文件名,组装为 language/xxx.xml
                if isSound(file):
                    print (os.path.join(relPath,file))
                    if relPath == '.':
                        sound.append(file)
                    else:
                        sound.append(os.path.join(relPath,file))
                    
    else:
        print 'sound路径不存在!!!'
        print path


def isXml(file):
    return file.endswith('.xml')

def isSound(file):
    return file.endswith('.wav') or file.endswith('.mp3')

def isImg(file):
    return file.endswith('.png') or file.endswith('.jpg')

def isPlist(file):
    return file.endswith('.plist')

def isCcb(file):
    return file.endswith('.ccb')

def isSpineFile(file):
    return file.endswith('png') or file.endswith('.json') or file.endswith('.atlas')

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
def searchImgPath(gameName,outputFile,imgPath,ccbPath,langPath,SoundPath,nopackDirName,tpsDirName,langDirName,soundDirName,spineDirName):
    print gameName
    print outputFile
    print imgPath
    print ccbPath
    print nopackDirName
    print tpsDirName
    print soundDirName
    print spineDirName

    searchSpine(os.path.join(imgPath, spineDirName))
    searchNoPack(os.path.join(imgPath,nopackDirName))

    searchTps(os.path.join(imgPath,tpsDirName))
    if langPath:
        searchLanguage(os.path.join(langPath,langDirName))
    if SoundPath:
        searchSound(os.path.join(SoundPath,soundDirName))
    if ccbPath:
        searchCcb(ccbPath)
    printResult(outputFile,gameName)

if __name__ == '__main__':

    nameSpace = sys.argv[1]
    # spine文件想对路径
    spineRelPath = 'nopack/spine/'
	
    if len(sys.argv) < 5:
        print '需要带参数: 游戏命名空间(ddz|hall|common) 和 输出路径 (ddz_resource.js) 和 图片根目录路径(img_src) < 和 ccb根目录路径(ccbproj/doudizhu/ccb)> '
    elif len(sys.argv) == 6:
        searchImgPath(sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5],None,'nopack','tps',None,'',spineRelPath)
    elif len(sys.argv) == 7:
        searchImgPath(sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5],sys.argv[6],'nopack','tps','','',spineRelPath)
    else:
        searchImgPath(sys.argv[1],sys.argv[2],sys.argv[3],None,None,'nopack','tps',None)

