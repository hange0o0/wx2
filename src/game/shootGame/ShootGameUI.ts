class ShootGameUI extends game.BaseUI {

    private static _instance: ShootGameUI;
    public static getInstance(): ShootGameUI {
        if(!this._instance)
            this._instance = new ShootGameUI();
        return this._instance;
    }

    private cannonGroup: eui.Group;
    private con: eui.Group;
    private c0: eui.Image;
    private c1: eui.Image;
    private c2: eui.Image;
    private c3: eui.Image;
    private c4: eui.Image;
    private numText: eui.Label;
    private coinGroup: eui.Group;
    private coinText: eui.Label;
    private cdGroup: eui.Group;
    private timeText: eui.Label;
    private resultGroup: eui.Group;
    private resultCoinText: eui.Label;
    private tipText: eui.Label;
    private closeBtn: eui.Button;





    private monsterArr = []
    private bulletArr = []
    private monsterDataList = []

    private lastShootTime = {};
    private bulletSpeed = 10;

    private gameStart = 0
    private lastCreate = 0

    private gameStep = 0
    private coin = 0
    public constructor() {
        super();
        this.skinName = "ShootGameUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.monsterDataList =  ObjectUtil.objToArray(MonsterVO.data)
        this.addBtnEvent(this.c0,this.onShoot0)
        this.addBtnEvent(this.c1,this.onShoot1)
        this.addBtnEvent(this.c2,this.onShoot2)
        this.addBtnEvent(this.c3,this.onShoot3)
        this.addBtnEvent(this.c4,this.onShoot4)

        this.addBtnEvent(this.closeBtn,this.hide)
    }

    private onShoot0(){
        this.shoot(0);
    }
    private onShoot1(){
        this.shoot(1);
    }
    private onShoot2(){
        this.shoot(2);
    }
    private onShoot3(){
        this.shoot(3);
    }
    private onShoot4(){
        this.shoot(4);
    }


    private shoot(index){
        if(this.gameStep == 2)
            return;
         if(this.lastShootTime[index] && egret.getTimer() - this.lastShootTime[index] < 150)
            return;
        this.lastShootTime[index] = egret.getTimer();


        this.tipText.visible = false

        var mc = this['c'+index];
        var p = mc.localToGlobal(mc.width/2,0)
        p = this.globalToLocal(p.x,p.y,p)
        var bullet = ShootBulletItem.createItem()
        bullet.y = p.y;
        bullet.x = p.x;
        this.con.addChild(bullet);
        this.bulletArr.push(bullet)
        mc.y = 15;
        egret.Tween.get(mc).to({y:0},100)
    }

    public addCoin(addCoin){
        this.coin += addCoin;
        UM.addCoin(addCoin);
        AddCoinItem.showMV(addCoin,this)
        this.coinText.text = this.coin + ''
    }

    public show(){
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        while(this.monsterArr.length)
        {
             ShootMonster.freeItem(this.monsterArr.pop())
        }
        while(this.bulletArr.length)
        {
             ShootBulletItem.freeItem(this.bulletArr.pop())
        }
        this.cdGroup.visible = false
        this.cannonGroup.visible = false
        this.coinGroup.visible = false
        this.resultGroup.visible = false
        this.tipText.visible = false
        this.gameStep = 0;
        this.coin = 0;
        this.coinText.text = this.coin + ''
        this.lastCreate = 0;
        this.gameStart = egret.getTimer();
        this.addPanelOpenEvent(GameEvent.client.timerE,this.onE)
    }

    private onE(){
        if(this.gameStep == 2)
            return;
        if(this.gameStep == 0)
        {
            var scd =  3-Math.floor((egret.getTimer() - this.gameStart)/1000)
            this.numText.text = scd + '';
            if(scd <=0)
            {
                this.gameStep = 1;
                this.gameStart = egret.getTimer();
                this.numText.text = '';
                this.cdGroup.visible = true
                this.cannonGroup.visible = true
                this.coinGroup.visible = true
                this.tipText.visible = true
                SoundManager.getInstance().playSound('pkbg')
            }
            return;
        }
        //create monster
        var timeCD = Math.floor((egret.getTimer() - this.gameStart)/1000)
        if(timeCD >= 100)
        {
            this.gameStep = 2;
            this.showResult();
            return;
        }
        this.timeText.text = timeCD + ''

        var cd = egret.getTimer() - this.lastCreate;
        var createCD = 1*1000;
        var maxNum = 20
        if(cd > createCD && maxNum > this.monsterArr.length)
        {
            this.lastCreate = egret.getTimer();
            this.createMonster();
        }

        for(var i=0;i<this.monsterArr.length;i++)
        {
            this.monsterArr[i].move()
            if(this.monsterArr[i].isDie == 2)
            {
                ShootMonster.freeItem(this.monsterArr[i]);
                this.monsterArr.splice(i,1);
                i--;
            }
        }

         for(var i=0;i<this.bulletArr.length;i++)
         {
             var bullet = this.bulletArr[i];
             bullet.y -= this.bulletSpeed;
             if(bullet.y < -50 || this.testBullet(bullet))
             {
                 ShootBulletItem.freeItem(bullet);
                 this.bulletArr.splice(i,1);
                 i--;
             }
         }
    }

    private showResult(){
        this.resultCoinText.text = this.coin + ''
        this.resultGroup.visible = true;
        SoundManager.getInstance().playSound('bg');
    }

    private testBullet(bullet){
        for(var i=this.monsterArr.length-1;i>=0;i--)
        {
            var monster = this.monsterArr[i];
            if(monster.isDie)
                continue;
            var w = monster.data.vo.width
            var h = monster.data.vo.height
            if(
                bullet.x > monster.x - w/2 &&
                bullet.x < monster.x + w/2 &&
                bullet.y < monster.y &&
                bullet.y > monster.y - h*0.8
            )
            {
                monster.beHit();
                return true;
            }
        }
        return false;
    }

    private createMonster(){
        //console.log('create');
        var mvo = ArrayUtil.randomOne(this.monsterDataList);
        var monster = ShootMonster.createItem();
        this.con.addChild(monster);
        var atkRota = Math.random() > 0.5?1:-1;
        monster.data = {
            vo:mvo,
            id:mvo.id,
            atkRota:1,
            speed:mvo.speed,
        };
        monster.x = atkRota==1?-100:640+100;
        monster.y = 180 + Math.random()*(GameManager.uiHeight - 500);
        this.monsterArr.push(monster)

        ArrayUtil.sortByField(this.monsterArr,['y'],[0]);
        for(var i=0;i<this.monsterArr.length;i++)
        {
            this.con.addChild(this.monsterArr[i]);
        }

    }


}