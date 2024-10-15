const baseUrl = './data/';
const referenceFile = 'reference.json';
const data3File = 'data3.json';

// Function to split name and render table
function processDataAndRender(data, tableId) {
    const tbody = document.getElementById(tableId);
    tbody.innerHTML = '';
    data.forEach(({ name, id }) => {
        const [firstName, lastName] = name.split(' ');
        const row = `<tr><td>${firstName}</td><td>${lastName}</td><td>${id}</td></tr>`;
        tbody.innerHTML += row;
    });
}

// Function to fetch data synchronously
function getDataSync(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    if (xhr.status !== 200) throw new Error(`Failed to fetch ${url}`);
    return JSON.parse(xhr.responseText);
}

// Function to fetch data asynchronously with callback
function getDataAsync(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) callback(JSON.parse(xhr.responseText));
        else if (xhr.readyState === 4) console.error(`Failed to fetch ${url}`);
    };
    xhr.send();
}

// Function to fetch data using promises
function fetchData(url) {
    return fetch(url).then(response => {
        if (!response.ok) throw new Error('Network error');
        return response.json();
    });
}

// Data loader for synchronous XMLHttpRequest
function loadDataSync() {
    try {
        let combinedData = [];
        const referenceData = getDataSync(`${baseUrl}${referenceFile}`);
        const data1 = getDataSync(`${baseUrl}${referenceData.data_location}`);
        const data2 = getDataSync(`${baseUrl}${data1.data_location}`);
        const data3 = getDataSync(`${baseUrl}${data3File}`);
        combinedData = combinedData.concat(data1.data, data2.data, data3.data);
        processDataAndRender(combinedData, 'sync-data');
    } catch (error) {
        console.error('Synchronous error:', error);
    }
}

// Data loader for asynchronous XMLHttpRequest with callbacks
function loadDataAsync() {
    let combinedData = [];
    getDataAsync(`${baseUrl}${referenceFile}`, referenceData => {
        getDataAsync(`${baseUrl}${referenceData.data_location}`, data1 => {
            combinedData = combinedData.concat(data1.data);
            getDataAsync(`${baseUrl}${data1.data_location}`, data2 => {
                combinedData = combinedData.concat(data2.data);
                getDataAsync(`${baseUrl}${data3File}`, data3 => {
                    combinedData = combinedData.concat(data3.data);
                    processDataAndRender(combinedData, 'async-data');
                });
            });
        });
    });
}

// Data loader for fetch with promises
function loadDataFetch() {
    let combinedData = [];
    fetchData(`${baseUrl}${referenceFile}`)
        .then(referenceData => fetchData(`${baseUrl}${referenceData.data_location}`))
        .then(data1 => {
            combinedData = combinedData.concat(data1.data);
            return fetchData(`${baseUrl}${data1.data_location}`);
        })
        .then(data2 => {
            combinedData = combinedData.concat(data2.data);
            return fetchData(`${baseUrl}${data3File}`);
        })
        .then(data3 => {
            combinedData = combinedData.concat(data3.data);
            processDataAndRender(combinedData, 'fetch-data');
        })
        .catch(error => console.error('Fetch error:', error));
}

// Event listeners fr buttons
document.getElementById('sync-btn').addEventListener('click', loadDataSync);
document.getElementById('async-btn').addEventListener('click', loadDataAsync);
document.getElementById('fetch-btn').addEventListener('click', loadDataFetch);
