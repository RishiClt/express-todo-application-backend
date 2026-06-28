
const express = require("express");
const fs = require("fs").promises;
const app = express();

let id =0;
async function readFileFromDB(){
    try{
        const dataFromTextFile = await fs.readFile('a.txt','utf-8');
        return JSON.parse(dataFromTextFile);
    }catch(err){
        return [];
    }
}

async function writeFileToDB(task){
    await fs.writeFile('a.txt',JSON.stringify(task , null , 2),'utf-8');
}


app.use(express.json());

app.post("/add", async(req , res)=>{
    const preparedData = await readFileFromDB();
    const inputMessage = req.body.message;
    const data = {
        id : ++id,
        message : inputMessage
    }

    console.log("Data before pushing "+preparedData);
    preparedData.push(data);
    console.log("Data after pushing "+preparedData);
    await writeFileToDB(preparedData);
    res.status(200).json({
        message : "Data added successfully."
    })

})


app.get("/:taskid",async(req , res)=>{
    let taskID = parseInt(req.params.taskid);
    console.log(taskID);
    const dataInDB = await readFileFromDB();
    let messageStored = dataInDB.filter(element => element.id === taskID);
    console.log(messageStored);
    res.json({
        todo : messageStored[0].message
    })

})


app.put("/update/:taskID", async(req, res)=>{
    let taskID = parseInt(req.params.taskID);
    const dataInDB = await readFileFromDB();
    
})

app.listen(3000,()=>{
    console.log("Application started listening on port 3000");
});