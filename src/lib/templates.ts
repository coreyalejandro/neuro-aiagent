// lib/templates.ts

export interface Template {
    id: string;
    name: string;
    description: string;
  }
  
  export const templates: Template[] = [
    {
      id: 'chat-assistant',
      name: 'Chat Assistant',
      description: 'Engage users in natural-language conversation.',
    },
    {
      id: 'data-retriever',
      name: 'Data Retriever',
      description: 'Fetch and summarize data from external APIs.',
    },
    {
      id: 'task-automator',
      name: 'Task Automator',
      description: 'Perform automated actions and workflows.',
    },
  ];