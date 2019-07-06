class HeroDefUI extends game.BaseUI {

    private static _instance:HeroDefUI;
    public static getInstance() {
        if (!this._instance) this._instance = new HeroDefUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "HeroDefUISkin";
    }

    private bg: eui.Image;
    private closeBtn: eui.Image;
    private titleText: eui.Label;
    private scrollerUp: eui.Scroller;
    private listUp: eui.List;
    private scrollerDown: eui.Scroller;
    private listDown: eui.List;
    private btnGroup: eui.Group;
    private rebornBtn: eui.Button;
    private pkBtn: eui.Button;
    private autoBtn: eui.Button;
    private desText: eui.Label;





    public chooseList = [];
    public monsterList = [];
    public upDataProvider:eui.ArrayCollection;
    public downpDataProvider:eui.ArrayCollection;

    private dataIn
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn,this.hide)
        this.scrollerUp.viewport = this.listUp;
        this.listUp.itemRenderer = DefUpItem
        this.listUp.dataProvider = this.upDataProvider = new eui.ArrayCollection([])


        this.scrollerDown.viewport = this.listDown
        this.listDown.itemRenderer = DefDownItem
        this.listDown.dataProvider = this.downpDataProvider = new eui.ArrayCollection([])

        this.addBtnEvent(this.pkBtn,()=>{
            this.dataIn.fun && this.dataIn.fun(this.getSave());
        })

        this.addBtnEvent(this.autoBtn,()=>{
            if(this.autoBtn.label == '一键下阵')
            {
                this.monsterList = this.monsterList.concat(this.chooseList)
                this.chooseList.length = 0

            }
            else
            {
                var pkNum = HeroManager.getInstance().heroNum
                while(this.monsterList.length > 0 && this.chooseList.length < pkNum)
                {
                     if(this.monsterList[0].isDie)
                        break;
                    this.chooseList.push(this.monsterList.shift())
                }
            }
            this.onSelectedChange()
        })

        this.addBtnEvent(this.rebornBtn,()=>{
            HeroManager.getInstance().rebornAll()
        })

    }



    /*
    pkType:
    title:
    fun:
    upList:已上阵单位，里面是key
     */
    public show(dataIn?){
        this.dataIn = dataIn;
        super.show()
    }

    public onShow(){
        this.titleText.text = this.dataIn.title;
        this.pkBtn.label = this.dataIn.pkType == 'def'?'设置防守':'出战'
        this.renew();
        this.renewDes();
        this.testHaveReborn();

        this.addPanelOpenEvent(GameEvent.client.HERO_CHANGE,this.renewList)
        this.addPanelOpenEvent(GameEvent.client.HERO_NUM_CHANGE,this.onMonsterNumChanged)
    }

    //炼化了一只
    private onMonsterNumChanged(){
        var HM = HeroManager.getInstance();
        var find = false
        for(var i=0;i<this.monsterList.length;i++)
        {
            if(HM.list.indexOf(this.monsterList[i]) == -1)
            {
                this.monsterList.splice(i,1);
                find = true;
                break;
            }
        }
        if(!find)
        {
            for(var i=0;i<this.chooseList.length;i++)
            {
                if(HM.list.indexOf(this.chooseList[i]) == -1)
                {
                    this.chooseList.splice(i,1);
                    break;
                }
            }
        }
        this.onSelectedChange();
    }

    private renewList(){
         MyTool.renewList(this.listUp)
         MyTool.renewList(this.listDown)
        this.testHaveReborn();
    }

    private testHaveReborn(){
        var oo = this.monsterList[this.monsterList.length-1]
        if(oo && oo.isDie)
        {
            this.btnGroup.addChildAt(this.rebornBtn,0)
        }
        else
        {
            MyTool.removeMC(this.rebornBtn);
        }
    }

    private renewDes(){
        var str = this.dataIn.pkType == 'def'?'上阵':'出战'
        var pkNum = HeroManager.getInstance().heroNum
        this.setHtml(this.desText,'当前可'+str + '蛊虫数量：'+this.createHtml(this.chooseList.length + '/' + pkNum,0xffff00)+'，长按蛊虫查看详情')
    }

    public renew(){
        var useList = this.dataIn.upList?this.dataIn.upList.split(','):[];
        this.chooseList.length = 0
        this.monsterList.length = 0

        var HM = HeroManager.getInstance()
        var base = HM.list;
        for(var i =0;i<base.length;i++)
        {
            var oo = base[i];
            if(useList.indexOf(oo.key+'') != -1)
            {
                this.chooseList.push(oo);
                continue;
            }
            if(HM.isDef(oo.key))
                continue;
            if(HM.isAtk(oo.key))
                continue;
            this.monsterList.push(oo);
        }
        this.onSelectedChange();
    }

    public addItem(data){
        this.chooseList.push(data);
        this.monsterList.splice(this.monsterList.indexOf(data),1);
        this.onSelectedChange()
    }

    public removeItem(data){
        this.monsterList.push(data);
        this.chooseList.splice(this.chooseList.indexOf(data),1);
        this.onSelectedChange()
    }

    public onSelectedChange(){
        ArrayUtil.sortByField(this.chooseList,['exp'],[1])
        this.upDataProvider.source = this.chooseList;
        this.upDataProvider.refresh()

        ArrayUtil.sortByField(this.chooseList,['isDie','exp'],[0,1])
        this.downpDataProvider.source = this.monsterList;
        this.downpDataProvider.refresh()

        var pkNum = HeroManager.getInstance().heroNum
        if(this.chooseList.length >= pkNum || this.monsterList.length == 0)
        {
             this.autoBtn.label = '一键下阵'
        }
        else
        {
             this.autoBtn.label = '一键上阵'
        }

        this.renewDes();
    }

    public getSave(){
        var arr = [];
        for(var i=0;i<this.chooseList.length;i++)
        {
            arr.push(this.chooseList[i].key)
        }
        return arr.join(',')
    }
}


class DefUpItem extends HeroItem{
    public constructor() {
        super();
        this.skinName = "HeroDefItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        MyTool.addLongTouch(this,()=>{
            HeroInfoUI.getInstance().show(this.data)
        },this)
    }

    public onClick(){
         HeroDefUI.getInstance().removeItem(this.data)
    }
}


class DefDownItem extends HeroItem{
    public constructor() {
        super();
        this.skinName = "HeroDefItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        MyTool.addLongTouch(this,()=>{
            HeroInfoUI.getInstance().show(this.data)
        },this)
    }

    public onClick(){
        if(this.data.isDie)
        {
            MyWindow.ShowTips('不能出战已阵亡单位，长按查看详情')
            return;
        }
        HeroDefUI.getInstance().addItem(this.data)
    }
}