import Tool from "./Tool"

export default class Line extends Tool{
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
            figure: {
                type: 'line',
                startX: this.startX,
                startY: this.startY,
                x: e.pageX - e.target.offsetLeft,
                y: e.pageY - e.target.offsetTop,
                color: this.ctx.fillStyle,
                strokeColor: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth
            }
        }))

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
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;

        this.saved = this.canvas.toDataURL()

    }

    mouseMoveHandler(e) {
        if (this.mouseDown === true) {
            this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
        }
    }

    draw(x, y) {
        const img = new Image();
        img.src = this.saved;
        img.onload = (() => {
            // при каждом след. движении мыши будет очищаться канвас и рисоваться сохраненная img последнего прямоугольника
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath();
            // таким образом получаем координаты курсора мышки
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
            // this.ctx.fill();
        })
    }

    static drawLine(ctx, startX, startY, x, y, color, strokeColor, lineWidth) {
        // ctx.fillStyle = color;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        // таким образом получаем координаты курсора мышки
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        // заливка
        // ctx.fill();
        // обводка
        ctx.stroke();
    }

}