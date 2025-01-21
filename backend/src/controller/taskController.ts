import Task from "../model/taskModel"

export const addTask = async (req, res) => {
  try {
    const { taskName, description, date, status, category, userId } = req.body;

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
