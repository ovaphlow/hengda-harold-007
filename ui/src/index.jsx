import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';
import 'bulma/css/bulma.css';

import './style.css';

const Navbar = React.lazy(() => import('./Navbar'));
const SideMenu = React.lazy(() => import('./SideMenu'));
const Footer = React.lazy(() => import('./Footer'));
const Filter = React.lazy(() => import('./Filter'));
const Detail = React.lazy(() => import('./Detail'));

function Index() {
  return (
    <React.Suspense fallback={<h1>载入中...</h1>}>
      <HashRouter>
        <section className="wrap">
          <header>
            <Navbar />
          </header>

          <main>
            <Switch>
              <Route exact path="/">
                <Filter />
              </Route>

              <Route exact path="/新增">
                <Detail />
              </Route>

              <Route path="/:id">
                <Detail />
              </Route>
            </Switch>
          </main>

          <Footer />
        </section>
      </HashRouter>
    </React.Suspense>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
