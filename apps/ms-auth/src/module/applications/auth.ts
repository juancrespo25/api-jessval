export type AuthProps = {
    user_name: string;
    password: string;
}

export class Auth {
    private user_name: string;
    private password: string;

    constructor(props: AuthProps) {
        Object.assign(this, props);
    }

    get properties(): Required<AuthProps> {
        return {
            user_name: this.user_name,
            password: this.password,
        };
    }
}