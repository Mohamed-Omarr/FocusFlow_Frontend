export type User = {
    name: string;
    email: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export type RegisterResponse = {
    data:{
        status: number;
        message: string;
    }
}

export type LoginResponse = {
    data:{
        status: boolean;
        message: string;
        user:User,
        accessToken:string;
    }
}




