import { useEffect, useState } from "react";
import { addTask, fetchTasks, taskDelete } from "../services/taskService";
import { Task } from "../types";
import EditModal from "./EditModal";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Board({ categoryValue, dueValue, searchValue, taskValue }: any) {
    const storedUserId = localStorage.getItem('userId');
    const [overDue, setOverview] = useState<Task[]>([]);
    const [_searchText, setSearchText] = useState('');
    const [thisWeek, setThisweek] = useState<Task[]>([]);
    const [todaysTask, setTodaysTasks] = useState<Task[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [originalTasks, setOriginalTasks] = useState<Task[]>([]);
    const [dropdownValue, setDropdownValue] = useState("");
    const [editTaskValue, setEditTaskValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    
        useEffect(() => {

            (async () => {
                const { file } = taskValue;
                const { taskName, text, date, status, category, storedUserId } = taskValue;
        
                if (!file) {
                    const newTaskResponse = await addTask(taskName, text, date, status, category, storedUserId,'');
                    console.log(newTaskResponse);
        
                    setTasks((prevTasks) => {
                        if (newTaskResponse && newTaskResponse.data.task) {
                            const newTask = newTaskResponse.data.task as Task;
                            return [...prevTasks, newTask];
                        }
                        console.error("Invalid task response", newTaskResponse);
                        return prevTasks;
                    });
                    return;
                }
        
                const storage = getStorage();
                const storageRef = ref(storage, `tasks/${Date.now()}_${file.name}`);
                const uploadSnapshot = await uploadBytes(storageRef, file);
        
                const fileUrl = await getDownloadURL(uploadSnapshot.ref);
                console.log("File uploaded successfully. File URL:", fileUrl);
        
                const newTaskResponse = await addTask(taskName, text, date, status, category, storedUserId, fileUrl);
                console.log(newTaskResponse);
        
                setTasks((prevTasks) => {
                    if (newTaskResponse && newTaskResponse.data.task) {
                        const newTask = newTaskResponse.data.task as Task;
                        return [...prevTasks, newTask];
                    }
                    console.error("Invalid task response", newTaskResponse);
                    return prevTasks;
                });
            })();
        }, [taskValue]);
        

    useEffect(() => {
        const searchKey = searchValue
        console.log(searchKey)
        setSearchText(searchKey);

        if (searchKey.trim() === '') {
            setTasks(originalTasks);
        } else {
            const filteredTasks = tasks.filter(task =>
                task.title.toLowerCase().includes(searchKey.toLowerCase())
            );
            setTasks(filteredTasks);
        }
    }, [searchValue])
    useEffect(() => {
        if (!storedUserId) return;
        (async () => {
            const response = await fetchTasks(storedUserId);
            setTasks(response);
            setOriginalTasks(response);
            setTodaysTasks(response);
            setOverview(response);
            setThisweek(response);
        })();
    }, [storedUserId]);


    useEffect(() => {

        const filterKey = categoryValue;
        if (!filterKey || filterKey === 'Category') {
            return;
        }
        if (filterKey === 'clearfilter') {
            setTasks(originalTasks);

        } else {
            const filteredTasks = originalTasks.filter(task =>
                task.category.toLowerCase() === filterKey.toLowerCase()
            );
            console.log(filteredTasks)
            setTasks(filteredTasks);

        }
    }, [categoryValue])


    const formatDate = (date: string) => {
        const taskDate = new Date(date);
        const today = new Date();


        taskDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (taskDate.getTime() === today.getTime()) {
            return 'Today';
        }

        const dateFormatted = taskDate.getDate();
        const monthFormatted = taskDate.getMonth() + 1;
        const yearFormatted = taskDate.getFullYear();
        return `${dateFormatted}/${monthFormatted}/${yearFormatted}`;
    };


    const renderTaskList = (taskList: Task[], status: string[]) => {
        if (taskList.length === 0) {
            return (
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-center text-lg text-gray-500">No tasks in {status}</p>
                </div>
            );
        }

        const handleEdit = (e: React.ChangeEvent<HTMLSelectElement>, _id: string) => {
            (async () => {
                const taskId = _id
                const action = e.target.value
                if (action === 'delete') {
                    await taskDelete(taskId)
                    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
                    setOriginalTasks((prevOriginalTasks) =>
                        prevOriginalTasks.filter((task) => task._id !== taskId)
                    );
                    setDropdownValue("");
                } else {
                    setEditTaskValue(taskId);
                    setIsModalOpen(true);
                }
            })()
        }
        return taskList.map((task) => (

            <div
                key={task._id}
                className="bg-white p-4 rounded-md shadow-sm flex flex-col h-full relative"
            >

                <div className="flex justify-between items-start mb-9">
                    <h3 className="font-bold text-gray-800">{task.title}</h3>
                    <div className="relative">
                        <select
                            value={dropdownValue}
                            onChange={(e) => handleEdit(e, task._id)}
                            className="appearance-none font-bold rounded-lg py-2 px-4 pr-10 "
                        >
                            <option selected disabled value="" className="text-gray-500 text-right">
                                ...
                            </option>
                            <option className=" bg-[#FFF9F9] text-black hover:bg-[#7B1984] hover:text-white" value="edit">
                                Edit
                            </option>
                            <option className=" bg-[#FFF9F9] text-black hover:bg-[#7B1984] hover:text-white" value="delete">
                                Delete
                            </option>
                        </select>
                    </div>
                </div>

                <div className="mt-auto flex justify-between">
                    <p className="text-sm text-gray-500">{task.category}</p>
                    <p className="text-sm text-gray-500 ">{formatDate(task.dueDate)}</p>
                </div>
            </div>
        ));

    };

    useEffect(() => {
        if (!dueValue) return;

        (async () => {
            console.log(dueValue);
            const currentDate = new Date();
            let filteredTasks;

            if (dueValue === 'all') {
                filteredTasks = originalTasks;
            } else {
                switch (dueValue) {
                    case 'today':
                        filteredTasks = todaysTask.filter(task => {
                            const taskDueDate = new Date(task.dueDate);
                            taskDueDate.setHours(0, 0, 0, 0);
                            currentDate.setHours(0, 0, 0, 0);
                            return taskDueDate.getTime() === currentDate.getTime();
                        });
                        break;

                    case 'overdue':
                        filteredTasks = overDue.filter(task => {
                            const taskDueDate = new Date(task.dueDate);
                            return taskDueDate < currentDate;
                        });
                        break;

                    case 'thisweek':
                        filteredTasks = thisWeek.filter(task => {
                            const taskDueDate = new Date(task.dueDate);
                            const startOfWeek = new Date(currentDate);
                            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
                            startOfWeek.setHours(0, 0, 0, 0);
                            const endOfWeek = new Date(startOfWeek);
                            endOfWeek.setDate(startOfWeek.getDate() + 6);
                            endOfWeek.setHours(23, 59, 59, 999);
                            return taskDueDate >= startOfWeek && taskDueDate <= endOfWeek;
                        });
                        break;

                    default:
                        filteredTasks = tasks;
                }
            }

            setTasks(filteredTasks);
        })();
    }, [dueValue]);

    return (
        <div className="min-h-screen bg-white px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-200 rounded-md shadow p-4" style={{ minHeight: '400px' }}>
                    <h2 className="text-sm font-bold text-black mb-4 px-4 py-2 rounded-lg inline-block" style={{ backgroundColor: '#FAC3FF' }}>
                        TO-DO
                    </h2>
                    <div className="space-y-4">

                        {renderTaskList(tasks.filter(task => task.status === 'todo'), ['TO-DO'])}
                    </div>
                </div>

                <div className="bg-gray-200 rounded-md shadow p-4">
                    <h2 className="text-sm font-bold text-black mb-4 px-4 py-2 rounded-lg inline-block" style={{ backgroundColor: '#85D9F1' }}>
                        IN-PROGRESS
                    </h2>
                    <div className="space-y-4">
                        {renderTaskList(tasks.filter(task => task.status === 'inprogress'), ['IN-PROGRESS'])}
                    </div>
                </div>
                <div className="bg-gray-200 rounded-md shadow p-4">
                    <h2 className="text-sm font-bold text-black mb-4 px-4 py-2 rounded-lg inline-block" style={{ backgroundColor: '#CEFFCC' }}>
                        COMPLETED
                    </h2>
                    <div className={`space-y-4 ${tasks.filter(task => task.status === 'completed').length === 0 ? '' : 'line-through'}`}>
                        {renderTaskList(tasks.filter(task => task.status === 'completed'), ['COMPLETED'])}
                    </div>
                </div>


            </div>
            {isModalOpen && (
                <EditModal modalValue={setIsModalOpen} editValue={editTaskValue} setTasksValue={setTasks} setOriginalTasks={setOriginalTasks} />
            )}
        </div>

    );
}

export default Board;
