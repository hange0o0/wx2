class CreateMapUI extends game.BaseUI {

    private static _instance:CreateMapUI;
    public static getInstance() {
        if (!this._instance) this._instance = new CreateMapUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "CreateMapUISkin";
    }

    private copyBtn: eui.Button;
    private testBtn: eui.Button;
    private resetBtn: eui.Button;
    private closeBtn: eui.Button;
    private deleteBtn: eui.Button;
    private addBtn: eui.Button;
    private getSaveBtn: eui.Button;
    private editGroup: eui.Group;
    private okBtn: eui.Button;
    private scaleText: eui.EditableText;
    private xText: eui.EditableText;
    private yText: eui.EditableText;
    private titleText: eui.Label;
    private hardText: eui.Label;
    private leftBtn: eui.Image;
    private rightBtn: eui.Image;










    private data;
    private itemArr = []
    private chooseItem;

    public isChange = false
    public isCtrlDown = false
    public childrenCreated() {
        super.childrenCreated();

        document.addEventListener("keydown",(evt:any)=>{
            if(evt.keyCode==17){
                this.isCtrlDown = true;
            }
            if(this.editGroup.visible)
            {
                var b = false
                if(evt.keyCode==37){
                    this.chooseItem.x --;
                    b = true;
                }
                else if(evt.keyCode==38){
                    this.chooseItem.y --;
                    b = true;
                }
                else if(evt.keyCode==39){
                    this.chooseItem.x ++;
                    b = true;
                }
                else if(evt.keyCode==40){
                    this.chooseItem.y ++;
                    b = true;
                }

                if(b)
                {
                    this.xText.text =  this.chooseItem.x
                    this.yText.text =  this.chooseItem.y
                }

                return;
            }

            var arr = [];
            for(var i=0;i<this.itemArr.length;i++)
            {
                var item = this.itemArr[i];
                if(item.isChoose)
                {
                    arr.push(item)
                }
            }

            if(arr.length)
            {
                if(evt.keyCode==37){
                    this.setListXY(arr,-1,0)
                }
                else if(evt.keyCode==38){
                    this.setListXY(arr,0,-1)
                }
                else if(evt.keyCode==39){
                    this.setListXY(arr,1,0)
                }
                else if(evt.keyCode==40){
                    this.setListXY(arr,0,1)
                }
            }
        })

        document.addEventListener("keyup",(evt:any)=>{
            if(evt.keyCode==17){
                this.isCtrlDown = false;
            }
        })

        this.addBtnEvent(this.okBtn,()=>{
            if(this.chooseItem)
            {
                this.chooseItem.scaleY = this.chooseItem.scaleX = Number(this.scaleText.text)
                this.chooseItem.x =  Number(this.xText.text)
                this.chooseItem.y =  Number(this.yText.text)
                this.isChange = true;
            }
            this.chooseItem = null;
            this.editGroup.visible = false;
            this.renewHard();
        })

        this.addBtnEvent(this.closeBtn,()=>{
            if(this.isChange)
            {
                MyWindow.Confirm('还没保存，确定退出吗？',(b)=>{
                    if(b==1)
                    {
                        this.hide();
                    }
                },['取消','确定']);
                return
            }
            this.hide();
        })

        this.addBtnEvent(this.copyBtn,()=>{
            if(this.isChange)
            {
                MyWindow.Confirm('还没保存，确定退出吗？',(b)=>{
                    if(b==1)
                    {
                         this.onCopy();
                    }
                },['取消','确定']);
                return
            }
            this.onCopy();
        })

        this.addBtnEvent(this.addBtn,()=>{
            var item = CreateMapItem.createItem();
            this.itemArr.push(item)
            this.addChild(item);
            item.x = 320
            item.y = GameManager.uiHeight - 300;
            this.isChange = true;
            this.renewHard();
        })

        this.addBtnEvent(this.deleteBtn,()=>{
            if(this.chooseItem)
            {
                MyTool.removeMC(this.chooseItem);
                var index = this.itemArr.indexOf(this.chooseItem);
                if(index != -1)
                    this.itemArr.splice(index,1);
                this.chooseItem = null;
                this.editGroup.visible = false;
                this.renewHard();
            }
        })

        this.addBtnEvent(this.getSaveBtn,()=>{
            this.save();
            this.isChange = false;
        })

        this.addBtnEvent(this.resetBtn,()=>{
            this.reset();
            this.isChange = true;
        })

        this.addBtnEvent(this.leftBtn,()=>{
            if(this.isChange)
            {
                MyWindow.Confirm('还没保存，确定退出吗？',(b)=>{
                    if(b==1)
                    {
                        this.onLeft();
                    }
                },['取消','确定']);
                return
            }
            this.onLeft()
        })

        this.addBtnEvent(this.rightBtn,()=>{
            if(this.isChange)
            {
                MyWindow.Confirm('还没保存，确定退出吗？',(b)=>{
                    if(b==1)
                    {
                        this.onRight();
                    }
                },['取消','确定']);
                return
            }
            this.onRight()
        })


        this.addBtnEvent(this.testBtn,()=>{
            PKUI.getInstance().show(this.getSaveData())
        })

        this.addEventListener('end_drag',()=>{
            this.isChange = true;
        },this);

    }

    private setListXY(arr,x=0,y=0){
        for(var i=0;i<arr.length;i++)
        {
            var item = arr[i];
            item.x += x
            item.y += y
        }
    }

    private reset(){
        var y1 = 999;
        var y2 = 0;
        var arr = [];
        for(var i=0;i<this.itemArr.length;i++)
        {
            var item = this.itemArr[i];
            if(item.isChoose)
            {
                y1 = Math.min(y1,item.y);
                y2 = Math.max(y2,item.y);
                arr.push(item)
            }
        }
        ArrayUtil.sortByField(arr,['x'],[0])
        var callY = (y1+y2)/2
        var xLen = arr[arr.length-1].x - arr[0].x
        var xStart = 320 - xLen/2;
        if(arr.length > 1)
            var xStep = xLen/(arr.length-1)
        else
            var xStep = 0

        for(var i=0;i<arr.length;i++)
        {
            arr[i].y = callY
            arr[i].x = xStart + xStep*i;
        }

        this.cleanChoose();
    }

    private onLeft(){
        var index = LevelVO.list.indexOf(this.data);
        if(index == -1)
            this.data = LevelVO.list[LevelVO.list.length-1]
        else
            this.data = LevelVO.list[index-1]
        this.renew();
    }

    private onRight(){
        var index = LevelVO.list.indexOf(this.data);
        this.data = LevelVO.list[index+1]
        this.renew();
    }

    private onCopy(){
        this.data = null;
        this.titleText.text = '新建地图' + (ObjectUtil.objLength(LevelVO.data) + 1)
        this.isChange = true;
        this.leftBtn.visible = LevelVO.list.length > 0
        this.rightBtn.visible = false
    }

    public showTips(item){
        this.addChild(this.editGroup)
        this.chooseItem = item;
        this.editGroup.visible = true;
        this.xText.text =  item.x
        this.yText.text =  item.y
        this.scaleText.text =  item.scaleX
    }

    public show(data?){
        this.data = data;

        super.show();
    }

    public onShow(){
        this.editGroup.visible = false;
        this.chooseItem = null;
        this.renew();
    }

    private renew(){
        this.isChange = false;
        while(this.itemArr.length)
            CreateMapItem.freeItem(this.itemArr.pop())


        if(this.data)
        {
            this.titleText.text = '' + this.data.id;
            var list = this.data.data.split('#')
            for(var i=0;i<list.length;i++)
            {
                var temp = list[i].split(',');
                var item = CreateMapItem.createItem();
                this.itemArr.push(item)
                this.addChild(item);
                item.x = parseInt(temp[0])
                item.y = parseInt(temp[1])
                item.scaleX = item.scaleY = Number(temp[2])
            }

            var index = LevelVO.list.indexOf(this.data);
            this.leftBtn.visible = index > 0
            this.rightBtn.visible = index < LevelVO.list.length - 1;
        }
        else
        {
            this.titleText.text = '新建地图' + (LevelVO.list.length + 1)

            this.leftBtn.visible = LevelVO.list.length > 0
            this.rightBtn.visible = false
        }

        this.renewHard();
        this.cleanChoose();
    }

    private getSaveData(){
        var arr = [];
        for(var i=0;i<this.itemArr.length;i++)
        {
            var item = this.itemArr[i];
            arr.push(Math.floor(item.x) + ',' + Math.floor(item.y) + ',' + MyTool.toFixed(item.scaleX,2))
        }
        return arr.join('#')
    }

    public save(){
        var data = this.getSaveData();

        if(this.data)
        {
            this.data.data = data
            this.data.hard = parseInt(this.hardText.text) || 1;
        }
        else
        {
            var id = LevelVO.list.length + 1
            var levelVO = new LevelVO();
            levelVO.id = id;
            levelVO.data = data
            levelVO.hard = parseInt(this.hardText.text) || 1;
            LevelVO.data[id] = levelVO;
            LevelVO.list.push(levelVO);
            this.data = levelVO;
            this.titleText.text = '' + this.data.id;
        }
        MyTool.save();
    }

    private renewHard(){
        var hard = 0;
        for(var i=0;i<this.itemArr.length;i++)
        {
            var item = this.itemArr[i];
            hard += Math.pow(item.scaleX,6)
        }
        this.hardText.text = Math.round(hard) + ''
    }

    public setChoose(item){
        if(this.isCtrlDown)
        {
            item.setChoose(!item.isChoose)
            for(var i=0;i<this.itemArr.length;i++)
            {
                var item = this.itemArr[i];
                if(item.isChoose)
                {
                    this.resetBtn.visible = true;
                    return;
                }
            }
            this.resetBtn.visible = false;
        }
        else
        {
             this.cleanChoose();
        }
    }

    private cleanChoose(){
        this.resetBtn.visible = false;
        for(var i=0;i<this.itemArr.length;i++)
        {
            var item = this.itemArr[i];
            item.setChoose(false)
        }
    }
}