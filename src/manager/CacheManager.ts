class CacheManager{

    private static _instance:CacheManager;
    public static getInstance():CacheManager {
        if (!this._instance)
            this._instance = new CacheManager();
        return this._instance;
    }
    public registerData = {};
    public table = {};

    private cacheLoad = {};

    public constructor() {
        this.register(MonsterVO);
        this.register(LevelVO);

    }

    private register(cls)
    {
        this.registerData[cls.dataKey] = cls;
    }

    //初始化数据
    public initData(data,key){
        if(!this.table[key])
            this.table[key] = {};
        data = data.replace(/\r/g,'')
        var rows = data.split('\n')
        var fieldDelim = '\t';
        var fields: Array<string> = String(rows[0]).split(fieldDelim);
        for(var i: number = 1;i < rows.length;i++) {
            var s: string = rows[i];
            if(s != null && s != "") {
                var cols: Array<any> = s.split(fieldDelim);
                var cls = this.registerData[key];
                var vo:any = new cls();
                for(var j: number = 0;j < fields.length;j++) {
                    var value = cols[j];
                    if(!fields[j])
                        continue;
                    vo[fields[j]] = value && !isNaN(value) ? Number(value) : value;
                }
                vo.reInit();
                if(vo[cls.key])
                    this.table[key][vo[cls.key]] = vo;
            }
        }
    }

    //静态数据初始化后调用
    public initFinish(){
    }


}
