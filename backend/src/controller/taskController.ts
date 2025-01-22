import Task from "../model/taskModel"

export const addTask = async (req, res) => {
  try {
    const { taskName, description, date, status, category, userId } = req.body;
    console.log(req.body)
    if (!taskName || !date || !status || !category || !userId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const lastTask = await Task.findOne({ userId }).sort({ position: -1 });
    const newPosition = lastTask ? lastTask.position + 1 : 1;

    const newTask = new Task({
      userId,
      title: taskName,
      description,
      dueDate: date,
      status,
      category,
      position: newPosition,
    });


    const savedTask = await newTask.save();

    return res.status(201).json({ message: 'Task added successfully', task: savedTask });
  } catch (error) {
    console.error('Error adding task:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const fetchTask = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const userTasks = await Task.find({ userId });

        return res.status(200).json(userTasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};