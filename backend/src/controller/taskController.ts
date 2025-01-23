import Task from "../model/taskModel"

export const addTask = async (req, res) => {
  try {
    if (req.userId) {
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
    } else {
      return res.status(401).json({ message: 'Unauthorized: Token is missing or invalid' });
    }
  } catch (error) {
    console.error('Error adding task:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const fetchTask = async (req, res) => {
  try {
    if (req.userId) {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      const userTasks = await Task.find({ userId });
      return res.status(200).json(userTasks);
    } else {
      return res.status(401).json({ message: 'Unauthorized: Token is missing or invalid' });
    }

  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const changeStatus = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized: Token is missing or invalid' });
    }

    const { status, userId } = req.query;

    if (!status || !userId) {
      return res.status(400).json({ message: 'Bad Request: Missing required fields' });
    }

    const updatedUser = await Task.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );
    console.log(updatedUser)
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Status updated', user: updatedUser });
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized: Token is missing or invalid' });
    }

    const { taskId } = req.body;
    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' });
    }
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



export const singleUserTask = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized: Token is missing or invalid' });
    }
    const { taskId } = req.query;
    const task = await Task.findOne({ _id: taskId, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



export const editTask = async (req, res) => {
  try {
    const { taskId, userId, taskName, description, date, status, category } = req.body;
    console.log(taskId, userId, taskName, description, date, status, category)
 
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId: userId }, 
      { title:taskName, description, dueDate:date, status, category }, 
      { new: true } 
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found or you are not authorized to edit this task' });
    }

    return res.status(200).json(updatedTask);

  } catch (error) {
    console.error('Error fetching task:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};