class NumberUtil {
	public constructor() {
	}
	
    public static addNumSeparator(num,len = 2){
        //KB，MB，GB，TB，EB，ZB，YB，B
        var wordStep = 4
        var arr = ['万','亿','兆','京','垓','杼','穰','沟','涧']
        //var wordStep = 3
        //var arr = ['K','M','G','T','P','E','Z','Y','B','N','D']
        var s = String(num);
        s = s.replace("e+","E");
        s = s.replace("e","E");
        s = s.replace("E+","E");
        var numArr = s.split("E");
        var ss = numArr[0];
        if(numArr.length > 1)
        {
            var zeroLen = parseInt(numArr[1]);
            //把小数点补成整数
            ss = ss.replace('.','')
            zeroLen -= ss.length-1;

            if(zeroLen< 0)
            {
                ss = ss.substr(0,ss.length-zeroLen)
            }
            else
            {
                while(zeroLen--)
                {
                    ss += '0'
                }
            }

        }
        var stepNum = Math.ceil(ss.length/wordStep)//一共有多少位
        var wordNum = stepNum - len;//要转换的位数
        var addStr = ''
        if(wordNum > 0)
        {
            ss = ss.substr(0,ss.length-wordNum*wordStep);
            var index = arr.length
            while(index){
                while(wordNum >= index)
                {
                    addStr = arr[index-1] + addStr
                    wordNum -= index
                }
                index--;
            }
        }

        while (ss.length>wordStep) {
            addStr = "," + ss.substr(-wordStep) + addStr;
            ss = ss.substr(0,ss.length-wordStep);
        }

        return ss + addStr;
    }
    
    //将数字格式化为带有逗号千位分隔符
    //from: http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript/2901298#2901298
    public static numberWithCommas(num) {
        if(num >= 10000) return num/10000 + "万";
        var parts = num.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
   }

    /**
     * 格式化 数字显示，10万以下显示数字，10以上显示字母
     * 例如 100M 33,445a
     */
    public static formatStrNum(value: number): string {
        if(value < 10000) {
            return "" + value;
        }
        var numCode: Array<string> = ["K","M","G","T"];
        var newValue: number;
        for(var i: number = 0;i < numCode.length;i++) {
            newValue = value / (Math.pow(1000,(i + 1)));
            if(newValue < 1000){
                return Math.floor(newValue*100)/100 + numCode[i];
            }
        }
        return "999.9T+";
    }
}
