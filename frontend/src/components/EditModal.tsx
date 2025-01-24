import { useEffect, useState } from "react";
import { FaBold, FaItalic, FaListOl, FaListUl, FaTimes } from "react-icons/fa";
import { editTasks, singleUsertask } from "../services/taskService";
import { Task } from "../types";

function EditModal({ modalValue, editValue, setTasksValue, setOriginalTasks }: any) {

    const storedUserId = localStorage.getItem("userId");
    const [taskName, setTaskName] = useState("");
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("");
    const [tasks, setTasks] = useState<Task | null>(null);

    const maxLength = 3000;

    // // Dummy activity log data
    // const dummyActivities = [
    //     { activity: "You created this task", time: "Dec 27 at 1:15pm" },
    //     { activity: "Task updated", time: "Dec 28 at 9:00am" },
    //     { activity: "Comment added", time: "Dec 28 at 10:30am" },
    // ];

    const closeModal = () => {
        setTaskName("");
        setText("");
        setFile(null);
        setCategory("");
        setDate("");
        setStatus("");
        modalValue(false);
    };

    const handleChange = (event: any) => {
        if (event.target.value.length <= maxLength) {
            setText(event.target.value);
        }
    };

    const handleCategory = (event: any) => {
        setCategory(event.target.value);
    };

    const handleTaskName = (event: any) => {
        if (event.target.value.length <= maxLength) {
            setTaskName(event.target.value);
        }
    };

    const handleStatus = (event: any) => {
        setStatus(event.target.value);
    };

    const handleDate = (event: any) => {
        setDate(event.target.value);
    };

    const handleFileUpload = (e: any) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
        }
    };
    const handleSubmit = () => {
        (async () => {
            if (!taskName || !text || !date || !status || !category || !storedUserId) {
                alert("Please fill in all the required fields.");
                return;
            }
    
            try {
                const editedResponse = await editTasks(
                    taskName,
                    text,
                    date,
                    status,
                    category,
                    storedUserId,
                    editValue
                );
    
                const updatedTask = editedResponse?.data;
    
                if (updatedTask) {

                    setTasksValue((prevTasks: Task[]) => 
                        prevTasks.map(task => task._id === updatedTask._id ? updatedTask : task)
                    );
    
                    setOriginalTasks((prevOriginalTasks: Task[]) => 
                        prevOriginalTasks.map(task => task._id === updatedTask._id ? updatedTask : task)
                    );
                }
            } catch (error) {
                console.error("Error while editing the task:", error);
            } finally {
                modalValue(false);
            }
        })();
    };
    

    useEffect(() => {
        (async () => {
            const response = await singleUsertask(editValue)
            setTasks(response)
            setTaskName(response.title);
            setText(response.description);
            setCategory(response.category);
            setDate(response.dueDate);
            setStatus(response.status);
        })()
    }, [editValue])


    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-4xl flex gap-6">
    
                <div className="w-3/4">
                    <div className="flex justify-between">
                        <h2 className="text-xl font-bold"></h2>
                        <button onClick={closeModal} className="text-gray-600">
                            <FaTimes className="text-2xl" />
                        </button>
                    </div>
                    <div className="border-b border-gray-300 w-full my-2"></div>
                    <div className="mt-4">
                        <input
                            type="text"
                            onChange={handleTaskName}
                            value={taskName}

                            placeholder="Task Title"
                            className="w-full border rounded p-2 mb-2 bg-gray-200"
                        />
                        <div className="relative w-full border rounded p-2 h-40 mb-2">
                            <textarea
                                placeholder="Description"
                                className="w-full h-full bg-gray-200 p-2 resize-none focus:outline-none"
                                value={text}
                                onChange={handleChange}
                                maxLength={maxLength}
                            ></textarea>
                            <div className="absolute bottom-2 left-2 flex gap-4 text-gray-500">
                                <FaBold />
                                <FaItalic />
                                <FaListOl />
                                <FaListUl />
                            </div>
                            <span className="absolute bottom-2 right-2 text-gray-500 text-sm">
                                {text.length}/{maxLength} characters
                            </span>
                        </div>

                        <div className="flex flex-wrap justify-between mb-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-500">Task Category*</span>
                                <div className="flex items-start gap-1">
                                    <button
                                        onClick={handleCategory}
                                        value="work"
                                        className={`px-4 py-1 border rounded-full ${category === "work"
                                            ? "bg-[#7B1984] text-white"
                                            : "bg-transparent text-black"
                                            }`}
                                    >
                                        Work
                                    </button>

                                    <button
                                        onClick={handleCategory}
                                        value="personal"

                                        className={`px-4 py-1 border rounded-full ${category === "personal"
                                            ? "bg-[#7B1984] text-white"
                                            : "bg-transparent text-black"
                                            }`}
                                    >
                                        Personal
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-500">Due on*</span>

                                <input
                                    onChange={handleDate}
                                    value={date ? date.toString().split('T')[0] : ''}
                                    type="date"
                                    className="border rounded p-1"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-700">Task Status*</span>
                                <select
                                    onChange={handleStatus}
                                    className="border rounded p-1 text-gray-700"
                                >
                                    <option value={status} disabled selected>
                                        {status}
                                    </option>
                                    <option value="todo">Todo</option>
                                    <option value="inprogress">In-Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-gray-700">Attachment</span>
                            <div
                                className="w-full h-10 border-2 border-gray-500 bg-gray-100 flex items-center justify-center cursor-pointer"
                                onClick={() => {
                                    const fileInput = document.getElementById("fileInput");
                                    if (fileInput) {
                                        fileInput.click();
                                    }
                                }}
                            >
                                <input
                                    type="file"
                                    id="fileInput"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                                <span className="text-gray-500">
                                    Drop your files here or update
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                onClick={closeModal}
                                className="px-6 py-2 text-sm bg-gray-200 rounded-full"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 text-sm text-white rounded-full"
                                style={{ backgroundColor: "#7B1984" }}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>

                {/* Activity Sidebar
                <div className="w-1/4  p-4 rounded-lg overflow-y-auto h-[500px]">
                    <h3 className="text-sm text-gray-500 mb-4">Activity</h3>
                    <ul className="space-y-3">
                        {dummyActivities.map((activity, index) => (
                            <li
                                key={index}
                                className="p-2 bg-white rounded-lg shadow border border-gray-200"
                            >
                                <p className="text-sm font-semibold">{activity.activity}</p>
                                <span className="text-xs text-gray-500">{activity.time}</span>
                            </li>
                        ))}
                    </ul>
                </div> */}
            </div>
        </div>
    );
}

export default EditModal;
