const baseUrl = './data/';
const referenceFile = 'reference.json';
const data3File = 'data3.json';

// Function to split name
function processData(data) {
    return data.map(item => {
        const [firstName, lastName] = item.name.split(' ');
        return { firstName, lastName, id: item.id };
    });
}

// Function to render table
function renderTable(data, tableId) {
    const tbody = document.getElementById(tableId);
    tbody.innerHTML = '';  // Clear previous table content
    data.forEach(student => {
        const row = document.createElement('tr');
        const firstNameCell = document.createElement('td');
        const lastNameCell = document.createElement('td');
        const idCell = document.createElement('td');

        firstNameCell.textContent = student.firstName;
        lastNameCell.textContent = student.lastName;
        idCell.textContent = student.id;

        row.appendChild(firstNameCell);
        row.appendChild(lastNameCell);
        row.appendChild(idCell);
        tbody.appendChild(row);
    });
}

// 1. Synchronous XMLHttpRequest
function loadDataSync() {
    try {
        let combinedData = [];

        // Fetch reference file
        const referenceData = getDataSync(`${baseUrl}${referenceFile}`);

        // Fetch data1.json (or its random equivalent)
        const data1 = getDataSync(`${baseUrl}${referenceData.data_location}`);
        combinedData = combinedData.concat(processData(data1.data));

        // Fetch data2.json (determined dynamically from data1)
        const data2 = getDataSync(`${baseUrl}${data1.data_location}`);
        combinedData = combinedData.concat(processData(data2.data));

        // Fetch data3.json (predefined)
        const data3 = getDataSync(`${baseUrl}${data3File}`);
        combinedData = combinedData.concat(processData(data3.data));

        // Render the table
        renderTable(combinedData, 'sync-data');
    } catch (error) {
        console.error('Synchronous error:', error);
    }
}

// Helper function for synchronous XMLHttpRequest
function getDataSync(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);  // synchronous
    xhr.send();
    if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
    } else {
        throw new Error(`Failed to fetch ${url}`);
    }
}

// 2. Asynchronous XMLHttpRequest with callbacks
function loadDataAsync() {
    let combinedData = [];

    getDataAsync(`${baseUrl}${referenceFile}`, (referenceData) => {
        // Fetch data1.json asynchronously
        getDataAsync(`${baseUrl}${referenceData.data_location}`, (data1) => {
            combinedData = combinedData.concat(processData(data1.data));

            // Fetch data2.json asynchronously
            getDataAsync(`${baseUrl}${data1.data_location}`, (data2) => {
                combinedData = combinedData.concat(processData(data2.data));

                // Fetch data3.json asynchronously
                getDataAsync(`${baseUrl}${data3File}`, (data3) => {
                    combinedData = combinedData.concat(processData(data3.data));

                    // Render the table
                    renderTable(combinedData, 'async-data');
                });
            });
        });
    });
}

// Helper function for asynchronous XMLHttpRequest
function getDataAsync(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);  // asynchronous
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            } else {
                console.error(`Failed to fetch ${url}`);
            }
        }
    };
    xhr.send();
}

// 3. Fetch with promises
function loadDataFetch() {
    let combinedData = [];

    fetch(`${baseUrl}${referenceFile}`)
        .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.json();
        })
        .then(referenceData => {
            // Fetch data1.json
            return fetch(`${baseUrl}${referenceData.data_location}`);
        })
        .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.json();
        })
        .then(data1 => {
            combinedData = combinedData.concat(processData(data1.data));

            // Fetch data2.json
            return fetch(`${baseUrl}${data1.data_location}`);
        })
        .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.json();
        })
        .then(data2 => {
            combinedData = combinedData.concat(processData(data2.data));

            // Fetch data3.json
            return fetch(`${baseUrl}${data3File}`);
        })
        .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.json();
        })
        .then(data3 => {
            combinedData = combinedData.concat(processData(data3.data));

            // Render the table
            renderTable(combinedData, 'fetch-data');
        })
        .catch(error => console.error('Fetch error:', error));
}

// Add event listeners to buttons
document.getElementById('sync-btn').addEventListener('click', loadDataSync);
document.getElementById('async-btn').addEventListener('click', loadDataAsync);
document.getElementById('fetch-btn').addEventListener('click', loadDataFetch);
