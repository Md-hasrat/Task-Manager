import mongoose, { Schema } from "mongoose";


const todoSchema = new Schema({
    text:{
        type: String,
        required: true
    },
    completed:{
        type: Boolean,
        default: false
    },
})


const taskSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },  
    priority:{
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },
    status:{
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending"
    },
    dueDate:{
        type: Date,
        required: true
    },
    assignTo:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
    },
    createdBy:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
    },
    attachment:{
        type: [String],
        default: []
    },
    todoCheckList: [todoSchema],
    progress:{
        type: Number,
        default: 0,
    }
},{timestamps: true});

const Task = mongoose.model("Task", taskSchema);
export default Task;
