"use strict";
class Todo {
  constructor(form, input, todoList, todoCompleted) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoData = new Map(JSON.parse(localStorage.getItem("toDoList")));
  }
  addToStorage() {
    localStorage.setItem("toDoList", JSON.stringify([...this.todoData]));
  }
  render() {
    this.todoList.textContent = "";
    this.todoCompleted.textContent = "";
    this.todoData.forEach(this.createItem, this);
    this.addToStorage();
  }
  createItem(todo) {
    const li = document.createElement("li");
    li.classList.add("todo-item");
    li.key = todo.key;
    li.insertAdjacentHTML(
      "beforeend",
      `
        <span class="text-todo">${todo.value}</span>
				<div class="todo-buttons">
					<button class="todo-remove"></button>
					<button class="todo-complete"></button>
				</div>`
    );
    if (todo.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
  }
  addTodo(e) {
    const btn = document.querySelector(".header-button");
    e.preventDefault();
    if (this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
      };
      this.todoData.set(newTodo.key, newTodo);
      this.render();
    } else if (this.input.value === "") {
      alert("Пустое дело добавить нельзя!");
    }
    this.handler();
  }
  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  handler() {
    let item = document.querySelectorAll(".todo-item");
    item.forEach((elem) => {
      elem.addEventListener("click", (event) => {
        let target = event.target;
        if (target.classList.contains("todo-remove")) {
          this.deleteItem(target);
        } else if (target.classList.contains("todo-complete")) {
          this.completedItem(target);
        }
      });
    });
    // метод, который будет определять, на какую из кнопок вы кликнули (делегирование)
    // после этого вызвать один из следующих методов
    // в зависимости от того, на какую кнопку будет нажато
    // вешать события нужно на todoList и на todoCompeled, либо на их общего родителя todoContainer
  }
  deleteItem(target) {
    let container = document.querySelectorAll(".todo-container");

    while (target !== container) {
      if (target.classList.contains("todo-item")) {
        this.todoData.forEach((value, key) => {
          if (target.key === key) {
            let str = target.key;
            this.todoData.delete(str);
            this.render();
            this.handler();
          }
        });
        return;
      }
      target = target.parentNode;
    }
  }
  //нужно будет найти по ключу элемент и удалить его из new Map
  // после этого сделать render
  completedItem(target) {
    let container = document.querySelectorAll(".todo-container");

    while (target !== container) {
      if (target.classList.contains("todo-item")) {
        this.todoData.forEach((value, key) => {
          if (target.key === key) {
            if (!value.completed) {
              value.completed = true;
              this.render();
              this.handler();
            } else {
              value.completed = false;
              this.render();
              this.handler();
            }
          }
        });
        return;
      }
      target = target.parentNode;
    }

    // нужно перебрать через форыч все элементы todoData и найти тот элемент, которому
    // соответствует ключ элемента, на который мы нажали
    // и поменять значение completed c false на true, с true на false
  }

  init() {
    this.form.addEventListener("submit", this.addTodo.bind(this));
    this.render();
    this.handler();
  }
}

const todo = new Todo(".todo-control", ".header-input", ".todo-list", ".todo-completed");
todo.init();
// localStorage.removeItem("toDoList");
