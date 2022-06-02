import {makeAutoObservable} from "mobx";

class CanvasState {
    username = ''
    canvas =  null
    undoList = []
    redoList = []
    sessionid = null
    socket = null
    // этот canvas и есть наше состояние, к нему можем обращаться из любого компонента, любой точки нашего приложения
    constructor() {
        makeAutoObservable(this)
    }
    setUsername(username) {
        this.username = username
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    setSessionId(sessionid) {
        this.sessionid = sessionid;
    }

    setSocket(socket) {
        this.socket = socket;
    }

    pushToUndo(data) {
        this.undoList.push(data)
    }

    pushToRedo(data) {
        this.redoList.push(data)
    }

    undo() {
        let ctx = this.canvas.getContext('2d')
        if (this.undoList.length > 0) {
            let img = new Image()
            let lastFigure = this.undoList.pop()
            this.pushToRedo(this.canvas.toDataURL())
            img.src = lastFigure
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            }
        }
    }

    redo() {
        let ctx = this.canvas.getContext('2d')
        if (this.redoList.length > 0) {
            let img = new Image()
            let lastFigure = this.redoList.pop()
            this.pushToUndo(this.canvas.toDataURL())
            img.src = lastFigure
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            }
        }
    }

}
 
export default new CanvasState();