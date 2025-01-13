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

    // Обработка начала нового раунда
    socket.on('startNewRound', (team, room) => {
        if (rooms[room]) {
            rooms[room].hasSentMessage = false;
            rooms[room].canCaptainChat[team] = true;
            io.to(room).emit('updateGameState', rooms[room]);
            io.to(room).emit('newRoundStarted', team);
        }
    });

    // Обработка выбора карты
    socket.on('selectCard', (data, room) => {
        if (rooms[room]) {
            if (!rooms[room].canAssistantsSelectCards) {
                socket.emit('error', 'Помощники не могут выбирать карты, пока капитан не отправит сообщение');
                return;
            }

            const isAssistant = (rooms[room].teamPlayers['beta'] && rooms[room].teamPlayers['beta'].some(player => player.name === data.player)) ||
                                (rooms[room].teamPlayers['alpha'] && rooms[room].teamPlayers['alpha'].some(player => player.name === data.player));

            if (isAssistant && rooms[room].currentTurn !== data.team) {
                socket.emit('error', 'Помощники не могут выбирать карты, пока не их ход');
                return;
            }

            const card = rooms[room].board.find(card => card.word === data.word);
            if (card) {
                const cardColor = card.color;
                card.isSelected = true;
                card.isDisabled = true;

                io.to(room).emit('updateGameState', rooms[room]);

                if ((cardColor === 'blue' && data.team === 'alpha') || 
                    (cardColor === 'red' && data.team === 'beta') || 
                    cardColor === 'neutral') {
                    const newTeam = data.team === 'beta' ? 'alpha' : 'beta';
                    changeTurn(newTeam, room);
                    io.to(room).emit('turnSkipped', { team: newTeam });
                    io.to(room).emit('newRoundStarted', newTeam);
                }
            }
        }
    });

    // Обработка сброса таймера
    socket.on('resetTimer', (data, room) => {
        if (rooms[room]) {
            io.to(room).emit('updateTimer', { time: data.time });
        }
    });

    // Обработка создания комнаты
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
            canCaptainChat: { alpha: true, beta: true },
            hasSentMessage: false,
            canAssistantsSelectCards: false,
            isGameStarted: false,
            currentTurn: 'beta',
            currentRound: 1,
            timer: null
        };

        socket.join(roomName);
        io.to(roomName).emit('updatePlayers', rooms[roomName].players);
        io.to(roomName).emit('updateGameState', rooms[roomName]);
        io.to(roomName).emit('roomCreated', roomName);
        console.log(`Комната ${roomName} создана для пользователя ${nickname}`);
    });

    // Обработка присоединения к комнате
    socket.on('joinRoom', (roomId, nickname, color) => {
        if (!rooms[roomId]) {
            socket.emit('roomNotFound', roomId);
            return;
        }

        rooms[roomId].players.push({ id: socket.id, nickname, color });
        socket.join(roomId);

        io.to(roomId).emit('updatePlayers', rooms[roomId].players);

        const gameState = {
            words: rooms[roomId].words,
            cardColors: rooms[roomId].cardColors,
            leaders: rooms[roomId].leaders,
            teamPlayers: rooms[roomId].teamPlayers,
            teamNames: rooms[roomId].teamNames,
            canAssistantsSelectCards: rooms[roomId].canAssistantsSelectCards,
            canCaptainChat: rooms[roomId].canCaptainChat,
            hasSentMessage: rooms[roomId].hasSentMessage,
            currentTurn: rooms[roomId].currentTurn,
            currentRound: rooms[roomId].currentRound,
            timer: rooms[roomId].timer,
            board: rooms[roomId].board,
            isGameStarted: rooms[roomId].isGameStarted,
            settings: rooms[roomId].settings
        };

        socket.emit('updateGameState', gameState);

        if (rooms[roomId].isGameStarted) {
            socket.emit('startLeaderTimer', rooms[roomId].settings.leaderTime || 60);
            socket.emit('updateRoundDisplay', {
                currentRound: rooms[roomId].currentRound,
                currentTurn: rooms[roomId].currentTurn
            });
        }

        socket.emit('roomJoined', roomId);
    });

    // Обработка назначения лидера
    socket.on('setLeader', (team, player, color, room) => {
        if (!rooms[room]) {
            socket.emit('error', 'Комната не найдена');
            return;
        }

        clearRole('beta', player, room);
        clearRole('alpha', player, room);

        rooms[room].leaders[team] = { name: player, color };
        io.to(room).emit('updateGameState', rooms[room]);
    });

    // Обработка назначения помощника
    socket.on('setPlayer', (team, player, color, slotNumber, room) => {
        if (!rooms[room]) {
            socket.emit('error', 'Комната не найдена');
            return;
        }

        clearRole('beta', player, room);
        clearRole('alpha', player, room);

        if (!rooms[room].teamPlayers[team]) {
            rooms[room].teamPlayers[team] = [];
        }

        const existingSlot = rooms[room].teamPlayers[team].findIndex(p => p.name === player);
        if (existingSlot !== -1) {
            rooms[room].teamPlayers[team][slotNumber - 1] = rooms[room].teamPlayers[team][existingSlot];
            rooms[room].teamPlayers[team].splice(existingSlot, 1);
        } else {
            if (rooms[room].teamPlayers[team].length >= 2) {
                socket.emit('error', `Команда ${team} уже имеет максимальное количество помощников`);
                return;
            }
            rooms[room].teamPlayers[team][slotNumber - 1] = { name: player, color };
        }

        io.to(room).emit('updateGameState', rooms[room]);
    });

    // Обработка обновления настроек
    socket.on('updateSettings', (settings, room) => {
        if (rooms[room]) {
            rooms[room].settings = settings;
            io.to(room).emit('updateGameState', rooms[room]);
        }
    });

    // Обработка сброса игры
    socket.on('resetGame', (room) => {
        if (rooms[room]) {
            rooms[room].words = [];
            rooms[room].cardColors = {};
            rooms[room].canAssistantsSelectCards = false;
            rooms[room].hasSentMessage = false;
            rooms[room].isGameStarted = false;
            rooms[room].isCaptainTurn = true;
            rooms[room].currentTeam = 'beta';
            rooms[room].currentRound = 1;
            rooms[room].timer = null;
            rooms[room].board = [];

            io.to(room).emit('updateGameState', rooms[room]);
        }
    });

    // Обработка пропуска хода
    socket.on('skipTurn', (data, room) => {
        if (rooms[room]) {
            io.to(room).emit('turnSkipped', { team: data.team });
        }
    });

    // Обработка выбора цвета
    socket.on('selectColor', (color, room) => {
        if (rooms[room]) {
            const player = rooms[room].players.find(p => p.id === socket.id);
            if (player) {
                player.color = color;
                io.to(room).emit('updatePlayers', rooms[room].players);
            }
        }
    });

    // Обработка изменения названия команды
    socket.on('changeTeamName', (team, newName, room) => {
        if (rooms[room]) {
            rooms[room].teamNames[team] = newName;
            io.to(room).emit('updateGameState', rooms[room]);
        }
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
                socket.emit('error', 'Необходимо назначить хотя бы одного игрока (капитана или помощника).');
                return;
            }

            rooms[room].isGameStarted = true;
            rooms[room].canCaptainChat = { alpha: true, beta: true };
            rooms[room].hasSentMessage = false;
            rooms[room].words = gameState.words;
            rooms[room].cardColors = gameState.cardColors;
            rooms[room].currentTurn = 'beta';
            rooms[room].currentRound = 1;
            rooms[room].timer = null;

            io.to(room).emit('updateGameState', rooms[room]);
            io.to(room).emit('startLeaderTimer', rooms[room].settings.leaderTime || 60);
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
        }
    });

    // Обработка перемешивания доски
    socket.on('shuffleBoard', (gameState, room) => {
        if (rooms[room]) {
            if (!gameState.words || gameState.words.length === 0) {
                socket.emit('error', 'Нет карт для перемешивания');
                return;
            }

            rooms[room].words = gameState.words;
            rooms[room].cardColors = gameState.cardColors;
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
            }
        }
    });
});

// Функция для очистки роли игрока
function clearRole(team, player, room) {
    if (rooms[room].leaders[team] && rooms[room].leaders[team].name === player) {
        rooms[room].leaders[team] = null;
    }
    if (rooms[room].teamPlayers[team]) {
        rooms[room].teamPlayers[team] = rooms[room].teamPlayers[team].filter(p => p.name !== player);
    }
}

// Запуск сервера
server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});