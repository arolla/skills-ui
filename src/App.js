import React from 'react';

import { BrowserRouter as Router, Route } from "react-router-dom";
import Connection from './Msal/Connection';

function App() {
    return (
        <Router>
            <div>
                <Route exact path="/" component={Connection} />
            </div>
        </Router>
    );
}

export default App;
