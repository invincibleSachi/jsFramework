module.exports={
    getDate:function(format, date){
        if(date===undefined){
            date=new Date();
        }
        var dd = date.getDate();
        var mm = date.getMonth()+1; //January is 0!

        var yyyy = date.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        }
        switch(format){
            case "mm/dd/yyyy": return mm+'/'+dd+'/'+yyyy;
            case "dd/mm/yyyy": return dd+"/"+mm+"/"+yyyy;
            case "yyyy/mm/dd": return yyyy+"/"+mm+"/"+dd;
            case "dd-mm-yyyy": return dd+"-"+mm+"-"+yyyy;
            case "mm-dd-yyyy": return mm+'-'+dd+'-'+yyyy;
            case "yyyy-mm-dd": return yyyy+"-"+mm+"-"+dd;
            default: return mm+'/'+dd+'/'+yyyy;
        }
    },
    getEpochTime:function(delta){
        if(delta===undefined){
            delta=0;
        }
        var epoch =Math.floor(Date.now() / 1000);
        epoch=epoch+delta;
        return epoch;
    },
    getTime:function(format,deltaHH, deltaMM,deltaSS){
        var time = new Date();
        var HH=time.getHours();
        var MM=time.getMinutes();
        var SS=time.getSeconds();
        var HH1=HH-12;
        if(deltaHH===undefined){
            deltaHH=0;
            HH=HH+deltaHH;
            HH1=HH-12;
        }
        if(deltaMM===undefined){
            deltaMM=0;
            MM=MM+deltaMM;
        }
        if(deltaSS===undefined){
            deltaSS=0;
            SS=SS+deltaSS;
        } 
        if(HH<10){
            HH="0"+HH;
        }
        if(MM<10){
            MM="0"+MM;
        }
        if(SS<10){
            SS="0"+SS;
        }
        
        switch(format){
            case "HH:MM":return HH+":"+MM;
            case "HH:MM:SS":return HH+":"+MM+":"+SS;
            case "HH:MM:AM": if(HH1<12){
                    return HH+":"+MM +" AM";
                }else{
                    return HH+":"+MM +" PM";
                }
            case "default":return HH+":"+MM;
        }
    },
    getRandomText:function(size){
        if(size===undefined){
            size=8;
        }
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var randomstring = '';
        for (var i=0; i<size; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum,rnum+1);
        }
        return randomstring;
    },
    getRandomNumeric:function(min,max){
        return Math.floor((Math.random() * max) + min);
    }
}