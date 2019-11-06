
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
// contains logic for handling hostname entry
// > sets gui colors based on bad/good input, regex check, etc.
//
// DOCUMENTATION
// ##################################################


NB_MODULES.HostnameEntry = (function HostnameEntry(_, $$, MODULES, BASE_URL){
    'use strict';
    
    
    
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // IMPORTS *********************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    const { setInputCssValid, 
            setInputCssInvalid, 
            promiseFailure, 
            resetInputCss } = MODULES.GeneralUtility;
            
    const { postRequest } = MODULES.NbRequests;
            
    const { _deepFreeze } = MODULES.NbImmutable;
            

    
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // GLOBALS *********************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    
    const DOMAIN_NAME              = _deepFreeze(".netbeezcloud.net");
    const SERVER_NAME_REGEX        = new RegExp("^(?:[a-z](?:[-a-z0-9]{0,61}[a-z0-9])?)$");
    const HOSTNAME_CHECK_ENDPOINT  = _deepFreeze(BASE_URL + "php/nb-ims-hostname-check.php");
    const HOSTNAME_AVAILABILITY_CLASSES = _deepFreeze({
        unavailable: 'NB_HOSTNAME_UNAVAILABLE',
        available: 'NB_HOSTNAME_AVAILABLE',
    });
    
    
    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************
    // DNS/HOSTNAME CHECK *********************************************************************************************************************
    // these functions check if the given hostname is available *******************************************************************************
    //*****************************************************************************************************************************************
    //*****************************************************************************************************************************************

    //*****************************************************************************************************************************************
    // SERVER NAME ****************************************************************************************************************************

    // // is the server name entered valid?
    function isValidServerNameRegex(){
        const serverName = $$.server.name.val();
        const result = SERVER_NAME_REGEX.test(serverName);
        return result;
    };



    //*****************************************************************************************************************************************
    // HOSTNAME *******************************************************************************************************************************

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // CHECK IF THE HOSTNAME IS VALID ON BACKEND >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // this function wait a set amount of time (waiting for hostname entry to complete) before checking the hostname validity
    // this function uses .partial (currying) so the timer doesn't have to be stored in the global scope of this object
    function serverNameKeydown(typingTimer){          //used by the listener
        const doneTypingInterval = 3000;            //time in ms, 5 second for example
        clearTimeout(typingTimer);                  //>> (so it isn't a non-constant global)
        resetInputCss($$.server.hostname);
        $$.server.hostnameLoader.show();
        // disableSubmitButton();
        const newTimer = setTimeout(isHostnameAvailableRequest, doneTypingInterval);
        $$.server.name.off("keydown").keydown(_.partial(serverNameKeydown, newTimer));
    };


    // make request to backend to check if the hostname entered is valid/available
    function isHostnameAvailableRequest(){
        const hostnameOnForm = $$.server.hostname.val();
        const data = {hostname: hostnameOnForm};
        
        postRequest(HOSTNAME_CHECK_ENDPOINT, data)
            .done(isHostnameAvailableHandler)
            .fail(_.partial(promiseFailure, "the hostname check failed"));
    };



    function setHostnameClassUnavailable(){
        const {available, unavailable} = HOSTNAME_AVAILABILITY_CLASSES;
        $$.server.hostname.removeClass(available).addClass(unavailable);
    }



    function setHostnameClassAvailable(){
        const {available, unavailable} = HOSTNAME_AVAILABILITY_CLASSES;
        $$.server.hostname.removeClass(unavailable).addClass(available);
    }


    function doesHostnameHasAvailableClass(){
        const {available, unavailable} = HOSTNAME_AVAILABILITY_CLASSES;
        return $$.server.hostname.hasClass(available);
    }


    // handles the host validity response from the server
    function isHostnameAvailableHandler(response, status){
        try{
            console.info("hostname available response", response, status);
            
            const jsonResponse = JSON.parse(response);

            if(jsonResponse.hostname === $$.server.hostname.val()){
                const isHostnameAvailable = jsonResponse.is_hostname_available;

                if(isHostnameAvailable && isValidServerNameRegex()){
                    setInputCssValid($$.server.hostname);
                    // hideInvalidHostnameWarning();
                    setHostnameClassAvailable();
                }else{
                    // showInvalidHostnameWarning();
                    setInputCssInvalid($$.server.hostname);
                    setHostnameClassUnavailable();
                }
                // isHostnameAvailable && isValidServerNameRegex() ?
                //     setInputCssValid($$.server.hostname) :
                //     setInputCssInvalid($$.server.hostname);
                    
                    
                $$.server.hostnameLoader.hide();
                // toggleSubmitButton();
                
                
                isValidServerNameRegex() ? hideInvalidHostnameWarning() : showInvalidHostnameWarning();
                
                isHostnameAvailable ? hideUnavailableHostnameWarning() : showUnavailableHostnameWarning();

                
                
            }
        }catch(e){
            console.error(e);
            console.error(response)
            return;
        }
    };

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // UPDATE THE HOSTNAME BASED ON SERVER NAME AND CHECK REGEX >>>>>>>>>>>>>>>>>>>
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //update the hostname based on the server name input by the user
    function updateHostname(){
        const serverName = $$.server.name.val();
        const hostname = serverName+DOMAIN_NAME;
        // set the hostname
        $$.server.hostname.val(hostname);

        isValidServerNameRegex() ? setInputCssValid($$.server.name) : setInputCssInvalid($$.server.name);
    };

    // is the hostname valid
    // function isValidHostname(){
    //     return isValidServerNameRegex(); //&& $$.server.hostname.
    // };


    function showInvalidHostnameWarning(){
        $$.server.invalidHostnameWarning.show();
    }

    function hideInvalidHostnameWarning(){
        $$.server.invalidHostnameWarning.hide();
    }

    function showUnavailableHostnameWarning(){
        $$.server.unavailableHostnameWarning.show();
    }

    function hideUnavailableHostnameWarning(){
        $$.server.unavailableHostnameWarning.hide();
    }

    
    
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // MAIN AND EXPORTS ************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    function moduleExport(){
        return _deepFreeze({
            hideUnavailableHostnameWarning: hideUnavailableHostnameWarning,
            hideInvalidHostnameWarning: hideInvalidHostnameWarning,
            updateHostname: updateHostname,
            doesHostnameHasAvailableClass: doesHostnameHasAvailableClass,
            serverNameKeydown: serverNameKeydown,
            isValidServerNameRegex: isValidServerNameRegex,
        });
    };
    
    
    function main(){
        console.info("LOADING: hostname-entry.js");
        return moduleExport();
    };
    return main();

    
    
}(  _,
    NB_MODULES.JqueryCache,
    NB_MODULES,
    NB_MODULES.Globals.pluginPublicDir
));






