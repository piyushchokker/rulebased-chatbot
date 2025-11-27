document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // State Machine Variables
    let chatState = 'IDLE'; // IDLE, ASKING_NAME, ASKING_PHONE, ASKING_CLASS, ASKING_ADDRESS
    let currentLead = { name: '', phone: '', class: '', address: '' };

    // Chatbot Rules & Options
    const botOptions = {
        'main': [
            { text: "Admissions", value: "admission" },
            { text: "Courses", value: "courses" },
            { text: "Fees", value: "fees" },
            { text: "Contact", value: "contact" }
        ],
        'callback': [
            { text: "Yes, please call me", value: "yes" },
            { text: "No, thanks", value: "no" }
        ]
    };

    const rules = {
        'admission': "Admissions for the upcoming academic year are open! You can apply online through our website or visit the school office.",
        'courses': "We offer a wide range of curriculums including Science, Commerce, and Arts streams for senior secondary students.",
        'fees': "The fee structure varies by grade. For detailed fee information, please check the 'Fees' section on our website or contact the accounts department.",
        'contact': "You can reach us at contact@westacademy.edu or call us at +1 (555) 123-4567.",
        'default': "I'm sorry, I didn't quite catch that. Please select an option below or ask a specific question."
    };

    function addOptions(options) {
        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('options-container');
        optionsDiv.style.display = 'flex';
        optionsDiv.style.gap = '8px';
        optionsDiv.style.flexWrap = 'wrap';
        optionsDiv.style.marginTop = '8px';

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt.text;
            btn.classList.add('option-btn');
            btn.style.padding = '8px 12px';
            btn.style.border = '1px solid var(--primary-color)';
            btn.style.borderRadius = '20px';
            btn.style.background = 'white';
            btn.style.color = 'var(--primary-color)';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '0.9rem';
            btn.style.transition = 'all 0.2s';

            btn.onmouseover = () => {
                btn.style.background = 'var(--primary-color)';
                btn.style.color = 'white';
            };
            btn.onmouseout = () => {
                btn.style.background = 'white';
                btn.style.color = 'var(--primary-color)';
            };

            btn.onclick = () => {
                handleUserMessage(opt.value);
            };
            optionsDiv.appendChild(btn);
        });

        // Append to the last message (bot message)
        const lastMsg = chatWindow.lastElementChild;
        if (lastMsg && lastMsg.classList.contains('bot-message')) {
            lastMsg.querySelector('.message-content').appendChild(optionsDiv);
        }
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function processInput(input) {
        const cleanInput = input.toLowerCase().trim();

        // State Machine
        if (chatState === 'IDLE') {
            // Check for keywords
            for (const key in rules) {
                if (cleanInput.includes(key)) {
                    // If valid topic found, give info then ask for callback
                    setTimeout(() => askForCallback(), 1000);
                    return rules[key];
                }
            }
            // Default response
            setTimeout(() => addOptions(botOptions['main']), 600);
            return rules['default'];

        } else if (chatState === 'ASKING_CALLBACK') {
            if (cleanInput.includes('yes') || cleanInput.includes('sure') || cleanInput.includes('ok')) {
                chatState = 'ASKING_NAME';
                return "Great! What is your full name?";
            } else {
                chatState = 'IDLE';
                setTimeout(() => addOptions(botOptions['main']), 1000);
                return "No problem. Is there anything else I can help you with?";
            }

        } else if (chatState === 'ASKING_NAME') {
            currentLead.name = input; // Keep original casing
            chatState = 'ASKING_PHONE';
            return `Thanks, ${currentLead.name}. What is your phone number?`;

        } else if (chatState === 'ASKING_PHONE') {
            currentLead.phone = input;
            chatState = 'ASKING_CLASS';
            return "Which class/grade are you looking for admission in?";

        } else if (chatState === 'ASKING_CLASS') {
            currentLead.class = input;
            chatState = 'ASKING_ADDRESS';
            return "Got it. Finally, what is your address?";

        } else if (chatState === 'ASKING_ADDRESS') {
            currentLead.address = input;

            // Send to Server
            saveLeadToServer(currentLead);

            // Reset
            currentLead = { name: '', phone: '', class: '', address: '' };
            chatState = 'IDLE';

            setTimeout(() => addOptions(botOptions['main']), 1000);
            return "Thank you! We have received your details and will contact you shortly. Can I help you with anything else?";
        }
    }

    function askForCallback() {
        addMessage("Would you like our admission counselor to call you back?", 'bot');
        chatState = 'ASKING_CALLBACK';
        addOptions(botOptions['callback']);
    }

    function saveLeadToServer(leadData) {
        fetch('/api/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leadData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Lead saved:', data);
            })
            .catch((error) => {
                console.error('Error saving lead:', error);
                addMessage("Note: There was an issue saving your details to the server. Please try again later.", 'bot');
            });
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.textContent = text;

        const timeDiv = document.createElement('div');
        timeDiv.classList.add('message-time');
        const now = new Date();
        timeDiv.textContent = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);

        chatWindow.appendChild(messageDiv);

        // Scroll to bottom
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function handleUserMessage(textInput = null) {
        const text = textInput || userInput.value.trim();
        if (text === "") return;

        // Add user message
        addMessage(text, 'user');
        if (!textInput) userInput.value = '';

        // Simulate bot thinking delay
        setTimeout(() => {
            const botResponse = processInput(text);
            addMessage(botResponse, 'bot');
        }, 600);
    }

    // Initial Options
    setTimeout(() => addOptions(botOptions['main']), 1000);

    // Event Listeners
    sendBtn.addEventListener('click', () => handleUserMessage());

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });
});
