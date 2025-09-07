export type SignInData = {
    idToken: string;
};

export type SignUpData = {
    externalId: string | null;
    email: string | null;
    displayName: string | null;
    photoUrl: string | null;
    roleId: number;
};

export type VerifyTokenData = {
    idToken: string;
}; 