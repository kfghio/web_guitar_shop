document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('scheduleForm');
    const output = document.getElementById('scheduleOutput');

    const daysOfWeek = {
        ru: {
            5: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'],
            6: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
            lessonPlaceholder: 'Занятие'
        },
        en: {
            5: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            6: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            lessonPlaceholder: 'Lesson'
        }
    };

    function saveSchedule(schedule) {
        localStorage.setItem('schedule', JSON.stringify(schedule));
    }

    function loadSchedule() {
        return JSON.parse(localStorage.getItem('schedule')) || null;
    }

    function generateSchedule(weekType, maxClasses, language) {
        const days = daysOfWeek[language][weekType];
        const schedule = days.map(() => Array(maxClasses).fill(''));

        saveSchedule(schedule);
        renderSchedule(schedule, days, maxClasses, language);
    }

    function renderSchedule(schedule, days, maxClasses, language) {
        output.innerHTML = '';

        const table = document.createElement('table');

        table.classList.add('schedule-table');

        const headerRow = table.insertRow();
        const headerCell = document.createElement('th');

        headerCell.colSpan = maxClasses + 1;
        headerCell.textContent = language === 'ru' ? 'Расписание занятий' : 'Class Schedule';
        headerRow.appendChild(headerCell);

        days.forEach((day, dayIndex) => {
            const row = table.insertRow();
            const dayCell = row.insertCell();
            dayCell.textContent = day;

            for (let lessonIndex = 0; lessonIndex < maxClasses; lessonIndex++) {
                const lessonCell = row.insertCell();
                const input = document.createElement('input');
                input.type = 'text';
                input.value = schedule[dayIndex][lessonIndex];
                input.placeholder = `${daysOfWeek[language].lessonPlaceholder} ${lessonIndex + 1}`;

                input.addEventListener('input', () => {
                    schedule[dayIndex][lessonIndex] = input.value;
                    saveSchedule(schedule);
                });

                lessonCell.appendChild(input);
            }
        });

        output.appendChild(table);
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const weekType = form.weekType.value;
        const maxClasses = parseInt(form.maxClasses.value, 8);
        const language = form.language.value;

        generateSchedule(weekType, maxClasses, language);
    });

    const savedSchedule = loadSchedule();
    if (savedSchedule) {
        const weekType = savedSchedule.length === 5 ? '5' : '6';
        const maxClasses = savedSchedule[0].length;
        const language = form.language.value;
        const days = daysOfWeek[language][weekType];

        renderSchedule(savedSchedule, days, maxClasses, language);
    }
});
