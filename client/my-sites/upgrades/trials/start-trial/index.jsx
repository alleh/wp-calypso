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
	observe = require( 'lib/mixins/data-observe' ),
	planActions = require( 'state/sites/plans/actions' ),
	upgradesActions = require( 'lib/upgrades/actions' ),
	storeTransactions = require( 'lib/store-transactions' ),
	FreeTrialConfirmationBox = require( './free-trial-confirmation-box' );

module.exports = React.createClass( {
	displayName: 'StartTrial',

	mixins: [ observe( 'sites', 'products' ) ],

	getInitialState: function() {
		return { cart: {} };
	},

	componentWillMount: function() {
		upgradesActions.resetTransaction();
		// FIXME: The endpoint doesn't currently support transactions with no
		//   payment info, so for now we rely on the credits payment method for
		//   free carts.
		upgradesActions.setPayment( storeTransactions.fullCreditsPayment() );
	},

	componentDidMount: function() {
		if ( this.props.planName ) {
			this.updateCart();
		}
		console.log(this.props.transaction);
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

	_handleTransactionStep: function( { cart, selectedSite, transaction } ) {
		var step = transaction.step;

		this._displayNotices( cart, step );
		this._recordAnalytics( step );

		this._finishIfLastStep( cart, selectedSite, step );
	},

	trackPageView: function( props ) {
		props = props || this.props;

		analytics.tracks.recordEvent( 'calypso_start_trial_page_view', {
			planName: props.planName
		} );
	},

	updateCart: function() {
		if ( this.isLoading() ) {
			return;
		}

		const selectedSite = this.props.sites.getSelectedSite(),
			planSlug = this.props.plans.getSlugFromPath( this.props.planName ),
			planItem = cartItems.getItemForPlan( { product_slug: planSlug }, { isFreeTrial: true } );

		const emptyCart = cartValues.emptyCart( selectedSite.ID );
		const newCart = cartValues.fillInAllCartItemAttributes(
			cartItems.add( planItem )( emptyCart ),
			this.props.products.get()
		);

		this.setState( { cart: newCart } );
	},

	getCheckoutCompleteRedirectPath: function() {
		planActions.clearSitePlans();

		return `/plans/${ this.props.sites.getSelectedSite().slug }/thank-you`;
	},

	handleSubmit: function( event ) {
		event.preventDefault();

		analytics.ga.recordEvent( 'Upgrades', 'Submitted Free Trial Form' );

		upgradesActions.submitTransaction( {
			cart: this.state.cart,
			transaction: this.props.transaction
		} );
	},

	isLoading: function() {
		return ! this.props.products.hasLoadedFromServer();
	},

	render: function() {
		if ( this.isLoading() ) {
			return (
				<FreeTrialConfirmationBox.Placeholder />
			);
		}

		return (
			<FreeTrialConfirmationBox
				cart={ this.state.cart }
				selected={ true }
				onSubmit={ this.handleSubmit }
				transactionStep={ this.props.transaction.step } />
		);
	}
} );
