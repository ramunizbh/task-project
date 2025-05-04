import { Injectable } from '@angular/core';

export interface Task {
  id: number;
  description: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private nomeKey = 'tasks';

  constructor() {
    if (!localStorage.getItem(this.nomeKey)) {
      const initialTasks: Task[] = [ { id: this.newId, description: 'New activity', completed: false },
      { id: this.newId, description: 'Create Program', completed: true }];
      this.saveTasks(initialTasks);
    }
  }

  get newId(): number {
    return Math.floor(Math.random() * 10000000);
  }

  private saveTasks(tasks: Task[]) {
    localStorage.setItem(this.nomeKey, JSON.stringify(tasks));
  }

  private loadTasks(): Task[] {
    const data = localStorage.getItem(this.nomeKey);
    return data ? JSON.parse(data) : [];
  }

  public getTasks(): Task[] {
    return this.loadTasks();
  }

  public updateTasks(tasks: Task[]) {
    localStorage.clear()
    this.saveTasks(tasks);
  }
}
