import React, {useState, useEffect}from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css';

import * as actions from '../../store/actions/index';
import {updateObject ,checkValidity} from '../../shared/utility';

const Auth = props => {
        const [formAuth, setFormAuth] = useState({
             email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            },
        })
        const [isSignup, setIsSignup] = useState(true);
    const {buildingBurger, authRedirectPath, onSetAuthRedirectPath} = props;
    useEffect (() => {
         if (!buildingBurger && authRedirectPath !== '/') {
            onSetAuthRedirectPath();
        }
    }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

    const inputChangedHandler = (event, controlsName) => {
        const updatedControls = updateObject(formAuth,{
            [controlsName]:updateObject(formAuth[controlsName],{
                value: event.target.value,
                valid: checkValidity(event.target.value, formAuth[controlsName].validation),
                touched:true
            })
        });
        setFormAuth(updatedControls);
    }

    const submitHandler = (event) =>{
        event.preventDefault();
        props.onAuth(formAuth.email.value, formAuth.password.value, formAuth.isSignup)
    }
    const switchAuthModeHandler = () => {
        setIsSignup(!isSignup);
    }
        const formElementsArray = [];
        for (let key in formAuth) {
            formElementsArray.push({
                id: key,
                config: formAuth[key]
            });
        }

        let form = formElementsArray.map(formElement =>(
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(event) => inputChangedHandler(event, formElement.id)} 
            />
        ));
        if(props.loading){
            form = <Spinner/>
        }
        let errorMessage = null;
        if(props.error){
            errorMessage = (
                <p>{props.error.message}</p>
            );
        }
        let authRedirect = null;
        if (props.isAuthenticated) {
            authRedirect = <Redirect to={props.authRedirectPath}/>
        }

        return(
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={submitHandler}>
                    <h1>{isSignup ? 'Sign Up' : 'Sign In'}</h1>
                    {form}
                    <Button btnType="Success">{isSignup ? 'Sign Up' : 'Sign In'}</Button>
                </form>
                <Button 
                    clicked={switchAuthModeHandler}
                    btnType="Danger">Switch To {!isSignup ? 'Sign Up' : 'Sign In'}</Button>
            </div>
        );
};


const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: ( email, password, isSignup ) => dispatch( actions.auth( email, password, isSignup ) ),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);