const express = require( 'express' );
const jsforce = require( 'jsforce' );
const dotenv = require( 'dotenv' );

dotenv.config();

const app = express();
const PORT = 3001;

app.listen( PORT, () => {
    console.log( `Server is up and running at http://localhost:${PORT}` );
} );

// NOTE:  PWD needs to be appended with the security key
const SF_URL = process.env.SF_URL;
const SF_USERNAME = process.env.SF_USERNAME;
const SF_PWD = process.env.SF_PWD;

console.log( SF_URL );
console.log( SF_USERNAME );
console.log( SF_PWD );

const conn = new jsforce.Connection( {
    loginUrl: SF_URL
} );

conn.login( SF_USERNAME, SF_PWD, ( error, userInfo ) => {
    if( error ) {
        console.error( error );
        return;
    }
    console.log( userInfo );
    // {id: '005DD00000DIC9qYA2', organizationId: '00DDD000000sC8G2AK', 
    // url: 'https://test.salesforce.com/id/00DDD000000sC8G2AK/005DD00000DIC9qYA2'}
} );

app.get( '/', ( req, res ) => {
    conn.query( "SELECT Id, FirstName, LastName FROM Contact LIMIT 1"
                , ( error, result ) => {
        if( error ) {
            console.error( error );
            return;
        }

        console.log( result );
        // { totalSize:,"done":true,records:[...]}

        res.send( result.records );
        // [{"attributes":{"type":"Contact","url":"/services/data/v42.0/sobjects/Contact/003DN000007mE3wYAQ"}
        //,"Id":"003DN000007mE3wYAQ","FirstName":"Joe","LastName":"Sixpack"}]
    } );
} );