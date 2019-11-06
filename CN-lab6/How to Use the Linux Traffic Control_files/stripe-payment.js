
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
// this module processes stripe payments
//
// the initalize() function **NEEDS** called from an external
// > module to work properly, it sets the stripe key in the dom, etc.
// > and actually submits the payment
//
// a lot of this code was take from the stripe website, so it doesn't use
// > jquery/underscore/etc. It could be refactored...but it works
//
// DOCUMENTATION
// ##################################################


NB_MODULES.StripePayment = (function StripePayment(_, $$, MODULES, STRIPE_KEY, BASE_URL){
    'use strict';

    
    
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    // MODULES - IMPORTS ************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************

    const { _freeze, _deepFreeze } = MODULES.NbImmutable;
    
    const { isStripeError } = MODULES.StripeUtility;
    
    const { promiseFailure, enableAllFormElements } = MODULES.GeneralUtility;
        
        
        
        
    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************
    // GLOBALS ********************************************************************************************************************************
    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************
    
    let STRIPE = null;
    let CARD = null;
    
    const STRIPE_PLANS_ENDPOINT        = _deepFreeze(BASE_URL + "php/nb-stripe-request-plans.php");
    const STRIPE_TOKEN_FIELD_NAME      = _deepFreeze('stripe_token');
    const WARNING_STRING               = _deepFreeze({
        addonButNoAgent: _deepFreeze("Warning: The WiFi addon is selected but no WiFi agent(s) is/are selected."),
        agentButNoAddon: _deepFreeze("Warning: WiFi agent(s) is/are selected but the WiFi addon is not selected.")
    })






    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // LOGIC ***********************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    
    function setStripeKeyInDom(){
        $$.stripePublicKey.val(STRIPE_KEY);
    };


    function setOutcome(result) {
        const successElement = document.querySelector('.success');
        const errorElement = document.querySelector('.error');
        successElement.classList.remove('visible');
        errorElement.classList.remove('visible');

        if (result.token) {
            successElement.querySelector('.token').textContent = result.token.id;
            successElement.classList.add('visible');
        } else if (result.error) {
            errorElement.textContent = result.error.message;
            errorElement.classList.add('visible');
        }

    };

    // IMPORTANT >>> THIS CODE IS COPY-PASTED FROM STRIPE - IT IS UNTOUCHED OTHER THAN THE RETURN STATEMENT <<< IMPORTANT
    function initStripeElements(){
        //*************************************************************************
        //*************************************************************************
        //*************************************************************************
        // this code is taken directly from the following stripe documentation:
        // https://stripe.com/docs/elements/examples
        //*************************************************************************
        //*************************************************************************
        const stripe = Stripe(STRIPE_KEY);
        const elements = stripe.elements();

        const options = {
            style: {
                base: {
                    iconColor: '#666EE8',
                    color: '#31325F',
                    lineHeight: '40px',
                    fontWeight: 300,
                    fontFamily: 'Helvetica Neue',
                    fontSize: '15px',

                    '::placeholder': {
                        color: '#CFD7E0',
                    },
                },
          },
          hidePostalCode: true
        };

        const card = elements.create('card', options);
        card.mount('#card-element');



        card.on('change', function(event) {
          setOutcome(event);
        });

        // document.querySelector('form').addEventListener('submit', function(e) {
        //   e.preventDefault();
        //   let form = document.querySelector('form');
        //   let extraDetails = {
        //     name: form.querySelector('input[name=cardholder_name]').value,
        //   };
        //   stripe.createToken(card, extraDetails).then(setOutcome);
        // });
        //*************************************************************************
        //*************************************************************************
        // this code is taken directly from the following stripe documentation:
        // https://stripe.com/docs/elements/examples
        //*************************************************************************
        //*************************************************************************
        //*************************************************************************
        return [stripe, elements, card];
    }; // IMPORTANT >>> THIS CODE IS COPY-PASTED FROM STRIPE - SOME CHANGES HAVE BEEN MADE <<< IMPORTANT
    //1. the default Stripe submit listener is no longer set, any logic with that has been moved into the custom
    //   one created for Netbeez
    //2. setOutCome has been moved to the module scope so the custom netbeez submit listener can call it
    


    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************
    // PROCESS SERVER REQUEST *******************************************************************************************************************
    // these functions fetch a stripe token and submit the form/server request to the backend ***************************************************
    //*******************************************************************************************************************************************
    //*******************************************************************************************************************************************

    //request a stripe token
    function requestStripeToken(e){
        e.preventDefault();                 //prevent auto form submission (will be done manually)
        $$.submissionForm.unbind();  //unbind the submission listener
        
        setOutcome(e);
        
        if(!isStripeError()){
            
            // e.preventDefault();
            // let form = document.querySelector('form');
            const extraDetails = {
                name: $$.customer.firstName.val()+" "+$$.customer.lastName.val()
            };
        
            STRIPE.createToken(CARD, extraDetails).then(completeServerRequest).catch(tokenErrorHandler);
        }else{
            console.info("There is a Stripe error (probably bad card info): this form will not submit.");
            e.stopPropagation();
            $$.submissionForm.submit(requestStripeToken);
            return false;
        }
    };

    // after getting a token - complete the server request
    function completeServerRequest(result){
        console.info("the token was successfully retrieved!");

        appendStripeTokenToForm(result);
        enableAllFormElements();

        $$.submissionForm.submit();
    };

    // append the stripe token to the form
    function appendStripeTokenToForm(result){
        const hiddenInput = createStripeTokenElement(result);
        $$.submissionForm.append(hiddenInput);
    };

    //create a hidden element that contains the stripe token
    function createStripeTokenElement(result){
        const tokenId = result.token.id;
        const hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', STRIPE_TOKEN_FIELD_NAME);
        hiddenInput.setAttribute('class', 'field');
        hiddenInput.setAttribute('value', tokenId);
        return hiddenInput;
    };

    // the token request failed
    function tokenErrorHandler(result){
        console.error("something went wrong when creating the token", result);
        
        const error = result.error;
        const errorElement = $$.stripeCardErrors;
        errorElement.textContent = error.message;
    };



    function initialize(){
        setStripeKeyInDom();
                
        const [stripe, elements, card] = initStripeElements();
        // const object = idsToObjects(ID);
        //return desired globals
        
        STRIPE = _freeze(stripe);
        CARD = card;
        
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
            requestStripeToken: requestStripeToken,
            initializeStripeElements: initialize,
        });
    };
    
    
    function main(){    
        console.info("LOADING: stripe-payment.js");
        return moduleExport();
    }
    return main();
    

    
    
    

}(  _,
    NB_MODULES.JqueryCache,
    NB_MODULES,
    NB_MODULES.Globals.stripeKey,
    NB_MODULES.Globals.pluginPublicDir,
));
    