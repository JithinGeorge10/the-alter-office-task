
export interface Section {
    title: string;
    color: string;
  }
  
  export interface Task {
    _id: string;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    category: string;
    position: number;
    userId: string;
    attachments: any[];
    createdAt: string;
    updatedAt: string;
  }
  