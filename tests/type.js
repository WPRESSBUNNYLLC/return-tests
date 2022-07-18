var type_test = require('./helpers/typeTest');
var format = require('./helpers/stringFormatters');

/**
 * makes sure the return value matches one or all of the allowed types (array)
 * 
 * @param {object} test The object containing the function which was just tested
 * @param {Number} return_value The return value from the function which was just tested
 * @param {Number} i the index of the function
 * @param {Number} j the parameter index that was just executed
*/

function test(test, return_value, i, j) { 

 if(!type_test(
  test.unit.allowed_types, 
  test.unit.allowed_types.on, 
  test.unit.allowed_types.values, 
  test.unit.allowed_types.index_exact
 )) { 
  throw new Error(`
   function index: ${i}\n
   error: (unit.allowed_types) must be an object 
   with parameters (on: boolean) (values: array) 
   (index_exact: boolean)`
  );
 } 

 if(test.unit.allowed_types.on === true) {

  if(
   test.unit.allowed_types.index_exact === false && 
   test.unit.allowed_types.values.includes(typeof(return_value)) !== true
  ) {
   return format({
    id: 'typeErrorAll', 
    return_value: typeof(return_value), 
    compared_to: JSON.stringify(test.unit.allowed_types.values)
   }); 
  }

  if(
   test.unit.allowed_types.index_exact === true && 
   test.unit.allowed_types.values[j] !== typeof(return_value)
  ) { 
   return format({
    id: 'typeErrorOne', 
    return_value: typeof(return_value), 
    compared_to: test.unit.allowed_types.values[j]
   }); 
  }

 }

 return 'PASSED';

}

module.exports = test;