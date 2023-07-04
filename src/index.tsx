import ReactDOM from 'react-dom/client';
import TaskManager from './task/task-manger';
import Task from './task/task'

const rootElement: Element = document.getElementById('root') as Element;
const ROOT = ReactDOM.createRoot(rootElement);

const taskManager: TaskManager = new TaskManager({});
var t1: Task = new Task(taskManager, {});
var t2: Task = new Task(taskManager, {});
var t3: Task = new Task(taskManager, {});

ROOT.render(taskManager.render())

t1.log("tset")

setTimeout(()=>{t1.log("lknsdflmnsdfljk"); console.log(taskManager),2000})
