export type TaskAssignee = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: 'ADMIN' | 'MEMBER';
  };
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  workflowStateId: string;
  priorityIndex: number;
  startDate: string | null;
  finishDate: string | null;
  assignees: TaskAssignee[];
};