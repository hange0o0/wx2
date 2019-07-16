class LevelVO {
    public static dataKey = 'level_base';
    public static key = 'id';
    public static getObject(id): LevelVO{
        return CM.table[this.dataKey][id];
    }
    public static get data(){
        return CM.table[this.dataKey]
    }
    public static get list(){
        return ObjectUtil.objToArray(this.data);
    }

    public id
    public data

    public constructor() {


    }

    public reInit(){

    }
}