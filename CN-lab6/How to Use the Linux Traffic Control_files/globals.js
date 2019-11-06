
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
// this module contains global/shared variables for accross modules
// THE VARIABLES
// pluginPublicDir: value is set from PHP via injected JS
//
// stripeKey: the stripe key to authenticate ourselves
// > a function determines whether it should use the live key
// > or a given developer key in the URL
//
// stripeId: an object associating different stripe ids
//
// DOCUMENTATION
// ##################################################


NB_MODULES.Globals = (function Globals(_, MODULES){
    'use strict';
    
    
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // MODULES - IMPORTS ***********************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    const { _deepFreeze, _deepSeal } = MODULES.NbImmutable;
    
    
    
    
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    // GLOBALS **********************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    const stripeId = _deepFreeze({
        plans: {
            cloud5: {
                base: 'cloud-5',
                addon: 'cloud-5-wifi'
            },
            cloud10: {
                base: 'cloud-10',
                addon: 'cloud-10-wifi'
            }
        },
        skus: {
            faste: {
                id: "hardware_faste_agent_00",
                name: "faste"
            },
            // gige: {
            //     id: "hardware_gige_agent_00",
            //     name: "gige"
            // },
            wifi: {
                id: "hardware_wifi_agent_00",
                name: "wifi"
            }
        }

    });
    
    const STRIPE_PUBLIC_KEY_LIVE = "pk_live_tpzx7XywgG7rnrIwh7LIOHt2";
    
    
    
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // LOGIC ***********************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************

    function setStripeKey(){
        return new URL(window.location.href).searchParams.get("dev_stripe_test_key") || STRIPE_PUBLIC_KEY_LIVE;
    };
    
    
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // MAIN AND EXPORTS ************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    function moduleExport(){
        return _deepSeal({
            pluginPublicDir: null,
            stripeKey: setStripeKey(),
            stripeId: stripeId,
        });
    };
    
    
    function main(){
        console.info("LOADING: globals.js");
        
        return moduleExport();
    };
    return main();
    
    
}(  _,
    NB_MODULES,
));