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
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('hidden');
    });

    // Цэсний бүх <a> дээр дарахад menu-гаа хаах
    const menuItems = menu.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menu.classList.add('hidden'); // menu хаах
        });
    });
}

    let chatbotData = {};
    let stepHistory = [];
    let currentId = null;

    /**
     * Чатбот руу мессеж нэмж харуулах
     * @param {string} sender - Илгээгч ('user' эсвэл 'bot')
     * @param {string} message - Харуулах мессежийн текст
     */
    function displayMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        // XSS алдааг засах: innerHTML-ийн оронд textContent ашиглах
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    /**
     * Сонголтын товчнуудыг дэлгэцэнд харуулах
     * @param {Array<{id: string, text: string}>} options - Харуулах сонголтуудын массив
     */
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

    /**
     * Хэрэглэгч сонголт дээр дарахад ажиллах функц
     * @param {string} optionId - Дарсан сонголтын ID
     */
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
            chatbotOptions.scrollTop = chatbotOptions.scrollHeight;
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
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

    /**
     * ID-аар сонголт хайх
     * @param {string} id - Хайх сонголтын ID
     * @returns {Object|null} Олдсон сонголт эсвэл null
     */
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

    /**
     * ID-аар дараагийн алхамын сонголтуудыг хайх
     * @param {string} id - Хайх ID
     * @returns {Array} Олдсон сонголтуудын массив эсвэл хоосон массив
     */
    function findOptionsById(id) {
        for (const step of chatbotData.steps) {
            if (step[id]) {
                return step[id];
            }
        }
        return [];
    }

    /**
     * data.json файлаас чатботын өгөгдлийг ачаалах (retry логиктэй)
     * @async
     * @param {number} retries - Дахин оролдох тоо (default: 3)
     * @throws {Error} Файл ачааллахад алдаа гарвал
     */
    async function loadChatbotData(retries = 3) {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error(`HTTP алдаа: ${response.status}`);
            chatbotData = await response.json();

            displayMessage('bot', 'Сайн байна уу! Сонголтоос нэгийг сонгоно уу.');
            displayOptions(chatbotData.steps[0].questions);
        } catch (error) {
            console.error('Чатбот ачаалах алдаа:', error);

            if (retries > 0) {
                // Дахин оролдох (2 секундын дараа)
                console.log(`Дахин оролдож байна... (${retries} удаа үлдсэн)`);
                setTimeout(() => loadChatbotData(retries - 1), 2000);
            } else {
                // Retry дууссан, алдааны мессеж харуулах
                displayMessage('bot', '⚠️ Чатботын мэдээллийг ачаалж чадсангүй. Хуудсаа дахин ачаалж үзнэ үү.');

                // Дахин ачаалах товч нэмэх
                const retryBtn = document.createElement('button');
                retryBtn.textContent = '🔄 Дахин оролдох';
                retryBtn.className = 'bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 mt-2 w-full transition';
                retryBtn.addEventListener('click', () => {
                    chatbotMessages.innerHTML = '';
                    chatbotOptions.innerHTML = '';
                    loadChatbotData(3);
                });
                chatbotOptions.appendChild(retryBtn);
            }
        }
    }

    /**
     * Чатботыг хаах
     */
    function closeChatbot() {
        chatbotContainer.classList.add('closed');
        chatbotContainer.classList.remove('open');
        chatbotOpenBtn.style.display = 'block';
    }

    /**
     * Чатботыг нээх
     */
    function openChatbot() {
        chatbotContainer.classList.remove('closed');
        chatbotContainer.classList.add('open');
        chatbotOpenBtn.style.display = 'none';
        chatbotOpenBtn.focus();
    }

    chatbotToggleBtn.addEventListener('click', closeChatbot);
    chatbotOpenBtn.addEventListener('click', openChatbot);

    // Keyboard навигаци: Escape товчоор чатботыг хаах
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatbotContainer.classList.contains('open')) {
            closeChatbot();
            chatbotOpenBtn.focus();
        }
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

    // Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const messageInput = document.getElementById('contact-message');

            const nameError = document.getElementById('name-error');
            const emailError = document.getElementById('email-error');
            const messageError = document.getElementById('message-error');
            const formStatus = document.getElementById('form-status');

            // Reset алдааны мессежүүд
            nameError.classList.add('hidden');
            emailError.classList.add('hidden');
            messageError.classList.add('hidden');
            formStatus.classList.add('hidden');

            let isValid = true;

            // Нэр шалгах
            if (nameInput.value.trim() === '') {
                nameError.classList.remove('hidden');
                isValid = false;
            }

            // Имэйл шалгах
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailError.classList.remove('hidden');
                isValid = false;
            }

            // Мессеж шалгах
            if (messageInput.value.trim() === '') {
                messageError.classList.remove('hidden');
                isValid = false;
            }

            // Хэрэв бүх талбар зөв бөглөгдсөн бол
            if (isValid) {
                // Энд илгээх логик байх (Firebase, API гэх мэт)
                console.log('Form submitted:', {
                    name: nameInput.value,
                    email: emailInput.value,
                    message: messageInput.value
                });

                // Амжилтын мессеж харуулах
                formStatus.classList.remove('hidden');

                // Формыг цэвэрлэх
                contactForm.reset();

                // 3 секундын дараа амжилтын мессежийг нуух
                setTimeout(() => {
                    formStatus.classList.add('hidden');
                }, 3000);
            }
        });
    }
});
