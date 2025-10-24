let isFirstRequest = true;

const apiUrl = "https://reqres.in/api/unknown";
const content = document.querySelector("#content");
const preloader = document.querySelector("#preloader");
const retryButton = document.querySelector("#retry-button");

const getRandomQuery = () => {
    return "";
};
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const fetchData = async () => {
    try {
        preloader.style.display = "block";
        content.textContent = "";
        await sleep(2000);

        const response = await fetch(apiUrl + getRandomQuery());
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();

        preloader.style.display = "none";

        const filteredData = filterData(data.data);

        renderData(filteredData);
    } catch (error) {
        preloader.style.display = "none";
        const errorDiv = document.createElement("div");
        errorDiv.classList.add("error");
        errorDiv.textContent = `Что-то пошло не так: ${error.message}`;
        content.appendChild(errorDiv);
    }
};

const filterData = (data) => {
    const random = Math.random();
    return random > 0.5 ? data.filter(item => item.id > 3) : data.filter(item => item.id <= 3);
};

const renderData = (data) => {
    content.textContent = "";

    if (!data || data.length === 0) {
        const noDataMessage = document.createElement("div");
        noDataMessage.textContent = "Данных нет";
        content.appendChild(noDataMessage);
        return;
    }

    data.forEach(item => {
        const container = document.createElement("div");
        container.classList.add("color-info");

        const title = document.createElement("h3");
        title.textContent = item.name;

        const year = document.createElement("p");
        year.appendChild(createBoldLabel("Год:"));
        year.append(` ${item.year}`);

        const color = document.createElement("p");
        color.appendChild(createBoldLabel("Цвет:"));
        const colorSpan = document.createElement("span");
        colorSpan.style.backgroundColor = item.color;
        colorSpan.style.color = "white";
        colorSpan.style.padding = "0 5px";
        colorSpan.textContent = item.color;
        color.appendChild(document.createTextNode(" "));
        color.appendChild(colorSpan);

        const pantone = document.createElement("p");
        
        pantone.appendChild(createBoldLabel("Pantone:"));
        pantone.append(` ${item.pantone_value}`);

        container.appendChild(title);
        container.appendChild(year);
        container.appendChild(color);
        container.appendChild(pantone);

        content.appendChild(container);
    });
};

const createBoldLabel = (text) => {
    const boldLabel = document.createElement("b");
    boldLabel.textContent = text;
    return boldLabel;
};

retryButton.addEventListener("click", fetchData);

fetchData();
