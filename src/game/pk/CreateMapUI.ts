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

    private addBtn: eui.Button;
    private deleteBtn: eui.Button;
    private getSaveBtn: eui.Button;
    private closeBtn: eui.Button;
    private editGroup: eui.Group;
    private okBtn: eui.Button;
    private scaleText: eui.EditableText;
    private xText: eui.EditableText;
    private yText: eui.EditableText;




    private data;
    private itemArr = []
    private chooseItem;

    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.okBtn,()=>{
            if(this.chooseItem)
            {
                this.chooseItem.scaleY = this.chooseItem.scaleX = Number(this.scaleText.text)
                this.chooseItem.x =  Number(this.xText.text)
                this.chooseItem.y =  Number(this.yText.text)
            }
            this.chooseItem = null;
            this.editGroup.visible = false;
        })

        this.addBtnEvent(this.closeBtn,()=>{
            this.hide();
        })

        this.addBtnEvent(this.addBtn,()=>{
            var item = CreateMapItem.createItem();
            this.itemArr.push(item)
            this.addChild(item);
            item.x = 320
            item.y = GameManager.uiHeight - 300;
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
            }
        })

        this.addBtnEvent(this.getSaveBtn,()=>{
            this.save();

        })

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
    }

    public save(){
        var arr = [];
        for(var i=0;i<this.itemArr.length;i++)
        {
            var item = this.itemArr[i];
            arr.push(Math.floor(item.x) + ',' + Math.floor(item.y) + ',' + MyTool.toFixed(item.scaleX,2))
        }

        if(this.data)
        {
            this.data.data = arr.join('#');
            MyWindow.ShowTips('保存成功！---' + this.data.id)
        }
        else
        {
            var id = ObjectUtil.objLength(LevelVO.data) + 1
            var levelVO = new LevelVO();
            levelVO.id = id;
            levelVO.data = arr.join('#');
            LevelVO.data[id] = levelVO;
            MyWindow.ShowTips('保存成功！---' + levelVO.id)
        }


    }
}