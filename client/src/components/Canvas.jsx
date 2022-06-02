import React, { useEffect, useRef, useState } from 'react';
import '../styles/canvas.scss';
import {observer} from "mobx-react-lite";
import { useTransition } from 'react';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import {useParams} from 'react-router-dom';
import Brush from '../tools/Brush';
import {Modal, Button} from 'react-bootstrap';
import Rect from '../tools/Rect';
// нужен для отправки запросов с клиента
import axios from 'axios';

const Canvas = observer(() => {
    // при запуске приложения сохраняем ссылку на канвас при помощи хука useRef
    const canvasRef = useRef()
    const usernameRef = useRef()
    const [modal, setModal] = useState(true)
    const params = useParams()
    console.log('params', params)


    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        console.log('dataURL',canvasRef.current.toDataURL())
        const ctx = canvasRef.current.getContext('2d')
        // ref есть поле current, которое позволяет напрямую обратиться к узлу дом дерева
       
        // для синхронизации данных канваса запрашиваем сохр. изображение dataUrl холста с сервера с помощью axios
        axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(response => {
                // подобная ф-ция как в методе draw Rect
                const img = new Image();
                img.src = response.data;
                img.onload = (() => {
                    // при загрузке img.src будет очищаться канвас и рисоваться сохраненная img 
                    // The CanvasRenderingContext2D.clearRect() method of the Canvas 2D API erases the pixels in a rectangular area by setting them to transparent black.
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                    // обводка
                    ctx.stroke();
                })
            })
    }, [])

    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket('ws://localhost:5000/')
            canvasState.setSocket(socket)
            canvasState.setSessionId(params.id)
            // Brush принмает объект canvas
            toolState.setTool(new Brush(canvasRef.current, socket, params.id))
            socket.onopen = () => {
                console.log('ПОДКЛЮЧЕНИЕ УСТАНОВЛЕНО')
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: "connection"
                }))
            }
            socket.onmessage = (event) => {
                // console.log("client on get message")
                // console.log("EVENT",event)
                let msg = JSON.parse(event.data)
                // console.log(msg)
                switch (msg.method) {
                    case "connection":
                        console.log(`пользователь ${msg.username} присоединился`)
                        break;
                    case "draw":
                        drawHandler(msg)
                        break;
                    default:
                        break;
                }
            }
        }
    }, [canvasState.username])

    const drawHandler = (msg) => {
        console.log("drawHandler msg", msg)
        const figure = msg.figure
        const ctx = canvasRef.current.getContext('2d')
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y)
                break;    
            case "finish":
                // начинаем новый путь при mouseup, поэтому новая и старая линия теперь не будут соединяться
                ctx.beginPath()
                break; 
            case "rect":
                // также параметром можно пeредать толщину линии, цвет обводки
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.strokeColor)
                break;    
            default:
                break;
        }
    } 



    const onMouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
    }

    const onMouseUpHandler = () => {
        // для синхронизации данных канваса отправляем dataUrl холста на сервер с помощью axios
        axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
            .then(response => console.log(response.data))
    }
    

    const connectHandler = () => {
        canvasState.setUsername(usernameRef.current.value)
        setModal(false)
    }

    return (
        <div className='canvas'>
            <Modal show={modal} onHide={() => {}}>
                <Modal.Header>
                <Modal.Title>Введите ваше имя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" ref={usernameRef}></input>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => connectHandler()}>
                    Войти
                </Button>
                </Modal.Footer>
            </Modal>
            <canvas ref={canvasRef} onMouseDown={() => onMouseDownHandler()} onMouseUp={() => onMouseUpHandler()} width={600} height={400}></canvas>
        </div> 
      );
})
 
export default Canvas;