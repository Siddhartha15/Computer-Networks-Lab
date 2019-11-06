
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
// << THIS MODULE IS VERY IMPORTANT >>
// this is the main module for all other netbeez (library) modules
// to prevent pollution of the global scope, all netbeez modules 
// are exported into this main module
// **NO** netbeez modules are put directly into the global scope, except for this module
//
// each key contains a value - each value is an object of functions once the module loads
//
// Object.seal: modules must be added by key in exportModule, they cannot be added dynamically
// > this prevents assumptions on what's loaded and what isn't
//
// IMPORTANT
// although all stored modules are stored here instead of the global scope
// > some modules are not stored because they are one use - namely the "pages" modules
// > these page modules are also self-invoking, so they still don't pollute the scope
//
// UNDEFINED vs NULL
// * the values start out as 'undefined'
// > as modules load correctly, the values become objects
// > HOWEVER, is something breaks the value would be instead be 'null'
// > good for debugging
//
// DOCUMENTATION
// ##################################################



const NB_MODULES = (function NbModules(){
    'use strict';
    
    
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // MAIN AND EXPORTS ************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    
    // initialize keys as undefined
    // the modules object is sealed, so no keys can be added/removed dynamically
    // 
    // if a module cannot/shouldn't load for a form/page (ie. hardware page for a free-tier page),
    // > the module is set to 'null', otherwise it returns an object (can be empty) of functions/variables
    function exportModule(){
        return Object.seal({
            StripeUtility: undefined,
            GeneralUtility: undefined,
            JqueryCache: undefined,
            NbImmutable: undefined,
            EmailEntry: undefined,
            HostnameEntry: undefined,
            StripePayment: undefined,
            HardwareHandler: undefined,
            SubscriptionHandler: undefined,
            InvoiceHandler: undefined,
            InvoiceUtility: undefined,
            Globals: undefined,
            NbRequests: undefined,
        });
    }
    
    
    function main(){
        console.info("LOADING: nb-modules.js");
        return exportModule();
    }
    return main();

}());


