// Обробка подій для текстових елементів (H1-H6, B, I, STRONG, EM тощо)

// Функція для відображення повідомлень про подію
function showTextElementMessage(message) {
    let messageBox = document.getElementById('text-message-box');
    
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.id = 'text-message-box';
        messageBox.className = 'text-message-box';
        document.body.appendChild(messageBox);
    }
    
    const messageItem = document.createElement('div');
    messageItem.className = 'text-message-item';
    messageItem.textContent = message + ' [' + new Date().toLocaleTimeString('uk-UA') + ']';
    messageBox.appendChild(messageItem);
    
    // Автоматичне видалення старих повідомлень (максимум 4)
    if (messageBox.children.length > 4) {
        messageBox.removeChild(messageBox.firstChild);
    }
    
    console.log(message);
}

// Функція для додання обробників подій до текстових елементів
function setupTextElementEvents() {
    // Селектори для всіх текстових елементів
    const selectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'b', 'i', 'strong', 'em', 'mark', 'small', 'big', 'code', 'var', 'abbr', 'strike'];
    
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector + ':not([data-events-attached])');
        
        elements.forEach((element, index) => {
            // Позначаємо, що обробники вже додані
            element.setAttribute('data-events-attached', 'true');
            
            // onclick - клік на елементі
            element.addEventListener('click', function(e) {
                e.stopPropagation();
                showTextElementMessage(`onClick: ${selector.toUpperCase()} - клік`);
                this.style.backgroundColor = '#FFD700';
                this.style.color = '#002057';
                this.style.padding = '5px';
                this.style.borderRadius = '3px';
            });
            
            // onmouseover - мишка над елементом
            element.addEventListener('mouseover', function(e) {
                e.stopPropagation();
                showTextElementMessage(`onMouseOver: ${selector.toUpperCase()} - мишка над`);
                this.style.textDecoration = 'underline wavy #00FFFF';
                this.style.fontWeight = 'bold';
                this.style.cursor = 'pointer';
            });
            
            // onmouseout - мишка покидає елемент
            element.addEventListener('mouseout', function(e) {
                e.stopPropagation();
                showTextElementMessage(`onMouseOut: ${selector.toUpperCase()} - мишка покидає`);
                this.style.textDecoration = '';
                this.style.fontWeight = '';
                this.style.backgroundColor = '';
                this.style.color = '';
                this.style.padding = '';
            });
            
            // ondblclick - подвійний клік
            element.addEventListener('dblclick', function(e) {
                e.stopPropagation();
                showTextElementMessage(`onDblClick: ${selector.toUpperCase()} - подвійний клік`);
                this.style.backgroundColor = '';
                this.style.color = '';
                this.style.padding = '';
                this.style.textDecoration = '';
                this.style.fontWeight = '';
            });
        });
    });
}

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    showTextElementMessage('Ініціалізація обробки подій');
    setupTextElementEvents();
});
