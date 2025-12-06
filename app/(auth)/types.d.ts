type User = {
    name: string;
    email: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

type RegisterResponse = {
    data:{
        status: number;
        message: string;
    }
}

type LoginResponse = {
    data:{
        status: boolean;
        message: string;
        user:User,
        token:string;
    }
}




