
// ** Created by Josh on 08/10/17 **

// ##################################################
// DOCUMENTATION
// ##################################################
// 
// self-invoking function
//
// this module is used on the free-tier request page
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


(function NbFreeTier(_, $$, MODULES) {
    'use strict';



    //********************************************************************************************************************************************
    //********************************************************************************************************************************************
    //********************************************************************************************************************************************
    // MODULES - IMPORTS *************************************************************************************************************************
    //********************************************************************************************************************************************
    //********************************************************************************************************************************************
    //********************************************************************************************************************************************
    const { _deepFreeze } = MODULES.NbImmutable;
    
    const { enableAllFormElements } = MODULES.GeneralUtility;
            
    const { hideInvalidEmailWarning, 
            isValidEmailRegex,
            emailAddressKeydown, 
            validateEmailAddress,  } = MODULES.EmailEntry;
    
    const { isValidServerNameRegex,
            doesHostnameHasAvailableClass,
            serverNameKeydown,
            updateHostname,
            hideInvalidHostnameWarning,
            hideUnavailableHostnameWarning } = MODULES.HostnameEntry;
    
    
    
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    // LOGIC ************************************************************************************************************************************
    // some final work before submitting the form ***********************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //the submission handler
    //disables all form inputs so they are actually submitted to the backend
    function formSubmissionHandler(e){
        e.preventDefault();
        
        if( !isValidServerNameRegex() || !doesHostnameHasAvailableClass() || !isValidEmailRegex() ){
            e.stopPropagation();
            console.error("STOPPING THE FORM FROM SUBMITTING!");

            // showInvalidEmailWarning();
            
            return false;
        }else{
            console.log("CONTINUING WITH THE FORM FROM SUBMITTING!");
            
            $$.submissionForm.unbind();  //unbind the submission listener

            enableAllFormElements();

            $$.submissionForm.submit();
        }
    
    };
    
    
    function initializeUi(){
        // other setup
        // disableSubmitButton();
        $$.server.hostnameLoader.hide();
        hideInvalidHostnameWarning();
        hideUnavailableHostnameWarning();
        hideInvalidEmailWarning();
    }
    
    
    function initalizeListeners(){
        //****************************************************************
        // LISTENERS *****************************************************
        $$.server.name.keydown(serverNameKeydown);
        $$.server.name.bind('input',updateHostname);
        // $$.submissionForm.change(toggleSubmitButton);
        $$.submissionForm.submit(formSubmissionHandler);
        
        //EMAIL
        $$.customer.emailAddress.keydown(emailAddressKeydown);
        $$.customer.emailAddress.focusout(validateEmailAddress);  
    }
    
    
    function initialize(){
        initializeUi();
        initalizeListeners();
    }




    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // MODULES - EXPORTS ***********************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    function moduleExport(){
        return _deepFreeze({});
    };
    
    
    function main(){        
        if( !_.first($$.pages.freeTierPage) ){
            
            console.info("NOT loading: free-tier.js");
            return null;
        }else{
            
            console.info("LOADING: free-tier.js");
            initialize();
            return moduleExport();
        }
    };
    return main();

    

}(  _,
    NB_MODULES.JqueryCache,
    NB_MODULES,
    
));


