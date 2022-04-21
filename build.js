
/*
  @param {single_function_to_test}: one file to test that you choose. 
  @param {test_all}: whether to test all files or not. 
  @param {all_functions_to_test}: all the files which have a function to test. 
*/

const configure = { 

    test_all: true,

    single_function_to_test: './functions/example2.js',

    all_functions_to_test: [
      './functions/example1.js',
      './functions/example2.js',
      './functions/example3.js',
    ],

    scan_and_create_files: { 
      run: false, 
      push_to_all_functions_to_test: false 
    }

  }

  if(configure.scan_and_create_files.run === true) { 
    var file_list = require('./scan.js');
    if(configure.scan_and_create_files.push_to_all_functions_to_test === true) {
      configure.all_functions_to_test = configure.all_functions_to_test.concat(file_list);
    }
  }
  
  /*
    @param {developer_input}: imported data
    @param {tests}: array of objects to run tests
    @param {allowed_types}: allowed return types
    @param {allowed_values}: allowed return values
    @param {regex_set}: allowed regular expressions
    @param {function_called}: function passed 
    @param {error_sets}: exported set of objects that did not pass test
  */
  
  var error_sets = [];

  switch(configure.test_all) { 
      
    case false: 

        try {
      
          var developer_input = require(configure.single_function_to_test);
                                  
          run_tests(
            developer_input.tests, 
            developer_input.allowed_types, 
            developer_input.allowed_values, 
            developer_input.regex_set, 
            developer_input.function_called, 
            configure.single_function_to_test, 
            developer_input.function_name, 
            developer_input.directory
          );

        } catch(err) { 

          console.log(err.message);

        }
      
    break;
      
    case true:
    
        for(let i = 0; i < configure.all_functions_to_test.length; i++) { 

          try {

            var developer_input = require(configure.all_functions_to_test[i]);

            if(developer_input.run_all === true) {

              run_tests(
                developer_input.tests, 
                developer_input.allowed_types, 
                developer_input.allowed_values, 
                developer_input.regex_set, 
                developer_input.function_called, 
                configure.all_functions_to_test[i],
                developer_input.function_name, 
                developer_input.directory
              );

            }

          } catch(err) { 

            console.log(err.message);

          }

        }
          
    break;
      
    default: 
      
      console.log(`error: test_all must be true or false`);
  
  }
  
  /*
    check tests...
  */
          
  function run_tests(tests, allowed_types, allowed_values, regex_set, function_called, file_name, function_name, directory) {
  
    for(let i = 0; i < tests.length; i++) { 
  
      var params = [];
  
      for (const [key, value] of Object.entries(tests[i])) {
       if(key === 'index_of_set' || key === 'unit') continue;
       params.push(value);
      }
  
      var return_value = function_called(...params);
      var err_object = tests[i];
      var error_count = 0;

      var allowed_types_unit_or_single = (
        typeof(tests[i].unit.allowed_types) !== 'undefined' && tests[i].unit.allowed_types.on === true ?
        { on: true, test: 'unit', v: tests[i].unit.allowed_types } : allowed_types.on === true ?
        { on: true, test: 'single', v: allowed_types } : 
        { on: false, test: 'off' }
      );
  
      if(allowed_types.on === true) { //was allowed_types.on === true
  
        if(allowed_types.values.includes(typeof(return_value)) !== true) { //was allowed_types.values.includes(typeof(return_value)) !== true
  
          err_object.error_type = true;
  
          err_object.error_type_message = `The value returned is not within the allowed types.`;
  
          err_object.error_type_rtype = typeof(return_value);
  
          err_object.error_type_value = return_value;
  
          error_count++;
  
        }
  
      }

      var allowed_values_unit_or_single = (
        typeof(tests[i].unit.allowed_values) !== 'undefined' && tests[i].unit.allowed_values.on === true ? 
        { on: true, test: 'unit', v: tests[i].unit.allowed_values } : allowed_values.on === true ? 
        { on: true, test: 'single', v: allowed_values } : 
        { on: false, test: 'off' }
      );
  
      if(allowed_values.on === true) { //was allowed_values.on === true
  
        if(
          typeof(return_value) === 'number' || 
          typeof(return_value) === 'BigInt' || 
          typeof(return_value) === 'string' ||  
          typeof(return_value) === 'undefined' ||  
          typeof(return_value) === 'boolean'
        ) {
  
          if(allowed_values.values.includes(return_value) !== true) {  //was allowed_values.values.includes(return_value) !== true
  
            err_object.error_value = true;
  
            err_object.error_value_message = `The value returned is not within the allowed values.`;
  
            err_object.error_value_rvalue = return_value;
  
            err_object.error_value_type = typeof(return_value);
  
            error_count++;
  
          }
  
         } else if(typeof(return_value) === 'object') { 
  
           var match = false;
  
           for(let i = 0; i < allowed_values.values.length; i++) { //was allowed_values.values.length
             if(typeof(allowed_values.values[i]) === 'object') { //was allowed_values.values[i]
              if(JSON.stringify(allowed_values.values[i]).toLowerCase().trim() === JSON.stringify(return_value).toLowerCase().trim()) { //was allowed_values.values[i]
                match = true;
                break;
              }
             }
           }
  
           if(match === false) { 
  
              err_object.error_value = true;
  
              err_object.error_value_message = `The value returned is not within the allowed values.`;
  
              err_object.error_value_rvalue = return_value;
  
              err_object.error_value_type = typeof(return_value);
  
              error_count++;
  
           }
  
         } else { 
  
           console.log(`
            error: the only allowed types are number, BigInt, string, boolean, undefined and object
           `);
  
         }
  
      }

      var allowed_regex_unit_or_single = (
        typeof(tests[i].unit.regex_set) !== 'undefined' && tests[i].unit.regex_set.on === true ? 
        { on: true, test: 'unit', v: tests[i].unit.regex_set } : regex_set.on === true ? 
        { on: true, test: 'single', v: regex_set } : 
        { on: false, test: 'off' }
      );
    
      if(regex_set.on === true) { //was regex_set.on === true

        var regex_pass = false;
  
        for(let i = 0; i < regex_set.values.length; i++) {  //was regex_set.values.length
  
          var test_regex = test(regex_set.values[i], return_value); //was regex_set.values[i]
  
          if(test_regex !== true) { 
  
            if(regex_pass === false) { 
              err_object.error_regex = true;
              regex_pass = true; 
            };
  
            err_object[`error_regex_message-${i}`] = `The value returned does not pass`;
  
            err_object[`error_regex_regular_expression-${i}`] = regex_set.values[i]; //was regex_set.values[i]
  
            err_object[`error_regex_return_value-${i}`] = return_value;
  
            err_object[`error_regex_returned_rejex-${i}`] = test_regex;
  
            error_count++;
  
          }
  
        }
  
      }
  
      if(error_count > 0) { 

        err_object.function_name = function_name;

        err_object.directory = directory;

        err_object.file_name = file_name;

        err_object.index_of_error_set = typeof(tests[i].index_of_set) !== 'undefined' ? tests[i].index_of_set : 'index not found';

        error_sets.push(err_object);

      }
  
    }
         
  }
  
  /*
    @param {regular_expression}: regular expression being tested
    @param {return_value}: the value being tested against
  */
  
  function test(regular_expression, return_value) { 
    try {
      return new RegExp(regular_expression).test(return_value);
    } catch(err) { 
      return err.message;
    } 
  }
  
  /*
    export the error set
  */

  for(let i = 0; i < error_sets.length; i++) { 
    console.log(JSON.stringify(error_sets[i]) + '\n \n');
  }

  module.exports = error_sets;
  