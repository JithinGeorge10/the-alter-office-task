import { useEffect, useState } from "react";
import {
    FaSort,
    FaBars,
    FaCheckCircle

} from "react-icons/fa";
import { addTask, changeStatus, fetchTasks } from "../services/taskService";
import { Section, Task } from '../types'

function List({ categoryValue, searchValue ,taskValue}: any) {
    console.log(categoryValue)
    const storedUserId = localStorage.getItem('userId');
    const [searchText, setSearchText] = useState('');

    const [openSections, setOpenSections] = useState<string[]>([]);
    const [originalTasks, setOriginalTasks] = useState<Task[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const sections: Section[] = [
        { title: "todo", color: "#FAC3FF" },
        { title: "inprogress", color: "#85D9F1" },
        { title: "completed", color: "#CEFFCC" },
    ];

    useEffect(() => {
        if (!storedUserId) return;
        (async () => {
            const response = await fetchTasks(storedUserId);
            setTasks(response);
            setOriginalTasks(response)
        })();
    }, [storedUserId]);


    const toggleSection = (sectionTitle: string) => {
        console.log("Toggling section: ", sectionTitle);
        console.log("Current open sections: ", openSections);
        setOpenSections((prevOpenSections) =>
            prevOpenSections.includes(sectionTitle)
                ? prevOpenSections.filter((title) => title !== sectionTitle)
                : [...prevOpenSections, sectionTitle]
        );
    };


    const dummyTasks: Task[] = tasks
    const filterTasksByStatus = (status: string) => {
        return dummyTasks.filter(task => task.status === status);
    }

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>, _id: string) => {
        try {
            const status = e.target.value;
            const response = await changeStatus(status, _id);
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === response.user._id ? { ...task, status } : task
                )
            );
            setOriginalTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === response.user._id ? { ...task, status } : task
                )
            );
            console.log(response);
        } catch (error) {
            console.error("Failed to change status:", error);
        }
    };


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
            setTasks(filteredTasks);
        }
    }, [categoryValue])


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
        if (!taskValue) return;
        (async () => {
            const {taskName, text, date, status, category, storedUserId}=taskValue
              const newTaskResponse = await addTask(taskName, text, date, status, category, storedUserId)
              console.log(newTaskResponse)
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
    
    

    return (
        <>
            <div className="mx-4 border-b border-gray-300"></div>
            <div className="flex mx-4 mb-0 text-gray-500">
                <span className="font-bold w-1/5">Task</span>
                <span className="font-bold flex items-center w-2/5 justify-center">
                    Due
                    <FaSort className="ml-2 text-gray-500" />
                </span>
                <span className="font-bold w-1/5  text-center">Status</span>
                <span className="font-bold w-1/5  text-center">Category</span>
                <span className="font-bold w-1/5"></span>
            </div>
            <main className="p-4">
                {sections.map((section) => (
                    <div key={section.title} className="mb-4">
                        <div
                            className="flex justify-between items-center p-2 rounded-md text-black cursor-pointer"
                            style={{ backgroundColor: section.color }}
                            onClick={() => toggleSection(section.title)}
                        >
                            <span>
                                {section.title} ({filterTasksByStatus(section.title).length})
                            </span>
                            <div
                                className={`w-3 h-3 border-t-2 border-r-2 transform ${openSections.includes(section.title)
                                    ? "rotate-180"
                                    : "-rotate-45"
                                    }`}
                                style={{ borderColor: "black" }}
                            ></div>
                        </div>

                        {openSections.includes(section.title) && (
                            <div className="flex flex-col items-start p-4 border border-gray-300 rounded-md mt-2 bg-gray-100">
                                <div className="w-full">
                                    {filterTasksByStatus(section.title).length === 0 ? (
                                        <div className="text-center text-black">
                                            No Tasks in {section.title}
                                        </div>
                                    ) : (
                                        <table className="w-full">
                                            <tbody>
                                                {filterTasksByStatus(section.title).map((task, index) => {

                                                    const taskDate = new Date(task.dueDate);
                                                    const today = new Date();
                                                    const isToday =
                                                        taskDate.toDateString() === today.toDateString();
                                                    const formattedDate = isToday
                                                        ? "Today"
                                                        : new Intl.DateTimeFormat("en-US", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        }).format(taskDate);
                                                    return (
                                                        <tr key={index} className="border-b border-gray-300">
                                                            <td className="py-3 px-3 flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    className="mr-2"
                                                                    readOnly

                                                                />
                                                                <FaBars className="mr-2" />
                                                                <FaCheckCircle
                                                                    className={`mr-2 ${task.status === "completed"
                                                                        ? "text-green-500"
                                                                        : "text-gray-400"
                                                                        }`}
                                                                />
                                                                <span
                                                                    className={`${task.status === "completed"
                                                                        ? "line-through text-black-500"
                                                                        : ""
                                                                        }`}
                                                                >
                                                                    {task.title}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-3 w-1/4 text-center">
                                                                {formattedDate}
                                                            </td>
                                                            <td className="py-3 px-3 w-1/4 text-center">
                                                                <select
                                                                    value={task.status}
                                                                    onChange={(e) => handleStatusChange(e, task._id)}
                                                                    className="appearance-none bg-gray-300 border rounded-lg py-2 px-4 pr-10"
                                                                >
                                                                    <option value="todo">Todo</option>
                                                                    <option value="inprogress">In Progress</option>
                                                                    <option value="completed">Complete</option>
                                                                </select>
                                                            </td>
                                                            <td className="py-3 px-3 w-1/4">{task.category}</td>
                                                            <td className="text-lg font-bold">...</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </main>
        </>
    )
}

export default List
