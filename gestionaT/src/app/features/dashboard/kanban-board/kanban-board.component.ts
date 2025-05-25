import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../../core/services/board.service';
import { CommonModule } from '@angular/common';
import { ColumnComponent } from '../column/column.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ColumnFormComponent } from '../column-form/column-form.component';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, ColumnComponent, TaskFormComponent, ColumnFormComponent],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css']
})
export class KanbanBoardComponent implements OnInit {
  columns: any[] = [];
  users: string[] = [];
  showTaskForm = false;
  showColumnForm = false;

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
        { title: 'ajajaja', tasks: [] },
      ];
      this.users = ['Ana', 'Luis', 'Marta', 'Marta', 'Marta'];
    }
  }

  onAddTaskClick() {
    this.showTaskForm = true;
  }
  
  onSaveTask(task: { title: string; description: string; assignee: string | null }) {
    this.columns[0].tasks.push(task);
    this.showTaskForm = false;
  }

  onCancelTask() {
    this.showTaskForm = false;
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
}
