import { Component, OnInit } from '@angular/core';
import { ToDoItem, TodoService } from '../todo_service/todo.service';
import { AuthService } from '../auth_service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  todos: ToDoItem[] = [];
  newTodoTitle = '';
  isLoading = true;

  constructor(
    private todoService: TodoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.isLoading = true;
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  addTodo(): void {
    if (!this.newTodoTitle.trim()) return;

    const newTodo: ToDoItem = {
      id: ``,
      name: this.newTodoTitle.trim(),
      is_done: false,
      comment: null,
      priority: 0,
      do_till: null
    };

    this.todoService.addTodo(newTodo).subscribe({
      next: (todo) => {
        this.todos.push(todo);
        this.newTodoTitle = '';
      }
    });
  }

  toggleTodo(todo: ToDoItem): void {
    todo.is_done = !todo.is_done;
    this.todoService.markasdoneTodo(todo.id).subscribe();
  }

  deleteTodo(id: string): void {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.todos = this.todos.filter(t => t.id !== id);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}