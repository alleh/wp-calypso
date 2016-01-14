/**
 * External dependencies
 */
var React = require( 'react' );

export default function joinWidows( text ) {
	const words = text.split( ' ' );
	const length = words.length;
	const joinedWidows = [];

	words.forEach( ( word, index ) => {
		if ( index === length - 2 ) {
			// Add a non breaking space after the penultimate word
			joinedWidows.push( word )
			joinedWidows.push( <span>&nbsp;</span> )
		} else if ( index === length - 1 ) {
			// Don't add a space after the last word
			joinedWidows.push( word );
		} else {
			// Add a space after every other word
			joinedWidows.push( word + ' ' );
		}
	} );

	return joinedWidows;
};

