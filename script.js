document.addEventListener('DOMContentLoaded', () => {
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotToggleBtn = document.getElementById('chatbot-toggle');
    const chatbotOpenBtn = document.getElementById('chatbot-open-btn');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotOptions = document.getElementById('chatbot-options');
    const chatbotHeader = document.querySelector('.chatbot-header');
    const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');

    if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }

    let chatbotData = {};
    let stepHistory = [];
    let currentId = null;

    function displayMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.innerHTML = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function displayOptions(options) {
        chatbotOptions.innerHTML = '';
        options.forEach(option => {
            const btn = document.createElement('button');
            btn.textContent = option.text;
            btn.className = 'bg-gray-700 hover:bg-gray-600 text-white rounded px-3 py-2 cursor-pointer w-full text-left transition';
            btn.addEventListener('click', () => handleOptionClick(option.id));
            chatbotOptions.appendChild(btn);
        });
    }

function handleOptionClick(optionId) {
        if (optionId === 'back') {
            if (stepHistory.length > 0) {
                const previousId = stepHistory.pop();
                currentId = previousId;

                // --- Засварласан хэсэг ---
                if (currentId === null) {
                    // Хэрэв буцах үед "null" утга таарвал энэ нь хамгийн эхний цэс гэсэн үг.
                    chatbotOptions.innerHTML = '';
                    displayMessage('bot', '🏁 Эхлэл рүү буцлаа.');
                    displayOptions(chatbotData.steps[0].questions);
                } else {
                    // Бусад тохиолдолд өмнөх цэсийг харуулна.
                    const previousOptions = findOptionsById(previousId);
                    chatbotOptions.innerHTML = '';
                    displayMessage('bot', '⬅️ Буцлаа.');
                    displayOptions(previousOptions);
                }
                // --- Засвар дууссан ---

            } else {
                // History хоосон үед (fallback)
                chatbotOptions.innerHTML = '';
                currentId = null;
                displayMessage('bot', '🏁 Эхлэл рүү буцлаа.');
                displayOptions(chatbotData.steps[0].questions);
            }
            return;
        }

        const selectedOption = findOptionById(optionId);
        if (selectedOption) {
            displayMessage('user', selectedOption.text);
        }

        if (chatbotData.answers && chatbotData.answers[optionId]) {
            setTimeout(() => {
                displayMessage('bot', chatbotData.answers[optionId]);
            }, 300);
        }

        const nextOptions = findOptionsById(optionId);
        if (nextOptions.length > 0) {
            stepHistory.push(currentId); // add current to history
            currentId = optionId;
            setTimeout(() => {
                displayOptions(nextOptions);
            }, 600);
        } else {
            setTimeout(() => {
                displayMessage('bot', '🎉 Яриа дууслаа. Шинэ асуултаа сонгоно уу.');
                currentId = null;
                stepHistory = [];
                chatbotOptions.innerHTML = '';
                displayOptions(chatbotData.steps[0].questions);
            }, 2000);
        }
    }

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

    function findOptionsById(id) {
        for (const step of chatbotData.steps) {
            if (step[id]) {
                return step[id];
            }
        }
        return [];
    }

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

    let isDragging = false, offsetX, offsetY;
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

    loadChatbotData();
    chatbotContainer.classList.add('closed');
});
