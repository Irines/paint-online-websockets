import Tool from "./Tool"

export default class Brush extends Tool{
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
            method: 'draw',
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
            // this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'brush',
                    x:e.pageX - e.target.offsetLeft,
                    y:e.pageY - e.target.offsetTop
                }
            }))
        }
    }

    // делаем статической, чтобы можно было использовать без создания экземпляра классв
    static draw(ctx, x, y) {
        ctx.lineTo(x, y);
        ctx.stroke();
        // console.log("brush draws")
    }

}