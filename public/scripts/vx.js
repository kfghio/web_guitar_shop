document.addEventListener("DOMContentLoaded", function () {
    const questions = [
        { question: "Сколько струн у стандартной гитары?", options: ["4", "6", "8", "12"], correct: 1 },
        { question: "Какая из этих гитар электрическая?", options: ["Stratocaster", "Classical", "Acoustic", "Flamenco"], correct: 0 },
        { question: "Как называется место, где крепятся струны?", options: ["Гриф", "Бридж", "Лады", "Порожек"], correct: 1 },
        { question: "Какой аккорд часто играют первым при обучении?", options: ["C", "G", "D", "A"], correct: 0 },
        { question: "Кто из этих музыкантов известен виртуозной игрой на гитаре?", options: ["Паганини", "Хендрикс", "Моцарт", "Бах"], correct: 1 },
        { question: "Какой материал часто используется для медиаторов?", options: ["Дерево", "Металл", "Пластик", "Камень"], correct: 2 },
        { question: "Какой стиль музыки обычно исполняется на классической гитаре?", options: ["Рок", "Фламенко", "Джаз", "Метал"], correct: 1 },
        { question: "Какая часть гитары называется 'гриф'?", options: ["Корпус", "Шея", "Лады", "Головка"], correct: 1 },
        { question: "Что определяет тональность гитары?", options: ["Длина струн", "Настройка", "Тип дерева", "Форма корпуса"], correct: 1 },
        { question: "Какая из этих гитар считается акустической?", options: ["Les Paul", "Telecaster", "Dreadnought", "SG"], correct: 2 },
    ];

    const startQuizButton = document.querySelector('.start-quiz');
    let currentQuestion = 0; 
    let score = 0;          

    /**
     * Функция для отображения текущего вопроса с помощью vex
     */
    function askQuestion() {
        if (currentQuestion < questions.length) {
            const q = questions[currentQuestion];

            
            vex.dialog.buttons.YES.text = "Ответить"; // текст кнопки(YES) "Ответить" в vex

            // Открытие диалогового окна для отображения вопроса
            vex.dialog.open({
                message: q.question, 
                input: q.options.map((opt, idx) => `
                    <label>
                        <input type="radio" name="answer" value="${idx}" required> ${opt}
                    </label>
                `).join("<br>"), // Создание радиокнопок для выбора ответа
                callback: (data) => {
                    if (data) {
                        const userAnswer = parseInt(data.answer);
                        if (userAnswer === q.correct) score++; 
                        currentQuestion++;
                        askQuestion(); 
                    }
                }
            });
        } else {
            showResult(); // Показ результата после последнего вопроса
        }
    }

    /**
     * Функция для отображения результата теста
     */
    function showResult() {
        
        vex.dialog.buttons.YES.text = "Круто"; // Изменяем  "Ответить" на "Круто"

        vex.dialog.open({
            message: `Тест завершён! Ваш результат: ${score} из ${questions.length}`, // Результат теста
            callback: () => {
                console.log("Тест завершён");
            }
        });
    }

    /**
     * Начало теста при нажатии на кнопку
     */
    startQuizButton.addEventListener('click', function () {
        currentQuestion = 0; 
        score = 0;           
        askQuestion();       // Запуск первого вопроса
    });
});
