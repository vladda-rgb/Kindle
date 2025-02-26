// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Элементы DOM
    const homeBtn = document.getElementById('homeBtn');
    const tasksBtn = document.getElementById('tasksBtn');
    const profileBtn = document.getElementById('profileBtn');
    const pages = document.querySelectorAll('.page');
    const taskList = document.getElementById('taskList');
    const addTaskBtn = document.getElementById('addTask');
    const taskCount = document.getElementById('taskCount');

    // Переключение страниц
    const showPage = (pageId) => {
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === pageId) {
                page.classList.add('active');
            }
        });
    };

    homeBtn.addEventListener('click', () => showPage('home'));
    tasksBtn.addEventListener('click', () => showPage('tasks'));
    profileBtn.addEventListener('click', () => showPage('profile'));

    // Добавление задач
    let tasks = [];
    
    addTaskBtn.addEventListener('click', () => {
        const taskText = prompt('Введите описание задачи:');
        if (taskText) {
            const taskItem = document.createElement('li');
            taskItem.textContent = taskText;
            taskList.appendChild(taskItem);
            tasks.push(taskText);
            taskCount.textContent = tasks.length;
        }
    });

    // Инициализация
    showPage('home');
});