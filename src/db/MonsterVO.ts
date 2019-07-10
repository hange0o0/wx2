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

    private  _name
    public get name(){
        if(this.id > 200)
            return MonsterVO.getObject(this.id%200 || 200).name;
        return this._name
    }
    public set name(v){
        this._name = v;
    }


    public constructor() {


    }

    public reInit(){

    }

    public getThumb(){
        var id = (this.id %200 || 200)
        return Config.localResRoot2 + 'thumb/' + id + '.png'
    }




}