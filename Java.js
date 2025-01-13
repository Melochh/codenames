const socket = io('https://meloch-games.ru/');

const easyWords = [
    "кот", "дом", "сад", "лес", "река", "море", "луна", "солнце", "звезда", "цветок",
    "трава", "птица", "рыба", "собака", "кошка", "мышь", "хлеб", "вода", "молоко", "чай",
    "кофе", "сахар", "соль", "рис", "суп", "мясо", "сыр", "яйцо", "фрукт", "овощ",
    "яблоко", "груша", "виноград", "банан", "апельсин", "лимон", "клубника", "малина", "слива", "дыня",
    "арбуз", "морковь", "картофель", "лук", "чеснок", "помидор", "огурец", "капуста", "тыква", "перец",
    "стол", "стул", "кровать", "шкаф", "зеркало", "лампа", "ковер", "подушка", "одеяло", "полотенце",
    "книга", "тетрадь", "ручка", "карандаш", "линейка", "ножницы", "бумага", "конверт", "письмо", "открытка",
    "школа", "учитель", "ученик", "урок", "задание", "пример", "задача", "ответ", "вопрос", "экзамен",
    "игра", "игрушка", "кукла", "машина", "мяч", "пазл", "краски", "кисть", "пластилин", "нож",
    "вилка", "ложка", "тарелка", "чашка", "стакан", "кастрюля", "сковорода", "половник", "духовка", "холодильник",
    "микроволновка", "тостер", "чайник", "пылесос", "швабра", "ведро", "мыло", "шампунь", "зубная щетка", "полотенце",
    "расческа", "крем", "душ", "ванна", "туалет", "окно", "дверь", "стена", "потолок", "пол",
    "гора", "долина", "поле", "озеро", "водопад", "пещера", "пустыня", "остров", "пляж", "город",
    "деревня", "страна", "столица", "регион", "район", "центр", "окраина", "улица", "дорога", "тротуар",
    "перекресток", "светофор", "знак", "автобус", "трамвай", "поезд", "велосипед", "самолет", "корабль", "лодка",
    "мотоцикл", "такси", "метро", "станция", "аэропорт", "вокзал", "билет", "пассажир", "водитель", "пилот",
    "капитан", "порт", "рейс", "маршрут", "парк", "площадь", "фонтан", "скамейка", "фонарь", "дерево",
    "куст", "цветник", "газон", "забор", "ворота", "дорожка", "лестница", "балкон", "гараж", "сарай",
    "облако", "ветер", "дождь", "снег", "град", "туман", "радуга", "гром", "молния", "солнечный свет",
    "тень", "ночь", "утро", "день", "вечер", "неделя", "месяц", "год", "время", "час",
    "минута", "секунда", "календарь", "праздник", "друзья", "семья", "родители", "дети", "брат", "сестра",
    "друг", "подруга", "сосед", "гость", "хозяин", "гостиница", "ресторан", "кафе", "магазин", "рынок",
    "цена", "деньги", "кошелек", "покупка", "продажа", "работа", "зарплата", "отдых", "путешествие", "подарок"
];

const mediumWords = [
    "абстракция", "баланс", "вдохновение", "гармония", "диалог", "энергия", "философия", "гипотеза", "иллюзия", "категория",
    "литература", "метафора", "навигация", "объектив", "парадокс", "реакция", "симфония", "трансформация", "универсальность", "феномен",
    "хронология", "цивилизация", "эволюция", "юриспруденция", "языкознание", "актуальность", "благополучие", "влияние", "гениальность", "демократия",
    "естественность", "жизнеспособность", "загадка", "интеллект", "конструкция", "логика", "масштаб", "наука", "обязательство", "потенциал",
    "рациональность", "система", "творчество", "уникальность", "фундамент", "художество", "цель", "честолюбие", "широта", "эксперимент",
    "эффективность", "юмор", "ясность", "анализ", "благородство", "впечатление", "глобализация", "доброжелательность", "естествознание", "жизнерадостность",
    "закономерность", "инновация", "компетентность", "лаконичность", "мировоззрение", "наблюдательность", "обоснованность", "перспектива", "реализм", "самостоятельность",
    "такт", "убедительность", "фантазия", "характер", "целостность", "честность", "широта", "экология", "эмоция", "юридичность",
    "активность", "бдительность", "внимание", "грамотность", "дружелюбие", "ежедневность", "жизнь", "забота", "интерес", "качество",
    "квалификация", "реконструкция", "конституция", "инфраструктура", "бюрократия", "децентрализация", "коммуникация", "легитимность", "оппортунизм"
];

const hardWords = [
    "антидисестаблишментарианизм", "параллелепипед", "электрокардиограмма", "трансцендентальность", "интернационализация",
    "дезоксирибонуклеиновая кислота", "кристаллография", "микроскоп", "ультрафиолет", "экзистенциализм",
    "философия", "гидроэлектростанция", "радиоактивность", "электромагнетизм", "квалификация",
    "реконструкция", "конституция", "инфраструктура", "бюрократия", "децентрализация",
    "индивидуализация", "коммуникация", "легитимность", "оппортунизм", "паразитология",
    "реинкарнация", "статистика", "темперамент", "универсализм", "фотография",
    "хронометраж", "циркуляция", "энциклопедия", "юрисдикция", "ядерный реактор",
    "асимметрия", "бактериология", "вегетарианство", "генетика", "дипломатия",
    "идеология", "лингвистика", "метеорология", "нейропсихология", "оптимизация",
    "палеонтология", "квант", "радиолокация", "сейсмология", "теология",
    "антибиотик", "биохимия", "галактика", "дезоксирибоза", "электролит",
    "фотосинтез", "геном", "гидродинамика", "изотоп", "квантовая механика"
];

async function fetchWords() {
    const difficultyLevel = document.getElementById('difficulty-level').value;
    let words = [];

    try {
        switch (difficultyLevel) {
            case 'easy':
                words = getRandomWords(easyWords, 16).concat(getRandomWords(mediumWords, 7), getRandomWords(hardWords, 2));
                break;
            case 'medium':
                words = getRandomWords(easyWords, 8).concat(getRandomWords(mediumWords, 16), getRandomWords(hardWords, 1));
                break;
            case 'hard':
                words = getRandomWords(easyWords, 4).concat(getRandomWords(mediumWords, 8), getRandomWords(hardWords, 13));
                break;
            default:
                words = getRandomWords(easyWords, 16).concat(getRandomWords(mediumWords, 7), getRandomWords(hardWords, 2));
                break;
        }

        if (words.length === 0) {
            throw new Error('File is empty or contains no valid words.');
        }
    } catch (error) {
        console.error('Error fetching words:', error);
        words = [];
    }

    return words;
}

function getRandomWords(array, count) {
    const shuffledArray = shuffleArray([...array]);
    return shuffledArray.slice(0, count);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function insertHyphens(element) {
    const words = element.textContent.split(' ');

    const hyphenatedWords = words.map(word => {
        if (word.length > 10) {
            const tempElement = document.createElement('span');
            tempElement.style.visibility = 'hidden';
            tempElement.style.position = 'absolute';
            tempElement.style.whiteSpace = 'nowrap';
            tempElement.textContent = word;
            element.parentNode.appendChild(tempElement);

            const wordWidth = tempElement.offsetWidth;
            const cardWidth = element.offsetWidth;

            if (wordWidth > cardWidth) {
                let hyphenatedWord = '';
                let currentWord = '';
                let lastValidWord = '';

                for (let i = 0; i < word.length - 2; i++) {
                    currentWord += word[i];
                    tempElement.textContent = currentWord;
                    if (tempElement.offsetWidth <= cardWidth) {
                        lastValidWord = currentWord;
                    } else {
                        hyphenatedWord += lastValidWord + '-';
                        currentWord = word.slice(lastValidWord.length);
                        lastValidWord = '';
                        break;
                    }
                }

                while (currentWord.length > 3) {
                    let tempLastValidWord = '';
                    for (let i = 0; i < currentWord.length - 2; i++) {
                        tempLastValidWord += currentWord[i];
                        tempElement.textContent = tempLastValidWord;
                        if (tempElement.offsetWidth <= cardWidth) {
                            lastValidWord = tempLastValidWord;
                        } else {
                            hyphenatedWord += lastValidWord + '-';
                            currentWord = currentWord.slice(lastValidWord.length);
                            lastValidWord = '';
                            break;
                        }
                    }
                    if (lastValidWord) {
                        hyphenatedWord += lastValidWord;
                        currentWord = '';
                    }
                }

                if (currentWord) {
                    hyphenatedWord += currentWord;
                }

                element.parentNode.removeChild(tempElement);
                return hyphenatedWord;
            }

            element.parentNode.removeChild(tempElement);
        }
        return word;
    });

    element.textContent = hyphenatedWords.join(' ');
}

function applyHyphensToBoard() {
    const cards = document.querySelectorAll('.card-text');
    cards.forEach(card => {
        insertHyphens(card);
    });
}

let cardColors = {};

function assignCardColors(words) {
    cardColors = {};
    const redCards = Array(8).fill('red');
    const blueCards = Array(9).fill('blue');
    const neutralCards = Array(7).fill('neutral');
    const assassinCard = ['assassin'];

    const allCards = shuffleArray(redCards.concat(blueCards, neutralCards, assassinCard));

    words.forEach((word, index) => {
        cardColors[word] = allCards[index];
    });
}

isGameStarted = true; // Устанавливаем флаг, что игра началась

let selectedColor = '#50038f';
let leaders = {};
let players = {};
let nickname = '';
let teamNames = {};
let currentRoom = null;
let currentRound = 1; // Текущий раунд
let timer; // Таймер
let leaderTime; // Время для капитана
let currentTurn = 'beta'; // По умолчанию ход команды Бета
let isCaptainTurn = true; // Флаг для отслеживания хода капитана
let currentTeam = 'beta'; // Текущая команда, которая ходит
let currentTimer = null; // Переменная для хранения текущего таймера
let currentBoardState = []; // Глобальное состояние карточек
let selectedCards = {}; // Глобальная переменная для хранения выбранных карт
let selectedCardsState = {}; // Глобальная переменная для хранения состояния выбранных карт
let hasSentMessage = false; // Флаг для отслеживания отправки сообщения капитаном
let redCardsRemaining = 8; // Количество красных карт (команда Альфа)
let blueCardsRemaining = 9; // Количество синих карт (команда Бета)
let currentTurnIndex = 0; // Индекс текущего хода в раунде (0-3)

function stopTimer() {
    if (currentTimer) {
        clearInterval(currentTimer); // Останавливаем текущий таймер
        currentTimer = null; // Сбрасываем переменную
    }
}

// Функция для старта раунда
function startRound(team) {

    // Устанавливаем текущую команду
    currentTeam = team;
    isCaptainTurn = true; // Начинаем с хода капитана

    // Сбрасываем флаг hasSentMessage
    hasSentMessage = false;

    // Обновляем отображение хода
    updateRoundDisplay();

    // Устанавливаем время для капитана из настроек
    const leaderTime = parseInt(document.getElementById('leader-time').value, 10);
    if (isNaN(leaderTime)) {
        return;
    }

    // Запускаем таймер для капитана
    startLeaderTimer(leaderTime);
}

// Функция для запуска таймера
function startLeaderTimer(initialTime = null) {
    let time;

    // Если передано начальное время, используем его
    if (initialTime !== null) {
        time = initialTime;
    } else {
        // Определяем время для текущего хода
        if (isCaptainTurn) {
            // Если ходит капитан, берем время из "leader-time" только для капитана синей команды (Бета)
            if (currentTeam === 'beta') {
                time = parseInt(document.getElementById('leader-time').value, 10);
            } else {
                // Для капитана красной команды (Альфа) берем время из "answer-time"
                time = parseInt(document.getElementById('answer-time').value, 10);
            }
        } else {
            // Для помощников всегда берем время из "answer-time"
            time = parseInt(document.getElementById('answer-time').value, 10);
        }
    }

    // Останавливаем предыдущий таймер
    stopTimer();

    let timeLeft = time; // Время в секундах

    // Обновляем отображение таймера
    updateTimerDisplay(timeLeft);

    // Запускаем новый таймер
    currentTimer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);

        if (timeLeft <= 0) {
            stopTimer(); // Останавливаем таймер

            // Переключаем ход
            if (isCaptainTurn) {
                // Если время вышло у капитана, переключаем ход на помощников
                isCaptainTurn = false;

                // Скрываем поле ввода для капитана
                window.canCaptainChat[currentTeam] = false;
                console.log(`Ход перешел к помощникам. canCaptainChat[${currentTeam}] = false`);
            } else {
                // Если время вышло у помощников, переключаем ход на капитана противоположной команды
                currentTeam = currentTeam === 'beta' ? 'alpha' : 'beta';
                isCaptainTurn = true;

                // Восстанавливаем поле ввода для капитана новой команды
                window.canCaptainChat[currentTeam] = true;
                console.log(`Ход перешел к капитану команды ${currentTeam}. canCaptainChat[${currentTeam}] = true`);
            }

            // Если это был 4-й ход, переходим к следующему раунду
            if (currentTurnIndex === 3) {
                currentRound++; // Увеличиваем номер раунда
                currentTurnIndex = 0; // Сбрасываем индекс хода

                // Уведомляем сервер о начале нового раунда
                socket.emit('startNewRound', currentTeam, currentRoom);

                // Обновляем отображение раунда и хода
                updateRoundDisplay(); // <-- Добавлено здесь
            } else {
                currentTurnIndex++; // Переходим к следующему ходу
            }

            // Обновляем отображение хода
            updateRoundDisplay();

            // Запускаем таймер для следующего хода
            startLeaderTimer();
        }
    }, 1000);
}

// Функция для обновления отображения раунда
function updateRoundDisplay() {
    const roundDisplay = document.getElementById('round-display');
    const roundNumber = document.getElementById('roundNumber');
    const currentTurnElement = document.getElementById('currentTurn');

    if (roundDisplay && roundNumber && currentTurnElement) {
        // Обновляем номер раунда
        roundNumber.textContent = currentRound;

        // Получаем название текущей команды из teamNames
        const teamName = teamNames[currentTeam] || (currentTeam === 'beta' ? 'Бета' : 'Альфа');
        const currentLeader = leaders[currentTeam]?.name || 'Капитан';
        const currentPlayers = players[currentTeam]?.map(player => player.name).join(', ') || 'Помощники';

        // Формируем текст для отображения
        let turnText;
        if (isCaptainTurn) {
            turnText = `Капитан ${currentLeader} (${teamName})`;
        } else {
            turnText = `Помощники ${currentPlayers} (${teamName})`;
        }

        currentTurnElement.textContent = turnText;
    }
}

// Функция для обновления отображения таймера
function updateTimerDisplay(timeLeft) {
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
        timerDisplay.textContent = `Время: ${timeLeft} сек`;
    } else {
        console.error('Элемент timer-display не найден');
    }
}

function resetGame() {
    // Сбрасываем флаги и переменные
    isGameStarted = false; // Сбрасываем флаг, что игра началась
    hasSentMessage = false; // Сбрасываем флаг отправки сообщения
    isCaptainTurn = true; // Сбрасываем ход на капитана
    currentTeam = 'beta'; // Сбрасываем текущую команду на Бету
    cardColors = {}; // Очищаем цвета карт
    redCardsRemaining = 8; // Сбрасываем счетчик красных карт
    blueCardsRemaining = 9; // Сбрасываем счетчик синих карт
    selectedCards = {}; // Очищаем выбранные карты
    selectedCardsState = {}; // Очищаем состояние выбранных карт
    currentTurnIndex = 0; // Сбрасываем индекс хода

    // Очистка доски
    const boardElement = document.getElementById('board');
    if (boardElement) {
        boardElement.innerHTML = ''; // Очищаем доску
    }

    // Скрытие таймера, раунда и чатов
    document.getElementById('round-display').classList.add('hidden');
    document.getElementById('timer-display').classList.add('hidden');
    document.getElementById('chatContainerBeta').classList.add('hidden');
    document.getElementById('chatContainerAlpha').classList.add('hidden');
    document.getElementById('chatInputContainerBeta').classList.add('hidden');
    document.getElementById('chatInputContainerAlpha').classList.add('hidden');

    // Очистка чатов
    document.getElementById('chatBoxBeta').innerHTML = '';
    document.getElementById('chatBoxAlpha').innerHTML = '';

    // Очистка индикаторов выбора карт
    const indicators = document.querySelectorAll('.indicators-container');
    indicators.forEach(indicator => indicator.remove());

    // Сброс состояния помощников (они больше не могут выбирать карты)
    window.canAssistantsSelectCards = false;

    // Очистка выбранных карт (если есть)
    if (selectedCard) {
        selectedCard.querySelector('.progress-bar').style.width = '0%'; // Сбрасываем индикатор
        selectedCard = null;
    }

    // Остановка таймера выбора карты
    if (selectedCardTimer) {
        clearTimeout(selectedCardTimer);
        selectedCardTimer = null;
    }

    // Очистка сообщений в чате
    document.getElementById('chatInputBeta').value = '';
    document.getElementById('chatInputAlpha').value = '';

    // Отключение кнопки "Перемешать"
    const shuffleButton = document.getElementById('shuffleButton');
    if (shuffleButton) {
        shuffleButton.disabled = true;
    }

    // Сброс таймера
    if (timer) {
        clearInterval(timer);
        timer = null;
    }

    // Сброс раунда и хода
    currentRound = 1;
    currentTurn = 'beta'; // Сбрасываем ход на команду Бета
    updateRoundDisplay();

    // Очистка классов карточек (если они остались)
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('disabled', 'red', 'blue', 'neutral', 'assassin', 'selected');
        card.classList.add('hidden-color'); // Возвращаем карточки в исходное состояние
        card.addEventListener('click', handleCardClick); // Восстанавливаем обработчики событий
    });

    // Сброс состояния игры на сервере (если нужно)
    if (currentRoom) {
        socket.emit('resetGame', currentRoom);
    }

    // Показываем уведомление о сбросе игры
    showToast("Игра сброшена до начального состояния", "#2ecc71");

    // Если есть слова, обновляем доску
    if (window.words && window.words.length > 0) {
        createBoard(window.words);
    }
}

function changeTurn(newTeam) {
    currentTeam = newTeam;
    isCaptainTurn = true; // Начинаем с хода капитана
    hasSentMessage = false; // Сбрасываем флаг отправки сообщения
    updateRoundDisplay();

    // Обновляем состояние карт
    updateCardStates();

    // Устанавливаем таймер для капитана новой команды
    const leaderTime = parseInt(document.getElementById('leader-time').value, 10);
    if (!isNaN(leaderTime)) {
        startLeaderTimer(leaderTime);
    } else {
        console.error("Некорректное значение времени для капитана");
    }
}

function updateCardStates() {
    const cards = document.querySelectorAll('.card');
    const isCaptain = (leaders['beta'] && leaders['beta'].name === nickname) ||
                      (leaders['alpha'] && leaders['alpha'].name === nickname);

    cards.forEach(card => {
        const word = card.querySelector('.card-text').textContent;
        const color = cardColors[word];

        // Проверяем, открыта ли карта
        const isCardOpen = card.classList.contains('red') || 
                           card.classList.contains('blue') || 
                           card.classList.contains('neutral') || 
                           card.classList.contains('assassin');

        // Если карта уже выбрана, блокируем её
        if (selectedCardsState[word]) {
            card.classList.add('disabled');
            card.removeEventListener('click', handleCardClick);
            return; // Пропускаем дальнейшую обработку
        }

        // Если игрок капитан, блокируем все выбранные карты
        if (isCaptain) {
            if (isCardOpen) {
                card.classList.add('disabled');
                card.removeEventListener('click', handleCardClick);
            }
        }
        // Если игрок помощник, блокируем карты только во время их хода
        else {
            if (isCardOpen) {
                if ((color === 'blue' && currentTeam === 'alpha') || (color === 'red' && currentTeam === 'beta')) {
                    card.classList.add('disabled');
                    card.removeEventListener('click', handleCardClick);
                } else {

                }
            }
        }
    });
}

function updateCardCounters() {
    const redCardsRemainingElement = document.getElementById('redCardsRemaining');
    const blueCardsRemainingElement = document.getElementById('blueCardsRemaining');

    if (redCardsRemainingElement) {
        redCardsRemainingElement.textContent = redCardsRemaining;
    }

    if (blueCardsRemainingElement) {
        blueCardsRemainingElement.textContent = blueCardsRemaining;
    }
}

async function startGame() {
    if (!currentRoom) {
        showToast("Вы еще не присоединились к комнате", "#e74c3c");
        return;
    }

    // Проверяем, занят ли хотя бы один слот (капитан или помощник в любой команде)
    const isBetaLeaderSet = leaders['beta'] && leaders['beta'].name;
    const isAlphaLeaderSet = leaders['alpha'] && leaders['alpha'].name;
    const isBetaPlayersSet = players['beta'] && players['beta'].length > 0; // Хотя бы один помощник
    const isAlphaPlayersSet = players['alpha'] && players['alpha'].length > 0; // Хотя бы один помощник

    // Проверяем, что хотя бы один слот занят (капитан или помощник в любой команде)
    const isAnySlotOccupied = isBetaLeaderSet || isAlphaLeaderSet || isBetaPlayersSet || isAlphaPlayersSet;

    if (!isAnySlotOccupied) {
        showToast("Необходимо назначить хотя бы одного игрока (капитана или помощника).", "#e74c3c");
        return;
    }

    // Скрываем отображение раунда, хода и чатов до старта игры
    document.getElementById('round-display').classList.add('hidden');
    document.getElementById('timer-display').classList.add('hidden');
    document.getElementById('chatContainerBeta').classList.add('hidden');
    document.getElementById('chatContainerAlpha').classList.add('hidden');
    document.getElementById('chatInputContainerBeta').classList.add('hidden');
    document.getElementById('chatInputContainerAlpha').classList.add('hidden');

    // Инициализация счетчиков карт
    updateCardCounters();

    const words = await fetchWords();
    if (words && words.length > 0) {
        assignCardColors(words); // Назначаем цвета карт заново
        createBoard(words);
        socket.emit('startGame', { words, cardColors }, currentRoom);

        // Показываем таймер, раунд и чаты только после старта игры
        document.getElementById('round-display').classList.remove('hidden');
        document.getElementById('timer-display').classList.remove('hidden');
        document.getElementById('chatContainerBeta').classList.remove('hidden');
        document.getElementById('chatContainerAlpha').classList.remove('hidden');
        document.getElementById('chatInputContainerBeta').classList.remove('hidden');
        document.getElementById('chatInputContainerAlpha').classList.remove('hidden');

        
        // Сбрасываем таймер и раунд
        currentRound = 1;
        currentTurnIndex = 0; // Сбрасываем индекс хода
        isCaptainTurn = true; // Начинаем с хода капитана
        currentTeam = 'beta'; // Начинаем с команды Бета
        updateRoundDisplay();

        // Устанавливаем начальное значение таймера
        startLeaderTimer(); // Запускаем таймер для первого хода
    } else {
        showToast("Не удалось получить слова для игры. Пожалуйста, попробуйте снова.", "#e74c3c");
    }
}

async function generateBoard() {
    if (!currentRoom) {
        showToast("Вы еще не присоединились к комнате", "#e74c3c");
        return;
    }

    // Проверка, есть ли карты на доске
    const boardElement = document.getElementById('board');
    if (!boardElement || boardElement.children.length === 0) {
        showToast("Нет карт для перемешивания", "#e74c3c");
        return;
    }

    const words = await fetchWords();
    if (words && words.length > 0) {
        assignCardColors(words);
        createBoard(words);
        socket.emit('shuffleBoard', { words, cardColors }, currentRoom);
    }
}

document.getElementById('nicknameInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        submitNickname();
    }
});

document.getElementById('new-team-name-beta').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        changeTeamName('beta');
    }
});

document.getElementById('new-team-name-alpha').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        changeTeamName('alpha');
    }
});

function createBoard(words) {
    const boardElement = document.getElementById('board');
    if (!boardElement) {
        console.error('Элемент доски не найден');
        return;
    }

    boardElement.innerHTML = '';

    const isCaptain = (leaders['beta'] && leaders['beta'].name === nickname) ||
                      (leaders['alpha'] && leaders['alpha'].name === nickname);
    const isAssistant1 = (players['beta'] && players['beta'][0] && players['beta'][0].name === nickname) ||
                         (players['alpha'] && players['alpha'][0] && players['alpha'][0].name === nickname);
    const isAssistant2 = (players['beta'] && players['beta'][1] && players['beta'][1].name === nickname) ||
                         (players['alpha'] && players['alpha'][1] && players['alpha'][1].name === nickname);

    words.forEach(word => {
        const card = document.createElement('div');
        card.className = `card`;

        const cardText = document.createElement('span');
        cardText.textContent = word;
        cardText.className = 'card-text';

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.width = '0%';

        card.appendChild(cardText);
        card.appendChild(progressBar);
        boardElement.appendChild(card);

        // Если игрок капитан, показываем реальные цвета карточек
        if (isCaptain) {
            const color = cardColors[word];
            if (color) {
                card.classList.add(color);
            }
        } else if (isAssistant1 || isAssistant2) {
            // Если игрок помощник, скрываем цвета карточек
            card.classList.add('hidden-color');
        }

        // Если карта уже выбрана и заблокирована, применяем соответствующий стиль
        if (selectedCardsState[word]) {
            const color = cardColors[word];
            card.classList.add(color);
            card.classList.add('disabled');
            card.removeEventListener('click', handleCardClick);
        } else if (isCaptain) {
            // Если игрок капитан, показываем реальные цвета карточек
            const color = cardColors[word];
            if (color) {
                card.classList.add(color);
            }
        } else {
            // Если игрок помощник, скрываем цвета карточек
            card.classList.add('hidden-color');
        }

        card.addEventListener('click', handleCardClick);
    });
    
    // Включаем кнопку "Перемешать" после создания доски
    const shuffleButton = document.getElementById('shuffleButton');
    if (shuffleButton) {
        shuffleButton.disabled = false;
    }
}

let selectedCardTimer = null; // Таймер для выбранной карты
let selectedCard = null; // Текущая выбранная карта

function handleCardClick(event) {
    const card = event.currentTarget;
    const word = card.querySelector('.card-text').textContent;
    const color = cardColors[word];

    // Проверяем, является ли игрок помощником
    const isAssistant = (players['beta'] && players['beta'].some(player => player.name === nickname)) ||
                        (players['alpha'] && players['alpha'].some(player => player.name === nickname));

    if (!isAssistant) {
        showToast("Только помощники могут выбирать карты", "#e74c3c");
        return;
    }

    // Проверяем, может ли помощник выбирать карты (только во время хода своей команды)
    const isBetaAssistant = players['beta'] && players['beta'].some(player => player.name === nickname);
    const isAlphaAssistant = players['alpha'] && players['alpha'].some(player => player.name === nickname);

    if ((isBetaAssistant && currentTeam !== 'beta') || (isAlphaAssistant && currentTeam !== 'alpha')) {
        showToast("Вы не можете выбирать карты, пока не ваш ход", "#e74c3c");
        return;
    }

    // Проверяем, могут ли помощники выбирать карты
    if (!window.canAssistantsSelectCards || isCaptainTurn) {
        showToast("Помощники не могут выбирать карты, пока капитан не отправил сообщение", "#e74c3c");
        return;
    }

    // Если карта уже выбрана, отменяем выбор
    if (selectedCardsState[word] || selectedCard === card) {
        delete selectedCardsState[word];
        card.classList.remove('selected');
        card.querySelector('.progress-bar').style.width = '0%';

        // Удаляем индикатор цвета игрока
        const indicatorsContainer = card.querySelector('.indicators-container');
        if (indicatorsContainer) {
            const existingIndicator = indicatorsContainer.querySelector(`.player-color-indicator[data-player="${nickname}"]`);
            if (existingIndicator) {
                indicatorsContainer.removeChild(existingIndicator);
            }
        }

        // Сбрасываем цвет карты, если она была открыта
        card.classList.remove('red', 'blue', 'neutral', 'assassin');
        card.classList.add('hidden-color');

        // Отменяем таймер, если он был запущен
        if (selectedCardTimer) {
            clearTimeout(selectedCardTimer);
            selectedCardTimer = null;
        }

        // Сбрасываем выбранную карту
        selectedCard = null;

        showToast("Выбор карты отменен", "#2ecc71");
        return;
    }

    // Если выбрана другая карта, отменяем предыдущий выбор
    if (selectedCard) {
        clearTimeout(selectedCardTimer);
        selectedCard.querySelector('.progress-bar').style.width = '0%';

        // Удаляем индикатор цвета игрока с предыдущей карты
        const previousIndicatorsContainer = selectedCard.querySelector('.indicators-container');
        if (previousIndicatorsContainer) {
            const existingIndicator = previousIndicatorsContainer.querySelector(`.player-color-indicator[data-player="${nickname}"]`);
            if (existingIndicator) {
                previousIndicatorsContainer.removeChild(existingIndicator);
            }
        }

        // Сбрасываем цвет предыдущей карты, если она была открыта
        selectedCard.classList.remove('red', 'blue', 'neutral', 'assassin');
        selectedCard.classList.add('hidden-color');
    }

    // Выбираем новую карту
    selectedCard = card;
    card.querySelector('.progress-bar').style.width = '100%';

    // Добавляем индикатор цвета помощника
    const assistantColor = players['beta']?.find(player => player.name === nickname)?.color ||
                           players['alpha']?.find(player => player.name === nickname)?.color;

    let indicatorsContainer = card.querySelector('.indicators-container');
    if (!indicatorsContainer) {
        indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'indicators-container';
        indicatorsContainer.style.position = 'absolute';
        indicatorsContainer.style.bottom = '5px';
        indicatorsContainer.style.right = '5px';
        indicatorsContainer.style.display = 'flex';
        indicatorsContainer.style.gap = '5px';
        card.appendChild(indicatorsContainer);
    }

    // Проверяем, есть ли уже индикатор для этого игрока
    const existingIndicator = indicatorsContainer.querySelector(`.player-color-indicator[data-player="${nickname}"]`);
    if (!existingIndicator) {
        const colorIndicator = document.createElement('div');
        colorIndicator.className = 'player-color-indicator';
        colorIndicator.style.backgroundColor = assistantColor;
        colorIndicator.setAttribute('data-player', nickname); // Уникальный идентификатор
        indicatorsContainer.appendChild(colorIndicator);
    }

    // Запускаем таймер на 3 секунды
    selectedCardTimer = setTimeout(() => {
        // Получаем цвет выбранной карты
        const color = cardColors[word];

        // Показываем истинный цвет карты
        card.classList.add(color);

        // Блокируем карту
        card.classList.add('disabled');
        card.removeEventListener('click', handleCardClick);

        // Обновляем состояние карточки в currentBoardState
        const cardIndex = currentBoardState.findIndex(cardState => cardState.word === word);
        if (cardIndex !== -1) {
            currentBoardState[cardIndex].isSelected = true;
            currentBoardState[cardIndex].isDisabled = true;
        }

        // Удаляем индикатор прогресса и индикатор цвета помощника
        card.querySelector('.progress-bar').style.width = '0%';
        const indicatorsContainer = card.querySelector('.indicators-container');
        if (indicatorsContainer) {
            const existingIndicator = indicatorsContainer.querySelector(`.player-color-indicator[data-player="${nickname}"]`);
            if (existingIndicator) {
                indicatorsContainer.removeChild(existingIndicator);
            }
        }

        // Обрабатываем выбор карты в зависимости от её цвета
        switch (color) {
            case 'blue': // Карта синего цвета (команда Бета)
                if (currentTeam === 'beta') {
                    blueCardsRemaining--;
                    updateCardCounters();
                    if (blueCardsRemaining === 0) {
                        setTimeout(() => {
                            endGame('beta');
                        }, 1000);
                        return;
                    }
                    showToast("Вы открыли карту своей команды! Выберите еще одну карту.", "#2ecc71");

                    // Добавляем время к таймеру из настроек "bonus-time"
                    const bonusTime = parseInt(document.getElementById('bonus-time').value, 10);
                    if (!isNaN(bonusTime)) {
                        const currentTime = parseInt(document.getElementById('timer-display').textContent.replace('Время: ', '').replace(' сек', ''), 10);
                        const newTime = currentTime + bonusTime; // Добавляем bonusTime к текущему времени
                        updateTimerDisplay(newTime);
                        socket.emit('resetTimer', { time: newTime }, currentRoom);
                        showToast(`Добавлено ${bonusTime} секунд к таймеру`, "#2ecc71");
                    }
                } else {
                    showToast("Вы открыли карту противоположной команды! Ход переходит к капитану противоположной команды.", "#e74c3c");
                    blueCardsRemaining--; // Уменьшаем счётчик карт для команды Бета
                    updateCardCounters(); // Обновляем счетчик сразу
                    if (blueCardsRemaining === 0) {
                        setTimeout(() => {
                            endGame('beta');
                        }, 1000);
                        return;
                    }
                    currentTeam = currentTeam === 'beta' ? 'alpha' : 'beta';
                    isCaptainTurn = true;
                    hasSentMessage = false;
                    updateRoundDisplay();
                    updateChatVisibility();
                    startLeaderTimer(parseInt(document.getElementById('answer-time').value, 10)); // Используем answer-time для капитана Альфа
                    socket.emit('changeTurn', currentTeam, currentRoom);
                }
                break;

            case 'red': // Карта красного цвета (команда Альфа)
                if (currentTeam === 'alpha') {
                    redCardsRemaining--;
                    updateCardCounters(); // Обновляем счетчик сразу
                    if (redCardsRemaining === 0) {
                        setTimeout(() => {
                            endGame('alpha');
                        }, 1000);
                        return;
                    }
                    showToast("Вы открыли карту своей команды! Выберите еще одну карту.", "#2ecc71");

                    // Добавляем время к таймеру из настроек "bonus-time"
                    const bonusTime = parseInt(document.getElementById('bonus-time').value, 10);
                    if (!isNaN(bonusTime)) {
                        const currentTime = parseInt(document.getElementById('timer-display').textContent.replace('Время: ', '').replace(' сек', ''), 10);
                        const newTime = currentTime + bonusTime; // Добавляем bonusTime к текущему времени
                        updateTimerDisplay(newTime);
                        socket.emit('resetTimer', { time: newTime }, currentRoom);
                        showToast(`Добавлено ${bonusTime} секунд к таймеру`, "#2ecc71");
                    }
                } else {
                    showToast("Вы открыли карту противоположной команды! Ход переходит к капитану противоположной команды.", "#e74c3c");
                    redCardsRemaining--; // Уменьшаем счётчик карт для команды Альфа
                    updateCardCounters(); // Обновляем счетчик сразу
                    if (redCardsRemaining === 0) {
                        setTimeout(() => {
                            endGame('alpha');
                        }, 1000);
                        return;
                    }
                    currentTeam = currentTeam === 'alpha' ? 'beta' : 'alpha';
                    isCaptainTurn = true;
                    hasSentMessage = false;
                    updateRoundDisplay();
                    updateChatVisibility();
                    startLeaderTimer(parseInt(document.getElementById('answer-time').value, 10)); // Используем answer-time для капитана Бета
                    socket.emit('changeTurn', currentTeam, currentRoom);
                }
                break;

            case 'neutral': // Нейтральная карта
                showToast("Вы открыли нейтральную карту! Ход переходит к капитану противоположной команды.", "#e74c3c");
                currentTeam = currentTeam === 'beta' ? 'alpha' : 'beta';
                isCaptainTurn = true;
                hasSentMessage = false;
                updateRoundDisplay();
                updateChatVisibility();
                startLeaderTimer(parseInt(document.getElementById('answer-time').value, 10)); // Используем answer-time для капитана Альфа
                socket.emit('changeTurn', currentTeam, currentRoom);
                break;

            case 'assassin': // Карта убийцы (черная)
                showToast("Вы открыли карту убийцы! Игра окончена.", "#e74c3c", true);
                setTimeout(() => {
                    showToast(`Победа команды ${currentTeam === 'beta' ? 'АЛЬФА' : 'БЕТА'}!`, "#2ecc71", true, true);
                }, 1000);
                endGame(currentTeam === 'beta' ? 'alpha' : 'beta');
                break;

            default:
                showToast("Неизвестный цвет карты", "#e74c3c");
                break;
        }

        // Сохраняем состояние выбранной карты
        selectedCardsState[word] = true;

        // Сбрасываем выбранную карту
        selectedCard = null;

    }, 3000); // 3 секунды
}
let lastSelectedCard = null; // Переменная для хранения последней выбранной карты

function selectCard(cardElement) {

    const isAssistant = (players['beta'] && players['beta'].some(player => player.name === nickname)) ||
                        (players['alpha'] && players['alpha'].some(player => player.name === nickname));

    if (!isAssistant) {
        showToast("Только помощники могут выбирать карты", "#e74c3c");
        return;
    }

    // Проверяем, могут ли помощники выбирать карты
    if (!window.canAssistantsSelectCards) {
        showToast("Помощники не могут выбирать карты, пока капитан не отправит сообщение", "#e74c3c");
        return;
    }

    const assistantColor = players['beta']?.find(player => player.name === nickname)?.color ||
                           players['alpha']?.find(player => player.name === nickname)?.color;

    // Убираем индикатор с последней выбранной карты, если она отличается от текущей
    if (lastSelectedCard && lastSelectedCard !== cardElement) {
        const lastIndicatorsContainer = lastSelectedCard.querySelector('.indicators-container');
        if (lastIndicatorsContainer) {
            const existingIndicator = lastIndicatorsContainer.querySelector(`.player-color-indicator[data-player="${nickname}"]`);
            if (existingIndicator) {
                lastIndicatorsContainer.removeChild(existingIndicator);
            }
        }
    }

    // Если та же карта выбрана повторно, отменяем выбор
    if (lastSelectedCard === cardElement) {
        const indicatorsContainer = cardElement.querySelector('.indicators-container');
        if (indicatorsContainer) {
            const existingIndicator = indicatorsContainer.querySelector(`.player-color-indicator[data-player="${nickname}"]`);
            if (existingIndicator) {
                indicatorsContainer.removeChild(existingIndicator);
                lastSelectedCard = null;
                return; // Отменяем выбор, не показываем истинный цвет
            }
        }
    }

    // Отправляем информацию о выбранной карте на сервер
    const word = cardElement.querySelector('.card-text').textContent;
    socket.emit('selectCard', { word, player: nickname, color: assistantColor }, currentRoom);

    // Добавляем индикатор выбора на карту
    let indicatorsContainer = cardElement.querySelector('.indicators-container');
    if (!indicatorsContainer) {
        indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'indicators-container';
        indicatorsContainer.style.position = 'absolute';
        indicatorsContainer.style.bottom = '5px';
        indicatorsContainer.style.right = '5px';
        indicatorsContainer.style.display = 'flex';
        indicatorsContainer.style.gap = '5px';
        cardElement.appendChild(indicatorsContainer);
    }

    // Проверяем, есть ли уже индикатор для этого игрока
    const existingIndicator = indicatorsContainer.querySelector(`.player-color-indicator[data-player="${nickname}"]`);
    if (!existingIndicator) {
        const colorIndicator = document.createElement('div');
        colorIndicator.className = 'player-color-indicator';
        colorIndicator.style.backgroundColor = assistantColor;
        colorIndicator.setAttribute('data-player', nickname); // Уникальный идентификатор
        indicatorsContainer.appendChild(colorIndicator);
    }

    // Обновляем последнюю выбранную карту
    lastSelectedCard = cardElement;
}


// Server-side event handler for card selection
socket.on('cardSelected', (data) => {

    const cardElement = Array.from(document.querySelectorAll('.card')).find(card => {
        return card.querySelector('.card-text').textContent === data.word;
    });

    if (cardElement) {
        let indicatorsContainer = cardElement.querySelector('.indicators-container');
        if (!indicatorsContainer) {
            indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'indicators-container';
            indicatorsContainer.style.position = 'absolute';
            indicatorsContainer.style.bottom = '5px';
            indicatorsContainer.style.right = '5px';
            indicatorsContainer.style.display = 'flex';
            indicatorsContainer.style.gap = '5px';
            cardElement.appendChild(indicatorsContainer);
        }

        // Remove any existing indicator for the same player
        const existingIndicator = indicatorsContainer.querySelector(`.player-color-indicator[data-player="${data.player}"]`);
        if (existingIndicator) {
            indicatorsContainer.removeChild(existingIndicator);
        }

        // Add the new indicator
        const colorIndicator = document.createElement('div');
        colorIndicator.className = 'player-color-indicator';
        colorIndicator.style.backgroundColor = data.color;
        colorIndicator.setAttribute('data-player', data.player); // Unique identifier
        indicatorsContainer.appendChild(colorIndicator);
    }
});

function endGame(winningTeam) {
    // Останавливаем таймер
    stopTimer();

    // Блокируем дальнейшие действия на доске
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.removeEventListener('click', handleCardClick);
    });

    // Скрываем чаты и поля ввода
    document.getElementById('chatContainerBeta').classList.add('hidden');
    document.getElementById('chatContainerAlpha').classList.add('hidden');
    document.getElementById('chatInputContainerBeta').classList.add('hidden');
    document.getElementById('chatInputContainerAlpha').classList.add('hidden');

    // Показываем сообщение о победе
    showToast(`Победа команды ${winningTeam === 'beta' ? 'БЕТА' : 'АЛЬФА'}!`, "#2ecc71", true, true);
}

function changeTeamName(team) {

    if (!currentRoom) {
        showToast("Вы еще не присоединились к комнате", "#e74c3c");
        return;
    }

    const newNameInput = document.getElementById(`new-team-name-${team}`);
    const teamNameDisplay = document.getElementById(`team-name-${team}`);
    const changeButton = document.getElementById(`change-team-name-${team}`);

    if (newNameInput.style.display === 'none' || newNameInput.style.display === '') {
        newNameInput.style.display = 'inline-block';
        teamNameDisplay.style.display = 'none';
        changeButton.innerHTML = '<i class="fas fa-check"></i>';
    } else {
        const newName = newNameInput.value.trim();
        if (newName) {
            socket.emit('changeTeamName', team, newName, currentRoom);
            showToast(`Название команды изменено на "${newName}"`, "#2ecc71");
            newNameInput.style.display = 'none';
            teamNameDisplay.style.display = 'inline-block';
            changeButton.innerHTML = '<i class="fas fa-edit"></i>';
        } else {
            showToast("Введите название команды", "#e74c3c");
        }
    }
}

function clearRole(team, player) {
    // Проверяем, существует ли объект leaders и есть ли в нем команда
    if (leaders && leaders[team] && leaders[team].name === player) {
        leaders[team] = null;
    }

    // Проверяем, существует ли объект players и есть ли в нем команда
    if (players && players[team]) {
        players[team] = players[team].filter(p => p && p.name !== player);
    }
}

function setLeader(team, player, color) {

    if (!currentRoom) {
        showToast("Вы еще не присоединились к комнате", "#e74c3c");
        return;
    }

    clearRole('beta', player);
    clearRole('alpha', player);

    if (leaders[team] && leaders[team].name === player) {
        showToast(`${player} уже является капитаном команды ${team.toUpperCase()}`, "#e74c3c");
        return;
    }

    leaders[team] = { name: player, color: color };

    socket.emit('setLeader', team, player, color, currentRoom);

    updateUI();
    showToast(`${player} стал капитаном команды ${team.toUpperCase()}`, "#2ecc71");
}

function setPlayer(team, player, color, slotNumber) {
    // Очищаем роли игрока в других командах
    clearRole('beta', player);
    clearRole('alpha', player);

    // Инициализируем массив для команды, если он не существует
    if (!players[team]) {
        players[team] = [];
    }

    // Проверяем, есть ли игрок уже в команде
    const existingSlot = players[team].findIndex(p => p && p.name === player);
    if (existingSlot !== -1) {
        players[team][slotNumber - 1] = players[team][existingSlot];
        players[team].splice(existingSlot, 1);
    } else {
        if (players[team].length >= 2) {
            showToast(`Команда ${team.toUpperCase()} уже имеет максимальное количество помощников`, "#e74c3c");
            return;
        }
        players[team][slotNumber - 1] = { name: player, color };
    }

    // Обновляем интерфейс
    updateUI();

    // Отправляем данные на сервер
    socket.emit('setPlayer', team, player, color, slotNumber, currentRoom);
}

function updateUI() {
    console.log('Updating UI...');
    console.log('Leaders:', leaders);
    console.log('Players:', players);
    console.log('Nickname:', nickname);
    console.log('Team Names:', teamNames);

    // Обновляем названия команд
    const teamNameAlpha = document.getElementById('team-name-alpha');
    const teamNameBeta = document.getElementById('team-name-beta');
    if (teamNameAlpha && teamNameBeta) {
        teamNameAlpha.textContent = teamNames['alpha'] || 'Альфа';
        teamNameBeta.textContent = teamNames['beta'] || 'Бета';
    } else {
        console.error('Элементы team-name-alpha или team-name-beta не найдены');
    }

    // Если игра уже началась, не обновляем доску
    if (!isGameStarted && window.words && window.words.length > 0) {
        createBoard(window.words);
    }

    // Если игрок стал капитаном, обновляем доску
    const isCaptain = (leaders['beta'] && leaders['beta'].name === nickname) ||
                      (leaders['alpha'] && leaders['alpha'].name === nickname);
    if (isCaptain && window.words && window.words.length > 0) {
        createBoard(window.words);
    }
    
    updateRoundDisplay(); 

    const isBetaLeader = leaders['beta'] && leaders['beta'].name === nickname;
    const isAlphaLeader = leaders['alpha'] && leaders['alpha'].name === nickname;

    // Кнопка "Стать капитаном" для команды beta
    const leaderButtonBeta = document.getElementById('leader-slot-beta')?.querySelector('.leader-button1');
    if (leaderButtonBeta) {
        leaderButtonBeta.style.display = !leaders['beta'] ? 'block' : 'none';
    } else {
        console.error('Элемент leaderButtonBeta не найден');
    }

    // Кнопка "Стать капитаном" для команды alpha
    const leaderButtonAlpha = document.getElementById('leader-slot-alpha')?.querySelector('.leader-button2');
    if (leaderButtonAlpha) {
        leaderButtonAlpha.style.display = !leaders['alpha'] ? 'block' : 'none';
    } else {
        console.error('Элемент leaderButtonAlpha не найден');
    }

    const leaderAlphaElement = document.getElementById('leader-alpha');
    const leaderBetaElement = document.getElementById('leader-beta');
    if (leaderAlphaElement && leaderBetaElement) {
        leaderAlphaElement.textContent = gameState.leaders['alpha']?.name || '';
        leaderAlphaElement.style.color = gameState.leaders['alpha']?.color || '#000';
        leaderBetaElement.textContent = gameState.leaders['beta']?.name || '';
        leaderBetaElement.style.color = gameState.leaders['beta']?.color || '#000';
    }

    // Обновляем отображение помощников команд
    const playerBeta1 = players['beta'] && players['beta'][0];
    const playerBeta2 = players['beta'] && players['beta'][1];
    const playerAlpha1 = players['alpha'] && players['alpha'][0];
    const playerAlpha2 = players['alpha'] && players['alpha'][1];

    if (playerAlpha1 && playerAlpha2 && playerBeta1 && playerBeta2) {
        playerAlpha1.textContent = gameState.teamPlayers['alpha']?.[0]?.name || '';
        playerAlpha1.style.color = gameState.teamPlayers['alpha']?.[0]?.color || '#000';
        playerAlpha2.textContent = gameState.teamPlayers['alpha']?.[1]?.name || '';
        playerAlpha2.style.color = gameState.teamPlayers['alpha']?.[1]?.color || '#000';
        playerBeta1.textContent = gameState.teamPlayers['beta']?.[0]?.name || '';
        playerBeta1.style.color = gameState.teamPlayers['beta']?.[0]?.color || '#000';
        playerBeta2.textContent = gameState.teamPlayers['beta']?.[1]?.name || '';
        playerBeta2.style.color = gameState.teamPlayers['beta']?.[1]?.color || '#000';
    }

    // Обновляем видимость кнопок "Стать помощником"
    const playerSlotBeta1 = document.getElementById('player-slot-beta-1');
    const playerSlotBeta2 = document.getElementById('player-slot-beta-2');
    const playerSlotAlpha1 = document.getElementById('player-slot-alpha-1');
    const playerSlotAlpha2 = document.getElementById('player-slot-alpha-2');

    if (playerSlotBeta1 && playerSlotBeta2 && playerSlotAlpha1 && playerSlotAlpha2) {
        playerSlotBeta1.querySelector('.player-button.beta').style.display = playerBeta1 ? 'none' : 'block';
        playerSlotBeta2.querySelector('.player-button.beta').style.display = playerBeta2 ? 'none' : 'block';
        playerSlotAlpha1.querySelector('.player-button.alpha').style.display = playerAlpha1 ? 'none' : 'block';
        playerSlotAlpha2.querySelector('.player-button.alpha').style.display = playerAlpha2 ? 'none' : 'block';
    } else {
        console.error('Один из элементов player-slot не найден');
    }

    const changeTeamNameBeta = document.getElementById('change-team-name-beta');
    const newTeamNameBeta = document.getElementById('new-team-name-beta');
    const teamNameBetaDisplay = document.getElementById('team-name-beta');

    if (changeTeamNameBeta && newTeamNameBeta && teamNameBetaDisplay) {
        changeTeamNameBeta.style.display = isBetaLeader ? 'inline-block' : 'none';
        newTeamNameBeta.style.display = 'none';
        teamNameBetaDisplay.style.display = 'inline-block';
    } else {
        console.error('Элементы change-team-name-beta, new-team-name-beta или team-name-beta не найдены');
    }

    const changeTeamNameAlpha = document.getElementById('change-team-name-alpha');
    const newTeamNameAlpha = document.getElementById('new-team-name-alpha');
    const teamNameAlphaDisplay = document.getElementById('team-name-alpha');

    if (changeTeamNameAlpha && newTeamNameAlpha && teamNameAlphaDisplay) {
        changeTeamNameAlpha.style.display = isAlphaLeader ? 'inline-block' : 'none';
        newTeamNameAlpha.style.display = 'none';
        teamNameAlphaDisplay.style.display = 'inline-block';
    } else {
        console.error('Элементы change-team-name-alpha, new-team-name-alpha или team-name-alpha не найдены');
    }

    // Проверяем, является ли текущий пользователь создателем комнаты
    const settingsButton = document.getElementById('settingsButton');
    if (settingsButton) {
        const isCreator = window.isCreator; // Предположим, что isCreator передается с сервера
        settingsButton.style.display = isCreator ? 'block' : 'none';
    } else {
        console.error('Элемент settingsButton не найден');
    }
        // Обновление видимости чата
    updateChatVisibility();
}

function toggleSettings() {
    const settingsPopup = document.getElementById('settingsPopup');
    if (settingsPopup.style.display === 'none' || settingsPopup.style.display === '') {
        settingsPopup.style.display = 'block';
        document.addEventListener('click', closeSettingsOnClickOutside);
    } else {
        settingsPopup.style.display = 'none';
        document.removeEventListener('click', closeSettingsOnClickOutside);
    }
}

function closeSettingsOnClickOutside(event) {
    const settingsPopup = document.getElementById('settingsPopup');
    const settingsButton = document.getElementById('settingsButton');

    if (!settingsPopup.contains(event.target) && !settingsButton.contains(event.target)) {
        settingsPopup.style.display = 'none';
        document.removeEventListener('click', closeSettingsOnClickOutside);
    }
}

function showNicknamePopup() {

    const nicknamePopup = document.getElementById('nicknamePopup');
    nicknamePopup.style.display = 'flex';

    document.getElementById('selectedColorIndicator').style.backgroundColor = selectedColor;

    document.getElementById('gameWrapper').classList.add('hidden');

    const nicknameInput = document.getElementById('nicknameInput');
    nicknameInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            submitNickname();
        }
    });
}

function saveSettings() {
    const leaderTime = document.getElementById('leader-time').value;
    const answerTime = document.getElementById('answer-time').value;
    const bonusTime = document.getElementById('bonus-time').value;
    const roundsCount = document.getElementById('rounds-count').value;
    const difficultyLevel = document.getElementById('difficulty-level').value;

    socket.emit('updateSettings', { leaderTime, answerTime, bonusTime, roundsCount, difficultyLevel });
    showToast("Настройки сохранены", "#2ecc71");
    toggleSettings();
}

socket.on('startLeaderTimer', (time) => {
    console.log('Запуск таймера для капитана:', time);
    startLeaderTimer(time);
});

socket.on('updateRoundDisplay', (data) => {
    console.log('Обновление отображения раунда:', data);
    updateRoundDisplay(data.currentRound, data.currentTurn);
});

socket.on('error', (message) => {
    showToast(message, "#e74c3c"); // Показываем сообщение об ошибке
});

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('roomCreated', (roomName) => {
    console.log(`Комната "${roomName}" создана`);
    currentRoom = roomName;
    console.log(`Текущая комната: ${currentRoom}`);
    updateRoomNameDisplay(roomName);
    hideNicknamePopup();
});

socket.on('roomJoined', (roomName) => {
    console.log(`Присоединился к комнате "${roomName}"`);
    currentRoom = roomName;
    console.log(`Текущая комната: ${currentRoom}`);
    updateRoomNameDisplay(roomName);

    if (selectedColor) {
        socket.emit('selectColor', selectedColor);
    }
});

socket.on('error', (message) => {
    showToast(message, "#e74c3c"); // Показываем сообщение об ошибке
});

socket.on('updateTimer', (data) => {
    console.log(`Таймер обновлен на ${data.time} секунд`);
    resetTimer(data.time); // Сбрасываем таймер до нового значения
});

socket.on('updatePlayers', (players) => {
    console.log('Получен список игроков:', players);
    updatePlayersList(players);
});

socket.on('newRoundStarted', (team) => {
    console.log(`Новый раунд начался для команды ${team}`);

    // Восстанавливаем поле ввода и кнопку отправки для капитана
    const chatInputContainer = document.getElementById(`chatInputContainer${team.charAt(0).toUpperCase() + team.slice(1)}`);
    if (chatInputContainer) {
        chatInputContainer.style.display = 'flex'; // Показываем поле ввода и кнопку
    }
});

// Обработчик события messageSent
socket.on('messageSent', (data) => {
    const chatInputContainer = document.getElementById(`chatInputContainer${data.team.charAt(0).toUpperCase() + data.team.slice(1)}`);
    if (chatInputContainer) {
        chatInputContainer.style.display = 'none'; // Скрываем поле ввода
    }
});

// Обработка ошибки "Комната уже существует"
socket.on('roomExists', (roomName) => {
    showToast(`Комната "${roomName}" уже существует. Выберите другое название.`, "#e74c3c");
});

// Обработка успешного присоединения к комнате
socket.on('roomJoined', (roomName) => {
    showToast(`Добро пожаловать, ${nickname}!`, "#2ecc71");
    hideNicknamePopup(); // Скрываем попап только после успешного присоединения
    updateUI();
});

// Обработка успешного создания комнаты
socket.on('roomCreated', (roomName) => {
    showToast(`Добро пожаловать, ${nickname}!`, "#2ecc71");
    hideNicknamePopup(); // Скрываем попап только после успешного создания
    updateUI();
});

// Обработка ошибки "Комната не найдена"
socket.on('roomNotFound', (roomId) => {
    showToast(`Комната "${roomId}" не существует. Проверьте правильность ввода.`, "#e74c3c");
});

// Обработка ошибки "Комната не найдена"
socket.on('roomNotFound', (roomId) => {
    showToast(`Комната "${roomId}" не существует. Проверьте правильность ввода.`, "#e74c3c");
});

// Обработка получения сообщения
socket.on('receiveMessage', (data) => {
    const chatBox = document.getElementById(`chatBox${data.team.charAt(0).toUpperCase() + data.team.slice(1)}`);
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.sender}: ${data.message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Прокрутка вниз
});

socket.on('updateGameState', (gameState) => {
    console.log('Received game state:', gameState);
    window.words = gameState.words || [];
    cardColors = gameState.cardColors || {};
    leaders = gameState.leaders || {};
    players = gameState.teamPlayers || {};
    teamNames = gameState.teamNames || {};
    window.canAssistantsSelectCards = gameState.canAssistantsSelectCards || false;
    window.canCaptainChat = gameState.canCaptainChat || { alpha: true, beta: true };

    // Обновляем текущий ход
    currentTurn = gameState.currentTurn || 'beta';
    hasSentMessage = gameState.hasSentMessage || false;

    // Обновляем интерфейс
    updateUI();

    // Если есть слова, обновляем доску
    if (window.words && window.words.length > 0) {
        createBoard(window.words);
    }

    // Обновляем состояние карт
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const word = card.querySelector('.card-text').textContent;
        const cardState = gameState.board.find(c => c.word === word);
        if (cardState && cardState.isDisabled) {
            card.classList.add('disabled');
            card.removeEventListener('click', handleCardClick);
        }
    });

    // Обновляем отображение раунда
    updateRoundDisplay();
});

function updatePlayersList(players) {
    const playersListContainer = document.getElementById('playersList');
    if (!playersListContainer) {
        console.error('Элемент для отображения списка игроков не найден');
        return;
    }

    playersListContainer.innerHTML = '';

    players.forEach(player => {
        const playerElement = document.createElement('div');
        playerElement.textContent = player.nickname;
        playerElement.style.color = player.color || '#000';
        playersListContainer.appendChild(playerElement);
    });
}

let isNicknameErrorShown = false; // Флаг для отслеживания показа сообщения об ошибке

let isRoomErrorShown = false; // Флаг для отслеживания показа сообщения об ошибке для комнаты


function submitNickname() {
    const nicknameInput = document.getElementById('nicknameInput');
    const nicknameValue = nicknameInput.value.trim();
    const createRoomInput = document.getElementById('createRoomInput').value.trim();
    const joinRoomInput = document.getElementById('joinRoomInput').value.trim();

    // Проверка на пустой никнейм
    if (!nicknameValue) {
        if (!isNicknameErrorShown) {
            showToast("Пожалуйста, введите ваш никнейм.", "#e74c3c");
            isNicknameErrorShown = true;
        }
        return;
    }

    // Сбрасываем флаг, если никнейм введен
    isNicknameErrorShown = false;

    // Проверка на пустые поля создания и присоединения к комнате
    if (!createRoomInput && !joinRoomInput) {
        if (!isRoomErrorShown) {
            showToast("Введите название комнаты или ID комнаты для присоединения.", "#e74c3c");
            isRoomErrorShown = true;
        }
        return;
    }

    // Сбрасываем флаг, если поля для комнаты заполнены
    isRoomErrorShown = false;

    // Сохраняем никнейм
    nickname = nicknameValue;

    // Если введено название комнаты, создаем комнату
    if (createRoomInput) {
        socket.emit('createRoom', createRoomInput, nicknameValue, selectedColor);
    }
    // Если введен ID комнаты, присоединяемся к комнате
    else if (joinRoomInput) {
        socket.emit('joinRoom', joinRoomInput, nicknameValue, selectedColor);
    }
}

function createRoom() {
    const nicknameInput = document.getElementById('nicknameInput');
    const nicknameValue = nicknameInput.value.trim();
    const roomName = document.getElementById('createRoomInput').value.trim();

    if (!nicknameValue) {
        showToast("Пожалуйста, введите ваш никнейм.", "#e74c3c");
        return;
    }

    if (roomName) {
        socket.emit('createRoom', roomName, nicknameValue, selectedColor);
    } else {
        showToast("Пожалуйста, введите название комнаты", "#e74c3c");
    }
}

function joinRoom() {
    const roomId = document.getElementById('joinRoomInput').value.trim();
    if (roomId) {
        socket.emit('joinRoom', roomId, nickname, selectedColor);
    } else {
        showToast("Пожалуйста, введите ID комнаты", "#e74c3c");
    }
}

function updateRoomNameDisplay(roomName) {
    const roomNameDisplay = document.getElementById('roomNameDisplay');
    if (roomNameDisplay) {
        roomNameDisplay.textContent = `Комната: ${roomName}`;
    } else {
        console.error('Элемент для отображения названия комнаты не найден');
    }
}

function hideNicknamePopup() {
    const nicknamePopup = document.getElementById('nicknamePopup');
    if (nicknamePopup) {
        nicknamePopup.style.display = 'none';
    }

    const gameWrapper = document.getElementById('gameWrapper');
    if (gameWrapper) {
        gameWrapper.classList.remove('hidden');
    }
}

function selectColor(color) {
    selectedColor = color;
    document.querySelectorAll('.color-option').forEach(option => {
        option.style.border = option.style.backgroundColor === selectedColor ? '2px solid #00ff0d' : '2px solid #ffffff';
    });
    document.getElementById('selectedColorIndicator').style.backgroundColor = selectedColor;

    if (currentRoom) {
        socket.emit('selectColor', color);
    }
}


function skipTurn(team) {
    if (!currentRoom) {
        showToast("Вы еще не присоединились к комнате", "#e74c3c");
        return;
    }

    const isAssistant = (players['beta'] && players['beta'].some(player => player.name === nickname)) ||
                        (players['alpha'] && players['alpha'].some(player => player.name === nickname));

    if (!isAssistant) {
        showToast("Только помощники могут пропускать ход", "#e74c3c");
        return;
    }

    // Останавливаем текущий таймер
    stopTimer();

    // Переключаем ход на капитана противоположной команды
    const newTeam = currentTeam === 'beta' ? 'alpha' : 'beta';
    changeTurn(newTeam); // Смена хода

    showToast(`Ход команды ${team.toUpperCase()} пропущен`, "#2ecc71");
}

// Функция отправки сообщения
function sendMessage(team) {
    const chatInput = document.getElementById(`chatInput${team.charAt(0).toUpperCase() + team.slice(1)}`);
    const message = chatInput.value.trim();

    if (message) {
        const isLeader = (leaders['beta'] && leaders['beta'].name === nickname) || 
                         (leaders['alpha'] && leaders['alpha'].name === nickname);

        if (isLeader) {
            // Проверяем, что капитан пишет в свой ход
            if (currentTeam !== team) {
                showToast("Капитан не может писать в чат, пока не его ход", "#e74c3c");
                return;
            }

            // Проверяем, отправил ли капитан уже сообщение в этом раунде
            if (hasSentMessage) {
                showToast("Капитан уже отправил сообщение в этом раунде", "#e74c3c");
                return;
            }

            // Отправляем сообщение на сервер
            socket.emit('sendMessage', { message, sender: nickname, team }, currentRoom);

            // Очищаем поле ввода
            chatInput.value = '';

            // Останавливаем текущий таймер
            stopTimer();

            // Переключаем ход на помощников текущей команды
            isCaptainTurn = false; // Теперь ходят помощники
            hasSentMessage = true; // Капитан отправил сообщение
            window.canAssistantsSelectCards = true; // Помощники могут выбирать карты

            // Обновляем отображение хода
            updateRoundDisplay();

            // Запускаем таймер для помощников с временем из "answer-time"
            startLeaderTimer();

            // Уведомляем сервер о смене хода
            socket.emit('changeTurn', { team, isCaptainTurn: false }, currentRoom);

            // Скрываем поле ввода для капитана
            window.canCaptainChat[team] = false;
            console.log(`Капитан команды ${team} отправил сообщение. canCaptainChat[${team}] = false`);

            // Обновляем видимость чатов и полей ввода
            updateChatVisibility();
        } else {
            showToast("Только капитан может отправлять сообщения", "#e74c3c");
        }
    } else {
        showToast("Сообщение не может быть пустым", "#e74c3c");
    }
}

function resetTimer(newTime) {

    // Останавливаем текущий таймер
    if (timer) {
        clearInterval(timer);
    }

    // Запускаем новый таймер
    startLeaderTimer(newTime);
}

// Обновление видимости чата
function updateChatVisibility() {
    const chatContainerBeta = document.getElementById('chatContainerBeta');
    const chatContainerAlpha = document.getElementById('chatContainerAlpha');
    const chatInputContainerBeta = document.getElementById('chatInputContainerBeta');
    const chatInputContainerAlpha = document.getElementById('chatInputContainerAlpha');

    console.log(`Обновление видимости чатов. canCaptainChat:`, window.canCaptainChat);

        // Показываем чаты только после старта игры
    if (chatContainerBeta && chatContainerAlpha) {
        chatContainerBeta.style.display = 'block';
        chatContainerAlpha.style.display = 'block';
    }

    // Поле ввода и кнопка отправки только для капитанов
    const isBetaLeader = leaders['beta'] && leaders['beta'].name === nickname;
    const isAlphaLeader = leaders['alpha'] && leaders['alpha'].name === nickname;

    console.log(`Проверка роли капитана: isBetaLeader=${isBetaLeader}, isAlphaLeader=${isAlphaLeader}`);

    if (chatInputContainerBeta) {
        const shouldShowBeta = isBetaLeader && currentTeam === 'beta' && window.canCaptainChat?.beta;
        chatInputContainerBeta.style.display = shouldShowBeta ? 'flex' : 'none';
    }
    if (chatInputContainerAlpha) {
        const shouldShowAlpha = isAlphaLeader && currentTeam === 'alpha' && window.canCaptainChat?.alpha;
        chatInputContainerAlpha.style.display = shouldShowAlpha ? 'flex' : 'none';
    }

    // Скрываем кнопку "Пропустить ход" для капитанов и отображаем её только для помощников своей команды
    const skipTurnButtonBeta = document.querySelector('#chatContainerBeta .skip-turn-button');
    const skipTurnButtonAlpha = document.querySelector('#chatContainerAlpha .skip-turn-button');

    if (skipTurnButtonBeta) {
        // Показываем кнопку только для помощников команды Бета
        const isBetaAssistant = players['beta'] && players['beta'].some(player => player.name === nickname);
        skipTurnButtonBeta.style.display = isBetaAssistant ? 'block' : 'none';
    }
    if (skipTurnButtonAlpha) {
        // Показываем кнопку только для помощников команды Альфа
        const isAlphaAssistant = players['alpha'] && players['alpha'].some(player => player.name === nickname);
        skipTurnButtonAlpha.style.display = isAlphaAssistant ? 'block' : 'none';
    }
}


function showToast(message, backgroundColor, isCentered = false, isVictory = false) {
    if (isCentered) {
        // Создаем элемент для центрированного сообщения
        const centeredMessage = document.createElement('div');
        centeredMessage.className = 'centered-message';
        if (isVictory) {
            centeredMessage.classList.add('victory'); // Добавляем класс для сообщения о победе
        }
        centeredMessage.textContent = message;
        centeredMessage.style.backgroundColor = backgroundColor;

        // Добавляем сообщение в body
        document.body.appendChild(centeredMessage);

        // Удаляем сообщение через 8 секунд
        setTimeout(() => {
            document.body.removeChild(centeredMessage);
        }, 8000); // Сообщение исчезнет через 8 секунд
    } else {
        // Стандартный Toastify для обычных сообщений
        Toastify({
            text: message,
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
                background: backgroundColor
            },
            stopOnFocus: true
        }).showToast();
    }
}

window.onload = function() {
    const leaderTime = localStorage.getItem('leaderTime') || 120;
    const answerTime = localStorage.getItem('answerTime') || 60;
    const bonusTime = localStorage.getItem('bonusTime') || 15;
    const roundsCount = localStorage.getItem('roundsCount') || 5;
    const difficultyLevel = localStorage.getItem('difficultyLevel') || 'easy';

    document.getElementById('leader-time').value = leaderTime;
    document.getElementById('answer-time').value = answerTime;
    document.getElementById('bonus-time').value = bonusTime;
    document.getElementById('rounds-count').value = roundsCount;
    document.getElementById('difficulty-level').value = difficultyLevel;

    showNicknamePopup();
};
