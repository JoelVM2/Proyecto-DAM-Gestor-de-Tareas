import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../../core/services/board.service';
import { CommonModule } from '@angular/common';
import { ColumnComponent } from '../column/column.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ColumnFormComponent } from '../column-form/column-form.component';
import { TaskCardComponent } from '../task-card/task-card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'; // <-- Esta línea

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, ColumnComponent, TaskFormComponent, ColumnFormComponent, TaskCardComponent, DragDropModule],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css']
})
export class KanbanBoardComponent implements OnInit {
  columns: any[] = [];
  users: string[] = [];
  showTaskForm = false;
  showColumnForm = false;
  activeColumn: any = null;
  selectedTask: any = null;
  selectedTaskColumn: any = null;
  showEditTaskForm = false;

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {
    const board = this.boardService.getBoard('1');
    if (board && board.columns?.length > 0) {
      this.columns = board.columns;
      this.users = board.users;
    } else {
      this.columns = [
        { title: 'Por hacer', tasks: [] },
        { title: 'En progreso', tasks: [] },
        { title: 'Hecho', tasks: [] },
      ];
      this.users = ['Ana', 'Luis', 'Marta'];
    }
  }

  onAddTaskClick(column: any) {
    console.log('Abrir formulario para la columna:', column);
    this.activeColumn = column;
    this.showTaskForm = true;
  }
  
  onSaveTask(task: { title: string; description: string; assignee: string | null }) {
    if (this.activeColumn) {
      this.activeColumn.tasks.push(task);
    }
    this.showTaskForm = false;
    this.activeColumn = null;
  }

  onCancelTask() {
    this.showTaskForm = false;
    this.activeColumn = null;
  }

  onAddColumnClick() {
    this.showColumnForm = true;
  }

  onSaveColumn(columnTitle: string) {
    this.columns.push({ title: columnTitle, tasks: [] });
    this.showColumnForm = false;
  }

  onCancelColumn() {
    this.showColumnForm = false;
  }

  onTaskSelected(task: any) {
    this.selectedTask = task;
    this.selectedTaskColumn = this.columns.find(col => col.tasks.includes(task));
    this.showEditTaskForm = true;
  }

  onUpdateTask(updatedTask: any) {
    if (!this.selectedTaskColumn) return;
  
    const idx = this.selectedTaskColumn.tasks.findIndex((t: any) => t === this.selectedTask);
    if (idx > -1) {
      this.selectedTaskColumn.tasks[idx] = updatedTask;
    }
  
    this.showEditTaskForm = false;
    this.selectedTask = null;
    this.selectedTaskColumn = null;
  }
  
  onCancelEditTask() {
    this.showEditTaskForm = false;
    this.selectedTask = null;
    this.selectedTaskColumn = null;
  }  

  onDeleteTask() {
    if (!this.selectedTaskColumn || !this.selectedTask) return;
  
    const idx = this.selectedTaskColumn.tasks.findIndex((t: any) => t === this.selectedTask);
    if (idx > -1) {
      this.selectedTaskColumn.tasks.splice(idx, 1);
    }
  
    this.showEditTaskForm = false;
    this.selectedTask = null;
    this.selectedTaskColumn = null;
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  onTaskDropped(payload: { event: CdkDragDrop<any[]>; column: any }) {
    const { event, column } = payload;
    if (event.previousContainer === event.container) {
      moveItemInArray(column.tasks, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  getConnectedTo(columnTitle: string): string[] {
    return this.columns
      .map(c => 'cdk-list-' + c.title.split(' ').join('-'))
      .filter(id => id !== 'cdk-list-' + columnTitle.split(' ').join('-'));
  } 
}
