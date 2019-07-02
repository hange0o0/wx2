class PKCode {
    private static _instance:PKCode;
    public static getInstance():PKCode {
        if (!this._instance)
            this._instance = new PKCode();
        return this._instance;
    }

    public constructor() {
    }
}