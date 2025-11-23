// Обробка подій для тегу BODY

// Функція для відображення повідомлень
function showMessage(message) {
    let messageBox = document.getElementById('message-box');
    
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.id = 'message-box';
        document.body.insertBefore(messageBox, document.body.firstChild);
    }
    
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item';
    messageItem.textContent = message + ' [' + new Date().toLocaleTimeString('uk-UA') + ']';
    messageBox.appendChild(messageItem);
    
    // Автоматичне видалення старих повідомлень (максимум 10)
    if (messageBox.children.length > 10) {
        messageBox.removeChild(messageBox.firstChild);
    }
    
    // Логування в консоль
    console.log(message);
}

// Подія onload - сторінка завантажена
window.addEventListener('load', function() {
    showMessage('Подія: onload - Сторінка завантажена');
});

// Подія onunload - закриття сторінки
window.addEventListener('unload', function() {
    showMessage('Подія: onunload - Закриття сторінки');
});

// Подія onbeforeprint - перед друком
window.addEventListener('beforeprint', function() {
    showMessage('Подія: onbeforeprint - Перед друком');
});

// Подія onafterprint - після друку
window.addEventListener('afterprint', function() {
    showMessage('Подія: onafterprint - Після друку');
});

// Подія onfocus - вікно отримало фокус
window.addEventListener('focus', function() {
    showMessage('Подія: onfocus - Вікно отримало фокус');
});

// Подія onblur - вікно втратило фокус
window.addEventListener('blur', function() {
    showMessage('Подія: onblur - Вікно втратило фокус');
});

// Подія onerror - помилка завантаження
window.addEventListener('error', function(event) {
    showMessage('Подія: onerror - Помилка: ' + event.message);
});

// Додаткові корисні події
window.addEventListener('beforeunload', function() {
    showMessage('Подія: onbeforeunload - Перед закриттям');
});

window.addEventListener('resize', function() {
    showMessage('Подія: onresize - Змінено розмір вікна');
});

window.addEventListener('scroll', function() {
    showMessage('Подія: onscroll - Прокрутка сторінки');
});

window.addEventListener('online', function() {
    showMessage('Подія: ononline - З\'єднання встановлено');
});

window.addEventListener('offline', function() {
    showMessage('Подія: onoffline - З\'єднання втрачено');
});
