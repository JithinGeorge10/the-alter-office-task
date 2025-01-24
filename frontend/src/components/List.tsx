import React, { Component } from "react";

import { useEffect, useState } from "react";
import {
    FaSort,
    FaBars,
    FaCheckCircle

} from "react-icons/fa";
import { addTask, changeStatus, deleteBatch, fetchTasks, statusChangeBatch, taskDelete } from "../services/taskService";
import { Section, Task } from '../types'
import EditModal from "./EditModal";

function List({ categoryValue, searchValue, taskValue, dueValue }: any) {

    const storedUserId = localStorage.getItem('userId');
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dropdownValue, setDropdownValue] = useState("");
    const [openSections, setOpenSections] = useState<string[]>([]);
    const [originalTasks, setOriginalTasks] = useState<Task[]>([]);
    const [overDue, setOverview] = useState<Task[]>([]);
    const [thisWeek, setThisweek] = useState<Task[]>([]);
    const [todaysTask, setTodaysTasks] = useState<Task[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editTaskValue, setEditTaskValue] = useState('');
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Track sorting order
    const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

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
            setTodaysTasks(response)
            setOverview(response)
            setThisweek(response)

        })();
    }, [storedUserId]);

    const handleSortByDate = () => {
        const sortedTasks = [...tasks].sort((a, b) => {
            const dateA = new Date(a.dueDate).getTime();
            const dateB = new Date(b.dueDate).getTime();
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
        setTasks(sortedTasks);
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };
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
            const { taskName, text, date, status, category, storedUserId } = taskValue
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
                            return taskDueDate.toDateString() === currentDate.toDateString(); // Tasks due today
                        });
                        break;

                    case 'overdue':
                        filteredTasks = overDue.filter(task => {
                            const taskDueDate = new Date(task.dueDate);
                            return taskDueDate < currentDate; // Tasks that are overdue
                        });
                        break;

                    case 'thisweek':
                        filteredTasks = thisWeek.filter(task => {
                            const taskDueDate = new Date(task.dueDate);
                            const startOfWeek = new Date(currentDate);
                            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Set to Sunday of the current week
                            const endOfWeek = new Date(startOfWeek);
                            endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to Saturday of the current week
                            return taskDueDate >= startOfWeek && taskDueDate <= endOfWeek; // Tasks due within this week
                        });
                        break;

                    default:
                        filteredTasks = tasks; // Default to all tasks if no valid dueValue
                }
            }

            // Set the filtered tasks
            setTasks(filteredTasks);

        })();
    }, [dueValue]);

    const handleCheckboxChange = (taskId: string) => {
        setSelectedTasks((prev) => {
            const newSelected = new Set(prev);
            newSelected.has(taskId) ? newSelected.delete(taskId) : newSelected.add(taskId);
            return newSelected;
        });
    };

    const handleDeleteSelected = () => {
       (async()=>{
        const taskArray = Array.from(selectedTasks)
        await deleteBatch(taskArray)
        setTasks((prev) =>
            prev.filter((task) => !selectedTasks.has(task._id))
        );
        setSelectedTasks(new Set());
       })()
    };

    const handleBulkStatusChange = (status: string) => {
       (async()=>{
        console.log(selectedTasks)
        console.log(status)
        const taskArray = Array.from(selectedTasks)
        const taskStatus=status
        await statusChangeBatch(taskArray,taskStatus)
        setTasks((prev) =>
            prev.map((task) =>
                selectedTasks.has(task._id) ? { ...task, status } : task
            )
        );
       })()
    };






    return (
        <>
            <div className="mx-4 border-b border-gray-300"></div>
            <div className="flex mx-4 mb-0 text-gray-500">
                <span className="font-bold w-1/5">Task</span>
                <span
                    className="font-bold flex items-center w-1/5 justify-center cursor-pointer"
                    onClick={handleSortByDate}
                >
                    Due
                    <FaSort
                        className={`ml-2 text-gray-500 transform ${sortOrder === "asc" ? "rotate-180" : "rotate-0"
                            }`}
                    />
                </span>
                <span className="font-bold w-1/5 text-center">Status</span>
                <span className="font-bold w-1/5 text-center">Category</span>
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
                                <div className="w-full overflow-x-auto">
                                    {filterTasksByStatus(section.title).length === 0 ? (
                                        <div className="text-center text-black">
                                            No Tasks in {section.title}
                                        </div>
                                    ) : (
                                        <table className="w-full text-sm md:text-base">

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
                                                        <tr
                                                            key={index}
                                                            className="border-b border-gray-300"
                                                        >
                                                            <td className="py-3 px-3 flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    className="mr-2"
                                                                    checked={selectedTasks.has(task._id)}
                                                                    onChange={() => handleCheckboxChange(task._id)}
                                                                />
                                                                <FaBars className="mr-2 hidden md:inline-block" />
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
                                                            <td className=" py-3 px-3 w-1/4 text-center">
                                                                <select
                                                                    value={task.status}
                                                                    onChange={(e) =>
                                                                        handleStatusChange(
                                                                            e,
                                                                            task._id
                                                                        )
                                                                    }
                                                                    className="appearance-none bg-gray-300 border rounded-lg py-2 px-4 pr-10"
                                                                >
                                                                    <option className="bg-gray-100" value="todo">Todo</option>
                                                                    <option className="bg-gray-100" value="inprogress">
                                                                        In Progress
                                                                    </option>
                                                                    <option className="bg-gray-100" value="completed">
                                                                        Complete
                                                                    </option>
                                                                </select>
                                                            </td>
                                                            <td className="py-3 px-3 w-1/4">
                                                                {task.category}
                                                            </td>
                                                            <td>
                                                                <select
                                                                    value={dropdownValue}
                                                                    onChange={(e) =>
                                                                        handleEdit(e, task._id)
                                                                    }
                                                                    className="appearance-none bg-gray-100 font-bold  rounded-lg py-2 px-4 pr-10"
                                                                >
                                                                    <option selected disabled value="">...</option>
                                                                    <option className="bg-gray-100" value="edit">
                                                                        Edit
                                                                    </option>
                                                                    <option className="bg-gray-100" value="delete">
                                                                        Delete
                                                                    </option>
                                                                </select>
                                                            </td>


                                                        </tr>
                                                    );
                                                })}

                                                {isModalOpen && (
                                                    <EditModal modalValue={setIsModalOpen} editValue={editTaskValue} setTasksValue={setTasks} setOriginalTasks={setOriginalTasks} />
                                                )}
                                            </tbody>
                                        </table>
                                    )}

                                </div>
                            </div>
                        )}

                    </div>
                ))}
            </main>
            {selectedTasks.size > 0 && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black p-4 border rounded-lg shadow-lg flex items-center space-x-4">
                    <span className="text-white">{selectedTasks.size} task(s) selected</span>
                    <select
                        className="px-2 py-1 border rounded-full"
                        style={{
                            backgroundColor: "#8D8A8A24", // Light transparent gray background for the main select box
                            color: "white", // White text for the main select box
                        }}
                        onChange={(e) => handleBulkStatusChange(e.target.value)}
                    >
                        <option value="" disabled selected style={{ backgroundColor: "black", color: "white" }}>
                            Status
                        </option>
                        <option value="todo" style={{ backgroundColor: "black", color: "white" }}>
                            Todo
                        </option>
                        <option value="inprogress" style={{ backgroundColor: "black", color: "white" }}>
                            In Progress
                        </option>
                        <option value="completed" style={{ backgroundColor: "black", color: "white" }}>
                            Completed
                        </option>
                    </select>


                    <button
                        className="px-4 py-1 rounded"
                        style={{
                            backgroundColor: "#FF353524", // Delete button background
                            color: "#E13838", // Delete button text color
                        }}
                        onClick={handleDeleteSelected}
                    >
                        Delete
                    </button>
                </div>
            )}
        </>
    )
}

export default List