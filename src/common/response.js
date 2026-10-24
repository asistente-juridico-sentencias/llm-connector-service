class Response {
    constructor(status = 500, message = "", data){
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

module.exports = { Response };
