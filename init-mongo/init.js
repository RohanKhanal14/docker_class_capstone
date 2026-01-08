db = db.getSiblingDB('taskmanager');

db.createCollection('tasks');

db.tasks.insertMany([
  {
    title: 'Welcome to Task Manager!',
    description: 'This is your first task. Try adding, editing, and completing tasks.',
    completed: false,
    priority: 'high',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Learn Docker',
    description: 'Complete the 14-day Docker course',
    completed: false,
    priority: 'high',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('Database initialized successfully');
