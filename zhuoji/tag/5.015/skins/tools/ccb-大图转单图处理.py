# -*- coding: utf-8 -*-  
# 使用方法: 
# python ccb-大图转单图处理.py mahjong /Users/likai/Documents/tuyoo_global/mahjong/trunk/skins/common/ccb /Users/likai/Documents/tuyoo_global/mahjong/trunk/skins/test

#用pip 安装 pillow 才可以用PIL
import PIL.Image  
import glob, os, sys  
import PIL.ImageFilter  

import types
try:
    import xml.etree.cElementTree as ET
except ImportError:
    import xml.etree.ElementTree  as ET


#分析JS代码中需求的ccb文件,把小图改大图
#所有图片全部转单图（nopack&scale_sprite里的图片将找不到，后续处理）
def __transfer( _src_path, _dst_path ):
    tree = ET.ElementTree(file=_src_path)
    for elem in tree.iter(tag='array'):
        #数组第一项必须是空值,第2项目则是png,jpg等资源
        #普通资源
        # if len(elem)>0 :
        #     if not isinstance(elem[0].text,types.NoneType):
        #         print "key name: "+elem[0].text
                # 把所有的plist 转成 空字符串(九宫图不可以)
                # elem[0].text = ""

        if len(elem)>0 :
            if not isinstance(elem[0].text,types.NoneType) and elem[0].text.find('.plist') >= 0:
                # print "key name: "+elem[0].text
                # 把所有的plist 转成 空字符串(九宫图不可以)
                elem[0].text = ""
        if len(elem)>1 :
            if not isinstance(elem[1].text,types.NoneType) and (elem[1].text.find('.png') >= 0 or elem[1].text.find('.jpg') >=0):
                # print "value path: "+elem[1].text
                # 把所有的大图里的路径 转小图文件名
                # if not isinstance(elem[0].text,types.NoneType) and elem[0].text.find('scale_sprite') >= 0:
                #     print ""#九宫图
                # else:
                pics = os.path.split(elem[1].text)
                pic  = pics[len(pics)-1]
                elem[1].text = pic
                
    #particle 粒子效果
    for elem in tree.iter(tag='dict'):
        #数组第一项必须是空值,第2项目则是png,jpg,ccb等资源
        #普通资源
        for sub in elem:
            # print sub.text
            if sub.text and (sub.text.find('.png') > 0 or sub.text.find('.jpg') >0):
                pics = os.path.split(sub.text)
                pic  = pics[len(pics)-1]
                sub.text = pic
    #处理后的ccb转存                
    tree.write(_dst_path)


#文件夹遍历
def check_path(_src,_dst):
    for root, dirs, files in os.walk(_src):
        print("\n$$$$$   开始扫描 {name} 文件夹".format(name=root))
        if len(dirs)>0:
            for dir in dirs:
                if (os.path.isdir(_dst+"/"+dir)==False):
                    os.mkdir(_dst+"/"+dir)
                check_path(root+"/"+dir,_dst)
        elif len(files)>0:
            for file in files:
                if file.find('.ccb') >= 0:
                    doc = os.path.split(root)
                    doc = doc[len(doc)-1]
                    print "ccb处理："+root+"/"+file,_dst+"/"+doc+"/"+file
                    __transfer(root+"/"+file,_dst+"/"+doc+"/"+file)
            


def ccbTps2SingleImage():
    game = sys.argv[1]
    src  = sys.argv[2]   #"/Users/likai/Documents/tuyoo_global/mahjong/trunk/skins/common/ccb"
    dst  = sys.argv[3]   #"/Users/likai/Documents/tuyoo_global/mahjong/trunk/skins/test"

    #删除目标目录的ccb文件夹，全新拷贝
    os.system("rm -r "+dst+"/ccb")
    os.mkdir(dst+"/ccb")
    check_path(src,dst+"/ccb")

    #拷贝ccb工程文件，目标工程文件可能需要手动配置
    os.system("rm -r "+dst+"/*.ccbproj")
    os.system("cp -f "+src+"/../*.ccbproj "+dst+"/"+game+".ccbproj")


    # for root, dirs, files in os.walk(src):
    #     print("\n$$$$$   开始扫描 {name} 文件夹".format(name=root))

    #     for doc in dirs:
    #         if (os.path.isdir(doc)==False):
    #             os.mkdir(doc)
    #         for file in 
    #     doc = os.path.split(root)
    #     doc = doc[len(doc)-1]#ccb文件夹里的子文件夹
    #     #根据对应的目录创建相应的目录
    #     print doc
        
    #     for file in files:
    #         __transfer(src+"/"+doc+"/"+file,dst+"/"+doc+"/"+file)
    # for files in glob.glob(src+'/*/*.ccb'):  #sys.argv[1]
    #     filepath,filename = os.path.split(files)  
    #     filterame,exts    = os.path.splitext(filename)  

    #     #创建目标目录的ccb文件夹
    #     if (os.path.isdir(dst)==False):  
    #         os.mkdir(dst)
    #     __transfer(filepath+"/"+filename,dst+"/"+filename)

        
if __name__=='__main__':  
    ccbTps2SingleImage()  
   
    print u'CCB TPS 大图转单图处理完毕'