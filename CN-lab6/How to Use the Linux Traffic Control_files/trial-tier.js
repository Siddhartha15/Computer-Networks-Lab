
// ** Created by Josh on 08/10/17 **

// ##################################################
// DOCUMENTATION
// ##################################################
//
// self-invoking function

// this module is used on the trial request page
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



(function NbTrialTier(_, $$, MODULES) {
    'use strict'; 
    
    
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // MODULES - IMPORTS ***********************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    const { _deepFreeze } = MODULES.NbImmutable;
    
    const { fetchStripePlans, isStripeError } = MODULES.StripeUtility;
    
    const { setAgentInformation } = MODULES.HardwareHandler;
        
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
    
    const { toggleHardwareFields, updateSubmitButtonText } = MODULES.InvoiceHandler;

    
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // LOGIC ***********************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    
    function serverSubmissionHandler(e){
        try{
            console.info("event var: ", e);
            if(e) e.preventDefault();
        }catch(_e){
            console.error("e.preventDefault() failed on submission!");
        }

        quantityUpdater();
        
        const isValidEmail = isValidEmailRegex();
        
        if( !isValidEmail || isStripeError() ){
            e.stopPropagation();
            console.error("stopping the form from submitting");
            console.error("is valid email regex: ", isValidEmail);
            
            return false;
        }else{
            
            console.info("submitting the form");
            
            $$.products.faste.quantity.prop('disabled', false);
            $$.products.wifi.quantity.prop('disabled', false);
            
            
            requestStripeToken(e);
        }
    }
    
    
    function hideHardwarePrices(){
        $$.products.faste.unitPriceLabel.hide();
        $$.products.wifi.unitPriceLabel.hide();
    }
    
    
    function initializeUi(){
        initializeStripeElements();
        
        $$.server.hostnameLoader.hide();
        $$.hardwareForm.div.hide();
        hideHardwarePrices();
        
        $$.products.faste.quantity.prop('disabled', true);
        $$.products.wifi.quantity.prop('disabled', true);
        
        fetchStripePlans().then(setAgentInformation);
        
        hideInvalidHostnameWarning();
        hideUnavailableHostnameWarning();
        hideInvalidEmailWarning();
        quantityUpdater();        
        
        setMinDate();
    }
    
    function setMinDate() {
        const d = new Date();
        d.setDate(d.getDate() + 7);

        document.getElementById('kick_off_date').setAttribute('min', d.toISOString().split('T')[0]);
        document.getElementById('kick_off_date').setAttribute('value', d.toISOString().split('T')[0]);
    }
    
    
    function quantityUpdater(){
        const valueString = $$.hardwareForm.trialHardwareDropdown.find(":selected").val();

        const stringsToObject = {            
            "1 Faste, 2 Wifi": {
                faste: 1,
                wireless: 2
            },
            "2 Faste, 1 Wifi": {
                faste: 2,
                wireless: 1
            },
            "3 Faste, 0 Wifi": {
                faste: 3,
                wireless: 0
            },
            "0 Faste, 3 Wifi": {
                faste: 0,
                wireless: 3
            },
            "default": {
                faste: 2,
                wireless: 1,
            }
        };
        
        const selected = stringsToObject[valueString] || stringsToObject.default;
                
        $$.products.faste.quantity.val(selected.faste);
        $$.products.wifi.quantity.val(selected.wireless);
    }


    
    
    function initializeListeners(){
        //****************************************************************
        // LISTENERS *****************************************************
        //FORM SUBMISSION
        $$.submissionForm.submit(serverSubmissionHandler);
        //SERVER OPTIONS
        $$.server.name.keydown(serverNameKeydown);
        $$.server.name.bind('input',updateHostname);
        //HARDWARE OPTIONS
        $$.hardwareForm.dropdownCheckbox.click(toggleHardwareFields);

        $$.hardwareForm.dropdownCheckbox.click(quantityUpdater);
        //PRODUCTS                
        $$.hardwareForm.trialHardwareDropdown.change(quantityUpdater);
        //EMAIL
        $$.customer.emailAddress.keydown(emailAddressKeydown);
        $$.customer.emailAddress.focusout(validateEmailAddress);   
    }
    
    function initialize(){
        initializeUi();
        initializeListeners();
    }
    
    
    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************
    // MAIN AND EXPORTS ***********************************************************************************************************************
    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************

    function moduleExport(){
        return _deepFreeze({});
    }
    
    function main(){
        if( !_.first($$.pages.trialPage) ){ 

            console.info("NOT loading: trial.js");
            return null;
        }else{
    
            console.info("LOADING: trial.js");
            initialize();
            return moduleExport();
        }
    }
    return main();
    
    
    
}(  _,
    NB_MODULES.JqueryCache,
    NB_MODULES,
));


