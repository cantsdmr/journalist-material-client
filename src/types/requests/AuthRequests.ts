import { UserRole } from "@/enums/UserEnums";

export type SignInData = {
    idToken: string;
};

export type SignUpData = {
    externalId: string | null;
    email: string | null;
    displayName: string | null;
    photoUrl: string | null;
    roleId: UserRole;
};

export type VerifyTokenData = {
    idToken: string;
}; 