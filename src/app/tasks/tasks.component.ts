import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from './tasks.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type Filter = 'All' | 'Completed' | 'Incomplete';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  private tasksSubject = new BehaviorSubject<Task[]>(this.loadTasks());
  private filterSubject = new BehaviorSubject<Filter>('All');

  tasks$ = this.tasksSubject.asObservable();
  filter$ = this.filterSubject.asObservable();

  filteredTasks$: Observable<Task[]> = combineLatest([this.tasks$, this.filter$]).pipe(
    map(([tasks, filter]) => {
      switch (filter) {
        case 'Completed': return tasks.filter(t => t.completed);
        case 'Incomplete': return tasks.filter(t => !t.completed);
        default: return tasks;
      }
    })
  );

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }
  
  loadTasks(): Task[] {
    return this.taskService.getTasks();
  }

  setFilter(filter: Filter) {
    this.filterSubject.next(filter);
  }

  addTask(description: string) {
    if (description.trim() == '') {
      window.alert(`Enter the task description`);
      return 
    }

    const currentTasks = this.tasksSubject.value;
    const newTask: Task = { id: this.taskService.newId, description, completed: false };
    const updatedTasks = [...currentTasks, newTask];
    this.tasksSubject.next(updatedTasks);
    this.taskService.updateTasks(updatedTasks);
  }

  removeTask(taskToRemove: Task) {
    const confirmed = window.confirm(`Are you sure you want to delete the task "${taskToRemove.description}"?`);
    if (confirmed) {
      const currentTasks = this.tasksSubject.value;
      const updatedTasks = currentTasks.filter(task => task.id !== taskToRemove.id);
      console.log('updatedTasks', updatedTasks);
      this.tasksSubject.next(updatedTasks);
      this.taskService.updateTasks(updatedTasks);
    }
      
  }

  toggleTask(task: Task) {
    const updatedTasks = this.tasksSubject.value.map(t =>
      t.id === task.id ? { ...t, completed: !t.completed } : t
    );
    this.tasksSubject.next(updatedTasks);
    this.taskService.updateTasks(updatedTasks);
  }

}
