#! /usr/bin/python   
# -*- coding: UTF-8 -*-  
#
#   本工具的作用是根据ccb把该ccb中用到的所有原始图片  
#   拷贝到以该ccb名命名的文件夹内
#   或者把与ccb同名的文件夹内的图片拷贝到原图的位置
#   这两者结合就会有助于开始时大规模替换图片，比如把麻将原来的皮肤mj_rural_的图片摘出来，把现在mj_rural下的图片也摘出来
#   比较对应文件夹下的图片，用mj_rural_下面的图片替换mj_rural下面的对应图片，执行上传至原图片路径，即选2即可把改过的图片
#   拷贝回原图位置进行覆盖。因为后面的文件夹可能包含前面修改的文件，导致修改无效，所以建议5个文件5个文件的改，确定没问题的，
#   留下进行上传，没有改过去的文件夹删掉，执行。然后再执行摘出，改第6--10个文件夹。一次改5个，后面每个文件夹都很小，而且
#   前面已经改过，几次就差不多改完了。
#   author dudu
#   设计思路：分几步
#   1、先找到ccb 里面所有的plist和具体图片比如btn_return.png
#   2、找到plist对应的tps
#   3、根据tps设定的路径吧btn_return.png 拷贝到指定目录下
#   或者逆过程
#   只需要改skinPath(摘出路径)和exSkinPath(上传路径）即可 根据自己需要也可改一下destPath 和 exSrcPath

import sys, os, re ,md5
import Image 
import shutil,string
try:
    import xml.etree.cElementTree as ET
except ImportError:
    import xml.etree.ElementTree as ET

###以下这几个路径是根据扫描ccb来把用到的图片拷到指定目录下 摘出路径
#皮肤路径 
skinPath        = "/Users/tuyoo/Desktop/workSpace/games/hall/trunk/skins/mj_rural"
#ccb的根目录
ccbRootPath     = skinPath + "/hall/ccbproj/hall/ccb"
#指定拷贝的路径 摘出的路径会放到这里，可以修改成exSrcPath.这样两个路径一致的话，直接在该文件夹下操作就可以上传回原处。
destPath        = skinPath + "/hall/ccbproj/hall/exSrcPath"
#tps 路径
tpsPath         = skinPath + "/hall/img_src/tps"
#common tps path
comTpsPath      = skinPath + "/common/img_src/tps"

###以下这几个路径是根据与ccb同名的文件夹来替换 上传路径。tps引用的原图片路径，如果tps下面没有对应的图片则不拷贝
#皮肤路径
exSkinPath        = "/Users/tuyoo/Desktop/workSpace/games/hall/trunk/skins/mj_rural"
#ccb的根目录
exCCBRootPath     = exSkinPath + "/hall/ccbproj/hall/ccb"
#指定拷贝的路径 以此文件夹下面的图片资源上传回原图位置
exSrcPath         = exSkinPath + "/hall/ccbproj/hall/exSrcPath"
#tps 路径
exTpsPath         = exSkinPath + "/hall/img_src/tps"
#common tps path
exComTpsPath      = exSkinPath + "/common/img_src/tps"
#test ccb
testCCB         = "hall_classics_btn.ccb"
#根据ccb找到所使用的所有图片
def getAllImgByCCB(ccbPath):
    plistArr = []
    pngArr   = []
    otherArr = [] #nopack 未打入plist的放到这里
    if os.path.isfile(ccbPath):
        tree = ET.ElementTree(file= ccbPath)
        for elem in tree.iter(tag='array'):
            firstText   = ''
            secondText  = ''
            if len(elem) != 2:
                continue;
            # print '{'
            for item in elem.iter():
                if item.tag == 'string':
                    text = item.text
                    # print 'text = ',text
                    if text == None:
                        continue
                    if  '.png' in text or '.jpg' in text:
                        secondText = text
                    if  '.plist' in text:
                        if text.find('/') != -1:
                            temp = string.split(text,'/')
                            firstText = temp[-1]
                        else:
                            firstText = text
            if firstText != '' and secondText != '':#plist
                plistArr.append(firstText)
                pngArr.append(secondText)
            elif secondText != '':#nopack
                otherArr.append(secondText.replace('/img/','/img_src/'))
            # print '}\n'
    else:
        print 'can not find ccb ',ccbPath
    print  plistArr,'\n'
    print  pngArr,'\n'
    print  otherArr,'\n'
    return plistArr ,pngArr,otherArr

#根据plist和png，tps找到原图 isNeedCopy 只是查找路径还是顺便copy资源 
#isCollectImg 从ccb中取出图片，还是把图片拷贝到原图路径下
def copyOrFindImgByplist(plist,png,destDir,isNeedCopy,isCollectImg):
    print "\ncopyOrFindImgByplist begin plist = " + plist + ",png "+ png;
    if isCollectImg:
        tpsFile = tpsPath + '/' + plist[0:-5] + 'tps'
    else:
        tpsFile = exTpsPath + '/' + plist[0:-5] + 'tps'
     
    if not os.path.isfile(tpsFile):
        print 'hall tps path ',tpsFile,' not exit use common'
        if isCollectImg:
            tpsFile = comTpsPath + '/' + plist[0:-5] + 'tps'
        else:
            tpsFile = exComTpsPath + '/' + plist[0:-5] + 'tps'
        print 'common tps path ',tpsFile
        if not os.path.isfile(tpsFile):
            print 'tpsFile ',tpsFile + " is not exist."
            return ''
    tree = ET.ElementTree(file= tpsFile)
    for elem in tree.iter(tag='array'):
        for item in elem.iter():
            if item.tag == 'filename':
                if isCollectImg:
                    srcFilesPath = tpsPath + '/' + item.text + '/' + png
                else:
                    srcFilesPath = exTpsPath + '/' + item.text + '/' + png
                if not os.path.isfile(srcFilesPath):
                    print ' srcFilesPath：' ,srcFilesPath,' not exist use common'
                    if isCollectImg:
                        srcFilesPath = comTpsPath + '/' + item.text + '/' + png
                    else:
                        srcFilesPath = exComTpsPath + '/' + item.text + '/' + png
                    print ' srcFilesPath is ' ,item.text,'------',srcFilesPath
                if not os.path.isdir(destDir) and isNeedCopy:
                    os.makedirs(destDir)
                if os.path.isfile(srcFilesPath):
                    if isNeedCopy:
                        print 'copy ', png,' success'
                        shutil.copy(srcFilesPath,destDir)
                    index =  string.rfind(srcFilesPath,'/') 
                    return srcFilesPath[0:index]
                else:
                    print 'copy ', png,' fail'
                    print 'ERROR  srcFilesPath : ' ,srcFilesPath," not exist"
                    print 'check tpsFile path ',tpsFile
    return ''

#拷贝nopack下面的资源
def copyNopackImg(nopackArr,destDir):
    print 'nopackArr ',nopackArr,'\n'
    for x in nopackArr:
        srcFilesPath  = skinPath + '/' + x
        if not os.path.isdir(destDir):
            os.makedirs(destDir)
            if os.path.isfile(srcFilesPath):
                shutil.copy(srcFilesPath,destDir)

#MD5 计算
def fileMd5(filePath):
    ret = "ERROR"
    if os.path.isfile(filePath):
        file = open(filePath,'r')
        ret = md5.new( file.read() ).digest()
        file.close()
    return ret

# 找到数组中包含字符串的下标
def findIndexByStr(arr,str):
    for x in xrange(0,len(arr)):
        if string.find(arr[x],str) != -1:
            return x
    return -1

if __name__ == '__main__':
    ##大调的时候不要删除，微调时，把相同的图片删除，以后不再检查该图片
    isDeleteSameImg = False
    print '(1)你想根据ccb来把用到的图片都拷到',destPath,'下面吗\n','(2)想根据',exSrcPath,' 这个下面的图片来改原图?\n(3)清理' \
        , destPath + '下的图片\n','(4)清理',exSrcPath,'下的图片'
    line = sys.stdin.readline()
    if line[0] == '1':
        for root, dirs, files in os.walk(ccbRootPath):
            for file in files:
                if file.endswith('.ccb'):
                    print " deal file = " + file
                    destDir = destPath + '/' + file[0:-4]
                    plistArr, pngArr,otherArr = getAllImgByCCB(ccbRootPath + "/" + file)
                    if len(plistArr) != len(pngArr):
                        print '\n ERROR!!! plistArr len =',len(plistArr),';pngArr len = ',len(pngArr)
                    for x in xrange(0,len(plistArr)):
                        print 'x =  ',x
                        copyOrFindImgByplist(plistArr[x], pngArr[x],destDir,True,True)
                        copyNopackImg(otherArr,destDir)
    if line[0] == '2':
        lastRoot    = ''
        plistArr    = []
        pngArr      = []
        otherArr    = []
        for root, dirs, files in os.walk(exSrcPath):
            for file in files:
                if file.endswith('.png') or file.endswith('.jpg'):
                    # os.remove(root + '/' + file)
                    print 'file ',file
                    temp = string.split(root,'/')
                    ccbName = temp[-1] + '.ccb'
                    if lastRoot != root:#避免同一个ccb下重复读取ccb文件
                        plistArr, pngArr,otherArr = getAllImgByCCB(exCCBRootPath + "/" + ccbName)
                        lastRoot = root
                        print 'root' ,root
                        print 'ccbName ',ccbName
                        print '---------------------'
                        print '--------------------------'

                    fileIndexInpngArr = findIndexByStr(pngArr,file);
                    if  fileIndexInpngArr >= 0:# 在plist里面，通过索引找到源文件路径
                        print 'fileIndexInpngArr ',fileIndexInpngArr
                        filePath = copyOrFindImgByplist(plistArr[fileIndexInpngArr],pngArr[fileIndexInpngArr],'',False,False)
                        # print 'filePath = ',filePath
                        if filePath != '': #工程img_src下面有对应的图片，则把本文件夹内的图片拷过去
                            premd5 = fileMd5(lastRoot + '/'+file)
                            after  = fileMd5(filePath + '/'+file)
                            if premd5 == after and isDeleteSameImg:
                                print '两个文件相同不需要拷贝，删除该图片'
                                os.remove(lastRoot + '/' + file)
                            else:
                                print 'copy file = ' ,file,' success!'
                                shutil.copy(lastRoot + '/'+file,filePath)
                        else:
                            print 'copy file = ' ,file,' fail!'
                            print file + ' not in use in img_src, no need copy. Go on'
                        #检查在不在nopack里面，otherArr里面放有相对路径，只取png或者jpg部分进行比较
                    else: #到nopack下面找找，看看能不能找到。
                        print file, ' not in pngArr,otherArr ',otherArr
                        for img in otherArr:
                            temp = string.split(img,'/')
                            # print 'temp[-1] = ',temp[-1]
                            if file == temp[-1]: #在nopack 里面
                                filePath     = exSkinPath + '/' + img 
                                filePath     = filePath[0:filePath.rfind('/')]
                                premd5 = fileMd5(lastRoot + '/'+file)
                                after  = fileMd5(filePath + '/'+file)
                                if premd5 == after and isDeleteSameImg:
                                    print '两个文件相同不需要拷贝，删除该图片'
                                    print 'copy nopack file = ',file,' fail'
                                    os.remove(lastRoot + '/' + file)
                                else:
                                    print 'copy nopack file = ',file,' success'
                                    shutil.copy(lastRoot + '/'+file,filePath)
                                break
                    print '\n'
    if line[0] == '3':
        for root, dirs, files in os.walk(destPath):
            for file in files:
                if file.endswith('.png') or file.endswith('.jpg'):
                    os.remove(root + '/' + file)
    if line[0] == '4':
        for root, dirs, files in os.walk(exSrcPath):
            for file in files:
                if file.endswith('.png') or file.endswith('.jpg'):
                    os.remove(root + '/' + file)

                    



                               







