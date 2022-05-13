const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const sequelize = require('./db');
const UserModel = require('./models');

const token = '5360836208:AAHQbUXh_1452flwVmZ2Qvd05ZRbjzI-qzs'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Guess the number from 0 to 9!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Press the Number!', gameOptions);
}

const start = async () => {

    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log('error connetion', e)
    }


    bot.setMyCommands([
        {command: '/start', description: 'Welcome'},
        {command: '/info', description: 'Information about person'},
        {command: '/game', description: 'Guess the number'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try{
            if (text === '/start') {
                await UserModel.creat({chatId})
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/6ab/72c/6ab72caf-009b-4997-beeb-7f4901bade09/4.jpg')
                return bot.sendMessage(chatId, `Welcome, Human! ${text}`)
            }
            if (text === '/info') {
                const user = await UserModel.findOne({chatId})
                return bot.sendMessage(chatId, `Your Name Is ${msg.from.first_name} ${msg.from.last_name}, correct answers ${user.right}, wrong answers ${user.wrong}`);
            }
            if (text === '/game') {
                return startGame(chatId);
            }
            return bot.sendMessage(chatId, 'Dont text me, Human!')
        } catch (e) {
            return bot.sendMessage(chatId, 'Error happend!');
        }
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        const user = await UserModel.findOne({chatId})
        if (data == chats[chatId]) {
            user.right += 1;
            await bot.sendMessage(chatId, `Congrats! You WON ${chats[chatId]}`, againOptions)
        } else {
            user.wrong += 1;
            await bot.sendMessage(chatId, `Bot choose number! ${chats[chatId]}`, againOptions)
        }
        await user.save();
    })
}

start()
