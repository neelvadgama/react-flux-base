import React from 'react';

import SiteNavBar from '../components/core/SiteNavBar';

export default React.createClass({

    displayName: 'Layout',

    render() {
        return (
            <div>
                <SiteNavBar />
                <div className='container'>
                    {this.props.children}
                </div>
            </div>
        );
    }

});