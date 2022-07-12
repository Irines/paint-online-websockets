import Tool from "./Tool"

export default class Eraser extends Tool{
    // наследуемый класс
    constructor(canvas, socket, id) {
        // вызывает конструктор родительского класса
        super(canvas, socket, id)
        this.listen()
    }

    listen() {
        // bind к текущему контексту, чтобы мы могли внутри функций обращаться к ключевому слову this
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mouseDown = false;
        this.socket.send(JSON.stringify({
            method: 'eraser',
            id: this.id,
            // когда отрываем кисть от холста, линия больше не должна рисоваться на нем - создали тип "finish"
            figure: {
                type: 'finish'
            }
        }))
    }

    mouseDownHandler(e) {
        this.mouseDown = true;
        this.ctx.beginPath();

        // таким образом получаем координаты курсора мышки
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)

    }

    mouseMoveHandler(e) {
        if (this.mouseDown === true) {
            this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
        
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'eraser',
                    x:e.pageX - e.target.offsetLeft,
                    y:e.pageY - e.target.offsetTop,
                    lineWidth: this.ctx.lineWidth
                }
            }))
        }
    }

    draw(x, y) {
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.strokeStyle = "#FFFFFF";
        // console.log("brush draws")
    }

    static drawEraser(ctx, x, y, lineWidth) {
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = "#FFFFFF";
        // console.log("brush draws")
    }



}