const scriptName = "SlotGame.js";



data="sdcard/BotData/database/SlotGame.txt";

var rooms = [];
var coin={};


function Fr(path) {
    return FileStream.read(path);
}
function Fw(path, value) {
    return FileStream.write(path, value);
}


let slot = [[],[],[]];

const defaultslot = [

    ["♤","♤","♤"],
    ["♤","♤","♤"],
    ["♤","♤","♤"]
];

const symbol = ["♤","♧","♡","◇"];


function winType1 () {
    var cnt = 0;
    for(var i=0;i<3;i++) {
        cnt += (slot[i][0] == slot[i][1] && slot[i][1] == slot[i][2])? 1 : 0;
    }
    return cnt;
}

function winType2 () {
    var cnt = 0;
    cnt += (slot[0][0] == slot[1][1] && slot[1][1] == slot[0][2])? 1 : 0;
    cnt += (slot[2][0] == slot[1][1] && slot[1][1] == slot[2][2])? 1 : 0;
    return cnt;
}

function winType3 () {
    var cnt = 0;
    cnt += (slot[0][0] == slot[1][1] && slot[1][1] == slot[2][2])? 1 : 0;
    cnt += (slot[2][0] == slot[1][1] && slot[1][1] == slot[0][2])? 1 : 0;
    return cnt;
}




const Slot = {

    run : function () {
        for(var i=0;i<3;i++) {
            for(var j=0;j<3;j++) {
                slot[i][j] = symbol[Math.floor(Math.random()*symbol.length)];
            }
        }
        var result = [slot[0].join("|")+"\n"+slot[1].join("|")+"\n"+slot[2].join("|")].join();
        return result;
    },

    check : function () {
        var score=0;
        score+=winType1()*200;
        score+=winType2()*100;
        score+=winType3()*200;
        return score;
    }

};


function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    if (!(rooms.includes(room))) return;
    if(Fr(data)==null) Fw(data, "{}");

    if(coin[sender]!=undefined) {
        coin[sender]=10000;
    }
    if(msg=="h슬롯돌리기") {
        if(coin[sender]<100) {
            replier.reply("코인이 부족합니다.\n" + sender + "님의 코인: " + coin[sender]);
            return;
        }
        coin[sender]-=100;
        replier.reply(Slot.run());
        replier.reply("가로: " + winType1() + "개 ("+winType1()*200+" point)\nV, A자: "+winType2()+"개 ("+winType2()*100+" point)\n대각선: "+winType3()+"개 ("+winType3()*200+" point)\n총점: "+Slot.check());
        coin[sender]+=Slot.check();
    }
    if(msg=="h코인") {
        if(coin[sender]>=100) {
            replier.reply("100코인 이상 보유중입니다.");
            return;
        }
        coin[sender] +=10000;
        replier.reply("10000코인이 지급되었습니다.");
    }
}
