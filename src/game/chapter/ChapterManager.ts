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
    public chapterData

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
            list:list,
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
    }

    public resetChapter(){
        this.chapterData = {};
    }
}