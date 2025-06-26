const expess = require('express');
const app = expess();

const connectDB = require('./config/conn');
const list = require('./models/list');
const { error } = require('cros/common/logger');
const cors = require('cors')
connectDB();

app.use(cors());

app.use(expess.json());
app.use(expess.urlencoded());



app.get('/tasks',async (req,res)=>{

    try {
        const listData = await list.find();
        if(!listData){
            res.json({error:"No data found"});
        }
        res.status(200).json(listData);

        
    } catch (error) {

        console.log("error in server side "+error);
        
    }

    


})


app.post('/tasks',async (req,res)=>{
    try {
        console.log(req.body.task)
        if (req.body.task != null) {
            const taskData = new list({
                item:req.body.task,
                done: req.body.done || false  // Default to false if not provided
            })

            const data = await taskData.save();

            // Return the created task instead of just a message
            res.status(201).json(data);
            
        } else {
            res.status(404).json({error:"you not give data"})
        }
        
    } catch (error) {
        console.log("error in serverside "+error);
        res.status(500).json({error: "Server error"});
    }
})
app.delete('/tasks/:id', async(req,res)=>{

    try {
        console.log(req.params.id);
        const id = req.params.id;
       if(! req.params.id){
        res.status(404).json({error:"give me id of task"})
       }
       const tastD = await list.deleteOne({_id:id});

       res.status(204).json({message:"task deleted "+tastD});



        
    } catch (error) {
        console.log(error)
    }

})

app.put('/tasks/:id',async (req,res)=>{

    try {
        const id = req.params.id;
        const task = req.body.task;
        const donet = req.body.done;
        if(!id && !req.body.task){
            res.status(404).json({error:"id and task not given"})
        }

        const  data = await list.updateOne({_id:id},{item:task,done:donet});

        res.status(200).json({
            message:"updated",
            data:data
        })
        
    } catch (error) {

        console.log(error);
        
    }




})



app.listen(5000,()=>{
    console.log("server runing on 5000");
})