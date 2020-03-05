import React, { useState} from 'react';
import { connect } from 'react-redux';

import Aux from '../Aux';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout = props => {
    // state = {
    //     showSideDrawer: false
    // }
    const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);
    const sideDrawerClosedHandler = () => {
        setSideDrawerIsVisible(false);
    }

    const sideDrawerToggleHandler = () => {
      setSideDrawerIsVisible(!sideDrawerIsVisible)
    }

        return (
            <Aux>
                <Toolbar 
                    isAuth= {props.isAuthentication}
                    drawerToggleClicked={sideDrawerToggleHandler} />
                <SideDrawer
                    isAuth= {props.isAuthentication}
                    open={sideDrawerIsVisible}
                    closed={sideDrawerClosedHandler} />
                <main className={classes.Content}>
                    {props.children}
                </main>
            </Aux>
        )
}

const mapStateToProps = state =>{
    return {
        isAuthentication: state.auth.token != null
    };
};

export default connect(mapStateToProps)(Layout);