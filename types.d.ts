interface User {
    id?: number;
    username: string;
    hash: string;
    salt: string;
    admin: boolean;
}