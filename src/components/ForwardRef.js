import React from 'react';

const ForwardRef = Component => (props, ref) => {
	return <Component {...props} forwardedRef={ref} />;
};

export default ForwardRef;
