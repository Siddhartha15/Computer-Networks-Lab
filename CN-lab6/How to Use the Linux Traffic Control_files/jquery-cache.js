
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
// cache all our objects upfront via jquery
//
// in most cases this has removed the need to use
// > jquery directly in other modules
//
// POSSIBLE IMPROVEMENT:
// only load jquery objects as they are called, then
// cache them for later use
//
// DOCUMENTATION
// ##################################################


NB_MODULES.JqueryCache = (function NbDomObj(_, $, MODULES){
    'use strict';

    
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // IMPORTS *********************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    const { _deepFreeze } = MODULES.NbImmutable;


    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // GLOBALS *********************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    const domObjects = _deepFreeze({
        pages: {
            freeTierPage: '#nb_stripe_freetier_page',
            hardwarePage: '#nb_hardware_checkout_page',
            paidTierPage: '#nb_stripe_checkout_page',
            trialPage: '#nb_trial_checkout_page',
        },
        customer: {
            firstName: '#first_name',
            lastName: '#last_name',
            phoneNumber: '#phone_number',
            emailAddress: '#email_address',
            company: '#organization',
            invalidEmailWarning: '#invalid_email_warning',
            address: {
                street: '#street_name',
                city: '#address_city',
                state: '#address_state',
                zip: '#address_postal_code',
                country: '#address_country',
            },
            // emailAddressValidate: '#email_address_1'
        },
        plans: {
            netbeezName: '#netbeez_plan_name',
            addWifiOption: '#add_wifi_subscription_plan',
            price: '#subscription_plan_cost',
            name: '#subscription_plan_label',
            wifiAddonPrice: '#wifi_addon_subscription_cost',
        },
        planTypes: {
            cloud5: '#cloud-5',
            cloud10: '#cloud-10',
        },
        server:{
            hostname: '#hostname',
            name: '#server_name',
            hostnameLoader: '#hostname_loading_span',
            invalidHostnameWarning: '#invalid_hostname_warning',
            unavailableHostnameWarning: '#unavailable_hostname_warning',
        },
        hardwareForm: {
            toggle: '#hardware_dropdown_toggle',
            div: '#hardware_options_div',
            dropdownIcon: '#hardware_dropdown_icon',
            dropdownCheckbox: '#hardware_dropdown_checkbox',
            trialHardwareDropdown: '#trial_hardware_options',
        },
        products: {
            faste: {
                title: '#faste_title',
                cpu: '#faste_cpu',
                ram: '#faste_ram',
                diskDrive: '#faste_disk_drive',
                ethernetNic: '#faste_ethernet_nic',
                wirelessNic: '#faste_wireless_nic',
                powerSupply: '#faste_power_supply',
                powerConsumption: '#faste_power_consumption',
                dimensions: '#faste_dimensions',
                unitPrice: '#faste_price',
                unitPriceLabel: '#faste_price_label',
                quantity: '#faste_quantity',
                stripeSku: '#faste_stripe_sku',  
                
            },
            wifi: {
                title: '#wifi_title',
                cpu: '#wifi_cpu',
                ram: '#wifi_ram',
                diskDrive: '#wifi_disk_drive',
                ethernetNic: '#wifi_ethernet_nic',
                wirelessNic: '#wifi_wireless_nic',
                powerSupply: '#wifi_power_supply',
                powerConsumption: '#wifi_power_consumption',
                dimensions: '#wifi_dimensions',
                unitPrice: '#wifi_price',
                unitPriceLabel: '#wifi_price_label',
                quantity: '#wifi_quantity',
                stripeSku: '#wifi_stripe_sku',
            }
        },
        invoice: {
            plans: {
                name: '#invoice_plan_name',
                price: '#invoice_plan_price',
                subtotal: '#invoice_plan_subtotal',
                quantity: '#invoice_plan_quantity',
                wifiAddon: '#invoice_wifi_addon',
                wifiAddonPrice: '#invoice_wifi_addon_price',
                wifiAddonQuantity: '#invoice_wifi_addon_quantity',
                wifiAddonSubtotal: '#invoice_wifi_addon_subtotal',
            },
            products: {
                faste: {
                    name: '#invoice_faste_name',
                    price: '#invoice_faste_price',
                    quantity: '#invoice_faste_quantity',
                    subtotal: '#invoice_faste_subtotal',
                },
                wifi: {
                    name: '#invoice_wifi_name',
                    price: '#invoice_wifi_price',
                    quantity: '#invoice_wifi_quantity',
                    subtotal: '#invoice_wifi_subtotal',
                }
            },
            totalDueNow: '#invoice_total_due_now',
            allSubscriptionsSubtotal: '#invoice_subscriptions_subtotal',
            allAgentsSubtotal: '#invoice_agents_subtotal',
            recurringSubscriptionDay: '#recurring_monthly_day',
            wifiCompatibilityWarning: '#wifi_selection_warning'
        },
        card: {
            errorClass: '.error'
        },
        formInputs: ':input[required]',
        submitButton: '#request_submission_button',
        submissionForm: '#request-form',
        stripePublicKey: '#stripe_public_key'
    });



    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // LOGIC ***********************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //take an object of ids and return an object of html dom objects
    function stringsToObjects(strings){
        return _.mapObject(strings, (val, key) => _.isObject(val) ?  stringsToObjects(val) : $(val) );
    };


    //jquery function specifically for finding stuff by ID (or class where valid)
    // function _$(str){
    //     return str.startsWith(".") ? $(str) : $('#'+str);
    //     //if starts with period, then find by class
    //     //otherwise, assume it is an id
    // };
    //


    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // MAIN AND EXPORTS ************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    function main(){
        console.info("LOADING: jquery-cache.js");
        
        
        return stringsToObjects(domObjects);
    };
    return main();
    
    


}(  _,
    jQuery,
    NB_MODULES,
));



