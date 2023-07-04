import React from 'react'
import Task from './task'

class TaskManager extends React.Component {
  // public member
  public constructor(_props: {}) {
    super(_props);

    this._tasks = [];
  }

  public render() {
    return (
      <div>
        <p>TaskManager</p>
        {this._tasks.map((_task: Task): React.ReactNode => { return _task.render(); })}
      </div>
    )
  }

  public add(_task: Task) {
    this._tasks.push(_task);

    return;
  }

  // private member
  public _tasks: Task[];
}

export default TaskManager;
