import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  getBoard(boardId: string) {
    // Simulación de respuesta con columnas y tareas
    return {
      columns: [
        {
          id: 'col1',
          title: 'Por hacer',
          tasks: [
            { id: 't1', title: 'Tarea 1', assignee: 'Joel', dueDate: '2024-06-01' },
          ]
        },
        {
          id: 'col2',
          title: 'En progreso',
          tasks: []
        }
      ],
      users: ['Joel', 'Chelo'],
    };
  }
}
