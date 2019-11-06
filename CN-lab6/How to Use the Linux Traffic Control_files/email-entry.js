
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
// this module contain logic for validating email input,
// > and the gui responses to bad/good emails
//
// DOCUMENTATION
// ##################################################



NB_MODULES.EmailEntry = (function EmailEntry(_, $$, MODULES){
    'use strict';
    

    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // MODULES - IMPORTS ***********************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
            
    const { setInputCssValid, setInputCssInvalid } = MODULES.GeneralUtility;
    const { _deepFreeze } = MODULES.NbImmutable;
            

    
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // GLOBALS *********************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    
    const EMAIL_VALIDITIY_CLASSES = _deepFreeze({
        valid: 'NB_EMAIL_VALID',
        invalid: 'NB_EMAIL_INVALID',
    });
    
    const EMAIL_REGEX = new RegExp( '(.+)@(.+)\.(.+)' );
    
    
    
    
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // LOGIC ***********************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    
    function showInvalidEmailWarning(){
        $$.customer.invalidEmailWarning.show();
    }
    

    function hideInvalidEmailWarning(){
        $$.customer.invalidEmailWarning.hide();
    }
    
    
    function setEmailAddressValid(){
        console.log("setting email div to valid class");
        const {valid, invalid} = EMAIL_VALIDITIY_CLASSES;
        $$.customer.emailAddress.removeClass(invalid).addClass(valid);
        
        setInputCssValid($$.customer.emailAddress);
        hideInvalidEmailWarning();
    }


    function setEmailAddressInvalid(){
        console.log("setting email div to invalid class");
        const {valid, invalid} = EMAIL_VALIDITIY_CLASSES;
        $$.customer.emailAddress.removeClass(valid).addClass(invalid);
        
        setInputCssInvalid($$.customer.emailAddress);
        showInvalidEmailWarning();
    }
    
    
    function isValidEmailRegex(){
        return EMAIL_REGEX.test( $$.customer.emailAddress.val() );
    }
    
    
    function validateEmailAddress(){
        console.log("validating email")
        isValidEmailRegex() ? setEmailAddressValid() : setEmailAddressInvalid();
        
    }
    
    
    function emailAddressKeydown(typingTimer){
        const doneTypingInterval = 750;            // in ms timeout
        clearTimeout(typingTimer);                  //>> (so it isn't a non-constant global)

        const newTimer = setTimeout(validateEmailAddress, doneTypingInterval);
        $$.customer.emailAddress.off("keydown").keydown( _.partial(emailAddressKeydown, newTimer) );
    }
    
    
    


    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // MAIN AND EXPORTS ***********************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    function moduleExport(){
        return _deepFreeze({
            emailAddressKeydown:     emailAddressKeydown,
            validateEmailAddress:    validateEmailAddress,
            isValidEmailRegex:       isValidEmailRegex,
            hideInvalidEmailWarning: hideInvalidEmailWarning,
            showInvalidEmailWarning: showInvalidEmailWarning,                
        });
    };
    
    
    function main(){
        console.info("LOADING: email-entry.js");
        return moduleExport();
    };
    return main();
    
    
    
    
}(  _,
    NB_MODULES.JqueryCache,
    NB_MODULES,
));






