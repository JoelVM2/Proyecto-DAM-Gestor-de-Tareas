import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../../../core/services/board.service';
import { ColumnService } from '../../../core/services/column.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ColumnComponent } from '../column/column.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ColumnFormComponent } from '../column-form/column-form.component';
import { TaskCardComponent } from '../task-card/task-card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Board } from '../../../models/board.model';
import { Column } from '../../../models/column.model';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../models/task.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CommonModule,
    ColumnComponent,
    TaskFormComponent,
    ColumnFormComponent,
    TaskCardComponent,
    DragDropModule
  ],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css']
})
export class KanbanBoardComponent implements OnInit {
  columns: Column[] = [];
  users: User[] = [];
  showTaskForm = false;
  showColumnForm = false;
  activeColumn: Column | null = null;
  selectedTask: Task | null = null;
  selectedTaskColumn: Column | null = null;
  showEditTaskForm = false;

  private boardId: number = 0;

  constructor(
    private boardService: BoardService,
    private columnService: ColumnService,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
  
    if (!currentUser) {
      console.error('Usuario no autenticado');
      this.loadDefaultData();
      return;
    }
  
    function extractValues<T>(data: any): T[] {
      if (Array.isArray(data)) {
        return data;
      } else if (data && '$values' in data && Array.isArray(data.$values)) {
        return data.$values;
      }
      return [];
    }
  
    this.boardService.getBoardForUser(currentUser.id).subscribe({
      next: (board) => {
        this.boardId = board.id;
  
        const columnsRaw = extractValues(board.columns);
        this.columns = columnsRaw.map((col: any) => ({
          id: col.id,
          name: col.name,
          position: col.position,
          boardId: col.boardId,
          tasks: extractValues(col.tasks).map((task: any) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            assignedTo: task.assignedTo ?? null,
            columnId: task.columnId,
          }))
        }));
  
        this.users = extractValues(board.members);
      },
      error: (err) => {
        console.error('Error al cargar el tablero del usuario:', err);
        this.loadDefaultData();
      }
    });
  }

  private loadDefaultData(): void {
    this.columns = this.getDefaultColumns();
    this.users = [];
  }
  
  getDefaultColumns(): Column[] {
    return [
      { id: 111, name: 'Por hacer', position: 0, tasks: [], boardId: this.boardId },
      { id: 222, name: 'En progreso', position: 1, tasks: [], boardId: this.boardId },
      { id: 333, name: 'Hecho', position: 2, tasks: [], boardId: this.boardId }
    ];
  }

  createBoardWithDefaultColumns(): void {
    const currentUser = this.authService.getCurrentUser();
    const currentUserId = currentUser ? currentUser.id : 1;
  
    const newBoard: Board = {
      id: 0,
      name: 'Nuevo tablero',
      ownerId: currentUserId,
      columns: [], // 🔧 No envíes columnas aún
      members: []
    };
  
    this.boardService.createBoard(newBoard).subscribe({
      next: (createdBoard: Board) => {
        this.boardId = createdBoard.id;
        this.users = Array.isArray(createdBoard.members)
          ? createdBoard.members
          : (createdBoard.members?.$values || []);
  
        const defaultColumns = [
          { name: 'Por hacer', position: 0, tasks: [], boardId: this.boardId },
          { name: 'En progreso', position: 1, tasks: [], boardId: this.boardId },
          { name: 'Hecho', position: 2, tasks: [], boardId: this.boardId }
        ];
  
        defaultColumns.forEach(col => {
          this.columnService.createColumn({ ...col, id: 0 }).subscribe({
            next: createdCol => {
              createdCol.tasks = [];
              this.columns.push(createdCol);
            },
            error: err => {
              console.error('Error creando columna:', err);
            }
          });
        });
      },
      error: err => {
        console.error('Error creando tablero por defecto:', err);
        this.loadDefaultData();
      }
    });
  }

  onAddTaskClick(column: Column) {
    this.activeColumn = column;
    this.showTaskForm = true;
  }

  onSaveTask(taskData: { title: string; description?: string; assignedTo?: number | null }) {
    if (!this.activeColumn) return;
  
    const newTask: Omit<Task, 'id'> = {
      title: taskData.title,
      description: taskData.description,
      assignedTo: taskData.assignedTo ?? undefined,
      columnId: this.activeColumn.id
    };
  
    this.taskService.createTask(newTask).subscribe({
      next: (createdTask: Task) => {
        this.activeColumn?.tasks?.push(createdTask);
        this.showTaskForm = false;
        this.activeColumn = null;
      },
      error: err => {
        console.error('Error creando tarea:', err);
      }
    });
  }

  onCancelTask() {
    this.showTaskForm = false;
    this.activeColumn = null;
  }

  onAddColumnClick() {
    this.showColumnForm = true;
  }

  onSaveColumn(columnName: string) {
    const newColumn: Column = {
      id: 0,
      name: columnName,
      position: this.columns.length,
      tasks: [],
      boardId: this.boardId
    };

    this.columnService.createColumn(newColumn).subscribe({
      next: (createdColumn: Column) => {
        const rawTasks = (createdColumn as any).tasks;
        if (rawTasks) {
          const values = (rawTasks as any).$values;
          createdColumn.tasks = Array.isArray(values) ? values : [];
        } else {
          createdColumn.tasks = [];
        }

        this.columns.push(createdColumn);
        this.showColumnForm = false;
      },
      error: err => {
        console.error('Error creando columna:', err);
      }
    });
  }

  onCancelColumn() {
    this.showColumnForm = false;
  }

  onTaskSelected(task: Task) {
    this.selectedTask = task;
    this.selectedTaskColumn = this.columns.find(col => col.tasks?.includes(task)) ?? null;
    this.showEditTaskForm = true;
  }

  onUpdateTask(updatedTask: Task) {
    if (!this.selectedTaskColumn) return;
    if (!updatedTask.id) {
      console.error('La tarea no tiene id');
      return;
    }
  
    this.taskService.updateTask(updatedTask.id, updatedTask).subscribe({
      next: (taskFromServer) => {
        const idx = this.selectedTaskColumn!.tasks!.findIndex(t => t.id === taskFromServer.id);
        if (idx > -1) {
          this.selectedTaskColumn!.tasks![idx] = taskFromServer;
        }
        this.showEditTaskForm = false;
        this.selectedTask = null;
        this.selectedTaskColumn = null;
      },
      error: err => {
        console.error('Error actualizando tarea:', err);
      }
    });
  }
  

  onCancelEditTask() {
    this.showEditTaskForm = false;
    this.selectedTask = null;
    this.selectedTaskColumn = null;
  }

  onDeleteTask() {
    if (!this.selectedTaskColumn?.tasks || !this.selectedTask || this.selectedTask.id === undefined) return;

    const tasks = this.selectedTaskColumn.tasks;
    const taskId = this.selectedTask.id;

    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        const idx = tasks.findIndex(t => t.id === taskId);
        if (idx > -1) {
          tasks.splice(idx, 1);
        }
        this.showEditTaskForm = false;
        this.selectedTask = null;
        this.selectedTaskColumn = null;
      },
      error: (err) => {
        console.error('Error eliminando tarea:', err);
      }
    });
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

  onTaskDropped(payload: { event: CdkDragDrop<any[]>; column: Column }) {
    const { event, column } = payload;
    if (event.previousContainer === event.container) {
      moveItemInArray(column.tasks!, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  getConnectedTo(columnName: string) {
    return this.columns
      .filter(col => col.name !== columnName)
      .map(col => col.name)
      .filter(name => typeof name === 'string' && name.length > 0);
  }

  onDeleteColumn(columnId: number) {
    this.columnService.deleteColumn(columnId).subscribe({
      next: () => {
        this.columns = this.columns.filter(col => col.id !== columnId);
      },
      error: err => {
        console.error('Error eliminando columna:', err);
      }
    });
  }
  
  onColumnUpdated(updatedColumn: Column) {
    this.columnService.updateColumn(updatedColumn.id, updatedColumn).subscribe({
      next: (response) => {
        console.log('Columna actualizada:', response);
      },
      error: (err) => {
        console.error('Error actualizando columna:', err);
      }
    });
  }
}

function extractValues<T>(data: any): T[] {
  if (Array.isArray(data)) {
    return data;
  } else if (data && '$values' in data && Array.isArray(data.$values)) {
    return data.$values;
  }
  return [];
}
