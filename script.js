document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const loginBtn = document.getElementById('loginBtn');
    const homeNav = document.getElementById('homeNav');
    const tasksNav = document.getElementById('tasksNav');
    const profileNav = document.getElementById('profileNav');
    const themeToggle = document.getElementById('themeToggle');
    const taskList = document.getElementById('taskList');
    const taskDetailContent = document.getElementById('taskDetailContent');
    const acceptTaskBtn = document.getElementById('acceptTaskBtn');
    const profileName = document.getElementById('profileName');
    const welcomeName = document.getElementById('welcomeName');
    const bonusCount = document.getElementById('bonusCount');
    const bonusCountHome = document.getElementById('bonusCountHome');
    const taskCount = document.getElementById('taskCount');
    const historyList = document.getElementById('historyList');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const bonusList = document.getElementById('bonusList');
    const taskFilter = document.getElementById('taskFilter');
    const notification = document.getElementById('notification');
    const progressFill = document.getElementById('progressFill');

    // Переключение экранов
    const showScreen = (screenId) => {
        screens.forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        [homeNav, tasksNav, profileNav].forEach(btn => btn.classList.remove('active'));
        if (screenId === 'homeScreen') homeNav.classList.add('active');
        if (screenId === 'bonusScreen') tasksNav.classList.add('active');
        if (screenId === 'profileScreen') profileNav.classList.add('active');
    };

    homeNav.addEventListener('click', () => showScreen('homeScreen'));
    tasksNav.addEventListener('click', () => showScreen('bonusScreen'));
    profileNav.addEventListener('click', () => showScreen('profileScreen'));

    // Темная тема
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Пользователь и данные
    let user = JSON.parse(localStorage.getItem('user')) || { name: 'Не указано', bonuses: 0, history: [] };
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [
        { id: 1, title: 'Посадка деревьев', desc: 'Озелените горный склон', bonus: 50, completed: false },
        { id: 2, title: 'Сбор мусора', desc: 'Очистите тропы в горах', bonus: 30, completed: false }
    ];

    const rewards = [
        { name: 'Термос', cost: 50 },
        { name: 'Походный рюкзак', cost: 100 },
        { name: 'Палатка', cost: 200 }
    ];

    // Логика входа
    loginBtn.addEventListener('click', () => {
        const email = document.getElementById('emailInput').value;
        if (email) {
            user.name = email.split('@')[0];
            updateProfile();
            showScreen('homeScreen');
            showNotification('Добро пожаловать в Kindle!');
        }
    });

    // Уведомления
    const showNotification = (message) => {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => notification.style.display = 'none', 2000);
    };

    // Обновление профиля и статистики
    const updateProfile = () => {
        profileName.textContent = user.name;
        welcomeName.textContent = user.name === 'Не указано' ? 'Гость' : user.name;
        bonusCount.textContent = user.bonuses;
        bonusCountHome.textContent = user.bonuses;
        taskCount.textContent = tasks.filter(t => !t.completed).length;
        progressFill.style.width = `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%`;
        historyList.innerHTML = user.history.map(h => `<li>${h.title} (+${h.bonus}) - ${h.date}</li>`).join('');
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Рендеринг задач
    const renderTasks = (filter = 'all') => {
        taskList.innerHTML = '';
        tasks.filter(task => 
            filter === 'all' || 
            (filter === 'active' && !task.completed) || 
            (filter === 'completed' && task.completed)
        ).forEach(task => {
            const card = document.createElement('div');
            card.classList.add('task-card');
            card.innerHTML = `
                <h3>${task.title}${task.completed ? ' ✓' : ''}</h3>
                <p>${task.desc}</p>
                <p class="bonus">+${task.bonus} бонусов</p>
            `;
            card.addEventListener('click', () => {
                taskDetailContent.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>${task.desc}</p>
                    <p>Награда: ${task.bonus} бонусов</p>
                `;
                showScreen('taskDetailScreen');
                acceptTaskBtn.style.display = task.completed ? 'none' : 'block';
                acceptTaskBtn.onclick = () => {
                    if (!task.completed) {
                        task.completed = true;
                        user.bonuses += task.bonus;
                        user.history.push({ title: task.title, bonus: task.bonus, date: new Date().toLocaleDateString() });
                        updateProfile();
                        renderTasks(taskFilter.value);
                        showScreen('homeScreen');
                        showNotification(`Задание "${task.title}" выполнено! +${task.bonus} бонусов`);
                    }
                };
            });
            taskList.appendChild(card);
        });
    };

    taskFilter.addEventListener('change', () => renderTasks(taskFilter.value));

    // Профиль
    editProfileBtn.addEventListener('click', () => {
        const newName = prompt('Введите новое имя:', user.name);
        if (newName) {
            user.name = newName;
            updateProfile();
            showNotification('Профиль обновлен!');
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        user = { name: 'Не указано', bonuses: 0, history: [] };
        updateProfile();
        showScreen('loginScreen');
        showNotification('Вы вышли из аккаунта');
    });

    // Бонусы
    const renderBonuses = () => {
        bonusList.innerHTML = '';
        rewards.forEach(reward => {
            const item = document.createElement('div');
            item.classList.add('bonus-item');
            item.innerHTML = `
                <span>${reward.name} (${reward.cost} бонусов)</span>
                <button ${user.bonuses < reward.cost ? 'disabled' : ''}>Обменять</button>
            `;
            item.querySelector('button').addEventListener('click', () => {
                if (user.bonuses >= reward.cost) {
                    user.bonuses -= reward.cost;
                    updateProfile();
                    renderBonuses();
                    showNotification(`Вы получили ${reward.name}!`);
                }
            });
            bonusList.appendChild(item);
        });
    };

    // Инициализация
    if (user.name !== 'Не указано') showScreen('homeScreen');
    renderTasks();
    renderBonuses();
    updateProfile();
});