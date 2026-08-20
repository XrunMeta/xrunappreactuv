

const React = require('react');
const { View } = require('react-native');

function Inert(props) {

  console.log('[E2E-STUB] inert component rendered');
  return React.createElement(View, { testID: 'e2e-inert-stub', ...props });
}

const handler = {
  get(target, prop) {
    if (prop in target) return target[prop];

    return Inert;
  },
};

module.exports = new Proxy(
  { __esModule: true, default: Inert, Marker: Inert, Polyline: Inert, Circle: Inert },
  handler
);
