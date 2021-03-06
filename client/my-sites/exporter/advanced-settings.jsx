/**
 * External dependencies
 */
import React, { PropTypes } from 'react';

/**
 * Internal dependencies
 */
import OptionFieldset from 'my-sites/exporter/option-fieldset';
import SpinnerButton from './spinner-button';

/**
 * Displays additional options for customising an export
 *
 * Allows the user to select whether Pages, Posts and Feedback are
 * exported. Posts and Pages can also be filtered by Authors, Statuses,
 * and Date.
 */
export default React.createClass( {
	displayName: 'AdvancedSettings',

	propTypes: {
		// Event handlers
		onSelectPostType: PropTypes.func.isRequired,
		onClickExport: PropTypes.func.isRequired,

		// Data
		postType: PropTypes.string
	},

	render() {
		const legends = {
			posts: this.translate( 'Posts' ),
			pages: this.translate( 'Pages' ),
			feedback: this.translate( 'Feedback' )
		};

		const menus = {
			posts: [
				{ value: 0, options: [ this.translate( 'All Authors' ) ] },
				{ value: 0, options: [ this.translate( 'All Statuses' ) ] },
				{ value: 0, options: [ this.translate( 'Starting Date…' ) ] },
				{ value: 0, options: [ this.translate( 'Ending Date…' ) ] },
				{ value: 0, options: [ this.translate( 'All Categories' ) ] }
			],
			pages: [
				{ value: 0, options: [ this.translate( 'All Authors' ) ] },
				{ value: 0, options: [ this.translate( 'All Statuses' ) ] },
				{ value: 0, options: [ this.translate( 'Starting Date…' ) ] },
				{ value: 0, options: [ this.translate( 'Ending Date…' ) ] }
			],
			feedback: []
		};

		const buildOptionProps = key => ( {
			legend: legends[ key ],
			isEnabled: this.props.postType === key,
			menus: menus[ key ],
			onSelect: () => this.props.onSelectPostType( key )
		} );

		return (
			<div className="exporter__advanced-settings">
				<h1 className="exporter__advanced-settings-title">
					{ this.translate( 'Select specific content to export' ) }
				</h1>
				<p>
					{ this.translate(
						'Use the options below to select a specific content ' +
						'type to download. You can select Posts, Pages, ' +
						'or Feedback, and filter by the listed parameters. ' +
						'After making your selection you can download your ' +
						'content in an .xml file.' ) }
				</p>
				<div className="exporter__advanced-settings-row">
					<OptionFieldset { ...buildOptionProps( 'posts' ) } />
					<OptionFieldset { ...buildOptionProps( 'pages' ) } />
					<OptionFieldset { ...buildOptionProps( 'feedback' ) }
						description={ this.translate( 'Survey results etc.' ) }
					/>
				</div>
				<SpinnerButton
					className="exporter__export-button"
					disabled={ !this.props.postType }
					loading={ this.props.shouldShowProgress }
					isPrimary={ true }
					onClick={ this.props.onClickExport }
					text={ this.translate( 'Export Selected Content' ) }
					loadingText={ this.translate( 'Exporting…' ) } />
			</div>
		);
	}
} );
