class MyTool {
    public constructor() {
        /*


         */
    }

    public static save(){
        var arr = [DateUtil.formatDate('MM-dd hh:mm:ss',new Date()),'id\tdata\thard'];
        for(var i=0;i<LevelVO.list.length;i++)
        {
            var vo = LevelVO.list[i]
            arr.push(vo.id + '\t' + vo.data + '\t' + vo.hard)
        }
        egret.localStorage.setItem('levelData', arr.join('\n'));
        MyWindow.ShowTips('保存成功')
    }

    public static copyStr(str:any, showTips:boolean=true){
        //if(window["wx"]){
        //    str += "";//保证是string
        //    window["wx"].setClipboardData({
        //        data: str,
        //        success: function(res) {
        //            // MyAlert.showTip("复制成功"); //微信自带有提示
        //        }
        //    })
        //    return;
        //}
        var input = document.createElement("input");
        input.value = str;
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, input.value.length);
        document.execCommand('Copy');
        document.body.removeChild(input);

        if(showTips){
            MyWindow.ShowTips("复制成功");
        }
    }

    public static clearList(list){
        list.dataProvider = null;
        //必现调用下面2句，并且 需要在hide之前调用
        list.dataProviderRefreshed();
        list.validateNow();
    }

    public static renewList(list){
        for(var i=0;i<list.numChildren;i++)
        {
            list.getChildAt(i)['dataChanged']();
        }
    }
    public static runListFun(list,funName){
        for(var i=0;i<list.numChildren;i++)
        {
            var mc = list.getChildAt(i);
            var fun = mc[funName]
            fun && fun.apply(mc);
        }
    }


    public static removeMC(mc:any){
        if(mc && mc.parent)
            mc.parent.removeChild(mc)
    }
    public static upMC(mc:any){
        if(mc && mc.parent)
            mc.parent.addChild(mc)
    }

    public static getDis(a,b){
        return Math.pow(Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2),0.5)
    }

    public static resetAngle(angle){
        while(angle < 0)
            angle += 360
        while(angle >= 360)
            angle -= 360
        return angle
    }

    public static getMiddleXY(a,b){
        return {
            x:a.x + (b.x - a.x)/2,
            y:a.y + (b.y - a.y)/2,
        }
    }

    public static addColor(img,color){
        if(color == -1)
        {
            img.filters = null;
            return;
        }
        //var color:number = 0x33CCFF;        /// 光晕的颜色，十六进制，不包含透明度
        var alpha:number = 0.8;             /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
        var blurX:number = 35;              /// 水平模糊量。有效值为 0 到 255.0（浮点）
        var blurY:number = 35;              /// 垂直模糊量。有效值为 0 到 255.0（浮点）
        var strength:number = 2;            /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
        var quality:number = egret.BitmapFilterQuality.HIGH;        /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
        var inner:boolean = false;            /// 指定发光是否为内侧发光，暂未实现
        var knockout:boolean = false;            /// 指定对象是否具有挖空效果，暂未实现
        var glowFilter:egret.GlowFilter = new egret.GlowFilter( color, alpha, blurX, blurY,
            strength, quality, inner, knockout );
        img.filters = [ glowFilter ];
    }

    public static changeGray(mc,b=true,isBtn?){
        if(isBtn)
        {
            mc.touchChildren = mc.touchEnabled = !b
        }
        if(!b)
        {
            mc.filters = null;
            return;
        }
        var colorMatrix = [
            0.3,0.6,0,0,0,
            0.3,0.6,0,0,0,
            0.3,0.6,0,0,0,
            0,0,0,1,0
        ];
        var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
        mc.filters = [colorFlilter];
    }

    //加载时隐藏，加载完显示
    public static setImgSource(img,source){
        if(img.source == source)
            return;
        img.visible = false;
        img.once(egret.Event.COMPLETE,this.onImgComplete,this); //写在外部，防止重复调用
        img.source = source;
    }
    private static onImgComplete(e){
       e.currentTarget.visible = true;
    }

    public static toFixed(v:any,length){
        var str = v.toFixed(length)
        var char = str.charAt(str.length-1);
        while(char == '0' || char == '.')
        {
            str = str.substr(0,str.length - 1)
            if(char == '.')
                break;
            char = str.charAt(str.length-1);
        }
        return str
    }

    public static resetScrollV(scroller){
        if(scroller.viewport.scrollV < 0)
            scroller.viewport.scrollV = 0;
        else if(scroller.viewport.scrollV + scroller.viewport.height > scroller.viewport.contentHeight)
            scroller.viewport.scrollV =  Math.max(0,scroller.viewport.contentHeight - scroller.viewport.height);
        else
            return;
        scroller.stopAnimation();
    }




    //得到数据变化过程数组
    public static getValueChangeArray(from,to,times,noInt=false){
         var array = [];
        for(var i=0;i<times;i++)
        {
           var v = from + (to - from)/times*(i + 1);
            if(!noInt)
                v = Math.floor(v);
            array.push(v)
        }
        return array;
    }


    public static addLongTouch(mc,fun,thisObj){
        var timer;
        mc.touchEnabled = true;
        mc.addEventListener(egret.TouchEvent.TOUCH_BEGIN,onTouchStart,thisObj);
        function onTouchStart(e){
            var stageX = e.stageX
            var stageY = e.stageY
            GameManager.stage.removeEventListener(egret.TouchEvent.TOUCH_END,onTouchEnd,thisObj);
            GameManager.stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL,onTouchEnd,thisObj);
            GameManager.stage.once(egret.TouchEvent.TOUCH_END,onTouchEnd,thisObj);
            GameManager.stage.once(egret.TouchEvent.TOUCH_CANCEL,onTouchEnd,thisObj);
            clearTimeout(timer);
            timer = setTimeout(function(){
                if( Math.abs(GameManager.stageX - stageX) > 20 ||  Math.abs(GameManager.stageY - stageY) > 20)
                {
                    GameManager.stage.removeEventListener(egret.TouchEvent.TOUCH_END,onTouchEnd,thisObj);
                    GameManager.stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL,onTouchEnd,thisObj);
                    return;
                }
                //mc.touchEnabled = false;
                //egret.callLater(function(){
                //    mc.touchEnabled = true;
                //},this)
                fun.apply(thisObj);
            },400)

        }
        function onTouchEnd(e){
            GameManager.stage.removeEventListener(egret.TouchEvent.TOUCH_END,onTouchEnd,thisObj);
            GameManager.stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL,onTouchEnd,thisObj);
            clearTimeout(timer);
        }

    }

    //public static addTouchUp(mc,fun,thisObj){
    //    mc.touchEnabled = true;
    //    mc.addEventListener(egret.TouchEvent.TOUCH_BEGIN,onTouchStart,thisObj,true,999)
    //    var stageX
    //    var stageY
    //    function onTouchStart(e){
    //        stageX = e.stageX
    //        stageY = e.stageY
    //        GameManager.stage.removeEventListener(egret.TouchEvent.TOUCH_END,onTouchEnd,thisObj);
    //        GameManager.stage.addEventListener(egret.TouchEvent.TOUCH_END,onTouchEnd,thisObj);
    //        mc.dispatchEventWith('before_drag',true);
    //    }
    //
    //    function onTouchEnd(){
    //        GameManager.stage.removeEventListener(egret.TouchEvent.TOUCH_END,onTouchEnd,thisObj);
    //        if( Math.abs(GameManager.stageX - stageX) < 50 &&  stageY-GameManager.stageY > 50)
    //        {
    //            fun.apply(thisObj);
    //        }
    //        mc.dispatchEventWith('after_drag',true);
    //
    //    }
    //
    //}

    //双击监听
    public static addDoubleTouch(mc:any,fun,thisObj?){
        mc.addEventListener(egret.TouchEvent.TOUCH_TAP,onClick,thisObj,false,100);
        var timer = -1;
        function onClick(e){
            if(egret.getTimer() - timer < 500)
            {
                e.stopPropagation();
                fun.apply(thisObj);
            }
            timer = egret.getTimer();
        }
    }

    public static setHtml(txt,str){
        txt.textFlow = new egret.HtmlTextParser().parser(str);
    }
    public static setColorText(txt,str,color?){
        color = color || '#FFDE93'
        str = str.replace(/\[/g,'<font color="'+color+'">')
        str = str.replace(/\]/g,'</font>')
        this.setHtml(txt,str);
    }

    public static myHitTest(item,x,y){
        var p1 = item.localToGlobal(0,0)
        var p2 = item.localToGlobal(item.width,item.height);
        return p1.x < x && x < p2.x &&  p1.y < y && y < p2.y;
    }

    public static changeToChinese(num){
        var s = String(num);
        var arr1 = ['','一','二','三','四','五','六','七','八','九']
        var arr2 = ['十','百','千','万']

        var ss="";
        var temp = s.split('');
        var index = 0;
        for(var i=temp.length-1;i>=0;i--)
        {
            ss =  arr1[temp[i]] + ss
            if(i != 0)
            {
                ss = arr2[index] + ss
                index++;
            }

        }
        return ss;

    }

    public static addTestBlock(mc){
        var item = new egret.Sprite()
        mc.addChild(item);
        item.graphics.beginFill(0);
        item.graphics.drawRect(0,0,10,10);
        item.graphics.endFill();
        return item;
    }

    //把单个字符翻译为数字
    public static str2Num(str){
        var code = str.charCodeAt(0);
        if(code < 58)
            return code - 48;
        if(code < 91)//65+26
            return code - 55//code - 65 + 10
        return  code - 61//code-97+10+26
    }


    public static replaceEmoji(str){
        var ranges = [
            '\ud83c[\udf00-\udfff]',
            '\ud83d[\udc00-\ude4f]',
            '\ud83d[\ude80-\udeff]'
        ];
        return str.replace(new RegExp(ranges.join('|'), 'g'), '');
    }

    public static getBtnPath(btn){
        if(!btn)
            return ''
        var arr = [];
        if(btn.id)
            arr.push(btn.id)
        while(btn.parent)
        {
            if(btn.parent.id)
                arr.unshift(btn.parent.id)
            else if(btn.parent.skinName)
                arr.unshift(btn.parent.skinName)
            btn = btn.parent;
        }
        return arr.join('.')
    }

    public static refresh(){
        location.reload();
    }
    public static createHtml(str:string | number, color?:number, size?:number):string{
        var str2 = "";
        if(color != undefined) str2 += 'color="' + color + '"';
        if(size != undefined) str2 += ' size="' + size + '"';
        return '<font ' + str2 + '>'+ str + '</font>';
    }

    //一定时间内不能点击屏幕
    public static stopClick(cd){
        GameManager.container.touchChildren = GameManager.container.touchEnabled = false;
        setTimeout(function(){
            GameManager.container.touchChildren = GameManager.container.touchEnabled = true
        },cd)

    }

    public static getSector(r: number = 100,startFrom: number = 0,angle: number = 360,color: number = 0xff0000,alpha=1,shape?: egret.Shape): egret.Shape {
        if(!shape)
            shape = new egret.Shape();
        var x: number = 0;
        var y: number = 0;
        shape.graphics.clear();
        shape.graphics.beginFill(color,alpha);
        //shape.graphics.lineStyle(0, 0xff0000);
        shape.graphics.moveTo(x,y);
        angle = (Math.abs(angle) > 360) ? 360 : angle;
        var n: number = Math.ceil(Math.abs(angle) / 45);
        var angleA: number = angle / n;
        angleA = angleA * Math.PI / 180;
        startFrom = startFrom * Math.PI / 180;
        shape.graphics.lineTo(x + r * Math.cos(startFrom),y + r * Math.sin(startFrom));
        for(var i = 1;i <= n;i++) {
            startFrom += angleA;
            var angleMid = startFrom - angleA / 2;
            var bx = x + r / Math.cos(angleA / 2) * Math.cos(angleMid);
            var by = y + r / Math.cos(angleA / 2) * Math.sin(angleMid);
            var cx = x + r * Math.cos(startFrom);
            var cy = y + r * Math.sin(startFrom);
            shape.graphics.curveTo(bx,by,cx,cy);
        }
        if(angle != 360) {
            shape.graphics.lineTo(x,y);
        }
        shape.graphics.endFill();
        return shape;
    }
}



