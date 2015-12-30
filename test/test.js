console.log("Beginning tests ------------------------------------------------------------------");
require('./server/apiSpec.js');
console.log("Starting DB Spec -----------------------------------------------------------------");

require('./server/dbSpec.js');

console.log("Starting Auth Spec ---------------------------------------------------------------");
require('./server/authSpec.js');
