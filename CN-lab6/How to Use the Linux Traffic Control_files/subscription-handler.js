
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
// handles subscription related stuff
// * the various pricing with/out addons
// * subscription-plan names
// * subscription sub-totals (used by invoice) 
// * etc
//
// DOCUMENTATION
// ##################################################

NB_MODULES.SubscriptionHandler = (function SubscriptionOptionsHandler(_, $$, MODULES, STRIPE_ID){
    'use strict';
    

    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // MODULES - IMPORTS ***********************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    
    const { _deepFreeze } = MODULES.NbImmutable;
    
    const { centsToUsd } = MODULES.GeneralUtility;
          
    const { findStripePriceById, getStripeOptions } = MODULES.StripeUtility;
    
    const { readUserSelectedQuantities } = MODULES.InvoiceUtility;
    

        

    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // LOGIC ***********************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    
    
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // SET THE PRICES OF THE SUBSCRIPTIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // determine the subscription type and call method to set the price in the DOM
    function setSubscriptionTypePrice(){
        //get the stripe id's corresponding to the form
        const {base: baseSubscriptionId,  addon: wifiAddonId } = stripePlanIdsCorrespondingToForm();

        setSubscriptionPrices(baseSubscriptionId, wifiAddonId);
    };

    // set the prices present in the form (plan cost, addon cost, submit total cost)
    function setSubscriptionPrices(planId, wifiAddonId){
        setBasePlanCost(planId);
        setPlanNames(planId);
        setWifiPrice(wifiAddonId);
    };

    //set the name of the plan in the form
    function setPlanNames(planId){
        // const planName = STRIPE_OPTIONS.plans.data.find(p => p.id === planId).name;
        const planName = _.findWhere(getStripeOptions().plans.data, {id: planId}).name;
        $$.plans.netbeezName.val(planName);
        $$.invoice.plans.name.text(planName);
    };

    //set the cost of the base plan
    //ex. cloud-5 or cloud-10
    function setBasePlanCost(planId){
        const usd = centsToUsd(findStripePriceById(planId));

        $$.plans.price.text(usd);
        $$.invoice.plans.price.text(usd);
    };

    // set the cost of the wifi addon
    //ex. cloud-5-wifi or cloud-10-wifi
    function setWifiPrice(wifiAddonId){
        const usd = centsToUsd(findStripePriceById(wifiAddonId));
        $$.plans.wifiAddonPrice.text(usd);
        $$.invoice.plans.wifiAddonPrice.text(usd);
    };
    
    
    
    function calculateSubscriptionSubtotals(){
        //in case these don't exist, just return array of 0's
        try {
            const {
                    plan: planQuantity, wifiAddon: wifiAddonQuantity,
                    faste: fasteAgentQuantity, wifi: wifiAgentQuantity
                  } = readUserSelectedQuantities();

            const {base: stripePlanId, addon: stripeWifiPlanId} = stripePlanIdsCorrespondingToForm();

            //subscriptions
            const baseSubscriptionCharges = findStripePriceById(stripePlanId) * planQuantity;
            const wifiAddonCharges = findStripePriceById(stripeWifiPlanId) * wifiAddonQuantity;
            const subscriptionsSubtotal = baseSubscriptionCharges + wifiAddonCharges;

            return [baseSubscriptionCharges, wifiAddonCharges, subscriptionsSubtotal];
        }catch(e){
            console.warn("This is expected", e);
            return [0, 0, 0];
        }
    };
        
        
        
    function findPlanKeyAssociatedWithForm(){
        return _.findKey($$.planTypes, (v,k) => v.length === 1);
    };

    //get the stripe id's corresponding to the form
    function stripePlanIdsCorrespondingToForm(){
        const key = findPlanKeyAssociatedWithForm();
        return STRIPE_ID.plans[key] ;
    };
        
        
    
    
    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************
    // MAIN AND EXPORTS ***********************************************************************************************************************
    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************
    function moduleExport(){
        return _deepFreeze({
            setSubscriptionTypePrice: setSubscriptionTypePrice,
            setSubscriptionPrices: setSubscriptionPrices,
            setPlanNames: setPlanNames,
            setBasePlanCost: setBasePlanCost,
            setWifiPrice: setWifiPrice,  
            calculateSubscriptionSubtotals, calculateSubscriptionSubtotals 
        });
    };
    
    
    function main(){
        console.info("LOADING: subscription-handler.js");
        return moduleExport();
    };    
    return main();


    

    
}(  _,
    NB_MODULES.JqueryCache,
    NB_MODULES,
    NB_MODULES.Globals.stripeId,
));
