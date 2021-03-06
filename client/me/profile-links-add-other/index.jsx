/**
 * External dependencies
 */
var React = require( 'react' ),
	LinkedStateMixin = require( 'react-addons-linked-state-mixin' );

/**
 * Internal dependencies
 */
var FormFieldset = require( 'components/forms/form-fieldset' ),
	FormTextInput = require( 'components/forms/form-text-input' ),
	FormButton = require( 'components/forms/form-button' ),
	eventRecorder = require( 'me/event-recorder' ),
	Notice = require( 'components/notice' );

module.exports = React.createClass( {

	displayName: 'ProfileLinksAddOther',

	mixins: [ LinkedStateMixin, eventRecorder ],

	getInitialState: function() {
		return {
			title: '',
			value: '',
			lastError: false
		};
	},

	// As the user types, the component state changes thanks to the LinkedStateMixin.
	// This function, called in render, validates their input on each state change
	// and is used to decide whether or not to enable the Add Site button
	getFormDisabled: function() {
		var trimmedValue = this.state.value.trim();

		if ( ! this.state.title.trim() || ! trimmedValue ) {
			return true;
		}

		// Disallow spaces in the trimmed URL value
		if ( -1 !== trimmedValue.indexOf( ' ' ) ) {
			return true;
		}

		// Minimalist domain regex.  Not meant to be bulletproof.
		// Requires at least one letter or number, then one dot, then
		// at least two letters
		if ( ! trimmedValue.match( /[a-zA-z0-9]+\.[a-zA-z]{2,}/ ) ) {
			return true;
		}

		// Scheme regex.  If a scheme is provided, it must be http or https
		if ( trimmedValue.match( /^.*:\/\// ) && ! trimmedValue.match( /^https?:\/\// ) ) {
			return true;
		}

		return false;
	},

	onSubmit: function( event ) {
		event.preventDefault();

		// When the form's submit button is disabled, the form's onSubmit does not
		// get fired for ENTER presses in input text fields, so this check
		// for getFormDisabled is merely here out of an abundance of caution
		if ( this.getFormDisabled() ) {
			return;
		}

		this.props.userProfileLinks.addProfileLinks(
			[ {
				title: this.state.title.trim(),
				value: this.state.value.trim()
			} ],
			this.onSubmitResponse
		);
	},

	onCancel: function( event ) {
		event.preventDefault();
		this.props.onCancel();
	},

	onSubmitResponse: function( error, data ) {
		if ( error ) {
			this.setState(
				{
					lastError: this.translate( 'Unable to add link right now. Please try again later.' )
				}
			);
		} else if ( data.duplicate ) {
			this.setState(
				{
					lastError: this.translate( 'That link is already in your profile links. No changes were made.' )
				}
			);
		} else if ( data.malformed ) {
			this.setState(
				{
					lastError: this.translate( 'An unexpected error occurred. Please try again later.' )
				}
			);
		} else {
			this.props.onSuccess();
		}
	},

	clearLastError: function() {
		this.setState( { lastError: false } );
	},

	possiblyRenderError: function() {
		if ( ! this.state.lastError ) {
			return null;
		}

		return (
			<Notice
				className="profile-links-add-other__error"
				isCompact
				status="is-error"
				onDismissClick={ this.clearLastError }
				text={ this.state.lastError }
			/>
		);
	},

	render: function() {
		return (
			<form className="profile-links-add-other" onSubmit={ this.onSubmit }>
				<p>
					{ this.translate( 'Please enter the URL and description of the site you want to add to your profile.' ) }
				</p>
				{ this.possiblyRenderError() }
				<FormFieldset>
					<FormTextInput
						className="profile-links-add-other__value"
						valueLink={ this.linkState( 'value' ) }
						placeholder={ this.translate( 'Enter a URL' ) }
						onFocus={ this.recordFocusEvent( 'Add Other Site URL Field' ) }
					/>
					<FormTextInput
						className="profile-links-add-other__title"
						valueLink={ this.linkState( 'title' ) }
						placeholder={ this.translate( 'Enter a description' ) }
						onFocus={ this.recordFocusEvent( 'Add Other Site Description Field' ) }
					/>
					<FormButton
						className="profile-links-add-other__add"
						disabled={ this.getFormDisabled() }
						onClick={ this.recordClickEvent( 'Save Other Site Button' ) }
					>
						{ this.translate( 'Add Site' ) }
					</FormButton>
					<FormButton
						className="profile-links-add-other__cancel"
						isPrimary={ false }
						onClick={ this.recordClickEvent( 'Cancel Other Site Button', this.onCancel ) }
					>
						{ this.translate( 'Cancel' ) }
					</FormButton>
				</FormFieldset>
			</form>
		);
	}
} );
