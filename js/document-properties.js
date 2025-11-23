// Функція для виведення всіх властивостей об'єкта document
function runDocumentProperties() {
    const outputTextarea = document.getElementById('outputTextarea');
    let output = '';

    // Отримуємо всі власні властивості об'єкта document
    const properties = Object.getOwnPropertyNames(document);

    output += '=== ВЛАСТИВОСТІ ОБ\'ЄКТА document ===\n\n';
    output += `Кількість власних властивостей: ${properties.length}\n\n`;

    // Виводимо основні властивості з їхніми значеннями
    const mainProperties = [
        'title', 'URL', 'documentURI', 'domain', 'origin', 'cookie', 'charset', 'characterSet',
        'contentType', 'doctype', 'documentElement', 'body', 'head', 'location', 'referrer',
        'lastModified', 'readyState', 'hidden', 'visibilityState', 'activeElement', 'fullscreenElement'
    ];

    output += '--- ОСНОВНІ ВЛАСТИВОСТІ ---\n';
    mainProperties.forEach(prop => {
        try {
            const val = document[prop];
            const str = (val === null) ? 'null' : (typeof val === 'object' ? '[Object]' : String(val));
            output += `${prop}: ${str}\n`;
        } catch (e) {
            output += `${prop}: [недоступно]\n`;
        }
    });

    output += '\n--- ВСІ ВЛАСТИВОСТІ (список) ---\n';
    properties.sort().forEach((prop, i) => {
        output += `${i+1}. ${prop}\n`;
    });

    output += '\n--- ДЕЯКІ МЕТОДИ DOCUMENT ---\n';
    const methods = [
        'addEventListener','removeEventListener','getElementById','getElementsByClassName','getElementsByTagName',
        'querySelector','querySelectorAll','createElement','createTextNode','appendChild','removeChild','insertBefore',
        'replaceChild','cloneNode','write','writeln','open','close','getSelection','elementFromPoint','elementsFromPoint'
    ];
    output += methods.join('\n') + '\n';

    output += '\n--- ІНФОРМАЦІЯ ПРО БРАУЗЕР ---\n';
    try {
        output += `User Agent: ${navigator.userAgent}\n`;
        output += `Language: ${navigator.language}\n`;
        output += `Platform: ${navigator.platform}\n`;
        output += `Online: ${navigator.onLine ? 'Yes' : 'No'}\n`;
        output += `Cookies enabled: ${navigator.cookieEnabled}\n`;
    } catch (e) {
        output += 'Navigator info: [недоступно]\n';
    }

    // Встановлюємо в textarea (якщо є)
    if (outputTextarea) {
        outputTextarea.value = output;
        // Здвиг індикатора на початок
        outputTextarea.scrollTop = 0;
    }

    // Вивести в консоль та alert
    console.log('Document properties (summary):', {count: properties.length});
    console.log(document);
    alert(`Готово. Виведено ${properties.length} властивостей. Дивіться поле на сторінці або консоль.`);
}

// Підключаємо кнопку при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('runTaskButton');
    if (btn) btn.addEventListener('click', runDocumentProperties);
});
