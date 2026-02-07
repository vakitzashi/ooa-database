// Структура данных: { CATEGORY: { FILE: data } }
let allData = {};
let currentSelection = null;
let favorites = [];
let mastery = [];

// Инициализация данных из LocalStorage
function initPersistence() {
    try {
        const favData = localStorage.getItem('ooa_favorites');
        if (favData) {
            favorites = JSON.parse(favData);
            if (!Array.isArray(favorites)) favorites = [];
            // Remove empty/null values and duplicates
            favorites = [...new Set(favorites.filter(i => i && typeof i === 'string'))];
        }

        const mastData = localStorage.getItem('ooa_mastery');
        if (mastData) {
            mastery = JSON.parse(mastData);
            if (!Array.isArray(mastery)) mastery = [];
            // Remove empty/null values and duplicates
            mastery = [...new Set(mastery.filter(i => i && typeof i === 'string'))];
        }

        console.log('Persistence loaded:', { favorites: favorites.length, mastery: mastery.length });
    } catch (e) {
        console.error('Error loading persistence:', e);
    }
}

// Сохранение данных
function savePersistence() {
    localStorage.setItem('ooa_favorites', JSON.stringify(favorites));
    localStorage.setItem('ooa_mastery', JSON.stringify(mastery));
}

// SVG Icon generator - creates inline SVG icons for menu items
function getIcon(name) {
    const icons = {
        // Category icons
        'devices': '<svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.5c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zM19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z"/></svg>',
        'shells': '<svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>',
        'weapon': '<svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z"/></svg>',

        // File type icons
        'ammo': '<svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>',
        'devices_sub': '<svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>',
        'mods': '<svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/></svg>',
        'neurolinks': '<svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 16.5v-9l7 4.5-7 4.5z"/><circle cx="12" cy="8" r="2"/><circle cx="6" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/><circle cx="12" cy="16" r="2"/></svg>',
        'optics': '<svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>',
        'augments': '<svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>',
        'buffs': '<svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>',
        'shells_sub': '<svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>',
        'backups': '<svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3zM12 14c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z"/></svg>',
        'heavy': '<svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>',
        'primary': '<svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z"/></svg>',
        'sidearm': '<svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83v-4.7l6-2.25 6 2.25v4.7zM9.01 14.33l-1.42-1.42L10.67 10 7.59 6.92 9.01 5.5l4.24 4.24z"/></svg>',

        // Special tabs
        'favorite': '<svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
        'mastery': '<svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
        'loadout': '<svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>'
    };
    return icons[name] || '';
}

// Структура папок и файлов (оригинальные названия для загрузки)
const STRUCTURE = {
    DEVICES: ['AMMO', 'DEVICES', 'MODS', 'NEUROLINKS', 'OPTICS'],
    SHELLS: ['AUGMENTS', 'BUFFS', 'SHELLS'],
    WEAPON: ['BACKUPS', 'HEAVY WEAPON', 'PRIMARY', 'SIDEARM']
};

// Соответствие между русскими названиями и оригинальными ключами
const CATEGORY_LABELS = {
    DEVICES: 'ДЕВАЙСЫ',
    SHELLS: 'ОБОЛОЧКИ',
    WEAPON: 'ОРУЖИЕ'
};

// Соответствие названий файлов на русский язык
const FILE_LABELS = {
    'AMMO': 'БОЕПРИПАСЫ',
    'DEVICES': 'УСТРОЙСТВА',
    'MODS': 'МОДЫ',
    'NEUROLINKS': 'НЕЙРОСВЯЗЬ',
    'OPTICS': 'ОПТИКА',
    'AUGMENTS': 'АУГМЕНТАЦИИ',
    'BUFFS': 'БАФФЫ',
    'SHELLS': 'ОБОЛОЧКИ',
    'BACKUPS': 'РЕЗЕРВНЫЕ',
    'HEAVY WEAPON': 'ТЯЖЕЛОЕ ОРУЖИЕ',
    'PRIMARY': 'ОСНОВНОЕ',
    'SIDEARM': 'ВСПОМОГАТЕЛЬНОЕ'
};

// Загрузка всех JSON файлов при загрузке страницы
async function loadAllData() {
    console.log('Начало загрузки данных...');
    console.log('Текущий URL:', window.location.href);

    for (const [category, files] of Object.entries(STRUCTURE)) {
        allData[category] = {};

        for (const file of files) {
            try {
                // Правильный путь зависит от расположения index.html
                const filePath = `data/${category}/${file}.json`;
                console.log(`Загружаю: ${filePath}`);

                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                allData[category][file] = data;
                console.log(`✓ Загружен: ${category}/${file}`, data);
            } catch (error) {
                console.error(`✗ Ошибка загрузки ${category}/${file}:`, error);
                // Попробуем альтернативный путь
                try {
                    const altPath = `./${category}/${file}.json`;
                    console.log(`Пробую альтернативный путь: ${altPath}`);
                    const response = await fetch(altPath);
                    if (response.ok) {
                        const data = await response.json();
                        allData[category][file] = data;
                        console.log(`✓ Загружен (альт): ${category}/${file}`, data);
                    } else {
                        allData[category][file] = null;
                    }
                } catch (altError) {
                    console.error(`✗ Альтернативный путь также не сработал:`, altError);
                    allData[category][file] = null;
                }
            }
        }
    }

    console.log('Загрузка завершена. Данные:', allData);
    renderMenu();
}

// Инициализация кнопки меню для мобильных
function initMenuToggle() {
    const toggleBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    if (toggleBtn && sidebar) {
        // Открытие/закрытие меню
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            sidebar.classList.toggle('active');
        });

        // Touch события для лучшей поддержки мобильных
        toggleBtn.addEventListener('touchstart', (e) => {
            toggleBtn.style.opacity = '0.7';
        });

        toggleBtn.addEventListener('touchend', (e) => {
            toggleBtn.style.opacity = '1';
        });

        // Закрываем меню при клике на пункт меню
        document.querySelectorAll('.menu-item, .menu-category').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }
            });
        });

        // Закрываем меню при клике на фон (::after элемент)
        sidebar.addEventListener('click', (e) => {
            if (e.target === sidebar && window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });

        // Закрываем меню при изменении размера окна
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('active');
            }
        });

        // Предотвращаем scrolling body при открытом меню на мобильных
        document.addEventListener('touchmove', (e) => {
            if (sidebar.classList.contains('active') &&
                !sidebar.contains(e.target) &&
                window.innerWidth <= 768) {
                e.preventDefault();
            }
        }, { passive: false });
    }
}

// Генерация бокового меню
function renderMenu() {
    const menu = document.getElementById('menu');
    menu.innerHTML = '';

    for (const [category, files] of Object.entries(STRUCTURE)) {
        // Создаем кнопку категории с русским названием и иконкой
        const categoryBtn = document.createElement('button');
        categoryBtn.className = 'menu-category';
        const iconName = category.toLowerCase();
        categoryBtn.innerHTML = getIcon(iconName) + (CATEGORY_LABELS[category] || category);
        categoryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCategory(category, categoryBtn);
        });

        // Создаем подменю
        const submenu = document.createElement('div');
        submenu.className = 'menu-submenu';
        submenu.id = `submenu-${category}`;

        files.forEach(file => {
            const itemBtn = document.createElement('button');
            itemBtn.className = 'menu-item';
            // Определяем иконку для каждого типа файла
            let iconName;
            if (file === 'AMMO') iconName = 'ammo';
            else if (file === 'DEVICES') iconName = 'devices_sub';
            else if (file === 'MODS') iconName = 'mods';
            else if (file === 'NEUROLINKS') iconName = 'neurolinks';
            else if (file === 'OPTICS') iconName = 'optics';
            else if (file === 'AUGMENTS') iconName = 'augments';
            else if (file === 'BUFFS') iconName = 'buffs';
            else if (file === 'SHELLS') iconName = 'shells_sub';
            else if (file === 'BACKUPS') iconName = 'backups';
            else if (file === 'HEAVY WEAPON') iconName = 'heavy';
            else if (file === 'PRIMARY') iconName = 'primary';
            else if (file === 'SIDEARM') iconName = 'sidearm';
            else iconName = 'devices_sub'; // запасная иконка

            itemBtn.innerHTML = getIcon(iconName) + (FILE_LABELS[file] || file);
            itemBtn.addEventListener('click', (e) => {
                e.preventDefault();
                selectFile(category, file, itemBtn);
            });
            submenu.appendChild(itemBtn);
        });

        menu.appendChild(categoryBtn);
        menu.appendChild(submenu);
    }

    // Добавляем разделитель
    const separator = document.createElement('div');
    separator.className = 'menu-separator';
    menu.appendChild(separator);

    // Добавляем вкладку "Избранное"
    const favBtn = document.createElement('button');
    favBtn.className = 'menu-category special-tab';
    favBtn.innerHTML = getIcon('favorite') + 'ИЗБРАННОЕ';
    favBtn.onclick = (e) => { // Используем onclick для предотвращения дублирования
        e.preventDefault();
        toggleCategory('favorites', favBtn);
        renderFavorites();
    };
    menu.appendChild(favBtn);

    // Добавляем вкладку "Мастерство"
    const mastBtn = document.createElement('button');
    mastBtn.className = 'menu-category special-tab';
    mastBtn.innerHTML = getIcon('mastery') + 'МАСТЕРСТВО';
    mastBtn.onclick = (e) => { // Используем onclick
        e.preventDefault();
        toggleCategory('mastery', mastBtn);
        renderMastery();
    };
    menu.appendChild(mastBtn);

    // Добавляем разделитель перед приложениями
    const appSeparator = document.createElement('div');
    appSeparator.className = 'menu-separator';
    menu.appendChild(appSeparator);

    // Добавляем ссылку на Loadout Editor
    const loadoutBtn = document.createElement('button');
    loadoutBtn.className = 'menu-category special-tab';
    loadoutBtn.innerHTML = getIcon('loadout') + 'LOADOUT EDITOR';
    loadoutBtn.style.color = '#4fffe3'; // Neon cyan color from the app
    loadoutBtn.onclick = (e) => {
        window.location.href = 'apps/OOR Loadout.html';
    };
    menu.appendChild(loadoutBtn);
}

// Переключение видимости подменю
function toggleCategory(category, btn) {
    const submenu = document.getElementById(`submenu-${category}`);
    // submenu может быть null для специальных вкладок (Favorites/Mastery)
    const isActive = submenu ? submenu.classList.contains('active') : btn.classList.contains('active');

    // Закрываем все подменю
    document.querySelectorAll('.menu-submenu').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.menu-category').forEach(b => b.classList.remove('active'));

    // Открываем выбранное подменю
    if (!isActive) {
        if (submenu) submenu.classList.add('active');
        btn.classList.add('active');

        // Для специальных вкладок (Favorites/Mastery) нет подменю, но нужно убрать активность с других
        if (category === 'favorites' || category === 'mastery') {
            // Ничего специфичного делать не нужно, css класс active уже добавлен
        }
    }
}

// Выбор файла и отображение содержимого
function selectFile(category, file, btn) {
    currentSelection = { category, file };

    // Очищаем поиск
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }

    // Обновляем активный элемент меню
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    btn.classList.add('active');

    // Получаем данные и отображаем карточки
    const data = allData[category][file];
    console.log(`Выбран файл: ${category}/${file}`, data);

    // Специальная обработка для AUGMENTS
    if (file === 'AUGMENTS') {
        console.log('Загружаем AUGMENTS');
        renderAugmentsSelector(data);
    } else {
        renderCards(data, file);
    }
}

// Рендеринг селектора категорий для аугментов
function renderAugmentsSelector(data) {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '';

    if (!data) {
        contentArea.innerHTML = '<p class="placeholder">Ошибка загрузки данных</p>';
        console.error('Данные AUGMENTS не загружены');
        return;
    }

    // Извлекаем аугменты
    let items = extractItems(data);
    console.log('Извлеченные аугменты:', items);

    if (!items || items.length === 0) {
        contentArea.innerHTML = '<p class="placeholder">Нет данных для отображения</p>';
        console.warn('Аугменты не найдены в данных');
        return;
    }

    // Создаем селектор категорий
    const selector = document.createElement('div');
    selector.className = 'augments-selector';

    const categories = [
        { type: 'BDY', label: 'BDY' },
        { type: 'TEC', label: 'TEC' },
        { type: 'HWR', label: 'HWR' }
    ];

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.setAttribute('data-type', cat.type);
        btn.textContent = cat.label;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Удаляем активный класс у всех кнопок
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            btn.classList.add('active');
            // Показываем аугменты этой категории
            renderAugmentsByCategory(items, cat.type);
        });
        selector.appendChild(btn);
    });

    contentArea.appendChild(selector);

    // По умолчанию показываем BDY
    document.querySelectorAll('.category-btn')[0].click();
}

// Рендеринг аугментов определённой категории
function renderAugmentsByCategory(items, categoryType) {
    const contentArea = document.getElementById('content-area');

    // Находим контейнер с кнопками и оставляем его
    const selector = contentArea.querySelector('.augments-selector');

    // Удаляем старые карточки (но не селектор)
    const oldCards = contentArea.querySelectorAll('.card, .group-header');
    oldCards.forEach(card => card.remove());

    // Фильтруем аугменты по типу требования
    let filteredItems = items.filter(item => {
        if (item.requirement) {
            const type = item.requirement.split(' ')[0];
            return type === categoryType;
        }
        return false;
    });

    if (filteredItems.length === 0) {
        const placeholder = document.createElement('p');
        placeholder.className = 'placeholder';
        placeholder.textContent = 'Нет аугментов в этой категории';
        contentArea.appendChild(placeholder);
        return;
    }

    // Сортируем элементы по стоимости (от большего к меньшему)
    filteredItems = sortItemsByCost(filteredItems);

    // Создаем карточки
    filteredItems.forEach(item => {
        const card = createCard(item);
        contentArea.appendChild(card);
    });
}

// Рендеринг карточек
function renderCards(data, fileName) {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '';

    if (!data) {
        contentArea.innerHTML = '<p class="placeholder">Ошибка загрузки данных</p>';
        return;
    }

    // Извлекаем массив элементов из структуры JSON
    let items = extractItems(data);

    if (!items || items.length === 0) {
        contentArea.innerHTML = '<p class="placeholder">Нет данных для отображения</p>';
        return;
    }

    // Сортируем элементы по стоимости (от большего к меньшему)
    items = sortItemsByCost(items);

    // Создаем карточки обычного формата
    items.forEach(item => {
        const card = createCard(item);
        contentArea.appendChild(card);
    });
}

// Рендеринг сгруппированных аугментов
function renderGroupedAugments(items, container) {
    const groups = {
        BDY: [],
        HWR: [],
        TEC: []
    };

    // Распределяем аугменты по группам
    items.forEach(item => {
        if (item.requirement) {
            const type = item.requirement.split(' ')[0]; // Извлекаем BDY/HWR/TEC
            if (groups[type]) {
                groups[type].push(item);
            }
        }
    });

    // Сортируем каждую группу по стоимости
    for (const groupType in groups) {
        groups[groupType] = sortItemsByCost(groups[groupType]);
    }

    // Отображаем группы с заголовками
    const groupOrder = ['BDY', 'HWR', 'TEC'];
    groupOrder.forEach(groupType => {
        if (groups[groupType].length > 0) {
            const header = document.createElement('div');
            header.className = 'group-header';
            header.innerHTML = `<h2 style="margin: 30px 0 15px 0; font-size: 18px; color: #4a9eff; border-bottom: 2px solid #333; padding-bottom: 8px;">${groupType}</h2>`;
            container.appendChild(header);

            // Добавляем карточки группы
            groups[groupType].forEach(item => {
                const card = createCard(item);
                container.appendChild(card);
            });
        }
    });
}

// Извлечение элементов из разных структур JSON
function extractItems(data) {
    let items = [];

    if (!data) return items;

    if (Array.isArray(data)) {
        // Если это массив
        items = data;
    } else if (typeof data === 'object') {
        // Рекурсивный поиск массивов и данных
        items = findItemsInObject(data);
    }

    return items.map(item => {
        // Гарантируем наличие name для идентификации
        if (!item.name) {
            item.name = item.class_name || item.title || item.название || 'Unknown Item';
        }
        return item;
    });
}

// Рекурсивная функция для поиска элементов в объектах
function findItemsInObject(obj, depth = 0) {
    let items = [];

    if (depth > 5) return items; // Защита от бесконечной рекурсии

    for (const key in obj) {
        const value = obj[key];

        // Если это массив объектов
        if (Array.isArray(value) && value.length > 0) {
            // Проверяем, что это массив объектов, а не массив строк
            if (typeof value[0] === 'object') {
                // Для weapon_classes нам нужны weapons из каждого класса
                if (key === 'weapon_classes' && value[0].weapons) {
                    value.forEach(weaponClass => {
                        if (weaponClass.weapons && Array.isArray(weaponClass.weapons)) {
                            items = items.concat(weaponClass.weapons);
                        }
                    });
                    return items;
                }
                // Для других случаев - возвращаем сам массив
                return value;
            }
        }

        // Если это объект с вложенными items (как в AMMO.json)
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            if (value.items && Array.isArray(value.items)) {
                items = items.concat(value.items);
            } else {
                // Рекурсивный поиск
                const nested = findItemsInObject(value, depth + 1);
                if (nested.length > 0) {
                    items = items.concat(nested);
                }
            }
        }
    }

    return items;
}

// Функция для извлечения стоимости из элемента (для сортировки)
function extractCost(item) {
    if (!item) return 0;

    // Проверяем различные возможные поля стоимости
    const costFields = [
        'матрикс_цена',  // Russian for matrix cost
        'hwr', 'bdy', 'tec',  // Type-specific costs
        'cost_value',  // Generic cost value
        'price', 'cost',  // Other common names
    ];

    for (const field of costFields) {
        if (item[field] !== undefined && item[field] !== null && item[field] !== '') {
            const value = parseInt(item[field]);
            if (!isNaN(value)) {
                return value;
            }
        }
    }

    // Проверяем поля requirement (например "BDY 50")
    if (item.requirement && typeof item.requirement === 'string') {
        const match = item.requirement.match(/(\d+)/);
        if (match) {
            return parseInt(match[1]);
        }
    }

    return 0;
}

// Функция для сортировки элементов по стоимости (от большего к меньшему)
function sortItemsByCost(items) {
    if (!Array.isArray(items)) return items;

    return items.sort((a, b) => {
        const costA = extractCost(a);
        const costB = extractCost(b);
        return costB - costA; // От большего к меньшему
    });
}

// Создание карточки элемента
function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';

    // Проверка состояния
    const isFav = favorites.includes(item.name);
    const isMast = mastery.includes(item.name);

    if (isMast) {
        card.classList.add('mastery-active');
    }

    let html = '<div class="card-header">';

    // Название (основное поле) - поддержка формата "Original (Перевод)"
    let title = item.name || item.class_name || item.title || item.название || 'Без названия';

    // Если есть перевод, добавляем его в скобках
    if (item.translation) {
        title = `${title} (${item.translation})`;
    } else if (item.name_ru) {
        title = `${title} (${item.name_ru})`;
    }

    // Начало контента заголовка
    html += '<div class="card-header-content">';
    html += `<div class="card-title">${escapeHtml(title)}</div>`;

    // Подзаголовок
    if (item.full_name) {
        html += `<div class="card-subtitle">${escapeHtml(item.full_name)}</div>`;
    } else if (item.requirement) {
        html += `<div class="card-subtitle">Требование: ${escapeHtml(item.requirement)}</div>`;
    } else if (item.type) {
        let typeStr = item.type;
        if (!/[а-яА-Я]/.test(typeStr) && translationDict[typeStr.toLowerCase()]) {
            typeStr = translationDict[typeStr.toLowerCase()];
        }
        html += `<div class="card-subtitle">${escapeHtml(typeStr)}</div>`;
    }
    html += '</div>'; // Конец card-header-content

    // Кнопки действий
    html += `<div class="card-actions">
        <button class="action-btn favorite ${isFav ? 'active' : ''}" onclick="toggleFavorite(this, '${escapeHtml(item.name).replace(/'/g, "\\'")}')">❤</button>
        <button class="action-btn mastery ${isMast ? 'active' : ''}" onclick="toggleMastery(this, '${escapeHtml(item.name).replace(/'/g, "\\'")}')">★</button>
    </div>`;

    html += '</div><div class="card-content">'; // Конец card-header, начало card-content

    // Описание
    const description = item.description || item.статы;
    if (description) {
        html += '<div class="card-section">';
        if (Array.isArray(description)) {
            description.forEach(desc => {
                const highlightedDesc = highlightNumbers(escapeHtml(desc));
                html += `<div class="stat stat-list-item">• ${highlightedDesc}</div>`;
            });
        } else {
            const highlightedDesc = highlightNumbers(escapeHtml(description));
            html += `<div class="stat stat-list-item">• ${highlightedDesc}</div>`;
        }
        html += '</div>';
    }

    // Характеристики
    const specs = [];
    if (item.slot) specs.push({ label: 'Слот', value: item.slot });
    if (item.firemode) specs.push({ label: 'Режим', value: item.firemode });
    if (item.type) specs.push({ label: 'Тип', value: item.type });
    if (item.cost_type && item.cost_value !== undefined) {
        specs.push({ label: 'Стоимость', value: `${item.cost_value} ${item.cost_type}` });
    }

    if (specs.length > 0) {
        html += '<div class="card-section"><div class="card-section-title">Параметры</div><div class="card-stats">';
        specs.forEach(spec => {
            html += `<div class="stat"><span>${escapeHtml(spec.label)}:</span> <span>${escapeHtml(String(spec.value))}</span></div>`;
        });
        html += '</div></div>';
    }

    // Статистика
    const statsHtml = renderStatsCompact(item);
    if (statsHtml) {
        html += `<div class="card-section"><div class="card-section-title">Статистика</div><div class="card-stats">${statsHtml}</div></div>`;
    }

    // Штрафы
    if (item.penalties && Array.isArray(item.penalties)) {
        html += '<div class="card-section"><div class="card-section-title">⚠️ Штрафы</div><div class="card-stats">';
        item.penalties.forEach(penalty => {
            const highlightedPenalty = highlightNumbers(escapeHtml(penalty));
            html += `<div class="stat stat-list-item" style="border-left-color: #D03A4E; color: #FF8899;">• ${highlightedPenalty}</div>`;
        });
        html += '</div></div>';
    }

    html += '</div>';
    card.innerHTML = html;
    return card;
}

// Компактное рендеринг статистики
function renderStatsCompact(item) {
    let statsHtml = '';
    const skipKeys = ['name', 'full_name', 'description', 'class_name', 'weapons', 'penalties',
        'type', 'slot', 'firemode', 'requirement', 'integrated_mods', 'category', 'cost_type', 'cost_value',
        'название', 'ветка', 'матрикс_цена', 'статы', 'категория', 'описание'];

    for (const key in item) {
        if (skipKeys.includes(key)) {
            continue;
        }

        const value = item[key];

        if (typeof value === 'string' || typeof value === 'number') {
            // Пропускаем пустые значения
            if (value === '' || value === null || value === undefined) continue;

            const displayKey = formatKeyWithTranslation(key);
            const highlightedValue = highlightNumbers(escapeHtml(String(value)));
            statsHtml += `<div class="stat"><span>${displayKey}:</span> <span>${highlightedValue}</span></div>`;
        }
        else if (Array.isArray(value) && value.length > 0) {
            // Если это массив строк (effects, stats и т.д.)
            if (typeof value[0] === 'string') {
                value.forEach(stat => {
                    const highlightedStat = highlightNumbers(escapeHtml(stat));
                    statsHtml += `<div class="stat stat-list-item">• ${highlightedStat}</div>`;
                });
            }
            // Специальная обработка для встроенных аугментаций (массив объектов)
            else if (key === 'integrated_augments' && typeof value[0] === 'object') {
                statsHtml += `<div class="stat-section-title">${formatKeyWithTranslation(key)}:</div>`;
                value.forEach(aug => {
                    const augName = aug.name || 'Unknown';
                    statsHtml += `<div class="stat" style="color: #4a9eff; margin-top: 4px;">${escapeHtml(augName)}</div>`;
                    if (aug.effects && Array.isArray(aug.effects)) {
                        aug.effects.forEach(eff => {
                            statsHtml += `<div class="stat stat-list-item" style="padding-left: 10px; font-size: 0.9em; opacity: 0.9;">- ${highlightNumbers(escapeHtml(eff))}</div>`;
                        });
                    }
                });
            }
        }
        else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // Если это объект с характеристиками (например, stats)
            let hasContent = false;
            let subStatsHtml = '';

            for (const subKey in value) {
                const subValue = value[subKey];
                if (typeof subValue === 'string' || typeof subValue === 'number') {
                    if (subValue === '' || subValue === null || subValue === undefined) continue;

                    const displaySubKey = formatKeyWithTranslation(subKey);
                    const highlightedSubValue = highlightNumbers(escapeHtml(String(subValue)));
                    subStatsHtml += `<div class="stat"><span>${displaySubKey}:</span> <span>${highlightedSubValue}</span></div>`;
                    hasContent = true;
                }
            }

            if (hasContent) {
                statsHtml += subStatsHtml;
            }
        }
    }

    return statsHtml;
}

// Рендеринг статистики
function renderStats(item) {
    let statsHtml = '';
    const skipKeys = ['name', 'full_name', 'description', 'class_name', 'weapons', 'penalties',
        'type', 'slot', 'firemode', 'requirement', 'integrated_mods', 'category',
        'название', 'ветка', 'матрикс_цена', 'статы', 'категория', 'описание'];

    for (const key in item) {
        if (skipKeys.includes(key)) {
            continue;
        }

        const value = item[key];

        if (typeof value === 'string' || typeof value === 'number') {
            // Пропускаем пустые значения
            if (value === '' || value === null || value === undefined) continue;

            const displayKey = formatKeyWithTranslation(key);
            const highlightedValue = highlightNumbers(escapeHtml(String(value)));
            statsHtml += `<div class="stat"><span>${displayKey}:</span> <span>${highlightedValue}</span></div>`;
        }
        // Специальная обработка для встроенных аугментаций в детальном просмотре
        else if (key === 'integrated_augments' && Array.isArray(value)) {
            statsHtml += `<div class="stat-section-title" style="margin-top: 10px; border-bottom: 1px solid #444;">${formatKeyWithTranslation(key)}</div>`;
            value.forEach(aug => {
                const augName = aug.name || 'Unknown';
                statsHtml += `<div class="stat" style="color: #4a9eff; margin-top: 5px; font-weight: bold;">${escapeHtml(augName)}</div>`;
                if (aug.effects && Array.isArray(aug.effects)) {
                    aug.effects.forEach(eff => {
                        statsHtml += `<div class="stat stat-list-item" style="padding-left: 15px;">• ${highlightNumbers(escapeHtml(eff))}</div>`;
                    });
                }
            });
        }
        else if (Array.isArray(value) && value.length > 0) {
            // Если это массив строк (effects, stats и т.д.)
            if (typeof value[0] === 'string') {
                value.forEach(stat => {
                    const highlightedStat = highlightNumbers(escapeHtml(stat));
                    statsHtml += `<div class="stat">• ${highlightedStat}</div>`;
                });
            }
        }
        else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // Если это объект с характеристиками (например, stats)
            let hasContent = false;
            let subStatsHtml = '';

            for (const subKey in value) {
                const subValue = value[subKey];
                if (typeof subValue === 'string' || typeof subValue === 'number') {
                    if (subValue === '' || subValue === null || subValue === undefined) continue;

                    const displaySubKey = formatKeyWithTranslation(subKey);
                    const highlightedSubValue = highlightNumbers(escapeHtml(String(subValue)));
                    subStatsHtml += `<div class="stat"><span>${displaySubKey}:</span> <span>${highlightedSubValue}</span></div>`;
                    hasContent = true;
                }
            }

            if (hasContent) {
                statsHtml += subStatsHtml;
            }
        }
    }

    return statsHtml;
}

// Словарь переводов полей
const translationDict = {
    'translation': 'Перевод',
    'hwr': 'Стоимость HWR',
    'cost_type': 'Тип стоимости',
    'cost_value': 'Стоимость',
    'range_m': 'Дальность (м)',
    'damage': 'Урон',
    'rpm': 'Выстр/мин',
    'ammo_capacity': 'Емкость магазина',
    'max_efficiency': 'Макс. эффективность',
    'projectile_velocity_ms': 'Скорость снаряда (м/с)',
    'spread_degrees': 'Разброс (градусы)',
    'type': 'Тип',
    'action': 'Действие',
    'throw_velocity_ms': 'Скорость броска (м/с)',
    'health': 'Здоровье',
    'activation': 'Активация',
    'duration_s': 'Длительность (сек)',
    'cooldown_s': 'Перезарядка (сек)',
    'speed_penalty_ms': 'Штраф скорости (м/с)',
    'damage_multiplier': 'Множитель урона',
    'headshot_multiplier': 'Множитель в голову',
    'limb_multiplier': 'Множитель по конечностям',
    'time_to_ads': 'Время прицеливания (сек)',
    'capacity': 'Емкость',
    'firerate': 'Темп огня',
    'firemode': 'Режим огня',
    'slot': 'Слот',
    'requirement': 'Требование',
    'burst_delay': 'Задержка очереди (сек)',
    'category': 'Категория',
    'description': 'Описание',
    'name': 'Название',
    'full_name': 'Полное название',
    'class_name': 'Класс',
    'weapons': 'Оружие',
    'stats': 'Статистика',
    'penalties': 'Штрафы',
    'effects': 'Эффекты',
    'integrated_mods': 'Встроенные модификации',
    'pellet_count': 'Количество дробинок',
    'special_note': 'Примечание',
    'explosive_range': 'Радиус взрыва (м)',
    'velocity': 'Скорость (м/с)',
    'features': 'Особенности',
    'technical_stats': 'Технические хар-ки',
    'gameplay': 'Геймплей',
    'stats_matrix': 'Матрица статов',
    'zone_diameter_m': 'Диаметр зоны (м)',
    'radius_m': 'Радиус (м)',
    'impact_damage_explosive': 'Урон от взрыва при ударе',
    'impact_damage_fire': 'Урон огнем при ударе',
    'impact_radius_m': 'Радиус удара (м)',
    'activation_fire_damage': 'Урон огнем при активации',
    'activation_radius_m': 'Радиус активации (м)',
    'projectiles_count': 'Количество снарядов',
    'vital_damage': 'Урон по здоровью',
    'bleed_damage_ps': 'Урон от кровотечения (в сек)',
    'snare_duration_s': 'Длительность замедления (сек)',
    'charges': 'Заряды',
    'activation_range_m': 'Дальность активации (м)',
    'projectile_type': 'Тип снаряда',
    'activation_delay_s': 'Задержка активации (сек)',
    'overcharge_duration_s': 'Длительность перегрузки (сек)',
    'main_cloud_radius_m': 'Радиус основного облака (м)',
    'small_clouds_radius_m': 'Радиус малых облаков (м)',
    'speed_penalty': 'Штраф к скорости',
    'mods': 'Модификации',
    'note': 'Примечание',
    'vitals': 'Здоровье',
    'defense': 'Защита',
    'defense_regen': 'Регенерация защиты',
    'defense_regen_delay': 'Задержка регенерации (сек)',
    'aux_power_regen': 'Регенерация доп. энергии',
    'base_ground_speed': 'Базовая скорость (м/с)',
    'active_core_speed_pct': 'Скорость при активном Ядре (%)',
    'aerial_maneuver_charges': 'Заряды возд. маневра',
    'aerial_charge_regen': 'Регенерация заряда маневра',
    'radar_profile_m': 'Радарный профиль (м)',
    'maneuver_speed': 'Скорость маневра (м/с)',
    'integrated_augments': 'Встроенные аугментации'
};

// Форматирование ключей с переводом
function formatKeyWithTranslation(key) {
    const lowerKey = key.toLowerCase();

    // Проверяем есть ли перевод в словаре
    if (translationDict[lowerKey]) {
        return translationDict[lowerKey];
    }

    // Если нет перевода - используем форматирование
    return formatKey(key);
}

// Форматирование ключей (snake_case -> Normal Case)
function formatKey(key) {
    return key
        .replace(/_/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Экранирование HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Подсветка чисел в тексте
// Подсветка чисел и негативных эффектов
function highlightNumbers(text) {
    if (!text) return text;

    // Проверяем контекст на негативность (для красного цвета)
    const lower = text.toLowerCase();
    let isNegative = false;

    // Ключевые слова для определения плохих эффектов
    const has = (w) => lower.includes(w);

    // Плохо, если значение увеличивается (+)
    const badIfPositive = [
        'разброс', 'отдача', 'задержка', 'штраф', 'расход', 'входящий урон', 'время перезарядки',
        'spread', 'recoil', 'delay', 'penalty', 'drain', 'received damage', 'reload time'
        // Убрали 'перезарядка'/'reload' т.к. "скорость перезарядки" (+) это хорошо
    ];

    // Плохо, если значение уменьшается (-)
    const badIfNegative = [
        'урон', 'скорость', 'здоровье', 'защита', 'дальность', 'дистанция', 'точность', 'регенерация', 'эффективность', 'емкость', 'магазин', 'длительность',
        'damage', 'speed', 'vitals', 'health', 'defense', 'range', 'distance', 'accuracy', 'regeneration', 'efficiency', 'capacity', 'magazine', 'duration'
    ];

    if (has('штраф') || has('penalty')) isNegative = true;

    // Проверка на наличие знаков и контекста
    if (/\+\d+/.test(text)) {
        if (badIfPositive.some(p => has(p))) isNegative = true;
    }
    if (/-\d+/.test(text)) {
        if (badIfNegative.some(p => has(p))) isNegative = true;
        // Исключение для 'урон': если 'входящий', то минус это хорошо
        if ((has('урон') || has('damage')) && (has('входящий') || has('received') || has('получаемый'))) {
            // Incoming damage reduction is GOOD
        } else if ((has('урон') || has('damage')) && /-\d+/.test(text)) {
            // Outgoing damage reduction is BAD
            isNegative = true;
        }
    }

    // Текст уже экранирован вызывающей функцией
    let html = text;

    // Regex для чисел (требует знак или единицу измерения, чтобы избежать ложных срабатываний)
    // 1. Start of string or non-word char (space, paren)
    // 2. Number with sign OR unit OR percent (Critical for avoiding "Model 12")
    //    Pattern: [+-]\d... OR \d...[%xмскгs]
    const numberPattern = /(^|[\s\(])([+-]\d+(?:[.,]\d+)?(?:%|x|м|с|кг|s|m|kg)?|\d+(?:[.,]\d+)?(?:%|x|м|с|кг|s|m|kg))(?=$|[\s\)])/g;

    // Диапазоны: 10-20
    const rangePattern = /(\d+(?:[.,]\d+)?)[–-](\d+(?:[.,]\d+)?)/g;

    // Применяем диапазоны (стандартный желтый)
    html = html.replace(rangePattern, '<span class="stat-value">$1–$2</span>');

    // Применяем одиночные числа (стандартный желтый)
    html = html.replace(numberPattern, '$1<span class="stat-value">$2</span>');

    // Оборачиваем в красный, если контекст негативный
    if (isNegative) {
        html = `<span class="negative-effect">${html}</span>`;
    }

    return html;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initPersistence(); // Загружаем данные перед всем остальным
    // Предотвращаем двойной зум при двойном клике
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Предотвращаем увеличение шрифта при повороте устройства
    let lastOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    window.addEventListener('orientationchange', () => {
        const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
        if (lastOrientation !== newOrientation) {
            lastOrientation = newOrientation;
            // Переотрисовываем если выбрана категория
            if (currentSelection) {
                const data = allData[currentSelection.category][currentSelection.file];
                if (currentSelection.file === 'AUGMENTS') {
                    renderAugmentsSelector(data);
                } else {
                    renderCards(data, currentSelection.file);
                }
            }
        }
    });

    loadAllData();
    initMenuToggle();
    initSearch();
});

// Инициализация поиска
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchContainer = document.querySelector('.search-container');
    const contentArea = document.querySelector('.content');
    let searchTimeout;

    if (searchInput) {
        // Уменьшаем размер шрифта на мобильных для предотвращения зума
        if (window.innerWidth <= 480) {
            searchInput.style.fontSize = '16px';
        }

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);

            const query = e.target.value.toLowerCase().trim();

            // Задерживаем поиск для лучшей производительности
            searchTimeout = setTimeout(() => {
                if (query.length === 0) {
                    // Если поле пустое - показываем обычный контент
                    if (currentSelection) {
                        const data = allData[currentSelection.category][currentSelection.file];
                        if (currentSelection.file === 'AUGMENTS') {
                            renderAugmentsSelector(data);
                        } else {
                            renderCards(data, currentSelection.file);
                        }
                    }
                } else {
                    // Выполняем поиск
                    performSearch(query);
                }
            }, 300);
        });

        // При фокусировке на поиск, всегда показываем его
        searchInput.addEventListener('focus', () => {
            if (searchContainer) {
                searchContainer.classList.remove('hidden');
            }
        });

        // Закрываем клавиатуру и меню при начале скролла
        if (contentArea) {
            contentArea.addEventListener('touchstart', () => {
                searchInput.blur();
            });
        }
    }

    // Отслеживание скролла для скрытия поиска (только на больших экранах)
    if (contentArea && searchContainer && window.innerWidth > 768) {
        let lastScrollTop = 0;

        contentArea.addEventListener('scroll', () => {
            const currentScroll = contentArea.scrollTop;

            // Если скролл вниз больше чем на 100px, скрываем поиск
            if (currentScroll > 100 && currentScroll > lastScrollTop) {
                searchContainer.classList.add('hidden');
            } else {
                searchContainer.classList.remove('hidden');
            }

            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        });
    }
}

// Глобальный поиск по всем данным
function performSearch(query) {
    const results = [];

    // Ищем по всем категориям и файлам
    for (const [category, files] of Object.entries(allData)) {
        for (const [file, data] of Object.entries(files)) {
            if (!data) continue;

            // Извлекаем элементы
            const items = extractItems(data);
            if (!items) continue;

            // Ищем совпадения
            items.forEach(item => {
                const matchScore = calculateMatchScore(item, query);
                if (matchScore > 0) {
                    results.push({
                        item,
                        category,
                        file,
                        score: matchScore
                    });
                }
            });
        }
    }

    // Сортируем результаты по релевантности
    results.sort((a, b) => b.score - a.score);

    // Отображаем результаты
    displaySearchResults(results);
}

// Расчет релевантности результата
function calculateMatchScore(item, query) {
    let score = 0;

    // Проверяем название (самый высокий приоритет)
    if (item.name) {
        const name = item.name.toLowerCase();
        if (name === query) score += 1000;
        else if (name.includes(query)) score += 500;
        else if (levenshteinDistance(name, query) <= 2) score += 100;
    }

    // Проверяем full_name
    if (item.full_name) {
        const fullName = item.full_name.toLowerCase();
        if (fullName.includes(query)) score += 300;
    }

    // Проверяем описание
    if (item.description) {
        const desc = Array.isArray(item.description)
            ? item.description.join(' ').toLowerCase()
            : item.description.toLowerCase();
        if (desc.includes(query)) score += 50;
    }

    // Проверяем другие текстовые поля
    for (const key in item) {
        if (typeof item[key] === 'string') {
            const value = item[key].toLowerCase();
            if (value.includes(query)) score += 10;
        }
    }

    return score;
}

// Простое расстояние Левенштейна для поиска похожих слов
function levenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[0][i] = i;
    for (let i = 0; i <= len2; i++) matrix[i][0] = i;

    for (let i = 1; i <= len2; i++) {
        for (let j = 1; j <= len1; j++) {
            if (str2[i - 1] === str1[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[len2][len1];
}

// Отображение результатов поиска
function displaySearchResults(results) {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '';

    if (results.length === 0) {
        contentArea.innerHTML = '<p class="placeholder">Ничего не найдено</p>';
        return;
    }

    // Сортируем результаты по стоимости (от большего к меньшему)
    results.sort((a, b) => {
        const costA = extractCost(a.item);
        const costB = extractCost(b.item);
        return costB - costA;
    });

    // Показываем количество результатов
    const resultsCount = document.createElement('div');
    resultsCount.style.cssText = 'margin-bottom: 20px; font-size: 14px; color: #92FCEB; text-transform: uppercase; letter-spacing: 1px;';
    resultsCount.textContent = `Найдено результатов: ${results.length}`;
    contentArea.appendChild(resultsCount);

    // Выводим карточки результатов
    results.forEach(result => {
        const card = createCard(result.item);
        contentArea.appendChild(card);
    });
}

// Переключение избранного
function toggleFavorite(btn, itemName) {
    if (favorites.includes(itemName)) {
        favorites = favorites.filter(name => name !== itemName);
        btn.classList.remove('active');
    } else {
        favorites.push(itemName);
        btn.classList.add('active');
    }
    savePersistence();

    // Если мы находимся во вкладке избранного, перерисовываем
    if (currentSelection && currentSelection.category === 'favorites') {
        renderFavorites();
    }
}

// Переключение мастерства
function toggleMastery(btn, itemName) {
    // Находим карточку
    const card = btn.closest('.card');

    if (mastery.includes(itemName)) {
        mastery = mastery.filter(name => name !== itemName);
        btn.classList.remove('active');
        if (card) card.classList.remove('mastery-active');
    } else {
        mastery.push(itemName);
        btn.classList.add('active');
        if (card) card.classList.add('mastery-active');
    }
    savePersistence();

    // Если мы находимся во вкладке мастерства, перерисовываем
    if (currentSelection && currentSelection.category === 'mastery') {
        renderMastery();
    }
}

// Получение объекта предмета по имени (helper)
function findItemByName(name) {
    for (const category in allData) {
        for (const file in allData[category]) {
            const data = allData[category][file];
            const items = extractItems(data);
            const found = items.find(i => i.name === name);
            if (found) return found;
        }
    }
    return null;
}

// Рендеринг вкладки Избранное
function renderFavorites() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '';

    const title = document.createElement('h2');
    title.style.cssText = 'color: #FF4444; margin-bottom: 20px; font-family: "Orbitron", sans-serif;';
    title.textContent = `ИЗБРАННОЕ (${favorites.length})`;
    contentArea.appendChild(title);

    if (favorites.length === 0) {
        const p = document.createElement('p');
        p.className = 'placeholder';
        p.textContent = 'Список избранного пуст';
        contentArea.appendChild(p);
        return;
    }

    // Собираем предметы
    const items = favorites.map(name => findItemByName(name)).filter(i => i !== null);

    items.forEach(item => {
        contentArea.appendChild(createCard(item));
    });
}

// Рендеринг вкладки Мастерство
function renderMastery() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '';

    const title = document.createElement('h2');
    title.style.cssText = 'color: #FFD700; margin-bottom: 20px; font-family: "Orbitron", sans-serif;';
    title.textContent = `МАСТЕРСТВО (${mastery.length})`;
    contentArea.appendChild(title);

    if (mastery.length === 0) {
        const p = document.createElement('p');
        p.className = 'placeholder';
        p.textContent = 'Список мастерства пуст';
        contentArea.appendChild(p);
        return;
    }

    // Собираем предметы
    const items = mastery.map(name => findItemByName(name)).filter(i => i !== null);

    items.forEach(item => {
        contentArea.appendChild(createCard(item));
    });
}
