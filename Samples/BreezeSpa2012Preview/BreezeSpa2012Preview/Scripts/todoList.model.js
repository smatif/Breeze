﻿/// <reference path="todoList.dataservice.js"/>
// ReSharper disable InconsistentNaming
(function (ko, dataservice) {

    var store = dataservice.metadataStore;
    store.registerEntityTypeCtor('TodoItem', function () { }, TodoItemInitializer);
    store.registerEntityTypeCtor('TodoList', TodoList, TodoListInitializer);

    function TodoItemInitializer(todoItem) {
        todoItem.ErrorMessage = ko.observable();
        subscribeOnModified(todoItem);
    }
    function TodoListInitializer(todoList) {
        todoList.ErrorMessage = ko.observable();
        todoList.IsEditingListTitle = ko.observable(false);
        todoList.NewTodoTitle = ko.observable();
        subscribeOnModified(todoList);
    }
    function TodoList() {
        var self = this;
        self.Title = "My todos";       // defaults
        self.UserId = "to be replaced";
    };
    TodoList.prototype.addTodo = function () {
        var self = this;
        if (!self.NewTodoTitle()) { return null; } // need a title to save
        var todoItem = dataservice.createTodoItem();
        todoItem.Title(self.NewTodoTitle());
        self.NewTodoTitle("");
        todoItem.TodoList(self);
        return dataservice.addAndSaveEntity(todoItem);
    };
    TodoList.prototype.deleteTodo = function () {
        return dataservice.deleteAndSaveTodoItem(this);
    };
    function subscribeOnModified(entity) {
        entity.entityAspect.propertyChanged.subscribe(saveOnModified);
    }
    function saveOnModified(args) {
        var entity = args.entity;
        if (!dataservice.suspendSave &&
            entity.entityAspect.entityState.isModified()) {
            dataservice.saveEntity(entity);
        };
    }
    
})(ko, TodoApp.dataservice);