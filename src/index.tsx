import ReactDOM from 'react-dom/client';
import TaskManager from './task/task-manger';
import Task from './task/task'
import CLIENT from './client/client'

const rootElement: Element = document.getElementById('root') as Element;
const root=ReactDOM.createRoot(rootElement);

const p = document.createElement('p');

p.innerText = CLIENT.id;

rootElement.appendChild(p)
