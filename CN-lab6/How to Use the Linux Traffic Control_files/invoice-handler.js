
// ** Created by Josh on 08/10/17 **

// ##################################################
// DOCUMENTATION
// ##################################################
//
// NOTES ABOUT THIS MODULE
// * self-invoking function
// * no function is called internally on load (everything is called from js/pages/<file.js>)
// * follows the JS module pattern
// * these "library" modules are *always* loaded
// 
// on load main() is called,
// > and then calls and returns moduleExport(), 
// > which contains the desired functions to export
//
// contains logic for handling the invoice part of the form
// checks hardware compatability (wifi plan with no wifi agents?)
// calculate totals/subtotal, etc.
//
// DOCUMENTATION
// ##################################################


NB_MODULES.InvoiceHandler = (function InvoiceHandler(_, $$, MODULES){
    'use strict';
    
    
    
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // IMPORTS *********************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    
    const { _deepFreeze } = MODULES.NbImmutable;
        
    const { calculateSubscriptionSubtotals } = MODULES.SubscriptionHandler;
    
    const { calculateHardwareSubtotals } = MODULES.HardwareHandler;
    
    const { readUserSelectedQuantities } = MODULES.InvoiceUtility;
    
    const { WARNING_STRING } = MODULES.StripeUtility;
    
    const { centsToUsd, 
            getDayOfMonthOrdinal,
            isDivVisible,
            INPUT_VALID_CLASS,
            INPUT_INVALID_CLASS } = MODULES.GeneralUtility;
        
        
    
    

    
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // LOGIC ***********************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************

    function toggleAddonWifi(){
        $$.plans.addWifiOption.toggleClass(INPUT_VALID_CLASS);
        updateSubmitButtonText();
    };


    //show/hide the hardware fields
    function toggleHardwareFields(){
        $$.hardwareForm.div.toggle();
        const closed = 0;
        const open = 90;
        const rotateTo = isDivVisible($$.hardwareForm.div) ? open : closed;

        if(rotateTo === closed){
            resetHardwareQuantities();
            updateInvoice();
        };
    };
    
    
    
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // UPDATE THE TOTAL BASED ON DOM SELECTION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // update the submit button total cost (changes on wifi-addon selection)
    function updateSubmitButtonText(){
        const [ /*baseSubscriptionCharges*/, /*wifiAddonCharges*/, /*fasteAgentCharges*/, /*wifiAgentCharges*/,
                grandTotal,
                /*subscriptionsSubtotal*/,
            ] = calculateInvoiceSubtotals();

        //plan cost
        const formattedCost = 'Pay '+(grandTotal);

        $$.submitButton.text(formattedCost);
    };
    
    
    //calculate the subtotals based on price*quantity
    function calculateInvoiceSubtotals(){
        const [baseSubscriptionCharges, wifiAddonCharges, subscriptionsSubtotal] = calculateSubscriptionSubtotals();
        const [fasteAgentCharges, wifiAgentCharges, hardwareSubtotal] = calculateHardwareSubtotals();
        const grandTotal = subscriptionsSubtotal + hardwareSubtotal;

        const calculations = [  baseSubscriptionCharges,
                                wifiAddonCharges,
                                fasteAgentCharges,
                                wifiAgentCharges,
                                grandTotal,
                                subscriptionsSubtotal,
                            ].map(centsToUsd);
        return calculations;
    };
    
    
    //set the charges on the invoice
    function setInvoiceCharges(prices){
        const [     baseSubscriptionCharges,
                    wifiAddonCharges,
                    fasteAgentCharges,
                    wifiAgentCharges,
                    grandTotal,
                    subscriptionsSubtotal,
                ] = prices;

        $$.invoice.plans.subtotal.text(baseSubscriptionCharges);
        $$.invoice.plans.wifiAddonSubtotal.text(wifiAddonCharges);

        $$.invoice.products.faste.subtotal.text(fasteAgentCharges);
        $$.invoice.products.wifi.subtotal.text(wifiAgentCharges);

        $$.invoice.totalDueNow.text(grandTotal);
        $$.invoice.allSubscriptionsSubtotal.text(subscriptionsSubtotal);

    };
    
    
    
    function updateInvoice(){
        updateInvoiceQuantities();
        updateInvoiceChargesSubtotals();
        checkHardwareOptionsCompatibility();
    };

    //set the day the subscription renews (based on current day of month)
    //appends ordinals ie: 17th or 1st
    function setRecurringSubscriptionDay(){
        $$.invoice.recurringSubscriptionDay.text(getDayOfMonthOrdinal());
    };

    //checks if the wifi options don't match up right
    //for example, one wifi agent is selected but the wifi plan is NOT selected
    function checkHardwareOptionsCompatibility(){
        const { wifiAddon: wifiAddonQuantity, wifi: wifiAgentQuantity } = _.mapObject(readUserSelectedQuantities(), (v,k) => parseInt(v));
        const warningDiv = $$.invoice.wifiCompatibilityWarning;
        // console.debug("CHECKING THE STUFF")
        if(Boolean(wifiAddonQuantity) === Boolean(wifiAgentQuantity)){
            warningDiv.hide();
        }else if(wifiAddonQuantity && !wifiAgentQuantity){
            warningDiv.text(WARNING_STRING.addonButNoAgent);
            warningDiv.show();
        }else{
            warningDiv.text(WARNING_STRING.agentButNoAddon);
            warningDiv.show();
        }
    };

    //update the quantities from user input (agents, subscription options)
    function updateInvoiceQuantities(){
        updatePlanQuantitiesOnInvoice();
        updateProductQuantitiesOnInvoice();
    };

    //update the quantities from user input (agents, subscription options)
    function updatePlanQuantitiesOnInvoice(){
        const { plan, wifiAddon } = readUserSelectedQuantities();
        $$.invoice.plans.quantity.text(plan);
        $$.invoice.plans.wifiAddonQuantity.text(wifiAddon);
    };

    //update the quantities from user input (agents, subscription options)
    function updateProductQuantitiesOnInvoice(){
        const { faste, wifi } = readUserSelectedQuantities();
        $$.invoice.products.faste.quantity.text(faste);
        $$.invoice.products.wifi.quantity.text(wifi);
    };

    //update the charge subtotals (agents, subscriptions)
    function updateInvoiceChargesSubtotals(){
        const calculations = calculateInvoiceSubtotals();
        setInvoiceCharges(calculations);
    };
    

    //reset the hardware quantities to 0
    function resetHardwareQuantities(){
        _.each($$.products, (obj,key) => obj.quantity.val(0));
    };
    
    
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // MAIN AND EXPORTS ************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    function moduleExport(){
        return _deepFreeze({
            updateSubmitButtonText: updateSubmitButtonText,
            updateInvoice: updateInvoice,
            setRecurringSubscriptionDay: setRecurringSubscriptionDay,
            updateProductQuantitiesOnInvoice: updateProductQuantitiesOnInvoice,
            readUserSelectedQuantities: readUserSelectedQuantities, 
            toggleHardwareFields: toggleHardwareFields, 
            toggleAddonWifi: toggleAddonWifi,
        });
    };
    
    
    function main(){
        console.info("LOADING: invoice-handler.js");
        return moduleExport();
    };
    return main();



    
    
    
}(  _,
    NB_MODULES.JqueryCache,
    NB_MODULES,
));



