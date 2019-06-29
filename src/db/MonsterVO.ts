class MonsterVO {
    public static dataKey = 'monster_base';
    public static key = 'id';
    public static getObject(id): MonsterVO{
        return CM.table[this.dataKey][id];
    }
    public static get data(){
        return CM.table[this.dataKey]
    }

    public isMonster = true;

    public width: number;
    public height: number;
    public atk: number;
    public type: number;
    public headoff: number;
    public heightoff: number;
    public atkcd: number;
    public cost: number;
    public space: number;
    public def: number;
    public cd: number;
    public num: number;
    public atkrage: number;
    public level: number;
    public mcnum: number;
    public mcheight: number;
    public name: string;
    //public num2: number;
    public des: string;
    public des2: string;
    public speed: number;
    public hp: number;
    public skillcd: number;
    public id: number;
    public mcwidth: number;
    public atk2: number;
    public mv_atk: number;
    public mv_atk2: number;
    public sv1: number;
    public sv2: number;
    public sv3: number;
    public sv4: number;  //no use


    public haveLoad = false;
    public temp = 0
    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){
        this.width = data.width
        this.height = data.height
        this.atk = data.atk
        this.type = data.type
        this.headoff = data.headoff
        this.heightoff = data.heightoff
        this.atkcd = data.atkcd * 1000
        this.cost = data.cost
        this.space = data.space
        this.def = data.def
        this.cd = data.cd * 1000
        this.num = data.num
        //this.num2 = data.num2
        this.atkrage = data.atkrage
        this.level = data.level
        this.mcnum = data.mcnum
        this.mcheight = data.mcheight
        this.name = data.name
        this.des = data.des
        this.speed = data.speed
        this.hp = data.hp
        this.id = data.id
        this.sv1 = data.sv1
        this.sv2 = data.sv2
        this.sv3 = data.sv3
        this.mcwidth = data.mcwidth
        this.atk2 = data.atk2
        this.skillcd = data.skillcd * 1000
        this.mv_atk = data.mv_atk * 1000
        this.mv_atk2 = data.mv_atk2
        this.des2 = data.des2


    }



}