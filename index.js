//creating an express server as backend for a todo-application

const express = require("express");
const fs = require("fs").promises;
const app = express();



async function readFileFromDB(){
    try{
        const dataFrom = await fs.readFile('a.txt','utf-8');
        return JSON.parse(dataFrom);
    }catch(err){
        return [];
    }
}

async function writeDataToDB(task){
    await fs.writeFile('a.txt',JSON.stringify(task,null , 2),'utf-8');
}

async function setID(){
    let arrayFromDB =await readFileFromDB()
    return arrayFromDB.length -1;
}


app.use(express.json());
app.post("/add", async(req , res)=>{
    let datainTextFile = await readFileFromDB();
    let id = await setID();
    const obj = {
        id : ++id,
        message : req.body.message
    }
    datainTextFile.push(obj);
    await writeDataToDB(datainTextFile);
    res.status(200).json({
        message :"Data wtitten to the file successfully"
    })
})

app.delete("/delete/:userID" ,async(req , res)=>{
    let count =0;
    let finalCount =0
    let datainTextFile = await readFileFromDB();
    // console.log(datainTextFile);
    datainTextFile.forEach((element)=>{
        if(element.id === parseInt(req.params.userID)){
            finalCount = count;
        }else{
            count++;
        }
    })
    let indexOfTarget = finalCount;
    datainTextFile.splice(indexOfTarget,1);
    await writeDataToDB(datainTextFile);
    res.status(200).json({
        message : "Deleted data from file successfully"
    })
})

app.put("/modify/:userID" , async(req , res)=>{
    let count = 0;
    let finalCount = 0
    let datainTextFile = await readFileFromDB();
    datainTextFile.forEach((element)=>{
        if(element.id === parseInt(req.params.userID)){
            finalCount = count;
        }else{
            count++;
        }
    })
    let indexOfTarget = finalCount;
    // console.log(indexOfTarget);
    // console.log(datainTextFile);
    let newMessage = req.body.message;
    datainTextFile[indexOfTarget].message = newMessage;
    await writeDataToDB(datainTextFile);
    res.status(200).json({
        message : "todo modified"
    })
})


app.get("/getAll", async(req , res)=>{
    let datainTextFile = await readFileFromDB();
    res.status(200).json(datainTextFile);
})

app.get("/get/:id" , async(req, res)=>{
    let datainTextFile = await readFileFromDB();
    let obj = {};
    datainTextFile.forEach(element =>{
        if(element.id === parseInt(req.params.id)){
            obj = element;
        }
    })

    res.status(200).json(obj); 
})

app.listen(3000,()=>{
    console.log("Application started listening on port 3000")
})