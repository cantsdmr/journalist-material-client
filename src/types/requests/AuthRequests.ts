export type SignInData = {
    idToken: string;
};

export type SignUpData = {
    external_id: string | null;
    email: string | null;
    display_name: string | null;
    photo_url: string | null;
    role_id: number;
};

export type VerifyTokenData = {
    idToken: string;
}; 