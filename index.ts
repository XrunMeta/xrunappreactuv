import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { registerRootComponent } from 'expo';
import { loadEnvSync } from './src/utils/env';

loadEnvSync();

const loadingStyle = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

function Root() {
  const [AppComponent, setAppComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    import('./App').then((m) => setAppComponent(() => m.default));
  }, []);

  if (!AppComponent) {
    return React.createElement(
      View,
      { style: loadingStyle.root },
      React.createElement(ActivityIndicator, { size: 'large', color: '#007aff' })
    );
  }
  return React.createElement(AppComponent);
}

registerRootComponent(Root);
