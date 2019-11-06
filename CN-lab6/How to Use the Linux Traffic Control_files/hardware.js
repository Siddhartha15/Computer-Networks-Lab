
// ** Created by Josh on 08/10/17 **

// ##################################################
// DOCUMENTATION
// ##################################################
//
// self-invoking function

// this module is used on the hardware request page
// is imports library module functions as needed
// 
// sets up listeners and some GUI elements
// uses a custom form submission function handler
//
// follows the JS module pattern with some changes
// on load main() is called, loads the module if applicable
// > calls initialize(), and then calls and returns moduleExport(),
// > which is an empty object in this case
//
// ##################################################
// DOCUMENTATION
// ##################################################


(function NbHardware(_, $$, MODULES) {
    'use strict';



    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    // MODULES - IMPORTS ************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    const { _deepFreeze } = MODULES.NbImmutable;
    
    const { setAgentInformation } = MODULES.HardwareHandler;
    
    const { fetchStripePlans, isStripeError } = MODULES.StripeUtility;
    
    const { initializeStripeElements, requestStripeToken } = MODULES.StripePayment;
    
    const { hideInvalidEmailWarning, 
            isValidEmailRegex,
            emailAddressKeydown, 
            validateEmailAddress,  } = MODULES.EmailEntry;
    
    const { updateSubmitButtonText,
            updateProductQuantitiesOnInvoice,
            updateInvoice } = MODULES.InvoiceHandler;
    

    


    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    // LOGIC ************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    function formSubmissionHandler(e){
        e.preventDefault();
        

        if( !isValidEmailRegex() || isStripeError() ){
            e.stopPropagation();
            console.error("STOPPING THE FORM FROM SUBMITTING!");
            
            // showInvalidEmailWarning();
            //
            return false;
        }else{
            requestStripeToken(e);
        }
        
    };
    
    
    function initializeUi(){
        initializeStripeElements();
        
        
        fetchStripePlans().then(setAgentInformation)//.then(updateInvoice);
        //HARDWARE OPTIONS
        $$.hardwareForm.div.show();
        
        hideInvalidEmailWarning();
    }
    
    function initializeListeners(){
        //PRODUCTS
        $$.products.faste.quantity.bind('input', updateSubmitButtonText);
        
        $$.products.wifi.quantity.bind('input', updateSubmitButtonText);
        $$.products.faste.quantity.bind('input', updateProductQuantitiesOnInvoice);
        $$.products.wifi.quantity.bind('input', updateProductQuantitiesOnInvoice);

        $$.products.faste.quantity.bind('input', updateInvoice);
        $$.products.wifi.quantity.bind('input', updateInvoice);
        
        $$.submissionForm.submit(formSubmissionHandler);
        
        //EMAIL
        $$.customer.emailAddress.keydown(emailAddressKeydown);
        $$.customer.emailAddress.focusout(validateEmailAddress);  
    }
    
    
    function initialize(){
        initializeUi();
        initializeListeners();
    };
    
    
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // MAIN AND EXPORTS ************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    function moduleExport(){
        return _deepFreeze({});
    };
    
    
    function main(){
        if( !_.first($$.pages.hardwarePage) ){ 
            
            console.info("NOT loading: hardware.js");
            return null;
        }else{
            
            console.info("LOADING: hardware.js");
            initialize();
            return moduleExport();
        }
    };
    return main();



}(  _, 
    NB_MODULES.JqueryCache,
    NB_MODULES,
));


