import { UserType } from './user.enum.js';

export interface User {
    name: string;
    email: string;
    avatar: string;
    userType: UserType;
}
