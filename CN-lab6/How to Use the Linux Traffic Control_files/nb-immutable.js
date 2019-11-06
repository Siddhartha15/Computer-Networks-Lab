
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
// custom immutability functions
// exports recursive versions of Object.freeze, and Object.seal
// export shallow Object.freeze to keep consistent with "deep" versions of functions
//
// these functions are used internally in some modules on objects
// > but most importantly, _deepFreeze is used on **all**
// > exported objects/functions for all modules 
//
// DOCUMENTATION
// ##################################################



NB_MODULES.NbImmutable = (function NbObjectLock(_){
    'use strict';
    

    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // LOGIC ***********************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    
    // shortcut to Object.freeze
    function freeze(o){
        return Object.freeze(o);
    };

    //deep/recursive object freeze
    function deepFreeze(o){
        return deepLockObject(o, Object.freeze, Object.isFrozen);
    };


    //deep/recursive object seal
    function deepSeal(o){
        return deepLockObject(o, Object.seal, Object.isSealed);
    };

    //recursively "lock" and object, where lock should be Object.freeze (most strict), Object.seal, Object.preventExtensions (least strict)
    function deepLockObject(o, lockFn, isLockedFn){
        // http://stackoverflow.com/questions/34776846/how-to-freeze-nested-objects-in-javascript
        lockFn(o);
        if (o === undefined) {
          return o;
        }

        Object.getOwnPropertyNames(o).forEach(function (prop) {
          if (o[prop] !== null
          && (typeof o[prop] === "object" || typeof o[prop] === "function")
          && !isLockedFn(o[prop])) {
            deepLockObject(o[prop], lockFn, isLockedFn);
          }
        });
        return o;
    };
    
    
    

    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    // MAIN AND EXPORTS ************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    //******************************************************************************************************************************************
    function moduleExport(){
        return freeze({
            _freeze: freeze,
            _deepFreeze: deepFreeze,
            _deepSeal: deepSeal
        });
    };
    
    
    function main(){
        console.info("LOADING: nb-immutable.js");
        
        return moduleExport();
        
    };
    return main();


}(
    _
));
