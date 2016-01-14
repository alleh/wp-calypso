/**
 * External dependencies
 */
var React = require( 'react' );

/**
 * External dependencies
 */
var joinWidows = require( 'lib/join-widows' );

module.exports = React.createClass( {
	displayName: 'StepHeader',

	render: function() {
		return (
			<header className="step-header">
				<h1 className="step-header__title">{ joinWidows( this.props.headerText ) }</h1>
				<p className="step-header__subtitle">{ joinWidows( this.props.subHeaderText ) }</p>
			</header>
		);
	}
} );
