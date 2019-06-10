class CoinGameUI extends game.BaseUI {

    private static _instance: CoinGameUI;
    public static getInstance(): CoinGameUI {
        if(!this._instance)
            this._instance = new CoinGameUI();
        return this._instance;
    }

    private mainGroup: eui.Group;
    private con: eui.Group;
    private bg: eui.Image;
    private scroller: eui.Scroller;
    private list: eui.List;
    private chooseList: eui.List;
    private costText: eui.Label;
    private freeEnergyText: eui.Label;
    private energyGroup: eui.Group;
    private energyText: eui.Label;
    private addEnergyBtn: eui.Image;
    private desText: eui.Label;
    private topUI: TopUI;
    private bottomUI: BottomUI;
    private btnGroup: eui.Group;
    private tipsBtn: eui.Group;
    private getTipsIcon: eui.Image;
    private videoGroup: eui.Group;
    private videoMC: eui.Label;
    private resetBtn: eui.Group;
    private pkBtn: eui.Group;
    private historyBtn: eui.Group;






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
        this.adBottom = 100;
        this.isShowAD = true;
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
        this.addBtnEvent(this.historyBtn,()=>{
            CoinGameHistoryUI.getInstance().show();
        })

        this.chooseList.addEventListener('start_drag',this.onDragStart,this);
        this.chooseList.addEventListener('end_drag',this.onDragEnd,this);
        this.chooseList.addEventListener('move_drag',this.onDragMove,this);


        this.addBtnEvent(this.con,this.onMClick)
        MainPKUI.instance.addEventListener('visible_change',this.onMainVisibleChange,this)
        this.reset();

        this.stage.addChild(this.dragTarget);
        this.dragTarget.initDragItem();
        MyTool.removeMC(this.dragTarget);

        this.addBtnEvent(this.addEnergyBtn,this.onAddEnergy)

        MyTool.addLongTouch(this.resetBtn,()=>{
            DebugUI.getInstance().debugTime = egret.getTimer()
            MyWindow.ShowTips('清空上阵数据！')
        },this)
    }

    private onAddEnergy() {
        ShareTool.share('日常推荐一个好游戏', Config.localResRoot + "share_img_2.jpg", {}, ()=> {
            UM.addEnergy(20);
            this.renewEnergy();
        })
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
                if(mc.visible && mc.hitTestPoint(x,y))
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
            if(mc.visible && mc.hitTestPoint(x,y))
            {
                if(mc.data == this.dragTarget.data)
                    break
                var currentIndex =  this.dataProvider.source.indexOf(mc.data)// this.chooseList会有不存在数组中数据的显示对象
                var index = this.dataProvider.source.indexOf(this.dragTarget.data)
                var p = mc.globalToLocal(x,y);
                if(p.x < mc.width/4 || p.x > mc.width/4*3)//insert
                {
                    var targetIndex = p.x < mc.width/4?currentIndex:currentIndex+1;
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
                    this.dataProvider.source[currentIndex] = this.dragTarget.data
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
        var arr = PKManager.getInstance().getChapterChooseList(this.question);
        //var arr2 = [];
        //var answer = this.question.list2.split(',')
        //var data = MonsterVO.data;
        //for (var s in data) {
        //    if (answer.indexOf(s) == -1) {
        //        arr2.push(data[s])
        //    }
        //    else {
        //        arr.push(data[s])
        //    }
        //}
        //ArrayUtil.sortByField(arr2,['id'],[0])
        //var PKM = PKManager.getInstance();
        //PKM.randomSeed = (this.question.seed * 1.66);
        //while (arr.length < 18)
        //{
        //    var index = Math.floor(PKM.random()*arr2.length)
        //    arr.push(arr2[index])
        //    arr2.splice(index,1);
        //}
        ArrayUtil.sortByField(arr,['cost','type'],[0,0])
        for(var i=0;i<arr.length;i++)
        {
            arr[i] = {id:arr[i].id,list:arr,index:i};
        }
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
        if(this.level <= 10)
        {
            MyWindow.Confirm('本关可免费或得提示，但你确定不再想一下吗？',(b)=>{
                if(b==1)
                {
                    UM.tipsLevel = this.level;
                    this.showTips()
                }
            },['再想想','要提示']);
            return;
        }

        if(this.level % 5 == 0 && !UM.isTest)
        {
            ShareTool.share('日常推荐一个好游戏',Config.localResRoot + "share_img_2.jpg",{},()=>{
                UM.tipsLevel = this.level;
                this.showTips()
            })
            return;
        }

        ShareTool.openGDTV(()=>{
            UM.tipsLevel = this.level;
            this.showTips()
        })

    }

    private renewTipsBtn(){
        if(this.level <= 10)
        {
           MyTool.removeMC(this.videoMC)
            return;
        }

        if(this.level % 5 == 0 && !UM.isTest)
        {
            MyTool.removeMC(this.videoMC)
            return;
        }

        this.videoGroup.addChildAt(this.videoMC,0)
    }

    private getAnswer(){
        return PKManager.getInstance().chapterResetData[this.level] || this.question.list2
    }

    private showTips(){
        var list:any = this.getAnswer().split(',')
        for(var i=0;i<list.length;i++)
        {
            list[i] = {id:list[i],list:list} ;
        }
        //console.log(list)
        this.dataProvider.source = list;
        this.dataProvider.refresh();
        this.onItemChange();
        this.getTipsIcon.visible = true;
        this.renewTipsBtn();
    }


    public onPK(){
        var myList = this.getMyList();
        if(!myList)
        {
            MyWindow.ShowTips('请点击上方头像配置你的队伍')
            return;
        }
        if(this.energyGroup.visible)
        {
            if(UM.getEnergy()<1)
            {
                MyWindow.Confirm('体力不足,是否需要观看广告并补满？',(b)=>{
                    if(b==1)
                    {
                        ShareTool.openGDTV(()=>{
                            UM.addEnergy(UM.maxEnergy);
                        })
                    }
                },['取消', '补满']);
                return;
            }
            UM.addEnergy(-1);
        }

        this.addChild(MainPKUI.instance);
        MainPKUI.instance.top = 60
        MainPKUI.instance.bottom = 100 + Config.adHeight;
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
            //if(mc.currentMV.hitTestPoint(x,y,true))   //bug 3-26,去掉true
            if(mc.clickMC.hitTestPoint(x,y))   //bug 3-26,去掉true
            {
                var list = [];
                for(var j=0;j<this.monsterArr.length;j++)
                {
                    list.push(this.monsterArr[j].id)
                }
                CardInfoUI.getInstance().show(mc.id,list,i);
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
            item.bottom = 10+vo.height*1.2 - 5 + 10*Math.random()// + Math.random()*80
            item['w'] = vo.width
            item.x = begin + i*des
            this.monsterArr.push(item);
        }
        var sortList = this.monsterArr.concat();
        ArrayUtil.sortByField(sortList,['bottom','w'],[1,1]);
        for(var i=0;i<sortList.length;i++)
        {
            this.con.addChild(sortList[i]);
        }
        this.bg.source = PKManager.getInstance().getPKBG(this.question)
    }

    public onClose(){
        if(MainPKUI.instance.visible && MainPKUI.instance.parent == this)
        {
            MainPKUI.instance.hide();
            return;
        }
        if(this.level != UM.chapterLevel)
        {
            this.renew();
            return;
        }
        this.hide();
    }


    public show(){
        PKManager.getInstance().loadChapterData(()=>{
            super.show()
        },true)

    }

    public hide() {
        super.hide();
    }

    public addChoose(id){
        this.dataProvider.addItem({id:id,list:this.dataProvider.source})
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
        this.costText.text = '剩余费用：' + this.leaveCost + '/' + this.question.cost;
        MyTool.renewList(this.list)
        this.desText.visible = cost == 0
    }

    public getChooseNum(){
        return this.dataProvider.length;
    }

    public renewSize(){
        this.con.height = Math.min(this.height-55-100 - 100 - 317,500)
    }

    public onShow(){
        this.renewSize();
        this.once(egret.Event.ENTER_FRAME,this.renewSize,this)
        this.mainGroup.bottom = 100 + Config.adHeight;

        this.renew();
        this.addPanelOpenEvent(GameEvent.client.CHAPTER_CHANGE,()=>{
            this.renew();
        })
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
        this.renewEnergy();
        this.randomTalk();
    }
    private renewEnergy(){
        var energy = UM.getEnergy();
        if(energy > 0)
        {
            this.energyText.text = '剩余体力：' + energy + '/' + UM.maxEnergy
            this.energyText.textColor = 0xFFE3B7
            MyTool.removeMC(this.addEnergyBtn)
        }
        else
        {
            this.energyText.text = '下次恢复：' + DateUtil.getStringBySecond(UM.getNextEnergyCD()).substr(-5);
            this.energyText.textColor = 0xFF0000
            if(UM.isTest)
                MyTool.removeMC(this.addEnergyBtn)
            //else if(!this.addEnergyBtn.parent)
            //    this.energyGroup.addChild(this.addEnergyBtn);
        }
    }

    private lastTalk = 0;
    public randomTalk(){
        if(Math.random() > 0.5)
            return;
        var item = this.monsterArr[Math.floor(this.monsterArr.length*Math.random())];
        if(item && !item.talkItm)
        {
            if(egret.getTimer() < this.lastTalk)
                return;
            item.talk(2);
            this.lastTalk = egret.getTimer() + 3000 + Math.floor(Math.random()*2000);
        }
    }

    //private onChapterChange(){
    //    PKManager.getInstance().loadChapterData(Math.ceil(UM.chapterLevel/100),()=>{
    //        super.show()
    //    },true)
    //}

    private renewTitle(){
        if(MainPKUI.instance.visible && MainPKUI.instance.dataIn.isPK)
            this.topUI.setTitle('关卡解迷 - 第'+MainPKUI.instance.dataIn.level+'关')
        else
            this.topUI.setTitle('关卡解迷 - 第'+this.level+'关')
    }



    public renew(level?){
        this.level = level || UM.chapterLevel;
        this.question = PKManager.getInstance().getChapterData(this.level);
        this.renewTitle();
        this.showQuestion();
        this.setChooseList();
        this.renewEnergy();
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
                    arr[i] = {id:MonsterVO.getObject(arr[i]).id,list:arr};
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

        this.energyGroup.visible = this.level == UM.chapterLevel;
        this.freeEnergyText.visible = !this.energyGroup.visible;
        if(this.level == UM.chapterLevel && UM.chapterLevel > 1)
        {
            this.btnGroup.addChildAt(this.historyBtn,0)
        }
        else
        {
            MyTool.removeMC(this.historyBtn);
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