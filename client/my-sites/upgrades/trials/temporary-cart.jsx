/**
 * External dependencies
 */
var isEmpty = require( 'lodash/lang/isEmpty' ),
	isEqual = require( 'lodash/lang/isEqual' ),
	clone = require( 'lodash/lang/clone' ),
	page = require( 'page' ),
	React = require( 'react' );

/**
 * Internal dependencies
 */
var analytics = require( 'analytics' ),
	cartValues = require( 'lib/cart-values' ),
	cartItems = cartValues.cartItems,
	observe = require( 'lib/mixins/data-observe' );

module.exports = React.createClass( {
	displayName: 'TemporaryCart',

	mixins: [ observe( 'sites', 'products' ) ],

	getInitialState: function() {
		return { cart: {} };
	},

	componentDidMount: function() {
		if ( this.props.planName ) {
			this.updateCart();
		}
	},

	componentWillReceiveProps: function( nextProps ) {
		if ( nextProps.planName !== this.props.planName ) {
			this.updateCart();
		}

		const prevStep = this.props.transaction.step,
			nextStep = nextProps.transaction.step;

		if ( ! isEqual( prevStep, nextStep ) ) {
			this._handleTransactionStep( nextProps );
		}
	},

	trackPageView: function( props ) {
		props = props || this.props;

		analytics.tracks.recordEvent( 'calypso_start_trial_page_view', {
			planName: props.planName
		} );
	},

	updateCart: function( ) {
		if ( this.isLoading() ) {
			return;
		}

		const planSlug = this.props.plans.getSlugFromPath( this.props.planName ),
			planItem = cartItems.getItemForPlan( { product_slug: planSlug }, { isFreeTrial: true } );

		this.addItem( planItem );
	},

	addItem: function( item ) {
		const selectedSite = this.props.sites.getSelectedSite(),
			emptyCart = cartValues.emptyCart( selectedSite.ID );

		const newCart = cartValues.fillInAllCartItemAttributes(
			cartItems.add( item )( emptyCart ),
			this.props.products.get()
		);

		this.setState( { cart: newCart } );
	},

	render: function() {
		return (
			<div>
				{ this.props.children }
			</div>
		);
	}
} );
