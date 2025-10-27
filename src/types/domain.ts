
export type Domain = {
    id: string;
    domainName: string;
    associatedProject: string;
    registrar: string;
    expirationDate: string;
    daysRemaining: number;
    autoRenew: "On" | "Off";
    sslExpiry: string;
};
