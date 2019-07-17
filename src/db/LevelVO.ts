class LevelVO {
    public static dataKey = 'level_base';
    public static key = 'id';
    public static getObject(id): LevelVO{
        return CM.table[this.dataKey][id];
    }
    public static get data(){
        return CM.table[this.dataKey]
    }
    private static _list
    public static get list(){
        if(!this._list)
            this._list = ObjectUtil.objToArray(this.data);
        return this._list;
    }

    public id
    public data
    public hard

    public constructor() {


    }

    public reInit(){

    }
}