"use client"
import axios from "axios";
import { useState, useEffect } from "react";

export default function Home() {

    const base = "http://localhost:5000"

    const [taskdata, setTask] = useState([]);
    const [indata, setIndata] = useState("")
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        const ts = async () => {
            try {
                const data = await axios.get(base + "/tasks");
                setTask(data.data);
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            } finally {
                setIsLoading(false);
            }
        }

        ts();
    }, []);

    const toggletask = async (id, cstatus) => {
        try {
            await axios.put(base + "/tasks/" + id, {
                done: !cstatus
            });

            setTask(taskdata.map(task => 
                task._id === id 
                    ? { ...task, done: !cstatus }
                    : task
            ));
            
        } catch (error) {
            console.log('error', error);
        }
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(base + "/tasks/" + id);
            setTask(taskdata.filter(task => task._id !== id));
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    }

    const handelAdd = async () => {
        if (!indata.trim()) return; 
        
        try {
            const response = await axios.post(base + "/tasks", {
                task: indata
            });
            setTask([...taskdata, response.data]);
            setIndata(""); 
        } catch (error) {
            console.error("Failed to add task:", error);
        }
    }

    const handleUpdate = async (id) => {
        const task = taskdata.find(t => t._id === id);
        setEditingId(id);
        setEditText(task.item);
    }

    const saveUpdate = async (id) => {
        if (!editText.trim()) return;
        
        try {
            await axios.put(base + "/tasks/" + id, {
                item: editText
            });

            setTask(taskdata.map(task => 
                task._id === id 
                    ? { ...task, item: editText }
                    : task
            ));

            setEditingId(null);
            setEditText("");
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    }

    const cancelUpdate = () => {
        setEditingId(null);
        setEditText("");
    }

    return (
        <div className="min-h-screen bg-blue-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
    
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        TaskFlow
                    </h1>
                    <p className="text-gray-600">Organize your day, accomplish your goals</p>
                </div>

 
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-6">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <input
                                className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                                type="text" 
                                placeholder="What needs to be done?" 
                                value={indata}
                                onChange={(e) => setIndata(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handelAdd()}
                            />
                            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <button
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg flex items-center gap-2 font-medium"
                            onClick={handelAdd}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Task
                        </button>
                    </div>
                </div>
         
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="flex items-center gap-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="text-gray-600 font-medium">Loading your tasks...</span>
                            </div>
                        </div>
                    ) : taskdata.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No tasks yet</h3>
                            <p className="text-gray-600">Add your first task above to get started!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {taskdata.map((task, index) => (
                                <div 
                                    key={task._id} 
                                    className={`p-6 transition-all duration-200 hover:bg-gray-50/50 ${
                                        task.done ? 'opacity-75' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Checkbox */}
                                        <button
                                            onClick={() => toggletask(task._id, task.done)}
                                            className={`relative w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                                                task.done 
                                                    ? 'bg-blue-600 border-blue-600 text-white' 
                                                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                                            }`}
                                        >
                                            {task.done && (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>

                                        {/* Task Content */}
                                        <div className="flex-1 min-w-0">
                                            {editingId === task._id ? (
                                                <input
                                                    type="text"
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    className="w-full px-3 py-2 bg-blue-50 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    autoFocus
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') saveUpdate(task._id);
                                                        if (e.key === 'Escape') cancelUpdate();
                                                    }}
                                                />
                                            ) : (
                                                <p className={`text-lg font-medium transition-all duration-200 ${
                                                    task.done 
                                                        ? 'line-through text-gray-500' 
                                                        : 'text-gray-800'
                                                }`}>
                                                    {task.item}
                                                </p>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2">
                                            {editingId === task._id ? (
                                                <>
                                                    <button
                                                        onClick={() => saveUpdate(task._id)}
                                                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                                        title="Save changes"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={cancelUpdate}
                                                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                                        title="Cancel editing"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdate(task._id)}
                                                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                        title="Edit task"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(task._id)}
                                                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                        title="Delete task"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                {taskdata.length > 0 && (
                    <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-800">{taskdata.length}</div>
                                    <div className="text-sm text-gray-600">Total</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{taskdata.filter(t => t.done).length}</div>
                                    <div className="text-sm text-gray-600">Completed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{taskdata.filter(t => !t.done).length}</div>
                                    <div className="text-sm text-gray-600">Remaining</div>
                                </div>
                            </div>
                            
                            
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
