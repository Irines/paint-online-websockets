import Tool from "./Tool"

export default class Circle extends Tool{
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
                type: 'circle',
                x: this.currentX,
                y: this.currentY,
                startX: this.startX,
                startY: this.startY,
                r: this.r,
                color: this.ctx.fillStyle,
                strokeColor: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth
            }
        }))

        // для прерывности линии на синхр. канвасах одной сессии, если след. фигурой будет выбрана кисть
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
        // The standard MIME type for the image format to return. 
        // If you do not specify this parameter, the default value is a PNG format image.
        // Returns the content of the current canvas as an image that you can use as a source for another canvas or an HTML element.
        this.saved = this.canvas.toDataURL()
    }

    mouseMoveHandler(e) {
        if (this.mouseDown === true) {
            this.currentX = e.pageX - e.target.offsetLeft;
            this.currentY = e.pageY - e.target.offsetTop;
            let width = this.currentX - this.startX;
            this.r = Math.abs(width/2);
            this.draw(this.currentX, this.currentY, this.r);
        }
    }

    draw(currentX, currentY, r) {
        const img = new Image();
        img.src = this.saved;
        img.onload = (() => {
            // при каждом след. движении мыши будет очищаться канвас и рисоваться сохраненная img последнего прямоугольника
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath();
            if (currentX > this.startX && currentY > this.startY) {
                this.ctx.arc(this.startX + r, this.startY + r, r, 0, 2*Math.PI)
            }
            else if (currentX < this.startX && currentY < this.startY) {
                this.ctx.arc(this.startX - r, this.startY - r, r, 0, 2*Math.PI)
            }
            else if (currentX < this.startX && currentY > this.startY) {
                this.ctx.arc(this.startX - r, this.startY + r, r, 0, 2*Math.PI)
            }
            else if (currentX > this.startX && currentY < this.startY) {
                this.ctx.arc(this.startX + r, this.startY - r, r, 0, 2*Math.PI)
            }
            // заливка
            this.ctx.fill();
            // обводка
            this.ctx.stroke();
        })
    }

    static drawCircle(ctx, startX, startY, currentX, currentY, r, color, strokeColor, lineWidth) {
        ctx.fillStyle = color;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        if (currentX > startX && currentY > startY) {
            ctx.arc(startX + r, startY + r, r, 0, 2*Math.PI)
        }
        else if (currentX <  startX && currentY <  startY) {
            ctx.arc( startX - r,  startY - r, r, 0, 2*Math.PI)
        }
        else if (currentX <  startX && currentY >  startY) {
            ctx.arc(startX - r,  startY + r, r, 0, 2*Math.PI)
        }
        else if (currentX >  startX && currentY <  startY) {
            ctx.arc( startX + r, startY - r, r, 0, 2*Math.PI)
        }
        ctx.fill();
        ctx.stroke();
    }

}