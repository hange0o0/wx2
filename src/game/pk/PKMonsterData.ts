class PKMonsterData{
    public hp
    public maxHp
    public atk
    public skill
    public key

    public constructor(data){
        this.hp = data.hp
        this.maxHp = data.hp
        this.atk = data.atk
        this.skill = data.skill
        this.key = data.key
    }

    public addHp(v){
       this.hp += v;
        if(this.hp < 0)
        {
            this.hp = 0;
            if(this.skill == 9)
            {
                if(PKCode.getInstance().random() > 0.5)
                {
                    this.hp = this.maxHp;
                    PKCode.getInstance().addVideo({
                        type:'reborn',
                        user:this
                    })
                    return;
                }
            }
        }
        else if(this.hp > this.maxHp)
        {
            this.hp = this.maxHp;
        }
        PKCode.getInstance().addVideo({
            type:'hpchange',
            user:this
        })
    }
}