import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Column } from '../../models/column.model';

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  private apiUrl = 'http://localhost:5016/api/columns';

  constructor(private http: HttpClient) {}

  getColumns(): Observable<Column[]> {
    return this.http.get<Column[]>(this.apiUrl);
  }

  getColumnsByBoard(boardId: number): Observable<Column[]> {
    return this.http.get<Column[]>(`${this.apiUrl}/board/${boardId}`);
  }

  getColumn(id: number): Observable<Column> {
    return this.http.get<Column>(`${this.apiUrl}/${id}`);
  }

  createColumn(column: Column): Observable<Column> {
    return this.http.post<Column>(this.apiUrl, column);
  }

  updateColumn(id: number, column: Column) {
    return this.http.put<Column>(`${this.apiUrl}/${id}`, column);
  }
  
  deleteColumn(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
