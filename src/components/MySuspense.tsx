import React from 'react';

interface Props {
    fallback: React.ReactNode
}
export default class MySuspense extends React.Component<Props> {
    state = {
        loading: false
    }
    static getDerivedStateFromError() {
        
    }
    componentDidCatch(error: any, info: any) {
        console.log('componentDidCatch', error, info);
        if (typeof error.then === 'function') {
            this.setState({ loading: true });
            
            let errorPromise = error.then;
            errorPromise(() => {
                this.setState({ loading: false });
            });
        }
    }
    render() {
        const { fallback, children } = this.props;
        const { loading } = this.state;
        return loading ? fallback : children
    }
}