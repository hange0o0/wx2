class WorkManager {
    private static _instance:WorkManager;
    public static getInstance():WorkManager {
        if (!this._instance)
            this._instance = new WorkManager();
        return this._instance;
    }

    public constructor() {
    }


    public maxNum  //人数上限

    //工作人数
    public woodNum
    public foodNum
    public diamondNum
    public grassNum

    //科技等级
    public woodLevel
    public foodLevel
    public diamondLevel
    public grassLevel

    //数量上限
    public woodMax
    public foodMax
    public diamondMax
    public grassMax

    //工作人数上限
    public woodNumMax
    public foodNumMax
    public diamondNumMax
    public grassNumMax

    public lastTime


    public initData(data){
        data = data || {}
        this.maxNum = data.maxNum || 0
        this.woodNum = data.woodNum || 0
        this.foodNum = data.foodNum || 0
        this.diamondNum = data.diamondNum || 0
        this.grassNum = data.grassNum || 0
        this.lastTime = data.lastTime || 0


        this.woodLevel = data.woodLevel || 0
        this.foodLevel = data.foodLevel || 0
        this.diamondLevel = data.diamondLevel || 0
        this.grassLevel = data.grassLevel || 0

        this.resetLevel();
    }

    private resetLevel(){

        this.foodNumMax = this.foodLevel * 10 + 5
        this.woodNumMax = this.woodLevel * 5
        this.diamondNumMax = this.diamondLevel * 5
        this.grassNumMax = this.grassLevel * 5

        this.foodMax = this.foodLevel * 5000 + 1000
        this.woodMax = this.woodLevel * 5000 + 1000
        this.diamondMax = this.diamondLevel * 1000 + 200
        this.grassMax = this.grassLevel * 1000 + 200
    }

    //升级需要的花费(木头)
    public getUpCost(level){
        return Math.floor(Math.pow(level,2.5))*100
    }

    //升级指定项
    public levelUpType(type){
        switch(type)
        {
            case 'food':
                this.foodLevel ++;
                UM.addWood(-this.getUpCost(this.foodLevel))
                break;
            case 'wood':
                this.woodLevel ++;
                UM.addWood(-this.getUpCost(this.woodLevel))
                break;
            case 'diamond':
                this.diamondLevel ++;
                UM.addWood(-this.getUpCost(this.diamondLevel))
                break;
            case 'grass':
                this.grassLevel ++;
                UM.addWood(-this.getUpCost(this.grassLevel))
                break;
        }
        this.resetLevel();
    }

    public onTimer(){
        var num = (TM.now() - this.lastTime)/30
        if(num)  //自动收获资源
        {
            var addWood = this.woodNum * num
            var addDiamond = this.diamondNum  * num
            var addGlass = this.grassNum * num
            var addFood = (this.foodNum - this.woodNum - this.diamondNum*4 - this.grassNum*4) * num

            //有停工的，返还工作食物
            var overFood = Math.max(0,addWood - (this.woodMax - UM.wood)) +
                Math.max(0,addGlass - (this.grassMax - UM.grass))*4 +
                Math.max(0,addDiamond - (this.diamondMax - UM.diamond))*4

            addFood += overFood;

            if(-addFood > UM.food)//扣光食物,要进行停工
            {
                var decFood = UM.food + addFood;   //<0
                addFood -= decFood;

                //先停工木
                addWood += decFood;
                if(addWood < 0)
                {
                    decFood = -addWood
                    addWood = 0;
                }
                else
                    decFood = 0

                //停工钻
                if(decFood)
                {
                    addDiamond += Math.floor(decFood/4);
                    if(addDiamond < 0)
                    {
                        decFood = -addDiamond*4
                        addDiamond = 0;
                    }
                    else
                        decFood = 0
                }

                //停工草
                if(decFood)
                {
                    addGlass += Math.floor(decFood/4);
                    if(addGlass < 0)
                        addGlass = 0;
                }
            }

            UM.addFood(addFood);
            UM.addWood(addWood);
            UM.addDiamond(addDiamond);
            UM.addGrass(addGlass);

            this.lastTime += 30*num;
            EM.dispatch(GameEvent.client.COIN_CHANGE)
        }
    }

    public getSave(){
         return {
             maxNum:this.maxNum,
             woodNum:this.woodNum,
             foodNum:this.foodNum,
             diamondNum:this.diamondNum,
             grassNum:this.grassNum,
             lastTime:this.lastTime,
         }
    }

}