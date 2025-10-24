document.addEventListener("DOMContentLoaded", function () {
    const $frame = $('.frame');
    const $slidee = $frame.find('.slidee');



    const sly = new Sly($frame, {
        horizontal: 1,          // Горизонтальная прокрутка
        itemNav: 'basic',       // Навигация по элементам
        activateMiddle: 1,      // Центрирование активного элемента
        mouseDragging: 1,       // Перетаскивание мышью
        scrollBy: 1,            // Прокрутка на один элемент
        speed: 600,             // Скорость анимации (мс)
        smart: 1,               // Смарт-мод остановки
        touchDragging: 1,       // Перетаскивание на сенсорных устройствах
        releaseSwing: 1,        // Плавный откат при отпускании

    });

    sly.init();
    
    $('.prev').on('click', function () {
        sly.prev();// Прокрутка к предыдущему элементу
    });

    $('.next').on('click', function () {
        sly.next();// Прокрутка к следующему элементу
    });

    $slidee.find('li').on('click', function () {
        sly.activate(this); // Центрирование 
    });

    sly.on('change', function () {
        sly.reload(); // Перезагрузка Sly для восстановления сенсорного управления
    });
});
