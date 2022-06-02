export default class Tool {
    constructor(canvas, socket, id) {
        this.socket = socket
        this.id = id
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        // this.ctx.strokeStyle = "#000000"
        // при смене инструмента уничтожаем слушатели, так как у всех иструментов разная логика
        this.destroyEvents()
    }

    // обьявление сеттеров для смены настроек контекста
    set fillColor(color) {
        this.ctx.fillStyle = color;
    }

    set strokeColor(color) {
        this.ctx.strokeStyle = color;
    }

    set lineWidth(width) {
        this.ctx.lineWidth = width;
    }

    destroyEvents() {
        // bind к текущему контексту, чтобы мы могли внутри функций обращаться к ключевому слову this
        this.canvas.onmousemove = null;
        this.canvas.onmouseup = null;
        this.canvas.onmousedown = null;
    }
}