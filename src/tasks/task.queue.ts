// MOCKED — in-memory task queue for AI Studio environment
export const taskQueue = {
  add: async (name: string, data: any, _opts?: any) => {
    console.log(`[TaskQueue] Enqueued task: ${name}`, data);
    return { id: data.taskId || 'mock-job-id', name, data };
  }
} as any;

