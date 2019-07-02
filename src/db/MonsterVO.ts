class MonsterVO {
    public static dataKey = 'monster_base';
    public static key = 'id';
    public static getObject(id): MonsterVO{
        return CM.table[this.dataKey][id];
    }
    public static get data(){
        return CM.table[this.dataKey]
    }

    public id
    public level
    public name


    public constructor() {


    }

    public reInit(){

    }

    public getThumb(){
        return Config.localResRoot2 + 'thumb/' + this.id + '.png'
    }




}