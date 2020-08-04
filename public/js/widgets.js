// Basic variable declaration - keep track of how many of each
// item we currently own, and how much the new ones should cost.
class Worker{
    constructor(count, speed, purchased, setBonus, setSize, cost, costIncrease){
        this.count = count;
        this.speed = speed;
        this.purchased = purchased;
        this.setBonus = setBonus;
        this.setSize = setSize;
        this.cost = cost;
        this.costIncrease = costIncrease;
    }

    get priceToSet() {
        numToSet = count % this.setSize;
        priceToSet = 0;
        currentPrice = this.cost;
        for (i=0; i < numToSet; i++){
            priceToSet+=currentPrice;
            currentPrice*=this.costIncrease;
        }
        return numberForDisplay(priceToSet,2);
    }
}
let data = {
    widgeteers: {
        novice: new Worker(
            0, //count
            1, //speed
            0, //purchased
            1.2, // setBonus
            10, // setSize
            100, //cost
            1.1, //costIncrease
        ),
        master: new Worker (
            0, //count
            1.1, //speed
            0, //purchased
            1.2, // setBonus
            10, // setSize
            250, //cost
            1.1, //costIncrease
        ),
        expert: new Worker(
            0, //count
            1.1, //speed
            0, //purchased
            1.2, // setBonus
            10, // setSize
            2500, //cost
            1.1, //costIncrease
        ),
        speed: 0,
        interval: 100,
    },
    dodadeers: {
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
    numWidgets: 0,
    numDodads: 0,

}


$(document).ready(function(){
    $('#novice-widgeteer-10').text([10, data.widgeteers.novice.priceToSet].join(' - '));
    
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
        data.widgeteers.numNovices++;
        numNoviceWidgeteersPurchased++;
        // update the ui with how many we own.
        $('#novice-widgeteer-count').text(Math.round(numNoviceWidgeteers));
        
        // Deduct cost
        numWidgets -= noviceWidgeteerCost;
        // Increase cost for the next one, using Math.ceil() to round up
        noviceWidgeteerCost = Math.ceil(increasePrice(1,noviceWidgeteerCost,widgeteerCostIncrease));
        // update the buy to 10 button
        numTo10 = 10-(numNoviceWidgeteersPurchased%10)
        noviceWidgeteerPriceTo10 = calculatePriceTo10(numTo10, noviceWidgeteerCost, widgeteerCostIncrease);
        $('#novice-widgeteer-10').text([numTo10, numberForDisplay(noviceWidgeteerPriceTo10,2)].join(' - ')); 
        // Set the speed of the widgeteers for display
        widgeteerSpeed = widgeteerSpeed + noviceWidgeteerSpeed;
        if (numTo10 == 0){
            widgeteerSpeed = widgeteerSpeed * noviceWidgeteer10Bonus;
        }
    });

    $('#novice-widgeteer-10').off("click").on("click", function(){
        numTo10 = 10-(numNoviceWidgeteersPurchased%10);
        numNoviceWidgeteers+= numTo10;
        numNoviceWidgeteersPurchased += numTo10;
        noviceWidgeteerPriceTo10 = calculatePriceTo10(numTo10, noviceWidgeteerCost, widgeteerCostIncrease);
        numWidgets -= noviceWidgeteerPriceTo10;
        widgeteerSpeed = (widgeteerSpeed + (numTo10*noviceWidgeteerSpeed))*noviceWidgeteer10Bonus;
        noviceWidgeteerCost = Math.ceil(increasePrice(numTo10, noviceWidgeteerCost, widgeteerCostIncrease));
        noviceWidgeteerPriceTo10 = calculatePriceTo10(numTo10, noviceWidgeteerCost, widgeteerCostIncrease);
        $('#novice-widgeteer-10').text([numTo10, numberForDisplay(noviceWidgeteerPriceTo10,2)].join(' - ')); 
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
        numMasterWidgeteers++;
        numWidgets -= masterWidgeteerCost;
        masterWidgeteerCost = Math.ceil(masterWidgeteerCost * widgeteerCostIncrease);
    });

    $('#master-dodadeer').off("click").on("click", function(){
        numMasterDodadeers++;
        numDodads -= masterDodadeerCost;
        masterDodadeerCost = Math.ceil(masterDodadeerCost * dodadeerCostIncrease);
    })

    $('#expert-widgeteer-1').off("click").on('click', function () {
        numExpertWidgeteers++;
        numWidgets -= expertWidgeteerCost;
        expertWidgeteerCost = Math.ceil(expertWidgeteerCost * widgeteerCostIncrease);
    });

    $('#expert-dodadeer').off("click").on("click", function(){
        numExpertDodadeers++;
        $('#expert-dodadeer-count').text(Math.round(numExpertDodadeers));
        numDodads -= expertDodadeerCost;
        expertDodadeerCost = Math.ceil(expertDodadeerCost * dodadeerCostIncrease);
    })

    // Run UI update code every 10ms
    window.setInterval(function () {
        

        // Masters train 5 Novice Widgeteers per second (5/100 every 10ms)
        numNoviceWidgeteers += (numMasterWidgeteers * masterWidgeteerSpeed / widgeteerInterval);
        // Experts train 25 Master Widgeteers per second (25/100 every 10ms)
        numMasterWidgeteers += (numExpertWidgeteers * expertWidgeteerSpeed / widgeteerInterval);
        // Novices add 1 per second (1/100 every 10ms)
        numWidgets += (numNoviceWidgeteers * noviceWidgeteerSpeed / widgeteerInterval);

        $('#novice-widgeteer-count').text(numberForDisplay(numNoviceWidgeteers));
        $('#master-widgeteer-count').text(numberForDisplay(numMasterWidgeteers));
        $('#expert-widgeteer-count').text(numberForDisplay(numExpertWidgeteers));

        // Novices add .1 per second (1/1000 every 10ms)
        numDodads += (numNoviceDodadeers * noviceDodadeerSpeed / dodadeerInterval);

        // Masters add .5 per second (5/1000 every 10ms)
        numDodads += (numMasterDodadeers * masterDodadeerSpeed / dodadeerInterval);

        numDodads += (numExpertDodadeers * expertDodadeerSpeed / dodadeerInterval)

        // Update the text showing how many widgets we have, using Math.floor() to round down
        $('#widget-count').text(numberForDisplay(Math.floor(numWidgets),2));

        // Update the text showing how many widgets we have, using Math.floor() to round down
        $('#dodad-count').text(Math.floor(numDodads));

        // Update the text showing the speed of the widgeteers, rounding down.
        widgeteerSpeed = numNoviceWidgeteers * noviceWidgeteerSpeed;
        $('#widgeteer-speed').text(numberForDisplay(Math.floor(widgeteerSpeed),2));
        $('#novice-widgeteer-speed').text(numberForDisplay(numNoviceWidgeteers * noviceWidgeteerSpeed,2));
        $('#master-widgeteer-speed').text(numberForDisplay(numMasterWidgeteers * masterWidgeteerSpeed,2));
        $('#expert-widgeteer-speed').text(numberForDisplay(numExpertWidgeteers * expertWidgeteerSpeed,2));

        dodadeerSpeed = numNoviceDodadeers * noviceDodadeerSpeed;
        $('#dodadeer-speed').text(numberForDisplay(dodadeerSpeed,2));
        $('#novice-dodadeer-speed').text(numNoviceDodadeers * noviceDodadeerSpeed);
        $('#master-dodadeer-speed').text(numMasterDodadeers * masterDodadeerSpeed);
        $('#expert-dodadeer-speed').text(numExpertDodadeers * expertDodadeerSpeed);

        // Update the widgeteers with their current prices
        $('#novice-widgeteer-1').text('1 - ' + numberForDisplay(noviceWidgeteerCost,2));
        $('#master-widgeteer-1').text('1 - ' + numberForDisplay(masterWidgeteerCost,2));
        $('#expert-widgeteer-1').text('1 - ' + numberForDisplay(expertWidgeteerCost,2));

        // Enable/disable the widgeteer buttons based on our numWidgets
        $('#novice-widgeteer-1').prop('disabled', noviceWidgeteerCost > numWidgets);
        $('#novice-widgeteer-10').prop('disabled', noviceWidgeteerPriceTo10 > numWidgets )
        $('#master-widgeteer-1').prop('disabled', masterWidgeteerCost > numWidgets || numNoviceWidgeteers < 10);
        $('#expert-widgeteer-1').prop('disabled', expertWidgeteerCost > numWidgets || numMasterWidgeteers < 10);

        // Update the widgeteers with their current prices
        $('#novice-dodadeer').text('Hire Novice Dodadeer - ' + noviceDodadeerCost);
        $('#master-dodadeer').text('Hire Master Dodadeer - ' + masterDodadeerCost);
        $('#expert-dodadeer').text('Hire Expert Dodadeer - ' + expertDodadeerCost);

        // Enable/disable the widgeteer buttons based on our numWidgets
        $('#novice-dodadeer').prop('disabled', noviceDodadeerCost > numDodads);
        $('#master-dodadeer').prop('disabled', masterDodadeerCost > numDodads);
        $('#expert-dodadeer').prop('disabled', expertDodadeerCost > numDodads);
    }, 10);


})

function numberForDisplay(number, numDecimal = 0){
    // TODO: Create an option to change this to other types. Maybe include a cancer notation IE Antimatter?
    if (number < 10000){
        return number.toFixed(numDecimal);
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
