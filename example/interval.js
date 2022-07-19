var live_changes = require('../lib/listen');

live_changes.set_working_set({ 
 index_a: { on: true, paths: ['../example/functions.js'] },
 index_b: { on: true, paths: ['../example/functions.js'] } 
});

try {
 live_changes.start_interval();
} catch(err) { 
 console.log(err.message)
} 
