// Basic variable declaration - keep track of how many of each
// item we currently own, and how much the new ones should cost.
function chargeForType(type,cost){
    switch(type){
        case 'widget':
            if ( data.widgetCount < cost ) {
                return false;
            }
            data.widgetCount -= cost;
            break;
        case 'dodad':
            if ( data.widgetCount < cost ) {
                return false;
            }
            data.dodadCount -= cost;
            break;
        default:
            break;
        }
    return true
}
class AutoBuyerOptions{
    constructor(enabled){
        this.enabled = enabled;
    }
}
var options = {
    autobuyers: {
        widgeteers: {
            novice1: new AutoBuyerOptions(true),
            novice10: new AutoBuyerOptions(false),
            intermediate1: new AutoBuyerOptions(false),
            intermediate10: new AutoBuyerOptions(false),
            master1: new AutoBuyerOptions(false),
            master10: new AutoBuyerOptions(false),
            expert1: new AutoBuyerOptions(false),
            expert10: new AutoBuyerOptions(false)
        },
        dodadeers: {
            novice1: new AutoBuyerOptions(false),
            novice10: new AutoBuyerOptions(false),
            intermediate1: new AutoBuyerOptions(false),
            intermediate10: new AutoBuyerOptions(false)
        }
    }
}

class Worker{
    constructor(type,count, speed, purchased, setBonus, setSize, cost, costIncrease, interval){
        this.type=type;
        this.count = count;
        this.speed = speed;
        this.purchased = purchased;
        this.setBonus = setBonus;
        this.setSize = setSize;
        this.cost = cost;
        this.costIncrease = costIncrease;
        this.interval = interval;
    }

    get countToSet() {
        return this.setSize - this.purchased%this.setSize;
    }
    get priceToSet() {
        return this.priceToCount(this.countToSet);
    }
    
    purchase(count){
        if(count <= 0 || count > this.setSize){
            return;
        }
        // Deduct cost
        if (chargeForType(this.type, this.priceToCount(count))) {
            this.count += count;
            this.purchased += count;
            // Increase cost for the next one, using Math.ceil() to round up
            this.cost = increasePrice(count,this.cost,this.costIncrease);
            if(this.countToSet==this.setSize){
                M.toast({html: 'Buying ' + this.setSize + ' gets you a bonus, currently '+ (this.purchased/this.setSize)*this.setBonus})
            }
        }
    }

    purchaseNextSet(){
        this.purchase(this.countToSet);
    }

    priceToCount(count){
        var priceToCount = 0;
        var currentPrice = this.cost;
        for (var i=0; i < count; i++){
            priceToCount+=currentPrice;
            currentPrice*=this.costIncrease;
        }
        return priceToCount;
    }

    produce(msSinceUpdate){
        if (this.count == 0){
            return 0;
        }
        return this.totalSpeed * msSinceUpdate / this.interval ;
    }

    get totalSpeed(){
        // get the flat speed rate for count
        var flatSpeed = this.count * this.speed;
        //bonus based on how many set groups have been purchased
        var bonusCount = Math.floor(this.purchased/this.setSize);
        if (bonusCount == 0) return flatSpeed;
        return flatSpeed * bonusCount * this.setBonus;
    }
}

class dataClass{
    constructor(widgeteers, dodadeers, numWidgets, numDodads){
        this.widgeteers = widgeteers;
        this.dodadeers = dodadeers;
        this.widgetCount = numWidgets;
        this.dodadCount = numDodads;
    }

    set numWidgets(value){
        if(Number.isNaN(value)){
            value = 0;
        }
        this.widgetCount = parseFloat(value);
    }

    get numWidgets(){
        return this.widgetCount;
    }

    set numDodads(value){
        if(Number.isNaN(value)){
            value = 0;
        }
        this.dodadCount = parseFloat(value);
    }

    get numDodads(){
        return this.dodadCount;
    }
}

var data = new dataClass(
    { //widgeteers
        novice: new Worker(
            'widget', // type
            0, //count
            1, //speed
            0, //purchased
            1.2, // setBonus
            10, // setSize
            100, //cost
            1.1, //costIncrease
            1000, // interval
        ),
        intermediate: new Worker(
            'widget', // type
            0, //count
            0.95, //speed
            0, //purchased
            1.2, // setBonus
            10, // setSize
            500, //cost
            1.15, //costIncrease
            1000, // interval
        ),
        master: new Worker (
            'widget', // type
            0, //count
            0.9, //speed
            0, //purchased
            1.2, // setBonus
            10, // setSize
            2500, //cost
            1.2, //costIncrease
            1000, // interval
        ),
        expert: new Worker(
            'widget', // type
            0, //count
            0.85, //speed
            0, //purchased
            1.2, // setBonus
            10, // setSize
            50000, //cost
            1.25, //costIncrease
            1000, // interval
        ),
        speed: 0,
    },
    { //dodadeers
        novice: new Worker(
            'dodad', // type
            0, //count
            0.1, //speed
            0, //purchased
            1.2, // setBonus
            10, // setSize
            100, //cost
            1.1, //costIncrease
            1000, // interval
        ),
        intermediate: new Worker(
            'dodad', // type
            0, //count
            0.095, //speed
            0, //purchased
            1.2, // setBonus
            10, // setSize
            500, //cost
            1.15, //costIncrease
            1000, // interval
        ),
        master: new Worker (
            'dodad', // type
            0, //count
            0.09, //speed
            0, //purchased
            1.2, // setBonus
            10, // setSize
            250, //cost
            1.2, //costIncrease
            1000, // interval
        ),
        expert: new Worker(
            'dodad', // type
            0, //count
            0.085, //speed
            0, //purchased
            1.2, // setBonus
            10, // setSize
            500, //cost
            1.25, //costIncrease
            1000, // interval
        ),
        speed: 0,
    },
    1, //numWidgets
    0, //numDodads
)

var lastRun = Date.now();
var widgetsLastRun = 0;
var widgetSpeedLastRuns = [];
var dodadsLastRun = 0;
var dodadSpeedLastRuns = [];

$(document).ready(function(){
    $('.tabs').tabs();
    // set initial pricing.
    $('#novice-widgeteer-1').text('1 - ' + numberForDisplay(data.widgeteers.novice.cost,2));
    $('#novice-widgeteer-10').text([data.widgeteers.novice.countToSet, numberForDisplay(data.widgeteers.novice.priceToSet,2)].join(' - '));
    $('#intermediate-widgeteer-1').text('1 - ' + numberForDisplay(data.widgeteers.intermediate.cost,2));
    $('#intermediate-widgeteer-10').text([data.widgeteers.intermediate.countToSet, 
                                              numberForDisplay(data.widgeteers.intermediate.priceToSet,2)].join(' - '));  
    $('#master-widgeteer-1').text('1 - ' + numberForDisplay(data.widgeteers.master.cost,2));
    $('#master-widgeteer-10').text([data.widgeteers.master.countToSet, numberForDisplay(data.widgeteers.master.priceToSet,2)].join(' - '));
    $('#expert-widgeteer-1').text('1 - ' + numberForDisplay(data.widgeteers.expert.cost,2));
    $('#expert-widgeteer-10').text([data.widgeteers.expert.countToSet, numberForDisplay(data.widgeteers.expert.priceToSet,2)].join(' - '));
    $('#novice-dodadeer-1').text('1 - ' + numberForDisplay(data.dodadeers.novice.cost,2));
    $('#novice-dodadeer-10').text([data.dodadeers.novice.countToSet, numberForDisplay(data.dodadeers.novice.priceToSet,2)].join(' - ')); 
    $('#intermediate-dodadeer-1').text('1 - ' + numberForDisplay(data.dodadeers.intermediate.cost,2));
    $('#intermediate-dodadeer-10').text([data.dodadeers.intermediate.countToSet, 
                                              numberForDisplay(data.dodadeers.intermediate.priceToSet,2)].join(' - '));  
    
    // Increase numWidgets every time produce-widget is clicked
    $('#produce-widget').off("click").on('click', function () {
        data.numWidgets++;
    });

    // Increase numDodads every time produce-dodad is clicked
    $('#produce-dodad').off("click").on('click', function(){
        data.numDodads++;
    })

    // Same for novice-widgeteer
    $('#novice-widgeteer-1').off("click").on('click', function () {
        data.widgeteers.novice.purchase(1);

        // update the ui with new pricing.
        $('#novice-widgeteer-1').text('1 - ' + numberForDisplay(data.widgeteers.novice.cost,2));
        $('#novice-widgeteer-10').text([data.widgeteers.novice.countToSet, numberForDisplay(data.widgeteers.novice.priceToSet,2)].join(' - ')); 
    });

    $('#novice-widgeteer-10').off("click").on("click", function(){
        data.widgeteers.novice.purchaseNextSet();
        
        // update the ui with new pricing.
        $('#novice-widgeteer-1').text('1 - ' + numberForDisplay(data.widgeteers.novice.cost,2));
        $('#novice-widgeteer-10').text([data.widgeteers.novice.countToSet, numberForDisplay(data.widgeteers.novice.priceToSet,2)].join(' - ')); 
    });
    $('#intermediate-widgeteer-1').off("click").on('click', function () {
        data.widgeteers.intermediate.purchase(1);

        // update the ui with new pricing.
        $('#intermediate-widgeteer-1').text('1 - ' + numberForDisplay(data.widgeteers.intermediate.cost,2));
        $('#intermediate-widgeteer-10').text([data.widgeteers.intermediate.countToSet, 
                                              numberForDisplay(data.widgeteers.intermediate.priceToSet,2)].join(' - ')); 
    });

    $('#intermediate-widgeteer-10').off("click").on('click', function () {
        data.widgeteers.intermediate.purchaseNextSet();

        // update the ui with new pricing.
        $('#intermediate-widgeteer-1').text('1 - ' + numberForDisplay(data.widgeteers.intermediate.cost,2));
        $('#intermediate-widgeteer-10').text([data.widgeteers.intermediate.countToSet, 
                                              numberForDisplay(data.widgeteers.intermediate.priceToSet,2)].join(' - ')); 
    });

    // Ditto for master-widgeteer... you get the idea
    $('#master-widgeteer-1').off("click").on('click', function () {
        data.widgeteers.master.purchase(1);
        $('#master-widgeteer-1').text('1 - ' + numberForDisplay(data.widgeteers.master.cost,2));
        $('#master-widgeteer-10').text([data.widgeteers.master.countToSet, numberForDisplay(data.widgeteers.master.priceToSet,2)].join(' - ')); 
    });

    $('#master-widgeteer-10').off("click").on('click', function () {
        data.widgeteers.master.purchaseNextSet();
        $('#master-widgeteer-1').text('1 - ' + numberForDisplay(data.widgeteers.master.cost,2));
        $('#master-widgeteer-10').text([data.widgeteers.master.countToSet, numberForDisplay(data.widgeteers.master.priceToSet,2)].join(' - '));
    });

    $('#expert-widgeteer-1').off("click").on('click', function () {
        data.widgeteers.expert.purchase(1);
        $('#expert-widgeteer-1').text('1 - ' + numberForDisplay(data.widgeteers.expert.cost,2));
        $('#expert-widgeteer-10').text([data.widgeteers.expert.countToSet, numberForDisplay(data.widgeteers.expert.priceToSet,2)].join(' - '));
    });
    $('#expert-widgeteer-10').off("click").on('click', function () {
        data.widgeteers.expert.purchaseNextSet();
        $('#expert-widgeteer-1').text('1 - ' + numberForDisplay(data.widgeteers.expert.cost,2));
        $('#expert-widgeteer-10').text([data.widgeteers.expert.countToSet, numberForDisplay(data.widgeteers.expert.priceToSet,2)].join(' - '));
    });

    // Same for novice-widgeteer
    $('#novice-dodadeer-1').off("click").on('click', function () {
        data.dodadeers.novice.purchase(1);
        // update the ui with new pricing.
        $('#novice-dodadeer-1').text('1 - ' + numberForDisplay(data.dodadeers.novice.cost,2));
        $('#novice-dodadeer-10').text([data.dodadeers.novice.countToSet, numberForDisplay(data.dodadeers.novice.priceToSet,2)].join(' - ')); 
  
    });
    $('#novice-dodadeer-10').off("click").on('click', function () {
        data.dodadeers.novice.purchaseNextSet();
        // update the ui with new pricing.
        $('#novice-dodadeer-1').text('1 - ' + numberForDisplay(data.dodadeers.novice.cost,2));
        $('#novice-dodadeer-10').text([data.dodadeers.novice.countToSet, numberForDisplay(data.dodadeers.novice.priceToSet,2)].join(' - ')); 
  
    });
    $('#intermediate-dodadeer-1').off("click").on('click', function () {
        data.dodadeers.intermediate.purchase(1);
        // update the ui with new pricing.
        $('#intermediate-dodadeer-1').text('1 - ' + numberForDisplay(data.dodadeers.intermediate.cost,2));
        $('#intermediate-dodadeer-10').text([data.dodadeers.intermediate.countToSet, numberForDisplay(data.dodadeers.intermediate.priceToSet,2)].join(' - ')); 
    });
    $('#intermediate-dodadeer-10').off("click").on('click', function () {
        data.dodadeers.intermediate.purchaseNextSet();
        // update the ui with new pricing.
        $('#intermediate-dodadeer-1').text('1 - ' + numberForDisplay(data.dodadeers.intermediate.cost,2));
        $('#intermediate-dodadeer-10').text([data.dodadeers.intermediate.countToSet, numberForDisplay(data.dodadeers.intermediate.priceToSet,2)].join(' - ')); 
    });

    $('#master-dodadeer').off("click").on("click", function(){
        numMasterDodadeers++;
        numDodads -= masterDodadeerCost;
        masterDodadeerCost = Math.ceil(masterDodadeerCost * dodadeerCostIncrease);
    })

    

    $('#expert-dodadeer').off("click").on("click", function(){
        numExpertDodadeers++;
        $('#expert-dodadeer-count').text(Math.round(numExpertDodadeers));
        numDodads -= expertDodadeerCost;
        expertDodadeerCost = Math.ceil(expertDodadeerCost * dodadeerCostIncrease);
    })

    // Run UI update code every 10ms
    window.setInterval(function () {
        // since this doesn't actually run at the interval, get how many ms it has been since our last pass
        let sinceLastRun = Date.now()-lastRun;
        let widgetSinceLastRun = data.numWidgets - widgetsLastRun;
        let dodadSinceLastRun = data.numDodads - dodadsLastRun;
        let widgetSpeedThisRun = widgetSinceLastRun/sinceLastRun * 1000;
        let dodadSpeedThisRun = dodadSinceLastRun/sinceLastRun * 1000;
        if (widgetSpeedThisRun >= 0){
            if (widgetSpeedLastRuns.length >10){
                widgetSpeedLastRuns.shift();
            }
            widgetSpeedLastRuns.push(widgetSpeedThisRun);
        }

        if (dodadSpeedThisRun >= 0) {
            if (dodadSpeedLastRuns.length > 10) {
                dodadSpeedLastRuns.shift();
            }
            dodadSpeedLastRuns.push(dodadSpeedThisRun);
        }
        let average = (array) => array.reduce((a, b) => a+b) / array.length;
        let widgetAverageSpeed = widgetSpeedLastRuns.length > 0 ? Math.round(average(widgetSpeedLastRuns)) : 0;
        let dodadAverageSpeed = dodadSpeedLastRuns.length > 0 ? Math.round(average(dodadSpeedLastRuns)) : 0;

        widgetsLastRun = data.numWidgets;
        dodadsLastRun = data.numDodads;
        lastRun = Date.now();

        // Novices add 1 per second (1/100 every 10ms)
        data.numWidgets += data.widgeteers.novice.produce(sinceLastRun);
        // Masters train 5 Novice Widgeteers per second (5/100 every 10ms)
        data.widgeteers.novice.count += data.widgeteers.intermediate.produce(sinceLastRun);
        data.widgeteers.intermediate.count += data.widgeteers.master.produce(sinceLastRun);
        // Experts train 25 Master Widgeteers per second (25/100 every 10ms)
        data.widgeteers.master.count += data.widgeteers.expert.produce(sinceLastRun);
        
        data.numDodads += data.dodadeers.novice.produce(sinceLastRun);
        data.dodadeers.novice.count += data.dodadeers.intermediate.produce(sinceLastRun);
        data.dodadeers.intermediate.count += data.dodadeers.master.produce(sinceLastRun);
        

        $('#novice-widgeteer-count').text(numberForDisplay(data.widgeteers.novice.count));
        $('#intermediate-widgeteer-count').text(numberForDisplay(data.widgeteers.intermediate.count));
        $('#master-widgeteer-count').text(numberForDisplay(data.widgeteers.master.count));
        $('#expert-widgeteer-count').text(numberForDisplay(data.widgeteers.expert.count));

        $('#novice-dodadeer-count').text(numberForDisplay(data.dodadeers.novice.count));
        $('#intermediate-dodadeer-count').text(numberForDisplay(data.dodadeers.intermediate.count))


        // Update the text showing how many widgets we have, using Math.floor() to round down
        $('#widget-count').text(numberForDisplay(Math.floor(data.numWidgets),2));
        $('#dodad-count').text(numberForDisplay(Math.floor(data.numDodads), 2));


        // Update the text showing the speed of the widgeteers, rounding down.
        data.widgeteers.speed = widgetAverageSpeed; // I'm not sure if we need both, but here we are//
        data.dodadeers.speed = dodadAverageSpeed;
        $('#widgeteer-speed').text(numberForDisplay(Math.floor(data.widgeteers.speed), 2));
        $('#novice-widgeteer-speed').text(numberForDisplay(data.widgeteers.novice.totalSpeed, 2));
        $('#intermediate-widgeteer-speed').text(numberForDisplay(data.widgeteers.intermediate.totalSpeed, 2));
        $('#master-widgeteer-speed').text(numberForDisplay(data.widgeteers.master.totalSpeed, 2));
        $('#expert-widgeteer-speed').text(numberForDisplay(data.widgeteers.expert.totalSpeed, 2));

        $('#dodadeer-speed').text(numberForDisplay(Math.floor(data.dodadeers.speed), 2));
        $('#novice-dodadeer-speed').text(numberForDisplay(data.dodadeers.novice.totalSpeed, 2));
        $('#intermediate-dodadeer-speed').text(numberForDisplay(data.dodadeers.intermediate.totalSpeed, 2));


        // TODO: create a autobuyers page to control these.
        if(options.autobuyers.widgeteers.novice1.enabled){
            document.getElementById('novice-widgeteer-1').click();
            setButtonsStatus()
        }
        if(options.autobuyers.widgeteers.novice10.enabled){
            document.getElementById('novice-widgeteer-10').click();
            setButtonsStatus()
        }
        if(options.autobuyers.widgeteers.intermediate1.enabled){
            document.getElementById('intermediate-widgeteer-1').click();
            setButtonsStatus()
        }
        if(options.autobuyers.widgeteers.intermediate10.enabled){
            document.getElementById('intermediate-widgeteer-10').click();
            setButtonsStatus()
        }
        if(options.autobuyers.widgeteers.master1.enabled){
            document.getElementById('master-widgeteer-1').click();
            setButtonsStatus()
        }
        if(options.autobuyers.widgeteers.master10.enabled){
            document.getElementById('master-widgeteer-10').click();
            setButtonsStatus()
        }
        if(options.autobuyers.widgeteers.expert1.enabled){
            document.getElementById('expert-widgeteer-1').click();
            setButtonsStatus()
        }
        if(options.autobuyers.widgeteers.expert10.enabled){
            document.getElementById('expert-widgeteer-10').click();
            setButtonsStatus()
        }
        
        setButtonsStatus();
        
    }, 100);


})

function setButtonsStatus(){
    $('#novice-widgeteer-1').prop('disabled', data.widgeteers.novice.cost > data.numWidgets);
    $('#novice-widgeteer-10').prop('disabled', data.widgeteers.novice.priceToSet > data.numWidgets )
    $('#intermediate-widgeteer-1').prop('disabled', data.widgeteers.intermediate.cost > data.numWidgets || data.widgeteers.novice.count < 10);
    $('#intermediate-widgeteer-10').prop('disabled', data.widgeteers.intermediate.priceToSet > data.numWidgets || data.widgeteers.novice.count < 10)
    $('#master-widgeteer-1').prop('disabled', data.widgeteers.master.cost > data.numWidgets || data.widgeteers.intermediate.count < 10);
    $('#master-widgeteer-10').prop('disabled', data.widgeteers.master.priceToSet > data.numWidgets || data.widgeteers.intermediate.count < 10)
    $('#expert-widgeteer-1').prop('disabled', data.widgeteers.expert.cost > data.numWidgets || data.widgeteers.master.count < 10);
    $('#expert-widgeteer-10').prop('disabled', data.widgeteers.expert.priceToSet > data.numWidgets || data.widgeteers.master.count < 10);
    $('#novice-dodadeer-1').prop('disabled', data.dodadeers.novice.cost > data.numDodads);
    $('#novice-dodadeer-10').prop('disabled', data.dodadeers.novice.priceToSet > data.numDodads )
    $('#intermediate-dodadeer-1').prop('disabled', data.dodadeers.intermediate.cost > data.numDodads || data.dodadeers.novice.count < 10);
    $('#intermediate-dodadeer-10').prop('disabled', data.dodadeers.intermediate.priceToSet > data.numDodads || data.dodadeers.novice.count < 10)
}

function numberForDisplay(number, numDecimal = 0){
    // TODO: Create an option to change this to other types. Maybe include a cancer notation IE Antimatter?
    if(isNaN(number)){
        //try parsing it to a float
        number=parseFloat(number);
    }
    if (number < 10000){
        return number.toFixed(0);
    }
    return number.toExponential(numDecimal);
}

function calculatePriceTo10(numTo10, startingCost, increase){
    priceTo10 = 0;
    currentPrice = startingCost;
    for (i=0; i < numTo10; i++){
        priceTo10+=currentPrice;
        currentPrice*=increase;
    }
    return priceTo10;
}

function increasePrice(numTo10, startingCost, interval){
    newPrice = startingCost;
    for(i=0; i<numTo10; i++){
        newPrice = newPrice*interval;
    }
    return newPrice;
}
