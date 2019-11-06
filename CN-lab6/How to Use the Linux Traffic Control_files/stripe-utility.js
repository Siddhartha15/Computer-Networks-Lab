
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
// logic related to stripe but not directly related to the payment
// > process
//
// really important function: fetchStripePlans()
// > gets hardware, subscriptions, etc.
//
// DOCUMENTATION
// ##################################################

NB_MODULES.StripeUtility = (function(_, $$, MODULES, BASE_URL){
    'use strict';

    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // MODULES - IMPORTS ***********************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************

    const { getRequest } = MODULES.NbRequests;
        
    const { _deepFreeze } = MODULES.NbImmutable;
        
    const { promiseFailure } = MODULES.GeneralUtility;
        

    


    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************
    // GLOBALS ********************************************************************************************************************************
    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************

    const STRIPE_PLANS_ENDPOINT        = _deepFreeze(BASE_URL + "php/nb-stripe-request-plans.php");
    const STRIPE_TOKEN_FIELD_NAME      = _deepFreeze('stripe_token');
    const WARNING_STRING               = _deepFreeze({
        addonButNoAgent: _deepFreeze("Warning: The WiFi addon is selected but no WiFi agent(s) is/are selected."),
        agentButNoAddon: _deepFreeze("Warning: WiFi agent(s) is/are selected but the WiFi addon is not selected.")
    })

    let   STRIPE_OPTIONS                = null;  // THIS IS SET IN A CALLBACK - CANNOT BE CONST


    //*****************************************************************************************************************************************     
    //*****************************************************************************************************************************************
    // FETCH STRIPE PLANS *********************************************************************************************************************
    // fetches the stripe plans/products/etc. *************************************************************************************************
    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************
    function getStripeOptions(){
        return STRIPE_OPTIONS;
    }
    

    // makes a request via jquery to the backend, which then goes to stripe to get plan/etc. info
    function fetchStripePlans(){
        return getRequest(STRIPE_PLANS_ENDPOINT)
                .done((response, status) => {
                    STRIPE_OPTIONS = _deepFreeze(JSON.parse(response));
                    return STRIPE_OPTIONS;
                })
                .fail(_.partial(promiseFailure, "fetching stripe plans failed"));
    };



    //********************************************************************************************************************************************
    //********************************************************************************************************************************************
    // MISC. STRIPE_OPTIONS FUNCTIONS ************************************************************************************************************
    // misc. functions to help access the STRIPE_OPTIONS object **********************************************************************************
    //********************************************************************************************************************************************
    //********************************************************************************************************************************************


    //find the stripe product metadata (info about product) from the given product id
    function findProductMetadataByProductId(productId){
        return _.findWhere(STRIPE_OPTIONS.products.data, {id: productId}).metadata;
    };

    //find the stripe product id by the given sku id
    function findProductIdBySkuId(skuId){
        return _.findWhere(STRIPE_OPTIONS.skus.data, {id: skuId}).product;
    };

    //find the price of hardware or subscription by stripe id
    function findStripePriceById(id){
        const subscriptions = _.object(_.map(STRIPE_OPTIONS.plans.data, p => [p.id, parseInt(p.metadata.base_cost)] ));
        const hardware = _.object(_.map(STRIPE_OPTIONS.skus.data, s => [s.id, parseInt(s.price)] ));

        return parseInt(subscriptions[id]) || parseInt(hardware[id]);
    };

    //find a hardware or subscription stripe object by id
    function findStripeObjectById(id){
        const subscriptions = _.object(_.map(STRIPE_OPTIONS.plans.data, p => [p.id, p] ));
        const hardware = _.object(_.map(STRIPE_OPTIONS.skus.data, s => [s.id, s] ));

        return subscriptions[id] || hardware[id];
    };



    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    // MISC. DOM FUNCTIONS **********************************************************************************************************************
    // misc. functions that manipulate/interact with the dom ************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // READ FUNCTIONS (returns a value from dom) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


    // is there a local stripe error (the error div will show);
    function isStripeError(){
        // return $$.stripeError.invoice.fasteDiv.hasClass('visible');
        return $$.card.errorClass.hasClass('visible');
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
            WARNING_STRING, WARNING_STRING,
            fetchStripePlans: fetchStripePlans,
            findStripePriceById: findStripePriceById,
            findProductMetadataByProductId: findProductMetadataByProductId,
            findProductIdBySkuId: findProductIdBySkuId,
            getStripeOptions: getStripeOptions,
            isStripeError: isStripeError,
        });
    };
    
    
    function main(){
        console.info("LOADING: stripe-utility.js");
        return moduleExport();
    }
    return main();
    




}(  _,
    NB_MODULES.JqueryCache,
    NB_MODULES,
    NB_MODULES.Globals.pluginPublicDir,
));





