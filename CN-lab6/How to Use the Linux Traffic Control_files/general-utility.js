
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
// this module contains logic for miscellaneous use
// > across different modules
// a good bit of it just wraps jQuery calls into
// > more palatable forms to fit our needs
// > and other misc
//
// DOCUMENTATION
// ##################################################


NB_MODULES.GeneralUtility = (function GeneralUtility(_, $$, MODULES){
    'use strict';


    

    //********************************************************************************************************************************************
    //********************************************************************************************************************************************
    //********************************************************************************************************************************************
    // MODULES - IMPORTS *************************************************************************************************************************
    //********************************************************************************************************************************************
    //********************************************************************************************************************************************
    //********************************************************************************************************************************************
    const { _deepFreeze } =  MODULES.NbImmutable;


    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    // GLOBALS **********************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    const INPUT_VALID_CLASS        = _deepFreeze("nb-valid-input");
    const INPUT_INVALID_CLASS      = _deepFreeze("nb-invalid-input");
    const RGB_STRING               = _deepFreeze({
                                        red: "rgb(255,190,177)",
                                        green: "rgb(166,247,101)"
                                    });
    

    

    //********************************************************************************************************************************************
    //********************************************************************************************************************************************
    // MISC. DOM FUNCTIONS ***********************************************************************************************************************
    // misc. functions that manipulate/interact with the dom *************************************************************************************
    //********************************************************************************************************************************************
    //********************************************************************************************************************************************

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // READ FUNCTIONS (returns a value from dom) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // // are all required fields in the form completely filled out?
    function isFormFilledOut(){
        // const result = $(':input[required]', $$.submissionForm).toArray().reduce(isInputFilledOutAccumulator, true);
        const result = $$.formInputs.toArray().reduce(isInputFilledOutAccumulator, true);
        console.log("IS FORM FILLED OUT: ", result);
        return result;
    };

    //does the input object contain any text accumulator (for .reduce)
    function isInputFilledOutAccumulator(acc,obj){
        return acc && isInputElementFilledOut(obj);
    };

    // is the given input element filled out (contains text)?
    function isInputElementFilledOut(el){
        return el.value.trim() !== '';
    };

    //is the div visible (not hidden)
    function isDivVisible(divEl){
        return divEl.is(':visible');
    };

    //is the set input class of the invalid type
    function isInputClassValid(obj){
        const result = obj.css('background-color') === RGB_STRING.green;
        console.log("IS INPUT CLASS VALID: ", result);
        return result;
    };

    //is the set input class of the valid type
    function isInputClassInvalid(obj){
        return obj.css('background-color') === RGB_STRING.red;
    };

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // SET FUNCTIONS (sets a dom value) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // change the input background to green
    function setInputCssValid(obj){
        obj.css('background', RGB_STRING.green);
    };

    // change the input background to red
    function setInputCssInvalid(obj){
        obj.css('background', RGB_STRING.red);
    };

    //reset the in/valid css setter
    function resetInputCss(obj){
        obj.css('background', '');
    };


    // change the state (en/disable) of the given button
    function changeButtonState(button, isDisable){
        button.prop("disabled", isDisable);
    };


    //enable all the things!
    // http://i.imgur.com/31l6XBN.jpg
    function enableAllFormElements(){
        $$.submissionForm.find(':input').attr('disabled',false);
    };


    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    // MISC. HELPER FUNCTIONS *******************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //get ordinal for the current day of the month
    //ie: 17th or 1st
    function getDayOfMonthOrdinal(){
        const dayOfMonth =  (new Date).getUTCDate();
        return getOrdinal(dayOfMonth);
    };

    //get the ordinal for a number, ie: 17th or 1st
    function getOrdinal(d) {
        return d+(
        _.contains([31, 21, 1], d) ? "st"  :
        _.contains([22, 2],    d)  ? "nd"  :
        _.contains([23,32],    d)  ? "rd"  :
                                     "th" );

    };

    //rotate the given div
    function rotateDiv(divEl,rotateToDegree){
        divEl.css({'transform' : 'rotate('+ rotateToDegree +'deg)'});
    };

    //findMeStr: the string we want in the object value `obj{key: value}`
    //obj key: the object key we want to compare `obj{key: value`}`
    function isStringMatchInObj(findMeStr, objKey, iteratedObj){
        return iteratedObj[objKey].toLowerCase() === findMeStr.toLowerCase();
    };

    //a better named alias for cents to dollars
    function centsToUsd(c){
        return centsToDollars(c);
    };

    // cents (100) to dollars ($1.00)
    function centsToDollars(c){
        return '$'+(c/100)+'.00';
    };

    // unformatted dollars (1) to USD ($1.00)
    function toUsd(a){
        return '$'+a+'.00';
    };

    //takes a dollar amount and returns an int
    //input: "$33.00"
    //output: 33
    function usdToInt(u){
        return _.first(u) === "$" ? parseInt(_.rest(u).join("")) : null;
    };

    //generic function used for failed promises
    function promiseFailure(msg, response, status){
        console.error(msg, response, status);
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
            //**********************************************
            // VARS ****************************************
            INPUT_VALID_CLASS: INPUT_VALID_CLASS,
            INPUT_INVALID_CLASS: INPUT_INVALID_CLASS,
            //**********************************************
            // MISC. DOM FUNCTIONS *************************
            enableAllFormElements: enableAllFormElements,
            isDivVisible: isDivVisible,
            //**********************************************
            // MISC. HELPER FUNCTIONS **********************
            getDayOfMonthOrdinal: getDayOfMonthOrdinal,
            promiseFailure: promiseFailure,
            centsToUsd: centsToUsd,
            setInputCssInvalid: setInputCssInvalid,
            setInputCssValid: setInputCssValid,
            resetInputCss: resetInputCss,
        });
    };
    
    
    function main(){
        console.info("LOADING: general-utility.js");
        
        return moduleExport();
    };
    return main();
    
    


}(  _,
    NB_MODULES.JqueryCache,
    NB_MODULES,
));

