import { User } from './user.interface.js';

export interface Comment {
    text: string;
    date: Date;
    rating: number;
    author: User;
}
