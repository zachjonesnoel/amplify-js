import React, { Component } from 'react';
import withGoogle, { GoogleButton } from '../../../src/Auth/Provider/withGoogle';
import { SignInButton, Button } from '../../../src/AmplifyUI';
import { Auth } from 'aws-amplify';


describe('withGoogle test', () => {
    describe('render test', () => {
        test('render correctly', () => {
            const MockComp = class extends Component {
                render() {
                    return <div />;
                }
            }
            const Comp = withGoogle(MockComp);
            const wrapper = shallow(<Comp/>);
            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('signIn test', () => {
        test('happy case with connected response', async () => {
            const MockComp = class extends Component {
                render() {
                    return <div />;
                }
            }

            const state = {
                ga: {
                    signIn() {
                        return new Promise((res, rej) => {
                            res('googleUser');
                        });
                    }
                }
            }

            const Comp = withGoogle(MockComp);
            const wrapper = shallow(<Comp/>);
            const comp = wrapper.instance();

            const spyon = jest.spyOn(comp, 'federatedSignIn').mockImplementationOnce(() => { return; });
            comp.setState(state);

            await comp.signIn();

            expect(spyon).toBeCalledWith('googleUser');

            spyon.mockClear();
        });
    });

    describe.only('federatedSignIn', () => {
        test('happy case', async () => {
            const MockComp = class extends Component {
                render() {
                    return <div />;
                }
            }
            
            const googleUser = {
                getAuthResponse() {
                    return {
                        id_token: 'id_token',
                        expires_at: 0
                    }
                },
                getBasicProfile() {
                    return {
                        getEmail() { return 'email' },
                        getName() { return 'name' }
                    }
                }
            };

            const Comp = withGoogle(MockComp);
            const wrapper = shallow(<Comp/>);
            const comp = wrapper.instance();

            const spyon = jest.spyOn(Auth, 'federatedSignIn').mockImplementationOnce(() => { 
                return new Promise((res, rej) => {
                    res('credentials');
                });
            });
           
            await comp.federatedSignIn(googleUser);

            expect(spyon).toBeCalledWith('google', { expires_at: 0, id_token: 'id_token' }, { email: 'email', name: 'name' });

            spyon.mockClear();
        });

        test('happy case with onStateChange exists', async () => {
            const MockComp = class extends Component {
                render() {
                    return <div />;
                }
            }

            const mockFn = jest.fn();
            
            const googleUser = {
                getAuthResponse() {
                    return {
                        id_token: 'id_token',
                        expires_at: 0
                    }
                },
                getBasicProfile() {
                    return {
                        getEmail() { return 'email' },
                        getName() { return 'name' }
                    }
                }
            };

            const Comp = withGoogle(MockComp);
            const wrapper = shallow(<Comp/>);
            const comp = wrapper.instance();
            wrapper.setProps({
                onStateChange: mockFn
            });

            const spyon = jest.spyOn(Auth, 'federatedSignIn').mockImplementationOnce(() => { 
                return new Promise((res, rej) => {
                    res('credentials');
                });
            });
           
            await comp.federatedSignIn(googleUser);

            expect(spyon).toBeCalledWith('google', { expires_at: 0, id_token: 'id_token' }, { email: 'email', name: 'name' });
            expect(mockFn).toBeCalledWith('signedIn');

            spyon.mockClear();
        });
    });

    describe('fbAsyncInit test', () => {
        test('happy case', () => {
            const MockComp = class extends Component {
                render() {
                    return <div />;
                }
            }
            
            const mockFn = jest.fn().mockImplementationOnce((callback) => {
                callback('response')
            });
            const mockFn2 = jest.fn();
            window.FB = {
                getLoginStatus: mockFn,
                init: mockFn2
            };
            
            const Comp = withFacebook(MockComp);
            const wrapper = shallow(<Comp/>);
            const comp = wrapper.instance();

            comp.fbAsyncInit();

            expect(mockFn).toBeCalled();
            expect(mockFn2).toBeCalled();
        });
    });

    describe('initFB test', () => {
        test('happy case', () => {
            const MockComp = class extends Component {
                render() {
                    return <div />;
                }
            }

            window.FB = 'fb';
            
            const Comp = withFacebook(MockComp);
            const wrapper = shallow(<Comp/>);
            const comp = wrapper.instance();

            comp.initFB();
            expect(wrapper.state('fb')).toBe('fb');
        });
    });
});

describe('FacebookButton test', () => {
    describe('render test', () => {
        test('render correctly', () => {
            const wrapper = shallow(<FacebookButton/>);

            expect(wrapper).toMatchSnapshot();
        });
    });
});

