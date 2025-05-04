import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [TasksComponent],
  imports: [CommonModule, FormsModule], 
  exports: [TasksComponent]
})
export class TasksModule { }
