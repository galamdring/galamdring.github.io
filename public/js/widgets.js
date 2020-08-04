// Basic variable declaration - keep track of how many of each
// item we currently own, and how much the new ones should cost.
function chargeForType(type,cost){
    switch(type){
        case 'widget':
            data.widgetCount -= cost;
            break;
        case 'dodad':
            data.dodadCount -= cost;
            break;
        default:
            break;
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
        this.count += count;
        this.purchased += count;

        // Deduct cost
        chargeForType(this.type, this.priceToCount(count));
        // Increase cost for the next one, using Math.ceil() to round up
        this.cost = increasePrice(count,this.cost,this.costIncrease);
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
        if(isNaN(value)){
            value = 0;
        }
        this.widgetCount = parseFloat(value);
    }

    get numWidgets(){
        return this.widgetCount;
    }
}
let data = new dataClass(
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
        master: new Worker (
            'widget', // type
            0, //count
            1.1, //speed
            0, //purchased
            1.2, // setBonus
            10, // setSize
            500, //cost
            1.1, //costIncrease
            1000, // interval
        ),
        expert: new Worker(
            'widget', // type
            0, //count
            1.1, //speed
            0, //purchased
            1.2, // setBonus
            10, // setSize
            2500, //cost
            1.1, //costIncrease
            1000, // interval
        ),
        speed: 0,
    },
    { //dodadeers
        numNovices: 0,
        noviceSpeed: 1,
        numNovicesPurchased: 0,
        novice10Bonus: 1.2,
        novicePriceTo10: 0,        
        numMasters: 0,
        masterSpeed: 1.1,
        numExperts: 0,
        expertSpeed: 1.1,
        noviceCost: 100,
        masterCost: 250,
        expertCost: 2500,
        speed: 0,
        costIncrease: 1.1,
        interval: 1000,
    },
    0, //numWidgets
    0, //numDodads
)

var lastRun = Date.now();
var widgetsLastRun = 0;
var speedLastRuns = [];

$(document).ready(function(){
    $('.tabs').tabs();
    $('#novice-widgeteer-10').text([10, numberForDisplay(data.widgeteers.novice.priceToSet,2)].join(' - '));
    
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

    // Same for novice-widgeteer
    $('#novice-dodadeer').off("click").on('click', function () {
        numNoviceDodadeers++;
        $('#novice-dodadeer-count').text(Math.round(numNoviceDodadeers));
        // Deduct cost
        numDodads -= noviceDodadeerCost;

        // Increase cost for the next one, using Math.ceil() to round up
        noviceDodadeerCost = Math.ceil(noviceDodadeerCost * dodadeerCostIncrease);

        dodadeerSpeed = numNoviceDodadeers * noviceDodadeerSpeed;
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

    $('#master-dodadeer').off("click").on("click", function(){
        numMasterDodadeers++;
        numDodads -= masterDodadeerCost;
        masterDodadeerCost = Math.ceil(masterDodadeerCost * dodadeerCostIncrease);
    })

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
        let speedThisRun = widgetSinceLastRun/sinceLastRun * 1000;
        if(speedThisRun > 0) {
            if (speedLastRuns.length >10){
                speedLastRuns.shift();
            }
            speedLastRuns.push(speedThisRun);
        }
        let average = (array) => array.reduce((a, b) => a+b) / array.length;
        let averageSpeed = speedLastRuns.length > 0 ? Math.round(average(speedLastRuns)) : 0;

        widgetsLastRun = data.numWidgets;
        lastRun = Date.now();

        // Masters train 5 Novice Widgeteers per second (5/100 every 10ms)
        data.widgeteers.novice.count += data.widgeteers.master.produce(sinceLastRun);
        // Experts train 25 Master Widgeteers per second (25/100 every 10ms)
        data.widgeteers.master.count += data.widgeteers.expert.produce(sinceLastRun);
        // Novices add 1 per second (1/100 every 10ms)
        data.numWidgets += data.widgeteers.novice.produce(sinceLastRun);

        $('#novice-widgeteer-count').text(numberForDisplay(data.widgeteers.novice.count));
        $('#master-widgeteer-count').text(numberForDisplay(data.widgeteers.master.count));
        $('#expert-widgeteer-count').text(numberForDisplay(data.widgeteers.expert.count));


        // Update the text showing how many widgets we have, using Math.floor() to round down
        $('#widget-count').text(numberForDisplay(Math.floor(data.numWidgets),2));

        // Update the text showing the speed of the widgeteers, rounding down.
        data.widgeteers.speed = averageSpeed; // I'm not sure if we need both, but here we are//
        $('#widgeteer-speed').text(numberForDisplay(Math.floor(data.widgeteers.speed),2));
        $('#novice-widgeteer-speed').text(numberForDisplay(data.widgeteers.novice.totalSpeed,2));
        $('#master-widgeteer-speed').text(numberForDisplay(data.widgeteers.master.totalSpeed,2));
        $('#expert-widgeteer-speed').text(numberForDisplay(data.widgeteers.expert.totalSpeed,2));


        // Update the widgeteers with their current prices
        
        

        // Enable/disable the widgeteer buttons based on our numWidgets
        $('#novice-widgeteer-1').prop('disabled', data.widgeteers.novice.cost > data.numWidgets);
        $('#novice-widgeteer-10').prop('disabled', data.widgeteers.novice.priceToSet > data.numWidgets )
        $('#master-widgeteer-1').prop('disabled', data.widgeteers.master.cost > data.numWidgets || data.widgeteers.novice.count < 10);
        $('#master-widgeteer-10').prop('disabled', data.widgeteers.master.priceToSet > data.numWidgets || data.widgeteers.novice.count < 10)
        $('#expert-widgeteer-1').prop('disabled', data.widgeteers.expert.cost > data.numWidgets || data.widgeteers.master.count < 10);

    }, 100);


})

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
