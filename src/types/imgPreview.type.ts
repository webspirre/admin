export type ImagePreviewState = {
    desktopFpURL: string | null;
    mobileFpURL: string | null;
    logoImageURL: string | null;
    [key: string]: string | null; // This allows for additional dynamic keys
};