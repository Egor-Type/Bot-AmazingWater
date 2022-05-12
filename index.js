const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5360836208:AAHQbUXh_1452flwVmZ2Qvd05ZRbjzI-qzs'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Guess the number from 0 to 9!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Press the Number!', gameOptions);
}

const start = () => {
    bot.setMyCommands( [
        {command: '/start', description: 'Welcome'},
        {command: '/info', description: 'Information about person'},
        {command: '/game', description: 'Guess the number'},
    ])
    
    bot.on('message',async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start') {
            await bot.sendSticker(chatId, `https://tlgrm.ru/_/stickers/6ab/72c/6ab72caf-009b-4997-beeb-7f4901bade09/4.jpg`)
            return bot.sendMessage(chatId, `Welcome, Human! ${text}`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Your Name Is ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Dont text me, Human!')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `Congrats! You WON ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Bot choose number! ${chats[chatId]}`, againOptions)
        }
    })
}

start()
