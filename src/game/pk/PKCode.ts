class PKCode {
    private static _instance:PKCode;
    public static getInstance():PKCode {
        if (!this._instance)
            this._instance = new PKCode();
        return this._instance;
    }

    public constructor() {

    }

    private randomSeed
    public random(){
        var seed = this.randomSeed;
        seed = ( seed * 9301 + 49297 ) % 233280;
        var rd = seed / ( 233280.0 );
        this.randomSeed = rd * 100000000;
        return rd;
    }

    public addVideo(data){

    }
}