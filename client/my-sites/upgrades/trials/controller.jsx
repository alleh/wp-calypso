/**
 * External Dependencies
 */
import page from 'page';
import ReactDom from 'react-dom';
import React from 'react';
import analytics from 'analytics';
import sitesList from 'lib/sites-list';
import i18n from 'lib/mixins/i18n';
import titleActions from 'lib/screen-title/actions';
import cartValues from 'lib/cart-values';
import plansList from 'lib/plans-list';
import productsList from 'lib/products-list';

const sites = sitesList(),
	plans = plansList(),
	products = productsList();

export default {
	isEligible: function( context, next ) {
		// TODO: check if site is eligible to a free trial
		next();
	},

	startTrial: function( context ) {
		const StartTrial = require( './start-trial' ),
			TransactionData = require( 'components/data/transaction' );

		titleActions.setTitle( i18n.translate( 'Free Trial' ), {
			siteID: context.params.domain
		} );

		ReactDom.render(
			(
				<div className="main main-column" role="main">
					<div className="checkout start-trial">
						<TransactionData>
							<StartTrial
								planName={ context.params.plan_name || 'premium' }
								plans={ plans }
								products={ products }
								sites={ sites } />
						</TransactionData>
					</div>
				</div>
			),
			document.getElementById( 'primary' )
		);
	}
};
