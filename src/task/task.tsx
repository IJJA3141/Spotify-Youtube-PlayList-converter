import React from 'react'
import TaskManager from './task-manger'

interface IProps {

}

interface IState {
  logs:string[]
}

class Task extends React.Component<IProps, IState> {
  // public member
  public constructor(_taskManager: TaskManager, _props:IProps) {
    super(_props);
   
    this.state = {logs:[]};

    _taskManager.add(this);

    this.id = Task.id++;
  }

  public log(_message: string): void {
    
    let newLogs = this.state.logs
    newLogs.push(_message)

    console.log(`this should have been printed: ${newLogs}`)
    
    this.setState({logs:newLogs})

    return;
  }

  public render(): React.ReactNode {
    return (
      <div key={this.id}>
        <p>Task</p>
        {this.state.logs.map((_log: string, _index: number): React.ReactNode => { return <p key={_index}>{_log}</p> })}
      </div>)
  }

  public static id: number = 0;
  public id: number;

  // private member
}

export default Task
