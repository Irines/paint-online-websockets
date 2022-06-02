// импорт экспресс и создание приложения
const express = require('express')
// missleware cors
const cors = require('cors')
const app = express()
// импортируется ф-ция поэтому можем сразу в неё передать наше приложение
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()

// модули, чтобы делть файл из строки dataUrl
const fs = require('fs')
const path = require('path')

// port имп. из сист. переменных либо 5000
const PORT = process.env.PORT || 5000

app.use(cors())
// для того, чтобы app мог исп. json формат
app.use(express.json())


app.ws('/', (ws, req) => {
    console.log("ПОДКЛЮЧЕНИЕ УСТАНОВЛЕНО")
    // websocket не может принимать js объекты напрямую и нужно общаться в строковом формате
    ws.send("Ты успешно подключился")
    // Adds the listener function to the end of the listeners array for the event named eventName
    ws.on("message", (msg) => {
        msg = JSON.parse(msg)
        switch (msg.method) {
            case "connection":
                connectionHandler(ws, msg)
                break;
            case "draw":
                broadcastConnection(ws, msg)
                break;
            default:
                break;
        }
    })
})

// http запросы для синхранизации холста (если на нем что-то уже было нарисовано на одной сессии, но эту же сессию открыли в новой вкладке)
app.post('/image', (req, res) => {
    try {
        const data = req.body.img.replace(`data:image/png;base64,`, '')
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
        return res.status(200).json({message: "Загружено"})
    } catch (error) {
        console.log(error)
        return res.status(500).json('error')
    }
})

app.get('/image', (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
        const data = `data:image/png;base64,` + file.toString('base64')
        res.json(data)
    } catch (error) {
        console.log(error)
        return res.status(500).json('error')
    }
})

app.listen(PORT, () => console.log(`server started on PORT ${PORT}`))

const connectionHandler = (ws, msg) => {
    // для сессий делаем уникальные айди 
    // одна вкладка - одна сессия
    ws.id = msg.id
    // создаем широковещательную расслыку - пользователь подключился - уведовляем об этом всех других
    broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if(client.id === msg.id){
            // console.log("Server send message after client connects: ", JSON.stringify(msg))
            client.send(JSON.stringify(msg))
            // client.send(`Пользователь ${msg.name} подключился`)
        } 
    })
}