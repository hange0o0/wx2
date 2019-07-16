class ChapterManager {
    private static _instance:ChapterManager;

    public static getInstance():ChapterManager {
        if (!this._instance)
            this._instance = new ChapterManager();
        return this._instance;
    }

    public constructor() {
    }


    //public maxNum

    public level
    public max
    public step
    public list
    public chapterData:any

    public pkWord = ['有妖气']
    public woodWord = ['好多林']
    public foodWord = ['食物！']
    public diamondWord = ['金石']
    public grassWord = ['草！']
    public coinWord = ['钱钱钱']

    public initData(data) {
        data = data || {};
        this.max = data.max || 0
        this.level = data.level || 0

        this.list = [];
        var list = data.list?data.list.split(','):[]
        for(var i=0;i<list.length;i++)
        {
            var temp = list[i].split('|');
            var pkHero = HeroManager.getInstance().getPKMonster(temp[0]);
            pkHero.hp = parseInt(temp[1]);
            this.list.push(pkHero);
        }

        this.step = data.step || 0
        this.chapterData = data.chapterData?JSON.parse(data.chapterData):null
    }

    public getSave(){
        var list = [];
        for(var i=0;i<this.list.length;i++)
        {
            var oo = this.list[i];
            list.push(oo.key + '|' + oo.hp);
        }
        return {
            max:this.max,
            level:this.level,
            step:this.step,
            list:list.join(','),
            chapterData:this.chapterData?JSON.stringify(this.chapterData):null,
        }
    }

    public onPKBefore(level){
        var HM = HeroManager.getInstance()
        var base = HM.list;
        var str = SharedObjectManager.getInstance().getMyValue('last_pk_list') || '';
        var lastList = str?str.split(','):[];
        var monsterList = [];
        for(var i =0;i<base.length;i++)
        {
            var oo = base[i];
            if(oo.isDie)
                continue;
            if(HM.isDef(oo.key))
                continue;
            if(HM.isAtk(oo.key))
                continue;
            if(lastList.indexOf(oo.key) != -1)
                monsterList.push(oo.key);
        }


        HeroDefUI.getInstance().show({
            pkType:'chapter',
            title:'探索阵容',
            upList:monsterList.join(','),
            fun:(data)=>{
                if(!data)
                {
                    MyWindow.ShowTips('请先选择探索阵容')
                    return;
                }
                this.startPK(level,data);
                HeroDefUI.getInstance().hide()
            }
        })
    }

    //开始战斗
    public onPK(){
        this.chapterData.action = 'pking';
        this.chapterData.enemy = this.createEnemy();
        UM.needUpUser = true;
    }

    private createEnemy(){

    }

    //采集资源
    public onResource(){
        if(this.chapterData.pk)
        {
             this.onPK();
        }
        else
        {

        }
        UM.needUpUser = true;
    }

    //
    public onRest(){
        for(var i=0;i<this.list.length;i++)
        {
            var item = this.list[i];
            item.addHp(Math.ceil(item.maxHp/10))
        }
        MyWindow.Alert('通过休息，所有存活蛊虫都回复了部分的生命')
        this.resetChapter();
        UM.needUpUser = true;
    }

    public onBack(){
        MyWindow.Alert('蛊虫们结束了探索，回到了家中。。')
        this.chapterData = null;
        UM.needUpUser = true;
    }

    public onRunAway(){
        if(Math.random() < 0.2 || this.chapterData.pk)
        {
            this.chapterData.pk = true;
            MyWindow.Alert('糟糕，敌人追上来了',()=>{
                this.onPK();
            },'转身应战')
        }
        UM.needUpUser = true;
    }

    //最大步数
    public maxStep(){
        return 5 + Math.floor(this.level/2)
    }

    private startPK(level,data){
        this.level = level;
        this.step = 0;
        this.list = [];
        var arr = data.split(',')
        for(var i=0;i<arr.length;i++)
        {
            this.list.push(HeroManager.getInstance().getPKMonster(arr[i]))
        }
        this.resetChapter();
        ChapterUI.getInstance().onStart()
        UM.needUpUser = true;
    }

    public resetChapter(){
        this.step ++;
        if(this.step > this.maxStep())
        {
            MyWindow.Alert('探索结束，蛊虫们都回来了！')
            ChapterUI.getInstance().show();
            if(this.level > this.max)
            {
                this.max = this.level;
                UM.needUpUser = true;
            }
            this.chapterData = null;
            return;
        }
        this.chapterData = {};
        if(this.step == 1 || Math.random() < 0.7)//战斗
        {
            this.chapterData.type = 'pk'
            this.chapterData.pk = true;
            this.chapterData.word = Math.floor(Math.random() * this.pkWord.length)
        }
        else if(Math.random() < 0.3)// 休息，有机率进PK
        {
            this.chapterData.type = 'food'
            this.chapterData.pk = Math.random() > 0.5;
            this.chapterData.word = Math.floor(Math.random() * this.foodWord.length)
        }
        else if(Math.random() < 0.4)// 休息
        {
            this.chapterData.type = 'wood'
            this.chapterData.pk = Math.random() > 0.5;
            this.chapterData.word = Math.floor(Math.random() * this.woodWord.length)
        }
        else if(Math.random() < 0.5)// 休息
        {
            this.chapterData.type = 'diamond'
            this.chapterData.pk = Math.random() > 0.5;
            this.chapterData.word = Math.floor(Math.random() * this.diamondWord.length)
        }
        else if(Math.random() < 0.6)// 休息
        {
            this.chapterData.type = 'grass'
            this.chapterData.pk = Math.random() > 0.5;
            this.chapterData.word = Math.floor(Math.random() * this.grassWord.length)
        }
        else
        {
            this.chapterData.type = 'coin'
            this.chapterData.pk = Math.random() > 0.6;
            this.chapterData.word = Math.floor(Math.random() * this.coinWord.length)
        }
        if(this.chapterData.pk )
        {
            this.chapterData.seed = Math.random()*10000000000;
        }
    }
}