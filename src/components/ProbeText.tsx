

import React, { useEffect, useMemo } from 'react';
import { Text, TextProps } from 'react-native';
import { probeRegister, probeUnregister } from '../services/screenProbe';

type Props = TextProps & {

  probeScreen: string;

  probeKey: string;
  children?: React.ReactNode;
};

function flattenText(children: React.ReactNode): string {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string') return child;
      if (typeof child === 'number') return String(child);
      return '';
    })
    .join('');
}

export const ProbeText: React.FC<Props> = ({ probeScreen, probeKey, children, ...rest }) => {
  const text = useMemo(() => flattenText(children), [children]);

  useEffect(() => {
    probeRegister(probeScreen, probeKey, text);
    return () => probeUnregister(probeScreen, probeKey);
  }, [probeScreen, probeKey, text]);

  return <Text {...rest}>{children}</Text>;
};
