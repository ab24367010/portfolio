document.addEventListener('DOMContentLoaded', () => {
    // DOM элементүүдийг сонгох
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotToggleBtn = document.getElementById('chatbot-toggle');
    const chatbotOpenBtn = document.getElementById('chatbot-open-btn');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotOptions = document.getElementById('chatbot-options');
    const chatbotHeader = document.querySelector('.chatbot-header');
    const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');

    // Hamburger menu-ний event listener
    if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }

    let chatbotData = {}; // JSON-оос ачаалсан мэдээлэл
    let currentStep = 0;

    // Мессеж нэмэх функц
    function displayMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Товчлуурууд үүсгэх функц
    function displayOptions(options) {
        chatbotOptions.innerHTML = ''; // Өмнөх сонголтуудыг арилгах
        options.forEach(option => {
            const btn = document.createElement('button');
            btn.textContent = option.text;
            btn.className = 'bg-gray-700 hover:bg-gray-600 text-white rounded px-3 py-2 cursor-pointer w-full text-left transition';
            btn.addEventListener('click', () => handleOptionClick(option.id));
            chatbotOptions.appendChild(btn);
        });
    }

    // Товчлуур дээр дарахад ажиллах функц
    function handleOptionClick(optionId) {
        const selectedOption = findOptionById(optionId);
        if (selectedOption) {
            displayMessage('user', selectedOption.text);
        }

        if (chatbotData.answers && chatbotData.answers[optionId]) {
            setTimeout(() => {
                displayMessage('bot', chatbotData.answers[optionId]);
            }, 300);
        } else {
            setTimeout(() => {
                displayMessage('bot', 'Хариулт олдсонгүй.');
            }, 300);
        }

        currentStep++;
        const nextOptions = chatbotData.steps[currentStep]?.[optionId] || [];

        if (nextOptions.length > 0) {
            setTimeout(() => {
                displayOptions(nextOptions);
            }, 800);
        } else {
            setTimeout(() => {
                displayMessage('bot', 'Яриа дууслаа. Шинэ асуулт сонгоно уу. 👇');
                currentStep = 0;
                chatbotOptions.innerHTML = '';
                displayOptions(chatbotData.steps[0].questions);
            }, 2000);
        }
    }

    // ID-аар сонголтыг олох туслах функц
    function findOptionById(id) {
        for (const step of chatbotData.steps) {
            for (const key in step) {
                if (Array.isArray(step[key])) {
                    const found = step[key].find(opt => opt.id === id);
                    if (found) return found;
                }
            }
        }
        return null;
    }

    // JSON-аас мэдээллийг ачаалж эхлэх функц
    async function loadChatbotData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error(`HTTP алдаа: ${response.status}`);
            chatbotData = await response.json();

            displayMessage('bot', 'Сайн байна уу! Сонголтоос нэгийг сонгоно уу.');
            displayOptions(chatbotData.steps[0].questions);
        } catch (error) {
            console.error(error);
            displayMessage('bot', 'Чатботын мэдээллийг ачаалж чадсангүй.');
        }
    }

    // Чатботын нээх/хаах товчлуурын event listener-ууд
    chatbotToggleBtn.addEventListener('click', () => {
        chatbotContainer.classList.add('closed');
        chatbotContainer.classList.remove('open');
        chatbotOpenBtn.style.display = 'block';
    });

    chatbotOpenBtn.addEventListener('click', () => {
        chatbotContainer.classList.remove('closed');
        chatbotContainer.classList.add('open');
        chatbotOpenBtn.style.display = 'none';
    });

    // Чатботыг чирэх функц
    let isDragging = false;
    let offsetX, offsetY;

    chatbotHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - chatbotContainer.getBoundingClientRect().left;
        offsetY = e.clientY - chatbotContainer.getBoundingClientRect().top;
        chatbotContainer.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;
        chatbotContainer.style.left = `${newX}px`;
        chatbotContainer.style.top = `${newY}px`;
        chatbotContainer.style.right = 'auto';
        chatbotContainer.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        chatbotContainer.style.cursor = 'grab';
    });

    // Эхлэх
    loadChatbotData();
    chatbotContainer.classList.add('closed');
});