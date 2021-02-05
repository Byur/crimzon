const fs = require('fs');


const readline = require('readline');
// 创建一个generator来实现一个单向的流程以及状态机
function*gen(){
    // 首度确认
    const start = function(ans){
        return ans==="Y"
    }
    /**
     * @description 验证路径的合理性（是否是目录）
     * @param {String} path
     */
    const validatePath = function (path) {
        try {
            const dir = fs.readdirSync(path)
            // console.log("dir",dir)
            if (dir) {
                return true
            }
        } catch(err){
            console.log("你提供的地址有误,请重新输入")
            return false
        }
    }

    const getPath = function (ans) {
        return validatePath(ans)?ans:"invalidpath"
    }

    const changeSettingFlag = yield start
    const settings = {
        volumeSize: 10,
        dirName: "新建分卷"
    }
    if (changeSettingFlag){
        // 改变预设
        const volumeSize = yield function(volumeSize){
            return volumeSize
        }
        settings.volumeSize = Number(volumeSize)||settings.volumeSize
        const dirName = yield function(dirName){
            return dirName
        }
        settings.dirName = dirName.trim()||settings.dirName
    }
    // 接收路径
    const pathInfo = {
        input: "",
        output: ""
    }
    const inputPath = yield getPath
    pathInfo.input = inputPath;
    const outputPath = yield getPath
    pathInfo.output = outputPath;
    const conf = {
        pathInfo,
        settings
    }
    console.log("conf",conf)
    yield conf
}

// 获取questtion的返回
/**
 * 
 * @param {String} question 
 * @param {Function} handler 
 */
function getQuestionResult(question,resolve){
    return new Promise((res)=>{
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question(question, (ans)=>{
            const handleResult = resolve(ans)
            rl.close()
            res(handleResult)
        })
    })
}

// run it 
async function workflow(generator){
    const func0 = generator.next().value
    const changeSettingFlag = await getQuestionResult("当前预设置如下：\n输出的分卷名：“新建分卷”;\n容量：10话/卷；\n希望调整预设吗？(Y/N) ",func0)
    let getvolumeSize,getdirName
    // 今天先假设changeSettingFlag为true
    if (changeSettingFlag){
        const func1 = generator.next(changeSettingFlag).value
        getvolumeSize = await getQuestionResult("你期望的卷容量是： (话/卷)",func1)
        const func2 = generator.next(getvolumeSize).value
        getdirName = await getQuestionResult("你期望的分卷名是",func2)
    }
    const func3 = generator.next(getdirName).value
    const inputPath = await getQuestionResult("你选择的源路径是：",func3)
    const func4 = generator.next(inputPath).value
    const outputPath = await getQuestionResult("你期望的输出路径是：",func4)
    const conf = generator.next(outputPath).value
    console.log("conf",conf)
    // // 当前计数
    // let currentCount = 0;
    // // 当前分卷
    // let currentVolume = 0;
    // async function getChildDir(path,updateFolderName="") {
    //     const childs = fs.opendirSync(path)
    //     let chunkNum = 0

    //     let newFolderPath = updateFolderName
    //     for await (const dirent of childs) {
    //         if (dirent.isDirectory()) {
    //             // 填充满一个池后新建一个池
    //             if (currentVolume%conf.settings.volumeSize===0) {
    //                 console.log("新一卷",conf.settings,conf.pathInfo)
    //                 chunkNum+=1;
    //                 newFolderPath = conf.pathInfo.output+"/"+conf.settings.dirName+"卷"+String(chunkNum)
    //                 fs.mkdirSync(newFolderPath)
    //             }
    //             currentVolume+=1
    //             const nextLevelPath = path+"/"+dirent.name
    //             getChildDir(nextLevelPath,newFolderPath)
    //         } else if (dirent.isFile()){
    //             currentCount += 1
    //             const extName = dirent.name.split(".").reverse()[0]
    //             const targetFilePath = path+"/"+dirent.name
    //             const newFileName = newFolderPath+"/"+currentCount+"."+extName
    //             fs.copyFileSync(targetFilePath,newFileName)
    //         }
    //     }
    // }
    // getChildDir(conf.pathInfo.input)
}

const g = gen()
workflow(g)



