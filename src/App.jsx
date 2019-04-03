import React, { Fragment } from 'react';
import { StripeProvider } from 'react-stripe-elements';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import reducers from './modules';
import initAnalytics from './services/analytics/init';
import logAnalytics from './services/analytics/logAnalytics';
import CompanyPage from './components/company/Page';
import MyRouter from './components/Router';
import Error from './services/Errors';

const ScrollToTop = () => {
  window.scrollTo(0, 0);
  throw new Error('Error handling exercice');
  return null;
};

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

const App = () => (
  <Error>
    <StripeProvider apiKey={process.env.REACT_APP_STRIPE_API_KEY}>
      <Provider store={store}>
        <Router>
          <Fragment>
            <Route component={ScrollToTop} />
            <Switch>
              <Redirect path="/perus" to="/parrains/perus" />
              <Route path="/parrains/:namespace" component={logAnalytics(CompanyPage)} />
              <Route component={logAnalytics(MyRouter)} />
            </Switch>
          </Fragment>
        </Router>
      </Provider>
    </StripeProvider>
  </Error>
);

export default initAnalytics(App);
