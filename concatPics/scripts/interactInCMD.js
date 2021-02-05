const readline =require("readline")
const fs = require("fs")
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on("line",(line)=>{
    console.log("line",line)
})