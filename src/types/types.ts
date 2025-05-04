export interface IError {
    status : "error",
    message: string
}

export interface IOk {
    status : "ok",
    message : string
}

export interface IOkWithData <T>{
    status: "ok"
    data: T
}