// Basic variable declaration - keep track of how many of each
// item we currently own, and how much the new ones should cost.
var numWidgets = 0;
var numDodads = 0;

var numNoviceWidgeteers = 0;
var numMasterWidgeteers = 0;
var numExpertWidgeteers = 0;
var noviceWidgeteerCost = 100;
var masterWidgeteerCost = 250;
var expertWidgeteerCost = 1000;

var numNoviceDodadeers = 0;
var numMasterDodadeers = 0;
var noviceDodadeerCost = 100;
var masterDodadeerCost = 250;

var widgeteerSpeed = 0;
var dodadeerSpeed = 0;

$(document).ready(function(){
// Increase numWidgets every time produce-widget is clicked
$('#produce-widget').off("click").on('click', function () {
    numWidgets++;
});

// Increase numDodads every time produce-dodad is clicked
$('#produce-dodad').off("click").on('click', function(){
    numDodads++;
})

// Same for novice-widgeteer
$('#novice-widgeteer').off("click").on('click', function () {
    numNoviceWidgeteers++;

    // Deduct cost
    numWidgets -= noviceWidgeteerCost;

    // Increase cost for the next one, using Math.ceil() to round up
    noviceWidgeteerCost = Math.ceil(noviceWidgeteerCost * 1.1);

    // Set the speed of the widgeteers for display
    widgeteerSpeed = numNoviceWidgeteers * 1 + numMasterWidgeteers * 5 + numExpertWidgeteers * 25;
});

// Same for novice-widgeteer
$('#novice-dodadeer').off("click").on('click', function () {
    numNoviceDodadeers++;

    // Deduct cost
    numDodads -= noviceDodadeerCost;

    // Increase cost for the next one, using Math.ceil() to round up
    noviceDodadeerCost = Math.ceil(noviceDodadeerCost * 1.1);
});

// Ditto for master-widgeteer... you get the idea
$('#master-widgeteer').off("click").on('click', function () {
    numMasterWidgeteers++;
    numWidgets -= masterWidgeteerCost;
    masterWidgeteerCost = Math.ceil(masterWidgeteerCost * 1.1);
    // Set the speed of the widgeteers for display
    widgeteerSpeed = numNoviceWidgeteers * 1 + numMasterWidgeteers * 5 + numExpertWidgeteers * 25;
});

// Run UI update code every 10ms
window.setInterval(function () {
    // Novices add 1 per second (1/100 every 10ms)
    numWidgets += (numNoviceWidgeteers * 1 / 100);

    // Masters add 5 per second (5/100 every 10ms)
    numWidgets += (numMasterWidgeteers * 5 / 100);

    // Novices add .1 per second (1/1000 every 10ms)
    numDodads += (numNoviceDodadeers * 1 / 1000);

    // Masters add .5 per second (5/1000 every 10ms)
    numDodads += (numMasterDodadeers * 5 / 1000);

    // Update the text showing how many widgets we have, using Math.floor() to round down
    $('#widget-count').text(Math.floor(numWidgets));

    // Update the text showing how many widgets we have, using Math.floor() to round down
    $('#dodad-count').text(Math.floor(numDodads));

    // Update the text showing the speed of the widgeteers, rounding down.
    $('#widgeteer-speed').text(Math.floor(widgeteerSpeed));

    // Update the widgeteers with their current prices
    $('#novice-widgeteer').text('Hire Novice Widgeteer - ' + noviceWidgeteerCost);
    $('#master-widgeteer').text('Hire Master Widgeteer - ' + masterWidgeteerCost);

    // Enable/disable the widgeteer buttons based on our numWidgets
    $('#novice-widgeteer').prop('disabled', noviceWidgeteerCost > numWidgets);
    $('#master-widgeteer').prop('disabled', masterWidgeteerCost > numWidgets);

    // Update the widgeteers with their current prices
    $('#novice-dodadeer').text('Hire Novice Dodadeer - ' + noviceDodadeerCost);
    $('#master-dodadeer').text('Hire Master Dodadeer - ' + masterDodadeerCost);

    // Enable/disable the widgeteer buttons based on our numWidgets
    $('#novice-dodadeer').prop('disabled', noviceDodadeerCost > numDodads);
    $('#master-dodadeer').prop('disabled', masterDodadeerCost > numDodads);
}, 10);


})
