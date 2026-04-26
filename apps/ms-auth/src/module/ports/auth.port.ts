import { Auth } from "../applications";

export interface IAuthPort {
    login(auth: Auth): Promise<any>;
}