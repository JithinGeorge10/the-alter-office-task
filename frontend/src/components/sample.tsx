import { useEffect, useState } from "react";
import {
    FaSort,
    FaBars,
    FaCheckCircle
} from "react-icons/fa";
import { addTask, changeStatus, fetchTasks, taskDelete } from "../services/taskService";
import { Section, Task } from '../types'
import EditModal from "./EditModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function List({ }: any) {

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
        setOpenSections((prevOpenSections) =>
            prevOpenSections.includes(sectionTitle)
                ? prevOpenSections.filter((title) => title !== sectionTitle)
                : [...prevOpenSections, sectionTitle]
        );
    };

    const dummyTasks: Task[] = tasks;

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
        } catch (error) {
            console.error("Failed to change status:", error);
        }
    };
    const handleDragEnd = (result: any) => {
        const { destination, source } = result;
    
        // If there's no destination, do nothing
        if (!destination) return;
    
        // If the task is dropped in the same position, do nothing
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }
    
        // Find the source and destination sections
        const sourceSection = sections.find(section => section.title === source.droppableId);
        const destinationSection = sections.find(section => section.title === destination.droppableId);
    
        // Ensure both sections are defined
        if (!sourceSection || !destinationSection) return;
    
        // Get the tasks for the source section
        const sourceTasks = filterTasksByStatus(sourceSection.title);
    
        // If the task is dropped in the same section, rearrange the tasks
        if (sourceSection.title === destinationSection.title) {
            const reorderedTasks = Array.from(sourceTasks);
            const [removed] = reorderedTasks.splice(source.index, 1);
            reorderedTasks.splice(destination.index, 0, removed);
    
            // Update the tasks state
            setTasks((prevTasks) => {
                const updatedTasks = [...prevTasks];
                // Update the tasks in the same section
                return updatedTasks.map(task => {
                    const foundTask = reorderedTasks.find(t => t._id === task._id);
                    return foundTask ? foundTask : task;
                });
            });
        } else {
            // If the task is dropped in a different section, handle it as before
            const destinationTasks = filterTasksByStatus(destinationSection.title);
            const [removed] = sourceTasks.splice(source.index, 1);
            destinationTasks.splice(destination.index, 0, removed);
    
            // Update the tasks state
            setTasks((prevTasks) => {
                const updatedTasks = [...prevTasks];
    
                // Update the original tasks array
                const updatedSourceTasks = updatedTasks.map(task => {
                    if (task._id === removed._id) {
                        return { ...task, status: destinationSection.title }; // Update status to the new section
                    }
                    return task;
                });
    
                return updatedSourceTasks;
            });
        }
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
                        className={`ml-2 text-gray-500 transform ${sortOrder === "asc" ? "rotate-180" : "rotate-0"}`}
                    />
                </span>
                <span className="font-bold w-1/5 text-center">Status</span>
                <span className="font-bold w-1/5 text-center">Category</span>
                <span className="font-bold w-1/5"></span>
            </div>
            <main className="p-4">
                <DragDropContext onDragEnd={handleDragEnd}>
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
                                        : "-rotate-45"}`}
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
                                            <Droppable droppableId={section.title}>
                                                {(provided) => (
                                                    <table
                                                        className="w-full text-sm md:text-base"
                                                        ref={provided.innerRef}
                                                        {...provided.droppableProps}
                                                    >
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
                                                                    <Draggable
                                                                        key={task._id}
                                                                        draggableId={task._id}
                                                                        index={index}
                                                                    >
                                                                        {(provided) => (
                                                                            <tr
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                className="border-b border-gray-300"
                                                                            >
                                                                                <td className="py-3 px-3 flex items-center">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="mr-2"
                                                                                        readOnly
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
                                                                                    {/* Edit/Delete options */}
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </Draggable>
                                                                );
                                                            })}
                                                            {provided.placeholder}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </Droppable>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </DragDropContext>
            </main>
        </>
    );
}

export default List;
