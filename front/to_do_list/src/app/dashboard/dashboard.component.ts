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
  lowPriorityTodos: ToDoItem[] = [];
  mediumPriorityTodos: ToDoItem[] = [];
  highPriorityTodos: ToDoItem[] = [];
  newTodoTitle = '';
  newTodoPriority = 1; 
  newTodoDoTill: string | null = null;
  newTodoComment: string | null = null;
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

        this.lowPriorityTodos = todos.filter(t => t.priority === 1);
        this.mediumPriorityTodos = todos.filter(t => t.priority === 2);
        this.highPriorityTodos = todos.filter(t => t.priority === 3);

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
      comment: this.newTodoComment?.trim() || null,
      priority: this.newTodoPriority,    
      do_till: this.newTodoDoTill ? new Date(this.newTodoDoTill) : null
    };

    // this.todoService.addTodo(newTodo).subscribe({
    //   next: (todo) => {
    //     this.todos.push(todo);
    //     this.newTodoTitle = '';
    //   }
    // });

        this.todoService.addTodo(newTodo).subscribe({
        next: (todo) => {
        this.newTodoTitle = '';
        this.newTodoComment = '';
        this.loadTodos();  
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
          this.loadTodos();
        }
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}