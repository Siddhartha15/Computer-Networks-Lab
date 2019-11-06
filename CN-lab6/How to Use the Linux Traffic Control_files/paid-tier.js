
// ** Created by Josh on 08/10/17 **

// ##################################################
// DOCUMENTATION
// ##################################################
//
// self-invoking function

// this module is used on paid-tier pages (cloud-5, cloud-10) 
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


(function NbPaidTier(_, $$, MODULES) {
    'use strict';



    // ******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    // MODULES - IMPORTS ************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    const { _deepFreeze } = MODULES.NbImmutable;
    
    const { setAgentInformation } = MODULES.HardwareHandler;
    
    const { setSubscriptionTypePrice } = MODULES.SubscriptionHandler;
    
    const { fetchStripePlans, isStripeError } = MODULES.StripeUtility;
        
    const { initializeStripeElements, requestStripeToken } = MODULES.StripePayment;
            
    const { hideInvalidEmailWarning, 
            isValidEmailRegex,
            emailAddressKeydown, 
            validateEmailAddress,  } = MODULES.EmailEntry;
    
    const { serverNameKeydown,
            updateHostname,
            hideInvalidHostnameWarning,
            hideUnavailableHostnameWarning,
            isValidServerNameRegex,
            doesHostnameHasAvailableClass } = MODULES.HostnameEntry;
    
    const { setRecurringSubscriptionDay,
            updateInvoice,
            updateSubmitButtonText,
            toggleHardwareFields,
            toggleAddonWifi } = MODULES.InvoiceHandler;


    
    
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // LOGIC ***********************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
            
    function serverSubmissionHandler(e){       
        e.preventDefault();

        if( !isValidServerNameRegex() || !doesHostnameHasAvailableClass() || !isValidEmailRegex() || isStripeError() ){
            e.stopPropagation();
            console.error("STOPPING THE FORM FROM SUBMITTING!");
            // 
            return false;
        }else{
            requestStripeToken(e);
        }
    }


    function toggleHardwareFieldsUpdateSubmitButton(){
        toggleHardwareFields();
        updateSubmitButtonText();
    }

    
    function initializeListeners(){
        //****************************************************************
        // LISTENERS *****************************************************
        //PLANS
        $$.plans.addWifiOption.click(toggleAddonWifi);
        $$.plans.addWifiOption.click(updateInvoice);
        //FORM SUBMISSION
        $$.submissionForm.submit(serverSubmissionHandler);
        // $$.submissionForm.change(toggleSubmitButtonForPaidServerForm);
        $$.submissionForm.change(updateInvoice);
        //SERVER OPTIONS
        $$.server.name.keydown(serverNameKeydown);
        $$.server.name.bind('input',updateHostname);
        //HARDWARE OPTIONS
        $$.hardwareForm.dropdownCheckbox.click(toggleHardwareFieldsUpdateSubmitButton);
        //PRODUCTS
        $$.products.faste.quantity.bind('input', updateSubmitButtonText);
        $$.products.wifi.quantity.bind('input', updateSubmitButtonText);
        $$.products.faste.quantity.bind('input', updateInvoice);
        $$.products.wifi.quantity.bind('input', updateInvoice);
        //EMAIL
        $$.customer.emailAddress.keydown(emailAddressKeydown);
        $$.customer.emailAddress.focusout(validateEmailAddress);  
        
    }
    
    
    function initializeUi(){
        initializeStripeElements();
        
        $$.server.hostnameLoader.hide();
        $$.hardwareForm.div.hide();
        
        // other setup
        fetchStripePlans()
            .then(setSubscriptionTypePrice)
            .then(setAgentInformation)
            .then(updateInvoice)
            .then(updateSubmitButtonText);

        setRecurringSubscriptionDay();
        $$.invoice.wifiCompatibilityWarning.hide();

        hideInvalidHostnameWarning();
        hideUnavailableHostnameWarning();
        hideInvalidEmailWarning();
    }



    function initialize(){
        //put any init logic here
        initializeListeners();
        initializeUi();
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
        if( !_.first($$.pages.paidTierPage) ){ 

            console.info("NOT loading: paid-tier.js");
            return null;
        }else{
    
            console.info("LOADING: paid-tier.js");
            initialize();
            return moduleExport();
        }
    };
    return main();



}(  _, 
    NB_MODULES.JqueryCache,
    NB_MODULES,
));


