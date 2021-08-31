import React from 'react';

interface Props {
    fallback: React.ReactNode
}
export default class ErrorBoundary extends React.Component<Props> {
    state = {
        hasError: false,
        errorMsg: null
    }
    static getDerivedStateFromError(error:any) {
        return {
            hasError: true,
            errorMsg: error
        }
    }
    render() {
        const { fallback, children } = this.props;
        const { hasError, errorMsg } = this.state;
        if (hasError) {
            return fallback;
        }
        return children;
    }
}