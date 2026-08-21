// Counter for visits
let counter = 0;

// DOM elements
const counterElement = document.getElementById('counter');
const statusElement = document.getElementById('status');
const fetchBtn = document.getElementById('fetchBtn');
const clearBtn = document.getElementById('clearBtn');
const resultElement = document.getElementById('result');
const messagesElement = document.getElementById('messages');

// Initialize counter from localStorage
if (localStorage.getItem('visitCounter')) {
    counter = parseInt(localStorage.getItem('visitCounter'));
    counterElement.textContent = counter;
}

// Increment counter
function incrementCounter() {
    counter++;
    counterElement.textContent = counter;
    localStorage.setItem('visitCounter', counter);
}

// Add message
function addMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messagesElement.appendChild(messageDiv);
    messagesElement.scrollTop = messagesElement.scrollHeight;
}

// Fetch data from Cloudflare Pages Function
async function fetchData() {
    try {
        statusElement.textContent = 'טוען...';
        statusElement.style.color = '#ff9800';
        
        addMessage('מבצש בקשה ל-Cloudflare Pages Function...', 'info');
        
        // Try to fetch from Pages Function
        const response = await fetch('/api/data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            resultElement.textContent = JSON.stringify(data, null, 2);
            addMessage('הנתונים התקבלו בהצלחה!', 'success');
            statusElement.textContent = 'מחובר';
            statusElement.style.color = '#4caf50';
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        // Fallback to local mock data if Pages Function not available
        console.log('Pages Function not available, using mock data');
        const mockData = {
            message: 'מידע מדוגמה (ללא Cloudflare Pages Function)',
            timestamp: new Date().toISOString(),
            counter: counter,
            status: 'local',
            error: error.message
        };
        
        resultElement.textContent = JSON.stringify(mockData, null, 2);
        addMessage('שימוש במידע מקומי (Cloudflare Pages Function לא זמין)', 'info');
        statusElement.textContent = 'מקומי';
        statusElement.style.color = '#ff9800';
    }
}

// Clear result
function clearResult() {
    resultElement.textContent = '';
    messagesElement.innerHTML = '';
    addMessage('התוצאות נוקו', 'info');
}

// Event listeners
fetchBtn.addEventListener('click', fetchData);
clearBtn.addEventListener('click', clearResult);

// Initial setup
incrementCounter();
addMessage('האפליקציה נטענה בהצלחה!', 'success');

// Check if we're on Cloudflare Pages
if (window.location.hostname.includes('pages.dev') || 
    window.location.hostname.includes('cloudflarepages.com') ||
    window.location.hostname.includes('workers.dev')) {
    addMessage('פועל על Cloudflare Pages!', 'success');
    statusElement.textContent = 'Cloudflare Pages';
    statusElement.style.color = '#667eea';
} else {
    addMessage('פועל במצב מקומי', 'info');
    statusElement.textContent = 'מקומי';
}