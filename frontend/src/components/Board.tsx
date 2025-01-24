import { useEffect, useState } from "react";
import { fetchTasks } from "../services/taskService";
import { Task } from "../types";

function Board({ categoryValue }: any) {
    const storedUserId = localStorage.getItem('userId');
    const [overDue, setOverview] = useState<Task[]>([]);
    const [thisWeek, setThisweek] = useState<Task[]>([]);
    const [todaysTask, setTodaysTasks] = useState<Task[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [originalTasks, setOriginalTasks] = useState<Task[]>([]);

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

        return taskList.map((task) => (
            <div key={task._id} className="bg-white p-4 rounded-md shadow-sm flex flex-col justify-between h-full">
                <h3 className="font-bold text-gray-800 mb-10">{task.title}</h3>
                <div className="flex justify-between mt-auto">
                    <p className="text-sm text-gray-500">{task.category}</p>
                    <p className="text-sm text-gray-500">{formatDate(task.createdAt)}</p>
                </div>
            </div>
        ));
    };


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
        </div>
    );
}

export default Board;
