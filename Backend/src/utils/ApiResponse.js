class ApiResponse{
    constructor(statusCode,data,mesasge = "success"){
        this.statusCode = statusCode;
        this.data = data;
        this.message = mesasge;
        this.success = statusCode<400
    }
}
export {ApiResponse}