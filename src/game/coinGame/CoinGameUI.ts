class CoinGameUI extends game.BaseUI {

    private static _instance: CoinGameUI;
    public static getInstance(): CoinGameUI {
        if(!this._instance)
            this._instance = new CoinGameUI();
        return this._instance;
    }

    private topUI: TopUI;
    private bottomUI: BottomUI;
    private con: eui.Group;
    private bg: eui.Image;
    private scroller: eui.Scroller;
    private list: eui.List;
    private chooseList: eui.List;
    private btnGroup: eui.Group;
    private tipsBtn: eui.Group;
    private getTipsIcon: eui.Image;
    private resetBtn: eui.Group;
    private pkBtn: eui.Group;
    private costText: eui.Label;
    private desText: eui.Label;



    private dragTarget = new CoinGameChooseItem()


    private monsterArr = []
    private dataProvider:eui.ArrayCollection
    private chooseDataProvider:eui.ArrayCollection
    public leaveCost = 0

    public level = 1;
    public question = {"list1":"1,11,44,6,72,4,16","list2":"42,73,17,10,73","seed":19348313264,"cost":30}
    public constructor() {
        super();
        this.skinName = "CoinGameUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.bottomUI.setHide(this.onClose,this);


        this.chooseList.itemRenderer = CoinGameChooseItem
        this.chooseList.dataProvider = this.dataProvider = new eui.ArrayCollection();

        this.scroller.viewport = this.list;
        this.list.itemRenderer = CoinGameListItem
        this.list.dataProvider =  this.chooseDataProvider = new eui.ArrayCollection()

        this.addBtnEvent(this.pkBtn,this.onPK)
        this.addBtnEvent(this.resetBtn,this.reset)
        this.addBtnEvent(this.tipsBtn,this.onTips)

        this.chooseList.addEventListener('start_drag',this.onDragStart,this);
        this.chooseList.addEventListener('end_drag',this.onDragEnd,this);
        this.chooseList.addEventListener('move_drag',this.onDragMove,this);


        this.addBtnEvent(this.con,this.onMClick)
        MainPKUI.instance.addEventListener('visible_change',this.onMainVisibleChange,this)
        this.reset();

        this.stage.addChild(this.dragTarget);
        this.dragTarget.initDragItem();
        MyTool.removeMC(this.dragTarget);
    }

    public stopDrag(){
        MyTool.removeMC(this.dragTarget)
        for(var i=0;i<this.chooseList.numChildren;i++) {
            var mc:any = this.chooseList.getChildAt(i);
            mc.setChoose(false);
        }
    }

    private onDragStart(e){
        e.target.setChoose(true);
        this.dragTarget.data = e.target.data
        this.stage.addChild(this.dragTarget);
        this.dragTarget.x = e.data.x;
        this.dragTarget.y = e.data.y;
        this.dragTarget.showDragState(0)
    }

    private onDragMove(e){
        if(!this.dragTarget.parent)
            return;
        this.dragTarget.x = e.data.x - this.dragTarget.width/2;
        this.dragTarget.y = e.data.y - this.dragTarget.height/2;



        var x = this.dragTarget.x + this.dragTarget.width/2
        var y = this.dragTarget.y + this.dragTarget.height/2
        if(this.chooseList.hitTestPoint(x,y))
        {
            for(var i=0;i<this.chooseList.numChildren;i++)
            {
                var mc:any = this.chooseList.getChildAt(i);
                if(mc.hitTestPoint(x,y))
                {
                    if(mc.data == this.dragTarget.data)
                    {
                        this.dragTarget.showDragState(0);
                        break;
                    }
                    var p = mc.globalToLocal(x,y);
                    if(p.x < mc.width/4 || p.x > mc.width/4*3)
                        this.dragTarget.showDragState(2);
                    else
                        this.dragTarget.showDragState(1)
                    break
                }
            }
        }
        else
        {
            this.dragTarget.showDragState(0)
        }

    }

    private onDragEnd(e){
        if(!this.dragTarget.parent)
            return;
        MyTool.removeMC(this.dragTarget)
        var x = this.dragTarget.x + this.dragTarget.width/2
        var y = this.dragTarget.y + this.dragTarget.height/2
        for(var i=0;i<this.chooseList.numChildren;i++)
        {
            var mc:any = this.chooseList.getChildAt(i);
            if(mc.hitTestPoint(x,y))
            {
                if(mc.data == this.dragTarget.data)
                    break
                var index = this.dataProvider.source.indexOf(this.dragTarget.data)
                var p = mc.globalToLocal(x,y);
                if(p.x < mc.width/4 || p.x > mc.width/4*3)//insert
                {
                    var targetIndex = p.x < mc.width/4?i:i+1;
                    if(targetIndex == index)
                        break;
                    this.dataProvider.removeItemAt(index)
                    if(targetIndex > index)
                        targetIndex --;
                    this.dataProvider.addItemAt(this.dragTarget.data,targetIndex)
                }
                else//swap
                {
                    this.dataProvider.source[index] = mc.data
                    this.dataProvider.source[i] = this.dragTarget.data
                }


                this.dataProvider.refresh();
                break
            }
        }
        for(var i=0;i<this.chooseList.numChildren;i++) {
            var mc:any = this.chooseList.getChildAt(i);
            mc.setChoose(false);
        }
    }

    private setChooseList() {
        var arr = [];
        var arr2 = [];
        var answer = this.question.list2.split(',')
        var data = MonsterVO.data;
        for (var s in data) {
            if (answer.indexOf(s) == -1) {
                arr2.push(data[s])
            }
            else {
                arr.push(data[s])
            }
        }
        ArrayUtil.sortByField(arr2,['id'],[0])
        var PKM = PKManager.getInstance();
        PKM.randomSeed = (this.question.seed * 1.66);
        while (arr.length < 18)
        {
            var index = Math.floor(PKM.random()*arr2.length)
            arr.push(arr2[index])
            arr2.splice(index,1);
        }
        ArrayUtil.sortByField(arr,['cost','type'],[0,0])
        this.chooseDataProvider.source = arr;
        this.chooseDataProvider.refresh();
    }

    private onMainVisibleChange(){
        if(!this.stage)
            return;
        this.btnGroup.visible = !MainPKUI.instance.visible
        this.renewTitle();
    }

    public onTips(){
        if(UM.tipsLevel == this.level)
        {
            this.showTips();
            return;
        }
        var cost = Math.min(2000,Math.ceil(this.level/20)*100)
        MyWindow.Confirm('确定花费'+cost+'金币得到提示答案吗？',(b)=>{
            if(b==1)
            {
               if(UM.coin < cost)
               {
                   MyWindow.Alert('金币不足！')
                   return;
               }
                UM.addCoin(-cost);
                UM.tipsLevel = this.level;
                this.showTips()

            }
        },['再想想','要提示']);
    }

    private showTips(){
        var list:any = this.question.list2.split(',')
        for(var i=0;i<list.length;i++)
        {
            list[i] = {id:list[i]} ;
        }
        console.log(list)
        this.dataProvider.source = list;
        this.dataProvider.refresh();
        this.onItemChange();
        this.getTipsIcon.visible = true;
    }


    public onPK(){
        var myList = this.getMyList();
        if(!myList)
        {
            MyWindow.ShowTips('请点击上方头像配置你的队伍')
            return;
        }
        this.addChild(MainPKUI.instance);
        MainPKUI.instance.top = 60
        MainPKUI.instance.bottom = 100
        MainPKUI.instance.show({
            level:this.level,
            isPK:true,
            list1:this.question.list1,
            list2:myList,
            seed:this.question.seed,
            force1:10000,
            force2:10000
        });

        this.btnGroup.visible = false

        SharedObjectManager.getInstance().setMyValue('coin_game_value',{key:this.level,value:myList})
    }

    private onMClick(e){
        var x = e.stageX;
        var y = e.stageY;

        for(var i=this.monsterArr.length-1;i>=0;i--)
        {
            var mc = this.monsterArr[i];
            if(mc.currentMV.hitTestPoint(x,y,true))
            {
                CardInfoUI.getInstance().show(mc.id)
                break;
            }
        }
    }

    public showQuestion() {
        while(this.monsterArr.length > 0)
        {
            PKMonsterMV.freeItem(this.monsterArr.pop());
        }
        var arr = this.question.list1.split(',')
        arr.reverse();
        var des = Math.min(500/(arr.length-1),80)
        var begin = (640-des*(arr.length-1))/2
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i]
            var vo = MonsterVO.getObject(id);
            var item = PKMonsterMV.createItem();
            this.con.addChild(item);
            item.load(id)
            item.stand();
            item.scaleX = item.scaleY = 1.2;
            item.currentMV.scaleX = -Math.abs(item.currentMV.scaleX);
            item.bottom = 0+vo.height*1.2 - 5 + 10*Math.random()// + Math.random()*80
            item['w'] = vo.width
            item.x = begin + i*des
            this.monsterArr.push(item);
        }

        ArrayUtil.sortByField(this.monsterArr,['bottom','w'],[1,1]);
        for(var i=0;i<this.monsterArr.length;i++)
        {
            this.con.addChild(this.monsterArr[i]);
        }

        this.bg.source = PKManager.getInstance().getPKBG(this.question)
    }

    public onClose(){
        if(MainPKUI.instance.visible && MainPKUI.instance.parent == this)
        {
            MainPKUI.instance.hide();
            return;
        }
        this.hide();
    }


    public show(){
        PKManager.getInstance().loadChapterData(Math.ceil(UM.chapterLevel/100),()=>{
            super.show()
        },true)

    }

    public hide() {
        super.hide();
    }

    public addChoose(id){
        this.dataProvider.addItem({id:id})
        this.onItemChange();
    }

    public deleteItem(data){
        var index = this.dataProvider.getItemIndex(data)
        this.dataProvider.removeItemAt(index);
        this.onItemChange()
    }

    private onItemChange(){
         var cost = this.getMyCost();
        this.leaveCost = (this.question.cost - cost)
        this.costText.text = '剩余费用：' + this.leaveCost
        MyTool.renewList(this.list)
        this.desText.visible = cost == 0
    }

    public getChooseNum(){
        return this.dataProvider.length;
    }

    public onShow(){

        this.renew();
        this.addPanelOpenEvent(GameEvent.client.CHAPTER_CHANGE,this.onChapterChange)
    }

    private onChapterChange(){
        PKManager.getInstance().loadChapterData(Math.ceil(UM.chapterLevel/100),()=>{
            super.show()
        },true)
    }

    private renewTitle(){
        if(MainPKUI.instance.visible && MainPKUI.instance.dataIn.isPK)
            this.topUI.setTitle('关卡解迷 - 第'+MainPKUI.instance.dataIn.level+'关')
        else
            this.topUI.setTitle('关卡解迷 - 第'+this.level+'关')
    }

    private renew(){
        this.level = UM.chapterLevel;
        this.question = PKManager.getInstance().getChapterData();
        this.renewTitle();
        this.showQuestion();
        this.setChooseList();
        if(UM.tipsLevel == this.level)
        {
            this.showTips();
        }
        else
        {
            this.getTipsIcon.visible = false;


            var oo = SharedObjectManager.getInstance().getMyValue('coin_game_value')
            if(oo && oo.key == this.level)
            {
                var arr = oo.value.split(',');
                for(var i=0;i<arr.length;i++)
                {
                    arr[i] = MonsterVO.getObject(arr[i]);
                }
                this.dataProvider.source = arr
                this.dataProvider.refresh();
                this.onItemChange();
            }
            else
            {
                this.reset();
            }
        }
    }

    public reset(){
        this.dataProvider.source = [];
        this.dataProvider.refresh();
        this.onItemChange();
    }

    private getMyCost(){
        var arr = this.dataProvider.source;
        var cost = 0;
        for(var i=0;i<arr.length;i++)
        {
            cost += MonsterVO.getObject(arr[i].id).cost
        }
        return cost;
    }

    private getMyList(){
        var arr = this.dataProvider.source;
        var list = [];
        for(var i=0;i<arr.length;i++)
        {
            list.push(arr[i].id)
        }
        return list.join(',')
    }
}