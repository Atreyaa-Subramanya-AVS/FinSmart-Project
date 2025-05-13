require("dotenv").config({ path: require('path').resolve(__dirname, '.env') });

console.log(process.env); // to see everything loaded

console.log(process.env.PORT); // to see just the port  