const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 10000;


// Указываем путь к статическим файлам (папка codenames)
app.use(express.static(__dirname));

// Обработка корневого пути
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'codenames', 'index.html'));
});

// Хранение комнат
const rooms = {}; 

// Обработка подключения клиента

io.on('connection', (socket) => {
    console.log('Пользователь подключен:', socket.id);


    socket.on('startNewRound', (team, room) => {
        if (rooms[room]) {
            // Сбрасываем флаг, чтобы капитан мог отправить новое сообщение
            rooms[room].hasSentMessage = false;
            // Восстанавливаем возможность писать в чат для капитана
            rooms[room].canCaptainChat[team] = true;
            io.to(room).emit('updateGameState', rooms[room]);
            io.to(room).emit('newRoundStarted', team); // Уведомляем клиентов о начале нового раунда
        }
    });

    socket.on('selectCard', (data, room) => {
        console.log("Карта выбрана на сервере:", data);
        console.log(`Текущее состояние карт перед выбором:`, rooms[room].board);
    
        if (rooms[room]) {
            // Проверяем, могут ли помощники выбирать карты
            if (!rooms[room].canAssistantsSelectCards) {
                console.log("Помощники не могут выбирать карты, пока капитан не отправит сообщение");
                socket.emit('error', 'Помощники не могут выбирать карты, пока капитан не отправит сообщение');
                return;
            }
    
            // Проверяем, что помощники выбирают карты только в свой ход
            const isAssistant = (rooms[room].teamPlayers['beta'] && rooms[room].teamPlayers['beta'].some(player => player.name === data.player)) ||
                                (rooms[room].teamPlayers['alpha'] && rooms[room].teamPlayers['alpha'].some(player => player.name === data.player));
    
            if (isAssistant && rooms[room].currentTurn !== data.team) {
                console.log("Помощники не могут выбирать карты, пока не их ход");
                socket.emit('error', 'Помощники не могут выбирать карты, пока не их ход');
                return;
            }
    
            // Находим карту на доске
            const card = rooms[room].board.find(card => card.word === data.word);
            if (card) {
                const cardColor = card.color;
    
                // Блокируем карту независимо от её цвета
                card.isSelected = true;
                card.isDisabled = true;
    
                // Отправляем обновленное состояние всем клиентам
                io.to(room).emit('updateGameState', rooms[room]);
    
                // Если карта не принадлежит команде помощника, меняем ход
                if ((cardColor === 'blue' && data.team === 'alpha') || 
                    (cardColor === 'red' && data.team === 'beta') || 
                    cardColor === 'neutral') {
                    console.log(`Помощник выбрал карту не своей команды: ${data.word}, цвет: ${cardColor}, текущая команда: ${data.team}`);
    
                    // Смена хода на капитана противоположной команды
                    const newTeam = data.team === 'beta' ? 'alpha' : 'beta';
                    changeTurn(newTeam, room);
    
                    // Уведомляем клиентов о смене хода
                    io.to(room).emit('turnSkipped', { team: newTeam });
                    io.to(room).emit('newRoundStarted', newTeam);
                }
            }
        }
    });

    socket.on('cardSelected', (data, room) => {
        if (rooms[room]) {
            const card = rooms[room].board.find(card => card.word === data.word);
            if (card) {
                card.isSelected = true;
                card.isDisabled = true; // Блокируем карту
            }
            io.to(room).emit('updateGameState', rooms[room]);
        }
    });
    
    socket.on('resetTimer', (data, room) => {
        if (rooms[room]) {
            console.log(`Таймер сброшен до ${data.time} секунд в комнате ${room}`);
            io.to(room).emit('updateTimer', { time: data.time }); // Отправляем новое время всем клиентам
        }
    });

    socket.on('updateGameState', (gameState) => {
        console.log('Received game state:', gameState);
    
        window.words = gameState.words || [];
        cardColors = gameState.cardColors || {};
        leaders = gameState.leaders || {};
        players = gameState.teamPlayers || {};
        teamNames = gameState.teamNames || {};
        window.canAssistantsSelectCards = gameState.canAssistantsSelectCards || false;
    
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
        updateRoundDisplay(); // <-- Добавлено здесь
    });

    socket.on('createRoom', (roomName, nickname, color) => {
        if (rooms[roomName]) {
            socket.emit('roomExists', roomName);
            return;
        }
    
        rooms[roomName] = {
            creator: socket.id,
            players: [{ id: socket.id, nickname, color }],
            leaders: {},
            board: [],
            settings: {},
            teamNames: { alpha: 'Альфа', beta: 'Бета' },
            teamPlayers: { alpha: [], beta: [] },
            canCaptainChat: { alpha: true, beta: true }, // Флаг для возможности писать в чат
            hasSentMessage: false, // Флаг для отслеживания отправки сообщения капитаном
            canAssistantsSelectCards: false, // Флаг для блокировки выбора карт помощниками
            isGameStarted: false // Флаг для отслеживания состояния игры
        };
        socket.join(roomName);
    
        io.to(roomName).emit('updatePlayers', rooms[roomName].players);
        io.to(roomName).emit('updateGameState', rooms[roomName]);
        io.to(roomName).emit('roomCreated', roomName);
        console.log(`Комната ${roomName} создана для пользователя ${nickname}`);
    });
    
    socket.on('sendMessage', (data, room) => {
        if (rooms[room]) {
            const isLeader = (rooms[room].leaders['beta'] && rooms[room].leaders['beta'].name === data.sender) || 
                             (rooms[room].leaders['alpha'] && rooms[room].leaders['alpha'].name === data.sender);
    
            // Проверяем, что капитан пишет в свой ход
            if (isLeader && rooms[room].currentTurn !== data.team) {
                socket.emit('error', 'Капитан не может писать в чат, пока не его ход');
                return;
            }
    
            // Проверяем, отправил ли капитан уже сообщение в этом раунде
            if (isLeader && rooms[room].hasSentMessage) {
                socket.emit('error', 'Капитан может отправить только одно сообщение за раунд');
                return;
            }
    
            // Устанавливаем флаг, что капитан отправил сообщение
            if (isLeader) {
                rooms[room].hasSentMessage = true;
                rooms[room].canAssistantsSelectCards = true;
                rooms[room].canCaptainChat[data.team] = false; // Скрываем поле ввода для капитана
                console.log(`Капитан команды ${data.team} отправил сообщение. canCaptainChat[${data.team}] = false`);
            }
    
            // Отправляем обновленное состояние всем участникам комнаты
            io.to(room).emit('updateGameState', rooms[room]);
            io.to(room).emit('receiveMessage', data);
            io.to(room).emit('messageSent', { team: data.team });
        }
    });
    

    socket.on('joinRoom', (roomId, nickname, color) => {
        console.log(`Пользователь ${nickname} пытается присоединиться к комнате ${roomId}`);
    
        // Проверка, существует ли комната с таким ID
        if (!rooms[roomId]) {
            console.log(`Комната ${roomId} не существует`);
            socket.emit('roomNotFound', roomId); // Отправляем ошибку клиенту
            return;
        }
    
        // Присоединяем пользователя к комнате
        rooms[roomId].players.push({ id: socket.id, nickname, color });
        socket.join(roomId);
    
        // Отправляем обновленный список игроков всем участникам комнаты
        io.to(roomId).emit('updatePlayers', rooms[roomId].players);
    
        // Всегда отправляем текущее состояние игры новому пользователю
        socket.emit('updateGameState', rooms[roomId]);
    
        // Отправляем подтверждение о присоединении к комнате
        socket.emit('roomJoined', roomId);
        console.log(`Пользователь ${nickname} присоединился к комнате ${roomId}`);
    });
    
    function clearRole(team, player, room) {
        if (rooms[room].leaders[team] && rooms[room].leaders[team].name === player) {
            rooms[room].leaders[team] = null;
            console.log(`Очищен лидер команды ${team} для игрока ${player} в комнате ${room}`);
        }
        if (rooms[room].teamPlayers[team]) {
            rooms[room].teamPlayers[team] = rooms[room].teamPlayers[team].filter(p => p.name !== player);
            console.log(`Очищены помощники команды ${team} для игрока ${player} в комнате ${room}`);
        }
    }
    
    socket.on('setLeader', (team, player, color, room) => {
        console.log(`Запрос на назначение лидера: team=${team}, player=${player}, room=${room}`);
    
        if (!rooms[room]) {
            console.log(`Комната ${room} не найдена при назначении лидера`);
            socket.emit('error', 'Комната не найдена');
            return;
        }
    
        clearRole('beta', player, room);
        clearRole('alpha', player, room);
    
        rooms[room].leaders[team] = { name: player, color };
        console.log(`Обновлены лидеры комнаты ${room}:`, rooms[room].leaders);
    
        io.to(room).emit('updateGameState', rooms[room]);
    });
    
    socket.on('setPlayer', (team, player, color, slotNumber, room) => {
        console.log(`Запрос на назначение помощника: team=${team}, player=${player}, slotNumber=${slotNumber}, room=${room}`);
    
        if (!rooms[room]) {
            console.log(`Комната ${room} не найдена при назначении помощника`);
            socket.emit('error', 'Комната не найдена');
            return;
        }
    
        console.log(`Текущее состояние комнаты ${room} перед назначением помощника:`, rooms[room]);
    
        // Очистка ролей игрока в других командах
        clearRole('beta', player, room);
        clearRole('alpha', player, room);
    
        // Инициализация массива для команды, если он не существует
        if (!rooms[room].teamPlayers) {
            rooms[room].teamPlayers = { alpha: [], beta: [] };
            console.log(`Инициализирован объект teamPlayers для комнаты ${room}`);
        }
    
        if (!rooms[room].teamPlayers[team]) {
            rooms[room].teamPlayers[team] = [];
            console.log(`Инициализирован массив для команды ${team}`);
        }
    
        const existingSlot = rooms[room].teamPlayers[team].findIndex(p => p.name === player);
        if (existingSlot !== -1) {
            console.log(`Игрок ${player} уже находится в слоте ${existingSlot + 1} команды ${team}`);
            rooms[room].teamPlayers[team][slotNumber - 1] = rooms[room].teamPlayers[team][existingSlot];
            rooms[room].teamPlayers[team].splice(existingSlot, 1);
        } else {
            if (rooms[room].teamPlayers[team].length >= 2) {
                console.log(`Команда ${team} уже имеет максимальное количество помощников`);
                socket.emit('error', `Команда ${team} уже имеет максимальное количество помощников`);
                return;
            }
            console.log(`Добавлен помощник ${player} в слот ${slotNumber} команды ${team}`);
            rooms[room].teamPlayers[team][slotNumber - 1] = { name: player, color };
        }
    
        console.log(`Текущее состояние помощников команды ${team}:`, rooms[room].teamPlayers[team]);
        console.log(`Текущее состояние комнаты ${room} после назначения помощника:`, rooms[room]);
    
        // Отправка обновленного состояния игры всем участникам комнаты
        io.to(room).emit('updateGameState', rooms[room]);
    });

    socket.on('updateSettings', (settings) => {
        const room = Object.keys(socket.rooms)[1];
        if (room) {
            if (rooms[room]) {
                rooms[room].settings = settings;
                console.log(`Обновлены настройки комнаты ${room}:`, rooms[room].settings);
                io.to(room).emit('updateGameState', rooms[room]);
            } else {
                console.log(`Комната ${room} не найдена при обновлении настроек`);
            }
        } else {
            console.log('Пользователь еще не присоединился к комнате при обновлении настроек');
        }
    });

    socket.on('resetGame', (room) => {
        if (rooms[room]) {
            // Сброс состояния игры в комнате
            rooms[room].words = [];
            rooms[room].cardColors = {}; // Очищаем цвета карт
            rooms[room].canAssistantsSelectCards = false;
            rooms[room].hasSentMessage = false; // Сбрасываем флаг отправки сообщения
            rooms[room].isGameStarted = false; // Сбрасываем флаг начала игры
            rooms[room].isCaptainTurn = true; // Сбрасываем ход на капитана
            rooms[room].currentTeam = 'beta'; // Сбрасываем текущую команду на Бету
    
            // Сброс таймера и раунда
            rooms[room].currentRound = 1;
            rooms[room].timer = null;
    
            // Очистка состояния карточек
            rooms[room].board = [];
    
            // Отправка обновленного состояния всем клиентам
            io.to(room).emit('updateGameState', rooms[room]);
            console.log(`Игра в комнате ${room} сброшена до начального состояния`);
        }
    });

    socket.on('skipTurn', (data, room) => {
        if (rooms[room]) {
            // Логика для пропуска хода
            console.log(`Ход команды ${data.team} пропущен игроком ${data.player}`);
            io.to(room).emit('turnSkipped', { team: data.team });
        }
    });

    socket.on('selectColor', (color) => {
        const room = Object.keys(socket.rooms)[1];
        if (room) {
            if (rooms[room]) {
                const player = rooms[room].players.find(p => p.id === socket.id);
                if (player) {
                    player.color = color;
                    console.log(`Цвет игрока ${player.nickname} в комнате ${room} изменен на ${color}`);
                    io.to(room).emit('updatePlayers', rooms[room].players);
                } else {
                    console.log(`Игрок с id ${socket.id} не найден в комнате ${room}`);
                }
            } else {
                console.log(`Комната ${room} не найдена при выборе цвета`);
            }
        } else {
            console.log('Пользователь еще не присоединился к комнате при выборе цвета');
        }
    });

    socket.on('changeTeamName', (team, newName, room) => {
        console.log(`Запрос на изменение названия команды: team=${team}, newName=${newName}, room=${room}`);
    
        if (!rooms[room]) {
            console.log(`Комната ${room} не найдена при изменении названия команды`);
            socket.emit('error', 'Комната не найдена');
            return;
        }
    
        rooms[room].teamNames[team] = newName;
        console.log(`Название команды ${team} в комнате ${room} изменено на ${newName}`);
        io.to(room).emit('updateGameState', rooms[room]);
    });

    // Обработка начала игры
    socket.on('startGame', (gameState, room) => {
        if (rooms[room]) {
            const isBetaLeaderSet = rooms[room].leaders['beta'] && rooms[room].leaders['beta'].name;
            const isAlphaLeaderSet = rooms[room].leaders['alpha'] && rooms[room].leaders['alpha'].name;
            const isBetaPlayersSet = rooms[room].teamPlayers['beta'] && rooms[room].teamPlayers['beta'].length > 0;
            const isAlphaPlayersSet = rooms[room].teamPlayers['alpha'] && rooms[room].teamPlayers['alpha'].length > 0;

            const isAnySlotOccupied = isBetaLeaderSet || isAlphaLeaderSet || isBetaPlayersSet || isAlphaPlayersSet;

            if (!isAnySlotOccupied) {
                console.log(`Ни один слот не заполнен в комнате ${room}`);
                socket.emit('error', 'Необходимо назначить хотя бы одного игрока (капитана или помощника).');
                return;
            }

            rooms[room].isGameStarted = true;
            rooms[room].canCaptainChat = { alpha: true, beta: true };
            rooms[room].hasSentMessage = false;
            rooms[room].words = gameState.words;
            rooms[room].cardColors = gameState.cardColors;
            rooms[room].currentTurn = 'beta';

            io.to(room).emit('updateGameState', rooms[room]);
            console.log(`Игра в комнате ${room} началась с состоянием:`, gameState);
        }
    });

    // Обработка смены хода
    socket.on('changeTurn', (newTeam, room) => {
        if (rooms[room]) {
            rooms[room].currentTurn = newTeam;
            rooms[room].hasSentMessage = false;
            rooms[room].canCaptainChat[newTeam] = true;

            rooms[room].board.forEach(card => {
                if (card.isSelected) {
                    card.isDisabled = true;
                }
            });

            io.to(room).emit('updateGameState', rooms[room]);
            console.log(`Ход перешел к команде ${newTeam}`);
        }
    });
    
    socket.on('shuffleBoard', (gameState, room) => {
        if (rooms[room]) {
            // Проверка, есть ли карты для перемешивания
            if (!gameState.words || gameState.words.length === 0) {
                console.log(`Нет карт для перемешивания в комнате ${room}`);
                socket.emit('error', 'Нет карт для перемешивания');
                return;
            }
    
            rooms[room].words = gameState.words;
            rooms[room].cardColors = gameState.cardColors;
            console.log(`Доска в комнате ${room} перемешана с состоянием:`, gameState);
            io.to(room).emit('updateGameState', rooms[room]);
        }
    });
    // Обработка отключения клиента
    socket.on('disconnect', () => {
        console.log('Пользователь отключен:', socket.id);

        for (const roomName in rooms) {
            rooms[roomName].players = rooms[roomName].players.filter(player => player.id !== socket.id);

            if (rooms[roomName].players.length === 0) {
                delete rooms[roomName];
                console.log(`Комната ${roomName} удалена из-за отключения последнего игрока`);
            } else {
                io.to(roomName).emit('updatePlayers', rooms[roomName].players);
                console.log(`Обновлен список игроков в комнате ${roomName}:`, rooms[roomName].players);
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
