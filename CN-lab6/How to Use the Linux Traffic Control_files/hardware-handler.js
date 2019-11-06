
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
// contains logic for handling hardware parts of the form
// gui, etc.
//
// DOCUMENTATION
// ##################################################


NB_MODULES.HardwareHandler = (function HardwareOptionsHandler(_, $$, MODULES, STRIPE_ID){
    'use strict';
    

    
    
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    // GLOBALS **********************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    
    const { _deepFreeze } = MODULES.NbImmutable;
    
    const { centsToUsd } = MODULES.GeneralUtility;
    
    const { readUserSelectedQuantities } = MODULES.InvoiceUtility;

    const { findStripePriceById, 
            findProductIdBySkuId,
            findProductMetadataByProductId } = MODULES.StripeUtility;



    
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    // LOGIC ************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //******************************************************************************************************************************************* 
    
    
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // SET THE PRICES OF THE AGENTS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //set the properties/details of all the agents
    function setAgentInformation(STRIPE_OPTIONS){
        console.log("SETTING AGENT INFORMATION")
        _.chain(STRIPE_ID.skus).keys().each(k => {
            setHardwareDetails(k);
            setHardwareInvoicePrice(k);
        })
    };


    //set the hardware details in the dom form
    function setHardwareDetails(hardwareType){
        const { skuId: stripeSkuId, domProduct: domProducts } = groupRelatedHardwareObjects(hardwareType);

        const productMetadata = findProductMetadataBySkuId(stripeSkuId);
        const setHardwareMetadataFn = _.partial(setHardwareDetail, productMetadata);

        _.each(domProducts, setHardwareMetadataFn);

        domProducts.stripeSku.val(stripeSkuId); //set the stripe sku in the form to be submitted
    };


    //set the details of a specific product field
    // domEl: the dom element we want to fill
    //productMetadata: object of product info {CPU: cpu_type, RAM: ram_amount, ...}
    function setHardwareDetail(productMetadata, domEl, key){
        const productPropertySpanText = domEl.prev().text();            //eg. CPU, Wifi, RAM
        const description = productMetadata[productPropertySpanText];   //get the product metadata key from the previous element
        if(description) domEl.val(description);                         //only set if the key is present in productMetadata
    };


    //set the prices of the hardware at various places in the form
    function setHardwareInvoicePrice(hardwareType){
        const { skuId, domInvoice } = groupRelatedHardwareObjects(hardwareType);

        const productUsd = centsToUsd(findStripePriceById(skuId));
        domInvoice.price.text(productUsd);
    };

    
    //groups related hardware info into its own object
    function groupRelatedHardwareObjects(type){
        return { skuId: STRIPE_ID.skus[type].id, domProduct: $$.products[type], domInvoice: $$.invoice.products[type] };
    };
    
    
    //find the stripe product metadata from the given sku id
    function findProductMetadataBySkuId(skuId){
        return _.compose(findProductMetadataByProductId, findProductIdBySkuId)(skuId);
    };
    
    
    //calculate the subtotals of the hardware
    function calculateHardwareSubtotals(){
        //in case these don't exist, just return array of 0's
        try{
            const {
                    plan: planQuantity, wifiAddon: wifiAddonQuantity,
                    faste: fasteAgentQuantity, wifi: wifiAgentQuantity
                  } = readUserSelectedQuantities();

            //hardware
            const fasteAgentCharges = findStripePriceById(STRIPE_ID.skus.faste.id) * fasteAgentQuantity;
            const wifiAgentCharges = findStripePriceById(STRIPE_ID.skus.wifi.id) * wifiAgentQuantity;
            //subtotals
            const hardwareSubtotal = fasteAgentCharges + wifiAgentCharges;

            return [fasteAgentCharges, wifiAgentCharges, hardwareSubtotal];
        }catch(e){
            console.warn("This warning is expected: ", e);
            return [0, 0, 0];
        }
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
            setAgentInformation: setAgentInformation,
            calculateHardwareSubtotals: calculateHardwareSubtotals,       
        });
    };
    
    
    function main(){
        console.info("LOADING: hardware-handler.js");
        return moduleExport();
    };
    return main();
    
    


    
    
    
}(  _,
    NB_MODULES.JqueryCache,
    NB_MODULES,
    NB_MODULES.Globals.stripeId,
));